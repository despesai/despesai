import { z } from 'zod'

export const loginFormSchema = z.object({
  email: z.string().trim().email('E-mail inválido'),
  password: z.string().min(1, 'Informe a senha'),
})

export const registerFormSchema = z.object({
  name: z.string().trim().min(1, 'Informe seu nome'),
  email: z.string().trim().email('E-mail inválido'),
  password: z
    .string()
    .min(8, 'A senha deve ter pelo menos 8 caracteres'),
})

export type LoginFormValues = z.infer<typeof loginFormSchema>
export type RegisterFormValues = z.infer<typeof registerFormSchema>

export function fieldErrorsFromZod(
  error: z.ZodError,
): Partial<Record<string, string>> {
  const flat = error.flatten().fieldErrors
  const out: Partial<Record<string, string>> = {}
  for (const key of Object.keys(flat)) {
    const msgs = flat[key as keyof typeof flat]
    if (msgs?.[0]) {
      out[key] = msgs[0]
    }
  }
  return out
}
