/**
 * AI Controller — Handles AI-powered course generation using Ollama (qwen2.5-coder:7b).
 *
 * This controller accepts a course title from the user, sends a structured prompt
 * to the local Ollama API, and returns a fully generated course outline with modules
 * and topics that can auto-fill the Create Course form.
 *
 * Rate-limit strategy:
 *   - Ultra-compact prompt to minimize token usage
 *   - Automatic retry with exponential backoff on errors
 *   - In-memory per-user cooldown to prevent rapid-fire requests
 *
 * Route: POST /api/ai/generate-course
 * Access: Private (requires auth token)
 */

const OpenAI = require('openai');

// ─── Retry Config ────────────────────────────────────────────────────────────
const MAX_RETRIES = 3;
const BASE_DELAY_MS = 2000; // 2s, 4s, 8s backoff

// ─── Per-user cooldown tracker (prevents rapid-fire abuse) ───────────────────
const userCooldowns = new Map();
const COOLDOWN_MS = 8000; // 8 seconds between requests per user

// ─── Ollama Client ────────────────────────────────────────────────────────────
const getClient = () => {
  return new OpenAI({
    baseURL: 'http://localhost:11434/v1',
    apiKey: 'ollama', // Ollama doesn't require a real API key
  });
};

// ─── Prompt Builder ──────────────────────────────────────────────────────────
const buildCoursePrompt = (title) =>
  `Generate a beginner course: ${JSON.stringify(title)}
JSON only. Schema: {"title":"string","description":"string(max 15 words)","modules":[{"title":"string(max 6 words)","topics":[{"title":"string(max 6 words)"}]}]}
Rules: exactly 4 modules, exactly 3 topics each, ordered basics→advanced, practical focus.`;

// ─── Retry Helper ────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isRateLimitError = (error) => {
  if (error?.status === 429) return true;
  const msg = error?.message?.toLowerCase() || '';
  return msg.includes('429') || msg.includes('resource has been exhausted') || msg.includes('quota');
};

const callOllamaWithRetry = async (prompt) => {
  const client = getClient();
  let lastError;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const completion = await client.chat.completions.create({
        model: 'qwen2.5-coder:7b',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 1200,
      });
      return completion.choices[0].message.content;
    } catch (error) {
      lastError = error;
      if (isRateLimitError(error) && attempt < MAX_RETRIES - 1) {
        const delay = BASE_DELAY_MS * Math.pow(2, attempt);
        console.warn(`[AI] Rate limited (attempt ${attempt + 1}/${MAX_RETRIES}), retrying in ${delay}ms...`);
        await sleep(delay);
      } else {
        throw error;
      }
    }
  }

  throw lastError;
};

// ─── Response Parser ─────────────────────────────────────────────────────────
const parseOllamaResponse = (text) => {
  let cleaned = text.trim();

  // Strip markdown code fences if the model wraps the response
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
  }

  let courseData;
  try {
    courseData = JSON.parse(cleaned);
  } catch (parseError) {
    console.error('[AI] Ollama response parse error:', cleaned.slice(0, 200));
    throw new Error('AI returned an invalid response. Please try again.');
  }

  // Validate structure
  if (!courseData.modules || !Array.isArray(courseData.modules) || courseData.modules.length === 0) {
    throw new Error('AI generated an invalid course structure. Please try again.');
  }

  // Normalize: ensure every module has a topics array
  courseData.modules = courseData.modules.map((mod) => ({
    title: mod.title || 'Untitled Module',
    topics: Array.isArray(mod.topics)
      ? mod.topics.map((t) => ({ title: t.title || 'Untitled Topic' }))
      : [],
  }));

  return courseData;
};

// ─── Controller ──────────────────────────────────────────────────────────────
/**
 * @desc    Generate a course outline using Ollama AI (qwen2.5-coder:7b)
 * @route   POST /api/ai/generate-course
 * @access  Private
 */
const generateCourse = async (req, res, next) => {
  try {
    const { title } = req.body;

    // Validate: title must not be empty
    if (!title || !title.trim()) {
      res.status(400);
      throw new Error('Please provide a course title to generate');
    }

    // Per-user cooldown check
    const userId = req.user?._id?.toString() || req.ip;
    const lastRequest = userCooldowns.get(userId);
    const now = Date.now();

    if (lastRequest && now - lastRequest < COOLDOWN_MS) {
      const waitSec = Math.ceil((COOLDOWN_MS - (now - lastRequest)) / 1000);
      res.status(429).json({
        message: `Please wait ${waitSec} second${waitSec > 1 ? 's' : ''} before generating again.`,
        retryAfter: waitSec,
      });
      return;
    }

    // Mark cooldown BEFORE the API call
    userCooldowns.set(userId, now);

    const prompt = buildCoursePrompt(title.trim());

    // Call Ollama with automatic retry on errors
    const text = await callOllamaWithRetry(prompt);
    const courseData = parseOllamaResponse(text);

    res.json({
      message: 'Course generated successfully',
      course: courseData,
    });

  } catch (error) {
    // Clear cooldown on failure so user can retry immediately
    const userId = req.user?._id?.toString() || req.ip;
    userCooldowns.delete(userId);

    // Handle rate limit errors
    if (isRateLimitError(error)) {
      res.set('Retry-After', '30');
      res.status(429);
      return next(new Error('AI rate limit reached. Please wait about 30 seconds and try again.'));
    }

    // Handle Ollama connection error (server not running)
    if (error?.code === 'ECONNREFUSED') {
      res.status(503);
      return next(new Error('Ollama is not running. Please start Ollama with "ollama serve" and try again.'));
    }

    next(error);
  }
};

// Clean up stale cooldowns every 5 minutes to prevent memory leak
setInterval(() => {
  const now = Date.now();
  for (const [key, timestamp] of userCooldowns) {
    if (now - timestamp > COOLDOWN_MS * 2) {
      userCooldowns.delete(key);
    }
  }
}, 5 * 60 * 1000);

module.exports = { generateCourse };