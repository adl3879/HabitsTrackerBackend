import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

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
  id: (schema) => schema.id.positive(),
  email: (schema) => schema.email.email(),
  role: z.string(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
