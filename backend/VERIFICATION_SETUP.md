# Verification Module - Setup & Summary

Complete verification workflow system has been successfully added to the backend.

## What's Included

### New Files Created

**Validation:**
- `src/validations/verification.validation.ts` - Regex validators for Aadhaar and PAN

**Services:**
- `src/services/verification.service.ts` - Verification workflow and logging logic

**Controllers:**
- `src/controllers/verification.controller.ts` - HTTP handlers for verification endpoints

**Routes:**
- `src/routes/verification.routes.ts` - Protected verification endpoints
- `src/routes/mock-api.routes.ts` - Mock API endpoints (public)

**Utilities:**
- `src/utils/mock-api.utils.ts` - Mock API implementations

**Documentation:**
- `VERIFICATION_API.md` - Complete API reference

### Updated Files

- `prisma/schema.prisma` - Added VerificationLog model
- `src/types/index.ts` - Added verification types
- `src/index.ts` - Registered verification routes

## Database Schema

### VerificationLog Model

```prisma
model VerificationLog {
  id              String   @id @default(cuid())
  candidateId     String
  aadhaarStatus   String?
  aadhaarResponse Json?
  panStatus       String?
  panResponse     Json?
  overallStatus   String
  nameMatch       Boolean?
  dobMatch        Boolean?
  panStatusActive Boolean?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@map("verification_logs")
}
```

## Validation Rules

### Aadhaar Number
- **Regex:** `/^\d{12}$/`
- Exactly 12 digits
- Example: `123456789012`

### PAN Number
- **Regex:** `/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/`
- 5 uppercase letters + 4 digits + 1 uppercase letter
- Example: `ABCDE1234F`

## API Endpoints

### Mock APIs (Public - No Auth Required)

```
POST /mock-api/aadhaar/verify
POST /mock-api/pan/verify
```

### Verification APIs (Protected - Requires JWT)

```
POST /api/verification/verify           Start verification
GET  /api/verification/logs/:id         Get all logs
GET  /api/verification/latest/:id       Get latest log
```

## Verification Workflow

### Process Flow

```
1. Call Mock Aadhaar API
   ├─ Returns: status, nameMatch, dobMatch
   
2. Call Mock PAN API
   ├─ Returns: status, panStatus
   
3. Determine Overall Status
   ├─ VERIFIED: Both Aadhaar AND PAN verified
   ├─ PARTIAL:  Either verified (but not both)
   └─ FAILED:   Neither verified
   
4. Save to VerificationLog
   ├─ Store all API responses
   ├─ Store individual field matches
   └─ Store overall result
   
5. Return Complete Result
```

## Quick Start

### 1. Apply Migration
```bash
npm run prisma:generate
npm run prisma:migrate
```

### 2. Test Mock APIs (No Auth Needed)

**Test Aadhaar API:**
```bash
curl -X POST http://localhost:3000/mock-api/aadhaar/verify \
  -H "Content-Type: application/json" \
  -d '{
    "aadhaarNumber": "123456789012",
    "fullName": "John Doe",
    "dob": "1990-05-15"
  }'
```

**Test PAN API:**
```bash
curl -X POST http://localhost:3000/mock-api/pan/verify \
  -H "Content-Type: application/json" \
  -d '{"panNumber": "ABCDE1234F"}'
```

### 3. Run Verification (With Auth)

First get auth token, then:

```bash
curl -X POST http://localhost:3000/api/verification/verify \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"candidateId": "candidate_123"}'
```

Response:
```json
{
  "success": true,
  "data": {
    "candidateId": "candidate_123",
    "overallStatus": "VERIFIED",
    "aadhaarStatus": "verified",
    "panStatus": "verified",
    "details": {
      "nameMatch": true,
      "dobMatch": true,
      "panStatusActive": true
    }
  }
}
```

### 4. Check Verification History

```bash
curl -X GET http://localhost:3000/api/verification/logs/candidate_123 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Overall Status Values

| Status | Meaning | Condition |
|--------|---------|-----------|
| `VERIFIED` | All checks passed | Aadhaar ✓ AND PAN ✓ |
| `PARTIAL` | Some checks passed | (Aadhaar ✓ OR PAN ✓) AND NOT both |
| `FAILED` | All checks failed | Aadhaar ✗ AND PAN ✗ |

## Aadhaar Verification Response

```json
{
  "status": "verified",    // or "failed"
  "nameMatch": true,       // Name matches records
  "dobMatch": true         // DOB matches records
}
```

## PAN Verification Response

```json
{
  "status": "verified",    // or "failed"
  "panStatus": "active"    // or "inactive"
}
```

## Complete Workflow Example

### Full Process

```bash
# 1. Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin",
    "email": "admin@example.com",
    "password": "password123"
  }'

