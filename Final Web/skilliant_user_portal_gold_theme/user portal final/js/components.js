/* =========================================================
   SKILLIANT USER PORTAL
   Reusable UI Components
   ========================================================= */


/* =========================================================
   1. HELPER FUNCTIONS
   ========================================================= */

function escapeHTML(value) {
    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function getInitials(name) {
    if (!name) {
        return "U";
    }

    return name
        .split(" ")
        .map(word => word.charAt(0))
        .join("")
        .substring(0, 2)
        .toUpperCase();
}


function formatDate(dateString) {
    if (!dateString) {
        return "-";
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
        return dateString;
    }

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}


function formatCurrency(amount) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(Number(amount) || 0);
}


/* =========================================================
   2. STATUS BADGE
   ========================================================= */

function getStatusBadge(status) {

    const statusMap = {
        Pending: "pending",
        Confirmed: "confirmed",
        Active: "active",
        Completed: "completed",
        Cancelled: "cancelled",
        Open: "open",
        "In Progress": "progress",
        Resolved: "resolved",
        Success: "completed"
    };

    const statusClass =
        statusMap[status] || "pending";

    return `
        <span class="status-badge ${statusClass}">
            ${escapeHTML(status)}
        </span>
    `;
}


/* =========================================================
   3. LABOUR CARD
   ========================================================= */

function createLabourCard(labour, favouriteIds = []) {

    const isFavourite =
        favouriteIds.includes(labour.id);

    const imageHTML = labour.image
        ? `
            <img
                class="labour-image"
                src="${escapeHTML(labour.image)}"
                alt="${escapeHTML(labour.name)}"
            >
        `
        : `
            <div class="labour-placeholder">
                ${getInitials(labour.name)}
            </div>
        `;

    const availabilityClass =
        labour.availability === "Busy"
            ? "busy"
            : "";

    return `
        <article class="labour-card">

            <div class="labour-card-top">

                <span class="availability-badge ${availabilityClass}">
                    ${escapeHTML(labour.availability)}
                </span>

                <button
                    class="favourite-btn ${isFavourite ? "active" : ""}"
                    data-favourite-id="${labour.id}"
                    aria-label="Favourite ${escapeHTML(labour.name)}"
                    title="Add to favourites"
                >
                    ${isFavourite ? "♥" : "♡"}
                </button>

                ${imageHTML}

            </div>

            <div class="labour-card-body">

                <div class="labour-name-row">

                    <h3 class="labour-name">
                        ${escapeHTML(labour.name)}
                    </h3>

                    <span class="labour-rating">
                        ★ ${Number(labour.rating).toFixed(1)}
                    </span>

                </div>

                <p class="labour-skill">
                    ${escapeHTML(labour.skill)}
                </p>

                <div class="labour-meta">

                    <span>
                        📍 ${escapeHTML(labour.location)}
                    </span>

                    <span>
                        🛠 ${escapeHTML(labour.experience)}
                    </span>

                    <span>
                        ⭐ ${labour.reviews} Reviews
                    </span>

                    <span>
                        ${labour.availability === "Available"
                            ? "✓ Available"
                            : "⏳ Busy"}
                    </span>

                </div>

                <div class="labour-price">

                    <div>
                        <strong>
                            ${formatCurrency(labour.price)}
                        </strong>

                        <span>
                            / service
                        </span>
                    </div>

                </div>

                <div class="labour-actions">

                    <button
                        class="secondary-btn"
                        data-view-labour="${labour.id}"
                    >
                        View Profile
                    </button>

                    <button
                        class="primary-btn"
                        data-book-labour="${labour.id}"
                        ${labour.availability === "Busy"
                            ? "disabled"
                            : ""}
                    >
                        Book Now
                    </button>

                </div>

            </div>

        </article>
    `;
}


/* =========================================================
   4. BOOKING ITEM
   ========================================================= */

