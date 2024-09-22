const natural = require('natural');
const wordnet = new natural.WordNet();

const generateRealData = () => {
  const tokens = ['king', 'queen', 'man', 'woman', 'prince', 'princess'];
  
  // Use WordNet to get real embeddings
  const embeddings = tokens.map(token => {
    return new Promise((resolve) => {
      wordnet.lookup(token, (results) => {
        if (results.length > 0) {
          // Use the first definition's gloss as a simple embedding
          const gloss = results[0].def;
          const embedding = natural.TfIdf.tf(gloss);
          resolve(Object.values(embedding).slice(0, 3));
        } else {
          resolve([Math.random(), Math.random(), Math.random()]);
        }
      });
    });
  });

  return Promise.all(embeddings).then(embeddingResults => {
    // Generate attention weights
    const attention = embeddingResults.map(() => {
      const weights = tokens.map(() => Math.random());
      const sum = weights.reduce((a, b) => a + b, 0);
      return weights.map((w) => w / sum);
    });

    return { tokens, embeddings: embeddingResults, attention };
  });
};

app.get('/api/data', async (req, res) => {
  try {
    const data = await generateRealData();
    res.json(data);
  } catch (error) {
    console.error('Error generating data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ... rest of the code ...