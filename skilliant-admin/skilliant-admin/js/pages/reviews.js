/**
 * Day 3 Deliverable: Rating & Reviews Moderation (SaaS-Ready Audit)
 */

const ReviewsPage = {
    state: {
        search: '',
        status: ''
    },

    render() {
        const reviews = DataService.getCollection(DataService.KEYS.REVIEWS) || [];

        // Apply filters
        const filteredReviews = reviews.filter(r => {
            const matchesSearch = (r.reviewerName || '').toLowerCase().includes(this.state.search.toLowerCase()) ||
                (r.labourName || '').toLowerCase().includes(this.state.search.toLowerCase()) ||
                (r.comment || '').toLowerCase().includes(this.state.search.toLowerCase());
            const matchesStatus = !this.state.status || r.status === this.state.status;
            return matchesSearch && matchesStatus;
        });

        // Paginate
        const paginatedReviews = Pagination.getPageItems('reviews', filteredReviews, 10);

        const rowsHtml = paginatedReviews.length > 0 ? paginatedReviews.map(r => `
            <tr>
                <td><strong>${r.id}</strong></td>
                <td><code>${r.bookingId}</code></td>
                <td><strong>${r.reviewerName}</strong></td>
                <td><span class="badge badge-info">${r.labourName}</span></td>
                <td>
                    <div class="flex items-center gap-1">
                        <i class="fa-solid fa-star text-orange" style="font-size:14px; color: var(--accent-orange);"></i>
                        <strong>${r.rating} / 5</strong>
                    </div>
                </td>
                <td style="max-width:300px; font-size:0.85rem; line-height:1.4;">"${r.comment}"</td>
                <td>${r.date || '—'}</td>
                <td>${UI.renderBadge(r.status)}</td>
                <td>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn btn-outline btn-sm" onclick="ReviewsPage.toggleStatus('${r.id}')">
                            <i class="fa-solid ${r.status === 'Approved' ? 'fa-flag' : 'fa-circle-check'}"></i> ${r.status === 'Approved' ? 'Flag' : 'Approve'}
                        </button>
                        <button class="btn btn-outline btn-sm text-danger" onclick="ReviewsPage.deleteReview('${r.id}')">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('') : `<tr><td colspan="9" class="text-center text-muted" style="padding: 3rem 1rem;">
            <div style="font-size: 2.5rem; margin-bottom: 0.75rem; opacity: 0.15;"><i class="fa-solid fa-folder-open"></i></div>
            No reviews found matching current search/filter.
        </td></tr>`;

        const paginationHtml = Pagination.renderControls('reviews', filteredReviews.length, 10);

        const totalReviews = reviews.length;
        const avgRating = totalReviews > 0
            ? (reviews.reduce((sum, r) => sum + (parseFloat(r.rating) || 0), 0) / totalReviews).toFixed(1)
            : '—';
        const approvedCount = reviews.filter(r => r.status === 'Approved').length;
        const flaggedCount  = reviews.filter(r => r.status === 'Flagged').length;

        const kpis = [
            { title: 'Average Platform Rating', value: `${avgRating} ★`, subtext: 'Based on customer feedback', trendUp: true, icon: 'fa-solid fa-star', colorClass: 'kpi-icon-gold' },
            { title: 'Total Customer Reviews', value: totalReviews, subtext: 'Lifetime reviews', trendUp: true, icon: 'fa-solid fa-comments', colorClass: 'kpi-icon-blue' },
            { title: 'Approved Reviews', value: approvedCount, subtext: 'Published on platform', trendUp: true, icon: 'fa-solid fa-circle-check', colorClass: 'kpi-icon-green' },
            { title: 'Flagged / Hidden', value: flaggedCount, subtext: 'Requires moderation', trendUp: false, icon: 'fa-solid fa-flag', colorClass: 'kpi-icon-red' }
        ];

        return `
            ${UI.renderPageHeader('Ratings & Reviews Moderation', 'Monitor and moderate feedback left by customers.')}
            ${UI.renderKpiCards(kpis)}
            ${UI.renderControlsBar('reviewSearchInput', 'Search reviews by customer, recipient or comment content...', [
                { id: 'reviewStatusFilter', label: 'Filter Status', options: ['Approved', 'Flagged'] }
            ], '', null)}
            ${UI.renderTable(['Review ID', 'Booking ID', 'Reviewer', 'Recipient / Talent', 'Rating', 'Comment Preview', 'Date', 'Status', 'Actions'], rowsHtml, paginationHtml)}
        `;
    },

    init() {
        const searchEl = document.getElementById('reviewSearchInput');
        const filterEl = document.getElementById('reviewStatusFilter');

        if (searchEl) {
            searchEl.value = this.state.search;
            searchEl.addEventListener('input', (e) => {
                this.state.search = e.target.value;
                Pagination.getState('reviews', 0, 10).page = 1;
                App.refreshCurrentPage();
            });
        }

        if (filterEl) {
            filterEl.value = this.state.status;
            filterEl.addEventListener('change', (e) => {
                this.state.status = e.target.value;
                Pagination.getState('reviews', 0, 10).page = 1;
                App.refreshCurrentPage();
            });
        }
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
    },

    deleteReview(id) {
        const reviews = DataService.getCollection(DataService.KEYS.REVIEWS);
        const r = reviews.find(x => x.id === id);
        if (!r) return;

        if (confirm(`Are you sure you want to permanently delete review ${r.id} left by ${r.reviewerName}?`)) {
            DataService.deleteItem(DataService.KEYS.REVIEWS, 'id', id);
            DataService.logActivity(`Deleted review ${r.id} left by ${r.reviewerName}`);
            Toast.show(`Review ${r.id} has been deleted.`, 'info');
            App.refreshCurrentPage();
        }
    }
};
