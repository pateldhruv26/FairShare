import { ValidationError } from './errorHandler.js';

// Common validation patterns
const PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[\d\s\-\(\)]{10,15}$/,
  USERNAME: /^[a-zA-Z0-9_]{3,30}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  CURRENCY: /^\d+(\.\d{1,2})?$/,
  DATE: /^\d{4}-\d{2}-\d{2}$/,
  URL: /^https?:\/\/.+/,
  HEX_COLOR: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
};

// Validation functions
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    throw new ValidationError('Email is required and must be a string');
  }
  
  const trimmedEmail = email.trim().toLowerCase();
  
  if (!PATTERNS.EMAIL.test(trimmedEmail)) {
    throw new ValidationError('Invalid email format');
  }
  
  if (trimmedEmail.length > 254) {
    throw new ValidationError('Email is too long');
  }
  
  return trimmedEmail;
};

export const validateUsername = (username) => {
  if (!username || typeof username !== 'string') {
    throw new ValidationError('Username is required and must be a string');
  }
  
  const trimmedUsername = username.trim();
  
  if (trimmedUsername.length < 3) {
    throw new ValidationError('Username must be at least 3 characters long');
  }
  
  if (trimmedUsername.length > 30) {
    throw new ValidationError('Username cannot exceed 30 characters');
  }
  
  if (!PATTERNS.USERNAME.test(trimmedUsername)) {
    throw new ValidationError('Username can only contain letters, numbers, and underscores');
  }
  
  return trimmedUsername.toLowerCase();
};

export const validatePassword = (password, options = {}) => {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecialChars = true
  } = options;
  
  if (!password || typeof password !== 'string') {
    throw new ValidationError('Password is required and must be a string');
  }
  
  if (password.length < minLength) {
    throw new ValidationError(`Password must be at least ${minLength} characters long`);
  }
  
  if (requireUppercase && !/[A-Z]/.test(password)) {
    throw new ValidationError('Password must contain at least one uppercase letter');
  }
  
  if (requireLowercase && !/[a-z]/.test(password)) {
    throw new ValidationError('Password must contain at least one lowercase letter');
  }
  
  if (requireNumbers && !/\d/.test(password)) {
    throw new ValidationError('Password must contain at least one number');
  }
  
  if (requireSpecialChars && !/[@$!%*?&]/.test(password)) {
    throw new ValidationError('Password must contain at least one special character (@$!%*?&)');
  }
  
  return password;
};

export const validatePhone = (phone) => {
  if (!phone) return null; // Phone is optional
  
  const cleanedPhone = phone.replace(/[\s\-\(\)]/g, '');
  
  if (!PATTERNS.PHONE.test(phone)) {
    throw new ValidationError('Invalid phone number format');
  }
  
  return phone.trim();
};

export const validateCurrency = (amount, options = {}) => {
  const { min = 0, max = 999999999.99, allowNegative = false } = options;
  
  if (typeof amount !== 'number' || isNaN(amount)) {
    throw new ValidationError('Amount must be a valid number');
  }
  
  if (!allowNegative && amount < 0) {
    throw new ValidationError('Amount cannot be negative');
  }
  
  if (amount < min) {
    throw new ValidationError(`Amount must be at least ${min}`);
  }
  
  if (amount > max) {
    throw new ValidationError(`Amount cannot exceed ${max}`);
  }
  
  // Round to 2 decimal places
  return Math.round(amount * 100) / 100;
};

export const validateDate = (date, options = {}) => {
  const { 
    minDate = new Date('1900-01-01'), 
    maxDate = new Date('2100-12-31'),
    allowFuture = true,
    allowPast = true
  } = options;
  
  if (!date) {
    throw new ValidationError('Date is required');
  }
  
  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    throw new ValidationError('Invalid date format');
  }
  
  const now = new Date();
  
  if (!allowFuture && dateObj > now) {
    throw new ValidationError('Future dates are not allowed');
  }
  
  if (!allowPast && dateObj < now) {
    throw new ValidationError('Past dates are not allowed');
  }
  
  if (dateObj < minDate) {
    throw new ValidationError(`Date cannot be earlier than ${minDate.toISOString().split('T')[0]}`);
  }
  
  if (dateObj > maxDate) {
    throw new ValidationError(`Date cannot be later than ${maxDate.toISOString().split('T')[0]}`);
  }
  
  return dateObj;
};

