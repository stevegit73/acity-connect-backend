const router = require('express').Router();
const { pool } = require('../config/db');
const { auth, isAdmin } = require('../middleware/auth');

router.use(auth, isAdmin);

router.get('/listings', async (req, res) => {
    try {
        const { rows } = await pool.query(
            `SELECT l.*, u.full_name, u.email FROM listings l 
             JOIN users u ON l.user_id = u.id 
             WHERE l.status != 'deleted'`
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.put('/listings/:id', async (req, res) => {
    const { status } = req.body;
    try {
        await pool.query(`UPDATE listings SET status = $1 WHERE id = $2`, [status, req.params.id]);
        res.json({ message: 'Listing updated' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.delete('/listings/:id', async (req, res) => {
    try {
        await pool.query(`UPDATE listings SET status = 'deleted' WHERE id = $1`, [req.params.id]);
        res.json({ message: 'Listing deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/stats', async (req, res) => {
    try {
        const totalUsers = await pool.query('SELECT COUNT(*) FROM users');
        const totalListings = await pool.query("SELECT COUNT(*) FROM listings WHERE status != 'deleted'");
        const totalInterests = await pool.query('SELECT COUNT(*) FROM interests');
        
        res.json({
            totalUsers: parseInt(totalUsers.rows[0].count),
            totalListings: parseInt(totalListings.rows[0].count),
            totalInterests: parseInt(totalInterests.rows[0].count)
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;