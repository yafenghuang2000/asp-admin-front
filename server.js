import express from 'express';
import { createServer as createViteServer } from 'vite';
import { render } from './dist/server/entry-server.js';

async function startServer() {
  const app = express();

  // 创建 Vite 开发服务器
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });

  // 使用 Vite 中间件
  app.use(vite.middlewares);

  // 处理 SSR 请求
  app.use('*', async (req, res) => {
    try {
      // 渲染应用
      const { html } = await render();
      // 注入渲染的 HTML 到模板中
      const template = await vite.transformIndexHtml(
        req.originalUrl,
        `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>SSR App</title>
          </head>
          <body>
            <div id="root">${html}</div>
            <script type="module" src="/src/entry-client.ts"></script>
          </body>
        </html>
      `,
      );
      res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
    } catch (e) {
      console.error(e);
      res.status(500).end('Internal Server Error');
    }
  });

  // 启动服务器
  app.listen(3000, () => {
    console.log('SSR Server is running on http://localhost:3000');
  });
}

startServer();
