# CompTIA Security+ SY0-701 — Interactive Practice Exams

Dark-themed, browser-based practice exams for the CompTIA Security+ SY0-701
certification. Pure HTML / CSS / vanilla JavaScript — no build step, no server,
no external dependencies, no tracking, no network calls. Open `index.html` in a
browser and study.

## What's in this repo

Three study artifacts in one place:

1. **50-question scenario quiz** — original interactive app at the repo root
   (`index.html` + `assets/`).
2. **90-question full practice exam — interactive web app** — the headline
   app, under `exam90/`. Domain-weighted to the official SY0-701 blueprint
   with a 90-minute exam timer, domain filter, multi-select support, and a
   per-domain results breakdown.
3. **90-question practice exam — printable markdown** — the same 90 questions
   as the web app, rendered as a static document for paper / PDF study:
   `SY0-701_Practice_Exam_2026-04-26.md`.

All practice questions are original study aids written to mirror the public
SY0-701 exam blueprint and difficulty calibration. No live exam content is
reproduced.

## Features (90-question app)

Located at `exam90/index.html`.

### Domain-weighted question pool

Matching the official SY0-701 blueprint:

| Domain | Topic                                          | Questions | Weight |
|--------|------------------------------------------------|-----------|--------|
| 1      | General Security Concepts                      | 11        | 12%    |
| 2      | Threats, Vulnerabilities & Mitigations         | 20        | 22%    |
| 3      | Security Architecture                          | 16        | 18%    |
| 4      | Security Operations                            | 25        | 28%    |
| 5      | Security Program Management & Oversight        | 18        | 20%    |
| **Total** |                                             | **90**    | 100%   |

### Dynamic Options (pre-exam setup)

The first screen is `Dynamic_Options()` — a configuration panel where you set
the rules of the practice run before the timer starts. All choices live in a
single `examSettings` state object so nothing is hard-coded.

- **Exam mode** — `1 chance per question` (a wrong answer immediately resolves
  the question as failed) or `2 chances per question` (partial credit: 1.0
  first try, 0.5 second try, 0 if both wrong).
- **Set timer** — choose from `30 / 45 / 60 / 75 / 90` minutes. Allowed range
  is **30–90 minutes**. The default depends on exam mode: **90 min** for
  2-chance mode (full exam), **60 min** for 1-chance mode (faster realistic
  drill). Switching modes auto-snaps the timer to the matching default; you
  can still override within the 30–90 range.
- **Include PBQs: On / Off** — turn matching-style PBQs on or off for the run.
- **PBQ percentage** — when PBQs are on, pick `0% / 10% / 20% / 30% / Custom %`.
  The app calculates how many PBQ questions to include based on the total
  number of questions selected (e.g., 90 questions × 10% ≈ 9 PBQs). If the
  requested percentage exceeds the number of PBQ-tagged questions available,
  all available PBQs are used and a clear warning is shown.
- **Question pool** — `All 90 MCQs` (full domain-weighted exam) or a
  `Random subset` of N MCQs. PBQs are selected **before** regular MCQs when
  building the exam.
- **Live config summary** — pills under the form show the exact mode, timer,
  PBQ count, and pool currently selected, so you can confirm the configuration
  before Start.

### Sticky timer + controls

The timer box is `position: sticky` at the top of the exam screen on desktop
**and** mobile, so Start, Pause, and Reset are always reachable while
scrolling. The timer never covers question text or answer choices. Display
turns amber at ≤ 10 minutes and red & pulsing at expiry.

### 15 acronym + 19 scenario MCQs

15 acronym questions distributed across all five domains (ZTNA, CRL, APT,
CVSS, IOC, NGFW, SDN, RPO, SOAR, PAM, EDR, STIX, PII, PHI, NDA) plus 19
scenario-based questions with realistic SOC analyst, security architect, IR,
and CISO framing.

- `[SELECT TWO]` support with a Submit button and live "select N more" hint.
- **Domain filter** — drill into one domain at a time, or filter to
  Acronym-only, Scenario-only, PBQ-only, or Missed-only views.

### Completion behavior

When the exam is complete (all questions resolved or the timer expires):

- The timer **stops automatically** and cannot be restarted.
- A clear PASS / BELOW PASS THRESHOLD completion banner appears at the top of
  the results, with the final score, percentage, exam mode, timer setting, and
  PBQ percentage used.
- A per-domain results breakdown follows with a weak-area heatmap.
- Buttons offer to **Export Fail Log** (`.txt`) or **Export Miss Log**
  (`.json`), and to filter to "Review missed only".
- Pass threshold is `~83%` (i.e., 75-of-90 on a full exam).

### Fail log / missed-question tracking

Every missed question is captured locally with full context:

- Question number, domain, stem
- Selected answer(s), correct answer(s)
- Explanation
- Timestamp (ISO 8601)
- Exam mode (`1-chance` or `2-chance`)
- Timer setting (in minutes)
- Number of attempts used

