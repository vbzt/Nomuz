import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface TableCommitmentsProps {
    client: string,
    status: ['pending', 'completed', 'cancelled'],
    commitment: string,
    date: Date
}

export default function TableCommitments({ client, status, commitment, date }: TableCommitmentsProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">Cliente</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Compromisso</TableHead>
                    <TableHead className="text-right">Data</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell className="font-medium">{client}</TableCell>
                    <TableCell>
                        <span className="bg-[red] py-[3px] px-[8px] rounded-[10px]">
                            
                        </span>
                    </TableCell>
                    <TableCell>Credit Card</TableCell>
                    <TableCell className="text-right">$250.00</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    )
}