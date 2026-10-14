(function () {
  'use strict';
  const data = window.OS_REVIEWER_DATA;
  const $ = (id) => document.getElementById(id);
  const escape = (text) => String(text).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const paths = {
    grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    download: '<path d="M12 3v12m-4-4 4 4 4-4M4 16v4h16v-4"/>',
    book: '<path d="M12 5v16M3 4c4-1 6 0 9 2 3-2 5-3 9-2v15c-4-1-6 0-9 2-3-2-5-3-9-2Z"/>',
    sparkles: '<path d="m12 3 2.7 6.3L21 12l-6.3 2.7L12 21l-2.7-6.3L3 12l6.3-2.7ZM20 2v4m-2-2h4"/>',
    layers: '<path d="m12 3 10 6-10 6L2 9ZM2 13l10 6 10-6M2 17l10 6 10-6"/>',
    pen: '<path d="m16 3 5 5-12 12-6 1 1-6Zm-1 2 5 5M3 21h18"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    cross: '<path d="m6 6 12 12M6 18 18 6"/>',
    retry: '<path d="M3 10a9 9 0 1 1 2 8M3 4v6h6"/>',
    reset: '<path d="M3 11a9 9 0 1 1 2.5 7M3 5v6h6M12 7v5l3 2"/>',
    eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    shuffle: '<path d="M3 6h3l12 12h3M3 18h3l4-4m4-4 4-4h3M17 2l4 4-4 4m0 4 4 4-4 4"/>',
    bolt: '<path d="m13 2-9 12h7l-1 8 10-12h-7Z"/>'
  };
  const icon = (name) => `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.book}</svg>`;
  document.querySelectorAll('[data-icon]').forEach((el) => { el.innerHTML = icon(el.dataset.icon); });
  if (!data || !window.QuizSession) { $('questions').textContent = 'The question data could not load. Refresh the page to try again.'; return; }
  let storage = null;
  try { storage = window.localStorage; } catch (_) {}
  const session = new window.QuizSession(data.questions, {storage, storageKey: 'kernel-os-reviewer-v1'});
  const questionsById = new Map(data.questions.map((q) => [q.id, q]));
  const modulesById = new Map(data.modules.map((m) => [m.id, m]));
  const drafts = new Map();
  let selectedModule = 'all';
  let showAnswers = false;
  let toastTimer;
  const sourceNotes = {
    'm2-q4': {text: 'The supplied key is B. Driver signing actually verifies publisher identity and file integrity using a certificate; A is the closest intended choice. Signing alone does not require that only certified driver versions can be installed.',url:'https://learn.microsoft.com/en-us/windows-hardware/drivers/install/digital-signatures',label:'Microsoft: digital signatures'},
    'm2-q5': {text: 'The supplied explanation understates the limits. Windows Server 2012 / 2012 R2 Hyper-V supports up to 1 TB RAM and 64 virtual processors per VM. The source answer C is preserved.',url:'https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2012-r2-and-2012/jj680093(v=ws.11)',label:'Microsoft: Hyper-V limits'}
  };
  function toast(message) {
    clearTimeout(toastTimer);
    $('toast').textContent = message;
    $('toast').classList.add('visible');
    toastTimer = setTimeout(() => $('toast').classList.remove('visible'), 3000);
  }
  function answerLabels(question) {
    return question.choices.filter((choice) => question.correctChoiceIds.includes(choice.id)).map((choice) => `${choice.id.toUpperCase()}. ${choice.text}`).join(' · ');
  }
  function questionContent(question, listNumber) {
    const answer = session.answers[question.id];
    const draft = drafts.get(question.id) || [];
    const revealed = showAnswers || !!answer;
    const module = modulesById.get(question.moduleId);
    const multi = question.selectionCount > 1;
    const choices = question.choices.map((choice) => {
      const selected = answer ? answer.selectedIds.includes(choice.id) : draft.includes(choice.id);
      const correct = question.correctChoiceIds.includes(choice.id);
      const css = revealed && correct ? ' correct' : answer && selected && !correct ? ' incorrect' : selected ? ' selected' : '';
      const mark = revealed && correct ? icon('check') : answer && selected && !correct ? icon('cross') : selected ? icon('check') : '';
      const status = revealed && correct ? 'Correct answer' : answer && selected && !correct ? 'Your choice, incorrect' : selected ? 'Selected' : '';
      return `<button class="choice${css}" type="button" data-question="${question.id}" data-choice="${choice.id}" aria-pressed="${selected}" ${revealed ? 'disabled' : ''}><span class="choice-letter">${escape(choice.id)}</span><span class="choice-text">${escape(choice.text)}</span><span class="choice-mark">${mark}</span>${status ? `<span class="sr-only">${status}</span>` : ''}</button>`;
    }).join('');
    let feedback = '';
    if (revealed) {
      const note = sourceNotes[question.id];
      const heading = answer ? answer.correct ? 'Correct. You’ve got it.' : 'Incorrect. Here’s the idea.' : 'The correct answer';
      feedback = `<div class="feedback${answer && !answer.correct ? ' wrong' : ''}" role="status"><div class="feedback-heading">${icon(answer && !answer.correct ? 'retry' : 'check')}${heading}</div><div class="answer-key">${escape(answerLabels(question))}</div><p class="feedback-explanation">${escape(question.explanation)}</p>${note ? `<details class="source-note"><summary>Source clarification</summary><p>${escape(note.text)} <a href="${note.url}" target="_blank" rel="noopener noreferrer">${note.label}</a></p></details>` : ''}</div>`;
    }
    const instruction = answer ? 'Answer recorded' : showAnswers ? 'Answer view' : multi ? `Select all ${question.selectionCount} correct choices. One wrong choice ends this attempt.` : 'Click a choice to reveal the explanation.';
    return `<div class="question-meta"><div class="flex items-center gap-3"><span class="question-index">QUESTION ${String(listNumber).padStart(2,'0')}</span><span class="question-module">Module ${module.number} · ${escape(module.title)}</span></div>${multi ? `<span class="selection-tag">Select ${question.selectionCount}</span>` : ''}</div><h3 class="question-prompt" id="${question.id}-prompt">${escape(question.prompt)}</h3><div class="choices" role="group" aria-labelledby="${question.id}-prompt">${choices}</div><div class="question-bottom"><span>${instruction}</span><span class="draft-hint">${!revealed && multi ? `${draft.length} / ${question.selectionCount} selected` : `Source Q${question.number}`}</span></div>${feedback}`;
  }
  function updateStats() {
    const stats = session.stats();
    $('stat-total').textContent = stats.total;
    $('stat-answered').textContent = stats.answered;
    $('stat-correct').textContent = stats.correct;
    $('stat-incorrect').textContent = stats.incorrect;
    const percent = Math.round(stats.answered / stats.total * 100);
    $('progress-percent').textContent = percent;
    $('progress-fill').style.width = `${percent}%`;
    const bar = document.querySelector('[role="progressbar"]');
    bar.setAttribute('aria-valuenow', stats.answered);
    bar.setAttribute('aria-valuemax', stats.total);
    $('progress-fraction').textContent = `${stats.answered} of ${stats.total} answered`;
    $('progress-accuracy').textContent = stats.answered ? `${stats.accuracy}% accuracy` : '— accuracy';
    $('progress-caption').textContent = !stats.answered ? 'A fresh start. Let’s get into it.' : !stats.remaining ? 'Every question explored. Keep strengthening the tricky ones.' : `${stats.remaining} more opportunities to learn something.`;
    $('retry-button').disabled = !stats.incorrect;
    $('retry-label').textContent = `Retry incorrect (${stats.incorrect})`;
    $('retry-banner').classList.toggle('hidden', !session.retryIds);
    if (session.retryIds) {
      const retryStats = session.stats(session.retryIds);
      $('retry-caption').textContent = `${retryStats.answered} of ${retryStats.total} reattempted · ${retryStats.correct} correct this round`;
    }
    $('all-modules').classList.toggle('active', selectedModule === 'all');
    document.querySelectorAll('.module-nav-item').forEach((el) => el.classList.toggle('active', el.dataset.module === selectedModule));
    $('reveal-banner').classList.toggle('hidden', !showAnswers);
    $('show-answers').setAttribute('aria-pressed', String(showAnswers));
    $('show-answers').innerHTML = `${icon('eye')}<span>${showAnswers ? 'Hide all answers' : 'Show all answers'}</span>`;
  }
  function renderQuestions() {
    const ids = session.getVisibleIds(selectedModule);
    $('questions').innerHTML = ids.map((id, index) => `<article class="question-card" id="${id}" data-list-number="${index + 1}" aria-labelledby="${id}-prompt">${questionContent(questionsById.get(id),index + 1)}</article>`).join('');
    $('list-count').textContent = `${ids.length} question${ids.length === 1 ? '' : 's'}`;
    $('empty-state').classList.toggle('hidden', ids.length !== 0);
    $('list-hint').textContent = showAnswers ? 'Review every answer at your own pace.' : 'Select a choice to see how you did.';
    $('module-select').value = selectedModule;
    updateStats();
  }
  function setModule(id) { selectedModule = id; renderQuestions(); }
  $('module-nav').innerHTML = data.modules.map((module) => `<button class="module-nav-item" data-module="${module.id}" type="button"><span class="module-num">${String(module.number).padStart(2,'0')}</span><span class="module-nav-title">${escape(module.title)}</span><span class="module-count">${module.questionCount}</span></button>`).join('');
  $('module-select').innerHTML += data.modules.map((module) => `<option value="${module.id}">M${String(module.number).padStart(2,'0')} · ${escape(module.title)}</option>`).join('');
  $('module-nav').addEventListener('click', (event) => { const button = event.target.closest('[data-module]'); if (button) setModule(button.dataset.module); });
  $('all-modules').addEventListener('click', () => { session.exitRetry(); setModule('all'); });
  $('module-select').addEventListener('change', (event) => setModule(event.target.value));
  $('questions').addEventListener('click', (event) => {
    const button = event.target.closest('[data-choice]');
    if (!button || showAnswers) return;
    const question = questionsById.get(button.dataset.question);
    if (session.answers[question.id]) return;
    let selected = drafts.get(question.id) || [];
    selected = selected.includes(button.dataset.choice) ? selected.filter((id) => id !== button.dataset.choice) : selected.concat(button.dataset.choice);
    drafts.set(question.id, selected);
    let result = null;
    if (selected.length) result = session.answer(question.id, selected);
    const card = $(question.id);
    card.innerHTML = questionContent(question, Number(card.dataset.listNumber));
    updateStats();
    if (result) {
      drafts.delete(question.id);
      const feedback = card.querySelector('.feedback');
      feedback.setAttribute('tabindex','-1');
      feedback.focus({preventScroll:true});
    } else {
      card.querySelector(`[data-choice="${button.dataset.choice}"]`)?.focus({preventScroll:true});
    }
  });
  $('show-answers').addEventListener('click', () => {
    showAnswers = !showAnswers;
    if (showAnswers) {
      session.exitRetry();
      selectedModule = 'all';
      toast('All 212 answers are visible. Your score stays the same.');
    }
    renderQuestions();
  });
  $('shuffle-button').addEventListener('click', () => { session.shuffle(); renderQuestions(); toast('Questions shuffled. Your progress is saved.'); });
  $('retry-button').addEventListener('click', () => {
    const count = session.retryMissed();
    if (!count) return;
    showAnswers = false;
    selectedModule = 'all';
    drafts.clear();
    renderQuestions();
    toast(`A fresh attempt at ${count} missed question${count === 1 ? '' : 's'}.`);
    $('questions').scrollIntoView({behavior:'smooth', block:'start'});
  });
  function exitRetry() { session.exitRetry(); setModule('all'); }
  $('exit-retry').addEventListener('click', exitRetry);
  $('empty-back').addEventListener('click', exitRetry);
  $('reset-button').addEventListener('click', () => $('reset-dialog').showModal());
  $('reset-dialog').addEventListener('close', () => {
    if ($('reset-dialog').returnValue !== 'reset') return;
    session.reset();
    drafts.clear();
    showAnswers = false;
    selectedModule = 'all';
    renderQuestions();
    toast('Progress reset. Ready for a fresh start.');
  });
  renderQuestions();
})();
