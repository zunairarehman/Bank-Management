# 🏦 Bank Management System

A **full-stack modern digital banking platform** with an Admin Web Portal, Mobile Banking App, and MongoDB-powered API — built to industry standards inspired by **Bank AL Habib** mobile banking UX.

![Status](https://img.shields.io/badge/status-active-success)
![MongoDB](https://img.shields.io/badge/database-MongoDB-green)
![Node](https://img.shields.io/badge/backend-Node.js-339933)
![Next.js](https://img.shields.io/badge/admin-Next.js-000000)
![Expo](https://img.shields.io/badge/mobile-Expo-000020)

---

## 📌 Project Introduction

The **Bank Management System** is a complete database-driven banking solution featuring:

| Portal           | Platform            | Purpose                                         |
| ---------------- | ------------------- | ----------------------------------------------- |
| **Admin Portal** | Next.js Desktop Web | Manage users, transactions, accounts, analytics |
| **Mobile App**   | React Native Expo   | Customer banking — transfers, bills, cards      |
| **Backend API**  | Node.js + Express   | REST API, JWT auth, MongoDB transactions        |

> ⚠️ **No external APIs** — all data is stored and served from **MongoDB only**.

---

## 🎯 Objectives

- Build a scalable, production-style banking architecture
- Implement secure JWT authentication with session management
- Support atomic money transfers with MongoDB transactions
- Deliver premium UI/UX with animations and dark/light mode
- Provide admin analytics and role-based access control

---

## ✨ Features

### 📱 Mobile Banking App

- Login, Signup, OTP Verification, Forgot Password
- Biometric login UI (simulated)
- Dashboard with balance, analytics, quick actions
- Money transfer & beneficiary management
- Transaction history with search
- Bill payments (electricity, gas, internet, mobile)
- Debit card management (freeze/unfreeze)
- QR Payment & PDF Statement UI
- Profile & settings (dark mode, language toggle)

### 🖥️ Admin Web Portal

- Analytics dashboard with charts (Recharts)
- User management (approve, suspend, delete)
- Transaction management & fraud flagging
- Account overview
- Security & audit logs
- System settings
- Dark/Light mode

### 🔧 Backend API

- 12 MongoDB collections with Mongoose schemas
- bcrypt password hashing
- JWT + session validation
- Atomic transfer logic with rollback
- Seed script with demo data

---

## 🛠️ Technologies Used

| Layer    | Stack                                                     |
| -------- | --------------------------------------------------------- |
| Database | MongoDB, Mongoose                                         |
| Backend  | Node.js, Express.js, JWT, bcrypt                          |
| Admin    | Next.js 14, TypeScript, Tailwind, Framer Motion, Recharts |
| Mobile   | React Native Expo, Redux Toolkit, Expo Router             |
| DevOps   | Docker Compose                                            |

---

## 🏗️ System Architecture

```
┌─────────────────┐     ┌─────────────────┐
│  Admin Portal   │     │   Mobile App    │
│   (Next.js)     │     │  (Expo/RN)      │
└────────┬────────┘     └────────┬────────┘
         │    REST + JWT         │
         └──────────┬────────────┘
                    ▼
         ┌─────────────────────┐
         │   Express API       │
         │   Port 5000         │
         └──────────┬──────────┘
                    ▼
         ┌─────────────────────┐
         │     MongoDB         │
         └─────────────────────┘
```

### Authentication Flow

1. User/Admin submits credentials
2. Server validates with bcrypt
3. JWT token generated & stored in `sessions` collection
4. Client sends `Authorization: Bearer <token>` on each request
5. Middleware validates token + active session

### Transfer Flow

1. Validate sender balance
2. Start MongoDB transaction session
3. Deduct sender → Credit receiver
4. Create transaction record + notifications
5. Commit or rollback on error

---

## 📁 Folder Structure

```
bank-management-system/
│
├── backend/                 # Express API
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/          # 12 Mongoose schemas
│       ├── routes/
│       ├── seed/
│       └── utils/
│
├── admin-portal/            # Next.js Admin Dashboard
│   └── src/
│       ├── app/
│       ├── components/
│       └── lib/
│
├── mobile-app/              # Expo Mobile Banking
│   ├── app/                 # Expo Router screens
│   └── src/
│       ├── redux/
│       ├── services/
│       └── theme/
│
├── docker-compose.yml
└── README.md
```

---

## 🗄️ Database Design

### MongoDB Collections

| Collection         | Description                     |
| ------------------ | ------------------------------- |
| `users`            | Customer accounts & preferences |
| `admins`           | Admin users with roles          |
| `accounts`         | Bank accounts & balances        |
| `transactions`     | All financial transactions      |
| `beneficiaries`    | Saved transfer recipients       |
| `cards`            | Debit/credit cards              |
| `bills`            | Bill payment records            |
| `notifications`    | User notifications              |
| `sessions`         | Active JWT sessions             |
| `otpVerifications` | OTP codes                       |
| `auditLogs`        | Admin activity logs             |
| `supportTickets`   | Customer support                |

---

## 🔐 Security Features

- ✅ bcrypt password hashing (12 rounds)
- ✅ JWT authentication
- ✅ Session-based token validation
- ✅ Role-based admin access (`super_admin`, `admin`, `manager`, `support`)
- ✅ Protected API routes
- ✅ MongoDB atomic transactions for transfers
- ✅ Fraud transaction flagging

---

## 🚀 Installation Guide

### Prerequisites

- Node.js 18+
- MongoDB (local or Docker)
- npm or yarn

### 1️⃣ Clone & Setup

```bash
cd "f:\Software\Bank Management System"
```

### 2️⃣ Start MongoDB

**Option A — MongoDB on Windows (no Docker)** _(recommended if Docker is not installed)_

1. Download [MongoDB Community Server](https://www.mongodb.com/try/download/community) for Windows
2. Install with **Install MongoDB as a Service** checked (runs on port `27017`)
3. Verify in PowerShell:
   ```powershell
   mongosh
   ```
4. If `mongosh` works, MongoDB is ready — skip Docker entirely

**Option B — Docker** _(requires [Docker Desktop](https://www.docker.com/products/docker-desktop/))_

```powershell
cd "f:\Software\Bank Management System"
docker compose up -d mongodb
```

> Use `docker compose` (space), not `docker-compose`. If `docker` is not recognized, install Docker Desktop first or use Option A.

### 3️⃣ Backend Setup

```bash
cd backend
npm install
cp .env.example .env    # if .env missing
npm run seed            # populate demo data
npm run dev             # starts on http://localhost:5000
```

### 4️⃣ Admin Portal Setup

```bash
cd admin-portal
npm install
cp .env.example .env.local
npm run dev             # http://localhost:3000
```

### 5️⃣ Mobile App Setup

```bash
cd mobile-app
npm install
npm install react-native-chart-kit react-native-svg
npx expo start
```

> For Android emulator, set `EXPO_PUBLIC_API_URL=http://10.0.2.2:5000/api`

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

| Variable         | Description               |
| ---------------- | ------------------------- |
| `PORT`           | API port (default 5000)   |
| `MONGODB_URI`    | MongoDB connection string |
| `JWT_SECRET`     | Secret for signing tokens |
| `JWT_EXPIRES_IN` | Token expiry (e.g. 7d)    |

### Admin (`admin-portal/.env.local`)

| Variable              | Description     |
| --------------------- | --------------- |
| `NEXT_PUBLIC_API_URL` | Backend API URL |

### Mobile (`mobile-app/.env`)

| Variable              | Description     |
| --------------------- | --------------- |
| `EXPO_PUBLIC_API_URL` | Backend API URL |

---

## 👤 Demo Credentials

| Role      | Email            | Password |
| --------- | ---------------- | -------- |
| **Admin** | admin@bank.com   | admin123 |
| **User**  | shayan@email.com | user123  |
| **User**  | sara@email.com   | user123  |

---

## 📡 API Endpoints

| Method | Endpoint                    | Description       |
| ------ | --------------------------- | ----------------- |
| POST   | `/api/auth/user/login`      | User login        |
| POST   | `/api/auth/user/signup`     | User registration |
| POST   | `/api/auth/user/verify-otp` | OTP verification  |
| POST   | `/api/auth/admin/login`     | Admin login       |
| GET    | `/api/user/dashboard`       | User dashboard    |
| POST   | `/api/user/transfer`        | Transfer money    |
| GET    | `/api/admin/dashboard`      | Admin stats       |
| GET    | `/api/admin/users`          | List users        |

---

## 📸 Screenshots

> Place screenshots here after running the apps:
>
> - `docs/admin-dashboard.png`
> - `docs/mobile-home.png`
> - `docs/mobile-transfer.png`

---

## 🔮 Future Enhancements

- Real SMS/Email OTP integration
- Push notifications (FCM)
- Real biometric authentication
- PDF statement generation
- AI expense insights (ML integration)
- Multi-currency support

---

## 👥 Contributors

| Name             | Role                      |
| ---------------- | ------------------------- |
| Development Team | Full Stack Implementation |

---

## 📄 License

Educational / Academic Project — Bank Management System Database Project.

---

**Built with ❤️ for modern digital banking**
