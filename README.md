# SkillConnect

A backend API for a skill-sharing and professional networking platform built with Node.js and Express.

## Project Overview

SkillConnect is a RESTful API that enables users to connect, share skills, and manage professional interactions. The platform supports user authentication, profile management, ticket systems, and peer reviews/ratings.

## Features

- **User Authentication**: JWT-based authentication with secure password hashing
- **Profile Management**: User profile creation and management with skills
- **Ticket System**: Create and manage skill-sharing ticket requests
- **Reviews & Ratings**: Leave and view reviews and ratings for other users
- **File Uploads**: Support for profile images and ticket attachments
- **Authorization**: Role-based access control with admin middleware

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ORM)
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Bcrypt for password hashing
- **File Management**: Multer for handling file uploads

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/diwasbk/SkillConnect.git
cd SkillConnect
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/skillconnect
JWT_SECRET=your_secret_key_here
```

4. Start the development server:
```bash
npm run dev
```

The server will run on the specified PORT (default: 5000).

## Project Structure

```
├── app.js                          # Main application entry point
├── config/
│   └── index.js                    # Configuration settings
├── controllers/                    # Business logic for routes
│   ├── authController.js
│   ├── profileController.js
│   ├── reviewController.js
│   ├── reviewAndRatingController.js
│   ├── ratingController.js
│   ├── ticketController.js
│   └── userController.js
├── db/
│   └── db.js                       # Database connection
├── middlewares/                    # Express middlewares
│   ├── adminAuthMiddleware.js
│   └── multerMiddleware.js
├── models/                         # Database schemas
│   ├── profileModel.js
│   ├── reviewAndRatingModel.js
│   ├── ticketModel.js
│   └── userModel.js
├── routes/                         # API routes
│   ├── authRoute.js
│   ├── profileRoute.js
│   ├── reviewAndRatingRoute.js
│   ├── reviewRoute.js
│   ├── ratingRoute.js
│   ├── ticketRoute.js
│   └── userRoute.js
├── utils/
│   └── jwt.js                      # JWT utilities
├── uploads/                        # Directory for uploaded files
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `PATCH /api/auth/change-password` - Change account password (requires JWT)

### Profile
- `POST /api/profile/create` - Create a user profile (with file upload)
- `GET /api/profile/:profileId` - Get profile by profile ID
- `PUT /api/profile/new-skill` - Add a new skill to profile
- `DELETE /api/profile/delete-skill/:skillId` - Delete a skill by skill ID
- `PATCH /api/profile/update-profile-image` - Update profile image (with file upload)

### Users
- `GET /api/user/all` - Get all users
- `GET /api/user/:userId` - Get user by user ID
- `DELETE /api/user/delete-account-permanently` - Delete own account permanently
- `DELETE /api/user/delete-account-permanently-by-admin/:userId` - Delete user account by admin (admin only)

### Tickets
- `POST /api/ticket/request` - Request a ticket (with optional file upload)
- `GET /api/ticket/` - Get all tickets filtered by status
- `GET /api/ticket/:ticketId` - Get ticket by ticket ID
- `GET /api/ticket/requested/:userId` - Get all tickets requested by a user
- `GET /api/ticket/received/:userId` - Get all tickets received by a user
- `PATCH /api/ticket/accept-request/:ticketId` - Accept a ticket request
- `PATCH /api/ticket/reject-request/:ticketId` - Reject a ticket request
- `PATCH /api/ticket/edit-requested-ticket/:ticketId` - Edit a requested ticket (with optional file upload)
- `DELETE /api/ticket/delete-requested-ticket/:ticketId` - Delete a requested ticket

### Reviews
- `POST /api/review/give/:toUserId` - Give a review to another user

### Ratings
- `PUT /api/rating/give/:toUserId` - Give a rating to another user

### Review & Ratings (Combined)
- `GET /api/review-rating/` - Get all reviews and ratings
- `GET /api/review-rating/:reviewRatingId` - Get specific review and rating by ID
- `GET /api/review-rating/given/:fromUserId` - Get all reviews and ratings given by a user
- `GET /api/review-rating/received/:toUserId` - Get all reviews and ratings received by a user
- `DELETE /api/review-rating/delete/:reviewAndRatingId` - Delete a review and rating

## Security Notes

- All sensitive routes (except auth) are protected with JWT middleware
- Passwords are hashed using bcrypt before storage
- Admin routes use `adminAuthMiddleware` for additional protection
- Uploaded files are served statically from the `/uploads` directory

## Author

[Diwas](https://github.com/diwasbk)
