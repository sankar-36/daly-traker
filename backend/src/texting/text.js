/**
 * test.js — Manual test script for Ollama AI course generation
 * 
 * Usage: node test.js
 * Make sure Ollama is running: ollama serve
 * Make sure model is pulled:   ollama pull qwen2.5-coder:7b
 */

const OpenAI = require('openai');

const client = new OpenAI({
  baseURL: 'http://localhost:11434/v1',
  apiKey: 'ollama',
});

const buildCoursePrompt = (title) =>
  `Generate a beginner course: ${JSON.stringify(title)}
JSON only. Schema: {"title":"string","description":"string(max 15 words)","modules":[{"title":"string(max 6 words)","topics":[{"title":"string(max 6 words)"}]}]}
Rules: exactly 4 modules, exactly 3 topics each, ordered basics→advanced, practical focus.`;

const testTitles = [
  'JavaScript for Beginners',
  'Introduction to Machine Learning',
  'Flutter Mobile Development',
];

const runTest = async (title) => {
  console.log('\n─────────────────────────────────────────');
  console.log(`Testing title: "${title}"`);
  console.log('─────────────────────────────────────────');

  try {
    const prompt = buildCoursePrompt(title);

    console.log('⏳ Sending request to Ollama...');
    const completion = await client.chat.completions.create({
      model: 'qwen2.5-coder:7b',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 1200,
    });

    const rawText = completion.choices[0].message.content;
    console.log('\n📦 Raw Response:');
    console.log(rawText);

    // Strip markdown fences if present
    let cleaned = rawText.trim();
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
    }

    // Parse JSON
    const courseData = JSON.parse(cleaned);

    console.log('\n✅ Parsed Course Data:');
    console.log(`   Title      : ${courseData.title}`);
    console.log(`   Description: ${courseData.description}`);
    console.log(`   Modules    : ${courseData.modules.length}`);

    courseData.modules.forEach((mod, i) => {
      console.log(`\n   Module ${i + 1}: ${mod.title}`);
      mod.topics.forEach((topic, j) => {
        console.log(`      Topic ${j + 1}: ${topic.title}`);
      });
    });

    // Basic validation checks
    console.log('\n🔍 Validation:');
    console.log(`   Module count is 4 : ${courseData.modules.length === 4 ? '✅ Pass' : '❌ Fail'}`);
    const allHave3Topics = courseData.modules.every((m) => m.topics.length === 3);
    console.log(`   All modules have 3 topics: ${allHave3Topics ? '✅ Pass' : '❌ Fail'}`);

  } catch (error) {
    if (error?.code === 'ECONNREFUSED') {
      console.error('\n❌ Ollama is not running!');
      console.error('   Run this command first: ollama serve');
    } else if (error instanceof SyntaxError) {
      console.error('\n❌ JSON Parse Error — model returned invalid JSON');
      console.error('   Try running the test again');
    } else {
      console.error('\n❌ Unexpected Error:', error.message);
    }
  }
};

const runAllTests = async () => {
  console.log('🚀 Starting Ollama AI Controller Tests');
  console.log('   Model  : qwen2.5-coder:7b');
  console.log('   URL    : http://localhost:11434/v1');

  for (const title of testTitles) {
    await runTest(title);
  }

  console.log('\n─────────────────────────────────────────');
  console.log('✅ All tests completed');
  console.log('─────────────────────────────────────────\n');
};

runAllTests();