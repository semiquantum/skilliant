/**
 * Day 5 Deliverable: Support Tickets & Desk Help Queue
 */

const SupportTicketsPage = {
    render() {
        const tickets = DataService.getCollection(DataService.KEYS.SUPPORT_TICKETS) || [];

        const rowsHtml = tickets.length > 0 ? tickets.map(t => `
            <tr>
                <td><strong>${t.id}</strong></td>
                <td><strong>${t.subject}</strong></td>
                <td>${t.user}</td>
                <td>${UI.renderBadge(t.priority)}</td>
                <td>${UI.renderBadge(t.status)}</td>
                <td>${t.date}</td>
                <td>
                    <button class="btn btn-outline btn-sm" onclick="SupportTicketsPage.replyModal('${t.id}')">Reply & Resolve</button>
                </td>
            </tr>
        `).join('') : '<tr><td colspan="10" class="text-center text-muted" style="padding: 2rem;">No records found.</td></tr>';

        return `
            ${UI.renderPageHeader('Support Desk & Help Tickets', 'Manage customer inquiries, dispute claims, and support requests.')}
            ${UI.renderControlsBar('ticketSearchInput', 'Search tickets by subject, ID or user...', [
                { id: 'priorityFilter', label: 'Priority', options: ['High', 'Medium', 'Low'] },
                { id: 'ticketStatusFilter', label: 'Status', options: ['Open', 'In Progress', 'Closed'] }
            ])}
            ${UI.renderTable(['Ticket ID', 'Subject', 'Submitted By', 'Priority', 'Status', 'Date', 'Action'], rowsHtml)}
        `;
    },

    init() {
        document.getElementById('ticketSearchInput')?.addEventListener('input', (e) => {
            const val = e.target.value.toLowerCase();
            const rows = document.querySelectorAll('.data-table tbody tr');
            rows.forEach(r => {
                r.style.display = r.textContent.toLowerCase().includes(val) ? '' : 'none';
            });
        });
    },

    replyModal(id) {
        const tickets = DataService.getCollection(DataService.KEYS.SUPPORT_TICKETS);
        const t = tickets.find(x => x.id === id);
        if (!t) return;

        ModalManager.open({
            title: `Support Ticket Response: ${t.id}`,
            bodyHtml: `
                <div style="display:flex; flex-direction:column; gap:1rem;">
                    <div style="background:#F8FAFC; padding:1rem; border-radius:8px; font-size:0.9rem;">
                        <p><strong>Subject:</strong> ${t.subject}</p>
                        <p><strong>User:</strong> ${t.user}</p>
                        <p><strong>Priority:</strong> ${t.priority}</p>
                    </div>

                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Reply Message to Customer</label>
                        <textarea id="ticketReplyMsg" class="form-control" style="width:100%; margin-top:4px; height:100px;" placeholder="Type your response to resolve this issue..."></textarea>
                    </div>

                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Update Status</label>
                        <select id="ticketStatusSelect" class="form-control" style="width:100%; margin-top:4px;">
                            <option value="In Progress" ${t.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                            <option value="Closed" ${t.status === 'Closed' ? 'selected' : ''}>Closed (Resolved)</option>
                        </select>
                    </div>
                </div>
            `,
            submitText: 'Send Reply & Update',
            onSubmit: () => {
                const reply = document.getElementById('ticketReplyMsg')?.value;
                const newStatus = document.getElementById('ticketStatusSelect')?.value;

                t.status = newStatus;
                if (reply) {
                    t.lastReply = reply;
                }
                DataService.setStorage(DataService.KEYS.SUPPORT_TICKETS, tickets);
                DataService.logActivity(`Replied to support ticket ${id} and set status to ${newStatus}`);
                Toast.show(`Ticket ${id} updated to ${newStatus}!`, 'success');
                ModalManager.close();
                App.refreshCurrentPage();
            }
        });
    }
};
