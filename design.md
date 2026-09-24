# BUILD: EDSA Tracker — "Paper & Ink" Zen Redesign

## 0. Role & goal
You are a senior product designer + frontend engineer. Build a pixel-faithful,
production-quality UI for **EDSA Tracker**, a DSA (data structures & algorithms)
practice tracker with SM-2 spaced repetition. Aesthetic: Japanese-zen minimalism,
"paper and ink". Calm, airy, typographic, almost no color. Color only carries meaning.

Stack: React + Tailwind (or plain CSS variables). Single-page app, light + dark themes.
Do NOT use: gradients, glassmorphism-heavy blur, emoji, colored pill clusters,
left-border accent cards, Inter/Roboto/Arial, drop shadows on everything.

---

## 1. Design tokens

### 1.1 Color — Light ("Paper")
| Token            | Hex       | Use                                        |
|------------------|-----------|--------------------------------------------|
| --paper          | #F7F5F0   | main background                            |
| --paper-sunk     | #F0EDE6   | sidebar background                         |
| --paper-raised   | #FBFAF7   | drawer bg, active nav item                 |
| --surface        | #FFFFFF   | inputs, open row, palette, cards           |
| --well           | #F3F0EA   | stat panels, selected palette row          |
| --chip           | #EFECE5   | segmented control track, neutral chips     |
| --line           | #E4E0D6   | hairlines, borders                         |
| --line-strong    | #E2DDD2   | button/input borders                       |
| --ink            | #1B1A17   | primary text, primary button, progress     |
| --ink-2          | #57534B   | secondary text                             |
| --ink-3          | #6E695F   | captions, mono meta (≥4.5:1 on paper)      |
| --ink-icon       | #857F73   | inactive icons (≥3:1)                      |
| --ring-empty     | #A8A296   | empty completion ring                      |

Semantic (muted, earthy, never neon):
| Meaning                 | Text      | Soft bg   | Border    |
|-------------------------|-----------|-----------|-----------|
| Easy / Done (moss)      | #4A6B3A   | #E6EDE0   | #CCD9C2   |
| Medium / Hard grade (ochre) | #8A6212 / #6E4E0E | #F6EEDB | #E8D9B4 |
| Hard diff (vermilion)   | #A63B24   | —         | —         |
| Overdue / Again         | #9A3620 / #8E2F1B | #F6E4DE / #F8EAE5 | #EBCFC6 |
| Good grade (indigo)     | #2B4470   | #E6EBF4   | #CBD5E8   |
| Note exists             | #2F4A7A   | —         | —         |
| Revision flag           | #B35C1E (filled icon when on) |
| Bookmark                | #8A6212 (filled icon when on) |
| Due badge (sidebar)     | bg #B8432A, text #FFFFFF |
| Done ring fill          | #4A6B3A with white check |

### 1.2 Color — Dark ("Ink")
| Token        | Hex      |
|--------------|----------|
| --paper      | #0E0E0C  |
| --surface    | #171714  |
| --line       | #22211E / #2A2925 |
| --ink        | #EDEBE4  |
| --ink-2      | #B3AEA2  |
| --ink-3      | #8F8A7E  |
| moss         | #8DB07A  | ochre #D4A64E / #E3BE6E | vermilion text #F0A48E on #3A1D15 |
Dark grade buttons: Again bg #2A1812 bd #4A2519 tx #F0A48E · Hard bg #282013 bd #45371A tx #E3BE6E ·
Good bg #161E2C bd #2B3A55 tx #A9BDE3 · Easy bg #172014 bd #2E3F26 tx #A8C997.
Done ring in dark: fill #8DB07A, check stroke #0E0E0C.

### 1.3 Typography (Google Fonts)
- **Display:** Instrument Serif 400 (+ italic). Page titles 68px/1.0, drawer title 44px,
  group titles 28px (26px on mobile), mobile page title 42px.
- **UI:** Geist 400/500/600. Body 14–16px; row titles 15px/500; description 16px/1.55.
- **Mono:** Geist Mono 400/500. All numbers, counts, shortcuts, meta lines, eyebrows.
  Meta 11.5px; eyebrows 11–12px UPPERCASE, letter-spacing 0.06–0.08em.
