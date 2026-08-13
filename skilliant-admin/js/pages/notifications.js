/**
 * Day 5 Deliverable: Broadcast Notifications Module (SaaS-Ready Audit)
 */

const NotificationsPage = {
    state: {
        search: '',
        status: ''
    },

    render() {
        const list = DataService.getCollection(DataService.KEYS.NOTIFICATIONS) || [];

        // Apply filters
        const filteredNotifs = list.filter(n => {
            const matchesSearch = n.title.toLowerCase().includes(this.state.search.toLowerCase()) ||
                n.message.toLowerCase().includes(this.state.search.toLowerCase()) ||
                (n.category || '').toLowerCase().includes(this.state.search.toLowerCase());
            
            let matchesStatus = true;
            if (this.state.status === 'Unread') matchesStatus = n.unread;
            else if (this.state.status === 'Read') matchesStatus = !n.unread;
            
            return matchesSearch && matchesStatus;
        });

        // Paginate
        const paginatedNotifs = Pagination.getPageItems('notifications', filteredNotifs, 10);

        const rowsHtml = paginatedNotifs.length > 0 ? paginatedNotifs.map(n => `
            <tr>
                <td><strong>${n.id}</strong></td>
                <td><strong>${n.title}</strong></td>
                <td style="max-width:300px; font-size:0.85rem; line-height:1.4;">${n.message}</td>
                <td><span class="badge badge-info">${n.category}</span></td>
                <td>${n.time}</td>
                <td>${n.unread ? UI.renderBadge('Unread', 'warning') : UI.renderBadge('Read', 'secondary')}</td>
                <td>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn btn-outline btn-sm" onclick="NotificationsPage.toggleRead('${n.id}')">
                            <i class="fa-solid ${n.unread ? 'fa-envelope-open' : 'fa-envelope'}"></i> ${n.unread ? 'Read' : 'Unread'}
                        </button>
                        <button class="btn btn-outline btn-sm text-danger" onclick="NotificationsPage.deleteNotif('${n.id}')">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('') : `<tr><td colspan="7" class="text-center text-muted" style="padding: 3rem 1rem;">
            <div style="font-size: 2.5rem; margin-bottom: 0.75rem; opacity: 0.15;"><i class="fa-solid fa-folder-open"></i></div>
            No notifications found matching current search/filter.
        </td></tr>`;

        const paginationHtml = Pagination.renderControls('notifications', filteredNotifs.length, 10);

        return `
            ${UI.renderPageHeader('Platform Notifications & Broadcasts', 'Send push alerts to users and review system notifications.', `
                <button class="btn btn-primary" onclick="NotificationsPage.broadcastModal()">
                    <i class="fa-solid fa-bullhorn"></i> Send Push Broadcast
                </button>
            `)}
            ${UI.renderControlsBar('notifSearchInput', 'Search notifications...', [
                { id: 'notifStatusFilter', label: 'Filter Status', options: ['Unread', 'Read'] }
            ], '', null)}
            ${UI.renderTable(['Notification ID', 'Title / Alert', 'Message Body', 'Category', 'Time Sent', 'Status', 'Actions'], rowsHtml, paginationHtml)}
        `;
    },

    init() {
        const searchEl = document.getElementById('notifSearchInput');
        const filterEl = document.getElementById('notifStatusFilter');

        if (searchEl) {
            searchEl.value = this.state.search;
            searchEl.addEventListener('input', (e) => {
                this.state.search = e.target.value;
                Pagination.getState('notifications', 0, 10).page = 1;
                App.refreshCurrentPage();
            });
        }

        if (filterEl) {
            filterEl.value = this.state.status;
            filterEl.addEventListener('change', (e) => {
                this.state.status = e.target.value;
                Pagination.getState('notifications', 0, 10).page = 1;
                App.refreshCurrentPage();
            });
        }
    },

    toggleRead(id) {
        const notifications = DataService.getCollection(DataService.KEYS.NOTIFICATIONS);
        const n = notifications.find(x => x.id === id);
        if (n) {
            n.unread = !n.unread;
            DataService.setStorage(DataService.KEYS.NOTIFICATIONS, notifications);
            Toast.show(`Notification marked as ${n.unread ? 'unread' : 'read'}.`, 'success');
            App.refreshCurrentPage();
        }
    },

    deleteNotif(id) {
        const notifications = DataService.getCollection(DataService.KEYS.NOTIFICATIONS);
        const n = notifications.find(x => x.id === id);
        if (!n) return;

        if (confirm(`Are you sure you want to permanently delete this notification?`)) {
            DataService.deleteItem(DataService.KEYS.NOTIFICATIONS, 'id', id);
            DataService.logActivity(`Deleted notification alert: ${n.title}`);
            Toast.show(`Notification deleted.`, 'info');
            App.refreshCurrentPage();
        }
    },

    broadcastModal() {
        ModalManager.open({
            title: 'Broadcast Announcement Push Alert',
            bodyHtml: `
                <div style="display:flex; flex-direction:column; gap:1rem;">
                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Target Audience</label>
                        <select id="notifTarget" class="form-control" style="width:100%; margin-top:4px;">
                            <option value="All Users">All Registered Users & Talent</option>
                            <option value="Labour Only">Skilled Labourers Only</option>
                            <option value="Contractors Only">Contracting Companies Only</option>
                            <option value="Customers Only">Customers Only</option>
                        </select>
                    </div>
                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Notification Title <span class="text-danger">*</span></label>
                        <input type="text" id="notifTitle" class="form-control" style="width:100%; margin-top:4px;" placeholder="e.g. New Platform Escrow Feature Released!" required>
                    </div>
                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Notification Message Body <span class="text-danger">*</span></label>
                        <textarea id="notifBody" class="form-control" style="width:100%; margin-top:4px; height:90px;" placeholder="Write your broadcast announcement..." required></textarea>
                    </div>
                </div>
            `,
            submitText: 'Send Broadcast Now',
            onSubmit: () => {
                const target = document.getElementById('notifTarget')?.value;
                const title = document.getElementById('notifTitle')?.value.trim();
                const message = document.getElementById('notifBody')?.value.trim();

                if (!title || !message) {
                    Toast.show('Please fill in all required fields.', 'warning');
                    return;
                }

                const newNotif = {
                    id: `NOT-${Date.now().toString().slice(-3)}`,
                    title,
                    message: `[To ${target}] ${message}`,
                    category: 'Broadcast',
                    time: 'Just now',
                    unread: true
                };

                DataService.addItem(DataService.KEYS.NOTIFICATIONS, newNotif);
                DataService.logActivity(`Sent push notification broadcast '${title}' to ${target}`);
                Toast.show(`Push notification successfully dispatched to ${target}!`, 'success');
                ModalManager.close();
                App.refreshCurrentPage();
            }
        });
    }
};
