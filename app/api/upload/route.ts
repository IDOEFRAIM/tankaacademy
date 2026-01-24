// app/api/upload/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { title } = await req.json(); // On ne reçoit que du JSON, pas de fichier !

    const createRes = await fetch(
      `https://video.bunnycdn.com/library/${process.env.BUNNY_LIBRARY_ID}/videos`,
      {
        method: "POST",
        headers: {
          AccessKey: process.env.BUNNY_API_KEY!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: title || "Sans titre" }),
      }
    );
    const createData = await createRes.json();
    
    return NextResponse.json({ 
        videoId: createData.guid, 
        libraryId: process.env.BUNNY_LIBRARY_ID 
    });
  } catch (error) {
    return NextResponse.json({ error: "Erreur init" }, { status: 500 });
  }
}