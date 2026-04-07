import bcrypt from 'bcrypt'

import { HttpError } from '../lib/http-error'
import { signAccessToken } from '../lib/jwt'
import * as userRepo from '../repositories/user.repository'
import type { LoginBody, RegisterBody } from '../schemas/auth'
import { loginBodySchema, registerBodySchema } from '../schemas/auth'

const SALT_ROUNDS = 10

function toPublicUser(user: {
  id: string
  name: string
  email: string
  createdAt: Date
  updatedAt: Date
}) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}

function issueSession(user: { id: string; email: string }) {
  return signAccessToken({ sub: user.id, email: user.email })
}

export async function register(raw: unknown) {
  const body: RegisterBody = registerBodySchema.parse(raw)

  const existing = await userRepo.findUserByEmail(body.email)
  if (existing) {
    throw new HttpError(409, 'User already exists')
  }

  const passwordHash = await bcrypt.hash(body.password, SALT_ROUNDS)
  const user = await userRepo.createUser({
    name: body.name,
    email: body.email,
    passwordHash,
  })

  const token = issueSession(user)
  return { ...toPublicUser(user), token }
}

export async function login(raw: unknown) {
  const body: LoginBody = loginBodySchema.parse(raw)

  const user = await userRepo.findUserByEmail(body.email)
  if (!user) {
    throw new HttpError(401, 'E-mail ou senha inválidos')
  }

  const ok = await bcrypt.compare(body.password, user.password)
  if (!ok) {
    throw new HttpError(401, 'E-mail ou senha inválidos')
  }

  const token = issueSession(user)
  return { ...toPublicUser(user), token }
}
