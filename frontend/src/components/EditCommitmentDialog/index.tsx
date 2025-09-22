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
import { toast } from "sonner";
import { editCommitment } from "@/lib/api/commitments";

interface CommitmentProps {
    title: string,
    email: string,
    dueDate: Date,
    status: 'PENDING' | 'COMPLETED' | 'CANCELLED',
    commitmentId: string,
    onEdit: () => void

}

export default function EditCommitmentDialog({ title, email, dueDate, status, commitmentId, onEdit}: CommitmentProps) {
  const [ formEmail, setFormEmail ] = useState(email)
  const [ formTitle, setFormTitle ] = useState(title);
  const [ formDate, setFormDate ] = useState<Date | undefined>(dueDate ? new Date(dueDate) : undefined)
  const [ formStatus, setFormStatus ] = useState(status)
  const [ open, setOpen ] = useState(false)

  const handleEditCommitment = async (e: React.FormEvent) => { 
    e.preventDefault()
    try {
      console.log(formEmail)
      await editCommitment(commitmentId, formEmail, formTitle, formDate, formStatus)
      toast.success(`Compromisso com ${formEmail} para o dia ${formDate?.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" })} editado com sucesso`)
      setOpen(false)
      onEdit()
    } catch (e:any) {
      toast.error(e.message)
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="px-[10px] h-[30px] bg-[#0c0c13] border border-[#15151e] hover:bg-[#ffffff0a]">
          <TbEdit /> Editar
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[#0c0c13] border border-[#15151e]">
        <DialogHeader>
          <DialogTitle>Editar compromisso</DialogTitle>
          <DialogDescription className="text-[#b3b3b3] mb-[10px]">
            Edite informações em relação a um compromisso específico
          </DialogDescription>

          <form onSubmit={handleEditCommitment}>
            <Input
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              type="email"
              placeholder="E-mail do cliente"
              className="bg-[#0c0c13] border border-[#15151e] rounded-[10px] mb-[10px]"
            />

            <Input
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              type="text"
              placeholder="Motivo do compromisso"
              className="bg-[#0c0c13] border border-[#15151e] rounded-[10px] mb-[10px]"
            />

            <Calendar
              mode="single"
              selected={formDate}
              onSelect={setFormDate}
              className="rounded-[10px] border shadow-sm w-full mb-[10px]"
              captionLayout="dropdown"
              locale={pt}
            />

            <Select value={formStatus} onValueChange={(val) => setFormStatus(val as CommitmentProps["status"])}>
              <SelectTrigger className="w-full bg-[#0c0c13] mb-[10px]">
                <SelectValue placeholder="Status do compromisso" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="PENDING">Pendente</SelectItem>
                  <SelectItem value="COMPLETED">Concluído</SelectItem>
                  <SelectItem value="CANCELLED">Cancelado</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Button className="w-full bg-[#36577d] hover:bg-[#254161]">
              Editar
            </Button>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}