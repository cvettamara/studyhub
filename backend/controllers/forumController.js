const pool = require('../db');

const getPosts = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        forum_posts.*,
        users.name,
        users.surname,
        COUNT(post_likes.post_id) AS likes_count
      FROM forum_posts
      JOIN users ON forum_posts.user_id = users.id
      LEFT JOIN post_likes ON forum_posts.id = post_likes.post_id
      GROUP BY forum_posts.id, users.name, users.surname
      ORDER BY forum_posts.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const createPost = async (req, res) => {
  const { title, content, subject } = req.body;
  const user_id = req.user.id;
  try {
    const result = await pool.query(
      'INSERT INTO forum_posts (user_id, title, content, subject) VALUES ($1, $2, $3, $4) RETURNING *',
      [user_id, title, content, subject]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getAnswers = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT 
        forum_answers.*,
        users.name,
        users.surname
      FROM forum_answers
      JOIN users ON forum_answers.user_id = users.id
      WHERE forum_answers.post_id = $1
      ORDER BY forum_answers.created_at ASC
    `,
    [id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const createAnswer = async (req, res) => {
  const { content } = req.body;
  const { id } = req.params;
  const user_id = req.user.id;
  try {
    const result = await pool.query(
      'INSERT INTO forum_answers (post_id, user_id, content) VALUES ($1, $2, $3) RETURNING *',
      [id, user_id, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const likePost = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;
  try {
    await pool.query(
      'INSERT INTO post_likes (post_id, user_id) VALUES ($1, $2)',
      [id, user_id]
    );
    res.json({ message: 'Post liked' });
  } catch (err) {
    res.status(400).json({ error: 'Already liked' });
  }
};

module.exports = { getPosts, createPost, getAnswers, createAnswer, likePost };
