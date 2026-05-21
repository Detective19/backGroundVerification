# Verification Module - Complete Documentation

Complete verification workflow system with Aadhaar and PAN validation, mock APIs, and verification logging.

## Overview

The verification module provides:
- Aadhaar number validation and verification
- PAN number validation and verification
- Mock external API endpoints
- Unified verification workflow
- Verification logs and history

## Validation Rules

### Aadhaar Number Validation

**Regex:** `/^\d{12}$/`

- Must be exactly 12 digits
- No special characters or letters
- Example: `123456789012`

### PAN Number Validation

**Regex:** `/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/`

- 5 uppercase letters
- 4 digits
- 1 uppercase letter
- Example: `ABCDE1234F`

## API Endpoints

### Mock APIs (No Authentication Required)

#### 1. Verify Aadhaar Number

**POST** `/mock-api/aadhaar/verify`

Simulates Aadhaar verification with external API.

**Request:**
```json
{
  "aadhaarNumber": "123456789012",
  "fullName": "John Doe",
  "dob": "1990-05-15"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "status": "verified",
    "nameMatch": true,
    "dobMatch": true
  }
}
```

**Possible Responses:**
- `status`: "verified" or "failed"
- `nameMatch`: true if name matches records
- `dobMatch`: true if DOB matches records

---

#### 2. Verify PAN Number

**POST** `/mock-api/pan/verify`

Simulates PAN verification with external API.

**Request:**
```json
{
  "panNumber": "ABCDE1234F"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "status": "verified",
    "panStatus": "active"
  }
}
```

**Possible Responses:**
- `status`: "verified" or "failed"
- `panStatus`: "active" or "inactive"

---

### Verification APIs (Authentication Required)

All verification endpoints require JWT token in `Authorization: Bearer <token>` header.

#### 3. Start Verification Process

**POST** `/api/verification/verify`

Initiates verification workflow for a candidate. Calls both Aadhaar and PAN mock APIs and determines overall status.

**Request:**
```json
{
  "candidateId": "candidate_123"
}
```

**Response (200):**
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
    },
    "logs": {
      "aadhaarResponse": {
        "status": "verified",
        "nameMatch": true,
        "dobMatch": true
      },
      "panResponse": {
        "status": "verified",
        "panStatus": "active"
      }
    }
  }
}
```

**Overall Status Determination:**
- `VERIFIED` - Both Aadhaar AND PAN verified
- `PARTIAL` - Either Aadhaar OR PAN verified (but not both)
- `FAILED` - Neither Aadhaar nor PAN verified

---

#### 4. Get All Verification Logs

**GET** `/api/verification/logs/:candidateId`

Retrieve all verification logs for a candidate.

**URL Parameters:**
- `candidateId` - Candidate ID (required)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "log_123",
      "candidateId": "candidate_123",
      "aadhaarStatus": "verified",
      "panStatus": "verified",
      "overallStatus": "VERIFIED",
      "nameMatch": true,
      "dobMatch": true,
      "panStatusActive": true,
      "createdAt": "2026-05-21T10:30:00.000Z",
      "updatedAt": "2026-05-21T10:30:00.000Z"
    }
  ]
}
```

---

#### 5. Get Latest Verification

**GET** `/api/verification/latest/:candidateId`

Retrieve the most recent verification log for a candidate.

**URL Parameters:**
- `candidateId` - Candidate ID (required)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "log_123",
    "candidateId": "candidate_123",
    "aadhaarStatus": "verified",
    "panStatus": "verified",
    "overallStatus": "VERIFIED",
    "nameMatch": true,
    "dobMatch": true,
    "panStatusActive": true,
    "aadhaarResponse": {
      "status": "verified",
      "nameMatch": true,
      "dobMatch": true
    },
    "panResponse": {
      "status": "verified",
      "panStatus": "active"
    },
    "createdAt": "2026-05-21T10:30:00.000Z",
    "updatedAt": "2026-05-21T10:30:00.000Z"
  }
}
```

---

## Workflow Diagram

```
1. Start Verification
   ↓
2. Get Candidate Details
   ↓
3. Call Mock Aadhaar API
   └─→ Verify: nameMatch, dobMatch
   ↓
4. Call Mock PAN API
   └─→ Verify: panStatus
   ↓
5. Determine Overall Status
   ├─ Both verified → VERIFIED
   ├─ One verified → PARTIAL
   └─ None verified → FAILED
   ↓
6. Save to VerificationLog
   ↓
