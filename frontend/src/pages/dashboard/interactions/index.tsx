import SideBar from "@/components/SideBar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import SidebarActions from "@/components/SidebarActions"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import CreateGroupDialog from "@/components/CreateGroupDialog"
import CreatePrivateDialog from "@/components/CreatePrivateChatDialog"
import ContentMessageUser from "@/components/ContentMessageUser"
import { useEffect, useState, useRef, useCallback } from "react"
import { getChats } from "@/lib/api/chat"
import { useAuth } from "../../../../context/AuthContext"
import { io, Socket } from "socket.io-client"

export default function Interactions() {
  const { user } = useAuth()
  const [chats, setChats] = useState<any[]>([])
  const socketRef = useRef<Socket | null>(null)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const fetchChats = useCallback(async () => {
    if (!user?.id) return
    try {
      const chats = await getChats()
      setChats(chats)
    } catch (err) {
      console.error(err)
    }
  }, [user?.id])

  useEffect(() => {
    fetchChats()
  }, [fetchChats])

  useEffect(() => {
    if (!user?.id) return
    if (!socketRef.current) {
      const socket = io("http://localhost:3005", { withCredentials: true, transports: ['websocket'] })
      socketRef.current = socket

      socket.on("message", ({ chatId, message }: { chatId: string, message: any }) => {
        fetchChats()
      })

      return () => {
        socket.disconnect()
        socketRef.current = null
      }
    }
  }, [user?.id])

  useEffect(() => {
    if (!socketRef.current || chats.length === 0) return
    chats.forEach(chat => {
      socketRef.current?.emit("joinChat", chat.id)
    })
  }, [chats])

  const filteredChats = chats.filter(chat => {
    if (filter === 'talks' && chat.isGroup) return false
    if (filter === 'group' && !chat.isGroup) return false
    return true
  }).filter(chat => {
    if (!search) return true
    const lastMessage = chat.messages[0]
    const contentPreview = chat.isGroup
      ? lastMessage ? `${lastMessage.sender.name}: ${lastMessage.content}` : ""
      : lastMessage ? lastMessage.content : ""
    const otherUser = !chat.isGroup ? chat.users.find((u: any) => u.user.id !== user!.id)?.user : null
    const name = chat.name || (otherUser ? otherUser.name : '')
    return name.toLowerCase().includes(search.toLowerCase()) || contentPreview.toLowerCase().includes(search.toLowerCase())
  })

  return (
    <SidebarProvider>
      <main className="flex items-start justify-center flex-row w-full">
        <SideBar />
        <div className="p-[10px] border-r border-[#15151e] min-h-full">
          <SidebarActions />
        </div>
        <div className="flex items-start justify-center flex-col p-[20px] w-full">
          <h1 className="mb-[2px] scroll-m-20 text-center text-[20px] font-bold tracking-tight text-balance">Interações</h1>
          <p className="text-[#b3b3b3] mb-[20px] text-[12px]">Confira suas interações com usuários ou grupos privados.</p>
          <div className="flex-col-reverse mb-[10px] w-full flex lg:flex-row gap-[10px]">
            <Input type="text" placeholder="Buscar por contato, mensagem, grupo, etc..." className="bg-[#0c0c13] border border-[#15151e] rounded-[10px]" value={search} onChange={e => setSearch(e.target.value)} />
            <Select onValueChange={setFilter}>
              <SelectTrigger className="w-full bg-[#0c0c13]">
                <SelectValue placeholder="Filtre por prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="none">Nenhum</SelectItem>
                  <SelectItem value="talks">Conversas</SelectItem>
                  <SelectItem value="group">Grupos</SelectItem>
                  <SelectItem value="all">Todas</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <CreatePrivateDialog />
            <CreateGroupDialog />
          </div>
          {filteredChats.length === 0 && (
            <p className="text-[#b3b3b3] text-sm text-center mt-4">Nenhuma conversa ainda, que tal começar uma?</p>
          )}
          {filteredChats.map(chat => {
            const lastMessage = chat.messages[0]
            const contentPreview = chat.isGroup
              ? lastMessage ? `${lastMessage.sender.name}: ${lastMessage.content}` : ""
              : lastMessage ? lastMessage.content : ""
            const otherUser = !chat.isGroup ? chat.users.find((u: any) => u.user.id !== user!.id)?.user : null
            return (
              <ContentMessageUser
                key={chat.id}
                name_group={chat.name || (otherUser ? otherUser.name : '')}
                content_preview={contentPreview}
                notification={chat._count.messages}
                picture={otherUser ? otherUser.profilePicture : ''}
                id={chat.id}
                time={lastMessage ? new Date(lastMessage.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : ""}
              />
            )
          })}
        </div>
      </main>
    </SidebarProvider>
  )
}
