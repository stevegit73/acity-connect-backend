require('dotenv').config();
const { Client } = require('pg');

console.log('DATABASE_URL exists?', !!process.env.DATABASE_URL);
console.log('PORT:', process.env.PORT);

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

client.connect()
    .then(() => {
        console.log('✅ Connected to Render PostgreSQL!');
        client.end();
    })
    .catch(err => {
        console.error('❌ Connection failed:', err.message);
    });
