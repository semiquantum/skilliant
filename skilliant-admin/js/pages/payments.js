/**
 * Day 3 Deliverable: Escrow Payments & Transactions Log (SaaS-Ready Audit)
 */

const PaymentsPage = {
    state: {
        search: '',
        status: ''
    },

    render() {
        const payments = DataService.getCollection(DataService.KEYS.PAYMENTS) || [];

        // Apply filters
        const filteredPayments = payments.filter(p => {
            const matchesSearch = p.id.toLowerCase().includes(this.state.search.toLowerCase()) ||
                p.bookingId.toLowerCase().includes(this.state.search.toLowerCase()) ||
                (p.userName || '').toLowerCase().includes(this.state.search.toLowerCase());
            const matchesStatus = !this.state.status || p.status === this.state.status;
            return matchesSearch && matchesStatus;
        });

        // Paginate
        const paginatedPayments = Pagination.getPageItems('payments', filteredPayments, 10);

        const rowsHtml = paginatedPayments.length > 0 ? paginatedPayments.map(p => {
            const amount = parseFloat(p.amount) || 0;
            const fee = parseFloat(p.commissionFee) || 0;
            const payout = amount - fee;

            return `
                <tr>
                    <td><strong>${p.id}</strong></td>
                    <td><code>${p.bookingId}</code></td>
                    <td>${p.userName || '—'}</td>
                    <td><strong>$${amount.toFixed(2)}</strong></td>
                    <td><span style="color:var(--accent-orange); font-weight:700;">$${fee.toFixed(2)}</span></td>
                    <td><strong>$${payout.toFixed(2)}</strong></td>
                    <td>${p.method}</td>
                    <td>${p.date || '—'}</td>
                    <td>${UI.renderBadge(p.status)}</td>
                    <td>
                        <div style="display: flex; gap: 0.5rem;">
                            <button class="btn btn-outline btn-sm" onclick="PaymentsPage.viewDetailsModal('${p.id}')">
                                <i class="fa-solid fa-eye"></i> Details
                            </button>
                            ${p.status !== 'Refunded' ? `
                            <button class="btn btn-outline btn-sm text-danger" onclick="PaymentsPage.refundTransaction('${p.id}')">
                                <i class="fa-solid fa-rotate-left"></i> Refund
                            </button>
                            ` : ''}
                        </div>
                    </td>
                </tr>
            `;
        }).join('') : `<tr><td colspan="10" class="text-center text-muted" style="padding: 3rem 1rem;">
            <div style="font-size: 2.5rem; margin-bottom: 0.75rem; opacity: 0.15;"><i class="fa-solid fa-folder-open"></i></div>
            No transactions found matching current search/filter.
        </td></tr>`;

        const paginationHtml = Pagination.renderControls('payments', filteredPayments.length, 10);

        return `
            ${UI.renderPageHeader('Escrow Transactions & Platform Fees', 'Track payment flows, platform cut, and escrow releases.')}
            ${UI.renderControlsBar('paymentSearchInput', 'Search transaction ID, booking or customer...', [
                { id: 'paymentStatusFilter', label: 'Escrow Status', options: ['Completed', 'Pending', 'Held', 'Refunded'] }
            ], '', { csvFn: 'PaymentsPage.exportCSV', pdfFn: 'PaymentsPage.exportPDF' })}
            ${UI.renderTable(['TXN Ref ID', 'Booking ID', 'Customer', 'Gross Amount', 'Platform Fee (10%)', 'Net Payout', 'Payment Gateway', 'Date', 'Escrow Status', 'Actions'], rowsHtml, paginationHtml)}
        `;
    },

    init() {
        const searchEl = document.getElementById('paymentSearchInput');
        const filterEl = document.getElementById('paymentStatusFilter');

        if (searchEl) {
            searchEl.value = this.state.search;
            searchEl.addEventListener('input', (e) => {
                this.state.search = e.target.value;
                Pagination.getState('payments', 0, 10).page = 1;
                App.refreshCurrentPage();
            });
        }

        if (filterEl) {
            filterEl.value = this.state.status;
            filterEl.addEventListener('change', (e) => {
                this.state.status = e.target.value;
                Pagination.getState('payments', 0, 10).page = 1;
                App.refreshCurrentPage();
            });
        }
    },

    viewDetailsModal(id) {
        const payments = DataService.getCollection(DataService.KEYS.PAYMENTS);
        const p = payments.find(x => x.id === id);
        if (!p) return;

        const amount = parseFloat(p.amount) || 0;
        const fee = parseFloat(p.commissionFee) || 0;
        const payout = amount - fee;

        ModalManager.open({
            title: `Transaction Invoice: ${p.id}`,
            bodyHtml: `
                <div style="display:flex; flex-direction:column; gap:1.25rem;">
                    <div style="display:flex; justify-content:space-between; border-bottom:1px solid var(--border-color); padding-bottom:1rem;">
                        <div>
                            <h4 style="font-weight:700; color:var(--primary-navy); font-size:1.1rem;">Skilliant Invoice</h4>
                            <p style="font-size:0.8rem; color:var(--text-muted);">Platform Transaction Log</p>
                        </div>
                        <div style="text-align:right;">
                            <strong style="font-size:0.9rem;">TXN ID: ${p.id}</strong><br>
                            <span style="font-size:0.8rem; color:var(--text-muted);">Date: ${p.date || 'N/A'}</span>
                        </div>
                    </div>
                    <div style="font-size:0.85rem; line-height:1.6;">
                        <p><strong>Associated Booking ID:</strong> <code>${p.bookingId}</code></p>
                        <p><strong>Client Account:</strong> ${p.userName || 'Unknown'}</p>
                        <p><strong>Payment Gateway:</strong> ${p.method}</p>
                    </div>
                    <table style="width:100%; font-size:0.85rem; border-collapse:collapse; margin-top:0.5rem;">
                        <thead>
                            <tr style="background:#F8FAFC; border-bottom:1px solid var(--border-color);">
                                <th style="text-align:left; padding:8px;">Description</th>
                                <th style="text-align:right; padding:8px;">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="border-bottom:1px solid var(--border-color);">
                                <td style="padding:8px;">Gross Service Fee Hold</td>
                                <td style="text-align:right; padding:8px;">$${amount.toFixed(2)}</td>
                            </tr>
                            <tr style="border-bottom:1px solid var(--border-color);">
                                <td style="padding:8px; color:var(--accent-orange);">Skilliant Escrow Cut (10%)</td>
                                <td style="text-align:right; padding:8px; color:var(--accent-orange);">- $${fee.toFixed(2)}</td>
                            </tr>
                            <tr style="font-weight:700;">
                                <td style="padding:8px;">Net Talent Payout</td>
                                <td style="text-align:right; padding:8px; color:var(--success);">$${payout.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div style="text-align:center; margin-top:0.5rem;">
                        ${UI.renderBadge(p.status)}
                    </div>
                </div>
            `,
            submitText: 'Close',
            onSubmit: () => ModalManager.close()
        });
    },

    refundTransaction(id) {
        const payments = DataService.getCollection(DataService.KEYS.PAYMENTS);
        const p = payments.find(x => x.id === id);
        if (!p) return;

        if (confirm(`Are you sure you want to refund transaction ${p.id} of $${(parseFloat(p.amount) || 0).toFixed(2)}?`)) {
            const result = PaymentService.refundPayment(id);
            if (result.success) {
                Toast.show(result.message, 'success');
                App.refreshCurrentPage();
            } else {
                Toast.show(result.message, 'warning');
            }
        }
    },

    exportCSV() {
        const payments = DataService.getCollection(DataService.KEYS.PAYMENTS) || [];
        const headers = ['TXN Ref ID', 'Booking ID', 'Customer', 'Gross Amount', 'Platform Fee', 'Net Payout', 'Payment Gateway', 'Date', 'Status'];
        const rows = payments.map(p => {
            const amount = parseFloat(p.amount) || 0;
            const fee = parseFloat(p.commissionFee) || 0;
            const payout = amount - fee;
            return [p.id, p.bookingId, p.userName || '', `$${amount.toFixed(2)}`, `$${fee.toFixed(2)}`, `$${payout.toFixed(2)}`, p.method, p.date, p.status];
        });
        ExportUtil.toCSV(headers, rows, 'payments_transactions');
    },

    exportPDF() {
        const payments = DataService.getCollection(DataService.KEYS.PAYMENTS) || [];
        const tableRows = payments.map(p => {
            const amount = parseFloat(p.amount) || 0;
            const fee = parseFloat(p.commissionFee) || 0;
            const payout = amount - fee;
            return `
                <tr>
                    <td>${p.id}</td>
                    <td>${p.bookingId}</td>
                    <td>${p.userName || ''}</td>
                    <td>$${amount.toFixed(2)}</td>
                    <td>$${fee.toFixed(2)}</td>
                    <td>$${payout.toFixed(2)}</td>
                    <td>${p.method}</td>
                    <td>${p.date}</td>
                    <td>${p.status}</td>
                </tr>
            `;
        }).join('');

        const tableHtml = `
            <table>
                <thead>
                    <tr>
                        <th>TXN Ref ID</th>
                        <th>Booking ID</th>
                        <th>Customer</th>
                        <th>Gross</th>
                        <th>Fee</th>
                        <th>Net Payout</th>
                        <th>Gateway</th>
                        <th>Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
        `;
        ExportUtil.print('Skilliant Platform Transactions Report', tableHtml);
    }
};
