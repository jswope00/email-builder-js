/**
 * @jest-environment node
 */

import { describe, expect, it } from '@jest/globals';

import renderToStaticMarkup from './renderToStaticMarkup';

describe('renderToStaticMarkup', () => {
  it('renders into a string', async () => {
    const result = await renderToStaticMarkup(
      {
        root: {
          type: 'Container' as const,
          data: {
            props: {
              childrenIds: [],
            },
          },
        },
      },
      { rootBlockId: 'root' }
    );
    expect(result).toContain('<!DOCTYPE html>');
    expect(result).toContain('<meta name="viewport" content="width=device-width, initial-scale=1"/>');
    expect(result).toContain('eb-stack-column');
    expect(result).toContain('<body>');
    expect(result).toContain('<div></div>');
  });
});
