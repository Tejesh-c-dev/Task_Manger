# Task Manager - Industry-Level Application

A full-stack task management application built with the MERN stack, featuring user authentication, role-based access control, and enterprise-grade security.

## Features

### Authentication & Security
- JWT-based authentication with access & refresh tokens
- Password hashing with bcrypt (cost factor 12)
- HTTP-only cookies for secure token storage
- Rate limiting to prevent brute-force attacks
- Helmet.js for security headers
- CORS configuration
- Input validation with express-validator

### Task Management
- Create, read, update, and delete tasks
- Task priorities (low, medium, high)
- Task completion tracking with timestamps
- Filter tasks by status (all, pending, completed)
- Task statistics dashboard
- Bulk delete completed tasks

### User Features
- User registration and login
- Profile management
- Password updates
- Account deactivation

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **helmet** - Security headers
- **morgan** - HTTP logging
- **express-rate-limit** - Rate limiting

### Frontend
- **React 18** - UI library
- **React Router 6** - Client-side routing
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **Context API** - State management

## Project Structure

```
task-manager/
├── client/                    # React Frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── api/
│   │   │   └── api.js         # Axios configuration
│   │   ├── components/
│   │   │   ├── Filter.js
│   │   │   ├── Navbar.js
│   │   │   ├── ProtectedRoute.js
│   │   │   ├── Stats.js
│   │   │   ├── TaskForm.js
│   │   │   ├── TaskItem.js
│   │   │   └── TaskList.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── Dashboard.js
│   │   │   ├── Login.js
│   │   │   └── Register.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── styles.css
│   └── package.json
├── server/                    # Node.js Backend
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   └── controller.js      # Task controller
│   ├── middleware/
│   │   ├── auth.js            # JWT authentication
│   │   ├── errorHandler.js    # Global error handling
│   │   └── validate.js        # Input validation
│   ├── models/
│   │   ├── Task.js
│   │   └── User.js
│   ├── routers/
│   │   ├── authRouter.js
│   │   └── router.js          # Task routes
│   ├── utils/
│   │   └── tokenUtils.js      # JWT utilities
│   ├── .env
│   ├── package.json
│   └── server.js
├── package.json               # Root monorepo package
└── README.md
```

## Quick Start

### Install all dependencies
```bash
npm run install:all
```

### Run both client and server simultaneously
```bash
npm run dev
```

### Run individually
```bash
npm run client   # Start React app (http://localhost:3000)
npm run server   # Start API server (http://localhost:4000)
```

## Installation (Manual)

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from example:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```env
PORT=4000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
CORS_ORIGIN=http://localhost:3000
```

5. Start the server:
```bash
npm start
```

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | Login user |
| POST | `/api/v1/auth/logout` | Logout user |
| POST | `/api/v1/auth/refresh` | Refresh access token |
| GET | `/api/v1/auth/me` | Get current user |
| PUT | `/api/v1/auth/profile` | Update profile |
| PUT | `/api/v1/auth/password` | Update password |
| DELETE | `/api/v1/auth/account` | Deactivate account |

### Tasks (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/tasks` | Get all user tasks |
| POST | `/api/v1/tasks` | Create new task |
| GET | `/api/v1/tasks/:id` | Get single task |
| PUT | `/api/v1/tasks/:id` | Update task |
| DELETE | `/api/v1/tasks/:id` | Delete task |
| PUT | `/api/v1/tasks/:id/toggle` | Toggle task status |
| GET | `/api/v1/tasks/stats` | Get task statistics |
| DELETE | `/api/v1/tasks/completed` | Delete all completed |

### Query Parameters
- `completed` - Filter by completion status (true/false)
- `priority` - Filter by priority (low/medium/high)
- `sort` - Sort fields (-createdAt, priority, dueDate)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 50)

## Security Best Practices

1. **Environment Variables**: Never commit `.env` files
2. **Strong Passwords**: Enforce password complexity
3. **Token Security**: Short-lived access tokens, HTTP-only cookies
4. **Rate Limiting**: Protect against brute-force attacks
5. **Input Validation**: Sanitize all user inputs
6. **Error Handling**: Don't expose stack traces in production

## Development

```bash
# Run backend in development mode
cd backend && npm start

# Run frontend in development mode
npm start
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Use strong, unique secrets for JWT
3. Configure proper CORS origins
4. Enable HTTPS
5. Use a process manager (PM2)
6. Set up MongoDB Atlas or managed database

## License

MIT
