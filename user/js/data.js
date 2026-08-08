// =====================================================
// SKILLIANT - DATA.JS
// Demo data + LocalStorage helpers
// =====================================================

const STORAGE_KEYS = {
    user: "skilliant_user",
    labourers: "skilliant_labourers",
    bookings: "skilliant_bookings",
    payments: "skilliant_payments",
    addresses: "skilliant_addresses",
    favourites: "skilliant_favourites",
    reviews: "skilliant_reviews",
    notifications: "skilliant_notifications",
    tickets: "skilliant_tickets",
    wallet: "skilliant_wallet"
};


// =====================================================
// DEFAULT USER
// =====================================================

const defaultUser = {
    id: 1,
    name: "Shreeya",
    email: "shreeya@example.com",
    phone: "+91 98765 43210",
    location: "Mumbai, Maharashtra",
    profileImage: "https://i.pravatar.cc/150?img=47"
};


// =====================================================
// DEFAULT LABOURERS
// =====================================================

const defaultLabourers = [
    {
        id: 1,
        name: "Rajesh Kumar",
        skill: "Electrician",
        category: "Electrical",
        experience: "8 Years",
        location: "Mumbai",
        rating: 4.8,
        reviews: 124,
        price: 500,
        availability: "Available",
        image: "https://i.pravatar.cc/150?img=12"
    },
    {
        id: 2,
        name: "Amit Sharma",
        skill: "Plumber",
        category: "Plumbing",
        experience: "6 Years",
        location: "Thane",
        rating: 4.6,
        reviews: 98,
        price: 450,
        availability: "Available",
        image: "https://i.pravatar.cc/150?img=13"
    },
    {
        id: 3,
        name: "Suresh Patil",
        skill: "Carpenter",
        category: "Carpentry",
        experience: "10 Years",
        location: "Navi Mumbai",
        rating: 4.9,
        reviews: 156,
        price: 700,
        availability: "Busy",
        image: "https://i.pravatar.cc/150?img=14"
    },
    {
        id: 4,
        name: "Ramesh Yadav",
        skill: "Painter",
        category: "Painting",
        experience: "5 Years",
        location: "Mumbai",
        rating: 4.5,
        reviews: 76,
        price: 600,
        availability: "Available",
        image: "https://i.pravatar.cc/150?img=15"
    },
    {
        id: 5,
        name: "Vijay Singh",
        skill: "AC Technician",
        category: "AC Repair",
        experience: "7 Years",
        location: "Thane",
        rating: 4.7,
        reviews: 112,
        price: 800,
        availability: "Available",
        image: "https://i.pravatar.cc/150?img=16"
    },
    {
        id: 6,
        name: "Manoj Verma",
        skill: "Cleaner",
        category: "Cleaning",
        experience: "4 Years",
        location: "Mumbai",
        rating: 4.4,
        reviews: 64,
        price: 350,
        availability: "Available",
        image: "https://i.pravatar.cc/150?img=17"
    },
    {
        id: 7,
        name: "Deepak Joshi",
        skill: "Gardener",
        category: "Gardening",
        experience: "5 Years",
        location: "Pune",
        rating: 4.6,
        reviews: 81,
        price: 400,
        availability: "Available",
        image: "https://i.pravatar.cc/150?img=18"
    },
    {
        id: 8,
        name: "Arun Mehta",
        skill: "Mason",
        category: "Construction",
        experience: "12 Years",
        location: "Mumbai",
        rating: 4.8,
        reviews: 143,
        price: 900,
        availability: "Available",
        image: "https://i.pravatar.cc/150?img=19"
    }
];


// =====================================================
// DEFAULT BOOKINGS
// =====================================================

const defaultBookings = [
    {
        id: "BK1001",
        labourId: 1,
        labour: "Rajesh Kumar",
        skill: "Electrician",
        date: "2026-08-10",
        time: "10:00 AM",
        address: "12, MG Road, Andheri West, Mumbai",
        amount: 500,
        status: "Confirmed",
        requirements: "Ceiling fan installation"
    },
    {
        id: "BK1002",
        labourId: 2,
        labour: "Amit Sharma",
        skill: "Plumber",
        date: "2026-08-12",
        time: "02:00 PM",
        address: "Tech Park, Powai, Mumbai",
        amount: 450,
        status: "Pending",
        requirements: "Kitchen pipe repair"
    },
    {
        id: "BK1003",
        labourId: 3,
        labour: "Suresh Patil",
        skill: "Carpenter",
        date: "2026-08-05",
        time: "11:00 AM",
        address: "12, MG Road, Andheri West, Mumbai",
        amount: 700,
        status: "Completed",
        requirements: "Furniture repair"
    }
];


