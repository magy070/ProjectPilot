import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../server.js';
import User from '../models/User.js';

describe('Auth Integration Tests', () => {
  beforeAll(async () => {
    // Clear user test entries
    await User.deleteMany({ email: 'test_user_integration@example.com' });
  });

  afterAll(async () => {
    // Clean database test entries
    await User.deleteMany({ email: 'test_user_integration@example.com' });
  });

  let accessToken = '';
  let refreshToken = '';

  it('should successfully sign up a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Integration Test User',
        email: 'test_user_integration@example.com',
        password: 'SecureP@ss123',
        skills: ['React', 'Node.js'],
        interests: ['Web Dev']
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
    expect(res.body.user.name).toBe('Integration Test User');
    
    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;
  });

  it('should reject signup with an existing email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Integration Test User 2',
        email: 'test_user_integration@example.com',
        password: 'SecureP@ss123'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.code).toBe('USER_ALREADY_EXISTS');
  });

  it('should login successfully with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test_user_integration@example.com',
        password: 'SecureP@ss123'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
  });

  it('should reject login with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test_user_integration@example.com',
        password: 'wrongpassword'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.code).toBe('INVALID_CREDENTIALS');
  });

  it('should access protected profile route with valid token', async () => {
    const res = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.email).toBe('test_user_integration@example.com');
  });

  it('should reject profile access with invalid token', async () => {
    const res = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer invalidtoken`);

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.code).toBe('UNAUTHORIZED_TOKEN_INVALID');
  });
});
