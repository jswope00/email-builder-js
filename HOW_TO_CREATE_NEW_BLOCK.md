# How to Create a New Block

This guide explains how to create a new block (e.g., `MyBlock`) for the EmailBuilder.js.

## Overview

Blocks in this repository are structured as individual packages within the `packages/` directory. To add a new block, you need to:

1. Create a new package for the block.
2. Implement the block's schema and component.
3. Register the block in the Editor Core.
4. Create a configuration panel (sidebar) for the block.
5. Add the block to the "Add Block" menu.

---

## Step 1: Create the Block Package

Create a new directory in `packages/` named `block-my-block` (replace `my-block` with your block name).

### 1.1 `package.json`

Create `packages/block-my-block/package.json`. You can copy an existing one (e.g., from `block-button`) and update the name.

```json
{
  "name": "@usewaypoint/block-my-block",
  "version": "0.0.1",
  "description": "My custom block",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "require": "./dist/index.js",
      "import": "./dist/index.mjs",
      "types": "./dist/index.d.ts"
    }
  },
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "tsup ./src/index.tsx --outDir dist --format cjs,esm --dts"
  },
  "peerDependencies": {
    "react": "^16 || ^17 || ^18",
    "zod": "^3"
  },
  "devDependencies": {
    "tsup": "^6.0.0" 
  }
}
```

### 1.2 `tsconfig.json`

Create `packages/block-my-block/tsconfig.json`:

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "target": "es2015",
    "module": "esnext",
    "outDir": "dist"
  },
  "exclude": ["dist"]
}
```

---

## Step 2: Implement the Block

Create the source directory `packages/block-my-block/src/` and add `index.tsx`.

### 2.1 `src/index.tsx`

This file must export:
1. A Zod schema defining the block's properties (`MyBlockPropsSchema`).
2. A React component that renders the block (`MyBlock`).

```tsx
import React from 'react';
import { z } from 'zod';

// Define the schema for your block's props and style
export const MyBlockPropsSchema = z.object({
  style: z.object({
    padding: z.object({
      top: z.number(),
      bottom: z.number(),
      right: z.number(),
      left: z.number(),
    }).optional().nullable(),
    // Add other style properties here
  }).optional().nullable(),
  props: z.object({
    text: z.string().optional().nullable(),
    // Add other functional properties here
  }).optional().nullable(),
});

export type MyBlockProps = z.infer<typeof MyBlockPropsSchema>;

export const MyBlockPropsDefaults = {
  text: 'Default text',
} as const;

export function MyBlock({ style, props }: MyBlockProps) {
  const text = props?.text ?? MyBlockPropsDefaults.text;
  
  return (
    <div style={{ padding: style?.padding ? `${style.padding.top}px ${style.padding.right}px ${style.padding.bottom}px ${style.padding.left}px` : undefined }}>
      {text}
    </div>
  );
}
```

**Note:** Run `npm install` in the root to link the new package (if using workspaces) or build the package locally.

---

## Step 3: Register the Block in Editor Core

You need to tell the editor about your new block.

### 3.1 Update `packages/editor-sample/src/documents/editor/core.tsx`

1. Import your new block components and schema.
2. Add it to the `EDITOR_DICTIONARY`.

```tsx
// ... other imports
import { MyBlock, MyBlockPropsSchema } from '@usewaypoint/block-my-block'; // Adjust import based on your package name

// ...

const EDITOR_DICTIONARY = buildBlockConfigurationDictionary({
  // ... existing blocks
  MyBlock: {
    schema: MyBlockPropsSchema,
    Component: (props) => (
      <EditorBlockWrapper>
        <MyBlock {...props} />
      </EditorBlockWrapper>
    ),
  },
});
```

---

## Step 4: Create Configuration Panel

This panel allows users to edit the block's properties in the sidebar.

Create `packages/editor-sample/src/App/InspectorDrawer/ConfigurationPanel/input-panels/MyBlockSidebarPanel.tsx`.

```tsx
import React from 'react';
import { MyBlockProps, MyBlockPropsDefaults } from '@usewaypoint/block-my-block';
import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import TextInput from './helpers/inputs/TextInput';

type MyBlockSidebarPanelProps = {
  data: MyBlockProps;
  setData: (v: MyBlockProps) => void;
};

export default function MyBlockSidebarPanel({ data, setData }: MyBlockSidebarPanelProps) {
  const text = data.props?.text ?? MyBlockPropsDefaults.text;

  const updateData = (newData: MyBlockProps) => {
    setData(newData);
  }

  return (
    <BaseSidebarPanel title="My Block">
      <TextInput
        label="Text"
        defaultValue={text}
        onChange={(v) => updateData({ ...data, props: { ...data.props, text: v } })}
      />
      {/* Add more inputs here */}
    </BaseSidebarPanel>
  );
}
```

---

## Step 5: Register Configuration Panel

Tell the sidebar which panel to render for your block type.

### 5.1 Update `packages/editor-sample/src/App/InspectorDrawer/ConfigurationPanel/index.tsx`

1. Import your new sidebar panel.
2. Add a case to the switch statement.

```tsx
// ... imports
import MyBlockSidebarPanel from './input-panels/MyBlockSidebarPanel';

// ... inside ConfigurationPanel function
  switch (type) {
    // ... existing cases
    case 'MyBlock':
      return <MyBlockSidebarPanel key={selectedBlockId} data={data} setData={(data) => setBlock({ type, data })} />;
    // ...
  }
```

---

## Step 6: Add to "Add Block" Menu

Finally, allow users to add your block from the UI.

### 6.1 Update `packages/editor-sample/src/documents/blocks/helpers/EditorChildrenIds/AddBlockMenu/buttons.tsx`

Add your block to the `BUTTONS` array.

```tsx
import { StarOutline } from '@mui/icons-material'; // Example icon

export const BUTTONS: TButtonProps[] = [
  // ... existing buttons
  {
    label: 'My Block',
    icon: <StarOutline />,
    block: () => ({
      type: 'MyBlock',
      data: {
        props: { text: 'New Block' },
        style: { padding: { top: 16, bottom: 16, left: 24, right: 24 } },
      },
    }),
  },
];
```

## Conclusion

Once these steps are completed, rebuild the project (`npm run build` or restart the dev server) and you should see "My Block" in the add menu. Clicking it will add it to the canvas, and selecting it will open your custom configuration panel.

