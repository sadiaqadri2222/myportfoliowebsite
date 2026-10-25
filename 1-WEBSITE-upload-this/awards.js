(()=>{
const A=window.AWARDS,tl=document.getElementById('atl');
tl.innerHTML=A.map(a=>`<div class="ti rv"><div class="box"><div class="yr">${a[0]}</div><span class="atag">${a[1]}</span><h3>${a[2]}</h3><div class="by"><b>Awarded by</b> ${a[3]}</div><p>${a[4]}</p><div class="media empty"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-8 8"/></svg><span>Certificate image goes here</span></div></div></div>`).join('');
document.getElementById('n').textContent=A.length;
document.getElementById('span').textContent=A[A.length-1][0]+' to '+A[0][0];
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.15});
document.querySelectorAll('.rv').forEach(el=>io.observe(el));
})();
