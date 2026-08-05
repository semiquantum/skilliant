/**
 * Day 3 Deliverable: Escrow Payments & Transactions Log
 */

const PaymentsPage = {
    render() {
        const payments = DataService.getCollection(DataService.KEYS.PAYMENTS) || [];

        const rowsHtml = payments.length > 0 ? payments.map(p => `
            <tr>
                <td><strong>${p.transactionId}</strong></td>
                <td><code>${p.bookingId}</code></td>
                <td><strong>${p.amount}</strong></td>
                <td><span style="color:var(--accent-orange); font-weight:700;">${p.commissionFee}</span></td>
                <td><strong>${p.payoutAmount}</strong></td>
                <td>${p.method}</td>
                <td>${p.date}</td>
                <td>${UI.renderBadge(p.status)}</td>
            </tr>
        `).join('') : '<tr><td colspan="10" class="text-center text-muted" style="padding: 2rem;">No records found.</td></tr>';

        return `
            ${UI.renderPageHeader('Escrow Transactions & Platform Fees', 'Track payment flows, platform cut, and escrow releases.')}
            ${UI.renderControlsBar('paymentSearchInput', 'Search transaction ID or booking ID...', [])}
            ${UI.renderTable(['TXN Ref ID', 'Booking ID', 'Gross Amount', 'Platform Fee (10%)', 'Net Payout', 'Payment Gateway', 'Date', 'Escrow Status'], rowsHtml)}
        `;
    },

    init() {
        document.getElementById('paymentSearchInput')?.addEventListener('input', (e) => {
            const val = e.target.value.toLowerCase();
            const rows = document.querySelectorAll('.data-table tbody tr');
            rows.forEach(r => {
                r.style.display = r.textContent.toLowerCase().includes(val) ? '' : 'none';
            });
        });
    }
};
