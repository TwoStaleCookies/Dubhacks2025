// geminiClient.ts (works in Expo & React Native)

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error("EXPO_PUBLIC_GEMINI_API_KEY not set");
}

/**
 * Send a prompt to Gemini and return extracted assistant text.
 * Same signature and behavior as the Node version.
 */
export async function generateTextFromPrompt(
  prompt: string,
  model = "gemini-2.0-flash"
): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

  const body = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${errText}`);
  }

  const data = await response.json();

  // Extract the text output safely
  const text =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ??
    data?.output_text ??
    JSON.stringify(data);

  return String(text);
}

export default generateTextFromPrompt;
