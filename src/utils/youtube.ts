/**
 * Utility functions for YouTube URL parsing and metadata handling
 */

export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const cleanUrl = url.trim();
  
  // Standard regex matching youtu.be, youtube.com/watch, embed, and shorts
  const regExp = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/;
  const match = cleanUrl.match(regExp);
  if (match && match[1]) {
    return match[1];
  }
  
  // If the user entered just the 11-character ID directly
  if (/^[\w-]{11}$/.test(cleanUrl)) {
    return cleanUrl;
  }
  
  return null;
}

export function getYouTubeThumbnail(videoId?: string | null, quality: 'hq' | 'mq' | 'default' = 'hq'): string {
  if (!videoId) return '';
  return `https://img.youtube.com/vi/${videoId}/${quality}default.jpg`;
}

export function getYouTubeWatchUrl(videoId?: string | null, externalUrl?: string | null): string {
  if (externalUrl && (externalUrl.includes('youtube.com') || externalUrl.includes('youtu.be'))) {
    return externalUrl;
  }
  if (videoId) {
    return `https://www.youtube.com/watch?v=${videoId}`;
  }
  return externalUrl || '';
}

export function getYouTubeEmbedUrl(
  videoId: string,
  options?: { autoplay?: boolean; noCookie?: boolean }
): string {
  if (!videoId) return '';
  const domain = options?.noCookie ? 'www.youtube-nocookie.com' : 'www.youtube.com';
  const autoplayParam = options?.autoplay ? '&autoplay=1' : '';
  return `https://${domain}/embed/${videoId}?rel=0&modestbranding=1&enablejsapi=1${autoplayParam}`;
}
