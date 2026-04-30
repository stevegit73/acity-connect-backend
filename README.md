# ACITY Connect - Backend API

## Project Overview
RESTful API for ACITY Connect, a campus marketplace and skill exchange platform for ACity students. Provides authentication, user profiles, listings management, messaging, and admin features.

## Deployment Link
(Add your Render URL here after deploying)

## Technology Stack
- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- bcryptjs

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user (ACity email only) |
| POST | /api/auth/login | Login user |
| GET | /api/users/profile | Get user profile |
| PUT | /api/users/profile | Update user profile |
| GET | /api/listings | Get all listings |
| POST | /api/listings | Create new listing |
| DELETE | /api/listings/:id | Delete listing |
| POST | /api/interests | Express interest in listing |
| POST | /api/messages | Send message |
| GET | /api/messages/conversations | Get conversations |
| GET | /api/admin/stats | Get platform statistics |

## Installation Instructions

```bash
# Clone the repository
git clone https://github.com/stevegit73/acity-connect-backend.git

# Navigate to project folder
cd acity-connect-backend

# Install dependencies
npm install

# Create .env file
echo "PORT=5002" > .env
echo "JWT_SECRET=your_secret_key" >> .env
echo "DATABASE_URL=your_postgresql_url" >> .env

# Start the server
npm run dev
