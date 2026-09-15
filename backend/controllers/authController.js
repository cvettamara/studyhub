const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateToken, sendVerificationEmail } = require('../emailService');

const register = async (req, res) => {
  const { name, surname, email, password } = req.body;
  let newUser;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const token = generateToken();
    const result = await pool.query(
      'INSERT INTO users (name, surname, email, password, verification_token) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, surname, email',
      [name, surname, email, hashed, token]
    );
    newUser = result.rows[0];
    await sendVerificationEmail(email, name, token);
    res.status(201).json({ message: 'Проверете го вашиот email за да ја потврдите регистрацијата.' });
  } catch (err) {
    console.error(err);
    if (newUser) {
      await pool.query('DELETE FROM users WHERE id = $1', [newUser.id]);
    }
    res.status(400).json({ error: 'Registration failed. Please try again.' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) return res.status(400).json({ error: 'User not found' });

    // Проверка дали корисникот го потврдил имејлот
    if (!user.is_verified) {
      return res.status(403).json({ error: 'Please verify your email before logging in.' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Wrong password' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, surname: user.surname, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const verifyEmail = async (req, res) => {
  const { token } = req.query;
  try {
    const result = await pool.query(
      'UPDATE users SET is_verified = true, verification_token = NULL WHERE verification_token = $1 RETURNING id',
      [token]
    );
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }
    res.json({ message: 'Email verified successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { register, login, verifyEmail };