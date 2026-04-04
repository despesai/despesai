import prisma from '../lib/prisma'

export async function createUser(input: {
  name: string
  email: string
  passwordHash: string
}) {
  return prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      password: input.passwordHash,
    },
  })
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } })
}

export async function findUserByIdPublic(id: string) {
  return prisma.user.findUnique({
    where: { id },
    omit: { password: true },
  })
}
