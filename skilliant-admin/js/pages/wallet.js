/**
 * Day 3 Deliverable: Wallet & Payout Approvals (SaaS-Ready Audit)
 */

const WalletPage = {
    render() {
        const wallet = DataService.getStorage(DataService.KEYS.WALLET) || {
            escrowBalance: 0,
            platformCommission: 0,
            pendingPayouts: 0,
            totalProcessed: 0,
            payoutRequests: []
        };

        // Self-heal/seed payout requests if empty to show active system operations
        if (!wallet.payoutRequests || wallet.payoutRequests.length === 0) {
            wallet.payoutRequests = [
                { requestId: 'PO-001', recipient: 'Carlos Rivera', type: 'Labour', amount: '$324.00', date: new Date(Date.now() - 86400000).toISOString().split('T')[0], status: 'Pending Approval' },
                { requestId: 'PO-002', recipient: 'Marcus Johnson', type: 'Labour', amount: '$432.00', date: new Date(Date.now() - 172800000).toISOString().split('T')[0], status: 'Approved' },
                { requestId: 'PO-003', recipient: 'BuildRight LLC', type: 'Contractor', amount: '$1,080.00', date: new Date(Date.now() - 259200000).toISOString().split('T')[0], status: 'Pending Approval' }
            ];
            DataService.setStorage(DataService.KEYS.WALLET, wallet);
        }

        const requests = wallet.payoutRequests || [];

        const escrowBal = parseFloat(wallet.escrowBalance) || 0;
        const commissionBal = parseFloat(wallet.platformCommission) || 0;
        const pendingBal = parseFloat(wallet.pendingPayouts) || 0;

        const kpiCardsData = [
            { title: 'Total Escrow Vault Balance', value: `$${escrowBal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, subtext: 'Secured in bank escrow', trendUp: true, icon: 'fa-solid fa-lock', colorClass: 'kpi-icon-blue' },
            { title: 'Earned Platform Commission', value: `$${commissionBal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, subtext: 'Net platform income', trendUp: true, icon: 'fa-solid fa-wallet', colorClass: 'kpi-icon-green' },
            { title: 'Pending Payout Disbursements', value: `$${pendingBal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, subtext: 'Awaiting admin release', trendUp: false, icon: 'fa-solid fa-clock', colorClass: 'kpi-icon-orange' }
        ];

        const rowsHtml = requests.length > 0 ? requests.map(r => `
            <tr>
                <td><strong>${r.requestId}</strong></td>
                <td><strong>${r.recipient}</strong></td>
                <td><span class="badge badge-info">${r.type}</span></td>
                <td><strong style="color:var(--primary-blue); font-size:1rem;">${r.amount}</strong></td>
                <td>${r.date}</td>
                <td>${UI.renderBadge(r.status === 'Pending Approval' ? 'Pending' : r.status)}</td>
                <td>
                    ${r.status === 'Pending Approval' ? `
                        <button class="btn btn-primary btn-sm" onclick="WalletPage.approvePayout('${r.requestId}')">
                            <i class="fa-solid fa-check"></i> Approve
                        </button>
                    ` : `<span style="color:var(--text-muted); font-size:0.8rem;"><i class="fa-solid fa-circle-check" style="color:var(--success);"></i> Disbursed</span>`}
                </td>
            </tr>
        `).join('') : '<tr><td colspan="7" class="text-center text-muted" style="padding: 2rem;">No payout requests found.</td></tr>';

        return `
            ${UI.renderPageHeader('Platform Wallet & Payout Disbursements', 'Manage platform escrow reserves and approve talent earnings payouts.')}
            ${UI.renderKpiCards(kpiCardsData)}

            <div class="mb-4">
                <h3 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 1rem; color:var(--primary-navy);">Payout Clearance Requests</h3>
                ${UI.renderTable(['Request ID', 'Recipient Name', 'Account Type', 'Payout Amount', 'Requested Date', 'Status', 'Action'], rowsHtml)}
            </div>
        `;
    },

    approvePayout(reqId) {
        const result = PaymentService.approvePayout(reqId);
        if (result.success) {
            Toast.show(result.message, 'success');
            App.refreshCurrentPage();
        } else {
            Toast.show(result.message, 'warning');
        }
    }
};
