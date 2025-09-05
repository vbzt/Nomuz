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

export default function CreateCommitmentDialog() {
    const [date, setDate] = useState<Date | undefined>()

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-[#0c0c13] border border-[#15151e] hover:bg-[#ffffff0a]"><IoAdd size={15} /> Novo compromisso</Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0c0c13] border border-[#15151e]">
                <DialogHeader>
                    <DialogTitle>Criar compromisso</DialogTitle>
                    <DialogDescription className="text-[#b3b3b3] mb-[10px]">Adicione as informações necessárias para criar um compromisso.</DialogDescription>
                    <form>
                        <Input type="email" id="email" placeholder="E-mail do cliente" className="bg-[#0c0c13] border border-[#15151e] rounded-[10px] mb-[10px]" />
                        <Input type="text" id="commitment" placeholder="Motivo do compromisso" className="bg-[#0c0c13] border border-[#15151e] rounded-[10px] mb-[10px]" />
                        <Calendar
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