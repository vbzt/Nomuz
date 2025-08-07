import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { motion } from "motion/react"

export default function Login() {
    return (
        <main style={{
            backgroundImage: `linear-gradient(#2727271c 1px, transparent 1px), linear-gradient(90deg, #2727271c 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
        }} className="flex flex-col min-h-[calc(100vh-65px)] items-center justify-start md:justify-center">
            <div className='flex items-start justify-center flex-col max-w-[400px] w-[90%]'>
                <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="mt-[20px] mb-[5px] scroll-m-20 text-center text-[24px] font-bold tracking-tight text-balance">Acesse sua conta</motion.h1>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.1 }} className="text-[#b3b3b3] mb-[30px] text-[14px]">Entre para gerenciar seus conteúdos com segurança.</motion.p>
                <form className="w-full">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.2 }} className="grid w-full items-center gap-3 mb-[20px]">
                          <Label htmlFor="email">Email</Label>
                        <Input type="email" id="email" placeholder="seuemail@email.com" className="bg-[#0c0c13]" />
                    </motion.div>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.3 }} className="grid w-full items-center gap-3 mb-[20px]">
                        <div className="w-full flex items-center justify-between">
                            <Label htmlFor="senha">Senha</Label>
                            <a href="/" className="text-[12px]">Esqueceu sua senha?</a>
                        </div>
                        <Input type="password" id="senha" placeholder="suasenha123" className="bg-[#0c0c13]" />
                    </motion.div>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.4 }} className="flex items-center gap-3 w-full mb-[20px]">
                        <Checkbox id="terms" />
                        <Label htmlFor="terms">Permanecer conectado</Label>
                    </motion.div>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }}>
                        <Button className="mb-[20px] w-full bg-[#36577d] hover:bg-[#254161]" type="submit">Entrar</Button>
                    </motion.div>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.6 }} className="text-[14px] mb-[20px]">Não possui uma conta? <a className="underline" href="/auth/register">Crie uma</a></motion.p>
                </form>
            </div>
        </main>
    )
}