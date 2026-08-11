/**
 * Renewal Desk — Application Logic
 *
 * Single-file vanilla JavaScript application for tracking insurance policy renewals.
 * Uses localStorage for persistence. No external dependencies.
 */

(function () {
  'use strict';

  // ─── CONSTANTS ───────────────────────────────────

  const STORAGE_KEY = 'renewaldesk_policies';
  const STATUSES = ['not_started', 'in_progress', 'done'];
  const STATUS_LABELS = {
    not_started: 'Not Started',
    in_progress: 'In Progress',
    done: 'Done'
  };
  const NEXT_STATUS = {
    not_started: 'in_progress',
    in_progress: 'done',
    done: 'not_started'
  };

  // ─── SEED DATA ───────────────────────────────────

  function _generateSeedData() {
    const today = new Date();

    function _offsetDate(days) {
      const d = new Date(today);
      d.setDate(d.getDate() + days);
      return d.toISOString().split('T')[0];
    }

    return [
      {
        id: _generateId(),
        clientName: 'Greenfield Manufacturing Ltd',
        policyNumber: 'POL-2024-004821',
        renewalDate: _offsetDate(15),
        handler: 'Sarah Chen',
        status: 'not_started',
        createdAt: new Date().toISOString()
      },
      {
        id: _generateId(),
        clientName: 'Baxter & Associates Legal',
        policyNumber: 'POL-2024-003197',
        renewalDate: _offsetDate(8),
        handler: 'James Morton',
        status: 'in_progress',
        createdAt: new Date().toISOString()
      },
      {
        id: _generateId(),
        clientName: 'Riverside Medical Group',
        policyNumber: 'POL-2024-005540',
        renewalDate: _offsetDate(45),
        handler: 'Sarah Chen',
        status: 'not_started',
        createdAt: new Date().toISOString()
      },
      {
        id: _generateId(),
        clientName: 'TechVault Solutions Inc',
        policyNumber: 'POL-2024-002883',
        renewalDate: _offsetDate(3),
        handler: 'Priya Kapoor',
        status: 'in_progress',
        createdAt: new Date().toISOString()
      },
      {
        id: _generateId(),
        clientName: 'Harborview Hotels Group',
        policyNumber: 'POL-2024-006102',
        renewalDate: _offsetDate(22),
        handler: 'James Morton',
        status: 'done',
        createdAt: new Date().toISOString()
      },
      {
        id: _generateId(),
        clientName: 'Pinnacle Sports Academy',
        policyNumber: 'POL-2024-001475',
        renewalDate: _offsetDate(60),
        handler: 'Priya Kapoor',
        status: 'not_started',
        createdAt: new Date().toISOString()
      }
    ];
  }

  // ─── DATA LAYER ──────────────────────────────────

  function loadPolicies() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw === null) {
        const seed = _generateSeedData();
        savePolicies(seed);
        return seed;
      }
      return JSON.parse(raw);
    } catch (e) {
      console.warn('Renewal Desk: Could not load from localStorage, using seed data.', e);
      return _generateSeedData();
    }
  }

  function savePolicies(policies) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(policies));
    } catch (e) {
      console.warn('Renewal Desk: Could not save to localStorage.', e);
    }
  }

  function addPolicy(data) {
    const policies = loadPolicies();
    const newPolicy = {
      id: _generateId(),
      clientName: data.clientName.trim(),
      policyNumber: data.policyNumber.trim(),
      renewalDate: data.renewalDate,
      handler: data.handler.trim(),
      status: 'not_started',
      createdAt: new Date().toISOString()
    };
    policies.unshift(newPolicy);
    savePolicies(policies);
    return newPolicy;
  }

  function updatePolicyStatus(id) {
    const policies = loadPolicies();
    const policy = policies.find(function (p) { return p.id === id; });
    if (policy) {
      policy.status = NEXT_STATUS[policy.status] || 'not_started';
      savePolicies(policies);
    }
    return policies;
  }

  // ─── UTILITY FUNCTIONS ───────────────────────────

  function _generateId() {
    return 'pol_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
  }

  function _calculateDaysUntil(dateString) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateString + 'T00:00:00');
    const diffMs = target - today;
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  }

  function _formatDate(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  }

  function _countUpcoming(policies) {
    let count = 0;
    for (let i = 0; i < policies.length; i++) {
      const p = policies[i];
      if (p.status === 'done') continue;
      const days = _calculateDaysUntil(p.renewalDate);
      if (days >= 0 && days <= 30) {
        count++;
      }
    }
    return count;
  }

  function _sortPolicies(policies) {
    return policies.slice().sort(function (a, b) {
      const daysA = _calculateDaysUntil(a.renewalDate);
      const daysB = _calculateDaysUntil(b.renewalDate);
      // Overdue first (negative), then ascending by days
      return daysA - daysB;
    });
  }

  function _getDaysClass(days) {
    if (days < 0) return 'days-overdue';
    if (days === 0) return 'days-today';
    if (days <= 7) return 'days-urgent';
    if (days <= 30) return 'days-soon';
    return 'days-normal';
  }

  function _getDaysText(days) {
    if (days < 0) return 'Overdue';
    if (days === 0) return 'Today';
    return days + ' day' + (days === 1 ? '' : 's');
  }

  function _getRowUrgencyClass(days, status) {
    if (status === 'done') return 'policy-row--normal';
    if (days < 0) return 'policy-row--overdue';
    if (days <= 7) return 'policy-row--urgent';
    if (days <= 30) return 'policy-row--soon';
    return 'policy-row--normal';
  }

  function _getCardUrgencyClass(days, status) {
    if (status === 'done') return '';
    if (days < 0) return 'policy-card--overdue';
    if (days <= 7) return 'policy-card--urgent';
    if (days <= 30) return 'policy-card--soon';
    return '';
  }

  function _getStatusBadgeClass(status) {
    return 'status-badge status-badge--' + status.replace('_', '-');
  }

  function _getNextStatusLabel(status) {
    const next = NEXT_STATUS[status];
    return STATUS_LABELS[next];
  }

  function _escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ─── RENDERING ───────────────────────────────────

  let elements = {};
  let _newPolicyId = null;

  function renderCounter(policies) {
    const count = _countUpcoming(policies);
    elements.counterNumber.textContent = count;
  }

  function renderResultCount(shown, total) {
    elements.resultCount.textContent = 'Showing ' + shown + ' of ' + total;
  }

  function renderPolicies(policies, newId) {
    const sorted = _sortPolicies(policies);
    const searchTerm = elements.searchInput.value.toLowerCase().trim();

    let filtered;
    if (searchTerm) {
      filtered = sorted.filter(function (p) {
        return p.clientName.toLowerCase().includes(searchTerm);
      });
    } else {
      filtered = sorted;
    }

    renderResultCount(filtered.length, policies.length);
    renderCounter(policies);

    // Show/hide empty state
    if (filtered.length === 0) {
      elements.emptyState.style.display = 'flex';
      elements.tableContainer.style.display = 'none';
      elements.cardsContainer.innerHTML = '';
      elements.tableBody.innerHTML = '';
      return;
    }

    elements.emptyState.style.display = 'none';

    // Render table (desktop)
    _renderTable(filtered, newId);

    // Render cards (mobile)
    _renderCards(filtered, newId);
  }

  function _renderTable(policies, newId) {
    let html = '';
    for (let i = 0; i < policies.length; i++) {
      const p = policies[i];
      const days = _calculateDaysUntil(p.renewalDate);
      const urgencyClass = _getRowUrgencyClass(days, p.status);
      const daysClass = _getDaysClass(days);
      const daysText = _getDaysText(days);
      const dateFormatted = _formatDate(p.renewalDate);
      const badgeClass = _getStatusBadgeClass(p.status);
      const statusLabel = STATUS_LABELS[p.status];
      const nextLabel = _getNextStatusLabel(p.status);
      const isNew = (p.id === newId) ? ' policy-row--new' : '';

      html += '<tr class="' + urgencyClass + isNew + '" data-policy-id="' + _escapeHtml(p.id) + '">';
      html += '<td class="cell-client">' + _escapeHtml(p.clientName) + '</td>';
      html += '<td class="cell-policy">' + _escapeHtml(p.policyNumber) + '</td>';
      html += '<td class="cell-date">';
      html += '<span class="cell-date__date">' + dateFormatted + '</span>';
      html += '<span class="cell-date__days ' + daysClass + '">' + daysText + '</span>';
      html += '</td>';
      html += '<td class="cell-handler">' + _escapeHtml(p.handler) + '</td>';
      html += '<td class="cell-status">';
      html += '<button class="' + badgeClass + '" ';
      html += 'aria-label="Status: ' + statusLabel + '. Click to change to ' + nextLabel + '." ';
      html += 'data-policy-id="' + _escapeHtml(p.id) + '" ';
      html += 'data-action="cycle-status">';
      html += statusLabel;
      html += '</button>';
      html += '</td>';
      html += '</tr>';
    }
    elements.tableBody.innerHTML = html;

    // Restore table container visibility on desktop
    // (CSS handles display via media query, but we need to undo the empty-state hide)
    elements.tableContainer.style.display = '';
  }

  function _renderCards(policies, newId) {
    const calendarIcon = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<rect x="1" y="2.5" width="12" height="10" rx="1.5" stroke="currentColor" stroke-width="1.2" fill="none"/>' +
      '<path d="M1 5.5h12" stroke="currentColor" stroke-width="1.2"/>' +
      '<path d="M4 1v2.5M10 1v2.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>' +
      '</svg>';

    let html = '';
    for (let i = 0; i < policies.length; i++) {
      const p = policies[i];
      const days = _calculateDaysUntil(p.renewalDate);
      const urgencyClass = _getCardUrgencyClass(days, p.status);
      const daysClass = _getDaysClass(days);
      const daysText = _getDaysText(days);
      const dateFormatted = _formatDate(p.renewalDate);
      const badgeClass = _getStatusBadgeClass(p.status);
      const statusLabel = STATUS_LABELS[p.status];
      const nextLabel = _getNextStatusLabel(p.status);
      const isNew = (p.id === newId) ? ' policy-card--new' : '';

      html += '<div class="policy-card ' + urgencyClass + isNew + '" data-policy-id="' + _escapeHtml(p.id) + '">';
      html += '<div class="policy-card__client">' + _escapeHtml(p.clientName) + '</div>';
      html += '<div class="policy-card__policy-number">' + _escapeHtml(p.policyNumber) + '</div>';
      html += '<hr class="policy-card__divider">';
      html += '<div class="policy-card__meta">';
      html += '<span class="policy-card__date-group">';
      html += calendarIcon + ' ';
      html += dateFormatted;
      html += '<span class="policy-card__days-separator"> &middot; </span>';
      html += '<span class="' + daysClass + '">' + daysText + '</span>';
      html += '</span>';
      html += '<span class="policy-card__handler">' + _escapeHtml(p.handler) + '</span>';
      html += '</div>';
      html += '<button class="' + badgeClass + '" ';
      html += 'aria-label="Status: ' + statusLabel + '. Click to change to ' + nextLabel + '." ';
      html += 'data-policy-id="' + _escapeHtml(p.id) + '" ';
      html += 'data-action="cycle-status">';
      html += statusLabel;
      html += '</button>';
      html += '</div>';
    }
    elements.cardsContainer.innerHTML = html;
  }

  // ─── EVENT HANDLERS ──────────────────────────────

  function handleFormSubmit(e) {
    e.preventDefault();

    const fields = [
      { input: elements.inputClientName, error: elements.errorClientName },
      { input: elements.inputPolicyNumber, error: elements.errorPolicyNumber },
      { input: elements.inputRenewalDate, error: elements.errorRenewalDate },
      { input: elements.inputHandler, error: elements.errorHandler }
    ];

    let isValid = true;

    // Clear all errors first
    for (let i = 0; i < fields.length; i++) {
      fields[i].input.classList.remove('input-error');
      fields[i].error.classList.remove('visible');
    }

    // Validate
    for (let i = 0; i < fields.length; i++) {
      if (!fields[i].input.value.trim()) {
        fields[i].input.classList.add('input-error');
        fields[i].error.classList.add('visible');
        isValid = false;
      }
    }

    if (!isValid) return;

    const data = {
      clientName: elements.inputClientName.value,
      policyNumber: elements.inputPolicyNumber.value,
      renewalDate: elements.inputRenewalDate.value,
      handler: elements.inputHandler.value
    };

    const newPolicy = addPolicy(data);
    _newPolicyId = newPolicy.id;

    // Clear form
    elements.form.reset();

    // Re-render
    const policies = loadPolicies();
    renderPolicies(policies, _newPolicyId);

    // Clear the new highlight after animation
    setTimeout(function () {
      _newPolicyId = null;
    }, 1300);
  }

  function handleStatusClick(e) {
    const btn = e.target.closest('[data-action="cycle-status"]');
    if (!btn) return;

    const policyId = btn.getAttribute('data-policy-id');
    if (!policyId) return;

    const policies = updatePolicyStatus(policyId);
    renderPolicies(policies);
  }

  function handleSearchInput() {
    const policies = loadPolicies();
    renderPolicies(policies);
  }

  function handleInputClearError(e) {
    const input = e.target;
    if (input.classList.contains('input-error') && input.value.trim()) {
      input.classList.remove('input-error');
      // Find the corresponding error message
      const errorEl = input.parentElement.querySelector('.form-error');
      if (errorEl) {
        errorEl.classList.remove('visible');
      }
    }
  }

  // ─── INITIALIZATION ──────────────────────────────

  document.addEventListener('DOMContentLoaded', function () {
    // Cache DOM elements
    elements = {
      counterNumber: document.getElementById('counter-number'),
      form: document.getElementById('add-policy-form'),
      inputClientName: document.getElementById('input-client-name'),
      inputPolicyNumber: document.getElementById('input-policy-number'),
      inputRenewalDate: document.getElementById('input-renewal-date'),
      inputHandler: document.getElementById('input-handler'),
      errorClientName: document.getElementById('error-client-name'),
      errorPolicyNumber: document.getElementById('error-policy-number'),
      errorRenewalDate: document.getElementById('error-renewal-date'),
      errorHandler: document.getElementById('error-handler'),
      searchInput: document.getElementById('search-input'),
      resultCount: document.getElementById('search-result-count'),
      tableContainer: document.getElementById('policy-table-container'),
      tableBody: document.getElementById('policy-table-body'),
      cardsContainer: document.getElementById('policy-cards-container'),
      emptyState: document.getElementById('empty-state')
    };

    // Load and render initial data
    const policies = loadPolicies();
    renderPolicies(policies);

    // Event listeners
    elements.form.addEventListener('submit', handleFormSubmit);

    // Event delegation for status badge clicks (table)
    elements.tableBody.addEventListener('click', handleStatusClick);

    // Event delegation for status badge clicks (cards)
    elements.cardsContainer.addEventListener('click', handleStatusClick);

    // Search input
    elements.searchInput.addEventListener('input', handleSearchInput);

    // Clear error on input for form fields
    elements.inputClientName.addEventListener('input', handleInputClearError);
    elements.inputPolicyNumber.addEventListener('input', handleInputClearError);
    elements.inputRenewalDate.addEventListener('input', handleInputClearError);
    elements.inputHandler.addEventListener('input', handleInputClearError);
  });

})();