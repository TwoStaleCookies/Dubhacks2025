const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { GoogleGenerativeAI } = require('@google/generative-ai');

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error('GEMINI_API_KEY missing in .env');
  process.exit(1);
}

const client = new GoogleGenerativeAI({ apiKey: API_KEY });
const MODEL = 'gemini-2.5-flash';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.send('ok'));

app.post('/generate', async (req, res) => {
  try {
    const { prompt, messages } = req.body;

    // Build contents in a shape the SDK accepts.
    // If caller sent `messages` (array), convert simple chat msg shape -> SDK shape.
    let contents;
    if (Array.isArray(messages) && messages.length) {
      contents = messages.map((m) => {
        // if already in SDK shape, pass through
        if (m.parts || m.type) return m;
        // convert { role, text } -> { role, parts: [{ text }] }
        return {
          role: m.role === 'assistant' ? 'assistant' : 'user',
          parts: [{ text: String(m.text ?? '') }],
        };
      });
    } else if (typeof prompt === 'string' && prompt.length) {
      // simple fallback for single prompt text
      contents = [{ type: 'text', text: String(prompt) }];
    } else {
      return res.status(400).json({ error: 'prompt or messages required' });
    }

    const response = await client.models.generateContent({
      model: MODEL,
      contents,
    });

    // robust extraction of returned text across SDK shapes
    const text =
      response?.candidates?.[0]?.content?.text ??
      response?.candidates?.[0]?.content?.[0]?.text ??
      response?.output?.[0]?.content?.text ??
      response?.response?.text?.() ??
      response?.response?.text ??
      response?.text ??
      null;

    return res.json({ text, raw: response });
  } catch (err) {
    console.error('generation error', err);
    return res.status(500).json({ error: String(err) });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`genai proxy running on http://localhost:${PORT}`);
});