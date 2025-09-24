import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface ConfirmationProps {
    title: string,
    desc: string,
    btn: React.ReactNode
    onConfirm: () => void
}

export default function ConfirmationAlert({ title, desc, btn, onConfirm }: ConfirmationProps) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {btn}
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-[#0c0c13] border border-[#15151e]">
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{desc}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="h-[35px] bg-[#0c0c13] border border-[#15151e] hover:bg-[#ffffff0a]">Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm} className="h-[35px] bg-[#36577d] hover:bg-[#254161]">Confirmar</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}