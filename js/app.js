/* app.js — calculator, records, CSV, account, and the single-page navigation for index.html */
const money = n => 'TZS ' + Math.round(Number(n) || 0).toLocaleString('en-US');
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
let lastCalc = null;

/* ---------- dashboard ---------- */
function greetUser() {
  const u = currentUser(), el = $('greetName');
  if (u && el) el.textContent = u.name.split(' ')[0];
}
function updateStats() {
  const list = getRecords();
  if ($('statCount')) $('statCount').textContent = list.length;
  if ($('statProfit')) $('statProfit').textContent = money(list.reduce((s, r) => s + r.profit, 0));
}

/* ---------- calculator ---------- */
function calculatePrice() {
  const item = $('item').value.trim();
  const purchase = parseFloat($('purchase').value);
  const transport = parseFloat($('transport').value) || 0;
  const entered = parseFloat($('desiredProfit').value) || 0;
  const type = $('profitType').value;
  showMsg($('calcSuccess'), '');
  lastCalc = null;

  if (!item) return showMsg($('calcError'), t('errItem'));
  if (isNaN(purchase) || purchase <= 0 || transport < 0 || entered < 0) return showMsg($('calcError'), t('errNum'));
  showMsg($('calcError'), '');

  const cost = purchase + transport;
  const profit = type === 'percent' ? cost * entered / 100 : entered;
  const selling = cost + profit;
  lastCalc = { item, purchase, transport, profit, cost, selling };

  $('outCost').textContent = money(cost);
  $('outSell').textContent = money(selling);
  $('outProfit').textContent = money(profit);
  $('resultBox').style.display = 'block';
}

function saveLastCalc() {
  if (!lastCalc) return showMsg($('calcError'), t('errCalc'));
  const list = getRecords();
  list.push(Object.assign({ id: Date.now() + Math.random().toString(16).slice(2, 6), date: new Date().toISOString().slice(0, 10) }, lastCalc));
  saveRecords(list);
  showMsg($('calcError'), '');
  showMsg($('calcSuccess'), t('okSaved'));
  lastCalc = null;
  ['item', 'purchase', 'transport', 'desiredProfit'].forEach(id => { $(id).value = ''; });
  $('resultBox').style.display = 'none';
}

/* ---------- records ---------- */
function renderRecords(filter) {
  const body = $('recordRows');
  if (!body) return;
  filter = String(filter || '').trim().toLowerCase();
  const list = getRecords().filter(r => r.item.toLowerCase().includes(filter));
  $('emptyRecords').style.display = list.length ? 'none' : 'block';
  body.innerHTML = list.map(r => `<tr>
    <td>${esc(r.date)}</td><td>${esc(r.item)}</td><td>${money(r.purchase)}</td><td>${money(r.transport)}</td>
    <td><strong>${money(r.selling)}</strong></td><td>${money(r.profit)}</td>
    <td><button type="button" onclick="deleteRecord('${esc(r.id)}')">${t('del')}</button></td></tr>`).join('');
}
function deleteRecord(id) {
  saveRecords(getRecords().filter(r => r.id !== id));
  renderRecords(($('search') || {}).value);
  updateStats();
  showMsg(pick('successBox', 'recSuccess'), t('okDeleted'));
}

/* ---------- CSV ---------- */
function csvCell(v) { v = String(v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }
function exportRecords() {
  const rows = [['Date', 'Item', 'Purchase', 'Transport', 'Profit', 'Selling']];
  getRecords().forEach(r => rows.push([r.date, r.item, r.purchase, r.transport, r.profit, r.selling]));
  const csv = rows.map(r => r.map(csvCell).join(',')).join('\r\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv' }));
  a.download = 'beismart-records.csv';
  document.body.appendChild(a); a.click(); a.remove();
}
function parseCSV(text) {
  const rows = []; let row = [], cell = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') q = false;
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(cell); cell = ''; rows.push(row); row = [];
    } else cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows.filter(r => r.some(x => x.trim() !== ''));
}
function importRecords(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const rows = parseCSV(String(reader.result).replace(/^﻿/, ''));
    const box = pick('successBox', 'recSuccess');
    const good = rows.slice(1).filter(r => r.length >= 6 && r[1].trim() && !isNaN(parseFloat(r[2])));
    if (!good.length) { showMsg(box, t('errCsv')); return; }
    const list = getRecords();
    good.forEach(r => {
      const purchase = parseFloat(r[2]) || 0, transport = parseFloat(r[3]) || 0, profit = parseFloat(r[4]) || 0;
      list.push({ id: Date.now() + Math.random().toString(16).slice(2, 6), date: r[0] || new Date().toISOString().slice(0, 10),
        item: r[1].trim(), purchase, transport, profit, cost: purchase + transport,
        selling: parseFloat(r[5]) || purchase + transport + profit });
    });
    saveRecords(list);
    renderRecords(($('search') || {}).value);
    updateStats();
    showMsg(box, good.length + ' ' + t('okImport'));
  };
  reader.readAsText(file);
  e.target.value = '';
}

