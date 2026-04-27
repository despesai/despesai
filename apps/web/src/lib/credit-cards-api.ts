import { apiDelete,apiGet, apiPost } from './api-client'

export interface Bank {
  id: string
  name: string
}

export interface CreditCard {
  id: string
  name: string
  limit: number
  closingDay: number
  dueDay: number
  bankId: string
  isEnabled: boolean
  bank?: Bank
}

export interface CreateCreditCardDTO {
  name: string
  limit: number
  closingDay: number
  dueDay: number
  bankId: string
}

export const creditCardsApi = {
  list: async (): Promise<CreditCard[]> => {
    return await apiGet<CreditCard[]>('/credit-cards')
  },

  create: async (data: CreateCreditCardDTO): Promise<CreditCard> => {
    return await apiPost<CreditCard>('/credit-cards', data)
  },

  listBanks: async (): Promise<Bank[]> => {
    return await apiGet<Bank[]>('/banks')
  },
  
  delete: async (id: string): Promise<void> => {
    return await apiDelete(`/credit-cards/${id}`);
  }
}
