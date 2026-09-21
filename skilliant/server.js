/**
 * SKILLIANT - Unified Node.js Server & Twilio Verify Integration
 * Production & Development Server with Zero External Dependencies
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

// --- 1. Load .env configuration ---
function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        let val = trimmed.slice(eqIdx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    });
  }
}
loadEnv();

const PORT = parseInt(process.env.PORT || '3000', 10);
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || '';
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || '';
const TWILIO_VERIFY_SERVICE_SID = process.env.TWILIO_VERIFY_SERVICE_SID || '';

function isTwilioConfigured() {
  return (
    TWILIO_ACCOUNT_SID.startsWith('AC') &&
    TWILIO_ACCOUNT_SID.length >= 30 &&
    !TWILIO_ACCOUNT_SID.includes('your_') &&
    TWILIO_AUTH_TOKEN.length >= 20 &&
    !TWILIO_AUTH_TOKEN.includes('your_') &&
    TWILIO_VERIFY_SERVICE_SID.startsWith('VA') &&
    TWILIO_VERIFY_SERVICE_SID.length >= 30 &&
    !TWILIO_VERIFY_SERVICE_SID.includes('your_')
  );
}

// In-memory development OTP store for when Twilio credentials are in test/mock mode
const devOtpStore = new Map();

// --- 2. Email Validation Helper ---
function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  const trimmed = email.trim().toLowerCase();
  if (trimmed.length < 5 || trimmed.length > 254) return false;
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(trimmed);
}

// --- 3. Twilio Verify API Calls ---
function twilioRequest(endpointPath, postData) {
  return new Promise((resolve, reject) => {
    const authHeader = 'Basic ' + Buffer.from(TWILIO_ACCOUNT_SID + ':' + TWILIO_AUTH_TOKEN).toString('base64');
    const options = {
      hostname: 'verify.twilio.com',
      port: 443,
      path: endpointPath,
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ statusCode: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ statusCode: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', (err) => reject(err));
    req.write(postData);
    req.end();
  });
}

async function sendTwilioOtp(email) {
  const formattedEmail = email.trim().toLowerCase();

  if (isTwilioConfigured()) {
    console.log(`[Twilio Verify] Dispatching verification code to: ${formattedEmail}`);
    const postData = `To=${encodeURIComponent(formattedEmail)}&Channel=email`;
    const endpoint = `/v2/Services/${TWILIO_VERIFY_SERVICE_SID}/Verifications`;
    const res = await twilioRequest(endpoint, postData);

    if (res.statusCode >= 200 && res.statusCode < 300) {
      console.log(`[Twilio Verify] Successfully sent OTP to ${formattedEmail}. SID: ${res.body.sid}`);
      return { success: true, status: res.body.status, sid: res.body.sid };
    } else {
      console.error(`[Twilio Verify Error]`, res.body);
      const errMsg = res.body?.message || 'Twilio verification request failed';
      return { success: false, error: errMsg, code: res.body?.code };
    }
  } else {
    // Development Mock Mode
    const mockCode = Math.floor(100000 + Math.random() * 900000).toString();
    devOtpStore.set(formattedEmail, {
      code: mockCode,
      expiresAt: Date.now() + 10 * 60 * 1000
    });

    console.log('\n============================================================');
    console.log('⚡ [DEV FALLBACK ACTIVE - NO TWILIO CREDENTIALS CONFIGURED]');
    console.log(`📧 Target Email: ${formattedEmail}`);
    console.log(`🔑 Verification Code (OTP): ${mockCode}`);
    console.log('⏰ Valid for: 10 minutes');
    console.log('💡 Note: Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and');
    console.log('   TWILIO_VERIFY_SERVICE_SID in your .env file to send real emails.');
    console.log('============================================================\n');

    return {
      success: true,
      status: 'pending',
      devMode: true,
      devCode: mockCode,
      message: `OTP dispatched in dev mode. Code is: ${mockCode}`
    };
  }
}

async function verifyTwilioOtp(email, code) {
  const formattedEmail = email.trim().toLowerCase();
  const trimmedCode = code.trim();

  if (isTwilioConfigured()) {
    console.log(`[Twilio Verify Check] Validating code for: ${formattedEmail}`);
    const postData = `To=${encodeURIComponent(formattedEmail)}&Code=${encodeURIComponent(trimmedCode)}`;
    const endpoint = `/v2/Services/${TWILIO_VERIFY_SERVICE_SID}/VerificationCheck`;
    const res = await twilioRequest(endpoint, postData);

    if (res.statusCode >= 200 && res.statusCode < 300) {
      const isApproved = res.body.status === 'approved';
      console.log(`[Twilio Verify Check] Result for ${formattedEmail}: status=${res.body.status}, valid=${res.body.valid}`);
      return {
        success: isApproved,
        status: res.body.status,
        valid: res.body.valid,
        message: isApproved ? 'Email verified successfully!' : 'Invalid or expired verification code'
      };
    } else {
      console.error(`[Twilio Verify Check Error]`, res.body);
      return {
        success: false,
        status: 'failed',
        error: res.body?.message || 'Verification check failed',
        code: res.body?.code
      };
    }
  } else {
    // Development Mock Mode Check
    const stored = devOtpStore.get(formattedEmail);
    if (!stored) {
      return {
        success: false,
        status: 'pending',
        message: 'No verification code found for this email. Please request a new code.'
      };
    }

    if (Date.now() > stored.expiresAt) {
      devOtpStore.delete(formattedEmail);
      return {
        success: false,
        status: 'expired',
        message: 'Verification code has expired. Please click "Resend Code".'
      };
    }

    if (stored.code === trimmedCode) {
      devOtpStore.delete(formattedEmail);
      console.log(`⚡ [DEV FALLBACK] Code ${trimmedCode} MATCHED for ${formattedEmail}!`);
      return {
        success: true,
        status: 'approved',
        valid: true,
        message: 'Email successfully verified!'
      };
    } else {
      console.log(`⚡ [DEV FALLBACK] Code ${trimmedCode} does NOT match expected ${stored.code} for ${formattedEmail}`);
      return {
        success: false,
        status: 'pending',
        valid: false,
        message: 'Incorrect verification code. Please check your code and try again.'
      };
    }
  }
}

// --- 4. MIME Types & Static File Handler ---
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 1e6) { // 1MB limit
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!body.trim()) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(new Error('Invalid JSON format'));
      }
    });
    req.on('error', reject);
  });
}

// --- 5. Main HTTP Server ---
const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  // --- API ROUTE: Send OTP ---
  if (pathname === '/api/send-otp' && req.method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const email = body.email;

      if (!email || !isValidEmail(email)) {
        return sendJson(res, 400, {
          success: false,
          error: 'Please provide a valid, well-formed email address.'
        });
      }

      const result = await sendTwilioOtp(email);
      if (result.success) {
        return sendJson(res, 200, {
          success: true,
          email: email.trim().toLowerCase(),
          status: result.status,
          devMode: result.devMode || false,
          devCode: result.devCode || null,
          message: result.devMode 
            ? `Verification code dispatched! (Dev Mode: ${result.devCode})` 
            : `A 6-digit verification code was sent to ${email.trim()}`
        });
      } else {
        return sendJson(res, 500, {
          success: false,
          error: result.error || 'Failed to dispatch verification code via Twilio Verify.'
        });
      }
    } catch (err) {
      console.error('API Error in /api/send-otp:', err);
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // --- API ROUTE: Verify OTP ---
  if (pathname === '/api/verify-otp' && req.method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const { email, code } = body;

      if (!email || !isValidEmail(email)) {
        return sendJson(res, 400, {
          success: false,
          error: 'A valid email address is required.'
        });
      }

      if (!code || !/^\d{6}$/.test(String(code).trim())) {
        return sendJson(res, 400, {
          success: false,
          error: 'Please enter a valid 6-digit numeric verification code.'
        });
      }

      const result = await verifyTwilioOtp(email, String(code));
      if (result.success) {
        return sendJson(res, 200, {
          success: true,
          status: 'approved',
          email: email.trim().toLowerCase(),
          message: 'Email address verified successfully!'
        });
      } else {
        return sendJson(res, 400, {
          success: false,
          status: result.status || 'pending',
          error: result.error || result.message || 'Incorrect verification code. Please try again.'
        });
      }
    } catch (err) {
      console.error('API Error in /api/verify-otp:', err);
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // --- API ROUTE: Server Status ---
  if (pathname === '/api/status' && req.method === 'GET') {
    return sendJson(res, 200, {
      status: 'online',
      twilioConfigured: isTwilioConfigured(),
      serviceSid: isTwilioConfigured() ? TWILIO_VERIFY_SERVICE_SID.slice(0, 6) + '...' : 'Not configured (Dev Mode active)',
      timestamp: new Date().toISOString()
    });
  }

  // --- Static File Serving ---
  if (req.method === 'GET') {
    let cleanPath = pathname;
    if (cleanPath === '/') cleanPath = '/index.html';

    const safePath = path.normalize(cleanPath).replace(/^(\.\.[\/\\])+/, '');
    const filePath = path.join(__dirname, safePath);

    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        const notFoundPath = path.join(__dirname, '404.html');
        if (fs.existsSync(notFoundPath)) {
          res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
          fs.createReadStream(notFoundPath).pipe(res);
        } else {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found');
        }
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      res.writeHead(200, { 'Content-Type': contentType });
      fs.createReadStream(filePath).pipe(res);
    });
    return;
  }

  // Method not allowed
  res.writeHead(405, { 'Content-Type': 'text/plain' });
  res.end('Method Not Allowed');
});

server.listen(PORT, () => {
  console.log('\n============================================================');
  console.log(`🚀 SKILLIANT SERVER RUNNING ON: http://localhost:${PORT}`);
  console.log(`🔒 Twilio Verify Status: ${isTwilioConfigured() ? 'CONFIGURED & READY ✅' : 'DEV MODE (Mock Active) ⚠️'}`);
  console.log(`📄 Open Website: http://localhost:${PORT}`);
  console.log('============================================================\n');
});
