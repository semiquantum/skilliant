/**
 * Skilliant Admin Portal - Data Service Layer (Data Abstraction)
 * Serves as the single API abstraction layer for all Admin Portal UI modules.
 * Currently persists data in JavaScript LocalStorage.
 * 
 * Future Backend Integration Note:
 * To replace LocalStorage with Firebase or REST Node.js APIs, only modify this file.
 * The UI components, forms, and business logic will require ZERO changes.
 */

const DataService = {
    KEYS: {
        USERS: 'skilliant_users',
        LABOURS: 'skilliant_labours',
        CONTRACTORS: 'skilliant_contractors',
        BOOKINGS: 'skilliant_bookings',
        PAYMENTS: 'skilliant_payments',
        WALLET: 'skilliant_wallet',
        CATEGORIES: 'skilliant_categories',
        SKILLS: 'skilliant_skills',
        REVIEWS: 'skilliant_reviews',
        NOTIFICATIONS: 'skilliant_notifications',
        SUPPORT_TICKETS: 'skilliant_support_tickets',
        SETTINGS: 'skilliant_settings',
        ACTIVITY_LOGS: 'skilliant_activity_logs',
        SESSION: 'skilliant_admin_session',
        ROLES: 'skilliant_roles',
        REPORTS: 'skilliant_reports'
    },

    // Initialize Default Schema in LocalStorage if not present (Empty collections, default admin settings)
    init() {
        if (!localStorage.getItem(this.KEYS.SETTINGS)) {
            const defaultSettings = {
                adminName: 'Super Admin',
                adminEmail: 'admin@skilliant.com',
                adminPassword: 'admin123',
                adminPhone: '+1 555-0199',
                siteName: 'Skilliant – Online Labour Finding Platform',
                siteLogo: '',
                theme: 'light',
                darkMode: false,
                notificationsEnabled: true,
                securityAlerts: true,
                profilePhoto: '',
                timezone: 'UTC (GMT+0)',
                language: 'English'
            };
            this.setStorage(this.KEYS.SETTINGS, defaultSettings);
        }

        const collections = [
            this.KEYS.USERS,
            this.KEYS.LABOURS,
            this.KEYS.CONTRACTORS,
            this.KEYS.BOOKINGS,
            this.KEYS.PAYMENTS,
            this.KEYS.CATEGORIES,
            this.KEYS.SKILLS,
            this.KEYS.REVIEWS,
            this.KEYS.NOTIFICATIONS,
            this.KEYS.SUPPORT_TICKETS,
            this.KEYS.ACTIVITY_LOGS
        ];

        collections.forEach(key => {
            if (!localStorage.getItem(key)) {
                this.setStorage(key, []);
            }
        });

        if (!localStorage.getItem(this.KEYS.WALLET)) {
            this.setStorage(this.KEYS.WALLET, {
                escrowBalance: 0,
                platformCommission: 0,
                pendingPayouts: 0,
                payoutRequests: []
            });
        }
    },

    // Generic Storage Helpers
    getStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error(`Error reading ${key} from LocalStorage`, e);
            return null;
        }
    },

    setStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.error(`Error writing ${key} to LocalStorage`, e);
        }
    },

    // Log Activity Automatically
    logActivity(actionDescription) {
        const logs = this.getStorage(this.KEYS.ACTIVITY_LOGS) || [];
        const session = this.getSession();
        const adminName = session ? session.adminName : 'Admin User';
        
        const newLog = {
            id: `LOG-${Date.now().toString().slice(-5)}`,
            admin: adminName,
            action: actionDescription,
            timestamp: new Date().toLocaleString(),
            ip: '127.0.0.1 (Local)'
        };
        logs.unshift(newLog);
        this.setStorage(this.KEYS.ACTIVITY_LOGS, logs);
    },

    // --- AUTHENTICATION & SESSION MANAGEMENT ---
    login(email, password) {
        const settings = this.getStorage(this.KEYS.SETTINGS);
        if (email === settings.adminEmail && password === settings.adminPassword) {
            const session = {
                authenticated: true,
                adminName: settings.adminName,
                adminEmail: settings.adminEmail,
                loginTime: new Date().toISOString()
            };
            this.setStorage(this.KEYS.SESSION, session);
            this.logActivity('Admin User Logged In');
            return { success: true, session };
        } else {
            return { success: false, message: 'Invalid admin credentials.' };
        }
    },

    logout() {
        this.logActivity('Admin User Logged Out');
        localStorage.removeItem(this.KEYS.SESSION);
    },

    getSession() {
        return this.getStorage(this.KEYS.SESSION);
    },

    isAuthenticated() {
        const session = this.getSession();
        return session && session.authenticated === true;
    },

    // --- GENERIC COLLECTION CRUD ENGINE ---
    getCollection(key) {
        return this.getStorage(key) || [];
    },

    addItem(key, item, activityMsg = '') {
        const list = this.getCollection(key);
        list.unshift(item);
        this.setStorage(key, list);
        if (activityMsg) this.logActivity(activityMsg);
        return item;
    },

    updateItem(key, idField, idValue, updatedFields, activityMsg = '') {
        const list = this.getCollection(key);
        const index = list.findIndex(x => x[idField] === idValue);
        if (index !== -1) {
            list[index] = { ...list[index], ...updatedFields };
            this.setStorage(key, list);
            if (activityMsg) this.logActivity(activityMsg);
            return list[index];
        }
        return null;
    },

    deleteItem(key, idField, idValue, activityMsg = '') {
        let list = this.getCollection(key);
        const item = list.find(x => x[idField] === idValue);
        list = list.filter(x => x[idField] !== idValue);
        this.setStorage(key, list);
        if (activityMsg) this.logActivity(activityMsg);
        return item;
    },

    // --- DYNAMIC CALCULATED DASHBOARD METRICS ---
    getDashboardMetrics() {
        const users = this.getCollection(this.KEYS.USERS);
        const labours = this.getCollection(this.KEYS.LABOURS);
        const contractors = this.getCollection(this.KEYS.CONTRACTORS);
        const bookings = this.getCollection(this.KEYS.BOOKINGS);
        const payments = this.getCollection(this.KEYS.PAYMENTS);
        const wallet = this.getStorage(this.KEYS.WALLET) || { escrowBalance: 0, platformCommission: 0 };
        const supportTickets = this.getCollection(this.KEYS.SUPPORT_TICKETS);
        const reviews = this.getCollection(this.KEYS.REVIEWS);

        // Sum Payments
        const totalRevenue = payments.reduce((sum, p) => {
            const amt = parseFloat(p.amount ? p.amount.toString().replace(/[^0-9.]/g, '') : 0);
            return sum + (isNaN(amt) ? 0 : amt);
        }, 0);

        const totalCommission = payments.reduce((sum, p) => {
            const fee = parseFloat(p.commissionFee ? p.commissionFee.toString().replace(/[^0-9.]/g, '') : 0);
            return sum + (isNaN(fee) ? 0 : fee);
        }, 0);

        const aov = bookings.length > 0 ? totalRevenue / bookings.length : 0;

        return {
            totalUsers: users.length,
            totalLabour: labours.length,
            totalContractors: contractors.length,
            totalBookings: bookings.length,
            totalRevenue: `$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            totalCommission: `$${totalCommission.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            aov: `$${aov.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            walletEscrowBalance: `$${wallet.escrowBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            openTicketsCount: supportTickets.filter(t => t.status !== 'Closed').length,
            totalReviewsCount: reviews.length
        };
    },

    // Settings Get/Update
    getSettings() {
        return this.getStorage(this.KEYS.SETTINGS) || {};
    },

    updateSettings(newSettings) {
        const current = this.getSettings();
        const updated = { ...current, ...newSettings };
        this.setStorage(this.KEYS.SETTINGS, updated);
        this.logActivity('Updated Admin Website & Security Settings');
        return updated;
    }
};

// Initialize schema on load
DataService.init();
