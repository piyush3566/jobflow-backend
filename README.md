# JobFlow Backend 🧠

JobFlow is a full-stack **job application tracker**.  
This repository contains the **backend API**, built with:

- Node.js
- Express
- PostgreSQL
- JWT Authentication (Login + Register)
- Protected routes for job applications

---

## 🚀 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express
- **Database:** PostgreSQL
- **Auth:** JWT (JSON Web Token)
- **Other:** bcrypt, cors, dotenv, pg

---

## 📁 Project Structure

```bash
jobflow-backend/
├─ src/
│  ├─ server.js          # Express app entry
│  ├─ db.js              # PostgreSQL connection (pg Pool)
│  ├─ middleware/
│  │   └─ auth.js        # JWT auth middleware (requireAuth)
│  └─ routes/
│      ├─ health.js      # Health check route
│      ├─ auth.js        # /api/auth (login, register)
│      └─ jobs.js        # /api/jobs (CRUD for job applications)
├─ package.json
└─ .env (not committed)
