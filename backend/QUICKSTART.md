# Quick Start Guide

## 1. Install Dependencies
```bash
npm install
```

## 2. Setup PostgreSQL Database

Make sure PostgreSQL is running, then create the database:

```bash
# Using psql
psql -U postgres
CREATE DATABASE background_verification;
\q
```

Or update `.env` with your database credentials.

## 3. Generate Prisma Client & Run Migrations
```bash
npm run prisma:generate
npm run prisma:migrate
```

## 4. Start Development Server
```bash
npm run dev
```

Server will start at `http://localhost:3000`

## 5. Test APIs

### Register a new user:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Use Protected Routes:
```bash
curl -X GET http://localhost:3000/api/protected \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Project Structure

```
backGroundV/
├── src/
│   ├── config/              # Configuration
│   ├── controllers/         # Request handlers
│   ├── middleware/          # Express middleware
│   ├── routes/              # API routes
│   ├── services/            # Business logic
│   ├── types/               # TypeScript types
│   ├── utils/               # Helper utilities
│   ├── validations/         # Input validation
│   └── index.ts             # Entry point
├── prisma/
│   └── schema.prisma        # Database schema
├── package.json
├── tsconfig.json
├── .env                     # Environment variables
└── README.md
```

## Key Features Implemented

✅ User Registration with Email Validation
✅ User Login with Password Verification
✅ JWT Token Generation & Verification
✅ bcrypt Password Hashing (10 rounds)
✅ Auth Middleware for Protected Routes
✅ Comprehensive Input Validation
✅ Centralized Error Handling
✅ TypeScript Type Safety
✅ Clean Architecture Principles

## Environment Variables

Update `.env` with your values:

- `DATABASE_URL` - PostgreSQL connection string
- `PORT` - Server port (default: 3000)
- `JWT_SECRET` - Secret key for JWT signing
- `JWT_EXPIRY` - JWT expiration time (default: 7d)
- `NODE_ENV` - Environment (development/production)

## Next: Add More Endpoints

To add protected routes, use the `authMiddleware`:

```typescript
// In your routes file
import { authMiddleware } from '../middleware/auth.middleware';

router.get('/protected', authMiddleware, (req, res) => {
  console.log(req.user); // User info from JWT
  res.json({ message: 'Protected route', user: req.user });
});
```

## Production Deployment Checklist

- [ ] Generate new JWT_SECRET
- [ ] Set NODE_ENV to "production"
- [ ] Configure PostgreSQL for production
- [ ] Setup HTTPS/SSL
- [ ] Enable CORS for your frontend domain
- [ ] Add rate limiting
- [ ] Setup logging and monitoring
- [ ] Configure database backups
- [ ] Setup CI/CD pipeline