# 2. Login to get token
TOKEN=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }' | jq -r '.data.token')

# 3. Create candidate
CANDIDATE_ID=$(curl -X POST http://localhost:3000/api/candidates \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "aadhaarNumber": "123456789012",
    "panNumber": "ABCDE1234F",
    "dob": "1990-05-15",
    "address": "123 Main St"
  }' | jq -r '.data.id')

# 4. Run verification
curl -X POST http://localhost:3000/api/verification/verify \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"candidateId\": \"$CANDIDATE_ID\"}"

# 5. Check logs
curl -X GET http://localhost:3000/api/verification/logs/$CANDIDATE_ID \
  -H "Authorization: Bearer $TOKEN"

# 6. Update candidate status based on verification result
curl -X PUT http://localhost:3000/api/candidates/$CANDIDATE_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"status": "approved"}'
```

## Key Features

✅ **Dual Verification** - Aadhaar + PAN checks
✅ **Regex Validation** - Format validation before API call
✅ **Mock APIs** - Simulated external API responses
✅ **Smart Workflow** - Intelligent status determination
✅ **Complete Logging** - All requests and responses saved
✅ **History Tracking** - Multiple verification attempts stored
✅ **Protected Routes** - Auth required for verification
✅ **Public Mock APIs** - Can test without authentication

## Files Structure

```
backend/
├── src/
│   ├── controllers/
│   │   └── verification.controller.ts      (verify, getLogs, getLatest)
│   ├── routes/
│   │   ├── mock-api.routes.ts              (public endpoints)
│   │   └── verification.routes.ts          (protected endpoints)
│   ├── services/
│   │   └── verification.service.ts         (workflow logic)
│   ├── utils/
│   │   └── mock-api.utils.ts               (API implementations)
│   ├── validations/
│   │   └── verification.validation.ts      (regex validators)
│   └── types/
│       └── index.ts                        (TypeScript interfaces)
├── prisma/
│   ├── schema.prisma                       (VerificationLog model)
│   └── migrations/                         (new migration file)
└── VERIFICATION_API.md                     (full documentation)
```

## Testing

### Test Scenarios

1. **Valid Aadhaar + Valid PAN** → VERIFIED
2. **Valid Aadhaar + Invalid PAN** → PARTIAL
3. **Invalid Aadhaar + Valid PAN** → PARTIAL
4. **Invalid Aadhaar + Invalid PAN** → FAILED
5. **Invalid Aadhaar Format** → Validation error (400)
6. **Invalid PAN Format** → Validation error (400)
7. **Non-existent Candidate** → Not found (404)

### Commands to Test

```bash
# Test 1: Valid verification
curl -X POST http://localhost:3000/api/verification/verify \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"candidateId": "valid_id"}'

# Test 2: Invalid candidate ID
curl -X POST http://localhost:3000/api/verification/verify \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"candidateId": "invalid_id"}'

# Test 3: Test mock Aadhaar with invalid format
curl -X POST http://localhost:3000/mock-api/aadhaar/verify \
  -H "Content-Type: application/json" \
  -d '{
    "aadhaarNumber": "abc123",
    "fullName": "John",
    "dob": "1990-05-15"
  }'

# Test 4: Get verification logs
curl -X GET http://localhost:3000/api/verification/logs/candidate_id \
  -H "Authorization: Bearer TOKEN"
```

## Error Codes

| Code | Error | Cause |
|------|-------|-------|
| 400 | Validation failed | Invalid format |
| 400 | Valid candidate ID required | Empty/null ID |
| 404 | Candidate not found | Non-existent candidate |
| 404 | No verification logs | Candidate not verified yet |
| 401 | Unauthorized | Missing/invalid token |
| 500 | Internal server error | Server error |

## Next Steps

1. ✅ Run migration: `npm run prisma:migrate`
2. ✅ Restart server: `npm run dev`
3. ✅ Test mock APIs (no auth needed)
4. ✅ Create candidate and run verification
5. Consider:
   - Real Aadhaar/PAN API integration
   - Webhook notifications
   - Batch verification
   - Analytics dashboard

## Documentation

See `VERIFICATION_API.md` for complete API documentation with all endpoints, examples, and error codes.
