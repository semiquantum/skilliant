/**
 * ==========================================================================
 * SKILLIANT CONTRACTOR PORTAL - DAY 4: WALLET & FINANCIALS CONTROLLER
 * Features:
 *  - Wallet Balance & Escrow Guarantee Summary
 *  - Deposit & Withdraw Modal Controller with Toast Alerts
 *  - Dynamic Transaction Table rendering with Filter Pills (All, Deposit, Payout, Fee)
 *  - GST Invoice Viewer & Browser Print / PDF Exporter
 *  - Interactive Bar Chart & Skill-wise Expenditure breakdown
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // State Management
  let walletData = {
    summary: {
      totalBalance: 485000,
      escrowLocked: 215000,
      availableBalance: 270000,
      totalPaidOutMonth: 642000
    },
    transactions: [],
    invoices: {},
    reports: { monthlyExpenditure: [], tradeBreakdown: [] }
  };

  let activeCategoryFilter = 'all';

  // DOM Elements
  const DOM = {
    totalBalanceEl: document.getElementById('walletTotalBalance'),
    escrowLockedEl: document.getElementById('walletEscrowLocked'),
    availableBalanceEl: document.getElementById('walletAvailableBalance'),
    paidOutEl: document.getElementById('walletPaidOut'),
    transactionTableBody: document.getElementById('transactionTableBody'),
    transactionSearchInput: document.getElementById('transactionSearchInput'),
    filterPills: document.querySelectorAll('.filter-pill'),
    depositModal: document.getElementById('depositModal'),
    depositModalOverlay: document.getElementById('depositModalOverlay'),
    closeDepositModalBtn: document.getElementById('closeDepositModalBtn'),
    openDepositModalBtn: document.getElementById('openDepositModalBtn'),
    depositForm: document.getElementById('depositForm'),
    invoiceModal: document.getElementById('invoiceModal'),
    invoiceModalOverlay: document.getElementById('invoiceModalOverlay'),
    closeInvoiceModalBtn: document.getElementById('closeInvoiceModalBtn'),
    invoicePreviewArea: document.getElementById('invoicePreviewArea'),
    printInvoiceBtn: document.getElementById('printInvoiceBtn'),
    monthlyChartContainer: document.getElementById('monthlyChartContainer'),
    tradeBreakdownContainer: document.getElementById('tradeBreakdownContainer')
  };

  /* --------------------------------------------------------------------------
     1. INITIALIZATION & DATA FETCHING
     -------------------------------------------------------------------------- */
  async function init() {
    try {
      const response = await fetch('data/wallet.json');
      if (response.ok) {
        walletData = await response.json();
      }
    } catch (err) {
      console.warn('Using default internal wallet data structure:', err);
    }
    
    renderWalletSummary();
    renderTransactionsTable();
    renderFinancialCharts();
    setupEventListeners();
  }

  /* --------------------------------------------------------------------------
     2. SUMMARY RENDERING
     -------------------------------------------------------------------------- */
  function renderWalletSummary() {
    if (DOM.totalBalanceEl) DOM.totalBalanceEl.textContent = formatCurrency(walletData.summary.totalBalance);
    if (DOM.escrowLockedEl) DOM.escrowLockedEl.textContent = formatCurrency(walletData.summary.escrowLocked);
    if (DOM.availableBalanceEl) DOM.availableBalanceEl.textContent = formatCurrency(walletData.summary.availableBalance);
    if (DOM.paidOutEl) DOM.paidOutEl.textContent = formatCurrency(walletData.summary.totalPaidOutMonth);
  }

  function formatCurrency(amount) {
    return '₹' + Number(amount).toLocaleString('en-IN');
  }

  /* --------------------------------------------------------------------------
     3. TRANSACTIONS TABLE & FILTERING
     -------------------------------------------------------------------------- */
  function renderTransactionsTable() {
    if (!DOM.transactionTableBody) return;

    const searchTerm = DOM.transactionSearchInput ? DOM.transactionSearchInput.value.toLowerCase().trim() : '';

    const filtered = walletData.transactions.filter(txn => {
      const matchesCategory = activeCategoryFilter === 'all' || txn.category === activeCategoryFilter;
      const matchesSearch = txn.id.toLowerCase().includes(searchTerm) ||
                            txn.description.toLowerCase().includes(searchTerm) ||
                            txn.recipient.toLowerCase().includes(searchTerm);
      return matchesCategory && matchesSearch;
    });

    DOM.transactionTableBody.innerHTML = '';

    if (filtered.length === 0) {
      DOM.transactionTableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 24px; color: var(--text-dim);">
            No matching transactions found.
          </td>
        </tr>`;
      return;
    }

    filtered.forEach(txn => {
      const tr = document.createElement('tr');
      const formattedDate = new Date(txn.date).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
      });

      let statusBadgeClass = 'completed';
      if (txn.status === 'Escrow Held') statusBadgeClass = 'escrow';
      if (txn.status === 'Pending') statusBadgeClass = 'pending';

      const isNegative = txn.category === 'payout' || txn.category === 'fee';
      const amountPrefix = isNegative ? '- ' : '+ ';
      const amountColor = isNegative ? '#f87171' : '#34d399';

      tr.innerHTML = `
        <td style="font-family: monospace; font-weight: 600; color: var(--primary-blue);">${escapeHTML(txn.id)}</td>
        <td>
          <div style="font-weight: 500; color: var(--text-main);">${escapeHTML(txn.description)}</div>
          <div style="font-size: 0.78rem; color: var(--text-dim);">${escapeHTML(txn.recipient)}</div>
        </td>
        <td style="font-size: 0.82rem; color: var(--text-muted);">${formattedDate}</td>
        <td style="font-weight: 700; color: ${amountColor};">${amountPrefix}${formatCurrency(txn.amount)}</td>
        <td><span class="status-badge ${statusBadgeClass}">${escapeHTML(txn.status)}</span></td>
        <td>
          <button class="btn btn-secondary view-invoice-btn" data-invoice="${txn.invoiceId}" style="padding: 4px 10px; font-size: 0.78rem;">
            Invoice
          </button>
        </td>
      `;

      DOM.transactionTableBody.appendChild(tr);
    });

    // Attach listener to View Invoice buttons
    document.querySelectorAll('.view-invoice-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const invId = e.currentTarget.dataset.invoice;
        openInvoiceModal(invId);
      });
    });
  }

  /* --------------------------------------------------------------------------
     4. INVOICE GENERATOR & PREVIEW MODAL
     -------------------------------------------------------------------------- */
  function openInvoiceModal(invId) {
    let invoice = walletData.invoices[invId];

    // Fallback sample invoice if specific id not found
    if (!invoice) {
      invoice = {
        invoiceNumber: invId || 'INV-2026-0801',
        date: new Date().toLocaleDateString('en-IN'),
        dueDate: new Date().toLocaleDateString('en-IN'),
        status: 'PAID',
        contractor: {
          name: 'Apex Infrastructure Solutions Ltd.',
          gstin: '27AAACA1234H1Z5',
          address: 'Suite 402, Apex Towers, Bandra Kurla Complex, Mumbai, MH',
          phone: '+91 98201 44521'
        },
        billedTo: {
          crewName: 'Labour Crew Lead Settlement',
          site: 'Active Site Workstation'
        },
        items: [
          { description: 'Contract Labour Deployment Charges', qty: 1, rate: 45000, amount: 45000 },
          { description: 'Safety & Equipment Allowance', qty: 1, rate: 3500, amount: 3500 }
        ],
        subtotal: 48500,
        platformCommission: 2425,
        gst: 436.5,
        totalAmount: 51361.5,
        paymentMethod: 'Skilliant Escrow Wallet Transfer'
      };
    }

    renderInvoicePreviewHTML(invoice);
    if (DOM.invoiceModal) DOM.invoiceModal.classList.add('active');
  }

  function renderInvoicePreviewHTML(inv) {
    if (!DOM.invoicePreviewArea) return;

    let itemsRows = inv.items.map(item => `
      <tr>
        <td>${escapeHTML(item.description)}</td>
        <td style="text-align: center;">${item.qty}</td>
        <td style="text-align: right;">₹${item.rate.toLocaleString('en-IN')}</td>
        <td style="text-align: right; font-weight: 600;">₹${item.amount.toLocaleString('en-IN')}</td>
      </tr>
    `).join('');

    DOM.invoicePreviewArea.innerHTML = `
      <div class="invoice-preview-container">
        <div class="invoice-header-flex">
          <div>
            <div class="invoice-logo-title">Skilliant <span>Contractor</span></div>
            <div style="font-size: 0.8rem; color: #64748b; margin-top: 4px;">Verified Labour Settlement Invoice</div>
          </div>
          <div style="text-align: right;">
            <div class="invoice-badge-paid">${inv.status}</div>
            <div style="font-size: 0.85rem; font-weight: 700; color: #0f172a; margin-top: 8px;">${inv.invoiceNumber}</div>
            <div style="font-size: 0.78rem; color: #64748b;">Date: ${inv.date}</div>
          </div>
        </div>

        <div class="invoice-grid-meta">
          <div>
            <strong style="color: #0f172a;">ISSUED BY:</strong>
            <div style="font-weight: 600; color: #1e293b;">${escapeHTML(inv.contractor.name)}</div>
            <div style="color: #475569;">GSTIN: ${escapeHTML(inv.contractor.gstin)}</div>
            <div style="color: #475569;">${escapeHTML(inv.contractor.address)}</div>
          </div>
          <div>
            <strong style="color: #0f172a;">BILLED TO / RECIPIENT:</strong>
            <div style="font-weight: 600; color: #1e293b;">${escapeHTML(inv.billedTo.crewName || 'Labour Deployment')}</div>
            <div style="color: #475569;">Site: ${escapeHTML(inv.billedTo.site || 'Active Site')}</div>
            <div style="color: #475569;">Payment Method: ${escapeHTML(inv.paymentMethod || 'Escrow Transfer')}</div>
          </div>
        </div>

        <table class="invoice-table">
          <thead>
            <tr>
              <th>Description</th>
              <th style="text-align: center;">Units/Days</th>
              <th style="text-align: right;">Rate (₹)</th>
              <th style="text-align: right;">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${itemsRows}
          </tbody>
        </table>

        <div class="invoice-total-box">
          <div class="invoice-total-row">
            <span>Subtotal:</span>
            <span>₹${inv.subtotal.toLocaleString('en-IN')}</span>
          </div>
          <div class="invoice-total-row">
            <span>Platform Commission:</span>
            <span>₹${inv.platformCommission.toLocaleString('en-IN')}</span>
          </div>
          <div class="invoice-total-row">
            <span>GST (18% on Fee):</span>
            <span>₹${inv.gst.toLocaleString('en-IN')}</span>
          </div>
          <div class="invoice-total-row grand-total">
            <span>Total Paid:</span>
            <span>₹${inv.totalAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div style="margin-top: 32px; border-top: 1px dashed #cbd5e1; padding-top: 16px; font-size: 0.78rem; color: #94a3b8; text-align: center;">
          This is a computer-generated tax invoice verified by Skilliant Escrow Payment Gateway. No physical signature required.
        </div>
      </div>
    `;
  }

  function printInvoice() {
    const printContents = DOM.invoicePreviewArea.innerHTML;
    const printWindow = window.open('', '', 'height=650,width=900');
    printWindow.document.write('<html><head><title>Print Invoice - Skilliant</title>');
    printWindow.document.write('<style>');
    printWindow.document.write(`
      body { font-family: 'Inter', sans-serif; padding: 20px; color: #1e293b; }
      .invoice-preview-container { background: #fff; }
      .invoice-header-flex { display: flex; justify-content: space-between; border-bottom: 2px solid #e2e8f0; padding-bottom: 15px; margin-bottom: 20px; }
      .invoice-logo-title { font-size: 20px; font-weight: 800; }
      .invoice-badge-paid { display: inline-block; padding: 4px 10px; background: #dcfce7; color: #15803d; font-weight: bold; }
      .invoice-grid-meta { display: flex; justify-content: space-between; margin-bottom: 20px; }
      .invoice-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
      .invoice-table th, .invoice-table td { border-bottom: 1px solid #e2e8f0; padding: 8px 12px; text-align: left; }
      .invoice-total-box { margin-left: auto; width: 260px; }
      .invoice-total-row { display: flex; justify-content: space-between; padding: 4px 0; }
      .invoice-total-row.grand-total { font-weight: bold; border-top: 2px solid #0f172a; padding-top: 8px; }
    `);
    printWindow.document.write('</style></head><body>');
    printWindow.document.write(printContents);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  }

  /* --------------------------------------------------------------------------
     5. FINANCIAL REPORTS & EXPENDITURE CHARTS
     -------------------------------------------------------------------------- */
  function renderFinancialCharts() {
    // Render Monthly Expenditure Bar Chart
    if (DOM.monthlyChartContainer && walletData.reports.monthlyExpenditure) {
      DOM.monthlyChartContainer.innerHTML = '';
      const maxSpent = Math.max(...walletData.reports.monthlyExpenditure.map(m => m.spent));

      walletData.reports.monthlyExpenditure.forEach(item => {
        const heightPct = Math.round((item.spent / maxSpent) * 100);
        const col = document.createElement('div');
        col.className = 'bar-col';
        col.innerHTML = `
          <div class="bar-fill" style="height: ${heightPct}%;" title="${item.month}: ₹${item.spent.toLocaleString('en-IN')}"></div>
          <span class="bar-label">${escapeHTML(item.month)}</span>
        `;
        DOM.monthlyChartContainer.appendChild(col);
      });
    }

    // Render Trade Breakdown Progress Bars
    if (DOM.tradeBreakdownContainer && walletData.reports.tradeBreakdown) {
      DOM.tradeBreakdownContainer.innerHTML = '';
      walletData.reports.tradeBreakdown.forEach(item => {
        const div = document.createElement('div');
        div.className = 'trade-item';
        div.innerHTML = `
          <div class="trade-header">
            <span>${escapeHTML(item.trade)} (${item.percentage}%)</span>
            <strong>₹${item.amount.toLocaleString('en-IN')}</strong>
          </div>
          <div class="progress-track">
            <div class="progress-fill" style="width: ${item.percentage}%; background-color: ${item.color};"></div>
          </div>
        `;
        DOM.tradeBreakdownContainer.appendChild(div);
      });
    }
  }

  /* --------------------------------------------------------------------------
     6. EVENT LISTENERS & MODAL CONTROLLERS
     -------------------------------------------------------------------------- */
  function setupEventListeners() {
    // Transaction Category Filter Pills
    DOM.filterPills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        DOM.filterPills.forEach(p => p.classList.remove('active'));
        e.currentTarget.classList.add('active');
        activeCategoryFilter = e.currentTarget.dataset.category || 'all';
        renderTransactionsTable();
      });
    });

    // Search Input Event
    if (DOM.transactionSearchInput) {
      DOM.transactionSearchInput.addEventListener('input', renderTransactionsTable);
    }

    // Deposit Funds Modal Toggles
    if (DOM.openDepositModalBtn) {
      DOM.openDepositModalBtn.addEventListener('click', () => {
        if (DOM.depositModal) DOM.depositModal.classList.add('active');
      });
    }

    if (DOM.closeDepositModalBtn) {
      DOM.closeDepositModalBtn.addEventListener('click', () => {
        if (DOM.depositModal) DOM.depositModal.classList.remove('active');
      });
    }

    if (DOM.depositModalOverlay) {
      DOM.depositModalOverlay.addEventListener('click', () => {
        if (DOM.depositModal) DOM.depositModal.classList.remove('active');
      });
    }

    // Deposit Form Submission
    if (DOM.depositForm) {
      DOM.depositForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const amountInput = document.getElementById('depositAmountInput');
        const amount = Number(amountInput ? amountInput.value : 50000);

        walletData.summary.availableBalance += amount;
        walletData.summary.totalBalance += amount;

        // Add deposit transaction
        walletData.transactions.unshift({
          id: `TXN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          date: new Date().toISOString(),
          type: 'Escrow Deposit',
          category: 'deposit',
          description: 'Instant Wallet Deposit via Bank UPI',
          amount: amount,
          status: 'Completed',
          recipient: 'Skilliant Escrow Wallet',
          invoiceId: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`
        });

        renderWalletSummary();
        renderTransactionsTable();

        if (DOM.depositModal) DOM.depositModal.classList.remove('active');
        showToast(`Successfully deposited ₹${amount.toLocaleString('en-IN')} to Escrow Wallet!`);
      });
    }

    // Invoice Modal Close Buttons
    if (DOM.closeInvoiceModalBtn) {
      DOM.closeInvoiceModalBtn.addEventListener('click', () => {
        if (DOM.invoiceModal) DOM.invoiceModal.classList.remove('active');
      });
    }

    if (DOM.invoiceModalOverlay) {
      DOM.invoiceModalOverlay.addEventListener('click', () => {
        if (DOM.invoiceModal) DOM.invoiceModal.classList.remove('active');
      });
    }

    if (DOM.printInvoiceBtn) {
      DOM.printInvoiceBtn.addEventListener('click', printInvoice);
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

  // Initialize script
  init();
});
