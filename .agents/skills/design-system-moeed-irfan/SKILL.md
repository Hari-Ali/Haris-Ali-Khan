---
name: design-system-moeed-irfan
description: Creates implementation-ready UI guidance for Moeed Irfan with semantic tokens, component behavior, and WCAG 2.2 AA acceptance criteria. Use when creating or updating UI rules, component specifications, or design-system documentation.
---

<!-- TYPEUI_SH_MANAGED_START -->

# Moeed Irfan

## Context and goals

Deliver structured, content-first marketing interfaces for Moeed Irfan that help readers and knowledge seekers find and read useful content.

- Brand: Moeed Irfan.
- Reference URL: https://moeedbuilds.dev/.
- Surface: marketing site.
- Tone: concise, confident, implementation-focused.
- Supplied inventory: cards (128), links (89), buttons (56), lists (14), inputs (4), navigation (1). These counts are supplied context, not a verified live-site audit.
- Teams should prefer system consistency over local visual exceptions.

## Sources and foundations

This skill must apply to explicitly requested Moeed Irfan work. Its brand tokens must not replace another brand's design system without an explicit request.

Authors must read [component guidance](references/guidance.md) and use [CSS tokens](references/tokens.css).
The CSS file preserves the supplied primitives and provides shared semantic aliases and documented extensions.

- Components must consume semantic tokens for colors, spacing, typography, radius, shadow, and motion.
- Raw values must appear only in token definitions or explicit measurement-based acceptance criteria.
- Body text should use Outfit at the base role: 16px, weight 400, line height 1.6.
- Authors must preserve supplied primitive values during migration.
- New values must be shared, named extensions with a documented purpose.
- Text must meet 4.5:1 contrast, except qualifying large text must meet 3:1.
- Required control boundaries and state indicators must meet 3:1 against adjacent colors.
- Authors must use the approved foreground/background pairings in the guidance.
- Authors must not use legacy text.tertiary for normal text on the supplied dark surfaces.
- Authors must not treat legacy pink text.inverse as text on an accent background.

## Authoring workflow

1. Authors must restate the design intent in one sentence.
2. Authors must define foundations, semantic tokens, and any shared extensions.
3. Authors must define component anatomy, variants, interactions, and all seven states.
4. Authors must add accessibility acceptance criteria with explicit pass/fail checks.
5. Authors must add anti-patterns, migration notes, and edge-case handling.
6. Authors must end with a QA checklist.

## Required output structure

Generated guidance must include these sections in this order:

1. Context and goals.
2. Design tokens and foundations.
3. Component-level rules: anatomy, variants, states, and responsive behavior.
4. Accessibility requirements and testable acceptance criteria.
5. Content and tone standards with examples.
6. Anti-patterns and prohibited implementations, including migration notes.
7. QA checklist.

## Component rules

- Every component must document default, hover, focus-visible, active, disabled, loading, and error.
- Static or inapplicable states must be marked N/A with a reason.
- Authors must distinguish transient active/pressed state from selected or current state.
- Authors must define state precedence and concurrent states, including focus during loading and error during editing.
- Interactive components must document keyboard, pointer, and touch behavior.
- Every component family must document responsive behavior, long content, overflow, empty states, and failure recovery.
- Every component must name its spacing and typography tokens.
- Forms must use explicit labels and programmatically associated instructions and errors.
- Disabled and loading behavior must specify whether the control remains focusable and how activation is prevented.
- Essential information and actions must be available without hover.
- Keyboard focus must remain visible and must not be entirely obscured.
- Authors must preserve native link, button, input, and list semantics.

## Accessibility and quality gates

- Guidance must target WCAG 2.2 AA and must not claim compliance without implementation testing.
- Every accessibility rule must have a reproducible pass/fail check.
- Implementations must support keyboard-only operation, 200% text resizing, text-spacing overrides, and reflow at 320 CSS pixels.
- Pointer targets must meet the WCAG 24 by 24 CSS-pixel minimum or a documented exception; touch targets should reach 44 by 44 CSS pixels.
- Nonessential motion must stop when reduced motion is requested.
- Required rules must use "must"; recommendations should use "should".
- Authors must not introduce local spacing or typography exceptions.
- Authors must not hide focus, use ambiguous action labels, or convey errors solely through color.

<!-- TYPEUI_SH_MANAGED_END -->
