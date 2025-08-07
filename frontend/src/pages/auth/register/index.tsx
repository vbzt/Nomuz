import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function Register() {
    const [step, setStep] = useState(1)
    const [isLawyer, setIsLawyer] = useState<string | null>(null)

    function handleNext() { setStep((prev) => prev + 1) }
    function handleBack() { setStep((prev) => prev - 1) }

    return (
        <main style={{
            backgroundImage: 'linear-gradient(#2727271c 1px, transparent 1px), linear-gradient(90deg, #2727271c 1px, transparent 1px)',
            backgroundSize: '80px 80px',
        }} className="flex flex-col min-h-[calc(100vh-65px)] items-center justify-start md:justify-center">
            <div className='flex items-start justify-center flex-col max-w-[400px] w-[90%]'>
                <div className="w-full mt-[20px] flex items-center justify-between gap-2">
                    {[1, 2, 3].map((index) => (
                        <div key={index} className={`h-[4px] w-full rounded-full transition-all duration-300 ${step >= index ? "bg-[#36577d]" : "bg-[#2c2c2c] opacity-50"}`}/>
                    ))}
                </div>
                <h1 className="mt-[20px] mb-[5px] scroll-m-20 text-center text-[24px] font-bold tracking-tight text-balance">Crie sua conta</h1>
                <p className="text-[#b3b3b3] mb-[30px] text-[14px]">Aproveite a melhor segurança do mercado.</p>
                <form className="w-full">
                    {step === 1 && (
                        <>
                            <div className="grid w-full items-center gap-3 mb-[20px]">
                                <Label htmlFor="email">Email</Label>
                                <Input type="email" id="email" placeholder="seuemail@email.com" className="bg-[#0c0c13]" />
                            </div>
                            <div className="grid w-full items-center gap-3 mb-[20px]">
                                <Label htmlFor="nome">Nome</Label>
                                <Input type="text" id="nome" placeholder="Seu Nome" className="bg-[#0c0c13]" />
                            </div>
                        </>
                    )}
                    {step === 2 && (
                        <>
                            <div className="grid w-full items-center gap-3 mb-[20px]">
                                <Label htmlFor="senha">Senha</Label>
                                <Input type="password" id="senha" placeholder="suasenha123" className="bg-[#0c0c13]" />
                            </div>
                            <div className="grid w-full items-center gap-3 mb-[20px]">
                                <Label htmlFor="confirmsenha">Confirmar senha</Label>
                                <Input type="password" id="confirmsenha" placeholder="suasenha123" className="bg-[#0c0c13]" />
                            </div>
                        </>
                    )}
                    {step === 3 && (
                        <>
                            <div className="grid w-full items-center gap-3 mb-[20px]">
                                <Label htmlFor="confirmsenha">Você exerce a profissão de advogado(a)?</Label>
                                <Select onValueChange={(value) => setIsLawyer(value)}>
                                    <SelectTrigger className="w-full bg-[#0c0c13]">
                                        <SelectValue placeholder="Escolha uma opção..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="true">Sim</SelectItem>
                                            <SelectItem value="false">Não</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            {isLawyer === "true" && (
                                <>
                                    <div className="grid w-full items-center gap-3 mb-[20px]">
                                        <Label htmlFor="cpf">CPF</Label>
                                        <Input type="text" id="cpf" placeholder="000000000-00" className="bg-[#0c0c13]" />
                                    </div>
                                    <div className="grid w-full items-center gap-3 mb-[20px]">
                                        <Label htmlFor="oab">ID OAB</Label>
                                        <Input type="text" id="oab" placeholder="Certificado OAB" className="bg-[#0c0c13]" />
                                    </div>
                                </>
                            )}
                            <div className="flex items-center gap-3 w-full mb-[20px]">
                                <Checkbox id="terms" />
                                <Label htmlFor="terms">Concordo com termos e condições</Label>
                            </div>
                        </>
                    )}
                    {step > 1 && (
                        <Button onClick={handleBack} className="mb-[20px] w-full bg-[#0c0c13] border border-[#15151e] hover:bg-[#ffffff0a]" type="button">Voltar</Button>
                    )}
                    {step < 3 && (
                        <Button onClick={handleNext} className="mb-[20px] w-full bg-[#36577d] hover:bg-[#254161]" type="button">Próximo</Button>
                    )}
                    {step === 3 && (
                        <Button className="mb-[20px] w-full bg-[#36577d] hover:bg-[#254161]" type="submit">Criar conta</Button>
                    )}
                    <p className="text-[14px] mb-[20px]">Já possui uma conta? <a className="underline" href="/auth/login">Entrar</a></p>
                </form>
            </div>
        </main>
    )
}