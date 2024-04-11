import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  password: text('password').notNull(),
  role: text('role', { enum: ['admin', 'user'] }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const selectUserSchema = createSelectSchema(users);

export const insertUserSchema = createInsertSchema(users, {
  email: (schema) =>
    schema.email.email({
      message: 'Invalid email address',
    }),
  password: (schema) =>
    schema.password.min(8, {
      message: 'Password must be at least 8 characters long',
    }),
  role: (schema) => schema.role.default('user'),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
