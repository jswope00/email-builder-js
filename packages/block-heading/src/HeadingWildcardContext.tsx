import { createContext } from 'react';

export type HeadingWildcardExtrasValue = {
  featuredStoryFirstTitle?: string | null;
};

export const HeadingWildcardExtrasContext = createContext<HeadingWildcardExtrasValue>({});
