/* =========================================================
   SKILLIANT LABOUR PORTAL
   app.js
   CLEAN MASTER VERSION
========================================================= */


/* =========================================================
   BASIC HELPERS
========================================================= */

function getElement(id) {
    return document.getElementById(id);
}


/* =========================================================
   PAGE NAVIGATION
========================================================= */

function showPage(pageId, clickedItem) {

    const pages =
        document.querySelectorAll(".page");

    const menuItems =
        document.querySelectorAll(".menu li");


    pages.forEach(function(page) {

        page.classList.remove("active-page");
        page.classList.remove("active");

        page.style.display = "none";

    });


    const selectedPage =
        document.getElementById(pageId);


    if (!selectedPage) {

        console.error(
            "Page not found:",
            pageId
        );

        return;

    }


    selectedPage.classList.add(
        "active-page"
    );

    selectedPage.style.display = "block";


    menuItems.forEach(function(item) {

        item.classList.remove("active");

    });


    if (clickedItem) {

        clickedItem.classList.add("active");

    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================================
   DEFAULT PAGE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const pages =
            document.querySelectorAll(".page");

        const menuItems =
            document.querySelectorAll(".menu li");


        pages.forEach(function(page) {

            page.style.display = "none";

        });


        const dashboard =
            document.getElementById("dashboard");


        if (dashboard) {

            dashboard.style.display = "block";

            dashboard.classList.add(
                "active-page"
            );

        }


        if (menuItems.length > 0) {

            menuItems[0].classList.add(
                "active"
            );

        }

    }
);


/* =========================================================
   GREETING
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const greeting =
            document.getElementById("greeting");


        if (!greeting) return;


        const hour =
            new Date().getHours();


        if (hour < 12) {

            greeting.innerHTML =
                "Good Morning, Rahul 👋";

        } else if (hour < 17) {

            greeting.innerHTML =
                "Good Afternoon, Rahul ☀️";

        } else {

            greeting.innerHTML =
                "Good Evening, Rahul 🌙";

        }

    }
);


/* =========================================================
   COUNTER ANIMATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const counters =
            document.querySelectorAll(
                ".counter"
            );


        counters.forEach(function(counter) {

            const target =
                Number(
                    counter.innerText
                );


            let count = 0;


            const speed =
                Math.max(
                    1,
                    target / 80
                );


            function update() {

                count += speed;


                if (count < target) {

                    counter.innerText =
                        Math.ceil(count);

                    requestAnimationFrame(
                        update
                    );

                } else {

                    counter.innerText =
                        target;

                }

            }


            update();

        });

    }
);





/* =========================================================
   PROFILE IMAGE EFFECT
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const profileImage =
            document.querySelector(
                ".profile img"
            );


        if (!profileImage) return;


        profileImage.addEventListener(
            "mouseenter",
            function() {

                profileImage.style.transform =
                    "scale(1.08)";

            }
        );


        profileImage.addEventListener(
            "mouseleave",
            function() {

                profileImage.style.transform =
                    "scale(1)";

            }
        );

    }
);


/* =========================================================
   MODALS
========================================================= */

function openModal(id) {

    const modal =
        document.getElementById(id);


    if (!modal) return;


    modal.classList.add("active");

    modal.style.display = "flex";

}


function closeModal(id) {

    const modal =
        document.getElementById(id);


    if (!modal) return;


    modal.classList.remove("active");

    modal.style.display = "none";

}


/* =========================================================
   JOB DETAILS MODAL
========================================================= */

function openDetailsModal() {
    openModal("detailsModal");
}


function closeDetailsModal() {
    closeModal("detailsModal");
}


/* =========================================================
   ACCEPT MODAL
========================================================= */

function openAcceptModal() {
    openModal("acceptModal");
}


function closeAcceptModal() {
    closeModal("acceptModal");
}


/* =========================================================
   REJECT MODAL
========================================================= */

function openRejectModal() {
    openModal("rejectModal");
}


function closeRejectModal() {
    closeModal("rejectModal");
}


/* =========================================================
   LOGOUT MODAL
========================================================= */

function openLogoutModal() {
    openModal("logoutModal");
}


function closeLogoutModal() {
    closeModal("logoutModal");
}


/* =========================================================
   JOB ACTIONS
========================================================= */

function acceptJob() {
    if (typeof window.day3ConfirmAccept === "function") {
        window.day3ConfirmAccept();
        return;
    }
    closeAcceptModal();
    showToast("Job Accepted Successfully ✅", "success");
}


function rejectJob() {
    if (typeof window.day3ConfirmReject === "function") {
        window.day3ConfirmReject();
        return;
    }
    closeRejectModal();
    showToast("Job Rejected ❌", "error");
}


/* =========================================================
   OUTSIDE MODAL CLICK
========================================================= */

document.addEventListener(
    "click",
    function(event) {

        const modals =
            document.querySelectorAll(
                ".modal"
            );


        modals.forEach(function(modal) {

            if (
                event.target === modal
            ) {

                modal.classList.remove(
                    "active"
                );

                modal.style.display =
                    "none";

            }

        });

    }
);


/* =========================================================
   ESC KEY
========================================================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key !== "Escape") {
            return;
        }


        document
            .querySelectorAll(".modal")
            .forEach(function(modal) {

                modal.classList.remove(
                    "active"
                );

                modal.style.display =
                    "none";

            });


        const dropdown =
            document.getElementById(
                "profileDropdown"
            );


        if (dropdown) {

            dropdown.classList.remove(
                "show"
            );

            dropdown.style.display =
                "none";

        }

    }
);


/* =========================================================
   PROFILE DROPDOWN
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const profile =
            document.querySelector(
                ".profile"
            );


        const profileDropdown =
            document.getElementById(
                "profileDropdown"
            );


        if (
            !profile ||
            !profileDropdown
        ) {

            return;

        }


        profile.addEventListener(
            "click",
            function(event) {

                event.stopPropagation();


                profileDropdown.classList.toggle(
                    "show"
                );


                if (
                    profileDropdown.classList.contains(
                        "show"
                    )
                ) {

                    profileDropdown.style.display =
                        "block";

                } else {

                    profileDropdown.style.display =
                        "none";

                }

            }
        );


        document.addEventListener(
            "click",
            function() {

                profileDropdown.classList.remove(
                    "show"
                );

                profileDropdown.style.display =
                    "none";

            }
        );

    }
);


/* =========================================================
   TOAST
========================================================= */

function showToast(message, type) {

    const toast =
        document.createElement("div");


    toast.className =
        "toast";


    toast.innerHTML =
        message;


    if (type === "success") {

        toast.style.background =
            "#22C55E";

    } else {

        toast.style.background =
            "#EF4444";

    }


    document.body.appendChild(
        toast
    );


    setTimeout(function() {

        toast.classList.add(
            "show"
        );

    }, 100);


    setTimeout(function() {

        toast.classList.remove(
            "show"
        );


        setTimeout(function() {

            toast.remove();

        }, 300);

    }, 2500);

}


