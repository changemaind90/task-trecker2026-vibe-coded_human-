# 🚀 TaskTracker2026 — Умный менеджер задач

## ✨ Мои пет-проект для портфолио.

# Это приложение создано при помощи ИИ и человека.
# Буду очень благодарен за структурированную критику и фидбек!

# This app created with AI.
# If you want some feedback and critic - you are welcome!

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
# Сборка и запуск
pnpm docker:dev

# Сборка образа
pnpm docker:build

# Запуск контейнера
pnpm docker:prod

# Остановка контейнера
pnpm docker:down

🚀 TaskTracker2026 — Smart Task Manager
✨ My pet project for a portfolio.
This app was created by AI and a human.
I would be very grateful for structured criticism and feedback!
https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white
https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white
https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white
https://img.shields.io/badge/Tailwind-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white
https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=shadcnui&logoColor=white

📋 About the Project
TaskFlow is a full-featured web application for task management, built using a modern technology stack. The project was developed with a focus on:

🎯 Clean architecture — separation of logic (DAL, DTO, Zod schemas)

🔐 Secure authentication — JWT + bcrypt

🎨 Beautiful UI — shadcn/ui components

🗄️ Powerful database — PostgreSQL + Prisma ORM

📱 Responsive design — works on any device

🛠️ Tech Stack
Frontend
Technology	Purpose
Next.js 16	React framework for SSR and routing
TypeScript	Type safety and code reliability
Tailwind CSS	Utility-first styling
shadcn/ui	Component library
framer-motion	UI animations
Backend
Technology	Purpose
Next.js API Routes	Server endpoints
Prisma 7	ORM for database access
PostgreSQL	Relational database
JWT + bcrypt	Authentication and hashing
Tools
Technology	Purpose
pnpm	Package manager
ESLint + Prettier	Linting and formatting
Git	Version control
Docker	Containerization
✨ Features
👤 Authentication
Registration and login

JWT tokens stored in localStorage

Route protection via middleware

Sign out

📝 Task Management
➕ Create tasks with a title and description

📋 View all tasks on the dashboard

✏️ Edit status (TODO / IN_PROGRESS / DONE)

🗑️ Delete tasks

📊 Filter by status and priority

🏗️ Architecture
🔄 DAL (Data Access Layer) — a separate database access layer

📦 DTO — safe data transfer

✅ Zod schemas — validation of all input data

🛡️ Middleware — protection for APIs and pages

🚀 Quick Start
1️⃣ Clone the repository
bash
git clone https://github.com/yourusername/taskflow.git
cd taskflow
🐳 Running with Docker
Development mode
bash
# Build and run
pnpm docker:dev

# Build the image
pnpm docker:build

# Run the container
pnpm docker:prod

# Stop the container
pnpm docker:down