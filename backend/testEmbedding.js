const { generateEmbedding } = require('./aiService');

async function test() {
  const embedding = await generateEmbedding('Прашање за структури на податоци');
  console.log('Должина на embedding:', embedding.length);
  console.log('Прв дел од вредностите:', embedding.slice(0, 5));
}

test();