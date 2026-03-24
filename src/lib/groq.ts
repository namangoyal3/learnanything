import Groq from "groq-sdk";
import type { ChatCompletion } from "groq-sdk/resources/chat/completions";

const GROQ_KEYS = [
  process.env.GROQ_API_KEY ?? "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",
  "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",
  "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",
  "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",
  "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",
];

let currentKeyIndex = 0;

function getClient() {
  return new Groq({ apiKey: GROQ_KEYS[currentKeyIndex]! });
}

/**
 * Groq client that automatically rotates to the next API key on rate-limit (429) errors.
 * Usage: same as the regular groq client — call groq.chat.completions.create(...)
 */
export const groq = new Proxy({} as Groq, {
  get(_target, prop) {
    const client = getClient();
    const value = (client as unknown as Record<string | symbol, unknown>)[prop];
    if (typeof value !== "function") return value;
    // Wrap top-level methods (e.g. groq.chat is an object, not a function)
    return value.bind(client);
  },
});

/**
 * Wraps a Groq API call and rotates the key on 429 rate-limit errors.
 * Use this instead of calling groq.chat.completions.create directly.
 */
export async function groqCreate(
  params: Parameters<Groq["chat"]["completions"]["create"]>[0]
): Promise<ChatCompletion> {
  for (let attempt = 0; attempt < GROQ_KEYS.length; attempt++) {
    try {
      const client = getClient();
      return await client.chat.completions.create({ ...params, stream: false }) as ChatCompletion;
    } catch (err: unknown) {
      const status = (err as { status?: number })?.status;
      if (status === 429 && currentKeyIndex < GROQ_KEYS.length - 1) {
        currentKeyIndex++;
        console.warn(`[groq] rate-limited on key ${attempt + 1}, rotating to key ${currentKeyIndex + 1}`);
        continue;
      }
      throw err;
    }
  }
  throw new Error("All Groq API keys exhausted");
}
