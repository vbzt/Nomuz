import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "../ui/button"
import { TbEdit } from "react-icons/tb";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { useState } from "react";
import { pt } from "date-fns/locale"
import { IoAdd } from "react-icons/io5";
import { IoRemove } from "react-icons/io5";
import { TbUser } from "react-icons/tb";
import { toast } from "sonner";

export default function CreateGroupDialog() {
    const [date, setDate] = useState<Date | undefined>()
    const [imgs, setImgs] = useState<string[]>([])
    const [inputNewUser, setInputNewUser] = useState('')

    function addNewUser() {
        if (inputNewUser !== '' && imgs.length < 5) {
            setImgs([...imgs, inputNewUser])
            setInputNewUser('')
        } else if (imgs.length >= 5) {
            toast.error('')
        } else {
            toast.error('Não é possivel criar um grupo vazio')
        }
    }

    function removeUser(index: number) {
        const newImgs = imgs.filter((_, i) => i !== index)
        setImgs(newImgs)
        alert('penis maldito')
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-[#0c0c13] border border-[#15151e] hover:bg-[#ffffff0a]"><IoAdd size={15} /> Novo grupo</Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0c0c13] border border-[#15151e]">
                <DialogHeader>
                    <DialogTitle>Criar grupo</DialogTitle>
                    <DialogDescription className="text-[#b3b3b3] mb-[10px]">Adicione as informações necessárias para criar um grupo.</DialogDescription>
                    <form>
                        <Input type="text" id="group" placeholder="Nome do grupo" className="bg-[#0c0c13] border border-[#15151e] rounded-[10px] mb-[10px]" />
                        <div className="flex flex-col items-center justify-center w-full mb-[10px]">
                            <div className="flex flex-row w-full mb-[10px]">
                                <Input type="text" id="group" placeholder="E-mail do usuário" value={inputNewUser} onChange={((e) => setInputNewUser(e.target.value))} className="bg-[#0c0c13] border border-[#15151e] rounded-[10px]" />
                                <Button type="button" onClick={addNewUser} className="bg-[#36577d] hover:bg-[#254161] ml-[10px] h-9 w-9"><IoAdd size={15} /></Button>
                            </div>
                            {imgs.length > 0 && (
                                <ul className="w-full">
                                    {imgs.map((user, index) => (
                                        <div className="w-full flex flex-row">
                                            <li key={index} className="w-full mb-[10px  ] h-9 flex items-center justify-start flex-row border border-[#15151e] rounded-[10px] p-1.5">
                                                <TbUser className="mr-[5px]"/>
                                                <p>{user}</p>
                                            </li>
                                            <Button type="button" onClick={() => removeUser(index)} className="bg-[#36577d] hover:bg-[#254161] ml-[10px] h-9 w-9"><IoRemove size={15} /></Button>
                                        </div>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <Button className="w-full bg-[#36577d] hover:bg-[#254161]">Criar grupo</Button>
                    </form>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}