import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import OptionsUser from "../OptionsUser";
import { TbHome } from "react-icons/tb";
import { TbUsers } from "react-icons/tb";
import { TbArchive } from "react-icons/tb";
import { TbLock } from "react-icons/tb";
import { TbCalendarMonth } from "react-icons/tb";
import { TbChartDots } from "react-icons/tb";
import { usePathname } from "next/navigation";

export default function SideBar() {
    const pathname = usePathname()

    const items = [
        {
            title: "Estatísticas",
            url: "/dashboard/statistics",
            icon: TbChartDots,
        },
        {
            title: "Interações",
            url: "/dashboard/interactions",
            icon: TbUsers,
        },
        {
            title: "Arquivos",
            url: "/dashboard/archives",
            icon: TbArchive,
        },
        {
            title: "Vault",
            url: "/dashboard/vault",
            icon: TbLock,
        },
        {
            title: "Compromissos",
            url: "/dashboard/commitments",
            icon: TbCalendarMonth,
        }
    ]

    return (
        <Sidebar>
            <SidebarContent className="bg-[#0c0c13]">
                <SidebarGroup>
                    <SidebarGroupLabel className="text-[#b3b3b3]">Opções</SidebarGroupLabel>
                    <SidebarGroupContent className="w-full">
                        <SidebarMenu>
                            <OptionsUser />
                            <div className="w-full p-[0.5px] h-[0.5px] mb-[20px] bg-[#15151e]"></div>
                            {items.map((item) => {
                                const isPathname = pathname === item.url

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild className={`${isPathname === true && "bg-[#36577d19]"} ${"rounded-[10px] h-0 py-[18px] px-[10px] hover:bg-[#36577d19] hover:transition hover:duration-[0.2s] hover:ease-in-out hover:text-[#fff] text-[#b3b3b3] transition duration-[0.2s] ease-in-out"}`}>
                                            <a href={item.url} className={`${isPathname === true && "text-[#fff]"} ${"flex justify-between flex-row-reverse"}`}><item.icon className={`${isPathname === true && "text-[#fff]"}`}/> {item.title}</a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}