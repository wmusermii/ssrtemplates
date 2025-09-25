import * as dotenv from 'dotenv';
import * as path from 'path';

// determine env file dynamically
const nodeEnv = process.env['NODE_ENV'] || 'development';

// supported: development, staging, production
let envFile = '.env.development';
if (nodeEnv === 'production') {
    envFile = '.env.production';
} else if (nodeEnv === 'staging') {
    envFile = '.env.staging';
}

// load the chosen env file
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

// timezone (optional, for server-side Date)
process.env.TZ = process.env['TIMEZONE'] || 'Asia/Jakarta';

export const config = {
    nodeEnv,
    db: {
        host: process.env['DB_HOST'] || 'localhost',
        port: +(process.env['DB_PORT'] || 5432),
        user: process.env['DB_USER'] || 'user',
        pass: process.env['DB_PASS'] || 'pass',
        name: process.env['DB_NAME'] || 'db',
    },
};
