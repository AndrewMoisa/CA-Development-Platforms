# Express TypeScript Skeleton

A robust and production-ready boilerplate for building RESTful APIs with Node.js, Express, and TypeScript.

## 🚀 Features

- **Framework**: Built with [Express 5](https://expressjs.com/) and [TypeScript](https://www.typescriptlang.org/).
- **Database**: MySQL integration using [mysql2](https://github.com/sidorares/node-mysql2).
- **Authentication**: Secure JWT authentication with [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) and password hashing via [bcrypt](https://github.com/kelektiv/node.bcrypt.js).
- **Validation**: Request validation using [Zod](https://zod.dev/).
- **Documentation**: Auto-generated API docs with [Swagger UI](https://github.com/scottie1984/swagger-ui-express).
- **Environment**: Type-safe environment variables with [dotenv](https://github.com/motdotla/dotenv).
- **CORS**: Enabled via [cors](https://github.com/expressjs/cors).
- **Hot Reload**: Fast development experience with [tsx](https://github.com/privatenumber/tsx).

## 🛠️ Prerequisites

- Node.js (v18+ recommended)
- MySQL Server

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AndrewMoisa/express-ts-skeleton.git
   cd express-ts-skeleton
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Copy the example env file and update it with your credentials.
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your database details and JWT secret:
   ```env
   PORT=3000
   NODE_ENV=development
   JWT_SECRET=your_super_secret_key
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=password
   DB_NAME=express_ts_db
   DB_PORT=3306
   ```

## 🚀 Running the Project

### Development
Runs the application in development mode with hot-reloading.
```bash
npm run dev
```

### Production Build
Compiles the TypeScript code to JavaScript in the `dist` directory.
```bash
npm run build
```

### Start Production Server
Runs the compiled application from the `dist` directory.
```bash
npm start
```

## 📚 API Documentation

Once the server is running, you can access the Swagger API documentation at:

```
http://localhost:3000/api-docs
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📝 License

This project is [ISC](https://opensource.org/licenses/ISC) licensed.