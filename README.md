# TaskFlow

> Full-stack task management application — React + Node.js + PostgreSQL + Docker

Professional project management tool built with a clean architecture, JWT authentication, containerized deployment, and 19+ automated tests. Designed to demonstrate modern full-stack development practices.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, React Router 6, Axios |
| **Backend** | Node.js, Express, Prisma ORM, Zod |
| **Database** | PostgreSQL 16 |
| **Auth** | JWT (jsonwebtoken), bcryptjs |
| **Containerization** | Docker, Docker Compose |
| **Testing** | Vitest, Supertest |
| **Styling** | CSS Custom Properties, responsive design |

---

## Screenshots

> *(Add screenshots here — Login, Dashboard, Team Detail, Task list)*

| Page | Preview |
|------|---------|
| Login / Register | `![auth](screenshots/auth.png)` |
| Dashboard | `![dashboard](screenshots/dashboard.png)` |
| Teams | `![teams](screenshots/teams.png)` |
| Team Detail & Tasks | `![team-detail](screenshots/team-detail.png)` |

---

## Architecture

```
┌───────────────────────────────────────────────────┐
│                    Frontend                        │
│         React + Vite + React Router               │
│              http://localhost:3000                 │
├───────────────────────────────────────────────────┤
│                       API                          │
│            Express + JWT + Prisma                  │
│              http://localhost:4000                 │
├───────────────────────────────────────────────────┤
│                    Database                        │
│                    PostgreSQL                      │
│              localhost:5432                        │
└───────────────────────────────────────────────────┘
```

### Backend Architecture (Layered)

```
src/
├── controllers/     HTTP request handlers (parse request, call services, send response)
├── services/        Business logic layer (validation, orchestration)
├── repositories/    Data access layer (Prisma queries)
├── middlewares/     Auth, error handling, input validation (Zod)
├── routes/          Express route definitions
└── prisma/          Prisma client singleton
```

### Frontend Structure

```
src/
├── pages/           Route-level components (Login, Dashboard, Teams, etc.)
├── components/      Reusable UI (TaskCard, TaskForm, Navbar, etc.)
├── services/        Axios client, API functions
├── hooks/           Custom React hooks (useAuth)
└── layouts/         Layout wrappers (MainLayout)
```

---

## Database Schema

```
┌───────────────────┐     ┌───────────────────────┐
│       User        │     │     TeamMember         │
├───────────────────┤     ├───────────────────────┤
│ id (PK)           │────→│ userId (FK)            │
│ name              │     │ teamId (FK)            │
│ email (unique)    │     └───────┬───────────────┘
│ password (hashed) │             │
│ createdAt         │             │
└────────┬──────────┘             │
         │                       │
         │  ┌─────────────────┐  │
         │  │      Task       │  │
         │  ├─────────────────┤  │
         ├──│ assignedUserId  │  │
         │  │ teamId (FK)──────┘
         │  │ title           │
         │  │ description     │
         │  │ status          │
         │  │ priority        │
         │  │ createdAt       │
         │  └─────────────────┘
         │
┌────────┴──────────┐
│       Team        │
├───────────────────┤
│ id (PK)           │
│ name              │
│ description       │
│ createdAt         │
└───────────────────┘
```

### Relationships

- **User → Task**: One-to-Many (a user can be assigned to many tasks)
- **Team → Task**: One-to-Many (a team groups many tasks)
- **User ↔ Team**: Many-to-Many (through `TeamMember` join table)

---

## Features

### Authentication
- User registration with name, email, password
- Login with JWT token generation
- Password hashing with bcrypt (10 salt rounds)
- Protected routes (frontend + backend middleware)
- Auto-redirect on token expiration

### Dashboard
- Statistics cards: total tasks, completed, pending, active teams
- Task status distribution bar chart
- Search tasks by title or description
- Filter by status (todo / in progress / done)
- Pagination with page controls

### Team Management
- Create, edit, and delete teams
- Add/remove members by email
- View team member list with role chips
- Team-scoped task management

### Task Management
- Full CRUD (create, read, update, delete)
- Status workflow: Todo → In Progress → Done
- Priority levels: Low, Medium, High
- Assign tasks to team members
- Filter tasks by status within a team

---

## Quick Start

### Option 1: Docker (Recommended)

```bash
# Clone the repository
git clone <your-repo-url>
cd TaskFlow

# Start all services
docker-compose up --build
```

Then open **http://localhost:3000**

Services started:
| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| API | http://localhost:4000 |
| PostgreSQL | localhost:5432 |

### Option 2: Local Development

#### Prerequisites

