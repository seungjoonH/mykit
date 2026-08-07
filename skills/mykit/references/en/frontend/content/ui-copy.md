# User-Facing UI Content

## Classify Before Writing
- Separate platform copy, runtime tenant/user data, fixtures/examples, and temporary text that users do not need.
- A proper noun in a spec is not automatically platform copy. Confirm whether it is runtime data, an example, or approved brand copy.
- Never hard-code tenant, customer, location, branch, or user data into shared product descriptions. Ask when ownership is unclear.

## Explanatory Copy
- Do not add descriptions, subtitles, or helper text by habit.
- Keep copy only when it helps the next action, explains a consequence, or improves safety without repeating headings, labels, or buttons.
- Preserve necessary error causes, recovery guidance, destructive-action consequences, and legal consent text.

## Icons and Constraints
- Do not use Unicode symbols, arrow characters, emoji, or text glyphs as UI icons. Use the project's SVG Icon and IconButton contracts.
- Hide decorative icons from assistive technology and give functional icon controls accessible names.
- Enable automated forbidden-content checks only when the project supplies constraints. Configure user-facing include/exclude paths; do not scan tests, docs, comments, generated files, or fixtures unless requested.
- Run configured checks with `npx mykit-content-check --config <relative-config.json>`.

## Content QA
- Check that runtime and fixture data did not become shared product copy.
- Remove unnecessary descriptions, repeated text, and role/feature lists without deleting safety-critical guidance.
- Check for text glyphs used as icons and configured forbidden content after structural and visual changes.
