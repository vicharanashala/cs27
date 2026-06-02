const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateEmbedding(text) {
  if (!text || typeof text !== 'string') throw new Error('Text is required');
  const trimmed = text.trim();
  if (trimmed.length < 3) throw new Error('Text too short');

  const model = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });
  const result = await model.embedContent(trimmed);
  return result.embedding.values;
}

module.exports = { generateEmbedding };