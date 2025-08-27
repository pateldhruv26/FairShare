# FairShare Backend API

A robust, secure, and scalable backend API for the FairShare financial management application.

## 🚀 Features

- **Secure Authentication**: JWT-based authentication with bcrypt password hashing
- **Input Validation**: Comprehensive validation with custom error handling
- **Rate Limiting**: Built-in rate limiting for authentication endpoints
- **Error Handling**: Consistent error responses with proper HTTP status codes
- **Database**: MongoDB with Mongoose ODM
- **Security**: CORS, input sanitization, and security headers
- **Logging**: Request logging and error tracking
- **Health Checks**: Built-in health monitoring endpoints

## 🏗️ Architecture

```
backend/
├── controllers/     # Business logic and request handlers
├── models/         # Database schemas and models
├── routes/         # API route definitions
├── middlewares/    # Custom middleware functions
├── utils/          # Utility functions and helpers
├── db/            # Database connection and configuration
└── server.js      # Main application entry point
```

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **Authentication**: JWT + bcrypt
- **Validation**: Custom validation utilities
- **CORS**: Cross-origin resource sharing
- **Environment**: dotenv for configuration

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## 🚀 Quick Start

### 1. Clone and Install

```bash
cd backend
npm install
```

### 2. Environment Configuration

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb://localhost:27017/fairshare
MONGO=mongodb://localhost:27017/fairshare

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### 3. Start the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3001`

## 🔐 Authentication

### JWT Token Structure

```json
{
  "userId": "user_id_here",
  "username": "username_here",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Protected Routes

Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📚 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/signup` | User registration | No |
| POST | `/signin` | User login | No |
| POST | `/signout` | User logout | Yes |
| POST | `/refresh-token` | Refresh JWT token | Yes |
| POST | `/google` | Google OAuth | No |

### User Management (`/api/user`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/profile` | Get user profile | Yes |
| PUT | `/profile` | Update user profile | Yes |
| DELETE | `/account` | Delete user account | Yes |

### Transactions (`/api/transactions`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get user transactions | Yes |
| POST | `/` | Create transaction | Yes |
| PUT | `/:id` | Update transaction | Yes |
| DELETE | `/:id` | Delete transaction | Yes |

### Bills (`/api/bills`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get user bills | Yes |
| POST | `/` | Create bill | Yes |
| PUT | `/:id` | Update bill | Yes |
| DELETE | `/:id` | Delete bill | Yes |

### Groups (`/api/group`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get user groups | Yes |
| POST | `/` | Create group | Yes |
| PUT | `/:id` | Update group | Yes |
| DELETE | `/:id` | Delete group | Yes |

### Friends (`/api/friend`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get user friends | Yes |
| POST | `/request` | Send friend request | Yes |
| PUT | `/request/:id` | Accept/reject request | Yes |
| DELETE | `/:id` | Remove friend | Yes |

## 🔒 Security Features

### Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (@$!%*?&)

### Rate Limiting

- Authentication endpoints: 5 attempts per 15 minutes
- Configurable per IP address
- Automatic account lockout after 5 failed attempts

### Input Validation

- Email format validation
- Username format validation (alphanumeric + underscore)
- Phone number validation
- Currency amount validation
- Date validation
- ObjectId validation

## 🗄️ Database Models

### User Model

```javascript
{
  username: String (unique, required),
  email: String (unique, required),
  password: String (hashed, required),
  firstName: String,
  lastName: String,
  phone: String,
  profileImage: String,
  dateOfBirth: Date,
  address: Object,
  preferences: Object,
  financial: Object,
  social: Object,
  features: Object,
  security: Object,
  status: String,
  verification: Object
}
```

### Transaction Model

```javascript
{
  userId: ObjectId (ref: User),
  type: String (income/expense),
  amount: Number,
  category: String,
  description: String,
  date: Date,
  tags: [String]
}
```

### Group Model

```javascript
{
  name: String (required),
  description: String,
  members: [ObjectId (ref: User)],
  admins: [ObjectId (ref: User)],
  expenses: [ObjectId (ref: Transaction)],
  settings: Object
}
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📊 Monitoring

### Health Check

```
GET /health
```

Response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456
}
```

### Database Status

```javascript
import { getConnectionStatus, healthCheck } from './db/db.js';

const status = getConnectionStatus();
const health = await healthCheck();
```

## 🚨 Error Handling

### Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400,
  "timestamp": "2024-01-01T00:00:00.000Z",
  "details": ["field1: error1", "field2: error2"]
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (Validation Error)
- `401` - Unauthorized (Authentication Required)
- `403` - Forbidden (Insufficient Permissions)
- `404` - Not Found
- `409` - Conflict (Resource Already Exists)
- `429` - Too Many Requests (Rate Limited)
- `500` - Internal Server Error

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3001 |
| `NODE_ENV` | Environment mode | development |
| `MONGO_URI` | MongoDB connection string | localhost:27017/fairshare |
| `JWT_SECRET` | JWT signing secret | fallback-secret-key |
| `JWT_EXPIRES_IN` | JWT expiration time | 7d |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:3000 |

### CORS Configuration

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
```

## 📝 Logging

### Request Logging

All requests are logged with timestamp and method:

```
2024-01-01T00:00:00.000Z - GET /api/user/profile
2024-01-01T00:00:01.000Z - POST /api/transactions
```

### Error Logging

Errors are logged with detailed information:

```json
{
  "timestamp": "2024-01-01T00:00:00.000Z",
  "error": {
    "name": "ValidationError",
    "message": "Invalid email format",
    "stack": "...",
    "statusCode": 400
  },
  "request": {
    "method": "POST",
    "url": "/api/auth/signup",
    "ip": "127.0.0.1",
    "userAgent": "...",
    "userId": null
  }
}
```

## 🚀 Deployment

### Production Considerations

1. **Environment Variables**: Set all required environment variables
2. **Database**: Use production MongoDB instance
3. **JWT Secret**: Use strong, unique JWT secret
4. **CORS**: Configure CORS for production frontend URL
5. **Logging**: Implement external logging service
6. **Monitoring**: Set up health checks and monitoring
7. **SSL**: Use HTTPS in production

### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3001

CMD ["npm", "start"]
```

## 🤝 Contributing

1. Follow the existing code style
2. Add proper error handling
3. Include input validation
4. Write tests for new features
5. Update documentation
6. Use conventional commit messages

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

1. Check the documentation
2. Review error logs
3. Check database connectivity
4. Verify environment variables
5. Contact the development team

---

**Built with ❤️ for the FairShare community**
