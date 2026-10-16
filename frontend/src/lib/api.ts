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
  try {
    const res = await fetch(`${API_BASE}/projects`, {
      next: { revalidate: 60 }, // ISR — re-fetch every 60s
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data as Project[];
  } catch {
    return [];
  }
}

export async function fetchSettings(): Promise<Settings> {
  try {
    const res = await fetch(`${API_BASE}/settings`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return {};
    const json = await res.json();
    return json.data as Settings;
  } catch {
    return {};
  }
}
