# Candidate Management API

Complete API documentation for candidate management endpoints with authentication, pagination, search, and filtering.

## Base URL

```
/api/candidates
```

**All endpoints require authentication.** Include JWT token in `Authorization` header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Data Types & Validation

### Candidate Fields

| Field | Type | Validation | Required |
|-------|------|-----------|----------|
| `fullName` | string | Non-empty | Yes |
| `email` | string | Valid email format | Yes |
| `phone` | string | 10 digits | Yes |
| `aadhaarNumber` | string | 12 digits, unique | Yes |
| `panNumber` | string | Format: 5 letters + 4 digits + 1 letter (e.g., ABCDE1234F) | Yes |
| `dob` | string | ISO 8601 date (YYYY-MM-DD) | Yes |
| `address` | string | Non-empty | Yes |
| `status` | string | pending, approved, rejected, review | No (default: pending) |

### Status Values

- `pending` - Initial status for new candidates
- `approved` - Verification approved
- `rejected` - Verification rejected
- `review` - Under review

## API Endpoints

### 1. Create Candidate

**POST** `/api/candidates`

Create a new candidate record.

**Request:**
```json
{
  "fullName": "John Doe",
  "email": "john.doe@example.com",
  "phone": "9876543210",
  "aadhaarNumber": "123456789012",
  "panNumber": "ABCDE1234F",
  "dob": "1990-05-15",
  "address": "123 Main Street, New Delhi, India",
  "status": "pending"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "candidate_123",
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "phone": "9876543210",
    "aadhaarNumber": "123456789012",
    "panNumber": "ABCDE1234F",
    "dob": "1990-05-15",
    "address": "123 Main Street, New Delhi, India",
    "status": "pending",
    "createdAt": "2026-05-21T10:30:00.000Z",
    "updatedAt": "2026-05-21T10:30:00.000Z"
  }
}
```

**Errors:**
- `400` - Validation error (invalid input)
- `409` - Conflict (Aadhaar or PAN already exists)
- `401` - Unauthorized (missing/invalid token)

---

### 2. Get All Candidates

**GET** `/api/candidates`

Retrieve candidates with pagination, search, and filtering.

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number (starts at 1) |
| `limit` | number | 10 | Records per page (1-100) |
| `status` | string | - | Filter by status |
| `search` | string | - | Search by name, email, phone, Aadhaar, or PAN |

**Examples:**

Get first page (default limit):
```
GET /api/candidates
```

Get page 2 with 20 records per page:
```
GET /api/candidates?page=2&limit=20
```

Filter by status:
```
GET /api/candidates?status=approved
```

Search by name:
```
GET /api/candidates?search=john
```

Combined filters:
```
GET /api/candidates?page=1&limit=10&status=approved&search=john
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "candidate_123",
      "fullName": "John Doe",
      "email": "john.doe@example.com",
      "phone": "9876543210",
      "aadhaarNumber": "123456789012",
      "panNumber": "ABCDE1234F",
      "dob": "1990-05-15",
      "address": "123 Main Street, New Delhi, India",
      "status": "approved",
      "createdAt": "2026-05-21T10:30:00.000Z",
      "updatedAt": "2026-05-21T11:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "pages": 5
  }
}
```

**Errors:**
- `400` - Invalid pagination parameters
- `401` - Unauthorized

---

### 3. Get Candidate by ID

**GET** `/api/candidates/:id`

Retrieve a specific candidate by ID.

