import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    trim: true,
    minlength: [3, "Username must be at least 3 characters long"],
    maxlength: [30, "Username cannot exceed 30 characters"],
    match: [/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"]
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"]
  },
  firstName: {
    type: String,
    trim: true,
    maxlength: [50, "First name cannot exceed 50 characters"]
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: [50, "Last name cannot exceed 50 characters"]
  },
  phone: {
    type: String,
    trim: true,
    match: [/^\+?[\d\s-()]+$/, "Please enter a valid phone number"]
  },
  profileImage: {
    type: String,
    default: null
  },
  dateOfBirth: {
    type: Date,
    validate: {
      validator: function(v) {
        return v <= new Date();
      },
      message: "Date of birth cannot be in the future"
    }
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  preferences: {
    currency: {
      type: String,
      default: "USD",
      enum: ["USD", "EUR", "GBP", "INR", "CAD", "AUD"]
    },
    language: {
      type: String,
      default: "en",
      enum: ["en", "es", "fr", "de", "hi", "zh"]
    },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false }
    }
  },
  financial: {
    totalBalance: { type: Number, default: 0 },
    monthlyIncome: { type: Number, default: 0 },
    monthlyExpenses: { type: Number, default: 0 },
    savingsGoal: { type: Number, default: 0 }
  },
  social: {
    friends: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],
    sentRequests: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],
    receivedRequests: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],
    groups: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group"
    }]
  },
  features: {
    stocks: [{
      symbol: String,
      shares: Number,
      purchasePrice: Number,
      purchaseDate: Date
    }],
    files: [{
      name: String,
      url: String,
      size: Number,
      type: String,
      uploadedAt: { type: Date, default: Date.now }
    }],
    badges: [{
      name: String,
      description: String,
      earnedAt: { type: Date, default: Date.now },
      icon: String
    }]
  },
  security: {
    token: String,
    lastLogin: Date,
    lastLogout: Date,
    loginAttempts: { type: Number, default: 0 },
    lockUntil: Date,
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: String
  },
  status: {
    type: String,
    enum: ["active", "inactive", "suspended", "pending"],
    default: "pending"
  },
  verification: {
    emailVerified: { type: Boolean, default: false },
    phoneVerified: { type: Boolean, default: false },
    emailVerificationToken: String,
    phoneVerificationCode: String,
    verificationExpires: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
userSchema.virtual("fullName").get(function() {
  if (this.firstName && this.lastName) {
    return `${this.firstName} ${this.lastName}`;
  }
  return this.username;
});

// Virtual for age
userSchema.virtual("age").get(function() {
  if (this.dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
  return null;
});

// Indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ "social.friends": 1 });
userSchema.index({ "social.groups": 1 });
userSchema.index({ status: 1 });

// Pre-save middleware to hash password if modified
userSchema.pre("save", async function(next) {
  if (this.isModified("password")) {
    const bcrypt = await import("bcryptjs");
    const saltRounds = 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  const bcrypt = await import("bcryptjs");
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to check if account is locked
userSchema.methods.isLocked = function() {
  return !!(this.security.lockUntil && this.security.lockUntil > Date.now());
};

// Method to increment login attempts
userSchema.methods.incLoginAttempts = function() {
  const updates = { $inc: { "security.loginAttempts": 1 } };
  
  if (this.security.loginAttempts + 1 >= 5 && !this.isLocked()) {
    updates.$set = { "security.lockUntil": Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
  }
  
  return this.updateOne(updates);
};

// Method to reset login attempts
userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $set: { "security.loginAttempts": 0 },
    $unset: { "security.lockUntil": 1 }
  });
};

const User = mongoose.model("User", userSchema);

export default User;