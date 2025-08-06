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

export default function MenuMobile() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <button className="block p-2 rounded-[10px] border border-[#15151e] md:hidden"><TbMenu size={20} /></button>
            </SheetTrigger>
            <SheetContent side="left">
                <SheetHeader className="flex h-[65px] items-center justify-between px-4 border-b border-[#15151e]">
                    <SheetClose asChild>
                        <button className="p-2 rounded-[10px] border border-[#15151e]"><IoCloseOutline size={20} /></button>
                    </SheetClose>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    )
}