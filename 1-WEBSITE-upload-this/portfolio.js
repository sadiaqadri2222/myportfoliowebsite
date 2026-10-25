(()=>{
const P=window.PROJECTS,C=Object.fromEntries(window.CATEGORIES);
const ICON={research:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',clinical:'<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',community:'<circle cx="9" cy="8" r="4"/><path d="M2 21c0-4 3-6 7-6s7 2 7 6M17 4a4 4 0 0 1 0 8M22 21c0-3-2-5-4-5.5"/>',training:'<circle cx="12" cy="9" r="6"/><path d="M8.5 14 7 22l5-3 5 3-1.5-8"/>',leadership:'<path d="M5 21V4m0 0h12l-2 4 2 4H5"/>'};
const vis=p=>p.img?`<img src="${p.img}" alt="${p.title}" loading="lazy">`:`<div class="im" style="background:linear-gradient(135deg,${p.c[0]},${p.c[1]})"></div><svg viewBox="0 0 24 24" aria-hidden="true">${ICON[p.cat]}</svg>`;
const grid=document.getElementById('pgrid'),tabs=document.getElementById('tabs'),count=document.getElementById('count');
let cur='all',list=P.slice(),idx=0;
grid.innerHTML=P.map(p=>`<button class="pcard" data-id="${p.id}" data-cat="${p.cat}"><div class="thumb">${vis(p)}<span class="chip">${C[p.cat]}</span></div><div class="pbody"><h3>${p.title}</h3><p>${p.short}</p></div></button>`).join('');
const cards=[...grid.children];
tabs.innerHTML='<span class="pill"></span><button class="on" data-f="all">All work</button>'+window.CATEGORIES.map(c=>`<button data-f="${c[0]}">${c[1]}</button>`).join('');
const pill=tabs.querySelector('.pill');
const movePill=()=>{const b=tabs.querySelector('.on');pill.style.width=b.offsetWidth+'px';pill.style.transform=`translateX(${b.offsetLeft}px)`};
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
const render=(first)=>{
 const go=()=>{let n=0;list=[];cards.forEach(c=>{const ok=cur==='all'||c.dataset.cat===cur;c.hidden=!ok;if(ok){list.push(P.find(p=>p.id==c.dataset.id));c.style.setProperty('--d',(n++%3)*.1+'s');io.observe(c)}});
 count.textContent=list.length+(list.length===1?' project':' projects')};
 if(first){go();return}
 cards.forEach(c=>{c.classList.remove('in');io.unobserve(c)});
 setTimeout(go,380);
};
tabs.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||b.dataset.f===cur)return;tabs.querySelector('.on').classList.remove('on');b.classList.add('on');cur=b.dataset.f;movePill();b.scrollIntoView({inline:'center',block:'nearest',behavior:'smooth'});render()});
addEventListener('resize',movePill);
document.fonts&&document.fonts.ready.then(movePill);
movePill();render(true);
/* lightbox */
const lb=document.getElementById('lb'),box=lb.querySelector('.lbbox');let opener;
const fill=()=>{const p=list[idx];document.getElementById('lbimg').innerHTML=vis(p);document.getElementById('lbcat').textContent=C[p.cat];document.getElementById('lbt').textContent=p.title;document.getElementById('lbm').textContent=p.meta;document.getElementById('lbd').textContent=p.long;{let x=lb.querySelector('.xm');if(!x){x=document.createElement('div');x.className='xm';document.getElementById('lbd').after(x)}x.innerHTML=window.siteMedia?siteMedia(p.more):''}box.scrollTop=0};
const open=(id,el)=>{idx=list.findIndex(p=>p.id==id);fill();opener=el;lb.classList.add('open');lb.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';lb.querySelector('.lbc').focus()};
const close=()=>{lb.classList.remove('open');lb.setAttribute('aria-hidden','true');document.body.style.overflow='';opener&&opener.focus()};
const step=d=>{idx=(idx+d+list.length)%list.length;fill()};
grid.addEventListener('click',e=>{const c=e.target.closest('.pcard');if(c)open(c.dataset.id,c)});
lb.addEventListener('click',e=>{if(e.target===lb||e.target.closest('.lbc'))close();if(e.target.id==='prev')step(-1);if(e.target.id==='next')step(1)});
addEventListener('keydown',e=>{if(!lb.classList.contains('open'))return;if(e.key==='Escape')close();if(e.key==='ArrowRight')step(1);if(e.key==='ArrowLeft')step(-1)});
})();
