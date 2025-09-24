import { useRouter } from "next/router";
import { TbUsers } from "react-icons/tb";

interface ContentUserGroupProps {
    name_group: string,
    content_preview: string,
    time: string,
    notification: number,
    picture: string,
    id: string
}


export default function ContentMessageUser({ name_group, content_preview, time, notification, picture, id }: ContentUserGroupProps) {
    const router = useRouter()
    return (
        <div className="flex items-center justify-between flex-row w-full p-2 border mb-[10px] border-[#15151e] rounded-[10px] transition duration-[0.2s] cursor-pointer ease-in-out hover:bg-[#ffffff0a]" onClick={() => router.push(`/dashboard/interactions/${id}`) }>
            <div className="flex flex-row">
                <div className="flex items-center justify-center h-[45px] w-[45px] rounded-[5px] mr-[10px] bg-[#ffffff0a]">
                     <img src={picture} width={40} height={40} alt= 'User Profile Picture' className="h-[45px] w-[45px] rounded-[5px] "/>
                </div>
                <div className="flex flex-col items-start justify-center">
                    <h1 className="text-[15px]">{name_group}</h1>
                    <p className="text-[12px] text-[#b3b3b3] whitespace-nowrap overflow-hidden text-ellipsis max-w-[100px] md:max-w-[400px]">{content_preview}</p>
                </div>
            </div>
            <div className="flex flex-col items-end justify-start" >
                <h2 className="text-[10px] mb-[10px]">{time}</h2>
                { notification >= 1 && ( <div className="rounded-full h-[20px] w-[20px] text-[12px] bg-[#3a773f] flex items-center justify-center">{notification}</div> ) }
                {notification === 0 && (<div className="rounded-full h-[20px] w-[20px] text-[12px] bg-transparent flex items-center justify-center"></div>)}
            </div>
        </div>
    )
}