/* ---------- account ---------- */
function fillAccountForm() {
  const u = currentUser();
  if (!u) return;
  pick('name', 'accName').value = u.name;
  pick('email', 'accEmail').value = u.email;
  pick('market', 'accMarket').value = u.market;
  pick('notes', 'accNotes').value = u.notes || '';
  pick('password', 'accPassword').value = '';
}
function saveAccount(e) {
  e.preventDefault();
  const errBox = pick('errorBox', 'accError'), okBox = pick('successBox', 'accSuccess');
  const name = pick('name', 'accName').value.trim();
  const pw = pick('password', 'accPassword').value;
  showMsg(okBox, '');
  if (!name) return showMsg(errBox, t('errFill'));
  if (pw && pw.length < 6) return showMsg(errBox, t('errPass'));
  const users = getUsers(), u = users.find(x => x.email.toLowerCase() === getSession().toLowerCase());
  u.name = name;
  u.market = pick('market', 'accMarket').value;
  u.notes = pick('notes', 'accNotes').value;
  if (pw) u.password = pw;
  saveUsers(users);
  pick('password', 'accPassword').value = '';
  showMsg(errBox, '');
  showMsg(okBox, t('okAccount'));
  greetUser();
}

/* ---------- single page (index.html) ---------- */
const APP_VIEWS = ['menu', 'calculate', 'records', 'account'];
const VIEW_TITLE = { menu: 'dashboard', calculate: 'calculate', records: 'records', account: 'account' };
let currentView = 'home';

function go(name) {
  const isApp = APP_VIEWS.includes(name);
  if (isApp && !currentUser()) name = 'signin';
  currentView = name;
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('show'));
  if (APP_VIEWS.includes(name)) {
    $('screen-app').classList.add('show');
    document.querySelectorAll('.view').forEach(v => v.classList.remove('show'));
    $('view-' + name).classList.add('show');
    APP_VIEWS.forEach(v => $('nav-' + v).classList.toggle('active', v === name));
    $('pageTitle').textContent = t(VIEW_TITLE[name]);
    if (name === 'menu') { greetUser(); updateStats(); }
    if (name === 'records') { $('search').value = ''; renderRecords(''); }
    if (name === 'account') fillAccountForm();
  } else {
    $('screen-' + name).classList.add('show');
  }
  window.scrollTo(0, 0);
}
function doSignup(e) {
  e.preventDefault();
  const err = registerUser($('signupName').value, $('signupEmail').value, $('signupPassword').value, $('signupMarket').value);
  if (err) return showMsg($('signupError'), t(err));
  showMsg($('signupError'), '');
  go('menu');
}
function doSignin(e) {
  e.preventDefault();
  const err = loginUser($('signinEmail').value, $('signinPassword').value);
  if (err) return showMsg($('signinError'), t(err));
  showMsg($('signinError'), '');
  go('menu');
}
function doLogout() { logoutUser(); }

/* re-draw text that is built by JavaScript when the language changes */
function onLangChange() {
  if (isSinglePage() && APP_VIEWS.includes(currentView)) $('pageTitle').textContent = t(VIEW_TITLE[currentView]);
  if ($('recordRows')) renderRecords(($('search') || {}).value);
}

if (isSinglePage()) {
  applyLang();
  go(currentUser() ? 'menu' : 'home');
}
