# ID Card System - Server

Backend server for ID Card Management System built with Express.js and MongoDB.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Make sure MongoDB is running locally or update the MONGODB_URI in `.env`

3. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Templates
- `GET /api/templates` - Get all templates
- `GET /api/templates/:id` - Get template by ID
- `POST /api/templates` - Create new template
- `PUT /api/templates/:id` - Update template
- `DELETE /api/templates/:id` - Delete template

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/employee/:employeeId` - Get user by employee ID
- `POST /api/users` - Create new user
- `POST /api/users/print` - Create/update user and prepare for print
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Health
- `GET /api/health` - Server health check

## Environment Variables

Create a `.env` file with:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/idcard_system
```
