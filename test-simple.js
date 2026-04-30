require('dotenv').config();
const { Client } = require('pg');

console.log('Testing database connection...');
console.log('PORT:', process.env.PORT);
console.log('DATABASE_URL exists?', !!process.env.DATABASE_URL);

if (!process.env.DATABASE_URL) {
    console.log('❌ DATABASE_URL is not set in .env file!');
    process.exit(1);
}

// Show first 80 chars of URL (hides full password)
const urlPreview = process.env.DATABASE_URL.substring(0, 80);
console.log('DATABASE_URL preview:', urlPreview + '...');

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

client.connect()
    .then(() => {
        console.log('✅ DATABASE CONNECTED SUCCESSFULLY!');
        return client.query('SELECT NOW() as current_time');
    })
    .then(result => {
        console.log('📅 Database server time:', result.rows[0].current_time);
        client.end();
    })
    .catch(err => {
        console.log('❌ DATABASE CONNECTION FAILED:');
        console.log('Error message:', err.message);
    });