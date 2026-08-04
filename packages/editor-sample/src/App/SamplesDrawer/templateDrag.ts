/** Drag payload MIME type for moving templates between folders */
export const TEMPLATE_DRAG_MIME = 'application/x-email-builder-template';

export type TemplateDragPayload = {
  slug: string;
  /** Current folder id; null = root. Omitted only if payload could not be parsed fully. */
  folderId?: string | null;
};

export function setTemplateDragData(dataTransfer: DataTransfer, payload: TemplateDragPayload) {
  const serialized = JSON.stringify(payload);
  dataTransfer.setData(TEMPLATE_DRAG_MIME, serialized);
  // Some browsers only expose text/plain during drop
  dataTransfer.setData('text/plain', serialized);
  dataTransfer.effectAllowed = 'move';
}

export function getTemplateDragPayload(dataTransfer: DataTransfer): TemplateDragPayload | null {
  const raw = dataTransfer.getData(TEMPLATE_DRAG_MIME) || dataTransfer.getData('text/plain');
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as TemplateDragPayload;
    if (parsed && typeof parsed.slug === 'string') {
      return {
        slug: parsed.slug,
        folderId: parsed.folderId ?? null,
      };
    }
  } catch {
    return { slug: raw };
  }

  return null;
}

export function isTemplateDrag(dataTransfer: DataTransfer): boolean {
  return Array.from(dataTransfer.types).some(
    (type) => type === TEMPLATE_DRAG_MIME || type === 'text/plain'
  );
}
