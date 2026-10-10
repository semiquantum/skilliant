/* Real frontend EmailJS delivery for the Admin OTP flow. */
window.SkilliantEmail = {
  isConfigured() {
    const c = window.SKILLIANT_EMAIL_CONFIG || {};
    return !!(
      window.emailjs &&
      c.publicKey && c.serviceId && c.templateId &&
      !String(c.publicKey).startsWith('YOUR_') &&
      !String(c.serviceId).startsWith('YOUR_') &&
      !String(c.templateId).startsWith('YOUR_')
    );
  },

  init() {
    if (!this.isConfigured()) throw new Error('EmailJS is not configured');
    if (!this._initialized) {
      emailjs.init({ publicKey: window.SKILLIANT_EMAIL_CONFIG.publicKey });
      this._initialized = true;
    }
  },

  async sendOtp({ toEmail, otp, expiresInSeconds, adminName }) {
    this.init();
    const c = window.SKILLIANT_EMAIL_CONFIG;
    const recipient = String(toEmail || '').trim().toLowerCase();
    if (!recipient || !/^\S+@\S+\.\S+$/.test(recipient)) {
      throw new Error('A valid authorized Admin recipient email is required.');
    }
    if (!/^\d{6}$/.test(String(otp || ''))) {
      throw new Error('OTP must be exactly 6 digits.');
    }

    /* The EmailJS template selected in the account uses {{passcode}} and
       {{to_email}}. Keep both names explicit so the template receives the
       exact variables it expects. */
    // Keep the payload aligned with the EmailJS template used by this project.
    // The recipient is ALWAYS the already-authorized Admin email; the connected
    // Gmail service remains the sender. No manual send/compose action is used.
    return emailjs.send(c.serviceId, c.templateId, {
      to_email: recipient,
      passcode: otp,
      expires_in: String(expiresInSeconds),
      admin_name: adminName || 'Admin'
    });
  }
};