// =====================================================
// DEFAULT PAYMENTS
// =====================================================

const defaultPayments = [
    {
        id: "TXN001",
        date: "2026-08-05",
        description: "Carpenter Service",
        amount: 700,
        type: "debit",
        method: "Wallet",
        status: "Successful"
    },
    {
        id: "TXN002",
        date: "2026-08-02",
        description: "Wallet Recharge",
        amount: 1000,
        type: "credit",
        method: "UPI",
        status: "Successful"
    },
    {
        id: "TXN003",
        date: "2026-07-28",
        description: "Plumber Service",
        amount: 450,
        type: "debit",
        method: "UPI",
        status: "Successful"
    }
];


// =====================================================
// DEFAULT ADDRESSES
// =====================================================

const defaultAddresses = [
    {
        id: 1,
        title: "Home",
        address: "12, MG Road, Andheri West",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400058",
        default: true
    },
    {
        id: 2,
        title: "Work",
        address: "Tech Park, Powai",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400076",
        default: false
    }
];


// =====================================================
// DEFAULT FAVOURITES
// =====================================================

const defaultFavourites = [1, 3];


// =====================================================
// DEFAULT REVIEWS
// =====================================================

const defaultReviews = [
    {
        id: 1,
        labourId: 1,
        labour: "Rajesh Kumar",
        rating: 5,
        review: "Excellent service and very professional.",
        date: "2026-07-20"
    },
    {
        id: 2,
        labourId: 2,
        labour: "Amit Sharma",
        rating: 4,
        review: "Good work and arrived on time.",
        date: "2026-07-15"
    }
];


// =====================================================
// DEFAULT NOTIFICATIONS
// =====================================================

const defaultNotifications = [
    {
        id: 1,
        title: "Booking Confirmed",
        message: "Your booking with Rajesh Kumar has been confirmed.",
        time: "10 minutes ago",
        type: "success",
        read: false
    },
    {
        id: 2,
        title: "Payment Successful",
        message: "Your wallet has been successfully recharged.",
        time: "2 hours ago",
        type: "payment",
        read: false
    },
    {
        id: 3,
        title: "Booking Reminder",
        message: "Your plumber booking is scheduled tomorrow.",
        time: "1 day ago",
        type: "reminder",
        read: true
    }
];


// =====================================================
// DEFAULT SUPPORT TICKETS
// =====================================================

const defaultTickets = [
    {
        id: "TKT1001",
        category: "Booking",
        subject: "Booking issue",
        description: "I need help with my booking.",
        status: "Open",
        date: "2026-08-06"
    },
    {
        id: "TKT1002",
        category: "Payment",
        subject: "Payment clarification",
        description: "Payment was deducted twice.",
        status: "Resolved",
        date: "2026-07-25"
    }
];


// =====================================================
// DEFAULT WALLET
// =====================================================

const defaultWallet = 2500;


// =====================================================
// LOCAL STORAGE HELPER
// =====================================================

function getStorageData(key, defaultValue) {
    try {
        const savedData = localStorage.getItem(key);

        if (savedData !== null) {
            return JSON.parse(savedData);
        }

        return defaultValue;
    } catch (error) {
        console.error("Storage read error:", error);
        return defaultValue;
    }
}


// =====================================================
// SAVE DATA TO LOCAL STORAGE
// =====================================================

function saveStorageData(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error("Storage save error:", error);
        return false;
    }
}


// =====================================================
// INITIALIZE APPLICATION DATA
// =====================================================

