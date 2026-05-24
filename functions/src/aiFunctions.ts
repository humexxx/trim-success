import { ICallableRequest } from "@shared/models/functions";
import axios from "axios";
import * as functions from "firebase-functions";
import * as functionsV1 from "firebase-functions/v1";

// Proxies a single chat-completion request to OpenAI. Auth-gated so a
// stranger can't drain the API key budget through a Cloud Function.
export const aiGetMessage = functions.https.onCall<
  ICallableRequest<{ question: string }>
>(async (req) => {
  // Auth guard — every other Cloud Function in this codebase checks
  // req.auth; this one was previously open. Closes the budget hole.
  if (!req.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Sign in required."
    );
  }
  const { question } = req.data.data;
  if (!question) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Pregunta no proporcionada"
    );
  }

  const openaiApiKey = functionsV1.config().openai.key;
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: question }],
      },
      {
        headers: {
          Authorization: `Bearer ${openaiApiKey}`,
          "Content-Type": "application/json",
        },
      }
    );
    // Return the actual assistant message rather than the full Axios
    // response (which exposes internal headers + config).
    return {
      message: response.data.choices?.[0]?.message?.content ?? "",
    };
  } catch (e: unknown) {
    functions.logger.error("aiGetMessage failed", e);
    throw new functions.https.HttpsError(
      "internal",
      "Failed to reach the AI provider."
    );
  }
});
