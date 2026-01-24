// lib/bunny-utils.ts
export const deleteBunnyVideo = async (videoUrl: string) => {
  try {
    // L'URL ressemble à : https://iframe.mediadelivery.net/play/12345/guid-abcd
    // On récupère le libraryId et le videoId
    const parts = videoUrl.split('/');
    const videoId = parts.pop();
    const libraryId = parts.pop();

    if (!videoId || !libraryId) return;

    await fetch(
      `https://video.bunnycdn.com/library/${libraryId}/videos/${videoId}`,
      {
        method: "DELETE",
        headers: {
          AccessKey: process.env.BUNNY_API_KEY!,
        },
      }
    );
  } catch (error) {
    console.error("Erreur suppression Bunny:", error);
  }
};