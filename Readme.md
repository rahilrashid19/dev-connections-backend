# Dev Connect Backend

A Node.js Express backend API for a dating application with user authentication, profile management, and user discovery features.

## Overview

Dev Connect is a backend service that provides REST API endpoints for user registration, authentication, profile management, and user browsing. It uses MongoDB for data persistence and JWT for secure authentication.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: Bcrypt
- **Validation**: Validator.js
- **Development**: Nodemon for auto-restart

## Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:

   ```
   JWT_SECRET=your_jwt_secret_key
   MONGODB_URI=your_mongodb_connection_string
   ```

4. Start the server:
   ```bash
   npm run dev    # Development mode with auto-reload
   npm start      # Production mode
   ```

The server will run on `http://localhost:3002`

## Project Structure

```
src/
├── app.js                 # Main application file with all routes
├── config/
│   └── dbConnection.js    # MongoDB connection configuration
├── middleware/
│   └── authMiddleWare.js  # JWT authentication middleware
├── models/
│   └── userModel.js      # Mongoose user schema
└── utils/
    └── validateSignUpApi.js # Sign-up validation logic
```

## Security Features

- Password hashing with Bcrypt (salt rounds: 12)
- JWT-based authentication with 1-day expiration
- Authorization checks to prevent users from modifying other users' data
- Input validation for sign-up
- Cookie-based token storage
- Email uniqueness validation

## Error Handling

The API returns appropriate HTTP status codes:

- **200**: Success
- **201**: Created
- **400**: Bad Request / Validation Error
- **401**: Unauthorized / Invalid Credentials
- **403**: Forbidden (insufficient permissions)
- **409**: Conflict (duplicate email)
- **500**: Internal Server Error

## Scripts

- `npm run dev` - Start development server with auto-reload
- `npm start` - Start production server
- `npm test` - Run tests (not configured yet)

## Author

Rahil Rashid

## License

MIT
