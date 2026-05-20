import React, { useMemo } from 'react';

import { Button, ButtonProps } from '@usewaypoint/block-button';
import { expandHeadingWildcards } from '@usewaypoint/block-heading';

import useHeadingWildcardExtras from '../Heading/useHeadingWildcardExtras';

export default function ButtonReader(props: ButtonProps) {
  const rawUrl = props.props?.url ?? '';
  const wildcardExtras = useHeadingWildcardExtras(rawUrl);
  const expandedUrl = useMemo(
    () => expandHeadingWildcards(rawUrl, new Date(), wildcardExtras),
    [rawUrl, wildcardExtras]
  );

  return (
    <Button
      {...props}
      props={{
        ...props.props,
        url: expandedUrl,
      }}
    />
  );
}