function createBookingItem(booking) {

    return `
        <div class="booking-item">

            <div class="booking-avatar">
                ${getInitials(booking.labourName)}
            </div>

            <div class="booking-info">

                <strong>
                    ${escapeHTML(booking.labourName)}
                </strong>

                <span>
                    ${escapeHTML(booking.service)}
                    • ${formatDate(booking.date)}
                </span>

            </div>

            <div>
                ${getStatusBadge(booking.status)}
            </div>

            <div class="booking-price">
                ${formatCurrency(booking.amount)}
            </div>

        </div>
    `;
}


/* =========================================================
   5. FULL BOOKING CARD
   ========================================================= */

function createFullBookingCard(booking) {

    const canCancel =
        booking.status === "Pending" ||
        booking.status === "Confirmed";

    return `
        <article class="full-booking-card">

            <div class="full-booking-header">

                <div class="full-booking-info">

                    <div class="booking-avatar">
                        ${getInitials(booking.labourName)}
                    </div>

                    <div>

                        <h3>
                            ${escapeHTML(booking.labourName)}
                        </h3>

                        <p>
                            ${escapeHTML(booking.skill)}
                            • Booking #${escapeHTML(booking.id)}
                        </p>

                    </div>

                </div>

                ${getStatusBadge(booking.status)}

            </div>


            <div class="full-booking-details">

                <div class="detail-item">

                    <span>Service</span>

                    <strong>
                        ${escapeHTML(booking.service)}
                    </strong>

                </div>


                <div class="detail-item">

                    <span>Date</span>

                    <strong>
                        ${formatDate(booking.date)}
                    </strong>

                </div>


                <div class="detail-item">

                    <span>Time</span>

                    <strong>
                        ${escapeHTML(booking.time)}
                    </strong>

                </div>


                <div class="detail-item">

                    <span>Amount</span>

                    <strong>
                        ${formatCurrency(booking.amount)}
                    </strong>

                </div>


                <div class="detail-item">

                    <span>Address</span>

                    <strong>
                        ${escapeHTML(booking.address)}
                    </strong>

                </div>

            </div>


            <div class="full-booking-actions">

                <button
                    class="secondary-btn"
                    data-booking-details="${escapeHTML(booking.id)}"
                >
                    View Details
                </button>

                ${
                    canCancel
                        ? `
                            <button
                                class="danger-btn"
                                data-cancel-booking="${escapeHTML(booking.id)}"
                            >
                                Cancel Booking
                            </button>
                        `
                        : ""
                }

            </div>

        </article>
    `;
}


/* =========================================================
   6. NOTIFICATION ITEM
   ========================================================= */

function createNotificationItem(notification) {

    const icons = {
        booking: "📅",
        reminder: "⏰",
        payment: "💳",
        system: "ℹ",
        review: "⭐"
    };

    const icon =
        icons[notification.type] || "🔔";

    return `
        <div
            class="notification-item ${
                notification.unread ? "unread" : ""
            }"
            data-notification-id="${notification.id}"
        >

            <div class="notification-icon">
                ${icon}
            </div>

            <div class="notification-content">

                <h3>
                    ${escapeHTML(notification.title)}
                </h3>

                <p>
                    ${escapeHTML(notification.message)}
                </p>

                <div class="notification-time">
                    ${escapeHTML(notification.time)}
                </div>

            </div>

        </div>
    `;
}


/* =========================================================
   7. TRANSACTION ITEM
   ========================================================= */

function createTransactionItem(transaction) {

    const isCredit =
        transaction.type === "credit";

    return `
        <div class="booking-item">

            <div class="booking-avatar">
                ${isCredit ? "↓" : "↑"}
            </div>

            <div class="booking-info">

                <strong>
                    ${escapeHTML(transaction.service)}
                </strong>

                <span>
                    ${formatDate(transaction.date)}
                    • ${escapeHTML(transaction.method)}
                </span>

            </div>

            <div>
                ${getStatusBadge(transaction.status)}
            </div>

            <div
                class="booking-price"
                style="color: ${
                    isCredit
                        ? "var(--green)"
                        : "var(--red)"
                };"
            >
                ${isCredit ? "+" : "-"}
                ${formatCurrency(transaction.amount)}
            </div>

        </div>
    `;
}


/* =========================================================
   8. ADDRESS CARD
   ========================================================= */

