'use client'

import { useRouter } from 'next/navigation'
import { type FormEvent, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/auth-context'
import { getApiErrorMessage } from '@/lib/api-error'
import {
  fieldErrorsFromZod,
  loginFormSchema,
} from '@/lib/schemas/auth'

export default function Login() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<string, string>>
  >({})
  const [formError, setFormError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setFormError(null)
    setFieldErrors({})

    const parsed = loginFormSchema.safeParse({ email, password })
    if (!parsed.success) {
      setFieldErrors(fieldErrorsFromZod(parsed.error))
      return
    }

    setPending(true)
    try {
      await login(parsed.data.email, parsed.data.password)
      router.push('/dashboard')
    } catch (err) {
      setFormError(getApiErrorMessage(err))
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Faça login com a sua conta</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <FieldSet className="w-full max-w-xs">
              {formError ? (
                <FieldError className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2">
                  {formError}
                </FieldError>
              ) : null}
              <FieldGroup>
                <Field data-invalid={fieldErrors.email ? true : undefined}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    value={email}
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="name@mail.com"
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={pending}
                  />
                  {fieldErrors.email ? (
                    <FieldError>{fieldErrors.email}</FieldError>
                  ) : null}
                </Field>
                <Field data-invalid={fieldErrors.password ? true : undefined}>
                  <FieldLabel htmlFor="password">Senha</FieldLabel>
                  <Input
                    value={password}
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={pending}
                  />
                  {fieldErrors.password ? (
                    <FieldError>{fieldErrors.password}</FieldError>
                  ) : null}
                </Field>
              </FieldGroup>
              <Button
                className="cursor-pointer"
                variant="default"
                type="submit"
                disabled={pending}
              >
                {pending ? 'Entrando…' : 'Entrar'}
              </Button>
              <Button
                className="cursor-pointer"
                variant="secondary"
                type="button"
                disabled={pending}
                onClick={() => router.push('/register')}
              >
                Criar nova conta
              </Button>
            </FieldSet>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
