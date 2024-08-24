import * as functions from "firebase-functions";
import axios from "axios";

const openaiApiKey = functions.config().openai.key;

// 1 a 1 en lo que recibe el request
export const aiGetMessage = functions.https.onCall(async (request) => {
  const { question } = request;
  if (!question) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Pregunta no proporcionada"
    );
  }

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
