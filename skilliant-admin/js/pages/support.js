/**
 * Skilliant Admin Portal — Support Ticket Management (Day 5)
 * Frontend-only ticket lifecycle backed by DataService/LocalStorage.
 */
const SupportPage = {
    state: { search:'', status:'All', priority:'All', category:'All', assignee:'All' },
    can(permission) { return App.hasPermission(permission); },

    render() {
        const tickets = DataService.getCollection(DataService.KEYS.SUPPORT_TICKETS) || [];
        const admins = DataService.getCollection(DataService.KEYS.ADMINS) || [];
        const q = this.state.search.toLowerCase();
        const filtered = tickets.filter(t => {
            const hay = [t.id,t.subject,t.customer,t.category,t.description].join(' ').toLowerCase();
            return (!q || hay.includes(q))
                && (this.state.status==='All' || t.status===this.state.status)
                && (this.state.priority==='All' || t.priority===this.state.priority)
                && (this.state.category==='All' || t.category===this.state.category)
                && (this.state.assignee==='All' || t.assignedAdminId===this.state.assignee);
        });
        const open = tickets.filter(t => !['Resolved','Closed'].includes(t.status)).length;
        const urgent = tickets.filter(t => t.priority==='Urgent' && !['Resolved','Closed'].includes(t.status)).length;
        const resolved = tickets.filter(t => t.status==='Resolved').length;
        const categories = [...new Set(tickets.map(t=>t.category).filter(Boolean))];
        const statusOptions=['All','Open','In Progress','Waiting for User','Resolved','Closed'];
        const priorityOptions=['All','Low','Medium','High','Urgent'];

        const rows = filtered.map(t => `
            <tr>
                <td><strong>${UI.escapeHtml(t.id)}</strong><div class="text-xs text-muted">${this.relative(t.updatedAt)}</div></td>
                <td><div class="ticket-subject">${UI.escapeHtml(t.subject)}</div><div class="text-xs text-muted">${UI.escapeHtml(t.customer)}</div></td>
                <td><span class="badge badge-secondary">${UI.escapeHtml(t.category)}</span></td>
                <td><span class="badge ${this.priorityClass(t.priority)}">${UI.escapeHtml(t.priority)}</span></td>
                <td><span class="badge ${this.statusClass(t.status)}">${UI.escapeHtml(t.status)}</span></td>
                <td>${UI.escapeHtml(t.assignedAdmin || 'Unassigned')}</td>
                <td><div class="table-actions">
                    <button class="btn btn-outline btn-sm" aria-label="View ticket ${UI.escapeHtml(t.id)}" onclick="SupportPage.view('${t.id}')"><i class="fa-solid fa-eye"></i> View</button>
                    ${!['Resolved','Closed'].includes(t.status) && this.can('resolve:support') ? `<button class="btn btn-success btn-sm" onclick="SupportPage.resolve('${t.id}')"><i class="fa-solid fa-check"></i> Resolve</button>` : ''}
                    ${['Resolved','Closed'].includes(t.status) && this.can('resolve:support') ? `<button class="btn btn-outline btn-sm" onclick="SupportPage.reopen('${t.id}')"><i class="fa-solid fa-rotate-left"></i> Reopen</button>` : ''}
                </div></td>
            </tr>`).join('');

        return `
            ${UI.renderPageHeader('Support Tickets','Manage customer support requests, assignments, priorities and resolutions.',this.can('create:support') ? `<button class="btn btn-primary" onclick="SupportPage.create()"><i class="fa-solid fa-plus"></i> New Ticket</button>` : '')}
            <div class="kpi-grid support-kpis">
                ${UI.renderStatCard('Open Tickets',open,'fa-ticket', 'kpi-icon-blue')}
                ${UI.renderStatCard('Urgent Open',urgent,'fa-triangle-exclamation','kpi-icon-red')}
                ${UI.renderStatCard('Resolved',resolved,'fa-circle-check','kpi-icon-green')}
            </div>
            <div class="glass-card support-toolbar">
                <div class="support-search"><label class="sr-only" for="ticketSearch">Search tickets</label><input id="ticketSearch" class="form-control" placeholder="Search ticket ID, subject, customer..." value="${UI.escapeHtml(this.state.search)}"></div>
                <select id="ticketStatus" class="form-control" aria-label="Filter by status">${statusOptions.map(x=>`<option ${this.state.status===x?'selected':''}>${x}</option>`).join('')}</select>
                <select id="ticketPriority" class="form-control" aria-label="Filter by priority">${priorityOptions.map(x=>`<option ${this.state.priority===x?'selected':''}>${x}</option>`).join('')}</select>
                <select id="ticketCategory" class="form-control" aria-label="Filter by category"><option>All</option>${categories.map(x=>`<option ${this.state.category===x?'selected':''}>${UI.escapeHtml(x)}</option>`).join('')}</select>
                <select id="ticketAssignee" class="form-control" aria-label="Filter by assignee"><option value="All">All assignees</option>${admins.map(a=>`<option value="${a.id}" ${this.state.assignee===a.id?'selected':''}>${UI.escapeHtml(a.name)}</option>`).join('')}</select>
            </div>
            <div class="glass-card ticket-table-card"><div class="table-responsive"><table class="data-table"><thead><tr><th>ID</th><th>Customer / Subject</th><th>Category</th><th>Priority</th><th>Status</th><th>Assigned To</th><th>Actions</th></tr></thead><tbody>${rows || `<tr><td colspan="7">${UI.renderEmptyState ? UI.renderEmptyState('No support tickets found','Try changing your filters or create a new ticket.','fa-ticket-slash') : '<div class="empty-state">No support tickets found.</div>'}</td></tr>`}</tbody></table></div></div>`;
    },

    init() {
        const bind=(id,key,event='input')=>{const el=document.getElementById(id);if(!el)return;el.addEventListener(event,e=>{this.state[key]=e.target.value;App.refreshCurrentPage();});};
        bind('ticketSearch','search'); bind('ticketStatus','status','change'); bind('ticketPriority','priority','change'); bind('ticketCategory','category','change'); bind('ticketAssignee','assignee','change');
    },

    create() {
        if (!DataService.requirePermission('create:support')) return;
        if (!(this.can('reply:support') || this.can('assign:support'))) return Toast.show('You do not have permission to create support tickets.', 'warning');
        const admins=DataService.getCollection(DataService.KEYS.ADMINS)||[];
        const customers=DataService.getCollection(DataService.KEYS.USERS)||[];
        ModalManager.open({
            title:'Create Support Ticket',
            bodyHtml:`<div class="form-grid-2">
                <div class="form-group"><label for="stCustomer">Customer</label><select id="stCustomer" class="form-control">${customers.map(c=>`<option value="${UI.escapeHtml(c.name)}" data-id="${c.id}">${UI.escapeHtml(c.name)}</option>`).join('')}</select></div>
                <div class="form-group"><label for="stCategory">Category</label><select id="stCategory" class="form-control"><option>General</option><option>Booking</option><option>Payment</option><option>Account</option><option>Verification</option><option>Technical</option></select></div>
                <div class="form-group"><label for="stPriority">Priority</label><select id="stPriority" class="form-control"><option>Low</option><option selected>Medium</option><option>High</option><option>Urgent</option></select></div>
                <div class="form-group"><label for="stAssignee">Assign To</label><select id="stAssignee" class="form-control"><option value="">Unassigned</option>${admins.map(a=>`<option value="${a.id}">${UI.escapeHtml(a.name)}</option>`).join('')}</select></div>
                <div class="form-group full"><label for="stSubject">Subject</label><input id="stSubject" class="form-control" maxlength="120" required></div>
                <div class="form-group full"><label for="stDescription">Description</label><textarea id="stDescription" class="form-control" rows="4" maxlength="1000" required></textarea></div>
            </div>`,
            submitText:'Create Ticket',
            onSubmit:()=>{
                const subject=document.getElementById('stSubject')?.value.trim(), desc=document.getElementById('stDescription')?.value.trim();
                if(!subject||!desc){Toast.show('Subject and description are required.','warning');return;}
                const customerEl=document.getElementById('stCustomer');
                const assigneeId=document.getElementById('stAssignee')?.value||'';
                const assignee=admins.find(a=>a.id===assigneeId);
                const now=new Date().toISOString();
                const ticket={id:`TKT-${Date.now().toString().slice(-7)}`,customer:customerEl?.value||'Customer',customerId:customerEl?.selectedOptions[0]?.dataset.id||'',subject,description:desc,category:document.getElementById('stCategory').value,priority:document.getElementById('stPriority').value,status:'Open',assignedAdminId:assigneeId,assignedAdmin:assignee?.name||'Unassigned',createdAt:now,updatedAt:now,lastResponseAt:'',resolution:'',messages:[]};
                DataService.addItem(DataService.KEYS.SUPPORT_TICKETS,ticket,`Created support ticket ${ticket.id}`);
                ModalManager.close(); Toast.show('Support ticket created.','success'); App.refreshCurrentPage();
            }
        });
    },

    view(id) {
        if (!this.can('view:support')) return Toast.show('You do not have permission to view support tickets.', 'warning');
        const ticket=(DataService.getCollection(DataService.KEYS.SUPPORT_TICKETS)||[]).find(t=>t.id===id); if(!ticket)return;
        const admins=DataService.getCollection(DataService.KEYS.ADMINS)||[];
        const canReply=this.can('reply:support'), canAssign=this.can('assign:support'), canResolve=this.can('resolve:support');
        const canEdit=canReply||canAssign||canResolve;
        const messages=(ticket.messages||[]).map(m=>`<div class="ticket-message"><strong>${UI.escapeHtml(m.author||'Admin')}</strong><span class="text-xs text-muted">${UI.escapeHtml(this.date(m.createdAt))}</span><p>${UI.escapeHtml(m.text)}</p></div>`).join('');
        ModalManager.open({
            title:`${ticket.id} — ${ticket.subject}`,
            bodyHtml:`<div class="ticket-detail">
                <div class="ticket-detail-meta"><span class="badge ${this.statusClass(ticket.status)}">${UI.escapeHtml(ticket.status)}</span><span class="badge ${this.priorityClass(ticket.priority)}">${UI.escapeHtml(ticket.priority)}</span><span class="badge badge-secondary">${UI.escapeHtml(ticket.category)}</span></div>
                <div class="ticket-description"><strong>Customer:</strong> ${UI.escapeHtml(ticket.customer)}<br><strong>Description:</strong><p>${UI.escapeHtml(ticket.description)}</p></div>
                <div class="form-grid-2">
                    <div class="form-group"><label for="tvStatus">Status</label><select id="tvStatus" class="form-control" ${canResolve?'':'disabled'}>${['Open','In Progress','Waiting for User','Resolved','Closed'].map(x=>`<option ${ticket.status===x?'selected':''}>${x}</option>`).join('')}</select></div>
                    <div class="form-group"><label for="tvPriority">Priority</label><select id="tvPriority" class="form-control" ${canReply?'':'disabled'}>${['Low','Medium','High','Urgent'].map(x=>`<option ${ticket.priority===x?'selected':''}>${x}</option>`).join('')}</select></div>
                    <div class="form-group"><label for="tvAssignee">Assigned Admin</label><select id="tvAssignee" class="form-control" ${canAssign?'':'disabled'}><option value="">Unassigned</option>${admins.map(a=>`<option value="${a.id}" ${ticket.assignedAdminId===a.id?'selected':''}>${UI.escapeHtml(a.name)}</option>`).join('')}</select></div>
                    <div class="form-group"><label for="tvResolution">Resolution</label><input id="tvResolution" class="form-control" ${canResolve?'':'disabled'} value="${UI.escapeHtml(ticket.resolution||'')}" placeholder="Resolution summary"></div>
                    <div class="form-group full"><label for="tvReply">Reply / Internal note</label><textarea id="tvReply" class="form-control" ${canReply?'':'disabled'} rows="3" placeholder="Add a response or note..."></textarea></div>
                </div>
                <div><h4 class="section-title">Conversation</h4>${messages||'<p class="text-muted">No responses yet.</p>'}</div>
            </div>`,
            submitText:canEdit ? 'Save Ticket' : 'Close',
            onSubmit:()=>{
                if (!canEdit) return ModalManager.close();
                const list=DataService.getCollection(DataService.KEYS.SUPPORT_TICKETS)||[], i=list.findIndex(x=>x.id===id); if(i<0)return;
                const aId=document.getElementById('tvAssignee').value, a=admins.find(x=>x.id===aId);
                const status=document.getElementById('tvStatus').value, reply=document.getElementById('tvReply').value.trim(), now=new Date().toISOString();
                const old=list[i];
                list[i]={...old,status,priority:document.getElementById('tvPriority').value,assignedAdminId:aId,assignedAdmin:a?.name||'Unassigned',resolution:document.getElementById('tvResolution').value.trim(),updatedAt:now,lastResponseAt:reply?now:old.lastResponseAt,messages:[...(old.messages||[]),...(reply?[{author:DataService.getSession()?.adminName||'Admin',text:reply,createdAt:now}]:[])]};
                DataService.setStorage(DataService.KEYS.SUPPORT_TICKETS,list);
                DataService.logActivity(`Updated support ticket ${id}`);
                ModalManager.close(); Toast.show('Ticket updated successfully.','success'); App.refreshCurrentPage();
            }
        });
    },

    resolve(id){if(!this.can('resolve:support'))return Toast.show('You do not have permission to resolve tickets.','warning');this.updateStatus(id,'Resolved');},
    reopen(id){if(!this.can('resolve:support'))return Toast.show('You do not have permission to reopen tickets.','warning');this.updateStatus(id,'Open');},
    updateStatus(id,status){
        if(!this.can('resolve:support')) return Toast.show('You do not have permission to change ticket status.','warning');
        const list=DataService.getCollection(DataService.KEYS.SUPPORT_TICKETS)||[], ticket=list.find(t=>t.id===id); if(!ticket)return;
        const old=ticket.status; ticket.status=status; ticket.updatedAt=new Date().toISOString(); if(status==='Resolved')ticket.resolution=ticket.resolution||'Resolved by administrator.';
        DataService.setStorage(DataService.KEYS.SUPPORT_TICKETS,list); DataService.logActivity(`Changed support ticket ${id} status from ${old} to ${status}`);
        Toast.show(`Ticket ${status.toLowerCase()}.`,'success'); App.refreshCurrentPage();
    },
    priorityClass(p){return {Low:'badge-secondary',Medium:'badge-info',High:'badge-warning',Urgent:'badge-danger'}[p]||'badge-secondary';},
    statusClass(s){return {'Open':'badge-info','In Progress':'badge-warning','Waiting for User':'badge-secondary','Resolved':'badge-success','Closed':'badge-secondary'}[s]||'badge-secondary';},
    date(v){const d=new Date(v);return Number.isNaN(d.getTime())?'Unknown':d.toLocaleString();},
    relative(v){const d=new Date(v);if(Number.isNaN(d.getTime()))return '';const mins=Math.floor((Date.now()-d.getTime())/60000);if(mins<1)return 'just now';if(mins<60)return `${mins}m ago`;const h=Math.floor(mins/60);if(h<24)return `${h}h ago`;return `${Math.floor(h/24)}d ago`;}
};
