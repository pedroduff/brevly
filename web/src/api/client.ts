const baseUrl =
  import.meta.env.VITE_BACKEND_URL ?? `${window.location.origin}/api`;

function url(path: string): string {
  return path.startsWith('http') ? path : `${baseUrl.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;
}

async function request<T>(
  path: string,
  options?: RequestInit & { params?: Record<string, string> },
): Promise<T> {
  const full = url(path);
  const urlObj = new URL(full);
  if (options?.params) {
    for (const [k, v] of Object.entries(options.params)) {
      urlObj.searchParams.set(k, v);
    }
  }
  const hasBody = options?.body != null;
  const res = await fetch(urlObj.toString(), {
    ...options,
    headers: {
      ...(hasBody && { 'Content-Type': 'application/json' }),
      ...options?.headers,
    },
  });
  if (res.status === 204) return undefined as T;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? res.statusText);
  return data as T;
}

export interface ShortLinkItem {
  id: string;
  slug: string;
  originalUrl: string;
  redirectUrl: string;
  accessCount: number;
  createdAt: string;
}

export interface ListLinksResponse {
  items: ShortLinkItem[];
  nextCursor: string | null;
}

export const api = {
  createLink(body: { slug: string; originalUrl: string }) {
    return request<ShortLinkItem>('/links', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },
  deleteLink(id: string) {
    return request<void>(`/links/${id}`, { method: 'DELETE' });
  },
  listLinks(params?: { limit?: number; cursor?: string }) {
    const search = new URLSearchParams();
    if (params?.limit != null) search.set('limit', String(params.limit));
    if (params?.cursor) search.set('cursor', params.cursor);
    const q = search.toString();
    return request<ListLinksResponse>(`/links${q ? `?${q}` : ''}`);
  },
  exportCsv() {
    return request<{ url: string }>('/links/export', { method: 'POST' });
  },
  getBySlug(slug: string) {
    return request<{ originalUrl: string }>(`/links/slug/${slug}`);
  },
  getRedirectUrl(slug: string): string {
    return `${baseUrl.replace(/\/$/, '')}/r/${slug}`;
  },
};
