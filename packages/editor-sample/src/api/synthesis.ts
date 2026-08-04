const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export type SynthesisContentType = 'article' | 'video' | 'podcast' | 'tweet';

export type SynthesisDigestItem = {
  title: string;
  url?: string | null;
  contentType?: SynthesisContentType;
};

export type SynthesisTheme = {
  heading: string;
  hook: string;
  items: SynthesisDigestItem[];
  conclusions: string;
};

export type SynthesisDigest = {
  themes: SynthesisTheme[];
};

export type SynthesisGenerateRequest = {
  topicTid?: number | null;
  dashboardTagTid?: number | null;
  createdStartDate?: string | null;
  createdEndDate?: string | null;
  createdRelativeDays?: number | null;
  includeVideos?: boolean | null;
  includeArticles?: boolean | null;
  includeTweets?: boolean | null;
  includePodcasts?: boolean | null;
  specialInstructions?: string | null;
};

export type SynthesisGenerateResponse = {
  digest: SynthesisDigest;
  itemCount: number;
  itemsByType: {
    video: number;
    article: number;
    tweet: number;
    podcast: number;
  };
};

/**
 * Generate a structured AI synthesis digest from RheumNow XML feeds.
 */
export async function generateSynthesis(
  data: SynthesisGenerateRequest
): Promise<SynthesisGenerateResponse> {
  const response = await fetch(`${API_URL}/synthesis/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error.error || `Failed to generate synthesis: ${response.statusText}`);
  }

  return response.json();
}
