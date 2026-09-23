# 🚀 TaskTracker2026 — менеджер задач

![Tests](https://github.com/changemaind90/task-trecker2026-vibe-coded_human-/actions/workflows/test.yml/badge.svg)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)

🔗 **Live Demo:** [task-trecker2026-vibe-human.vercel.app](https://task-trecker2026-vibe-human.vercel.app)

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)

> 🧠 **Это пет-проект, созданный при помощи ИИ и человека.**
> Буду очень благодарен за структурированную критику и фидбек!
> *This app was created with AI and a human. Feedback is welcome!*

---

## 📋 О проекте

**TaskTracker** — это полнофункциональное веб-приложение для управления задачами, разработанное на современном стеке. Проект создавался с фокусом на:

- 🎯 **Чистую архитектуру** — DAL, DTO, Zod-схемы
- 🔐 **Безопасную авторизацию** — JWT + bcrypt + rate limiting
- 🎨 **Красивый UI** — shadcn/ui, тёмная тема, анимации
- 🗄️ **Мощную базу данных** — PostgreSQL + Prisma 7
- 📱 **Адаптивный дизайн** — работает на любых устройствах
- ⚙️ **CI/CD** — GitHub Actions, Docker, Vercel

---

## 🛠️ Технологический стек

### Frontend
| Технология | Назначение |
|------------|------------|
| **Next.js 16** | React-фреймворк для SSR и маршрутизации |
| **React 19** | UI-библиотека |
| **TypeScript** | Типизация и безопасность кода |
| **Tailwind CSS 4** | Утилитарная стилизация |
| **shadcn/ui** | Библиотека компонентов |
| **React Query** | Управление серверным состоянием |
| **Zod** | Валидация форм и API |
| **sonner** | Toast-уведомления |

### Backend
| Технология | Назначение |
|------------|------------|
| **Next.js API Routes** | Серверные эндпоинты |
| **Prisma 7** | ORM для работы с БД |
| **PostgreSQL (Neon)** | Реляционная база данных |
| **JWT + bcrypt** | Аутентификация и хеширование |
| **Rate limiting** | Защита от брутфорса |

### Инструменты
| Технология | Назначение |
|------------|------------|
| **pnpm** | Пакетный менеджер |
| **Vitest** | Unit-тесты |
| **ESLint + Prettier** | Линтинг и форматирование |
| **Docker** | Контейнеризация |
| **GitHub Actions** | CI (запуск тестов на push) |
| **Vercel** | Хостинг |

---

## ✨ Возможности

### 👤 Авторизация
- Регистрация с валидацией пароля (Zod)
- JWT-токены, bcrypt-хеширование
- Защита маршрутов через middleware
- Rate limiting на login (5/мин) и register (3/час)
- Подтверждение аккаунта через Telegram-бота

### 📝 Управление задачами
- ➕ Создание задач с заголовком и описанием
- 📋 Просмотр всех задач на дашборде
- ✏️ Редактирование задач
- 🗑️ Удаление с подтверждением
- 📊 Статусы: TODO / IN_PROGRESS / DONE
- 🎯 Приоритеты: LOW / MEDIUM / HIGH
- ⏱️ Автопроставление дат старта и завершения
- 🔍 Фильтры и поиск

### 📁 Проекты
- Создание, редактирование, удаление проектов
- Привязка задач к проектам
- Счётчик задач по каждому проекту

### 🎨 UX
- Тёмная тема с сохранением выбора
- Toast-уведомления (sonner)
- Анимации появления страниц
- Спиннеры на кнопках
- Красивые empty states
- Адаптивный лендинг

### 🏗️ Архитектура
- 🔄 **DAL** — отдельный слой работы с БД
- 📦 **DTO** — безопасная передача данных
- ✅ **Zod-схемы** — валидация всех входных данных
- 🛡️ **Middleware** — защита API и страниц
- ⚡ **React Query** — кэш, автообновление, retry

---

## 🚀 Быстрый старт

```bash
git clone https://github.com/changemaind90/task-trecker2026-vibe-coded_human-.git
cd task-trecker2026-vibe-coded_human-
pnpm install
cp .env.example .env
# Заполни DATABASE_URL и JWT_SECRET
pnpm exec prisma migrate dev --name init
pnpm dev
```

Открой [http://localhost:3000](http://localhost:3000).

---

## 🧪 Тесты

```bash
pnpm test        # watch-режим (для разработки)
pnpm test:run    # один прогон (для CI)
```

---

## 🐳 Запуск через Docker

### Режим разработки

```bash
pnpm docker:dev
```

### Режим продакшена

```bash
pnpm docker:build
pnpm docker:prod
```

### Остановка контейнеров

```bash
pnpm docker:down
```

---

## 📁 Структура проекта

```
src/
├── app/
│   ├── api/            # API Routes (auth, tasks, projects, telegram)
│   ├── dashboard/      # Задачи
│   ├── projects/       # Проекты
│   ├── login/          # Вход
│   ├── register/       # Регистрация
│   ├── layout.tsx      # Корневой layout + metadata
│   ├── error.tsx       # Error Boundary
│   ├── loading.tsx     # Loading UI
│   └── page.tsx        # Лендинг
├── components/
│   ├── ui/             # shadcn/ui компоненты
│   ├── Navbar.tsx
│   ├── CreateTaskDialog.tsx
│   ├── EditTaskDialog.tsx
│   ├── TaskFilters.tsx
│   ├── ConfirmDialog.tsx
│   ├── StatsPieChart.tsx
│   ├── ThemeToggle.tsx
│   └── HomeButton.tsx
├── hooks/
│   ├── useTasks.ts
│   └── useProjects.ts
├── lib/
│   ├── auth.ts
│   ├── env.ts
│   ├── prisma.ts
│   ├── rate-limit.ts
│   └── schemas/        # Zod-схемы
└── tests/              # Vitest-тесты
```

---

## 🔐 Безопасность

- **Пароли:** bcrypt (10 rounds)
- **Сессия:** JWT с expiry 7 дней
- **Валидация:** Zod на всех API-роутах
- **Rate limiting:** login (5/мин), register (3/час)
- **Security headers:** HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- **Middleware:** защита `/dashboard`, `/projects`, `/api/*`

---

## 📄 Лицензия

MIT

---

## 📞 Контакты

**Автор:** Роман Богданов
**GitHub:** [@changemaind90](https://github.com/changemaind90)
**Telegram:** [@Roman_4udo](https://t.me/Roman_4udo)


---

# 🇬🇧 English Version

# 🚀 TaskTracker2026 — Task Manager

![Tests](https://github.com/changemaind90/task-trecker2026-vibe-coded_human-/actions/workflows/test.yml/badge.svg)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)

🔗 **Live Demo:** [task-trecker2026-vibe-human.vercel.app](https://task-trecker2026-vibe-human.vercel.app)

> 🧠 **This is a pet project created by AI and a human.**
> Feedback and structured criticism are welcome!

---

## 📋 About the Project

**TaskTracker** is a full-featured task management web app built on a modern stack. The project focuses on:

- 🎯 **Clean architecture** — DAL, DTO, Zod schemas
- 🔐 **Secure authentication** — JWT + bcrypt + rate limiting
- 🎨 **Beautiful UI** — shadcn/ui, dark theme, animations
- 🗄️ **Powerful database** — PostgreSQL + Prisma 7
- 📱 **Responsive design** — works on any device
- ⚙️ **CI/CD** — GitHub Actions, Docker, Vercel

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **Next.js 16** | React framework for SSR and routing |
| **React 19** | UI library |
| **TypeScript** | Type safety |
| **Tailwind CSS 4** | Utility-first styling |
| **shadcn/ui** | Component library |
| **React Query** | Server state management |
| **Zod** | Form and API validation |
| **sonner** | Toast notifications |

### Backend
| Technology | Purpose |
|------------|---------|
| **Next.js API Routes** | Server endpoints |
| **Prisma 7** | ORM for database access |
| **PostgreSQL (Neon)** | Relational database |
| **JWT + bcrypt** | Authentication and hashing |
| **Rate limiting** | Brute-force protection |

### Tools
| Technology | Purpose |
|------------|---------|
| **pnpm** | Package manager |
| **Vitest** | Unit tests |
| **ESLint + Prettier** | Linting and formatting |
| **Docker** | Containerization |
| **GitHub Actions** | CI (tests on push) |
| **Vercel** | Hosting |

---

## ✨ Features

### 👤 Authentication
- Registration with password validation (Zod)
- JWT tokens, bcrypt hashing
- Route protection via middleware
- Rate limiting on login (5/min) and register (3/hour)
- Account confirmation via Telegram bot

### 📝 Task Management
- ➕ Create tasks with title and description
- 📋 View all tasks on dashboard
- ✏️ Edit tasks
- 🗑️ Delete with confirmation
- 📊 Statuses: TODO / IN_PROGRESS / DONE
- 🎯 Priorities: LOW / MEDIUM / HIGH
- ⏱️ Auto-set start and completion dates
- 🔍 Filters and search

### 📁 Projects
- Create, edit, delete projects
- Link tasks to projects
- Task counter per project

### 🎨 UX
- Dark theme with persistence
- Toast notifications (sonner)
- Page transition animations
- Button spinners
- Empty states
- Responsive landing page

### 🏗️ Architecture
- 🔄 **DAL** — separate data access layer
- 📦 **DTO** — safe data transfer
- ✅ **Zod schemas** — validation of all input
- 🛡️ **Middleware** — API and page protection
- ⚡ **React Query** — caching, auto-refresh, retry

---

## 🚀 Quick Start

```bash
git clone https://github.com/changemaind90/task-trecker2026-vibe-coded_human-.git
cd task-trecker2026-vibe-coded_human-
pnpm install
cp .env.example .env
# Fill in DATABASE_URL and JWT_SECRET
pnpm exec prisma migrate dev --name init
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 🧪 Tests

```bash
pnpm test        # watch mode
pnpm test:run    # single run (for CI)
```

---

## 🐳 Docker

### Development mode

```bash
pnpm docker:dev
```

### Production mode

```bash
pnpm docker:build
pnpm docker:prod
```

### Stop containers

```bash
pnpm docker:down
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/            # API Routes (auth, tasks, projects, telegram)
│   ├── dashboard/      # Tasks
│   ├── projects/       # Projects
│   ├── login/          # Sign in
│   ├── register/       # Sign up
│   ├── layout.tsx      # Root layout + metadata
│   ├── error.tsx       # Error Boundary
│   ├── loading.tsx     # Loading UI
│   └── page.tsx        # Landing
├── components/
│   ├── ui/             # shadcn/ui components
│   ├── Navbar.tsx
│   ├── CreateTaskDialog.tsx
│   ├── EditTaskDialog.tsx
│   ├── TaskFilters.tsx
│   ├── ConfirmDialog.tsx
│   ├── StatsPieChart.tsx
│   ├── ThemeToggle.tsx
│   └── HomeButton.tsx
├── hooks/
│   ├── useTasks.ts
│   └── useProjects.ts
├── lib/
│   ├── auth.ts
│   ├── env.ts
│   ├── prisma.ts
│   ├── rate-limit.ts
│   └── schemas/        # Zod schemas
└── tests/              # Vitest tests
```

---

## 🔐 Security

- **Passwords:** bcrypt (10 rounds)
- **Session:** JWT with 7-day expiry
- **Validation:** Zod on all API routes
- **Rate limiting:** login (5/min), register (3/hour)
- **Security headers:** HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- **Middleware:** protection for `/dashboard`, `/projects`, `/api/*`

---

## 📄 License

MIT

---

## 📞 Contacts

**Author:** Roman Bogdanov
**GitHub:** [@changemaind90](https://github.com/changemaind90)
**Telegram:** [@Roman_4udo](https://t.me/Roman_4udo)