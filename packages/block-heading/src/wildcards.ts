/** Tokens replaced at render time; stored JSON keeps the literal token (e.g. `%DATE%`). */
export const HEADING_DATE_WILDCARD = '%DATE%';

/** First Featured Story item title (see `@usewaypoint/email-builder` Heading reader). */
export const HEADING_FEATURED_STORY_TITLE_WILDCARD = '%FEATURED_STORY_TITLE%';

export function formatHeadingWildcardDate(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export type ExpandHeadingWildcardsOptions = {
  /** When unset, `%FEATURED_STORY_TITLE%` expands to an empty string. */
  featuredStoryFirstTitle?: string | null;
};

export function expandHeadingWildcards(
  text: string,
  date: Date = new Date(),
  options?: ExpandHeadingWildcardsOptions
): string {
  let out = text;
  if (out.includes(HEADING_DATE_WILDCARD)) {
    out = out.split(HEADING_DATE_WILDCARD).join(formatHeadingWildcardDate(date));
  }
  if (out.includes(HEADING_FEATURED_STORY_TITLE_WILDCARD)) {
    const title = options?.featuredStoryFirstTitle ?? '';
    out = out.split(HEADING_FEATURED_STORY_TITLE_WILDCARD).join(title);
  }
  return out;
}
