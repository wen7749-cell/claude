import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSessionUser } from '@/lib/user'

export async function GET() {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const events = await db.lifeEvent.findMany({
    where: { userId: user.id },
    orderBy: [{ year: 'asc' }, { createdAt: 'asc' }],
  })
  return NextResponse.json(events)
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { year, title, description } = await req.json() as {
    year: string
    title: string
    description: string
  }

  const event = await db.lifeEvent.create({
    data: {
      userId: user.id,
      year: year ? parseInt(year) : null,
      title,
      description: description || null,
    },
  })
  return NextResponse.json(event, { status: 201 })
}
