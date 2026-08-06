/* ==========================================
   SKILLIANT LABOUR PORTAL
   SCRIPT.JS
   PART 1
========================================== */

/* ==========================================
   SELECTORS
========================================== */

const pages = document.querySelectorAll(".page");
const menuItems = document.querySelectorAll(".menu li");

/* ==========================================
   PAGE NAVIGATION
========================================== */

function showPage(pageId, element) {

    // Hide all pages
    pages.forEach(page => {
        page.classList.remove("active-page");
        page.style.display = "none";
    });

    // Show selected page
    const selectedPage = document.getElementById(pageId);

    if (selectedPage) {
        selectedPage.classList.add("active-page");
        selectedPage.style.display = "block";
    }

    // Active menu item
    menuItems.forEach(item => item.classList.remove("active"));

    if (element) {
        element.classList.add("active");
    }

    // Scroll to top
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}

/* ==========================================
   DEFAULT PAGE
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    // Hide every page
    pages.forEach(page => {
        page.style.display = "none";
    });

    // Show Dashboard
    const dashboard = document.getElementById("dashboard");

    if (dashboard) {
        dashboard.style.display = "block";
        dashboard.classList.add("active-page");
    }

    // First menu active
    if (menuItems.length > 0) {
        menuItems[0].classList.add("active");
    }

});

/* ==========================================
   GREETING
========================================== */

const greeting = document.getElementById("greeting");

if (greeting) {

    const hour = new Date().getHours();

    if (hour < 12) {

        greeting.innerHTML = "Good Morning, Rahul 👋";

    } else if (hour < 17) {

        greeting.innerHTML = "Good Afternoon, Rahul ☀️";

    } else {

        greeting.innerHTML = "Good Evening, Rahul 🌙";

    }

}

/* ==========================================
   COUNTER ANIMATION
========================================== */

const counters = document.querySelectorAll(".counter");

function animateCounter(counter) {

    const target = Number(counter.innerText);

    let count = 0;

    const speed = Math.max(1, target / 80);

    const update = () => {

        count += speed;

        if (count < target) {

            counter.innerText = Math.ceil(count);

            requestAnimationFrame(update);

        } else {

            counter.innerText = target;

        }

    };

    update();

}

counters.forEach(counter => {

    animateCounter(counter);

});

/* ==========================================
   BAR CHART ANIMATION
========================================== */

window.addEventListener("load", () => {

    const bars = document.querySelectorAll(".bar span");

    bars.forEach(bar => {

        const finalHeight = bar.style.height;

        bar.style.height = "0";

        setTimeout(() => {

            bar.style.height = finalHeight;

        }, 300);

    });

});

/* ==========================================
   PROFILE IMAGE EFFECT
========================================== */

const profileImage = document.querySelector(".profile img");

if (profileImage) {

    profileImage.addEventListener("mouseenter", () => {

        profileImage.style.transform = "scale(1.08)";

    });

    profileImage.addEventListener("mouseleave", () => {

        profileImage.style.transform = "scale(1)";

    });

}

console.log("✔ JS Part 1 Loaded");
/* ==========================================
   SKILLIANT LABOUR PORTAL
   SCRIPT.JS
   PART 2
========================================== */

/* ==========================================
   MODAL SELECTORS
========================================== */

const detailsModal = document.getElementById("detailsModal");
const acceptModal = document.getElementById("acceptModal");
const rejectModal = document.getElementById("rejectModal");
const logoutModal = document.getElementById("logoutModal");

/* ==========================================
   MODAL FUNCTIONS
========================================== */

function openDetailsModal() {

    if(detailsModal){

        detailsModal.style.display = "flex";

    }

}

function closeDetailsModal() {

    if(detailsModal){

        detailsModal.style.display = "none";

    }

}

function openAcceptModal() {

    if(acceptModal){

        acceptModal.style.display = "flex";

    }

}

function closeAcceptModal() {

    if(acceptModal){

        acceptModal.style.display = "none";

    }

}

function openRejectModal() {

    if(rejectModal){

        rejectModal.style.display = "flex";

    }

}

function closeRejectModal() {

    if(rejectModal){

        rejectModal.style.display = "none";

    }

}

function openLogoutModal() {

    if(logoutModal){

        logoutModal.style.display = "flex";

    }

}

