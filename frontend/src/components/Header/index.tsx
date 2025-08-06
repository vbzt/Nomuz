import Image from "next/image"
import icon from '../../../public/icon.png'
import { Button } from "@/components/ui/button"
import CustomNavigationMenu from "../CustomNavigationMenu"
import MenuMobile from "../MenuMobile"
import { TbSearch } from "react-icons/tb";

export default function Header() {
    return (
        <header className="flex items-center justify-center h-[65px] sticky top-[0] border-b border-[#15151e] backdrop-blur bg-[#0c0c13cb]">
            <div className="flex items-center justify-between max-w-[1100px] w-[90%]">
                <Image className="h-[50px] w-[50px]" src={icon} alt="Icon" />
                <CustomNavigationMenu />
                <div className="flex items-center justify-center flex-row">
                    <button onClick={() => window.location.href = '/login'} className="hidden md:block cursor-pointer text-[14px] pt-[6px] pb-[6px] pr-[20px] pl-[20px] h-8 bg-[#36577d] rounded-[10px] font-[600] transition duration-[0.2s] ease-in-out hover:bg-[#254161]">Iniciar sessão</button>
                    <button className="hidden md:block p-[6px] rounded-[10px] border border-[#15151e] ml-[10px] h-8 transition duration-[0.2s] cursor-pointer ease-in-out hover:bg-[#ffffff0a]"><TbSearch size={20}/></button>
                </div>
                <MenuMobile />
            </div>
        </header>
    )
}