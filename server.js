import app from './app.js';

const PORT = Number(process.env.PORT) || 3000;

const server = app.listen(PORT, () => {
  console.log('─────────────────────────────────────');
  console.log(`  API Server  →  http://localhost:${PORT}`);
  console.log(`  Health      →  http://localhost:${PORT}/api/health`);
  console.log(`  ENV         →  ${process.env.NODE_ENV || 'development'}`);
  console.log('─────────────────────────────────────');
});

// ─── Graceful Shutdown ─────────────────────────────────────────────────────────
// In production, process managers (PM2, Kubernetes) send SIGTERM before killing
// the process. We stop accepting new connections and let in-flight requests finish.
const shutdown = (signal) => {
  console.log(`\n[${signal}] Graceful shutdown initiated…`);
  server.close(() => {
    console.log('All connections closed. Process exiting.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
