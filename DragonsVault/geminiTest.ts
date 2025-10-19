import * as dotenv from 'dotenv';
import { GoogleGenAI, type GenerateContentResponse } from '@google/genai';

dotenv.config();

function getClient() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('GEMINI_API_KEY not set');
  return new GoogleGenAI({ apiKey: key });
}

export async function generateTextFromPrompt(
  prompt: string,
  model = 'gemini-2.5-flash'
): Promise<string> {
  const ai = getClient();

  const response: GenerateContentResponse = await ai.models.generateContent({
    model,
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
  });

  const asAny = response as any;
  const text =
    (asAny?.candidates?.[0]?.content?.text as string | undefined) ??
    (asAny?.output?.[0]?.content?.text as string | undefined) ??
    (typeof asAny?.response?.text === 'function'
      ? await asAny.response.text()
      : asAny?.response?.text) ??
    (asAny?.text as string | undefined) ??
    JSON.stringify(response);

  return String(text);
}

export default generateTextFromPrompt;
