import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSessionUser } from '@/lib/user'

export async function GET() {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const connections = await db.connection.findMany({
    where: { userId: user.id },
    orderBy: [{ relationship: 'asc' }, { name: 'asc' }],
  })
  return NextResponse.json(connections)
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name, relationship, role, notes } = await req.json() as {
    name: string
    relationship: string
    role: string
    notes: string
  }

  const connection = await db.connection.create({
    data: {
      userId: user.id,
      name,
      relationship,
      role: role || null,
      notes: notes || null,
    },
  })
  return NextResponse.json(connection, { status: 201 })
}
