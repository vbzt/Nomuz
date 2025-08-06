import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function Register() {
    const [inputLawyer, setInputLawyer] = useState(false)

    function handleEnableInputLawyer() {
        setInputLawyer(prevState => !prevState)
    }

    return (
        <main style={{
            backgroundImage: `linear-gradient(#27272721 1px, transparent 1px), linear-gradient(90deg, #27272721 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
        }} className="flex flex-col min-h-[calc(100vh-65px)] items-center justify-start md:justify-center">
            <div className='flex items-start justify-center flex-col max-w-[400px] w-[90%]'>
                <h1 className="mt-[20px] mb-[5px] scroll-m-20 text-center text-[24px] font-bold tracking-tight text-balance">Crie sua conta</h1>
                <p className="text-[#b3b3b3] mb-[30px] text-[14px]">Aproveite a melhor segurança do mercado.</p>
                <form className="w-full">
                    <div className="grid w-full items-center gap-3 mb-[20px]">
                        <Label htmlFor="email">Email</Label>
                        <Input type="email" id="email" placeholder="seuemail@email.com" className="bg-[#0c0c13]" />
                    </div>
                    <div className="grid w-full items-center gap-3 mb-[20px]">
                        <Label htmlFor="nome">Nome</Label>
                        <Input type="text" id="nome" placeholder="Seu Nome" className="bg-[#0c0c13]" />
                    </div>
                    <div className="grid w-full items-center gap-3 mb-[20px]">
                        <Label htmlFor="senha">Senha</Label>
                        <Input type="password" id="senha" placeholder="suasenha123" className="bg-[#0c0c13]" />
                    </div>
                    <div className="grid w-full items-center gap-3 mb-[20px]">
                        <Label htmlFor="confirmsenha">Confirmar senha</Label>
                        <Input type="password" id="confirmsenha" placeholder="suasenha123" className="bg-[#0c0c13]" />
                    </div>
                    <div className="flex items-center gap-3 w-full mb-[20px]">
                        <Checkbox checked={inputLawyer} onChange={handleEnableInputLawyer} id="terms" />
                        <Label htmlFor="terms">Você é um advogado?</Label>
                    </div>
                    {inputLawyer && (
                        <>
                            <div className="grid w-full items-center gap-3 mb-[20px]">
                                <Label htmlFor="cpf">CPF</Label>
                                <Input type="text" id="cpf" placeholder="000000000-00" className="bg-[#0c0c13]" />
                            </div>
                            <div className="grid w-full items-center gap-3 mb-[20px]">
                                <Label htmlFor="oab">ID OAB</Label>
                                <Input type="text" id="oab" placeholder="" className="bg-[#0c0c13]" />
                            </div>
                        </>
                    )}
                    <Button className="mb-[20px] w-full bg-[#36577d] hover:bg-[#254161]" type="submit">Entrar</Button>
                </form>
            </div>
        </main>
    )
}