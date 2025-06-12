import DB from "../../db/dbService.js";
import LLMService from "../llm/llm.service.js";
import { ComposeEmailSchema } from "./schema.js";
import { ASSISTANT_TYPES } from "../llm/constants.js";
import toolsService from "../tools/tools.service.js";

const getAssistantPrompt = (assistantString) => {
  const { followUp, salesAssistant } = toolsService;

  if (
    ASSISTANT_TYPES.followUp.toLowerCase() === assistantString?.toLowerCase()
  ) {
    return followUp();
  } else if (
    ASSISTANT_TYPES.salesAssistant.toLowerCase() ===
    assistantString?.toLowerCase()
  ) {
    return salesAssistant();
  } else {
    return null;
  }
};

const dbEmailResponse = (isSuccess) => {
  const message = isSuccess
    ? "Email sent successfully"
    : "Unable to send email at the moment";
  return { success: isSuccess, message };
};

// Gets emails from database
const getEmails = async () => {
  console.log("Getting emails");
  const emails = await DB.getEmails();
  console.log("Emails: ", emails);
  return emails;
};

// Adds email to database
const addEmail = async (message) => {
  const emailParsed = ComposeEmailSchema.parse(message);
  if (!emailParsed) {
    return { isSuccess: false, message: "Invalid email" };
  }

  const emailPayload = {
    ...emailParsed,
    id: Date.now(),
    created_at: new Date().toISOString(),
  };

  console.log("Adding email: ", emailPayload);

  const dbResponse = await DB.addEmail(emailPayload);
  return dbEmailResponse(dbResponse);
};

// Stream subject
async function* streamGeneratedEmailSubject(message, promptId) {
  const assistant = await LLMService.getAssistant(message);
  const assistantPrompt = getAssistantPrompt(assistant).subject;

  let subject = "";
  for await (const chunk of LLMService.generateEmailStream(
    assistantPrompt,
    message
  )) {
    subject += chunk;
    yield chunk;
  }

  if (subject) {
    // Save email template to database
    const emailTemplatePayload = {
      prompt_id: promptId,
      prompt: message,
      assistant_type: assistant,
      subject: subject,
    };
    await DB.createEmailTemplate(emailTemplatePayload);
  }
}

// Stream body
const streamGeneratedEmailBody = async function* (promptId) {
  // Get email template from db
  const emailTemplate = await DB.getEmailTemplate(promptId);
  if (!emailTemplate) {
    throw new Error("Email template not found");
  }

  const assistantPrompt = getAssistantPrompt(emailTemplate.assistant_type).body;

  for await (const chunk of LLMService.generateEmailBody(
    assistantPrompt,
    emailTemplate.subject,
    emailTemplate.prompt
  )) {
    yield chunk;
  }
};

const generateEmailTemplateId = () => {
  return (
    Date.now().toString() + Math.random().toString(36).substring(2, 15)
  ).toLowerCase();
};

const emailService = {
  getEmails,
  addEmail,
  streamGeneratedEmailSubject,
  streamGeneratedEmailBody,
  generateEmailTemplateId,
};

export default emailService;
