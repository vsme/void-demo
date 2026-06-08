import { defineHandler } from 'void';
import { db, desc } from 'void/db';
import { messages } from '@schema';

export const GET = defineHandler(async () => {
  return await db
    .select()
    .from(messages)
    .orderBy(desc(messages.createdAt))
    .limit(20);
});

export const POST = defineHandler(async (c) => {
  const input = await c.req.json<{ author?: string; body?: string }>();
  const author = input.author?.trim() || 'Anonymous';
  const body = input.body?.trim();

  if (!body) {
    return c.json({ error: 'Message body is required' }, 400);
  }

  const [created] = await db
    .insert(messages)
    .values({ author, body })
    .returning();

  return created;
});
