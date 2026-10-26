const USER = { name: 'Dela Concepcion, Vincent C.', sid: '24-2001090' };
const LOCS = ['Ground Floor', 'Library', 'Cafeteria', 'Computer Lab', 'Classroom', 'Hallway', '7th Floor', 'Parking', 'Innovation Center','Gymnasium'];
const FLOORS = [ '2nd Floor', '3rd Floor', '4th Floor', '6th Floor', '8th Floor', '9th Floor'];
const CATS = { Bag: '🎒', Card: '🪪', Electronics: '🔌', Clothing: '👕', Keys: '🔑', Books: '📓', Accessories: '👓', Other: '📦' };

const seed = {
  // p = picture path. Put your pictures in an "images" folder and change the file names here.
  lost: [
    { id: 'l-1', n: 'Black umbrella', c: 'Other', i: '☂️', p: 'images/umbrella.jpg', loc: 'Library', d: '2026-10-06', t: 'Folding, silver handle' },
    { id: 'l-2', n: 'Scientific calculator', c: 'Electronics', i: '🧮', p: 'images/calculator.jpg', loc: 'Classroom', floor: '2nd Floor', room: '204', d: '2026-10-05', t: 'Casio, name written inside cover' },
    { id: 'l-3', n: 'Gray backpack', c: 'Bag', p: 'images/backpack.jpg', loc: 'Hallway', d: '2026-10-03', t: 'Laptop sleeve, red zipper pull' },
    { id: 'l-4', n: 'USB flash drive', c: 'Electronics', i: '💾', p: 'images/flash-drive.jpg', loc: 'Computer Lab', d: '2026-10-02', t: '16GB, blue casing' },
    { id: 'l-5', n: 'Prescription glasses', c: 'Accessories', p: 'images/glasses.jpg', loc: 'Library', d: '2026-09-30', t: 'Black frame, soft case' },
    { id: 'l-6', n: 'Green notebook', c: 'Books', p: 'images/notebook.jpg', loc: 'Cafeteria', d: '2026-09-29', t: 'Green cover, name on first page' },
    { id: 'l-7', n: 'Red hoodie', c: 'Clothing', p: 'images/hoodie.jpg', loc: 'Gymnasium', d: '2026-09-27', t: 'Size M, ACT logo on the sleeve' },
    { id: 'l-8', n: 'House keys', c: 'Keys', p: 'images/keys.jpg', loc: 'Parking', d: '2026-09-26', t: 'Three keys on a silver ring' }
  ],
  found: [
    { id: 'f-1', n: 'Student ID card', c: 'Card', p: 'images/id-card.jpg', loc: 'Cafeteria', d: '2026-10-07', t: 'Name hidden for privacy' },
    { id: 'f-2', n: 'Scientific calculator', c: 'Electronics', i: '🧮', p: 'images/calculator.jpg', loc: 'Classroom', floor: '2nd Floor', room: '204', d: '2026-10-05', t: 'Black, scratched screen cover' },
    { id: 'f-3', n: 'Gray backpack', c: 'Bag', p: 'images/backpack.jpg', loc: 'Hallway', d: '2026-10-04', t: 'Contains notebooks' },
    { id: 'f-4', n: 'Blue water bottle', c: 'Other', i: '🧴', p: 'images/water-bottle.jpg', loc: 'Library', d: '2026-10-01', t: 'Stainless, sticker on side' },
    { id: 'f-5', n: 'Black wallet', c: 'Accessories', i: '👛', p: 'images/wallet.jpg', loc: 'Hallway', d: '2026-09-30', t: 'Small, zipper closure' },
    { id: 'f-6', n: 'Phone charger', c: 'Electronics', p: 'images/charger.jpg', loc: 'Computer Lab', d: '2026-09-28', t: 'White cable, 20W adapter' },
    { id: 'f-7', n: 'Black jacket', c: 'Clothing', p: 'images/jacket.jpg', loc: 'Innovation Center', d: '2026-09-27', t: 'Zip front, size L' },
    { id: 'f-8', n: 'Silver keys', c: 'Keys', p: 'images/keys.jpg', loc: 'Parking', d: '2026-09-26', t: 'Blue tag with a number on it' }
  ],
  mine: [
    ['ACT-LF-1042', 'Black umbrella', 'Lost', 'Under review'],
    ['ACT-LF-1038', 'Scientific calculator', 'Claim', 'Claim pending'],
    ['ACT-LF-1031', 'USB flash drive', 'Lost', 'Under review'],
    ['ACT-LF-1024', 'Gray backpack', 'Lost', 'Match found'],
    ['ACT-LF-1017', 'Black wallet', 'Found', 'Match reported'],
    ['ACT-LF-1005', 'House keys', 'Lost', 'Match found'],
    ['ACT-LF-0990', 'Student ID card', 'Found', 'Released'],
    ['ACT-LF-0974', 'Blue water bottle', 'Claim', 'Released']
  ]
};

