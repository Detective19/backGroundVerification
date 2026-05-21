# Candidate Management Module - Summary

Complete candidate management module has been successfully added to your Background Verification Platform backend.

## 📁 New Files Created

### Validation Layer
**File:** `src/validations/candidate.validation.ts`
- `validateCreateCandidate()` - Validates new candidate creation
- `validateUpdateCandidate()` - Validates candidate updates
- `validatePaginationParams()` - Validates pagination query parameters
- Comprehensive validation for all fields (email, phone, Aadhaar, PAN, DOB, etc.)

### Service Layer
**File:** `src/services/candidate.service.ts`
- `createCandidate()` - Create new candidate with unique constraint checks
- `getCandidates()` - List with pagination, search, and filtering
- `getCandidateById()` - Retrieve single candidate
- `updateCandidate()` - Update candidate details
- `deleteCandidate()` - Delete candidate record
- Full business logic with error handling

### Controller Layer
**File:** `src/controllers/candidate.controller.ts`
- `createCandidate()` - POST handler
- `getCandidates()` - GET handler with query parameters
- `getCandidateById()` - GET by ID handler
- `updateCandidate()` - PUT handler
- `deleteCandidate()` - DELETE handler
- HTTP status code management and error responses

### Routes Layer
**File:** `src/routes/candidate.routes.ts`
- Protected with auth middleware
- 5 endpoints:
  - `POST /` - Create candidate
  - `GET /` - List candidates
  - `GET /:id` - Get single candidate
  - `PUT /:id` - Update candidate
  - `DELETE /:id` - Delete candidate

### Documentation
- **`CANDIDATE_API.md`** - Complete API reference with cURL examples
- **`CANDIDATE_SETUP.md`** - Setup guide and migration instructions

## 📝 Modified Files

### Prisma Schema
**File:** `prisma/schema.prisma`

Added Candidate model:
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

### Types
**File:** `src/types/index.ts`

Added interfaces:
- `CreateCandidateRequest`
- `UpdateCandidateRequest`
- `CandidateResponse`
- `PaginationParams`
- `PaginatedResponse<T>`
- `CandidateFilters`

### Main Application
**File:** `src/index.ts`

Registered candidate routes:
```typescript
import candidateRoutes from './routes/candidate.routes';
app.use('/api/candidates', candidateRoutes);
```

## 🔌 API Endpoints

