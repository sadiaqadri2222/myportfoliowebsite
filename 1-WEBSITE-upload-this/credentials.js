(()=>{
const S=window.CRED_SECTIONS,D=window.CREDS;
const I={pub:'<path d="M2 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H2zM22 4h-7a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h8z"/>',reg:'<path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5z"/><path d="m9 12 2 2 4-4"/>',edu:'<path d="M22 10 12 5 2 10l10 5z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/>',msk:'<circle cx="12" cy="9" r="6"/><path d="M8.5 14 7 22l5-3 5 3-1.5-8"/>',ph:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z"/>',cme:'<path d="M22 10 12 5 2 10l10 5z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/>',skill:'<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',honour:'<path d="m12 2 3 6.5 7 .8-5.2 4.8 1.4 7L12 17.6 5.8 21.1l1.4-7L2 9.3l7-.8z"/>'};
const ic=k=>`<svg viewBox="0 0 24 24" aria-hidden="true">${I[k]}</svg>`;
const media=e=>e[6]?`<div class="media"><video controls preload="none" src="${e[6]}"></video></div>`:e[5]?`<div class="media"><img src="${e[5]}" alt="${e[1]}" loading="lazy"></div>`:`<div class="media empty"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-8 8"/></svg><span>Image or video goes here</span></div>`;
const root=document.getElementById('cred');
document.getElementById('chips').innerHTML=S.map(s=>`<a href="#${s[0]}">${s[1]}</a>`).join('');
document.getElementById('total').textContent=D.length;
root.innerHTML=S.map(s=>{const items=D.filter(e=>e[0]===s[0]);return `<section id="${s[0]}" class="csec"><div class="wrap"><div class="head rv"><h2>${s[1]}</h2><p>${s[2]}</p></div><div class="cgrid">${items.map((e,i)=>`<article class="ccard rv" style="--d:${(i%3)*.1}s"><div class="ctop"><div class="ic">${ic(s[0])}</div><div><h3>${e[1]}</h3><div class="cm">${e[2]}</div></div></div><p>${e[3]}</p>${e[4]?`<a class="clink" href="${e[4]}" target="_blank" rel="noopener">Read the publication</a>`:''}${media(e)}</article>`).join('')}</div></div></section>`}).join('');
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.1});
document.querySelectorAll('#cred .rv').forEach(el=>io.observe(el));
})();
