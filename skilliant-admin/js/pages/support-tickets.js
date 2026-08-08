/**
 * Day 5 Deliverable: Support Tickets & Desk Help Queue (SaaS-Ready Audit)
 */

const SupportTicketsPage = {
    state: {
        search: '',
        priority: '',
        status: ''
    },

    render() {
        const tickets = DataService.getCollection(DataService.KEYS.SUPPORT_TICKETS) || [];

        // Apply filters
        const filteredTickets = tickets.filter(t => {
            const matchesSearch = t.id.toLowerCase().includes(this.state.search.toLowerCase()) ||
                t.subject.toLowerCase().includes(this.state.search.toLowerCase()) ||
                (t.userName || '').toLowerCase().includes(this.state.search.toLowerCase()) ||
                (t.message || '').toLowerCase().includes(this.state.search.toLowerCase());
            const matchesPriority = !this.state.priority || t.priority === this.state.priority;
            const matchesStatus = !this.state.status || t.status === this.state.status;
            return matchesSearch && matchesPriority && matchesStatus;
        });

        // Paginate
        const paginatedTickets = Pagination.getPageItems('support-tickets', filteredTickets, 10);

        const rowsHtml = paginatedTickets.length > 0 ? paginatedTickets.map(t => `
            <tr>
                <td><strong>${t.id}</strong></td>
                <td><strong>${t.subject}</strong></td>
                <td>${t.userName} <br><small class="text-muted">${t.email}</small></td>
                <td>${UI.renderBadge(t.priority)}</td>
                <td>${UI.renderBadge(t.status)}</td>
                <td>${t.createdAt || '—'}</td>
                <td>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn btn-outline btn-sm" onclick="SupportTicketsPage.replyModal('${t.id}')">
                            <i class="fa-solid fa-reply"></i> Reply & Resolve
                        </button>
                        <button class="btn btn-outline btn-sm text-danger" onclick="SupportTicketsPage.deleteTicket('${t.id}')">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('') : `<tr><td colspan="7" class="text-center text-muted" style="padding: 3rem 1rem;">
            <div style="font-size: 2.5rem; margin-bottom: 0.75rem; opacity: 0.15;"><i class="fa-solid fa-folder-open"></i></div>
            No support tickets found matching current search/filter.
        </td></tr>`;

        const paginationHtml = Pagination.renderControls('support-tickets', filteredTickets.length, 10);

        const openCount       = tickets.filter(t => t.status === 'Open').length;
        const inProgressCount = tickets.filter(t => t.status === 'In Progress').length;
        const resolvedCount   = tickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length;
        const highPriorityCount = tickets.filter(t => t.priority === 'High' && t.status !== 'Closed').length;

        const kpis = [
            { title: 'Open Support Tickets', value: openCount, subtext: 'Awaiting first response', trendUp: false, icon: 'fa-solid fa-envelope-open-text', colorClass: 'kpi-icon-orange' },
            { title: 'In Progress', value: inProgressCount, subtext: 'Under investigation', trendUp: true, icon: 'fa-solid fa-spinner', colorClass: 'kpi-icon-blue' },
            { title: 'Resolved / Closed', value: resolvedCount, subtext: 'Completed tickets', trendUp: true, icon: 'fa-solid fa-circle-check', colorClass: 'kpi-icon-green' },
            { title: 'High Priority Escalations', value: highPriorityCount, subtext: 'Requires urgent action', trendUp: false, icon: 'fa-solid fa-triangle-exclamation', colorClass: 'kpi-icon-red' }
        ];

        return `
            ${UI.renderPageHeader('Support Desk & Help Tickets', 'Manage customer inquiries, dispute claims, and support requests.')}
            ${UI.renderKpiCards(kpis)}
            ${UI.renderControlsBar('ticketSearchInput', 'Search tickets by subject, ID, user or message content...', [
                { id: 'priorityFilter', label: 'Priority', options: ['High', 'Medium', 'Low'] },
                { id: 'ticketStatusFilter', label: 'Status', options: ['Open', 'In Progress', 'Resolved', 'Closed'] }
            ], '', null)}
            ${UI.renderTable(['Ticket ID', 'Subject', 'Submitted By', 'Priority', 'Status', 'Date Opened', 'Actions'], rowsHtml, paginationHtml)}
        `;
    },

    init() {
        const searchEl = document.getElementById('ticketSearchInput');
        const prioEl = document.getElementById('priorityFilter');
        const statusEl = document.getElementById('ticketStatusFilter');

        if (searchEl) {
            searchEl.value = this.state.search;
            searchEl.addEventListener('input', (e) => {
                this.state.search = e.target.value;
                Pagination.getState('support-tickets', 0, 10).page = 1;
                App.refreshCurrentPage();
            });
        }

        if (prioEl) {
            prioEl.value = this.state.priority;
            prioEl.addEventListener('change', (e) => {
                this.state.priority = e.target.value;
                Pagination.getState('support-tickets', 0, 10).page = 1;
                App.refreshCurrentPage();
            });
        }

        if (statusEl) {
            statusEl.value = this.state.status;
            statusEl.addEventListener('change', (e) => {
                this.state.status = e.target.value;
                Pagination.getState('support-tickets', 0, 10).page = 1;
                App.refreshCurrentPage();
            });
        }
    },

    replyModal(id) {
        const tickets = DataService.getCollection(DataService.KEYS.SUPPORT_TICKETS);
        const t = tickets.find(x => x.id === id);
        if (!t) return;

        ModalManager.open({
            title: `Support Ticket Response: ${t.id}`,
            bodyHtml: `
                <div style="display:flex; flex-direction:column; gap:1rem;">
                    <div style="background:var(--primary-blue-light); padding:1rem; border-radius:8px; font-size:0.9rem; border:1px solid var(--border-color);">
                        <p style="margin-bottom:4px;"><strong>Subject:</strong> ${t.subject}</p>
                        <p style="margin-bottom:4px;"><strong>User:</strong> ${t.userName} (${t.email})</p>
                        <p style="margin-bottom:4px;"><strong>Priority:</strong> ${t.priority}</p>
                        <p style="margin-bottom:0;"><strong>Message:</strong> "${t.message}"</p>
                    </div>

                    ${t.lastReply ? `
                    <div style="background:#F1F5F9; padding:0.75rem; border-radius:6px; font-size:0.85rem;">
                        <strong>Previous Reply:</strong> "${t.lastReply}"
                    </div>
                    ` : ''}

                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Reply Message to Customer <span class="text-danger">*</span></label>
                        <textarea id="ticketReplyMsg" class="form-control" style="width:100%; margin-top:4px; height:100px;" placeholder="Type your response to resolve this issue..." required></textarea>
                    </div>

                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Update Status</label>
                        <select id="ticketStatusSelect" class="form-control" style="width:100%; margin-top:4px;">
                            <option value="In Progress" ${t.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                            <option value="Resolved" ${t.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
                            <option value="Closed" ${t.status === 'Closed' ? 'selected' : ''}>Closed</option>
                        </select>
                    </div>
                </div>
            `,
            submitText: 'Send Reply & Update',
            onSubmit: () => {
                const reply = document.getElementById('ticketReplyMsg')?.value.trim();
                const newStatus = document.getElementById('ticketStatusSelect')?.value;

                if (!reply) {
                    Toast.show('Please type a reply message.', 'warning');
                    return;
                }

                t.status = newStatus;
                t.lastReply = reply;
                t.updatedAt = new Date().toISOString().split('T')[0];

                DataService.setStorage(DataService.KEYS.SUPPORT_TICKETS, tickets);
                DataService.logActivity(`Replied to support ticket ${id} and set status to ${newStatus}`);
                Toast.show(`Ticket ${id} updated to ${newStatus}!`, 'success');
                ModalManager.close();
                App.refreshCurrentPage();
            }
        });
    },

    deleteTicket(id) {
        const tickets = DataService.getCollection(DataService.KEYS.SUPPORT_TICKETS);
        const t = tickets.find(x => x.id === id);
        if (!t) return;

        if (confirm(`Are you sure you want to permanently delete support ticket: ${t.subject}?`)) {
            DataService.deleteItem(DataService.KEYS.SUPPORT_TICKETS, 'id', id);
            DataService.logActivity(`Deleted support ticket: ${t.subject}`);
            Toast.show(`Ticket deleted.`, 'info');
            App.refreshCurrentPage();
        }
    }
};
