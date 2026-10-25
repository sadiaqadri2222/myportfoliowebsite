/* Applies everything saved in the Admin Panel (data/content.js) to the page. */
(function(){
var S=window.SITE||{},used=false;try{var pv=localStorage.getItem('sadia_preview');if(pv){var P=JSON.parse(pv);if((P._v||1)>(S._v||0)){S=P;used=true}}}catch(e){}
if(used)document.addEventListener('DOMContentLoaded',function(){var b=document.createElement('div');b.textContent='Preview only: these changes are visible in this browser until you publish them';b.style.cssText='position:fixed;left:12px;bottom:12px;z-index:99;background:#ff4d8d;color:#fff;padding:8px 12px;border-radius:10px;font:600 12px sans-serif';document.body.appendChild(b)});
window.SITE=S;
var T=(window.THEMES||{})[S.theme];if(T)for(var k in T.v)document.documentElement.style.setProperty('--'+k,T.v[k]);
[['PROJECTS','projects'],['AWARDS','awards'],['CREDS','creds']].forEach(function(m){var v;Object.defineProperty(window,m[0],{configurable:true,get:function(){return S[m[1]]||v},set:function(x){v=x}})});
var h=function(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
function embed(u){var m=u.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/);if(m)return'https://www.youtube.com/embed/'+m[1];m=u.match(/vimeo\.com\/(\d+)/);return m?'https://player.vimeo.com/video/'+m[1]:''}
window.siteEmbed=embed;
window.siteMedia=function(l){return(l||[]).map(function(m){
if(m.k==='img')return'<a href="'+h(m.src)+'" target="_blank" rel="noopener"><img src="'+h(m.src)+'" alt="" loading="lazy"></a>';
var e=m.k==='yt'?embed(m.src):'';if(e)return'<iframe src="'+h(e)+'" allowfullscreen loading="lazy"></iframe>';
return'<video controls preload="metadata" playsinline src="'+h(m.src)+'"></video>'}).join('')};
window.siteApply=function(){
var q=function(s,f){document.querySelectorAll(s).forEach(f)},rep=function(s,a,f){var c=document.querySelector(s);if(c&&a)c.innerHTML=a.map(f).join('')};
q('[data-k]',function(e){var v=(S.t||{})[e.dataset.k];if(v==null)return;if(e.dataset.to!==undefined)e.dataset.to=v;else{var o=e.textContent;e.textContent=o.match(/^\s*/)[0]+v+o.match(/\s*$/)[0]}});
rep('#services .svc',S.services,function(s,i){return'<div class="card rv" style="--d:'+(i%3)*.1+'s"><div class="ic"><svg viewBox="0 0 24 24">'+s.icon+'</svg></div><h3>'+h(s.title)+'</h3><p>'+h(s.desc)+'</p>'+(s.price?'<div class="price">'+h(s.price)+'</div>':'')+'</div>'});
rep('#work .grid',S.tiles,function(t,i){var bg=t.img?'url("'+t.img+'") center/cover':(t.g||'linear-gradient(135deg,var(--blue),var(--violet))');return'<figure class="tile rv" style="--d:'+(i%3)*.1+'s"><div class="im" style="background:'+h(bg)+'"></div><figcaption><h3>'+h(t.title)+'</h3><p>'+h(t.sub)+'</p></figcaption></figure>'});
rep('.track',S.testimonials,function(t){var qt=/^[“"]/.test(t.q)?t.q:'“'+t.q+'”',ci='<blockquote>'+h(qt)+'</blockquote><cite><b>'+h(t.name)+'</b>'+h(t.role)+'</cite>',v=t.vid||t.video;
return'<div class="slide"><div class="tcard'+(v?' vid':'')+'">'+(v?'<div class="player" aria-label="Video"><video preload="none" playsinline src="'+h(t.video)+'"></video><span class="play"></span></div><div>'+ci+'</div>':ci)+'</div></div>'});
if(S.partners){var pp=S.partners.map(function(p){return'<span>'+(p.logo?'<img src="'+h(p.logo)+'" alt="'+h(p.name)+'">':h(p.name))+'</span>'}).join('');var mq=document.querySelector('.mq>div');if(mq)mq.innerHTML=pp+pp}
rep('.tl',S.timeline&&document.querySelector('.tl .ti')?S.timeline:null,function(t){return'<div class="ti rv"><div class="box"><div class="yr">'+h(t.yr)+'</div><h3>'+h(t.title)+'</h3><p>'+h(t.text)+'</p></div></div>'});
rep('.skg',S.skills,function(g,i){return'<div class="card rv" style="--d:'+(i%2)*.1+'s"><h3>'+h(g.group)+'</h3>'+g.items.map(function(s){return'<div class="sk"><div>'+h(s.name)+'<span><b data-to="'+(+s.pct||0)+'">0</b>%</span></div><div class="bar"><i style="--w:'+(+s.pct||0)+'%"></i></div></div>'}).join('')+'</div>'});
var c=S.contact||{},im=S.img||{};
if(c.email)q('a[href^="mailto:"]',function(a){a.href='mailto:'+c.email;if(a.textContent.indexOf('@')>-1)a.textContent=c.email});
if(c.instagram)q('a[aria-label=Instagram]',function(a){a.href=c.instagram});
if(c.youtube)q('a[aria-label=YouTube]',function(a){a.href=c.youtube});
var extra=(c.social||[]).filter(function(x){return x.url}).map(function(x){return'<a href="'+h(x.url)+'" target="_blank" rel="noopener" aria-label="'+h(x.name)+'" title="'+h(x.name)+'"><svg viewBox="0 0 24 24"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></svg></a>'}).join('');
if(extra)q('.soc',function(s){s.insertAdjacentHTML('beforeend',extra)});
var w=document.querySelectorAll('.info .irow')[1];
if(c.whatsapp&&w&&w.querySelector('p'))w.querySelector('p').innerHTML='<a href="https://wa.me/'+c.whatsapp.replace(/\D/g,'')+'" target="_blank" rel="noopener">'+h(c.whatsapp)+'</a>';
if(im.profile)q('.photo .frame',function(f){f.innerHTML='<img src="'+h(im.profile)+'" alt="Sadia Arif">'});
var pg=(location.pathname.split('/').pop()||'index.html').replace('.html','')||'index',B=(S.blocks||{})[pg]||{};
Object.keys(B).forEach(function(k){var l=B[k];if(!l||!l.length)return;var sec=document.querySelector('main>section[data-sec="'+k+'"]');
if(k==='end'){sec=document.createElement('section');document.querySelector('main').appendChild(sec)}if(!sec)return;
sec.insertAdjacentHTML('beforeend','<div class="wrap xb">'+l.map(function(b){return'<div class="xb-b rv">'+(b.title?'<h3>'+h(b.title)+'</h3>':'')+(b.text?'<p>'+h(b.text).replace(/\n/g,'<br>')+'</p>':'')+(b.media&&b.media.length?'<div class="xb-m">'+siteMedia(b.media)+'</div>':'')+'</div>'}).join('')+'</div>')})
}})();
