import React, { useMemo } from 'react';

import { expandHeadingWildcards } from '@usewaypoint/block-heading';
import { Image, ImageProps } from '@usewaypoint/block-image';

import useHeadingWildcardExtras from '../Heading/useHeadingWildcardExtras';

export default function ImageReader(props: ImageProps) {
  const rawLinkHref = props.props?.linkHref ?? '';
  const wildcardExtras = useHeadingWildcardExtras(rawLinkHref);
  const expandedLinkHref = useMemo(
    () => expandHeadingWildcards(rawLinkHref, new Date(), wildcardExtras),
    [rawLinkHref, wildcardExtras]
  );

  return (
    <Image
      {...props}
      props={{
        ...props.props,
        linkHref: expandedLinkHref || null,
      }}
    />
  );
}
