import Knex from "knex";

const knexInstance = Knex({
  client: "sqlite3", // or 'better-sqlite3'
  connection: {
    filename: "./dev.sqlite3",
  },
});

const DB_TABLE = "emails";
class DB {
  static async addEmail(data) {
    try {
      await knexInstance(DB_TABLE).insert(data);
      return true;
    } catch (error) {
      console.error("DB addEmail error:", error);
      return false;
    }
  }

  static async getEmails() {
    return await knexInstance(DB_TABLE).select("*");
  }
}

export default DB;
