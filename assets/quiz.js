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

  // Exam size — the "All MCQs" pool mode produces a 90-question exam (matching
  // the real SY0-701 length) drawn from whatever questions are in QUIZ_DATA.
  // The pool can grow beyond 90 to add variety; the exam length stays 90.
  const EXAM_TOTAL_DEFAULT = 90;
  // Upper bound for the "Random subset" size input — capped by what's
  // actually available in the pool.
  const POOL_MAX = 200;

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
    untimed:         false,    // when true, no timer + no pause-lockout
    includePBQs:     true,     // mirror of pbqMode
    pbqMode:         "on",     // "on" | "off"
    pbqPercent:      10,       // 0/10/20/30 or custom value
    pbqPercentMode:  "10",     // dropdown value: "0"|"10"|"20"|"30"|"custom"
    pbqCustomPercent: 10,      // last typed custom %
    poolMode:        "all",    // "all" | "random"
    poolSize:        30,       // when poolMode === "random"
    domainFilter:    "all"     // "all" | "1"|"2"|"3"|"4"|"5" | "acronym" | "scenario" | "pbq"
  };

  // Quick-preset definitions used by the start-screen preset buttons.
  // Each preset is a partial examSettings object that gets merged on click.
  const PRESETS = {
    "full": {
      label: "Full Exam",
      attemptsAllowed: 2, timerMinutes: 90, untimed: false,
      pbqMode: "on", pbqPercent: 10, pbqPercentMode: "10",
      poolMode: "all", domainFilter: "all"
    },
    "quick": {
      label: "Quick Drill",
      attemptsAllowed: 2, timerMinutes: 30, untimed: false,
      pbqMode: "off", pbqPercent: 0, pbqPercentMode: "0",
      poolMode: "random", poolSize: 30, domainFilter: "all"
    },
    "pbq-only": {
      label: "All PBQs",
      attemptsAllowed: 2, timerMinutes: 30, untimed: true,
      pbqMode: "off", pbqPercent: 0, pbqPercentMode: "0",
      poolMode: "all", domainFilter: "pbq"
    },
    "acronyms": {
      label: "Acronyms Drill",
      attemptsAllowed: 2, timerMinutes: 30, untimed: false,
      pbqMode: "off", pbqPercent: 0, pbqPercentMode: "0",
      poolMode: "all", domainFilter: "acronym"
    },
    "scenarios": {
      label: "Scenarios Drill",
      attemptsAllowed: 2, timerMinutes: 30, untimed: false,
      pbqMode: "off", pbqPercent: 0, pbqPercentMode: "0",
      poolMode: "all", domainFilter: "scenario"
    },
    "realistic": {
      label: "Realistic 1-Chance",
      attemptsAllowed: 1, timerMinutes: 90, untimed: false,
      pbqMode: "on", pbqPercent: 10, pbqPercentMode: "10",
      poolMode: "all", domainFilter: "all"
    },
    "weak": {
      label: "Practice Weak Areas",
      attemptsAllowed: 2, timerMinutes: 30, untimed: false,
      pbqMode: "off", pbqPercent: 0, pbqPercentMode: "0",
      poolMode: "random", poolSize: 30, domainFilter: "weak"
    },
    "reset": {
      label: "Reset to Defaults",
      attemptsAllowed: 2, timerMinutes: 90, untimed: false,
      pbqMode: "on", pbqPercent: 10, pbqPercentMode: "10",
      poolMode: "all", poolSize: 30, domainFilter: "all"
    }
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
  const startDomainFilterEl = $("startDomainFilter");
  const domainInfoEl    = $("domainInfo");
  const poolSizeRow     = $("poolSizeRow");
  const poolSizeEl      = $("poolSize");
  const poolModeOptions = $("poolModeOptions");
  const poolModeInfo    = $("poolModeInfo");
  const poolModeInfoText = $("poolModeInfoText");
  const configSummary   = $("configSummary");
  const presetRow       = $("presetRow");
  const untimedEl       = $("untimedMode");
  const reviewFailLogBtn = $("reviewFailLogBtn");

  // Review screen
  const reviewScreen        = $("reviewScreen");
  const reviewCard          = $("reviewCard");
  const reviewSub           = $("reviewSub");
  const reviewCounter       = $("reviewCounter");
  const reviewDomainFilter  = $("reviewDomainFilter");
  const reviewPrevBtn       = $("reviewPrevBtn");
  const reviewNextBtn       = $("reviewNextBtn");
  const reviewCloseBtn      = $("reviewCloseBtn");

  // Exam screen
  const examScreen   = $("examScreen");
  const quizEl       = $("quiz");
  const progressText = $("progressText");
  const progressFill = $("progressFill");
  const scorePill    = $("scorePill");
  const resetBtn     = $("resetBtn");
  const failLogBtn   = $("exportFailLogBtn");
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

  // Review-screen state
  let reviewItems = [];     // filtered subset of loadMisses()
  let reviewIndex = 0;      // current item

  // ===================================================================
  // Boot
  // ===================================================================

  function init() {
    const maxPbqs = pbqDataLength();
    if (pbqMaxNote) pbqMaxNote.textContent = "/ " + maxPbqs + " PBQs available";

    // Initialize pool size max based on domain filter
    updatePoolSizeMax();

    document.querySelectorAll('input[name="poolMode"]').forEach((r) => {
      r.addEventListener("change", () => {
        examSettings.poolMode = pickedValue("poolMode");
        if (poolSizeRow) {
          poolSizeRow.style.display = examSettings.poolMode === "random" ? "flex" : "none";
        }
        examSettings.poolSize = parseInt(poolSizeEl.value, 10) || 30;
        renderConfigSummary();
      });
    });
    if (poolSizeEl) {
      poolSizeEl.addEventListener("change", () => {
        examSettings.poolSize = parseInt(poolSizeEl.value, 10) || 30;
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

    // Domain filter (start screen)
    if (startDomainFilterEl) {
      startDomainFilterEl.addEventListener("change", () => {
        examSettings.domainFilter = startDomainFilterEl.value;
        updatePoolSizeMax();
        renderConfigSummary();
      });
    }

    // Untimed / Study-mode toggle
    if (untimedEl) {
      untimedEl.addEventListener("change", () => {
        examSettings.untimed = !!untimedEl.checked;
        updateUntimedUi();
        renderConfigSummary();
      });
    }

    // Quick-preset buttons
    if (presetRow) {
      presetRow.addEventListener("click", (e) => {
        const btn = e.target.closest("button[data-preset]");
        if (!btn) return;
        applyPreset(btn.dataset.preset);
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

    // Pre-render history preview + initial form sync
    renderMissHistory();
    applyPbqRowsVisibility();
    renderTimerLabel();
    updateUntimedUi();
    renderConfigSummary();

    // Review-screen wiring
    if (reviewFailLogBtn) reviewFailLogBtn.addEventListener("click", () => openReview());
    if (reviewCloseBtn)   reviewCloseBtn.addEventListener("click", closeReview);
    if (reviewPrevBtn)    reviewPrevBtn.addEventListener("click", () => navReview(-1));
    if (reviewNextBtn)    reviewNextBtn.addEventListener("click", () => navReview(+1));
    if (reviewDomainFilter) {
      reviewDomainFilter.addEventListener("change", () => {
        applyReviewFilter(reviewDomainFilter.value);
      });
    }

    // Exam-screen wiring
    resetBtn.addEventListener("click", onResetExam);
    if (failLogBtn) failLogBtn.addEventListener("click", () => exportMissesAs("log"));

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

  // Apply a quick preset by name (see PRESETS). Updates examSettings and
  // syncs the form controls so the user sees the new values immediately.
  function applyPreset(name) {
    const preset = PRESETS[name];
    if (!preset) return;
    Object.assign(examSettings, preset);
    examSettings.includePBQs = examSettings.pbqMode === "on";
    syncFormFromSettings();
    updatePoolSizeMax();
    updateUntimedUi();
    applyPbqRowsVisibility();
    renderTimerLabel();
    renderConfigSummary();
    flashPresetApplied(name);
  }

  function syncFormFromSettings() {
    // Radios: attemptsMode, pbqMode, poolMode
    document.querySelectorAll('input[name="attemptsMode"]').forEach((r) => {
      r.checked = (parseInt(r.value, 10) === examSettings.attemptsAllowed);
    });
    document.querySelectorAll('input[name="pbqMode"]').forEach((r) => {
      r.checked = (r.value === examSettings.pbqMode);
    });
    document.querySelectorAll('input[name="poolMode"]').forEach((r) => {
      r.checked = (r.value === examSettings.poolMode);
    });
    // Selects: timer, pbqPercent, domainFilter, poolSize
    if (timerMinutesEl) timerMinutesEl.value = String(examSettings.timerMinutes);
    if (pbqPercentEl)   pbqPercentEl.value   = String(examSettings.pbqPercentMode);
    if (startDomainFilterEl) startDomainFilterEl.value = String(examSettings.domainFilter);
    if (poolSizeEl)     poolSizeEl.value     = String(examSettings.poolSize);
    if (pbqCustomEl)    pbqCustomEl.value    = String(examSettings.pbqCustomPercent);
    // Checkbox: untimed
    if (untimedEl)      untimedEl.checked    = !!examSettings.untimed;
    // Pool size row visibility
    if (poolSizeRow) {
      poolSizeRow.style.display = examSettings.poolMode === "random" ? "flex" : "none";
    }
  }

  function flashPresetApplied(name) {
    if (!presetRow) return;
    presetRow.querySelectorAll(".btn-preset").forEach((b) => {
      b.classList.toggle("active", b.dataset.preset === name);
    });
    setTimeout(() => {
      presetRow.querySelectorAll(".btn-preset.active").forEach((b) => b.classList.remove("active"));
    }, 1200);
  }

  function updateUntimedUi() {
    // When untimed is on, dim the timer-minutes select since it has no effect.
    if (timerMinutesEl) {
      timerMinutesEl.disabled = !!examSettings.untimed;
    }
  }

  function clampPct(n) {
    if (isNaN(n)) return 0;
    return Math.max(0, Math.min(100, n));
  }

  function countAvailableQuestions(domainVal) {
    const mcqsAll = Array.isArray(window.QUIZ_DATA) ? window.QUIZ_DATA : [];
    const pbqsAll = Array.isArray(window.PBQ_DATA) ? window.PBQ_DATA : [];

    if (domainVal === "all") {
      return mcqsAll.length + pbqsAll.length;
    }
    if (domainVal === "pbq") {
      return pbqsAll.length;
    }
    if (domainVal === "weak") {
      // Weak Areas pool ≈ literal misses + fresh from weak domains; we cap
      // the reported "available" count to the requested poolSize so the UI
      // shows what the user will actually get.
      return Math.max(1, examSettings.poolSize || 30);
    }

    let count = 0;
    if (domainVal === "acronym") {
      count = mcqsAll.filter((q) => q.acronym).length;
    } else if (domainVal === "scenario") {
      count = mcqsAll.filter((q) => q.scenario).length;
    } else {
      const dn = parseInt(domainVal, 10);
      if (!isNaN(dn)) {
        count = mcqsAll.filter((q) => q.domainNum === dn).length;
        // Add PBQs from this domain
        count += pbqsAll.filter((p) => p.domainNum === dn).length;
      }
    }
    return count;
  }

  function updatePoolSizeMax() {
    const available = countAvailableQuestions(examSettings.domainFilter);
    const isAllDomains = examSettings.domainFilter === "all";

    // Update domain info text
    if (domainInfoEl) {
      if (isAllDomains) {
        domainInfoEl.textContent = "All domains selected. " + available + " questions available.";
      } else if (examSettings.domainFilter === "pbq") {
        domainInfoEl.textContent = "All PBQs only. " + available + " PBQ" + (available === 1 ? "" : "s") + " available.";
      } else if (examSettings.domainFilter === "weak") {
        const misses = loadMisses();
        const uniqueMissedNums = new Set(misses.filter((m) => m.kind === "mcq" && m.num != null).map((m) => m.num));
        const domains = new Set(misses.map((m) => m.domainNum).filter((d) => d != null));
        domainInfoEl.textContent =
          "Weak Areas mode: 50% from your past misses (" + uniqueMissedNums.size +
          " unique miss" + (uniqueMissedNums.size === 1 ? "" : "es") + ") + 50% fresh from your weakest domains (" +
          domains.size + " domain" + (domains.size === 1 ? "" : "s") + " in history).";
      } else {
        const domainName = DOMAIN_NAMES[examSettings.domainFilter] || examSettings.domainFilter;
        domainInfoEl.textContent = domainName + " selected. " + available + " questions available.";
      }
    }

    // Show/hide pool mode options based on domain
    if (poolModeOptions && poolModeInfo) {
      if (isAllDomains) {
        // All domains: show radio options
        poolModeOptions.style.display = "block";
        poolModeInfo.style.display = "none";

        const allRadio = document.querySelector('input[name="poolMode"][value="all"]');
        const randomRadio = document.querySelector('input[name="poolMode"][value="random"]');
        if (allRadio && randomRadio) {
          allRadio.disabled = false;
          randomRadio.disabled = false;
          // Show pool size row if random mode is selected
          if (examSettings.poolMode === "random" && poolSizeRow) {
            poolSizeRow.style.display = "flex";
          }
        }
      } else {
        // Specific domain: show info message instead
        poolModeOptions.style.display = "none";
        poolModeInfo.style.display = "block";

        const domainName = DOMAIN_NAMES[examSettings.domainFilter] || examSettings.domainFilter;
        if (poolModeInfoText) {
          poolModeInfoText.textContent = domainName + " has " + available + " questions — your exam will have " + available + " questions.";
        }

        // Force full exam mode
        examSettings.poolMode = "all";
        if (poolSizeRow) poolSizeRow.style.display = "none";
      }
    }

    // Update dropdown options based on available questions
    if (poolSizeEl) {
      const options = poolSizeEl.querySelectorAll("option");
      options.forEach((opt) => {
        const optVal = parseInt(opt.value, 10);
        if (optVal > available) {
          opt.disabled = true;
        } else {
          opt.disabled = false;
        }
      });

      // If current value is disabled, pick the highest enabled option
      const currentVal = parseInt(poolSizeEl.value, 10);
      if (currentVal > available) {
        let selected = false;
        // Find highest enabled option
        for (let i = options.length - 1; i >= 0; i--) {
          if (!options[i].disabled) {
            poolSizeEl.value = options[i].value;
            examSettings.poolSize = parseInt(options[i].value, 10);
            selected = true;
            break;
          }
        }
        if (!selected) {
          poolSizeEl.value = "30"; // fallback
          examSettings.poolSize = 30;
        }
      }
    }
  }

  function totalTargetQuestions() {
    // Total exam length. PBQ count is a percentage of this; MCQs fill the rest.
    //   - "all"    => fixed-size full exam (EXAM_TOTAL_DEFAULT for all domains, or all available for specific domain)
    //   - "random" => user-chosen subset, clamped to the pool size
    if (examSettings.poolMode === "random") {
      return clamp(examSettings.poolSize, 5, 90);
    }

    // Full exam mode
    if (examSettings.domainFilter !== "all") {
      // Specific domain: return all available in that domain
      return countAvailableQuestions(examSettings.domainFilter);
    }

    // All domains: return standard 90
    return EXAM_TOTAL_DEFAULT;
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
    const totalQ = totalTargetQuestions();
    const pbqUsed = examSettings.includePBQs ? pbqInfo.used : 0;
    const mcqUsed = Math.max(0, totalQ - pbqUsed);

    const pillMode  = examSettings.attemptsAllowed === 1 ? "1 chance" : "2 chances";
    const pillTimer = examSettings.untimed
      ? "Untimed (study mode)"
      : (examSettings.timerMinutes + " min");
    const pillPool  = examSettings.poolMode === "random"
      ? ("Random " + totalQ + "-question exam")
      : ("Full " + totalQ + "-question exam");
    const pillMix   = examSettings.domainFilter === "weak"
      ? ("Mix: 50% past misses + 50% weak domains")
      : (examSettings.includePBQs
          ? ("Mix: " + mcqUsed + " MCQ + " + pbqUsed + " PBQ" +
             "  (" + examSettings.pbqPercent + "% PBQs of " + totalQ + ")")
          : ("Mix: " + mcqUsed + " MCQ + 0 PBQ"));

    let warn = "";
    if (examSettings.includePBQs && pbqInfo.desired > pbqInfo.available) {
      warn = '<span class="summary-warn">⚠ Not enough PBQ-tagged questions available (' +
             pbqInfo.desired + ' requested, only ' + pbqInfo.available +
             ' available). All available PBQs will be included; remaining slots will be MCQs.</span>';
    }

    configSummary.innerHTML =
      '<strong>Selected:</strong> ' +
      '<span class="summary-pill">' + escapeHtml(pillMode) + '</span>' +
      '<span class="summary-pill">' + escapeHtml(pillTimer) + '</span>' +
      '<span class="summary-pill">' + escapeHtml(pillPool) + '</span>' +
      '<span class="summary-pill">' + escapeHtml(pillMix) + '</span>' +
      warn;
  }

  // ===================================================================
  // Start / Reset exam
  // ===================================================================

  function onStartExam() {
    // Re-read all Dynamic_Options() values into examSettings
    examSettings.domainFilter    = startDomainFilterEl.value;

    examSettings.attemptsAllowed = parseInt(pickedValue("attemptsMode"), 10);
    examSettings.poolMode        = pickedValue("poolMode");
    examSettings.poolSize        = parseInt(poolSizeEl.value, 10) || 30;
    examSettings.pbqMode         = pickedValue("pbqMode");
    examSettings.includePBQs     = examSettings.pbqMode === "on";

    // Untimed / study mode
    examSettings.untimed = !!(untimedEl && untimedEl.checked);

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
      const timerStr = examSettings.untimed ? "untimed" : (examSettings.timerMinutes + "m");
      tModePill.textContent = (examSettings.attemptsAllowed === 1 ? "1-chance" : "2-chance") +
                              " · " + timerStr;
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
    if (examSettings.untimed) {
      tStart.disabled = true;
      tPause.disabled = true;
    } else {
      tStart.disabled = false;
      tPause.disabled = true;
    }
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
    setPausedUi(false);

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

    // Filter questions by domain before building pool
    let pbqsAll = Array.isArray(window.PBQ_DATA)  ? window.PBQ_DATA.slice()  : [];
    let mcqsAll = Array.isArray(window.QUIZ_DATA) ? window.QUIZ_DATA.slice() : [];

    // Special PBQ-only filter: all PBQs, no MCQs.
    // We force-enable PBQs and skip the % math entirely so the pool is just PBQs.
    if (examSettings.domainFilter === "pbq") {
      mcqsAll = [];
      shuffle(pbqsAll);
      pbqsAll.forEach((p) => {
        pool.push({ kind: "pbq", uid: "pbq-" + p.pbqId, q: p });
      });
      shuffle(pool);
      pool.forEach((entry, i) => { entry.examNum = i + 1; });
      return { warning: "" };
    }

    // Special "weak areas" filter: 50/50 hybrid pool.
    //   - Half = literal repeats of MCQs the user has missed in past sessions
    //   - Half = fresh MCQs from the user's weakest domains, weighted by miss count
    if (examSettings.domainFilter === "weak") {
      const result = buildWeakAreasPool(totalTargetQuestions(), mcqsAll);
      result.entries.forEach((q) => {
        pool.push({ kind: "mcq", uid: "mcq-" + q.num, q: q });
      });
      shuffle(pool);
      pool.forEach((entry, i) => { entry.examNum = i + 1; });
      return { warning: result.warning };
    }

    // Apply domain filter (excluding "pbq" handled above)
    if (examSettings.domainFilter !== "all") {
      if (examSettings.domainFilter === "acronym") {
        mcqsAll = mcqsAll.filter((q) => q.acronym);
      } else if (examSettings.domainFilter === "scenario") {
        mcqsAll = mcqsAll.filter((q) => q.scenario);
      } else {
        const dn = parseInt(examSettings.domainFilter, 10);
        if (!isNaN(dn)) {
          mcqsAll = mcqsAll.filter((q) => q.domainNum === dn);
          pbqsAll = pbqsAll.filter((p) => p.domainNum === dn);
        }
      }
    }

    // Total exam size — PBQs REPLACE MCQs in this slot count, they do not
    // inflate it. So: 90 total + 10% PBQs => 9 PBQs + 81 MCQs (= 90), not 99.
    const total   = totalTargetQuestions();


    // PBQ slice (capped by what's available)
    let pbqsToUse = [];
    let pbqUsed   = 0;
    if (examSettings.includePBQs && pbqsAll.length > 0) {
      const desired = Math.round((examSettings.pbqPercent / 100) * total);
      pbqUsed = Math.min(desired, pbqsAll.length);
      shuffle(pbqsAll);
      pbqsToUse = pbqsAll.slice(0, pbqUsed);
      if (desired > pbqsAll.length) {
        warning = "Only " + pbqsAll.length + " PBQ-tagged question" +
                  (pbqsAll.length === 1 ? "" : "s") +
                  " available; you requested " + desired + " (" +
                  examSettings.pbqPercent + "% of " + total + "). All available " +
                  "PBQs were included; the remaining slots were filled with MCQs.";
      }
    }

    // MCQ slice = remaining slots, randomly drawn from QUIZ_DATA
    const mcqSlots = Math.max(0, total - pbqUsed);
    shuffle(mcqsAll);
    const mcqsToUse = mcqsAll.slice(0, Math.min(mcqSlots, mcqsAll.length));

    // Build pool entries
    pbqsToUse.forEach((p) => {
      pool.push({ kind: "pbq", uid: "pbq-" + p.pbqId, q: p });
    });
    mcqsToUse.forEach((q) => {
      pool.push({ kind: "mcq", uid: "mcq-" + q.num, q: q });
    });

    // Randomize the presentation order so PBQs are interspersed with MCQs
    // rather than clustered at the front.
    shuffle(pool);

    // After shuffling, stamp each entry with its sequential exam-position
    // number so the displayed "Question N" runs 1, 2, 3, ... in order even
    // though the underlying question selection is random.
    pool.forEach((entry, i) => { entry.examNum = i + 1; });

    return { warning: warning };
  }

  // Build a Weak-Areas pool. Returns { entries: [QUIZ_DATA items], warning }.
  // Composition (when enough data exists):
  //   - 50% literal repeats: MCQs the user has actually missed before
  //   - 50% fresh from weak domains: MCQs from the domains where misses
  //     accumulate most, weighted by miss count, excluding the literal half.
  // Falls back gracefully when miss history is sparse.
  function buildWeakAreasPool(total, mcqsAll) {
    const misses = loadMisses();

    if (misses.length === 0) {
      // No history yet — fall back to a plain random sample so the user
      // still gets a quiz, and surface a clear note about it.
      const fallback = mcqsAll.slice();
      shuffle(fallback);
      return {
        entries: fallback.slice(0, total),
        warning: "No miss history yet — Weak Areas mode falls back to a random sample. " +
                 "Take a regular exam first; future weak-areas runs will then bias toward " +
                 "questions and domains you've missed."
      };
    }

    // Build sets / counts from the miss log
    const missedNums = new Set();
    const domainMissCounts = {};
    misses.forEach((m) => {
      if (m.kind === "mcq" && m.num != null) missedNums.add(m.num);
      if (m.domainNum != null) {
        domainMissCounts[m.domainNum] = (domainMissCounts[m.domainNum] || 0) + 1;
      }
    });

    const halfTotal = Math.floor(total / 2);

    // ---- LITERAL HALF ----
    const literalCandidates = mcqsAll.filter((q) => missedNums.has(q.num));
    shuffle(literalCandidates);
    const literalPick = literalCandidates.slice(0, halfTotal);
    const literalIds  = new Set(literalPick.map((q) => q.num));

    // ---- FRESH HALF ----
    const freshNeeded = total - literalPick.length;
    // Prefer questions from domains with miss history, weighted by miss count.
    // Implementation: bucket all candidate MCQs by domain, then draw rounds.
    const freshCandidates = mcqsAll.filter((q) => !literalIds.has(q.num));
    shuffle(freshCandidates);

    // Sort weak-domain candidates ahead of others, weighted by miss count desc.
    freshCandidates.sort((a, b) => {
      const wA = domainMissCounts[a.domainNum] || 0;
      const wB = domainMissCounts[b.domainNum] || 0;
      if (wA !== wB) return wB - wA; // highest miss count first
      return 0;                       // preserve shuffled order on ties
    });

    const freshPick = freshCandidates.slice(0, freshNeeded);

    // ---- WARNING (if literal half short) ----
    let warning = "";
    if (literalPick.length < halfTotal) {
      warning = "Weak Areas: only " + literalPick.length +
                " unique past-missed question" + (literalPick.length === 1 ? "" : "s") +
                " available; the remainder is fresh from your weakest domains.";
    }

    return { entries: literalPick.concat(freshPick), warning: warning };
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
    // Domain filtering now happens at build time (start screen)
    // Return the full pool since it's already filtered by domain
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
        '<div class="qnum">Question ' + entry.examNum +
          ' <small style="color:var(--muted);font-weight:400;">of ' + pool.length +
          (totalVisible !== pool.length ? ' &middot; ' + position + ' of ' + totalVisible + ' shown' : '') +
          '</small></div>' +
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
        '<div class="qnum">Question ' + entry.examNum + ' &mdash; ' + escapeHtml(p.title) +
          ' <small style="color:var(--muted);font-weight:400;">of ' + pool.length +
          (totalVisible !== pool.length ? ' &middot; ' + position + ' of ' + totalVisible + ' shown' : '') +
          '</small></div>' +
        '<div class="qdomain">' + escapeHtml(p.domain) + '</div>' +
      '</div>' +
      '<div class="badges"><span class="badge pbq">PBQ</span></div>' +
      '<p class="pbq-prompt">' + escapeHtml(p.prompt) + '</p>' +
      '<p class="pbq-help">' +
        'Drag each item into the matching category, or use the dropdown on the chip. ' +
        'You can move chips between categories or back to the tray.' +
      '</p>' +
      '<div class="pbq-board" id="board-' + entry.uid + '">' +
        '<div class="pbq-zones" id="zones-' + entry.uid + '"></div>' +
        '<div class="pbq-tray-section">' +
          '<div class="pbq-tray-label">Unassigned items <small>(drag from here)</small></div>' +
          '<div class="pbq-tray pbq-dropzone" data-uid="' + entry.uid + '" data-cat="" aria-label="Unassigned items"></div>' +
        '</div>' +
      '</div>' +
      '<div class="submit-row" id="submit-row-' + entry.uid + '">' +
        '<button type="button" class="btn" id="submit-' + entry.uid + '" disabled>Submit Matches</button>' +
        '<span class="hint" id="hint-' + entry.uid + '">Make a selection for every item.</span>' +
      '</div>' +
      '<div class="status" id="status-' + entry.uid + '"></div>' +
      '<div class="explanation" id="exp-' + entry.uid + '"></div>';

    const zonesEl = card.querySelector("#zones-" + entry.uid);
    const trayEl  = card.querySelector(".pbq-tray");

    // Build category drop zones
    p.categories.forEach((cat, idx) => {
      const zone = document.createElement("div");
      zone.className = "pbq-zone";
      zone.dataset.uid = entry.uid;
      zone.dataset.cat = cat;
      zone.dataset.catIdx = String(idx);
      zone.setAttribute("aria-label", "Drop zone for category " + cat);

      const lbl = document.createElement("div");
      lbl.className = "pbq-zone-label";
      lbl.textContent = cat;

      const drop = document.createElement("div");
      drop.className = "pbq-zone-drop pbq-dropzone";
      drop.dataset.uid = entry.uid;
      drop.dataset.cat = cat;

      zone.appendChild(lbl);
      zone.appendChild(drop);
      zonesEl.appendChild(zone);
    });

    // Place each item chip into its current parent (assigned zone, or tray)
    p.items.forEach((item) => {
      const chip = makePbqChip(entry, item, p);
      const target = findPbqDropTarget(card, s.picks[item.id] || "") || trayEl;
      target.appendChild(chip);
    });

    // Wire all dropzones (zone-drops AND the tray)
    card.querySelectorAll(".pbq-dropzone").forEach((dz) => {
      attachPbqDropHandlers(dz, entry);
    });

    // After resolution, decorate chips with feedback
    if (s.resolved || s.revealed) {
      decoratePbqResolution(card, entry, s, p);
    }

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

  // -------------------------------------------------------------------
  // PBQ drag-and-drop helpers
  // -------------------------------------------------------------------

  function makePbqChip(entry, item, pbqDef) {
    const s = state[entry.uid];
    const chip = document.createElement("div");
    chip.className = "pbq-chip";
    chip.draggable = !s.resolved;
    chip.dataset.itemId = item.id;
    chip.dataset.uid    = entry.uid;
    chip.setAttribute("role", "listitem");

    const handle = document.createElement("span");
    handle.className = "pbq-chip-handle";
    handle.setAttribute("aria-hidden", "true");
    handle.textContent = "⋮⋮"; // vertical-ellipsis pair as a grip

    const lab = document.createElement("span");
    lab.className = "pbq-chip-label";
    lab.textContent = item.label;

    const sel = document.createElement("select");
    sel.className = "pbq-chip-select";
    sel.id = "sel-" + entry.uid + "-" + item.id;
    sel.disabled = !!s.resolved;
    sel.setAttribute("aria-label", "Category for " + item.label);

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "— pick —";
    sel.appendChild(placeholder);

    pbqDef.categories.forEach((cat) => {
      const opt = document.createElement("option");
      opt.value = cat;
      opt.textContent = cat;
      sel.appendChild(opt);
    });
    if (s.picks[item.id]) sel.value = s.picks[item.id];

    sel.addEventListener("change", () => {
      if (s.resolved) return;
      if (isPaused()) {
        // Revert the dropdown to its prior value and explain.
        sel.value = s.picks[item.id] || "";
        showToast("Timer paused — click Start to continue.");
        return;
      }
      s.picks[item.id] = sel.value;
      const card = document.getElementById("card-" + entry.uid);
      if (card) movePbqChip(card, entry, item.id, sel.value);
    });

    // HTML5 DnD: this chip is the drag source
    chip.addEventListener("dragstart", (e) => {
      if (s.resolved || isPaused()) { e.preventDefault(); return; }
      e.dataTransfer.effectAllowed = "move";
      try {
        e.dataTransfer.setData("text/plain",
          JSON.stringify({ uid: entry.uid, itemId: item.id }));
      } catch (_) {}
      chip.classList.add("dragging");
    });
    chip.addEventListener("dragend", () => {
      chip.classList.remove("dragging");
    });

    chip.appendChild(handle);
    chip.appendChild(lab);
    chip.appendChild(sel);
    return chip;
  }

  function attachPbqDropHandlers(dz, entry) {
    const s = state[entry.uid];

    dz.addEventListener("dragover", (e) => {
      if (s.resolved || isPaused()) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      dz.classList.add("drag-over");
      // Also highlight the parent zone-card if applicable
      const parentZone = dz.closest(".pbq-zone");
      if (parentZone) parentZone.classList.add("drag-over");
    });
    dz.addEventListener("dragleave", () => {
      dz.classList.remove("drag-over");
      const parentZone = dz.closest(".pbq-zone");
      if (parentZone) parentZone.classList.remove("drag-over");
    });
    dz.addEventListener("drop", (e) => {
      e.preventDefault();
      dz.classList.remove("drag-over");
      const parentZone = dz.closest(".pbq-zone");
      if (parentZone) parentZone.classList.remove("drag-over");
      if (s.resolved) return;
      if (isPaused()) { showToast("Timer paused — click Start to continue."); return; }

      let payload = {};
      try {
        payload = JSON.parse(e.dataTransfer.getData("text/plain") || "{}");
      } catch (_) { payload = {}; }
      if (!payload || payload.uid !== entry.uid || !payload.itemId) return;

      const cat = dz.dataset.cat || "";
      s.picks[payload.itemId] = cat;
      const card = document.getElementById("card-" + entry.uid);
      if (card) movePbqChip(card, entry, payload.itemId, cat);
    });
  }

  function findPbqChip(card, itemId) {
    const chips = card.querySelectorAll(".pbq-chip");
    for (let i = 0; i < chips.length; i++) {
      if (chips[i].dataset.itemId === itemId) return chips[i];
    }
    return null;
  }

  function findPbqDropTarget(card, cat) {
    if (!cat) return card.querySelector(".pbq-tray");
    const drops = card.querySelectorAll(".pbq-zone-drop");
    for (let i = 0; i < drops.length; i++) {
      if (drops[i].dataset.cat === cat) return drops[i];
    }
    return null;
  }

  function movePbqChip(card, entry, itemId, cat) {
    const chip = findPbqChip(card, itemId);
    if (!chip) return;
    const target = findPbqDropTarget(card, cat || "");
    if (target) target.appendChild(chip);
    const sel = chip.querySelector(".pbq-chip-select");
    if (sel) sel.value = cat || "";
    updatePbqSubmitState(entry, card);
  }

  function decoratePbqResolution(card, entry, s, pbqDef) {
    pbqDef.items.forEach((item) => {
      const chip = findPbqChip(card, item.id);
      if (!chip) return;
      chip.draggable = false;
      const sel = chip.querySelector(".pbq-chip-select");
      if (sel) sel.disabled = true;

      const isCorrect = s.picks[item.id] === item.correct;
      chip.classList.add(isCorrect ? "chip-correct" : "chip-wrong");

      // Append a small feedback line inside the chip
      const fb = document.createElement("div");
      fb.className = "pbq-chip-feedback";
      if (isCorrect) {
        fb.textContent = "✓ Correct";
      } else {
        fb.textContent = "✗ Correct: " + item.correct;
      }
      chip.appendChild(fb);
    });
  }

  // ===================================================================
  // MCQ — single-answer handling
  // ===================================================================

  function handleSingleAnswer(entry, letter, btn, card) {
    const q = entry.q;
    const s = state[entry.uid];
    if (s.resolved || examEnded) return;
    if (isPaused()) { showToast("Timer paused — click Start to continue."); return; }
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
    if (isPaused()) { showToast("Timer paused — click Start to continue."); return; }
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
    if (isPaused()) { showToast("Timer paused — click Start to continue."); return; }

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
    if (isPaused()) { showToast("Timer paused — click Start to continue."); return; }

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
    setPausedUi(false);
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
        '<button class="btn" id="bannerReviewFailLog" type="button">Review Fail Log</button>' +
        '<button class="btn ghost" id="bannerExportFailLog" type="button">Export Fail Log (.txt)</button>' +
        '<button class="btn ghost" id="bannerExportJson" type="button">Export Miss Log (.json)</button>' +
        '<button class="btn ghost" id="bannerReviewMissed" type="button">Filter to missed only</button>' +
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

    banner.querySelector("#bannerReviewFailLog").addEventListener("click", () => openReview());
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
    if (examSettings.untimed) {
      // No-op in untimed mode. Buttons stay reflective of "no clock to start".
      tStart.disabled = true;
      tPause.disabled = true;
      setPausedUi(false);
      return;
    }
    if (timerRunning || examEnded) return;
    timerRunning = true;
    tStart.disabled = true;
    tPause.disabled = false;
    setPausedUi(false);
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
    setPausedUi(true);
  }

  // True while the exam is in progress but the timer is paused (and not
  // expired/ended). Used to gate every answer interaction so a paused exam
  // is read-only. In untimed/study mode there's no clock and no lockout.
  function isPaused() {
    if (examSettings.untimed) return false;
    return examStarted && !timerRunning && !examEnded;
  }

  function setPausedUi(paused) {
    if (!examScreen) return;
    examScreen.classList.toggle("exam-paused", !!paused);

    let banner = document.getElementById("pausedBanner");
    if (paused) {
      if (!banner) {
        banner = document.createElement("div");
        banner.id = "pausedBanner";
        banner.className = "paused-banner";
        banner.setAttribute("role", "status");
        banner.innerHTML =
          '<strong>⏸ Timer paused</strong> &mdash; answering is disabled. ' +
          'Click <em>Start</em> in the timer box to resume the exam.';
        // Insert just above the question list so it's prominent but doesn't
        // cover the sticky timer/filter bar.
        if (quizEl && quizEl.parentNode) {
          quizEl.parentNode.insertBefore(banner, quizEl);
        } else {
          examScreen.appendChild(banner);
        }
      }
      banner.hidden = false;
    } else if (banner) {
      banner.hidden = true;
    }
  }

  function renderTimer() {
    if (examSettings.untimed) {
      tDisplay.textContent = "∞";
      tDisplay.classList.remove("warning", "expired");
      return;
    }
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

  // ===================================================================
  // Fail Log Review screen — walk through every persisted miss with full
  // context: stem, your answer, correct answer, explanation, mode, etc.
  // ===================================================================

  function openReview() {
    if (!reviewScreen) return;
    // Hide the other screens
    if (startScreen) startScreen.hidden = true;
    if (examScreen)  examScreen.hidden  = true;
    reviewScreen.hidden = false;
    // Reset filter to "all" each open
    if (reviewDomainFilter) reviewDomainFilter.value = "all";
    applyReviewFilter("all");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function closeReview() {
    if (!reviewScreen) return;
    reviewScreen.hidden = true;
    // Return to wherever made sense — start screen if no exam in progress,
    // exam screen if we were mid-exam (e.g. arrived from completion banner).
    if (examStarted && examScreen) {
      examScreen.hidden = false;
    } else if (startScreen) {
      startScreen.hidden = false;
      renderMissHistory();
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function applyReviewFilter(filter) {
    const all = loadMisses().slice().reverse(); // newest first
    if (filter === "all") {
      reviewItems = all;
    } else if (filter === "pbq") {
      reviewItems = all.filter((m) => m.kind === "pbq");
    } else {
      const dn = parseInt(filter, 10);
      if (!isNaN(dn)) {
        reviewItems = all.filter((m) => m.domainNum === dn);
      } else {
        reviewItems = all;
      }
    }
    reviewIndex = 0;
    renderReviewItem();
  }

  function navReview(dir) {
    if (reviewItems.length === 0) return;
    reviewIndex = Math.max(0, Math.min(reviewItems.length - 1, reviewIndex + dir));
    renderReviewItem();
  }

  function renderReviewItem() {
    if (!reviewCard) return;

    const total = reviewItems.length;
    if (reviewCounter) reviewCounter.textContent = total === 0
      ? "0 of 0"
      : (reviewIndex + 1) + " of " + total;

    if (reviewPrevBtn) reviewPrevBtn.disabled = (reviewIndex <= 0 || total === 0);
    if (reviewNextBtn) reviewNextBtn.disabled = (reviewIndex >= total - 1 || total === 0);

    if (total === 0) {
      reviewCard.innerHTML =
        '<div class="review-empty">' +
          '<p>No misses match this filter.</p>' +
          '<p class="muted-tiny">Take an exam (or change the filter) to populate the fail log.</p>' +
        '</div>';
      return;
    }

    const m = reviewItems[reviewIndex];
    const when = (() => {
      try { return new Date(m.date).toLocaleString(); } catch (_) { return m.date || "(unknown)"; }
    })();
    const modeStr  = m.examMode || "—";
    const timerStr = m.timerMinutes != null ? (m.timerMinutes + " min") : "—";

    if (m.kind === "mcq") {
      const yourPick = (m.userPickText && m.userPickText.length)
        ? m.userPickText.join(", ")
        : ((m.userPicks || []).join(", ") || "(none)");
      const correct  = (m.correctText && m.correctText.length)
        ? m.correctText.join(", ")
        : ((m.correct || []).join(", "));

      reviewCard.innerHTML =
        '<div class="review-meta">' +
          '<span class="review-pill">' + escapeHtml(when) + '</span>' +
          '<span class="review-pill">' + escapeHtml(m.domain || "—") + '</span>' +
          '<span class="review-pill">Question #' + escapeHtml(String(m.num != null ? m.num : "?")) + '</span>' +
          '<span class="review-pill">' + escapeHtml(modeStr) + ' &middot; ' + escapeHtml(timerStr) + '</span>' +
        '</div>' +
        '<h3 class="review-stem">' + escapeHtml(m.stem || "(stem unavailable)") + '</h3>' +
        '<div class="review-answer-grid">' +
          '<div class="review-answer review-wrong">' +
            '<div class="review-answer-label">Your answer</div>' +
            '<div class="review-answer-value">' + escapeHtml(yourPick) + '</div>' +
          '</div>' +
          '<div class="review-answer review-correct">' +
            '<div class="review-answer-label">Correct answer</div>' +
            '<div class="review-answer-value">' + escapeHtml(correct) + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="review-explanation">' +
          '<h4>Explanation</h4>' +
          '<p>' + escapeHtml(m.explanation || "(no explanation recorded)") + '</p>' +
        '</div>';
    } else {
      const wrongHtml = (m.wrongMatches || []).map((w) =>
        '<li><strong>' + escapeHtml(w.item) + '</strong>: ' +
        'you picked <em>' + escapeHtml(w.userPick || "(none)") + '</em>, ' +
        'correct was <strong>' + escapeHtml(w.correct) + '</strong></li>'
      ).join("");

      reviewCard.innerHTML =
        '<div class="review-meta">' +
          '<span class="review-pill">' + escapeHtml(when) + '</span>' +
          '<span class="review-pill">' + escapeHtml(m.domain || "—") + '</span>' +
          '<span class="review-pill">PBQ &middot; ' + escapeHtml(m.title || m.pbqId || "?") + '</span>' +
          '<span class="review-pill">' + escapeHtml(modeStr) + ' &middot; ' + escapeHtml(timerStr) + '</span>' +
        '</div>' +
        '<h3 class="review-stem">' + escapeHtml(m.prompt || "(prompt unavailable)") + '</h3>' +
        '<div class="review-explanation">' +
          '<h4>Wrong matches</h4>' +
          '<ul class="review-wrong-list">' + wrongHtml + '</ul>' +
        '</div>' +
        '<div class="review-explanation">' +
          '<h4>Explanation</h4>' +
          '<p>' + escapeHtml(m.explanation || "(no explanation recorded)") + '</p>' +
        '</div>';
    }
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
