import Groq from "groq-sdk";
import type { ChatCompletion } from "groq-sdk/resources/chat/completions";

// SECURITY: All Groq API keys must be supplied via environment variables.
// Keys previously hardcoded here were exposed in git history and should be
// rotated at console.groq.com immediately.
// Set GROQ_API_KEY (primary) and GROQ_API_KEY_2 through GROQ_API_KEY_5
// (fallback rotation keys) in .env.local and Vercel environment settings.

// Lazy — read at call time so scripts that load .env.local after module init work correctly.
function getGroqKeys(): string[] {
  return [
    process.env.GROQ_API_KEY,
    process.env.GROQ_API_KEY_2,
    process.env.GROQ_API_KEY_3,
    process.env.GROQ_API_KEY_4,
    process.env.GROQ_API_KEY_5,
  ].filter((k): k is string => Boolean(k));
}

let currentKeyIndex = 0;

function getClient() {
  const keys = getGroqKeys();
  if (keys.length === 0) {
    throw new Error("No Groq API keys configured. Set GROQ_API_KEY in environment variables.");
  }
  return new Groq({ apiKey: keys[currentKeyIndex % keys.length]! });
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

// Models to try in order when Groq keys are exhausted.
// MiMo v2 flash is primary — ~$0.001/lesson, no rate limits, clean JSON output.
// Free models are kept as zero-cost fallbacks.
const OPENROUTER_FREE_MODELS = [
  "xiaomi/mimo-v2-flash",                      // primary: $0.00000009/tok, fast, clean JSON
  "google/gemma-3-12b-it:free",                // free backup
  "arcee-ai/trinity-large-preview:free",       // free backup
  "google/gemma-3-27b-it:free",                // free backup
  "meta-llama/llama-3.3-70b-instruct:free",    // often rate-limited but worth a shot
];

/**
 * Calls OpenRouter as a fallback when all Groq keys are exhausted.
 * Tries multiple free models with retry/backoff on 429.
 * Does NOT send response_format — most free models don't support JSON mode.
 * The prompt already explicitly requests JSON output.
 */
async function groqCreateViaOpenRouter(
  params: Parameters<Groq["chat"]["completions"]["create"]>[0]
): Promise<ChatCompletion> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY not set — cannot fall back to OpenRouter");
  }

  const p = params as { temperature?: number; max_tokens?: number };
  // Cap max_tokens to avoid over-spending credits on paid models like MiMo.
  // Lesson output is ~2-3k tokens; 3500 keeps us within low-credit budgets.
  const maxTokens = Math.min(p.max_tokens ?? 3500, 3500);

  for (const model of OPENROUTER_FREE_MODELS) {
    const body = {
      model,
      messages: params.messages,
      temperature: p.temperature,
      max_tokens: maxTokens,
      // response_format intentionally omitted — free models have inconsistent support
    };

    // Primary model (MiMo) gets 2 attempts for transient 500s; others get 1
    const maxAttempts = model === OPENROUTER_FREE_MODELS[0] ? 2 : 1;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const data = await res.json() as ChatCompletion & { error?: { code?: number; message?: string } };
        // OpenRouter wraps provider errors as 200 with an error field — treat as 429/5xx
        if (data.error) {
          const isLastAttempt = attempt >= maxAttempts - 1;
          console.warn(`[groq] OpenRouter ${model} error body (${data.error.code}): ${data.error.message}${isLastAttempt ? " — trying next model" : " — retrying in 5s"}`);
          if (!isLastAttempt) { await new Promise((r) => setTimeout(r, 5_000)); continue; }
          break;
        }
        if (!Array.isArray(data.choices) || data.choices.length === 0) {
          console.warn(`[groq] OpenRouter ${model} returned no choices: ${JSON.stringify(data).slice(0, 200)}`);
          break;
        }
        console.log(`[groq] OpenRouter success with model: ${model}`);
        return data;
      }

      if (res.status === 429) {
        console.warn(`[groq] OpenRouter 429 on ${model} — trying next model`);
        break; // no per-model retry; move to next model immediately
      }

      // Non-429 error — skip to next model
      const text = await res.text();
      console.warn(`[groq] OpenRouter error ${res.status} on ${model}: ${text.slice(0, 200)}`);
      break;
    }
  }

  // All models exhausted — wait 5 minutes and try the primary model one more time
  // before giving up. This handles global rate-limit windows that reset periodically.
  const waitMin = 5;
  console.warn(`[groq] All OpenRouter models exhausted — waiting ${waitMin}min for rate limits to reset...`);
  await new Promise((r) => setTimeout(r, waitMin * 60_000));

  // One final attempt with the primary model
  const finalRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: OPENROUTER_FREE_MODELS[0],
      messages: params.messages,
      temperature: p.temperature,
      max_tokens: p.max_tokens,
    }),
  });
  if (finalRes.ok) {
    const finalData = await finalRes.json() as ChatCompletion;
    if (!Array.isArray(finalData.choices) || finalData.choices.length === 0) {
      throw new Error(`OpenRouter returned response with no choices: ${JSON.stringify(finalData).slice(0, 200)}`);
    }
    console.log(`[groq] OpenRouter success after wait with model: ${OPENROUTER_FREE_MODELS[0]}`);
    return finalData;
  }

  throw new Error("All OpenRouter free models exhausted");
}

/**
 * Wraps a Groq API call and rotates the key on 429 rate-limit errors.
 * Falls back to OpenRouter (free Llama 3.3 70B) when all Groq keys are exhausted.
 * Use this instead of calling groq.chat.completions.create directly.
 */
export async function groqCreate(
  params: Parameters<Groq["chat"]["completions"]["create"]>[0]
): Promise<ChatCompletion> {
  const keys = getGroqKeys();

  if (keys.length === 0) {
    console.warn("[groq] No Groq keys configured — falling back to OpenRouter");
    return groqCreateViaOpenRouter(params);
  }

  for (let attempt = 0; attempt < keys.length; attempt++) {
    try {
      const client = getClient();
      return await client.chat.completions.create({ ...params, stream: false }) as ChatCompletion;
    } catch (err: unknown) {
      const status = (err as { status?: number })?.status;
      if (status === 429) {
        if (currentKeyIndex < keys.length - 1) {
          currentKeyIndex++;
          console.warn(`[groq] rate-limited on key ${attempt + 1}, rotating to key ${currentKeyIndex + 1}`);
          continue;
        }
        // All Groq keys exhausted — fall back to OpenRouter
        console.warn("[groq] all Groq keys rate-limited — falling back to OpenRouter");
        return groqCreateViaOpenRouter(params);
      }
      throw err;
    }
  }

  // Shouldn't reach here, but fall back just in case
  console.warn("[groq] all Groq key attempts exhausted — falling back to OpenRouter");
  return groqCreateViaOpenRouter(params);
}
