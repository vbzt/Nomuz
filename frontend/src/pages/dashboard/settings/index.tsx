import SideBar from "@/components/SideBar"
import { SidebarTrigger, SidebarProvider } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { TbCheck } from "react-icons/tb";
import ConfirmationAlert from "@/components/ConfirmationAlert";

export default function Settings() {
    return (
        <SidebarProvider>
            <main className="flex items-start justify-center flex-row w-full">
                <SideBar />
                <div className="p-[10px] border-r border-[#15151e] min-h-full">
                    <SidebarTrigger className="flex justify-center items-center bg-[#0c0c13] p-[6px] rounded-[10px] border border-[#15151e] h-9 w-9 transition duration-[0.2s] cursor-pointer ease-in-out hover:bg-[#ffffff0a] hover:text-[#fff] group" />
                </div>
                <div className="flex items-start justify-center flex-col p-[20px] w-full">
                    <h1 className="mb-[2px] scroll-m-20 text-center text-[20px] font-bold tracking-tight text-balance">Configurações</h1>
                    <p className="text-[#b3b3b3] mb-[20px] text-[12px]">Altere suas preferências, gerencie sua conta e personalize sua experiência na plataforma.</p>
                    <div className="p-[20px] flex items-start justify-center flex-col border border-[#15151e] w-full rounded-[10px]">
                        <h1 className="text-[#b3b3b3] font-semibold text-[12px] mb-[10px]">Foto de perfil</h1>
                        <label htmlFor="inputImage">
                            <img className="rounded-full h-[80px] w-[80px] border borde-[#15151e] transition duration-[0.2s] cursor-pointer ease-in-out p-[6px] mb-[20px] hover:bg-[#ffffff0a] hover:brightness-60 hover:border-[#21212b]" src="/image.jpg" alt="" />
                        </label>
                        <input type="file" id="inputImage" className="hidden" />
                        <form className="w-full">
                            <h1 className="text-[#b3b3b3] font-semibold text-[12px] mb-[10px]">Nome de usuário</h1>
                            <div className="flex flex-row items-center justify-center mb-[20px]">
                                <Input required type="email" id="email" placeholder="seuemail@email.com" className="bg-[#0c0c13] h-9" />
                                <ConfirmationAlert
                                    title="Deseja mesmo alterar o nome de usuário?"
                                    desc="Essa ação fará com que seu nome de usuário seja alterado, você poderá alterar novamente mais tarde."
                                    btn={<Button className="bg-[#36577d] hover:bg-[#254161] w-9 h-9 ml-[10px]"><TbCheck /></Button>}
                                />
                            </div>
                        </form>
                        <form className="w-full">
                            <h1 className="text-[#b3b3b3] font-semibold text-[12px] mb-[10px]">E-mail</h1>
                            <div className="flex flex-row">
                                <Input required type="email" id="email" placeholder="seuemail@email.com" className="bg-[#0c0c13] mb-[0px] h-9" />
                                <ConfirmationAlert
                                    title="Deseja mesmo alterar seu E-mail?"
                                    desc="Essa ação fará com que seu e-mail de usuário seja alterado, você poderá alterar novamente mais tarde."
                                    btn={<Button className="bg-[#36577d] hover:bg-[#254161] w-9 h-9 ml-[10px]"><TbCheck /></Button>}
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </SidebarProvider>
    )
}