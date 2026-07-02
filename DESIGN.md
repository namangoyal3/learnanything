# Design System — PM Streak (learnanything.pro)

## Product Context
- **What:** Duolingo-for-PMs. Daily 2-minute PM lessons with streaks, XP, leaderboards.
- **Audience:** Aspiring and working product managers (India + global).
- **Project type:** Consumer learning web app with SEO marketing surface (~800 articles at `/learn`).

## Aesthetic Direction
- **Direction:** Playful/Toy-like meets dark-mode utility. Duolingo energy, serious PM content.
- **Decoration level:** Intentional — cards, subtle borders, lift shadows; no gradients, no patterns.
- **Mood:** Confident, fast, habit-forming. Reward-heavy. Never corporate SaaS.

## Color
Only **two** saturated colors live in the palette. Everything else is neutral charcoal.

- **Primary (Green — action/success):** `#58cc02` (`--green-primary`) — CTAs, streak positive, "correct"
- **Pro accent (Purple):** `#ce82ff` (`--purple-primary`) — Pro plan, premium features only
- **Semantic:**
  - Orange `#ff9600` — streak/fire, urgency
  - Gold `#ffc800` — XP, achievements
  - Red `#ff4b4b` — errors, wrong answers
  - Blue `#1cb0f6` — info only (never as primary brand)
- **Surfaces (charcoal, no blue/teal tint):**
  - `--bg-primary: #0e1113` (app background)
  - `--bg-secondary: #16181c` (raised strip)
  - `--bg-card: #1f2228` (cards)
  - `--border-color: #2a2e35`
- **Text:** `#ffffff` primary, `#a8a8a8` secondary

**Rule:** Blue-teal surface tints are banned. Any card or panel background must come from the charcoal variables above.

## Typography
- **Family:** `"DIN Round Pro", "Nunito", system-ui, sans-serif`
- **Body base:** 15px
- **Scale (min → max, mobile → desktop):**
  - H1 hero: `text-4xl sm:text-6xl` (36 → 60px), `font-black`, `tracking-tight`, `leading-[1.05]`
  - H2 section: `text-4xl sm:text-5xl` (36 → 48px), `font-black`, `leading-[1.05]`
  - H3 card: `text-lg` (18px), `font-black`, `leading-snug`
  - Body: `text-sm` (14px) to `text-base` (16px), `leading-relaxed`
  - Meta/eyebrow: `text-xs` `font-black` `uppercase tracking-widest` (use green for positive, secondary text otherwise)

**Rule:** Never use `font-bold` where `font-black` fits — the brand is heavy weights. Never use `Inter`, `Roboto`, `Poppins` — DIN Round Pro + Nunito only.

## Spacing & Layout
- **Section vertical padding:** `py-28` desktop, `py-14 sm:py-20` on tight marketing sections
- **Max content width:** `max-w-5xl` for marketing, `max-w-4xl` for article lists, `max-w-3xl` for long-form reading
- **Card padding:** `p-5` (small) / `p-7` (hero features)
- **Gap between cards:** `gap-4` default
- **Radii:**
  - Small pill/button: `rounded-2xl` (1rem)
  - Card: `rounded-3xl` (1.5rem)
  - Tile icon: `rounded-2xl`
  - Full pill: `rounded-full`

## Motion
- **Approach:** Minimal-functional with occasional reward-trigger (XP float, flame pulse).
- **Hover transitions:** `transition-colors` on cards and buttons.
- **Named keyframes** (defined in `globals.css`):
  - `flame-pulse` for streak flames
  - `xp-float` for XP awards
  - `correct-flash` / `wrong-flash` for quiz feedback

## Patterns (SEO pages must follow)
- Dark `bg-[var(--bg-primary)]` full-screen shell
- Max content width `max-w-3xl` or `max-w-4xl`
- H1 `text-4xl sm:text-6xl font-black tracking-tight`
- Body paragraphs `text-base leading-relaxed text-[var(--text-primary)]`
- Secondary text `text-[var(--text-secondary)]`
- CTA button: green primary, rounded-2xl, `font-black` label
- No inline custom colors — only CSS variables

## Anti-patterns (banned)
- Purple or blue gradients on CTAs or buttons
- Blue-teal card surfaces (`#1f3a45`, `#1a2b32` — retired)
- Multiple competing accent colors on one section
- Thin font weights (`font-normal`, `font-medium`) on headings
- Centered 3-column icon grids as the default feature pattern
- `text-3xl` as section H2 (too close to body)
- Rounded-lg as card radius (too sharp — use rounded-3xl)

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-14 | Retired blue-teal surfaces `#1f3a45`/`#1a2b32`, moved to neutral charcoal | Palette was running 3 competing accents (green + purple + blue-teal); neutralizing surfaces lets green + purple own the brand |
| 2026-04-14 | Bumped H2 scale `text-3xl sm:text-4xl` → `text-4xl sm:text-5xl` | Previous hierarchy was flat; new scale creates clear display/body tiers |
| 2026-04-14 | Section padding `py-20` → `py-28` | Card-heavy homepage felt like a wall; more breathing room creates narrative rhythm |
| 2026-04-14 | Initial DESIGN.md created | Locking system for 800+ SEO pages and future agent-generated content |

## Accessibility (added 2026-07-03, from /plan-design-review audit)

**Contrast.** Solid brand-color fills (green/purple/orange/blue) take BLACK text
— white-on-#58cc02 is 2.09:1 and fails WCAG at every size; black is 10.05:1.
Tinted fills (`bg-*/10`, `/15`) on charcoal keep white text. Secondary text is
`--text-secondary` (#a8a8a8) — never `text-gray-500` (#6b7280 fails at small
sizes) and never `text-white/40` below 14px.

**Type floor.** Minimum rendered size 10px, and 10px only for captions/badges.
Nothing at 8–9px — bottom-nav labels are 10px minimum.

**Focus.** Global `:focus-visible` ring (blue, 3px) lives in globals.css and
must never be removed. Never `outline: none` without a replacement.

**Keyboard.** Anything clickable is a `<button>` or `<a>` — never a div with
onClick. After an action disables the focused control (e.g. quiz confirm),
move focus to the next actionable element.

**Screen readers.** Icon-only controls get `aria-label`. Decorative emoji/icons
get `aria-hidden`. Stat clusters (streak/XP/gems) get labeled wrappers. Dynamic
feedback (quiz results, purchase confirmations) renders in `role="status"`.
One `h1` per screen. Loading states get `role="status"`.

**Motion.** All framer-motion runs under `<MotionConfig reducedMotion="user">`
(MotionProvider in layout). Every CSS animation added to globals.css must also
be added to the `prefers-reduced-motion: reduce` block. No infinite animation
without reduced-motion coverage.

**Touch targets.** 44px standard, 36px absolute minimum. Modal close buttons
use the shared 44px treatment.

## Loading skeletons
Skeleton blocks: `bg-[var(--bg-card)] animate-pulse` shapes matching the final
layout geometry (same radii/borders), wrapped in `role="status"` with an
sr-only label. No spinner-only or text-only loading screens on app surfaces.