- Wordmark: "EDSA" Geist 15px/600 tracking 0.04em + "tracker" Instrument Serif italic 16px in --ink-2.

### 1.4 Spacing, radius, elevation
- 4px base grid. Page side padding 64px. Section gap 36px. Row height 60px (desktop), 62px (mobile), 72px (Today rows).
- Radius: 8px (small buttons, nav), 10px (inputs, grade buttons, primary buttons), 12px (rows, tiles), 14–16px (panels, palette), 999px (chips, pills).
- Elevation (use sparingly):
  - open row: `0 1px 2px rgba(27,26,23,.04), 0 8px 24px rgba(27,26,23,.05)`
  - palette: `0 2px 6px rgba(27,26,23,.04), 0 24px 64px rgba(27,26,23,.12)`
  - drawer: `-24px 0 64px rgba(27,26,23,.10)`
- Progress bars: 3px tall, track --line, fill --ink, fully rounded.
- Icons: inline SVG, 16px, stroke 1.5, round caps/joins, currentColor. Logo = an ensō:
  an open circle stroke `M17.6 5.4A8.5 8.5 0 1 0 20.3 13` (24px viewBox, stroke 2.2).
- Touch targets ≥ 44px (row ring button, mobile buttons); desktop icon buttons 36–40px.

---

## 2. Global layout (desktop 1440 wide)

```
┌───────────── 272 ─────────────┬──────────────────────── 1168 ─────────────────────────┐
│ SIDEBAR (--paper-sunk)        │ pad 64 │ CONTENT 800 │ gap 56 │ TOC 184 │ pad 64       │
│ border-right 1px --line       │        │             │        │ (sticky)│              │
└───────────────────────────────┴───────────────────────────────────────────────────────┘
```
Mobile (390×844): no sidebar; 56px top bar; single column, 20px side padding.

---

## 3. Components

### 3.1 Sidebar (272px, full height, flex column)
```
┌──────────────────────────────┐
│ ◯ EDSA tracker     [≡] [☾]   │  brand row 44h; icon btns 36×36 (compact rows, theme)
│ ┌──────────────────────────┐ │
│ │ 🔍 Search           ⌘K   │ │  40h, radius 10, bg --paper, border --line-strong
│ └──────────────────────────┘ │  → opens command palette
│ OVERALL            17 / 123  │  mono eyebrow + mono count
│ ▬▬▬▬▬▬────────────────────── │  3px progress
│                              │
│ 📅 Today               (3)   │  nav rows 40h radius 8; badge = red pill, mono 11 white
│ 🔖 Bookmarks             2   │  counts in mono --ink-3
│ ⚑  Needs revision        2   │
│ ?  Guide                     │
│                              │
│ FOUNDATIONS                  │  mono uppercase eyebrow
│ 01 Arrays & Strings   7 / 15 │  ← active: bg --paper-raised, 1px --line-strong, weight 500
│ 02 Stacks & Queues    7 / 12 │  tier rows 36h; number mono 11 --ink-3, 16px wide
│ 03 Binary Search      3 / 10 │
│ STRUCTURES                   │
│ 04 Linked Lists  05 Trees  06 Heaps  07 Graphs
│ ADVANCED                     │
│ 08 Backtracking  09 Dynamic Programming  10 Greedy & Intervals
│ ──────────────────────────── │  margin-top:auto; border-top --line
│ (YN) Your Name          [⇥]  │  32px ink avatar w/ initials; "Synced with Google" caption
└──────────────────────────────┘
```
Props: `active` (tier id | today | bookmarks | revision), `tierDone`, `dueCount`.
Inactive items keep a transparent 1px border so the layout never shifts on selection.

### 3.2 Page header (Tier view)
```
FOUNDATIONS / TIER 01                              ( ⏱ 25:00  Focus )   ← pill 40h, toggles Focus/Pause
Arrays & Strings                                   ← Instrument Serif 68
Hash maps, two pointers and sliding windows — the scanning patterns most array problems reduce to.
▬▬▬▬▬▬▬▬▬▬▬▬──────────────────────  7 / 15 solved   3 due   ← "due" in vermilion, links to Today
```
Padding 48 top / 28 bottom. Description max-width 560, --ink-2.

