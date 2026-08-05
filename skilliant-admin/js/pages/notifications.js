/**
 * Day 5 Deliverable: Broadcast Notifications Module
 */

const NotificationsPage = {
    render() {
        const list = DataService.getCollection(DataService.KEYS.NOTIFICATIONS) || [];

        const rowsHtml = list.length > 0 ? list.map(n => `
            <tr>
                <td><strong>${n.id}</strong></td>
                <td><strong>${n.title}</strong></td>
                <td style="max-width:300px; font-size:0.85rem;">${n.message}</td>
                <td><span class="badge badge-info">${n.category}</span></td>
                <td>${n.time}</td>
                <td>${n.unread ? UI.renderBadge('Unread', 'warning') : UI.renderBadge('Read', 'secondary')}</td>
            </tr>
        `).join('') : '<tr><td colspan="10" class="text-center text-muted" style="padding: 2rem;">No records found.</td></tr>';

        return `
            ${UI.renderPageHeader('Platform Notifications & Broadcasts', 'Send push alerts to users and review system notifications.', `
                <button class="btn btn-primary" onclick="NotificationsPage.broadcastModal()">
                    <span class="material-icons-round">campaign</span> Send Push Broadcast
                </button>
            `)}
            ${UI.renderTable(['Notification ID', 'Title / Alert', 'Message Body', 'Category', 'Time Sent', 'Status'], rowsHtml)}
        `;
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
                        <label style="font-size:0.85rem; font-weight:600;">Notification Title</label>
                        <input type="text" id="notifTitle" class="form-control" style="width:100%; margin-top:4px;" placeholder="e.g. New Platform Escrow Feature Released!">
                    </div>
                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Notification Message Body</label>
                        <textarea id="notifBody" class="form-control" style="width:100%; margin-top:4px; height:90px;" placeholder="Write your broadcast announcement..."></textarea>
                    </div>
                </div>
            `,
            submitText: 'Send Broadcast Now',
            onSubmit: () => {
                const target = document.getElementById('notifTarget')?.value;
                const title = document.getElementById('notifTitle')?.value;
                const message = document.getElementById('notifBody')?.value;

                if (!title || !message) {
                    Toast.show('Please fill in title and message body', 'warning');
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
