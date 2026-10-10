/**
 * Skilliant Admin Portal — Notifications Administration
 * Notifications are intentionally kept separate from the Activity Logs page.
 */
const NotificationsPage = {
    state: { search: '', status: 'All', category: 'All' },

    safeDate(value) {
        const d = value ? new Date(value) : null;
        return d && !Number.isNaN(d.getTime()) ? d : null;
    },

    render() {
        const notifications = DataService.getCollection(DataService.KEYS.NOTIFICATIONS) || [];
        const categories = [...new Set(notifications.map(n => n.category).filter(Boolean))].sort();
        const q = this.state.search.trim().toLowerCase();
        const filtered = notifications.filter(n => {
            const text = `${n.id} ${n.title} ${n.message} ${n.category} ${n.entityType} ${n.entityId}`.toLowerCase();
            const statusOk = this.state.status === 'All' ||
                (this.state.status === 'Unread' && n.unread) ||
                (this.state.status === 'Read' && !n.unread);
            const categoryOk = this.state.category === 'All' || n.category === this.state.category;
            return (!q || text.includes(q)) && statusOk && categoryOk;
        });

        const unread = notifications.filter(n => n.unread).length;
        const read = notifications.length - unread;
        const rows = filtered.length ? filtered.slice(0, 200).map(n => {
            const d = this.safeDate(n.timestamp);
            const time = d ? d.toLocaleString() : 'Time unavailable';
            const safeId = UI.escapeHtml(n.id);
            return `<tr>
                <td><strong>${safeId}</strong></td>
                <td><strong>${UI.escapeHtml(n.title || 'Notification')}</strong><div class="text-xs text-muted">${UI.escapeHtml(n.message || '')}</div></td>
                <td><span class="badge badge-secondary">${UI.escapeHtml(n.category || 'System')}</span></td>
                <td>${UI.escapeHtml(time)}</td>
                <td>${n.unread ? '<span class="badge badge-warning">UNREAD</span>' : '<span class="badge badge-secondary">READ</span>'}</td>
                <td><div class="table-actions">
                    <button class="btn btn-outline btn-sm" aria-label="${n.unread ? 'Mark' : 'Keep'} notification ${safeId} ${n.unread ? 'as read' : 'as read'}" onclick="NotificationsPage.toggleRead('${safeId}')">${n.unread ? 'Mark read' : 'Read'}</button>
                    <button class="btn btn-outline btn-sm" aria-label="View notification ${safeId}" onclick="NotificationsPage.view('${safeId}')"><i class="fa-solid fa-eye"></i></button>
                    <button class="btn btn-danger btn-sm" aria-label="Delete notification ${safeId}" onclick="NotificationsPage.remove('${safeId}')"><i class="fa-solid fa-trash"></i></button>
                </div></td>
            </tr>`;
        }).join('') : `<tr><td colspan="6">${UI.renderEmptyState('No notifications found','Try another filter or search term.','fa-bell-slash')}</td></tr>`;

        return `${UI.renderPageHeader('Activity & Notifications','Manage platform notifications. Detailed administrator activity is available in Activity Logs.',`
                <button class="btn btn-outline" onclick="NotificationsPage.clearRead()"><i class="fa-solid fa-broom"></i> Clear read</button>
                <button class="btn btn-primary" onclick="NotificationsPage.markAllRead()"><i class="fa-solid fa-check-double"></i> Mark all read</button>`)}
            <div class="kpi-grid">
                ${UI.renderStatCard('Total Notifications', notifications.length, 'fa-bell', 'kpi-icon-blue')}
                ${UI.renderStatCard('Unread', unread, 'fa-envelope', 'kpi-icon-orange')}
                ${UI.renderStatCard('Read', read, 'fa-envelope-open', 'kpi-icon-green')}
            </div>
            <div class="glass-card activity-toolbar" style="grid-template-columns:minmax(220px,2fr) repeat(2,minmax(150px,1fr));">
                <div><label class="sr-only" for="activitySearch">Search notifications</label><input id="activitySearch" class="form-control" placeholder="Search notifications..." value="${UI.escapeHtml(this.state.search)}"></div>
                <select id="activityStatusFilter" class="form-control" aria-label="Filter notifications by status">
                    ${['All','Unread','Read'].map(x => `<option ${this.state.status===x?'selected':''}>${x}</option>`).join('')}
                </select>
                <select id="activityCategoryFilter" class="form-control" aria-label="Filter notifications by category">
                    <option>All</option>${categories.map(x => `<option ${this.state.category===x?'selected':''}>${UI.escapeHtml(x)}</option>`).join('')}
                </select>
            </div>
            <div class="glass-card" style="padding:0;overflow:hidden;">
                <div class="table-responsive"><table class="data-table"><thead><tr><th>ID</th><th>Notification</th><th>Category</th><th>Time</th><th>Status</th><th>Actions</th></tr></thead><tbody>${rows}</tbody></table></div>
            </div>`;
    },

    init() {
        const search = document.getElementById('activitySearch');
        const status = document.getElementById('activityStatusFilter');
        const category = document.getElementById('activityCategoryFilter');
        search?.addEventListener('input', e => { this.state.search = e.target.value; App.refreshCurrentPage(); });
        status?.addEventListener('change', e => { this.state.status = e.target.value; App.refreshCurrentPage(); });
        category?.addEventListener('change', e => { this.state.category = e.target.value; App.refreshCurrentPage(); });
    },

    toggleRead(id) {
        if (!DataService.requirePermission('manage:notifications')) return;
        const list = DataService.getCollection(DataService.KEYS.NOTIFICATIONS) || [];
        const n = list.find(x => x.id === id);
        if (!n) return;
        n.unread = false;
        DataService.setStorage(DataService.KEYS.NOTIFICATIONS, list);
        DataService.logActivity(`Marked notification ${id} as read`, { entityType: 'notification', entityId: id });
        App.updateNotificationBadge();
        Toast.show('Notification marked as read.', 'success');
        App.refreshCurrentPage();
    },

    markAllRead() {
        if (!DataService.requirePermission('manage:notifications')) return;
        const list = DataService.getCollection(DataService.KEYS.NOTIFICATIONS) || [];
        const changed = list.some(n => n.unread);
        list.forEach(n => { n.unread = false; });
        DataService.setStorage(DataService.KEYS.NOTIFICATIONS, list);
        if (changed) DataService.logActivity('Marked all notifications as read');
        App.updateNotificationBadge();
        Toast.show('All notifications marked as read.', 'success');
        App.refreshCurrentPage();
    },

    clearRead() {
        if (!DataService.requirePermission('manage:notifications')) return;
        const list = DataService.getCollection(DataService.KEYS.NOTIFICATIONS) || [];
        const readCount = list.filter(n => !n.unread).length;
        if (!readCount) return Toast.show('There are no read notifications to clear.', 'info');
        if (!confirm(`Delete ${readCount} read notification${readCount === 1 ? '' : 's'}?`)) return;
        DataService.setStorage(DataService.KEYS.NOTIFICATIONS, list.filter(n => n.unread));
        DataService.logActivity(`Cleared ${readCount} read notifications`);
        Toast.show('Read notifications cleared.', 'success');
        App.refreshCurrentPage();
    },

    remove(id) {
        if (!DataService.requirePermission('manage:notifications')) return;
        const list = DataService.getCollection(DataService.KEYS.NOTIFICATIONS) || [];
        const n = list.find(x => x.id === id);
        if (!n) return;
        if (!confirm('Delete this notification?')) return;
        DataService.setStorage(DataService.KEYS.NOTIFICATIONS, list.filter(x => x.id !== id));
        DataService.logActivity(`Deleted notification ${id}`, { entityType: 'notification', entityId: id });
        App.updateNotificationBadge();
        Toast.show('Notification deleted.', 'success');
        App.refreshCurrentPage();
    },

    view(id) {
        const n = (DataService.getCollection(DataService.KEYS.NOTIFICATIONS) || []).find(x => x.id === id);
        if (!n) return;
        if (n.unread) {
            n.unread = false;
            DataService.setStorage(DataService.KEYS.NOTIFICATIONS, DataService.getCollection(DataService.KEYS.NOTIFICATIONS));
            App.updateNotificationBadge();
        }
        ModalManager.open({
            title: 'Notification Details',
            bodyHtml: `<div class="detail-list">
                <div><strong>Title</strong><span>${UI.escapeHtml(n.title || 'Notification')}</span></div>
                <div><strong>Message</strong><span class="detail-wrap">${UI.escapeHtml(n.message || '')}</span></div>
                <div><strong>Category</strong><span>${UI.escapeHtml(n.category || 'System')}</span></div>
                <div><strong>Date</strong><span>${UI.escapeHtml(this.safeDate(n.timestamp)?.toLocaleString() || 'Unavailable')}</span></div>
                <div><strong>Related</strong><span>${UI.escapeHtml(n.entityType || 'System')} ${UI.escapeHtml(n.entityId || '')}</span></div>
            </div>`,
            submitText: 'Close',
            onSubmit: () => ModalManager.close()
        });
    }
};
