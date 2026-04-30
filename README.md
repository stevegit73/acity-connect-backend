# ACITY Connect - Backend API

## Project Overview
RESTful API for ACITY Connect, a campus marketplace and skill exchange platform for ACity students. Provides secure authentication, user profiles, listings management, real-time messaging, and admin moderation features.

## Deployment Link
**Render Deployment:** https://acity-connect-backend.onrender.com

*Note: After deploying to Render, this link will be active.*

## Technology Stack
- Node.js (v20+)
- Express.js (v4)
- PostgreSQL (v16)
- JWT Authentication
- bcryptjs for password hashing

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user (ACity email only) |
| POST | /api/auth/login | Login user |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/users/profile | Get current user profile |
| PUT | /api/users/profile | Update user profile |
| GET | /api/users/:id | Get user by ID |

### Listings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/listings | Get all listings (with search/filter) |
| POST | /api/listings | Create new listing |
| DELETE | /api/listings/:id | Delete listing |

### Interests
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/interests | Express interest in a listing |
| GET | /api/interests/my | Get user's interests |

### Messages
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/messages | Send a message |
| GET | /api/messages/conversations | Get all conversations |
| GET | /api/messages/conversation/:userId | Get chat with specific user |
| GET | /api/messages/unread/count | Get unread message count |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/admin/listings | Get all listings for moderation |
| PUT | /api/admin/listings/:id | Update listing status |
| DELETE | /api/admin/listings/:id | Delete listing |
| GET | /api/admin/stats | Get platform statistics |

## Login Details (for testing)

| Role | Email | Password |
|------|-------|----------|
| Admin User | admin@acity.edu | admin123 |
| Test Student | try2@acity.edu | 123456 |
| Test Student | john@acity.edu | 123456 |

## Installation Instructions

### Prerequisites
- Node.js installed (v20 or higher)
- PostgreSQL database (or use Render PostgreSQL)

### Setup

```bash
# Clone the repository
git clone https://github.com/stevegit73/acity-connect-backend.git

# Navigate to project folder
cd acity-connect-backend

# Install dependencies
npm install

# Create .env file
cat > .env << 'EOF'
PORT=5002
JWT_SECRET=my_super_secret_key_12345
DATABASE_URL=postgresql://acityy_connect_db_user:TsHtRwp07HFk8Jd07tGZtIEMvMSIInXn@dpg-d7p9rmok1i2s738o2l6g-a.oregon-postgres.render.com:5432/acityy_connect_db?sslmode=require
EOF

# Start the server
npm run dev
