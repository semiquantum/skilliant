// =====================================================
// SKILLIANT - USER PORTAL APP.JS
// Vanilla JavaScript ES6
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    // =================================================
    // DEFAULT DATA
    // =================================================

    const defaultUser = {
        name: "Shruti",
        email: "shruti@example.com",
        phone: "9876543210",
        location: "Mumbai"
    };

    const defaultLabourers = [
        {
            id: 1,
            name: "Ramesh Kumar",
            skill: "Plumber",
            location: "Mumbai",
            experience: "5 Years",
            rating: 4.8,
            reviews: 120,
            price: 500,
            availability: "Available",
            image: "https://i.pravatar.cc/300?img=12"
        },
        {
            id: 2,
            name: "Suresh Patil",
            skill: "Electrician",
            location: "Mumbai",
            experience: "7 Years",
            rating: 4.7,
            reviews: 98,
            price: 600,
            availability: "Available",
            image: "https://i.pravatar.cc/300?img=13"
        },
        {
            id: 3,
            name: "Amit Sharma",
            skill: "Carpenter",
            location: "Thane",
            experience: "6 Years",
            rating: 4.6,
            reviews: 85,
            price: 700,
            availability: "Busy",
            image: "https://i.pravatar.cc/300?img=14"
        },
        {
            id: 4,
            name: "Rajesh Yadav",
            skill: "Painter",
            location: "Navi Mumbai",
            experience: "4 Years",
            rating: 4.5,
            reviews: 75,
            price: 450,
            availability: "Available",
            image: "https://i.pravatar.cc/300?img=15"
        }
    ];

    const defaultBookings = [];

    const defaultPayments = [];

    const defaultAddresses = [
        {
            id: 1,
            title: "Home",
            type: "Home",
            address: "Your Home Address",
            city: "Mumbai",
            default: true
        }
    ];

    const defaultFavourites = [];

    const defaultReviews = [];

    const defaultNotifications = [
        {
            id: 1,
            title: "Welcome to Skilliant",
            message: "Find trusted labour professionals easily.",
            time: "Just now",
            unread: true
        }
    ];

    const defaultTickets = [];

    const defaultWallet = 0;


    // =================================================
    // STORAGE HELPER
    // =================================================

    function getStorageData(key, defaultValue) {

        try {

            const data = localStorage.getItem(key);

            if (data === null) {
                return defaultValue;
            }

            return JSON.parse(data);

        } catch (error) {

            console.error(
                "Storage error for:",
                key,
                error
            );

            return defaultValue;
        }
    }


    // =================================================
    // DATA
    // =================================================

    let user = getStorageData(
        "user",
        defaultUser
    );

    let labourers = getStorageData(
        "labourers",
        defaultLabourers
    );

    let bookings = getStorageData(
        "bookings",
        defaultBookings
    );

    let payments = getStorageData(
        "payments",
        defaultPayments
    );

    let addresses = getStorageData(
        "addresses",
        defaultAddresses
    );

    let favourites = getStorageData(
        "favourites",
        defaultFavourites
    );

    let reviews = getStorageData(
        "reviews",
        defaultReviews
    );

    let notifications = getStorageData(
        "notifications",
        defaultNotifications
    );

    let tickets = getStorageData(
        "tickets",
        defaultTickets
    );

    let wallet = Number(
        getStorageData(
            "wallet",
            defaultWallet
        )
    );


    // =================================================
    // INITIALIZE DATA
    // =================================================

    function initializeData() {

        if (!localStorage.getItem("user")) {
            localStorage.setItem(
                "user",
                JSON.stringify(defaultUser)
            );
        }

        if (!localStorage.getItem("labourers")) {
            localStorage.setItem(
                "labourers",
                JSON.stringify(defaultLabourers)
            );
        }

        if (!localStorage.getItem("bookings")) {
            localStorage.setItem(
                "bookings",
                JSON.stringify(defaultBookings)
            );
        }

        if (!localStorage.getItem("payments")) {
            localStorage.setItem(
                "payments",
                JSON.stringify(defaultPayments)
            );
        }

        if (!localStorage.getItem("addresses")) {
            localStorage.setItem(
                "addresses",
                JSON.stringify(defaultAddresses)
            );
        }

        if (!localStorage.getItem("favourites")) {
            localStorage.setItem(
                "favourites",
                JSON.stringify(defaultFavourites)
            );
        }

        if (!localStorage.getItem("reviews")) {
            localStorage.setItem(
                "reviews",
                JSON.stringify(defaultReviews)
            );
        }

        if (!localStorage.getItem("notifications")) {
            localStorage.setItem(
                "notifications",
                JSON.stringify(defaultNotifications)
            );
        }

        if (!localStorage.getItem("tickets")) {
            localStorage.setItem(
                "tickets",
                JSON.stringify(defaultTickets)
            );
        }

        if (!localStorage.getItem("wallet")) {
            localStorage.setItem(
                "wallet",
                JSON.stringify(defaultWallet)
            );
        }
    }


    initializeData();


    // =================================================
    // ELEMENTS
    // =================================================

    const sidebar =
        document.getElementById("sidebar");

    const sidebarOverlay =
        document.getElementById("sidebarOverlay");

    const menuToggle =
        document.getElementById("menuToggle");

    const sidebarClose =
        document.getElementById("sidebarClose");

    const modalOverlay =
        document.getElementById("modalOverlay");

    const modalContent =
        document.getElementById("modalContent");

    const toast =
        document.getElementById("toast");

    const toastMessage =
        document.getElementById("toastMessage");


    // =================================================
    // SAVE DATA
    // =================================================

    function saveData() {

        localStorage.setItem(
            "user",
            JSON.stringify(user)
        );

        localStorage.setItem(
            "labourers",
            JSON.stringify(labourers)
        );

        localStorage.setItem(
            "bookings",
            JSON.stringify(bookings)
        );

        localStorage.setItem(
            "payments",
            JSON.stringify(payments)
        );

        localStorage.setItem(
            "addresses",
            JSON.stringify(addresses)
        );

        localStorage.setItem(
            "favourites",
            JSON.stringify(favourites)
        );

        localStorage.setItem(
            "reviews",
            JSON.stringify(reviews)
        );

        localStorage.setItem(
            "notifications",
            JSON.stringify(notifications)
        );

        localStorage.setItem(
            "tickets",
            JSON.stringify(tickets)
        );

        localStorage.setItem(
            "wallet",
            JSON.stringify(wallet)
        );
    }


    // =================================================
    // CURRENCY
    // =================================================

    function formatCurrency(amount) {

        return "₹" +
            Number(amount || 0)
                .toLocaleString("en-IN");
    }


    // =================================================
    // INITIALS
    // =================================================

    function getInitials(name) {

        if (!name) {
            return "S";
        }

        return name
            .trim()
            .split(/\s+/)
            .map(word => word.charAt(0))
            .join("")
            .substring(0, 2)
            .toUpperCase();
    }


    // =================================================
    // ESCAPE HTML
    // =================================================

    function escapeHTML(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    // =================================================
    // TOAST
    // =================================================

    function showToast(
        message,
        type = "success"
    ) {

        if (!toast || !toastMessage) {
            return;
        }

        toastMessage.textContent =
            message;

        toast.classList.remove(
            "show",
            "success",
            "error"
        );

        toast.classList.add(type);
        toast.classList.add("show");

        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 3000);
    }


    // =================================================
    // MODAL
    // =================================================

    function openModal(content) {

        if (!modalOverlay || !modalContent) {
            return;
        }

        modalContent.innerHTML =
            content;

        modalOverlay.classList.add(
            "active"
        );

        document.body.classList.add(
            "modal-open"
        );
    }


    function closeModal() {

        if (!modalOverlay) {
            return;
        }

        modalOverlay.classList.remove(
            "active"
        );

        document.body.classList.remove(
            "modal-open"
        );

        if (modalContent) {
            modalContent.innerHTML = "";
        }
    }


    // =================================================
    // SIDEBAR
    // =================================================

    function openSidebar() {

        sidebar?.classList.add("open");

        sidebarOverlay?.classList.add(
            "active"
        );
    }


    function closeSidebar() {

        sidebar?.classList.remove("open");

        sidebarOverlay?.classList.remove(
            "active"
        );
    }


    menuToggle?.addEventListener(
        "click",
        openSidebar
    );

    sidebarClose?.addEventListener(
        "click",
        closeSidebar
    );

    sidebarOverlay?.addEventListener(
        "click",
        closeSidebar
    );


    // =================================================
    // PAGE INFORMATION
    // =================================================

    const pageInfo = {

        dashboard: {
            title: "Dashboard",
            subtitle: "Overview of your activity"
        },

        search: {
            title: "Search Labour",
            subtitle: "Find the right professional"
        },

        bookings: {
            title: "My Bookings",
            subtitle: "Manage your labour bookings"
        },

        favourites: {
            title: "Favourite Labour",
            subtitle: "Your saved professionals"
        },

        wallet: {
            title: "Wallet",
            subtitle: "Manage your wallet balance"
        },

        payments: {
            title: "Payment History",
            subtitle: "View your payment transactions"
        },

        addresses: {
            title: "Saved Addresses",
            subtitle: "Manage your service addresses"
        },

        reviews: {
            title: "Reviews & Ratings",
            subtitle: "Manage your reviews"
        },

        notifications: {
            title: "Notifications",
            subtitle: "Stay updated with your bookings"
        },

        support: {
            title: "Support",
            subtitle: "We're here to help you"
        },

        settings: {
            title: "Settings",
            subtitle: "Manage your preferences"
        },

        profile: {
            title: "My Profile",
            subtitle: "Manage your personal information"
        }
    };


    // =================================================
    // UPDATE USER DISPLAY
    // =================================================

    function updateUserDisplay() {

        const initials =
            getInitials(user.name);

        document
            .querySelectorAll(
                ".user-avatar, .navbar-avatar, .large-avatar"
            )
            .forEach(element => {

                element.textContent =
                    initials;
            });


        const sidebarName =
            document.getElementById(
                "sidebarUserName"
            );

        const navbarName =
            document.getElementById(
                "navbarUserName"
            );

        const welcomeName =
            document.getElementById(
                "welcomeUserName"
            );

        const profileName =
            document.getElementById(
                "profileDisplayName"
            );


        if (sidebarName) {
            sidebarName.textContent =
                user.name || "User";
        }

        if (navbarName) {
            navbarName.textContent =
                user.name || "User";
        }

        if (welcomeName) {
            welcomeName.textContent =
                user.name || "User";
        }

        if (profileName) {
            profileName.textContent =
                user.name || "User";
        }
    }


    // =================================================
    // NAVIGATION
    // =================================================

    function navigateTo(sectionName) {

        const section =
            document.getElementById(
                sectionName
            );

        if (!section) {

            console.warn(
                "Section not found:",
                sectionName
            );

            return;
        }


        document
            .querySelectorAll(
                ".page-section"
            )
            .forEach(item => {

                item.classList.remove(
                    "active"
                );
            });


        section.classList.add(
            "active"
        );


        document
            .querySelectorAll(
                ".nav-item"
            )
            .forEach(item => {

                item.classList.toggle(
                    "active",
                    item.dataset.section ===
                    sectionName
                );
            });


        const info =
            pageInfo[sectionName];


        const title =
            document.getElementById(
                "pageTitle"
            );

        const subtitle =
            document.getElementById(
                "pageSubtitle"
            );


        if (title && info) {
            title.textContent =
                info.title;
        }

        if (subtitle && info) {
            subtitle.textContent =
                info.subtitle;
        }


        closeSidebar();


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });


        renderSection(
            sectionName
        );
    }


    // =================================================
    // NAVIGATION EVENTS
    // =================================================

    document
        .querySelectorAll(".nav-item")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const section =
                        button.dataset.section;

                    if (section) {
                        navigateTo(
                            section
                        );
                    }
                }
            );
        });


    document
        .querySelectorAll(
            "[data-section-link]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const section =
                        button.dataset.sectionLink;

                    if (section) {
                        navigateTo(
                            section
                        );
                    }
                }
            );
        });


    // =================================================
    // DASHBOARD
    // =================================================

    function renderDashboard() {

        const total =
            bookings.length;

        const active =
            bookings.filter(
                booking =>
                    booking.status ===
                    "Active"
            ).length;

        const completed =
            bookings.filter(
                booking =>
                    booking.status ===
                    "Completed"
            ).length;


        const totalElement =
            document.getElementById(
                "totalBookings"
            );

        const activeElement =
            document.getElementById(
                "activeBookings"
            );

        const completedElement =
            document.getElementById(
                "completedBookings"
            );

        const walletElement =
            document.getElementById(
                "dashboardWallet"
            );


        if (totalElement) {
            totalElement.textContent =
                total;
        }

        if (activeElement) {
            activeElement.textContent =
                active;
        }

        if (completedElement) {
            completedElement.textContent =
                completed;
        }

        if (walletElement) {
            walletElement.textContent =
                formatCurrency(wallet);
        }


        const recentContainer =
            document.getElementById(
                "recentBookingsList"
            );


        if (recentContainer) {

            const recent =
                bookings.slice(0, 5);


            recentContainer.innerHTML =
                recent.length
                    ? recent.map(
                        booking => `
                        <div class="booking-item">

                            <div>
                                <strong>
                                    ${escapeHTML(
                                        booking.labour
                                    )}
                                </strong>

                                <span>
                                    ${escapeHTML(
                                        booking.skill
                                    )}
                                </span>
                            </div>

                            <div>
                                <strong>
                                    ${formatCurrency(
                                        booking.amount
                                    )}
                                </strong>

                                <small>
                                    ${escapeHTML(
                                        booking.status
                                    )}
                                </small>
                            </div>

                        </div>
                    `
                    ).join("")
                    : "<p>No bookings yet.</p>";
        }


        const notificationContainer =
            document.getElementById(
                "dashboardNotifications"
            );


        if (notificationContainer) {

            notificationContainer.innerHTML =
                notifications.length
                    ? notifications
                        .slice(0, 4)
                        .map(
                            notification => `
                            <div class="notification-item">

                                <strong>
                                    ${escapeHTML(
                                        notification.title
                                    )}
                                </strong>

                                <p>
                                    ${escapeHTML(
                                        notification.message
                                    )}
                                </p>

                                <small>
                                    ${escapeHTML(
                                        notification.time
                                    )}
                                </small>

                            </div>
                        `
                        )
                        .join("")
                    : "<p>No notifications.</p>";
        }


        const upcoming =
            document.getElementById(
                "upcomingBooking"
            );


        if (upcoming) {

            const nextBooking =
                bookings.find(
                    booking =>
                        booking.status ===
                        "Confirmed" ||
                        booking.status ===
                        "Pending"
                );


            if (nextBooking) {

                upcoming.innerHTML = `
                    <div class="booking-item">

                        <div>

                            <strong>
                                ${escapeHTML(
                                    nextBooking.labour
                                )}
                            </strong>

                            <span>
                                ${escapeHTML(
                                    nextBooking.skill
                                )}
                            </span>

                            <small>
                                ${escapeHTML(
                                    nextBooking.date
                                )}
                                •
                                ${escapeHTML(
                                    nextBooking.time
                                )}
                            </small>

                        </div>

                        <strong>
                            ${formatCurrency(
                                nextBooking.amount
                            )}
                        </strong>

                    </div>
                `;

            } else {

                upcoming.innerHTML =
                    "<p>No upcoming bookings.</p>";
            }
        }
    }


    // =================================================
    // SEARCH LABOUR
    // =================================================

    function renderLabourers(
        list = labourers
    ) {

        const grid =
            document.getElementById(
                "labourGrid"
            );


        if (!grid) {
            return;
        }


        if (!list.length) {

            grid.innerHTML = `
                <div class="empty-state">

                    <h3>
                        No Labour Found
                    </h3>

                    <p>
                        Try changing your search or filters.
                    </p>

                </div>
            `;

            return;
        }


        grid.innerHTML =
            list.map(labour => {

                const isFavourite =
                    favourites.includes(
                        Number(labour.id)
                    );


                return `
                    <div class="labour-card">

                        <div class="labour-image">

                            <img
                                src="${escapeHTML(
                                    labour.image
                                )}"
                                alt="${escapeHTML(
                                    labour.name
                                )}"
                            >

                        </div>


                        <div class="labour-card-body">

                            <div class="labour-header">

                                <div>

                                    <h3>
                                        ${escapeHTML(
                                            labour.name
                                        )}
                                    </h3>

                                    <p>
                                        ${escapeHTML(
                                            labour.skill
                                        )}
                                    </p>

                                </div>


                                <button
                                    type="button"
                                    class="favourite-btn"
                                    data-favourite-id="${labour.id}"
                                >
                                    ${
                                        isFavourite
                                            ? "♥"
                                            : "♡"
                                    }
                                </button>

                            </div>


                            <p>
                                📍
                                ${escapeHTML(
                                    labour.location
                                )}
                            </p>

                            <p>
                                Experience:
                                ${escapeHTML(
                                    labour.experience
                                )}
                            </p>

                            <p>
                                ⭐ ${labour.rating}
                                (${labour.reviews} reviews)
                            </p>

                            <p>
                                ${formatCurrency(
                                    labour.price
                                )}
                                / service
                            </p>

                            <p>
                                ${escapeHTML(
                                    labour.availability
                                )}
                            </p>


                            <div class="labour-actions">

                                <button
                                    type="button"
                                    class="secondary-btn"
                                    data-view-labour="${labour.id}"
                                >
                                    View Profile
                                </button>

                                <button
                                    type="button"
                                    class="primary-btn"
                                    data-book-labour="${labour.id}"
                                >
                                    Book Now
                                </button>

                            </div>

                        </div>

                    </div>
                `;
            })
            .join("");
    }


    function applyLabourFilters() {

        const searchInput =
            document.getElementById(
                "labourSearch"
            );

        const category =
            document.getElementById(
                "categoryFilter"
            );

        const location =
            document.getElementById(
                "locationFilter"
            );

        const rating =
            document.getElementById(
                "ratingFilter"
            );

        const availability =
            document.getElementById(
                "availabilityFilter"
            );


        const search =
            searchInput?.value
                .trim()
                .toLowerCase() || "";


        const categoryValue =
            category?.value || "all";

        const locationValue =
            location?.value || "all";

        const ratingValue =
            Number(
                rating?.value || 0
            );

        const availabilityValue =
            availability?.value || "all";


        const filtered =
            labourers.filter(
                labour => {

                    const name =
                        String(
                            labour.name || ""
                        ).toLowerCase();

                    const skill =
                        String(
                            labour.skill || ""
                        ).toLowerCase();


                    const matchesSearch =
                        !search ||
                        name.includes(search) ||
                        skill.includes(search);


                    const matchesCategory =
                        categoryValue === "all" ||
                        labour.skill ===
                        categoryValue;


                    const matchesLocation =
                        locationValue === "all" ||
                        labour.location ===
                        locationValue;


                    const matchesRating =
                        Number(
                            labour.rating
                        ) >= ratingValue;


                    const matchesAvailability =
                        availabilityValue ===
                            "all" ||
                        labour.availability ===
                            availabilityValue;


                    return (
                        matchesSearch &&
                        matchesCategory &&
                        matchesLocation &&
                        matchesRating &&
                        matchesAvailability
                    );
                }
            );


        renderLabourers(
            filtered
        );
    }


    document
        .getElementById("searchButton")
        ?.addEventListener(
            "click",
            applyLabourFilters
        );


    document
        .getElementById("labourSearch")
        ?.addEventListener(
            "input",
            applyLabourFilters
        );


    [
        "categoryFilter",
        "locationFilter",
        "ratingFilter",
        "availabilityFilter"
    ].forEach(id => {

        document
            .getElementById(id)
            ?.addEventListener(
                "change",
                applyLabourFilters
            );
    });


    document
        .getElementById("clearFilters")
        ?.addEventListener(
            "click",
            () => {

                const search =
                    document.getElementById(
                        "labourSearch"
                    );

                const category =
                    document.getElementById(
                        "categoryFilter"
                    );

                const location =
                    document.getElementById(
                        "locationFilter"
                    );

                const rating =
                    document.getElementById(
                        "ratingFilter"
                    );

                const availability =
                    document.getElementById(
                        "availabilityFilter"
                    );


                if (search) {
                    search.value = "";
                }

                if (category) {
                    category.value = "all";
                }

                if (location) {
                    location.value = "all";
                }

                if (rating) {
                    rating.value = "0";
                }

                if (availability) {
                    availability.value = "all";
                }


                renderLabourers();
            }
        );


    // =================================================
    // FAVOURITES
    // =================================================

    function renderFavourites() {

        const grid =
            document.getElementById(
                "favouritesGrid"
            );


        if (!grid) {
            return;
        }


        const favouriteLabourers =
            labourers.filter(
                labour =>
                    favourites.includes(
                        Number(labour.id)
                    )
            );


        if (!favouriteLabourers.length) {

            grid.innerHTML = `
                <div class="empty-state">

                    <h3>
                        No Favourite Labour
                    </h3>

                    <p>
                        Add professionals to your favourites.
                    </p>

                </div>
            `;

            return;
        }


        grid.innerHTML =
            favouriteLabourers
                .map(
                    labour => `

                    <div class="labour-card">

                        <div class="labour-image">

                            <img
                                src="${escapeHTML(
                                    labour.image
                                )}"
                                alt="${escapeHTML(
                                    labour.name
                                )}"
                            >

                        </div>


                        <div class="labour-card-body">

                            <h3>
                                ${escapeHTML(
                                    labour.name
                                )}
                            </h3>

                            <p>
                                ${escapeHTML(
                                    labour.skill
                                )}
                            </p>

                            <p>
                                ⭐ ${labour.rating}
                            </p>


                            <div class="labour-actions">

                                <button
                                    type="button"
                                    class="secondary-btn"
                                    data-favourite-id="${labour.id}"
                                >
                                    Remove
                                </button>

                                <button
                                    type="button"
                                    class="primary-btn"
                                    data-book-labour="${labour.id}"
                                >
                                    Book Now
                                </button>

                            </div>

                        </div>

                    </div>
                `
                )
                .join("");
    }


    function toggleFavourite(id) {

        id = Number(id);


        if (
            favourites.some(
                item => Number(item) === id
            )
        ) {

            favourites =
                favourites.filter(
                    item =>
                        Number(item) !== id
                );

            showToast(
                "Removed from favourites."
            );

        } else {

            favourites.push(id);

            showToast(
                "Added to favourites."
            );
        }


        localStorage.setItem(
            "favourites",
            JSON.stringify(favourites)
        );


        renderLabourers();

        renderFavourites();
    }


    // =================================================
    // BOOKINGS
    // =================================================

    let currentBookingTab = "all";


    function renderBookings() {

        const container =
            document.getElementById(
                "bookingsList"
            );


        if (!container) {
            return;
        }


        let filtered =
            [...bookings];


        if (currentBookingTab === "active") {

            filtered =
                bookings.filter(
                    booking =>
                        booking.status ===
                        "Active"
                );
        }


        if (currentBookingTab === "upcoming") {

            filtered =
                bookings.filter(
                    booking =>
                        booking.status ===
                            "Pending" ||
                        booking.status ===
                            "Confirmed"
                );
        }


        if (currentBookingTab === "completed") {

            filtered =
                bookings.filter(
                    booking =>
                        booking.status ===
                        "Completed"
                );
        }


        if (currentBookingTab === "cancelled") {

            filtered =
                bookings.filter(
                    booking =>
                        booking.status ===
                        "Cancelled"
                );
        }


        if (!filtered.length) {

            container.innerHTML = `
                <div class="empty-state">

                    <h3>
                        No Bookings
                    </h3>

                    <p>
                        No bookings found in this category.
                    </p>

                </div>
            `;

            return;
        }


        container.innerHTML =
            filtered
                .map(
                    booking => `

                    <div class="booking-card">

                        <div>

                            <h3>
                                ${escapeHTML(
                                    booking.labour
                                )}
                            </h3>

                            <p>
                                ${escapeHTML(
                                    booking.skill
                                )}
                            </p>

                            <p>
                                📅
                                ${escapeHTML(
                                    booking.date
                                )}
                            </p>

                            <p>
                                🕐
                                ${escapeHTML(
                                    booking.time
                                )}
                            </p>

                            <p>
                                ${formatCurrency(
                                    booking.amount
                                )}
                            </p>

                        </div>


                        <div>

                            <span class="status-badge">
                                ${escapeHTML(
                                    booking.status
                                )}
                            </span>

                            ${
                                booking.status !==
                                    "Completed" &&
                                booking.status !==
                                    "Cancelled"
                                    ? `
                                    <button
                                        type="button"
                                        class="danger-btn"
                                        data-cancel-booking="${booking.id}"
                                    >
                                        Cancel
                                    </button>
                                    `
                                    : ""
                            }

                        </div>

                    </div>
                `
                )
                .join("");
    }


    document
        .querySelectorAll(
            "[data-booking-tab]"
        )
        .forEach(tab => {

            tab.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            "[data-booking-tab]"
                        )
                        .forEach(item =>
                            item.classList.remove(
                                "active"
                            )
                        );


                    tab.classList.add(
                        "active"
                    );


                    currentBookingTab =
                        tab.dataset.bookingTab;


                    renderBookings();
                }
            );
        });


    // =================================================
    // BOOKING MODAL
    // =================================================

    function openBookingModal(
        labourId
    ) {

        labourId =
            Number(labourId);


        const labour =
            labourers.find(
                item =>
                    Number(item.id) ===
                    labourId
            );


        if (!labour) {
            showToast(
                "Labour not found.",
                "error"
            );

            return;
        }


        const addressOptions =
            addresses.length
                ? addresses
                    .map(
                        address => `
                        <option
                            value="${escapeHTML(
                                address.address
                            )}"
                        >
                            ${escapeHTML(
                                address.title ||
                                "Address"
                            )}
                            -
                            ${escapeHTML(
                                address.address
                            )}
                        </option>
                    `
                    )
                    .join("")
                : `
                    <option value="">
                        No saved address
                    </option>
                `;


        openModal(`

            <div class="modal-header">

                <h2>
                    Book Labour
                </h2>

                <button
                    type="button"
                    data-close-modal
                >
                    ×
                </button>

            </div>


            <form
                id="bookingForm"
                class="modal-body"
            >

                <h3>
                    ${escapeHTML(
                        labour.name
                    )}
                </h3>

                <p>
                    ${escapeHTML(
                        labour.skill
                    )}
                </p>


                <div class="form-group">

                    <label>
                        Date
                    </label>

                    <input
                        type="date"
                        id="bookingDate"
                        required
                    >

                </div>


                <div class="form-group">

                    <label>
                        Time
                    </label>

                    <input
                        type="time"
                        id="bookingTime"
                        required
                    >

                </div>


                <div class="form-group">

                    <label>
                        Address
                    </label>

                    <select
                        id="bookingAddress"
                        required
                    >

                        <option value="">
                            Select Address
                        </option>

                        ${addressOptions}

                    </select>

                </div>


                <div class="form-group">

                    <label>
                        Additional Requirements
                    </label>

                    <textarea
                        id="bookingRequirements"
                        placeholder="Describe your requirements"
                    ></textarea>

                </div>


                <div class="modal-footer">

                    <button
                        type="button"
                        class="secondary-btn"
                        data-close-modal
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        class="primary-btn"
                    >
                        Confirm Booking
                    </button>

                </div>

            </form>
        `);


        const form =
            document.getElementById(
                "bookingForm"
            );


        form?.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const date =
                    document.getElementById(
                        "bookingDate"
                    )?.value;

                const time =
                    document.getElementById(
                        "bookingTime"
                    )?.value;

                const address =
                    document.getElementById(
                        "bookingAddress"
                    )?.value;

                const requirements =
                    document.getElementById(
                        "bookingRequirements"
                    )?.value || "";


                if (
                    !date ||
                    !time ||
                    !address
                ) {

                    showToast(
                        "Please fill all required fields.",
                        "error"
                    );

                    return;
                }


                const booking = {

                    id:
                        "BK" +
                        Date.now(),

                    labourId:
                        labour.id,

                    labour:
                        labour.name,

                    skill:
                        labour.skill,

                    date,

                    time,

                    address,

                    requirements,

                    amount:
                        labour.price,

                    status:
                        "Pending",

                    createdAt:
                        new Date().toISOString()
                };


                bookings.unshift(
                    booking
                );


                notifications.unshift({

                    id:
                        Date.now(),

                    title:
                        "Booking Created",

                    message:
                        `Your booking with ${labour.name} has been created.`,

                    time:
                        "Just now",

                    unread:
                        true
                });


                saveData();

                closeModal();

                showToast(
                    "Booking created successfully."
                );


                renderDashboard();

                renderBookings();
            }
        );
    }


    // =================================================
    // CANCEL BOOKING
    // =================================================

    function cancelBooking(id) {

        const booking =
            bookings.find(
                item =>
                    String(item.id) ===
                    String(id)
            );


        if (!booking) {
            return;
        }


        const confirmed =
            confirm(
                "Are you sure you want to cancel this booking?"
            );


        if (!confirmed) {
            return;
        }


        booking.status =
            "Cancelled";


        notifications.unshift({

            id:
                Date.now(),

            title:
                "Booking Cancelled",

            message:
                `Booking ${booking.id} has been cancelled.`,

            time:
                "Just now",

            unread:
                true
        });


        saveData();


        showToast(
            "Booking cancelled."
        );


        renderBookings();

        renderDashboard();
    }


    // =================================================
    // WALLET
    // =================================================

    function renderWallet() {

        const balance =
            document.getElementById(
                "walletBalance"
            );

        const dashboardBalance =
            document.getElementById(
                "dashboardWallet"
            );


        if (balance) {
            balance.textContent =
                formatCurrency(wallet);
        }

        if (dashboardBalance) {
            dashboardBalance.textContent =
                formatCurrency(wallet);
        }


        const transactionList =
            document.getElementById(
                "transactionsList"
            );


        if (transactionList) {

            transactionList.innerHTML =
                payments.length
                    ? payments
                        .slice(0, 10)
                        .map(
                            payment => `
                            <div class="transaction-item">

                                <div>

                                    <strong>
                                        ${escapeHTML(
                                            payment.description
                                        )}
                                    </strong>

                                    <small>
                                        ${escapeHTML(
                                            payment.date
                                        )}
                                    </small>

                                </div>

                                <strong>
                                    ${formatCurrency(
                                        payment.amount
                                    )}
                                </strong>

                            </div>
                        `
                        )
                        .join("")
                    : "<p>No transactions.</p>";
        }
    }


    document
        .getElementById(
            "addMoneyButton"
        )
        ?.addEventListener(
            "click",
            () => {

                const amount =
                    prompt(
                        "Enter amount to add:"
                    );


                const value =
                    Number(amount);


                if (
                    !value ||
                    value <= 0
                ) {

                    showToast(
                        "Please enter a valid amount.",
                        "error"
                    );

                    return;
                }


                wallet += value;


                payments.unshift({

                    id:
                        "TXN" +
                        Date.now(),

                    date:
                        new Date()
                            .toISOString()
                            .split("T")[0],

                    description:
                        "Wallet Recharge",

                    amount:
                        value,

                    method:
                        "Demo",

                    status:
                        "Successful"
                });


                saveData();

                renderWallet();


                showToast(
                    `${formatCurrency(value)} added to wallet.`
                );
            }
        );


    // =================================================
    // PAYMENTS
    // =================================================

    function renderPayments() {

        const tbody =
            document.getElementById(
                "paymentTableBody"
            );


        if (!tbody) {
            return;
        }


        tbody.innerHTML =
            payments.length
                ? payments
                    .map(
                        payment => `
                        <tr>

                            <td>
                                ${escapeHTML(
                                    payment.id
                                )}
                            </td>

                            <td>
                                ${escapeHTML(
                                    payment.date
                                )}
                            </td>

                            <td>
                                ${escapeHTML(
                                    payment.description
                                )}
                            </td>

                            <td>
                                ${formatCurrency(
                                    payment.amount
                                )}
                            </td>

                            <td>
                                ${escapeHTML(
                                    payment.method
                                )}
                            </td>

                            <td>
                                ${escapeHTML(
                                    payment.status
                                )}
                            </td>

                        </tr>
                    `
                    )
                    .join("")
                : `
                    <tr>
                        <td colspan="6">
                            No payment history.
                        </td>
                    </tr>
                `;
    }


    // =================================================
    // ADDRESSES
    // =================================================

    function renderAddresses() {

        const grid =
            document.getElementById(
                "addressGrid"
            );


        if (!grid) {
            return;
        }


        grid.innerHTML =
            addresses.length
                ? addresses
                    .map(
                        address => `
                        <div class="address-card">

                            <h3>
                                ${escapeHTML(
                                    address.title ||
                                    address.type ||
                                    "Address"
                                )}
                            </h3>

                            <p>
                                ${escapeHTML(
                                    address.address
                                )}
                            </p>

                            <p>
                                ${escapeHTML(
                                    address.city || ""
                                )}
                            </p>


                            <div>

                                <button
                                    type="button"
                                    class="secondary-btn"
                                    data-edit-address="${address.id}"
                                >
                                    Edit
                                </button>

                                <button
                                    type="button"
                                    class="danger-btn"
                                    data-delete-address="${address.id}"
                                >
                                    Delete
                                </button>

                            </div>

                        </div>
                    `
                    )
                    .join("")
                : `
                    <div class="empty-state">

                        <h3>
                            No Addresses
                        </h3>

                        <p>
                            Add an address for faster booking.
                        </p>

                    </div>
                `;
    }


    document
        .getElementById(
            "addAddressButton"
        )
        ?.addEventListener(
            "click",
            () => openAddressModal()
        );


    function openAddressModal(
        existing = null
    ) {

        openModal(`

            <div class="modal-header">

                <h2>
                    ${
                        existing
                            ? "Edit Address"
                            : "Add Address"
                    }
                </h2>

                <button
                    type="button"
                    data-close-modal
                >
                    ×
                </button>

            </div>


            <form
                id="addressForm"
                class="modal-body"
            >

                <input
                    type="hidden"
                    id="addressId"
                    value="${
                        existing
                            ? existing.id
                            : ""
                    }"
                >


                <div class="form-group">

                    <label>
                        Address Type
                    </label>

                    <select
                        id="addressType"
                        required
                    >

                        <option value="Home">
                            Home
                        </option>

                        <option value="Work">
                            Work
                        </option>

                        <option value="Other">
                            Other
                        </option>

                    </select>

                </div>


                <div class="form-group">

                    <label>
                        Address
                    </label>

                    <textarea
                        id="addressText"
                        required
                    >${
                        existing
                            ? escapeHTML(
                                existing.address
                            )
                            : ""
                    }</textarea>

                </div>


                <div class="modal-footer">

                    <button
                        type="button"
                        class="secondary-btn"
                        data-close-modal
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        class="primary-btn"
                    >
                        Save Address
                    </button>

                </div>

            </form>
        `);


        if (existing) {

            const type =
                document.getElementById(
                    "addressType"
                );

            if (type) {
                type.value =
                    existing.type ||
                    existing.title ||
                    "Home";
            }
        }


        document
            .getElementById(
                "addressForm"
            )
            ?.addEventListener(
                "submit",
                event => {

                    event.preventDefault();


                    const id =
                        document.getElementById(
                            "addressId"
                        ).value;


                    const type =
                        document.getElementById(
                            "addressType"
                        ).value;


                    const text =
                        document.getElementById(
                            "addressText"
                        ).value.trim();


                    if (!text) {

                        showToast(
                            "Please enter an address.",
                            "error"
                        );

                        return;
                    }


                    if (id) {

                        const address =
                            addresses.find(
                                item =>
                                    String(
                                        item.id
                                    ) ===
                                    String(id)
                            );


                        if (address) {

                            address.title =
                                type;

                            address.type =
                                type;

                            address.address =
                                text;
                        }

                    } else {

                        addresses.push({

                            id:
                                Date.now(),

                            title:
                                type,

                            type,

                            address:
                                text,

                            city:
                                "",

                            default:
                                addresses.length ===
                                0
                        });
                    }


                    saveData();

                    closeModal();

                    renderAddresses();


                    showToast(
                        "Address saved successfully."
                    );
                }
            );
    }


    // =================================================
    // REVIEWS
    // =================================================

    function renderReviews() {

        const container =
            document.getElementById(
                "reviewsList"
            );


        if (!container) {
            return;
        }


        container.innerHTML =
            reviews.length
                ? reviews
                    .map(
                        review => `

                        <div class="review-card">

                            <h3>
                                ${escapeHTML(
                                    review.labour ||
                                    review.labourName ||
                                    ""
                                )}
                            </h3>

                            <div>
                                ${
                                    "★".repeat(
                                        Number(
                                            review.rating || 0
                                        )
                                    )
                                }
                            </div>

                            <p>
                                ${escapeHTML(
                                    review.review
                                )}
                            </p>

                            <small>
                                ${escapeHTML(
                                    review.date
                                )}
                            </small>

                        </div>
                    `
                    )
                    .join("")
                : `
                    <div class="empty-state">

                        <h3>
                            No Reviews
                        </h3>

                        <p>
                            Your submitted reviews will appear here.
                        </p>

                    </div>
                `;
    }


    // =================================================
    // NOTIFICATIONS
    // =================================================

    function renderNotifications() {

        const container =
            document.getElementById(
                "notificationsList"
            );


        if (!container) {
            return;
        }


        container.innerHTML =
            notifications.length
                ? notifications
                    .map(
                        notification => `

                        <div class="notification-item">

                            <strong>
                                ${escapeHTML(
                                    notification.title
                                )}
                            </strong>

                            <p>
                                ${escapeHTML(
                                    notification.message
                                )}
                            </p>

                            <small>
                                ${escapeHTML(
                                    notification.time
                                )}
                            </small>

                        </div>
                    `
                    )
                    .join("")
                : `
                    <div class="empty-state">

                        <h3>
                            No Notifications
                        </h3>

                        <p>
                            You're all caught up.
                        </p>

                    </div>
                `;
    }


    document
        .getElementById(
            "markNotificationsRead"
        )
        ?.addEventListener(
            "click",
            () => {

                notifications =
                    notifications.map(
                        notification => ({
                            ...notification,
                            unread: false
                        })
                    );


                saveData();

                renderNotifications();


                showToast(
                    "All notifications marked as read."
                );
            }
        );


    // =================================================
    // SUPPORT
    // =================================================

    function renderSupport() {

        const container =
            document.getElementById(
                "supportList"
            );


        if (!container) {
            return;
        }


        container.innerHTML =
            tickets.length
                ? tickets
                    .map(
                        ticket => `

                        <div class="ticket-card">

                            <h3>
                                ${escapeHTML(
                                    ticket.subject
                                )}
                            </h3>

                            <p>
                                ${escapeHTML(
                                    ticket.description
                                )}
                            </p>

                            <span>
                                Ticket:
                                ${escapeHTML(
                                    ticket.id
                                )}
                            </span>

                            <strong>
                                ${escapeHTML(
                                    ticket.status
                                )}
                            </strong>

                        </div>
                    `
                    )
                    .join("")
                : `
                    <div class="empty-state">

                        <h3>
                            No Support Tickets
                        </h3>

                        <p>
                            Create a ticket if you need help.
                        </p>

                    </div>
                `;
    }


    document
        .getElementById(
            "createTicketButton"
        )
        ?.addEventListener(
            "click",
            () => {

                openModal(`

                    <div class="modal-header">

                        <h2>
                            Create Support Ticket
                        </h2>

                        <button
                            type="button"
                            data-close-modal
                        >
                            ×
                        </button>

                    </div>


                    <form
                        id="ticketForm"
                        class="modal-body"
                    >

                        <div class="form-group">

                            <label>
                                Category
                            </label>

                            <select
                                id="ticketCategory"
                                required
                            >

                                <option value="">
                                    Select Category
                                </option>

                                <option value="Booking">
                                    Booking
                                </option>

                                <option value="Payment">
                                    Payment
                                </option>

                                <option value="Account">
                                    Account
                                </option>

                                <option value="Other">
                                    Other
                                </option>

                            </select>

                        </div>


                        <div class="form-group">

                            <label>
                                Subject
                            </label>

                            <input
                                type="text"
                                id="ticketSubject"
                                required
                            >

                        </div>


                        <div class="form-group">

                            <label>
                                Description
                            </label>

                            <textarea
                                id="ticketDescription"
                                required
                            ></textarea>

                        </div>


                        <button
                            type="submit"
                            class="primary-btn"
                        >
                            Create Ticket
                        </button>

                    </form>
                `);


                document
                    .getElementById(
                        "ticketForm"
                    )
                    ?.addEventListener(
                        "submit",
                        event => {

                            event.preventDefault();


                            const ticket = {

                                id:
                                    "TKT" +
                                    Date.now(),

                                category:
                                    document
                                        .getElementById(
                                            "ticketCategory"
                                        )
                                        .value,

                                subject:
                                    document
                                        .getElementById(
                                            "ticketSubject"
                                        )
                                        .value.trim(),

                                description:
                                    document
                                        .getElementById(
                                            "ticketDescription"
                                        )
                                        .value.trim(),

                                status:
                                    "Open",

                                date:
                                    new Date()
                                        .toISOString()
                                        .split("T")[0]
                            };


                            tickets.unshift(
                                ticket
                            );


                            saveData();

                            closeModal();

                            renderSupport();


                            showToast(
                                "Support ticket created."
                            );
                        }
                    );
            }
        );


    // =================================================
    // PROFILE
    // =================================================

    function renderProfile() {

        const name =
            document.getElementById(
                "profileName"
            );

        const email =
            document.getElementById(
                "profileEmail"
            );

        const phone =
            document.getElementById(
                "profilePhone"
            );

        const location =
            document.getElementById(
                "profileLocation"
            );


        if (name) {
            name.value =
                user.name || "";
        }

        if (email) {
            email.value =
                user.email || "";
        }

        if (phone) {
            phone.value =
                user.phone || "";
        }

        if (location) {
            location.value =
                user.location || "";
        }
    }


    // IMPORTANT:
    // Event delegation is used here so the profile
    // form also works if its HTML is dynamically loaded.

    document.addEventListener(
        "submit",
        event => {

            if (
                !event.target.matches(
                    "#profileForm"
                )
            ) {
                return;
            }


            event.preventDefault();


            const name =
                document.getElementById(
                    "profileName"
                );

            const email =
                document.getElementById(
                    "profileEmail"
                );

            const phone =
                document.getElementById(
                    "profilePhone"
                );

            const location =
                document.getElementById(
                    "profileLocation"
                );


            user.name =
                name?.value.trim() ||
                user.name;

            user.email =
                email?.value.trim() ||
                "";

            user.phone =
                phone?.value.trim() ||
                "";

            user.location =
                location?.value.trim() ||
                "";


            saveData();

            updateUserDisplay();

            showToast(
                "Profile updated successfully."
            );
        }
    );


    // =================================================
    // SETTINGS
    // =================================================

    const themeSetting =
        document.getElementById(
            "themeSetting"
        );


    if (themeSetting) {

        const savedTheme =
            localStorage.getItem(
                "skilliant_theme"
            ) || "light";


        themeSetting.value =
            savedTheme;


        document.body.dataset.theme =
            savedTheme;


        themeSetting.addEventListener(
            "change",
            () => {

                document.body.dataset.theme =
                    themeSetting.value;


                localStorage.setItem(
                    "skilliant_theme",
                    themeSetting.value
                );


                showToast(
                    "Theme updated."
                );
            }
        );
    }


    // =================================================
    // CHANGE PASSWORD
    // =================================================

    document
        .getElementById(
            "changePasswordButton"
        )
        ?.addEventListener(
            "click",
            () => {

                openModal(`

                    <div class="modal-header">

                        <h2>
                            Change Password
                        </h2>

                        <button
                            type="button"
                            data-close-modal
                        >
                            ×
                        </button>

                    </div>


                    <form
                        id="passwordForm"
                        class="modal-body"
                    >

                        <div class="form-group">

                            <label>
                                Current Password
                            </label>

                            <input
                                type="password"
                                id="currentPassword"
                                required
                            >

                        </div>


                        <div class="form-group">

                            <label>
                                New Password
                            </label>

                            <input
                                type="password"
                                id="newPassword"
                                required
                            >

                        </div>


                        <div class="form-group">

                            <label>
                                Confirm Password
                            </label>

                            <input
                                type="password"
                                id="confirmPassword"
                                required
                            >

                        </div>


                        <button
                            type="submit"
                            class="primary-btn"
                        >
                            Change Password
                        </button>

                    </form>
                `);


                document
                    .getElementById(
                        "passwordForm"
                    )
                    ?.addEventListener(
                        "submit",
                        event => {

                            event.preventDefault();


                            const newPassword =
                                document
                                    .getElementById(
                                        "newPassword"
                                    )
                                    .value;


                            const confirmPassword =
                                document
                                    .getElementById(
                                        "confirmPassword"
                                    )
                                    .value;


                            if (
                                newPassword.length <
                                6
                            ) {

                                showToast(
                                    "Password must contain at least 6 characters.",
                                    "error"
                                );

                                return;
                            }


                            if (
                                newPassword !==
                                confirmPassword
                            ) {

                                showToast(
                                    "Passwords do not match.",
                                    "error"
                                );

                                return;
                            }


                            closeModal();


                            showToast(
                                "Password changed successfully."
                            );
                        }
                    );
            }
        );


    // =================================================
    // LOGOUT
    // =================================================

    document
        .getElementById(
            "logoutButton"
        )
        ?.addEventListener(
            "click",
            () => {

                const confirmed =
                    confirm(
                        "Are you sure you want to logout?"
                    );


                if (confirmed) {

                    showToast(
                        "Logged out successfully."
                    );
                }
            }
        );


    // =================================================
    // CHANGE PHOTO
    // =================================================

    document
        .getElementById(
            "changePhotoButton"
        )
        ?.addEventListener(
            "click",
            () => {

                showToast(
                    "Profile photo feature is ready for integration."
                );
            }
        );


    // =================================================
    // VIEW LABOUR PROFILE
    // =================================================

    function viewLabourProfile(id) {

        const labour =
            labourers.find(
                item =>
                    Number(item.id) ===
                    Number(id)
            );


        if (!labour) {
            return;
        }


        openModal(`

            <div class="modal-header">

                <h2>
                    Labour Profile
                </h2>

                <button
                    type="button"
                    data-close-modal
                >
                    ×
                </button>

            </div>


            <div class="modal-body">

                <div class="labour-image">

                    <img
                        src="${escapeHTML(
                            labour.image
                        )}"
                        alt="${escapeHTML(
                            labour.name
                        )}"
                    >

                </div>


                <h2>
                    ${escapeHTML(
                        labour.name
                    )}
                </h2>

                <p>
                    <strong>
                        Skill:
                    </strong>
                    ${escapeHTML(
                        labour.skill
                    )}
                </p>

                <p>
                    <strong>
                        Location:
                    </strong>
                    ${escapeHTML(
                        labour.location
                    )}
                </p>

                <p>
                    <strong>
                        Experience:
                    </strong>
                    ${escapeHTML(
                        labour.experience
                    )}
                </p>

                <p>
                    <strong>
                        Rating:
                    </strong>
                    ⭐ ${labour.rating}
                </p>

                <p>
                    <strong>
                        Price:
                    </strong>
                    ${formatCurrency(
                        labour.price
                    )}
                    / service
                </p>

                <p>
                    <strong>
                        Availability:
                    </strong>
                    ${escapeHTML(
                        labour.availability
                    )}
                </p>


                <div class="modal-footer">

                    <button
                        type="button"
                        class="secondary-btn"
                        data-close-modal
                    >
                        Close
                    </button>

                    <button
                        type="button"
                        class="primary-btn"
                        data-book-labour="${labour.id}"
                    >
                        Book Now
                    </button>

                </div>

            </div>
        `);
    }


    // =================================================
    // GLOBAL CLICK EVENTS
    // =================================================

    document.addEventListener(
        "click",
        event => {

            // Close modal
            if (
                event.target.closest(
                    "[data-close-modal]"
                )
            ) {

                closeModal();

                return;
            }


            // Favourite
            const favouriteButton =
                event.target.closest(
                    "[data-favourite-id]"
                );


            if (favouriteButton) {

                toggleFavourite(
                    favouriteButton.dataset
                        .favouriteId
                );

                return;
            }


            // View Labour Profile
            const viewButton =
                event.target.closest(
                    "[data-view-labour]"
                );


            if (viewButton) {

                viewLabourProfile(
                    viewButton.dataset
                        .viewLabour
                );

                return;
            }


            // Book Labour
            const bookButton =
                event.target.closest(
                    "[data-book-labour]"
                );


            if (bookButton) {

                openBookingModal(
                    bookButton.dataset
                        .bookLabour
                );

                return;
            }


            // Cancel Booking
            const cancelButton =
                event.target.closest(
                    "[data-cancel-booking]"
                );


            if (cancelButton) {

                cancelBooking(
                    cancelButton.dataset
                        .cancelBooking
                );

                return;
            }


            // Delete Address
            const deleteAddress =
                event.target.closest(
                    "[data-delete-address]"
                );


            if (deleteAddress) {

                const id =
                    Number(
                        deleteAddress.dataset
                            .deleteAddress
                    );


                const confirmed =
                    confirm(
                        "Delete this address?"
                    );


                if (!confirmed) {
                    return;
                }


                addresses =
                    addresses.filter(
                        address =>
                            Number(
                                address.id
                            ) !== id
                    );


                saveData();

                renderAddresses();


                showToast(
                    "Address deleted."
                );

                return;
            }


            // Edit Address
            const editAddress =
                event.target.closest(
                    "[data-edit-address]"
                );


            if (editAddress) {

                const id =
                    Number(
                        editAddress.dataset
                            .editAddress
                    );


                const address =
                    addresses.find(
                        item =>
                            Number(
                                item.id
                            ) === id
                    );


                if (address) {

                    openAddressModal(
                        address
                    );
                }

                return;
            }
        }
    );


    // =================================================
    // CLOSE MODAL OUTSIDE CLICK
    // =================================================

    modalOverlay?.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                modalOverlay
            ) {

                closeModal();
            }
        }
    );


    // =================================================
    // RENDER CURRENT SECTION
    // =================================================

    function renderSection(
        section
    ) {

        switch (section) {

            case "dashboard":
                renderDashboard();
                break;

            case "search":
                renderLabourers();
                break;

            case "bookings":
                renderBookings();
                break;

            case "favourites":
                renderFavourites();
                break;

            case "wallet":
                renderWallet();
                break;

            case "payments":
                renderPayments();
                break;

            case "addresses":
                renderAddresses();
                break;

            case "reviews":
                renderReviews();
                break;

            case "notifications":
                renderNotifications();
                break;

            case "support":
                renderSupport();
                break;

            case "profile":
                renderProfile();
                break;

            case "settings":
                break;

            default:
                renderDashboard();
        }
    }


    // =================================================
    // INITIAL DISPLAY
    // =================================================

    updateUserDisplay();

    renderDashboard();

    renderLabourers();

    renderBookings();

    renderWallet();

    renderPayments();

    renderAddresses();

    renderFavourites();

    renderReviews();

    renderNotifications();

    renderSupport();

    renderProfile();


    // =================================================
    // DEFAULT PAGE
    // =================================================

    navigateTo("dashboard");


    console.log(
        "Skilliant User Portal loaded successfully."
    );

});