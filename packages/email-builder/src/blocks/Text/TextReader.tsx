import React, { useMemo } from 'react';

import { expandHeadingWildcards } from '@usewaypoint/block-heading';
import { Text, TextProps } from '@usewaypoint/block-text';

import useHeadingWildcardExtras from '../Heading/useHeadingWildcardExtras';

export default function TextReader(props: TextProps) {
  const rawText = props.props?.text ?? '';
  const wildcardExtras = useHeadingWildcardExtras(rawText);
  const expandedText = useMemo(
    () => expandHeadingWildcards(rawText, new Date(), wildcardExtras),
    [rawText, wildcardExtras]
  );

  return (
    <Text
      {...props}
      props={{
        ...props.props,
        text: expandedText,
      }}
    />
  );
}