- Node.js 20+
- Docker (for PostgreSQL — skip if you have PostgreSQL installed natively)
- npm

#### Setup

**1. Start PostgreSQL (via Docker — recommended)**

```bash
docker run -d --name taskflow-db \
  -e POSTGRES_USER=taskflow \
  -e POSTGRES_PASSWORD=taskflow123 \
  -e POSTGRES_DB=taskflow \
  -p 5432:5432 \
  postgres:16-alpine
```

> Skip this step if you have PostgreSQL installed natively.

**2. Backend**

```bash
cd backend
npm install
cp .env.example .env

# Edit backend/.env — set DATABASE_URL to your local PostgreSQL:
#   Docker:  postgresql://taskflow:taskflow123@localhost:5432/taskflow?schema=public
#   Native:  postgresql://postgres:yourpassword@localhost:5432/taskflow?schema=public

# Generate Prisma client and create tables
npx prisma generate
npx prisma db push

# Seed with demo data (admin@taskflow.com / admin123)
node prisma/seed.js

# Start backend on http://localhost:4000
npm run dev
```

**3. Frontend**

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**

#### Default credentials (after seeding)

```
Email:    admin@taskflow.com
Password: admin123
```

### Option 3: Deploy to Render (Production)

Deploy the backend as a **Web Service** and the frontend as a **Static Site** on [Render](https://render.com).

#### One-click deploy

| Service | Type | Guide |
|---------|------|-------|
| **PostgreSQL** | Managed DB | Create from Render Dashboard → Get `DATABASE_URL` |
| **Backend API** | Web Service | Connect GitHub repo → Set root as `backend` |
| **Frontend** | Static Site | Connect GitHub repo → Set root as `frontend` |

#### Backend (Web Service)

| Setting | Value |
|---------|-------|
| **Root Directory** | `backend` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm run start:prod` |

**Environment variables** (set in Render dashboard):

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | PostgreSQL URL from Render's DB dashboard |
| `JWT_SECRET` | Any secure random string (e.g., `openssl rand -hex 32`) |
| `FRONTEND_URL` | URL of your frontend Static Site (e.g., `https://taskflow.onrender.com`) |
| `NODE_ENV` | `production` |

#### Frontend (Static Site)

| Setting | Value |
|---------|-------|
| **Root Directory** | `frontend` |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |

**Environment variable:**

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | URL of your backend Web Service (e.g., `https://taskflow-api.onrender.com`) |

> The frontend reads `VITE_API_URL` at build time. If not set, it falls back to `/api` (for local dev with Vite proxy).

---

## Environment Variables

Create a `backend/.env` file (see `.env.example`):

| Variable | Description | Default (Docker) | Default (Local) |
|----------|-------------|-----------------|-----------------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://taskflow:taskflow123@db:5432/taskflow` | `postgresql://postgres:password@localhost:5432/taskflow` |
| `JWT_SECRET` | Secret key for JWT signing | `super-secret-key-change-in-production` | same |
| `JWT_EXPIRES_IN` | Token expiration duration | `7d` | same |
| `PORT` | API server port | `4000` | same |
| `NODE_ENV` | Environment mode | `production` | `development` |

---

## API Reference

All API endpoints are prefixed with `/api`. Protected routes require `Authorization: Bearer <token>` header.

### Auth

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | `{ name, email, password }` | Create a new account |
| `POST` | `/api/auth/login` | `{ email, password }` | Login and get JWT token |

### Users *(authenticated)*

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| `GET` | `/api/users/me` | — | Get current user profile |
| `PUT` | `/api/users/me` | `{ name?, email? }` | Update profile |
| `GET` | `/api/users` | — | List all users |

### Teams *(authenticated)*

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| `GET` | `/api/teams` | — | List user's teams |
| `POST` | `/api/teams` | `{ name, description? }` | Create a team |
| `PUT` | `/api/teams/:id` | `{ name, description? }` | Update team |
| `DELETE` | `/api/teams/:id` | — | Delete team |
| `POST` | `/api/teams/:id/members` | `{ userId }` | Add member |
| `DELETE` | `/api/teams/:id/members/:userId` | — | Remove member |

### Tasks *(authenticated)*

| Method | Endpoint | Body / Query | Description |
|--------|----------|-------------|-------------|
| `GET` | `/api/tasks` | `?teamId&status&priority&assignedUserId&search&page&limit` | List tasks with filters |
| `GET` | `/api/tasks/stats` | `?teamId` | Task statistics |
| `GET` | `/api/tasks/:id` | — | Get single task |
| `POST` | `/api/tasks` | `{ title, description?, status?, priority?, assignedUserId?, teamId }` | Create task |
| `PUT` | `/api/tasks/:id` | `{ title?, description?, status?, priority?, assignedUserId? }` | Update task |
| `DELETE` | `/api/tasks/:id` | — | Delete task |

### Task Filters (`GET /api/tasks`)

| Parameter | Type | Example |
|-----------|------|---------|
| `teamId` | number | `?teamId=1` |
| `status` | `todo \| in_progress \| done` | `?status=todo` |
| `priority` | `low \| medium \| high` | `?priority=high` |
| `assignedUserId` | number | `?assignedUserId=1` |
| `search` | string | `?search=deploy` |
| `page` | number (default: 1) | `?page=2` |
| `limit` | number (default: 10) | `?limit=20` |

---

## Testing

The project includes **19 integration tests** using Vitest + Supertest.

### Run tests

```bash
cd backend
npm install
npx prisma generate
npm test
```

> Tests require a running PostgreSQL database. Update `DATABASE_URL` in `backend/.env` to point to your local instance before running.

### Test coverage

```
✓ Auth API
  ✓ POST /api/auth/register - should register a new user
  ✓ POST /api/auth/register - should reject duplicate email
  ✓ POST /api/auth/register - should validate required fields
  ✓ POST /api/auth/login - should login with valid credentials
  ✓ POST /api/auth/login - should reject invalid password
  ✓ POST /api/auth/login - should reject non-existent email

✓ JWT Middleware
  ✓ GET /api/users/me - should reject without token
  ✓ GET /api/users/me - should reject invalid token
  ✓ GET /api/users/me - should return user profile with valid token

✓ Tasks API
  ✓ POST /api/teams - should create a team
  ✓ POST /api/tasks - should create a task
  ✓ PUT /api/tasks/:id - should update task status
  ✓ GET /api/tasks - should list tasks with pagination
  ✓ GET /api/tasks/stats - should return task statistics
  ✓ DELETE /api/tasks/:id - should delete a task
  ✓ DELETE /api/teams/:id - should delete a team
```

---

## Project Structure

```
TaskFlow/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # Database models
│   │   └── seed.js                # Initial data seeder
│   ├── src/
│   │   ├── controllers/           # Route handlers
│   │   ├── middlewares/           # Auth, validation, error handler
│   │   ├── repositories/          # Prisma queries
│   │   ├── routes/                # Express route definitions
│   │   ├── services/              # Business logic
│   │   ├── prisma/
│   │   │   └── client.js          # Prisma client singleton
│   │   ├── app.js                 # Express app setup
│   │   └── server.js              # Entry point
│   ├── tests/
│   │   └── api.test.js            # Integration tests (19 tests)
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── pages/                 # Login, Register, Dashboard, Teams, TeamDetail, Profile
│   │   ├── components/            # Navbar, TaskCard, TaskForm, TeamCard, TeamForm, etc.
│   │   ├── services/              # Axios API client
│   │   ├── hooks/                 # useAuth context
│   │   └── layouts/               # MainLayout
│   │   ├── App.jsx                # Routes configuration
│   │   ├── App.css                # Complete stylesheet
│   │   └── main.jsx               # Entry point
│   ├── Dockerfile
│   ├── nginx.conf                 # Nginx config (Docker)
│   └── package.json
├── docker-compose.yml             # PostgreSQL + Backend + Frontend
├── .gitignore
└── README.md
```

---

## Why This Project Stands Out

| Skill | Demonstrated In |
|-------|----------------|
| **PostgreSQL + Prisma ORM** | Database schema with relations (1:N, N:N), migrations, seeding |
| **SQL Relationships** | User-Task (1:N), Team-Task (1:N), User-Team (N:N via join table) |
| **JWT Authentication** | Token generation, verification middleware, protected routes |
| **Docker** | Multi-stage builds, Docker Compose orchestration, health checks |
| **Testing** | 19 integration tests with Vitest + Supertest |
| **Architecture** | Clean layered backend (controllers → services → repositories) |
| **REST API Design** | Consistent endpoints, query params, status codes, error handling |
| **Frontend Patterns** | Context API, custom hooks, protected routes, Axios interceptors |
| **Validation** | Zod schemas on all inputs, global error middleware |
| **Security** | Password hashing, env variables, CORS, token validation |

---

## Author

**Your Name** — [LinkedIn](https://linkedin.com/in/your-profile) · [GitHub](https://github.com/your-profile)

*Project built as a portfolio piece to demonstrate full-stack development with React, Node.js, PostgreSQL, Docker, and automated testing.*
