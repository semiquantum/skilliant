/**
 * Skilliant Admin Portal — Notifications & Toast System
 * Bug fix: was using material-icons icon names in FA6 context.
 */

const Toast = {
    container: null,

    init() {
        this.container = document.getElementById('toastContainer');
    },

    show(message, type = 'info', duration = 3500) {
        if (!this.container) this.init();
        if (!this.container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.setAttribute('role', 'status');
        toast.setAttribute('aria-live', 'polite');

        // FA6 icon names (was broken with material-icons names)
        const icons = {
            success: 'fa-circle-check',
            warning: 'fa-triangle-exclamation',
            danger:  'fa-circle-xmark',
            error:   'fa-circle-xmark',
            info:    'fa-circle-info'
        };

        toast.innerHTML = `
            <i class="fa-solid ${icons[type] || icons.info}" aria-hidden="true"></i>
            <span>${message}</span>
        `;

        this.container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(40px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
};

document.addEventListener('DOMContentLoaded', () => Toast.init());
