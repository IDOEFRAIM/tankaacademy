'use server'

const API_KEY = process.env.BUNNY_API_KEY; // Ta clé API Bunny
const LIBRARY_ID = process.env.BUNNY_LIBRARY_ID;

export async function createBunnyVideo(title: string) {
  const response = await fetch(`https://video.bunnycdn.com/library/${LIBRARY_ID}/videos`, {
    method: 'POST',
    headers: {
      'AccessKey': API_KEY!,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title })
  });

  const data = await response.json();
  return data.guid; // C'est ton videoId
}