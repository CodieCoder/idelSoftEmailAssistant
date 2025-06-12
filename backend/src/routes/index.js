import emailService from "../modules/email/emailService.js";
import LLMService from "../modules/llm/llm.service.js";
import toolsService from "../modules/tools/tools.service.js";

export default async function routes(fastify, options) {
  fastify.get("/ping", async () => {
    return "pong\n";
  });

  fastify.post("/emails", async (request) => {
    const email = request.body.email;
    console.log("Email: ", email);
    return emailService.addEmail(email);
  });

  fastify.get("/emails", async () => {
    const emails = await emailService.getEmails();
    console.log("Emails: ", emails);
    return emails;
  });

  fastify.get("/emails/generate/stream", async (request, reply) => {
    const { message } = request.query;

    console.log("Message: ", message);

    // Set SSE headers
    reply.raw.setHeader("Content-Type", "text/event-stream");
    reply.raw.setHeader("Cache-Control", "no-cache");
    reply.raw.setHeader("Connection", "keep-alive");
    reply.raw.flushHeaders();

    try {
      const assistant = await LLMService.getAssistant(message);
      const assistantSubjectPrompt =
        toolsService.getAssistantPrompt(assistant).subject;

      let subject = "";
      for await (const chunk of LLMService.generateEmailSubjectStream(
        assistantSubjectPrompt,
        message
      )) {
        subject += chunk;
        reply.raw.write(
          `data: ${JSON.stringify({ content: chunk, type: "subject" })}\n\n`
        );
      }

      if (subject) {
        const assistantBodyPrompt =
          toolsService.getAssistantPrompt(assistant).body;
        for await (const chunk of LLMService.generateEmailBody(
          assistantBodyPrompt,
          subject,
          message
        )) {
          reply.raw.write(
            `data: ${JSON.stringify({ content: chunk, type: "body" })}\n\n`
          );
        }
      }
    } catch (err) {
      reply.raw.write(
        `event: error\ndata: ${JSON.stringify({ error: err.message })}\n\n`
      );
    } finally {
      reply.raw.end();
    }
  });
}
