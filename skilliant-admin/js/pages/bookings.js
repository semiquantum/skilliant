/**
 * Day 3 Deliverable: Bookings Lifecycle & Assignments (SaaS-Ready Audit)
 */

const BookingsPage = {
    state: {
        search: '',
        status: ''
    },

    render() {
        const bookings = DataService.getCollection(DataService.KEYS.BOOKINGS) || [];

        // Apply filters
        const filteredBookings = bookings.filter(b => {
            const matchesSearch = b.id.toLowerCase().includes(this.state.search.toLowerCase()) ||
                (b.customer || '').toLowerCase().includes(this.state.search.toLowerCase()) ||
                (b.assignedTo || '').toLowerCase().includes(this.state.search.toLowerCase()) ||
                (b.category || '').toLowerCase().includes(this.state.search.toLowerCase());
            const matchesStatus = !this.state.status || b.status === this.state.status;
            return matchesSearch && matchesStatus;
        });

        // Paginate
        const paginatedBookings = Pagination.getPageItems('bookings', filteredBookings, 10);

        const rowsHtml = paginatedBookings.length > 0 ? paginatedBookings.map(b => `
            <tr>
                <td><strong>${b.id}</strong></td>
                <td>${b.customer}</td>
                <td><span class="badge badge-secondary">${b.assignedTo}</span></td>
                <td>${b.category}</td>
                <td><strong>${b.amount}</strong></td>
                <td>${b.date}</td>
                <td>${UI.renderBadge(b.status)}</td>
                <td>${UI.renderBadge(b.escrowStatus)}</td>
                <td>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn btn-outline btn-sm" onclick="BookingsPage.manageModal('${b.id}')">
                            <i class="fa-solid fa-gear"></i> Manage
                        </button>
                        <button class="btn btn-outline btn-sm text-danger" onclick="BookingsPage.deleteBooking('${b.id}')">
                            <i class="fa-solid fa-trash"></i> Delete
                        </button>
                    </div>
                </td>
            </tr>
        `).join('') : `<tr><td colspan="9" class="text-center text-muted" style="padding: 3rem 1rem;">
            <div style="font-size: 2.5rem; margin-bottom: 0.75rem; opacity: 0.15;"><i class="fa-solid fa-folder-open"></i></div>
            No platform bookings found matching current search/filter.
        </td></tr>`;

        const paginationHtml = Pagination.renderControls('bookings', filteredBookings.length, 10);

        return `
            ${UI.renderPageHeader('Labour Booking Operations', 'Monitor, assign, and manage job requests, escrow holds, and disputes.', `
                <button class="btn btn-primary" onclick="BookingsPage.addBookingModal()">
                    <i class="fa-solid fa-plus"></i> Create Booking
                </button>
            `)}
            ${UI.renderControlsBar('bookingSearchInput', 'Search bookings by ID, customer or talent...', [
                { id: 'bookingStatusFilter', label: 'Booking Status', options: ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'] }
            ], '', { csvFn: 'BookingsPage.exportCSV', pdfFn: 'BookingsPage.exportPDF' })}
            ${UI.renderTable(['Booking ID', 'Customer', 'Assigned Talent', 'Category', 'Job Value', 'Target Date', 'Status', 'Escrow State', 'Actions'], rowsHtml, paginationHtml)}
        `;
    },

    init() {
        const searchEl = document.getElementById('bookingSearchInput');
        const filterEl = document.getElementById('bookingStatusFilter');

        if (searchEl) {
            searchEl.value = this.state.search;
            searchEl.addEventListener('input', (e) => {
                this.state.search = e.target.value;
                Pagination.getState('bookings', 0, 10).page = 1;
                App.refreshCurrentPage();
            });
        }

        if (filterEl) {
            filterEl.value = this.state.status;
            filterEl.addEventListener('change', (e) => {
                this.state.status = e.target.value;
                Pagination.getState('bookings', 0, 10).page = 1;
                App.refreshCurrentPage();
            });
        }
    },

    addBookingModal() {
        const customers = DataService.getCollection(DataService.KEYS.USERS) || [];
        const labourers = DataService.getCollection(DataService.KEYS.LABOURS) || [];
        const categories = DataService.getCollection(DataService.KEYS.CATEGORIES) || [];

        const customerOptions = customers.map(c => `<option value="${c.id}">${c.name} (${c.email})</option>`).join('');
        const labourOptions = `<option value="">Leave Unassigned (Pending)</option>` + labourers.map(l => `<option value="${l.id}">${l.name} (${l.skill})</option>`).join('');
        const categoryOptions = categories.map(cat => `<option value="${cat.name}">${cat.name}</option>`).join('');

        ModalManager.open({
            title: 'Create New Job Booking',
            bodyHtml: `
                <div style="display:flex; flex-direction:column; gap:1rem;">
                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Select Customer <span class="text-danger">*</span></label>
                        <select id="newBkCustomer" class="form-control" style="width:100%; margin-top:4px;" required>
                            ${customerOptions || '<option value="">No customers available</option>'}
                        </select>
                    </div>
                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Assign Trade / Service Category <span class="text-danger">*</span></label>
                        <select id="newBkCategory" class="form-control" style="width:100%; margin-top:4px;" required>
                            ${categoryOptions || '<option value="Plumbing">Plumbing</option><option value="Electrical">Electrical</option>'}
                        </select>
                    </div>
                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Assign Tradesman / Talent</label>
                        <select id="newBkLabour" class="form-control" style="width:100%; margin-top:4px;">
                            ${labourOptions}
                        </select>
                    </div>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
                        <div>
                            <label style="font-size:0.85rem; font-weight:600;">Job Value ($) <span class="text-danger">*</span></label>
                            <input type="number" id="newBkAmount" class="form-control" style="width:100%; margin-top:4px;" placeholder="e.g. 250" required>
                        </div>
                        <div>
                            <label style="font-size:0.85rem; font-weight:600;">Scheduled Date <span class="text-danger">*</span></label>
                            <input type="date" id="newBkDate" class="form-control" style="width:100%; margin-top:4px;" required>
                        </div>
                    </div>
                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Job Requirements / Notes</label>
                        <textarea id="newBkNotes" class="form-control" style="width:100%; margin-top:4px; height:60px;" placeholder="e.g. Fix leak in master bathroom"></textarea>
                    </div>
                </div>
            `,
            submitText: 'Create Booking',
            onSubmit: () => {
                const custId = document.getElementById('newBkCustomer')?.value;
                const category = document.getElementById('newBkCategory')?.value;
                const labourId = document.getElementById('newBkLabour')?.value;
                const amount = document.getElementById('newBkAmount')?.value.trim();
                const date = document.getElementById('newBkDate')?.value;
                const notes = document.getElementById('newBkNotes')?.value.trim();

                if (!custId || !category || !amount || !date) {
                    Toast.show('Please fill in all required fields.', 'warning');
                    return;
                }

                const customer = (customers.find(c => c.id === custId))?.name || 'Unknown';
                const labour = labourId ? ((labours.find(l => l.id === labourId))?.name || 'Unassigned') : 'Unassigned';

                const newBooking = {
                    id: `BK-${Date.now().toString().slice(-4)}`,
                    customer,
                    customerId: custId,
                    assignedTo: labour,
                    assignedId: labourId || '',
                    category,
                    amount: `$${parseFloat(amount).toFixed(2)}`,
                    date,
                    status: labourId ? 'Confirmed' : 'Pending',
                    escrowStatus: 'Held',
                    notes: notes || 'No notes'
                };

                // Add to bookings
                DataService.addItem(DataService.KEYS.BOOKINGS, newBooking);

                // Add automatically to payments collection in 'Pending' state
                const newPayment = {
                    id: `PAY-${Date.now().toString().slice(-4)}`,
                    bookingId: newBooking.id,
                    userId: custId,
                    userName: customer,
                    amount: parseFloat(amount),
                    commissionFee: parseFloat((amount * 0.1).toFixed(2)),
                    method: 'Credit Card',
                    status: 'Pending',
                    date: new Date().toISOString().split('T')[0]
                };
                DataService.addItem(DataService.KEYS.PAYMENTS, newPayment);

                // Update Wallet escrow
                const wallet = DataService.getStorage(DataService.KEYS.WALLET);
                if (wallet) {
                    wallet.escrowBalance += parseFloat(amount);
                    DataService.setStorage(DataService.KEYS.WALLET, wallet);
                }

                // Create a platform notification
                const newNotification = {
                    id: `NOT-${Date.now().toString().slice(-4)}`,
                    title: 'New Booking Created',
                    message: `Booking ${newBooking.id} has been created by ${customer} for ${category} service.`,
                    category: 'Booking',
                    time: 'Just now',
                    unread: true
                };
                DataService.addItem(DataService.KEYS.NOTIFICATIONS, newNotification);

                DataService.logActivity(`Created booking ${newBooking.id} for ${customer}`);
                Toast.show(`Booking ${newBooking.id} created successfully!`, 'success');
                ModalManager.close();
                App.refreshCurrentPage();
            }
        });
    },

    manageModal(id) {
        const list = DataService.getCollection(DataService.KEYS.BOOKINGS);
        const b = list.find(x => x.id === id);
        if (!b) return;

        ModalManager.open({
            title: `Manage Booking: ${b.id}`,
            bodyHtml: `
                <div style="display:flex; flex-direction:column; gap:1rem;">
                    <div style="background:var(--primary-blue-light); padding:1rem; border-radius:8px; font-size:0.9rem; border: 1px solid var(--border-color);">
                        <p style="margin-bottom:4px;"><strong>Customer Name:</strong> ${b.customer}</p>
                        <p style="margin-bottom:4px;"><strong>Assigned Talent:</strong> ${b.assignedTo}</p>
                        <p style="margin-bottom:4px;"><strong>Job Value:</strong> ${b.amount}</p>
                        <p style="margin-bottom:4px;"><strong>Scheduled Date:</strong> ${b.date}</p>
                        <p style="margin-bottom:0;"><strong>Job Notes:</strong> ${b.notes || 'N/A'}</p>
                    </div>

                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Update Job Status</label>
                        <select id="updateBookingStatus" class="form-control" style="width:100%; margin-top:4px;">
                            <option value="Pending" ${b.status === 'Pending' ? 'selected' : ''}>Pending</option>
                            <option value="Confirmed" ${b.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
                            <option value="In Progress" ${b.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                            <option value="Completed" ${b.status === 'Completed' ? 'selected' : ''}>Completed</option>
                            <option value="Cancelled" ${b.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                        </select>
                    </div>
                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Escrow State</label>
                        <select id="updateEscrowStatus" class="form-control" style="width:100%; margin-top:4px;">
                            <option value="Held" ${b.escrowStatus === 'Held' ? 'selected' : ''}>Held</option>
                            <option value="Held in Escrow" ${b.escrowStatus === 'Held in Escrow' ? 'selected' : ''}>Held in Escrow</option>
                            <option value="Released" ${b.escrowStatus === 'Released' ? 'selected' : ''}>Released</option>
                            <option value="Refunded" ${b.escrowStatus === 'Refunded' ? 'selected' : ''}>Refunded</option>
                        </select>
                    </div>
                </div>
            `,
            submitText: 'Save Changes',
            onSubmit: () => {
                const newStatus = document.getElementById('updateBookingStatus')?.value;
                const newEscrow = document.getElementById('updateEscrowStatus')?.value;

                // Sync payments if completed/cancelled
                const payments = DataService.getCollection(DataService.KEYS.PAYMENTS);
                const p = payments.find(pay => pay.bookingId === b.id);
                const wallet = DataService.getStorage(DataService.KEYS.WALLET);
                const jobVal = parseFloat(b.amount.replace(/[^0-9.]/g, '')) || 0;

                if (newStatus === 'Completed' && b.status !== 'Completed') {
                    b.escrowStatus = 'Released';
                    if (p) {
                        p.status = 'Completed';
                        if (wallet) {
                            wallet.escrowBalance = Math.max(0, wallet.escrowBalance - jobVal);
                            wallet.totalProcessed += jobVal;
                            wallet.platformCommission += p.commissionFee;
                        }
                    }
                } else if (newStatus === 'Cancelled' && b.status !== 'Cancelled') {
                    b.escrowStatus = 'Refunded';
                    if (p) {
                        p.status = 'Refunded';
                        if (wallet) {
                            wallet.escrowBalance = Math.max(0, wallet.escrowBalance - jobVal);
                        }
                    }
                } else {
                    b.escrowStatus = newEscrow;
                }

                b.status = newStatus;

                DataService.setStorage(DataService.KEYS.BOOKINGS, list);
                if (p) DataService.setStorage(DataService.KEYS.PAYMENTS, payments);
                if (wallet) DataService.setStorage(DataService.KEYS.WALLET, wallet);

                DataService.logActivity(`Updated booking ${b.id} status to ${newStatus}`);
                Toast.show(`Booking ${b.id} updated successfully!`, 'success');
                ModalManager.close();
                App.refreshCurrentPage();
            }
        });
    },

    deleteBooking(id) {
        const list = DataService.getCollection(DataService.KEYS.BOOKINGS);
        const b = list.find(x => x.id === id);
        if (!b) return;

        if (confirm(`Are you sure you want to permanently delete booking record: ${b.id}?`)) {
            DataService.deleteItem(DataService.KEYS.BOOKINGS, 'id', id);
            DataService.logActivity(`Deleted booking record ${b.id}`);
            Toast.show(`Booking ${b.id} record deleted.`, 'info');
            App.refreshCurrentPage();
        }
    },

    exportCSV() {
        const bookings = DataService.getCollection(DataService.KEYS.BOOKINGS) || [];
        const headers = ['Booking ID', 'Customer', 'Assigned Talent', 'Category', 'Job Value', 'Target Date', 'Status', 'Escrow State'];
        const rows = bookings.map(b => [b.id, b.customer, b.assignedTo, b.category, b.amount, b.date, b.status, b.escrowStatus]);
        ExportUtil.toCSV(headers, rows, 'bookings_list');
    },

    exportPDF() {
        const bookings = DataService.getCollection(DataService.KEYS.BOOKINGS) || [];
        const tableRows = bookings.map(b => `
            <tr>
                <td>${b.id}</td>
                <td>${b.customer}</td>
                <td>${b.assignedTo}</td>
                <td>${b.category}</td>
                <td>${b.amount}</td>
                <td>${b.date}</td>
                <td>${b.status}</td>
                <td>${b.escrowStatus}</td>
            </tr>
        `).join('');

        const tableHtml = `
            <table>
                <thead>
                    <tr>
                        <th>Booking ID</th>
                        <th>Customer</th>
                        <th>Assigned Talent</th>
                        <th>Category</th>
                        <th>Job Value</th>
                        <th>Target Date</th>
                        <th>Status</th>
                        <th>Escrow State</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
        `;
        ExportUtil.print('Skilliant Platform Bookings Report', tableHtml);
    }
};
