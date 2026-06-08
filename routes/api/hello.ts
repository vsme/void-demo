import { defineHandler } from 'void';

export const GET = defineHandler(() => {
  return {
    message: 'Hello from Void',
    runtime: 'Cloudflare Workers via Void file routing',
    time: new Date().toISOString(),
  };
});
