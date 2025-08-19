import SideBar from "@/components/SideBar"
import { SidebarTrigger, SidebarProvider } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { TbCheck } from "react-icons/tb";
import ConfirmationAlert from "@/components/ConfirmationAlert";
import StatisticsCard from "@/components/StatisticsCard";
import ChartStatistics from "@/components/ChartStatistics";

export default function Statistics() {
    return (
        <SidebarProvider>
            <main className="flex items-start justify-center flex-row w-full">
                <SideBar />
                <div className="p-[10px] border-r border-[#15151e] min-h-full">
                    <SidebarTrigger className="flex justify-center items-center bg-[#0c0c13] p-[6px] rounded-[10px] border border-[#15151e] h-9 w-9 transition duration-[0.2s] cursor-pointer ease-in-out hover:bg-[#ffffff0a] hover:text-[#fff] group" />
                </div>
                <div className="flex items-start justify-center flex-col p-[20px] w-full">
                    <h1 className="mb-[2px] scroll-m-20 text-center text-[20px] font-bold tracking-tight text-balance">Estatísticas</h1>
                    <p className="text-[#b3b3b3] mb-[20px] text-[12px]">Ambiente para conferir porcentagens do seu rendimento pessoal.</p>
                    <div className="w-full flex flex-col xl:flex xl:flex-row xl:items-center xl:justify-center xl:w-full xl:gap-[10px] xl:mb-[10px]">
                        <StatisticsCard
                            title="Conversas"
                            desc="Aumentou esse mês"
                            value={12}
                            percentage={10}
                            isGain={true}
                            isFinancial={false}
                        />
                        <StatisticsCard
                            title="Ganhos"
                            desc="Isso é um teste"
                            value={1500}
                            percentage={10}
                            isGain={true}
                            isFinancial={true}
                        />
                        <StatisticsCard
                            title="Teste"
                            desc="Isso é um teste"
                            value={150}
                            percentage={10}
                            isGain={true}
                            isFinancial={true}
                        />
                        <StatisticsCard
                            title="Teste"
                            desc="Isso é um teste"
                            value={150}
                            percentage={10}
                            isGain={false}
                            isFinancial={false}
                        />
                    </div>
                    <div className="w-full flex flex-col items-center justify-center h-[400px] border border-[#15151e] rounded-[10px] p-[10px] overflow-x-auto md:overflow-x-visible">
                        <ChartStatistics />
                    </div>
                </div>
            </main>
        </SidebarProvider>
    )
}