function closeLogoutModal() {

    if(logoutModal){

        logoutModal.style.display = "none";

    }

}

/* ==========================================
   JOB ACTIONS
========================================== */

function acceptJob(){

    closeAcceptModal();

    showToast("Job Accepted Successfully ✅","success");

}

function rejectJob(){

    closeRejectModal();

    showToast("Job Rejected ❌","error");

}

/* ==========================================
   CLOSE MODAL ON OUTSIDE CLICK
========================================== */

window.addEventListener("click",(e)=>{

    if(e.target===detailsModal){

        closeDetailsModal();

    }

    if(e.target===acceptModal){

        closeAcceptModal();

    }

    if(e.target===rejectModal){

        closeRejectModal();

    }

    if(e.target===logoutModal){

        closeLogoutModal();

    }

});

/* ==========================================
   ESC KEY
========================================== */

document.addEventListener("keydown",(e)=>{

    if(e.key==="Escape"){

        closeDetailsModal();

        closeAcceptModal();

        closeRejectModal();

        closeLogoutModal();

    }

});

/* ==========================================
   PROFILE DROPDOWN
========================================== */

const profile = document.querySelector(".profile");
const profileDropdown = document.getElementById("profileDropdown");

if(profile && profileDropdown){

    profile.addEventListener("click",(e)=>{

        e.stopPropagation();

        if(profileDropdown.style.display==="block"){

            profileDropdown.style.display="none";

        }

        else{

            profileDropdown.style.display="block";

        }

    });

    document.addEventListener("click",()=>{

        profileDropdown.style.display="none";

    });

}

/* ==========================================
   TOAST MESSAGE
========================================== */

function showToast(message,type){

    const toast=document.createElement("div");

    toast.className="toast";

    toast.innerHTML=message;

    if(type==="success"){

        toast.style.background="#22C55E";

    }

    else{

        toast.style.background="#EF4444";

    }

    document.body.appendChild(toast);

    setTimeout(()=>{

        toast.classList.add("show");

    },100);

    setTimeout(()=>{

        toast.classList.remove("show");

        setTimeout(()=>{

            toast.remove();

        },300);

    },2500);

}

console.log("✔ JS Part 2 Loaded");
/* ==========================================
   SKILLIANT LABOUR PORTAL
   SCRIPT.JS
   PART 3
========================================== */

/* ==========================================
   SEARCH JOBS
========================================== */

const searchInput = document.querySelector(".search-box input");

if(searchInput){

    searchInput.addEventListener("keyup",function(){

        const value = this.value.toLowerCase();

        const cards = document.querySelectorAll(".job-card,.request-card");

        cards.forEach(card=>{

            const text = card.innerText.toLowerCase();

            if(text.includes(value)){

                card.style.display="";

            }

            else{

                card.style.display="none";

            }

        });

    });

}

/* ==========================================
   CALENDAR
========================================== */

const dates = document.querySelectorAll(".calendar-grid span");

dates.forEach(date=>{

    date.addEventListener("click",function(){

        if(this.innerHTML==="") return;

        dates.forEach(d=>{

            d.classList.remove("selected-date");

        });

        this.classList.add("selected-date");

    });

});

/* ==========================================
   NOTIFICATION BUTTON
========================================== */

const bell = document.querySelector(".icon");

if(bell){

    bell.addEventListener("click",()=>{

        showToast("🔔 You have 3 new notifications","success");

    });

}

/* ==========================================
   RIPPLE EFFECT
========================================== */

const buttons = document.querySelectorAll("button");

buttons.forEach(button=>{

    button.addEventListener("click",function(e){

        const ripple = document.createElement("span");

        ripple.className="ripple";

        ripple.style.left=e.offsetX+"px";

        ripple.style.top=e.offsetY+"px";

        this.appendChild(ripple);

        setTimeout(()=>{

            ripple.remove();

        },600);

    });

});

/* ==========================================
   CARD HOVER EFFECT
========================================== */

const glassCards=document.querySelectorAll(".glass,.card");

glassCards.forEach(card=>{

    card.addEventListener("mouseenter",()=>{

        card.style.transform="translateY(-6px)";

    });

    card.addEventListener("mouseleave",()=>{

        card.style.transform="translateY(0px)";

    });

});

