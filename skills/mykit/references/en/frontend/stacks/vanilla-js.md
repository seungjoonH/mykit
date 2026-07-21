# Vanilla JS Stack

## Rules
- Split code into ES modules by responsibility (DOM, state, network, utils).
- Keep DOM access inside view modules; keep state and side effects out of the DOM layer.
- Use event delegation on a stable parent instead of attaching listeners to many leaf nodes.
- Avoid implicit globals; export only what consumers need.

## Do
- Use `addEventListener` with a named handler so it can be removed on teardown.
- Keep templates as functions returning strings/DocumentFragments; render in one place.
- Centralize fetch logic and error handling in a single network module.

## Don't
- Mutate DOM and application state in the same function.
- Build markup with string concatenation scattered across files.
- Leak listeners by re-binding without removing the previous handler.

## Example
```js
// view/users.js
import { fetchUsers } from "../net/users.js";
import { renderRows } from "./users.template.js";

export function mountUsersView(root) {
  const onClick = (event) => {
    const row = event.target.closest("[data-user-id]");
    if (!row) return;
    openDetail(row.dataset.userId);
  };
  root.addEventListener("click", onClick);

  fetchUsers().then((rows) => {
    root.innerHTML = renderRows(rows);
  });

  return () => root.removeEventListener("click", onClick);
}
```

## Boundaries
- View module owns DOM rendering and event wiring.
- State module owns application data and exposes subscribe/update.
- Network module owns fetch, retry, and error normalization.

## Test Scope
- Pure functions (templates, reducers, formatters) covered by unit tests.
- DOM interactions covered by jsdom or a lightweight integration runner.
- Before completion run the project's test/lint script, or at minimum execute the entry point and verify it loads without console errors.
