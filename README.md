# 🚀 TaskTracker2026 — Умный менеджер задач

## ✨ Современный таск-менеджер с авторизацией, проектами и интуитивным интерфейсом

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)

---

## 📋 О проекте

**TaskFlow** — это полнофункциональное веб-приложение для управления задачами, разработанное с использованием современного стека технологий. Проект создавался с фокусом на:

- 🎯 **Чистую архитектуру** — разделение логики (DAL, DTO, Zod-схемы)
- 🔐 **Безопасную авторизацию** — JWT + bcrypt
- 🎨 **Красивый UI** — shadcn/ui компоненты
- 🗄️ **Мощную базу данных** — PostgreSQL + Prisma ORM
- 📱 **Адаптивный дизайн** — работает на любых устройствах

---

## 🛠️ Технологический стек

### Frontend
| Технология | Назначение |
|------------|------------|
| **Next.js 16** | React-фреймворк для SSR и маршрутизации |
| **TypeScript** | Типизация и безопасность кода |
| **Tailwind CSS** | Утилитарная стилизация |
| **shadcn/ui** | Библиотека компонентов |
| **framer-motion** | Анимации интерфейса |

### Backend
| Технология | Назначение |
|------------|------------|
| **Next.js API Routes** | Серверные эндпоинты |
| **Prisma 7** | ORM для работы с БД |
| **PostgreSQL** | Реляционная база данных |
| **JWT + bcrypt** | Аутентификация и хеширование |

### Инструменты
| Технология | Назначение |
|------------|------------|
| **pnpm** | Пакетный менеджер |
| **ESLint + Prettier** | Линтинг и форматирование |
| **Git** | Контроль версий |
| **Docker** | Контейнеризация |

---

## ✨ Функциональные возможности

### 👤 Авторизация
- Регистрация и вход
- JWT-токены с хранением в localStorage
- Защита маршрутов через middleware
- Выход из системы

### 📝 Управление задачами
- ➕ **Создание** задач с заголовком и описанием
- 📋 **Просмотр** всех задач на дашборде
- ✏️ **Редактирование** статуса (TODO / IN_PROGRESS / DONE)
- 🗑️ **Удаление** задач
- 📊 **Фильтрация** по статусу и приоритету

### 🏗️ Архитектура
- 🔄 **DAL (Data Access Layer)** — отдельный слой работы с БД
- 📦 **DTO** — безопасная передача данных
- ✅ **Zod-схемы** — валидация всех входных данных
- 🛡️ **Middleware** — защита API и страниц

---

## 🚀 Быстрый старт

### 1️⃣ Клонируй репозиторий
```bash
git clone https://github.com/yourusername/taskflow.git
cd taskflow

## 🐳 Запуск через Docker

### Режим разработки
```bash
# Сборка и запуск
pnpm docker:dev

Режим продакшена
```bash
# Сборка образа
pnpm docker:build

# Запуск контейнера
```bash
pnpm docker:prod

# Остановка контейнера
```bash
pnpm docker:down