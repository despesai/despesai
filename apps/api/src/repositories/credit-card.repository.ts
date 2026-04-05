import prisma from '../lib/prisma'

export async function createCreditCard(input: {
  name: string
  limit: number
  closingDay: number
  dueDay: number
  userId: string
  isEnabled?: boolean
}) {
  return prisma.creditCard.create({
    data: {
      name: input.name,
      limit: input.limit,
      closingDay: input.closingDay,
      dueDay: input.dueDay,
      isEnabled: input.isEnabled ?? true,
      user: {
        connect: { id: input.userId },
      },
    },
  })
}

export async function findManyCreditCardsByUserId(userId: string) {
  return prisma.creditCard.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })
}

export async function findCreditCardByIdAndUserId(id: string, userId: string) {
  return prisma.creditCard.findFirst({
    where: { id, userId },
  })
}

export async function updateCreditCard(
  id: string,
  input: {
    name?: string
    limit?: number
    closingDay?: number
    dueDay?: number
    isEnabled?: boolean
  }
) {
  return prisma.creditCard.update({
    where: { id },
    data: input,
  })
}

export async function deleteCreditCard(id: string) {
  return prisma.creditCard.delete({
    where: { id },
  })
}
