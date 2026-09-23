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