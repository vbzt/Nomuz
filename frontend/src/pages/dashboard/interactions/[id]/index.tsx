import SideBar from "@/components/SideBar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { useEffect, useRef, useState } from "react"
import { getChat } from "@/lib/api/chat"
import { useAuth } from "../../../../../context/AuthContext"
import { useParams } from "next/navigation"
import { toast } from "sonner"
import { TbArrowLeft, TbMenu, TbPaperclip, TbSearch, TbSend2 } from "react-icons/tb"
import SidebarActions from "@/components/SidebarActions"
import { useRouter } from "next/router"
import { io, Socket } from "socket.io-client"

interface Message {
  id: string;
  sender_id: string;
  content: string;
  createdAt: string;
  sender?: { id: string; name: string };
}

interface ChatUser { 
  id: string,
  user_name: string,
  user: { 
    id: string,
    name: string,
    profilePicture: string,
  }
}

export default function Interactions() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])  
  const params = useParams<{ id: string }>();
  const router = useRouter()
  const socketRef = useRef<Socket | null>(null);
  
  const [ sender, setSender ] = useState<ChatUser>()
  const [ receiver, setReceiver ] = useState<ChatUser>()

  async function fetchChats() {
    try {
      const chat = await getChat(params.id)
      const users: ChatUser[]  = chat.data.users
      console.log(users[0].user.id)
      const sender = users.find(u => u.user.id === user?.id)
      const receiver = users.find(u => u.user.id !== user?.id)
      setSender(sender) 
      setReceiver(receiver)
      setMessages(chat.data.messages)
      console.log(chat.data.messages)
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  const connectSocket = () => { 
    if (!user?.id || !params.id) return
    const socket = io('http://localhost:3005', { withCredentials: true, transports: ['websocket'] })
    socketRef.current = socket

    socket.emit('joinChat', params.id)


  }

  const setupSocketListeners = (socket: Socket) => { }

  useEffect(() => {
    if (params?.id) fetchChats();
    
  }, [params?.id])
  
  return (
    <SidebarProvider>
      <main className="flex items-start justify-center flex-row w-full">
        <SideBar />
        <div className="p-[10px] border-r border-[#15151e] min-h-full">
            <SidebarActions />
        </div>
        <div className="flex items-start justify-center flex-col p-[20px] w-full">
          <main className="py-[15px] min-h-[calc(100vh-65px)] flex flex-col items-center w-full">
            <div className="flex items-center justify-between flex-col max-w-[1000px] w-[90%] h-full flex-1">

        <div className='w-full border border-[#15151e] flex items-center justify-between rounded-[8px] p-2'>
          <div className='flex flex-row items-center justify-center'>
            <img src = { receiver?.user.profilePicture } width={40} height={40} alt="Image user" className="h-[40px] w-[40px] rounded-[5px] mr-[10px]" />
            <h1>{receiver?.user_name}</h1>
          </div>
          <div>
            <button onClick={() => router.push("/dashboard/interactions") } className='h-[40px] px-[11px] py-[10px] bg-[#0c0c13] border border-[#15151e] rounded-[10px] hover:bg-[#ffffff0a] transition duration-[0.2s] cursor-pointer ease-in-out'>
              <TbArrowLeft />
            </button>
            <button className='ml-[10px] h-[40px] px-[11px] py-[10px] bg-[#0c0c13] border border-[#15151e] rounded-[10px] hover:bg-[#ffffff0a] transition duration-[0.2s] cursor-pointer ease-in-out'>
              <TbSearch />
            </button>
            <button className='ml-[10px] h-[40px] px-[11px] py-[10px] bg-[#0c0c13] border border-[#15151e] rounded-[10px] hover:bg-[#ffffff0a] transition duration-[0.2s] cursor-pointer ease-in-out'>
              <TbMenu />
            </button>
          </div>
        </div>

              <div className="border bg-[#0c0c13] rounded-xl p-4 h-[400px] w-full overflow-y-auto mb-4 flex flex-col gap-2">
                {messages.length === 0 && (
                  <p className="text-gray-500">Nenhuma mensagem ainda.</p>
                )}
                {messages.map((msg) => {
                  const isSender = msg.sender_id === user?.id
                  return (
                    <div key={msg.id} className={`flex ${isSender ? 'justify-end' : 'justify-start'} mb-2`}>
                      <p
                        className={`max-w-[70%] p-2 rounded-lg ${
                          isSender
                            ? 'bg-blue-500 text-white self-end' 
                            : 'bg-gray-700 text-white self-start' 
                        }`}
                      >
                        {msg.content}
                      </p>
                    </div>
                  )
                })}
              </div>

              <footer className="w-full flex items-center justify-center gap-[10px]">
                <input
                  placeholder="Digite sua mensagem..."
                  className="text-[15px] flex-1 h-[40px] w-full bg-[#15151e] transition duration-[0.2s] ease-in-out border border-[#272727] rounded-[10px] px-[16px] py-[8px] text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#36577d]"
                />
                <button className="h-[40px] px-[11px] py-[10px] bg-[#0c0c13] border border-[#15151e] rounded-[10px] hover:bg-[#ffffff0a] transition duration-[0.2s] cursor-pointer ease-in-out">
                <TbPaperclip />
                </button>
                <button className="h-[40px] bg-[#36577d] hover:bg-[#254161] transition duration-[0.2s] cursor-pointer ease-in-out text-white px-[11px] py-[10px] rounded-[10px] font-semibold">
                 <TbSend2 />
                </button>
              </footer>
            </div>
          </main>
        </div>
      </main>
    </SidebarProvider>
  )
}
