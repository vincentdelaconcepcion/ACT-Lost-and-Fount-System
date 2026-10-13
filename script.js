const lost=[
{id:'l-1',n:'Black umbrella',loc:'Library',d:'Oct 6, 2026',i:'☂️',t:'Folding, silver handle'},
{id:'l-2',n:'Scientific calculator',loc:'Classroom',floor:'2nd Floor',room:'204',d:'Oct 5, 2026',i:'🧮',t:'Casio, name written inside cover'},
{id:'l-3',n:'Gray backpack',loc:'Hallway',d:'Oct 3, 2026',i:'🎒',t:'Laptop sleeve, red zipper pull'},
{id:'l-5',n:'Prescription glasses',loc:'Library',d:'Sep 30, 2026',i:'👓',t:'Black frame, soft case'},
{id:'l-6',n:'Green notebook',loc:'Cafeteria',d:'Sep 29, 2026',i:'📓',t:'Green cover, name on first page'},
{id:'l-4',n:'USB flash drive',loc:'Computer Lab',d:'Oct 2, 2026',i:'💾',t:'16GB, blue casing'}];
const found=[
{id:'f-1',n:'Student ID card',loc:'Cafeteria',d:'Oct 7, 2026',i:'🪪',t:'Name hidden for privacy'},
{id:'f-2',n:'Scientific calculator',loc:'Classroom',floor:'2nd Floor',room:'204',d:'Oct 5, 2026',i:'🧮',t:'Black, scratched screen cover'},
{id:'f-3',n:'Gray backpack',loc:'Hallway',d:'Oct 4, 2026',i:'🎒',t:'Contains notebooks'},
{id:'f-5',n:'Black wallet',loc:'Hallway',d:'Sep 30, 2026',i:'👛',t:'Small, zipper closure'},
{id:'f-6',n:'Phone charger',loc:'Computer Lab',d:'Sep 28, 2026',i:'🔌',t:'White cable, 20W adapter'},
{id:'f-4',n:'Blue water bottle',loc:'Library',d:'Oct 1, 2026',i:'🧴',t:'Stainless, sticker on side'}];
const mine=[['ACT-LF-1024','Gray backpack','Lost','Match found'],['ACT-LF-1031','USB flash drive','Lost','Under review'],['ACT-LF-0990','Student ID card','Found','Released']];
const $=id=>document.getElementById(id);
const N={lost:3,found:3};
const place=x=>x.loc==='Classroom'&&x.room?`Classroom · ${x.floor}, Room ${x.room}`:x.loc;

function card(x,kind){return `<button data-open="${x.id}" class="flex w-full items-center gap-4 rounded-2xl border border-transparent bg-white p-5 text-left shadow-sm transition hover:border-act-yellow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-act-blue">
<span class="flex size-14 shrink-0 items-center justify-center rounded-xl bg-act-mist text-3xl">${x.i}</span>
<span class="min-w-0 flex-1"><span class="block text-2xl font-bold text-act-blue">${x.n}</span><span class="mt-1 block text-xl text-slate-500">📍 ${place(x)}</span><span class="mt-1 inline-block rounded-full bg-act-mist px-3 py-0.5 text-base font-semibold text-act-blue">📅 ${kind==='found'?'Retrieved':'Lost'}: ${x.d}</span><span class="mt-1 block truncate text-lg text-slate-400">${x.t}</span></span>
<span class="text-3xl text-act-blue">›</span></button>`}

function render(){
 const t=$('q').value.toLowerCase(),l=$('loc').value;
 const f=a=>a.filter(x=>(!l||x.loc===l)&&(x.n+x.t).toLowerCase().includes(t));
 const L=f(lost),F=f(found);
 const empty='<p class="rounded-2xl bg-white p-5 text-lg text-slate-500">Nothing matches yet. Try fewer words or another location.</p>';
 $('lostList').innerHTML=L.slice(0,N.lost).map(x=>card(x,'lost')).join('')||empty;
 $('foundList').innerHTML=F.slice(0,N.found).map(x=>card(x,'found')).join('')||empty;
 [['lost',L],['found',F]].forEach(([k,a])=>{const b=$(k+'More');b.classList.toggle('hidden',a.length<=3);b.textContent=N[k]>=a.length?'See less':'See more ('+(a.length-N[k])+' more)';});
 $('sLost').textContent=lost.length;$('sFound').textContent=found.length;
}

