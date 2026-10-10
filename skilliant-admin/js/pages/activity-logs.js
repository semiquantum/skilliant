/**
 * Skilliant Admin Portal — Dedicated Activity Logs administration module.
 */
const ActivityLogsPage = {
    state: { search:'', admin:'All', action:'All', severity:'All', entity:'All', from:'', to:'' },

    render() {
        const logs = DataService.getCollection(DataService.KEYS.ACTIVITY_LOGS) || [];
        const admins = DataService.getCollection(DataService.KEYS.ADMINS) || [];
        const q = this.state.search.trim().toLowerCase();
        const actions = [...new Set(logs.map(l => l.action).filter(Boolean))].sort();
        const entities = [...new Set(logs.map(l => l.entityType).filter(Boolean))].sort();
        const from = this.state.from ? new Date(`${this.state.from}T00:00:00`) : null;
        const to = this.state.to ? new Date(`${this.state.to}T23:59:59.999`) : null;

        const filtered = logs.filter(l => {
            const d = new Date(l.timestamp || 0);
            return (!q || [l.id,l.admin,l.action,l.entityType,l.entityId,l.role].join(' ').toLowerCase().includes(q))
                && (this.state.admin === 'All' || l.adminId === this.state.admin || l.admin === this.state.admin)
                && (this.state.action === 'All' || l.action === this.state.action)
                && (this.state.severity === 'All' || (l.severity || 'info') === this.state.severity)
                && (this.state.entity === 'All' || l.entityType === this.state.entity)
                && (!from || (d >= from))
                && (!to || (d <= to));
        });

        const rows = filtered.slice(0,300).map(l => `<tr>
            <td><strong>${UI.escapeHtml(l.id || '—')}</strong></td>
            <td>${UI.escapeHtml(l.admin || 'System')}<div class="text-xs text-muted">${UI.escapeHtml(l.role || '')}</div></td>
            <td><div>${UI.escapeHtml(l.action || 'Activity')}</div><div class="text-xs text-muted">${UI.escapeHtml(l.entityType || 'System')} ${UI.escapeHtml(l.entityId || '')}</div></td>
            <td>${UI.escapeHtml(this.date(l.timestamp))}</td>
            <td>${UI.escapeHtml(l.ip || 'Local browser')}</td>
            <td><span class="badge ${l.severity==='warning'?'badge-warning':l.severity==='error'?'badge-danger':'badge-info'}">${UI.escapeHtml(l.severity || 'info')}</span></td>
            <td><button class="btn btn-outline btn-sm" aria-label="View activity log ${UI.escapeHtml(l.id || '')}" onclick="ActivityLogsPage.view('${UI.escapeHtml(l.id || '')}')">View</button></td>
        </tr>`).join('');

        const canExport = App.hasPermission('export:activity');
        const canClear = App.hasPermission('clear:activity');
        return `${UI.renderPageHeader('Activity Logs','Auditable administrator actions across the portal.',`${canExport?`<button class="btn btn-outline" onclick="ActivityLogsPage.exportCsv()"><i class="fa-solid fa-download"></i> Export CSV</button>`:''}${canClear?`<button class="btn btn-danger" onclick="ActivityLogsPage.clear()"><i class="fa-solid fa-trash"></i> Clear Logs</button>`:''}`)}
            <div class="glass-card activity-toolbar">
                <div><label class="sr-only" for="logSearch">Search activity logs</label><input id="logSearch" class="form-control" placeholder="Search logs..." value="${UI.escapeHtml(this.state.search)}" aria-label="Search activity logs"></div>
                <select id="logAdmin" class="form-control" aria-label="Filter by administrator"><option value="All">All administrators</option>${admins.map(a=>`<option value="${UI.escapeHtml(a.id)}" ${this.state.admin===a.id?'selected':''}>${UI.escapeHtml(a.name)}</option>`).join('')}</select>
                <select id="logAction" class="form-control" aria-label="Filter by action"><option>All</option>${actions.map(a=>`<option ${this.state.action===a?'selected':''}>${UI.escapeHtml(a)}</option>`).join('')}</select>
                <select id="logEntity" class="form-control" aria-label="Filter by entity"><option>All</option>${entities.map(e=>`<option ${this.state.entity===e?'selected':''}>${UI.escapeHtml(e)}</option>`).join('')}</select>
                <select id="logSeverity" class="form-control" aria-label="Filter by severity"><option>All</option>${['info','warning','error'].map(x=>`<option ${this.state.severity===x?'selected':''}>${x}</option>`).join('')}</select>
                <input id="logFrom" type="date" class="form-control" value="${UI.escapeHtml(this.state.from)}" aria-label="Activity logs from date">
                <input id="logTo" type="date" class="form-control" value="${UI.escapeHtml(this.state.to)}" aria-label="Activity logs to date">
            </div>
            <div class="glass-card ticket-table-card"><div class="table-responsive"><table class="data-table"><thead><tr><th>ID</th><th>Administrator</th><th>Action / Entity</th><th>Date & Time</th><th>Source</th><th>Severity</th><th></th></tr></thead><tbody>${rows || `<tr><td colspan="7">${UI.renderEmptyState('No activity logs found','Try changing the selected filters.','fa-list-check')}</td></tr>`}</tbody></table></div></div>`;
    },

    init() {
        [['logSearch','search','input'],['logAdmin','admin','change'],['logAction','action','change'],['logEntity','entity','change'],['logSeverity','severity','change'],['logFrom','from','change'],['logTo','to','change']]
            .forEach(([id,key,event]) => document.getElementById(id)?.addEventListener(event, e => { this.state[key] = e.target.value; App.refreshCurrentPage(); }));
    },

    view(id) {
        if (!App.hasPermission('view:activity')) return Toast.show('You do not have permission to view activity logs.', 'warning');
        const l = (DataService.getCollection(DataService.KEYS.ACTIVITY_LOGS) || []).find(x => x.id === id);
        if (!l) return;
        ModalManager.open({
            title:'Activity Details',
            bodyHtml:`<div class="detail-list">
                <div><strong>Action</strong><span>${UI.escapeHtml(l.action || 'Activity')}</span></div>
                <div><strong>Administrator</strong><span>${UI.escapeHtml(l.admin || 'System')}</span></div>
                <div><strong>Role</strong><span>${UI.escapeHtml(l.role || '—')}</span></div>
                <div><strong>Entity</strong><span>${UI.escapeHtml(l.entityType || 'System')} ${UI.escapeHtml(l.entityId || '')}</span></div>
                <div><strong>Date</strong><span>${UI.escapeHtml(this.date(l.timestamp))}</span></div>
                <div><strong>IP / Source</strong><span>${UI.escapeHtml(l.ip || 'Local browser')}</span></div>
                <div><strong>User Agent</strong><span class="detail-wrap">${UI.escapeHtml(l.userAgent || 'Frontend browser')}</span></div>
                <div><strong>Metadata</strong><span class="detail-wrap">${UI.escapeHtml(JSON.stringify(l.metadata || {}))}</span></div>
            </div>`,
            submitText:'Close', onSubmit:()=>ModalManager.close()
        });
    },

    clear() {
        if (!App.hasPermission('clear:activity')) return Toast.show('You do not have permission to clear activity logs.', 'warning');
        if (!confirm('Clear all activity logs? This cannot be undone.')) return;
        DataService.setStorage(DataService.KEYS.ACTIVITY_LOGS, []);
        Toast.show('Activity logs cleared.', 'success');
        App.refreshCurrentPage();
    },

    exportCsv() {
        if (!App.hasPermission('export:activity')) return Toast.show('You do not have permission to export activity logs.', 'warning');
        const logs = DataService.getCollection(DataService.KEYS.ACTIVITY_LOGS) || [];
        const head = ['ID','Administrator','Role','Action','Entity Type','Entity ID','Timestamp','IP','Severity'];
        const esc = v => `"${String(v ?? '').replace(/"/g,'""')}"`;
        const csv = [head,...logs.map(l=>[l.id,l.admin,l.role,l.action,l.entityType,l.entityId,l.timestamp,l.ip,l.severity])].map(r=>r.map(esc).join(',')).join('\n');
        const url = URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));
        const a = document.createElement('a'); a.href=url; a.download='skilliant-activity-logs.csv'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
        Toast.show('Activity logs exported.', 'success');
    },

    date(v) { const d = new Date(v); return Number.isNaN(d.getTime()) ? 'Unknown' : d.toLocaleString(); }
};
