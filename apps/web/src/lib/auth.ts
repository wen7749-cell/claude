import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

// MVP scaffold: hardcoded test credentials only.
// Replace with DB lookup when Prisma is wired up.
const TEST_USER = { id: '1', name: 'テストユーザー', email: 'test@lifelink.local' }

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'テスト用ログイン',
      credentials: {
        email: { label: 'メールアドレス', type: 'email' },
        password: { label: 'パスワード', type: 'password' },
      },
      async authorize(credentials) {
        if (
          credentials?.email === TEST_USER.email &&
          credentials?.password === 'lifelink'
        ) {
          return TEST_USER
        }
        return null
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
}
