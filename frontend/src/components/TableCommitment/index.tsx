import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import React from "react";
import { TbLoader } from "react-icons/tb";
import { TbCircleCheckFilled } from "react-icons/tb";
import { TbCircleXFilled } from "react-icons/tb";
import EditCommitmentDialog from "../EditCommitmentDialog";

interface TableCommitmentsProps {
    client: string,
    status: 'PENDING' | 'COMPLETED' | 'CANCELLED',
    commitment: string,
    email: string
    date: Date,
    commitmentId: string,
    fetchData: () => void
}

export default function TableCommitments({ client, status, commitment, date, email, commitmentId, fetchData }: TableCommitmentsProps) {
    const formattedDate = new Date(date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" })
    return (
        <TableRow>
            <TableCell className="font-medium">{client}</TableCell>
            <TableCell>
                <article className={`
                            ${status === 'CANCELLED' && 'bg-[#c72e380c] text-[#c72e38] border-[#c72e38]'}
                            ${status === 'COMPLETED' && 'bg-[#1f88de0c] text-[#1f88de] border-[#1f88de]'}
                            ${status === 'PENDING' && 'bg-[#64646409] text-[#b3b3b3] border-[#15151e]'} 
                            ${"h-[28px] w-[28px] flex items-center justify-center border rounded-[10px] lg:py-[3px] lg:px-[8px] lg:text-[12px] lg:flex lg:items-center lg:justify-center lg:max-w-[100px] lg:w-full lg:rounded-[10px] lg:border"}`}>
                    {status === 'PENDING' && <TbLoader size={14} />}
                    {status === 'COMPLETED' && <TbCircleCheckFilled size={15} />}
                    {status === 'CANCELLED' && <TbCircleXFilled size={15} />}
                    <p className="hidden lg:flex ml-[8px] mb-[0px]">
                        {status === 'PENDING' && 'Pendente'}
                        {status === 'COMPLETED' && 'Concluído'}
                        {status === 'CANCELLED' && 'Cancelado'}
                    </p>
                </article>
            </TableCell>
            <TableCell>{commitment}</TableCell>
            <TableCell className="text-right">{formattedDate}</TableCell>
            <TableCell className="text-right">
                <EditCommitmentDialog onEdit={fetchData} title={commitment} email={email} commitmentId={ commitmentId} status={status} dueDate={date}/>
            </TableCell>
        </TableRow>
    )
}