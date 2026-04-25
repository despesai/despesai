import prisma from '../lib/prisma'
import { Prisma, TransactionType } from '../../generated/prisma/client'

export class TransactionRepository {
  async create(data: Prisma.TransactionUncheckedCreateInput) {
    return prisma.transaction.create({ data })
  }

  async findManyByUserId(userId: string, type?: TransactionType) {
    return prisma.transaction.findMany({
      where: {
        userId,
        ...(type ? { type } : {}),
      },
      orderBy: { date: 'desc' },
      include: { bank: true, creditCard: true },
    })
  }

  async findById(id: string, userId: string) {
    return prisma.transaction.findFirst({
      where: { id, userId },
    })
  }

  async update(id: string, data: Prisma.TransactionUncheckedUpdateInput) {
    return prisma.transaction.update({
      where: { id },
      data,
    })
  }

  async delete(id: string) {
    return prisma.transaction.delete({
      where: { id },
    })
  }
}
