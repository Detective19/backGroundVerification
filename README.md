# Background Verification Platform

A comprehensive, production-ready full-stack application designed to manage, track, and generate reports for candidate background verifications.

## 🚀 Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS (Premium Aesthetic & Glassmorphism)
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod
- **API Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL (Neon.tech recommended)
- **Reporting**: Puppeteer (PDF Generation)
- **Security**: Helmet, CORS, Express-Rate-Limit
- **Authentication**: JWT + bcrypt

---

## 📁 Project Structure

```
backGroundV/
├── frontend/          # React application
│   ├── src/
│   │   ├── api/       # Axios client & API services
│   │   ├── components/# Reusable UI components
│   │   ├── pages/     # React pages (Dashboard, Login, etc.)
│   │   └── store/     # Zustand state management
│   └── ...
├── backend/           # Node.js Express server
│   ├── src/
│   │   ├── config/    # Environment configurations
│   │   ├── controllers/# Request handlers
│   │   ├── middleware/# Security and auth middleware
│   │   ├── routes/    # API routes
│   │   ├── services/  # Business logic & Puppeteer PDF generator
│   │   └── utils/     # Helpers (JWT)
│   ├── API_DOCS.md    # Detailed API documentation
│   ├── DEPLOYMENT.md  # Detailed Deployment instructions
│   └── ...
└── README.md          # You are here
```

---

## ✨ Key Features

1. **Secure Authentication**: JWT-based login with hashed passwords.
2. **Dashboard Overview**: Metrics tracking total, verified, failed, and pending candidates.
3. **Candidate Management**: View candidate details, verification timeline, and activity logs.
4. **PDF Reporting**: Generate beautiful, downloadable background verification PDF reports via Puppeteer.
5. **Data Masking**: Automatic masking of sensitive data (Aadhaar & PAN) on the generated PDFs.
6. **API Security**: Implemented Helmet headers, strict CORS, and rate limiting to protect endpoints.

---

## 🛠️ Local Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL database (Local or Cloud like Neon)

### 1. Backend Setup

```bash
cd backend
npm install
```

Copy the `.env.example` file to `.env` and configure your variables:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/background_verification"
NODE_ENV="development"
PORT=3000
JWT_SECRET="your_secret_key"
FRONTEND_URL="http://localhost:5173"
```

Run database migrations and start the server:
```bash
npx prisma generate
npx prisma migrate dev
npm run dev
```

### 2. Frontend Setup

Open a new terminal window:
```bash
cd frontend
npm install
```

Start the Vite development server:
```bash
npm run dev
```
Navigate to `http://localhost:5173`. You can mock login with `admin@verifyhub.com` / `password`.

---

## 📚 Documentation

Detailed documentation has been separated into their respective domains:

- **[Backend API Docs](./backend/API_DOCS.md)**: Detailed routes, request bodies, and authentication flows.
- **[Postman Collection](./backend/Background_Verification.postman_collection.json)**: Ready-to-import collection for testing API routes.
- **[Deployment Guide](./backend/DEPLOYMENT.md)**: Step-by-step instructions for deploying to **Vercel** (Frontend), **Render** (Backend), and **Neon** (Database).

---

## 🛡️ Security Best Practices Implemented

- **Helmet**: Secures Express apps by setting various HTTP headers.
- **Rate Limiting**: Prevents brute force attacks by limiting requests to 100 per 15 minutes.
- **CORS Configuration**: Restricts API access strictly to the authenticated frontend domain.
- **Puppeteer Sandboxing**: Configured with `--no-sandbox` and `--disable-setuid-sandbox` for safe cloud environments.

## License
ISC
