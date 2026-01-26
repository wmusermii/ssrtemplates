// import path from 'path';
// import { fileURLToPath } from 'url';
// import { createRequire } from 'module';
// import { logInfo } from '../utils/logger';

// const require = createRequire(import.meta.url);
// const knex = require('knex');

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const dbPath = path.join(__dirname, 'data', 'admdb.sqlite');
// logInfo("*** Embeded database Original : ",dbPath)
// const db = knex({
//   client: 'better-sqlite3',
//   connection: {
//     filename: dbPath,
//   },
//   useNullAsDefault: true,
// });

// export default db;
import path from 'path';
import { createRequire } from 'module';
import { logInfo } from '../utils/logger';

const require = createRequire(import.meta.url);
const knex = require('knex');

// PROJECT ROOT
const ROOT = process.cwd();

// DB DI LUAR DIST
const dbPath = path.join(ROOT, 'data', 'admdb.sqlite');

logInfo('*** Embedded database (runtime):', dbPath);

const db = knex({
  client: 'better-sqlite3',
  connection: {
    filename: dbPath
  },
  useNullAsDefault: true
});

export default db;
