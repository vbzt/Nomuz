import Chat from '@/components/Chat';
import { motion } from "motion/react"
import { Button } from '@/components/ui/button';
import { FaArrowRight } from "react-icons/fa6";
import { TbExternalLink } from "react-icons/tb";
import { useEffect } from 'react';

export default function HomePage() {

  return (
    <main style={{
      backgroundImage: `linear-gradient(#2727271c 1px, transparent 1px), linear-gradient(90deg, #2727271c 1px, transparent 1px)`,
      backgroundSize: '80px 80px',
    }} className="flex items-center justify-center flex-col min-h-[calc(100vh-65px)]">
      <div className='flex items-center justify-center flex-col max-w-[1000px] w-[90%]'>
        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} style={{ lineHeight: 1 }} className='text-[60px] md:text-[80px] font-bold text-start mb-[20px] mt-[20px]'>Nomuz security</motion.h1>
        <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.1 }} className='text-[30px] md:text-[45px] mb-[20px] font-bold text-start bg-gradient-to-r from-[#4677af] via-[#345c8a]/80 via-90% to-[#456b96] bg-clip-text text-transparent'>Sua melhor opção de segurança</motion.h2>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.2 }} className='text-start md:text-[#b3b3b3] max-w-[700px] mb-[25px] md:text-center'>Plataforma segura e prática para advogados organizarem processos, agendas e dados confidenciais com agilidade e proteção total.</motion.p>
        <div className='w-full md:flex-column md:flex items-center justify-center flex-row '>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.3 }}>
            <Button className='group w-full mb-[10px] md:flex items-center justify-center bg-[#36577d] hover:bg-[#254161] mr-[5px] transition duration-200 ease-in-out md:mb-[0px]'>Começar agora<FaArrowRight className='ml-0 transition-all duration-200 ease-in-out group-hover:ml-[10px]' /></Button>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.4 }}>
            <Button className='group w-full mb-[20px] md:transition duration-200 ease-in-out bg-[#0c0c13] border border-[#15151e] hover:bg-[#ffffff0a] md:ml-[5px] md:mb-[0px]'>Saiba mais <TbExternalLink className='ml-0 transition-all duration-200 ease-in-out group-hover:ml-[10px]' /></Button>
          </motion.div>
        </div>
      </div>
    </main>
  )
}