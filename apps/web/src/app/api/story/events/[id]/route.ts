import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSessionUser } from '@/lib/user'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { year, title, description } = await req.json() as {
    year: string
    title: string
    description: string
  }

  const updated = await db.lifeEvent.updateMany({
    where: { id: params.id, userId: user.id },
    data: {
      year: year ? parseInt(year) : null,
      title,
      description: description || null,
    },
  })
  if (updated.count === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const record = await db.lifeEvent.findUnique({ where: { id: params.id } })
  return NextResponse.json(record)
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await db.lifeEvent.deleteMany({ where: { id: params.id, userId: user.id } })
  return new NextResponse(null, { status: 204 })
}
