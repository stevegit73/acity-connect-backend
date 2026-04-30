const router = require('express').Router();
const { pool } = require('../config/db');
const { auth } = require('../middleware/auth');

router.get('/profile', auth, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT u.id, u.email, u.full_name, u.is_admin,
                    p.skills_offered, p.skills_needed, p.phone, p.department
             FROM users u 
             LEFT JOIN profiles p ON u.id = p.user_id 
             WHERE u.id = $1`,
            [req.user.id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.put('/profile', auth, async (req, res) => {
    const { skills_offered, skills_needed, phone, department } = req.body;
    
    try {
        await pool.query(
            `UPDATE profiles SET 
                skills_offered = COALESCE($1, skills_offered),
                skills_needed = COALESCE($2, skills_needed),
                phone = COALESCE($3, phone),
                department = COALESCE($4, department)
             WHERE user_id = $5`,
            [skills_offered || [], skills_needed || [], phone, department, req.user.id]
        );
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
// Get user by ID (for messaging)
router.get('/:id', auth, async (req, res) => {
    try {
        const { rows } = await pool.query(
            `SELECT id, full_name, email FROM users WHERE id = $1`,
            [req.params.id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;