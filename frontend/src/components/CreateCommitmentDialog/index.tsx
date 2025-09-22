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
import { createCommitment, getCommitments } from "@/lib/api/commitments";
import { toast } from "sonner";

export default function CreateCommitmentDialog({ onCreated }: { onCreated?: () => void }) {
    const [ date, setDate ] = useState<Date>()
    const [ email, setEmail ] = useState('')
    const [ title, setTitle ] = useState('')
    const [ open, setOpen ] = useState(false)

    const handleCommitment = async (e: React.FormEvent) => { 
        e.preventDefault()
        try {
            await createCommitment(email, title, date)
            toast.success(`Compromisso para o dia ${date?.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" })} criado com sucesso`)
            setTitle('')
            setDate(undefined)
            setEmail('')
            setOpen(false)
            if (onCreated) onCreated()
        } catch (e:any) {
            toast.error(e.message)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild> 
                <Button className="bg-[#0c0c13] border border-[#15151e] hover:bg-[#ffffff0a]"><IoAdd size={15} /> Novo compromisso</Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0c0c13] border border-[#15151e]">
                <DialogHeader>
                    <DialogTitle>Criar compromisso</DialogTitle>
                    <DialogDescription className="text-[#b3b3b3] mb-[10px]">Adicione as informações necessárias para criar um compromisso.</DialogDescription>
                    <form onSubmit={handleCommitment}>
                        <Input value={email} onChange={e => setEmail(e.target.value)} type="email" id="email" placeholder="E-mail do cliente" className="bg-[#0c0c13] border border-[#15151e] rounded-[10px] mb-[10px]" />
                        <Input value={title} onChange={e => setTitle(e.target.value)} type="text" id="commitment" placeholder="Motivo do compromisso" className="bg-[#0c0c13] border border-[#15151e] rounded-[10px] mb-[10px]" />
                        <Calendar
                            required
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="rounded-[10px] border shadow-sm w-full mb-[10px]"
                            captionLayout="dropdown"
                            locale={pt}
                        />
                        <Button className="w-full bg-[#36577d] hover:bg-[#254161]">Criar compromisso</Button>
                    </form>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}