import prisma from '../lib/prisma'
import type { Prisma } from '@prisma/client'

export async function createBank(
  userId: string,
  data: Prisma.BankCreateWithoutUserInput
) {
  return prisma.bank.create({
    data: {
      ...data,
      userId,
    },
  })
}

export async function findBanksByUser(userId: string) {
  return prisma.bank.findMany({
    where: {
      userId,
      isActive: true,
    },
  })
}

export async function findBankByIdAndUser(id: string, userId: string) {
  return prisma.bank.findFirst({
    where: {
      id,
      userId,
      isActive: true,
    },
  })
}

export async function updateBank(id: string, data: Prisma.BankUpdateInput) {
  return prisma.bank.update({
    where: { id },
    data,
  })
}

export async function deleteBank(id: string) {
  return prisma.bank.update({
    where: { id },
    data: { isActive: false },
  })
}
//remover verdadeiramente, ainda não utilizada
export async function trueDeleteBank(id: string) {
  return prisma.bank.delete({
    where: { id },
  })
}