### 3.3 Filter bar (64h, hairline top + bottom, no background)
```
[🔍 Filter this tier      / ]  [ All | Easy | Medium | Hard ]      (• Core only) (• Revision) (• Hide solved)
```
- Search: 220w × 40h, white, radius 10, "/" shortcut hint in mono.
- Segmented control: track --chip, padding 3, radius 10; segments 34h radius 8;
  selected = white + `0 1px 2px rgba(27,26,23,.08)`, text --ink; others --ink-2.
- Toggle chips: 36h pill, 1px --line-strong, 6px leading dot (ink / flag orange / moss).
  ON state inverts: bg --ink, text --paper, dot --paper. Use aria-pressed.

### 3.4 Pattern group (accordion)
```
◔  Hashing   4 / 7                         Trade memory for constant-time lookups.   ⌄
```
- Header is a full-width button, 52h, aria-expanded.
- Progress ring 22px: track --line-strong, arc --ink, stroke 2, r=9 (circumference 56.55),
  rotated -90°. When 100% → solid moss disc with white check.
- Title Instrument Serif 28; count mono 12 --ink-3; blurb 13 --ink-3 right-aligned; chevron rotates -90° when collapsed.
- 36px top padding between groups. Empty-after-filter state: "Nothing here with these filters." (14px --ink-3).
- Groups in the sample: Hashing / Two Pointers ("Walk inward from both ends.") / Sliding Window ("Grow right, shrink left.").

### 3.5 Problem row (the atomic unit)
```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ (○)  Top K Frequent Elements                                  in 4d   💬  ⚑  🔖    │ 60h
│      Medium · core · high freq                                                      │
└─────────────────────────────────────────────────────────────────────────────────────┘
```
- Ring button 44×44 hit area, visual 20px circle, 1.5px border --ring-empty.
  Done: moss fill + white check (11px, stroke 1.9).
