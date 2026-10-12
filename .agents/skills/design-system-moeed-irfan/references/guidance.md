# Moeed Irfan UI Guidance

## Context and goals

Deliver a structured, content-first marketing site that helps readers and knowledge seekers find and read Moeed Irfan's content.

Reference: https://moeedbuilds.dev/. This package specifies guidance; it does not implement or audit the live website.

| Family | Supplied count | Delivery priority |
| --- | ---: | --- |
| Cards | 128 | Shared anatomy and responsive grids |
| Links | 89 | Descriptive destinations and visible focus |
| Buttons | 56 | Reusable variants and state behavior |
| Lists | 14 | Native semantics and reading rhythm |
| Inputs | 4 | Labels, validation, and recovery |
| Navigation | 1 | Predictable site navigation and mobile disclosure |

Counts are supplied context, not confirmed page measurements. Teams should reuse shared components across this inventory.

## Design tokens and foundations

Implementations must load Outfit with font-display: swap and retain the supplied sans-serif fallback.
Components must use the semantic variables in tokens.css. Raw colors must remain in primitive definitions.
New token values must be shared and documented; component-local spacing or typography exceptions must not be introduced.

The supplied sub-16px typography scale remains preserved for compatibility. Body and controls should use font-body-size and font-label-size.
Metadata should use font-meta-size; headings must use font-heading-small, font-heading-medium, or font-heading-large.
Heading roles must reflect document structure rather than choosing a heading level for its visual size.
Heading sizes must remain fixed token values, with explicit breakpoint role changes rather than viewport-scaled type.
The base line-height primitive remains 25.6px; the semantic body role uses 1.6 to maintain proportional leading when text size changes.

Shared extensions add 24/32/48px headings, weight 600, proportional line heights, layout constraints, target dimensions, borders, focus geometry, and a zero-duration motion token.
Layout spacing derives from supplied spacing primitives. Card radius maps to the brand's radius.sm; controls map to radius.xs.
The legacy pink text.inverse primitive must map only to text-accent-on-page. Text on surface-action must use text-on-action.

### Approved contrast pairings

Ratios use opaque sRGB colors and are rounded for display; acceptance must use unrounded ratios.

| Foreground role | Background role | Ratio | Normal-text result |
| --- | --- | ---: | --- |
| text-body | surface-page | 21.00:1 | Pass |
| text-muted | surface-hover | 7.36:1 | Pass |
| text-on-action | surface-action | 5.08:1 | Pass |
| text-accent-on-page | surface-page | 4.79:1 | Pass |
| Legacy text.tertiary | surface-page | 4.34:1 | Fail |
| Legacy text.tertiary | surface-hover | 3.90:1 | Fail |
| Legacy text.inverse | surface-hover | 4.30:1 | Fail |
| Legacy text.primary | Legacy text.inverse used as fill | 4.38:1 | Fail |

Normal text must meet 4.5:1. Large text must meet 3:1 when at least 24 CSS pixels regular or approximately 18.67 CSS pixels bold.
Legacy tertiary must not be used for normal readable text on supplied dark surfaces. Error copy must use text-error, paired with an explicit error label.
Enabled elements must not use reduced opacity unless their composited colors still pass.
Required control boundaries must use border-control or another tested semantic border; differences between dark surfaces must not serve as the sole boundary.
White focus rings with focus-offset-color separate focus from both dark surfaces and action fills. Implementations must measure contrast against actual adjacent colors.
Shadows must not replace focus indicators. The legacy green shadow should remain unused until a named product purpose is defined.

### Layout and motion

Page gutters must use gutter-page; layouts at 48rem and above should use gutter-page-wide.
Content must respect layout-content-max; reading columns should respect layout-reading-max.
Sections must use space-section, grids gap-grid, and local vertical stacks gap-stack.
Control targets should use size-target-touch; controls must meet size-target-aa or a documented WCAG exception.
Feedback must use duration-feedback and panel transitions duration-panel. Reduced-motion implementations must also disable nonessential movement, looping indicators, and smooth scrolling.
The legacy instant primitive means 200ms feedback, not zero-duration behavior.

## Component-level rules

### Shared state and interaction contract

Every component must document these seven states, including N/A with a reason for static content.
Loading must guard repeat actions; temporary aria-disabled controls must remain focusable where preserving focus is necessary.
Permanently unavailable native buttons must use disabled; editable but nonmodifiable fields must use readonly where appropriate.
Focus-visible must remain visible during active, loading, and error states.
Error semantics must remain until valid correction or successful retry; hover must not erase an error.
Disabled/loading activation guards must take precedence over hover and active affordances.
Selected/current states must be separately represented through the relevant semantics, such as aria-current on navigation links.
Pointer actions must activate on click or equivalent release, with cancellation available; essential actions must not depend on hover.
Touch actions must match pointer outcomes and must not require precision gestures.
Keyboard order must match logical reading order. Interactive controls must use native elements.

