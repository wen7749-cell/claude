import { getServerSession } from 'next-auth'
import { authOptions } from './auth'
import { db } from './db'

export async function getSessionUser() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return null

  return db.user.upsert({
    where: { email: session.user.email },
    create: { email: session.user.email, name: session.user.name ?? null },
    update: {},
  })
}
