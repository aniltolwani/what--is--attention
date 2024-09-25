// Calculate the cosine similarity between two vectors
export const cosineSimilarity = (vecA: number[], vecB: number[]): number => {
  // Ensure vectors have the same length
  if (vecA.length !== vecB.length) {
    throw new Error('Vectors must have the same length');
  }

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  // Calculate dot product and magnitudes in a single loop
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    magnitudeA += vecA[i] * vecA[i];
    magnitudeB += vecB[i] * vecB[i];
  }

  // Calculate final magnitudes and cosine similarity
  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);

  // Avoid division by zero
  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return dotProduct / (magnitudeA * magnitudeB);
};

export const euclideanDistance = (vecA: number[], vecB: number[]): number => {
  // Ensure vectors have the same length
  if (vecA.length !== vecB.length) {
    throw new Error('Vectors must have the same length');
  }

  let sumOfSquares = 0;
  for (let i = 0; i < vecA.length; i++) {
    sumOfSquares += Math.pow(vecA[i] - vecB[i], 2);
  }
  return Math.sqrt(sumOfSquares);
};

// Find the nearest words to a target vector based on euclidean distance
export const getNearestWords = (
  targetVector: number[],
  embeddings: Record<string, number[]>,
  topN: number = 5
): string[] => {
  // Calculate similarities between target vector and all embeddings
  const similarities: [string, number][] = Object.entries(embeddings).map(
    ([word, vector]) => [word, euclideanDistance(targetVector, vector)]
  );

  // Exclude words with zero distance (original vector)
  const filteredSimilarities = similarities.filter(([_, distance]) => distance !== 0);

  // Sort similarities in ascending order
  filteredSimilarities.sort((a, b) => a[1] - b[1]);

  // Return the top N most similar words
  return filteredSimilarities.slice(0, topN).map(([word]) => word);
};