### Cards

Anatomy: optional media, heading, optional summary, metadata, and explicit destination/action.
Variants: article, resource, and static informational card.
Cards must use padding-card, gap-stack, radius-card, font-heading-small, font-body-size, and font-meta-size.
Cards must not nest interactive controls inside another interactive element. A card with multiple actions must remain a noninteractive container.

| State | Required behavior |
| --- | --- |
| Default | Cards must use surface-panel with text-body and text-muted. |
| Hover | Interactive destinations must show an underline or equivalent non-color cue; static cards must mark hover N/A. |
| Focus-visible | The focused link/control must show the shared focus ring; static containers must not become tab stops. |
| Active | The destination must retain its label and show an underline while pressed; static cards must mark active N/A. |
| Disabled | Unavailable destinations must become static labeled content; static informational cards must mark disabled N/A. |
| Loading | Collections must preserve layout, expose aria-busy, and announce one loading status; decorative placeholders must be hidden from assistive technology. |
| Error | Failed collections must show error copy and a native Retry button; static content must mark error N/A. |

Keyboard Enter must activate card links; embedded buttons must support Enter and Space. Pointer/touch must activate explicit controls.
Grids should use auto-fit tracks constrained by layout-card-min and available width; they must collapse to one column when needed.
Card children must allow shrinking; long titles must wrap and unbroken strings must use overflow-wrap: anywhere.
Media must reserve layout-media-ratio space, render meaningful alternative text when needed, and preserve readable content when missing.
Empty collections must show a contextual message; unavailable metadata must be omitted rather than leave empty rows.

### Links

Anatomy: native anchor with meaningful destination text; optional decorative icon.
Variants: inline, navigation, and standalone destination.
Links must inherit body or label typography, use text-link, and use gap-inline for icon spacing.

| State | Required behavior |
| --- | --- |
| Default | Inline links must be underlined and use text-link. |
| Hover | Links must preserve the underline and should use text-link-hover when contrast passes. |
| Focus-visible | Links must show the shared focus ring without removing their underline. |
| Active | Links must retain descriptive text and a visible pressed cue such as a thicker underline. |
| Disabled | Unavailable destinations must render static text with a reason; anchors must not fake a disabled state. |
| Loading | Async destinations must retain focus, indicate progress, and prevent duplicate work; ordinary navigation must mark loading N/A. |
| Error | Failed async actions must announce a specific failure and recovery option; static destinations must mark error N/A. |

Tab and Enter must follow native link behavior. Modifier-click and context-menu behavior must remain available.
Pointer and touch must activate the same destination. Standalone touch links should meet the touch target token.
Long labels must wrap; long URLs must break safely. Empty destinations must be omitted or shown as labeled unavailable content, never empty anchors.
External links opening a new tab must disclose that behavior accessibly.

### Buttons

Anatomy: native button, descriptive label, optional icon/status indicator.
Variants: primary, secondary, and icon action.
Buttons must use font-label-size, font-label-weight, font-label-leading, padding-control-inline, padding-control-block, gap-inline, and radius-control.
Primary buttons must pair surface-action with text-on-action. Secondary buttons must pair surface-panel with text-body and border-control.

| State | Required behavior |
| --- | --- |
| Default | Buttons must use the defined variant pairings and explicit type. |
| Hover | Buttons must use a non-color cue such as label underline without changing dimensions. |
| Focus-visible | Buttons must show the shared focus ring, including during loading. |
| Active | Buttons must show a pressed cue without shifting surrounding layout. |
| Disabled | Permanently unavailable buttons must use native disabled and an adjacent explanation when the reason is needed. |
| Loading | Buttons must retain a stable label/footprint, expose a busy status, preserve existing focus, and guard repeated activation. |
| Error | Actions must expose a nearby associated error and provide a descriptive retry action when safe. |

Enter and Space must activate buttons. Toggle buttons must expose aria-pressed only when they are actual toggles.
Pointer and touch must activate on release and permit cancellation. Icon actions must have an accessible name and a tooltip available through hover and focus.
Button groups must wrap when space is constrained; labels must wrap without clipping. A minimum target must not become a fixed height that clips enlarged text.
Empty button labels must fail QA. Icon-only buttons must retain accessible names.

