import React, { CSSProperties } from 'react';
import { z } from 'zod';

const COLOR_SCHEMA = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/)
  .nullable()
  .optional();

const BACKGROUND_IMAGE_URL_SCHEMA = z.string().nullable().optional();

const PADDING_SCHEMA = z
  .object({
    top: z.number(),
    bottom: z.number(),
    right: z.number(),
    left: z.number(),
  })
  .optional()
  .nullable();

const getPadding = (padding: z.infer<typeof PADDING_SCHEMA>) =>
  padding ? `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px` : undefined;

export const ContainerPropsSchema = z.object({
  style: z
    .object({
      backgroundColor: COLOR_SCHEMA,
      backgroundImageUrl: BACKGROUND_IMAGE_URL_SCHEMA,
      borderColor: COLOR_SCHEMA,
      borderRadius: z.number().optional().nullable(),
      padding: PADDING_SCHEMA,
    })
    .optional()
    .nullable(),
});

export type ContainerProps = {
  style?: z.infer<typeof ContainerPropsSchema>['style'];
  children?: JSX.Element | JSX.Element[] | null;
};

function getBorder(style: ContainerProps['style']) {
  if (!style || !style.borderColor) {
    return undefined;
  }
  return `1px solid ${style.borderColor}`;
}

function getBackgroundImage(backgroundImageUrl: z.infer<typeof BACKGROUND_IMAGE_URL_SCHEMA>) {
  if (typeof backgroundImageUrl !== 'string' || backgroundImageUrl.trim() === '') {
    return undefined;
  }

  const escapedUrl = backgroundImageUrl.trim().replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  return `url("${escapedUrl}")`;
}

export function Container({ style, children }: ContainerProps) {
  const backgroundImage = getBackgroundImage(style?.backgroundImageUrl);
  const wStyle: CSSProperties = {
    backgroundColor: style?.backgroundColor ?? undefined,
    backgroundImage,
    backgroundPosition: backgroundImage ? 'top right' : undefined,
    backgroundRepeat: backgroundImage ? 'no-repeat' : undefined,
    backgroundSize: backgroundImage ? 'auto' : undefined,
    border: getBorder(style),
    borderRadius: style?.borderRadius ?? undefined,
    padding: getPadding(style?.padding),
  };
  if (!children) {
    return <div style={wStyle} />;
  }
  return <div style={wStyle}>{children}</div>;
}
