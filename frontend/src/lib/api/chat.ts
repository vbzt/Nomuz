import { apiFetch } from "./client";


export async function getChats(chatId:string) {
  return apiFetch(`/chats/${chatId}`, { method: "GET" } )
}

export async function createChat(recipientUserId: string) {
  return apiFetch('/chats', { method: "POST", body: JSON.stringify( { recipientUserId } ) } )
}