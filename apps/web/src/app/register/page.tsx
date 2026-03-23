'use client'

import { useRouter } from 'next/navigation'
import { ChangeEvent, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

function Register() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event?.target?.value)
  }

  const handleChangeEmail = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event?.target?.value)
  }

  const handleChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event?.target?.value)
  }

  const handleCreateAccount = () => {
    const user = {
      name,
      email,
      password,
    }

    fetch('http://localhost:3002/user', {
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

  const handleLogin = () => {
    router.push('/login')
  }

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Crie sua conta</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldSet className="w-full max-w-xs">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Nome</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="João da Silva"
                  value={name}
                  onChange={handleChangeName}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@mail.com"
                  value={email}
                  onChange={handleChangeEmail}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Senha</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={handleChangePassword}
                />
              </Field>
            </FieldGroup>
            <Button
              className="cursor-pointer"
              variant="default"
              onClick={handleCreateAccount}
            >
              Cadastrar
            </Button>
            <Button
              className="cursor-pointer"
              variant="secondary"
              onClick={handleLogin}
            >
              Fazer login
            </Button>
          </FieldSet>
        </CardContent>
      </Card>
    </div>
  )
}

export default Register