### Lists

Anatomy: native ul/ol with li items; optional group heading.
Variants: reading list, ordered sequence, and resource list.
Lists must use font-body-size and gap-stack; embedded controls must use their own family rules.

| State | Required behavior |
| --- | --- |
| Default | Lists must preserve native list semantics and meaningful order. |
| Hover | Static lists must mark hover N/A; embedded controls must follow their own hover rules. |
| Focus-visible | Static lists must mark focus-visible N/A; embedded controls must show their own focus ring. |
| Active | Static lists must mark active N/A; embedded controls must follow their own pressed rules. |
| Disabled | Static lists must mark disabled N/A; unavailable item actions must explain availability. |
| Loading | Async lists must expose aria-busy and one loading announcement; static lists must mark loading N/A. |
| Error | Failed async lists must show specific recovery; static lists must mark error N/A. |

Static items must not be tab stops. Embedded links/buttons must support their native keyboard, pointer, and touch behavior.
Lists must reflow to available width, wrap long content, and avoid horizontal page scrolling.
Empty lists must show contextual text rather than an empty list element. Large collections should use ordinary pagination or a native Load more button.
When appending items, implementations must keep focus on the triggering control and announce the added count.

### Inputs

Anatomy: associated label, control, optional hint, and associated validation message.
Variants: text, email, search, and multiline.
Inputs must use font-body-size, font-label-size, gap-field, padding-control-inline, padding-control-block, radius-control, and border-control.
Labels must remain visible; placeholders must not replace labels.

| State | Required behavior |
| --- | --- |
| Default | Fields must show text-body, a visible label, and an identifiable border. |
| Hover | Editable fields must retain border contrast and must not imply an action on a readonly field. |
| Focus-visible | Fields must show the shared focus ring without losing an error indicator. |
| Active | Editing must retain entered data and native selection behavior. |
| Disabled | Unavailable fields must use disabled; readonly fields must remain readable and selectable. |
| Loading | Pending validation must announce status without disabling typing unnecessarily; submits must guard duplicate work. |
| Error | Invalid fields must expose aria-invalid, associate error text, retain values, and state how to correct them. |

Keyboard editing, selection, Tab navigation, and native input shortcuts must work. Enter submission must apply only where native form behavior is appropriate.
Pointer and touch must support caret placement, selection, and suitable inputmode/autocomplete. Paste must remain available.
Fields must fill available width without page overflow; native internal scrolling in single-line inputs must preserve the caret.
Multiline content must wrap and support resizing without hiding adjacent controls.
Blank optional fields must remain valid; blank required fields must receive a specific error on validation.
Validation must not announce errors on every keystroke; form failure must provide a summary or focus the first invalid field with its associated message.

### Navigation

Anatomy: labeled nav landmark, brand destination, link list, current-page indicator, optional mobile disclosure button.
Variants: expanded and collapsed.
Navigation must use font-label-size, gap-inline, gap-stack, gutter-page, and surface-page.

| State | Required behavior |
| --- | --- |
| Default | Navigation must use native links and a distinct current-page indicator with aria-current. |
| Hover | Links must show an underline or equivalent non-color cue. |
| Focus-visible | Links and disclosure buttons must show the shared focus ring. |
| Active | Pressed links must remain distinct from persistent current-page state. |
| Disabled | Unavailable destinations must be labeled static content rather than inert anchors. |
| Loading | Async route changes must announce progress and guard repeats; ordinary document navigation must mark loading N/A. |
| Error | Async route failures must expose recovery; static navigation must mark error N/A. |

Tab must traverse visible controls. Enter must follow links; Enter/Space must toggle the disclosure.
The toggle must expose aria-expanded and aria-controls. Collapsed links must not remain focusable.
Escape must close an open mobile disclosure and return focus to its toggle. A nonmodal disclosure must not trap focus or use menu/menuitem roles.
Pointer and touch must activate the same controls without hover dependencies.
Navigation should collapse below 48rem and must collapse earlier if labels do not fit. Long labels must wrap.
When a resize hides the focused element, focus must move to a visible equivalent control.
Missing optional destinations must be omitted; the brand destination must remain available.
A skip link must appear on focus and target the main content. Sticky navigation must not obscure the focused element.

## Accessibility requirements and testable acceptance criteria

Each implementation must record pass/fail results for these checks.

