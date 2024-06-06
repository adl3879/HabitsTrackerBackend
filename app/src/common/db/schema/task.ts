import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const task = pgTable('task', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  status: text('status', { enum: ['todo', 'in_progress', 'done'] }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const selectTaskSchema = createSelectSchema(task);
export const insertTaskSchema = createInsertSchema(task);

export type Task = typeof task.$inferSelect;
export type InsertTask = typeof task.$inferInsert;