/* =========================================================
   SEARCH JOBS
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const searchInput =
            document.querySelector(
                ".search-box input"
            );


        if (!searchInput) return;


        searchInput.addEventListener(
            "keyup",
            function() {

                const value =
                    this.value.toLowerCase();


                const cards =
                    document.querySelectorAll(
                        ".job-card, .request-card"
                    );


                cards.forEach(function(card) {

                    const text =
                        card.innerText
                            .toLowerCase();


                    card.style.display =
                        text.includes(value)
                            ? ""
                            : "none";

                });

            }
        );

    }
);


/* =========================================================
   CALENDAR
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const dates =
            document.querySelectorAll(
                ".calendar-grid span"
            );


        dates.forEach(function(date) {

            date.addEventListener(
                "click",
                function() {

                    if (
                        this.innerHTML.trim() === ""
                    ) {

                        return;

                    }


                    dates.forEach(
                        function(d) {

                            d.classList.remove(
                                "selected-date"
                            );

                        }
                    );


                    this.classList.add(
                        "selected-date"
                    );

                }
            );

        });


        const today =
            new Date();


        const currentDay =
            today.getDate();


        dates.forEach(function(date) {

            if (
                date.innerText.trim() ==
                currentDay
            ) {

                date.classList.add(
                    "selected-date"
                );

            }

        });

    }
);


/* =========================================================
   NOTIFICATION BELL
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const bell =
            document.querySelector(
                ".icon"
            );


        if (!bell) return;


        bell.addEventListener(
            "click",
            function() {

                showToast(
                    "🔔 You have 3 new notifications",
                    "success"
                );

            }
        );

    }
);


/* =========================================================
   RIPPLE EFFECT
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const buttons =
            document.querySelectorAll(
                "button"
            );


        buttons.forEach(function(button) {

            button.addEventListener(
                "click",
                function(event) {

                    const ripple =
                        document.createElement(
                            "span"
                        );


                    ripple.className =
                        "ripple";


                    ripple.style.left =
                        event.offsetX + "px";


                    ripple.style.top =
                        event.offsetY + "px";


                    this.appendChild(
                        ripple
                    );


                    setTimeout(
                        function() {

                            ripple.remove();

                        },
                        600
                    );

                }
            );

        });

    }
);


/* =========================================================
   DAY 4 - WALLET
========================================================= */

function openWithdrawModal() {
    openModal("withdrawModal");
}


function closeWithdrawModal() {
    closeModal("withdrawModal");
}


function withdrawMoney() {

    const withdrawInput =
        document.getElementById(
            "withdrawAmount"
        );


    const walletBalance =
        document.getElementById(
            "walletBalance"
        );


    if (
        !withdrawInput ||
        !walletBalance
    ) {

        return;

    }


    const amount =
        parseFloat(
            withdrawInput.value
        );


    if (
        isNaN(amount) ||
        amount <= 0
    ) {

        showToast(
            "Enter a valid amount",
            "error"
        );

        return;

    }


    const currentBalance =
        parseFloat(
            walletBalance.innerText
                .replace("₹", "")
                .replace(/,/g, "")
        );


    if (
        amount > currentBalance
    ) {

        showToast(
            "Insufficient Balance",
            "error"
        );

        return;

    }


    const newBalance =
        currentBalance - amount;


    walletBalance.innerHTML =
        "₹" +
        newBalance.toLocaleString(
            "en-IN"
        );


    addTransaction(amount);


    closeWithdrawModal();


    withdrawInput.value = "";


    showToast(
        "₹" +
        amount +
        " Withdraw Successful",
        "success"
    );

}


function addTransaction(amount) {

    const tbody =
        document.querySelector(
            ".transaction-table tbody"
        );


    if (!tbody) return;


    const row =
        document.createElement("tr");


    const today =
        new Date();


    const date =
        today.getDate() +
        " " +
        today.toLocaleString(
            "default",
            {
                month: "short"
            }
        );


    row.innerHTML = `

        <td>${date}</td>

        <td class="debit">
            Withdraw
        </td>

        <td>
            -₹${amount}
        </td>

        <td>
            Success
        </td>

    `;


    tbody.prepend(row);

}


/* =========================================================
   DAY 4 SUCCESS POPUP
========================================================= */

function showSuccessPopup() {

    const popup =
        document.getElementById(
            "successPopup"
        );


    if (!popup) return;


    popup.classList.add(
        "show"
    );


    setTimeout(function() {

        popup.classList.remove(
            "show"
        );

    }, 2500);

}


/* =========================================================
   PROFILE PAGE
========================================================= */

function openProfilePage() {

    showPage(
        "profilePage"
    );

}


/* =========================================================
   PROFILE EDIT
========================================================= */

function openProfileEditModal() {
    openModal("profileEditModal");
}


function closeProfileEditModal() {
    closeModal("profileEditModal");
}


function saveProfile() {

    const nameInput =
        document.getElementById(
            "profileName"
        );


    const professionInput =
        document.getElementById(
            "profileProfession"
        );


    const locationInput =
        document.getElementById(
            "profileLocation"
        );


    const aboutInput =
        document.getElementById(
            "profileAbout"
        );


    if (
        !nameInput ||
        !professionInput ||
        !locationInput
    ) {

        return;

    }


    const name =
        nameInput.value.trim();


    const profession =
        professionInput.value.trim();


    const location =
        locationInput.value.trim();


    const about =
        aboutInput
            ? aboutInput.value.trim()
            : "";


    if (
        !name ||
        !profession ||
        !location
    ) {

        alert(
            "Please fill all required profile fields."
        );

        return;

    }


    const profileName =
        document.querySelector(
            ".profile-information h2"
        );


    const profileRole =
        document.querySelector(
            ".profile-role"
        );


    const profileLocation =
        document.querySelector(
            ".profile-location"
        );


    const aboutText =
        document.querySelector(
            ".about-text"
        );


    if (profileName) {

        profileName.textContent =
            name;

    }


    if (profileRole) {

        profileRole.innerHTML =
            '<i class="fa-solid fa-bolt"></i> ' +
            profession;

    }


    if (profileLocation) {

        profileLocation.innerHTML =
            '<i class="fa-solid fa-location-dot"></i> ' +
            location;

    }


    if (
        aboutText &&
        about
    ) {

        aboutText.textContent =
            about;

    }


    closeProfileEditModal();


    showDay5Notification(
        "Profile updated successfully!"
    );

}


/* =========================================================
   SKILLS
========================================================= */

function openSkillsModal() {
    openModal("skillsModal");
}


function closeSkillsModal() {
    closeModal("skillsModal");
}


function addSkill() {

    const input =
        document.getElementById(
            "newSkill"
        );


    if (!input) return;


    const skill =
        input.value.trim();


    if (!skill) {

        alert(
            "Please enter a skill."
        );

        input.focus();

        return;

    }


    const container =
        document.querySelector(
            ".skills-container"
        );


    if (!container) return;


    const skillTag =
        document.createElement(
            "span"
        );


    skillTag.className =
        "skill-tag";


    skillTag.innerHTML = `

        <i class="fa-solid fa-circle-check"></i>

        ${skill}

    `;


    container.appendChild(
        skillTag
    );


    input.value = "";


    closeSkillsModal();


    showDay5Notification(
        "New skill added successfully!"
    );

}


/* =========================================================
   EXPERIENCE
========================================================= */

function openExperienceModal() {
    openModal("experienceModal");
}


function closeExperienceModal() {
    closeModal("experienceModal");
}


