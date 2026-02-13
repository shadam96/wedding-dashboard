import { cookies } from 'next/headers'

const AUTH_COOKIE_NAME = 'wedding_auth'

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value
  return token === process.env.AUTH_TOKEN
}
