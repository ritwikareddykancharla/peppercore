import { clerkMiddleware, getAuth } from '@hono/clerk-auth'
import type { Context } from 'hono'

export const authMiddleware = clerkMiddleware()

export const getAuthUser = (c: Context) => {
  const auth = getAuth(c)
  return auth
}

export const requireAuth = (c: Context) => {
  const auth = getAuth(c)
  if (!auth?.userId) {
    return null
  }
  return auth
}

export const getOrCreateUser = async (c: Context, db: typeof import('../../db').db) => {
  const auth = requireAuth(c)
  if (!auth?.userId) return null
  
  const { users } = await import('../../db/schema')
  const { eq } = await import('drizzle-orm')
  
  let user = await db.query.users.findFirst({
    where: eq(users.clerkId, auth.userId)
  })
  
  if (!user) {
    const clerkClient = c.get('clerk')
    const clerkUser = await clerkClient.users.getUser(auth.userId)
    
    const [newUser] = await db.insert(users).values({
      clerkId: auth.userId,
      email: clerkUser.emailAddresses[0]?.emailAddress || '',
      name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || undefined,
    }).returning()
    
    user = newUser
  }
  
  return user
}
