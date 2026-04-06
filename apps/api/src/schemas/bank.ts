import { z } from 'zod'

export const createBankSchema = z.object({
  bankCode: z
    .string()
    .trim()
    .length(3, 'O código deve ter exatamente 3 dígitos')
    .regex(/^\d{3}$/, 'O código deve conter apenas números'),
  name: z
    .string()
    .trim()
    .min(2, 'O nome da instituição deve ter pelo menos 2 caracteres')
    .max(100, 'O nome da instituição é muito longo'),
  agency: z
    .string()
    .trim()
    .min(1, 'A agência é obrigatória')
    .max(10, 'O número da agência excede o tamanho máximo'),
  accountNumber: z
    .string()
    .trim()
    .min(1, 'O número da conta é obrigatório')
    .max(20, 'O número da conta excede o tamanho máximo'),
  balance: z.number().default(0),
  isActive: z.boolean().default(true),
})

export const updateBankSchema = createBankSchema.partial()

export type CreateBankBody = z.infer<typeof createBankSchema>
export type UpdateBankBody = z.infer<typeof updateBankSchema>
