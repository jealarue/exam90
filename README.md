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

90 questions matching the official SY0-701 blueprint:

| Domain | Topic                                          | Questions | Weight |
|--------|------------------------------------------------|-----------|--------|
| 1      | General Security Concepts                      | 11        | 12%    |
| 2      | Threats, Vulnerabilities & Mitigations         | 20        | 22%    |
| 3      | Security Architecture                          | 16        | 18%    |
| 4      | Security Operations                            | 25        | 28%    |
| 5      | Security Program Management & Oversight        | 18        | 20%    |
| **Total** |                                             | **90**    | 100%   |

### Dynamic exam configuration

Before the timer starts, configure your practice run:

- **Exam mode**: `1 chance per question` (exam-realistic, fail on first wrong) or `2 chances` (partial credit: 1.0 first attempt, 0.5 second, 0 if both wrong)
- **Timer**: 30–90 minutes (default: 90 min for 2-chance, 60 min for 1-chance)
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