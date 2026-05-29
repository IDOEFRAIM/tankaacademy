import { createGroq } from '@ai-sdk/groq';
import { generateText } from 'ai'; // On utilise generateText au lieu de streamText pour du JSON simple

const groq = createGroq({
  apiKey: process.env.GROK_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // On récupère le dernier message de l'utilisateur pour le contexte
    const lastMessage = messages[messages.length - 1].content;

    // Utilisation de generateText pour obtenir une réponse complète et propre
    const { text } = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      messages: [
        {
          role: 'system',
          content: `Tu es un tuteur pédagogique d'élite pour la plateforme TankAcademy. 
          Réponds avec clarté, bienveillance et rigueur. 
          Utilise le format Markdown pour structurer tes réponses.`
        },
        ...messages
      ],
    });

    // Retourne un objet JSON valide que le frontend pourra parser avec .json()
    return Response.json({ text });
    
  } catch (error) {
    console.error("Erreur API Groq:", error);
    return Response.json({ text: "Désolé, une erreur est survenue." }, { status: 500 });
  }
}