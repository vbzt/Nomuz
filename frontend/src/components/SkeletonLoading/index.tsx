import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"

interface SkeletonProps {
    width: number,
    height: number,
    marginLeft?: number,
    marginRight?: number,
    marginBottom?: number,
    marginTop?: number
}

export default function SkeletonLoading({ width, height, marginBottom, marginLeft, marginRight, marginTop }: SkeletonProps) {
    function handlePenis() {
        toast("gosto de rebolar")
    }

    return (
        <Skeleton onClick={handlePenis} style={{ width: `${width}px`, height: `${height}px`, marginBottom: `${marginBottom}px`, marginLeft: `${marginLeft}px`, marginRight: `${marginRight}px`, marginTop: `${marginTop}px` }} className="rounded-[10px] bg-[#0c0c13]" />
    )
}