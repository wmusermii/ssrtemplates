// db.ts
import { createRequire } from "module";
import type { Knex } from "knex";

const require = createRequire(import.meta.url);
const knex = require("knex");

class Database {
  private static instance: Knex | null = null;

  static init(config: Knex.Config) {

    // console.log("Config : ", config);

    if (!Database.instance) {
      Database.instance = knex(config);
      console.log("Database initialized ✅");
    }
    return Database.instance;
  }

  static async testConnection() {
    if (!Database.instance) throw new Error("Database belum di-init");
    try {
      await Database.instance.raw("select 1+1 as result");
      return {
        success: true,
        message: "Database connection OK ✅",
      };
    } catch (err: any) {
      // PostgreSQL / MySQL / SQLite biasanya kasih error code
      return {
        success: false,
        message: "Database connection FAILED ❌",
        error: {
          code: err.code || null,       // contoh: 28P01 (invalid_password)
          detail: err.detail || null,   // keterangan tambahan (kalau ada)
          hint: err.hint || null,
          routine: err.routine || null,
          message: err.message,         // pesan utama
        },
      };
    }
  }


  static get(): Knex {
    if (!Database.instance) throw new Error("Database belum di-init");
    return Database.instance;
  }

  static async destroy() {
    if (Database.instance) {
      await Database.instance.destroy();
      Database.instance = null;
      console.log("Database connection closed ❎");
    }
  }
}

export default Database;
