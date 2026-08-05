/**
 * Day 3 Deliverable: Rating & Reviews Moderation
 */

const ReviewsPage = {
    render() {
        const reviews = DataService.getCollection(DataService.KEYS.REVIEWS) || [];

        const rowsHtml = reviews.length > 0 ? reviews.map(r => `
            <tr>
                <td><strong>${r.id}</strong></td>
                <td><strong>${r.reviewer}</strong></td>
                <td><span class="badge badge-info">${r.target}</span></td>
                <td>
                    <div class="flex items-center gap-1">
                        <span class="material-icons-round text-orange" style="font-size:18px;">star</span>
                        <strong>${r.rating} / 5</strong>
                    </div>
                </td>
                <td style="max-width:300px; font-size:0.85rem;">"${r.comment}"</td>
                <td>${r.date}</td>
                <td>${UI.renderBadge(r.status)}</td>
                <td>
                    <button class="btn btn-outline btn-sm" onclick="ReviewsPage.toggleStatus('${r.id}')">
                        ${r.status === 'Approved' ? 'Flag' : 'Approve'}
                    </button>
                </td>
            </tr>
        `).join('') : '<tr><td colspan="10" class="text-center text-muted" style="padding: 2rem;">No records found.</td></tr>';

        return `
            ${UI.renderPageHeader('Ratings & Reviews Moderation', 'Monitor feedback left by customers and contractors.')}
            ${UI.renderControlsBar('reviewSearchInput', 'Search reviews by customer or comment content...', [])}
            ${UI.renderTable(['Review ID', 'Reviewer', 'Recipient / Talent', 'Rating', 'Comment Preview', 'Date', 'Status', 'Action'], rowsHtml)}
        `;
    },

    init() {
        document.getElementById('reviewSearchInput')?.addEventListener('input', (e) => {
            const val = e.target.value.toLowerCase();
            const rows = document.querySelectorAll('.data-table tbody tr');
            rows.forEach(r => {
                r.style.display = r.textContent.toLowerCase().includes(val) ? '' : 'none';
            });
        });
    },

    toggleStatus(id) {
        const reviews = DataService.getCollection(DataService.KEYS.REVIEWS);
        const r = reviews.find(x => x.id === id);
        if (r) {
            r.status = r.status === 'Approved' ? 'Flagged' : 'Approved';
            DataService.setStorage(DataService.KEYS.REVIEWS, reviews);
            DataService.logActivity(`Toggled status of review ${id} to ${r.status}`);
            Toast.show(`Review ${id} status set to ${r.status}`, 'success');
            App.refreshCurrentPage();
        }
    }
};
