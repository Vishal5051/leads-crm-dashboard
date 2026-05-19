# Smart Leads CRM Dashboard 🚀

A production-grade, highly polished Smart Leads CRM Dashboard built with the MERN stack using strict TypeScript, TailwindCSS, Mongoose, and a premium SaaS-style visual design.

---

## 🎨 Design System & Aesthetics
* **Glassmorphism & Radial Blurs**: Designed with Notion, Linear, and Stripe-level aesthetics using elegant soft glowing CSS backgrounds, high-fidelity light theme, and rounded borders.
* **Modern Typography**: Inter and Outfit fonts for premium presentation.
* **Streamlined Workspace Header**: Dedicated sales viewport showcasing the user role, stage context, and collapsable navigation layouts.

---

## 🛠️ Tech Stack & Architecture
* **Frontend**: React (Vite) + TypeScript (strict mode) + TailwindCSS + Context API state management.
* **Backend**: Node.js + Express + TypeScript (strict mode) + Mongoose + JWT Auth (RBAC) + bcrypt password hashing.
* **Database**: MongoDB (Mongoose Schema-based).
* **Containerization**: Master `docker-compose.yml` for unified microservices.

---

## 📂 Project Structure
```text
├── backend/            # Express REST API (TypeScript)
│   ├── src/
│   │   ├── config/     # Database and server configs
│   │   ├── middleware/ # JWT Auth, Role-Based Access Control, Validation
│   │   ├── models/     # Strict Mongoose Schemas (User, Lead)
│   │   ├── routes/     # Authentication & Lead API endpoints
│   │   └── app.ts      # Server entrypoint
│   └── package.json
│
├── frontend/           # React SPA Client (Vite, TS)
│   ├── src/
│   │   ├── components/ # Reusable UI component system
│   │   ├── context/    # Global Auth, Leads, and Theme state providers
│   │   ├── layouts/    # Dashboard layout and Sidebar structures
│   │   ├── pages/      # Views (Login, Register, Dashboard)
│   │   └── index.css   # Tailored theme styles and utilities
│   └── package.json
│
└── docker-compose.yml  # Orchestrated local services
```

---

## 🚀 Running the Project Locally

### 1. Unified Startup (Docker Compose)
Start the entire stack, including frontend, backend, and a database instance, with a single command:
```bash
docker-compose up --build
```

### 2. Manual Startup

#### Backend Setup
```bash
cd backend
npm install
# Set up environment variables in .env
npm run dev
```

#### Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

The frontend will be active on [http://localhost:5173/](http://localhost:5173/) and connect dynamically to the backend API on port `5000`.

---

## 📦 Production Builds & Verification
The project complies strictly with the TypeScript compiler rules and resolves all unused locals.
To test compilation correctness:
```bash
cd frontend
npm run build
```
*(Compilation exits successfully with code `0`).*
