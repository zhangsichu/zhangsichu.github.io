# Blog Post Optimization Rules

These rules standardize structure, code formatting, metadata, and SEO for future posts.

## Front Matter
- **date format**: `YYYY-MM-DD HH:MM:SS +0800` (no space before offset)
- **category**: Single item chosen from `.rules/category-rules.md`
- **tags**:
  - Use only approved tags from `.rules/tag-rules.md`
  - Count between 2–7
  - Alphabetical order; exact spelling/case
  - For reposts, include `转载` and remove `[转载]` from the title
  - Be accurate: do not include technology tags not used in code (e.g., avoid `C++/C` if the post only contains C#)
  - Avoid topic tags that the content does not cover (e.g., `Multithreading`/`多线程`, `Debugging` unless present)

## SEO File Naming
- **slug style**: all-lowercase, English, hyphen-separated
- **include**: technology + topic
- **avoid**: repost state or non-topic qualifiers in the slug; do not mix Chinese in slugs

## Headings & Structure
- One `# H1` title inside the body at most; prefer content `H2/H3` for sections
- Lead with a short context paragraph after front matter
- Use a brief, scannable outline (bullets) or table of contents when sections are many
- Convert free-floating section labels to proper headings
- For iterative tutorials, use consistent `H3` headings per step (e.g., `### 第一次：...`, `### 第二次：...`)
- After each code section, add a brief summary block with bullets: 目标/变更/收获

## Code Formatting
- Use fenced code blocks with language tags:
  - `cpp` for C/C++
  - `csharp` for C# (standardize; avoid using `c#` in fences)
  - `html` for HTML
  - `bash` for shell
- Keep multi-line code in fenced blocks, not inline
- Use inline code backticks for identifiers/APIs 
- Verify API names and symbols 
- Break long one-liners into readable multiple lines
- Keep indentation consistent (2 spaces inside code blocks in posts unless project style dictates otherwise)
- Prefer meaningful class/variable names in refined examples; if preserving historical typos (e.g., `eqtion`) add a note once

## Text & Style
- Prefer concise paragraphs (2–4 sentences)
- Use consistent punctuation; avoid trailing two spaces for line breaks—use blank lines
- Introduce code with a short sentence explaining purpose
- Use consistent terminology; keep abbreviations expanded on first use

## Images
- Always include descriptive alt text, not UI instructions like “Click to Open in New Window”
- Keep images near the referenced text

## Links & References
- Wrap API/class names in backticks; add external reference links when useful (e.g., MSDN for DHTML Event Map Macros)
- Use descriptive anchor text; avoid bare URLs
- For conceptual references (e.g., OCP 原则), add a short “参考资料” section with links

## Tagging Guidance (applied to this post type)
- Primary: `C++/C`
- Secondary: `HTML` and, when discussing UI frameworks, `GUI`
- General: add `Programming`/`Web` sparingly to avoid redundancy; prioritize specificity
- Reposts: must include `转载`
\- For OOP principle posts: prefer `Design` and `Design Pattern` over unrelated tags

## Consistency Checks (pre-publish)
- Front matter validates against category and tag rule files
- Date offset is formatted as `+0800`
- Headings are hierarchical and start at `##` for sections
- All code blocks have language tags and compile-correct tokens
- Images have descriptive alt text
\- Code fence languages audited (use `csharp` for C#)
\- Tag accuracy: remove unused languages/technologies; keep total 3–5 when possible

## Migration/Refinement Tips
- Convert inline multi-line code into fenced blocks with language tags
- Normalize API names and correct typos
- Replace generic alt texts with descriptive ones
- Reduce overly broad tags when specific tags exist
\- Convert `c#` code fences to `csharp`
\- Add per-step bullet summaries in iterative refactors (目标/变更/收获)


