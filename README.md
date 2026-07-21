# QueuePress 🚀

## 🌐 Live Demo

- 🖥️ [Frontend](https://queue-press.vercel.app)

**A modern blog publishing platform with smart queue management, real-time updates, and secure authentication.**

---

## What is QueuePress?

QueuePress is a full-stack blogging platform that lets you write, schedule, and publish blog posts through an intelligent queue system. You get live notifications when your posts go live, all secured behind a robust authentication layer.

**Think of it as your personal publishing pipeline** — write your content, queue it up, and let QueuePress handle the rest while keeping you updated in real time.

---

## ✨ Features at a Glance

| Feature                   | Description                                  |
| ------------------------- | -------------------------------------------- |
| 📝 **Blog Editor**        | Clean, intuitive writing experience          |
| ⏳ **Publish Queue**      | Posts are processed reliably via a job queue |
| 🔔 **Live Notifications** | Real-time updates when posts go live         |
| 🔐 **Secure Auth**        | Sign-in/sign-up powered by Clerk             |
| 👤 **User Profiles**      | Persistent user data across sessions         |

---

## 🗂️ Project Structure

```
queuepress/
├── backend/      ← NestJS API server
└── frontend/     ← Next.js web app
```

### Backend handles:

- Blog management REST API
- User profile storage (MongoDB)
- Protected routes with Clerk auth guard
- Publish job queue (BullMQ + Redis)
- Real-time notifications (Socket.IO)

### Frontend handles:

- Sign-in / Sign-up flows (Clerk)
- Blog dashboard and editor UI
- Real-time UI updates via WebSocket
- API communication with the backend

---

## 🛠️ Tech Stack

**Backend**

> NestJS · MongoDB · Mongoose · BullMQ · Redis · Socket.IO · Clerk

**Frontend**

> Next.js · React · Clerk · Zustand · React Hook Form · Zod

**UI & Styling**

> Tailwind CSS · Radix UI · shadcn/ui

---

## ✅ Before You Begin

Make sure you have the following installed and ready:

- [ ] **Node.js** v18 or higher — [Download here](https://nodejs.org)
- [ ] **npm** — comes bundled with Node.js
- [ ] **MongoDB** — running locally or via a cloud provider like [MongoDB Atlas](https://www.mongodb.com/atlas)
- [ ] **Redis** — running locally or via [Redis Cloud](https://redis.io/cloud)
- [ ] **Clerk account** — for authentication keys — [Sign up free](https://clerk.com)

---

## ⚙️ Environment Setup

You will need to create two separate `.env` files — one for the backend and one for the frontend.

### 1. Backend `.env`

Create a file at `backend/.env` and add:

```env
MONGO_URI=mongodb://localhost:27017/queuepress
REDIS_HOST=localhost
REDIS_PORT=6379
CLERK_SECRET_KEY=your_clerk_secret_key
PORT=4444
```

### 2. Frontend `.env`

Create a file at `frontend/.env` and add:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
NEXT_PUBLIC_API_URL=http://localhost:4444/api
CLERK_SECRET_KEY=your_clerk_secret_key
```

> 💡 **Tip:** If a `frontend/.env.example` file exists in the repo, copy it and fill in your values instead.

---

## 📦 Installing Dependencies

Each app has its own dependencies, so install them separately:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

## ▶️ Running the App Locally

You will need **two terminal windows** — one for the backend and one for the frontend.

**Terminal 1 — Start the backend:**

```bash
cd backend
npm run start:dev
```

**Terminal 2 — Start the frontend:**

```bash
cd frontend
npm run dev
```

**Then open your browser and visit:**

```
http://localhost:1127
```

> 🔄 Both servers support hot reload, so changes you make will reflect automatically during development.

---

## 🧪 Running Tests

### Unit Tests

```bash
cd backend
npm run test
```

### End-to-End Tests

```bash
cd backend
npm run test:e2e
```

---

## 📋 Useful Commands Reference

### Backend

| Command              | What it does                                   |
| -------------------- | ---------------------------------------------- |
| `npm run start:dev`  | Start backend in development mode (hot reload) |
| `npm run start:prod` | Start the compiled production server           |
| `npm run build`      | Compile TypeScript to production build         |
| `npm run lint`       | Run ESLint to check for code issues            |
| `npm run test`       | Run unit tests                                 |
| `npm run test:e2e`   | Run end-to-end tests                           |

### Frontend

| Command         | What it does                         |
| --------------- | ------------------------------------ |
| `npm run dev`   | Start frontend in development mode   |
| `npm run build` | Build the Next.js app for production |
| `npm run start` | Start the production Next.js server  |
| `npm run lint`  | Run ESLint to check for code issues  |

---

## 🔑 Quick Reference — Key Details

- **Frontend URL:** `http://localhost:1127`
- **Backend API base:** `http://localhost:4444/api`
- **Auth provider:** Clerk (handles all sign-in/sign-up flows)
- **Database:** MongoDB (stores blogs and user records)
- **Queue backend:** Redis + BullMQ (required for publish jobs to work)
- **Real-time:** Socket.IO (live publish notifications)

---

## 🆘 Troubleshooting

<details>
<summary><strong>Posts aren't being published</strong></summary>

Redis is required for the publish queue to work. Make sure Redis is running before starting the backend:

```bash
# Check if Redis is running
redis-cli ping
# Expected response: PONG
```

</details>

<details>
<summary><strong>Can't connect to the database</strong></summary>

Verify your MongoDB instance is running and that the `MONGO_URI` in `backend/.env` is correct. If using MongoDB Atlas, make sure your IP address is whitelisted.

</details>

<details>
<summary><strong>Authentication isn't working</strong></summary>

Double-check that your Clerk keys are correct in both `.env` files. The **publishable key** goes in `frontend/.env` and the **secret key** goes in both files.

</details>

<details>
<summary><strong>Frontend can't reach the backend</strong></summary>

Make sure the backend is running on port `4444` and that `NEXT_PUBLIC_API_URL` in `frontend/.env` is set to `http://localhost:4444/api`.

</details>

---

## 📄 License

MIT License

---

<p align="center">Built with ❤️ using NestJS, Next.js, and a whole lot of queues.</p>
