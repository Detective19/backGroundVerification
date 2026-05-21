# Candidate Module Setup Guide

This guide explains how to set up and use the newly added Candidate Management module.

## What's New

### New Files Added

**Validation:**
- `src/validations/candidate.validation.ts` - Input validation for candidates

**Services:**
- `src/services/candidate.service.ts` - Business logic for candidate CRUD operations

**Controllers:**
- `src/controllers/candidate.controller.ts` - HTTP request handlers

**Routes:**
- `src/routes/candidate.routes.ts` - API endpoint definitions

**Documentation:**
- `CANDIDATE_API.md` - Complete API documentation

### Updated Files

- `prisma/schema.prisma` - Added Candidate model
- `src/types/index.ts` - Added candidate types and interfaces
- `src/index.ts` - Registered candidate routes

## Installation Steps

### 1. Update Prisma Schema

The Prisma schema has been updated with the Candidate model. The schema includes:

```prisma
model Candidate {
  id            String   @id @default(cuid())
  fullName      String
  email         String
  phone         String
  aadhaarNumber String   @unique
  panNumber     String   @unique
  dob           DateTime
  address       String
  status        String   @default("pending")
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@map("candidates")
}
```

### 2. Generate Prisma Client

```bash
npm run prisma:generate
```

### 3. Create and Run Migration

```bash
npm run prisma:migrate
```

This will:
- Create a new migration file in `prisma/migrations/`
- Create the `candidates` table in PostgreSQL
- Apply all pending migrations

**Migration file example:**
```sql
-- CreateTable
CREATE TABLE "candidates" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "aadhaarNumber" TEXT NOT NULL,
    "panNumber" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "address" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "candidates_aadhaarNumber_key" ON "candidates"("aadhaarNumber");

-- CreateIndex
CREATE UNIQUE INDEX "candidates_panNumber_key" ON "candidates"("panNumber");
```

### 4. Restart Server

```bash
npm run dev
```

## Available Endpoints

All endpoints require authentication (JWT token).

### CRUD Operations

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/candidates` | Create new candidate |
| GET | `/api/candidates` | List all candidates (with pagination) |
| GET | `/api/candidates/:id` | Get candidate by ID |
| PUT | `/api/candidates/:id` | Update candidate |
| DELETE | `/api/candidates/:id` | Delete candidate |

### Query Parameters

**For GET /api/candidates:**
- `page` - Page number (default: 1)
- `limit` - Records per page (default: 10, max: 100)
- `status` - Filter by status (pending, approved, rejected, review)
- `search` - Search by name, email, phone, Aadhaar, or PAN

**Examples:**
```
GET /api/candidates?page=1&limit=20
GET /api/candidates?status=approved
GET /api/candidates?search=john
GET /api/candidates?page=2&limit=10&status=pending&search=doe
```

## Features

### 1. Pagination

Automatic pagination support:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "pages": 5
  }
}
```

### 2. Search

Case-insensitive search across:
- Full Name
- Email
- Phone
- Aadhaar Number
- PAN Number

### 3. Filtering

Filter candidates by status:
- `pending` - Initial status
- `approved` - Verification approved
- `rejected` - Verification rejected
- `review` - Under review

### 4. Validation

Comprehensive input validation:
- Email format validation
- Phone: 10 digits required
- Aadhaar: 12 digits, unique
- PAN: Format validation, unique
- DOB: ISO 8601 format
- Status: Limited to predefined values

### 5. Authentication

All endpoints protected with JWT middleware:
```
Authorization: Bearer <JWT_TOKEN>
```

### 6. Unique Constraints

- `aadhaarNumber` - Must be unique
- `panNumber` - Must be unique

## Testing the APIs

### Using cURL

**Get Authentication Token:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }' | jq '.data.token'
```

**Create Candidate:**
```bash
curl -X POST http://localhost:3000/api/candidates \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "aadhaarNumber": "123456789012",
    "panNumber": "ABCDE1234F",
    "dob": "1990-05-15",
    "address": "123 Main St"
  }'