function createAddressCard(address) {

    const iconMap = {
        Home: "⌂",
        Work: "▣",
        Other: "⌖"
    };

    const icon =
        iconMap[address.type] || "⌖";

    return `
        <article class="address-card">

            ${
                address.isDefault
                    ? `
                        <span class="default-label">
                            Default
                        </span>
                    `
                    : ""
            }

            <div class="address-icon">
                ${icon}
            </div>

            <h3>
                ${escapeHTML(address.type)}
            </h3>

            <p>
                ${escapeHTML(address.address)}
            </p>

            <div class="address-actions">

                <button
                    class="secondary-btn"
                    data-edit-address="${address.id}"
                >
                    Edit
                </button>

                <button
                    class="danger-btn"
                    data-delete-address="${address.id}"
                >
                    Delete
                </button>

                ${
                    !address.isDefault
                        ? `
                            <button
                                class="text-btn"
                                data-default-address="${address.id}"
                            >
                                Set Default
                            </button>
                        `
                        : ""
                }

            </div>

        </article>
    `;
}


/* =========================================================
   9. REVIEW CARD
   ========================================================= */

function createReviewCard(review) {

    const stars =
        "★".repeat(review.rating) +
        "☆".repeat(5 - review.rating);

    return `
        <article class="review-card">

            <div class="review-header">

                <div class="review-user">

                    <div class="booking-avatar">
                        ${getInitials(review.labourName)}
                    </div>

                    <div>

                        <h3>
                            ${escapeHTML(review.labourName)}
                        </h3>

                        <p>
                            ${escapeHTML(review.skill)}
                            • ${formatDate(review.date)}
                        </p>

                    </div>

                </div>

                <div class="stars">
                    ${stars}
                </div>

            </div>


            <p class="review-text">
                ${escapeHTML(review.review)}
            </p>


            <div class="review-actions">

                <button
                    class="secondary-btn"
                    data-edit-review="${review.id}"
                >
                    Edit Review
                </button>

            </div>

        </article>
    `;
}


/* =========================================================
   10. SUPPORT TICKET
   ========================================================= */

function createTicketCard(ticket) {

    return `
        <article class="ticket-card">

            <div class="ticket-header">

                <div>

                    <span class="ticket-id">
                        ${escapeHTML(ticket.id)}
                    </span>

                    <h3>
                        ${escapeHTML(ticket.subject)}
                    </h3>

                </div>

                ${getStatusBadge(ticket.status)}

            </div>


            <p>
                ${escapeHTML(ticket.description)}
            </p>


            <div class="ticket-footer">

                <span class="ticket-date">
                    ${escapeHTML(ticket.category)}
                    • ${formatDate(ticket.date)}
                </span>

                <button
                    class="text-btn"
                    data-view-ticket="${escapeHTML(ticket.id)}"
                >
                    View Ticket
                </button>

            </div>

        </article>
    `;
}


/* =========================================================
   11. EMPTY STATE
   ========================================================= */

function createEmptyState(
    icon = "📭",
    title = "Nothing here yet",
    message = "There is no data to display."
) {

    return `
        <div class="empty-state">

            <div class="empty-state-icon">
                ${icon}
            </div>

            <h3>
                ${escapeHTML(title)}
            </h3>

            <p>
                ${escapeHTML(message)}
            </p>

        </div>
    `;
}


/* =========================================================
   12. MODAL HELPER
   ========================================================= */

function openModal(content) {

    const overlay =
        document.getElementById("modalOverlay");

    const modal =
        document.getElementById("modalContent");

    if (!overlay || !modal) {
        return;
    }

    modal.innerHTML = content;

    overlay.classList.add("active");

    document.body.style.overflow = "hidden";
}


function closeModal() {

    const overlay =
        document.getElementById("modalOverlay");

    const modal =
        document.getElementById("modalContent");

    if (!overlay || !modal) {
        return;
    }

    overlay.classList.remove("active");

    modal.innerHTML = "";

    document.body.style.overflow = "";
}


/* =========================================================
   13. MODAL HEADER
   ========================================================= */

function createModalHeader(title) {

    return `
        <div class="modal-header">

            <h2>
                ${escapeHTML(title)}
            </h2>

            <button
                class="modal-close"
                data-close-modal
                aria-label="Close modal"
            >
                ×
            </button>

        </div>
    `;
}


