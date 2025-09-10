import { createContext, useContext, useEffect, useState } from "react"
import { getCurrentUser, login as apiLogin, register as apiRegister,  } from "@/lib/api/auth"
import { apiFetch } from "@/lib/api/client" 

interface User {
  id: string
  name: string
  email: string
  profilePicture: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: any, file?: File) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  me: () => Promise<User>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    refreshUser()
  }, [])

  async function refreshUser() {
    try {
      setLoading(true)
      const res = await getCurrentUser()
      setUser(res)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  async function me() {
    const user = await getCurrentUser()
    return user
  }

  async function login(email: string, password: string) {
    const logged = await apiLogin(email, password)
    await refreshUser()
    return logged
  }

  async function register(data: { name: string, email: string, password: string, confirmPassword: string, laywerRegistration?: string }, file?: File) {
    const registered = await apiRegister(data, file)
    await refreshUser()
    return registered
  }

  async function logout() {
    await apiFetch("/auth/logout", { method: "POST" })
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser, me }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}
