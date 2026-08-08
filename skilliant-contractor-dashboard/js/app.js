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