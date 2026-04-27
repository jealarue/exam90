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

- **Domain-weighted question pool** matching the official SY0-701 blueprint:

  | Domain | Topic                                          | Questions | Weight |
  |--------|------------------------------------------------|-----------|--------|
  | 1      | General Security Concepts                      | 11        | 12%    |
  | 2      | Threats, Vulnerabilities & Mitigations         | 20        | 22%    |
  | 3      | Security Architecture                          | 16        | 18%    |
  | 4      | Security Operations                            | 25        | 28%    |
  | 5      | Security Program Management & Oversight        | 18        | 20%    |
  | **Total** |                                             | **90**    | 100%   |

- **15 acronym questions** distributed across all five domains (no clustering),
  covering ZTNA, CRL, APT, CVSS, IOC, NGFW, SDN, RPO, SOAR, PAM, EDR, STIX,
  PII, PHI, NDA.
- **19 scenario-based questions** with realistic SOC analyst, security
  architect, IR, and CISO framing.
- **[SELECT TWO] support** with a Submit button and live "select N more" hint.
- **Two attempts per question** with partial-credit scoring (1.0 / 0.5 / 0).
- **90-minute exam timer** — Start / Pause / Reset; amber under 10 minutes,
  red and pulsing at expiry.
- **Domain filter** — drill into one domain at a time, or filter to
  Acronym-only or Scenario-only views.
- **Per-domain results breakdown** with a PASS / BELOW PASS THRESHOLD verdict
  at the 83% (75-of-90) line.
- **Pure static site** — single HTML page, ~95 KB total assets, runs offline.

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

To change the exam length of the timer, edit `TIMER_SECONDS` near the top of
`exam90/assets/quiz.js`. The pass threshold lives in `renderSummary()` in the
same file (`pct >= 83`).

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