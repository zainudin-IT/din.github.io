const { requireOwner } = require('../lib/firebase-admin');
const bcrypt = require('bcryptjs');

module.exports = async function handler(req, res) {
  try {
    const { admin, decoded } = await requireOwner(req);
    const ref = admin.firestore().collection('appData').doc('authAccounts');
    if (req.method === 'GET') {
      const snap = await ref.get();
      const data = snap.exists ? snap.data() : {};
      return res.status(200).json({
        adminUsername: data.admin && data.admin.username || 'admin',
        viewerUsername: data.viewer && data.viewer.username || 'viewer',
        initialized: !!(data.admin && data.admin.passwordHash && data.viewer && data.viewer.passwordHash)
      });
    }
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method tidak diizinkan.' });
    if ((decoded.email || '').toLowerCase() !== 'zainudinxitkj@gmail.com') {
      return res.status(403).json({ error: 'Hanya Server yang dapat menyimpan akun.' });
    }
    const body = req.body || {};
    const snap = await ref.get();
    const existing = snap.exists ? snap.data() : {};
    const next = {};
    for (const role of ['admin', 'viewer']) {
      const item = body[role] || {};
      const username = String(item.username || '').trim();
      const password = String(item.password || '');
      if (!/^[a-zA-Z0-9._-]{3,40}$/.test(username) || ['server','zainudin','robi','staf'].includes(username.toLowerCase()) || username.includes('@')) {
        return res.status(400).json({ error: 'Username ' + role + ' harus 3-40 karakter dan tidak boleh memakai username Server/akun lama atau alamat email.' });
      }
      const old = existing[role] || {};
      if (!old.passwordHash && password.length < 8) {
        return res.status(400).json({ error: 'Password awal ' + role + ' wajib minimal 8 karakter.' });
      }
      if (password && password.length < 8) {
        return res.status(400).json({ error: 'Password ' + role + ' minimal 8 karakter.' });
      }
      next[role] = {
        username,
        passwordHash: password ? await bcrypt.hash(password, 12) : old.passwordHash || ''
      };
    }
    if (next.admin.username.toLowerCase() === next.viewer.username.toLowerCase()) {
      return res.status(400).json({ error: 'Username Admin dan Viewer harus berbeda.' });
    }
    await ref.set({ ...next, updatedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: false });
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('account-manage:', error.message);
    return res.status(error.status || 500).json({ error: error.status ? error.message : 'Gagal mengelola akun. Periksa konfigurasi backend.' });
  }
};