7. Return Result
```

## Database Schema

### VerificationLog Table

```sql
CREATE TABLE verification_logs (
  id VARCHAR PRIMARY KEY,
  candidateId VARCHAR NOT NULL,
  aadhaarStatus VARCHAR,
  aadhaarResponse JSON,
  panStatus VARCHAR,
  panResponse JSON,
  overallStatus VARCHAR NOT NULL,
  nameMatch BOOLEAN,
  dobMatch BOOLEAN,
  panStatusActive BOOLEAN,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Usage Examples

### cURL Examples

#### Test Mock Aadhaar API
```bash
curl -X POST http://localhost:3000/mock-api/aadhaar/verify \
  -H "Content-Type: application/json" \
  -d '{
    "aadhaarNumber": "123456789012",
    "fullName": "John Doe",
    "dob": "1990-05-15"
  }'
```

#### Test Mock PAN API
```bash
curl -X POST http://localhost:3000/mock-api/pan/verify \
  -H "Content-Type: application/json" \
  -d '{
    "panNumber": "ABCDE1234F"
  }'
```

#### Start Verification (with auth)
```bash
curl -X POST http://localhost:3000/api/verification/verify \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "candidateId": "candidate_123"
  }'
```

#### Get Verification Logs
```bash
curl -X GET http://localhost:3000/api/verification/logs/candidate_123 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Get Latest Verification
```bash
curl -X GET http://localhost:3000/api/verification/latest/candidate_123 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### JavaScript/Fetch Examples

```javascript
const token = 'your_jwt_token';
const baseURL = 'http://localhost:3000';

// Verify candidate
const verify = async (candidateId) => {
  const response = await fetch(`${baseURL}/api/verification/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ candidateId }),
  });
  return response.json();
};

// Get verification history
const getHistory = async (candidateId) => {
  const response = await fetch(
    `${baseURL}/api/verification/logs/${candidateId}`,
    {
      headers: { 'Authorization': `Bearer ${token}` },
    }
  );
  return response.json();
};

// Get latest verification
const getLatest = async (candidateId) => {
  const response = await fetch(
    `${baseURL}/api/verification/latest/${candidateId}`,
    {
      headers: { 'Authorization': `Bearer ${token}` },
    }
  );
  return response.json();
};

// Usage
const result = await verify('candidate_123');
console.log(result.data.overallStatus); // VERIFIED, PARTIAL, or FAILED
```

---

## Error Responses

### Validation Errors (400)

```json
{
  "success": false,
  "error": "Invalid Aadhaar number format (must be 12 digits)"
}
```

Common validation errors:
- `"Aadhaar number is required"`
- `"Invalid Aadhaar number format (must be 12 digits)"`
- `"Full name is required"`
- `"Date of birth is required"`
- `"PAN number is required"`
- `"Invalid PAN number format (e.g., ABCDE1234F)"`
- `"Valid candidate ID is required"`

### Not Found Errors (404)

```json
{
  "success": false,
  "error": "Candidate not found"
}
```

### Server Errors (500)

```json
{
  "success": false,
  "error": "Internal server error"
}
```

---

## Complete Workflow Example

### Step 1: Create Candidate
```bash
curl -X POST http://localhost:3000/api/candidates \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "aadhaarNumber": "123456789012",
    "panNumber": "ABCDE1234F",
    "dob": "1990-05-15",
    "address": "123 Main St, New Delhi"
  }'
```

### Step 2: Verify Candidate
```bash
curl -X POST http://localhost:3000/api/verification/verify \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "candidateId": "CANDIDATE_ID_FROM_STEP_1"
  }'
```

**Response indicates status:**
- `VERIFIED` - All checks passed
- `PARTIAL` - Some checks passed
- `FAILED` - No checks passed

### Step 3: Check Verification History
```bash
curl -X GET http://localhost:3000/api/verification/logs/CANDIDATE_ID \
  -H "Authorization: Bearer TOKEN"
```

### Step 4: Update Candidate Status (Optional)
```bash
curl -X PUT http://localhost:3000/api/candidates/CANDIDATE_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"status": "approved"}'
```

---

## Key Points

✅ **Mock APIs** - No external API calls, simulated responses
✅ **Automatic Logging** - All verification attempts stored
✅ **Comprehensive Validation** - Regex-based format validation
✅ **Workflow Logic** - Smart overall status determination
✅ **Protected Routes** - Verification endpoints require auth
✅ **Public Mock APIs** - Can be tested without authentication
✅ **Full History** - Track all verification attempts
✅ **Detailed Results** - Individual check results + overall status

---

## Testing Checklist

- [ ] Test mock Aadhaar API with valid data
- [ ] Test mock Aadhaar API with invalid data
- [ ] Test mock PAN API with valid data
- [ ] Test mock PAN API with invalid data
- [ ] Create candidate and run verification
- [ ] Check verification resulted in VERIFIED status
- [ ] Test with invalid Aadhaar (different format)
- [ ] Test with invalid PAN (different format)
- [ ] Check PARTIAL status scenario
- [ ] Check FAILED status scenario
- [ ] Retrieve verification logs
- [ ] Retrieve latest verification
- [ ] Verify logs are persisted in database

---

## Files Created/Updated

```
backend/
├── src/
│   ├── controllers/
│   │   └── verification.controller.ts      ✨ NEW
│   ├── routes/
│   │   ├── mock-api.routes.ts              ✨ NEW
│   │   └── verification.routes.ts          ✨ NEW
│   ├── services/
│   │   └── verification.service.ts         ✨ NEW
│   ├── utils/
│   │   └── mock-api.utils.ts               ✨ NEW
│   ├── validations/
│   │   └── verification.validation.ts      ✨ NEW
│   ├── types/
│   │   └── index.ts                        📝 UPDATED
│   └── index.ts                            📝 UPDATED
├── prisma/
│   └── schema.prisma                       📝 UPDATED
└── VERIFICATION_API.md                     📝 THIS FILE
```
