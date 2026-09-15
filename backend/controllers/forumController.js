const pool = require('../db');
const { generateEmbedding, generateText } = require('../aiService');

const getPosts = async (req, res) => {
  try {
    const user_id = req.user.id;

    const posts = await pool.query(`
      SELECT 
        forum_posts.*,
        users.name,
        users.surname,
        COUNT(post_likes.post_id) AS likes_count,
        BOOL_OR(post_likes.user_id = $1) AS liked_by_me
      FROM forum_posts
      JOIN users ON forum_posts.user_id = users.id
      LEFT JOIN post_likes ON forum_posts.id = post_likes.post_id
      GROUP BY forum_posts.id, users.name, users.surname
      ORDER BY forum_posts.created_at DESC
    `, [user_id]);

    const postsWithAnswers = await Promise.all(
      posts.rows.map(async (post) => {
        const answers = await pool.query(`
          SELECT 
            forum_answers.*,
            users.name,
            users.surname
          FROM forum_answers
          JOIN users ON forum_answers.user_id = users.id
          WHERE forum_answers.post_id = $1
          ORDER BY forum_answers.created_at ASC
        `, [post.id]);
        return { ...post, answers: answers.rows };
      })
    );

    res.json(postsWithAnswers);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const createPost = async (req, res) => {
  const { title, content, subject } = req.body;
  const user_id = req.user.id;
  try {
    const embedding = await generateEmbedding(`${title} ${content}`);
    const result = await pool.query(
      'INSERT INTO forum_posts (user_id, title, content, subject, embedding) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [user_id, title, content, subject, JSON.stringify(embedding)]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const searchPosts = async (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ error: 'Внесете текст за пребарување' });
  }

  try {
    const embedding = await generateEmbedding(q);
    const result = await pool.query(
      'SELECT * FROM forum_posts ORDER BY embedding <=> $1 LIMIT 10',
      [JSON.stringify(embedding)]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const deletePost = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;
  try {
    const result = await pool.query(
      'DELETE FROM forum_posts WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, user_id]
    );
    if (result.rows.length === 0) {
      return res.status(403).json({ error: 'Not allowed' });
    }
    res.json({ message: 'Post deleted' });
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
    `, [id]);
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

const unlikePost = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;
  try {
    await pool.query(
      'DELETE FROM post_likes WHERE post_id = $1 AND user_id = $2',
      [id, user_id]
    );
    res.json({ message: 'Post unliked' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getAiSuggestion = async (req, res) => {
  const { id } = req.params;
  try {
    // 1. Вчитување на објавата
    const postResult = await pool.query('SELECT * FROM forum_posts WHERE id = $1', [id]);
    const post = postResult.rows[0];
    if (!post) return res.status(404).json({ error: 'Post not found' });

    if (!post.embedding) {
      return res.status(400).json({ error: 'This post does not have an embedding.' });
    }

    // 2. Форматирање на векторот
    const formattedEmbedding = typeof post.embedding === 'string'
      ? post.embedding
      : JSON.stringify(post.embedding);

    // 3. Семантичко пребарување на слични постови и нивните одговори
    const similarResult = await pool.query(
      `SELECT fp.title, fp.content, fa.content AS answer
       FROM forum_posts fp
       JOIN forum_answers fa ON fa.post_id = fp.id
       WHERE fp.id != $1
       ORDER BY fp.embedding <=> $2::vector
       LIMIT 3`,
      [id, formattedEmbedding]
    );

    // 4. Градење на контекстот
    const context = similarResult.rows.length > 0
      ? similarResult.rows.map(r => `Прашање: ${r.title} ${r.content}\nОдговор: ${r.answer}`).join('\n\n')
      : 'Нема пронајдено слични претходни одговори.';

    const prompt = `Ти си помошник на студентски форум. Еве слични веќе-одговорени прашања:\n${context}\n\nНово прашање: ${post.title} ${post.content}\n\nНапиши краток предлог одговор.`;

    // 5. Повик до Gemini преку aiService
    const suggestionText = await generateText(prompt);

    res.json({ suggestion: suggestionText });
  } catch (err) {
    console.error('Error generating AI suggestion:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

const getAiPreview = async (req, res) => {
  const { title, content } = req.body;
  try {
    const embedding = await generateEmbedding(`${title} ${content}`);
    const similarResult = await pool.query(
      `SELECT fp.title, fp.content, fa.content AS answer
       FROM forum_posts fp
       JOIN forum_answers fa ON fa.post_id = fp.id
       ORDER BY fp.embedding <=> $1
       LIMIT 3`,
      [JSON.stringify(embedding)]
    );

    const context = similarResult.rows
      .map(r => `Прашање: ${r.title} ${r.content}\nОдговор: ${r.answer}`)
      .join('\n\n');

    const prompt = `Ти си помошник на студентски форум. Еве слични веќе-одговорени прашања:\n${context}\n\nНово прашање: ${title} ${content}\n\nНапиши краток предлог одговор.`;

    const suggestion = await generateText(prompt);
    res.json({ suggestion });

  } catch (err) {
    console.error('AI Preview error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { 
  getPosts, 
  createPost, 
  searchPosts, 
  getAnswers, 
  createAnswer, 
  likePost, 
  unlikePost, 
  deletePost, 
  getAiSuggestion,
  getAiPreview
};