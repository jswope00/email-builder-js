import { describe, expect, it } from '@jest/globals';

import { decodeHtmlEntities } from '.';

describe('decodeHtmlEntities', () => {
  it('decodes hex numeric character references', () => {
    expect(decodeHtmlEntities('&#x2018;Strong&#x2019;')).toBe('\u2018Strong\u2019');
  });

  it('decodes named dash entities', () => {
    expect(decodeHtmlEntities('Jan&ndash;Mar')).toBe('Jan\u2013Mar');
    expect(decodeHtmlEntities('Wait&mdash;what?')).toBe('Wait\u2014what?');
    expect(decodeHtmlEntities('&minus;5 degrees')).toBe('\u22125 degrees');
  });
});
