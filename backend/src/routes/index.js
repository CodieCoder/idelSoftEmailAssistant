import emailService from "../modules/email/emailService.js";

export default async function routes(fastify, options) {
  fastify.get("/ping", async () => {
    return "pong\n";
  });

  fastify.post("/emails", async (request) => {
    const email = request.body.email;
    console.log("Email: ", email);
    return emailService.addEmail(email);
  });

  fastify.get("/emails", async (request) => {
    const emails = await emailService.getEmails();
    console.log("Emails: ", emails);
    return emails;
  });

  fastify.get("/emails/generate/subject/stream", async (request, reply) => {
    const { message } = request.query;

    console.log("Message: ", message);
    const promptId = emailService.generateEmailTemplateId();
    console.log("Prompt ID: ", promptId);

    // Set SSE headers
    reply.raw.setHeader("Content-Type", "text/event-stream");
    reply.raw.setHeader("Cache-Control", "no-cache");
    reply.raw.setHeader("Connection", "keep-alive");
    reply.raw.flushHeaders();

    try {
      for await (const chunk of emailService.streamGeneratedEmailSubject(
        message,
        promptId
      )) {
        // Send each chunk as an SSE event so the frontend can receive as a stream
        reply.raw.write(
          `data: ${JSON.stringify({ content: chunk, promptId: promptId })}\n\n`
        );
      }
    } catch (err) {
      reply.raw.write(
        `event: error\ndata: ${JSON.stringify({ error: err.message })}\n\n`
      );
    } finally {
      reply.raw.end();
    }
  });

  fastify.get("/emails/generate/body/stream", async (request, reply) => {
    const { id: promptId } = request.query;

    console.log("Prompt ID: ", promptId);

    // Set SSE headers
    reply.raw.setHeader("Content-Type", "text/event-stream");
    reply.raw.setHeader("Cache-Control", "no-cache");
    reply.raw.setHeader("Connection", "keep-alive");
    reply.raw.flushHeaders();

    try {
      for await (const chunk of emailService.streamGeneratedEmailBody(
        promptId
      )) {
        // Send each chunk as an SSE event so the frontend can receive as a stream
        reply.raw.write(
          `data: ${JSON.stringify({ content: chunk, promptId: promptId })}\n\n`
        );
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
