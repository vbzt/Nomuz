import SideBar from "@/components/SideBar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useEffect, useRef, useState } from "react";
import { getChat, sendFiles } from "@/lib/api/chat";
import { useAuth } from "../../../../../context/AuthContext";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { TbArrowLeft, TbMenu, TbPaperclip, TbSearch, TbSend2 } from "react-icons/tb";
import SidebarActions from "@/components/SidebarActions";
import { useRouter } from "next/router";
import { io, Socket } from "socket.io-client";

interface FileMeta {
  id: string;
  url: string;
  name: string;
  type: string;
  size?: number;
}

interface Message {
  id: string;
  sender_id: string;
  content: string;
  createdAt: string;
  sender?: { id: string; name: string };
  files?: FileMeta[];
}

interface ChatUser {
  id: string;
  user_name: string;
  user: {
    id: string;
    name: string;
    profilePicture: string;
  };
}

interface ReadReceipt {
  [messageId: string]: "Sent" | "Received" | "Read";
}

type SelectedFile = {
  file: File;
  preview?: string;
  kind: "image" | "video" | "other";
  id: string;
};

export default function Interactions() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesRef = useRef<Message[]>([]);
  const [sender, setSender] = useState<ChatUser>();
  const [receiver, setReceiver] = useState<ChatUser>();
  const [readReceipts, setReadReceipts] = useState<ReadReceipt>({});
  const [newMessage, setNewMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function fetchChats() {
    try {
      const chat = await getChat(params.id);
      const users: ChatUser[] = chat.data.users;
      const sender = users.find((u) => u.user.id === user?.id);
      const receiver = users.find((u) => u.user.id !== user?.id);
      console.log(chat)
      setSender(sender);
      setReceiver(receiver);
      setMessages(chat.data.messages);
      messagesRef.current = chat.data.messages;
    } catch (err: any) {
      toast.error(err.message || "Erro ao carregar conversa");
    }
  }

  const connectSocket = () => {
    if (!user?.id || !params?.id) return;
    const socket = io("http://localhost:3005", {
      withCredentials: true,
      transports: ["websocket"],
    });
    socketRef.current = socket;
    socket.emit("joinChat", params.id);
    setupSocketListeners(socket);
    return () => {
      socket.emit("leaveChat", params.id)
      socket.disconnect();
    };
  };

  const setupSocketListeners = (socket: Socket) => {
    socket.on("message", (res: { success: boolean; message: string; data: Message }) => {
      if (!res.success || !res.data) return;
      const msg = res.data;
      setMessages((prev) => {
        const newMessages = [...prev, msg];
        messagesRef.current = newMessages;
        return newMessages;
      });
      if (msg.sender_id === user?.id) setReadReceipts((prev) => ({ ...prev, [msg.id]: "Sent" }));
    });

    socket.on("message.read", ({ messageId }: { messageId: string; userId: string }) => {
      const msg = messagesRef.current.find((m) => m.id === messageId);
      if (msg?.sender_id === user?.id) {
        setReadReceipts((prev) => ({ ...prev, [messageId]: "Read" }));
      }
    });
  };

  function getVideoThumbnail(file: File, seekTo = 1.0): Promise<string> {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const video = document.createElement("video");
      video.src = url
      video.crossOrigin = "anonymous";
      video.addEventListener("loadeddata", () => {
        const t = Math.min(seekTo, Math.max(0, video.duration / 2))
        video.currentTime = t;
      });
      video.addEventListener("seeked", () => {
        try {
          const canvas = document.createElement("canvas")
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
          const ctx = canvas.getContext("2d")
          if (!ctx) throw new Error("Canvas not supported");
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => {
            if (!blob) {
              URL.revokeObjectURL(url);
              reject(new Error("Não foi possível gerar thumbnail"));
              return;
            }
            const thumbUrl = URL.createObjectURL(blob);
            URL.revokeObjectURL(url);
            resolve(thumbUrl);
          }, "image/jpeg", 0.75);
        } catch (err) {
          URL.revokeObjectURL(url);
          reject(err);
        }
      });
      video.addEventListener("error", (e) => {
        URL.revokeObjectURL(url);
        reject(e);
      });
    });
  }

  const onFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const arr = Array.from(files);
    const mapped: SelectedFile[] = [];
    for (const f of arr) {
      const mime = f.type || "";
      const kind = mime.startsWith("image/") ? "image" : mime.startsWith("video/") ? "video" : "other";
      const localId = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      if (kind === "image") {
        const preview = URL.createObjectURL(f);
        mapped.push({ file: f, preview, kind, id: localId });
      } else if (kind === "video") {
        try {
          const preview = await getVideoThumbnail(f, 1.0);
          mapped.push({ file: f, preview, kind, id: localId });
        } catch {
          const preview = URL.createObjectURL(f);
          mapped.push({ file: f, preview, kind, id: localId });
        }
      } else {
        mapped.push({ file: f, preview: undefined, kind, id: localId });
      }
    }
    setSelectedFiles((prev) => [...prev, ...mapped]);
  };

  const removeSelectedFile = (id: string) => {
    setSelectedFiles((prev) => {
      prev.forEach((p) => {
        if (p.id === id && p.preview) {
          try {
            URL.revokeObjectURL(p.preview);
          } catch { }
        }
      });
      return prev.filter((p) => p.id !== id);
    });
  };

  const sendMessage = async () => {
    if (!socketRef.current || !params?.id || !user?.id) return;
    if (!newMessage.trim() && selectedFiles.length === 0) return;
    let fileMeta: FileMeta[] | undefined = undefined;
    if (selectedFiles.length > 0) {
      const formData = new FormData();
      formData.append("content", newMessage || "");
      selectedFiles.forEach((s) => formData.append("files", s.file));
      try {
        const data = await sendFiles(params.id, formData);
        if (!data?.success) {
          toast.error("Erro ao enviar arquivo(s)");
          return;
        }
        fileMeta = data.data.files;
      } catch (err: any) {
        toast.error("Erro no upload");
        return;
      }
    }
    socketRef.current.emit(
      "sendMessage",
      {
        id: params.id,
        content: newMessage || "",
        files: fileMeta,
      },
      (res: { success: boolean; message: string; data: Message }) => {
        if (res.success && res.data) {
          const msg = res.data;
          setMessages((prev) => {
            const newMessages = [...prev, msg];
            messagesRef.current = newMessages;
            return newMessages;
          });
          setReadReceipts((prev) => ({ ...prev, [msg.id]: "Sent" }));
        } else {
          toast.error(res?.message || "Erro ao enviar mensagem");
        }
      }
    );
    setNewMessage("");
    selectedFiles.forEach((s) => s.preview && URL.revokeObjectURL(s.preview));
    setSelectedFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  useEffect(() => {
    if (params?.id) fetchChats();
  }, [params?.id]);

  useEffect(() => {
    if (params?.id) connectSocket();
  }, [params?.id, user?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    if (!params?.id || !user?.id || !socketRef.current) return;
    const unreadMessages = messagesRef.current.filter((msg) => msg.sender_id !== user.id && !readReceipts[msg.id]);
    unreadMessages.forEach((msg) => {
      socketRef.current!.emit("readMessage", { chatId: params?.id, messageId: msg.id });
    });
  }, [messages, params?.id, user?.id]);

  return (
    <SidebarProvider>
      <main className="flex items-start justify-center flex-row w-full">
        <SideBar />
        <div className="p-[10px] border-r border-[#15151e] min-h-full">
          <SidebarActions />
        </div>
        <div className="flex items-start justify-center flex-col p-[20px] w-full h-[100vh]">
          <main className="flex flex-col items-center w-full h-full">
            <div className="flex items-center justify-between flex-col w-full h-full flex-1">
              <div className="w-full border border-[#15151e] mb-4 flex items-center justify-between rounded-[8px] p-2">
                <div className="flex flex-row items-center justify-center">
                  <img src={receiver?.user.profilePicture} width={40} height={40} alt="Image user" className="h-[40px] w-[40px] rounded-[5px] mr-[10px]" />
                  <h1>{receiver?.user_name}</h1>
                </div>
                <div className="flex items-center justify-center flex-row">
                  <button onClick={() => router.push("/dashboard/interactions")} className="hidden md:block h-[40px] px-[11px] py-[10px] bg-[#0c0c13] border border-[#15151e] rounded-[10px] hover:bg-[#ffffff0a] transition duration-[0.2s] cursor-pointer ease-in-out">
                    <TbArrowLeft />
                  </button>
                  <button className="hidden md:block ml-[10px] h-[40px] px-[11px] py-[10px] bg-[#0c0c13] border border-[#15151e] rounded-[10px] hover:bg-[#ffffff0a] transition duration-[0.2s] cursor-pointer ease-in-out">
                    <TbSearch />
                  </button>
                  <button className="flex md:hidden ml-[10px] h-[40px] px-[11px] py-[10px] bg-[#0c0c13] border border-[#15151e] rounded-[10px] hover:bg-[#ffffff0a] transition duration-[0.2s] cursor-pointer ease-in-out">
                    <TbMenu />
                  </button>
                </div>
              </div>
              <div className="border rounded-xl p-4 h-full w-full overflow-y-auto mb-4 flex flex-col gap-2">
                {messages.length === 0 && <p className="text-gray-500">Nenhuma mensagem ainda.</p>}
                {messages.map((msg) => {
                  const isSender = msg.sender_id === user?.id;
                  const status = isSender ? readReceipts[msg.id] ?? "Sent" : undefined;
                  return (
                    <div key={msg.id} className={`flex ${isSender ? "justify-end" : "justify-start"} mb-2`}>
                      <div className={`max-w-[70%] px-3 py-2 rounded-lg ${isSender ? "bg-[#36577d] text-white" : "bg-[#36577d19] text-gray-200"}`}>
                        {!isSender && (
                          <div className="text-sm mb-1">
                            <strong className="text-[#4677af]">{receiver?.user_name}</strong>
                          </div>
                        )}
                        {msg.content && <div>{msg.content}</div>}
                        {msg.files?.map((file) => (
                          <div key={file.id} className="mt-2">
                            {file.type && file.type.startsWith("image") ? (
                              <img src={file.url} alt={file.name} className="max-w-[260px] rounded-lg" />
                            ) : file.type && file.type.startsWith("video") ? (
                              <video controls className="max-w-[320px] rounded-lg" src={file.url} />
                            ) : (
                              <a href={file.url} target="_blank" rel="noopener noreferrer" download className="text-blue-400 underline">
                                {file.name || "Download"}
                              </a>
                            )}
                          </div>
                        ))}
                        {status && <div className="text-xs text-gray-400 mt-1 text-right">{status}</div>}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef}></div>
              </div>
              {selectedFiles.length > 0 && (
                <div className="w-full mb-2 flex gap-2">
                  {selectedFiles.map((s) => (
                    <div key={s.id} className="relative">
                      {s.kind === "image" && s.preview && <img src={s.preview} alt={s.file.name} className="w-20 h-20 object-cover rounded-md" />}
                      {s.kind === "video" && s.preview && (
                        <div className="w-20 h-20 rounded-md overflow-hidden relative">
                          <img src={s.preview} alt={s.file.name} className="w-full h-full object-cover" />
                          <div className="absolute bottom-0 right-0 bg-black/40 text-white text-[10px] px-1 rounded m-1">video</div>
                        </div>
                      )}
                      {s.kind === "other" && (
                        <div className="w-20 h-20 rounded-md bg-[#15151e] flex items-center justify-center text-sm p-2">
                          <div>
                            <div className="font-medium">{s.file.name.split(".").pop()}</div>
                            <div className="text-xs">{s.file.name.length > 10 ? `${s.file.name.slice(0, 10)}...` : s.file.name}</div>
                          </div>
                        </div>
                      )}
                      <button onClick={() => removeSelectedFile(s.id)} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">×</button>
                    </div>
                  ))}
                </div>
              )}
              <footer className="w-full flex items-center justify-center gap-[10px]">
                <input
                  placeholder="Digite sua mensagem..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  className="text-[15px] flex-1 h-[40px] w-full bg-[#15151e] transition duration-[0.2s] ease-in-out border border-[#272727] rounded-[10px] px-[16px] py-[8px] text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#36577d]"
                />
                <input ref={fileInputRef} type="file" id="fileInput" className="hidden" multiple onChange={(e) => onFilesSelected(e.target.files)} />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-[40px] px-[11px] py-[10px] bg-[#0c0c13] border border-[#15151e] rounded-[10px] hover:bg-[#ffffff0a] transition duration-[0.2s] cursor-pointer ease-in-out"
                >
                  <TbPaperclip />
                </button>
                <button onClick={sendMessage} className="h-[40px] bg-[#36577d] hover:bg-[#254161] transition duration-[0.2s] cursor-pointer ease-in-out text-white px-[11px] py-[10px] rounded-[10px] font-semibold">
                  <TbSend2 />
                </button>
              </footer>
            </div>
          </main>
        </div>
      </main>
    </SidebarProvider>
  );
}
