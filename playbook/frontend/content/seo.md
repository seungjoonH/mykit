# SEO

## Rules
- Manage meta/OG tags per route.
- Maintain sitemap and robots policy.
- Use structured data for key entities.
- Keep canonical URLs stable for indexable pages.

## Do
- Validate canonical URL, indexability, and schema output.
- Generate sitemap entries from real route sources.

## Don't
- Ship pages with duplicate title/description and missing robots policy.
- Publish indexable pages without structured data when entity-rich.

## Example
```ts
export const metadata = {
  title: "Product Detail",
  description: "Product detail page",
  openGraph: { title: "Product Detail" },
};
```

## Boundaries
- Page layer owns metadata declaration.
- Infra layer owns robots/sitemap deployment.
- Content layer owns human-readable titles and descriptions.

## Test Scope
- Route metadata snapshot test.
- Sitemap and robots endpoint validation.
- Before completion, run frontend tests or at minimum typecheck/lint.
