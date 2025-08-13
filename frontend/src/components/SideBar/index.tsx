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
import { TbHome } from "react-icons/tb";
import { TbUsers } from "react-icons/tb";
import { TbArchive } from "react-icons/tb";
import { TbLock } from "react-icons/tb";
import { TbCalendarMonth } from "react-icons/tb";
import OptionsUser from "../OptionsUser";

export default function SideBar() {
    const items = [
        {
            title: "Interações",
            url: "#",
            icon: TbUsers,
        },
        {
            title: "Arquivos",
            url: "#",
            icon: TbArchive,
        },
        {
            title: "Vault",
            url: "#",
            icon: TbLock,
        },
        {
            title: "Agenda",
            url: "#",
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
                            <div className="w-full p-[0.5px] h-[0.5px] mb-[10px] bg-[#15151e]"></div>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild className="rounded-[10px] h-0 py-[18px] px-[10px] border border-[#15151e] hover:bg-[#36577d19] hover:transition hover:duration-[0.2s] hover:ease-in-out hover:text-[#fff] text-[#b3b3b3] transition duration-[0.2s] ease-in-out">
                                        <a href="" className="flex justify-between flex-row-reverse"><item.icon /> {item.title}</a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}