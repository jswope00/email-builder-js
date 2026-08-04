# AI Synthesis Block

This is a requirements document for an email block called "AI Synthesis". The AI Synthesis block synthesizes a large volume news into a polished, scannable thematic HTML digest for busy clinicians. 


The goal is not a summary of what happened. It's an editorial synthesis of why it matters to the practicing rheumatologist. Think less "science journalist recapping sessions" and more "sharp senior colleague who read everything so you don't have to."

See the block-coverage-xml block since that also pulls from multiple sources. 

## Block Logic
The block will pull from the following sources:
- Videos
- Articles
- Tweets
- Podcasts

It will then use an AI command to synthesize the content into a polished, scannable thematic HTML digest for busy clinicians.
It does this via a 3-step prompt that I'll paste at the bottom of this document. 

We'll send AI requests through Porkey. I'll paste sample code below. 

The block will render the returned HTML into the email block. 

An admin can edit the returned text. 

If the admin tries to generate the content again (when the content is already generated), they will get a warning that a new generation will overwrite the existing content. 

## Block Setup
See examples of other email blocks for rules for these fields. multiple sources. 
- Title (optional)
- Topic (optional)
- Dashboard Tag (optional)
- Created Start Date (optional)
- Created End Date (optional)
- Relative Days (Today - N) (optional)
- Items Types (allow a user to choose one, some, or all options)
-- Videos
-- Article
-- Tweet
-- Podcast



## Prompt

Here is the prompt that will be used to synthesize the content:

=====
# Conference Digest Skill (Rheumatology)
 
This skill synthesizes a large volume of rheumatology conference news into a polished, 
scannable thematic HTML digest for busy clinicians — formatted for direct use on RheumNow.
 
## Core Philosophy
 
The goal is not a summary of what happened. It's an editorial synthesis of **why it matters**
to the practicing rheumatologist. Think less "science journalist recapping sessions" and more
"sharp senior colleague who read everything so you don't have to."
 
---
 
## Step 1: Ingest and Orient
 
Before writing anything, scan the full set of articles to understand:
- The **breadth** of topics (therapeutics, diagnostics, biomarkers, epidemiology, guidelines, etc.)
- Natural **clustering** — which articles clearly belong together thematically?
- The **content type** of each article: news article, video, or podcast (needed for icon selection)
- **Outliers** that don't fit cleanly — fold into the most relevant bucket
Don't start writing until you've mentally mapped the terrain.
 
---
 
## Step 2: Assign Articles to Themes (max 4 buckets)
 
Identify **no more than 4 thematic buckets** that capture the meaningful signals across the corpus.
 
Good themes are clinically meaningful — they reflect shifts in practice, emerging evidence gaps,
evolving treatment paradigms, or looming controversies. Avoid themes so broad they're useless
("New Research") or so narrow they could have been a bullet point ("One study on JAK inhibitors").
 
**Naming conventions:**
- Use a roman numeral and ALL CAPS heading, punchy and declarative
- Good: `I. THE JAK INHIBITOR RECKONING`
- Weak: `I. TREATMENT UPDATES`
Every article must map to exactly one bucket. If an article fits two themes equally, choose
where it adds the most unique signal.
 
---
 
## Step 3: Write Each Bucket
 
For each bucket, produce four components:
 
### A. The Heading
Roman numeral + ALL CAPS punchy title. Sets the tone and signals clinical stakes.
 
### B. The Hook (2–3 sentences)
Contextualizes the theme: Why is this cluster emerging now? What's shifting? What tension
does it address? This is editorial framing — not a list of what the studies showed.
 
### C. The Article List
Each article as a list item with the correct content-type icon (see icon rules below).
Article titles only — no summaries, no parenthetical notes.
 
### D. The Conclusions Paragraph (labeled "Conclusions:")
A synthesizing paragraph that answers:
- What does this cluster mean together?
- What's the clinical implication, practice shift, or lingering uncertainty?
- What should the reader actually do differently, or what should they be watching?
This is the "so what" — it should feel like an insight, not a recap.
 
---
 
## HTML Output Format
 
Produce a self-contained HTML fragment with **fully inlined CSS on every element**. This output
is used in email (via RheumNow newsletters), where `<style>` blocks and class-based stylesheets
are stripped by email clients. **Do not use a `<style>` block, `<head>`, or class-based CSS.**
Every style must appear as an inline `style=""` attribute directly on its element.
 
The output should be a bare HTML fragment (no `<!DOCTYPE>`, no `<html>`, no `<head>`, no `<body>`)
ready to paste into a RheumNow page or email template without modification.
 
Use this exact structure — do not deviate from the tag structure or inline style values:
 
