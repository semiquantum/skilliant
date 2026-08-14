const NotificationsPage = {
    state: { search: '', status: '' },
    safeDate(value) {
        if (!value) return null;
        const d = new Date(value);
        return Number.isNaN(d.getTime()) ? null : d;
    },
    render() {
        const ns = DataService.getCollection(DataService.KEYS.NOTIFICATIONS) || [];
        const logs = DataService.getStorage(DataService.KEYS.ACTIVITY_LOGS) || [];
        const merged = [
            ...ns.map(n => ({...n, source:'Notification'})),
            ...logs.map(l => ({
                id: l.id,
                title: l.action || 'Activity',
                message: `Performed by ${l.admin || 'System'}`,
                category: 'Activity',
                timestamp: l.timestamp,
                unread: false,
                source: 'Activity',
                entityType: l.entityType || '',
                entityId: l.entityId || ''
            }))
        ].filter((x,i,a) => a.findIndex(y => y.id === x.id) === i)
         .sort((a,b) => (this.safeDate(b.timestamp)?.getTime()||0) - (this.safeDate(a.timestamp)?.getTime()||0));
        const q = this.state.search.toLowerCase();
        const filtered = merged.filter(n => {
            const text = `${n.id} ${n.title} ${n.message} ${n.category}`.toLowerCase();
            return (!q || text.includes(q)) && (!this.state.status || (this.state.status==='Unread' ? n.unread : n.source===this.state.status));
        });
        const rows = filtered.length ? filtered.slice(0,100).map(n => {
            const d = this.safeDate(n.timestamp);
            const time = d ? d.toLocaleString() : 'Time unavailable';
            const action = n.source === 'Notification'
                ? `<button class="btn btn-outline btn-sm" onclick="NotificationsPage.markRead('${n.id}')">${n.unread ? 'Mark read' : 'View'}</button>`
                : `<button class="btn btn-outline btn-sm" onclick="NotificationsPage.viewActivity('${n.id}')">View</button>`;
            return `<tr><td><strong>${n.id}</strong></td><td><strong>${n.title}</strong><div style="font-size:.78rem;color:var(--text-muted);">${n.message}</div></td><td>${n.category}</td><td>${time}</td><td>${n.unread ? '<span class="badge badge-warning">UNREAD</span>' : '<span class="badge badge-secondary">READ</span>'}</td><td>${action}</td></tr>`;
        }).join('') : `<tr><td colspan="6" class="text-center text-muted" style="padding:3rem"><i class="fa-solid fa-bell-slash" style="font-size:2rem;opacity:.25;display:block;margin-bottom:.7rem"></i>No activity or notifications found.</td></tr>`;
        return `${UI.renderPageHeader('Activity & Notifications','All important platform actions appear here automatically.',`<button class="btn btn-primary" onclick="NotificationsPage.markAllRead()"><i class="fa-solid fa-check-double"></i> Mark all read</button>`)}
            ${UI.renderControlsBar('activitySearch','Search activity or notifications...', [{id:'activityStatusFilter',label:'Filter',options:['Unread','Notification','Activity']}], '', null)}
            <div class="glass-card" style="padding:0;overflow:hidden;">${UI.renderTable(['ID','Activity / Notification','Category','Time','Status','Action'],rows,'')}</div>`;
    },
    init() {
        const e = document.getElementById('activitySearch');
        const f = document.getElementById('activityStatusFilter');
        if (e) { e.value=this.state.search; e.addEventListener('input',x=>{this.state.search=x.target.value;App.refreshCurrentPage()}); }
        if (f) { f.value=this.state.status; f.addEventListener('change',x=>{this.state.status=x.target.value;App.refreshCurrentPage()}); }
    },
    markRead(id) {
        const ns = DataService.getCollection(DataService.KEYS.NOTIFICATIONS) || [];
        const n = ns.find(x=>x.id===id);
        if (!n) return;
        n.unread=false; DataService.setStorage(DataService.KEYS.NOTIFICATIONS,ns);
        App.updateNotificationBadge(); Toast.show('Notification marked as read.','success'); App.refreshCurrentPage();
    },
    markAllRead() {
        const ns = DataService.getCollection(DataService.KEYS.NOTIFICATIONS) || [];
        ns.forEach(n=>n.unread=false); DataService.setStorage(DataService.KEYS.NOTIFICATIONS,ns);
        App.updateNotificationBadge(); Toast.show('All notifications marked as read.','success'); App.refreshCurrentPage();
    },
    viewActivity(id) {
        const logs = DataService.getStorage(DataService.KEYS.ACTIVITY_LOGS) || [];
        const l = logs.find(x=>x.id===id); if(!l) return;
        ModalManager.open({title:'Activity Details',bodyHtml:`<div style="display:grid;gap:.6rem;font-size:.9rem"><div><strong>Action:</strong> ${l.action}</div><div><strong>Administrator:</strong> ${l.admin||'System'}</div><div><strong>Time:</strong> ${l.timestamp||'Unavailable'}</div><div><strong>Source:</strong> Admin Portal</div></div>`,submitText:'Close',onSubmit:()=>ModalManager.close()});
    }
};
