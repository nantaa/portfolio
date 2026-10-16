// API base URL — relative /api for Nginx reverse proxy
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '/api';

export interface Project {
  id: number;
  title: string;
  category: string;
  subtitle: string | null;
  image_url: string | null;
  link: string | null;
  year: string | null;
  sort_order: number;
  is_featured: boolean;
  case_study?: {
    problem: string;
    thinking: string;
    execution: string;
    result: string;
  };
}

export type Settings = Record<string, string | null>;

export async function fetchProjects(): Promise<Project[]> {
  // During build-time static page generation with a relative API path,
  // return empty array immediately so Next.js export doesn't hang.
  if (typeof window === 'undefined' && !API_BASE.startsWith('http')) {
    return [];
  }

  try {
    const res = await fetch(`${API_BASE}/projects`, {
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data as Project[];
  } catch {
    return [];
  }
}

export async function fetchSettings(): Promise<Settings> {
  if (typeof window === 'undefined' && !API_BASE.startsWith('http')) {
    return {};
  }

  try {
    const res = await fetch(`${API_BASE}/settings`, {
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return {};
    const json = await res.json();
    return json.data as Settings;
  } catch {
    return {};
  }
}
