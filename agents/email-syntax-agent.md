# Email Syntax Agent - Product Requirements Document

## Overview

The Email Syntax Agent is a reusable AI agent designed to understand, validate, generate, and manipulate EmailBuilder.js email templates. This agent serves as an expert system for working with the EmailBuilder.js block-based email architecture, providing intelligent assistance for email template creation, modification, validation, and optimization.

## Purpose

The agent enables developers, content creators, and AI systems to:
- Understand EmailBuilder.js document structure and syntax
- Generate valid email templates programmatically
- Validate email template configurations
- Transform and modify existing email templates
- Provide guidance on email best practices and client compatibility
- Assist with block creation and customization

## Context & Domain Knowledge

### EmailBuilder.js Architecture

**Document Structure:**
- Email templates are represented as JSON documents with a hierarchical block structure
- Root block is always of type `EmailLayout` with ID `"root"`
- Document is a dictionary/map: `{ [blockId: string]: TBlock }`
- Each block has:
  - `type`: string (e.g., "Text", "Image", "Button", "Container")
  - `data`: object containing:
    - `style`: optional styling properties (padding, colors, fonts, alignment)
    - `props`: functional properties (text content, URLs, configuration)
    - `childrenIds`: array of child block IDs (for container blocks)

**Example Document Structure:**
```typescript
{
  "root": {
    "type": "EmailLayout",
    "data": {
      "backdropColor": "#F5F5F5",
      "canvasColor": "#FFFFFF",
      "textColor": "#262626",
      "fontFamily": "MODERN_SANS",
      "childrenIds": ["block-123", "block-456"]
    }
  },
  "block-123": {
    "type": "Text",
    "data": {
      "style": {
        "padding": { "top": 16, "bottom": 16, "right": 24, "left": 24 },
        "fontWeight": "normal"
      },
      "props": {
        "text": "Hello World"
      }
    }
  }
}
```

### Block Types

**Standard Blocks:**
- `Text`: Text content with markdown support
- `Heading`: Heading text with styling
- `Image`: Images with optional links
- `Button`: Call-to-action buttons
- `Divider`: Horizontal dividers
- `Spacer`: Vertical spacing
- `Avatar`: User avatars
- `Html`: Raw HTML content

**Container Blocks:**
- `EmailLayout`: Root layout container (backdrop, canvas, font settings)
- `Container`: Generic container for grouping blocks
- `ColumnsContainer`: Multi-column layout (typically 2-3 columns)

**XML Blocks** (fetch dynamic content from **fixed RheumNow admin XML endpoints**):
- Each package exports a base `*_FEED_URL` in `src/index.tsx`. The effective fetch URL is `buildTopicFilteredFeedUrl(baseUrl, props.topicTid, props.dashboardTagTid)` from `@usewaypoint/rheumnow-xml-topic` in blocks: topic-only `{baseUrl}/{tid}`; both topic and dashboard tag `{baseUrl}/{topicTid},{dashboardTagTid}`; dashboard-only `{baseUrl}/{dashboardTagTid}`. **Duplicate:** the same join logic exists in `packages/email-builder/src/renderers/renderToStaticMarkup.tsx`—change both when altering separators. After edits, run `npm run build` in `packages/rheumnow-xml-topic` and `packages/email-builder` (and restart Vite / rebuild Docker) so `dist/` and the browser are not still using old `+` output.
- **Configurable in the editor** (typical): `title`, `numberOfItems`, optional **`topicTid`** / **`dashboardTagTid`**, and `style` (e.g. padding)—see each block’s Zod schema and matching `*SidebarPanel` in `packages/editor-sample` (`RheumnowTopicSelect`, `RheumnowDashboardTagSelect`). Dropdowns use `/admin/terms` rows where **`vid`** is **`Topic`** or **`Dashboard tags`** (case-insensitive). **Dashboard tags** require **`field_is_active === 1`**. **Topics** use `vid === Topic` and treat empty or `1` as active; **`0`** / **`Off`** are excluded.
- **Not** XML feeds: `Button` and `Image` still use `props.url` for link/target and image `src` respectively.

