// test-groq.js
require('dotenv').config(); // Charge ton fichier .env
const { streamText } = require('ai');
const { createGroq } = require('@ai-sdk/groq');

// Initialisation avec le fournisseur Groq
const groq = createGroq({
  apiKey: process.env.GROK_API_KEY,
});

async function testerGroq() {
  console.log("--- Début du test Groq ---");

  try {
    const result = await streamText({
      // Utilisation d'un modèle performant et rapide
      model: groq('llama-3.3-70b-versatile'),
      messages: [{ role: 'user', content: 'Bonjour ! Peux-tu te présenter en une phrase ?' }],
    });

    console.log("Réponse reçue :");
    for await (const textPart of result.textStream) {
      process.stdout.write(textPart);
    }
    console.log("\n--- Fin du test ---");
  } catch (err) {
    console.error("Erreur lors du test :", err.message);
  }
}

testerGroq();