/* ==========================================
   BUTTON HOVER EFFECT
========================================== */

const primaryButtons=document.querySelectorAll(
".primary-btn,.accept-btn,.reject-btn,.danger-btn,.secondary-btn"
);

primaryButtons.forEach(btn=>{

    btn.addEventListener("mouseenter",()=>{

        btn.style.transform="translateY(-2px)";

    });

    btn.addEventListener("mouseleave",()=>{

        btn.style.transform="translateY(0px)";

    });

});

/* ==========================================
   LIVE DATE
========================================== */

const today=new Date();

const currentDay=today.getDate();

dates.forEach(date=>{

    if(date.innerText==currentDay){

        date.classList.add("selected-date");

    }

});

/* ==========================================
   PAGE LOADER EFFECT
========================================== */

window.addEventListener("load",()=>{

    document.body.style.opacity="0";

    requestAnimationFrame(()=>{

        document.body.style.transition="opacity .4s";

        document.body.style.opacity="1";

    });

});

/* ==========================================
   SIDEBAR ACTIVE ICON EFFECT
========================================== */

menuItems.forEach(item=>{

    item.addEventListener("mouseenter",()=>{

        item.style.transform="translateX(6px)";

    });

    item.addEventListener("mouseleave",()=>{

        if(!item.classList.contains("active")){

            item.style.transform="translateX(0px)";

        }

    });

});

/* ==========================================
   CONSOLE
========================================== */

console.log(
"%c✔ Labour Portal Loaded Successfully",
"color:#2563EB;font-size:16px;font-weight:bold;"
);
/* ==========================================
        DAY 4 - WALLET
========================================== */

const withdrawModal = document.getElementById("withdrawModal");

const withdrawInput = document.getElementById("withdrawAmount");

const walletBalance = document.getElementById("walletBalance");

/* ==========================================
        OPEN MODAL
========================================== */

function openWithdrawModal(){

    withdrawModal.style.display="flex";

}

/* ==========================================
        CLOSE MODAL
========================================== */

function closeWithdrawModal(){

    withdrawModal.style.display="none";

}

/* ==========================================
        WITHDRAW MONEY
========================================== */

function withdrawMoney(){

    let amount = parseFloat(withdrawInput.value);

    if(isNaN(amount) || amount<=0){

        showToast("Enter a valid amount","error");

        return;

    }

    let currentBalance = parseFloat(

        walletBalance.innerText
        .replace("₹","")
        .replace(",","")

    );

    if(amount>currentBalance){

        showToast("Insufficient Balance","error");

        return;

    }

    currentBalance -= amount;

    walletBalance.innerHTML="₹"+currentBalance.toLocaleString();

    addTransaction(amount);

    closeWithdrawModal();

    withdrawInput.value="";

    showToast("₹"+amount+" Withdraw Successful","success");

}

/* ==========================================
        ADD TRANSACTION
========================================== */

function addTransaction(amount){

    const tbody=document.querySelector(".transaction-table tbody");

    const row=document.createElement("tr");

    const today=new Date();

    const date=today.getDate()+" "+
    today.toLocaleString("default",{month:"short"});

    row.innerHTML=`

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

/* ==========================================
        CLOSE MODAL OUTSIDE
========================================== */

window.addEventListener("click",(e)=>{

    if(e.target==withdrawModal){

        closeWithdrawModal();

    }

});
/* ==========================================
      DAY 4 ENHANCEMENTS
========================================== */

const successPopup=document.getElementById("successPopup");

function showSuccessPopup(){

    successPopup.classList.add("show");

    setTimeout(()=>{

        successPopup.classList.remove("show");

    },2500);

}

/* ==========================================
      ENHANCED WITHDRAW
========================================== */

const withdrawButton=document.querySelector(
"#withdrawModal .primary-btn"
);

if(withdrawButton){

    withdrawButton.addEventListener("click",function(){

        const amount=parseFloat(withdrawInput.value);

        if(isNaN(amount) || amount<=0){

            return;

        }

        this.disabled=true;

        const original=this.innerHTML;

        this.innerHTML='<span class="loader"></span> Processing...';

        setTimeout(()=>{

            withdrawMoney();

            showSuccessPopup();

            this.disabled=false;

            this.innerHTML=original;

        },1800);

    });

}