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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { useState } from "react";
import { pt } from "date-fns/locale" 

export default function EditCommitmentDialog() {
  const [date, setDate] = useState<Date | undefined>()

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="px-[10px] h-[30px] bg-[#0c0c13] border border-[#15151e] hover:bg-[#ffffff0a]"><TbEdit /> Editar</Button>
      </DialogTrigger>
      <DialogContent className="bg-[#0c0c13] border border-[#15151e]">
        <DialogHeader>
          <DialogTitle>Editar compromisso</DialogTitle>
          <DialogDescription className="text-[#b3b3b3] mb-[10px]">Edite informações em relação a um compromisso específico</DialogDescription>
          <form>
            <Input type="text" id="name" placeholder="Nome do cliente" className="bg-[#0c0c13] border border-[#15151e] rounded-[10px] mb-[10px]" />
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
            <Select>
              <SelectTrigger className="w-full bg-[#0c0c13] mb-[10px]">
                <SelectValue placeholder="Status do compromisso" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="completed">Concluído</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button className="w-full bg-[#36577d] hover:bg-[#254161]">Editar</Button>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}