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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useState } from "react";
import { format } from "date-fns"

export default function EditCommitmentDialog() {
  const [date, setDate] = useState<Date>()

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
            <Input type="text" id="commitment" placeholder="Motivo do compromisso" className="bg-[#0c0c13] border border-[#15151e] rounded-[10px] mb-[10px]" />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  data-empty={!date}
                  className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal w-full mb-[10px]"
                >
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} />
              </PopoverContent>
            </Popover>
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