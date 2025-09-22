import SideBar from "@/components/SideBar";
import { SidebarProvider } from "@/components/ui/sidebar";
import TableCommitments from "@/components/TableCommitment";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import CreateCommitmentDialog from "@/components/CreateCommitmentDialog";
import SidebarActions from "@/components/SidebarActions";
import { useEffect, useState } from "react";
import { getCommitments } from "@/lib/api/commitments";
import { toast } from "sonner";

export default function Commitments() {
  const [ commitments, setCommitments ] = useState<any[]>([])

  const fetchData = async () => {
    try {
      const commitments = await getCommitments()
      setCommitments(commitments)
      console.log(commitments)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <SidebarProvider>
      <main className="flex items-start justify-center flex-row w-full min-h-screen overflow-x-hidden relative">
        <SideBar />
        <div className="p-[10px] border-r border-[#15151e] min-h-full">
          <SidebarActions />
        </div>
        <div className="flex items-start justify-center flex-col p-[20px] w-full min-w-0">
          <div className="flex items-start justify-center flex-col w-full mb-[20px]">
            <h1 className="mb-[2px] scroll-m-20 text-center text-[20px] font-bold tracking-tight text-balance">
              Compromissos
            </h1>
            <p className="text-[#b3b3b3] text-[12px]">
              Compromissos e lembretes organizados em um só lugar.
            </p>
          </div>
          <div className="flex-col-reverse mb-[10px] w-full flex lg:flex-row gap-[10px]">
            <Input type="email" id="email" placeholder="Buscar por compromisso, cliente, data..." className="bg-[#0c0c13] border border-[#15151e] rounded-[10px]" />
            <Select>
              <SelectTrigger className="w-full bg-[#0c0c13]">
                <SelectValue placeholder="Filtre por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="none">Nenhum</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="completed">Concluído</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-full bg-[#0c0c13]">
                <SelectValue placeholder="Ordenar por..." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="none">Nenhum</SelectItem>
                  <SelectItem value="recent">Mais recente</SelectItem>
                  <SelectItem value="old">Mais antigo</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <CreateCommitmentDialog onCreated={fetchData} />
          </div>
          <div className="w-full border border-[#15151e] p-2 rounded-[10px]">
            <Table className="max-w-full w-full">
              <TableHeader>
                <TableRow className="rounded-full">
                  <TableHead className="w-[100px]">Cliente</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Compromisso</TableHead>
                  <TableHead className="text-right">Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {commitments.map(commitment => {
                  return (
                    <TableCommitments
                      key={commitment.id}
                      fetchData = { fetchData }
                      commitmentId = {commitment.id}
                      email= {commitment.client_email}
                      client={commitment.client_name}
                      commitment={commitment.title}
                      date={commitment.dueDate}
                      status={commitment.status}
                    />
                  )
                })}
              </TableBody>

            </Table>
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
}
