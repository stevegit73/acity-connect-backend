const router = require('express').Router();
const { pool } = require('../config/db');
const { auth } = require('../middleware/auth');

router.get('/', async (req, res) => {
    try {
        const { rows } = await pool.query(
            `SELECT l.*, u.full_name as seller_name 
             FROM listings l 
             JOIN users u ON l.user_id = u.id 
             WHERE l.status != 'deleted'
             ORDER BY l.created_at DESC`
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/', auth, async (req, res) => {
    const { title, description, category, status, price } = req.body;
    
    try {
        const { rows } = await pool.query(
            `INSERT INTO listings (user_id, title, description, category, status, price) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [req.user.id, title, description, category, status || 'available', price]
        );
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        await pool.query(`UPDATE listings SET status = 'deleted' WHERE id = $1 AND user_id = $2`, 
            [req.params.id, req.user.id]);
        res.json({ message: 'Listing deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;