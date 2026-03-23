'use client'

import { useRouter, useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui/button'

export default function Home() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const username = searchParams.get('username')

  if (!username) {
    router.push('/login')
    return
  }

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <p className="mr-4">Olá {username}</p>
      <Button
        className="cursor-pointer"
        variant="outline"
        onClick={() => router.push('/login')}
      >
        Sair
      </Button>
    </div>
  )
}