const badge={'Match found':'bg-act-yellow text-act-blue','Under review':'bg-act-mist text-act-blue','Released':'bg-slate-200 text-slate-600'};
$('mineBody').innerHTML=mine.map(r=>`<tr class="hover:bg-act-mist"><td class="px-5 py-3 font-semibold">${r[0]}</td><td class="px-5 py-3">${r[1]}</td><td class="px-5 py-3">${r[2]}</td><td class="px-5 py-3"><span class="rounded-full px-3 py-1 text-base font-bold ${badge[r[3]]}">${r[3]}</span></td></tr>`).join('');

['lost','found'].forEach(k=>$(k+'More').onclick=()=>{const total=(k==='lost'?lost:found).length;N[k]=N[k]>=total?3:N[k]+3;render();});
$('q').oninput=render;$('loc').onchange=render;

const dlg=$('dlg');
document.addEventListener('click',e=>{
 const o=e.target.closest('[data-open]');
 if(o){const x=[...lost,...found].find(i=>i.id===o.dataset.open),isF=x.id[0]==='f';
  $('dlgBody').innerHTML=`<div class="flex items-center gap-4"><span class="flex size-16 items-center justify-center rounded-xl bg-act-mist text-4xl">${x.i}</span><div><h3 class="text-2xl font-extrabold text-act-blue">${x.n}</h3><p class="text-lg text-slate-500">📍 ${isF?'Found':'Lost'} at ${place(x)}</p><p class="text-lg font-semibold text-act-blue">📅 ${isF?'Retrieved':'Date lost'}: ${x.d}</p></div></div>
  <p class="mt-4 text-lg text-slate-700">${x.t}</p>
  <p class="mt-3 rounded-lg bg-yellow-50 p-3 text-base text-slate-600">${isF?'Kept at the Student Services Office. Bring your school ID and describe one detail not listed here.':'Staff will compare this report with items handed in and email the owner on a match.'}</p>
  <div class="mt-5 flex gap-3"><button onclick="dlg.close()" class="w-1/3 rounded-lg border-2 border-slate-300 py-2 text-lg font-bold text-slate-600 hover:bg-slate-100">Close</button>
  <button onclick="this.textContent='Request sent ✓';this.disabled=true" class="w-2/3 rounded-lg bg-act-blue py-2 text-lg font-bold text-white transition hover:bg-act-dark">${isF?'Request to claim':'This looks like mine'}</button></div>`;
  dlg.showModal();}
 if(e.target.closest('[data-new]'))$('newDlg').showModal();
});

function roomToggle(){const on=$('nLoc').value==='Classroom',b=$('roomBox');b.classList.toggle('hidden',!on);b.classList.toggle('grid',on);$('nRoom').required=on;}
$('nLoc').onchange=roomToggle;

document.querySelectorAll('.bn').forEach(a=>a.addEventListener('click',()=>{
 document.querySelectorAll('.bn').forEach(x=>{x.classList.remove('border-act-yellow','text-act-blue');x.classList.add('border-transparent')});
 a.classList.remove('border-transparent');a.classList.add('border-act-yellow','text-act-blue');
}));

$('newClose').onclick=()=>$('newDlg').close();

document.querySelectorAll('.tt').forEach(b=>b.onclick=()=>{
 $('nDateLbl').textContent=b.dataset.t==='Lost'?'Date lost':'Date retrieved';
 document.querySelectorAll('.tt').forEach(x=>{const on=x===b;x.classList.toggle('bg-act-blue',on);x.classList.toggle('text-white',on);x.classList.toggle('text-act-blue',!on)});
});

$('newForm').onsubmit=e=>{e.preventDefault();
 const on=document.querySelector('.tt.bg-act-blue').dataset.t,n=$('nName').value;
 const it={id:(on==='Lost'?'l-':'f-')+Date.now(),n,loc:$('nLoc').value,d:new Date($('nDate').value+'T00:00').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}),i:'📦',t:'New report, pending review'};
 if(it.loc==='Classroom'){it.floor=$('nFloor').value;it.room=$('nRoom').value.trim();}
 (on==='Lost'?lost:found).unshift(it);
 const row=['ACT-LF-'+(1100+Math.floor(Math.random()*900)),n,on,'Under review'];mine.unshift(row);
 $('mineBody').insertAdjacentHTML('afterbegin',`<tr class="hover:bg-act-mist"><td class="px-5 py-3 font-semibold">${row[0]}</td><td class="px-5 py-3">${n}</td><td class="px-5 py-3">${on}</td><td class="px-5 py-3"><span class="rounded-full px-3 py-1 text-base font-bold ${badge['Under review']}">Under review</span></td></tr>`);
 e.target.reset();roomToggle();$('newDlg').close();render();location.hash='#mine';};

render();