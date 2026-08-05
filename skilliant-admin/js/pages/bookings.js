/**
 * Day 3 Deliverable: Bookings Lifecycle & Assignments
 */

const BookingsPage = {
    render() {
        const bookings = DataService.getCollection(DataService.KEYS.BOOKINGS) || [];

        const rowsHtml = bookings.length > 0 ? bookings.map(b => `
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
                    <button class="btn btn-outline btn-sm" onclick="BookingsPage.manageModal('${b.id}')">Manage</button>
                </td>
            </tr>
        `).join('') : '<tr><td colspan="10" class="text-center text-muted" style="padding: 2rem;">No records found.</td></tr>';

        return `
            ${UI.renderPageHeader('Labour Booking Operations', 'Monitor, assign, and manage job requests, escrow holds, and disputes.')}
            ${UI.renderControlsBar('bookingSearchInput', 'Search bookings by ID, customer or talent...', [
                { id: 'statusFilter', label: 'Booking Status', options: ['Completed', 'In Progress', 'Pending', 'Confirmed', 'Cancelled'] }
            ])}
            ${UI.renderTable(['Booking ID', 'Customer', 'Assigned Talent', 'Category', 'Job Value', 'Target Date', 'Status', 'Escrow State', 'Actions'], rowsHtml)}
        `;
    },

    init() {
        document.getElementById('bookingSearchInput')?.addEventListener('input', (e) => {
            const val = e.target.value.toLowerCase();
            const rows = document.querySelectorAll('.data-table tbody tr');
            rows.forEach(r => {
                r.style.display = r.textContent.toLowerCase().includes(val) ? '' : 'none';
            });
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
                    <div style="background:#F8FAFC; padding:1rem; border-radius:8px; font-size:0.9rem;">
                        <p><strong>Customer:</strong> ${b.customer}</p>
                        <p><strong>Assigned Talent:</strong> ${b.assignedTo}</p>
                        <p><strong>Job Amount:</strong> ${b.amount}</p>
                    </div>

                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Update Status</label>
                        <select id="updateBookingStatus" class="form-control" style="width:100%; margin-top:4px;">
                            <option value="Pending" ${b.status === 'Pending' ? 'selected' : ''}>Pending</option>
                            <option value="Confirmed" ${b.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
                            <option value="In Progress" ${b.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                            <option value="Completed" ${b.status === 'Completed' ? 'selected' : ''}>Completed</option>
                            <option value="Cancelled" ${b.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                        </select>
                    </div>
                </div>
            `,
            submitText: 'Save Changes',
            onSubmit: () => {
                const newStatus = document.getElementById('updateBookingStatus')?.value;
                b.status = newStatus;
                if (newStatus === 'Completed') {
                    b.escrowStatus = 'Released';
                } else if (newStatus === 'Cancelled') {
                    b.escrowStatus = 'Refunded';
                }
                DataService.setStorage(DataService.KEYS.BOOKINGS, list);
                DataService.logActivity(`Updated booking ${b.id} status to ${newStatus}`);
                Toast.show(`Booking ${b.id} set to ${newStatus}`, 'success');
                ModalManager.close();
                App.refreshCurrentPage();
            }
        });
    }
};
