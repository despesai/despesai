import { z } from 'zod'

export const createTransactionSchema = z
  .object({
    description: z
      .string({ message: 'A descrição é obrigatória' })
      .min(1, { message: 'A descrição não pode estar vazia' }),

    amount: z
      .number({ message: 'O valor é obrigatório' })
      .positive({ message: 'O valor deve ser maior que zero' }),

    date: z.string().datetime({ message: 'Data inválida' }),

    type: z.enum(['INCOME', 'EXPENSE'], {
      message: 'Tipo de transação é obrigatório (INCOME ou EXPENSE)',
    }),

    bankId: z.string().uuid({ message: 'ID do banco inválido' }).optional(),

    creditCardId: z
      .string()
      .uuid({ message: 'ID do cartão inválido' })
      .optional(),
  })
  .refine(
    (data) => {
      return data.bankId || data.creditCardId
    },
    {
      message:
        'A transação deve estar associada a uma conta bancária ou cartão de crédito',
      path: ['bankId'],
    }
  )

export const updateTransactionSchema = z.object({
  description: z.string().min(1, 'A descrição não pode estar vazia').optional(),
  amount: z.number().positive('O valor deve ser maior que zero').optional(),
  date: z.string().datetime('Data inválida').optional(),
  type: z.enum(['INCOME', 'EXPENSE']).optional(),
  bankId: z.string().uuid('ID do banco inválido').optional(),
  creditCardId: z.string().uuid('ID do cartão inválido').optional(),
})

export type CreateTransactionBody = z.infer<typeof createTransactionSchema>
export type UpdateTransactionBody = z.infer<typeof updateTransactionSchema>
