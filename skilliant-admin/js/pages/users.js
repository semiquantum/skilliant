/**
 * Day 2 Deliverable: Users Management Module
 */

const UsersPage = {
    render() {
        const users = DataService.getCollection(DataService.KEYS.USERS) || [];

        const rowsHtml = users.length > 0 ? users.map(u => `
            <tr>
                <td>
                    <div class="table-user">
                        <div class="table-avatar">${u.name.split(' ').map(n=>n[0]).join('')}</div>
                        <div>
                            <div class="table-user-name">${u.name}</div>
                            <div class="table-user-sub">${u.email}</div>
                        </div>
                    </div>
                </td>
                <td>${u.phone}</td>
                <td><strong>${u.totalBookings}</strong> jobs</td>
                <td><strong>${u.spent}</strong></td>
                <td>${u.joinedDate}</td>
                <td>${UI.renderBadge(u.status)}</td>
                <td>
                    <button class="btn btn-outline btn-sm" onclick="UsersPage.toggleStatus('${u.id}')">
                        ${u.status === 'Active' ? 'Suspend' : 'Activate'}
                    </button>
                    <button class="btn btn-primary btn-sm" onclick="UsersPage.viewDetails('${u.id}')">
                        View
                    </button>
                </td>
            </tr>
        `).join('') : '<tr><td colspan="10" class="text-center text-muted" style="padding: 2rem;">No records found.</td></tr>';

        return `
            ${UI.renderPageHeader('Customer Accounts Management', 'View and manage registered clients hiring labour on Skilliant.')}
            ${UI.renderControlsBar('userSearchInput', 'Search users by name, email or phone...', [
                { id: 'statusFilter', label: 'Filter Status', options: ['Active', 'Suspended'] }
            ], `<button class="btn btn-primary" onclick="UsersPage.addUserModal()"><span class="material-icons-round">add</span> Add Customer</button>`)}
            ${UI.renderTable(['User Profile', 'Contact', 'Bookings', 'Total Spent', 'Joined Date', 'Status', 'Actions'], rowsHtml)}
        `;
    },

    init() {
        document.getElementById('userSearchInput')?.addEventListener('input', (e) => {
            const val = e.target.value.toLowerCase();
            const rows = document.querySelectorAll('.data-table tbody tr');
            rows.forEach(r => {
                r.style.display = r.textContent.toLowerCase().includes(val) ? '' : 'none';
            });
        });
    },

    toggleStatus(id) {
        const users = DataService.getCollection(DataService.KEYS.USERS);
        const user = users.find(u => u.id === id);
        if (user) {
            user.status = user.status === 'Active' ? 'Suspended' : 'Active';
            DataService.setStorage(DataService.KEYS.USERS, users);
            DataService.logActivity(`Toggled status of user ${user.name} to ${user.status}`);
            Toast.show(`User ${user.name} is now ${user.status}`, user.status === 'Active' ? 'success' : 'warning');
            App.refreshCurrentPage();
        }
    },

    viewDetails(id) {
        const users = DataService.getCollection(DataService.KEYS.USERS);
        const u = users.find(x => x.id === id);
        if (!u) return;

        ModalManager.open({
            title: `User Profile: ${u.name}`,
            bodyHtml: `
                <div style="display:flex; gap:1.25rem; align-items:center;" class="mb-4">
                    <div class="table-avatar" style="width:60px; height:60px; font-size:1.4rem;">${u.name.split(' ').map(n=>n[0]).join('')}</div>
                    <div>
                        <h3 style="font-size:1.2rem; font-weight:700;">${u.name}</h3>
                        <p style="color:var(--text-muted); font-size:0.85rem;">${u.email} • ${u.phone}</p>
                    </div>
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; font-size:0.9rem;">
                    <div style="background:#F8FAFC; padding:1rem; border-radius:8px;">
                        <span style="color:var(--text-muted); font-size:0.75rem; display:block;">Total Bookings Created</span>
                        <strong>${u.totalBookings} Jobs</strong>
                    </div>
                    <div style="background:#F8FAFC; padding:1rem; border-radius:8px;">
                        <span style="color:var(--text-muted); font-size:0.75rem; display:block;">Total Volume Spent</span>
                        <strong>${u.spent}</strong>
                    </div>
                </div>
            `,
            submitText: 'Close',
            onSubmit: () => ModalManager.close()
        });
    },

    addUserModal() {
        ModalManager.open({
            title: 'Add New Customer Account',
            bodyHtml: `
                <div style="display:flex; flex-direction:column; gap:1rem;">
                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Full Name</label>
                        <input type="text" id="newUserName" class="form-control" style="width:100%; margin-top:4px;" placeholder="e.g. Rachel Green">
                    </div>
                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Email Address</label>
                        <input type="email" id="newUserEmail" class="form-control" style="width:100%; margin-top:4px;" placeholder="rachel@example.com">
                    </div>
                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Phone Number</label>
                        <input type="text" id="newUserPhone" class="form-control" style="width:100%; margin-top:4px;" placeholder="+1 555-0199">
                    </div>
                </div>
            `,
            submitText: 'Create Account',
            onSubmit: () => {
                const name = document.getElementById('newUserName')?.value;
                const email = document.getElementById('newUserEmail')?.value;
                const phone = document.getElementById('newUserPhone')?.value;

                if (!name || !email) {
                    Toast.show('Please fill in name and email', 'warning');
                    return;
                }

                const newUser = {
                    id: `USR-${Date.now().toString().slice(-4)}`,
                    name,
                    email,
                    phone: phone || "+1 555-0000",
                    role: "Customer",
                    status: "Active",
                    joinedDate: new Date().toISOString().split('T')[0],
                    totalBookings: 0,
                    spent: "$0.00"
                };

                DataService.addItem(DataService.KEYS.USERS, newUser);
                DataService.logActivity(`Added new customer account ${name}`);
                Toast.show(`Customer account ${name} created successfully!`, 'success');
                ModalManager.close();
                App.refreshCurrentPage();
            }
        });
    }
};
