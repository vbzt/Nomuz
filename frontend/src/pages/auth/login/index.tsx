import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { motion } from "motion/react"
import { useAuth } from "@/../context/AuthContext"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

export default function Login() {
    const { login }= useAuth()
    const router = useRouter()
    const searchParams = useSearchParams()

    const [ email, setEmail ]= useState("")
    const [ password, setPassword ] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            await login(email, password)
            const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"
            router.push(callbackUrl)
        } catch (e:any) {
            setError(e.message) 
        }finally{
            setLoading(false)
        }
    }

    return (
        <main style={{
            backgroundImage: `linear-gradient(#2727271c 1px, transparent 1px), linear-gradient(90deg, #2727271c 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
        }} className="flex flex-col min-h-[calc(100vh-65px)] items-center justify-start md:justify-center">
            <div className='flex items-start justify-center flex-col max-w-[400px] w-[90%]'>
                <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="mt-[20px] mb-[5px] scroll-m-20 text-center text-[24px] font-bold tracking-tight text-balance">Acesse sua conta</motion.h1>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.1 }} className="text-[#b3b3b3] mb-[30px] text-[14px]">Entre para gerenciar seus conteúdos com segurança.</motion.p>
                <form onSubmit={handleSubmit} className="w-full">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.2 }} className="grid w-full items-center gap-3 mb-[20px]">
                          <Label htmlFor="email">Email</Label>
                        <Input value={email} type="email" id="email" placeholder="seuemail@email.com" className="bg-[#0c0c13]" onChange={(e) => setEmail(e.target.value)}  />
                    </motion.div>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.3 }} className="grid w-full items-center gap-3 mb-[20px]">
                        <div className="w-full flex items-center justify-between">
                            <Label htmlFor="senha">Senha</Label>
                            <a href="/" className="text-[12px]">Esqueceu sua senha?</a>
                        </div>
                        <Input value={password} type="password" id="senha" placeholder="suasenha123" className="bg-[#0c0c13]" onChange={(e) => setPassword(e.target.value)} />
                    </motion.div>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.4 }} className="flex items-center gap-3 w-full mb-[20px]">
                        <Checkbox id="terms" />
                        <Label htmlFor="terms">Permanecer conectado</Label>
                    </motion.div>
                    {error && (
                        <p className="text-red-500 text-sm mb-3">{error}</p>
                    )}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }}>
                       <Button disabled={loading} className="mb-[20px] w-full bg-[#36577d] hover:bg-[#254161]" type="submit">{loading ? "Entrando..." : "Entrar"}</Button>

                    </motion.div>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.6 }} className="text-[14px] mb-[20px]">Não possui uma conta? <a className="underline" href="/auth/register">Crie uma</a></motion.p>
                </form>
            </div>
        </main>
    )
}