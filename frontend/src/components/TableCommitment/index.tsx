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
import { Button } from "../ui/button";
import { TbEdit } from "react-icons/tb";

interface TableCommitmentsProps {
    client: string,
    status: 'pending' | 'completed' | 'cancelled',
    commitment: string,
    date: string,
}

export default function TableCommitments({ client, status, commitment, date }: TableCommitmentsProps) {
    return (
        <TableRow>
        <TableCell className="font-medium">{client}</TableCell>
                    <TableCell>
                        <article className={`
                            ${status === 'cancelled' && 'bg-[#c72e380c] text-[#c72e38] border-[#c72e38]'}
                            ${status === 'completed' && 'bg-[#1f88de0c] text-[#1f88de] border-[#1f88de]'}
                            ${status === 'pending' && 'bg-[#64646409] text-[#b3b3b3] border-[#15151e]'} 
                            ${"py-[3px] px-[8px] text-[12px] flex items-center justify-center max-w-[100px] w-full rounded-[10px] border"}`}>
                            {status === 'pending' && <TbLoader size={14} />}
                            {status === 'completed' && <TbCircleCheckFilled size={15} />}
                            {status === 'cancelled' && <TbCircleXFilled size={15}/>}
                            <p className="ml-[8px] mb-[0px]">
                                {status === 'pending' && 'Pendente'}
                                {status === 'completed' && 'Concluído'}
                                {status === 'cancelled' && 'Cancelado'}
                            </p>
                        </article>
                    </TableCell>
                    <TableCell>{commitment}</TableCell>
                    <TableCell className="text-right">{date}</TableCell>
                    <TableCell className="text-right">
                        <Button className="px-[10px] h-[30px] bg-[#0c0c13] border border-[#15151e] hover:bg-[#ffffff0a]"><TbEdit /> Editar</Button>
                    </TableCell>
        </TableRow>
    )
}