All endpoints require JWT authentication (`Authorization: Bearer <token>`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/candidates` | Create candidate |
| GET | `/api/candidates` | List candidates |
| GET | `/api/candidates/:id` | Get candidate by ID |
| PUT | `/api/candidates/:id` | Update candidate |
| DELETE | `/api/candidates/:id` | Delete candidate |

## ✨ Features

### ✅ Pagination
- Query params: `page` (default: 1), `limit` (default: 10, max: 100)
- Returns total count and page count
- Example: `/api/candidates?page=2&limit=20`

### ✅ Search
- Case-insensitive search across multiple fields
- Searches: full name, email, phone, Aadhaar, PAN
- Query param: `search=query`
- Example: `/api/candidates?search=john`

### ✅ Filtering
- Filter by status: `pending`, `approved`, `rejected`, `review`
- Query param: `status=value`
- Example: `/api/candidates?status=approved`

### ✅ Combined Queries
- Mix pagination, search, and filters
- Example: `/api/candidates?page=1&limit=10&status=approved&search=john`

### ✅ Validation
- Email format validation
- Phone: 10 digits
- Aadhaar: 12 digits (unique)
- PAN: 5 letters + 4 digits + 1 letter (unique)
- DOB: ISO 8601 format (YYYY-MM-DD)
- Status: Predefined values only
- Address: Non-empty string

### ✅ Authentication
- All endpoints protected with JWT middleware
- Bearer token required in Authorization header

### ✅ Error Handling
- Validation errors (400)
- Not found errors (404)
- Duplicate constraint errors (409)
- Unauthorized errors (401)
- Server errors (500)

## 🚀 Quick Start

### 1. Apply Database Migration
```bash
npm run prisma:generate
npm run prisma:migrate
```

### 2. Restart Server
```bash
npm run dev
```

### 3. Get Authentication Token
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### 4. Create a Candidate
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
    "address": "123 Main Street, New Delhi"
  }'
```

### 5. List Candidates
```bash
curl -X GET "http://localhost:3000/api/candidates?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "data": { /* candidate data */ },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "pages": 5
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

## 🗄️ Database

### Candidate Fields
| Field | Type | Validation |
|-------|------|-----------|
| id | String (CUID) | Auto-generated |
| fullName | String | Required, non-empty |
| email | String | Required, email format |
| phone | String | Required, 10 digits |
| aadhaarNumber | String | Required, 12 digits, unique |
| panNumber | String | Required, format, unique |
| dob | DateTime | Required, ISO format |
| address | String | Required, non-empty |
| status | String | Default: "pending" |
| createdAt | DateTime | Auto-generated |
| updatedAt | DateTime | Auto-updated |

### Status Values
- `pending` - Initial status
- `approved` - Verified and approved
- `rejected` - Verification rejected
- `review` - Currently under review

## 📋 Candidate Fields Requirements

| Field | Format | Example |
|-------|--------|---------|
| Full Name | String | John Doe |
| Email | Valid email | john@example.com |
| Phone | 10 digits | 9876543210 |
| Aadhaar | 12 digits | 123456789012 |
| PAN | 5L+4D+1L | ABCDE1234F |
| DOB | YYYY-MM-DD | 1990-05-15 |
| Address | String | 123 Main St, New Delhi |
| Status | Predefined | pending/approved/rejected/review |

## 🔍 Search Examples

### By Name
```
GET /api/candidates?search=john
```

### By Email
```
GET /api/candidates?search=john@example.com
```

### By Phone
```
GET /api/candidates?search=9876543210
```

### By Aadhaar
```
GET /api/candidates?search=123456789012
```

### By PAN
```
GET /api/candidates?search=ABCDE1234F
```

## 📚 Documentation Files

1. **CANDIDATE_API.md** - Complete API documentation with all endpoints, request/response examples, and error codes

2. **CANDIDATE_SETUP.md** - Setup instructions, migration guide, and troubleshooting

## 🔐 Security Features

- JWT authentication on all endpoints
- Unique constraints on sensitive fields (Aadhaar, PAN)
- Input validation on all fields
- Password hashing for user authentication
- Bearer token validation

## 🧪 Testing

### Using Postman
1. Set up environment variables
2. Create requests for each endpoint
3. Include Authorization header with Bearer token

### Using cURL
See examples in CANDIDATE_API.md for detailed cURL commands

### Using JavaScript
See examples in CANDIDATE_API.md for Node.js/Fetch API examples

## 📁 File Structure

```
backend/
├── src/
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   └── candidate.controller.ts          ✨ NEW
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   └── candidate.routes.ts              ✨ NEW
│   ├── services/
│   │   ├── auth.service.ts
│   │   └── candidate.service.ts             ✨ NEW
│   ├── validations/
│   │   ├── auth.validation.ts
│   │   └── candidate.validation.ts          ✨ NEW
│   ├── types/
│   │   └── index.ts                         📝 UPDATED
│   ├── middleware/
│   ├── config/
│   ├── utils/
│   └── index.ts                             📝 UPDATED
├── prisma/
│   └── schema.prisma                        📝 UPDATED
├── CANDIDATE_API.md                         ✨ NEW
├── CANDIDATE_SETUP.md                       ✨ NEW
└── package.json
```

## ✅ Validation Rules Summary

- **fullName**: Non-empty string
- **email**: Valid email format
- **phone**: Exactly 10 digits
- **aadhaarNumber**: Exactly 12 digits, must be unique
- **panNumber**: Format "ABCDE1234F", must be unique
- **dob**: ISO 8601 date (YYYY-MM-DD)
- **address**: Non-empty string
- **status**: One of: pending, approved, rejected, review

## 🚦 HTTP Status Codes

- `201` - Candidate created successfully
- `200` - Success (GET, PUT, DELETE)
- `400` - Validation error
- `401` - Unauthorized (missing/invalid token)
- `404` - Candidate not found
- `409` - Conflict (duplicate Aadhaar/PAN)
- `500` - Server error

## 🎯 Next Steps

1. ✅ Run migrations: `npm run prisma:migrate`
2. ✅ Restart server: `npm run dev`
3. ✅ Test API endpoints (see CANDIDATE_API.md)
4. Consider:
   - Add document storage
   - Implement verification workflow
   - Add bulk import/export
   - Add email notifications
   - Create admin dashboard

## 📖 References

- Full API documentation: `CANDIDATE_API.md`
- Setup guide: `CANDIDATE_SETUP.md`
- Quick start: `QUICKSTART.md`
