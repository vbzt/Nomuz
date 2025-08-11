import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose
} from "@/components/ui/sheet"
import { TbMenu } from "react-icons/tb";
import { IoCloseOutline } from "react-icons/io5";
import { TbSearch } from "react-icons/tb";
import { TbUser } from "react-icons/tb";
import Image from "next/image"
import icon from '../../../public/icon.png'
import CustomNavigationMenuMobile from "../CustomNavigationMenuMobile";

export default function MenuMobile() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <button className="block p-2 rounded-[10px] border border-[#15151e] md:hidden"><TbMenu size={20} /></button>
            </SheetTrigger>
            <SheetContent side="left">
                <SheetHeader className="flex h-[65px] items-center justify-between flex-row px-4 border-b border-[#15151e]">
                    <Image className="h-[50px] w-[50px] mr-[15px]" src={icon} alt="Icon" />
                    <SheetClose asChild>
                        <button className="p-2 rounded-[10px] border border-[#15151e]"><IoCloseOutline size={20} /></button>
                    </SheetClose>
                </SheetHeader>
                <div className="px-4 flex justify-center items-center">
                    <button onClick={() => window.location.href = '/auth/login'} className="w-full flex items-center justify-start bg-[#5757570a] p-[8px] rounded-[10px] border border-[#15151e] transition duration-[0.2s] cursor-pointer ease-in-out hover:bg-[#ffffff0a]">
                        <TbUser size={20} className="transition duration-[0.2s] ease-in-out text-[#b3b3b3] hover:text-[#fff]" />
                        <p className="text-[14px] ml-[10px]">Iniciar sessão</p>
                    </button>
                    <button className="block p-[8px] rounded-[10px] border border-[#15151e] bg-[#5757570a] ml-[10px]"><TbSearch size={20} className="transition duration-[0.2s] ease-in-out text-[#b3b3b3] hover:text-[#fff]" /></button>
                </div>
                <div className="flex items-start justify-center flex-col px-4">
                    <CustomNavigationMenuMobile />
                </div>
            </SheetContent>
        </Sheet>
    )
}