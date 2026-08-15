/**
 * Skilliant Admin Portal - Data Service Layer
 * Single API abstraction layer for all Admin Portal UI modules.
 * Currently persists data in JavaScript LocalStorage.
 *
 * BACKEND SWAP GUIDE:
 * To replace LocalStorage with Firebase or Node.js REST APIs:
 * 1. Replace getStorage() with async API fetch calls
 * 2. Replace setStorage() with POST/PUT API calls
 * 3. Replace login() with real JWT endpoint
 * 4. All UI modules require ZERO changes — they all call DataService methods only.
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
        NOTIFICATIONS: 'skilliant_notifications',
        SETTINGS: 'skilliant_settings',
        ACTIVITY_LOGS: 'skilliant_activity_logs',
        SESSION: 'skilliant_admin_session',
        ROLES: 'skilliant_roles',
        REPORTS: 'skilliant_reports',
        ADMINS: 'skilliant_admins',
        LOGIN_HISTORY: 'skilliant_login_history',
        TODOS: 'skilliant_todos',
        SUPPORT_TICKETS: 'skilliant_support_tickets'
    },

    // Simple password hash simulation (not cryptographic - swap with bcrypt on backend)
    hashPassword(password) {
        // XOR + base64 encode for client-side obfuscation only
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            hash = ((hash << 5) - hash) + password.charCodeAt(i);
            hash |= 0;
        }
        return 'ph_' + Math.abs(hash).toString(36) + '_' + btoa(password).replace(/=/g, '');
    },

    checkPassword(plain, stored) {
        // If stored is legacy plaintext (from old seed), compare directly first
        if (stored === plain) return true;
        // Otherwise compare hash
        return this.hashPassword(plain) === stored;
    },

    // Initialize Default Schema in LocalStorage if not present
    init() {
        if (!localStorage.getItem(this.KEYS.SETTINGS)) {
            this.setStorage(this.KEYS.SETTINGS, {
                siteName: 'Skilliant',
                companyName: 'Skilliant LLC',
                supportEmail: 'meetmhatre2006@gmail.com',
                address: '123 Skilliant Ave, Tech District, CA 94105',
                workingHours: 'Mon–Fri, 9:00 AM – 6:00 PM',
                defaultCurrency: '$',
                commissionPercentage: 10,
                logoUrl: '',
                theme: 'Light',
                language: 'English',
                darkMode: false,
                maintenanceMode: false,
                autoApproveLabour: false,
                emailNotifs: true,
                adminNotifications: true,
                bookingNotifications: true,
                paymentNotifications: true,
                supportNotifications: true,
                timezone: 'UTC+5:30 (IST)'
            });
        }

        const collections = [
            this.KEYS.USERS, this.KEYS.LABOURS, this.KEYS.CONTRACTORS,
            this.KEYS.BOOKINGS, this.KEYS.PAYMENTS, this.KEYS.CATEGORIES,
            this.KEYS.SKILLS, this.KEYS.NOTIFICATIONS, this.KEYS.ACTIVITY_LOGS, this.KEYS.ADMINS,
            this.KEYS.LOGIN_HISTORY, this.KEYS.TODOS, this.KEYS.SUPPORT_TICKETS
        ];
        collections.forEach(key => {
            if (!localStorage.getItem(key)) this.setStorage(key, []);
        });

        // Day 5: seed a small support queue only when no tickets exist.
        if ((this.getCollection(this.KEYS.SUPPORT_TICKETS) || []).length === 0) {
            const now = new Date();
            this.setStorage(this.KEYS.SUPPORT_TICKETS, [
                { id:'TKT-1001', customer:'Emily Davis', customerId:'USR-004', subject:'Booking cancellation refund', category:'Payment', description:'I cancelled booking BK-006 and need confirmation of the refund.', priority:'High', status:'Open', assignedAdminId:'ADM-001', assignedAdmin:'Meet Mhatre', createdAt:new Date(now-2*86400000).toISOString(), updatedAt:new Date(now-2*86400000).toISOString(), lastResponseAt:'', resolution:'', messages:[] },
                { id:'TKT-1002', customer:'Sarah Johnson', customerId:'USR-002', subject:'Ceiling fan booking status', category:'Booking', description:'Please confirm when the assigned labourer will arrive for BK-002.', priority:'Medium', status:'In Progress', assignedAdminId:'ADM-001', assignedAdmin:'Meet Mhatre', createdAt:new Date(now-5*3600000).toISOString(), updatedAt:new Date(now-3600000).toISOString(), lastResponseAt:'', resolution:'', messages:[{author:'Meet Mhatre',text:'We are checking the assignment and will update you shortly.',createdAt:new Date(now-3600000).toISOString()}] },
                { id:'TKT-1003', customer:'Pedro Santos', customerId:'USR-004', subject:'Verification documents review', category:'Verification', description:'I uploaded the requested verification documents and need an update.', priority:'Urgent', status:'Waiting for User', assignedAdminId:'ADM-001', assignedAdmin:'Meet Mhatre', createdAt:new Date(now-86400000).toISOString(), updatedAt:new Date(now-12*3600000).toISOString(), lastResponseAt:'', resolution:'', messages:[] }
            ]);
        }

        if (!localStorage.getItem(this.KEYS.WALLET)) {
            this.setStorage(this.KEYS.WALLET, {
                escrowBalance: 0, platformCommission: 0,
                pendingPayouts: 0, totalProcessed: 0, payoutRequests: []
            });
        }

        // Seed default Super Admin
        const admins = this.getCollection(this.KEYS.ADMINS);
        if (admins.length === 0) {
            this.setStorage(this.KEYS.ADMINS, [{
                id: 'ADM-001',
                name: 'Meet Mhatre',
                email: 'meetmhatre2006@gmail.com',
                password: this.hashPassword('meet2006'),
                profilePhoto: 'MM',
                role: 'Super Admin',
                lastLogin: '',
                status: 'Active',
                phone: '9876543200',
                createdAt: new Date().toISOString()
            }]);
        }

        // Migrate legacy admin record if email is still old default
        this.migrateAdminEmail();

        // Auto-seed sample data if collections are empty
        this.seedSampleData();

        // Normalize seeded/contact phone numbers to the required 10-digit format.
        this.normalizePhoneData();
        this.ensureDay5ModulePermissions();

        // Apply saved dark mode preference on startup
        const settings = this.getSettings();
        if (settings.darkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    },

    seedSampleData() {
        const users = this.getCollection(this.KEYS.USERS);
        if (users.length > 0) return; // Already seeded

        const now = new Date();
        const daysAgo = d => new Date(now - d * 86400000).toISOString().split('T')[0];

        // --- USERS ---
        this.setStorage(this.KEYS.USERS, [
            { id: 'USR-001', name: 'James Wilson', email: 'james.wilson@email.com', phone: '9876543210', role: 'Customer', status: 'Active', joinedDate: daysAgo(45), totalBookings: 7, spent: '$1,240.00' },
            { id: 'USR-002', name: 'Sarah Johnson', email: 'sarah.j@email.com', phone: '9876543211', role: 'Customer', status: 'Active', joinedDate: daysAgo(30), totalBookings: 3, spent: '$480.00' },
            { id: 'USR-003', name: 'Michael Chen', email: 'm.chen@email.com', phone: '9876543212', role: 'Customer', status: 'Active', joinedDate: daysAgo(20), totalBookings: 5, spent: '$875.00' },
            { id: 'USR-004', name: 'Emily Davis', email: 'emily.d@email.com', phone: '9876543213', role: 'Customer', status: 'Suspended', joinedDate: daysAgo(60), totalBookings: 1, spent: '$120.00' },
            { id: 'USR-005', name: 'Robert Martinez', email: 'r.martinez@email.com', phone: '9876543214', role: 'Customer', status: 'Active', joinedDate: daysAgo(15), totalBookings: 2, spent: '$310.00' },
            { id: 'USR-006', name: 'Lisa Thompson', email: 'lisa.t@email.com', phone: '9876543215', role: 'Customer', status: 'Active', joinedDate: daysAgo(8), totalBookings: 4, spent: '$620.00' },
            { id: 'USR-007', name: 'David Kim', email: 'd.kim@email.com', phone: '9876543216', role: 'Customer', status: 'Active', joinedDate: daysAgo(3), totalBookings: 1, spent: '$150.00' },
            { id: 'USR-008', name: 'Anna Rodriguez', email: 'anna.r@email.com', phone: '9876543217', role: 'Customer', status: 'Active', joinedDate: daysAgo(1), totalBookings: 0, spent: '$0.00' }
        ]);

        // --- CATEGORIES ---
        this.setStorage(this.KEYS.CATEGORIES, [
            { id: 'CAT-001', name: 'Plumbing', description: 'Water supply, drainage, and piping work', icon: 'fa-faucet-drip', labourCount: 12, status: 'Active', createdAt: daysAgo(90) },
            { id: 'CAT-002', name: 'Electrical', description: 'Wiring, panels, outlets, and lighting', icon: 'fa-bolt', labourCount: 8, status: 'Active', createdAt: daysAgo(85) },
            { id: 'CAT-003', name: 'Carpentry', description: 'Wood framing, furniture, and cabinetry', icon: 'fa-hammer', labourCount: 10, status: 'Active', createdAt: daysAgo(80) },
            { id: 'CAT-004', name: 'Painting', description: 'Interior and exterior painting services', icon: 'fa-paint-roller', labourCount: 15, status: 'Active', createdAt: daysAgo(75) },
            { id: 'CAT-005', name: 'Masonry', description: 'Brickwork, concrete, and stone setting', icon: 'fa-layer-group', labourCount: 6, status: 'Active', createdAt: daysAgo(70) }
        ]);

        // --- SKILLS ---
        this.setStorage(this.KEYS.SKILLS, [
            { id: 'SKL-001', name: 'Pipe Fitting', categoryId: 'CAT-001', categoryName: 'Plumbing', description: 'Install and repair water supply pipes', labourCount: 8, status: 'Active' },
            { id: 'SKL-002', name: 'Circuit Installation', categoryId: 'CAT-002', categoryName: 'Electrical', description: 'Install electrical circuits and panels', labourCount: 5, status: 'Active' },
            { id: 'SKL-003', name: 'Cabinet Making', categoryId: 'CAT-003', categoryName: 'Carpentry', description: 'Custom cabinets and woodwork', labourCount: 6, status: 'Active' },
            { id: 'SKL-004', name: 'Interior Painting', categoryId: 'CAT-004', categoryName: 'Painting', description: 'Wall and ceiling painting', labourCount: 10, status: 'Active' },
            { id: 'SKL-005', name: 'Brick Laying', categoryId: 'CAT-005', categoryName: 'Masonry', description: 'Structural and decorative brickwork', labourCount: 4, status: 'Active' }
        ]);

        // --- LABOUR ---
        this.setStorage(this.KEYS.LABOURS, [
            { id: 'LAB-001', name: 'Carlos Rivera', email: 'carlos.r@labour.com', phone: '9876543220', skill: 'Plumbing', category: 'Plumbing', hourlyRate: '$45/hr', rating: 4.8, jobsCompleted: 34, verification: 'Verified', status: 'Available', joinedDate: daysAgo(120) },
            { id: 'LAB-002', name: 'Tony Nguyen', email: 'tony.n@labour.com', phone: '9876543221', skill: 'Electrical', category: 'Electrical', hourlyRate: '$55/hr', rating: 4.6, jobsCompleted: 21, verification: 'Verified', status: 'On Job', joinedDate: daysAgo(90) },
            { id: 'LAB-003', name: 'Marcus Johnson', email: 'marcus.j@labour.com', phone: '9876543222', skill: 'Carpentry', category: 'Carpentry', hourlyRate: '$40/hr', rating: 4.9, jobsCompleted: 47, verification: 'Verified', status: 'Available', joinedDate: daysAgo(180) },
            { id: 'LAB-004', name: 'Pedro Santos', email: 'pedro.s@labour.com', phone: '9876543223', skill: 'Painting', category: 'Painting', hourlyRate: '$35/hr', rating: 4.3, jobsCompleted: 12, verification: 'Pending', status: 'Available', joinedDate: daysAgo(30) },
            { id: 'LAB-005', name: 'Ahmed Hassan', email: 'ahmed.h@labour.com', phone: '9876543224', skill: 'Masonry', category: 'Masonry', hourlyRate: '$50/hr', rating: 4.7, jobsCompleted: 28, verification: 'Verified', status: 'Available', joinedDate: daysAgo(150) },
            { id: 'LAB-006', name: 'Luis Garcia', email: 'luis.g@labour.com', phone: '9876543225', skill: 'Plumbing', category: 'Plumbing', hourlyRate: '$42/hr', rating: 3.9, jobsCompleted: 8, verification: 'Pending', status: 'Unavailable', joinedDate: daysAgo(14) }
        ]);

        // --- CONTRACTORS ---
        this.setStorage(this.KEYS.CONTRACTORS, [
            { id: 'CON-001', name: 'BuildRight LLC', contactPerson: 'Frank Miller', email: 'frank@buildright.com', phone: '9876543230', specialization: 'General Construction', rating: 4.7, totalJobs: 52, walletBalance: '$2,400.00', verificationStatus: 'Verified', status: 'Active', joinedDate: daysAgo(200), location: 'San Francisco, CA' },
            { id: 'CON-002', name: 'ElectroPro Inc', contactPerson: 'Susan Lee', email: 'susan@electropro.com', phone: '9876543231', specialization: 'Electrical Systems', rating: 4.5, totalJobs: 38, walletBalance: '$1,800.00', verificationStatus: 'Verified', status: 'Active', joinedDate: daysAgo(150), location: 'Oakland, CA' },
            { id: 'CON-003', name: 'AquaFix Services', contactPerson: 'Mark Davis', email: 'mark@aquafix.com', phone: '9876543232', specialization: 'Plumbing & HVAC', rating: 4.2, totalJobs: 19, walletBalance: '$950.00', verificationStatus: 'Pending', status: 'Active', joinedDate: daysAgo(60), location: 'San Jose, CA' },
            { id: 'CON-004', name: 'PaintMasters Co', contactPerson: 'Julia White', email: 'julia@paintmasters.com', phone: '9876543233', specialization: 'Painting & Finishing', rating: 4.9, totalJobs: 71, walletBalance: '$3,100.00', verificationStatus: 'Verified', status: 'Active', joinedDate: daysAgo(300), location: 'Los Angeles, CA' }
        ]);

        // --- BOOKINGS ---
        this.setStorage(this.KEYS.BOOKINGS, [
            { id: 'BK-001', customer: 'James Wilson', customerId: 'USR-001', assignedTo: 'Carlos Rivera', assignedId: 'LAB-001', category: 'Plumbing', amount: '$360.00', date: daysAgo(2), status: 'Completed', escrowStatus: 'Released', notes: 'Fix kitchen sink leak' },
            { id: 'BK-002', customer: 'Sarah Johnson', customerId: 'USR-002', assignedTo: 'Tony Nguyen', assignedId: 'LAB-002', category: 'Electrical', amount: '$220.00', date: daysAgo(1), status: 'In Progress', escrowStatus: 'Held in Escrow', notes: 'Install ceiling fan' },
            { id: 'BK-003', customer: 'Michael Chen', customerId: 'USR-003', assignedTo: 'Marcus Johnson', assignedId: 'LAB-003', category: 'Carpentry', amount: '$480.00', date: daysAgo(5), status: 'Completed', escrowStatus: 'Released', notes: 'Build garden deck' },
            { id: 'BK-004', customer: 'Robert Martinez', customerId: 'USR-005', assignedTo: 'Unassigned', assignedId: '', category: 'Painting', amount: '$175.00', date: daysAgo(0), status: 'Pending', escrowStatus: 'Held', notes: 'Paint living room' },
            { id: 'BK-005', customer: 'Lisa Thompson', customerId: 'USR-006', assignedTo: 'Ahmed Hassan', assignedId: 'LAB-005', category: 'Masonry', amount: '$550.00', date: daysAgo(3), status: 'Confirmed', escrowStatus: 'Held in Escrow', notes: 'Repair front wall' },
            { id: 'BK-006', customer: 'Emily Davis', customerId: 'USR-004', assignedTo: 'Carlos Rivera', assignedId: 'LAB-001', category: 'Plumbing', amount: '$120.00', date: daysAgo(10), status: 'Cancelled', escrowStatus: 'Refunded', notes: 'Bathroom faucet' },
            { id: 'BK-007', customer: 'David Kim', customerId: 'USR-007', assignedTo: 'Marcus Johnson', assignedId: 'LAB-003', category: 'Carpentry', amount: '$150.00', date: daysAgo(1), status: 'Pending', escrowStatus: 'Held', notes: 'Fix wooden stairs' },
            { id: 'BK-008', customer: 'James Wilson', customerId: 'USR-001', assignedTo: 'Tony Nguyen', assignedId: 'LAB-002', category: 'Electrical', amount: '$310.00', date: daysAgo(7), status: 'Completed', escrowStatus: 'Released', notes: 'Panel upgrade' }
        ]);

        // --- PAYMENTS ---
        this.setStorage(this.KEYS.PAYMENTS, [
            { id: 'PAY-001', bookingId: 'BK-001', userId: 'USR-001', userName: 'James Wilson', amount: 360.00, commissionFee: 36.00, method: 'Credit Card', status: 'Completed', date: daysAgo(2) },
            { id: 'PAY-002', bookingId: 'BK-002', userId: 'USR-002', userName: 'Sarah Johnson', amount: 220.00, commissionFee: 22.00, method: 'PayPal', status: 'Pending', date: daysAgo(1) },
            { id: 'PAY-003', bookingId: 'BK-003', userId: 'USR-003', userName: 'Michael Chen', amount: 480.00, commissionFee: 48.00, method: 'Bank Transfer', status: 'Completed', date: daysAgo(5) },
            { id: 'PAY-004', bookingId: 'BK-004', userId: 'USR-005', userName: 'Robert Martinez', amount: 175.00, commissionFee: 17.50, method: 'Credit Card', status: 'Pending', date: daysAgo(0) },
            { id: 'PAY-005', bookingId: 'BK-005', userId: 'USR-006', userName: 'Lisa Thompson', amount: 550.00, commissionFee: 55.00, method: 'Debit Card', status: 'Held', date: daysAgo(3) },
            { id: 'PAY-006', bookingId: 'BK-006', userId: 'USR-004', userName: 'Emily Davis', amount: 120.00, commissionFee: 0, method: 'Credit Card', status: 'Refunded', date: daysAgo(10) },
            { id: 'PAY-007', bookingId: 'BK-008', userId: 'USR-001', userName: 'James Wilson', amount: 310.00, commissionFee: 31.00, method: 'PayPal', status: 'Completed', date: daysAgo(7) }
        ]);

        // Update wallet with real totals
        const totalProcessed = 360 + 480 + 310;
        const totalCommission = 36 + 48 + 31;
        this.setStorage(this.KEYS.WALLET, {
            escrowBalance: 220 + 550 + 175 + 150,
            platformCommission: totalCommission,
            pendingPayouts: 220 + 550,
            totalProcessed: totalProcessed,
            payoutRequests: []
        });

        // --- NOTIFICATIONS ---
        this.setStorage(this.KEYS.NOTIFICATIONS, [
            { id: 'NOT-001', title: 'New Booking Created', message: 'Booking BK-007 has been created by David Kim for Carpentry service.', category: 'Booking', timestamp: new Date(now - 2*3600000).toISOString(), time: '2 hours ago', unread: true },
            { id: 'NOT-002', title: 'Labour Verification Pending', message: 'Pedro Santos has submitted documents for verification review.', category: 'Verification', timestamp: new Date(now - 5*3600000).toISOString(), time: '5 hours ago', unread: true },
            { id: 'NOT-003', title: 'Payment Completed', message: 'Payment PAY-001 of $360.00 from James Wilson has been processed successfully.', category: 'Payment', timestamp: new Date(now - 86400000).toISOString(), time: '1 day ago', unread: true },
            { id: 'NOT-004', title: 'Support Ticket Opened', message: 'Emily Davis has opened a new support ticket regarding booking cancellation.', category: 'Support', timestamp: new Date(now - 2*86400000).toISOString(), time: '2 days ago', unread: false },
            { id: 'NOT-005', title: 'New Contractor Registered', message: 'AquaFix Services has registered and is pending verification.', category: 'Registration', timestamp: new Date(now - 3*86400000).toISOString(), time: '3 days ago', unread: false }
        ]);

        // --- ACTIVITY LOGS ---
        this.setStorage(this.KEYS.ACTIVITY_LOGS, [
            { id: 'LOG-001', admin: 'Super Admin', action: 'Super Admin Logged In', timestamp: new Date(now - 3600000).toLocaleString(), ip: '127.0.0.1 (Local)' },
            { id: 'LOG-002', admin: 'Super Admin', action: 'Added new customer account James Wilson', timestamp: new Date(now - 7200000).toLocaleString(), ip: '127.0.0.1 (Local)' },
            { id: 'LOG-003', admin: 'Super Admin', action: 'Updated verification status for labourer Carlos Rivera to Verified', timestamp: new Date(now - 86400000).toLocaleString(), ip: '127.0.0.1 (Local)' },
            { id: 'LOG-004', admin: 'Super Admin', action: 'Updated booking BK-006 status to Cancelled', timestamp: new Date(now - 172800000).toLocaleString(), ip: '127.0.0.1 (Local)' },
            { id: 'LOG-005', admin: 'Super Admin', action: 'Saved platform settings: Commission set to 10%', timestamp: new Date(now - 259200000).toLocaleString(), ip: '127.0.0.1 (Local)' }
        ]);

        // --- TODOS ---
        const todos = this.getCollection(this.KEYS.TODOS);
        if (todos.length === 0) {
            const todayStr = daysAgo(0);
            const tomorrowStr = daysAgo(-1);
            const pastStr = daysAgo(2);
            this.setStorage(this.KEYS.TODOS, [
                {
                    id: 'TODO-001',
                    title: 'Inspect site safety compliance',
                    description: 'Review safety gear audit logs and worker certifications for BuildRight LLC project.',
                    date: todayStr,
                    time: '14:30',
                    priority: 'High',
                    status: 'Pending',
                    createdAt: new Date(now - 7200000).toISOString(),
                    updatedAt: new Date(now - 7200000).toISOString()
                },
                {
                    id: 'TODO-002',
                    title: 'Approve pending contractor payout',
                    description: 'Verify Escrow release approval for AquaFix Services booking BK-005.',
                    date: todayStr,
                    time: '16:00',
                    priority: 'Medium',
                    status: 'Pending',
                    createdAt: new Date(now - 14400000).toISOString(),
                    updatedAt: new Date(now - 14400000).toISOString()
                },
                {
                    id: 'TODO-003',
                    title: 'Update platform skill categories',
                    description: 'Add Solar Panel Installation under Electrical trade category.',
                    date: tomorrowStr,
                    time: '10:00',
                    priority: 'Low',
                    status: 'Pending',
                    createdAt: new Date(now - 28800000).toISOString(),
                    updatedAt: new Date(now - 28800000).toISOString()
                },
                {
                    id: 'TODO-004',
                    title: 'Audit quarterly platform revenue report',
                    description: 'Export commission report CSV and cross-check with escrow totals.',
                    date: pastStr,
                    time: '09:00',
                    priority: 'High',
                    status: 'Completed',
                    createdAt: new Date(now - 172800000).toISOString(),
                    updatedAt: new Date(now - 86400000).toISOString()
                }
            ]);
        }

    },

    // Safely migrate admin email/name without clearing localStorage
    migrateAdminEmail() {
        const admins = this.getCollection(this.KEYS.ADMINS);
        let changed = false;
        admins.forEach(a => {
            // Update the placeholder Super Admin from old email/password to configured primary credentials
            if (a.id === 'ADM-001') {
                // Preserve credentials/profile after the first seed; never silently reset a user-changed password.
                if (!a.email) { a.email = 'meetmhatre2006@gmail.com'; changed = true; }
                if (!a.name) { a.name = 'Meet Mhatre'; changed = true; }
                if (!a.profilePhoto) { a.profilePhoto = 'MM'; changed = true; }
                if (!a.role) { a.role = 'Super Admin'; changed = true; }
            }
            // Remove old fallback placeholders if present
            if (a.email === 'alex@skilliant.com' || a.email === 'admin@skilliant.com' || a.email === 'NeetMatra26@gmail.com') {
                if (a.id !== 'ADM-001') {
                    a._markedForRemoval = true;
                    changed = true;
                }
            }
        });
        if (changed) {
            const cleaned = admins.filter(a => !a._markedForRemoval);
            this.setStorage(this.KEYS.ADMINS, cleaned);
            // Also update active session if it used old admin data
            const session = this.getSession();
            if (session && session.adminId === 'ADM-001') {
                session.adminEmail = 'meetmhatre2006@gmail.com';
                session.adminName  = 'Meet Mhatre';
                session.profilePhoto = 'MM';
                this.setStorage(this.KEYS.SESSION, session);
            }
        }
    },

    // Generic Storage Helpers
    getStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error(`DataService: Error reading ${key}`, e);
            return null;
        }
    },

    setStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.error(`DataService: Error writing ${key}`, e);
        }
    },

    // ============================================================
    // CENTRAL DATA / FINANCIAL / NOTIFICATION HELPERS
    // ============================================================
    validatePhone(phone) {
        // Skilliant demo/mobile format: exactly 10 digits, beginning with 6-9.
        return /^[6-9]\d{9}$/.test(String(phone || '').trim());
    },

    normalizePhoneData() {
        const mappings = {
            [this.KEYS.USERS]: { 'USR-001':'9876543210','USR-002':'9876543211','USR-003':'9876543212','USR-004':'9876543213','USR-005':'9876543214','USR-006':'9876543215','USR-007':'9876543216','USR-008':'9876543217' },
            [this.KEYS.LABOURS]: { 'LAB-001':'9876543220','LAB-002':'9876543221','LAB-003':'9876543222','LAB-004':'9876543223','LAB-005':'9876543224','LAB-006':'9876543225' },
            [this.KEYS.CONTRACTORS]: { 'CON-001':'9876543230','CON-002':'9876543231','CON-003':'9876543232','CON-004':'9876543233' },
            [this.KEYS.ADMINS]: { 'ADM-001':'9876543200' }
        };
        Object.entries(mappings).forEach(([key,map]) => {
            const list=this.getCollection(key); let changed=false;
            list.forEach(item=>{ if(map[item.id] && item.phone!==map[item.id]) { item.phone=map[item.id]; item.phoneVerified=false; changed=true; } });
            if(changed) this.setStorage(key,list);
        });
    },

    createNotification({title, message, category='System', type='info', entityType='', entityId=''}) {
        const notifications=this.getCollection(this.KEYS.NOTIFICATIONS) || [];
        const fingerprint=[title,message,entityType,entityId].join('|');
        const recent=notifications.find(n => n.fingerprint===fingerprint && (Date.now()-new Date(n.timestamp||0).getTime()) < 1500);
        if(recent) return recent;
        const session=this.getSession();
        const n={
            id:`NOT-${Date.now().toString().slice(-8)}`,
            title, message, category, type,
            entityType, entityId,
            timestamp:new Date().toISOString(),
            time:'Just now',
            unread:true,
            createdBy:session?.adminName || 'System',
            fingerprint
        };
        notifications.unshift(n);
        this.setStorage(this.KEYS.NOTIFICATIONS, notifications.slice(0,300));
        window.dispatchEvent(new CustomEvent('skilliant:notification-created',{detail:n}));
        return n;
    },

    getFinancialSnapshot() {
        const payments = this.getCollection(this.KEYS.PAYMENTS) || [];
        const completed = payments.filter(p => ['Completed','Paid'].includes(p.status));
        const held = payments.filter(p => ['Held','Pending'].includes(p.status));
        const refunded = payments.filter(p => p.status === 'Refunded');
        const gross = completed.reduce((sum,p) => sum + (parseFloat(p.amount)||0), 0);
        const commission = completed.reduce((sum,p) => sum + (parseFloat(p.commissionFee)||0), 0);
        const refunds = refunded.reduce((sum,p) => sum + (parseFloat(p.refundAmount ?? p.amount)||0), 0);
        const escrow = held.reduce((sum,p) => sum + (parseFloat(p.amount)||0), 0);
        const pendingPayments = payments.filter(p => p.status === 'Pending').reduce((sum,p) => sum + (parseFloat(p.amount)||0), 0);
        const wallet = this.getStorage(this.KEYS.WALLET) || {};
        const requests = Array.isArray(wallet.payoutRequests) ? wallet.payoutRequests : [];
        const pendingPayouts = requests.filter(r => ['Pending','Approved'].includes(r.status))
            .reduce((sum,r) => sum + (parseFloat(String(r.amount).replace(/[^0-9.]/g,''))||0), 0);
        const completedPayouts = requests.filter(r => ['Completed','Disbursed'].includes(r.status))
            .reduce((sum,r) => sum + (parseFloat(String(r.amount).replace(/[^0-9.]/g,''))||0), 0);
        const net = Math.max(0, gross - commission - refunds);
        const available = Math.max(0, net - completedPayouts - pendingPayouts);
        return {gross, commission, net, refunds, escrow, pendingPayments, pendingPayouts, completedPayouts, available};
    },

    getBookingAnalytics() {
        const bookings=this.getCollection(this.KEYS.BOOKINGS)||[];
        const count=bookings.length;
        const completed=bookings.filter(b=>b.status==='Completed').length;
        const pending=bookings.filter(b=>b.status==='Pending').length;
        const confirmed=bookings.filter(b=>b.status==='Confirmed').length;
        const cancelled=bookings.filter(b=>b.status==='Cancelled').length;
        const inProgress=bookings.filter(b=>b.status==='In Progress').length;
        const values=bookings.map(b=>parseFloat(String(b.amount||0).replace(/[$,]/g,''))||0);
        const avg=values.length?values.reduce((a,b)=>a+b,0)/values.length:0;
        const categories={}; bookings.forEach(b=>categories[b.category||'Other']=(categories[b.category||'Other']||0)+1);
        return {count,completed,pending,confirmed,cancelled,inProgress,completionRate:count?completed/count*100:0,cancellationRate:count?cancelled/count*100:0,averageValue:avg,categories};
    },

    getGrowthSeries(months=6) {
        const lists=[this.getCollection(this.KEYS.USERS)||[],this.getCollection(this.KEYS.LABOURS)||[],this.getCollection(this.KEYS.CONTRACTORS)||[]];
        const now=new Date(), labels=[], series=[[],[],[]];
        for(let i=months-1;i>=0;i--){
            const d=new Date(now.getFullYear(),now.getMonth()-i,1); const next=new Date(d.getFullYear(),d.getMonth()+1,1);
            labels.push(d.toLocaleDateString('en-US',{month:'short',year:'2-digit'}));
            lists.forEach((list,idx)=>series[idx].push(list.filter(x=>{const raw=x.joinedDate||x.createdAt;if(!raw)return false;const dt=new Date(raw);return dt>=d&&dt<next;}).length));
        }
        return {labels,users:series[0],labours:series[1],contractors:series[2]};
    },

    // Log Activity — enriched audit record for Day 5.
    logActivity(actionDescription, meta = {}) {
        const logs = this.getStorage(this.KEYS.ACTIVITY_LOGS) || [];
        const session = this.getSession();
        const adminName = session ? session.adminName : 'System';
        const id = `LOG-${Date.now().toString().slice(-8)}`;
        logs.unshift({
            id, adminId: session?.adminId || '', admin: adminName, role: session?.role || 'System',
            action: actionDescription, entityType: meta.entityType || '', entityId: meta.entityId || '',
            timestamp: new Date().toISOString(), ip: '127.0.0.1 (Local Browser)',
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Frontend browser',
            severity: meta.severity || 'info', metadata: meta.metadata || {}
        });
        this.setStorage(this.KEYS.ACTIVITY_LOGS, logs.slice(0, 300));
        const lower=String(actionDescription||'').toLowerCase();
        if (!lower.includes('deleted notification') && !lower.includes('marked notification')) {
            let category='System', type='info';
            if(lower.includes('booking')) category='Booking';
            else if(lower.includes('payment') || lower.includes('payout') || lower.includes('escrow')) category='Payment';
            else if(lower.includes('user') || lower.includes('customer') || lower.includes('admin') || lower.includes('contractor') || lower.includes('labour')) category='User';
            else if(lower.includes('review')) category='Review';
            else if(lower.includes('report') || lower.includes('export')) category='Report';
            else if(lower.includes('password') || lower.includes('security') || lower.includes('login') || lower.includes('logout')) category='Security';
            else if(lower.includes('support') || lower.includes('ticket')) category='Support';
            const match=String(actionDescription).match(/\b(BK|PAY|PO|REV|USR|LAB|CON|CAT|SKL|TKT)-[A-Z0-9-]+/i);
            const prefix=match ? match[1].toUpperCase() : '';
            const entityMap={BK:'booking',PAY:'payment',PO:'payout',REV:'review',USR:'user',LAB:'labourer',CON:'contractor',CAT:'category',SKL:'skill',TKT:'support-ticket'};
            const entityType=meta.entityType || entityMap[prefix] || '';
            const entityId=meta.entityId || (match ? match[0].toUpperCase() : '');
            this.createNotification({title:actionDescription, message:`${actionDescription}.`, category, type, entityType, entityId});
        }
    },

    // --- AUTHENTICATION & SESSION ---
    login(email, password, rememberMe = false) {
        const admins = this.getCollection(this.KEYS.ADMINS);
        const adminUser = admins.find(a => a.email.toLowerCase() === email.toLowerCase());

        if (!adminUser) {
            return { success: false, message: 'No account found with that email address.' };
        }
        if (!this.checkPassword(password, adminUser.password)) {
            return { success: false, message: 'Incorrect password. Please try again.' };
        }
        if (adminUser.status !== 'Active') {
            return { success: false, message: 'This account is inactive. Contact support.' };
        }

        const now = new Date().toISOString();
        this.updateItem(this.KEYS.ADMINS, 'id', adminUser.id, { lastLogin: now });

        // Record login history
        const loginHistory = this.getStorage(this.KEYS.LOGIN_HISTORY) || [];
        loginHistory.unshift({
            adminId: adminUser.id,
            timestamp: now,
            device: navigator.userAgent.includes('Mobile') ? 'Mobile Browser' : 'Desktop Browser',
            browser: this._detectBrowser(),
            ip: '127.0.0.1 (Local)',
            status: 'Success'
        });
        this.setStorage(this.KEYS.LOGIN_HISTORY, loginHistory.slice(0, 50));

        const session = {
            authenticated: true,
            adminId: adminUser.id,
            adminName: adminUser.name,
            adminEmail: adminUser.email,
            role: adminUser.role,
            profilePhoto: adminUser.profilePhoto || adminUser.name.split(' ').map(n => n[0]).join(''),
            loginTime: now
        };

        if (rememberMe) {
            localStorage.setItem('skilliant_remember_me', 'true');
            this.setStorage(this.KEYS.SESSION, session);
        } else {
            localStorage.removeItem('skilliant_remember_me');
            sessionStorage.setItem(this.KEYS.SESSION, JSON.stringify(session));
            this.setStorage(this.KEYS.SESSION, session);
        }

        this.logActivity(`${adminUser.name} logged in successfully`);
        return { success: true, session };
    },

    logout() {
        const session = this.getSession();
        if (session) this.logActivity(`${session.adminName} logged out`);
        localStorage.removeItem(this.KEYS.SESSION);
        sessionStorage.removeItem(this.KEYS.SESSION);
        localStorage.removeItem('skilliant_remember_me');
    },

    getSession() {
        return this.getStorage(this.KEYS.SESSION);
    },

    isAuthenticated() {
        const session = this.getSession();
        return session && session.authenticated === true;
    },

    getLoginHistory(adminId = null) {
        const history = this.getStorage(this.KEYS.LOGIN_HISTORY) || [];
        return adminId ? history.filter(h => h.adminId === adminId) : history;
    },

    _detectBrowser() {
        const ua = navigator.userAgent;
        if (ua.includes('Chrome') && !ua.includes('Edg')) return 'Google Chrome';
        if (ua.includes('Firefox')) return 'Mozilla Firefox';
        if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
        if (ua.includes('Edg')) return 'Microsoft Edge';
        return 'Unknown Browser';
    },

    // --- GENERIC COLLECTION CRUD ---
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

    validatePhone(phone) { return /^[6-9]\d{9}$/.test(String(phone || '').trim()); },

    recalculateFinancialState() {
        const financial = this.getFinancialSnapshot();
        const wallet = this.getStorage(this.KEYS.WALLET) || {};
        wallet.escrowBalance = financial.escrow;
        wallet.platformCommission = financial.commission;
        wallet.pendingPayouts = financial.pendingPayouts;
        wallet.completedPayouts = financial.completedPayouts;
        wallet.availableBalance = financial.available;
        wallet.totalProcessed = financial.gross;
        wallet.payoutRequests = Array.isArray(wallet.payoutRequests) ? wallet.payoutRequests : [];
        this.setStorage(this.KEYS.WALLET, wallet);
        return wallet;
    },

    // --- DASHBOARD METRICS ---
    getDashboardMetrics() {
        const users = this.getCollection(this.KEYS.USERS);
        const labours = this.getCollection(this.KEYS.LABOURS);
        const contractors = this.getCollection(this.KEYS.CONTRACTORS);
        const bookings = this.getCollection(this.KEYS.BOOKINGS);
        const payments = this.getCollection(this.KEYS.PAYMENTS);
        const wallet = this.getStorage(this.KEYS.WALLET) || { escrowBalance: 0, platformCommission: 0 };
        const financial = this.getFinancialSnapshot();
        this.recalculateFinancialState();
        const categories = this.getCollection(this.KEYS.CATEGORIES);
        const skills = this.getCollection(this.KEYS.SKILLS);

        const totalRevenue = payments
            .filter(p => p.status === 'Completed')
            .reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);

        const totalCommission = payments
            .filter(p => p.status === 'Completed')
            .reduce((sum, p) => sum + (parseFloat(p.commissionFee) || 0), 0);

        const aov = bookings.length > 0 ? totalRevenue / bookings.filter(b => b.status === 'Completed').length || 0 : 0;

        return {
            totalUsers: users.length,
            totalLabour: labours.length,
            totalContractors: contractors.length,
            totalBookings: bookings.length,
            totalCategories: categories.length,
            totalSkills: skills.length,
            totalRevenue: `$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            totalCommission: `$${totalCommission.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            aov: `$${isNaN(aov) ? '0.00' : aov.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            walletEscrowBalance: `$${financial.escrow.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            grossRevenueNumber: financial.gross,
            platformCommissionNumber: financial.commission,
            netRevenueNumber: financial.net,
            openTicketsCount: (this.getCollection(this.KEYS.SUPPORT_TICKETS)||[]).filter(x=>!['Resolved','Closed'].includes(x.status)).length,
        };
    },

    // --- ROLE / PERMISSION AUTHORIZATION ---
    permissionCatalog() {
        return {
            dashboard:['view:dashboard'],
            users:['view:users','create:users','edit:users','suspend:users','delete:users'],
            labour:['view:labour','create:labour','edit:labour','verify:labour','suspend:labour','delete:labour'],
            contractors:['view:contractors','create:contractors','edit:contractors','verify:contractors','suspend:contractors','delete:contractors'],
            categories:['view:categories','create:categories','edit:categories','delete:categories'],
            skills:['view:skills','create:skills','edit:skills','delete:skills'],
            bookings:['view:bookings','create:bookings','edit:bookings','cancel:bookings','delete:bookings'],
            payments:['view:payments','refund:payments','payout:payments','view:wallet'],
            reports:['view:reports','export:reports'],
            notifications:['view:notifications','manage:notifications'],
            support:['view:support','create:support','reply:support','assign:support','resolve:support'],
            activity:['view:activity','export:activity','clear:activity'],
            admins:['manage:admins'],
            roles:['manage:roles','manage:permissions'],
            settings:['view:settings','manage:settings']
        };
    },
    canonicalRolePolicies() {
        return {
            'Super Admin': Object.values(this.permissionCatalog()).flat(),
            'Admin': [
                'view:dashboard',
                'view:users','create:users','edit:users','suspend:users',
                'view:labour','create:labour','edit:labour','verify:labour','suspend:labour',
                'view:contractors','create:contractors','edit:contractors','verify:contractors','suspend:contractors',
                'view:categories','create:categories','edit:categories',
                'view:skills','create:skills','edit:skills',
                'view:bookings','create:bookings','edit:bookings','cancel:bookings',
                'view:payments',
                'view:reports','export:reports',
                'view:notifications','manage:notifications',
                'view:support','create:support','reply:support','assign:support','resolve:support',
                'view:activity','export:activity',
                'view:settings'
            ],
            'Financial Admin': [
                'view:dashboard','view:payments','refund:payments','payout:payments','view:wallet',
                'view:reports','export:reports',
                'view:notifications',
                'view:support','reply:support',
                'view:activity','export:activity',
                'view:settings'
            ]
        };
    },
    ensureDay5ModulePermissions() {
        const policies=this.canonicalRolePolicies();
        let roles=this.getCollection(this.KEYS.ROLES)||[];
        const existingByTitle=new Map(roles.map(r=>[r.title,r]));
        roles=Object.entries(policies).map(([title,permissions],idx)=>({
            id: existingByTitle.get(title)?.id || `ROLE-00${idx+1}`,
            title,
            permissions:[...permissions]
        }));
        // Normalize all administrator records to the same three canonical roles.
        const admins=this.getCollection(this.KEYS.ADMINS)||[];
        let adminsChanged=false;
        const migrated=admins.map(a=>{
            let role=a.role;
            if(role==='Finance Admin' || role==='Financial Administrator') role='Financial Admin';
            else if(role==='Moderator' || role==='Manager') role='Admin';
            else if(!policies[role]) role='Admin';
            if(role!==a.role){ adminsChanged=true; return {...a,role}; }
            return a;
        });
        if(adminsChanged) this.setStorage(this.KEYS.ADMINS,migrated);
        this.setStorage(this.KEYS.ROLES,roles);
        // If a current session was migrated, keep it aligned with the admin record.
        const session=this.getSession();
        if(session){
            const current=migrated.find(a=>a.id===session.adminId);
            if(current && (current.role!==session.role || current.email!==session.adminEmail || current.name!==session.adminName)){
                const next={...session,role:current.role,adminEmail:current.email,adminName:current.name,profilePhoto:current.profilePhoto};
                this.setStorage(this.KEYS.SESSION,next);
            }
        }
        return roles;
    },
    hasPermission(permission) {
        const session=this.getSession();
        if(!session) return false;
        if(session.role==='Super Admin') return true;
        const roles=this.ensureDay5ModulePermissions();
        const role=roles.find(r=>r.title===session.role);
        return !!role?.permissions?.includes(permission);
    },
    requirePermission(permission, message='You do not have permission to perform this action.') {
        if(this.hasPermission(permission)) return true;
        Toast.show(message,'warning');
        return false;
    },

    // --- SETTINGS ---
    getSettings() {
        return this.getStorage(this.KEYS.SETTINGS) || {};
    },

    updateSettings(newSettings) {
        const current = this.getSettings();
        const updated = { ...current, ...newSettings };
        this.setStorage(this.KEYS.SETTINGS, updated);
        this.logActivity('Updated platform settings');
        return updated;
    },

    // --- THEME ---
    setDarkMode(enabled) {
        const settings = this.getSettings();
        settings.darkMode = enabled;
        this.setStorage(this.KEYS.SETTINGS, settings);
        if (enabled) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
    }
};

// Initialize schema on load
DataService.init();
