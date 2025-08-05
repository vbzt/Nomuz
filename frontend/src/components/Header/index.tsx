import Image from "next/image"
import icon from '../../../public/icon.png'
import { Button } from "@/components/ui/button"

export default function Header() {
    return (
        <header className="flex items-center justify-center h-[80px] sticky top-[0]">
            <div className="flex items-center justify-between max-w-[1100px] w-[90%]">
                <Image className="h-[50px] w-[50px]" src={icon} alt="Icon" />
            </div>
        </header>
    )
}