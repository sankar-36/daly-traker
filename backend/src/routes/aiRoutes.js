/**
 * AI Routes — Exposes AI-powered endpoints for course generation.
 * 
 * POST /api/ai/generate-course → Protected → Generates a full course outline via Gemini AI
 * 
 * Rate limiting: 6 requests per 10-minute window per user.
 * The controller also has its own per-user cooldown + retry logic.
 */

const express = require('express');
const { rateLimit } = require('express-rate-limit');
const router = express.Router();
const { generateCourse } = require('../controllers/aiController');
const { protect } = require('../middlewares/authMiddleware');

const aiGenerateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 6,                    // 6 requests per window (down from 10 to be safe with free tier)
  standardHeaders: true,
  legacyHeaders: false,
  validate: { keyGeneratorIpFallback: false }, // We key by user ID primarily; IP is only a fallback
  // Key by authenticated user ID, fallback to IP
  keyGenerator: (req) => {
    return req.user?._id ? `user:${req.user._id}` : `ip:${req.ip}`;
  },
  handler: (req, res) => {
    const retryAfterSeconds = req.rateLimit?.resetTime
      ? Math.ceil((req.rateLimit.resetTime.getTime() - Date.now()) / 1000)
      : 10 * 60;

    res.status(429).json({
      message: 'AI generation limit reached. Please wait before trying again.',
      retryAfter: Math.max(retryAfterSeconds, 1),
    });
  },
});

// POST /api/ai/generate-course
router.post('/generate-course', protect, aiGenerateLimiter, generateCourse);

module.exports = router;
