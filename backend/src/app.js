const express = require('express');
const cors    = require('cors');
const routes  = require('./routes/index');
const { errorHandler, notFound } = require('./middlewares/error.middleware');

const app = express();

// ── Middlewares ───────────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', methods: ['GET','POST','PUT','DELETE','PATCH'] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Health check (root-level for Docker) ─────────────────────────────────────
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

// ── API Routes (all under /api) ───────────────────────────────────────────────
app.use('/api', routes);

// ── Error handling ────────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
