import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "../ui/button"
import { IoAdd } from "react-icons/io5";
import { IoRemove } from "react-icons/io5";
import { TbUser } from "react-icons/tb";
import { Input } from "../ui/input";
import { useState } from "react";
import { createChat } from "@/lib/api/chat";
import { readOne } from "@/lib/api/user";
import { useRouter } from "next/router";
import { toast } from "sonner";

export default function CreatePrivateDialog() {
    const router = useRouter()
    const [inputUser, setInputUser] = useState("")

    const handleCreateChat = async (e: React.FormEvent) => { 
     try {
      e.preventDefault()
      const user = await readOne(inputUser)
      const privateChat = await createChat(user.id)
      // router.push("/chat/"+privateChat.data.id)
     } catch (e: any) {
      console.log(e.message)
      toast.error(e.message)
     }
    }

  

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-[#0c0c13] border border-[#15151e] hover:bg-[#ffffff0a]">
                    <IoAdd size={15} /> Nova conversa
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0c0c13] border border-[#15151e]">
                <DialogHeader>
                    <DialogTitle>Iniciar conversa privada</DialogTitle>
                    <DialogDescription className="text-[#b3b3b3] mb-[10px]">
                        Adicione o e-mail de um usuário para começar uma conversa.
                    </DialogDescription>
                    <form onSubmit={handleCreateChat}>
                          <div className="flex flex-row w-full mb-[10px]">
                              <Input
                                  type="text"
                                  placeholder="E-mail do usuário"
                                  value={inputUser}
                                  onChange={(e) => setInputUser(e.target.value)}
                                  className="bg-[#0c0c13] border border-[#15151e] rounded-[10px]"
                              />
                          </div>
                        
                        <Button className="w-full bg-[#36577d] hover:bg-[#254161]">
                            Iniciar conversa
                        </Button>
                    </form>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}
