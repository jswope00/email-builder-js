import { useEffect, useState } from 'react';

import {
  RHEUMNOW_TERMS_URL,
  parseTermsXml,
  type RheumnowTermRow,
} from '@usewaypoint/rheumnow-xml-topic';

let cachedRows: RheumnowTermRow[] | null = null;
let inFlight: Promise<RheumnowTermRow[]> | null = null;

function loadTermsRows(): Promise<RheumnowTermRow[]> {
  if (cachedRows) return Promise.resolve(cachedRows);
  if (!inFlight) {
    inFlight = fetch(RHEUMNOW_TERMS_URL)
      .then((r) => {
        if (!r.ok) {
          throw new Error(`HTTP ${r.status}`);
        }
        return r.text();
      })
      .then((text) => {
        const rows = parseTermsXml(text);
        cachedRows = rows;
        return rows;
      })
      .finally(() => {
        inFlight = null;
      });
  }
  return inFlight;
}

/**
 * Single shared fetch/cache for RheumNow `/admin/terms` so Topic + Dashboard Tag dropdowns do not duplicate requests.
 */
export function useRheumnowTermsRows(): {
  rows: RheumnowTermRow[] | null;
  loading: boolean;
  error: string | null;
} {
  const [rows, setRows] = useState<RheumnowTermRow[] | null>(cachedRows);
  const [loading, setLoading] = useState(!cachedRows);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadTermsRows()
      .then((r) => {
        if (!cancelled) {
          setRows(r);
          setLoading(false);
          setError(null);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError('Could not load taxonomy terms');
          setLoading(false);
          console.error(e);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { rows, loading, error };
}
