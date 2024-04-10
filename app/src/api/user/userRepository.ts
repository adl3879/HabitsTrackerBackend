import { eq } from 'drizzle-orm';

import db from '@/common/db';
import { InsertUser, User, users } from '@/common/db/schema/user';

export const userRepository = {
  findByEmail: async (email: string) => {
    return db.select().from(users).where(eq(users.email, email));
  },

  findAll: async (): Promise<User[]> => {
    return db.select().from(users);
  },

  insertUser: async (newUser: InsertUser) => {
    return db.insert(users).values(newUser).returning();
  },
};
