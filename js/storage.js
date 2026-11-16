/* storage.js — everything saved in the browser (localStorage) */
const KEYS = { users: 'bs_users', session: 'bs_session', lang: 'bs_lang', records: 'bs_records_' };

function $(id) { return document.getElementById(id); }
function pick() { for (const id of arguments) { const el = $(id); if (el) return el; } return null; }

function readJSON(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch (e) { return fallback; }
}
function writeJSON(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
}

/* users — a demo account is created the first time the program runs */
function getUsers() {
  let users = readJSON(KEYS.users, null);
  if (!users) {
    users = [{ name: 'Demo Vendor', email: 'vendor@dsm.tz', password: '123456', market: 'Kariakoo', notes: '' }];
    writeJSON(KEYS.users, users);
  }
  return users;
}
function saveUsers(users) { writeJSON(KEYS.users, users); }
function findUser(email) {
  email = String(email || '').trim().toLowerCase();
  return getUsers().find(u => u.email.toLowerCase() === email) || null;
}

/* session */
function getSession() { return readJSON(KEYS.session, null); }
function setSession(email) { writeJSON(KEYS.session, email); }
function clearSession() { try { localStorage.removeItem(KEYS.session); } catch (e) {} }
function currentUser() { const e = getSession(); return e ? findUser(e) : null; }

/* records — one list per user */
function getRecords() {
  const e = getSession();
  return e ? readJSON(KEYS.records + e.toLowerCase(), []) : [];
}
function saveRecords(list) {
  const e = getSession();
  if (e) writeJSON(KEYS.records + e.toLowerCase(), list);
}