- Title 15/500 → link to `leetcode.com/problems/{slug}/`. Done: --ink-3 + line-through (decoration #A8A296).
- Meta line (mono 11.5, --ink-3): difficulty word colored (Easy moss / Medium ochre / Hard vermilion),
  then "· core" if canonical, then "· {high|med|low} freq". NO pill badges.
- Due chip (mono 12, pill, 5×10 padding), only when solved:
  `in Nd` → --ink-2 on --chip · `Due today` / `Nd late` → #9A3620 on #F6E4DE.
- Actions (40×40 each, always visible at low contrast; stronger on hover):
  Notes (speech bubble; indigo if note exists; opens drawer) · Revision flag (filled orange when on) ·
  Bookmark (filled ochre when on). All icon buttons have aria-label + aria-pressed.
- Rows sit flush with 2px gaps, transparent by default; hover/open = white bg, 1px --line, radius 12, soft shadow.

### 3.6 Inline grade picker (expands INSIDE the open row — not a popover)
```
      How did it feel?  [Again  ] [Hard   ] [Good   ] [Easy   ]          Mark unsolved   Cancel
                        [1 · 1d ] [2 · 2d ] [3 · 4d ] [4 · 9d ]
```
- Indented 52px to align with title. Buttons 96×50, radius 10, two lines:
  label 13/600 + mono 11 "key · next interval".
- Colors: Again vermilion-soft, Hard ochre-soft, Good indigo-soft, Easy moss-soft (see tokens).
- Grading: marks solved, sets next due (1/2/4/9 days in the demo; real app uses SM-2), closes picker.
- "Mark unsolved" only shows if already solved. Keys 1–4 grade, Esc cancels.

### 3.7 Right rail (TOC + shortcuts), 184px, sticky
```
ON THIS PAGE
│ Hashing          4/7     ← active: 1px --ink left rule, text --ink
│ Two Pointers     2/4     ← inactive: 1px --line rule, text --ink-3
│ Sliding Window   1/4
KEYS
J K    Move        Space  Grade      1–4  Again → Easy
B      Bookmark    R      Needs revision
```
Active item tracks scroll via IntersectionObserver. Links 36h.

---

## 4. Screens

### 4.1 Tier view — 1440 × 1480 (interactive)
Sidebar + header + filter bar + 3 pattern groups with 15 problems + right rail.
Sample data (slug = LeetCode slug):
- Hashing: Two Sum (E, core, solved, in 12d) · Contains Duplicate (E, solved, in 20d) ·
  Valid Anagram (E, solved, due today) · Group Anagrams (M, core, solved, 1d late, has note) ·
  Top K Frequent Elements (M, core — picker open) · Product of Array Except Self (M) ·
  Longest Consecutive Sequence (M, flagged)
- Two Pointers: Valid Palindrome (E, solved, in 6d) · 3Sum (M, core, solved, due today, flagged, note) ·
  Container With Most Water (M, core) · Trapping Rain Water (H, bookmarked)
- Sliding Window: Best Time to Buy and Sell Stock (E, core, solved, in 3d) ·
  Longest Substring Without Repeating Characters (M, core) ·
  Longest Repeating Character Replacement (M) · Minimum Window Substring (H, core, bookmarked)
Derived: 7/15 solved, 3 due. Overall = tierDone + 10 of 123.

### 4.2 Today — 1440 × 960
```
SPACED REPETITION / THURSDAY
Today
Three reviews waiting. Re-solve each from a blank editor, then grade how it felt.
[▶ Start review session]  [Shuffle order]          ← primary: ink bg, paper text, 44h radius 10

DUE NOW · 3
(✓) Group Anagrams                 1d late   [Again][Hard][Good][Easy]   ← 72h rows, grade inline, 64×40 btns
    Medium · Hashing · last graded Good
(✓) Valid Anagram                  Due today [Again][Hard][Good][Easy]
(✓) 3Sum  … · flagged              Due today [Again][Hard][Good][Easy]

COMING UP                                       (hairline-separated list, 52h rows, --ink-2)
Best Time to Buy and Sell Stock      Sun · in 3d
Valid Palindrome                     Wed · in 6d
Two Sum                              in 12d
```
Right rail "THIS WEEK": 7 rows `Day | bar | count`, bars 6px tall; today's bar vermilion,
future bars ink at proportional width, empty days a 6px grey dot.
Empty state (when 0 due): moss check mark, "You're all caught up." + next due date.

### 4.3 Problem drawer — 1440 × 960
Underlying page + scrim `rgba(27,26,23,.28)`. Drawer: right-anchored, 560w, full height, --paper-raised.
```
HASHING · 4 OF 7                          [⌃] [⌄] [✕]     ← 64h top bar, hairline bottom
Group Anagrams                                            ← Instrument Serif 44
Medium · core · high freq · Amazon, Meta, Google           ← mono meta
[      Review now      ] [  Solve on LeetCode ↗  ]        ← 48h, 50/50
[🔖 Bookmark        B ] [⚑ Needs revision   R ]           ← 56h tiles, white, radius 12, 2-col grid
┌ well --well radius 14 ────────────────────────────────┐
│ Next review    Interval    Ease                       │  captions 12 --ink-2, values mono 15
│ 1d late        4 days      2.36                       │  "late" in vermilion
│ History [Good][Hard][Good]                            │  mono 11 soft grade chips
└───────────────────────────────────────────────────────┘
Notes                                            Saved
┌───────────────────────────────────────────────────────┐
│ monospaced textarea, white, radius 12, 13px/1.7       │  auto-saves on blur, fills remaining height
└───────────────────────────────────────────────────────┘
```
J/K or ⌃⌄ move between problems without closing. Esc closes.

### 4.4 Command palette ⌘K — 1440 × 960
Page under a light veil `rgba(247,245,240,.72)`. Dialog 640w, top 140, white, radius 16, palette shadow.
```
🔍 two p▌                                         [esc]    ← 60h input, 17px
PATTERN
▸ Two Pointers        Arrays & Strings · 2 / 4      ↵      ← selected row: bg --well, bold match
PROBLEMS
(✓) Valid Palindrome                          Easy
(✓) 3Sum                                      Medium
( ) Container With Most Water                 Medium
( ) Trapping Rain Water                       Hard
ACTIONS
📅 Go to Today                                3 due       ← vermilion
☾  Switch to dark mode                         ⌘ D
──────────────────────────────────────────────────────
↑ ↓ navigate    ↵ open    esc close                        ← 44h mono footer
```
Fuzzy match; bold the matched characters; groups = Pattern / Problems / Actions.

### 4.5 Mobile — 390 × 844, DARK theme
```
[≡]        ◯ EDSA        [🔍]        ← 56h bar, bg rgba(14,14,12,.8), hairline
FOUNDATIONS / 01
Arrays & Strings                     ← serif 42
▬▬▬▬▬▬▬────────  7 / 15
(All)(Easy)(Medium)(Hard)(Core)      ← 36h chips, horizontal scroll; selected = inverted
──────────────
Hashing  4 / 7
(✓) Two Sum            in 12d
(✓) Valid Anagram      [Due]
(✓) Group Anagrams     [1d late]
┌ open row (surface #171714, radius 14) ┐
│ ( ) Top K Frequent Elements          │
│ [Again][Hard][Good][Easy]  4-col grid, 48h
└──────────────────────────────────────┘
( ) Product of Array Except Self
╭──────────────────────────────────────╮  floating, 20px inset, 28px from bottom
│ • 3 reviews due today       [Start]  │  bg --ink(light), text dark, radius 16, 54h
╰──────────────────────────────────────╯
```
Mobile rows hide action icons; use swipe-left (bookmark/flag) and long-press (notes drawer as bottom sheet).

---

## 5. Interaction & motion
- Row click on ring → toggles the inline grade picker (only one open at a time).
- Grade → ring fills moss (150ms scale 0.9→1), title strikes through, due chip appears, picker collapses (height 180ms ease-out).
- Accordion: height + chevron rotate, 200ms ease.
- Drawer: slide in from right 240ms cubic-bezier(.2,.8,.2,1); scrim fades 200ms.
- Palette: fade + 4px upward translate + scale .98→1, 160ms.
- No bouncy springs, no confetti. Respect prefers-reduced-motion (disable transforms).
- Keyboard: ⌘K palette · / focus filter · J/K move · Space grade · 1–4 grade · B bookmark · R revision · Esc close.

## 6. Accessibility
- Real `<button>`, `<a href>`, `<input>` + `<label>`; no clickable divs.
- aria-label on all icon-only buttons; aria-pressed on toggles; aria-expanded on accordions/rows.
- Text ≥ 4.5:1 (captions use #6E695F, never lighter); icons ≥ 3:1.
- Semantic colors are always paired with a word (Easy/Due/Again), never color alone.
- Visible focus ring: 2px --ink outline, 2px offset.

## 7. State model (reference)
```ts
type Problem = { id: string; title: string; diff: 'Easy'|'Medium'|'Hard';
  core: boolean; freq: 'high'|'med'|'low'; pattern: string; tier: string; companies?: string[] };
type Progress = { done: boolean; bookmarked: boolean; flagged: boolean;
  note?: string; dueInDays: number | null; interval: number; ease: number;
  history: ('again'|'hard'|'good'|'easy')[] };
type UI = { openRowId: string|null; diff: 'All'|'Easy'|'Medium'|'Hard';
  coreOnly: boolean; revisionOnly: boolean; hideSolved: boolean;
  collapsed: Record<string, boolean>; theme: 'light'|'dark'; compact: boolean };
```
Compact mode: row height 60 → 44, meta line hidden, inline with title.

## 8. Deliverables
1. Theme tokens as CSS variables for light + dark.
2. Components: Sidebar, PageHeader, FilterBar, SegmentedControl, ToggleChip, PatternGroup,
   ProgressRing, ProblemRow, GradePicker, DueChip, TocRail, ProblemDrawer, CommandPalette,
   ReviewRow, WeekStrip, MobileTopBar, DueFloatingBar.
3. Screens: Tier view, Today, Problem drawer, Command palette, Mobile (dark).
4. Everything wired to local state with the sample data above.