/* =========================================================
   14. TOAST
   ========================================================= */

let toastTimer;

function showToast(
    message,
    type = "success"
) {

    const toast =
        document.getElementById("toast");

    const toastMessage =
        document.getElementById("toastMessage");

    if (!toast || !toastMessage) {
        return;
    }

    toastMessage.textContent = message;

    if (type === "error") {
        toast.style.background = "var(--red)";
    } else if (type === "warning") {
        toast.style.background = "var(--orange)";
    } else {
        toast.style.background = "#172033";
    }

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);
}


/* =========================================================
   15. RATING COMPONENT
   ========================================================= */

function createRatingInput(
    selectedRating = 0
) {

    return `
        <div
            class="rating-input"
            id="ratingInput"
            style="
                display:flex;
                gap:7px;
                font-size:28px;
            "
        >

            ${[1, 2, 3, 4, 5]
                .map(number => `
                    <button
                        type="button"
                        class="rating-star"
                        data-rating="${number}"
                        style="
                            background:transparent;
                            color:${
                                number <= selectedRating
                                    ? "#f59e0b"
                                    : "#cbd5e1"
                            };
                            font-size:28px;
                            padding:0;
                        "
                    >
                        ★
                    </button>
                `)
                .join("")}

        </div>
    `;
}


/* =========================================================
   16. LABOUR PROFILE MODAL
   ========================================================= */

function createLabourProfileModal(labour) {

    return `
        ${createModalHeader("Labour Profile")}

        <div class="modal-body">

            <div
                style="
                    text-align:center;
                    padding:10px 0;
                "
            >

                <div
                    class="labour-placeholder"
                    style="
                        margin:0 auto 12px;
                    "
                >
                    ${getInitials(labour.name)}
                </div>

                <h2>
                    ${escapeHTML(labour.name)}
                </h2>

                <p
                    style="
                        color:var(--primary);
                        margin-top:5px;
                    "
                >
                    ${escapeHTML(labour.skill)}
                </p>

            </div>


            <div class="full-booking-details">

                <div class="detail-item">

                    <span>Experience</span>

                    <strong>
                        ${escapeHTML(labour.experience)}
                    </strong>

                </div>

                <div class="detail-item">

                    <span>Location</span>

                    <strong>
                        ${escapeHTML(labour.location)}
                    </strong>

                </div>

                <div class="detail-item">

                    <span>Rating</span>

                    <strong>
                        ★ ${labour.rating}
                    </strong>

                </div>

                <div class="detail-item">

                    <span>Reviews</span>

                    <strong>
                        ${labour.reviews}
                    </strong>

                </div>

            </div>


            <p
                style="
                    font-size:13px;
                    line-height:1.7;
                    color:var(--text);
                "
            >
                ${escapeHTML(labour.description)}
            </p>


            <div
                style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    padding-top:15px;
                    border-top:1px solid var(--border);
                "
            >

                <strong style="font-size:20px;">
                    ${formatCurrency(labour.price)}
                    <small
                        style="
                            font-size:11px;
                            color:var(--text-light);
                        "
                    >
                        / service
                    </small>
                </strong>

                ${getStatusBadge(labour.availability)}

            </div>

        </div>


        <div class="modal-footer">

            <button
                class="secondary-btn"
                data-close-modal
            >
                Close
            </button>

            <button
                class="primary-btn"
                data-modal-book-labour="${labour.id}"
                ${
                    labour.availability === "Busy"
                        ? "disabled"
                        : ""
                }
            >
                Book Now
            </button>

        </div>
    `;
}


/* =========================================================
   17. BOOKING FORM MODAL
   ========================================================= */

