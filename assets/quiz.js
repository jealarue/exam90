// SY0-701 90-Question Practice Exam — interactive logic
//
// Features:
//   - Single-answer questions: 2 attempts; 1pt first try, 0.5pt second, 0 if missed.
//   - [SELECT TWO] questions: pick exactly 2 letters then Submit; same scoring rules.
//   - 90-minute timer (Start / Pause / Reset).
//   - Domain filter (incl. Acronym-only and Scenario-only views).
//   - Progress bar, score pill, per-domain summary at the end.

(function () {
  "use strict";

  const ALL_LETTERS = ["A", "B", "C", "D", "E"];
  const MAX_ATTEMPTS = 2;
  const TIMER_SECONDS = 90 * 60;

  // Per-question state
  // { attempts, resolved, score, wrongPicks: [letters], pending: Set<letter> }
  const state = {};

  const quizEl       = document.getElementById("quiz");
  const progressText = document.getElementById("progressText");
  const progressFill = document.getElementById("progressFill");
  const scorePill    = document.getElementById("scorePill");
  const resetBtn     = document.getElementById("resetBtn");
  const filterEl     = document.getElementById("domainFilter");

  // Timer DOM
  const tDisplay = document.getElementById("timerDisplay");
  const tStart   = document.getElementById("timerStart");
  const tPause   = document.getElementById("timerPause");
  const tReset   = document.getElementById("timerReset");

  // Timer state
  let timerRemaining = TIMER_SECONDS;
  let timerHandle = null;
  let timerRunning = false;

  function init() {
    seedState();
    render();
    updateProgress();

    resetBtn.addEventListener("click", () => {
      if (!confirm("Reset all answers and start the exam over?")) return;
      for (const k of Object.keys(state)) delete state[k];
      seedState();
      render();
      updateProgress();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    filterEl.addEventListener("change", () => {
      render();
      window.scrollTo({ top: quizEl.offsetTop - 20, behavior: "smooth" });
    });

    tStart.addEventListener("click", startTimer);
    tPause.addEventListener("click", pauseTimer);
    tReset.addEventListener("click", resetTimer);
    renderTimer();
  }

  function seedState() {
    window.QUIZ_DATA.forEach((q) => {
      if (!state[q.num]) {
        state[q.num] = {
          attempts: 0,
          resolved: false,
          score: 0,
          wrongPicks: [],
          pending: new Set()
        };
      }
    });
  }

  // --- Filtering --------------------------------------------------------

  function getFilteredQuestions() {
    const f = filterEl.value;
    if (f === "all") return window.QUIZ_DATA;
    if (f === "acronym")  return window.QUIZ_DATA.filter((q) => q.acronym);
    if (f === "scenario") return window.QUIZ_DATA.filter((q) => q.scenario);
    const dn = parseInt(f, 10);
    if (!isNaN(dn)) return window.QUIZ_DATA.filter((q) => q.domainNum === dn);
    return window.QUIZ_DATA;
  }

  // --- Render -----------------------------------------------------------

  function render() {
    quizEl.innerHTML = "";
    const visible = getFilteredQuestions();

    if (visible.length === 0) {
      const empty = document.createElement("div");
      empty.className = "empty";
      empty.textContent = "No questions match this filter.";
      quizEl.appendChild(empty);
      return;
    }

    visible.forEach((q) => quizEl.appendChild(renderCard(q)));
    if (allResolved()) renderSummary();
  }

  function renderCard(q) {
    const s = state[q.num];

    const card = document.createElement("section");
    card.className = "card";
    card.id = "q" + q.num;

    const optionLetters = Object.keys(q.options).sort();
    const correctSet = new Set(Array.isArray(q.correct) ? q.correct : [q.correct]);
    const numCorrect = correctSet.size;

    const badges = [];
    if (q.acronym)     badges.push(`<span class="badge acronym">Acronym</span>`);
    if (q.scenario)    badges.push(`<span class="badge scenario">Scenario</span>`);
    if (q.selectMulti) badges.push(`<span class="badge select">Select ${numCorrect}</span>`);

    card.innerHTML = `
      <div class="qhead">
        <div class="qnum">Question ${q.num} of ${window.QUIZ_DATA.length}</div>
        <div class="qdomain">${escapeHtml(q.domain)}</div>
      </div>
      ${badges.length ? `<div class="badges">${badges.join("")}</div>` : ""}
      <p class="stem">${escapeHtml(q.stem)}</p>
      <div class="options" role="${q.selectMulti ? "group" : "radiogroup"}" aria-label="Answer options"></div>
      ${q.selectMulti ? `
        <div class="submit-row" id="submit-row-${q.num}">
          <button type="button" class="btn" id="submit-${q.num}" disabled>Submit Answer</button>
          <span class="hint" id="hint-${q.num}">Select exactly ${numCorrect} options.</span>
        </div>` : ""}
      <div class="status" id="status-${q.num}"></div>
      <div class="explanation" id="exp-${q.num}"></div>
    `;

    const optionsEl = card.querySelector(".options");

    optionLetters.forEach((letter) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option";
      btn.dataset.letter = letter;
      btn.innerHTML = `<span class="letter">${letter}</span><span class="text">${escapeHtml(q.options[letter])}</span>`;

      // Restore visual state for resolved questions
      if (s.resolved) {
        btn.disabled = true;
        if (correctSet.has(letter)) btn.classList.add("correct-reveal");
        if (s.wrongPicks.includes(letter) && !correctSet.has(letter)) btn.classList.add("wrong-reveal");
      } else {
        // Restore wrong-attempt highlight from any failed prior tries
        if (s.wrongPicks.includes(letter)) {
          btn.classList.add("wrong-attempt");
          btn.disabled = true;
        }
        // Restore pending selections (multi-select)
        if (q.selectMulti && s.pending.has(letter)) {
          btn.classList.add("selected-pending");
        }
      }

      if (q.selectMulti) {
        btn.addEventListener("click", () => handleMultiClick(q, letter, btn, card));
      } else {
        btn.addEventListener("click", () => handleSingleAnswer(q, letter, btn, card));
      }
      optionsEl.appendChild(btn);
    });

    if (q.selectMulti && !s.resolved) {
      const submitBtn = card.querySelector(`#submit-${q.num}`);
      submitBtn.addEventListener("click", () => handleMultiSubmit(q, card));
      updateMultiSubmitState(q, card);
    }

    if (s.resolved) {
      showExplanation(q, card, s);
      showStatus(q, card, s);
    } else if (s.attempts > 0) {
      showStatus(q, card, s);
    }

    return card;
  }

  // --- Single-answer handling ------------------------------------------

  function handleSingleAnswer(q, letter, btn, card) {
    const s = state[q.num];
    if (s.resolved) return;
    const correct = q.correct;

    if (letter === correct) {
      s.resolved = true;
      s.score = s.attempts === 0 ? 1 : 0.5;
      btn.classList.add("correct-reveal");
      lockAllOptions(card, q, s);
      showExplanation(q, card, s);
      showStatus(q, card, s);
    } else {
      s.attempts += 1;
      if (!s.wrongPicks.includes(letter)) s.wrongPicks.push(letter);
      btn.classList.add("wrong-attempt");
      btn.disabled = true;

      if (s.attempts >= MAX_ATTEMPTS) {
        s.resolved = true;
        s.score = 0;
        const correctBtn = card.querySelector(`.option[data-letter="${correct}"]`);
        if (correctBtn) correctBtn.classList.add("correct-reveal");
        lockAllOptions(card, q, s);
        showExplanation(q, card, s);
      }
      showStatus(q, card, s);
    }

    updateProgress();
    if (s.resolved && allResolved()) renderSummary();
  }

  // --- Multi-select handling -------------------------------------------

  function handleMultiClick(q, letter, btn, card) {
    const s = state[q.num];
    if (s.resolved) return;
    if (s.wrongPicks.includes(letter)) return; // already locked-out wrong pick

    if (s.pending.has(letter)) {
      s.pending.delete(letter);
      btn.classList.remove("selected-pending");
    } else {
      s.pending.add(letter);
      btn.classList.add("selected-pending");
    }
    updateMultiSubmitState(q, card);
  }

  function handleMultiSubmit(q, card) {
    const s = state[q.num];
    if (s.resolved) return;

    const correctSet = new Set(q.correct);
    const numNeeded = correctSet.size;
    if (s.pending.size !== numNeeded) return;

    const picked = Array.from(s.pending);
    const allCorrect = picked.every((l) => correctSet.has(l)) && picked.length === numNeeded;

    if (allCorrect) {
      s.resolved = true;
      s.score = s.attempts === 0 ? 1 : 0.5;
      // Mark each correct pick as correct-reveal
      picked.forEach((l) => {
        const b = card.querySelector(`.option[data-letter="${l}"]`);
        if (b) {
          b.classList.remove("selected-pending");
          b.classList.add("correct-reveal");
        }
      });
      lockAllOptions(card, q, s);
      hideMultiSubmit(card, q);
      showExplanation(q, card, s);
      showStatus(q, card, s);
    } else {
      s.attempts += 1;
      // Lock incorrect picks as wrong attempts
      picked.forEach((l) => {
        if (!correctSet.has(l) && !s.wrongPicks.includes(l)) {
          s.wrongPicks.push(l);
          const b = card.querySelector(`.option[data-letter="${l}"]`);
          if (b) {
            b.classList.remove("selected-pending");
            b.classList.add("wrong-attempt");
            b.disabled = true;
          }
        } else if (correctSet.has(l)) {
          // Clear pending state for correct picks so user can re-pick on retry
          const b = card.querySelector(`.option[data-letter="${l}"]`);
          if (b) b.classList.remove("selected-pending");
        }
      });
      s.pending.clear();

      if (s.attempts >= MAX_ATTEMPTS) {
        s.resolved = true;
        s.score = 0;
        // Reveal all correct answers
        correctSet.forEach((l) => {
          const b = card.querySelector(`.option[data-letter="${l}"]`);
          if (b) b.classList.add("correct-reveal");
        });
        lockAllOptions(card, q, s);
        hideMultiSubmit(card, q);
        showExplanation(q, card, s);
      } else {
        updateMultiSubmitState(q, card);
      }
      showStatus(q, card, s);
    }

    updateProgress();
    if (s.resolved && allResolved()) renderSummary();
  }

  function updateMultiSubmitState(q, card) {
    const s = state[q.num];
    const submitBtn = card.querySelector(`#submit-${q.num}`);
    const hintEl = card.querySelector(`#hint-${q.num}`);
    if (!submitBtn || !hintEl) return;
    const need = (Array.isArray(q.correct) ? q.correct.length : 1);
    const have = s.pending.size;
    submitBtn.disabled = have !== need;
    if (have === 0)         hintEl.textContent = `Select exactly ${need} options.`;
    else if (have < need)   hintEl.textContent = `Select ${need - have} more.`;
    else if (have === need) hintEl.textContent = `Ready — click Submit.`;
    else                    hintEl.textContent = `Too many selected (max ${need}).`;
  }

  function hideMultiSubmit(card, q) {
    const row = card.querySelector(`#submit-row-${q.num}`);
    if (row) row.style.display = "none";
  }

  // --- Shared helpers --------------------------------------------------

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

  function showStatus(q, card, s) {
    const el = card.querySelector(`#status-${q.num}`);
    if (!el) return;
    el.className = "status";
    if (!s.resolved) {
      const remaining = MAX_ATTEMPTS - s.attempts;
      el.classList.add("try-again");
      el.textContent = `✗ Not quite. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.`;
    } else if (s.score === 1) {
      el.classList.add("solved");
      el.textContent = "✓ Correct on the first try — full credit.";
    } else if (s.score === 0.5) {
      el.classList.add("solved");
      el.textContent = "✓ Correct on the second try — half credit.";
    } else {
      el.classList.add("revealed");
      el.textContent = "Out of attempts. Correct answer revealed below.";
    }
  }

  function showExplanation(q, card, s) {
    const el = card.querySelector(`#exp-${q.num}`);
    if (!el) return;

    const correctLetters = Array.isArray(q.correct) ? q.correct : [q.correct];
    const correctSummary = correctLetters
      .map((l) => `<strong>${l}</strong> — ${escapeHtml(q.options[l])}`)
      .join("<br>");

    let wrongHintHtml = "";
    if (q.wrongHint && q.wrongHint.letter) {
      wrongHintHtml = `
        <div class="wrong-list">
          <h4>Most tempting wrong answer (${q.wrongHint.letter})</h4>
          <p>${escapeHtml(q.wrongHint.text)}</p>
        </div>`;
    }

    el.innerHTML = `
      <h4>Correct Answer</h4>
      <p>${correctSummary}</p>
      <p style="margin-top:8px;">${escapeHtml(q.explanation)}</p>
      ${wrongHintHtml}
    `;
    el.classList.add("visible");
  }

  function updateProgress() {
    const total = window.QUIZ_DATA.length;
    const resolvedCount = Object.values(state).filter((s) => s.resolved).length;
    const pct = Math.round((resolvedCount / total) * 100);
    progressText.textContent = `Progress: ${resolvedCount} / ${total} answered`;
    progressFill.style.width = pct + "%";
    const score = Object.values(state).reduce((a, s) => a + (s.resolved ? s.score : 0), 0);
    scorePill.textContent = `Score: ${formatScore(score)} / ${total}`;
  }

  function allResolved() {
    return Object.keys(state).length === window.QUIZ_DATA.length &&
           Object.values(state).every((s) => s.resolved);
  }

  function renderSummary() {
    const total = window.QUIZ_DATA.length;
    const score = Object.values(state).reduce((a, s) => a + s.score, 0);
    const firstTry  = Object.values(state).filter((s) => s.score === 1).length;
    const secondTry = Object.values(state).filter((s) => s.score === 0.5).length;
    const missed    = Object.values(state).filter((s) => s.score === 0).length;
    const pct = Math.round((score / total) * 100);
    const passed = pct >= 83;

    // Per-domain breakdown
    const domainNames = {
      1: "D1 General Concepts",
      2: "D2 Threats & Vulns",
      3: "D3 Architecture",
      4: "D4 Operations",
      5: "D5 Program Mgmt"
    };
    const byDomain = {};
    window.QUIZ_DATA.forEach((q) => {
      if (!byDomain[q.domainNum]) byDomain[q.domainNum] = { total: 0, score: 0 };
      byDomain[q.domainNum].total += 1;
      byDomain[q.domainNum].score += state[q.num] ? state[q.num].score : 0;
    });
    const domainCells = Object.keys(byDomain).sort().map((dn) => {
      const d = byDomain[dn];
      const dPct = Math.round((d.score / d.total) * 100);
      return `<div class="domain-cell">
        <div class="label">${domainNames[dn] || ("Domain " + dn)}</div>
        <div class="value">${formatScore(d.score)} / ${d.total} <small style="color:var(--muted);font-weight:400;">(${dPct}%)</small></div>
      </div>`;
    }).join("");

    const verdict = passed
      ? `<span class="verdict-pass">PASS</span>`
      : `<span class="verdict-fail">BELOW PASS THRESHOLD</span>`;

    const summary = document.createElement("section");
    summary.className = "summary";
    summary.id = "summary";
    summary.innerHTML = `
      <h2>Exam Complete — ${verdict}</h2>
      <div class="big-score">${formatScore(score)} / ${total} &nbsp;(${pct}%)</div>
      <p class="sub">
        ${firstTry} first-try correct &middot;
        ${secondTry} second-try correct &middot;
        ${missed} missed &middot;
        Pass threshold: 83% (75/90)
      </p>
      <div class="domain-grid">${domainCells}</div>
      <p class="sub">Scroll up to review explanations, change the filter to drill into a domain, or click <em>Reset Exam</em> to start over.</p>
    `;
    const existing = document.getElementById("summary");
    if (existing) existing.remove();
    quizEl.appendChild(summary);
    summary.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // --- Timer ------------------------------------------------------------

  function startTimer() {
    if (timerRunning) return;
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

  function resetTimer() {
    clearInterval(timerHandle);
    timerHandle = null;
    timerRunning = false;
    timerRemaining = TIMER_SECONDS;
    tStart.disabled = false;
    tPause.disabled = true;
    renderTimer();
  }

  function renderTimer() {
    const m = Math.floor(timerRemaining / 60);
    const s = timerRemaining % 60;
    tDisplay.textContent =
      String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
    tDisplay.classList.remove("warning", "expired");
    if (timerRemaining === 0)        tDisplay.classList.add("expired");
    else if (timerRemaining <= 600)  tDisplay.classList.add("warning"); // last 10 min
  }

  // --- Utils ------------------------------------------------------------

  function formatScore(n) {
    return (Math.round(n * 10) / 10).toString();
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  // Boot
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