| Check | Pass criterion |
| --- | --- |
| Text contrast | Enabled text must meet 4.5:1, or 3:1 only when qualifying as large text; actual composite colors must be measured. |
| Nontext contrast | Required boundaries and state indicators must meet 3:1 against adjacent colors. |
| Keyboard | Every interactive action must work with keyboard alone; focus order must follow reading order; no unintended trap must occur. |
| Focus | Every keyboard control must show a visible ring; focus must not be entirely obscured by sticky UI. |
| Targets | Pointer targets must be at least 24 by 24 CSS pixels or meet a documented WCAG exception; touch targets should be 44 by 44. |
| Text resizing | At 200% text size, content and controls must remain readable and operable without clipping. |
| Reflow | At 320 CSS pixels, content must reflow without page-level horizontal scrolling except inherently two-dimensional content. |
| Text spacing | With line height 1.5, paragraph spacing 2em, letter spacing 0.12em, and word spacing 0.16em, no content/functionality must be lost. |
| Names and semantics | Accessibility-tree inspection must expose meaningful names, native roles, current/expanded states, and correct label/error associations. |
| Announcements | Loading, success, and failure must be announced without moving focus unnecessarily or repeating decorative status. |
| Reduced motion | With reduced motion enabled, nonessential movement and smooth scrolling must stop; progress must remain understandable. |
| Hover/focus content | Custom tooltips must be dismissible, hoverable, and persistent until dismissed or no longer relevant. |
| Images | Informative images must have appropriate alternatives; decorative images must use empty alternatives. |
| Touch | Essential actions must work without hover or multipoint/precision gestures; pointer actions must permit cancellation. |

Automated accessibility checks should supplement manual keyboard, zoom/reflow, and screen-reader testing.
The supplied specification must not be labeled WCAG-compliant until implementation checks pass.

## Content and tone standards with examples

Action labels must name the destination or outcome. Error copy must state the problem and a corrective action.
Status messages must be concise, and empty states must explain the current condition.

| Context | Preferred | Prohibited |
| --- | --- | --- |
| Article link | Read Building Accessible Forms | Click here |
| Form submission | Send message | Go |
| Retry | Retry loading articles | Try something |
| Required email | Enter your email address. | Invalid input |
| Network error | Your message could not be sent. Try again. | Something went wrong |
| Empty search | No articles match this search. | Nothing here |
| Loading | Loading articles... | Please wait forever |

Duplicate destinations should use consistent labels. Dates should use an unambiguous format.
Errors must preserve user input; retry language must reflect whether repeating an action is safe.

## Anti-patterns and prohibited implementations

- Components must not use raw colors or local spacing/type exceptions.
- Implementations must not hide outlines without an equally visible replacement.
- Normal text must not use failing legacy tertiary or pink-on-muted combinations.
- Controls must not rely on subtle dark-surface differences for necessary boundaries.
- Cards must not contain nested interactive wrappers or conflicting full-card click handlers.
- Links must not use empty href values or simulate buttons; buttons must not simulate navigation.
- Essential content must not depend on hover, color, tooltips, or animation alone.
- Loading indicators must not cause layout shifts, steal focus, or permit duplicate submissions.
- Text must not be clipped to make a component fit; unavailable values must not produce empty labels.
- Sections must not become nested floating cards; cards should represent repeated content items.

### Migration notes

Teams must retain the original primitives and move components to the semantic layer.
Teams must replace readable tertiary text with text-muted, pink-on-muted text with text-link/text-error, and accent-fill labels with text-on-action.
Teams must migrate headings and section spacing to shared extension roles before introducing new values.
Teams should prioritize cards, links, and buttons using the supplied inventory, then lists, inputs, and navigation.
Migration checks must include keyboard order, loading-focus preservation, long content, and responsive overflow.

## QA checklist

- [ ] All supplied token primitives must remain accounted for; all semantic aliases must resolve.
- [ ] All six component families must define seven states, including justified N/A states.
- [ ] Every interactive variant must define keyboard, pointer, and touch behavior.
- [ ] Spacing, typography, radius, motion, and color must use shared semantic tokens.
- [ ] Actual state color pairings must pass the applicable contrast threshold.
- [ ] Required boundaries and focus indicators must remain identifiable.
- [ ] Keyboard, target-size, focus-obscuration, and semantic checks must pass.
- [ ] Text resizing, text spacing, and 320px reflow checks must pass.
- [ ] Long titles, unbroken URLs, empty data, missing images, and enlarged text must not lose content.
- [ ] Loading, errors, retries, and duplicate-action guards must pass.
- [ ] Reduced motion, touch interaction, and mobile disclosure behavior must pass.
- [ ] The live inventory and WCAG implementation results must be recorded separately from this specification.
