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
import { Button } from "../ui/button"
import { TbLogout } from "react-icons/tb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TbChevronDown } from "react-icons/tb";
import SkeletonLoading from "../SkeletonLoading";

export default function OptionsUser() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="w-full px-[10px] py-[10px] h-[auto] mb-[20px] flex items-center justify-between flex-row rounded-[10px] border border-[#15151e] bg-[transparent] hover:bg-[#36577d19]">
                    <div className="flex items-center justify-center flex-row">
                        <Avatar className="mr-[10px]">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <SkeletonLoading height={50} width={50} />
                        <div className="flex items-start justify-center flex-col">
                            <h1 className="text-[12px]">Vitinho</h1>
                            <p className="text-[10px] text-[#b3b3b3]">victorredin122@gmail.com</p>
                        </div>
                    </div>
                    <TbChevronDown />
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
    )
}