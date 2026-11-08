const { getAdmin } = require('../lib/firebase-admin');
const bcrypt = require('bcryptjs');
const applyCors = require('../lib/cors');

module.exports = async function handler(req, res) {
  if (applyCors(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method tidak diizinkan.' });
  try {
    const a = getAdmin();
    const body = req.body || {};
    const username = String(body.username || '').trim();
    const password = String(body.password || '');
    if (!username || !password || username.length > 40 || password.length > 200) {
      return res.status(400).json({ error: 'Username atau password tidak valid.' });
    }
    // Keep password hashes outside appData, which may be readable by app users.
    const ref = a.firestore().collection('privateAuth').doc('accounts');
    const snap = await ref.get();
    if (!snap.exists) return res.status(401).json({ error: 'Akun username belum disiapkan oleh Server melalui menu Pengaturan.' });
    const accounts = snap.data() || {};
    const normalized = username.toLowerCase();
    const match = ['admin', 'viewer'].find(role => {
      const item = accounts[role] || {};
      return String(item.username || '').toLowerCase() === normalized;
    });
    if (!match) return res.status(401).json({ error: 'Username atau password salah.' });
    const account = accounts[match];
    const valid = account.passwordHash && await bcrypt.compare(password, account.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Username atau password salah.' });

    const uid = match === 'admin' ? 'radiotrackpro_admin' : 'radiotrackpro_viewer';
    await a.firestore().collection('users').doc(uid).set({
      username: account.username, role: match, authType: 'username', updatedAt: a.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    const token = await a.auth().createCustomToken(uid, { role: match, username: account.username });
    return res.status(200).json({ token });
  } catch (error) {
    console.error('account-login:', error.message);
    return res.status(error.status || 500).json({ error: error.status ? error.message : 'Layanan login username sedang bermasalah. Periksa konfigurasi backend.' });
  }
};
