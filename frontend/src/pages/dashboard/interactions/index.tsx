import SideBar from "@/components/SideBar"
import { SidebarTrigger, SidebarProvider } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { TbCheck } from "react-icons/tb";
import ConfirmationAlert from "@/components/ConfirmationAlert";
import SidebarActions from "@/components/SidebarActions";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { IoAdd } from "react-icons/io5";
import ContentMessageUser from "@/components/ContentMessageUser";
import CreateGroupDialog from "@/components/CreateGroupDialog";
import ContentGroupUser from "@/components/ContentGroupUser";
import { useEffect, useState } from "react";
import { getChats } from "@/lib/api/chat";
import { ChatUser } from "@/interfaces/chat-user";
import { useAuth } from "../../../../context/AuthContext";
import CreatePrivateDialog from "@/components/CreatePrivateChatDialog";

export default function Interactions() {
    const { user } = useAuth()
    const [chats, setChats] = useState<any[]>([])
    async function fetchChats() {
        try {
          const chats = await getChats()
          setChats(chats)
        } catch (err) {
          console.error("Erro ao buscar chats:", err)
        }
      }

    useEffect(() => {
      fetchChats()
    }, [])


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
                        <Input type="email" id="email" placeholder="Buscar por contato, mensagem, grupo, etc..." className="bg-[#0c0c13] border border-[#15151e] rounded-[10px]" />
                        <Select>
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
                        <CreatePrivateDialog / > 
                        <CreateGroupDialog />
                    </div>
                    { chats.length === 0 && ( 
                      <p className="text-[#b3b3b3] text-sm text-center mt-4">Nenhuma conversa ainda, que tal começar uma?</p>
                    )}
                    { chats.map( chat => { 
                        const lastMessage = chat.messages[0]

                        let contentPreview = ""
                        if (chat.isGroup) {
                          contentPreview = lastMessage ? `${lastMessage.sender.name}: ${lastMessage.content}` : " "
                        } else {
                          contentPreview = lastMessage ? lastMessage.content : " "
                        }

                        const otherUser = !chat.isGroup ? chat.users.find((u: ChatUser) => u.user.id !== user!.id)?.user : null

                        return ( 
                        <ContentGroupUser
                            key={chat}
                            name_group= { chat.name ? chat.name : otherUser.name}
                            content_preview= { contentPreview }
                            notification={chat._count.messages}
                            picture= { otherUser.profilePicture }
                            id = { chat.id}
                            time={lastMessage ? new Date(lastMessage.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : ""}
                        />
                        )
                    })}
                </div>
            </main>
        </SidebarProvider>
    )
}