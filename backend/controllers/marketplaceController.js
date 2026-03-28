const pool = require('../db');

const getListings = async (req, res) => {
  const { subject } = req.query;
  try {
    let query = `
      SELECT 
        marketplace_listings.*,
        users.name,
        users.surname,
        users.email
      FROM marketplace_listings
      JOIN users ON marketplace_listings.user_id = users.id
      WHERE marketplace_listings.status = 'available'
    `;
    const params = [];

    if (subject) {
      params.push(subject);
      query += ` AND marketplace_listings.subject = $1`;
    }

    query += ` ORDER BY marketplace_listings.created_at DESC`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const createListing = async (req, res) => {
  const { title, description, subject, price } = req.body;
  const user_id = req.user.id;
  try {
    const result = await pool.query(
      'INSERT INTO marketplace_listings (user_id, title, description, subject, price) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [user_id, title, description, subject, price]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteListing = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;
  try {
    const result = await pool.query(
      'DELETE FROM marketplace_listings WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, user_id]
    );
    if (result.rows.length === 0) {
      return res.status(403).json({ error: 'Not allowed' });
    }
    res.json({ message: 'Listing deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const user_id = req.user.id;
  try {
    const result = await pool.query(
      'UPDATE marketplace_listings SET status = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
      [status, id, user_id]
    );
    if (result.rows.length === 0) {
      return res.status(403).json({ error: 'Not allowed' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getListings, createListing, deleteListing, updateStatus };

