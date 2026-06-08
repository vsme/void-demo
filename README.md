# Void Minimal Demo

这是一个最小化 Void demo：

- `vite.config.ts` 启用 `voidPlugin()`
- `void.json` 固定 Cloudflare Workers `compatibility_date`
- `routes/api/hello.ts` 提供文件路由 `GET /api/hello`
- `db/schema.ts` 定义 D1 数据表
- `db/migrations/20260605000100_create_messages.sql` 是部署用 SQL migration
- `routes/api/messages.ts` 通过 `void/db` 读写 D1
- `src/main.ts` 是普通 Vite 前端，会请求 `/api/messages`

## 运行

```sh
npm install
npm run db:migrate
npm run dev
```

如果你使用 pnpm，Void 本地 D1 会用到 `better-sqlite3`。首次安装后如果迁移提示 native binding 没有构建，执行：

```sh
pnpm rebuild better-sqlite3
npm run db:migrate
```

访问：

- App: `http://127.0.0.1:5173`
- API: `http://127.0.0.1:5173/api/hello`
- Messages API: `http://127.0.0.1:5173/api/messages`

开发早期也可以用下面命令直接把 schema 推到本地 D1，不生成 migration：

```sh
npm run db:push
```

## 部署

Void 仍处于 Private Beta。准备部署时使用本地安装的 CLI：

```sh
npx void auth login
npx void deploy
```
