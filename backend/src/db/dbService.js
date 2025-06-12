import Knex from "knex";

const knexInstance = Knex({
  client: "sqlite3", // or 'better-sqlite3'
  connection: {
    filename: "./dev.sqlite3",
  },
});

const DB_TABLES = {
  EMAILS: "emails",
  EMAIL_TEMPLATES: "email_templates",
};

class DB {
  static async addEmail(data) {
    try {
      await knexInstance(DB_TABLES.EMAILS).insert(data);
      return true;
    } catch (error) {
      console.error("DB addEmail error:", error);
      return false;
    }
  }

  static async getEmails() {
    return await knexInstance(DB_TABLES).select("*");
  }

  // Temporary email prompt table...
  static async createEmailTemplate(data) {
    try {
      await knexInstance(DB_TABLES.EMAIL_TEMPLATES).insert(data);
      return true;
    } catch (error) {
      console.error("DB addEmail error:", error);
      return false;
    }
  }

  static async getEmailTemplate(promptId) {
    const emailTemplate = await knexInstance(DB_TABLES.EMAIL_TEMPLATES)
      .select("*")
      .where("prompt_id", promptId);

    return emailTemplate[0];
  }

  static async updateEmailTemplate(promptId, data) {
    return await knexInstance(DB_TABLES.EMAIL_TEMPLATES)
      .where("prompt_id", promptId)
      .update(data);
  }

  static async deleteEmailTemplate(promptId) {
    return await knexInstance(DB_TABLES.EMAIL_TEMPLATES)
      .where("prompt_id", promptId)
      .delete();
  }
}

export default DB;
