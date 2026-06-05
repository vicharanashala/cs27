# Samagama FAQ System

![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?style=flat&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat&logo=mongodb&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.x-010101?style=flat&logo=socket.io&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat&logo=vite&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

A full-stack, AI-powered collaborative FAQ and knowledge management platform built for interns at the **Vicharanashala Internship Programme (VINS), IIT Ropar**. The platform enables crowd-sourced FAQ generation, real-time discussion, intelligent search, and structured content moderation — all within a clean, responsive interface.

🔗 **Live Platform**: [faq-system-samagama.vercel.app](https://faq-system-samagama.vercel.app)

---

## 📌 Overview

Interns frequently ask the same questions across channels. The Samagama FAQ System solves this by giving the community a **single source of truth** — a live, searchable, community-maintained knowledge base backed by AI-assisted search and a structured admin moderation pipeline.

Rather than a static FAQ page, this is a **living platform** where interns ask, answer, upvote, and discuss — and admins promote the best answers directly into the official FAQ database.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────┐
│         React + Vite (Frontend)         │
│           Deployed on Vercel            │
└─────────────┬───────────────────────────┘
              │ HTTPS + WebSocket
┌─────────────▼───────────────────────────┐
│         Express.js API Server           │
│           Deployed on Railway           │
│                                         │
│  ┌─────────────┐  ┌──────────────────┐  │
│  │  REST APIs  │  │    Socket.IO     │  │
│  │ (Auth, FAQ, │  │  (Real-time      │  │
│  │  Search,    │  │  Notifications)  │  │
│  │  Questions) │  └──────────────────┘  │
│  └──────┬──────┘                        │
└─────────┼───────────────────────────────┘
          │ Mongoose ODM
┌─────────▼───────────────────────────────┐
│              MongoDB Atlas              │
│  Collections: users, faqs, questions,  │
│  answers, queries, notifications,      │
│  auditlogs                              │
└─────────────────────────────────────────┘
          │
┌─────────▼───────────────────────────────┐
│           Google Gemini API             │
│  (Semantic embeddings for FAQ search)  │
└─────────────────────────────────────────┘
```

---

## 📂 Project Structure

```
FAQ_SYSTEM_samagama/
├── client/                         ← React frontend
│   ├── vercel.json
│   └── src/
│       ├── api/                    ← Axios instance, search API
│       ├── components/             ← Shared UI components
│       │   ├── layout/             ← DashboardLayout, Sidebar, Header
│       │   ├── FaqAssistant.jsx    ← AI chatbot component
│       │   ├── NotificationBell.jsx
│       │   └── GoogleSignInButton.jsx
│       ├── context/                ← AuthContext, SocketContext, NotificationContext
│       ├── pages/                  ← Route-level page components
│       │   ├── UserPage.jsx        ← FAQ Hub with semantic search
│       │   ├── AdminArea.jsx       ← Full admin dashboard
│       │   ├── AnswerCenter.jsx    ← Discussion Room (Reddit-style)
│       │   ├── Leaderboard.jsx
│       │   ├── QueryPage.jsx
│       │   └── ...
│       ├── services/               ← API service modules
│       └── styles/                 ← CSS design system
│
└── server/                         ← Express backend
    ├── server.js                   ← Entry point
    ├── controllers/                ← Route handlers
    ├── middleware/                 ← Auth, error handling, validation
    ├── models/                     ← Mongoose schemas
    │   ├── User.js                 ← Points system, role management
    │   ├── Faq.js                  ← Includes stored embedding field
    │   ├── Question.js
    │   ├── Answer.js
    │   ├── Notification.js
    │   ├── Query.js
    │   └── AuditLog.js
    ├── routes/                     ← Express routers
    └── services/
        ├── searchService.js        ← Semantic search with MongoDB-cached embeddings
        ├── embeddingService.js     ← Gemini API embedding generation
        ├── socketService.js        ← Socket.IO real-time events
        └── internshipOverview.js   ← Programme overview scraper
```

---

## ✨ Platform Features

### 👩‍🎓 For Interns

- **FAQ Hub** — Browse 130+ verified FAQs by category with instant semantic search
- **AI-Powered Search** — Gemini embedding-based search that understands meaning, not just keywords. Embeddings are cached in MongoDB for zero cold-start latency
- **FAQ Assistant** — Conversational chatbot that answers queries using FAQ context via Groq API (LLaMA 3)
- **Ask a Question** — Post questions to the community with duplicate detection and draft autosave
- **Discussion Room** — Reddit-style threaded discussions with expandable answers, upvote/downvote with pop animations, sort by New / Top / Trending
- **Submit a Query** — Raise unresolved queries directly to the admin team
- **Points & Leaderboard** — Earn points for accepted answers, upvotes, and promoted questions. Compete on a live leaderboard (interns only)
- **Real-Time Notifications** — Socket.IO powered live notifications for answer activity
- **Dark / Light Mode** — Persisted theme preference across all pages

### 🛡️ For Admins

- **Admin Dashboard** — Stats overview with clickable cards for quick navigation
- **User Management** — Promote/demote users, bulk delete, role badges
- **Question Moderation** — Promote community questions directly to the official FAQ database
- **Query Resolution** — Respond to intern queries, mark resolved, promote to FAQ
- **Answer Center** — View all answers with Accept, Delete, and Ban controls
- **Unresolved Queries** — Manage open intern queries with bulk operations

### 👑 For Super Admins

- **FAQ Manager** — Add, edit, and delete FAQs directly from the UI. Changes are immediately reflected in search
- **Audit Log** — Full history of all admin actions (promotions, deletions, role changes)
- **Role Management** — Promote users to Admin or Super Admin, demote admins
- **Super Admin Protection** — Super admins cannot be deleted or demoted by anyone

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite 5, React Router v6 |
| Styling | CSS Variables (design system), custom components |
| State | React Context (Auth, Socket, Notifications) |
| Backend | Node.js 22.x, Express.js |
| Database | MongoDB Atlas with Mongoose |
| Auth | JWT (access + refresh tokens), Google OAuth 2.0 |
| Real-time | Socket.IO 4.x |
| AI Search | Google Gemini Embeddings API (`gemini-embedding-001`) |
| LLM | Groq (LLaMA 3 via Groq API) |
| Deployment | Railway (backend), Vercel (frontend) |

---

## 🤖 AI Search Architecture

The search system uses **semantic embeddings** rather than keyword matching:

1. On server startup, embeddings are loaded from MongoDB (zero API calls if already stored)
2. New or updated FAQs have embeddings generated via the Gemini API and saved to the database
3. Search queries are embedded in real-time and compared against cached FAQ embeddings using **cosine similarity**
4. The FAQ Assistant uses the top-ranked results as context for LLM-generated responses via Groq

> This design means **no Gemini API calls on server restart** — the quota is preserved entirely for live search queries.

---

## 🔐 Role System

| Role | Permissions |
|---|---|
| `intern` | Browse FAQs, ask questions, answer, vote, submit queries |
| `admin` | All intern permissions + moderate questions/answers/queries, promote to FAQ, manage intern users |
| `super_admin` | All admin permissions + manage FAQs directly, promote/demote admins, view audit logs |

---

## 🔌 API Reference

All protected routes require a valid `Authorization: Bearer <token>` header.

| Domain | Endpoint | Method | Description |
|---|---|---|---|
| Auth | `/api/auth/login` | POST | Email/password login |
| Auth | `/api/auth/google` | POST | Google OAuth login |
| Auth | `/api/auth/register` | POST | New user registration |
| Auth | `/api/auth/refresh` | POST | Refresh access token |
| Auth | `/api/auth/me` | GET | Get current user |
| FAQs | `/api/faqs` | GET | Fetch all FAQs |
| Search | `/api/search` | POST | Semantic FAQ search |
| Search | `/api/search/suggestions` | GET | Live search suggestions |
| Questions | `/api/questions` | GET / POST | List / create questions |
| Answers | `/api/answers` | GET / POST | List / post answers |
| Answers | `/api/answers/:id/upvote` | PUT | Upvote an answer |
| Answers | `/api/answers/:id/accept` | PUT | Accept an answer (admin) |
| Queries | `/api/queries` | POST | Submit a query |
| Admin | `/api/admin/stats` | GET | Dashboard statistics |
| Admin | `/api/admin/users` | GET | List all users |
| Admin | `/api/admin/leaderboard` | GET | Points leaderboard |
| Admin | `/api/admin/faqs` | POST / PATCH / DELETE | FAQ CRUD (super_admin) |
| Admin | `/api/admin/audit-logs` | GET | Action audit log (super_admin) |

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- npm v9+
- MongoDB Atlas account
- Google Cloud project (for OAuth) → [console.cloud.google.com](https://console.cloud.google.com)
- Google AI Studio API key (for Gemini embeddings) → [aistudio.google.com](https://aistudio.google.com)
- Groq API key (for FAQ Assistant LLM) → [console.groq.com](https://console.groq.com)

### Environment Variables

Create `server/.env`:

```env
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=your_mongodb_atlas_connection_string

# JWT
JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret

# Frontend URL (for CORS + OAuth redirect)
CLIENT_URL=http://localhost:5173

# AI / LLM
GEMINI_API_KEY=your_gemini_api_key
LLM_ENDPOINT=https://api.groq.com/openai/v1/chat/completions
LLM_API_KEY=your_groq_api_key
LLM_MODEL=llama3-8b-8192
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

### Local Installation

**Clone the repository:**
```bash
git clone https://github.com/vittaldevak1/FAQ_SYSTEM_samagama.git
cd FAQ_SYSTEM_samagama
```

**Boot the API Server:**
```bash
cd server
npm install
node server.js
```

**Boot the Client:**
```bash
cd ../client
npm install
npm run dev
```

The app runs at **http://localhost:5173**

---

## 🌍 Deployment

| Service | Platform | URL |
|---|---|---|
| Frontend | Vercel | https://faq-system-samagama.vercel.app |
| Backend | Railway | https://faq-backend-production-553a.up.railway.app |
| Database | MongoDB Atlas | Managed cloud cluster |

### Backend — Railway

1. Go to [railway.app](https://railway.app) → **New Project → Deploy from GitHub**
2. Select `FAQ_SYSTEM_samagama`, set root directory to `server/`
3. Add all environment variables from `server/.env` in **Railway → Variables**
4. Railway auto-detects Node.js and deploys on every push to `main`

### Frontend — Vercel

1. Go to [vercel.com](https://vercel.com) → **Import Git Repository**
2. Set root directory to `client/`
3. Add `VITE_API_URL` pointing to your Railway backend URL
4. Deploy — Vercel auto-deploys on every push to `main`

---

## 👥 Team

**2026 Cohort — Vicharanashala Internship Programme, IIT Ropar**

| # | Name |
|---|---|
| 1 | Beldhari Swapna |
| 2 | Dhevesh V |
| 3 | Charan Tej Arangi |
| 4 | Dhruv Kumar |
| 5 | Modala Prasanna Kumari |
| 6 | Abhijeet Kumar |
| 7 | Parth Jha |
| 8 | Saniya Jose |
| 9 | Vennela Pilla |
| 10 | Surya Balam |
| 11 | Navdeep Singh Rathore |
| 12 | Nandani |
| 13 | Mikki Jhuria |
| 14 | Aarti Chaudary |
| 15 | Shashwat Singh |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

> Built for the Samagama community. Designed to scale.
