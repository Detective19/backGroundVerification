# Background Verification Platform - Backend

A clean, production-ready backend for the Background Verification Platform built with Node.js, Express, TypeScript, Prisma, and PostgreSQL.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: JWT + bcrypt
- **Validation**: Custom validators

## Project Structure

```
src/
├── config/          # Configuration files (database, environment)
├── controllers/     # Request handlers
├── middleware/      # Express middleware (auth, error handling)
├── routes/          # API route definitions
├── services/        # Business logic
├── types/           # TypeScript types and interfaces
├── utils/           # Utility functions (JWT, password hashing)
├── validations/     # Input validation
└── index.ts         # Application entry point
```

## Setup Instructions

### Prerequisites

- Node.js 16+ 
- PostgreSQL 12+
- npm or yarn

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/background_verification"
NODE_ENV="development"
PORT=3000
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRY="7d"
```

### 3. Create Database & Run Migrations

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate
```

This creates the initial `users` table.

### 4. Start the Server

**Development mode** (with hot reload):

```bash
npm run dev
```

**Production mode**:

```bash
npm run build
npm run start
```

Server runs on `http://localhost:3000`

## API Endpoints

### Authentication Routes

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (201)**:
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login User

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Using Protected Routes

Include JWT token in `Authorization` header:

```http
GET /api/protected-endpoint
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  passwordHash VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Features

✅ **User Registration** - Create new user accounts with email validation
✅ **User Login** - Authenticate with email and password
✅ **Password Hashing** - bcrypt with 10 salt rounds
✅ **JWT Authentication** - Secure token-based auth
✅ **Protected Routes** - Auth middleware for route protection
✅ **Input Validation** - Comprehensive request validation
✅ **Error Handling** - Centralized error handling middleware
✅ **Type Safety** - Full TypeScript support
✅ **Clean Architecture** - Separation of concerns

## Validation Rules

### Register

- **name**: Required, non-empty string
- **email**: Required, valid email format
- **password**: Required, minimum 6 characters

### Login

- **email**: Required, valid email format
- **password**: Required

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "error": "Error message"
}
```

**Status Codes**:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (auth error)
- `409` - Conflict (duplicate email)
- `500` - Server Error

## Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build TypeScript to JavaScript
npm run build

# Run production build
npm run start

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Deploy migrations to production
npm run prisma:migrate:prod

# Open Prisma Studio (GUI for database)
npm run prisma:studio
```

## Security Best Practices

1. **Environment Variables** - Never commit `.env` to version control
2. **JWT Secret** - Use a strong, randomly generated secret in production
3. **Password Hashing** - Uses bcrypt with 10 salt rounds
4. **HTTPS** - Use HTTPS in production
5. **Rate Limiting** - Consider adding rate limiting middleware
6. **CORS** - Configure CORS based on your frontend domain

## Next Steps

1. Add more user fields (phone, address, etc.)
2. Implement verification routes
3. Add file upload for documents
4. Add background check logic
5. Implement email notifications
6. Add rate limiting and request throttling
7. Deploy to production (Heroku, AWS, etc.)

## Troubleshooting

### Database Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution**: Ensure PostgreSQL is running and DATABASE_URL is correct

### Module not found errors

```bash
npm install
npm run prisma:generate
```

### Port already in use

Change `PORT` in `.env` or:

```bash
kill -9 $(lsof -t -i:3000)
```

## License

ISC
