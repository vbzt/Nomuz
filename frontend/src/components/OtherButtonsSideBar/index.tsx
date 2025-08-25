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