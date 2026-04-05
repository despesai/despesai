import * as repo from '../repositories/credit-card.repository'
import { createCreditCardSchema, updateCreditCardSchema } from '../schemas/credit-card'
import { HttpError } from '../lib/http-error'

export async function createCard(userId: string, raw: unknown) {
  const data = createCreditCardSchema.parse(raw)
  
  return repo.createCreditCard({
    ...data,
    userId,
  })
}

export async function listCards(userId: string) {
  return repo.findManyCreditCardsByUserId(userId)
}

export async function updateCard(id: string, userId: string, raw: unknown) {
  const card = await repo.findCreditCardByIdAndUserId(id, userId)
  
  if (!card) {
    throw new HttpError(404, 'Cartão de crédito não encontrado')
  }

  const data = updateCreditCardSchema.parse(raw)
  
  return repo.updateCreditCard(id, data)
}

export async function deleteCard(id: string, userId: string) {
  const card = await repo.findCreditCardByIdAndUserId(id, userId)
  
  if (!card) {
    throw new HttpError(404, 'Cartão de crédito não encontrado')
  }

  return repo.deleteCreditCard(id)
}