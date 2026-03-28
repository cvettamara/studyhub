const pool = require('../db');

const getEvents = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        events.*,
        users.name,
        users.surname,
        COUNT(event_participants.user_id) AS participants_count
      FROM events
      JOIN users ON events.user_id = users.id
      LEFT JOIN event_participants ON events.id = event_participants.event_id
      GROUP BY events.id, users.name, users.surname
      ORDER BY events.event_time ASC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const createEvent = async (req, res) => {
  const { title, description, subject, location, event_time } = req.body;
  const user_id = req.user.id;
  try {
    const result = await pool.query(
      'INSERT INTO events (user_id, title, description, subject, location, event_time) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [user_id, title, description, subject, location, event_time]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const joinEvent = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;
  try {
    await pool.query(
      'INSERT INTO event_participants (event_id, user_id) VALUES ($1, $2)',
      [id, user_id]
    );
    res.json({ message: 'Joined event' });
  } catch (err) {
    res.status(400).json({ error: 'Already joined' });
  }
};

const leaveEvent = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;
  try {
    await pool.query(
      'DELETE FROM event_participants WHERE event_id = $1 AND user_id = $2',
      [id, user_id]
    );
    res.json({ message: 'Left event' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getEvents, createEvent, joinEvent, leaveEvent };