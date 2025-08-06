import Image from "next/image"
import icon from '../../../public/icon.png'
import { Button } from "@/components/ui/button"
import CustomNavigationMenu from "../CustomNavigationMenu"
import MenuMobile from "../MenuMobile"
import { TbSearch } from "react-icons/tb";
import { TbUser } from "react-icons/tb";

export default function Header() {
    return (
        <header className="flex items-center justify-center h-[65px] sticky top-[0] border-b border-[#15151e] backdrop-blur bg-[#0c0c13cb]">
            <div className="flex items-center justify-between max-w-[1000px] w-[90%]">
                <div className="flex items-center justify-center flex-row">
                    <Image className="h-[50px] w-[50px] mr-[15px]" src={icon} alt="Icon" />
                    <CustomNavigationMenu />
                </div>
                <div className="flex items-center justify-center flex-row">
                    <button onClick={() => window.location.href = '/login'} className="hidden md:flex items-center justify-between p-[6px] rounded-[10px] border border-[#15151e] ml-[10px] h-9 pl-[15px] pr-[15px] transition duration-[0.2s] cursor-pointer ease-in-out hover:bg-[#ffffff0a]">
                        <TbUser size={16} className="transition duration-[0.2s] ease-in-out text-[#b3b3b3] hover:text-[#fff]" />
                        <p className="text-[14px] ml-[10px]">Iniciar sessão</p>
                    </button>
                    <button className="hidden md:flex justify-center items-center p-[6px] rounded-[10px] border border-[#15151e] ml-[10px] h-9 w-9 transition duration-[0.2s] cursor-pointer ease-in-out hover:bg-[#ffffff0a]"><TbSearch size={18} className="transition duration-[0.2s] ease-in-out text-[#b3b3b3] hover:text-[#fff]" /></button>
                </div>
                <MenuMobile />
            </div>
        </header>
    )
}