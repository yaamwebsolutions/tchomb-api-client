import type { FeedResponse, FeedVideo, ProfileFull, ProfileSummary, TrendingTag } from '@tchomb/shared-types';

export type TchombClientConfig = {
  baseUrl: string;
  getAccessToken: () => Promise<string | null>;
};

export function createTchombClient({ baseUrl, getAccessToken }: TchombClientConfig) {
  async function authHeaders(): Promise<Record<string, string>> {
    const token = await getAccessToken();
    if (!token) return {};
    return { Authorization: `Bearer ${token}` };
  }

  async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...await authHeaders(),
      ...(options.headers as Record<string, string> | undefined),
    };

    const res = await fetch(`${baseUrl}${path}`, { ...options, headers });

    if (!res.ok) {
      const body = await res.json().catch(() => ({ error: 'Erreur réseau' }));
      throw new Error((body as { error?: string }).error ?? `Erreur ${res.status}`);
    }

    return res.json() as Promise<T>;
  }

  return {
    fetchFeed(cursor?: string, limit = 20) {
      const params = new URLSearchParams({ limit: String(limit) });
      if (cursor) params.set('cursor', cursor);
      return apiFetch<FeedResponse>(`/api/feed?${params}`);
    },

    fetchProfile(id: string) {
      return apiFetch<{ profile: ProfileFull }>(`/api/profile/${encodeURIComponent(id)}`);
    },

    searchVideos(query: string) {
      return apiFetch<{ videos: FeedVideo[] }>('/api/search', {
        method: 'POST',
        body: JSON.stringify({ query, type: 'videos' }),
      });
    },

    searchProfiles(query: string) {
      return apiFetch<{ profiles: ProfileSummary[] }>('/api/search', {
        method: 'POST',
        body: JSON.stringify({ query, type: 'profiles' }),
      });
    },

    fetchTrending() {
      return apiFetch<{ trending: TrendingTag[] }>('/api/trending');
    },

    shareVideo(videoId: string) {
      return apiFetch<{ share_url: string; whatsapp_url: string }>('/api/share', {
        method: 'POST',
        body: JSON.stringify({ video_id: videoId }),
      });
    },

    recordView(videoId: string) {
      return apiFetch<{ ok: boolean }>('/api/view', {
        method: 'POST',
        body: JSON.stringify({ video_id: videoId }),
      });
    },
  };
}

export type TchombClient = ReturnType<typeof createTchombClient>;
