/** Minimal document shape for tree walks (matches `Reader` document). */
export type DocumentLike = Record<string, { type: string; data?: unknown }>;

function collectChildBlockIds(data: Record<string, unknown> | undefined): string[] {
  if (!data) return [];
  const ids: string[] = [];
  const top = data.childrenIds;
  if (Array.isArray(top)) {
    for (const id of top) {
      if (typeof id === 'string') ids.push(id);
    }
  }
  const props = data.props as Record<string, unknown> | undefined;
  const nested = props?.childrenIds;
  if (Array.isArray(nested)) {
    for (const id of nested) {
      if (typeof id === 'string') ids.push(id);
    }
  }
  const columns = props?.columns;
  if (Array.isArray(columns)) {
    for (const col of columns) {
      const colIds = (col as { childrenIds?: unknown })?.childrenIds;
      if (Array.isArray(colIds)) {
        for (const id of colIds) {
          if (typeof id === 'string') ids.push(id);
        }
      }
    }
  }
  return ids;
}

/**
 * Breadth-first search from `rootBlockId` for the first Featured Story block (document order).
 */
export function findFirstFeaturedStoryBlockData(
  document: DocumentLike,
  rootBlockId: string
): { topicTid?: number | null; dashboardTagTid?: number | null } | null {
  const queue: string[] = [rootBlockId];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const id = queue.shift()!;
    if (visited.has(id)) continue;
    visited.add(id);

    const block = document[id];
    if (!block) continue;

    if (block.type === 'FeaturedStoryXml') {
      const props = (block.data as { props?: Record<string, unknown> } | undefined)?.props;
      return {
        topicTid: props?.topicTid as number | null | undefined,
        dashboardTagTid: props?.dashboardTagTid as number | null | undefined,
      };
    }

    const data = block.data as Record<string, unknown> | undefined;
    for (const childId of collectChildBlockIds(data)) {
      queue.push(childId);
    }
  }

  return null;
}
