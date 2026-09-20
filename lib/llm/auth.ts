import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';

export async function authenticateUser(name: string, password: string) {
  const [user] = await db.select().from(users).where(eq(users.name, name)).limit(1);
  if (!user) return null;

  return user.password === password ? user : null;
}
