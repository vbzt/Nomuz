import SideBar from "@/components/SideBar";
import { SidebarTrigger, SidebarProvider } from "@/components/ui/sidebar";
import TableCommitments from "@/components/TableCommitment";

export default function Commitments() {
  return (
    <SidebarProvider>
      <main className="flex items-start justify-center flex-row w-full">
        <SideBar />
        <div className="p-[10px] border-r border-[#15151e] min-h-full">
          <SidebarTrigger className="flex justify-center items-center bg-[#0c0c13] p-[6px] rounded-[10px] border border-[#15151e] h-9 w-9 transition duration-[0.2s] cursor-pointer ease-in-out hover:bg-[#ffffff0a] hover:text-[#fff] group" />
        </div>
        <div className="flex items-start justify-center flex-col p-[20px] w-full">
          <div className="flex items-center justify-between w-full mb-[20px]">
            <div className="flex flex-col items-start justify-center">
              <h1 className="mb-[2px] scroll-m-20 text-center text-[20px] font-bold tracking-tight text-balance">
                Compromissos
              </h1>
              <p className="text-[#b3b3b3] text-[12px]">
                Compromissos e lembretes organizados em um só lugar.
              </p>
            </div>
            <button>penis</button>
          </div>
          <div className="w-full border border-[#15151e] p-2 rounded-[10px]">
            <TableCommitments />
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
}



import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function TableCommitments() {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">Cliente</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Compromisso</TableHead>
                    <TableHead className="text-right">Data</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell className="font-medium">INV001</TableCell>
                    <TableCell>Paid</TableCell>
                    <TableCell>Credit Card</TableCell>
                    <TableCell className="text-right">$250.00</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    )
}
