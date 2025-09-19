import { apiFetch } from "./client";

export function getCommitments(){ 
  return apiFetch('/dashboard/commitments', { method: 'GET' })
}

export function createCommitment(email: string, title: string, dueDate?: Date){ 
  return apiFetch('/dashboard/commitments', { method: 'POST', body: JSON.stringify( { email, dueDate, title } ) })
}