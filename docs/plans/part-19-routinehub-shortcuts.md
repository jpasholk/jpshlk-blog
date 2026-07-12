# Part 19: RoutineHub Shortcuts as first-class content

Ready-to-execute plan. Written by a Fable session with full repo context so a smaller-model session can implement it without re-deriving decisions.

## Goal

The rebuild roadmap (rebuilding-my-blog-with-ai.mdx, part 19) promises Josh's iOS Shortcuts as real pages here, "not just links." Today RoutineHub appears only as `SOCIALS.routinehub` in `src/config.ts` and one generic entry in `src/content/projects/ios-shortcuts.md`.

## Design

Mirror the `projects` collection pattern exactly (see `src/content.config.ts`), but with MDX bodies so each shortcut can have a real writeup.

1. **Collection** in `src/content.config.ts`:

```ts
const shortcuts = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/shortcuts' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),        // one-liner for cards, 40-200 chars (validators)
      routinehubUrl: z.url(),         // the download/install page
      version: z.string().optional(),
      image: image().optional(),      // screenshot
      order: z.number().default(0),
      featured: z.boolean().default(false),
    }),
});
```

Add `shortcuts` to the exported `collections`.

2. **Listing page** `src/pages/shortcuts/index.astro`: model on `src/pages/projects.astro` (Card grid, pageGraph, h1 + description). Wrap content in `data-pagefind-body` (search opt-in, like /about and /projects).

3. **Detail pages** `src/pages/shortcuts/[slug].astro`: model on `src/pages/blog/[...slug].astro` (getStaticPaths over the collection, `render(entry)`), with a simple layout: h1, screenshot if present, prominent "Get it on RoutineHub" button (`Button.astro` exists), then the MDX body. `data-pagefind-body` on the article wrapper.

4. **Content**: Josh writes one MDX file per shortcut (SCSettings is the known flagship; his RoutineHub profile has the list). Bodies are casual first-person per CLAUDE.md. He supplies screenshots to `src/assets/`.

5. **Wiring**:
   - `src/content/projects/ios-shortcuts.md`: point its `url` at `/shortcuts/` instead of the RoutineHub profile (`linkLabel: 'Browse my Shortcuts'`).
   - Navigation: do NOT add a nav item (nav is deliberately five entries); link from the footer row or let /projects carry it. Josh's call at review.
   - `src/pages/how-this-site-works.astro`: section 8's indexed-pages leaf gains /shortcuts/; the data-flow section note already says "one source of truth, many consumers."

## Gotchas (learned this session)

- Astro collapses whitespace at template line boundaries: keep inline links on one line or use `{' '}`.
- seoGraph validators run at build: every page needs exactly one h1, description 40-200 chars, and all internal links resolving (trailing slashes).
- New indexed pages change the Pagefind count in build output; update expectations in any verification script.
- No em or en dashes anywhere (CLAUDE.md).

## Verification

`npm run check` + `npm run build` (watch validator output), then preview: listing renders, detail pages render with working RoutineHub buttons, search finds shortcut content, nav unchanged. Browser-test pattern: playwright-core scripts against `npm run preview`, chromium at `/opt/pw-browsers/chromium` (sandbox) or default install locally.

## Companion post

Part 19 post: the story of making shortcuts first-class content (draft: true until Josh reviews). Follow the current series conventions: no "part N" intro line, direct opening, punchy emoji closer.
