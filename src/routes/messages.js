const router = require('express').Router();
const { pool } = require('../config/db');
const { auth } = require('../middleware/auth');

// Send a message
router.post('/', auth, async (req, res) => {
    const { receiver_id, interest_id, content } = req.body;
    
    if (!content || content.trim() === '') {
        return res.status(400).json({ error: 'Message content is required' });
    }
    
    try {
        const { rows } = await pool.query(
            `INSERT INTO messages (sender_id, receiver_id, interest_id, content) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [req.user.id, receiver_id, interest_id, content]
        );
        res.json(rows[0]);
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get all conversations for current user
router.get('/conversations', auth, async (req, res) => {
    try {
        const { rows } = await pool.query(
            `SELECT DISTINCT ON (u.id) 
                u.id as user_id, 
                u.full_name,
                m.content as last_message,
                m.created_at as last_message_time,
                m.is_read,
                CASE WHEN m.receiver_id = $1 AND m.is_read = false THEN true ELSE false END as has_unread
             FROM messages m
             JOIN users u ON (u.id = m.sender_id OR u.id = m.receiver_id)
             WHERE (m.sender_id = $1 OR m.receiver_id = $1) AND u.id != $1
             ORDER BY u.id, m.created_at DESC`,
            [req.user.id]
        );
        res.json(rows);
    } catch (error) {
        console.error('Get conversations error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get messages with a specific user
router.get('/conversation/:userId', auth, async (req, res) => {
    const otherUserId = req.params.userId;
    
    try {
        // Get messages between the two users
        const { rows } = await pool.query(
            `SELECT m.*, 
                    u_sender.full_name as sender_name,
                    u_receiver.full_name as receiver_name,
                    l.title as listing_title
             FROM messages m
             JOIN users u_sender ON m.sender_id = u_sender.id
             JOIN users u_receiver ON m.receiver_id = u_receiver.id
             LEFT JOIN interests i ON m.interest_id = i.id
             LEFT JOIN listings l ON i.listing_id = l.id
             WHERE (m.sender_id = $1 AND m.receiver_id = $2) 
                OR (m.sender_id = $2 AND m.receiver_id = $1)
             ORDER BY m.created_at ASC`,
            [req.user.id, otherUserId]
        );
        
        // Mark unread messages as read
        await pool.query(
            `UPDATE messages SET is_read = true 
             WHERE receiver_id = $1 AND sender_id = $2 AND is_read = false`,
            [req.user.id, otherUserId]
        );
        
        res.json(rows);
    } catch (error) {
        console.error('Get conversation error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get users who have interacted with my listings (for messaging)
router.get('/contacts', auth, async (req, res) => {
    try {
        const { rows } = await pool.query(
            `SELECT DISTINCT u.id, u.full_name, u.email
             FROM interests i
             JOIN listings l ON i.listing_id = l.id
             JOIN users u ON i.user_id = u.id
             WHERE l.user_id = $1
             UNION
             SELECT DISTINCT u.id, u.full_name, u.email
             FROM interests i
             JOIN listings l ON i.listing_id = l.id
             JOIN users u ON l.user_id = u.id
             WHERE i.user_id = $1`,
            [req.user.id]
        );
        res.json(rows);
    } catch (error) {
        console.error('Get contacts error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get unread message count
router.get('/unread/count', auth, async (req, res) => {
    try {
        const { rows } = await pool.query(
            `SELECT COUNT(*) as count FROM messages 
             WHERE receiver_id = $1 AND is_read = false`,
            [req.user.id]
        );
        res.json({ count: parseInt(rows[0].count) });
    } catch (error) {
        console.error('Get unread count error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;