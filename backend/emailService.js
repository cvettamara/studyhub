const crypto = require('crypto');

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

async function sendVerificationEmail(toEmail, toName, token) {
  const verifyLink = `http://localhost:3000/verify-email?token=${token}`;
  
  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': process.env.BREVO_API_KEY,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: 'StudyHub', email: process.env.BREVO_SENDER_EMAIL },
      to: [{ email: toEmail, name: toName }],
      subject: 'Потврди го твојот email',
      htmlContent: `<p>Здраво ${toName},</p><p>Кликни на линкот за да ја потврдиш регистрацијата:</p><p><a href="${verifyLink}">${verifyLink}</a></p>`,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to send verification email');
  }
}

module.exports = { generateToken, sendVerificationEmail };