/* lang.js — English / Kiswahili */
const TEXT = {
  en: {
    brand: 'BeiSmart', home: 'Home', signin: 'Sign in', signup: 'Sign up',
    kicker: 'Dar es Salaam informal vendors',
    heroTitle: 'Price your goods with a clear formula.',
    heroText: 'Enter purchase price, transport cost and the profit you want. The program calculates a selling price you can explain to a customer.',
    start: 'Create account', name: 'Full name', email: 'Email', password: 'Password',
    market: 'Market / area', haveAccount: 'Already have an account? Sign in',
    noAccount: 'New here? Create an account', welcome: 'Welcome', weekLabel: 'Student sample — Weeks 1 to 9',
    dashboard: 'Menu', dashIntro: 'Choose a task from the menu.', calculate: 'Price calculator',
    records: 'Saved records', account: 'My account', logout: 'Log out', profit: 'Profit',
    language: 'Language', calcHelp: 'Selling price = purchase + transport + profit.',
    item: 'Item name', purchase: 'Purchase price (TZS)', transport: 'Transport cost (TZS)',
    profitType: 'Profit type', desiredProfit: 'Desired profit', compute: 'Calculate selling price',
    saveRecord: 'Save this record', totalCost: 'Total cost', sellingPrice: 'Suggested selling price',
    recHelp: 'Records are stored on this computer.', search: 'Search item',
    exportCsv: 'Download CSV', importCsv: 'Load CSV file', noRecords: 'No records yet.',
    location: 'Where you sell', notes: 'Notes from vendors / feedback', saveAccount: 'Save account details',
    del: 'Delete',
    errFill: 'Please fill in all fields.', errEmail: 'Enter a valid email address.',
    errPass: 'Password must be at least 6 characters.', errExists: 'This email is already registered.',
    errLogin: 'Wrong email or password.', errItem: 'Enter the item name.',
    errNum: 'Enter valid numbers (0 or more). Purchase price must be above 0.',
    errCalc: 'Calculate the price first, then save.', errCsv: 'Could not read that CSV file.',
    okSaved: 'Record saved.', okAccount: 'Account details saved.', okDeleted: 'Record deleted.',
    okImport: 'records loaded from CSV.'
  },
  sw: {
    brand: 'BeiSmart', home: 'Mwanzo', signin: 'Ingia', signup: 'Jisajili',
    kicker: 'Wauzaji wadogo wa Dar es Salaam',
    heroTitle: 'Panga bei ya bidhaa zako kwa fomula iliyo wazi.',
    heroText: 'Weka bei ya kununua, gharama ya usafiri na faida unayotaka. Programu inakokotoa bei ya kuuzia unayoweza kumweleza mteja.',
    start: 'Fungua akaunti', name: 'Jina kamili', email: 'Barua pepe', password: 'Nenosiri',
    market: 'Soko / eneo', haveAccount: 'Tayari una akaunti? Ingia',
    noAccount: 'Mgeni? Fungua akaunti', welcome: 'Karibu', weekLabel: 'Mfano wa mwanafunzi — Wiki 1 hadi 9',
    dashboard: 'Menyu', dashIntro: 'Chagua kazi kutoka kwenye menyu.', calculate: 'Kikokotoo cha bei',
    records: 'Rekodi zilizohifadhiwa', account: 'Akaunti yangu', logout: 'Toka', profit: 'Faida',
    language: 'Lugha', calcHelp: 'Bei ya kuuzia = ununuzi + usafiri + faida.',
    item: 'Jina la bidhaa', purchase: 'Bei ya kununua (TZS)', transport: 'Gharama ya usafiri (TZS)',
    profitType: 'Aina ya faida', desiredProfit: 'Faida unayotaka', compute: 'Kokotoa bei ya kuuzia',
    saveRecord: 'Hifadhi rekodi hii', totalCost: 'Gharama jumla', sellingPrice: 'Bei ya kuuzia inayopendekezwa',
    recHelp: 'Rekodi zimehifadhiwa kwenye kompyuta hii.', search: 'Tafuta bidhaa',
    exportCsv: 'Pakua CSV', importCsv: 'Pakia faili la CSV', noRecords: 'Hakuna rekodi bado.',
    location: 'Unapouzia', notes: 'Maoni kutoka kwa wauzaji', saveAccount: 'Hifadhi taarifa za akaunti',
    del: 'Futa',
    errFill: 'Tafadhali jaza sehemu zote.', errEmail: 'Weka barua pepe sahihi.',
    errPass: 'Nenosiri liwe na herufi angalau 6.', errExists: 'Barua pepe hii tayari imesajiliwa.',
    errLogin: 'Barua pepe au nenosiri si sahihi.', errItem: 'Weka jina la bidhaa.',
    errNum: 'Weka namba sahihi (0 au zaidi). Bei ya kununua iwe zaidi ya 0.',
    errCalc: 'Kokotoa bei kwanza, kisha hifadhi.', errCsv: 'Imeshindwa kusoma faili hilo la CSV.',
    okSaved: 'Rekodi imehifadhiwa.', okAccount: 'Taarifa za akaunti zimehifadhiwa.', okDeleted: 'Rekodi imefutwa.',
    okImport: 'rekodi zimepakiwa kutoka CSV.'
  }
};

function currentLang() {
  const l = readJSON(KEYS.lang, 'en');
  return l === 'sw' ? 'sw' : 'en';
}
function t(key) { return (TEXT[currentLang()] || TEXT.en)[key] || TEXT.en[key] || key; }

function applyLang() {
  document.documentElement.lang = currentLang();
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.getAttribute('data-i18n')); });
  const label = currentLang() === 'en' ? 'SW' : 'EN';
  ['langLabel', 'langHome'].forEach(id => { const b = $(id); if (b) b.textContent = label; });
}

function toggleLang() {
  writeJSON(KEYS.lang, currentLang() === 'en' ? 'sw' : 'en');
  applyLang();
  if (typeof onLangChange === 'function') onLangChange();
}