Logs persist in `localStorage` (key `sy0701.missLog.v2`) and can be exported
in two formats:

- **`fail-log-<timestamp>.txt`** — plain-text, human-readable; one record per
  missed question. Triggered by the **Export Fail Log** button (in the
  bottom nav and on the completion banner).
- **`sy0701-miss-log-<timestamp>.json`** — full structured JSON with all
  fields. Triggered by **Export Miss Log (.json)**.

Nothing is uploaded — the app makes no network calls.

### Offline / no dependencies

Pure static site. Single HTML page, plain CSS, vanilla JavaScript — no build
step, no packages, no tracking. Open `exam90/index.html` directly or serve the
folder with any local file server.

## Project structure

```
SY0-701_Interactive/
├── README.md                                  # this file
├── index.html                                 # 50-question scenario quiz
├── assets/                                    # styles + data + logic for the 50-question app
│   ├── styles.css
│   ├── quiz-data.js
│   └── quiz.js
├── SY0-701_Practice_Exam_2026-04-26.md        # 90-question printable exam
└── exam90/                                    # 90-question interactive exam
    ├── index.html
    └── assets/
        ├── styles.css
        ├── quiz-data.js                       # all 90 question objects
        └── quiz.js                            # rendering, scoring, timer, filter
```

## Running

There is no build step. Open the HTML file directly:

```bash
# macOS
open exam90/index.html

# Windows (PowerShell)
start exam90/index.html

# Linux
xdg-open exam90/index.html
```

Or serve the folder locally if your browser blocks file:// access:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000/exam90/
```

## Scoring

Each question allows up to 2 attempts and scores partial credit:

| Attempt outcome             | Points |
|-----------------------------|--------|
| Correct on the 1st attempt  | 1.0    |
| Correct on the 2nd attempt  | 0.5    |
| Both attempts wrong         | 0.0    |

When a question is resolved (either correct or both attempts exhausted), an
explanation panel appears with the correct answer, a one-line rationale, and a
callout for the most tempting wrong answer.

**Pass threshold:** ~83% (75 of 90). The actual scaled passing score for the
live SY0-701 exam is 750 / 900; the percentage threshold here is a useful
approximation for self-assessment.

## Question calibration

Questions are written to match real SY0-701 difficulty distribution:

- ~30% foundational recall
- ~50% applied / scenario thinking
- ~20% calibrated distractor questions

Every question is tagged with a specific SY0-701 exam objective in the
markdown exam, and with a domain identifier in the web app (`domainNum`).

## Customization

To add, edit, or replace questions in the 90-question app, edit
`exam90/assets/quiz-data.js`. Each question is a plain JavaScript object:

```js
{
  num: 1,
  domain: "Domain 1.2 — CIA & Least Privilege",
  domainNum: 1,                 // 1..5
  acronym: false,               // adds an "Acronym" badge
  scenario: false,              // adds a "Scenario" badge
  selectMulti: false,           // true for [SELECT TWO] / [SELECT THREE]
  stem: "Question text goes here...",
  options: { A: "...", B: "...", C: "...", D: "..." },
  correct: "B",                 // string, OR array like ["A","B"] for multi
  explanation: "Why the correct answer is correct.",
  wrongHint: { letter: "A", text: "Why A is the most tempting wrong answer." }
}
```

Up to five options (A–E) are supported per question. Single-correct questions
use `correct: "B"`; multi-select questions use `correct: ["A", "B"]` together
with `selectMulti: true`.

PBQs (matching-style) live in `window.PBQ_DATA` at the bottom of
`quiz-data.js`. Each PBQ entry includes `pbq: true` metadata; MCQs in
`QUIZ_DATA` are implicitly `pbq: false`.

```js
{
  pbqId: "pbq-control-categories",
  pbq: true,                      // metadata flag
  title: "PBQ — Classify Each Control",
  domain: "Domain 1.1 — Control Categories",
  domainNum: 1,
  prompt: "Drag/assign each security control to its CompTIA control CATEGORY...",
  categories: ["Managerial", "Operational", "Technical", "Physical"],
  items: [
    { id: "c1", label: "Acceptable Use Policy", correct: "Managerial" },
    // ...
  ],
  explanation: "..."
}
```

Timer length, exam mode, PBQ percentage, and pool size are no longer
hard-coded — they're chosen on the Dynamic_Options screen and stored in
`examSettings`. To change the **allowed timer values** or the **default per
mode**, edit the constants near the top of `exam90/assets/quiz.js`:

```js
const TIMER_MIN = 30;
const TIMER_MAX = 90;
const TIMER_ALLOWED = [30, 45, 60, 75, 90];
const TIMER_DEFAULT_BY_MODE = { 1: 60, 2: 90 };
```

The pass threshold lives in `computeFinalScore()` in the same file
(`pct >= 83`).

## Browser support

Tested in current Chrome, Edge, Firefox, and Safari. Uses standard ES2015+
features (`const`, arrow functions, `Set`, template literals); no transpilation
needed for any browser released in the last several years.

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