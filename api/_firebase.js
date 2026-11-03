const admin = require('firebase-admin');

function getAdmin() {
  if (admin.apps.length) return admin;
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error('Konfigurasi backend belum lengkap: FIREBASE_SERVICE_ACCOUNT_JSON belum diatur di Vercel.');
  let serviceAccount;
  try { serviceAccount = JSON.parse(raw); }
  catch (_) { throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON bukan JSON yang valid.'); }
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
  return admin;
}

async function requireOwner(req) {
  const a = getAdmin();
  const header = req.headers.authorization || '';
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    const err = new Error('Silakan login sebagai Server terlebih dahulu.');
    err.status = 401; throw err;
  }
  const decoded = await a.auth().verifyIdToken(match[1]);
  if ((decoded.email || '').toLowerCase() !== 'zainudinxitkj@gmail.com') {
    const err = new Error('Hanya akun Server yang boleh mengelola akun.');
    err.status = 403; throw err;
  }
  return { admin: a, decoded };
}

module.exports = { getAdmin, requireOwner };
