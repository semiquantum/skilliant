// =========================================================
// SKILLIANT - SUPABASE AUTH
// Google OAuth + Mobile SMS OTP
// Existing email/password auth remains in final-cleanup.js
// =========================================================

const SUPABASE_URL = "https://ikmyhvjpiqfxxuzguzen.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_cQqQluoKjek43__9VXTAeQ_xeSrVM9L";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

window.skilliantSupabaseClient = supabaseClient;

console.log("Supabase initialized");

if (window.location.protocol === "file:") {
    const notice = document.getElementById("fileProtocolNotice");
    if (notice) notice.style.display = "block";
    console.warn("Google OAuth requires Live Server. Open http://127.0.0.1:5501/skilliant-labour-dashboard/");
}

function appRedirectUrl() {
    // IMPORTANT: Live Server is serving this project from the parent workspace,
    // so the real app URL is the project sub-folder, not /index.html at the server root.
    // Keep this exact path in Supabase Authentication -> URL Configuration -> Redirect URLs.
    const appPath = "/skilliant-labour-dashboard/";
    if (window.location.protocol === "http:" || window.location.protocol === "https:") {
        return window.location.origin + appPath;
    }
    return "http://127.0.0.1:5501" + appPath;
}

function showPortalFromSupabase(user) {
    if (!user) return;

    localStorage.setItem("supabase_user", JSON.stringify(user));
    sessionStorage.setItem("skilliant_auth_session_v2", "1");
    localStorage.removeItem("skilliant_auth_session_v2");
    sessionStorage.removeItem("skilliant_google_login_pending");
    sessionStorage.removeItem("skilliant_otp_login_pending");

    const authGate = document.getElementById("authGate");
    const portal = document.getElementById("portalAppShell");

    if (authGate) {
        authGate.classList.add("hidden");
        authGate.setAttribute("aria-hidden", "true");
        authGate.style.display = "none";
        authGate.style.pointerEvents = "none";
    }

    if (portal) {
        portal.classList.remove("portal-hidden");
        portal.setAttribute("aria-hidden", "false");
        portal.style.display = "";
    }

    document.body.classList.add("authenticated");
}

// =========================================================
// GOOGLE LOGIN
// =========================================================

document.getElementById("googleLoginBtn")?.addEventListener("click", async () => {
    sessionStorage.setItem("skilliant_google_login_pending", "1");

    const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: appRedirectUrl()
        }
    });

    if (error) {
        sessionStorage.removeItem("skilliant_google_login_pending");
        console.error("Google login error:", error);
        alert("Google login failed: " + error.message);
    }
});

// =========================================================
// MOBILE SMS OTP - SEND
// =========================================================

document.getElementById("sendOtpBtn")?.addEventListener("click", async () => {
    const phoneEl = document.getElementById("otpPhone");
    const phoneError = document.getElementById("otpPhoneError");
    const verifyBox = document.getElementById("otpVerifyBox");
    const sendButton = document.getElementById("sendOtpBtn");
    let phone = (phoneEl?.value || "").trim().replace(/[\s()-]/g, "");
    if (/^\d{10}$/.test(phone)) phone = "+91" + phone;
    else if (/^0\d{10}$/.test(phone)) phone = "+91" + phone.slice(1);
    else if (/^91\d{10}$/.test(phone)) phone = "+" + phone;
    if (phoneEl && /^\+\d{8,15}$/.test(phone)) phoneEl.value = phone;
    if (phoneError) phoneError.textContent = "";
    if (!phone) { if (phoneError) phoneError.textContent = "Mobile number is required."; return; }
    if (sendButton) { sendButton.disabled = true; sendButton.style.opacity = ".7"; }
    const { error } = await supabaseClient.auth.signInWithOtp({ phone });
    if (sendButton) { sendButton.disabled = false; sendButton.style.opacity = ""; }
    if (error) {
        console.error("OTP send error:", error);
        const message = String(error.message || "");
        const providerDisabled = /unsupported provider|provider.*disabled|phone.*provider.*disabled/i.test(message);
        if (phoneError) phoneError.textContent = providerDisabled
            ? "Supabase Phone OTP is not configured. Enable Phone in Authentication → Sign In / Providers and configure an SMS provider such as Twilio, MessageBird or Vonage."
            : message;
        return;
    }
    sessionStorage.setItem("skilliant_otp_login_pending", "1");
    if (verifyBox) verifyBox.style.display = "block";
    document.getElementById("otpCode")?.focus();
    alert("OTP sent to your mobile number.");
});

