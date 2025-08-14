import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import { TbBook2 } from "react-icons/tb";

export default function CustomNavigationMenu() {
    const itemsServices = [
        {
            title: 'Pacote de dados',
            desc: 'É um pacote só que de dados',
            icon: <TbBook2 />,
            link: '/'
        },
        {
            title: 'Pinto',
            desc: 'É apenas um teste',
            icon: <TbBook2 />,
            link: '/'
        },
        {
            title: 'Pinto',
            desc: 'É apenas um teste',
            icon: <TbBook2 />,
            link: '/'
        },
        {
            title: 'Pinto',
            desc: 'É apenas um teste',
            icon: <TbBook2 />,
            link: '/'
        }
    ]

    function handleNavigate(link: string) {
        window.location.href = `${link}`
    }

    return (
        <NavigationMenu viewport={false} className="hidden md:flex">
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                        <a href="/">Início</a>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Serviços</NavigationMenuTrigger>
                    <NavigationMenuContent className="bg-[#0c0c13] min-w-[250px] px-[8px] py-[8px]">
                        <ul className="flex items-center justify-center p-[0px] flex-col">
                            {itemsServices.map((item) => (
                                <li onClick={() => handleNavigate(item.link)} className="flex items-center justify-start p-1 rounded-[10px] flex-row w-[100%] hover:bg-[#36577d19] transition duration-[0.2s] cursor-pointer ease-in-out mb-[8px] last:mb-[0px]">
                                    <p className="text-[30px] mr-[10px] text-[#aaaaaa] p-[5px] bg-[#5757570a] rounded-[10px] border border-[#15151e]">{item.icon}</p>
                                    <div className="flex items-start justify-start flex-col">
                                        <h1 className="text-[14px] text-[#fff]">{item.title}</h1>
                                        <p className="text-[10px] text-[#b3b3b3]">{item.desc}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                        <a href="/blog">Blog</a>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                        <a href="/blog">Termos</a>
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}