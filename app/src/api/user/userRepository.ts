import { eq } from 'drizzle-orm';

import db from '@/common/db';
import { InsertUser, User, users } from '@/common/db/schema/user';

export const userRepository = {
  async findByEmail(email: string) {
    return db.select().from(users).where(eq(users.email, email));
  },

  async findAll(): Promise<User[]> {
    return db.select().from(users);
  },

  async insertUser(newUser: InsertUser) {
    return db.insert(users).values(newUser).returning();
  },
};
