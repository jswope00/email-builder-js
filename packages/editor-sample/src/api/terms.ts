const TERMS_BASE_URL = 'https://rheumnow.com/admin';

export interface TermOption {
  id: string;
  name: string;
}

/**
 * Parse XML response with items like <item><tid>89</tid><name>ACR 2016</name></item>
 * into { id, name }[] (id from tid).
 */
function parseTermsXml(xmlText: string): TermOption[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, 'text/xml');
  const items = doc.getElementsByTagName('item');
  const result: TermOption[] = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const tidEl = item.getElementsByTagName('tid')[0];
    const nameEl = item.getElementsByTagName('name')[0];
    const id = tidEl?.textContent?.trim() ?? '';
    const name = nameEl?.textContent?.trim() ?? '';
    if (id) result.push({ id, name });
  }
  return result;
}

function parseTermsJson(data: unknown): TermOption[] {
  if (!Array.isArray(data)) return [];
  return data
    .filter((item): item is Record<string, unknown> => item != null && typeof item === 'object')
    .map((item) => ({
      id: String(item.tid ?? item.id ?? ''),
      name: String(item.name ?? ''),
    }))
    .filter((t) => t.id);
}

/**
 * Fetch terms from endpoint; supports JSON array or XML with <item><tid/><name/></item>.
 */
async function fetchTerms(path: string): Promise<TermOption[]> {
  const url = `${TERMS_BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch terms: ${response.statusText}`);
  const contentType = response.headers.get('content-type') ?? '';
  const text = await response.text();
  if (contentType.includes('application/json')) {
    try {
      return parseTermsJson(JSON.parse(text));
    } catch {
      return [];
    }
  }
  return parseTermsXml(text);
}

/**
 * Campaign (conference) options from /terms/dashboard_tags.
 */
export async function fetchDashboardTags(): Promise<TermOption[]> {
  return fetchTerms('terms/dashboard_tags');
}

/**
 * Topic options from /terms/topic.
 */
export async function fetchTopics(): Promise<TermOption[]> {
  return fetchTerms('terms/topic');
}
