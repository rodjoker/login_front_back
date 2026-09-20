import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';
import { User } from '../../src/models/User.model.js';

const validUser = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  password: 'SuperSecreta123',
};

describe('POST /api/auth/register', () => {
  it('registra un usuario nuevo y devuelve un JWT', async () => {
    const res = await request(app).post('/api/auth/register').send(validUser);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toEqual(expect.any(String));
    expect(res.body.data.user.email).toBe(validUser.email);
    expect(res.body.data.user.name).toBe(validUser.name);
  });

  it('nunca devuelve la contraseña ni los campos de bloqueo en la respuesta', async () => {
    const res = await request(app).post('/api/auth/register').send(validUser);

    expect(res.body.data.user.password).toBeUndefined();
    expect(res.body.data.user.loginAttempts).toBeUndefined();
    expect(res.body.data.user.lockUntil).toBeUndefined();
  });

  it('rechaza un registro con un correo que ya existe (409)', async () => {
    await request(app).post('/api/auth/register').send(validUser);
    const res = await request(app).post('/api/auth/register').send(validUser);

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('rechaza una contraseña demasiado corta (400)', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...validUser, email: 'otro@example.com', password: '123' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('rechaza un correo con formato inválido (400)', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...validUser, email: 'no-es-un-correo' });

    expect(res.status).toBe(400);
  });
});

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await request(app).post('/api/auth/register').send(validUser);
  });

  it('permite el login con credenciales correctas y devuelve un JWT', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: validUser.email, password: validUser.password });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toEqual(expect.any(String));
  });

  it('responde 401 con contraseña incorrecta e incrementa loginAttempts', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: validUser.email, password: 'contraseña-incorrecta' });

    expect(res.status).toBe(401);

    const user = await User.findOne({ email: validUser.email });
    expect(user.loginAttempts).toBe(1);
  });

  it('responde 401 para un correo que no existe, sin revelar que no existe', async () => {
    const resUsuarioInexistente = await request(app)
      .post('/api/auth/login')
      .send({ email: 'no-existe@example.com', password: 'cualquier-cosa123' });

    const resPasswordIncorrecta = await request(app)
      .post('/api/auth/login')
      .send({ email: validUser.email, password: 'contraseña-incorrecta' });

    expect(resUsuarioInexistente.status).toBe(401);
    expect(resPasswordIncorrecta.status).toBe(401);
    // Mismo mensaje en ambos casos: anti-enumeración de usuarios.
    expect(resUsuarioInexistente.body.message).toBe(resPasswordIncorrecta.body.message);
  });

  it('bloquea la cuenta tras el 3er intento fallido consecutivo (423)', async () => {
    await request(app).post('/api/auth/login').send({ email: validUser.email, password: 'mala-1' });
    await request(app).post('/api/auth/login').send({ email: validUser.email, password: 'mala-2' });
    const res = await request(app).post('/api/auth/login').send({ email: validUser.email, password: 'mala-3' });

    expect(res.status).toBe(423);
    expect(res.body.message).toMatch(/bloqueada/i);

    const user = await User.findOne({ email: validUser.email });
    expect(user.lockUntil).not.toBeNull();
    expect(user.lockUntil.getTime()).toBeGreaterThan(Date.now());
  });

  it('no bloquea la cuenta con solo 2 intentos fallidos', async () => {
    await request(app).post('/api/auth/login').send({ email: validUser.email, password: 'mala-1' });
    const res = await request(app).post('/api/auth/login').send({ email: validUser.email, password: 'mala-2' });

    expect(res.status).toBe(401);

    const user = await User.findOne({ email: validUser.email });
    expect(user.lockUntil).toBeNull();
  });

  it('rechaza el login en una cuenta bloqueada aunque la contraseña sea correcta (423)', async () => {
    await request(app).post('/api/auth/login').send({ email: validUser.email, password: 'mala-1' });
    await request(app).post('/api/auth/login').send({ email: validUser.email, password: 'mala-2' });
    await request(app).post('/api/auth/login').send({ email: validUser.email, password: 'mala-3' });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: validUser.email, password: validUser.password });

    expect(res.status).toBe(423);
  });

  it('resetea loginAttempts y lockUntil después de un login exitoso', async () => {
    await request(app).post('/api/auth/login').send({ email: validUser.email, password: 'mala-1' });

    await request(app)
      .post('/api/auth/login')
      .send({ email: validUser.email, password: validUser.password });

    const user = await User.findOne({ email: validUser.email });
    expect(user.loginAttempts).toBe(0);
    expect(user.lockUntil).toBeNull();
  });
});

describe('GET /api/auth/me', () => {
  it('rechaza el acceso sin token (401)', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('rechaza un token inválido (401)', async () => {
    const res = await request(app).get('/api/auth/me').set('Authorization', 'Bearer token-invalido');
    expect(res.status).toBe(401);
  });

  it('devuelve el perfil del usuario autenticado con un token válido', async () => {
    const registerRes = await request(app).post('/api/auth/register').send(validUser);
    const { token } = registerRes.body.data;

    const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.user.email).toBe(validUser.email);
  });
});