| Block `type` | Exported feed constant (package) | Endpoint |
|--------------|----------------------------------|----------|
| `VideoXml` | `VIDEO_XML_FEED_URL` (`block-video-xml`) | `https://rheumnow.com/admin/videos-xml` |
| `TherapeuticUpdateXml` | `THERAPEUTIC_UPDATE_XML_FEED_URL` | `https://rheumnow.com/admin/therapeutic_update_xml` |
| `VideoPosterXml` | `VIDEO_POSTER_XML_FEED_URL` (`block-video-poster-xml`) | `https://rheumnow.com/admin/therapeutic_update_xml` |
| `FeaturedStoryXml` | `FEATURED_STORY_XML_FEED_URL` | `https://rheumnow.com/admin/featured-story-xml` |
| `NewsPanelXml` | `NEWS_PANEL_XML_FEED_URL` | `https://rheumnow.com/admin/daily_news_xml` |
| `BlogXml` | `BLOG_XML_FEED_URL` | `https://rheumnow.com/admin/blogs_xml` |
| `Advertisement72890Xml` | `ADVERTISEMENT_72890_XML_FEED_URL` | `https://rheumnow.com/admin/email_ad_728_90_xml` |
| `Advertisement300250Xml` | `ADVERTISEMENT_300250_XML_FEED_URL` | `https://rheumnow.com/admin/email_ad_300_250_xml` |
| `ConferenceAdvertisement300250Xml` | `CONFERENCE_ADVERTISEMENT_300250_XML_FEED_URL` | `https://rheumnow.com/admin/conference_email_ad_300_250_xml` |
| `DailyDownloadXml` | `DAILY_DOWNLOAD_XML_FEED_URL` | `https://rheumnow.com/admin/daily_download_xml` |

**SSR / static HTML:** `packages/email-builder/src/renderers/renderToStaticMarkup.tsx` walks the document and, for each XML block instance, prefetches the same effective URL the component would use (optional topic and/or dashboard tag segment). Prefetched XML is exposed as `__XML_DATA_CONTEXT__` on `global` / `window`, keyed by the **full fetch URL** string components use.

**RheumNow / local samples:** `packages/editor-sample/src/getConfiguration/sample/rheumnow-daily*.ts` omit `props.url` for XML blocks. To point feeds at another host or path (e.g. local sample XML), change the exported `*_FEED_URL` in the relevant block package and rebuild its `dist`.

### Block Schema Pattern

Each block follows this pattern:
```typescript
// Zod schema for validation
export const BlockNamePropsSchema = z.object({
  style: z.object({ /* style properties */ }).optional().nullable(),
  props: z.object({ /* functional properties */ }).optional().nullable(),
});

// TypeScript type
export type BlockNameProps = z.infer<typeof BlockNamePropsSchema>;

// Default values
export const BlockNamePropsDefaults = { /* defaults */ };

// React component
export function BlockName({ style, props }: BlockNameProps) { /* ... */ }
```

### Common Style Properties

- `padding`: `{ top: number, bottom: number, right: number, left: number }`
- `color`: Hex color string (e.g., `"#262626"`)
- `backgroundColor`: Hex color string
- `fontSize`: number
- `fontFamily`: Enum (MODERN_SANS, BOOK_SANS, ORGANIC_SANS, GEOMETRIC_SANS, HEAVY_SANS, ROUNDED_SANS, MODERN_SERIF, BOOK_SERIF, MONOSPACE)
- `fontWeight`: `"bold" | "normal"`
- `textAlign`: `"left" | "center" | "right"`

### Email Client Compatibility

All blocks are tested for compatibility with:
- Gmail (desktop & mobile)
- Apple Mail
- Outlook
- Yahoo! Mail
- HEY
- Superhuman

Email HTML uses table-based layouts and inline styles for maximum compatibility.

## Agent Capabilities

