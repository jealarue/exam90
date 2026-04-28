// SY0-701 Practice Exam — interactive logic
//
// Dynamic_Options() (start screen) lets the user pick:
//   - Exam mode:   1 chance (exam-realistic) or 2 chances (partial credit)
//   - Set timer:   30 / 45 / 60 / 75 / 90 minutes (default depends on mode)
//   - PBQs:        On/Off + percentage (0/10/20/30/Custom)
//   - Pool:        All 90 MCQs or a random subset
//
// All UI state for those choices lives in a single `examSettings` object so
// nothing is hard-coded. The exam timer runs in the sticky bar (Start / Pause /
// Reset) and stops automatically on completion or expiry.
//
// Missed questions are tracked in localStorage with full context (stem,
// selected/correct answers, explanation, timestamp, exam mode, timer setting)
// and can be exported as fail-log.txt or as JSON. No external network calls.
//
// localStorage keys:
//   sy0701.missLog.v2  — array of past wrong-answer records (full schema)

(function () {
  "use strict";

  // ===================================================================
  // Constants
  // ===================================================================

  const STORAGE_KEY = "sy0701.missLog.v2";

  // Timer rules
  const TIMER_MIN = 30;
  const TIMER_MAX = 90;
  const TIMER_ALLOWED = [30, 45, 60, 75, 90];
  const TIMER_DEFAULT_BY_MODE = { 1: 60, 2: 90 };

  const DOMAIN_NAMES = {
    1: "D1 General Concepts",
    2: "D2 Threats & Vulns",
    3: "D3 Architecture",
    4: "D4 Operations",
    5: "D5 Program Mgmt"
  };

  // ===================================================================
  // Single source of truth for Dynamic_Options() choices
  // ===================================================================

  const examSettings = {
    attemptsAllowed: 2,        // 1 | 2
    timerMinutes:    90,       // 30..90 (TIMER_ALLOWED)
    includePBQs:     true,     // mirror of pbqMode
    pbqMode:         "on",     // "on" | "off"
    pbqPercent:      10,       // 0/10/20/30 or custom value
    pbqPercentMode:  "10",     // dropdown value: "0"|"10"|"20"|"30"|"custom"
    pbqCustomPercent: 10,      // last typed custom %
    poolMode:        "all",    // "all" | "random"
    poolSize:        30        // when poolMode === "random"
  };

  // ===================================================================
  // DOM references
  // ===================================================================

  const $ = (id) => document.getElementById(id);

  // Start screen
  const startScreen     = $("startScreen");
  const startExamBtn    = $("startExamBtn");
  const viewHistoryBtn  = $("viewHistoryBtn");
  const missHistory     = $("missHistory");
  const missHistoryBody = $("missHistoryBody");
  const exportMissesBtn = $("exportMissesBtn");
  const clearMissesBtn  = $("clearMissesBtn");

  // Dynamic_Options inputs
  const timerMinutesEl  = $("timerMinutes");
  const timerSelectedLb = $("timerSelectedLabel");
  const timerHelpEl     = $("timerHelp");
  const pbqPercentEl    = $("pbqPercent");
  const pbqPercentRow   = $("pbqPercentRow");
  const pbqCustomRow    = $("pbqCustomRow");
  const pbqCustomEl     = $("pbqCustom");
  const pbqMaxNote      = $("pbqMaxNote");
  const pbqInfoEl       = $("pbqInfo");
  const poolSizeRow     = $("poolSizeRow");
  const poolSizeEl      = $("poolSize");
  const configSummary   = $("configSummary");

  // Exam screen
  const examScreen   = $("examScreen");
  const quizEl       = $("quiz");
  const progressText = $("progressText");
  const progressFill = $("progressFill");
  const scorePill    = $("scorePill");
  const resetBtn     = $("resetBtn");
  const failLogBtn   = $("exportFailLogBtn");
  const filterEl     = $("domainFilter");
  const scoringNote  = $("scoringNote");

  // Timer DOM (sticky)
  const tDisplay = $("timerDisplay");
  const tStart   = $("timerStart");
  const tPause   = $("timerPause");
  const tReset   = $("timerReset");
  const tModePill = $("timerModePill");

  // ===================================================================
  // Runtime state
  // ===================================================================

  // Active question pool — { kind: "mcq"|"pbq", uid, q }
  let pool = [];

  // Per-question state, keyed by uid
  const state = {};

  // Timer state
  let timerSeconds   = examSettings.timerMinutes * 60;
  let timerRemaining = timerSeconds;
  let timerHandle    = null;
  let timerRunning   = false;
  let examStarted    = false;
  let examEnded      = false;

  // ===================================================================
  // Boot
  // ===================================================================

  function init() {
    const maxPbqs = pbqDataLength();
    if (pbqMaxNote) pbqMaxNote.textContent = "/ " + maxPbqs + " PBQs available";

    // Pool-mode toggle (random subset row visibility)
    document.querySelectorAll('input[name="poolMode"]').forEach((r) => {
      r.addEventListener("change", () => {
        examSettings.poolMode = pickedValue("poolMode");
        if (poolSizeRow) {
          poolSizeRow.style.display = examSettings.poolMode === "random" ? "flex" : "none";
        }
        examSettings.poolSize = clamp(parseInt(poolSizeEl.value, 10) || 30, 5, 90);
        renderConfigSummary();
      });
    });
    if (poolSizeEl) {
      poolSizeEl.addEventListener("input", () => {
        examSettings.poolSize = clamp(parseInt(poolSizeEl.value, 10) || 30, 5, 90);
        renderConfigSummary();
      });
    }

    // Exam mode toggle
    document.querySelectorAll('input[name="attemptsMode"]').forEach((r) => {
      r.addEventListener("change", () => {
        examSettings.attemptsAllowed = parseInt(pickedValue("attemptsMode"), 10);
        // Update timer default to mode default, but keep user's override if it's
        // already valid. Simpler: snap to mode default to make the dependency
        // visible per the requirement that timer depends on mode.
        const newDefault = TIMER_DEFAULT_BY_MODE[examSettings.attemptsAllowed] || 90;
        examSettings.timerMinutes = newDefault;
        timerMinutesEl.value = String(newDefault);
        renderTimerLabel();
        renderConfigSummary();
      });
    });

    // Timer dropdown
    if (timerMinutesEl) {
      timerMinutesEl.addEventListener("change", () => {
        const v = parseInt(timerMinutesEl.value, 10);
        const safe = TIMER_ALLOWED.includes(v) ? v : clamp(v, TIMER_MIN, TIMER_MAX);
        examSettings.timerMinutes = safe;
        if (!TIMER_ALLOWED.includes(v)) {
          timerMinutesEl.value = String(safe);
        }
        renderTimerLabel();
        renderConfigSummary();
      });
    }

    // PBQ mode (on/off)
    document.querySelectorAll('input[name="pbqMode"]').forEach((r) => {
      r.addEventListener("change", () => {
        examSettings.pbqMode = pickedValue("pbqMode");
        examSettings.includePBQs = examSettings.pbqMode === "on";
        applyPbqRowsVisibility();
        renderConfigSummary();
      });
    });

    // PBQ percentage dropdown
    if (pbqPercentEl) {
      pbqPercentEl.addEventListener("change", () => {
        examSettings.pbqPercentMode = pbqPercentEl.value;
        if (pbqPercentEl.value === "custom") {
          pbqCustomRow.style.display = "flex";
          examSettings.pbqPercent = clampPct(parseInt(pbqCustomEl.value, 10));
        } else {
          pbqCustomRow.style.display = "none";
          examSettings.pbqPercent = clampPct(parseInt(pbqPercentEl.value, 10));
        }
        renderConfigSummary();
      });
    }
    if (pbqCustomEl) {
      pbqCustomEl.addEventListener("input", () => {
        const v = clampPct(parseInt(pbqCustomEl.value, 10));
        examSettings.pbqCustomPercent = v;
        if (examSettings.pbqPercentMode === "custom") {
          examSettings.pbqPercent = v;
        }
        renderConfigSummary();
      });
    }

    // Buttons
    startExamBtn.addEventListener("click", onStartExam);
    viewHistoryBtn.addEventListener("click", toggleHistory);
    exportMissesBtn.addEventListener("click", () => exportMissesAs("json"));
    clearMissesBtn.addEventListener("click", clearMisses);

    // Pre-render history preview
    renderMissHistory();
    applyPbqRowsVisibility();
    renderTimerLabel();
    renderConfigSummary();

    // Exam-screen wiring
    resetBtn.addEventListener("click", onResetExam);
    if (failLogBtn) failLogBtn.addEventListener("click", () => exportMissesAs("log"));
    filterEl.addEventListener("change", () => {
      render();
      window.scrollTo({ top: quizEl.offsetTop - 120, behavior: "smooth" });
    });

    tStart.addEventListener("click", startTimer);
    tPause.addEventListener("click", pauseTimer);
    if (tReset) tReset.addEventListener("click", onResetExam);
  }

  // ===================================================================
  // Dynamic_Options() helpers
  // ===================================================================

  function pickedValue(name) {
    const sel = document.querySelector('input[name="' + name + '"]:checked');
    return sel ? sel.value : null;
  }

  function pbqDataLength() {
    return Array.isArray(window.PBQ_DATA) ? window.PBQ_DATA.length : 0;
  }

  function applyPbqRowsVisibility() {
    const on = examSettings.pbqMode === "on";
    if (pbqPercentRow) pbqPercentRow.style.display = on ? "flex" : "none";
    if (pbqCustomRow) {
      pbqCustomRow.style.display = (on && examSettings.pbqPercentMode === "custom") ? "flex" : "none";
    }
  }

  function clampPct(n) {
    if (isNaN(n)) return 0;
    return Math.max(0, Math.min(100, n));
  }

  function totalTargetQuestions() {
    // Total target = MCQ pool size; PBQs are computed as a percentage of that.
    if (examSettings.poolMode === "random") {
      return clamp(examSettings.poolSize, 5, 90);
    }
    return Array.isArray(window.QUIZ_DATA) ? window.QUIZ_DATA.length : 0;
  }

  function computePbqCount() {
    if (!examSettings.includePBQs) return 0;
    const desired = Math.round((examSettings.pbqPercent / 100) * totalTargetQuestions());
    const available = pbqDataLength();
    return { desired: desired, used: Math.min(desired, available), available: available };
  }

  function renderTimerLabel() {
    if (timerSelectedLb) timerSelectedLb.textContent = examSettings.timerMinutes + " minutes";
    if (timerHelpEl) {
      timerHelpEl.innerHTML =
        "Allowed range " + TIMER_MIN + "&ndash;" + TIMER_MAX +
        "&nbsp;min. Default 90 for 2-chance mode, 60 for 1-chance mode. " +
        "Selected: <strong>" + examSettings.timerMinutes + " minutes</strong>.";
    }
  }

  function renderConfigSummary() {
    if (!configSummary) return;
    const pbqInfo = computePbqCount();
    const pillMode = examSettings.attemptsAllowed === 1 ? "1 chance" : "2 chances";
    const pillTimer = examSettings.timerMinutes + " min";
    const pillPbq = examSettings.includePBQs
      ? ("PBQs " + examSettings.pbqPercent + "% (" + pbqInfo.used + " of " + pbqInfo.available + ")")
      : "PBQs off";
    const pillPool = examSettings.poolMode === "random"
      ? (examSettings.poolSize + " random MCQs")
      : "All 90 MCQs";

    let warn = "";
    if (examSettings.includePBQs && pbqInfo.desired > pbqInfo.available) {
      warn = '<span class="summary-warn">⚠ Not enough PBQ-tagged questions available (' +
             pbqInfo.desired + ' requested, only ' + pbqInfo.available +
             ' available). All available PBQs will be included.</span>';
    }

    configSummary.innerHTML =
      '<strong>Selected:</strong> ' +
      '<span class="summary-pill">' + escapeHtml(pillMode) + '</span>' +
      '<span class="summary-pill">' + escapeHtml(pillTimer) + '</span>' +
      '<span class="summary-pill">' + escapeHtml(pillPbq) + '</span>' +
      '<span class="summary-pill">' + escapeHtml(pillPool) + '</span>' +
      warn;
  }

  // ===================================================================
  // Start / Reset exam
  // ===================================================================

  function onStartExam() {
    // Re-read all Dynamic_Options() values into examSettings
    examSettings.attemptsAllowed = parseInt(pickedValue("attemptsMode"), 10);
    examSettings.poolMode        = pickedValue("poolMode");
    examSettings.poolSize        = clamp(parseInt(poolSizeEl.value, 10) || 30, 5, 90);
    examSettings.pbqMode         = pickedValue("pbqMode");
    examSettings.includePBQs     = examSettings.pbqMode === "on";

    // Timer must obey 30..90 range; snap to allowed list
    const tm = parseInt(timerMinutesEl.value, 10);
    examSettings.timerMinutes = TIMER_ALLOWED.includes(tm)
      ? tm
      : clamp(tm, TIMER_MIN, TIMER_MAX);

    // PBQ percent
    if (examSettings.pbqPercentMode === "custom") {
      examSettings.pbqPercent = clampPct(parseInt(pbqCustomEl.value, 10));
    } else {
      examSettings.pbqPercent = clampPct(parseInt(pbqPercentEl.value, 10));
    }

    // Build pool (and capture any PBQ shortfall warning)
    const pbqInfo = buildPool();
    seedState();

    // Update scoring note based on attempts mode
    if (scoringNote) {
      if (examSettings.attemptsAllowed === 1) {
        scoringNote.textContent =
          "Scoring (1-chance mode): 1 pt if correct, 0 if wrong. Pass: ~83%.";
      } else {
        scoringNote.textContent =
          "Scoring (2-chance mode): 1 pt first-try · 0.5 second-try · 0 missed. Pass: ~83%.";
      }
    }

    // Update sticky timer-mode pill
    if (tModePill) {
      tModePill.textContent = (examSettings.attemptsAllowed === 1 ? "1-chance" : "2-chance") +
                              " · " + examSettings.timerMinutes + "m";
    }

    // Switch UI
    startScreen.hidden = true;
    examScreen.hidden = false;
    examStarted = true;
    examEnded   = false;

    // Timer reset to chosen value
    timerSeconds   = examSettings.timerMinutes * 60;
    timerRemaining = timerSeconds;
    timerRunning   = false;
    if (timerHandle) { clearInterval(timerHandle); timerHandle = null; }
    tStart.disabled = false;
    tPause.disabled = true;
    if (tReset) tReset.disabled = false;
    renderTimer();

    render();

    // Show shortfall warning at top of exam if applicable
    if (pbqInfo && pbqInfo.warning) {
      showInlineWarning(pbqInfo.warning);
    }

    updateProgress();

    // Auto-start the timer for an exam-like feel
    startTimer();

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function onResetExam() {
    if (examStarted && !confirm("Reset all answers and return to the start screen?")) return;

    if (timerHandle) { clearInterval(timerHandle); timerHandle = null; }
    timerRunning = false;
    examStarted = false;
    examEnded = false;

    for (const k of Object.keys(state)) delete state[k];
    pool = [];

    examScreen.hidden = true;
    startScreen.hidden = false;

    renderMissHistory();
    renderConfigSummary();

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ===================================================================
  // Build pool + seed state
  // ===================================================================

  function buildPool() {
    pool = [];
    let warning = "";

    // PBQs first (selected before regular MCQs per requirement)
    if (examSettings.includePBQs && Array.isArray(window.PBQ_DATA)) {
      const desired = Math.round((examSettings.pbqPercent / 100) * totalTargetQuestions());
      const pbqs = window.PBQ_DATA.slice();
      shuffle(pbqs);
      const take = Math.min(desired, pbqs.length);
      pbqs.slice(0, take).forEach((p) => {
        pool.push({ kind: "pbq", uid: "pbq-" + p.pbqId, q: p });
      });
      if (desired > pbqs.length) {
        warning = "Only " + pbqs.length + " PBQ-tagged question" + (pbqs.length === 1 ? "" : "s") +
                  " available; you requested " + desired + " (" + examSettings.pbqPercent +
                  "% of " + totalTargetQuestions() + "). All available PBQs were included.";
      }
    }

    // MCQs
    let mcqs = (Array.isArray(window.QUIZ_DATA) ? window.QUIZ_DATA : []).slice();
    if (examSettings.poolMode === "random") {
      shuffle(mcqs);
      mcqs = mcqs.slice(0, examSettings.poolSize);
      mcqs.sort((a, b) => a.num - b.num);
    }
    mcqs.forEach((q) => pool.push({ kind: "mcq", uid: "mcq-" + q.num, q: q }));

    return { warning: warning };
  }

  function seedState() {
    pool.forEach((entry) => {
      if (entry.kind === "mcq") {
        state[entry.uid] = {
          kind: "mcq",
          attempts: 0,
          resolved: false,
          score: 0,
          wrongPicks: [],
          pending: new Set()
        };
      } else {
        state[entry.uid] = {
          kind: "pbq",
          attempts: 0,
          resolved: false,
          score: 0,
          picks: {},
          wrongItems: new Set(),
          revealed: false
        };
      }
    });
  }

  // ===================================================================
  // Filtering
  // ===================================================================

  function getFilteredPool() {
    const f = filterEl.value;
    if (f === "all") return pool;
    if (f === "incorrect") {
      return pool.filter((e) => {
        const s = state[e.uid];
        if (!s) return false;
        if (s.resolved && s.score === 0) return true;
        if (e.kind === "mcq" && s.wrongPicks.length > 0) return true;
        if (e.kind === "pbq" && s.wrongItems && s.wrongItems.size > 0) return true;
        return false;
      });
    }
    if (f === "acronym")
      return pool.filter((e) => e.kind === "mcq" && e.q.acronym);
    if (f === "scenario")
      return pool.filter((e) => e.kind === "mcq" && e.q.scenario);
    if (f === "pbq")
      return pool.filter((e) => e.kind === "pbq");
    const dn = parseInt(f, 10);
    if (!isNaN(dn))
      return pool.filter((e) => e.q.domainNum === dn);
    return pool;
  }

  // ===================================================================
  // Render pool
  // ===================================================================

  function render() {
    quizEl.innerHTML = "";
    const visible = getFilteredPool();

    if (visible.length === 0) {
      const empty = document.createElement("div");
      empty.className = "empty";
      empty.textContent = "No questions match this filter.";
      quizEl.appendChild(empty);
      return;
    }

    visible.forEach((entry, idx) => {
      const card = entry.kind === "mcq"
        ? renderMcqCard(entry, idx + 1, visible.length)
        : renderPbqCard(entry, idx + 1, visible.length);
      quizEl.appendChild(card);
    });

    if (allResolved()) renderSummary();
  }

  function showInlineWarning(text) {
    if (!quizEl) return;
    const banner = document.createElement("div");
    banner.className = "warning-banner";
    banner.textContent = "⚠ " + text;
    quizEl.prepend(banner);
  }

  // -------------------------------------------------------------------
  // MCQ rendering
  // -------------------------------------------------------------------

  function renderMcqCard(entry, position, totalVisible) {
    const q = entry.q;
    const s = state[entry.uid];

    const card = document.createElement("section");
    card.className = "card";
    card.id = "card-" + entry.uid;

    const optionLetters = Object.keys(q.options).sort();
    const correctSet = new Set(Array.isArray(q.correct) ? q.correct : [q.correct]);
    const numCorrect = correctSet.size;
    const isMulti = !!q.selectMulti;

    const badges = [];
    if (q.acronym)  badges.push('<span class="badge acronym">Acronym</span>');
    if (q.scenario) badges.push('<span class="badge scenario">Scenario</span>');
    if (isMulti)    badges.push('<span class="badge select">Select ' + numCorrect + '</span>');

    card.innerHTML =
      '<div class="qhead">' +
        '<div class="qnum">Question ' + q.num +
          ' <small style="color:var(--muted);font-weight:400;">(' + position + ' of ' + totalVisible + ' shown)</small></div>' +
        '<div class="qdomain">' + escapeHtml(q.domain) + '</div>' +
      '</div>' +
      (badges.length ? '<div class="badges">' + badges.join("") + '</div>' : "") +
      '<p class="stem">' + escapeHtml(q.stem) + '</p>' +
      '<div class="options" role="' + (isMulti ? "group" : "radiogroup") + '" aria-label="Answer options"></div>' +
      (isMulti
        ? '<div class="submit-row" id="submit-row-' + entry.uid + '">' +
            '<button type="button" class="btn" id="submit-' + entry.uid + '" disabled>Submit Answer</button>' +
            '<span class="hint" id="hint-' + entry.uid + '">Select exactly ' + numCorrect + ' options.</span>' +
          '</div>'
        : "") +
      '<div class="status" id="status-' + entry.uid + '"></div>' +
      '<div class="explanation" id="exp-' + entry.uid + '"></div>';

    const optionsEl = card.querySelector(".options");

    optionLetters.forEach((letter) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option";
      btn.dataset.letter = letter;
      btn.innerHTML = '<span class="letter">' + letter + '</span>' +
                      '<span class="text">' + escapeHtml(q.options[letter]) + '</span>';

      if (s.resolved) {
        btn.disabled = true;
        if (correctSet.has(letter)) btn.classList.add("correct-reveal");
        if (s.wrongPicks.includes(letter) && !correctSet.has(letter)) btn.classList.add("wrong-reveal");
      } else {
        if (s.wrongPicks.includes(letter)) {
          btn.classList.add("wrong-attempt");
          btn.disabled = true;
        }
        if (isMulti && s.pending.has(letter)) {
          btn.classList.add("selected-pending");
        }
      }

      if (isMulti) {
        btn.addEventListener("click", () => handleMultiClick(entry, letter, btn, card));
      } else {
        btn.addEventListener("click", () => handleSingleAnswer(entry, letter, btn, card));
      }
      optionsEl.appendChild(btn);
    });

    if (isMulti && !s.resolved) {
      const submitBtn = card.querySelector("#submit-" + entry.uid);
      submitBtn.addEventListener("click", () => handleMultiSubmit(entry, card));
      updateMultiSubmitState(entry, card);
    }

    if (s.resolved) {
      showExplanation(entry, card, s);
      showStatus(entry, card, s);
    } else if (s.attempts > 0) {
      showStatus(entry, card, s);
    }

    return card;
  }

  // -------------------------------------------------------------------
  // PBQ rendering
  // -------------------------------------------------------------------

  function renderPbqCard(entry, position, totalVisible) {
    const p = entry.q;
    const s = state[entry.uid];

    const card = document.createElement("section");
    card.className = "card";
    card.id = "card-" + entry.uid;

    card.innerHTML =
      '<div class="qhead">' +
        '<div class="qnum">' + escapeHtml(p.title) +
          ' <small style="color:var(--muted);font-weight:400;">(' + position + ' of ' + totalVisible + ' shown)</small></div>' +
        '<div class="qdomain">' + escapeHtml(p.domain) + '</div>' +
      '</div>' +
      '<div class="badges"><span class="badge pbq">PBQ</span></div>' +
      '<p class="pbq-prompt">' + escapeHtml(p.prompt) + '</p>' +
      '<div class="pbq-grid" id="grid-' + entry.uid + '"></div>' +
      '<div class="submit-row" id="submit-row-' + entry.uid + '">' +
        '<button type="button" class="btn" id="submit-' + entry.uid + '" disabled>Submit Matches</button>' +
        '<span class="hint" id="hint-' + entry.uid + '">Make a selection for every item.</span>' +
      '</div>' +
      '<div class="status" id="status-' + entry.uid + '"></div>' +
      '<div class="explanation" id="exp-' + entry.uid + '"></div>';

    const gridEl = card.querySelector("#grid-" + entry.uid);

    p.items.forEach((item) => {
      const row = document.createElement("div");
      row.className = "pbq-row";
      row.dataset.itemId = item.id;

      const sel = document.createElement("select");
      sel.id = "sel-" + entry.uid + "-" + item.id;
      sel.disabled = !!s.resolved;

      const placeholder = document.createElement("option");
      placeholder.value = "";
      placeholder.textContent = "— select category —";
      sel.appendChild(placeholder);

      p.categories.forEach((cat) => {
        const opt = document.createElement("option");
        opt.value = cat;
        opt.textContent = cat;
        sel.appendChild(opt);
      });

      if (s.picks[item.id]) sel.value = s.picks[item.id];

      sel.addEventListener("change", () => {
        if (s.resolved) return;
        s.picks[item.id] = sel.value;
        updatePbqSubmitState(entry, card);
      });

      const itemEl = document.createElement("div");
      itemEl.className = "pbq-item";
      itemEl.textContent = item.label;

      row.appendChild(itemEl);
      row.appendChild(sel);

      if (s.resolved || s.revealed) {
        if (s.picks[item.id] === item.correct) {
          row.classList.add("correct");
        } else {
          row.classList.add("wrong");
        }
        const fb = document.createElement("div");
        fb.className = "pbq-feedback";
        if (s.picks[item.id] === item.correct) {
          fb.textContent = "✓ Correct: " + item.correct;
        } else {
          fb.textContent = (s.picks[item.id] ? "✗ You picked “" + s.picks[item.id] + "”. " : "✗ Not answered. ") +
                           "Correct answer: " + item.correct;
        }
        row.appendChild(fb);
      } else if (s.wrongItems && s.wrongItems.has(item.id)) {
        row.classList.add("wrong");
      }

      gridEl.appendChild(row);
    });

    if (!s.resolved) {
      const submitBtn = card.querySelector("#submit-" + entry.uid);
      submitBtn.addEventListener("click", () => handlePbqSubmit(entry, card));
      updatePbqSubmitState(entry, card);
    } else {
      const submitRow = card.querySelector("#submit-row-" + entry.uid);
      if (submitRow) submitRow.style.display = "none";
    }

    if (s.resolved) {
      showPbqExplanation(entry, card, s);
      showStatus(entry, card, s);
    } else if (s.attempts > 0) {
      showStatus(entry, card, s);
    }

    return card;
  }

  // ===================================================================
  // MCQ — single-answer handling
  // ===================================================================

  function handleSingleAnswer(entry, letter, btn, card) {
    const q = entry.q;
    const s = state[entry.uid];
    if (s.resolved || examEnded) return;
    const correct = q.correct;

    if (letter === correct) {
      s.resolved = true;
      s.score = s.attempts === 0 ? 1 : 0.5;
      s.lastPick = letter;
      btn.classList.add("correct-reveal");
      lockAllOptions(card, q, s);
      showExplanation(entry, card, s);
      showStatus(entry, card, s);
    } else {
      s.attempts += 1;
      s.lastPick = letter;
      if (!s.wrongPicks.includes(letter)) s.wrongPicks.push(letter);
      btn.classList.add("wrong-attempt");
      btn.disabled = true;

      if (s.attempts >= examSettings.attemptsAllowed) {
        s.resolved = true;
        s.score = 0;
        const correctBtn = card.querySelector('.option[data-letter="' + correct + '"]');
        if (correctBtn) correctBtn.classList.add("correct-reveal");
        lockAllOptions(card, q, s);
        showExplanation(entry, card, s);
        recordMiss(entry, s);
      }
      showStatus(entry, card, s);
    }

    updateProgress();
    if (s.resolved && allResolved()) finishExam();
  }

  // ===================================================================
  // MCQ — multi-select handling
  // ===================================================================

  function handleMultiClick(entry, letter, btn, card) {
    const s = state[entry.uid];
    if (s.resolved || examEnded) return;
    if (s.wrongPicks.includes(letter)) return;

    if (s.pending.has(letter)) {
      s.pending.delete(letter);
      btn.classList.remove("selected-pending");
    } else {
      s.pending.add(letter);
      btn.classList.add("selected-pending");
    }
    updateMultiSubmitState(entry, card);
  }

  function handleMultiSubmit(entry, card) {
    const q = entry.q;
    const s = state[entry.uid];
    if (s.resolved || examEnded) return;

    const correctSet = new Set(q.correct);
    const numNeeded = correctSet.size;
    if (s.pending.size !== numNeeded) return;

    const picked = Array.from(s.pending);
    const allCorrect = picked.every((l) => correctSet.has(l)) && picked.length === numNeeded;

    s.lastPick = picked.slice();

    if (allCorrect) {
      s.resolved = true;
      s.score = s.attempts === 0 ? 1 : 0.5;
      picked.forEach((l) => {
        const b = card.querySelector('.option[data-letter="' + l + '"]');
        if (b) {
          b.classList.remove("selected-pending");
          b.classList.add("correct-reveal");
        }
      });
      lockAllOptions(card, q, s);
      hideMultiSubmit(card, entry);
      showExplanation(entry, card, s);
      showStatus(entry, card, s);
    } else {
      s.attempts += 1;
      picked.forEach((l) => {
        if (!correctSet.has(l) && !s.wrongPicks.includes(l)) {
          s.wrongPicks.push(l);
          const b = card.querySelector('.option[data-letter="' + l + '"]');
          if (b) {
            b.classList.remove("selected-pending");
            b.classList.add("wrong-attempt");
            b.disabled = true;
          }
        } else if (correctSet.has(l)) {
          const b = card.querySelector('.option[data-letter="' + l + '"]');
          if (b) b.classList.remove("selected-pending");
        }
      });
      s.pending.clear();

      if (s.attempts >= examSettings.attemptsAllowed) {
        s.resolved = true;
        s.score = 0;
        correctSet.forEach((l) => {
          const b = card.querySelector('.option[data-letter="' + l + '"]');
          if (b) b.classList.add("correct-reveal");
        });
        lockAllOptions(card, q, s);
        hideMultiSubmit(card, entry);
        showExplanation(entry, card, s);
        recordMiss(entry, s);
      } else {
        updateMultiSubmitState(entry, card);
      }
      showStatus(entry, card, s);
    }

    updateProgress();
    if (s.resolved && allResolved()) finishExam();
  }

  function updateMultiSubmitState(entry, card) {
    const q = entry.q;
    const s = state[entry.uid];
    const submitBtn = card.querySelector("#submit-" + entry.uid);
    const hintEl = card.querySelector("#hint-" + entry.uid);
    if (!submitBtn || !hintEl) return;
    const need = (Array.isArray(q.correct) ? q.correct.length : 1);
    const have = s.pending.size;
    submitBtn.disabled = have !== need;
    if (have === 0)         hintEl.textContent = "Select exactly " + need + " options.";
    else if (have < need)   hintEl.textContent = "Select " + (need - have) + " more.";
    else if (have === need) hintEl.textContent = "Ready — click Submit.";
    else                    hintEl.textContent = "Too many selected (max " + need + ").";
  }

  function hideMultiSubmit(card, entry) {
    const row = card.querySelector("#submit-row-" + entry.uid);
    if (row) row.style.display = "none";
  }

  // ===================================================================
  // PBQ — submit handling
  // ===================================================================

  function updatePbqSubmitState(entry, card) {
    const p = entry.q;
    const s = state[entry.uid];
    const submitBtn = card.querySelector("#submit-" + entry.uid);
    const hintEl = card.querySelector("#hint-" + entry.uid);
    if (!submitBtn || !hintEl) return;

    const need = p.items.length;
    const have = p.items.filter((it) => s.picks[it.id]).length;
    submitBtn.disabled = have !== need;
    if (have === 0)        hintEl.textContent = "Make a selection for every item (" + need + ").";
    else if (have < need)  hintEl.textContent = (need - have) + " item" + (need - have === 1 ? "" : "s") + " still need a selection.";
    else                   hintEl.textContent = "Ready — click Submit.";
  }

  function handlePbqSubmit(entry, card) {
    const p = entry.q;
    const s = state[entry.uid];
    if (s.resolved || examEnded) return;

    let correctCount = 0;
    s.wrongItems = new Set();
    p.items.forEach((it) => {
      if (s.picks[it.id] === it.correct) correctCount += 1;
      else s.wrongItems.add(it.id);
    });

    const allCorrect = correctCount === p.items.length;

    if (allCorrect) {
      s.resolved = true;
      s.score = s.attempts === 0 ? 1 : 0.5;
      s.revealed = true;
    } else {
      s.attempts += 1;
      if (s.attempts >= examSettings.attemptsAllowed) {
        s.resolved = true;
        s.score = 0;
        s.revealed = true;
        recordMiss(entry, s);
      }
    }

    const fresh = renderPbqCard(entry, indexOfEntry(entry) + 1, getFilteredPool().length);
    card.replaceWith(fresh);

    if (s.resolved) {
      showPbqExplanation(entry, fresh, s);
      showStatus(entry, fresh, s);
    } else {
      showStatus(entry, fresh, s);
    }

    updateProgress();
    if (s.resolved && allResolved()) finishExam();
  }

  function indexOfEntry(entry) {
    const visible = getFilteredPool();
    return visible.findIndex((e) => e.uid === entry.uid);
  }

  // ===================================================================
  // Shared helpers
  // ===================================================================

  function lockAllOptions(card, q, s) {
    const correctSet = new Set(Array.isArray(q.correct) ? q.correct : [q.correct]);
    card.querySelectorAll(".option").forEach((b) => {
      b.disabled = true;
      const letter = b.dataset.letter;
      if (s.wrongPicks.includes(letter) && !correctSet.has(letter)) {
        b.classList.remove("wrong-attempt");
        b.classList.add("wrong-reveal");
      }
    });
  }

  function showStatus(entry, card, s) {
    const el = card.querySelector("#status-" + entry.uid);
    if (!el) return;
    el.className = "status";
    if (!s.resolved) {
      const remaining = examSettings.attemptsAllowed - s.attempts;
      el.classList.add("try-again");
      el.textContent = "Not quite. " + remaining + " attempt" + (remaining === 1 ? "" : "s") + " remaining.";
    } else if (s.score === 1) {
      el.classList.add("solved");
      el.textContent = examSettings.attemptsAllowed === 1
        ? "Correct — full credit."
        : "Correct on the first try — full credit.";
    } else if (s.score === 0.5) {
      el.classList.add("solved");
      el.textContent = "Correct on the second try — half credit.";
    } else {
      el.classList.add("revealed");
      el.textContent = examSettings.attemptsAllowed === 1
        ? "Wrong — 1-chance mode resolves immediately."
        : "Out of attempts. Correct answer revealed.";
    }
  }

  function showExplanation(entry, card, s) {
    const q = entry.q;
    const el = card.querySelector("#exp-" + entry.uid);
    if (!el) return;

    const correctLetters = Array.isArray(q.correct) ? q.correct : [q.correct];
    const correctSummary = correctLetters
      .map((l) => "<strong>" + l + "</strong> — " + escapeHtml(q.options[l]))
      .join("<br>");

    let wrongHintHtml = "";
    if (q.wrongHint && q.wrongHint.letter) {
      wrongHintHtml =
        '<div class="wrong-list">' +
        '<h4>Most tempting wrong answer (' + q.wrongHint.letter + ')</h4>' +
        '<p>' + escapeHtml(q.wrongHint.text) + '</p>' +
        '</div>';
    }

    el.innerHTML =
      '<h4>Correct Answer</h4>' +
      '<p>' + correctSummary + '</p>' +
      '<p style="margin-top:8px;">' + escapeHtml(q.explanation) + '</p>' +
      wrongHintHtml;
    el.classList.add("visible");
  }

  function showPbqExplanation(entry, card, s) {
    const p = entry.q;
    const el = card.querySelector("#exp-" + entry.uid);
    if (!el) return;
    const correctCount = p.items.filter((it) => s.picks[it.id] === it.correct).length;
    el.innerHTML =
      '<h4>PBQ Result</h4>' +
      '<p><strong>' + correctCount + ' of ' + p.items.length + '</strong> matches correct on this attempt.</p>' +
      '<p style="margin-top:8px;">' + escapeHtml(p.explanation) + '</p>';
    el.classList.add("visible");
  }

  function updateProgress() {
    const total = pool.length;
    const resolvedCount = pool.filter((e) => state[e.uid] && state[e.uid].resolved).length;
    const pct = total === 0 ? 0 : Math.round((resolvedCount / total) * 100);
    progressText.textContent = resolvedCount + " / " + total + " answered";
    progressFill.style.width = pct + "%";
    const score = pool.reduce((a, e) => {
      const s = state[e.uid];
      return a + (s && s.resolved ? s.score : 0);
    }, 0);
    scorePill.textContent = "Score: " + formatScore(score) + " / " + total;
  }

  function allResolved() {
    if (pool.length === 0) return false;
    return pool.every((e) => state[e.uid] && state[e.uid].resolved);
  }

  // ===================================================================
  // Finish + summary + completion banner
  // ===================================================================

  function finishExam() {
    if (examEnded) return;
    examEnded = true;
    if (timerHandle) { clearInterval(timerHandle); timerHandle = null; }
    timerRunning = false;
    tStart.disabled = true;
    tPause.disabled = true;
    renderSummary();
  }

  function computeFinalScore() {
    const total = pool.length;
    const score = pool.reduce((a, e) => a + (state[e.uid] ? state[e.uid].score : 0), 0);
    const firstTry  = pool.filter((e) => state[e.uid] && state[e.uid].score === 1).length;
    const secondTry = pool.filter((e) => state[e.uid] && state[e.uid].score === 0.5).length;
    const missed    = pool.filter((e) => state[e.uid] && state[e.uid].resolved && state[e.uid].score === 0).length;
    const pct = total === 0 ? 0 : Math.round((score / total) * 100);
    return { total, score, pct, firstTry, secondTry, missed, passed: pct >= 83 };
  }

  function renderSummary() {
    const r = computeFinalScore();

    const byDomain = {};
    pool.forEach((e) => {
      const dn = e.q.domainNum;
      if (!byDomain[dn]) byDomain[dn] = { total: 0, score: 0 };
      byDomain[dn].total += 1;
      byDomain[dn].score += state[e.uid] ? state[e.uid].score : 0;
    });

    const domainCells = Object.keys(byDomain).sort().map((dn) => {
      const d = byDomain[dn];
      const dPct = Math.round((d.score / d.total) * 100);
      const cls = dPct >= 83 ? "" : (dPct >= 60 ? "mid" : "weak");
      return '<div class="domain-cell ' + cls + '">' +
        '<div class="label">' + (DOMAIN_NAMES[dn] || ("Domain " + dn)) + '</div>' +
        '<div class="value">' + formatScore(d.score) + ' / ' + d.total +
          ' <small style="color:var(--muted);font-weight:400;">(' + dPct + '%)</small></div>' +
        '<div class="domain-bar" style="width:' + dPct + '%;"></div>' +
        '</div>';
    }).join("");

    const verdictText = r.passed ? "PASS" : "BELOW PASS THRESHOLD";
    const secondTryLine = examSettings.attemptsAllowed === 2
      ? r.secondTry + " second-try correct &middot; "
      : "";

    // Completion banner (top of summary)
    const banner = document.createElement("section");
    banner.className = "completion-banner " + (r.passed ? "pass" : "fail");
    banner.id = "completionBanner";
    banner.innerHTML =
      '<h2>Exam Complete</h2>' +
      '<div class="verdict">' + verdictText + '</div>' +
      '<div class="big-score">' + formatScore(r.score) + ' / ' + r.total + ' &nbsp;(' + r.pct + '%)</div>' +
      '<div class="meta">' +
        'Mode: <strong>' + (examSettings.attemptsAllowed === 1 ? "1 chance" : "2 chances") + '</strong>' +
        ' &middot; Timer: <strong>' + examSettings.timerMinutes + ' min</strong>' +
        ' &middot; PBQs: <strong>' + (examSettings.includePBQs ? (examSettings.pbqPercent + "%") : "off") + '</strong>' +
        ' &middot; Pass threshold: 83%' +
      '</div>' +
      '<p class="meta">' +
        r.firstTry + ' first-try correct &middot; ' +
        secondTryLine +
        r.missed + ' missed' +
      '</p>' +
      '<div class="actions">' +
        '<button class="btn" id="bannerExportFailLog" type="button">Export Fail Log (.txt)</button>' +
        '<button class="btn ghost" id="bannerExportJson" type="button">Export Miss Log (.json)</button>' +
        '<button class="btn ghost" id="bannerReviewMissed" type="button">Review missed only</button>' +
      '</div>';

    // Per-domain summary
    const summary = document.createElement("section");
    summary.className = "summary";
    summary.id = "summary";
    summary.innerHTML =
      '<h2>Per-Domain Breakdown</h2>' +
      '<p class="sub">' +
        r.firstTry + ' first-try correct &middot; ' +
        secondTryLine +
        r.missed + ' missed' +
      '</p>' +
      '<div class="domain-grid">' + domainCells + '</div>' +
      '<p class="sub" style="margin-top:14px;">' +
        'Weak-area history (this exam + prior sessions) is saved automatically.' +
      '</p>';

    const existingBanner = document.getElementById("completionBanner");
    if (existingBanner) existingBanner.remove();
    const existingSummary = document.getElementById("summary");
    if (existingSummary) existingSummary.remove();

    quizEl.prepend(summary);
    quizEl.prepend(banner);

    banner.querySelector("#bannerExportFailLog").addEventListener("click", () => exportMissesAs("log"));
    banner.querySelector("#bannerExportJson").addEventListener("click", () => exportMissesAs("json"));
    banner.querySelector("#bannerReviewMissed").addEventListener("click", () => {
      filterEl.value = "incorrect";
      render();
      window.scrollTo({ top: quizEl.offsetTop - 120, behavior: "smooth" });
    });

    banner.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // ===================================================================
  // Timer
  // ===================================================================

  function startTimer() {
    if (timerRunning || examEnded) return;
    timerRunning = true;
    tStart.disabled = true;
    tPause.disabled = false;
    timerHandle = setInterval(() => {
      if (timerRemaining > 0) {
        timerRemaining -= 1;
        renderTimer();
      } else {
        clearInterval(timerHandle);
        timerHandle = null;
        timerRunning = false;
        tStart.disabled = true;
        tPause.disabled = true;
        renderTimer();
        onTimeExpired();
      }
    }, 1000);
  }

  function pauseTimer() {
    if (!timerRunning) return;
    clearInterval(timerHandle);
    timerHandle = null;
    timerRunning = false;
    tStart.disabled = false;
    tPause.disabled = true;
  }

  function renderTimer() {
    const m = Math.floor(timerRemaining / 60);
    const s = timerRemaining % 60;
    tDisplay.textContent =
      String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
    tDisplay.classList.remove("warning", "expired");
    if (timerRemaining === 0)        tDisplay.classList.add("expired");
    else if (timerRemaining <= 600)  tDisplay.classList.add("warning");
  }

  function onTimeExpired() {
    if (examEnded) return;
    examEnded = true;
    showToast("Time's up! Auto-grading remaining questions.");
    pool.forEach((e) => {
      const s = state[e.uid];
      if (!s || s.resolved) return;
      s.resolved = true;
      s.score = 0;
      if (e.kind === "pbq") s.revealed = true;
      recordMiss(e, s);
    });
    render();
    updateProgress();
    renderSummary();
  }

  // ===================================================================
  // Persistent miss log (localStorage)
  // ===================================================================

  function loadMisses() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) {
      return [];
    }
  }

  function saveMisses(arr) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
    } catch (_) {
      /* localStorage unavailable / full — silently no-op */
    }
  }

  function recordMiss(entry, s) {
    const list = loadMisses();
    const date = new Date().toISOString();
    const examModeLabel = examSettings.attemptsAllowed === 1 ? "1-chance" : "2-chance";

    if (entry.kind === "mcq") {
      const q = entry.q;
      const correctLetters = Array.isArray(q.correct) ? q.correct : [q.correct];
      const correctTexts = correctLetters.map((l) => l + ") " + (q.options[l] || ""));
      const userPickList = Array.isArray(s.lastPick) ? s.lastPick : (s.lastPick ? [s.lastPick] : (s.wrongPicks || []));
      const userPickTexts = userPickList.map((l) => l + ") " + (q.options[l] || ""));
      list.push({
        date: date,
        kind: "mcq",
        pbq: false,
        num: q.num,
        domain: q.domain,
        domainNum: q.domainNum,
        stem: q.stem,
        correct: correctLetters,
        correctText: correctTexts,
        userPicks: userPickList,
        userPickText: userPickTexts,
        explanation: q.explanation || "",
        attempts: s.attempts,
        examMode: examModeLabel,
        timerMinutes: examSettings.timerMinutes
      });
    } else {
      const p = entry.q;
      const wrongList = p.items
        .filter((it) => s.picks[it.id] !== it.correct)
        .map((it) => ({ item: it.label, correct: it.correct, userPick: s.picks[it.id] || "(none)" }));
      list.push({
        date: date,
        kind: "pbq",
        pbq: true,
        pbqId: p.pbqId,
        title: p.title,
        domain: p.domain,
        domainNum: p.domainNum,
        prompt: p.prompt,
        wrongMatches: wrongList,
        explanation: p.explanation || "",
        attempts: s.attempts,
        examMode: examModeLabel,
        timerMinutes: examSettings.timerMinutes
      });
    }
    saveMisses(list);
  }

  function clearMisses() {
    if (!confirm("Permanently clear ALL stored miss history? This cannot be undone.")) return;
    saveMisses([]);
    renderMissHistory();
  }

  // ===================================================================
  // Export — Fail.log/.txt and JSON
  // ===================================================================

  function exportMissesAs(format) {
    const data = loadMisses();
    if (data.length === 0) {
      alert("No mistakes recorded yet — nothing to export.");
      return;
    }
    const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    let blob, filename;
    if (format === "json") {
      blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      filename = "sy0701-miss-log-" + stamp + ".json";
    } else {
      blob = new Blob([formatFailLogText(data)], { type: "text/plain" });
      filename = "fail-log-" + stamp + ".txt";
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(url);
      a.remove();
    }, 0);
  }

  function formatFailLogText(data) {
    const lines = [];
    lines.push("# CompTIA SY0-701 Practice Exam — Fail Log");
    lines.push("# Generated: " + new Date().toISOString());
    lines.push("# Records: " + data.length);
    lines.push("");

    data.forEach((m, i) => {
      const sep = "----------------------------------------------------------------------";
      lines.push(sep);
      lines.push("Record #" + (i + 1));
      lines.push("Timestamp:     " + m.date);
      lines.push("Exam Mode:     " + (m.examMode || "—"));
      lines.push("Timer Setting: " + (m.timerMinutes != null ? (m.timerMinutes + " min") : "—"));
      lines.push("Domain:        " + (m.domain || "—"));
      if (m.kind === "mcq") {
        lines.push("Question #:    " + (m.num != null ? m.num : "—"));
        lines.push("Stem:          " + collapseWs(m.stem));
        const sel = (m.userPickText && m.userPickText.length)
          ? m.userPickText.join(" | ")
          : ((m.userPicks || []).join(", ") || "(none)");
        const cor = (m.correctText && m.correctText.length)
          ? m.correctText.join(" | ")
          : ((m.correct || []).join(", "));
        lines.push("Selected:      " + sel);
        lines.push("Correct:       " + cor);
        lines.push("Attempts Used: " + (m.attempts != null ? m.attempts : "—"));
        lines.push("Explanation:   " + collapseWs(m.explanation || "(none)"));
      } else {
        lines.push("PBQ:           " + (m.title || m.pbqId));
        lines.push("Prompt:        " + collapseWs(m.prompt));
        if (Array.isArray(m.wrongMatches) && m.wrongMatches.length) {
          lines.push("Wrong Matches:");
          m.wrongMatches.forEach((w) => {
            lines.push("  - " + w.item + "  →  picked: " + (w.userPick || "(none)") + "  | correct: " + w.correct);
          });
        }
        lines.push("Attempts Used: " + (m.attempts != null ? m.attempts : "—"));
        lines.push("Explanation:   " + collapseWs(m.explanation || "(none)"));
      }
      lines.push("");
    });

    return lines.join("\n");
  }

  function collapseWs(s) {
    return String(s || "").replace(/\s+/g, " ").trim();
  }

  // ===================================================================
  // History panel on start screen
  // ===================================================================

  function toggleHistory() {
    if (missHistory.hidden) {
      missHistory.hidden = false;
      viewHistoryBtn.textContent = "Hide Past Mistakes";
    } else {
      missHistory.hidden = true;
      viewHistoryBtn.textContent = "View Past Mistakes";
    }
    renderMissHistory();
  }

  function renderMissHistory() {
    if (!missHistoryBody) return;
    const data = loadMisses();
    if (data.length === 0) {
      missHistoryBody.innerHTML =
        '<p class="muted-tiny" style="margin:0;">No mistakes recorded yet. After your first miss, it’ll show up here so you can target weak areas.</p>';
      return;
    }

    const byDomain = {};
    data.forEach((m) => {
      const dn = m.domainNum;
      if (!byDomain[dn]) byDomain[dn] = 0;
      byDomain[dn] += 1;
    });
    const totalMisses = data.length;
    const maxByDomain = Math.max(1, ...Object.values(byDomain));

    const domainCellsHtml = Object.keys(byDomain).sort().map((dn) => {
      const count = byDomain[dn];
      const widthPct = Math.round((count / maxByDomain) * 100);
      return '<div class="weak-domain-cell">' +
        '<div class="label">' + (DOMAIN_NAMES[dn] || ("Domain " + dn)) + '</div>' +
        '<div class="value">' + count + ' miss' + (count === 1 ? "" : "es") + '</div>' +
        '<div class="weak-bar" style="width:' + widthPct + '%;"></div>' +
        '</div>';
    }).join("");

    const recent = data.slice(-10).reverse();
    const recentHtml = recent.map((m) => {
      const when = new Date(m.date).toLocaleString();
      if (m.kind === "mcq") {
        return '<div class="miss-row">' +
          '<div class="miss-meta">' + when + ' &middot; ' + escapeHtml(m.domain) + ' &middot; Q' + m.num + '</div>' +
          '<p class="miss-stem">' + escapeHtml(truncate(m.stem, 180)) + '</p>' +
          '<div class="miss-meta">Correct: <strong>' + (Array.isArray(m.correct) ? m.correct.join(", ") : m.correct) +
          '</strong> &middot; You picked: <strong>' + ((m.userPicks || []).join(", ") || "—") + '</strong></div>' +
          '</div>';
      } else {
        const wrongs = (m.wrongMatches || []).slice(0, 3)
          .map((w) => escapeHtml(w.item) + ' → expected <strong>' + escapeHtml(w.correct) + '</strong>')
          .join("; ");
        const more = (m.wrongMatches || []).length > 3 ? ' (+' + (m.wrongMatches.length - 3) + ' more)' : "";
        return '<div class="miss-row">' +
          '<div class="miss-meta">' + when + ' &middot; ' + escapeHtml(m.domain) + ' &middot; PBQ</div>' +
          '<p class="miss-stem"><strong>' + escapeHtml(m.title) + '</strong> — ' + escapeHtml(truncate(m.prompt, 140)) + '</p>' +
          '<div class="miss-meta">' + wrongs + more + '</div>' +
          '</div>';
      }
    }).join("");

    missHistoryBody.innerHTML =
      '<p class="muted-tiny" style="margin:0 0 8px;">' +
        totalMisses + ' total miss' + (totalMisses === 1 ? "" : "es") +
        ' recorded across all sessions. Use this to spot weak domains.' +
      '</p>' +
      '<div class="weak-domain-grid">' + domainCellsHtml + '</div>' +
      '<h4 style="margin:14px 0 6px;font-size:0.95rem;color:var(--accent);">Recent misses (last 10)</h4>' +
      '<div class="miss-list">' + recentHtml + '</div>';
  }

  // ===================================================================
  // Utils
  // ===================================================================

  function showToast(msg) {
    const t = document.createElement("div");
    t.className = "toast";
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 4000);
  }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    }
    return arr;
  }

  function clamp(n, lo, hi) {
    if (isNaN(n)) return lo;
    return Math.max(lo, Math.min(hi, n));
  }

  function formatScore(n) {
    return (Math.round(n * 10) / 10).toString();
  }

  function truncate(s, n) {
    s = String(s || "");
    return s.length > n ? s.slice(0, n - 1) + "…" : s;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  // Boot — Dynamic_Options() is shown on init; the exam timer starts when
  // the user clicks Start Exam.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
