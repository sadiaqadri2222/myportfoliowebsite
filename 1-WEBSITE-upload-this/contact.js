(()=>{
const f=document.getElementById('cf'),st=document.getElementById('status'),TO=(window.SITE&&SITE.contact&&SITE.contact.email)||'sadiaqadri2222@gmail.com';
const ok=(el,v)=>el.closest('.f').classList.toggle('bad',!v);
f.addEventListener('submit',e=>{e.preventDefault();
 const n=f.name,m=f.email,t=f.topic,g=f.message;
 const v1=n.value.trim().length>1,v2=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m.value.trim()),v3=!!t.value,v4=g.value.trim().length>9;
 ok(n,v1);ok(m,v2);ok(t,v3);ok(g,v4);
 if(!(v1&&v2&&v3&&v4)){st.className='status';return}
 const body=`${g.value.trim()}\n\nFrom: ${n.value.trim()}\nReply to: ${m.value.trim()}`;
 location.href=`mailto:${TO}?subject=${encodeURIComponent(t.value+' - '+n.value.trim())}&body=${encodeURIComponent(body)}`;
 st.textContent=`Thank you, ${n.value.trim()}. Your email app is opening with your message ready to send. If nothing opens, write to ${TO} directly.`;
 st.className='status show';f.reset();
});
f.addEventListener('input',e=>{const p=e.target.closest('.f');p&&p.classList.remove('bad')});
const cb=document.getElementById('copy');
cb&&cb.addEventListener('click',()=>{(navigator.clipboard?navigator.clipboard.writeText(TO):Promise.reject()).then(()=>{cb.textContent='Copied'},()=>{cb.textContent='Press Ctrl+C to copy'});setTimeout(()=>cb.textContent='Copy email address',2200)});
})();
