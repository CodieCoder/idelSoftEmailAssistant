import Groq from "groq-sdk";
import "dotenv/config";
import { z } from "zod";
import { ASSISTANT_TYPES } from "./constants.js";

const MODEL = "llama3-70b-8192";

const assistantSchema = z.object({
  assistant: z.enum([ASSISTANT_TYPES.salesAssistant, ASSISTANT_TYPES.followUp]),
});

const EmailSchema = z.object({
  subject: z.string(),
  body: z.string(),
});

const apiKey = process.env.GROQ_API_KEY;

const groqClient = new Groq({
  apiKey,
});

const getAssistant = async (message) => {
  const llmResponse = await groqClient.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are a helpful email assistant. You are given a message and you need to generate a response to the message. Which assistant should be used to generate the response? Return only json i this structure: { assistant: '${ASSISTANT_TYPES.salesAssistant}' | '${ASSISTANT_TYPES.followUp}' }. if the message does not fit into either of the categories, return null.`,
      },
      {
        role: "user",
        content: message,
      },
    ],
    model: "llama3-8b-8192",
    response_format: { type: "json_object" },
  });

  const response = llmResponse.choices[0].message.content;
  try {
    const assistant = assistantSchema.parse(JSON.parse(response));
    return assistant.assistant;
  } catch (error) {
    console.error("Error parsing assistant: ", error);
    return null;
  }
};

const generateEmailStream = async function* (prompt, message) {
  const stream = await groqClient.chat.completions.create({
    messages: [
      { role: "system", content: prompt },
      { role: "user", content: message },
    ],
    model: MODEL,
    stream: true,
  });

  for await (const chunk of stream) {
    yield chunk.choices[0].delta.content;
  }
};

const generateEmailBody = async function* (prompt, subject, message) {
  const stream = await groqClient.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `${prompt}. Subject: ${subject}. Generate only the body of the email.`,
      },
      {
        role: "user",
        content: message,
      },
    ],
    model: MODEL,
    stream: true,
  });

  for await (const chunk of stream) {
    yield chunk.choices[0].delta.content;
  }
};

const LLMService = {
  getAssistant,
  generateEmailStream,
  generateEmailBody,
};

export default LLMService;
