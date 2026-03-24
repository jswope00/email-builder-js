import React from 'react';

import { describe, expect, it } from '@jest/globals';
import { render } from '@testing-library/react';

import { Heading, HeadingWildcardExtrasContext } from '.';
import { expandHeadingWildcards, formatHeadingWildcardDate } from './wildcards';

describe('Heading', () => {
  it('renders with default values', () => {
    expect(render(<Heading />).asFragment()).toMatchSnapshot();
  });

  it('renders %DATE% as the current day in en-GB short form', () => {
    const fixed = new Date(2026, 2, 23, 12, 0, 0);
    jest.useFakeTimers();
    jest.setSystemTime(fixed);
    try {
      const { container } = render(
        <Heading props={{ text: 'RheumNow Daily: %DATE%', level: 'h2' }} />
      );
      expect(container.textContent).toBe(
        `RheumNow Daily: ${formatHeadingWildcardDate(fixed)}`
      );
    } finally {
      jest.useRealTimers();
    }
  });

  it('renders with style', () => {
    const style = {
      backgroundColor: '#444333',
      color: '#101010',
      fontFamily: 'HEAVY_SANS' as const,
      fontWeight: 'normal' as const,
      padding: {
        top: 15,
        bottom: 10,
        left: 24,
        right: 8,
      },
      textAlign: 'center' as const,
    };
    const props = {
      text: 'Hello world!',
      level: 'h1' as const,
    };
    expect(render(<Heading style={style} props={props} />).asFragment()).toMatchSnapshot();
  });

  it('renders %FEATURED_STORY_TITLE% from context', () => {
    const { container } = render(
      <HeadingWildcardExtrasContext.Provider value={{ featuredStoryFirstTitle: 'First headline' }}>
        <Heading props={{ text: 'Spotlight: %FEATURED_STORY_TITLE%', level: 'h2' }} />
      </HeadingWildcardExtrasContext.Provider>
    );
    expect(container.textContent).toBe('Spotlight: First headline');
  });
});

describe('expandHeadingWildcards', () => {
  it('replaces multiple %DATE% tokens', () => {
    const d = new Date('2026-03-23T12:00:00.000Z');
    expect(expandHeadingWildcards('%DATE% — %DATE%', d)).toBe(
      `${formatHeadingWildcardDate(d)} — ${formatHeadingWildcardDate(d)}`
    );
  });

  it('replaces %FEATURED_STORY_TITLE% when a title is provided', () => {
    expect(
      expandHeadingWildcards('Today: %FEATURED_STORY_TITLE%', new Date(), {
        featuredStoryFirstTitle: 'ACR Highlights',
      })
    ).toBe('Today: ACR Highlights');
  });
});
