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
import OptionsUser from "../OptionsUser";

export default function SideBar() {
    const items = [
        {
            title: "Home",
            url: "#",
            icon: TbHome,
        },
    ]

    return (
        <Sidebar>
            <SidebarContent className="bg-[#0c0c13] border-r border-[]">
                <SidebarGroup>
                    <SidebarGroupLabel className="text-[#b3b3b3]">Opções</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <OptionsUser />
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild className="rounded-[10px] px-[10px] border border-[#15151e] hover:bg-[#36577d19] hover:transition hover:duration-[0.2s] hover:ease-in-out hover:text-[#fff] text-[#fff] transition duration-[0.2s] ease-in-out">
                                        <a href=""><item.icon/> teste</a>
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