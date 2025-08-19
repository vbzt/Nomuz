import { Bar, BarChart, CartesianGrid, XAxis, ResponsiveContainer } from "recharts"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
    { month: "Janeiro", financial: 186, interactions: 80 },
    { month: "Fevereiro", financial: 305, interactions: 200 },
    { month: "Março", financial: 237, interactions: 120 },
    { month: "Abril", financial: 73, interactions: 190 },
    { month: "Maio", financial: 209, interactions: 130 },
    { month: "Junho", financial: 214, interactions: 140 },
    { month: "Julho", financial: 0, interactions: 0 },
    { month: "Agosto", financial: 0, interactions: 0 },
    { month: "Setembro", financial: 0, interactions: 0 },
    { month: "Outubro", financial: 0, interactions: 0 },
    { month: "Novembro", financial: 0, interactions: 0 },
    { month: "Dezembro", financial: 0, interactions: 0 },
]
const chartConfig = {
    financial: {
        label: "Financeiro",
        color: "#36577d",
    },
    interactions: {
        label: "Interações",
        color: "#254161",
    },
} satisfies ChartConfig

export default function ChartStatistics() {
    return (
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false}/>
                <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="financial" fill="#36577d" radius={10} />
                <Bar dataKey="interactions" fill="#254161" radius={10} />
            </BarChart>
        </ChartContainer>
    )
}