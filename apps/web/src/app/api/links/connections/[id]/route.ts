import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSessionUser } from '@/lib/user'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name, relationship, role, notes } = await req.json() as {
    name: string
    relationship: string
    role: string
    notes: string
  }

  const updated = await db.connection.updateMany({
    where: { id: params.id, userId: user.id },
    data: { name, relationship, role: role || null, notes: notes || null },
  })
  if (updated.count === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const record = await db.connection.findUnique({ where: { id: params.id } })
  return NextResponse.json(record)
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await db.connection.deleteMany({ where: { id: params.id, userId: user.id } })
  return new NextResponse(null, { status: 204 })
}