**URL Parameters:**
- `id` - Candidate ID (required)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "candidate_123",
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "phone": "9876543210",
    "aadhaarNumber": "123456789012",
    "panNumber": "ABCDE1234F",
    "dob": "1990-05-15",
    "address": "123 Main Street, New Delhi, India",
    "status": "approved",
    "createdAt": "2026-05-21T10:30:00.000Z",
    "updatedAt": "2026-05-21T11:00:00.000Z"
  }
}
```

**Errors:**
- `404` - Candidate not found
- `401` - Unauthorized

---

### 4. Update Candidate

**PUT** `/api/candidates/:id`

Update candidate information. Only provided fields are updated.

**URL Parameters:**
- `id` - Candidate ID (required)

**Request:**
```json
{
  "status": "approved",
  "fullName": "Jane Doe"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "candidate_123",
    "fullName": "Jane Doe",
    "email": "john.doe@example.com",
    "phone": "9876543210",
    "aadhaarNumber": "123456789012",
    "panNumber": "ABCDE1234F",
    "dob": "1990-05-15",
    "address": "123 Main Street, New Delhi, India",
    "status": "approved",
    "createdAt": "2026-05-21T10:30:00.000Z",
    "updatedAt": "2026-05-21T12:00:00.000Z"
  }
}
```

**Errors:**
- `400` - Validation error or no fields to update
- `404` - Candidate not found
- `409` - Conflict (Aadhaar or PAN already in use)
- `401` - Unauthorized

---

### 5. Delete Candidate

**DELETE** `/api/candidates/:id`

Delete a candidate record.

**URL Parameters:**
- `id` - Candidate ID (required)

**Response (200):**
```json
{
  "success": true,
  "message": "Candidate deleted successfully"
}
```

**Errors:**
- `404` - Candidate not found
- `401` - Unauthorized

---

## Usage Examples

### cURL Examples

**Register and login first:**
```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin",
    "email": "admin@example.com",
    "password": "password123"
  }'

# Login to get token
TOKEN=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }' | jq -r '.data.token')
```

**Create candidate:**
```bash
curl -X POST http://localhost:3000/api/candidates \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "phone": "9876543210",
    "aadhaarNumber": "123456789012",
    "panNumber": "ABCDE1234F",
    "dob": "1990-05-15",
    "address": "123 Main Street, New Delhi, India"
  }'
```

**Get all candidates (paginated):**
```bash
curl -X GET "http://localhost:3000/api/candidates?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

**Search candidates:**
```bash
curl -X GET "http://localhost:3000/api/candidates?search=john" \
  -H "Authorization: Bearer $TOKEN"
```

**Filter by status:**
```bash
curl -X GET "http://localhost:3000/api/candidates?status=approved" \
  -H "Authorization: Bearer $TOKEN"
```

**Get single candidate:**
```bash
curl -X GET http://localhost:3000/api/candidates/candidate_123 \
  -H "Authorization: Bearer $TOKEN"
```

**Update candidate:**
```bash
curl -X PUT http://localhost:3000/api/candidates/candidate_123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "status": "approved"
  }'
```

**Delete candidate:**
```bash
curl -X DELETE http://localhost:3000/api/candidates/candidate_123 \
  -H "Authorization: Bearer $TOKEN"
```

### JavaScript/Node.js Example

```javascript
const token = 'your_jwt_token';

// Create candidate
const newCandidate = await fetch('/api/candidates', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '9876543210',
    aadhaarNumber: '123456789012',
    panNumber: 'ABCDE1234F',
    dob: '1990-05-15',
    address: '123 Main Street, New Delhi, India',
  }),
});

// Get all candidates with pagination and search
const response = await fetch('/api/candidates?page=1&limit=10&search=john', {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});
const result = await response.json();

// Update candidate
const updated = await fetch(`/api/candidates/${id}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({
    status: 'approved',
  }),
});

// Delete candidate
await fetch(`/api/candidates/${id}`, {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});
```

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": "Error message"
}
```

### Common Error Codes

| Status | Error | Cause |
|--------|-------|-------|
| 400 | Validation error | Invalid input format |
| 400 | Phone number must be 10 digits | Invalid phone format |
| 400 | Aadhaar number must be 12 digits | Invalid Aadhaar format |
| 400 | Invalid PAN number format | Invalid PAN format |
| 400 | At least one field must be provided for update | Empty update request |
| 401 | Missing or invalid authorization header | No token provided |
| 401 | Invalid or expired token | Token validation failed |
| 404 | Candidate not found | Candidate doesn't exist |
| 409 | Candidate with this Aadhaar number already exists | Aadhaar duplicate |
| 409 | Candidate with this PAN number already exists | PAN duplicate |

## Notes

- Dates should be in ISO 8601 format: `YYYY-MM-DD`
- Phone numbers must be exactly 10 digits
- Aadhaar numbers must be exactly 12 digits and unique
- PAN numbers must follow format: 5 letters + 4 digits + 1 letter, and unique
- Search is case-insensitive and searches across multiple fields
- Pagination starts at page 1
- Maximum limit is 100 records per page