function initializeData() {

    if (!localStorage.getItem(STORAGE_KEYS.user)) {
        saveStorageData(STORAGE_KEYS.user, defaultUser);
    }

    if (!localStorage.getItem(STORAGE_KEYS.labourers)) {
        saveStorageData(STORAGE_KEYS.labourers, defaultLabourers);
    }

    if (!localStorage.getItem(STORAGE_KEYS.bookings)) {
        saveStorageData(STORAGE_KEYS.bookings, defaultBookings);
    }

    if (!localStorage.getItem(STORAGE_KEYS.payments)) {
        saveStorageData(STORAGE_KEYS.payments, defaultPayments);
    }

    if (!localStorage.getItem(STORAGE_KEYS.addresses)) {
        saveStorageData(STORAGE_KEYS.addresses, defaultAddresses);
    }

    if (!localStorage.getItem(STORAGE_KEYS.favourites)) {
        saveStorageData(STORAGE_KEYS.favourites, defaultFavourites);
    }

    if (!localStorage.getItem(STORAGE_KEYS.reviews)) {
        saveStorageData(STORAGE_KEYS.reviews, defaultReviews);
    }

    if (!localStorage.getItem(STORAGE_KEYS.notifications)) {
        saveStorageData(
            STORAGE_KEYS.notifications,
            defaultNotifications
        );
    }

    if (!localStorage.getItem(STORAGE_KEYS.tickets)) {
        saveStorageData(STORAGE_KEYS.tickets, defaultTickets);
    }

    if (!localStorage.getItem(STORAGE_KEYS.wallet)) {
        saveStorageData(STORAGE_KEYS.wallet, defaultWallet);
    }
}


// =====================================================
// GET CURRENT USER
// =====================================================

function getCurrentUser() {
    return getStorageData(
        STORAGE_KEYS.user,
        defaultUser
    );
}


// =====================================================
// UPDATE USER
// =====================================================

function updateCurrentUser(updatedUser) {
    return saveStorageData(
        STORAGE_KEYS.user,
        updatedUser
    );
}


// =====================================================
// GET LABOURERS
// =====================================================

function getLabourers() {
    return getStorageData(
        STORAGE_KEYS.labourers,
        defaultLabourers
    );
}


// =====================================================
// GET BOOKINGS
// =====================================================

function getBookings() {
    return getStorageData(
        STORAGE_KEYS.bookings,
        defaultBookings
    );
}


// =====================================================
// SAVE BOOKINGS
// =====================================================

function saveBookings(bookings) {
    return saveStorageData(
        STORAGE_KEYS.bookings,
        bookings
    );
}


// =====================================================
// GET PAYMENTS
// =====================================================

function getPayments() {
    return getStorageData(
        STORAGE_KEYS.payments,
        defaultPayments
    );
}


// =====================================================
// GET ADDRESSES
// =====================================================

function getAddresses() {
    return getStorageData(
        STORAGE_KEYS.addresses,
        defaultAddresses
    );
}


// =====================================================
// GET FAVOURITES
// =====================================================

function getFavourites() {
    return getStorageData(
        STORAGE_KEYS.favourites,
        defaultFavourites
    );
}


// =====================================================
// SAVE FAVOURITES
// =====================================================

function saveFavourites(favourites) {
    return saveStorageData(
        STORAGE_KEYS.favourites,
        favourites
    );
}


// =====================================================
// GET REVIEWS
// =====================================================

function getReviews() {
    return getStorageData(
        STORAGE_KEYS.reviews,
        defaultReviews
    );
}


// =====================================================
// GET NOTIFICATIONS
// =====================================================

function getNotifications() {
    return getStorageData(
        STORAGE_KEYS.notifications,
        defaultNotifications
    );
}


// =====================================================
// GET SUPPORT TICKETS
// =====================================================

function getTickets() {
    return getStorageData(
        STORAGE_KEYS.tickets,
        defaultTickets
    );
}


// =====================================================
// GET WALLET BALANCE
// =====================================================

function getWalletBalance() {
    return Number(
        getStorageData(
            STORAGE_KEYS.wallet,
            defaultWallet
        )
    );
}


// =====================================================
// SAVE WALLET BALANCE
// =====================================================

function saveWalletBalance(balance) {
    return saveStorageData(
        STORAGE_KEYS.wallet,
        Number(balance)
    );
}


// =====================================================
// GENERATE IDs
// =====================================================

function generateId(prefix) {
    return (
        prefix +
        Date.now().toString().slice(-6)
    );
}


// =====================================================
// MAKE DATA AVAILABLE GLOBALLY
// =====================================================

window.skilliantData = {
    STORAGE_KEYS,

    defaultUser,
    defaultLabourers,
    defaultBookings,
    defaultPayments,
    defaultAddresses,
    defaultFavourites,
    defaultReviews,
    defaultNotifications,
    defaultTickets,
    defaultWallet,

    getStorageData,
    saveStorageData,
    initializeData,

    getCurrentUser,
    updateCurrentUser,

    getLabourers,

    getBookings,
    saveBookings,

    getPayments,

    getAddresses,

    getFavourites,
    saveFavourites,

    getReviews,

    getNotifications,

    getTickets,

    getWalletBalance,
    saveWalletBalance,

    generateId
};