/* ---------- storage ---------- */
let db;
try { db = JSON.parse(localStorage.getItem('actlf3')); } catch { db = null; }
db = db || structuredClone(seed);
const save = () => { try { localStorage.setItem('actlf3', JSON.stringify(db)); } catch { toast('Storage is full, so this report will not survive a refresh.'); } };

/* ---------- helpers ---------- */
const $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = d => new Date(d + 'T00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const place = x => x.loc === 'Classroom' && x.room ? `Classroom · ${x.floor}, Room ${x.room}` : x.loc;
const emoji = x => x.i || CATS[x.c] || '📦';
const icon = x => x.p ? `<img src="${x.p}" alt="" onerror="this.replaceWith(document.createTextNode('${emoji(x)}'))" class="size-full rounded-xl object-cover">` : emoji(x);
const ref = () => 'ACT-LF-' + (1100 + Math.floor(Math.random() * 9000));
const opts = a => a.map(v => `<option>${esc(v)}</option>`).join('');
let toastTimer;
function toast(msg) { const t = $('toast'); t.textContent = msg; t.classList.remove('hidden'); clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.add('hidden'), 3500); }

/* ---------- fill dropdowns ---------- */
$('loc').innerHTML = '<option value="">All locations</option>' + opts(LOCS);
$('cat').innerHTML = '<option value="">All categories</option>' + opts(Object.keys(CATS));
$('nLoc').innerHTML = opts(LOCS);
$('nCat').innerHTML = opts(Object.keys(CATS));
$('nFloor').innerHTML = opts(FLOORS);
$('nDate').max = new Date().toISOString().slice(0, 10);

/* ---------- matching ---------- */
const words = s => s.toLowerCase().split(/\W+/).filter(w => w.length > 3);
function getMatches() {
  const out = [];
  db.lost.forEach(l => db.found.forEach(f => {
    const s = (l.c === f.c ? 2 : 0) + (words(l.n).some(w => words(f.n).includes(w)) ? 2 : 0) + (l.loc === f.loc ? 1 : 0);
    if (s >= 4) out.push({ l, f });
  }));
  return out;
}

/* ---------- render ---------- */
const N = { lost: 3, found: 3 };
const badge = {
  'Match found': 'bg-act-yellow text-act-blue', 'Under review': 'bg-act-mist text-act-blue',
  'Claim pending': 'bg-act-yellow text-act-blue', 'Match reported': 'bg-act-mist text-act-blue', 'Released': 'bg-slate-200 text-slate-600'
};

/* NEW card layout: white picture tile on the left, gray-blue text panel on the right */
function card(x, kind) {
  const media = `<span class="flex size-full items-center justify-center text-7xl">${x.p ? `<img src="${x.p}" alt="" onerror="this.replaceWith(document.createTextNode('${emoji(x)}'))" class="size-full object-contain">` : emoji(x)}</span>`;
  return `<button data-open="${x.id}" class="flex min-h-44 w-full items-stretch overflow-hidden rounded-3xl border-2 border-transparent bg-[#C9D2DE] text-left shadow-sm transition hover:border-act-yellow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-act-blue">
<span class="flex w-32 shrink-0 items-center justify-center bg-white p-3 sm:w-52">${media}</span>
<span class="flex min-w-0 flex-1 flex-col justify-center gap-1 p-5"><span class="block text-2xl font-bold text-act-blue">${esc(x.n)}</span><span class="block text-xl text-slate-700">📍 ${esc(place(x))}</span><span class="inline-block self-start rounded-full bg-act-mist px-3 py-0.5 text-base font-semibold text-act-blue">📅 ${kind === 'found' ? 'Retrieved' : 'Lost'}: ${fmt(x.d)}</span><span class="block truncate text-lg text-slate-600">${esc(x.t)}</span></span>
<span class="flex items-center pr-5 text-3xl text-act-blue">›</span></button>`;
}

