import { Router } from "express";
import bcrypt from "bcrypt";
import { ResultSetHeader } from "mysql2";
import { pool } from "../config/database";
import { validate } from "../middlewares/validateResource";
import { registerSchema, loginSchema } from "../schemas/auth.schema";
import { User, UserResponse } from "../interfaces/interfaces";
import { generateToken } from "../utils/jwt";

const router = Router();

router.post("/register", validate(registerSchema), async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // check if user already exists
    const [rows] = await pool.execute(
      "select * from users where email = ? or username = ?",
      [email, username]
    );

    const existingUsers = rows as User[];

    if (existingUsers.length > 0) {
      return res.status(400).json({
        error: "User with this email or username already exists",
      });
    }

    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltRounds);

    const [result]: [ResultSetHeader, any] = await pool.execute(
      "insert into users (username, email, password_hash) values (?, ?, ?)",
      [username, email, hashPassword]
    );

    const userResponse: UserResponse = {
      id: result.insertId,
      username,
      email,
    };

    res.status(201).json({
      message: "User registered",
      user: userResponse,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      error: "Failed to register user",
    });
  }
});

router.post("/login", validate(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await pool.execute("select * from users where email = ?", [
      email,
    ]);

    const users = rows as User[];

    if (users.length === 0) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const user = users[0];

    const validPassword = await bcrypt.compare(password, user.password_hash!);

    if (!validPassword) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const token = generateToken(user.id);

    const userResponse: UserResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    res.json({
      message: "Login successful",
      user: userResponse,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      error: "Failed to log in",
    });
  }
});

export default router;