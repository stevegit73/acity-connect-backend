const router = require('express').Router();
const { pool } = require('../config/db');
const { auth } = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
    const { listing_id, message } = req.body;
    
    try {
        const { rows } = await pool.query(
            `INSERT INTO interests (listing_id, user_id, message) 
             VALUES ($1, $2, $3) RETURNING *`,
            [listing_id, req.user.id, message]
        );
        res.json(rows[0]);
    } catch (error) {
        res.status(400).json({ error: 'Already expressed interest' });
    }
});

module.exports = router;