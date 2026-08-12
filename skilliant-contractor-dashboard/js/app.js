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

    closeAcceptModal();

    showToast(
        "Job Accepted Successfully ✅",
        "success"
    );

}


function rejectJob() {

    closeRejectModal();

    showToast(
        "Job Rejected ❌",
        "error"
    );

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
