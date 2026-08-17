# CLAUDE.md

Non-negotiable baseline for this project. Full behavioral detail, stack-specific
references, and worked examples live in the `mykit` skill — consult it whenever
these lines aren't enough.

1. Touch only the agreed scope. Don't refactor, "improve", or reformat unrelated code. Inside that scope, apply mykit principles (hooks, meaning units, utils) even if that creates new files.
2. Don't add unused variants or speculative config. Structure for extensibility instead.
3. If requirements are ambiguous or multiple interpretations exist, say so or ask — don't pick silently.
4. If you touched code, run the tests (or at least build/typecheck) before saying "done".
5. Read the actual error/log line before fixing it — don't pattern-match from memory.
6. Korean output ends sentences with `.`, `?`, or `!` — never `:`.
7. New source files start with a one-line Korean comment describing their role.
8. Never commit unless the user explicitly asks — you may suggest a message, but don't finalize without approval.
