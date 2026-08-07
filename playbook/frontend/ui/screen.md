# Screen Implementation

## Priority
- Approved design, screen structure, states, and responsive requirements take priority over primitive reuse and implementation convenience.
- Removing an approved UI element or viewport behavior is a scope change, not simplification.
- Primitives standardize lower-level contracts; they do not replace feature/page CSS.

## Ownership
- Features may own domain-specific layout, density, visual hierarchy, and state presentation.
- Pages may own shell, navigation, major region composition, and page-level responsive layout.
- Screen-specific grid templates, asymmetric panels, sticky regions, media queries, and container queries are allowed.
- Repeated flex/grid is a signal to consider a layout primitive, not a ban on direct screen CSS.

## Before Implementation
- Identify the reference spec, mock, screenshot, wireframe, or existing screen.
- Map every required screen element and state to an implementation task.
- Define desktop/mobile structure and visual hierarchy.
- Include only loading, error, empty, forbidden, and data states that the screen actually owns.
- Preview the implementation and get approval before reducing scope.

## Completion
- Structural QA checks required headings, navigation, filters, actions, statuses, owned states, responsive transitions, keyboard access, accessible names, and long text.
- Visual QA compares hierarchy, spacing, alignment, typography, tokens, overflow, and clipping against the reference at desktop and mobile viewports.
- Record mismatches, fix them, and compare again. Opening a browser once is not visual QA.
- Functional completion and design completion are separate decisions. Passing tests is not evidence that the screen design is complete.
