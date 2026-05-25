import { OpenAI } from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

// Initialisation du client avec l'URL de base de xAI (Grok)
const grok = new OpenAI({
  apiKey: process.env.GROK_API_KEY || "",
  baseURL: "https://api.xai.biz/v1", // URL officielle de l'API xAI
});

export const runtime = "edge"; // Optionnel : utilise l'Edge runtime pour un streaming ultra-rapide

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // 1. Définir le comportement d'un tuteur EdTech parfait (System Prompt)
    const systemMessage = {
      role: "system",
      content: `Tu es un tuteur pédagogique d'élite pour la plateforme TankAcademy. 
      Ton but est d'accompagner l'étudiant avec clarté, bienveillance et rigueur. 
      - Ne donne pas bêtement la réponse finale d'un exercice directement ; guide l'étudiant avec des indices.
      - Adapte ton langage pour être pédagogue.
      - Utilise le format Markdown pour structurer tes réponses (gras, listes, blocs de code si nécessaire).`
    };

    // 2. Appel à l'API de Grok (ex: grok-beta ou grok-1)
    const response = await grok.chat.completions.create({
      model: "grok-beta", // Ajuste selon le modèle actif sur ton compte xAI
      stream: true,       // Activer le streaming pour voir la réponse s'écrire en direct
      messages: [systemMessage, ...messages],
    });

    // 3. Convertir la réponse en flux (stream) et la renvoyer au client
    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);

  } catch (error) {
    console.error("Erreur Grok API:", error);
    return new Response(JSON.stringify({ error: "Erreur interne du serveur tuteur" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}