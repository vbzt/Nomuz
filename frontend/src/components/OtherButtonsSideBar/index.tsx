import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { SidebarTrigger, SidebarProvider } from "@/components/ui/sidebar";
import { TbUsers } from "react-icons/tb";
import { TbArchive } from "react-icons/tb";
import { TbLock } from "react-icons/tb";
import { TbCalendarMonth } from "react-icons/tb";
import { TbChartDots } from "react-icons/tb";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TbLogout } from "react-icons/tb";
import Image from "next/image";
import imageteste from '../../../public/image.jpg'

export default function SidebarActions() {
    const { state } = useSidebar()

    function ToPageURL(link: string) {
        window.location.href = `/dashboard/${link}`
    }

    const props = [
        {
            titleTooltip: 'Estatísticas',
            icon: TbChartDots,
            url: 'statistics'
        },
        {
            titleTooltip: 'Interações',
            icon: TbUsers,
            url: 'interactions'
        },
        {
            titleTooltip: 'Arquivos',
            icon: TbArchive,
            url: 'archives'
        },
        {
            titleTooltip: 'Vault',
            icon: TbLock,
            url: 'vault'
        },
        {
            titleTooltip: 'Compromissos',
            icon: TbCalendarMonth,
            url: 'commitments'
        }
    ]

    return (
        <div className="flex flex-col items-center gap-2">
            <SidebarTrigger className="flex justify-center items-center bg-[#0c0c13] p-[6px] rounded-[10px] border border-[#15151e] h-9 w-9 transition duration-[0.2s] cursor-pointer ease-in-out hover:bg-[#ffffff0a] hover:text-[#fff] group" />
            {state === 'collapsed' && (
                <>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className="mb-[8px] flex justify-center items-center bg-[#0c0c13] p-[2px] rounded-[10px] border border-[#15151e] h-9 w-9 transition duration-[0.2s] cursor-pointer ease-in-out hover:bg-[#ffffff0a] hover:text-[#fff] group">
                                <Image className="rounded-[10px]" src={imageteste} alt="teste" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[238.5px]" align="start">
                            <DropdownMenuLabel className="text-[#b3b3b3] text-[12px] select-none">Minha conta</DropdownMenuLabel>
                            <DropdownMenuItem className="text-[#b3b3b3] hover:bg-[#36577d19] hover:text-[#fff] transition duration-[0.2s] ease-in-out cursor-pointer" onClick={() => window.location.href = '/'}>Início</DropdownMenuItem>
                            <DropdownMenuItem className="text-[#b3b3b3] hover:bg-[#36577d19] hover:text-[#fff] transition duration-[0.2s] ease-in-out cursor-pointer" onClick={() => window.location.href = '/dashboard/settings'}>Configurações</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-[#c72e38] hover:bg-[#c72e38] hover:text-[#fff] transition duration-[0.2s] cursor-pointer ease-in-out group">
                                Log out
                                <TbLogout className="text-[#c72e38] group-hover:text-[#fff] transition duration-[0.2s] ease-in-out" />
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <div className="w-full p-[0.5px] h-[0.5px] mb-[8px] bg-[#15151e]"></div>
                    {props.map((item) => (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button onClick={() => ToPageURL(item.url)} className="flex justify-center items-center bg-[#0c0c13] p-[6px] rounded-[10px] border border-[#15151e] h-9 w-9 transition duration-[0.2s] cursor-pointer ease-in-out hover:bg-[#ffffff0a] hover:text-[#fff] group">
                                    <item.icon />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                                <p>{item.titleTooltip}</p>
                            </TooltipContent>
                        </Tooltip>
                    ))}
                </>
            )}
        </div>
    )
}