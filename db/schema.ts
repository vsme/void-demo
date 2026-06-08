import { sql } from 'void/db';
import { integer, sqliteTable, text } from 'void/schema-d1';

export const messages = sqliteTable('messages', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  author: text('author').notNull().default('Anonymous'),
  body: text('body').notNull(),
  createdAt: text('created_at')
    .notNull()
    .default(sql`(datetime('now'))`),
});
