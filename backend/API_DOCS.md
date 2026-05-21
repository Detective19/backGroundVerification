# Background Verification API Documentation

This API supports the Background Verification Platform.

## Base URL
`http://localhost:3000/api`

## Security
- **CORS**: Enabled for Frontend URL (defaults to `http://localhost:5173`)
- **Rate Limit**: Max 100 requests per 15-minute window per IP.
- **Helmet**: Standard HTTP headers security enabled.

---

## 1. Authentication

### Register
`POST /auth/register`
**Body**:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "securepassword123"
}
```

### Login
`POST /auth/login`
**Body**:
```json
{
  "email": "jane@example.com",
  "password": "securepassword123"
}
```
**Response**: Returns `{ access_token, user }`. The token must be included in the `Authorization` header as `Bearer <token>` for all other routes.

---

## 2. Candidates

### Get All Candidates
`GET /candidates`
**Headers**: `Authorization: Bearer <token>`

### Get Candidate Details
`GET /candidates/:id`
**Headers**: `Authorization: Bearer <token>`

### Generate Candidate PDF Report
`GET /candidates/:id/report?action=preview|download`
**Headers**: `Authorization: Bearer <token>`
**Query Params**:
- `action`: "preview" (inline) or "download" (attachment). Default is preview.
**Description**: Generates a PDF report containing candidate details, verification status, masked sensitive data (Aadhaar/PAN), and a signature placeholder.

---

## 3. Verification

### Update Verification Status
`PUT /verification/:id/status`
**Headers**: `Authorization: Bearer <token>`
**Body**:
```json
{
  "status": "Verified" 
}
```