export const validateObjectId = (id, fieldName = 'ID') => {
  if (!id) {
    throw new ValidationError(`${fieldName} is required`);
  }
  
  if (typeof id !== 'string') {
    throw new ValidationError(`${fieldName} must be a string`);
  }
  
  // MongoDB ObjectId pattern
  const objectIdPattern = /^[0-9a-fA-F]{24}$/;
  
  if (!objectIdPattern.test(id)) {
    throw new ValidationError(`Invalid ${fieldName} format`);
  }
  
  return id;
};

export const validateArray = (array, options = {}) => {
  const { 
    minLength = 0, 
    maxLength = 1000, 
    itemValidator = null,
    unique = false 
  } = options;
  
  if (!Array.isArray(array)) {
    throw new ValidationError('Value must be an array');
  }
  
  if (array.length < minLength) {
    throw new ValidationError(`Array must have at least ${minLength} items`);
  }
  
  if (array.length > maxLength) {
    throw new ValidationError(`Array cannot have more than ${maxLength} items`);
  }
  
  if (unique) {
    const uniqueArray = [...new Set(array)];
    if (uniqueArray.length !== array.length) {
      throw new ValidationError('Array items must be unique');
    }
  }
  
  if (itemValidator) {
    for (let i = 0; i < array.length; i++) {
      try {
        itemValidator(array[i], i);
      } catch (error) {
        throw new ValidationError(`Item at index ${i}: ${error.message}`);
      }
    }
  }
  
  return array;
};

export const validateString = (value, options = {}) => {
  const { 
    minLength = 0, 
    maxLength = 1000, 
    pattern = null,
    trim = true,
    allowEmpty = false
  } = options;
  
  if (typeof value !== 'string') {
    throw new ValidationError('Value must be a string');
  }
  
  let processedValue = value;
  
  if (trim) {
    processedValue = value.trim();
  }
  
  if (!allowEmpty && processedValue.length === 0) {
    throw new ValidationError('String cannot be empty');
  }
  
  if (processedValue.length < minLength) {
    throw new ValidationError(`String must be at least ${minLength} characters long`);
  }
  
  if (processedValue.length > maxLength) {
    throw new ValidationError(`String cannot exceed ${maxLength} characters`);
  }
  
  if (pattern && !pattern.test(processedValue)) {
    throw new ValidationError('String does not match required pattern');
  }
  
  return processedValue;
};

// Bulk validation function
export const validateObject = (data, schema) => {
  const validated = {};
  const errors = [];
  
  for (const [field, rules] of Object.entries(schema)) {
    try {
      if (rules.required && (data[field] === undefined || data[field] === null)) {
        errors.push(`${field} is required`);
        continue;
      }
      
      if (data[field] !== undefined && data[field] !== null) {
        if (rules.type === 'email') {
          validated[field] = validateEmail(data[field]);
        } else if (rules.type === 'username') {
          validated[field] = validateUsername(data[field]);
        } else if (rules.type === 'password') {
          validated[field] = validatePassword(data[field], rules.options);
        } else if (rules.type === 'phone') {
          validated[field] = validatePhone(data[field]);
        } else if (rules.type === 'currency') {
          validated[field] = validateCurrency(data[field], rules.options);
        } else if (rules.type === 'date') {
          validated[field] = validateDate(data[field], rules.options);
        } else if (rules.type === 'objectId') {
          validated[field] = validateObjectId(data[field], field);
        } else if (rules.type === 'array') {
          validated[field] = validateArray(data[field], rules.options);
        } else if (rules.type === 'string') {
          validated[field] = validateString(data[field], rules.options);
        } else if (rules.type === 'number') {
          const num = Number(data[field]);
          if (isNaN(num)) {
            errors.push(`${field} must be a valid number`);
            continue;
          }
          validated[field] = num;
        } else if (rules.type === 'boolean') {
          validated[field] = Boolean(data[field]);
        } else if (rules.custom) {
          validated[field] = rules.custom(data[field]);
        }
      } else if (rules.default !== undefined) {
        validated[field] = rules.default;
      }
    } catch (error) {
      errors.push(`${field}: ${error.message}`);
    }
  }
  
  if (errors.length > 0) {
    throw new ValidationError('Validation failed', errors);
  }
  
  return validated;
};

// Export patterns for external use
export { PATTERNS };