```html
<div style="/* container — add any wrapper styles here if needed */">
 
    <h2>I. [THEME TITLE]</h2>
    <span style="color: #555555; margin-bottom: 15px; display: block; font-size: 15px;">[Hook paragraph, 2–3 sentences.]</span>
 
    <div style="list-style: none; padding: 0; margin: 0;">
 
        <div style="display: flex; align-items: center; margin-bottom: 8px; padding: 5px 0;">
            <img src="[ICON_URL]" alt="[TYPE]" style="width: 20px; height: 20px; margin-right: 12px; flex-shrink: 0;"/>
            <a href="[URL]" style="font-size: 14px; color: #2980b9; text-decoration: none; font-weight: 500;">[Article title]</a>
        </div>
        <!-- repeat the above div for each article in bucket -->
 
    </div>
 
    <div style="background: #f9f9f9; padding: 15px; margin-top: 15px; font-size: 14px; border-left: 4px solid #2c3e50;">
        <span style="font-weight: bold; color: #2c3e50; text-transform: uppercase; display: block; margin-bottom: 5px;">Conclusions:</span>
        [Big picture synthesis paragraph]
    </div>
 
    <!-- repeat h2 + hook span + article-list div + conclusions div for each bucket -->
 
</div>
```
 
**Critical rules:**
- Every `style=""` attribute must be present on every element — no exceptions.
- Do not add class names. They will be ignored by email clients.
- If an article has no URL, use `<span>` instead of `<a>` but keep the same inline styles.
- Do not wrap the output in `<html>`, `<head>`, or `<body>` tags.
---
 
## Icon URL Rules
 
Each article item uses one of three icons based on content type. Use the exact URLs below:
 
| Content Type | Icon URL |
|---|---|
| News article (default) | `https://rheumnow.com/sites/default/files/2026-04/news-icon-black.png` |
| Video | `https://rheumnow.com/sites/default/files/2026-04/video-play-black.png` |
| Podcast | `https://rheumnow.com/sites/default/files/2026-04/podcast-icon-black.png` |
 
If the content type is ambiguous or unknown, default to the news icon.
 
---
 
## Tone and Voice
 
- **Audience**: busy practicing rheumatologists
- **Register**: authoritative but human. "This is not a coincidence — it's a signal." Not "These
  findings may suggest potential implications."
- **Wit is welcome** when it clarifies, not when it decorates.
- **Empathy for the reader**: they're overwhelmed. Every word should earn its place by helping
  them understand or act.
---
 
## Handling Edge Cases
 
**Too few articles (fewer than ~8):** Use 2–3 buckets rather than forcing thin themes to hit 4.
 
**Too many articles (30+):** Prioritize ruthlessly. Novel findings, practice-changing implications,
and high-profile controversies earn prominence. Small confirmatory studies can be grouped under
a theme without demanding individual mention in the Hook.
 
**XML or structured input:** Extract article titles, content type, and full text before thematic
assignment. Don't synthesize from titles alone if body text is available.
 
When parsing XML, use these fields for the `href` in article links:
 
| Content Type | URL field to use |
|---|---|
| News article | `<view_node>` |
| Video | `<view_node>` |
| Podcast | `<view_node>` (the RheumNow page URL — **not** `<field_podcast_audio>`, which is the raw SoundCloud stream) |
 
Always prefer the `<view_node>` URL. Only fall back to `<field_podcast_audio>` if `<view_node>` is absent.
 
**Articles with URLs:** If source URLs are provided, use `<a href="[URL]" style="font-size: 14px; color: #2980b9; text-decoration: none; font-weight: 500;">` for the title element. If no URL is available, use `<span style="font-size: 14px; color: #2980b9; font-weight: 500;">` instead. Never use class names.
=====


## Portkey Sample Code

```nodejs
import Portkey from 'portkey-ai';

const portkey = new Portkey({
  apiKey: "mXV**********************ihq"
});

async function main() {
  const response = await portkey.chat.completions.create({
    messages: [
      { role: "system", content: "You are a helpful assistant" },
      { role: "user", content: "What is Portkey" }
    ],
    model: "@rheumnow-anthropic/claude-sonnet-5",
    max_tokens: 512
  });

  console.log(response.choices[0].message.content);
}

main();
```

```python
from portkey_ai import Portkey

portkey = Portkey(
  api_key = "mXV3c3q62j5q0P8YItfvUiyXMihq"
)

response = portkey.chat.completions.create(
    model = "@rheumnow-anthropic/claude-sonnet-5",
    messages = [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "What is Portkey"}
    ],
    MAX_TOKENS = 512
)

print(response.choices[0].message.content)
```

```curl
curl https://api.portkey.ai/v1/chat/completions   -H "Content-Type: application/json"   -H "x-portkey-api-key: mXV3c3q62j5q0P8YItfvUiyXMihq"   -d '{
    "model": "@rheumnow-anthropic/claude-sonnet-5",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "What is Portkey"}
    ],
    "MAX_TOKENS": 512
  }'
```
