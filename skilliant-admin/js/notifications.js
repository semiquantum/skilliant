/**
 * Skilliant Admin Portal - Notifications & Toast System
 */

const Toast = {
    container: null,

    init() {
        this.container = document.getElementById('toastContainer');
    },

    show(message, type = 'info', duration = 3500) {
        if (!this.container) this.init();

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const icons = {
            success: 'check_circle',
            warning: 'warning',
            danger: 'error',
            info: 'info'
        };

        toast.innerHTML = `
            <span class="material-icons-round text-${type === 'info' ? 'primary' : type}">${icons[type] || 'info'}</span>
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
