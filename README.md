# CompTIA Security+ (SY0-701) Interactive Practice Exam

Dark-themed, browser-based practice exam for CompTIA Security+ SY0-701 certification. Pure HTML / CSS / vanilla JavaScript — no build step, no server, no external dependencies, no tracking, no network calls. Open `index.html` in a browser and study.

## Quick Start

1. Open `index.html` in a modern browser
2. Configure your exam settings (attempt mode, timer, question pool, PBQ percentage)
3. Click **Start Exam** and begin

## What's included

| File | Purpose |
|------|---------|
| `index.html` | Main app interface & control flow |
| `assets/quiz.js` | Exam logic, timer, scoring, localStorage management |
| `assets/quiz-data.js` | 90 practice questions with domain tagging & explanations |
| `assets/styles.css` | Dark-themed UI (no external stylesheets) |

## Features

### Domain-weighted question pool

The pool now contains **145 MCQs + 12 PBQs**, each tagged with its SY0-701
objective. The original 90 MCQs (Q1–Q90) form a complete domain-weighted exam
on their own; questions Q91–Q145 are pool-expansion items (variations and
additional angles on the same objectives) that preserve the official
SY0-701 weighting:

| Domain | Topic                                          | Q1–90 | Q91–145 | Total | Weight (orig) |
|--------|------------------------------------------------|-------|---------|-------|----------------|
| 1      | General Security Concepts                      | 11    | 7       | 18    | 12%            |
| 2      | Threats, Vulnerabilities & Mitigations         | 20    | 12      | 32    | 22%            |
| 3      | Security Architecture                          | 16    | 10      | 26    | 18%            |
| 4      | Security Operations                            | 25    | 15      | 40    | 28%            |
| 5      | Security Program Management & Oversight        | 18    | 11      | 29    | 20%            |
| **Total** |                                             | **90** | **55** | **145** | 100%       |

A 90-question random run draws from the full 145-question pool every time, so
back-to-back attempts share roughly **62%** of questions on average — meaning
about a third of every exam is fresh. PBQ pool grew from 9 to **12** so PBQ
draws also rotate.

### Dynamic exam configuration

Before the timer starts, configure your practice run:

- **Quick Presets** (one-click setups, top of the start screen): `Full Exam` · `Quick Drill (30Q)` · `All PBQs` · `Acronyms Drill` · `Scenarios Drill` · `Realistic 1-Chance` · `Practice Weak Areas` · `Reset to Defaults`. Click a preset to populate every other option in one tap; you can still tweak any field afterward.
- **Exam mode**: `1 chance per question` (exam-realistic, fail on first wrong) or `2 chances` (partial credit: 1.0 first attempt, 0.5 second, 0 if both wrong)
- **Timer**: 30–90 minutes (default: 90 min for 2-chance, 60 min for 1-chance)
- **Untimed (study mode)**: a checkbox in the Timer card turns the clock off entirely — no countdown, no pause-lockout, no time-up auto-grading. Useful for self-paced review.
- **Domain focus**: All domains, single domain (1–5), Acronyms only, Scenarios only, **All PBQs only** (drops MCQs entirely and runs through every PBQ in the pool), or **Weak Areas (50/50 mix)** — a hybrid pool composed of 50% literal repeats from your past-miss log + 50% fresh MCQs from the domains where you've missed the most. Falls back to a random sample with a friendly warning when the miss log is empty.
- **Fail Log Review** (start screen + completion banner): a dedicated walkthrough screen that pages through every missed question across all sessions, showing stem, your answer, the correct answer, the explanation, the domain, the exam mode, the timer setting, and the timestamp. Filterable by domain or PBQs.
- **Question pool**: All 90 questions (full domain-weighted exam) or a random subset of N total questions. The pool size is the **total exam size** — MCQs and PBQs are drawn together to fill it.
- **PBQs**: On/Off toggle with percentage (0%, 10%, 20%, 30%, or custom). **PBQs replace random MCQs in the pool — they do not add to the total.** A 90-question exam with 10% PBQs is 9 PBQs + 81 MCQs (= 90), not 99. If the requested percentage exceeds the available PBQs, the rest is filled with MCQs and a warning is shown.
- **Randomized question order**: Each Start Exam click reshuffles the draw and the presentation order, so PBQs are interspersed with MCQs rather than clustered at the start or end.
- **Live summary**: Real-time config pills show your exact mode, timer, pool size, and the resulting MCQ + PBQ mix before start

### Question variety

- **15 acronym questions** (ZTNA, CRL, APT, CVSS, IOC, NGFW, SDN, RPO, SOAR, PAM, EDR, STIX, PII, PHI, NDA)
- **19 scenario-based questions** with realistic SOC analyst, architect, IR, and CISO framing
- **`[SELECT TWO]`** multi-select support with live "select N more" hints
- **Domain filter**: Drill by domain or filter to Acronym-only, Scenario-only, PBQ-only, or Missed-only views

