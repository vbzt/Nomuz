import SideBar from "@/components/SideBar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useEffect, useRef, useState } from "react";
import { getChat } from "@/lib/api/chat";
import { useAuth } from "../../../../../context/AuthContext";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { TbArrowLeft, TbMenu, TbPaperclip, TbSearch, TbSend2 } from "react-icons/tb";
import SidebarActions from "@/components/SidebarActions";
import { useRouter } from "next/router";
import { io, Socket } from "socket.io-client";

interface Message {
  id: string
  sender_id: string
  content: string
  createdAt: string
  sender?: { id: string; name: string }
}

interface ChatUser { 
  id: string
  user_name: string
  user: { 
    id: string
    name: string
    profilePicture: string
  }
}

interface ReadReceipt {
  [messageId: string]: 'Sent' | 'Received' | 'Read'
}

export default function Interactions() {
  const { user } = useAuth()  
  const [ messages, setMessages ] = useState<Message[]>([])  
  const messagesRef = useRef<Message[]>([])
  const [ sender, setSender ] = useState<ChatUser>()
  const [ receiver, setReceiver ] = useState<ChatUser>()
  const [ readReceipts, setReadReceipts ] = useState<ReadReceipt>({})
  const [ newMessage, setNewMessage ] = useState('')
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const socketRef = useRef<Socket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  async function fetchChats() {
    try {
      const chat = await getChat(params.id)
      const users: ChatUser[]  = chat.data.users
      const sender = users.find(u => u.user.id === user?.id)
      const receiver = users.find(u => u.user.id !== user?.id)
      setSender(sender) 
      setReceiver(receiver)
      setMessages(chat.data.messages)
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  const connectSocket = () => { 
    if (!user?.id || !params.id) return
    const socket = io('http://localhost:3005', { withCredentials: true, transports: ['websocket'] })
    socketRef.current = socket
    socket.emit('joinChat', params.id)
    setupSocketListeners(socket)
    return () => {
      socket.emit('leaveChat', params.id)
      socket.disconnect()
    }
  }

  const setupSocketListeners = (socket: Socket) => {
     socket.on('message', ( res: { success: boolean, message: string, data: Message}) => { 
        if(!res.success || !res.data) return
        const msg = res.data
        setMessages( prev => {
          const newMessages = [...prev, msg]
          messagesRef.current = newMessages
          return newMessages
        })
        if(msg.sender_id === user?.id) setReadReceipts(prev => ({ ...prev, [msg.id]: 'Sent'}))
     })

     socket.on('message.read', ({ messageId, userId }: { messageId: string; userId: string }) => {
      const msg = messagesRef.current.find(m => m.id === messageId)
      if(msg?.sender_id === user?.id) {
        setReadReceipts(prev => ({ ...prev, [messageId]: 'Read'}))
      }
     })
  }

  const sendMessage = () => { 
    if (!newMessage.trim() || !params?.id || !socketRef.current || !user?.id) return
    socketRef.current.emit(
      'sendMessage',
      { id: params?.id , content: newMessage },
      (res: { success: boolean; message: string; data: Message }) => {
        if(res.success && res.data){
          const msg = res.data
          setMessages(prev => {
            const newMessages = [...prev, msg]
            messagesRef.current = newMessages
            return newMessages
          })
          setReadReceipts(prev => ({ ...prev, [msg.id]: 'Sent' }))
        }
      }
    )
    setNewMessage('')
  }

  useEffect(() => {
    if (params?.id) fetchChats()
  }, [params?.id])

  useEffect(() => {
    if (params?.id)  connectSocket()
  }, [params?.id, user?.id])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    if (!params?.id || !user?.id || !socketRef.current) return
    const unreadMessages = messagesRef.current.filter(msg => msg.sender_id !== user.id && !readReceipts[msg.id])
    unreadMessages.forEach(msg => {
      socketRef.current!.emit('readMessage', { chatId: params?.id, messageId: msg.id })
    })
  }, [messages, params?.id, user?.id])

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
                  <img src={receiver?.user.profilePicture} width={40} height={40} alt="Image user" className="h-[40px] w-[40px] rounded-[5px] mr-[10px]" />
                  <h1>{receiver?.user_name}</h1>
                </div>
                <div>
                  <button onClick={() => router.push("/dashboard/interactions")} className='h-[40px] px-[11px] py-[10px] bg-[#0c0c13] border border-[#15151e] rounded-[10px] hover:bg-[#ffffff0a] transition duration-[0.2s] cursor-pointer ease-in-out'>
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
                {messages.length === 0 && <p className="text-gray-500">Nenhuma mensagem ainda.</p>}
                {messages.map((msg) => {
                  const isSender = msg.sender_id === user?.id
                  const status = isSender ? readReceipts[msg.id] ?? 'Sent' : undefined
                  return (
                    <div key={msg.id} className={`flex ${isSender ? 'justify-end' : 'justify-start'} mb-2`}>
                      <div className={`max-w-[70%] px-3 py-2 rounded-lg ${isSender ? 'bg-[#36577d] text-white' : 'bg-[#272727] text-gray-200'}`}>
                        {!isSender && <div className="text-sm mb-1"><strong className="text-[#4677af]">{receiver?.user_name}</strong></div>}
                        <div>{msg.content}</div>
                        {status && <div className="text-xs text-gray-400 mt-1 text-right">{status}</div>}
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef}></div>
              </div>

              <footer className="w-full flex items-center justify-center gap-[10px]">
                <input
                  placeholder="Digite sua mensagem..."
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  className="text-[15px] flex-1 h-[40px] w-full bg-[#15151e] transition duration-[0.2s] ease-in-out border border-[#272727] rounded-[10px] px-[16px] py-[8px] text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#36577d]"
                />
                <button className="h-[40px] px-[11px] py-[10px] bg-[#0c0c13] border border-[#15151e] rounded-[10px] hover:bg-[#ffffff0a] transition duration-[0.2s] cursor-pointer ease-in-out">
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
  )
}
