import { apiClient } from './api-client'

export interface Bank {
  id: string
  bankCode: string
  name: string
  agency: string
  accountNumber: string
  balance: number
  isActive: boolean
  userId: string
  createdAt?: string 
  updatedAt?: string
}

export interface CreateBankInput {
  bankCode: string
  name: string
  agency: string
  accountNumber: string
  balance: number
}

export const bankApi = {
  list: async (): Promise<Bank[]> => {
    const response = await apiClient.get('/banks')
    return response.data
  },
  create: async (data: CreateBankInput): Promise<Bank> => {
    const response = await apiClient.post('/banks', data)
    return response.data
  },
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/banks/${id}`)
  },
  update: async (id: string, data: Partial<CreateBankInput>): Promise<Bank> => {
  const response = await apiClient.put(`/banks/${id}`, data)
  return response.data
  },
}