### Sticky timer & controls

Timer box is always reachable while scrolling. Start, Pause, and Reset buttons stay visible on desktop and mobile. Display turns amber at ≤10 minutes, red & pulsing at expiry.

### Auto-explained answers

On resolution, each question shows:
- Correct answer with one-line rationale
- Explanation panel
- Callout for the most tempting wrong answer

### Completion & results

When done (all questions resolved or timer expires):

- Timer stops automatically
- PASS / BELOW PASS banner with final score, percentage, exam mode, timer, and PBQ %
- Per-domain results breakdown with weak-area heatmap
- Options to export fail log (`.txt`) or miss log (`.json`)
- Review missed questions filter

**Pass threshold**: ~83% (75 of 90 correct)

### Persistent missed-question tracking

Every wrong answer is logged locally with full context:

- Question number, domain, stem, selected/correct answers
- Explanation and timestamp (ISO 8601)
- Exam mode and timer setting
- Number of attempts used

Logs persist in `localStorage` (key `sy0701.missLog.v2`) and can be exported as:

- **`fail-log-<timestamp>.txt`** — human-readable plain text
- **`sy0701-miss-log-<timestamp>.json`** — full structured JSON

No network calls — 100% offline.

## Scoring

| Attempt outcome             | Points |
|-----------------------------|--------|
| Correct on 1st attempt      | 1.0    |
| Correct on 2nd attempt      | 0.5    |
| Both attempts wrong         | 0.0    |

## Running

No build step required. Just open the HTML file:

```bash
# macOS
open index.html

# Windows (PowerShell)
start index.html

# Linux
xdg-open index.html
```

Or serve locally if your browser blocks `file://`:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Customization

Edit `assets/quiz-data.js` to add, update, or replace questions. Each MCQ is a plain JavaScript object:

```js
{
  num: 1,
  domain: "Domain 1.2 — CIA & Least Privilege",
  domainNum: 1,                 // 1..5
  acronym: false,               // badge for acronym questions
  scenario: false,              // badge for scenario questions
  selectMulti: false,           // true for [SELECT TWO] / [SELECT THREE]
  stem: "Question text goes here...",
  options: { A: "...", B: "...", C: "...", D: "..." },
  correct: "B",                 // string OR array like ["A","B"] for multi-select
  explanation: "Why the correct answer is right.",
  wrongHint: { letter: "A", text: "Why this is the most tempting wrong choice." }
}
```

PBQs (matching-style) live in `window.PBQ_DATA` at the bottom of `quiz-data.js`:

```js
{
  pbqId: "pbq-control-categories",
  pbq: true,
  title: "PBQ — Classify Each Control",
  domain: "Domain 1.1 — Control Categories",
  domainNum: 1,
  prompt: "Assign each control to its category...",
  categories: ["Managerial", "Operational", "Technical", "Physical"],
  items: [
    { id: "c1", label: "Acceptable Use Policy", correct: "Managerial" },
    // ...
  ],
  explanation: "..."
}
```

To adjust timer range or exam defaults, edit constants in `assets/quiz.js`:

```js
const TIMER_MIN = 30;
const TIMER_MAX = 90;
const TIMER_ALLOWED = [30, 45, 60, 75, 90];
const TIMER_DEFAULT_BY_MODE = { 1: 60, 2: 90 };
```

Pass threshold is in `computeFinalScore()` (`pct >= 83`).

## PBQ drag-and-drop

PBQs render as a board with one drop zone per category and a tray of
unassigned item chips. To answer:

- Drag a chip from the tray (or another zone) onto the matching category.
- Or use the small dropdown built into each chip — keyboard- and
  touch-friendly fallback.
- Move chips between categories or back to the tray at any time before
  Submit.
- After Submit, each chip turns green (correct) or red (with the correct
  category called out) so review is in-place.

The board is fully accessible: every chip has an `aria-label`-ed select for
keyboard users, and on touch devices the dropdown remains the easiest path.

## Browser support

Modern Chrome, Edge, Firefox, Safari. ES2015+ features; no transpilation needed.

## Disclaimer

CompTIA® and Security+® are registered trademarks of CompTIA, Inc. This
project is **not affiliated with, endorsed by, or sponsored by CompTIA**. All
practice questions are original study aids written to align with the publicly
published SY0-701 exam objectives. No actual exam content is reproduced.

This repository is provided "as is" for personal study purposes. Always verify
any exam-objective interpretation against the official CompTIA SY0-701
objectives document before relying on it for the live exam.

## License

Released under the MIT License — free for personal study, classroom, or
training use. Attribution appreciated but not required.