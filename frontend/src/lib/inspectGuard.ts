// Shared client-side origin validation and capture-phase shortcut guards

interface OriginLike {
  from(candidate: unknown): {
    isSameOrigin(other: unknown): boolean;
  };
}

function getGlobalOriginCtor(): OriginLike | undefined {
  if (typeof globalThis === "undefined") return undefined;
  const candidate = (globalThis as unknown as { Origin?: OriginLike }).Origin;
  return candidate && typeof candidate.from === "function" ? candidate : undefined;
}

function extractOriginWithApi(OriginCtor: OriginLike, candidate: unknown) {
  try {
    return OriginCtor.from(candidate);
  } catch (err) {
    if (typeof MessageEvent !== "undefined" && candidate instanceof MessageEvent) {
      return OriginCtor.from(candidate.origin);
    }
    throw err;
  }
}

export function isTrustedSameOrigin(event: MessageEvent): boolean {
  if (typeof window === "undefined") return false;
  const trustedUrl = window.location.origin;
  const OriginCtor = getGlobalOriginCtor();
  try {
    if (OriginCtor) {
      return extractOriginWithApi(OriginCtor, event).isSameOrigin(OriginCtor.from(trustedUrl));
    }
    const candidateUrl = new URL(event.origin);
    const referenceUrl = new URL(trustedUrl);
    return candidateUrl.origin !== "null" && candidateUrl.origin === referenceUrl.origin;
  } catch {
    return false;
  }
}

export function shouldBlockInspectShortcut(e: KeyboardEvent): boolean {
  const keyLower = (e.key || "").toLowerCase();
  const code = e.code || "";
  const mod = e.ctrlKey || e.metaKey;

  if (e.key === "PrintScreen" || e.key === "F12" || code === "F12") return true;
  if (mod && ["c", "x", "s", "u", "p"].includes(keyLower)) return true;
  if (mod && e.shiftKey && ["i", "j", "c", "s", "k"].includes(keyLower)) return true;
  if (mod && e.shiftKey && ["KeyI", "KeyJ", "KeyC", "KeyS", "KeyK"].includes(code)) return true;
  if (e.metaKey && e.altKey && ["KeyI", "KeyJ", "KeyC", "KeyU"].includes(code)) return true;

  return false;
}

const AUTHORIZED_HOSTS = new Set(["antporto.co.id", "www.antporto.co.id", "localhost", "127.0.0.1", "[::1]", "::1"]);

export function buildCloneBeaconUrl(
  currentHref: string,
  hostname: string,
  referrer: string
): string | null {
  const host = (hostname || "").toLowerCase().trim();
  if (!host || host.endsWith(".local") || AUTHORIZED_HOSTS.has(host)) {
    return null;
  }
  const base = "https://antporto.co.id/api/beacon/clone";
  const params = new URLSearchParams({
    h: host.slice(0, 120),
    u: (currentHref || "").slice(0, 300),
    r: (referrer || "").slice(0, 200),
  });
  return `${base}?${params.toString()}`;
}


