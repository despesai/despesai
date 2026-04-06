import { HttpError } from '../lib/http-error'
import * as bankRepo from '../repositories/bank.repository'
import { createBankSchema, updateBankSchema } from '../schemas/bank'

export async function create(userId: string, raw: unknown) {
  const data = createBankSchema.parse(raw)
  return bankRepo.createBank(userId, data)
}

export async function list(userId: string) {
  return bankRepo.findBanksByUser(userId)
}

export async function update(userId: string, bankId: string, raw: unknown) {
  const data = updateBankSchema.parse(raw)

  const bank = await bankRepo.findBankByIdAndUser(bankId, userId)
  if (!bank) {
    throw new HttpError(404, 'Conta bancária não encontrada')
  }

  return bankRepo.updateBank(bankId, data)
}

export async function remove(userId: string, bankId: string) {
  const bank = await bankRepo.findBankByIdAndUser(bankId, userId)
  if (!bank) {
    throw new HttpError(404, 'Conta bancária não encontrada')
  }

  await bankRepo.deleteBank(bankId)
  return { success: true }
}
