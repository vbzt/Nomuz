import SideBar from "@/components/SideBar"
import { SidebarTrigger, SidebarProvider } from "@/components/ui/sidebar"

export default function Dashboard() {
    return (
        <SidebarProvider>
            <main className="flex items-start justify-center flex-row">
                <SideBar />
                <div className="p-[10px] border-r border-[#15151e] min-h-full">
                    <SidebarTrigger className="flex justify-center items-center bg-[#5757570a] p-[6px] rounded-[10px] border border-[#15151e] h-9 w-9 transition duration-[0.2s] cursor-pointer ease-in-out hover:bg-[#ffffff0a] hover:text-[#fff] group"/>
                </div>
            </main>
        </SidebarProvider>
    )
}