/**
 * Day 2 Deliverable: Users Management Module (SaaS-Ready Audit)
 */

const UsersPage = {
    state: {
        search: '',
        status: ''
    },

    render() {
        const users = DataService.getCollection(DataService.KEYS.USERS) || [];

        // Apply filters
        const filteredUsers = users.filter(u => {
            const matchesSearch = u.name.toLowerCase().includes(this.state.search.toLowerCase()) ||
                u.email.toLowerCase().includes(this.state.search.toLowerCase()) ||
                u.phone.includes(this.state.search) ||
                u.id.toLowerCase().includes(this.state.search.toLowerCase());
            const matchesStatus = !this.state.status || u.status === this.state.status;
            return matchesSearch && matchesStatus;
        });

        // Paginate
        const paginatedUsers = Pagination.getPageItems('users', filteredUsers, 10);

        const rowsHtml = paginatedUsers.length > 0 ? paginatedUsers.map(u => `
            <tr>
                <td>
                    <div class="table-user">
                        <div class="table-avatar" style="background: var(--primary-navy); color: var(--text-white);">
                            ${u.name.split(' ').map(n=>n[0]).join('').toUpperCase()}
                        </div>
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
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn btn-outline btn-sm" onclick="UsersPage.viewDetails('${u.id}')">
                            <i class="fa-solid fa-eye"></i> View
                        </button>
                        <button class="btn btn-outline btn-sm" onclick="UsersPage.editUserModal('${u.id}')">
                            <i class="fa-solid fa-pen"></i> Edit
                        </button>
                        <button class="btn btn-outline btn-sm" onclick="UsersPage.toggleStatus('${u.id}')">
                            <i class="fa-solid fa-ban"></i> ${u.status === 'Active' ? 'Suspend' : 'Activate'}
                        </button>
                        <button class="btn btn-outline btn-sm text-danger" onclick="UsersPage.deleteUser('${u.id}')">
                            <i class="fa-solid fa-trash"></i> Delete
                        </button>
                    </div>
                </td>
            </tr>
        `).join('') : `<tr><td colspan="7" class="text-center text-muted" style="padding: 3rem 1rem;">
            <div style="font-size: 2.5rem; margin-bottom: 0.75rem; opacity: 0.15;"><i class="fa-solid fa-folder-open"></i></div>
            No customer accounts found matching current search/filter.
        </td></tr>`;

        const paginationHtml = Pagination.renderControls('users', filteredUsers.length, 10);

        return `
            ${UI.renderPageHeader('Customer Accounts Management', 'View and manage registered clients hiring labour on Skilliant.')}
            ${UI.renderControlsBar('userSearchInput', 'Search users by name, email or phone...', [
                { id: 'statusFilter', label: 'Filter Status', options: ['Active', 'Suspended'] }
            ], `<button class="btn btn-primary" onclick="UsersPage.addUserModal()"><i class="fa-solid fa-plus"></i> Add Customer</button>`, { csvFn: 'UsersPage.exportCSV', pdfFn: 'UsersPage.exportPDF' })}
            ${UI.renderTable(['User Profile', 'Contact', 'Bookings', 'Total Spent', 'Joined Date', 'Status', 'Actions'], rowsHtml, paginationHtml)}
        `;
    },

    init() {
        const searchEl = document.getElementById('userSearchInput');
        const filterEl = document.getElementById('statusFilter');

        if (searchEl) {
            searchEl.value = this.state.search;
            searchEl.addEventListener('input', (e) => {
                this.state.search = e.target.value;
                Pagination.getState('users', 0, 10).page = 1; // reset page
                App.refreshCurrentPage();
            });
        }

        if (filterEl) {
            filterEl.value = this.state.status;
            filterEl.addEventListener('change', (e) => {
                this.state.status = e.target.value;
                Pagination.getState('users', 0, 10).page = 1; // reset page
                App.refreshCurrentPage();
            });
        }
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
                    <div class="table-avatar" style="width:60px; height:60px; font-size:1.4rem; background: var(--primary-navy); color: var(--text-white); display:flex; align-items:center; justify-content:center; border-radius:50%;">
                        ${u.name.split(' ').map(n=>n[0]).join('').toUpperCase()}
                    </div>
                    <div>
                        <h3 style="font-size:1.2rem; font-weight:700; color: var(--primary-navy);">${u.name}</h3>
                        <p style="color:var(--text-muted); font-size:0.85rem;">${u.email} • ${u.phone}</p>
                    </div>
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; font-size:0.9rem;">
                    <div style="background:var(--primary-blue-light); padding:1rem; border-radius:8px; border: 1px solid var(--border-color);">
                        <span style="color:var(--text-muted); font-size:0.75rem; display:block;">Total Bookings Created</span>
                        <strong style="color: var(--primary-navy); font-size: 1.1rem;">${u.totalBookings} Jobs</strong>
                    </div>
                    <div style="background:var(--primary-blue-light); padding:1rem; border-radius:8px; border: 1px solid var(--border-color);">
                        <span style="color:var(--text-muted); font-size:0.75rem; display:block;">Total Volume Spent</span>
                        <strong style="color: var(--primary-navy); font-size: 1.1rem;">${u.spent}</strong>
                    </div>
                </div>
                <div style="margin-top: 1.25rem; font-size: 0.85rem; color: var(--text-muted);">
                    Registered on: <strong>${u.joinedDate}</strong><br>
                    Current Account Status: <strong>${u.status}</strong>
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
                        <label style="font-size:0.85rem; font-weight:600;">Full Name <span class="text-danger">*</span></label>
                        <input type="text" id="newUserName" class="form-control" style="width:100%; margin-top:4px;" placeholder="e.g. Rachel Green" required>
                    </div>
                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Email Address <span class="text-danger">*</span></label>
                        <input type="email" id="newUserEmail" class="form-control" style="width:100%; margin-top:4px;" placeholder="rachel@example.com" required>
                    </div>
                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Phone Number</label>
                        <input type="text" id="newUserPhone" class="form-control" style="width:100%; margin-top:4px;" placeholder="+1 555-0199">
                    </div>
                </div>
            `,
            submitText: 'Create Account',
            onSubmit: () => {
                const name = document.getElementById('newUserName')?.value.trim();
                const email = document.getElementById('newUserEmail')?.value.trim();
                const phone = document.getElementById('newUserPhone')?.value.trim();

                if (!name || !email) {
                    Toast.show('Please fill in name and email.', 'warning');
                    return;
                }
                if (!email.includes('@')) {
                    Toast.show('Please enter a valid email address.', 'warning');
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
    },

    editUserModal(id) {
        const users = DataService.getCollection(DataService.KEYS.USERS);
        const u = users.find(x => x.id === id);
        if (!u) return;

        ModalManager.open({
            title: `Edit Customer Account: ${u.name}`,
            bodyHtml: `
                <div style="display:flex; flex-direction:column; gap:1rem;">
                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Full Name <span class="text-danger">*</span></label>
                        <input type="text" id="editUserName" class="form-control" style="width:100%; margin-top:4px;" value="${u.name}" required>
                    </div>
                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Email Address <span class="text-danger">*</span></label>
                        <input type="email" id="editUserEmail" class="form-control" style="width:100%; margin-top:4px;" value="${u.email}" required>
                    </div>
                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Phone Number</label>
                        <input type="text" id="editUserPhone" class="form-control" style="width:100%; margin-top:4px;" value="${u.phone}">
                    </div>
                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Account Status</label>
                        <select id="editUserStatus" class="form-control" style="width:100%; margin-top:4px;">
                            <option value="Active" ${u.status === 'Active' ? 'selected' : ''}>Active</option>
                            <option value="Suspended" ${u.status === 'Suspended' ? 'selected' : ''}>Suspended</option>
                        </select>
                    </div>
                </div>
            `,
            submitText: 'Save Changes',
            onSubmit: () => {
                const name = document.getElementById('editUserName')?.value.trim();
                const email = document.getElementById('editUserEmail')?.value.trim();
                const phone = document.getElementById('editUserPhone')?.value.trim();
                const status = document.getElementById('editUserStatus')?.value;

                if (!name || !email) {
                    Toast.show('Please fill in name and email.', 'warning');
                    return;
                }

                u.name = name;
                u.email = email;
                u.phone = phone || u.phone;
                u.status = status;

                DataService.setStorage(DataService.KEYS.USERS, users);
                DataService.logActivity(`Updated customer account details for ${name}`);
                Toast.show(`Customer account ${name} updated successfully!`, 'success');
                ModalManager.close();
                App.refreshCurrentPage();
            }
        });
    },

    deleteUser(id) {
        const users = DataService.getCollection(DataService.KEYS.USERS);
        const u = users.find(x => x.id === id);
        if (!u) return;

        if (confirm(`Are you sure you want to permanently delete customer account: ${u.name}?`)) {
            DataService.deleteItem(DataService.KEYS.USERS, 'id', id);
            DataService.logActivity(`Deleted customer account ${u.name}`);
            Toast.show(`Customer account ${u.name} deleted.`, 'info');
            App.refreshCurrentPage();
        }
    },

    exportCSV() {
        const users = DataService.getCollection(DataService.KEYS.USERS) || [];
        const headers = ['ID', 'Name', 'Email', 'Phone', 'Total Bookings', 'Spent', 'Joined Date', 'Status'];
        const rows = users.map(u => [u.id, u.name, u.email, u.phone, u.totalBookings, u.spent, u.joinedDate, u.status]);
        ExportUtil.toCSV(headers, rows, 'customers_list');
    },

    exportPDF() {
        const users = DataService.getCollection(DataService.KEYS.USERS) || [];
        const tableRows = users.map(u => `
            <tr>
                <td>${u.id}</td>
                <td>${u.name}</td>
                <td>${u.email}</td>
                <td>${u.phone}</td>
                <td>${u.totalBookings}</td>
                <td>${u.spent}</td>
                <td>${u.joinedDate}</td>
                <td>${u.status}</td>
            </tr>
        `).join('');

        const tableHtml = `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Bookings</th>
                        <th>Spent</th>
                        <th>Joined</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
        `;
        ExportUtil.print('Skilliant Customer Accounts Report', tableHtml);
    }
};
