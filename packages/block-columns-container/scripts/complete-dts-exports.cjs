/**
 * tsup's DTS bundler omits `COLUMNS_CONTAINER_STACK_TD_CLASS` (exported const).
 */
const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');

const needle = `declare function ColumnsContainer({ style, columns, props }: ColumnsContainerProps): React.JSX.Element;

export { ColumnsContainer, type ColumnsContainerProps, ColumnsContainerPropsSchema };
`;

const replacement = `declare function ColumnsContainer({ style, columns, props }: ColumnsContainerProps): React.JSX.Element;

declare const COLUMNS_CONTAINER_STACK_TD_CLASS: string;

export {
  COLUMNS_CONTAINER_STACK_TD_CLASS,
  ColumnsContainer,
  type ColumnsContainerProps,
  ColumnsContainerPropsSchema,
};
`;

for (const name of ['index.d.ts', 'index.d.mts']) {
  const file = path.join(distDir, name);
  let s = fs.readFileSync(file, 'utf8');
  if (s.includes('COLUMNS_CONTAINER_STACK_TD_CLASS')) {
    continue;
  }
  if (!s.includes(needle)) {
    throw new Error(`complete-dts-exports: unexpected ${name} shape; update needle in script`);
  }
  s = s.replace(needle, replacement);
  fs.writeFileSync(file, s);
}
