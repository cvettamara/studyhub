const pool = require('../db');

const getLocations = async (req, res) => {
  try {
    const user_id = req.user.id;
    const result = await pool.query(`
      SELECT 
        map_locations.*,
        users.name AS user_name,
        users.surname AS user_surname,
        ROUND(AVG(map_ratings.rating), 1) AS avg_rating,
        COUNT(map_ratings.id) AS ratings_count,
        BOOL_OR(map_ratings.user_id = $1) AS rated_by_me
      FROM map_locations
      JOIN users ON map_locations.user_id = users.id
      LEFT JOIN map_ratings ON map_locations.id = map_ratings.location_id
      GROUP BY map_locations.id, users.name, users.surname
      ORDER BY map_locations.created_at DESC
    `, [user_id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const geocodeLocation = async (req, res) => {
  const { q } = req.query;
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1`,
      { headers: { 'User-Agent': 'StudyHub-Thesis-App' } }
    );
    const data = await response.json();

    if (data.length === 0) {
      return res.status(404).json({ error: 'Location not found' });
    }

    res.json({
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon),
      display_name: data[0].display_name
    });
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

module.exports = { getLocations, geocodeLocation, createLocation, rateLocation, getLocationRating };