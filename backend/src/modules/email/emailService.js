import DB from "../../db/dbService.js";
import { ComposeEmailSchema } from "./schema.js";

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

const emailService = {
  getEmails,
  addEmail,
};

export default emailService;
