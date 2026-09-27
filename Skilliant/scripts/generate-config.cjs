const fs = require('node:fs');
const path = require('node:path');

function loadEnv(file) {
  if (!fs.existsSync(file)) return {};
  const out = {};
  for (const raw of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const idx = line.indexOf('=');
    if (idx < 0) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    out[key] = value;
  }
  return out;
}

const env = { ...loadEnv(path.resolve('.env')), ...process.env };
const url = env.VITE_SUPABASE_URL || '';
const publishableKey = env.VITE_SUPABASE_PUBLISHABLE_KEY || '';
const googleClientId = env.VITE_GOOGLE_CLIENT_ID || '';
const emailjsServiceId = env.VITE_EMAILJS_SERVICE_ID || '';
const emailjsTemplateId = env.VITE_EMAILJS_TEMPLATE_ID || '';
const emailjsPublicKey = env.VITE_EMAILJS_PUBLIC_KEY || '';
const demoMode = String(env.VITE_DEMO_MODE || 'false').toLowerCase() === 'true';

if (!url || !publishableKey) {
  console.warn('Warning: VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY are not configured.');
}

function jsString(v) { return JSON.stringify(v || ''); }

const config = `/**\n * GENERATED FILE — do not commit local secrets.\n * Only public Supabase configuration is written here.\n */\nwindow.SKILLIANT_SUPABASE = {\n  url: ${jsString(url)},\n  publishableKey: ${jsString(publishableKey)},\n  googleClientId: ${jsString(googleClientId)},
  emailjs: { serviceId: ${jsString(emailjsServiceId)}, templateId: ${jsString(emailjsTemplateId)}, publicKey: ${jsString(emailjsPublicKey)} },
  demoMode: ${demoMode},\n  functions: {\n    requestPasswordOtp: 'request-password-otp',\n    verifyPasswordOtp: 'verify-password-otp',\n    resetPassword: 'reset-password',\n    requestEmailOtp: 'request-email-otp',\n    verifyEmailOtp: 'verify-email-otp',\n    createAdmin: 'create-admin',
    listAdmins: 'list-admins',
    updateAdmin: 'update-admin',
    deleteAdmin: 'delete-admin'\n  }\n};\n`;

fs.writeFileSync(path.resolve('js/supabase-config.js'), config);
console.log('Generated js/supabase-config.js from environment configuration.');