function addExperience() {

    const title =
        getElement(
            "experienceTitle"
        );


    const company =
        getElement(
            "experienceCompany"
        );


    const duration =
        getElement(
            "experienceDuration"
        );


    const description =
        getElement(
            "experienceDescription"
        );


    if (
        !title ||
        !company ||
        !duration
    ) {

        return;

    }


    if (
        !title.value.trim() ||
        !company.value.trim() ||
        !duration.value.trim()
    ) {

        alert(
            "Please fill Job Title, Company and Duration."
        );

        return;

    }


    const timeline =
        document.querySelector(
            ".experience-timeline"
        );


    if (!timeline) return;


    const item =
        document.createElement(
            "div"
        );


    item.className =
        "experience-item";


    item.innerHTML = `

        <div class="experience-icon">

            <i class="fa-solid fa-briefcase"></i>

        </div>

        <div class="experience-content">

            <div class="experience-heading">

                <div>

                    <h4>
                        ${title.value.trim()}
                    </h4>

                    <p>
                        ${company.value.trim()}
                    </p>

                </div>

                <span>
                    ${duration.value.trim()}
                </span>

            </div>

            <p>
                ${
                    description
                        ? description.value.trim()
                        : "Professional work experience."
                }
            </p>

        </div>

    `;


    timeline.insertBefore(
        item,
        timeline.firstElementChild
    );


    title.value = "";
    company.value = "";
    duration.value = "";


    if (description) {
        description.value = "";
    }


    closeExperienceModal();


    showDay5Notification(
        "Experience added successfully!"
    );

}


/* =========================================================
   CERTIFICATES
========================================================= */

function openCertificateModal() {
    openModal("certificateModal");
}


function closeCertificateModal() {
    closeModal("certificateModal");
}


function addCertificate() {

    const name =
        getElement(
            "certificateName"
        );


    const issuer =
        getElement(
            "certificateIssuer"
        );


    const date =
        getElement(
            "certificateDate"
        );


    const certificateId =
        getElement(
            "certificateId"
        );


    if (
        !name ||
        !issuer ||
        !date
    ) {

        return;

    }


    if (
        !name.value.trim() ||
        !issuer.value.trim() ||
        !date.value
    ) {

        alert(
            "Please fill Certificate Name, Issued By and Issue Date."
        );

        return;

    }


    const grid =
        document.querySelector(
            ".certificate-grid"
        );


    if (!grid) return;


    const parts =
        date.value.split("-");


    const formattedDate =
        new Date(
            Number(parts[0]),
            Number(parts[1]) - 1
        ).toLocaleString(
            "en-US",
            {
                month: "long"
            }
        ) +
        " " +
        parts[0];


    const card =
        document.createElement(
            "div"
        );


    card.className =
        "glass certificate-card";


    const idText =
        certificateId &&
        certificateId.value.trim()
            ? `
                <small class="certificate-id">
                    ID: ${certificateId.value.trim()}
                </small>
              `
            : "";


    card.innerHTML = `

        <div class="certificate-icon">

            <i class="fa-solid fa-certificate"></i>

        </div>

        <div class="certificate-content">

            <h3>
                ${name.value.trim()}
            </h3>

            <p>
                ${issuer.value.trim()}
            </p>

            <span>
                Issued: ${formattedDate}
            </span>

            ${idText}

        </div>

        <button
            class="certificate-view"
            onclick="viewCertificate('${name.value.trim()}')">

            <i class="fa-solid fa-eye"></i>

        </button>

    `;


    grid.appendChild(card);


    name.value = "";
    issuer.value = "";
    date.value = "";


    if (certificateId) {
        certificateId.value = "";
    }


    closeCertificateModal();


    showDay5Notification(
        "Certificate added successfully!"
    );

}


function viewCertificate(name) {

    showDay5Notification(
        "Opening " + name
    );

}


/* =========================================================
   PORTFOLIO
========================================================= */

function openPortfolioModal() {
    openModal("portfolioModal");
}


function closePortfolioModal() {
    closeModal("portfolioModal");
}


function addPortfolioProject() {

    const title =
        getElement(
            "portfolioTitle"
        );


    const category =
        getElement(
            "portfolioCategory"
        );


    const description =
        getElement(
            "portfolioDescription"
        );


    const image =
        getElement(
            "portfolioImage"
        );


    if (
        !title ||
        !category ||
        !description
    ) {

        return;

    }


    if (
        !title.value.trim() ||
        !description.value.trim()
    ) {

        alert(
            "Please enter Project Name and Description."
        );

        return;

    }


    const grid =
        document.querySelector(
            ".portfolio-grid"
        );


    if (!grid) return;


    const defaultImage =
        "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80";


    const projectImage =
        image &&
        image.value.trim()
            ? image.value.trim()
            : defaultImage;


    const card =
        document.createElement(
            "div"
        );


    card.className =
        "portfolio-card glass";


    card.innerHTML = `

        <img
            src="${projectImage}"
            alt="${title.value.trim()}"
            onerror="this.src='${defaultImage}'">

        <div class="portfolio-content">

            <span class="portfolio-category">
                ${category.value}
            </span>

            <h3>
                ${title.value.trim()}
            </h3>

            <p>
                ${description.value.trim()}
            </p>

            <div class="portfolio-footer">

                <span>

                    <i class="fa-solid fa-calendar"></i>

                    ${new Date().toLocaleDateString(
                        "en-US",
                        {
                            month: "short",
                            year: "numeric"
                        }
                    )}

                </span>

                <span>

                    <i class="fa-solid fa-star"></i>

                    New

                </span>

            </div>

        </div>

    `;


    grid.insertBefore(
        card,
        grid.firstElementChild
    );


    title.value = "";
    description.value = "";


    if (image) {
        image.value = "";
    }


    closePortfolioModal();


    showDay5Notification(
        "Portfolio project added successfully!"
    );

}


/* =========================================================
   DAY 5 NOTIFICATION
========================================================= */

function showDay5Notification(message) {

    let notification =
        document.getElementById(
            "day5Notification"
        );


    if (!notification) {

        notification =
            document.createElement(
                "div"
            );


        notification.id =
            "day5Notification";


        notification.className =
            "day5-notification";


        document.body.appendChild(
            notification
        );

    }


    notification.innerHTML = `

        <i class="fa-solid fa-circle-check"></i>

        <span>
            ${message}
        </span>

    `;


    notification.classList.add(
        "show"
    );


    setTimeout(function() {

        notification.classList.remove(
            "show"
        );

    }, 2500);

}


/* =========================================================
   PROFILE DATA REFRESH
========================================================= */

function refreshProfileData() {

    const nameInput =
        getElement(
            "profileName"
        );


    const professionInput =
        getElement(
            "profileProfession"
        );


    const locationInput =
        getElement(
            "profileLocation"
        );


    const profileName =
        document.querySelector(
            ".profile-information h2"
        );


    const profileRole =
        document.querySelector(
            ".profile-role"
        );


    const profileLocation =
        document.querySelector(
            ".profile-location"
        );


    if (
        nameInput &&
        profileName
    ) {

        nameInput.value =
            profileName.textContent.trim();

    }


    if (
        professionInput &&
        profileRole
    ) {

        professionInput.value =
            profileRole.textContent.trim();

    }


    if (
        locationInput &&
        profileLocation
    ) {

        locationInput.value =
            profileLocation.textContent.trim();

    }

}


