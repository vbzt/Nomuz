import { apiFetch } from "./client";


export async function getChat(chatId:string) {
  return apiFetch(`/chats/${chatId}`, { method: "GET" } )
}

export async function createChat(recipientUserId: string) {
  return apiFetch('/chats', { method: "POST", body: JSON.stringify( { recipientUserId } ) } )
}

export async function getChats() {
  return apiFetch('/chats', { method: "GET"})
}

export async function sendMessage(chatId: string,){ 

}