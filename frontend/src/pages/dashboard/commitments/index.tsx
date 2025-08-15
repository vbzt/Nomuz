import SideBar from "@/components/SideBar";
import { SidebarTrigger, SidebarProvider } from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Commitments() {
  return (
    <SidebarProvider>
      <main className="flex items-start justify-center flex-row w-full">
        <SideBar />
        <div className="p-[10px] border-r border-[#15151e] min-h-full">
          <SidebarTrigger className="flex justify-center items-center bg-[#0c0c13] p-[6px] rounded-[10px] border border-[#15151e] h-9 w-9 transition duration-[0.2s] cursor-pointer ease-in-out hover:bg-[#ffffff0a] hover:text-[#fff] group" />
        </div>
        <div className="flex items-start justify-center flex-col p-[20px] w-full">
          <h1 className="mb-[2px] scroll-m-20 text-center text-[20px] font-bold tracking-tight text-balance">
            Compromissos
          </h1>
          <p className="text-[#b3b3b3] mb-[20px] text-[12px]">
            Compromissos e lembretes organizados em um só lugar.
          </p>
          <div className="w-full">
            <Table>
              <TableCaption>Lista de compromissos</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Cliente</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
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
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
}
