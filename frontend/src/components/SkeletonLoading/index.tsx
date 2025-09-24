interface SkeletonProps {
    width: number,
    height: number,
    marginLeft?: number,
    marginRight?: number,
    marginBottom?: number,
    marginTop?: number
}

export default function SkeletonLoading({ width, height, marginBottom, marginLeft, marginRight, marginTop }: SkeletonProps) {

    return (
        <div style={{ width: `${width}px`, height: `${height}px`, marginBottom: `${marginBottom}px`, marginLeft: `${marginLeft}px`, marginRight: `${marginRight}px`, marginTop: `${marginTop}px` }} className="rounded-[10px] bg-[#15151f] animate-pulse" />
    )
}   