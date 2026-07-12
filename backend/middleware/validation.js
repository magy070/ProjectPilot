import { z } from 'zod';

// Utility middleware generator
export const validate = (schema, type = 'body') => (req, res, next) => {
  try {
    const validated = schema.parse(req[type]);
    req[type] = validated; // Assign parsed and cleaned inputs
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
      return res.status(400).json({
        success: false,
        message: messages,
        code: 'VALIDATION_ERROR'
      });
    }
    next(error);
  }
};

// Signup validation schema
export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').trim(),
  email: z.string().email('Invalid email format').trim(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
  skills: z.array(z.string()).optional().default([]),
  interests: z.array(z.string()).optional().default([]),
});

// Login validation schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email format').trim(),
  password: z.string().min(1, 'Password is required'),
});

// Profile update validation schema
export const profileUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').trim().optional(),
  skills: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
});

// Project query filter validation schema
export const projectQuerySchema = z.object({
  domain: z.string().optional(),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']).optional(),
  skills: z.string().optional(), // will parse as array/string manually in controller
  teamSize: z.string().optional(),
  estimatedTime: z.string().optional(),
});
