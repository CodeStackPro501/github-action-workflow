import express from 'express';

const app = express();

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add response time header in all replies
app.use((req, res, next) => {
  res.setHeader('X-Powered-By', 'GitHub-Actions-Tutorial-API');
  next();
});

// ─── Routes ───────────────────────────────────────────────────────────────────

/**
 * GET /
 * Root — returns basic API metadata.
 */
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'GitHub Actions CI/CD Tutorial API',
    version: '1.0.0',
    status: 'healthy',
    environment: process.env.NODE_ENV || 'development',
  });
});

/**
 * GET /api/health
 * Health-check — called by the CD pipeline after each deployment.
 */
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

/**
 * GET /api/products
 * Returns a static product catalogue (great for CI test assertions).
 */
app.get('/api/products', (req, res) => {
  const products = [
    { id: 1, name: 'Docker Masterclass', price: 49 },
    { id: 2, name: 'Kubernetes in Production', price: 99 },
    { id: 3, name: 'GitHub Actions CI/CD', price: 79 },
  ];

  res.status(200).json({
    success: true,
    count: products.length,
    data: products,
  });
});

/**
 * POST /api/calculate
 * Applies a percentage discount to an amount.
 *
 * Body: { amount: number, discountPercent: number }
 */
app.post('/api/calculate', (req, res) => {
  const { amount, discountPercent } = req.body;

  if (typeof amount !== 'number' || typeof discountPercent !== 'number') {
    return res.status(400).json({
      success: false,
      error: 'amount and discountPercent must be numbers',
    });
  }

  if (amount < 0) {
    return res.status(400).json({
      success: false,
      error: 'amount must be a positive number',
    });
  }

  if (discountPercent < 0 || discountPercent > 100) {
    return res.status(400).json({
      success: false,
      error: 'discountPercent must be between 0 and 100',
    });
  }

  const discountAmount = parseFloat(((amount * discountPercent) / 100).toFixed(2));
  const finalPrice = parseFloat((amount - discountAmount).toFixed(2));

  return res.status(200).json({
    success: true,
    originalAmount: amount,
    discountPercent,
    discountAmount,
    finalPrice,
  });
});

// ─── 404 Catch-all ────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.path} not found`,
  });
});

// ─── Global Error Handler ──────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  console.error('[ERROR]', err.message);
  res.status(500).json({ success: false, error: 'Internal Server Error' });
});

export default app;
