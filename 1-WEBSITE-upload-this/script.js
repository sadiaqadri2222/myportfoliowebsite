const h=document.querySelector('header');
addEventListener('scroll',()=>h.classList.toggle('scrolled',scrollY>30),{passive:true});
const b=document.querySelector('.burger'),m=document.querySelector('nav ul');
b&&b.addEventListener('click',()=>{const o=m.classList.toggle('open');b.setAttribute('aria-expanded',o)});
m&&m.addEventListener('click',e=>{if(e.target.tagName==='A')m.classList.remove('open')});
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.15});
document.querySelectorAll('.rv').forEach(el=>io.observe(el));
const count=el=>{const t=+el.dataset.to,d=+el.dataset.dec||0,s=performance.now(),D=2000;
const f=n=>{const p=Math.min((n-s)/D,1),v=t*(1-Math.pow(1-p,4));el.firstChild.textContent=v.toFixed(d);if(p<1)requestAnimationFrame(f)};requestAnimationFrame(f)};
const so=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){count(e.target);so.unobserve(e.target)}}),{threshold:.6});
document.querySelectorAll('[data-to]').forEach(el=>so.observe(el));
const tr=document.querySelector('.track');
if(tr){const n=tr.children.length,dots=document.querySelector('.dots');let i=0,t;
for(let k=0;k<n;k++){const d=document.createElement('button');d.setAttribute('aria-label','Testimonial '+(k+1));d.onclick=()=>{go(k);auto()};dots.append(d)}
const go=k=>{i=(k+n)%n;tr.style.transform=`translateX(-${i*100}%)`;[...dots.children].forEach((d,j)=>d.classList.toggle('on',j===i))};
const auto=()=>{clearInterval(t);t=setInterval(()=>go(i+1),6500)};
document.querySelector('.slider').addEventListener('click',e=>{if(!e.target.closest('.player,.dots'))go(i+1)});
let x0;tr.addEventListener('touchstart',e=>x0=e.touches[0].clientX,{passive:true});
tr.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-x0;if(Math.abs(dx)>40){go(i+(dx<0?1:-1));auto()}});
go(0);auto();
document.querySelectorAll('.player').forEach(p=>p.addEventListener('click',()=>{const v=p.querySelector('video');if(v&&v.getAttribute('src')){clearInterval(t);p.classList.add('on');v.controls=true;v.play()}}));}
