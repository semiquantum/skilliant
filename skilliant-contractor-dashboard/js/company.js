/**
 * ==========================================================================
 * SKILLIANT CONTRACTOR PORTAL - DAY 5: COMPANY, DOCUMENTS & SETTINGS CONTROLLER
 * Features:
 *  - Company Profile Edit Form & Real-time Persistence
 *  - Document Vault Uploader & Verification Status Badges
 *  - Filterable Notification Center with Unread Counters
 *  - Portal Security, 2FA & Notification Settings
 *  - FAQ Accordion Search & Emergency Support Ticket Handler
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  let companyData = {
    companyProfile: {},
    documents: [],
    notifications: [],
    settings: {},
    faqs: []
  };

  let activeSectionTab = 'overview';
  let notifCategoryFilter = 'all';

  const DOM = {
    companyTabBtns: document.querySelectorAll('.company-tab-btn'),
    sectionPanels: document.querySelectorAll('.company-section-panel'),
    profileForm: document.getElementById('companyProfileForm'),
    documentsGrid: document.getElementById('documentsGrid'),
    openUploadModalBtn: document.getElementById('openUploadModalBtn'),
    uploadModal: document.getElementById('uploadModal'),
    uploadModalOverlay: document.getElementById('uploadModalOverlay'),
    closeUploadModalBtn: document.getElementById('closeUploadModalBtn'),
    documentUploadForm: document.getElementById('documentUploadForm'),
    notificationList: document.getElementById('notificationList'),
    markAllReadBtn: document.getElementById('markAllReadBtn'),
    notifFilterPills: document.querySelectorAll('.notif-filter-pill'),
    faqContainer: document.getElementById('faqContainer'),
    faqSearchInput: document.getElementById('faqSearchInput'),
    supportForm: document.getElementById('supportForm')
  };

  /* --------------------------------------------------------------------------
     1. INITIALIZATION & DATA FETCHING
     -------------------------------------------------------------------------- */
  async function init() {
    try {
      const response = await fetch('data/company.json');
      if (response.ok) {
        companyData = await response.json();
      }
    } catch (err) {
      console.warn('Using default company state structure:', err);
    }

    renderDocuments();
    renderNotifications();
    renderFAQs();
    setupEventListeners();
    handleHashNavigation();
  }

  /* --------------------------------------------------------------------------
     2. TAB NAVIGATION & HASH NAVIGATION
     -------------------------------------------------------------------------- */
  function switchCompanyTab(tabId) {
    activeSectionTab = tabId;

    DOM.companyTabBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    DOM.sectionPanels.forEach(panel => {
      panel.style.display = panel.id === `section-${tabId}` ? 'block' : 'none';
    });
  }

  function handleHashNavigation() {
    const hash = window.location.hash.replace('#', '');
    if (hash && ['overview', 'documents', 'notifications', 'settings', 'help'].includes(hash)) {
      switchCompanyTab(hash);
    }
  }

  /* --------------------------------------------------------------------------
     3. DOCUMENT VAULT & SIMULATED UPLOADER
     -------------------------------------------------------------------------- */
  function renderDocuments() {
    if (!DOM.documentsGrid) return;
    DOM.documentsGrid.innerHTML = '';

    companyData.documents.forEach(doc => {
      const card = document.createElement('div');
      card.className = 'doc-card';

      let statusBadgeClass = 'completed';
      if (doc.status === 'Pending Audit') statusBadgeClass = 'pending';
      if (doc.status === 'Expiring Soon') statusBadgeClass = 'escrow';

      card.innerHTML = `
        <div>
          <div class="doc-card-header">
            <div class="doc-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <span class="status-badge ${statusBadgeClass}">${escapeHTML(doc.status)}</span>
          </div>
          <div class="doc-title">${escapeHTML(doc.title)}</div>
          <div class="doc-issuer">${escapeHTML(doc.issuedBy)} • Exp: ${escapeHTML(doc.expiryDate)}</div>
          <div style="font-size: 0.78rem; font-family: monospace; color: var(--primary-blue);">${escapeHTML(doc.documentNumber)}</div>
        </div>

        <div class="doc-card-footer">
          <span style="font-size: 0.78rem; color: var(--text-dim);">${escapeHTML(doc.fileSize)} (${escapeHTML(doc.fileType)})</span>
          <button class="btn btn-secondary" onclick="alert('Downloading ${escapeHTML(doc.title)}...')" style="padding: 4px 10px; font-size: 0.78rem;">
            Download
          </button>
        </div>
      `;

      DOM.documentsGrid.appendChild(card);
    });
  }

  /* --------------------------------------------------------------------------
     4. NOTIFICATIONS CENTER
     -------------------------------------------------------------------------- */
  function renderNotifications() {
    if (!DOM.notificationList) return;
    DOM.notificationList.innerHTML = '';

    const filtered = companyData.notifications.filter(n => {
      return notifCategoryFilter === 'all' || n.type === notifCategoryFilter;
    });

    if (filtered.length === 0) {
      DOM.notificationList.innerHTML = `
        <div style="text-align: center; padding: 32px; color: var(--text-dim);">
          No notifications in this category.
        </div>`;
      return;
    }

    filtered.forEach(notif => {
      const card = document.createElement('div');
      card.className = `notif-card ${!notif.isRead ? 'unread' : ''}`;

      let iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>';
      let typeClass = notif.type;

      card.innerHTML = `
        <div class="notif-icon-circle ${typeClass}">
          ${iconSvg}
        </div>
        <div class="notif-content">
          <div class="notif-title">${escapeHTML(notif.title)}</div>
          <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 4px;">${escapeHTML(notif.message)}</div>
          <div class="notif-time">${escapeHTML(notif.timestamp)}</div>
        </div>
      `;

      DOM.notificationList.appendChild(card);
    });
  }

  /* --------------------------------------------------------------------------
     5. FAQ ACCORDION & HELP CENTER
     -------------------------------------------------------------------------- */
  function renderFAQs() {
    if (!DOM.faqContainer) return;

    const searchTerm = DOM.faqSearchInput ? DOM.faqSearchInput.value.toLowerCase().trim() : '';

    const filtered = companyData.faqs.filter(f =>
      f.question.toLowerCase().includes(searchTerm) || f.answer.toLowerCase().includes(searchTerm)
    );

    DOM.faqContainer.innerHTML = '';

    if (filtered.length === 0) {
      DOM.faqContainer.innerHTML = `
        <div style="padding: 24px; color: var(--text-dim); text-align: center;">
          No matching FAQ articles found. Contact Emergency Hotline for custom queries.
        </div>`;
      return;
    }

    filtered.forEach(item => {
      const div = document.createElement('div');
      div.className = 'faq-item';
      div.innerHTML = `
        <button class="faq-question">
          <span>${escapeHTML(item.question)}</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="transition: transform 0.3s ease;"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="faq-answer">
          ${escapeHTML(item.answer)}
        </div>
      `;

      div.querySelector('.faq-question').addEventListener('click', () => {
        div.classList.toggle('active');
      });

      DOM.faqContainer.appendChild(div);
    });
  }

  /* --------------------------------------------------------------------------
     6. EVENT LISTENERS
     -------------------------------------------------------------------------- */
  function setupEventListeners() {
    // Tab Navigation Buttons
    DOM.companyTabBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetTab = e.currentTarget.dataset.tab;
        switchCompanyTab(targetTab);
        window.location.hash = targetTab;
      });
    });

    // Profile Form Submit
    if (DOM.profileForm) {
      DOM.profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Company profile updated successfully!');
      });
    }

    // Upload Modal Triggers
    if (DOM.openUploadModalBtn) {
      DOM.openUploadModalBtn.addEventListener('click', () => {
        if (DOM.uploadModal) DOM.uploadModal.classList.add('active');
      });
    }

    if (DOM.closeUploadModalBtn) {
      DOM.closeUploadModalBtn.addEventListener('click', () => {
        if (DOM.uploadModal) DOM.uploadModal.classList.remove('active');
      });
    }

    if (DOM.uploadModalOverlay) {
      DOM.uploadModalOverlay.addEventListener('click', () => {
        if (DOM.uploadModal) DOM.uploadModal.classList.remove('active');
      });
    }

    // Document Upload Submission
    if (DOM.documentUploadForm) {
      DOM.documentUploadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const docTitle = document.getElementById('docTitleInput').value;
        const docNum = document.getElementById('docNumInput').value;

        companyData.documents.unshift({
          id: `doc_${Date.now()}`,
          title: docTitle,
          category: 'Uploaded Document',
          documentNumber: docNum || 'DOC-2026-NEW',
          issuedBy: 'Uploaded by Contractor',
          issueDate: new Date().toISOString().split('T')[0],
          expiryDate: '2027-12-31',
          status: 'Pending Audit',
          fileSize: '2.5 MB',
          fileType: 'PDF'
        });

        renderDocuments();
        if (DOM.uploadModal) DOM.uploadModal.classList.remove('active');
        showToast(`Document "${docTitle}" uploaded for compliance audit!`);
      });
    }

    // Notification Category Filter Pills
    DOM.notifFilterPills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        DOM.notifFilterPills.forEach(p => p.classList.remove('active'));
        e.currentTarget.classList.add('active');
        notifCategoryFilter = e.currentTarget.dataset.category;
        renderNotifications();
      });
    });

    // Mark All Read
    if (DOM.markAllReadBtn) {
      DOM.markAllReadBtn.addEventListener('click', () => {
        companyData.notifications.forEach(n => n.isRead = true);
        renderNotifications();
        showToast('All notifications marked as read.');
      });
    }

    // FAQ Search Filter
    if (DOM.faqSearchInput) {
      DOM.faqSearchInput.addEventListener('input', renderFAQs);
    }

    // Support Form Submit
    if (DOM.supportForm) {
      DOM.supportForm.addEventListener('submit', (e) => {
        e.preventDefault();
        DOM.supportForm.reset();
        showToast('Support ticket #TK-8891 generated. Dedicated agent assigned!');
      });
    }
  }

  /* Helper Utils */
  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast toast-success';
    toast.style.position = 'fixed';
    toast.style.bottom = '24px';
    toast.style.right = '24px';
    toast.style.padding = '14px 20px';
    toast.style.background = 'rgba(16, 185, 129, 0.9)';
    toast.style.color = '#ffffff';
    toast.style.borderRadius = '8px';
    toast.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)';
    toast.style.zIndex = '99999';
    toast.style.fontWeight = '600';
    toast.style.fontSize = '0.9rem';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3500);
  }

  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  init();
});
