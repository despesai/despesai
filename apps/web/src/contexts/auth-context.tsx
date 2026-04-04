'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import type { SessionUserDTO } from '@/lib/auth-api'
import {
  fetchSessionUser,
  loginRequest,
  logoutRequest,
  registerRequest,
} from '@/lib/auth-api'

export type SessionUser = {
  id: string
  name: string
  email: string
}

type AuthContextValue = {
  user: SessionUser | null
  isReady: boolean
  login: (email: string, password: string) => Promise<void>
  register: (input: {
    name: string
    email: string
    password: string
  }) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function toSessionUser(dto: SessionUserDTO): SessionUser {
  return { id: dto.id, name: dto.name, email: dto.email }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    queueMicrotask(async () => {
      try {
        const dto = await fetchSessionUser()
        if (dto) {
          setUser(toSessionUser(dto))
        }
      } finally {
        setIsReady(true)
      }
    })
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const dto = await loginRequest({ email, password })
    setUser(toSessionUser(dto))
  }, [])

  const register = useCallback(
    async (input: { name: string; email: string; password: string }) => {
      const dto = await registerRequest(input)
      setUser(toSessionUser(dto))
    },
    [],
  )

  const logout = useCallback(async () => {
    await logoutRequest()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      isReady,
      login,
      register,
      logout,
    }),
    [user, isReady, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
