# Express TypeScript API

A robust RESTful API boilerplate built with Node.js, Express, and TypeScript. This project features secure authentication, role-based access control, input validation, and comprehensive API documentation.

## 🚀 Features

- **TypeScript**: Written in TypeScript for type safety and better developer experience.
- **Authentication**: Secure user registration and login using JWT (JSON Web Tokens) and Bcrypt.
- **Database**: MySQL integration using `mysql2` with connection pooling.
- **Validation**: Request validation using `Zod` schemas.
- **Documentation**: Auto-generated API documentation using Swagger UI.
- **Architecture**: Modular structure with separation of concerns (Routes, Controllers/Handlers, Services/Models, Middlewares).
- **Security**:
  - Password hashing.
  - Protected routes with JWT middleware.
  - Resource ownership verification.
- **Error Handling**: Centralized global error handling mechanism.

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MySQL
- **Validation**: Zod
- **Authentication**: jsonwebtoken, bcrypt
- **Documentation**: swagger-jsdoc, swagger-ui-express

## 📋 Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14 or higher)
- npm or yarn
- MySQL Server

## ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AndrewMoisa/express-ts-skeleton.git
   cd CA-Development-Platforms
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory and add the following configuration:

   ```env
   PORT=3000
   NODE_ENV=development
   
   # Database Configuration
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=express_ts_db
   DB_PORT=3306

   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key
   ```

4. **Database Setup**
   Ensure your MySQL server is running and create the database specified in `DB_NAME`.
   
   You will need to create the following tables:
   
   ```sql
   CREATE TABLE users (
     id INT AUTO_INCREMENT PRIMARY KEY,
     username VARCHAR(255) NOT NULL UNIQUE,
     email VARCHAR(255) NOT NULL UNIQUE,
     password_hash VARCHAR(255) NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   CREATE TABLE articles (
     id INT AUTO_INCREMENT PRIMARY KEY,
     title VARCHAR(255) NOT NULL,
     body TEXT NOT NULL,
     category VARCHAR(100) NOT NULL,
     submitted_by_user_id INT NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (submitted_by_user_id) REFERENCES users(id) ON DELETE CASCADE
   );
   ```

## 🚀 Running the Application

**Development Mode** (with hot-reloading):
```bash
npm run dev
```

**Build for Production**:
```bash
npm run build
```

**Start Production Server**:
```bash
npm start
```

## 📚 API Documentation

Once the application is running, you can access the Swagger API documentation at:

```
http://localhost:3000/api-docs
```

## 📂 Project Structure

```
src/
├── config/         # Environment and database configuration
├── interfaces/     # TypeScript interfaces and types
├── middlewares/    # Express middlewares (Auth, Validation, Error handling)
├── routes/         # API route definitions
├── schemas/        # Zod validation schemas
├── utils/          # Utility functions (JWT, AppError)
├── app.ts          # Express app setup
└── index.ts        # Entry point
```

## 💭 Motivation

### Why I chose Option 1 (API Development)
I chose to focus on the backend API development because I enjoy the logic and structure involved in server-side programming. Designing efficient database schemas, implementing secure authentication flows, and ensuring data integrity through rigorous validation are challenges I find rewarding. It allows me to build a strong foundation that any frontend client could consume.

### Development Process
**What I liked:**
- Implementing the **Middleware pattern** for authentication and validation was very satisfying as it keeps the code clean and DRY (Don't Repeat Yourself).
- Working with **TypeScript** provided a great developer experience with autocompletion and type safety, catching errors before runtime.
- Setting up **Swagger** documentation made testing endpoints much easier and professional.

**What I didn't enjoy:**
- Writing raw SQL queries can be error-prone and verbose compared to using an ORM, though it was good for understanding the underlying database interactions.
- Handling all the edge cases for error handling took a significant amount of time to get right.

### Challenges
- **Authentication Flow**: Correctly implementing JWT storage and verifying tokens while handling expiration and security edge cases was complex.
- **Type Safety with Express**: Extending Express Request types to include user information (e.g., `req.user`) required understanding TypeScript declaration merging and type assertions.

### Custom API vs SaaS (e.g., Supabase)
**Benefits of Custom API:**
- **Full Control**: You have complete control over the architecture, database optimization, and business logic.
- **No Vendor Lock-in**: You aren't tied to a specific platform's pricing or limitations.
- **Custom Logic**: Complex business rules that don't fit into standard CRUD operations are easier to implement in code.

## 📄 License

This project is licensed under the ISC License.
