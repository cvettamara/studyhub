const { GoogleGenAI } = require('@google/genai'); //go citame paketot sto go instalirav
require('dotenv').config(); //ova mu kazuva na Node.js da go procitaj .env fajlot i da gi zeme vrednostite
//bez ova process.env.GEMINI_API_KEY bi bilo undefined
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }); //kreirame eden 'klient' objekt koj go koristime za site povici, ova e od oficijalniot obrazec ai.google.dev

async function generateEmbedding(text) { //mora da bide async deka pocikon kon gemini odi preku internet, pa deka trae malce podolgo async/await mu kazuva na java scripd pocekaj odgovor pred da prodolzis
  const response = await ai.models.embedContent({
    model: 'gemini-embedding-001',
    contents: text,
  });
  return response.embeddings[0].values;
}
//функција за генерирање на текст/одговор:
const generateText = async (prompt) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: prompt,
  });
  return response.text;
};

module.exports = { generateEmbedding, generateText };  //export na funkcijata generateEmbedding za da moze da ja exportnam vo site drugi fajlovi
