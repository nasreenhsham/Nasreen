/* auth.js — sign up, sign in, log out (works for the separate pages and for index.html) */
const isSinglePage = () => !!$('screen-home');

function showMsg(el, text) {
  if (!el) return;
  el.textContent = text || '';
  el.classList.toggle('show', !!text);
}

function registerUser(name, email, password, market) {
  name = (name || '').trim(); email = (email || '').trim();
  if (!name || !email || !password) return 'errFill';
  if (!/^\S+@\S+\.\S+$/.test(email)) return 'errEmail';
  if (password.length < 6) return 'errPass';
  if (findUser(email)) return 'errExists';
  const users = getUsers();
  users.push({ name, email, password, market: market || 'Other', notes: '' });
  saveUsers(users);
  setSession(email);
  return null;
}

function loginUser(email, password) {
  const u = findUser(email);
  if (!u || u.password !== password) return 'errLogin';
  setSession(u.email);
  return null;
}

/* separate pages: signup.html / signin.html */
function handleSignup(e) {
  e.preventDefault();
  const err = registerUser($('name').value, $('email').value, $('password').value, $('market').value);
  if (err) return showMsg($('errorBox'), t(err));
  window.location.href = 'dashboard.html';
}
function handleSignin(e) {
  e.preventDefault();
  const err = loginUser($('email').value, $('password').value);
  if (err) return showMsg($('errorBox'), t(err));
  window.location.href = 'dashboard.html';
}

/* protect pages that need a login */
function requireLogin() {
  if (!currentUser()) { window.location.href = 'signin.html'; return false; }
  return true;
}

function logoutUser() {
  clearSession();
  if (isSinglePage() && typeof go === 'function') go('home');
  else window.location.href = 'index.html';
}
