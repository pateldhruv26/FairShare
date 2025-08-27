import jwt from "jsonwebtoken";
import User from '../models/user.js';

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key";

// Custom error class for authentication errors
export class AuthMiddlewareError extends Error {
  constructor(message, statusCode = 401) {
    super(message);
    this.statusCode = statusCode;
    this.name = "AuthMiddlewareError";
  }
}

// Helper function to send consistent error responses
const sendAuthError = (res, message, statusCode = 401) => {
  res.status(statusCode).json({
    success: false,
    message,
    statusCode,
    timestamp: new Date().toISOString()
  });
};

// Main authentication middleware
export const authMiddleware = async (req, res, next) => {
  try {
    // Check if authorization header is present
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return sendAuthError(res, "Authorization header is required", 401);
    }

    // Check if it's a Bearer token
    if (!authHeader.startsWith("Bearer ")) {
      return sendAuthError(res, "Invalid authorization format. Use 'Bearer <token>'", 401);
    }

    // Extract token from header
    const token = authHeader.split(" ")[1];
    
    if (!token) {
      return sendAuthError(res, "Token is required", 401);
    }

    try {
      // Verify JWT token
      const decoded = jwt.verify(token, JWT_SECRET);
      
      if (!decoded.userId) {
        return sendAuthError(res, "Invalid token format", 401);
      }

      // Find user in database
      const user = await User.findById(decoded.userId)
        .select('-password -security.twoFactorSecret')
        .populate('social.friends', 'username profileImage status')
        .populate('social.groups', 'name description');

      if (!user) {
        return sendAuthError(res, "User not found", 404);
      }

      // Check if user account is active
      if (user.status !== 'active') {
        return sendAuthError(res, `Account is ${user.status}. Please contact support.`, 403);
      }

      // Check if account is locked
      if (user.security && user.security.lockUntil && user.security.lockUntil > Date.now()) {
        return sendAuthError(res, "Account is temporarily locked due to multiple failed login attempts", 423);
      }

      // Add user to request object
      req.user = user;
      
      // Add token info to request for potential use
      req.token = {
        userId: decoded.userId,
        username: decoded.username,
        issuedAt: decoded.iat,
        expiresAt: decoded.exp
      };

      next();

    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return sendAuthError(res, "Token has expired", 401);
      } else if (jwtError.name === 'JsonWebTokenError') {
        return sendAuthError(res, "Invalid token", 401);
      } else {
        return sendAuthError(res, "Token verification failed", 401);
      }
    }

  } catch (error) {
    console.error("Authentication middleware error:", error);
    return sendAuthError(res, "Internal server error during authentication", 500);
  }
};

// Optional authentication middleware (doesn't fail if no token)
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId)
          .select('-password -security.twoFactorSecret')
          .populate('social.friends', 'username profileImage status')
          .populate('social.groups', 'name description');

        if (user && user.status === 'active') {
          req.user = user;
          req.token = {
            userId: decoded.userId,
            username: decoded.username,
            issuedAt: decoded.iat,
            expiresAt: decoded.exp
          };
        }
      } catch (error) {
        // Silently ignore token errors for optional auth
      }
    }
    
    next();
  } catch (error) {
    console.error("Optional auth middleware error:", error);
    next();
  }
};

// Role-based access control middleware
export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendAuthError(res, "Authentication required", 401);
    }

    // Check if user has any of the required roles
    // This can be extended based on your role system
    const userRole = req.user.role || 'user';
    
    if (!roles.includes(userRole)) {
      return sendAuthError(res, "Insufficient permissions", 403);
    }

    next();
  };
};

// Rate limiting middleware for authentication endpoints
export const authRateLimit = (req, res, next) => {
  // Simple in-memory rate limiting
  // In production, use Redis or similar for distributed rate limiting
  
  const clientIP = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  
  if (!req.app.locals.authAttempts) {
    req.app.locals.authAttempts = new Map();
  }
  
  const attempts = req.app.locals.authAttempts.get(clientIP) || { count: 0, resetTime: now + 15 * 60 * 1000 };
  
  if (now > attempts.resetTime) {
    attempts.count = 0;
    attempts.resetTime = now + 15 * 60 * 1000;
  }
  
  if (attempts.count >= 5) {
    return sendAuthError(res, "Too many authentication attempts. Please try again later.", 429);
  }
  
  attempts.count++;
  req.app.locals.authAttempts.set(clientIP, attempts);
  
  next();
};


