'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'

export default function DashboardPage() {
  const { user, isReady, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isReady && !user) {
      router.replace('/login')
    }
  }, [isReady, user, router])

  if (!isReady || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground text-sm">Carregando…</p>
      </div>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
      <p className="text-xl font-medium">{user.name}</p>
      <Button
        type="button"
        variant="secondary"
        className="cursor-pointer"
        onClick={async () => {
          await logout()
          router.push('/login')
        }}
      >
        Sair
      </Button>
    </main>
  )
}
