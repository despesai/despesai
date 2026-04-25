import { TransactionRepository } from '../repositories/transaction.repository'
import {
  createTransactionSchema,
  updateTransactionSchema,
} from '../schemas/transaction'
import { HttpError } from '../lib/http-error'

export class TransactionService {
  private repository = new TransactionRepository()

  async createTransaction(userId: string, data: any) {
    const parsedData = createTransactionSchema.parse(data)
    return this.repository.create({ ...parsedData, userId })
  }

  async listTransactions(userId: string, type?: 'INCOME' | 'EXPENSE') {
    return this.repository.findManyByUserId(userId, type)
  }

  async getTransaction(
    id: string,
    userId: string,
    type?: 'INCOME' | 'EXPENSE'
  ) {
    const transaction = await this.repository.findById(id, userId)

    if (!transaction || (type && transaction.type !== type)) {
      throw new HttpError(404, 'Transação não encontrada')
    }
    return transaction
  }

  async updateTransaction(
    id: string,
    userId: string,
    data: any,
    type: 'INCOME' | 'EXPENSE'
  ) {
    await this.getTransaction(id, userId, type)
    const parsedData = updateTransactionSchema.parse(data)
    return this.repository.update(id, parsedData)
  }

  async deleteTransaction(
    id: string,
    userId: string,
    type: 'INCOME' | 'EXPENSE'
  ) {
    await this.getTransaction(id, userId, type)
    return this.repository.delete(id)
  }
}
