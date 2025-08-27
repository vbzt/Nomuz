import { TbUsers } from "react-icons/tb";

interface ContentUserGroupProps {
    name_group: string,
    content_preview: string,
    time: string,
    notification: number
}

export default function ContentGroupUser({ name_group, content_preview, time, notification }: ContentUserGroupProps) {
    return (
        <div className="flex itemc-cemter justify-between flex-row w-full p-2.5 border mb-[10px] border-[#15151e] rounded-[10px] transition duration-[0.2s] cursor-pointer ease-in-out hover:bg-[#ffffff0a]">
            <div className="flex flex-row">
                <div className="flex items-center justify-center h-[50px] w-[50px] rounded-[5px] mr-[10px] bg-[#ffffff0a]">
                    <TbUsers size={20}/>
                </div>
                <div className="flex flex-col items-start justify-center">
                    <h1 className="text-[16.5px]">{name_group}</h1>
                    <p className="text-[12px] text-[#b3b3b3]">{content_preview}</p>
                </div>
            </div>
            <div className="flex flex-col items-end justify-center" >
                <h2 className="text-[10px] mb-[10px]">{time}</h2>
                <div className="rounded-full h-[20px] w-[20px] text-[12px] bg-[#3a773f] flex items-center justify-center">{notification}</div>
            </div>
        </div>
    )
}