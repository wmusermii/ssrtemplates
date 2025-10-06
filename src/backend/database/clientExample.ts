import { createRequire } from 'module';
import { logInfo } from '../utils/logger';
const require = createRequire(import.meta.url);
const knex = require('knex');
// Konfigurasi koneksi PostgreSQL
const db = knex({
  client: 'pg',
  connection: {
    host: 'localhost',         // alamat host database (bisa IP/hostname)
    port: 5432,                // port default PostgreSQL
    user: 'ndb_proxy',          // username db
    password: 'ndb_proxy',    // password db
    database: 'ndb_proxy',        // nama database
    ssl: false                 // bisa true jika connect ke server remote dengan SSL
  },
  pool: {
    min: 2,
    max: 10
  }
});
logInfo("Koneksi ke PostgreSQL berhasil");
export default db;
