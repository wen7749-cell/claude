import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSessionUser } from '@/lib/user'

export async function GET() {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const profile = await db.storyProfile.findUnique({ where: { userId: user.id } })
  return NextResponse.json(profile ?? null)
}

export async function PUT(req: NextRequest) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name, birthYear, location, bio } = await req.json() as {
    name: string
    birthYear: string
    location: string
    bio: string
  }

  const profile = await db.storyProfile.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      name,
      birthYear: birthYear ? parseInt(birthYear) : null,
      location: location || null,
      bio: bio || null,
    },
    update: {
      name,
      birthYear: birthYear ? parseInt(birthYear) : null,
      location: location || null,
      bio: bio || null,
    },
  })
  return NextResponse.json(profile)
}
