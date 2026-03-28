const pool = require('../db');

const getLocations = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        map_locations.*,
        users.name AS user_name,
        users.surname AS user_surname,
        ROUND(AVG(map_ratings.rating), 1) AS avg_rating,
        COUNT(map_ratings.id) AS ratings_count
      FROM map_locations
      JOIN users ON map_locations.user_id = users.id
      LEFT JOIN map_ratings ON map_locations.id = map_ratings.location_id
      GROUP BY map_locations.id, users.name, users.surname
      ORDER BY map_locations.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const createLocation = async (req, res) => {
  const { name, description, latitude, longitude, image_url } = req.body;
  const user_id = req.user.id;
  try {
    const result = await pool.query(
      'INSERT INTO map_locations (user_id, name, description, latitude, longitude, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [user_id, name, description, latitude, longitude, image_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const rateLocation = async (req, res) => {
  const { id } = req.params;
  const { rating } = req.body;
  const user_id = req.user.id;
  try {
    await pool.query(
      'INSERT INTO map_ratings (location_id, user_id, rating) VALUES ($1, $2, $3)',
      [id, user_id, rating]
    );
    res.json({ message: 'Rating added' });
  } catch (err) {
    res.status(400).json({ error: 'Already rated' });
  }
};

const getLocationRating = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT ROUND(AVG(rating), 1) AS avg_rating, COUNT(*) AS ratings_count FROM map_ratings WHERE location_id = $1',
      [id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getLocations, createLocation, rateLocation, getLocationRating };