function createBookingFormModal(
    labour,
    addresses = [],
    existingBooking = null
) {

    const selectedAddress =
        addresses.find(address => address.isDefault);

    const addressOptions =
        addresses.length
            ? addresses.map(address => `
                <option
                    value="${address.id}"
                    ${
                        selectedAddress &&
                        address.id === selectedAddress.id
                            ? "selected"
                            : ""
                    }
                >
                    ${escapeHTML(address.type)}
                    - ${escapeHTML(address.address)}
                </option>
            `).join("")
            : `
                <option value="">
                    No saved address
                </option>
            `;

    const serviceOptions =
        (services[labour.skill] || [
            labour.skill + " Service"
        ])
        .map(service => `
            <option value="${escapeHTML(service)}">
                ${escapeHTML(service)}
            </option>
        `)
        .join("");

    return `
        ${createModalHeader(
            existingBooking
                ? "Edit Booking"
                : "Book Labour"
        )}

        <form
            id="bookingForm"
            class="modal-body"
        >

            <input
                type="hidden"
                id="bookingLabourId"
                value="${labour.id}"
            >

            <div
                style="
                    background:var(--primary-light);
                    padding:14px;
                    border-radius:10px;
                "
            >

                <strong>
                    ${escapeHTML(labour.name)}
                </strong>

                <p
                    style="
                        font-size:11px;
                        color:var(--text);
                        margin-top:4px;
                    "
                >
                    ${escapeHTML(labour.skill)}
                    • ${formatCurrency(labour.price)}
                    / service
                </p>

            </div>


            <div class="form-group">

                <label for="bookingService">
                    Select Service
                </label>

                <select
                    id="bookingService"
                    required
                >
                    ${serviceOptions}
                </select>

            </div>


            <div class="form-group">

                <label for="bookingDate">
                    Select Date
                </label>

                <input
                    type="date"
                    id="bookingDate"
                    min="${new Date().toISOString().split("T")[0]}"
                    required
                >

            </div>


            <div class="form-group">

                <label for="bookingTime">
                    Select Time
                </label>

                <select
                    id="bookingTime"
                    required
                >

                    <option value="">
                        Select time
                    </option>

                    <option value="09:00 AM">
                        09:00 AM
                    </option>

                    <option value="10:00 AM">
                        10:00 AM
                    </option>

                    <option value="11:30 AM">
                        11:30 AM
                    </option>

                    <option value="01:00 PM">
                        01:00 PM
                    </option>

                    <option value="02:00 PM">
                        02:00 PM
                    </option>

                    <option value="04:00 PM">
                        04:00 PM
                    </option>

                    <option value="05:30 PM">
                        05:30 PM
                    </option>

                </select>

            </div>


            <div class="form-group">

                <label for="bookingAddress">
                    Service Address
                </label>

                <select
                    id="bookingAddress"
                    required
                >
                    ${addressOptions}
                </select>

            </div>


            <div class="form-group">

                <label for="bookingRequirements">
                    Additional Requirements
                </label>

                <textarea
                    id="bookingRequirements"
                    placeholder="Add any special instructions..."
                ></textarea>

            </div>


            <div
                style="
                    display:flex;
                    justify-content:space-between;
                    padding:14px;
                    background:#f8fafc;
                    border-radius:10px;
                "
            >

                <span>
                    Estimated Price
                </span>

                <strong>
                    ${formatCurrency(labour.price)}
                </strong>

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
    `;
}


/* =========================================================
   18. CONFIRMATION MODAL
   ========================================================= */

function createConfirmationModal(
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    action = ""
) {

    return `
        ${createModalHeader(title)}

        <div
            class="modal-body"
            style="text-align:center;"
        >

            <div
                style="
                    width:65px;
                    height:65px;
                    margin:5px auto 15px;
                    border-radius:50%;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    background:var(--primary-light);
                    color:var(--primary);
                    font-size:28px;
                "
            >
                ?
            </div>

            <p
                style="
                    color:var(--text);
                    font-size:13px;
                    line-height:1.6;
                "
            >
                ${escapeHTML(message)}
            </p>

        </div>


        <div class="modal-footer">

            <button
                class="secondary-btn"
                data-close-modal
            >
                ${escapeHTML(cancelText)}
            </button>

            <button
                class="primary-btn"
                data-confirm-action="${escapeHTML(action)}"
            >
                ${escapeHTML(confirmText)}
            </button>

        </div>
    `;
}


/* =========================================================
   END OF COMPONENTS.JS
   ========================================================= */