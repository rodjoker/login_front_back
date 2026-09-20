import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';

const userA = { name: 'Grace Hopper', email: 'grace@example.com', password: 'SuperSecreta123' };
const userB = { name: 'Alan Turing', email: 'alan@example.com', password: 'OtraSecreta123' };

async function registerAndLogin(user) {
  const res = await request(app).post('/api/auth/register').send(user);
  return { token: res.body.data.token, id: res.body.data.user.id ?? res.body.data.user._id };
}

describe('GET /api/users', () => {
  it('rechaza la lista sin autenticación (401)', async () => {
    const res = await request(app).get('/api/users');
    expect(res.status).toBe(401);
  });

  it('devuelve la lista de usuarios para un usuario autenticado', async () => {
    const { token } = await registerAndLogin(userA);
    const res = await request(app).get('/api/users').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.users).toHaveLength(1);
  });
});

describe('PATCH /api/users/:id', () => {
  it('permite a un usuario actualizar su propio nombre', async () => {
    const { token, id } = await registerAndLogin(userA);

    const res = await request(app)
      .patch(`/api/users/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Grace B. Hopper' });

    expect(res.status).toBe(200);
    expect(res.body.data.user.name).toBe('Grace B. Hopper');
  });

  it('rechaza que un usuario edite a otro usuario (403)', async () => {
    const { token } = await registerAndLogin(userA);
    const { id: idB } = await registerAndLogin(userB);

    const res = await request(app)
      .patch(`/api/users/${idB}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Nombre Falso' });

    expect(res.status).toBe(403);
  });

  it('ignora intentos de cambiar password/role desde este endpoint', async () => {
    const { token, id } = await registerAndLogin(userA);

    const res = await request(app)
      .patch(`/api/users/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Grace Hopper', role: 'admin' });

    expect(res.status).toBe(200);
    expect(res.body.data.user.role).toBe('user');
  });
});

describe('DELETE /api/users/:id', () => {
  it('permite a un usuario eliminar su propia cuenta', async () => {
    const { token, id } = await registerAndLogin(userA);

    const res = await request(app).delete(`/api/users/${id}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);

    const getRes = await request(app).get(`/api/users/${id}`).set('Authorization', `Bearer ${token}`);
    // El usuario se borró a sí mismo: su propio token ya no resuelve a nadie.
    expect(getRes.status).toBe(401);
  });

  it('rechaza que un usuario elimine a otro usuario (403)', async () => {
    const { token } = await registerAndLogin(userA);
    const { id: idB } = await registerAndLogin(userB);

    const res = await request(app).delete(`/api/users/${idB}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(403);
  });
});
