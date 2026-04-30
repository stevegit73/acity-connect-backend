const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

const auth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ error: 'Access denied. Please login.' });
    }
    
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token. Please login again.' });
    }
};

const isAdmin = async (req, res, next) => {
    try {
        const { rows } = await pool.query('SELECT is_admin FROM users WHERE id = $1', [req.user.id]);
        if (!rows[0]?.is_admin) {
            return res.status(403).json({ error: 'Admin access required' });
        }
        next();
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { auth, isAdmin };