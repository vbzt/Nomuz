import Chat from '@/components/Chat';
import { motion } from "motion/react"
import { Button } from '@/components/ui/button';
import { FaArrowRight } from "react-icons/fa6";
import { IoIosInformationCircleOutline } from "react-icons/io";

export default function HomePage() {
  return (
    <main className="flex items-center justify-center flex-col min-h-[calc(100vh-65px)]">
      <div className='flex items-center justify-center flex-col max-w-[1000px] w-[90%]'>
        <h1 className='text-[80px] font-bold mb-[0px]'>Nomuz security</h1>
        <h2 className='text-[45px] mb-[20px] font-bold bg-gradient-to-r from-[#4677af] via-[#345c8a]/80 via-90% to-[#456b96] bg-clip-text text-transparent'>Sua melhor opção de segurança</h2>
        <p className='text-[#b3b3b3] max-w-[700px] text-center mb-[20px]'>Plataforma segura e prática para advogados organizarem processos, agendas e dados confidenciais com agilidade e proteção total.</p>
        <div className='flex items-center justify-center flex-row'>
          <Button className='group flex items-center justify-center bg-[#36577d] hover:bg-[#254161] mr-[5px] transition duration-200 ease-in-out'>Começar agora<FaArrowRight className='ml-0 transition-all duration-200 ease-in-out group-hover:ml-[10px]'/></Button>
          <Button className='group transition duration-200 ease-in-out ml-[5px] bg-[#0c0c13] border border-[#15151e] hover:bg-[#ffffff0a]'>Saiba mais <IoIosInformationCircleOutline className='ml-0 transition-all duration-200 ease-in-out group-hover:ml-[10px]'/></Button>
        </div>
      </div>
    </main>
  )
}