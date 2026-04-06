import { z } from 'zod'

export const createCreditCardSchema = z.object({
  name: z.string().min(1),
  limit: z.number().positive(),
  closingDay: z.number().min(1).max(31),
  dueDay: z.number().min(1).max(31),
  isEnabled: z.boolean().optional().default(true),
})

export const updateCreditCardSchema = createCreditCardSchema.partial()