function render() {
  const t = $('q').value.toLowerCase().trim(), l = $('loc').value, c = $('cat').value, s = $('sort').value;
  const cmp = { new: (a, b) => b.d.localeCompare(a.d), old: (a, b) => a.d.localeCompare(b.d), az: (a, b) => a.n.localeCompare(b.n) }[s];
  const f = a => a.filter(x => (!l || x.loc === l) && (!c || x.c === c) && [x.n, x.t, x.loc, x.c].join(' ').toLowerCase().includes(t)).sort(cmp);
  const L = f(db.lost), F = f(db.found);
  const empty = '<p class="rounded-2xl bg-white p-5 text-lg text-slate-500">Nothing matches. Try fewer words, or clear the filters.</p>';
  $('lostList').innerHTML = L.slice(0, N.lost).map(x => card(x, 'lost')).join('') || empty;
  $('foundList').innerHTML = F.slice(0, N.found).map(x => card(x, 'found')).join('') || empty;
  [['lost', L], ['found', F]].forEach(([k, a]) => {
    const b = $(k + 'More');
    b.classList.toggle('hidden', a.length <= 3);
    b.textContent = N[k] >= a.length ? 'See less' : `See more (${a.length - N[k]} more)`;
  });

  const M = getMatches();
  if ($('matchList')) $('matchList').innerHTML = M.map(({ l, f }) => `<div class="flex items-center gap-4 rounded-xl bg-act-mist p-4"><span class="flex size-12 shrink-0 items-center justify-center text-4xl">${icon(l)}</span><div class="min-w-0 flex-1"><p class="text-xl font-bold text-act-blue">${esc(l.n)}</p><p class="text-base text-slate-500">Lost report may match a found item at ${esc(place(f))}</p></div><button data-open="${f.id}" class="rounded-lg bg-act-blue px-4 py-2 text-base font-bold text-white transition hover:bg-act-dark">Review</button></div>`).join('')
    || '<p class="text-lg text-slate-500">No matches yet. We check again whenever a new report is added.</p>';

  if ($('sLost')) $('sLost').textContent = db.lost.length;
  if ($('sFound')) $('sFound').textContent = db.found.length;
  if ($('sMatch')) $('sMatch').textContent = M.length;
  if ($('sBack')) $('sBack').textContent = db.mine.filter(r => r[3] === 'Released').length;
  $('mineBody').innerHTML = db.mine.map(r => `<tr class="hover:bg-act-mist"><td class="px-5 py-3 font-semibold">${esc(r[0])}</td><td class="px-5 py-3">${esc(r[1])}</td><td class="px-5 py-3">${esc(r[2])}</td><td class="px-5 py-3"><span class="rounded-full px-3 py-1 text-base font-bold ${badge[r[3]] || badge['Under review']}">${esc(r[3])}</span></td></tr>`).join('');
}

['lost', 'found'].forEach(k => $(k + 'More').onclick = () => { const n = db[k].length; N[k] = N[k] >= n ? 3 : N[k] + 3; render(); });
['q'].forEach(i => $(i).oninput = render);
['loc', 'cat', 'sort'].forEach(i => $(i).onchange = render);

/* ---------- item pop-up + claim ---------- */
const dlg = $('dlg'), newDlg = $('newDlg');
function openItem(id) {
  const x = [...db.lost, ...db.found].find(i => i.id === id); if (!x) return;
  const isF = x.id[0] === 'f';
  $('dlgBody').innerHTML = `<div class="flex items-center gap-4"><span class="flex size-16 shrink-0 items-center justify-center rounded-xl bg-act-mist text-4xl">${icon(x)}</span><div><h3 class="text-2xl font-extrabold text-act-blue">${esc(x.n)}</h3><p class="text-lg text-slate-500">📍 ${isF ? 'Found' : 'Lost'} at ${esc(place(x))}</p><p class="text-lg font-semibold text-act-blue">📅 ${isF ? 'Retrieved' : 'Date lost'}: ${fmt(x.d)}</p></div></div>
<p class="mt-4 text-lg text-slate-700">${esc(x.t)}</p>
${isF ? `<label for="proof" class="mt-4 block text-base font-semibold text-slate-700">Describe one detail that is not shown in the listing</label><textarea id="proof" rows="2" class="fld"></textarea><p class="mt-2 rounded-lg bg-yellow-50 p-3 text-base text-slate-600">Kept at the Student Services Office. Bring your school ID when you pick it up.</p>`
: '<p class="mt-3 rounded-lg bg-yellow-50 p-3 text-base text-slate-600">Staff will compare this report with items handed in and contact the owner on a match.</p>'}
<div class="mt-5 flex gap-3"><button onclick="dlg.close()" class="w-1/3 rounded-lg border-2 border-slate-300 py-2 text-lg font-bold text-slate-600 hover:bg-slate-100">Close</button>
<button data-claim="${x.id}" class="w-2/3 rounded-lg bg-act-blue py-2 text-lg font-bold text-white transition hover:bg-act-dark">${isF ? 'Request to claim' : 'I found this item'}</button></div>`;
  dlg.showModal();
}
function claim(id) {
  const x = [...db.lost, ...db.found].find(i => i.id === id), isF = id[0] === 'f', p = $('proof');
  if (isF && !p.value.trim()) { p.focus(); return toast('Describe a detail that proves the item is yours.'); }
  db.mine.unshift([ref(), x.n, isF ? 'Claim' : 'Found', isF ? 'Claim pending' : 'Match reported']);
  save(); dlg.close(); render(); toast(isF ? 'Claim sent. Staff will review it.' : 'Thanks. Staff have been told.');
}

