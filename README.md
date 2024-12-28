# Headless CMS Backend

A flexible and secure headless CMS backend built with Node.js that enables content management through RESTful APIs with Google OAuth authentication.

## 🚀 Features

- Google OAuth Authentication
- Custom Content Type Creation
- Dynamic API Endpoints
- Role-based Access Control
- API Key Authentication
- Comprehensive API Documentation
- JSON-based Responses
- Query Parameters for Filtering & Sorting

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: Passport.js with Google OAuth
- **Documentation**: Swagger UI
- **Testing**: Jest

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Google OAuth credentials
- npm or yarn

## ⚙️ Installation

1. Clone the repository:

```bash
git clone <repository-url>
```

```bash
cd headless-cms-backend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file in the root directory:

```bash
env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## 🏃‍♂️ Running the Application

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

## 📚 API Documentation

Access the Swagger documentation at: `http://localhost:3000/api-docs`

### Key Endpoints

#### Authentication

- `GET /auth/google` - Google OAuth login
- `GET /auth/google/callback` - OAuth callback URL
- `GET /auth/logout` - Logout user

#### User Management

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

#### Content Types

- `POST /api/content-types` - Create content type
- `GET /api/content-types` - List all content types
- `PUT /api/content-types/:id` - Update content type
- `DELETE /api/content-types/:id` - Delete content type

#### Dynamic Content Endpoints

## 👥 User Roles

- **Admin**: Full system access
- **Editor**: Can manage content
- **Viewer**: Read-only access

## 📈 Future Enhancements

- [ ] Version control for content
- [ ] Webhook integration
- [ ] Frontend dashboard
- [ ] Content validation rules
- [ ] Media asset management