// =========================================================
// MOBILE SMS OTP - VERIFY
// =========================================================

document.getElementById("verifyOtpBtn")?.addEventListener("click", async () => {
    let phone = (document.getElementById("otpPhone")?.value || "").trim().replace(/[\s()-]/g, "");
    if (/^\d{10}$/.test(phone)) phone = "+91" + phone;
    else if (/^0\d{10}$/.test(phone)) phone = "+91" + phone.slice(1);
    else if (/^91\d{10}$/.test(phone)) phone = "+" + phone;
    const token = (document.getElementById("otpCode")?.value || "").trim();
    const codeError = document.getElementById("otpCodeError");
    const verifyButton = document.getElementById("verifyOtpBtn");
    if (codeError) codeError.textContent = "";
    if (!phone || !token) { if (codeError) codeError.textContent = "Enter the OTP sent to your phone."; return; }
    if (verifyButton) { verifyButton.disabled = true; verifyButton.style.opacity = ".7"; }
    const { data, error } = await supabaseClient.auth.verifyOtp({ phone, token, type: "sms" });
    if (verifyButton) { verifyButton.disabled = false; verifyButton.style.opacity = ""; }
    if (error) { console.error("OTP verification error:", error); if (codeError) codeError.textContent = error.message; return; }
    sessionStorage.setItem("skilliant_otp_login_pending", "1");
    if (data?.user) showPortalFromSupabase(data.user);
});

// =========================================================
// SUPABASE AUTH STATE + GOOGLE CALLBACK RECOVERY
// =========================================================

function cleanOAuthHash() {
    try {
        if (window.location.hash && /access_token=|refresh_token=|error=/.test(window.location.hash)) {
            window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
        }
    } catch (_) {}
}

async function recoverSupabaseSession() {
    try {
        const { data, error } = await supabaseClient.auth.getSession();
        if (error) {
            console.error("Supabase session restore error:", error);
            return;
        }
        if (data?.session?.user) {
            showPortalFromSupabase(data.session.user);
            cleanOAuthHash();
        }
    } catch (error) {
        console.error("Google callback restore failed:", error);
    }
}

supabaseClient.auth.onAuthStateChange((event, session) => {
    console.log("Supabase auth event:", event);
    if (!session?.user) return;

    // Do not depend on a sessionStorage flag here. OAuth redirects can
    // legitimately return without that flag, while Supabase has already
    // restored a valid session. A valid Supabase session is sufficient.
    if (event === "SIGNED_IN" || event === "INITIAL_SESSION" || event === "TOKEN_REFRESHED") {
        showPortalFromSupabase(session.user);
        cleanOAuthHash();
    }
});

// Handles both normal OAuth callbacks and callbacks where the browser has
// already restored the Supabase session before this script finishes loading.
recoverSupabaseSession();

// =========================================================
// SUPABASE LOGOUT BRIDGE
// =========================================================

window.skilliantSupabaseSignOut = async function () {
    sessionStorage.removeItem("skilliant_google_login_pending");
    sessionStorage.removeItem("skilliant_otp_login_pending");
    localStorage.removeItem("supabase_user");
    try {
        await supabaseClient.auth.signOut({ scope: "local" });
    } catch (error) {
        console.error("Supabase sign-out error:", error);
    }
};
