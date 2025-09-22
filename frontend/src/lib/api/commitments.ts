import { apiFetch } from "./client";

export function getCommitments(){ 
  return apiFetch('/dashboard/commitments', { method: 'GET' })
}

export function createCommitment(email: string, title: string, dueDate?: Date){ 
  return apiFetch('/dashboard/commitments', { method: 'POST', body: JSON.stringify( { email, dueDate, title } ) })
}

export function editCommitment(id: string, email?: string, title?: string, dueDate?: Date, status?: string){ 
  return apiFetch(`/dashboard/commitments/${id}`, { method: 'PATCH', body: JSON.stringify( { email, dueDate, title, status } ) })
}