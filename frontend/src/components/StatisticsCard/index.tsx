import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { TbTrendingUp } from "react-icons/tb";
import { TbTrendingDown } from "react-icons/tb";

interface StatisticsProps {
    title: string,
    desc: string,
    value: number,
    percentage: number,
    isGain: boolean,
    isFinancial: boolean
}

export default function StatisticsCard({ title, desc, value, percentage, isGain, isFinancial }: StatisticsProps) {
    return (
        <Card className="mb-[10px] xl:w-full bg-[#0c0c13] border border-[#15151e] xl:mb-[0px]">
            <CardHeader className="flex flex-row justify-between items-center">
                <h1 className="text-[#b3b3b3]">{title}</h1>
                <h2 className={`${isGain === true ? "text-[#1f88de]" : "text-[#c72e38]"} ${"px-[10px] py-[2px] border border-[15151e] rounded-[10px] flex items-center justify-center text-[12px]"}`}>
                    {isGain === true ? <TbTrendingUp className="mr-[5px]" /> : <TbTrendingDown className="mr-[5px]" />}
                    {isGain === true ? "+" : "-"}{percentage}%
                </h2>
            </CardHeader>
            <CardContent>
                <h3 className="text-[25px] text-[#fff] font-[500]">
                    {isFinancial === true ? "R$" : ""}
                    {value}
                </h3>
            </CardContent>
            <CardFooter className="flex-col gap-2">
                <p className="w-full text-[#b3b3b3] text-[14px]">{desc}</p>
            </CardFooter>
        </Card>
    )
}