/* =========================================================
   SETTINGS
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const switches =
            document.querySelectorAll(
                ".settings-card .switch input"
            );


        switches.forEach(function(toggle) {

            toggle.addEventListener(
                "change",
                function() {

                    showDay5Notification(
                        this.checked
                            ? "Setting enabled"
                            : "Setting disabled"
                    );

                }
            );

        });


        const languageSelect =
            document.querySelector(
                ".settings-select"
            );


        if (languageSelect) {

            languageSelect.addEventListener(
                "change",
                function() {

                    showDay5Notification(
                        "Language changed to " +
                        this.value
                    );

                }
            );

        }

    }
);


/* =========================================================
   DAY 5 SIDEBAR ITEMS
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const menu =
            document.querySelector(
                ".menu"
            );


        if (!menu) return;


        const existingProfile =
            document.querySelector(
                '[data-day5-menu="profile"]'
            );


        if (existingProfile) {
            return;
        }


        const logoutItem =
            Array.from(
                menu.querySelectorAll("li")
            ).find(function(item) {

                return item.textContent
                    .trim()
                    .toLowerCase()
                    .includes("logout");

            });


        if (!logoutItem) return;


        const day5Items = [

            {
                id: "profilePage",
                icon: "fa-user",
                text: "Profile"
            },

            {
                id: "certificates",
                icon: "fa-certificate",
                text: "Certificates"
            },

            {
                id: "portfolio",
                icon: "fa-images",
                text: "Portfolio"
            },

            {
                id: "reviews",
                icon: "fa-star",
                text: "Reviews"
            },

            {
                id: "settings",
                icon: "fa-gear",
                text: "Settings"
            }

        ];


        day5Items.forEach(function(item) {

            const li =
                document.createElement(
                    "li"
                );


            li.setAttribute(
                "data-day5-menu",
                item.text.toLowerCase()
            );


            li.innerHTML = `

                <i class="fa-solid ${item.icon}"></i>

                ${item.text}

            `;


            li.addEventListener(
                "click",
                function() {

                    showPage(
                        item.id,
                        li
                    );

                }
            );


            menu.insertBefore(
                li,
                logoutItem
            );

        });

    }
);


/* =========================================================
   PROFILE EDIT BUTTON
========================================================= */

document.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest(
                ".profile-edit-btn"
            );


        if (!button) return;


        refreshProfileData();

    }
);


/* =========================================================
   PAGE LOADER
========================================================= */

window.addEventListener(
    "load",
    function() {

        document.body.style.opacity =
            "0";


        requestAnimationFrame(
            function() {

                document.body.style.transition =
                    "opacity .4s";

                document.body.style.opacity =
                    "1";

            }
        );

    }
);


/* =========================================================
   FINAL CONSOLE MESSAGE
========================================================= */

console.log(
    "✔ Skilliant Labour Portal loaded successfully"
);

