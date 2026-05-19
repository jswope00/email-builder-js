import { createContext } from 'react';

export type HeadingWildcardExtrasValue = {
  featuredStoryFirstTitle?: string | null;
  rheumIqQuizTitle?: string | null;
  rheumIqQuizLink?: string | null;
};

export const HeadingWildcardExtrasContext = createContext<HeadingWildcardExtrasValue>({});
