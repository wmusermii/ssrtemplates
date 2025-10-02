import knex, { Knex } from "knex";

class Database {
  private static instance: Knex | null = null;

  // init koneksi pertama kali
  static init(config: Knex.Config): Knex {
    if (!Database.instance) {
      Database.instance = knex(config);
    }
    return Database.instance;
  }

  // ambil instance yang sudah ada
  static get(): Knex {
    if (!Database.instance) {
      throw new Error("Database belum di-initialize. Panggil Database.init(config) dulu.");
    }
    return Database.instance;
  }

  // optional: tes koneksi
  static async testConnection() {
    const db = Database.get();
    const result = await db.raw("select 1+1 as result");
    console.log("Tes koneksi sukses:", result.rows || result);
  }

  // optional: tutup koneksi
  static async destroy() {
    if (Database.instance) {
      await Database.instance.destroy();
      Database.instance = null;
      console.log("Koneksi database ditutup");
    }
  }
}

export default Database;