/* =========================================================
   DAY 2 - ADVANCED TODO LIST MODULE
========================================================= */
(function(){
"use strict";
const STORAGE_KEY="skilliant_day1_todos",THEME_KEY="skilliant_theme";
const S={tasks:[],filter:"all",search:"",category:"all",priority:"all",sort:"date-asc",editingId:null,deletingId:null};
const $=id=>document.getElementById(id);
const esc=v=>String(v??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");
const today=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`};
const id=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,8), pv=p=>({high:3,medium:2,low:1}[p]||0);
const fd=v=>{if(!v)return"No date";return new Date(v+"T00:00:00").toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})};
const ft=v=>{if(!v)return"";let[a,m]=v.split(":");a=+a;return `${a%12||12}:${m} ${a>=12?"PM":"AM"}`};
const due=t=>t.date?new Date(`${t.date}T${t.time||"23:59"}`):null, overdue=t=>!t.completed&&due(t)&&due(t)<new Date(), dueToday=t=>!t.completed&&t.date===today();
function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(S.tasks))}
function notify(msg,type="success"){const box=$("todoToastContainer");if(!box)return;const x=document.createElement("div");x.className=`todo-toast ${type}`;x.innerHTML=`<i class="fa-solid ${type==="error"?"fa-circle-xmark":type==="warning"?"fa-triangle-exclamation":"fa-circle-check"}"></i><span>${esc(msg)}</span><button type="button"><i class="fa-solid fa-xmark"></i></button>`;box.appendChild(x);x.querySelector("button").onclick=()=>x.remove();setTimeout(()=>x.remove(),3500)}
function load(){try{const r=localStorage.getItem(STORAGE_KEY),p=r?JSON.parse(r):null;S.tasks=Array.isArray(p)?p:[{id:id(),title:"Complete electrical inspection",description:"Inspect wiring and electrical connections at the assigned site.",date:today(),time:"10:00",priority:"high",category:"Repair",completed:false,createdAt:Date.now()-3000},{id:id(),title:"Purchase construction materials",description:"Collect the required materials for tomorrow's work.",date:today(),time:"14:30",priority:"medium",category:"Construction",completed:false,createdAt:Date.now()-2000},{id:id(),title:"Submit completed work report",description:"Upload the work completion report after finishing the assigned job.",date:today(),time:"18:00",priority:"low",category:"Work",completed:true,createdAt:Date.now()-1000}];if(!r)save()}catch(e){S.tasks=[];notify("Could not restore saved tasks.","error")}}
function counters(){const total=S.tasks.length,done=S.tasks.filter(t=>t.completed).length,pending=total-done,high=S.tasks.filter(t=>t.priority==="high"&&!t.completed).length;const vals={todoTotalCount:total,todoPendingCount:pending,todoCompletedCount:done,todoHighCount:high,todoAllFilterCount:total,todoPendingFilterCount:pending,todoCompletedFilterCount:done,todoHighFilterCount:high,todoNavCount:pending};Object.entries(vals).forEach(([k,v])=>{if($(k))$(k).textContent=v});if($("todoDueToday"))$("todoDueToday").innerHTML=`<i class="fa-solid fa-calendar-day"></i> Due today: ${S.tasks.filter(dueToday).length}`;if($("todoOverdueCount"))$("todoOverdueCount").innerHTML=`<i class="fa-solid fa-triangle-exclamation"></i> Overdue: ${S.tasks.filter(overdue).length}`}
function list(){let a=[...S.tasks];if(S.filter==="pending")a=a.filter(t=>!t.completed);if(S.filter==="completed")a=a.filter(t=>t.completed);if(S.filter==="high")a=a.filter(t=>t.priority==="high"&&!t.completed);if(S.category!=="all")a=a.filter(t=>t.category===S.category);if(S.priority!=="all")a=a.filter(t=>t.priority===S.priority);const q=S.search.trim().toLowerCase();if(q)a=a.filter(t=>[t.title,t.description,t.category,t.priority,t.date].join(" ").toLowerCase().includes(q));return a.sort((x,y)=>{if(S.sort==="priority-desc")return pv(y.priority)-pv(x.priority);if(S.sort==="priority-asc")return pv(x.priority)-pv(y.priority);if(S.sort==="newest")return(y.createdAt||0)-(x.createdAt||0);if(S.sort==="oldest")return(x.createdAt||0)-(y.createdAt||0);const A=`${x.date||"9999-99-99"} ${x.time||"23:59"}`,B=`${y.date||"9999-99-99"} ${y.time||"23:59"}`;return S.sort==="date-desc"?B.localeCompare(A):A.localeCompare(B)})}
function card(t){const o=overdue(t),dt=dueToday(t);return `<article class="todo-card day2-card ${t.completed?"is-completed":""} ${o?"is-overdue":""}"><button type="button" class="todo-check ${t.completed?"checked":""}" onclick="toggleTodo('${t.id}')" aria-label="Toggle completion">${t.completed?'<i class="fa-solid fa-check"></i>':''}</button><div class="todo-card-main"><div class="todo-title-row"><h3 class="todo-title">${esc(t.title)}</h3><span class="todo-badge ${esc(t.priority)}"><i class="fa-solid fa-flag"></i> ${esc(t.priority)}</span></div>${t.description?`<p class="todo-description">${esc(t.description)}</p>`:""}<div class="todo-meta">${t.date?`<span class="${o?"todo-overdue":""}"><i class="fa-regular fa-calendar"></i> ${fd(t.date)}</span>`:""}${t.time?`<span><i class="fa-regular fa-clock"></i> ${ft(t.time)}</span>`:""}<span class="todo-category"><i class="fa-solid fa-tag"></i> ${esc(t.category)}</span>${dt?'<span class="todo-due-today"><i class="fa-solid fa-bolt"></i> Due today</span>':""}${o?'<span class="todo-overdue-pill"><i class="fa-solid fa-triangle-exclamation"></i> OVERDUE</span>':""}</div></div><div class="todo-actions"><button type="button" class="todo-complete-btn ${t.completed?"pending":"completed"}" onclick="toggleTodo('${t.id}')">${t.completed?'<i class="fa-solid fa-rotate-left"></i> Mark Pending':'<i class="fa-solid fa-check"></i> Mark Completed'}</button><button type="button" class="todo-action" onclick="editTodo('${t.id}')" title="Edit"><i class="fa-regular fa-pen-to-square"></i></button><button type="button" class="todo-action delete" onclick="deleteTodo('${t.id}')" title="Delete"><i class="fa-regular fa-trash-can"></i></button></div></article>`}
function render(){const l=$("todoList"),e=$("todoEmptyState");if(!l||!e)return;const a=list();l.innerHTML=a.map(card).join("");e.hidden=a.length!==0;if($("todoResultsText"))$("todoResultsText").textContent=`${a.length} ${a.length===1?"task":"tasks"}`;if($("todoVisibleCount"))$("todoVisibleCount").innerHTML=`<i class="fa-solid fa-eye"></i> Showing: ${a.length}`;document.querySelectorAll("[data-todo-filter]").forEach(b=>b.classList.toggle("active",b.dataset.todoFilter===S.filter));counters()}
function open(idv){S.editingId=idv||null;const t=S.tasks.find(x=>x.id===idv);$("todoModalTitle").textContent=idv?"Edit Task":"Add New Task";$("todoSubmitText").textContent=idv?"Save Changes":"Create Task";$("todoTitle").value=t?.title||"";$("todoDescription").value=t?.description||"";$("todoDate").value=t?.date||today();$("todoTime").value=t?.time||"";$("todoPriority").value=t?.priority||"medium";$("todoCategory").value=t?.category||"General";$("todoModal").classList.add("open");$("todoModal").setAttribute("aria-hidden","false");setTimeout(()=>$("todoTitle")?.focus(),80)}
function close(){const m=$("todoModal");if(m){m.classList.remove("open");m.setAttribute("aria-hidden","true")}S.editingId=null}
function submit(e){e.preventDefault();const d={title:$("todoTitle").value.trim(),description:$("todoDescription").value.trim(),date:$("todoDate").value,time:$("todoTime").value,priority:$("todoPriority").value,category:$("todoCategory").value};if(d.title.length<3){notify("Task title must contain at least 3 characters.","error");return}if(d.title.length>100){notify("Task title cannot exceed 100 characters.","error");return}if(d.description.length>500){notify("Description cannot exceed 500 characters.","error");return}if(S.editingId){Object.assign(S.tasks.find(t=>t.id===S.editingId),d);notify("Task updated successfully.")}else{S.tasks.unshift({id:id(),...d,completed:false,createdAt:Date.now()});notify("Task created successfully")}save();close();render()}
function toggle(idv){const t=S.tasks.find(x=>x.id===idv);if(!t)return;t.completed=!t.completed;save();render();notify(t.completed?"Task marked completed ✓":"Task marked pending")}
function del(idv){const t=S.tasks.find(x=>x.id===idv);if(!t)return;S.deletingId=idv;$("todoDeleteMessage").textContent=`Delete “${t.title}”? This action cannot be undone.`;$("todoDeleteModal").classList.add("open");$("todoDeleteModal").setAttribute("aria-hidden","false")}
function closeDel(){const m=$("todoDeleteModal");if(m){m.classList.remove("open");m.setAttribute("aria-hidden","true")}S.deletingId=null}
function confirmDel(){if(!S.deletingId)return;S.tasks=S.tasks.filter(t=>t.id!==S.deletingId);save();closeDel();render();notify("Task deleted.","warning")}
function clearCompleted(){const n=S.tasks.filter(t=>t.completed).length;if(!n){notify("No completed tasks to clear.","warning");return}if(confirm(`Clear ${n} completed task${n===1?"":"s"}?`)){S.tasks=S.tasks.filter(t=>!t.completed);save();render();notify("Completed tasks cleared")}}
function clearAll(){if(!S.tasks.length){notify("No tasks to clear.","warning");return}if(confirm(`Delete all ${S.tasks.length} tasks?`)){S.tasks=[];save();render();notify("All tasks cleared","warning")}}
function clearFilters(){S.filter="all";S.search="";S.category="all";S.priority="all";S.sort="date-asc";["todoSearch","todoCategoryFilter","todoPriorityFilter","todoSort"].forEach(x=>{if($(x))$(x).value=x==="todoSearch"?"":x==="todoCategoryFilter"||x==="todoPriorityFilter"?"all":"date-asc"});render()}
function theme(v){document.documentElement.setAttribute("data-theme",v);localStorage.setItem(THEME_KEY,v);if($("themeToggle"))$("themeToggle").innerHTML=v==="dark"?'<i class="fa-solid fa-sun"></i>':'<i class="fa-solid fa-moon"></i>'}
window.openTodoModal=()=>open();window.closeTodoModal=close;window.editTodo=open;window.toggleTodo=toggle;window.deleteTodo=del;window.closeTodoDeleteModal=closeDel;window.confirmTodoDelete=confirmDel;window.clearTodoFilters=clearFilters;
function bind(){$("todoForm")?.addEventListener("submit",submit);$("todoSearch")?.addEventListener("input",e=>{S.search=e.target.value;render()});document.querySelectorAll("[data-todo-filter]").forEach(b=>b.addEventListener("click",()=>{S.filter=b.dataset.todoFilter;render()}));$("todoCategoryFilter")?.addEventListener("change",e=>{S.category=e.target.value;render()});$("todoPriorityFilter")?.addEventListener("change",e=>{S.priority=e.target.value;render()});$("todoSort")?.addEventListener("change",e=>{S.sort=e.target.value;render()});$("clearCompletedBtn")?.addEventListener("click",clearCompleted);$("clearAllBtn")?.addEventListener("click",clearAll);$("themeToggle")?.addEventListener("click",()=>theme(document.documentElement.getAttribute("data-theme")==="dark"?"light":"dark"));document.addEventListener("keydown",e=>{if(e.key==="Escape"){close();closeDel()}if(e.key==="/"&&!/input|textarea|select/i.test(e.target.tagName)){e.preventDefault();$("todoSearch")?.focus()}if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="n"){e.preventDefault();open()}})}
function init(){const l=$("todoLoading");if(l)l.classList.add("show");const saved=localStorage.getItem(THEME_KEY);theme(saved||((matchMedia("(prefers-color-scheme: dark").matches)?"dark":"light"));load();bind();setTimeout(()=>{render();if(l)l.classList.remove("show")},350);console.log("✓ Day 2 Advanced Todo module ready")}
document.addEventListener("DOMContentLoaded",init);
})();

/* =========================================================
   DAY 3 - LABOUR DASHBOARD + JOB REQUEST MANAGEMENT
   Robust self-contained interaction layer
   ========================================================= */
(function () {
    "use strict";

    const STORAGE = "skilliant_day3_jobs_v4";
    let incoming = [];
    let current = [];
    let selectedRequestId = null;
    let selectedJobId = null;
    let shellBound = false;

    const seed = {
        incoming: [
            {id:"REQ-101",customer:"Priya Mehta",initials:"PM",service:"AC Servicing",date:"2026-08-13",time:"10:30",location:"Miramar, Panaji",earnings:850,phone:"+91 98765 43120",description:"Full AC servicing, filter cleaning and performance check.",distance:"4.2 km"},
            {id:"REQ-102",customer:"Amit Verma",initials:"AV",service:"Plumbing Repair",date:"2026-08-13",time:"14:00",location:"Dona Paula, Goa",earnings:650,phone:"+91 98111 22880",description:"Kitchen sink leakage and pipe fitting inspection.",distance:"6.8 km"},
            {id:"REQ-103",customer:"Neha Kapoor",initials:"NK",service:"Electrical Inspection",date:"2026-08-14",time:"09:00",location:"Porvorim, Goa",earnings:1200,phone:"+91 98989 77221",description:"Inspect distribution board and replace two damaged switches.",distance:"8.1 km"}
        ],
        current: [
            {id:"JOB-201",customer:"Rahul Sharma",service:"AC Repair",date:"2026-08-13",time:"10:00",location:"Panaji, Goa",earnings:450,phone:"+91 98765 43210",description:"Gas refill and complete AC servicing required.",status:"working",acceptedAt:"09:35 AM",startedAt:"10:00 AM",completedAt:null},
            {id:"JOB-202",customer:"Kavita Rao",service:"Water Heater Repair",date:"2026-08-13",time:"16:30",location:"Taleigao, Goa",earnings:700,phone:"+91 98221 66554",description:"Diagnose heating issue and replace faulty thermostat.",status:"accepted",acceptedAt:"11:15 AM",startedAt:null,completedAt:null}
        ]
    };

    const esc = v => String(v ?? "").replace(/[&<>'"]/g, m => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;","\"":"&quot;"}[m]));
    const money = v => "₹" + Number(v || 0).toLocaleString("en-IN");
    const dateText = v => { const d = new Date(v + "T00:00:00"); return d.toLocaleDateString("en-IN", {day:"2-digit",month:"short",year:"numeric"}); };
    const nowTime = () => new Date().toLocaleTimeString("en-IN", {hour:"2-digit", minute:"2-digit"});

    function cloneSeed() {
        return { incoming: seed.incoming.map(x => ({...x})), current: seed.current.map(x => ({...x})) };
    }

    function save() {
        localStorage.setItem(STORAGE, JSON.stringify({incoming, current}));
    }

    function load() {
        try {
            const raw = localStorage.getItem(STORAGE);
            if (!raw) {
                ({incoming, current} = cloneSeed());
                save();
                return;
            }
            const data = JSON.parse(raw);
            incoming = Array.isArray(data.incoming) ? data.incoming : [];
            current = Array.isArray(data.current) ? data.current : [];
        } catch (e) {
            ({incoming, current} = cloneSeed());
            save();
        }
    }

    function showDay3Toast(title, message, type="success") {
        const old = document.getElementById("day3ToastContainer");
        const box = old || document.body.appendChild(Object.assign(document.createElement("div"), {id:"day3ToastContainer"}));
        const item = document.createElement("div");
        item.className = `day3-toast ${type}`;
        item.innerHTML = `<i class="fa-solid ${type === "success" ? "fa-circle-check" : type === "warning" ? "fa-triangle-exclamation" : "fa-circle-xmark"}"></i><div><strong>${esc(title)}</strong><span>${esc(message)}</span></div>`;
        box.appendChild(item);
        setTimeout(() => { item.style.opacity = "0"; item.style.transform = "translateY(10px)"; setTimeout(() => item.remove(), 250); }, 3000);
    }

    function installShell() {
        const jobs = document.getElementById("jobs");
        if (!jobs || document.getElementById("day3JobsShell")) return;
        [...jobs.children].forEach(el => el.classList.add("day3-legacy-job-section"));
        const shell = document.createElement("div");
        shell.id = "day3JobsShell";
        shell.className = "day3-jobs-shell";
        shell.innerHTML = `
          <div class="day3-section-card">
            <div class="day3-section-head"><div><h3>Incoming Job Requests</h3><p>Review customer details and choose the work that fits your schedule.</p></div><span class="day3-pill" id="day3RequestCount">0 New Requests</span></div>
            <div id="day3IncomingGrid" class="day3-request-grid"></div>
          </div>
          <div class="day3-section-card">
            <div class="day3-section-head"><div><h3>Current Jobs</h3><p>Track accepted work from assignment to completion.</p></div><span class="day3-pill success" id="day3CurrentCount">0 Active Jobs</span></div>
            <div class="day3-current-grid"><div id="day3CurrentGrid"></div><div id="day3TimelinePanel"></div></div>
          </div>`;
        jobs.insertBefore(shell, jobs.firstChild);
    }

    function renderRequests() {
        const grid = document.getElementById("day3IncomingGrid");
        if (!grid) return;
        const count = document.getElementById("day3RequestCount");
        if (count) count.textContent = `${incoming.length} New Request${incoming.length === 1 ? "" : "s"}`;
        if (!incoming.length) {
            grid.innerHTML = `<div class="day3-empty" style="grid-column:1/-1"><i class="fa-regular fa-circle-check"></i><h4>No incoming requests</h4><p>You're all caught up. New requests will appear here.</p></div>`;
            return;
        }
        grid.innerHTML = incoming.map(r => `
          <article class="day3-request-card">
            <div class="day3-request-top"><div class="day3-customer"><div class="day3-avatar">${esc(r.initials)}</div><div><h4>${esc(r.customer)}</h4><span>${esc(r.phone)}</span></div></div><strong class="day3-earning">${money(r.earnings)}</strong></div>
            <div class="day3-service">
              <div class="day3-info"><i class="fa-solid fa-screwdriver-wrench"></i><div><strong>Service</strong>${esc(r.service)}</div></div>
              <div class="day3-info"><i class="fa-regular fa-calendar"></i><div><strong>Date</strong>${dateText(r.date)}</div></div>
              <div class="day3-info"><i class="fa-regular fa-clock"></i><div><strong>Time</strong>${esc(r.time)}</div></div>
              <div class="day3-info"><i class="fa-solid fa-location-dot"></i><div><strong>Location</strong>${esc(r.location)}</div></div>
              <div class="day3-info"><i class="fa-solid fa-route"></i><div><strong>Distance</strong>${esc(r.distance)}</div></div>
              <div class="day3-info"><i class="fa-solid fa-indian-rupee-sign"></i><div><strong>Estimated</strong>${money(r.earnings)}</div></div>
            </div>
            <div class="day3-request-actions">
              <button type="button" class="day3-accept" data-day3-action="accept" data-request-id="${esc(r.id)}"><i class="fa-solid fa-check"></i> Accept Request</button>
              <button type="button" class="day3-reject" data-day3-action="reject" data-request-id="${esc(r.id)}"><i class="fa-solid fa-xmark"></i> Reject</button>
              <button type="button" class="day3-details" data-day3-action="details" data-request-id="${esc(r.id)}"><i class="fa-solid fa-eye"></i> Details</button>
            </div>
          </article>`).join("");
    }

    function renderCurrent() {
        const grid = document.getElementById("day3CurrentGrid");
        const timeline = document.getElementById("day3TimelinePanel");
        if (!grid || !timeline) return;
        const count = document.getElementById("day3CurrentCount");
        if (count) count.textContent = `${current.length} Active Job${current.length === 1 ? "" : "s"}`;
        if (!current.length) {
            grid.innerHTML = `<div class="day3-empty"><i class="fa-solid fa-briefcase"></i><h4>No current jobs</h4><p>Accept an incoming request to start a new job.</p></div>`;
            timeline.innerHTML = `<div class="day3-timeline"><h3>Job Timeline</h3><div class="day3-empty">Select a job to view its timeline.</div></div>`;
            return;
        }
        const job = current[0];
        grid.innerHTML = current.map(j => `
          <article class="day3-current-card" style="margin-bottom:12px">
            <div class="day3-job-header"><div><h3>${esc(j.service)}</h3><p><i class="fa-solid fa-user"></i> ${esc(j.customer)} · ${esc(j.id)}</p></div><span class="day3-status ${esc(j.status)}">${esc(j.status)}</span></div>
            <div class="day3-job-info">
              <div class="day3-job-info-item"><small>Customer</small><span>${esc(j.customer)}</span></div>
              <div class="day3-job-info-item"><small>Service</small><span>${esc(j.service)}</span></div>
              <div class="day3-job-info-item"><small>Location</small><span>${esc(j.location)}</span></div>
              <div class="day3-job-info-item"><small>Schedule</small><span>${dateText(j.date)} · ${esc(j.time)}</span></div>
              <div class="day3-job-info-item"><small>Phone</small><span>${esc(j.phone)}</span></div>
              <div class="day3-job-info-item"><small>Estimated Earnings</small><span>${money(j.earnings)}</span></div>
            </div>
            <div class="day3-job-actions">
              <button type="button" class="day3-view" data-day3-job-action="details" data-job-id="${esc(j.id)}"><i class="fa-solid fa-eye"></i> Job Details</button>
              ${j.status === "accepted" ? `<button type="button" class="day3-start" data-day3-job-action="start" data-job-id="${esc(j.id)}"><i class="fa-solid fa-play"></i> Start Job</button>` : ""}
              ${j.status === "working" ? `<button type="button" class="day3-complete" data-day3-job-action="complete" data-job-id="${esc(j.id)}"><i class="fa-solid fa-circle-check"></i> Complete Job</button>` : ""}
            </div>
          </article>`).join("");
        renderTimeline(job);
    }

    function renderTimeline(job) {
        const panel = document.getElementById("day3TimelinePanel");
        if (!panel) return;
        const steps = [
            ["Request Received", "Customer request entered your workspace.", true, "Request"],
            ["Job Accepted", "You accepted the work request.", job.status !== "pending", "Accepted"],
            ["Work Started", "Job is currently being performed.", job.status === "working" || job.status === "completed", "Started"],
            ["Job Completed", "Work was marked complete.", job.status === "completed", "Completed"]
        ];
        panel.innerHTML = `<div class="day3-timeline"><h3>Job Timeline</h3><div class="day3-timeline-list">${steps.map(s => `<div class="day3-timeline-item ${s[2] ? "done" : ""} ${s[3] === "Started" && job.status === "working" ? "active" : ""}"><div class="day3-timeline-dot"><i class="fa-solid ${s[2] ? "fa-check" : "fa-circle"}"></i></div><div><strong>${s[0]}</strong><span>${s[1]} ${s[3] === "Accepted" && job.acceptedAt ? "· " + esc(job.acceptedAt) : ""}${s[3] === "Started" && job.startedAt ? "· " + esc(job.startedAt) : ""}${s[3] === "Completed" && job.completedAt ? "· " + esc(job.completedAt) : ""}</span></div></div>`).join("")}</div></div>`;
    }

    function updateDashboard() {
        const completed = Number(localStorage.getItem("skilliant_completed_jobs") || 125);
        const pending = current.length + incoming.length;
        const earnings = current.filter(j => j.status === "completed").reduce((s, j) => s + Number(j.earnings || 0), 0) + 850;
        const dash = document.getElementById("dashboard");
        if (!dash) return;
        const cards = [...dash.querySelectorAll(".dashboard-cards .card")];
        if (cards[0]?.querySelector("h2")) cards[0].querySelector("h2").textContent = money(earnings);
        if (cards[1]?.querySelector("h2")) cards[1].querySelector("h2").textContent = completed;
        if (cards[2]?.querySelector("h2")) cards[2].querySelector("h2").textContent = String(pending).padStart(2, "0");
        if (cards[3]?.querySelector("h2")) cards[3].querySelector("h2").textContent = "4.8";
        const todayJobs = dash.querySelector(".jobs-grid");
        if (todayJobs) todayJobs.innerHTML = current.slice(0,3).map(j => `<div class="job-card"><div class="job-left"><div class="job-circle"><i class="fa-solid fa-briefcase"></i></div><div><h3>${esc(j.service)}</h3><p>${esc(j.time)}</p></div></div><span class="status ${j.status === "completed" ? "completed" : j.status === "working" ? "confirmed" : "pending"}">${j.status === "working" ? "In Progress" : j.status.charAt(0).toUpperCase() + j.status.slice(1)}</span></div>`).join("") || `<div class="day3-empty" style="grid-column:1/-1">No jobs scheduled today.</div>`;
        let strip = document.getElementById("day3DashboardStrip");
        const anchor = dash.querySelector(".dashboard-cards");
        if (anchor && !strip) {
            strip = document.createElement("div");
            strip.id = "day3DashboardStrip";
            strip.className = "day3-dashboard-strip";
            anchor.parentNode.insertBefore(strip, anchor.nextSibling);
        }
        if (strip) strip.innerHTML = `<div class="day3-kpi"><div class="day3-kpi-icon"><i class="fa-solid fa-briefcase"></i></div><div><strong>${incoming.length + current.length}</strong><span>Total Active Jobs</span></div></div><div class="day3-kpi"><div class="day3-kpi-icon"><i class="fa-solid fa-circle-check"></i></div><div><strong>${completed}</strong><span>Completed Jobs</span></div></div><div class="day3-kpi"><div class="day3-kpi-icon"><i class="fa-solid fa-clock"></i></div><div><strong>${pending}</strong><span>Pending / Requests</span></div></div><div class="day3-kpi"><div class="day3-kpi-icon"><i class="fa-solid fa-indian-rupee-sign"></i></div><div><strong>${money(earnings)}</strong><span>Today's Earnings</span></div></div>`;
    }

    function renderAll() {
        renderRequests();
        renderCurrent();
        updateDashboard();
    }

    function ensureModalHost() {
        let host = document.getElementById("day3ModalHost");
        if (!host) {
            host = document.createElement("div");
            host.id = "day3ModalHost";
            host.className = "day3-modal-host";
            document.body.appendChild(host);
        }
        return host;
    }

    function closeDay3Modal() {
        const host = document.getElementById("day3ModalHost");
        if (host) host.innerHTML = "";
        selectedRequestId = null;
        selectedJobId = null;
    }

    function openDay3Confirm(type, request) {
        const host = ensureModalHost();
        const isAccept = type === "accept";
        host.innerHTML = `<div class="day3-modal-backdrop" data-day3-close="true"><div class="day3-modal-card" role="dialog" aria-modal="true">
          <button type="button" class="day3-modal-x" data-day3-close="true" aria-label="Close">&times;</button>
          <div class="day3-modal-icon ${isAccept ? "success" : "danger"}"><i class="fa-solid ${isAccept ? "fa-circle-check" : "fa-circle-xmark"}"></i></div>
          <h2>${isAccept ? "Accept Job Request?" : "Reject Job Request?"}</h2>
          <p>${isAccept ? `Accept ${esc(request.service)} for ${esc(request.customer)} at ${esc(request.location)}?` : `Reject ${esc(request.service)} for ${esc(request.customer)}? This request will be removed from Incoming Requests.`}</p>
          <div class="day3-modal-summary"><strong>${esc(request.customer)}</strong><span>${esc(request.service)} · ${money(request.earnings)}</span></div>
          <div class="day3-modal-actions"><button type="button" class="day3-modal-secondary" data-day3-close="true">Cancel</button><button type="button" class="${isAccept ? "day3-modal-primary" : "day3-modal-danger"}" data-day3-confirm="${isAccept ? "accept" : "reject"}">${isAccept ? "Accept Request" : "Reject Request"}</button></div>
        </div></div>`;
    }

    function openDetails(request) {
        const host = ensureModalHost();
        host.innerHTML = `<div class="day3-modal-backdrop" data-day3-close="true"><div class="day3-modal-card wide" role="dialog" aria-modal="true">
          <button type="button" class="day3-modal-x" data-day3-close="true" aria-label="Close">&times;</button>
          <div class="day3-modal-label">JOB DETAILS</div><h2>${esc(request.customer)}</h2><p class="day3-modal-subtitle">${esc(request.service)} · ${esc(request.id)}</p>
          <div class="day3-detail-grid">
            <div class="day3-detail-box"><small>Customer</small><strong>${esc(request.customer)}</strong></div><div class="day3-detail-box"><small>Phone</small><strong>${esc(request.phone)}</strong></div>
            <div class="day3-detail-box"><small>Service</small><strong>${esc(request.service)}</strong></div><div class="day3-detail-box"><small>Estimated Earnings</small><strong>${money(request.earnings)}</strong></div>
            <div class="day3-detail-box"><small>Date</small><strong>${dateText(request.date)}</strong></div><div class="day3-detail-box"><small>Time</small><strong>${esc(request.time)}</strong></div>
            <div class="day3-detail-box"><small>Location</small><strong>${esc(request.location)}</strong></div><div class="day3-detail-box"><small>Distance</small><strong>${esc(request.distance || "-")}</strong></div>
          </div>
          <div class="day3-modal-note"><strong>Description</strong><br>${esc(request.description)}</div>
          <div class="day3-modal-actions"><button type="button" class="day3-modal-secondary" data-day3-close="true">Close</button></div>
        </div></div>`;
    }

    function acceptRequest(id) {
        const r = incoming.find(x => x.id === id);
        if (!r) return;
        incoming = incoming.filter(x => x.id !== id);
        current.unshift({...r, status:"accepted", acceptedAt:nowTime(), startedAt:null, completedAt:null});
        save();
        closeDay3Modal();
        renderAll();
        showDay3Toast("Job accepted successfully", `${r.customer}'s ${r.service} request is now in Current Jobs.`, "success");
    }

    function rejectRequest(id) {
        const r = incoming.find(x => x.id === id);
        if (!r) return;
        incoming = incoming.filter(x => x.id !== id);
        save();
        closeDay3Modal();
        renderAll();
        showDay3Toast("Request rejected", `${r.customer}'s request has been removed.`, "warning");
    }

    function startJob(id) {
        const j = current.find(x => x.id === id);
        if (!j) return;
        j.status = "working";
        j.startedAt = nowTime();
        save(); renderAll();
        showDay3Toast("Job started", `${j.customer}'s job is now In Progress.`, "success");
    }

    function completeJob(id) {
        const j = current.find(x => x.id === id);
        if (!j) return;
        j.status = "completed";
        j.completedAt = nowTime();
        save(); renderAll();
        const old = Number(localStorage.getItem("skilliant_completed_jobs") || 125);
        localStorage.setItem("skilliant_completed_jobs", String(old + 1));
        showDay3Toast("Job completed", `${j.customer}'s job was marked completed successfully.`, "success");
    }

    function bindShell() {
        if (shellBound) return;
        const shell = document.getElementById("day3JobsShell");
        if (!shell) return;
        shellBound = true;
        // Capture-phase listener: this runs before legacy portal handlers,
        // so Day 3 buttons cannot be swallowed by older click handlers.
        document.addEventListener("click", function (event) {
            const target = event.target && event.target.nodeType === 3 ? event.target.parentElement : event.target;
            const requestButton = target && target.closest ? target.closest("[data-day3-action]") : null;
            if (requestButton) {
                event.preventDefault();
                event.stopImmediatePropagation();
                const id = requestButton.getAttribute("data-request-id");
                const action = requestButton.getAttribute("data-day3-action");
                const r = incoming.find(x => String(x.id) === String(id));
                if (!r) { showDay3Toast("Request not found", "Please refresh the page to load the latest requests.", "warning"); return; }
                selectedRequestId = id;
                if (action === "accept") openDay3Confirm("accept", r);
                else if (action === "reject") openDay3Confirm("reject", r);
                else if (action === "details") openDetails(r);
                return;
            }

            const jobButton = target && target.closest ? target.closest("[data-day3-job-action]") : null;
            if (jobButton) {
                event.preventDefault();
                event.stopImmediatePropagation();
                const id = jobButton.getAttribute("data-job-id");
                const job = current.find(x => String(x.id) === String(id));
                if (!job) return;
                const action = jobButton.getAttribute("data-day3-job-action");
                if (action === "details") openDetails(job);
                else if (action === "start") startJob(id);
                else if (action === "complete") completeJob(id);
                return;
            }

            const confirm = target && target.closest ? target.closest("[data-day3-confirm]") : null;
            if (confirm) {
                event.preventDefault();
                event.stopImmediatePropagation();
                const action = confirm.getAttribute("data-day3-confirm");
                const id = selectedRequestId;
                if (action === "accept") acceptRequest(id);
                else if (action === "reject") rejectRequest(id);
                return;
            }

            const close = target && target.closest ? target.closest("[data-day3-close]") : null;
            if (close) {
                event.preventDefault();
                event.stopImmediatePropagation();
                closeDay3Modal();
            }
        }, true);
    }

    function expose() {
        window.day3OpenAccept = id => { const r = incoming.find(x => x.id === id); if (r) { selectedRequestId = id; openDay3Confirm("accept", r); } };
        window.day3OpenReject = id => { const r = incoming.find(x => x.id === id); if (r) { selectedRequestId = id; openDay3Confirm("reject", r); } };
        window.day3OpenRequestDetails = id => { const r = incoming.find(x => x.id === id); if (r) openDetails(r); };
        window.day3OpenJobDetails = id => { const j = current.find(x => x.id === id); if (j) openDetails(j); };
        window.day3StartJob = startJob;
        window.day3CompleteJob = completeJob;
        window.day3ConfirmAccept = () => acceptRequest(selectedRequestId);
        window.day3ConfirmReject = () => rejectRequest(selectedRequestId);
    }

    // Global helpers are intentionally exposed for compatibility with any
    // older markup that may still call an inline handler.
    window.openDay3Accept = function(id) {
        const r = incoming.find(x => String(x.id) === String(id));
        if (r) { selectedRequestId = id; openDay3Confirm("accept", r); }
    };
    window.openDay3Reject = function(id) {
        const r = incoming.find(x => String(x.id) === String(id));
        if (r) { selectedRequestId = id; openDay3Confirm("reject", r); }
    };
    window.openDay3Details = function(id) {
        const r = incoming.find(x => String(x.id) === String(id));
        if (r) openDetails(r);
    };

    function initDay3() {
        load();
        installShell();
        bindShell();
        expose();
        renderAll();
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initDay3);
    else initDay3();
})();
