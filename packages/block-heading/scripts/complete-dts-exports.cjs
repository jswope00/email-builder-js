/**
 * tsup's DTS bundler omits re-exports from `wildcards.ts` and `HeadingWildcardContext.tsx`.
 * Patch the emitted declaration files so consumers (e.g. `@usewaypoint/email-builder`) typecheck.
 */
const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');

const replacement = `declare function Heading({ props, style }: HeadingProps): React.JSX.Element;

type HeadingWildcardExtrasValue = {
  featuredStoryFirstTitle?: string | null;
};
declare const HeadingWildcardExtrasContext: React.Context<HeadingWildcardExtrasValue>;
declare const HEADING_DATE_WILDCARD: string;
declare const HEADING_FEATURED_STORY_TITLE_WILDCARD: string;
declare function expandHeadingWildcards(
  text: string,
  date?: Date,
  options?: ExpandHeadingWildcardsOptions
): string;
type ExpandHeadingWildcardsOptions = {
  featuredStoryFirstTitle?: string | null;
};
declare function formatHeadingWildcardDate(date: Date): string;

export {
  HEADING_DATE_WILDCARD,
  HEADING_FEATURED_STORY_TITLE_WILDCARD,
  Heading,
  type HeadingProps,
  HeadingPropsDefaults,
  HeadingPropsSchema,
  HeadingWildcardExtrasContext,
  type HeadingWildcardExtrasValue,
  expandHeadingWildcards,
  type ExpandHeadingWildcardsOptions,
  formatHeadingWildcardDate,
};
`;

const needle = `declare function Heading({ props, style }: HeadingProps): React.JSX.Element;

export { Heading, type HeadingProps, HeadingPropsDefaults, HeadingPropsSchema };
`;

for (const name of ['index.d.ts', 'index.d.mts']) {
  const file = path.join(distDir, name);
  let s = fs.readFileSync(file, 'utf8');
  if (s.includes('HEADING_DATE_WILDCARD')) {
    continue;
  }
  if (!s.includes(needle)) {
    throw new Error(`complete-dts-exports: unexpected ${name} shape; update needle in script`);
  }
  s = s.replace(needle, replacement);
  fs.writeFileSync(file, s);
}
