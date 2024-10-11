import * as functionsV1 from "firebase-functions/v1";
import * as functions from "firebase-functions";
import axios from "axios";
import { ICallableRequest } from "@shared/models/functions";

// 1 a 1 en lo que recibe el request
export const aiGetMessage = functions.https.onCall<
  ICallableRequest<{ question: string }>
>(async (req) => {
  const { question } = req.data.data;
  if (!question) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Pregunta no proporcionada"
    );
  }
  const openaiApiKey = functionsV1.config().openai.key;
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
  return {
    message: response,
    // message: response.data.choices[0].message.content,
  };
});
