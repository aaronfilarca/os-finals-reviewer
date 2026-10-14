(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.QuizSession = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const owns = (object, key) => Object.prototype.hasOwnProperty.call(object, key);

  class QuizSession {
    constructor(questions, options = {}) {
      if (!Array.isArray(questions)) throw new TypeError('Questions must be an array.');
      this.questions = questions.slice();
      this._byId = new Map();
      this._choiceIds = new Map();
      this._correctIds = new Map();
      for (const question of this.questions) {
        if (!question || typeof question.id !== 'string' || !question.id || this._byId.has(question.id)) {
          throw new TypeError('Each question must have a unique string ID.');
        }
        if (!Array.isArray(question.choices) || !question.choices.length) {
          throw new TypeError('Each question must have choices.');
        }
        const choiceIds = question.choices.map((choice) => choice && choice.id);
        if (choiceIds.some((id) => typeof id !== 'string' || !id) || new Set(choiceIds).size !== choiceIds.length) {
          throw new TypeError('Each choice must have a unique string ID within its question.');
        }
        const correctIds = question.correctChoiceIds;
        const selectionCount = question.selectionCount === undefined ? correctIds && correctIds.length : question.selectionCount;
        if (!Array.isArray(correctIds) || !correctIds.length || new Set(correctIds).size !== correctIds.length ||
            correctIds.some((id) => !choiceIds.includes(id)) || !Number.isInteger(selectionCount) ||
            selectionCount !== correctIds.length) {
          throw new TypeError('Correct choices must be known, distinct, and match the selection count.');
        }
        this._byId.set(question.id, question);
        this._choiceIds.set(question.id, new Set(choiceIds));
        this._correctIds.set(question.id, new Set(correctIds));
      }
      this._originalOrder = this.questions.map((question) => question.id);
      this.order = this._originalOrder.slice();
      this.answers = Object.create(null);
      this.retryIds = null;
      this._storage = options.storage || null;
      this._storageKey = options.storageKey || 'os-reviewer-v1';
      this._random = typeof options.random === 'function' ? options.random : Math.random;
      this._restore();
    }

    _isValidSelection(id, ids) {
      return Array.isArray(ids) && ids.length > 0 && ids.length <= this._choiceIds.get(id).size &&
        new Set(ids).size === ids.length && ids.every((choiceId) => this._choiceIds.get(id).has(choiceId));
    }

    _isFinalSelection(id, ids) {
      const expected = this._correctIds.get(id);
      return ids.some((choiceId) => !expected.has(choiceId)) || ids.length === expected.size;
    }

    _record(id, ids) {
      const selectedIds = ids.slice();
      const expected = this._correctIds.get(id);
      return Object.freeze({
        selectedIds: Object.freeze(selectedIds),
        correct: selectedIds.length === expected.size && selectedIds.every((choiceId) => expected.has(choiceId))
      });
    }

    answer(id, ids) {
      if (!this._byId.has(id)) throw new RangeError('Unknown question.');
      if (owns(this.answers, id)) return this.answers[id];
      if (!this._isValidSelection(id, ids)) {
        throw new RangeError('Select one or more distinct, known choices.');
      }
      if (!this._isFinalSelection(id, ids)) return null;
      const record = this._record(id, ids);
      this.answers[id] = record;
      this.save();
      return record;
    }

    getMissedIds() {
      return this.order.filter((id) => owns(this.answers, id) && !this.answers[id].correct);
    }

    getVisibleIds(moduleId = 'all') {
      const retrySet = this.retryIds === null ? null : new Set(this.retryIds);
      return this.order.filter((id) => (!retrySet || retrySet.has(id)) &&
        (moduleId === 'all' || this._byId.get(id).moduleId === moduleId));
    }

    retryMissed() {
      const missed = this.getMissedIds();
      if (!missed.length) return 0;
      for (const id of missed) delete this.answers[id];
      this.retryIds = missed;
      this.save();
      return missed.length;
    }

    exitRetry() {
      this.retryIds = null;
      this.save();
    }

    shuffle() {
      for (let index = this.order.length - 1; index > 0; index--) {
        const draw = this._random();
        const unit = Number.isFinite(draw) ? Math.min(Math.max(draw, 0), 1 - Number.EPSILON) : 0;
        const other = Math.floor(unit * (index + 1));
        [this.order[index], this.order[other]] = [this.order[other], this.order[index]];
      }
      this.save();
      return this.order.slice();
    }

    reset() {
      this.answers = Object.create(null);
      this.retryIds = null;
      this.order = this._originalOrder.slice();
      this.save();
    }

    stats(ids = this._originalOrder) {
      const knownIds = [...new Set(ids)].filter((id) => this._byId.has(id));
      let correct = 0;
      let incorrect = 0;
      for (const id of knownIds) {
        if (!owns(this.answers, id)) continue;
        if (this.answers[id].correct) correct++;
        else incorrect++;
      }
      const answered = correct + incorrect;
      return {
        total: knownIds.length,
        answered,
        correct,
        incorrect,
        remaining: knownIds.length - answered,
        accuracy: answered ? Math.round((correct / answered) * 100) : 0
      };
    }

    save() {
      if (!this._storage) return;
      try {
        this._storage.setItem(this._storageKey, JSON.stringify({
          version: 1,
          order: this.order,
          answers: this.answers,
          retryIds: this.retryIds
        }));
      } catch (_) {
        // A denied or full browser store must not prevent a quiz attempt.
      }
    }

    _restore() {
      if (!this._storage) return;
      try {
        const raw = this._storage.getItem(this._storageKey);
        if (!raw) return;
        const saved = JSON.parse(raw);
        if (!saved || typeof saved !== 'object' || saved.version !== 1) return;
        if (Array.isArray(saved.order) && saved.order.length === this._originalOrder.length &&
            new Set(saved.order).size === saved.order.length && saved.order.every((id) => this._byId.has(id))) {
          this.order = saved.order.slice();
        }
        if (saved.answers && typeof saved.answers === 'object' && !Array.isArray(saved.answers)) {
          for (const id of this._originalOrder) {
            if (!owns(saved.answers, id)) continue;
            const record = saved.answers[id];
            if (record && typeof record === 'object' && this._isValidSelection(id, record.selectedIds) &&
                this._isFinalSelection(id, record.selectedIds)) {
              this.answers[id] = this._record(id, record.selectedIds);
            }
          }
        }
        if (Array.isArray(saved.retryIds) && saved.retryIds.length &&
            new Set(saved.retryIds).size === saved.retryIds.length && saved.retryIds.every((id) => this._byId.has(id))) {
          this.retryIds = saved.retryIds.slice();
        }
      } catch (_) {
        // Ignore inaccessible storage and invalid JSON; fresh state remains usable.
      }
    }
  }

  return QuizSession;
});
