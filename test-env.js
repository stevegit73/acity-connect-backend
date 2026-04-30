require('dotenv').config();

console.log('=== ENVIRONMENT VARIABLES ===');
console.log('PORT:', process.env.PORT);
console.log('JWT_SECRET exists?', !!process.env.JWT_SECRET);
console.log('DATABASE_URL exists?', !!process.env.DATABASE_URL);

if (process.env.DATABASE_URL) {
    // Show first 100 chars of URL (hides password)
    const urlPreview = process.env.DATABASE_URL.substring(0, 80);
    console.log('DATABASE_URL preview:', urlPreview + '...');
    
    // Check for common issues
    if (process.env.DATABASE_URL.includes('.oregon-postgres.render.com')) {
        console.log('✅ Domain looks good (.oregon-postgres.render.com found)');
    } else {
        console.log('❌ Domain missing! Need .oregon-postgres.render.com');
    }
    
    if (process.env.DATABASE_URL.includes('sslmode=require')) {
        console.log('✅ SSL mode found');
    } else {
        console.log('⚠️ SSL mode missing - add ?sslmode=require');
    }
} else {
    console.log('❌ DATABASE_URL is NOT set!');
}