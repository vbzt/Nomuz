import Chat from '@/components/Chat';
import { motion } from "motion/react"

export default function HomePage() {
  return (
    <main className="flex items-center justify-center flex-col min-h-[calc(100vh - 65px)]">
      <div className='flex items-center justify-between max-w-[1000px] w-[90%]'>
        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className='mt-[20px] scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance'>Penis</motion.h1>
      </div>
    </main>
  )
}