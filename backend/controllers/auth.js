import mongoose from "mongoose";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// Custom error class for better error handling
export class AuthError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.name = "AuthError";
  }
}

// Helper function to create JWT token
const createToken = (userId, username) => {
  return jwt.sign(
    { userId, username },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

// Helper function to send consistent responses
const sendResponse = (res, data, message = "Success", statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    statusCode
  });
};

// Helper function to send error responses
const sendError = (res, message, statusCode = 400) => {
  res.status(statusCode).json({
    success: false,
    message,
    statusCode
  });
};

export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Input validation
    if (!username || !email || !password) {
      return sendError(res, "Username, email, and password are required", 400);
    }

    if (password.length < 6) {
      return sendError(res, "Password must be at least 6 characters long", 400);
    }

    // Check if email is already in use
    const existingUserByEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingUserByEmail) {
      return sendError(res, "Email is already in use", 409);
    }

    // Check if username is already in use
    const existingUserByUsername = await User.findOne({ username: username.toLowerCase() });
    if (existingUserByUsername) {
      return sendError(res, "Username is already in use", 409);
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = new User({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword,
      createdAt: new Date()
    });

    await newUser.save();

    // Create token
    const token = createToken(newUser._id, newUser.username);

    // Remove password from response
    const userResponse = newUser.toObject();
    delete userResponse.password;

    sendResponse(res, { user: userResponse, token }, "User registered successfully", 201);

  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Input validation
    if (!username || !password) {
      return sendError(res, "Username and password are required", 400);
    }

    // Find user by username
    const user = await User.findOne({ 
      username: username.toLowerCase() 
    });

    if (!user) {
      return sendError(res, "Invalid username or password", 401);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return sendError(res, "Invalid username or password", 401);
    }

    // Create new token
    const token = createToken(user._id, user.username);

    // Update user's token
    user.token = token;
    user.lastLogin = new Date();
    await user.save();

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    sendResponse(res, { user: userResponse, token }, "Login successful");

  } catch (error) {
    next(error);
  }
};

export const signout = async (req, res, next) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return sendError(res, "User ID is required", 400);
    }

    // Clear user's token
    await User.findByIdAndUpdate(userId, { 
      $unset: { token: 1 },
      lastLogout: new Date()
    });

    sendResponse(res, null, "Logout successful");

  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return sendError(res, "User ID is required", 400);
    }

    const user = await User.findById(userId);
    if (!user) {
      return sendError(res, "User not found", 404);
    }

    // Create new token
    const token = createToken(user._id, user.username);

    // Update user's token
    user.token = token;
    await user.save();

    sendResponse(res, { token }, "Token refreshed successfully");

  } catch (error) {
    next(error);
  }
};