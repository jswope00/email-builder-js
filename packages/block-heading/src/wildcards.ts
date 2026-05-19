/** Tokens replaced at render time; stored JSON keeps the literal token (e.g. `%DATE%`). */
export const HEADING_DATE_WILDCARD = '%DATE%';

/** First Featured Story item title (see `@usewaypoint/email-builder` Heading reader). */
export const HEADING_FEATURED_STORY_TITLE_WILDCARD = '%FEATURED_STORY_TITLE%';

/** First RheumIQ Quiz item title (see `@usewaypoint/email-builder` Heading reader). */
export const HEADING_RHEUMIQ_QUIZ_TITLE_WILDCARD = '%RHEUMIQ_QUIZ_TITLE%';

/** First RheumIQ Quiz item link (see `@usewaypoint/email-builder` Heading reader). */
export const HEADING_RHEUMIQ_QUIZ_LINK_WILDCARD = '%RHEUMIQ_QUIZ_LINK%';

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
  /** When unset, `%RHEUMIQ_QUIZ_TITLE%` expands to an empty string. */
  rheumIqQuizTitle?: string | null;
  /** When unset, `%RHEUMIQ_QUIZ_LINK%` expands to an empty string. */
  rheumIqQuizLink?: string | null;
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
  if (out.includes(HEADING_RHEUMIQ_QUIZ_TITLE_WILDCARD)) {
    const title = options?.rheumIqQuizTitle ?? '';
    out = out.split(HEADING_RHEUMIQ_QUIZ_TITLE_WILDCARD).join(title);
  }
  if (out.includes(HEADING_RHEUMIQ_QUIZ_LINK_WILDCARD)) {
    const link = options?.rheumIqQuizLink ?? '';
    out = out.split(HEADING_RHEUMIQ_QUIZ_LINK_WILDCARD).join(link);
  }
  return out;
}
