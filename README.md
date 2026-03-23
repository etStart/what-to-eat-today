# 今天吃什么

一个移动优先的餐食规划 Web App，基于 `Vite + React + TypeScript + React Router + Tailwind CSS + TanStack Query + React Hook Form + Zod + Supabase`。

## 当前状态

当前前端已经可以正常运行和构建：

- 首页未登录示例态已完成
- 登录 / 注册页已完成（仅邮箱 + 密码）
- 菜谱库页已完成
- 新增菜谱页已完成
- 菜谱详情页已完成
- 7 天餐计划页已完成
- 图片上传前压缩已接入
- `npm run build` 已通过

目前还差真实 Supabase 环境变量和线上数据联调。

## 本地启动

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发环境

```bash
npm run dev
```

启动后默认打开 Vite 本地地址，一般是：

```text
http://localhost:5173
```

## 换电脑如何启动

如果你换了一台新电脑，按下面做就能把项目重新跑起来：

### 1. 拉代码

```bash
git clone https://github.com/etStart/what-to-eat-today.git
cd what-to-eat-today
```

### 2. 安装依赖

```bash
npm install
```

### 3. 新建 `.env.local`

复制 `.env.example`，然后新建一个 `.env.local` 文件：

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_SUPABASE_STORAGE_BUCKET=recipe-images
```

把真实值填进去。

### 4. 启动项目

```bash
npm run dev
```

### 5. 打开浏览器

```text
http://localhost:5173
```

## 不配 Supabase 能看什么

如果你还没有配置 `.env.local`，项目也可以启动，适合先看 UI：

- `/` 首页可以正常打开
- 首页会展示示例三餐数据
- 点击示例操作会跳转登录引导
- `/auth` 登录页可以正常打开
- 真实登录、上传、餐计划写入不会生效

## 配置 Supabase

如果要体验真实数据，请在项目根目录创建 `.env.local`，内容可参考 `.env.example`：

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_SUPABASE_STORAGE_BUCKET=recipe-images
```

最少需要填写：

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

`VITE_SUPABASE_STORAGE_BUCKET` 默认可以继续使用 `recipe-images`。

说明：

- `.env.local` 不会上传到 GitHub
- 换电脑后需要你自己重新创建一次
- 建议把 Supabase 的 URL 和 Publishable key 保存到密码管理器或私密笔记里

## 数据库与存储

Supabase SQL 草案在：

- `supabase/schema.sql`

包含：

- `profiles`
- `recipes`
- `meal_plans`
- RLS 策略
- 私有图片 bucket 策略

## 常用命令

### 开发模式

```bash
npm run dev
```

### 生产构建

```bash
npm run build
```

### 本地预览构建结果

```bash
npm run preview
```

## 当前已实现的产品规则

- 登录方式：仅邮箱 + 密码
- 未登录首页：展示示例三餐
- 菜谱类型：支持 `自己做 / 外卖`
- 图片上传：前端压缩后再上传
- 餐计划：支持 7 天日期切换和早餐 / 午餐 / 晚餐安排

## 说明

如果你只是想先看界面，直接运行 `npm run dev` 就行。
如果你想看真实登录、上传和餐计划联动，需要先补 `.env.local`。
