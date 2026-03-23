'use client'

import { useRouter } from 'next/navigation'
import { ChangeEvent, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleChangeEmail = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event?.target?.value)
  }

  const handleChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event?.target?.value)
  }

  const handleCreateAccount = () => {
    router.push('/register')
  }

  const handleLogin = () => {
    const user = {
      email,
      password,
    }

    fetch('http://localhost:3002/user/me', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    })
      .then((response) => response.json())
      .then((data) => {
        data?.name && router.push(`/?username=${data?.name}`)
      })
      .catch((error) => console.error('Error:', error))
  }

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Faça login com a sua conta</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldSet className="w-full max-w-xs">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  value={email}
                  id="email"
                  type="email"
                  placeholder="name@mail.com"
                  onChange={handleChangeEmail}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Senha</FieldLabel>
                <Input
                  value={password}
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  onChange={handleChangePassword}
                />
              </Field>
            </FieldGroup>
            <Button
              className="cursor-pointer"
              variant="default"
              onClick={handleLogin}
            >
              Entrar
            </Button>
            <Button
              className="cursor-pointer"
              variant="secondary"
              onClick={handleCreateAccount}
            >
              Criar nova conta
            </Button>
          </FieldSet>
        </CardContent>
      </Card>
    </div>
  )
}
