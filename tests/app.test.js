import request from 'supertest';
import app from '../app.js';

// ─────────────────────────────────────────────────────────────────────────────
// Test Suite — GitHub Actions CI/CD Tutorial API
// Run: npm test
// ─────────────────────────────────────────────────────────────────────────────

describe('GET /', () => {
  it('returns 200 with API metadata', async () => {
    const { status, body } = await request(app).get('/');
    expect(status).toBe(200);
    expect(body.name).toBe('GitHub Actions CI/CD Tutorial API');
    expect(body.status).toBe('healthy');
    expect(body).toHaveProperty('version');
    expect(body).toHaveProperty('environment');
  });
});

describe('GET /api/health', () => {
  it('returns status UP with uptime and timestamp', async () => {
    const { status, body } = await request(app).get('/api/health');
    expect(status).toBe(200);
    expect(body.status).toBe('UP');
    expect(typeof body.uptime).toBe('number');
    expect(body.uptime).toBeGreaterThanOrEqual(0);
    expect(body.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/); // ISO 8601 format
  });
});

describe('GET /api/products', () => {
  it('returns the full product catalogue', async () => {
    const { status, body } = await request(app).get('/api/products');
    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.count).toBe(3);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data[0]).toEqual(
      expect.objectContaining({ id: 1, name: expect.any(String), price: expect.any(Number) })
    );
  });
});

describe('POST /api/calculate', () => {
  it('correctly applies a 20 % discount on 100', async () => {
    const { status, body } = await request(app)
      .post('/api/calculate')
      .send({ amount: 100, discountPercent: 20 });

    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.discountAmount).toBe(20);
    expect(body.finalPrice).toBe(80);
  });

  it('handles floating-point amounts correctly', async () => {
    const { status, body } = await request(app)
      .post('/api/calculate')
      .send({ amount: 99.99, discountPercent: 10 });

    expect(status).toBe(200);
    expect(body.finalPrice).toBe(89.99);
  });

  it('returns 400 when amount is a string', async () => {
    const { status, body } = await request(app)
      .post('/api/calculate')
      .send({ amount: 'xyz', discountPercent: 10 });

    expect(status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.error).toContain('must be numbers');
  });

  it('returns 400 when amount is negative', async () => {
    const { status, body } = await request(app)
      .post('/api/calculate')
      .send({ amount: -50, discountPercent: 10 });

    expect(status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.error).toContain('positive');
  });

  it('returns 400 when discountPercent > 100', async () => {
    const { status, body } = await request(app)
      .post('/api/calculate')
      .send({ amount: 100, discountPercent: 150 });

    expect(status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.error).toContain('between 0 and 100');
  });

  it('returns 400 when discountPercent is negative', async () => {
    const { status, body } = await request(app)
      .post('/api/calculate')
      .send({ amount: 100, discountPercent: -5 });

    expect(status).toBe(400);
    expect(body.success).toBe(false);
  });

  it('handles 0 % discount (no change)', async () => {
    const { status, body } = await request(app)
      .post('/api/calculate')
      .send({ amount: 200, discountPercent: 0 });

    expect(status).toBe(200);
    expect(body.finalPrice).toBe(200);
    expect(body.discountAmount).toBe(0);
  });

  it('handles 100 % discount (free item)', async () => {
    const { status, body } = await request(app)
      .post('/api/calculate')
      .send({ amount: 200, discountPercent: 100 });

    expect(status).toBe(200);
    expect(body.finalPrice).toBe(0);
    expect(body.discountAmount).toBe(200);
  });
});

describe('404 handler', () => {
  it('returns 404 for unknown routes', async () => {
    const { status, body } = await request(app).get('/does-not-exist');
    expect(status).toBe(404);
    expect(body.success).toBe(false);
    expect(body.error).toContain('not found');
  });
});
