import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json() as {
    name: string
    email: string
    password: string
  }

  if (!email || !password) {
    return NextResponse.json({ error: 'メールアドレスとパスワードは必須です' }, { status: 400 })
  }
  if (password.length < 8) {
    return NextResponse.json({ error: 'パスワードは8文字以上にしてください' }, { status: 400 })
  }

  const existing = await db.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: 'このメールアドレスは既に登録されています' }, { status: 409 })
  }

  const passwordHash = await bcrypt.hash(password, 12)
  const user = await db.user.create({
    data: { name: name?.trim() || null, email, passwordHash },
  })

  return NextResponse.json({ id: user.id, email: user.email }, { status: 201 })
}
