import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { readFileSync } from 'fs';
import { Hono } from 'hono';
import { createSecureServer } from 'http2';

const app = new Hono();

app.use('/favicon.ico', serveStatic({ path: './favicon.ico' }))
app.use(async (c, next) => {
  const start = Date.now()
  await next()
  const end = Date.now()
  c.res.headers.set('X-Response-Time', `${end - start}`)
})

app.get('/', c => {
  return c.json({
    error:false,
    message: 'success',
    data:{
      name: 'FlixAPI'
    }
  });
});

const port = 3000;
console.log(`Server is running on https://localhost:${port}`);

serve({
  fetch: app.fetch,
  createServer: createSecureServer,
  serverOptions: {
    key: readFileSync('localhost-privkey.pem'),
    cert: readFileSync('localhost-cert.pem'),
  },
  port,
});
