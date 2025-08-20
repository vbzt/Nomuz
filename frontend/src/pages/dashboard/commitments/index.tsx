import SideBar from "@/components/SideBar";
import { SidebarTrigger, SidebarProvider } from "@/components/ui/sidebar";
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
import { Button } from "@/components/ui/button";
import { IoAdd } from "react-icons/io5";

export default function Commitments() {
  return (
    <SidebarProvider>
      <main className="flex items-start justify-center flex-row w-full min-h-screen overflow-x-hidden relative">
        <SideBar />
        <div className="p-[10px] border-r border-[#15151e] min-h-full">
          <SidebarTrigger className="flex justify-center items-center bg-[#0c0c13] p-[6px] rounded-[10px] border border-[#15151e] h-9 w-9 transition duration-[0.2s] cursor-pointer ease-in-out hover:bg-[#ffffff0a] hover:text-[#fff] group" />
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
            <Button className="bg-[#0c0c13] border border-[#15151e] hover:bg-[#ffffff0a]"><IoAdd size={15} /> Novo compromisso</Button>
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
                <TableCommitments
                  client="penis"
                  commitment="Muito tenis no rabo"
                  date="12/12/25"
                  status="pending"
                />
                <TableCommitments
                  client="penis"
                  commitment="Muito tenis no rabo"
                  date="12/12/25"
                  status="completed"
                />
                <TableCommitments
                  client="penis"
                  commitment="Muito tenis no rabo"
                  date="12/12/25"
                  status="cancelled"
                />
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
}
