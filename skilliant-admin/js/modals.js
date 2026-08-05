/**
 * Skilliant Admin Portal - Modal Manager
 * Handles dialog openings, forms, custom actions, and closing triggers.
 */

const ModalManager = {
    overlay: null,
    titleEl: null,
    bodyEl: null,
    submitBtn: null,
    cancelBtn: null,
    onSubmitCallback: null,

    init() {
        this.overlay = document.getElementById('modalOverlay');
        this.titleEl = document.getElementById('modalTitle');
        this.bodyEl = document.getElementById('modalBody');
        this.submitBtn = document.getElementById('modalSubmitBtn');
        this.cancelBtn = document.getElementById('modalCancelBtn');

        const closeBtn = document.getElementById('modalCloseBtn');
        closeBtn?.addEventListener('click', () => this.close());
        this.cancelBtn?.addEventListener('click', () => this.close());

        this.overlay?.addEventListener('click', (e) => {
            if (e.target === this.overlay) this.close();
        });

        this.submitBtn?.addEventListener('click', () => {
            if (typeof this.onSubmitCallback === 'function') {
                this.onSubmitCallback();
            }
        });
    },

    open({ title, bodyHtml, submitText = 'Save Changes', submitBtnClass = 'btn-primary', onSubmit }) {
        if (!this.overlay) this.init();

        this.titleEl.textContent = title;
        this.bodyEl.innerHTML = bodyHtml;
        this.submitBtn.textContent = submitText;
        this.submitBtn.className = `btn ${submitBtnClass}`;
        this.onSubmitCallback = onSubmit;

        this.overlay.classList.add('active');
    },

    close() {
        if (this.overlay) {
            this.overlay.classList.remove('active');
            this.onSubmitCallback = null;
        }
    }
};

document.addEventListener('DOMContentLoaded', () => ModalManager.init());
