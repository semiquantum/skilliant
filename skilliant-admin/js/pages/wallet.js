/**
 * Day 3 Deliverable: Wallet & Payout Approvals
 */

const WalletPage = {
    render() {
        const wallet = DataService.getStorage(DataService.KEYS.WALLET) || {};
        const requests = wallet.payoutRequests || [];

        const kpiCardsData = [
            { title: 'Total Escrow Vault Balance', value: wallet.totalEscrowBalance, subtext: 'Secured in bank escrow', trendUp: true, icon: 'lock', colorClass: 'kpi-icon-blue' },
            { title: 'Earned Platform Commission', value: wallet.platformCommissionBalance, subtext: 'Net admin income', trendUp: true, icon: 'account_balance_wallet', colorClass: 'kpi-icon-green' },
            { title: 'Pending Payout Disbursements', value: wallet.pendingPayouts, subtext: 'Awaiting admin release', trendUp: false, icon: 'schedule', colorClass: 'kpi-icon-orange' }
        ];

        const rowsHtml = requests.length > 0 ? requests.map(r => `
            <tr>
                <td><strong>${r.requestId}</strong></td>
                <td><strong>${r.recipient}</strong></td>
                <td><span class="badge badge-info">${r.type}</span></td>
                <td><strong style="color:var(--primary-blue); font-size:1rem;">${r.amount}</strong></td>
                <td>${r.date}</td>
                <td>${UI.renderBadge(r.status)}</td>
                <td>
                    ${r.status === 'Pending Approval' ? `
                        <button class="btn btn-primary btn-sm" onclick="WalletPage.approvePayout('${r.requestId}')">Approve</button>
                    ` : `<span style="color:var(--text-muted); font-size:0.8rem;">Processed</span>`}
                </td>
            </tr>
        `).join('') : '<tr><td colspan="10" class="text-center text-muted" style="padding: 2rem;">No records found.</td></tr>';

        return `
            ${UI.renderPageHeader('Platform Wallet & Payout Disbursements', 'Manage platform escrow reserves and approve talent earnings payouts.')}
            ${UI.renderKpiCards(kpiCardsData)}

            <div class="mb-4">
                <h3 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 1rem;">Payout Clearance Requests</h3>
                ${UI.renderTable(['Request ID', 'Recipient Name', 'Account Type', 'Payout Amount', 'Requested Date', 'Status', 'Action'], rowsHtml)}
            </div>
        `;
    },

    approvePayout(reqId) {
        const wallet = DataService.getStorage(DataService.KEYS.WALLET);
        const req = wallet.payoutRequests.find(x => x.requestId === reqId);
        if (req) {
            req.status = 'Approved';
            DataService.setStorage(DataService.KEYS.WALLET, wallet);
            DataService.logActivity(`Approved earnings payout ${reqId} of ${req.amount} to ${req.recipient}`);
            Toast.show(`Payout ${reqId} for ${req.amount} approved & dispatched!`, 'success');
            App.refreshCurrentPage();
        }
    }
};