### 1. Document Understanding
- Parse and understand EmailBuilder.js document structure
- Identify block types and their relationships
- Understand hierarchical structure via `childrenIds`
- Recognize block properties and styling options
- Understand XML block data fetching patterns

### 2. Document Generation
- Generate valid EmailBuilder.js documents from specifications
- Create complete email templates from high-level descriptions
- Generate individual blocks with proper schema compliance
- Create container structures (nested containers, columns)
- Generate block IDs following conventions (e.g., `"block-{timestamp}"`)

### 3. Document Validation
- Validate document structure (root block, block IDs, references)
- Validate block schemas (Zod schema compliance)
- Check for orphaned blocks (blocks not referenced in `childrenIds`)
- Validate style property values (colors, fonts, padding ranges)
- For XML blocks: do **not** expect or require `props.url`; validate only properties present in each block’s current Zod schema

### 4. Document Transformation
- Add/remove blocks from documents
- Modify block properties and styles
- Reorder blocks within containers
- Clone blocks and their children
- Merge multiple documents
- Extract specific sections from documents

### 5. Best Practices Guidance
- Suggest email client compatibility improvements
- Recommend responsive design patterns
- Provide accessibility suggestions
- Suggest performance optimizations
- Recommend color contrast improvements
- Guide on proper use of XML blocks

### 6. Block-Specific Expertise
- Understand each block type's unique properties
- Know default values for each block
- Understand when to use which block type
- Provide examples for each block type
- Understand XML block data structures and parsing

## Input/Output Specifications

### Input Formats
1. **Natural Language**: User requests in plain English
   - "Create a welcome email with a header image and welcome text"
   - "Add a button to the existing email template"
   - "Validate this email document"

2. **EmailBuilder.js JSON**: Direct document manipulation
   - Full document objects
   - Partial document updates
   - Block-specific queries

3. **Block Specifications**: Requests for specific blocks
   - "Create a Text block with centered, bold heading"
   - "Generate a two-column layout with images"

### Output Formats
1. **EmailBuilder.js JSON**: Valid document structures
2. **Validation Reports**: Structured error/warning reports
3. **Natural Language Explanations**: Human-readable guidance
4. **Code Examples**: TypeScript/JavaScript code snippets
5. **Diff/Patches**: Document modifications in structured format

## Use Cases

### Use Case 1: Template Generation
**Input**: "Create a newsletter email template with header, two-column content section, and footer"
**Output**: Complete EmailBuilder.js document with all required blocks, proper IDs, and styling

### Use Case 2: Block Addition
**Input**: Existing document + "Add a call-to-action button after the heading"
**Output**: Modified document with new button block inserted in correct position

### Use Case 3: Validation
**Input**: EmailBuilder.js document
**Output**: Validation report with errors, warnings, and suggestions

### Use Case 4: Style Modification
**Input**: Document + "Change all text blocks to use MODERN_SERIF font"
**Output**: Modified document with updated fontFamily properties

### Use Case 5: Block Extraction
**Input**: Document + "Extract the header section (first 3 blocks)"
**Output**: New document containing only the specified blocks

### Use Case 6: Template Optimization
**Input**: EmailBuilder.js document
**Output**: Optimized document with improved styling, better structure, and best practices applied

## Constraints & Rules

### Document Rules
1. Must have exactly one root block with ID `"root"` and type `"EmailLayout"`
2. All block IDs referenced in `childrenIds` must exist in the document
3. No circular references in `childrenIds`
4. Block IDs should follow naming conventions (typically `"block-{timestamp}"` or descriptive names)

### Block Rules
1. All blocks must have valid `type` values matching registered block types
2. Block `data` must conform to the block's Zod schema
3. Container blocks must have `childrenIds` array (can be empty)
4. Style properties must use valid values (e.g., hex colors, enum values)

### Email Best Practices
1. Use table-based layouts for containers
2. Prefer inline styles over CSS classes
3. Ensure proper padding for mobile readability
4. Use web-safe fonts or provide fallbacks
5. Test with multiple email clients
6. Keep email width around 600px for optimal rendering

