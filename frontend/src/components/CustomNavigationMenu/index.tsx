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
import { Link } from "lucide-react"

export default function CustomNavigationMenu() {
    return (
        <NavigationMenu viewport={false} className="hidden md:flex">
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                        <a href="/">Inicio</a>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Serviços</NavigationMenuTrigger>
                    <NavigationMenuContent className="bg-[#0c0c13]">
                        <ul>
                            <li className="flex items-center justify-center flex-row"></li> 
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