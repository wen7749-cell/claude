import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSessionUser } from '@/lib/user'

export async function GET() {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const answers = await db.selfAnswer.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'asc' },
  })
  return NextResponse.json(answers)
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { promptId, promptText, answer } = await req.json() as {
    promptId: number
    promptText: string
    answer: string
  }

  const created = await db.selfAnswer.create({
    data: { userId: user.id, promptId, promptText, answer },
  })
  return NextResponse.json(created, { status: 201 })
}