## Error Handling

The agent should:
- Provide clear error messages for invalid documents
- Suggest fixes for common mistakes
- Handle missing or malformed block references gracefully
- For XML blocks: treat feed endpoints as **code-defined**, not document fields; do not add `props.url` when generating or fixing templates unless the product reintroduces it
- Warn about potential email client compatibility issues

## Examples

### Example 1: Simple Email Generation
```
User: "Create a simple welcome email with a heading 'Welcome!' and a paragraph saying 'Thanks for joining us.'"

Agent Output:
{
  "root": {
    "type": "EmailLayout",
    "data": {
      "backdropColor": "#F5F5F5",
      "canvasColor": "#FFFFFF",
      "textColor": "#262626",
      "fontFamily": "MODERN_SANS",
      "childrenIds": ["block-heading-1", "block-text-1"]
    }
  },
  "block-heading-1": {
    "type": "Heading",
    "data": {
      "props": { "text": "Welcome!" },
      "style": {
        "textAlign": "center",
        "padding": { "top": 32, "bottom": 16, "right": 24, "left": 24 }
      }
    }
  },
  "block-text-1": {
    "type": "Text",
    "data": {
      "props": { "text": "Thanks for joining us." },
      "style": {
        "padding": { "top": 16, "bottom": 32, "right": 24, "left": 24 }
      }
    }
  }
}
```

### Example 2: Block Validation
```
User: [Provides document with invalid block reference]

Agent Output:
Validation Report:
- ERROR: Block "block-999" referenced in childrenIds but not found in document
- WARNING: Text block missing padding, may cause mobile rendering issues
- SUGGESTION: Consider using MODERN_SANS font for better email client support
```

### Example 3: Style Modification
```
User: "Change the background color of the email to #E8F4F8"

Agent Output:
Modified document with EmailLayout backdropColor updated to "#E8F4F8"
```

## Integration Points

The agent should be aware of:
- `@usewaypoint/document-core`: Core document building utilities
- `@usewaypoint/email-builder`: Reader and renderer components; **`renderToStaticMarkup`** and **`XML_FEED_URL_BY_BLOCK_TYPE`** for XML prefetch
- Block packages: Individual block implementations, Zod schemas, and **`*_FEED_URL` / `VIDEO_XML_FEED_URL`** exports for XML-backed blocks
- Editor sample: Block inspector panels under `ConfigurationPanel/input-panels/` (XML URL inputs removed for the nine XML blocks above)

## Success Criteria

The agent is successful when it can:
1. ✅ Generate valid EmailBuilder.js documents from natural language
2. ✅ Validate documents with 100% accuracy against schemas
3. ✅ Transform documents without breaking structure or references
4. ✅ Provide helpful guidance that improves email quality
5. ✅ Handle edge cases gracefully (missing blocks, invalid IDs, etc.)
6. ✅ Understand and work with all block types (standard, container, XML)
7. ✅ Generate documents that render correctly in email clients

## Future Enhancements

Potential future capabilities:
- Topic or query-parameter filters on XML feeds (would require updating each block’s effective fetch URL, `XML_FEED_URL_BY_BLOCK_TYPE` / prefetch keys, and inspector UI)
- Support for dynamic content (LiquidJS variables)
- Template library management
- A/B testing variant generation
- Automated accessibility checking
- Performance optimization suggestions
- Multi-language template support
- Integration with email sending APIs

---

## Agent Implementation Notes

When implementing this agent:
1. Load and understand all block schemas from the codebase (XML blocks: confirm current `props` shape; ignore stale docs that mention `props.url` for those types)
2. Maintain a registry of available block types and their properties
3. Implement document traversal and manipulation utilities
4. Create validation functions that check against Zod schemas
5. Build natural language understanding for email template requests
6. Provide clear, actionable error messages
7. Support both programmatic and conversational interfaces

The agent should be stateless and reusable across different contexts, able to work with any EmailBuilder.js document without requiring prior knowledge of specific templates.
