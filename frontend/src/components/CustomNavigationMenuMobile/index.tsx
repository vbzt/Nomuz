import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { TbBook2 } from "react-icons/tb";

export default function CustomNavigationMenuMobile() {
    const itemsServices = [
        {
            title: 'Teste',
            desc: 'É apenas um teste',
            icon: <TbBook2 />,
            link: '/'
        },
        {
            title: 'Teste',
            desc: 'É apenas um teste',
            icon: <TbBook2 />,
            link: '/'
        }
    ]

    function handleNavigate(link: string) {
        window.location.href = `${link}`
    }

    return (
        <>
            <a className="w-full text-[15px] border border-[#15151e] p-[8px] rounded-[10px] mb-[10px]" href="/">Início</a>
            <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
                <AccordionItem value="item-1">
                    <AccordionTrigger className="w-full text-[15px] border border-[#15151e] p-[8px] rounded-[10px] mb-[10px]">Serviços</AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4 text-balance">
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
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            <a className="w-full text-[15px] border border-[#15151e] p-[8px] rounded-[10px] mb-[10px]" href="/">Blog</a>
            <a className="w-full text-[15px] border border-[#15151e] p-[8px] rounded-[10px] mb-[10px]" href="/">Termos</a>
        </>
    )
}