/* ---------- new report ---------- */
let type = 'Lost', photo = '';
function setType(t) {
  type = t;
  $('nDateLbl').textContent = t === 'Lost' ? 'Date lost' : 'Date found';
  document.querySelectorAll('.tt').forEach(b => {
    const on = b.dataset.t === t;
    b.classList.toggle('bg-act-blue', on); b.classList.toggle('text-white', on); b.classList.toggle('text-act-blue', !on);
  });
}
function roomToggle() { const on = $('nLoc').value === 'Classroom', b = $('roomBox'); b.classList.toggle('hidden', !on); b.classList.toggle('grid', on); $('nRoom').required = on; }
function openNew(t) {
  $('newForm').reset(); photo = ''; $('prev').classList.add('hidden');
  $('nStudent').value = USER.name; $('nSid').value = USER.sid;
  setType(t || 'Lost'); roomToggle(); newDlg.showModal();
}
$('nLoc').onchange = roomToggle;
document.querySelectorAll('.tt').forEach(b => b.onclick = () => setType(b.dataset.t));
$('newClose').onclick = () => newDlg.close();

$('nPhoto').onchange = e => {
  const file = e.target.files[0]; if (!file) return;
  if (!file.type.startsWith('image/')) { e.target.value = ''; return toast('Please choose an image file.'); }
  const r = new FileReader();
  r.onload = () => {
    const im = new Image();
    im.onload = () => {
      const k = Math.min(1, 500 / Math.max(im.width, im.height)), c = document.createElement('canvas');
      c.width = im.width * k; c.height = im.height * k;
      c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
      photo = c.toDataURL('image/jpeg', 0.7);
      $('prev').src = photo; $('prev').classList.remove('hidden');
    };
    im.src = r.result;
  };
  r.readAsDataURL(file);
};

$('newForm').onsubmit = e => {
  e.preventDefault();
  if (!/^[0-9+\-\s]{7,15}$/.test($('nPhone').value.trim())) return toast('Enter a valid contact number.');
  if ($('nDate').value > $('nDate').max) return toast('The date cannot be in the future.');
  const key = type.toLowerCase();
  const it = { id: key[0] + '-' + Date.now(), n: $('nName').value.trim(), c: $('nCat').value, loc: $('nLoc').value, d: $('nDate').value, t: $('nDesc').value.trim(), p: photo };
  if (db[key].some(x => x.n.toLowerCase() === it.n.toLowerCase() && x.loc === it.loc && x.d === it.d)) return toast('This looks like a duplicate of an existing report.');
  if (it.loc === 'Classroom') { it.floor = $('nFloor').value; it.room = $('nRoom').value.trim(); }
  db[key].unshift(it);
  db.mine.unshift([ref(), it.n, type, 'Under review']);
  save(); newDlg.close(); render(); toast('Report submitted. Staff will review it.'); location.hash = '#mine';
};

/* ---------- clicks, nav, dialogs ---------- */
document.addEventListener('click', e => {
  const o = e.target.closest('[data-open]'); if (o) return openItem(o.dataset.open);
  const c = e.target.closest('[data-claim]'); if (c) return claim(c.dataset.claim);
  const n = e.target.closest('[data-new]'); if (n) return openNew(n.dataset.new);
  const g = e.target.closest('[data-go]'); if (g) return $(g.dataset.go).scrollIntoView({ behavior: 'smooth' });
});
[dlg, newDlg].forEach(d => d.addEventListener('click', e => {
  const r = d.getBoundingClientRect();
  if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) d.close();
}));
document.querySelectorAll('.bn').forEach(a => a.addEventListener('click', () => {
  document.querySelectorAll('.bn').forEach(x => { x.classList.remove('border-act-yellow', 'text-act-blue'); x.classList.add('border-transparent'); });
  a.classList.remove('border-transparent'); a.classList.add('border-act-yellow', 'text-act-blue');
}));

render();