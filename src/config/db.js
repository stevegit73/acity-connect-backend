const { Pool } = require('pg');
require('dotenv').config();

console.log('📡 Attempting to connect to database...');

// Create connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Test connection with better error logging
pool.connect((err, client, release) => {
    if (err) {
        console.error('❌ Database connection error:');
        console.error('Error message:', err.message);
        console.error('Error code:', err.code);
        console.error('Full error:', err);
    } else {
        console.log('✅ Connected to PostgreSQL database');
        release();
    }
});
// Create all tables
const initDB = async () => {
    console.log('📡 Initializing database tables...');
    try {
        // Users table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                full_name VARCHAR(255) NOT NULL,
                is_admin BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Users table ready');

        // Profiles table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS profiles (
                user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
                skills_offered TEXT[] DEFAULT '{}',
                skills_needed TEXT[] DEFAULT '{}',
                phone VARCHAR(50),
                department VARCHAR(255),
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Profiles table ready');

        // Listings table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS listings (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                title VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                category VARCHAR(50) CHECK (category IN ('item', 'skill')),
                status VARCHAR(50) DEFAULT 'available',
                price VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Listings table ready');

        // Interests table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS interests (
                id SERIAL PRIMARY KEY,
                listing_id INTEGER REFERENCES listings(id) ON DELETE CASCADE,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                message TEXT,
                status VARCHAR(50) DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(listing_id, user_id)
            )
        `);
        console.log('✅ Interests table ready');

        // Messages table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS messages (
                id SERIAL PRIMARY KEY,
                sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                receiver_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                interest_id INTEGER REFERENCES interests(id) ON DELETE CASCADE,
                content TEXT NOT NULL,
                is_read BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Messages table ready');

        // Create admin user
        const adminCheck = await pool.query("SELECT * FROM users WHERE email = 'admin@acity.edu'");
        if (adminCheck.rows.length === 0) {
            const bcrypt = require('bcryptjs');
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await pool.query(
                "INSERT INTO users (email, password, full_name, is_admin) VALUES ($1, $2, $3, $4)",
                ['admin@acity.edu', hashedPassword, 'System Admin', true]
            );
            console.log('✅ Admin user created (admin@acity.edu / admin123)');
        }

        console.log('🎉 Database initialization complete!');
    } catch (error) {
        console.error('❌ Database initialization error:');
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
    }
};

module.exports = { pool, initDB };