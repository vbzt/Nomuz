import { apiFetch } from "./client";

export async function getCurrentUser() {
  return apiFetch('/auth/me')
}

export async function register(data: { name: string, email: string, password: string, confirmPassword: string, laywerRegistration?: string }, file?: File) {
  
  const formData = new FormData()
  formData.append("email", data.email)
  formData.append("name", data.name)
  formData.append("password", data.password)
  formData.append("confirmPassword", data.confirmPassword)

  if(data.laywerRegistration) formData.append("laywerRegistration", data.laywerRegistration)
  if(file) formData.append("file", file)
    
  const res = await apiFetch('/auth/register', { method: 'POST', body: formData })
  return res

}

export async function login(email: string, password: string) {
  return apiFetch('/auth/login', { method: "POST", body: JSON.stringify( { email, password } ) } )
}