```

**List Candidates:**
```bash
curl -X GET "http://localhost:3000/api/candidates?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Search Candidates:**
```bash
curl -X GET "http://localhost:3000/api/candidates?search=john&status=approved" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Get Single Candidate:**
```bash
curl -X GET http://localhost:3000/api/candidates/CANDIDATE_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Update Candidate:**
```bash
curl -X PUT http://localhost:3000/api/candidates/CANDIDATE_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"status": "approved"}'
```

**Delete Candidate:**
```bash
curl -X DELETE http://localhost:3000/api/candidates/CANDIDATE_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Using Postman

1. Create collection: "Background Verification API"
2. Add environment variables:
   - `{{base_url}}` = `http://localhost:3000`
   - `{{token}}` = Get from login response

3. Create requests:
   - **Login**: POST to `{{base_url}}/api/auth/login`
   - **Create**: POST to `{{base_url}}/api/candidates`
   - **List**: GET to `{{base_url}}/api/candidates`
   - **Get**: GET to `{{base_url}}/api/candidates/:id`
   - **Update**: PUT to `{{base_url}}/api/candidates/:id`
   - **Delete**: DELETE to `{{base_url}}/api/candidates/:id`

## Database Schema

### Candidates Table

```sql
CREATE TABLE candidates (
  id VARCHAR PRIMARY KEY,
  fullName VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  phone VARCHAR NOT NULL,
  aadhaarNumber VARCHAR NOT NULL UNIQUE,
  panNumber VARCHAR NOT NULL UNIQUE,
  dob TIMESTAMP NOT NULL,
  address VARCHAR NOT NULL,
  status VARCHAR NOT NULL DEFAULT 'pending',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_aadhaar ON candidates(aadhaarNumber);
CREATE UNIQUE INDEX idx_pan ON candidates(panNumber);
```

## Error Handling

Standard error response format:

```json
{
  "success": false,
  "error": "Error message"
}
```

Common scenarios:
- **400** - Validation error (invalid input)
- **401** - Unauthorized (missing/invalid token)
- **404** - Candidate not found
- **409** - Conflict (duplicate Aadhaar/PAN)
- **500** - Server error

## Next Steps

1. ✅ Add candidate routes
2. ✅ Implement CRUD operations
3. ✅ Add pagination and search
4. Consider adding:
   - Advanced filtering (date range, etc.)
   - Bulk import/export
   - Document storage
   - Verification workflow
   - Audit logs
   - Email notifications

## Troubleshooting

### Migration Fails

If migration fails with "table already exists":
```bash
# Check existing migrations
ls prisma/migrations/

# View database state
npm run prisma:studio
```

### Unique Constraint Errors

- Ensure Aadhaar and PAN are unique in test data
- Use different values for each test

### Token Expired

- Get new token by logging in again
- Extend JWT_EXPIRY in .env

### Validation Errors

Check:
- Phone must be exactly 10 digits: `1234567890`
- Aadhaar must be exactly 12 digits: `123456789012`
- PAN format: `ABCDE1234F` (5 letters + 4 digits + 1 letter)
- DOB format: `YYYY-MM-DD` (e.g., `1990-05-15`)

## Files Modified/Created

```
backend/
├── prisma/
│   └── schema.prisma                    (updated)
├── src/
│   ├── controllers/
│   │   └── candidate.controller.ts      (new)
│   ├── routes/
│   │   └── candidate.routes.ts          (new)
│   ├── services/
│   │   └── candidate.service.ts         (new)
│   ├── types/
│   │   └── index.ts                     (updated)
│   ├── validations/
│   │   └── candidate.validation.ts      (new)
│   └── index.ts                         (updated)
└── CANDIDATE_API.md                     (new)
```

## Support

For detailed API documentation, see: `CANDIDATE_API.md`

For any issues, check:
1. PostgreSQL is running
2. .env has correct DATABASE_URL
3. Migrations have been applied
4. Server is running on correct port
5. JWT token is valid
