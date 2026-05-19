import React from 'react';

import {
  Heading,
  HeadingProps,
  HeadingWildcardExtrasContext,
} from '@usewaypoint/block-heading';

import useHeadingWildcardExtras from './useHeadingWildcardExtras';

export default function HeadingReader(props: HeadingProps) {
  const rawText = props.props?.text ?? '';
  const wildcardExtras = useHeadingWildcardExtras(rawText);

  return (
    <HeadingWildcardExtrasContext.Provider value={wildcardExtras}>
      <Heading {...props} />
    </HeadingWildcardExtrasContext.Provider>
  );
}
