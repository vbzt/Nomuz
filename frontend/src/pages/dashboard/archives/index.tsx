import SideBar from "@/components/SideBar"
import { SidebarTrigger, SidebarProvider } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { TbCheck } from "react-icons/tb";
import ConfirmationAlert from "@/components/ConfirmationAlert";
import SidebarActions from "@/components/SidebarActions";

export default function Archives() {
    return (
        <SidebarProvider>
            <main className="flex items-start justify-center flex-row w-full">
                <SideBar />
                <div className="p-[10px] border-r border-[#15151e] min-h-full">
                    <SidebarActions />
                </div>
                <div className="flex items-start justify-center flex-col p-[20px] w-full">
                    <h1 className="mb-[2px] scroll-m-20 text-center text-[20px] font-bold tracking-tight text-balance">Seus arquivos</h1>
                    <p className="text-[#b3b3b3] mb-[20px] text-[12px]">Espaço para armazenar arquivos pessoais e outros.</p>

                </div>
            </main>
        </SidebarProvider>
    )
}