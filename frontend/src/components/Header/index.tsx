import Image from "next/image"
import icon from '../../../public/icon.png'
import { Button } from "@/components/ui/button"
import CustomNavigationMenu from "../CustomNavigationMenu"
import MenuMobile from "../MenuMobile"

export default function Header() {
    return (
        <header className="flex items-center justify-center h-[80px] sticky top-[0] border-b border-[#15151e] backdrop-blur bg-[#0c0c13cb]">
            <div className="flex items-center justify-between max-w-[1100px] w-[90%]">
                <Image className="h-[55px] w-[55px]" src={icon} alt="Icon" />
                <CustomNavigationMenu />
                <button className="hidden md:block cursor-pointer text-[14px] pt-[8px] pb-[8px] pr-[20px] pl-[20px] bg-[#36577d] rounded-[10px] font-semibold transition duration-[0.2s] ease-in-out hover:bg-[#254161]">Iniciar sessão</button>
                <MenuMobile />
            </div>
        </header>
    )
}