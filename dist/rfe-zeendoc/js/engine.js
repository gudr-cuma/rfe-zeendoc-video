(function(){
const RENDER=new URLSearchParams(location.search).has('render');
const REDUCED=!RENDER&&window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
const DUR=REDUCED?0.01:0.6, XDUR=REDUCED?0.01:0.45, ZDUR=REDUCED?0.01:1.1, TRANS=REDUCED?0.01:0.7;
const LEAD=0.8, GAP=0.55, TAIL=0.5, WPS=2.35;
const clamp=v=>v<0?0:v>1?1:v;
const eo=t=>1-Math.pow(1-t,3);
const eio=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
if(RENDER) document.body.classList.add('render');

/* ---------- speech text ---------- */
const SAY=[[/ged\.cuma\.fr/g,'jaide point Qumas point F-R'],[/\bGED\b/g,'jaide'],[/\bAGC\b/g,'A-G-C'],[/\bSAS\b/g,'S-A-S'],[/PA-R/g,'P-A-R'],
 [/FE - Statut/g,'F-E, statut'],[/\b1er\b/g,'premier'],[/« 0 \/ A affecter »/g,'« zéro, A affecter »'],[/\bSIREN\b/g,'Siren'],
 [/myCuma/g,'My Qumas'],[/\bCumas?\b/gi,'Qumas'],[/[«»]/g,''],[/\u202F|\u00A0/g,' ']];
const toSpeech=t=>SAY.reduce((s,[a,b])=>s.replace(a,b),t);
const words=t=>{t=(t||'').trim();return t?t.split(/\s+/).length:0;};
const splitS=t=>t.split(/(?<=[.!?…])\s+(?=[A-ZÀÂÇÉÈÊËÎÏÔÛÙÜŸ«0-9])/).filter(Boolean);

/* ---------- build DOM ---------- */
const stage=document.getElementById('stage');
function rail(ch){return `<div class="rail"><img src="${A.picto}" alt=""><div class="brand">Facturation électronique<small>Vos factures fournisseur dans Zeendoc</small></div><div class="tabs">${[1,2,3,4].map(n=>`<div class="tab${n===ch?' cur':n<ch?' done':''}"><b>${n}</b>${CH[n]}</div>`).join('')}</div></div>`;}
function wrap(s){
  if(s.kind!=='content') return s.html;
  return `<div class="ledger"></div>${rail(s.ch)}<div class="mnum">${s.num}</div><h2 class="title">${s.title}</h2><div class="body">${s.html}</div><div class="foot"><span class="url">ged.cuma.fr</span><span>${s.src||'Réseau Cuma, état en septembre 2026'}</span></div>`;
}
SC.forEach((s,i)=>{
  s.cues=s.cues.map(c=>typeof c==='string'?{t:c}:c);
  const el=document.createElement('section'); el.className='scene '+s.kind;
  el.setAttribute('aria-label',s.num?`${s.num} ${s.title}`:s.title);
  el.innerHTML=fr(wrap(s)); stage.appendChild(el); s.el=el;
  {const w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);let n;while((n=w.nextNode()))if(n.nodeValue.includes("'"))n.nodeValue=n.nodeValue.replace(/'/g,'’');}
  s.items=[...el.querySelectorAll('[data-c]')].map(e=>({el:e,c:+e.dataset.c,d:+(e.dataset.d||0),
    x:e.dataset.x!=null?+e.dataset.x:null,xd:+(e.dataset.xd||0),
    k:e.classList.contains('hl')?'hl':e.classList.contains('grow')?'grow':e.classList.contains('pop')?'pop':'up'}));
  s.emph=[...el.querySelectorAll('[data-e]')].map(e=>{const [a,b]=e.dataset.e.split('-');return {el:e,a:+a,b:b!=null?+b:+a+1};});
  s.zooms=[...el.querySelectorAll('[data-z]')].map(e=>({el:e,k:JSON.parse(e.dataset.z)}));
});

/* ---------- fixed timeline (MP4 + progress estimate) ---------- */
function cueMin(s,i){let m=0;for(const it of s.items){if(it.c===i)m=Math.max(m,it.d+DUR+0.9);if(it.x===i)m=Math.max(m,it.xd+XDUR+0.5);}
  for(const z of s.zooms)for(const k of z.k)if(k[0]===i)m=Math.max(m,k[1]+ZDUR+0.5);return m;}
function estCue(s,i){const c=s.cues[i];const sp=c.dur!=null?c.dur:words(c.t)/WPS+GAP;return Math.max(sp,cueMin(s,i),1.6);}
function buildTL(){let t=0;return SC.map((s,si)=>{const sc={si,start:t,cues:[]};let u=t+LEAD;
  s.cues.forEach((c,i)=>{const d=estCue(s,i);sc.cues.push({start:u,dur:d,text:c.t});u+=d;});
  u+=(s.tail!=null?s.tail:TAIL);sc.end=u;t=u;return sc;});}
const TL=buildTL(); const TOTAL=TL[TL.length-1].end;

/* ---------- renderer ---------- */
function renderScene(s,T,c0){
  for(const it of s.items){
    const t0=c0[it.c];let a=0,v=0;
    if(t0!==undefined){a=eo(clamp((T-(t0+it.d))/DUR));v=a;
      if(it.x!=null&&c0[it.x]!==undefined){v*=1-eo(clamp((T-(c0[it.x]+it.xd))/XDUR));}}
    const st=it.el.style;st.opacity=v.toFixed(3);st.visibility=v<=0.002?'hidden':'visible';
    if(it.k==='grow')st.transform=`scaleX(${a.toFixed(4)})`;
    else if(it.k==='hl')st.transform=`scale(${(1.14-0.14*a).toFixed(4)})`;
    else if(it.k==='pop')st.transform=`scale(${(0.5+0.5*a).toFixed(4)})`;
    else st.transform=a>=1?'none':`translateY(${((1-a)*22).toFixed(2)}px)`;
  }
  for(const e of s.emph){let v=0;const ta=c0[e.a];
    if(ta!==undefined){v=eo(clamp((T-ta)/0.5));const tb=c0[e.b];if(tb!==undefined)v*=1-eo(clamp((T-tb)/0.5));}
    e.el.style.setProperty('--e',v.toFixed(3));}
  for(const z of s.zooms){let S=1,X=50,Y=50;
    for(const k of z.k){const tk=c0[k[0]];if(tk===undefined)continue;const p=eio(clamp((T-(tk+k[1]))/ZDUR));
      S=S+(k[2]-S)*p;X=X+(k[3]-X)*p;Y=Y+(k[4]-Y)*p;}
    z.el.style.transformOrigin=`${X}% ${Y}%`;z.el.style.transform=`scale(${S.toFixed(4)})`;}
}
function show(si,prev,p){SC.forEach((s,i)=>{const on=i===si||(i===prev&&p<1);s.el.style.visibility=on?'visible':'hidden';
  s.el.style.zIndex=i===si?2:1;s.el.style.opacity=i===si?eo(p).toFixed(3):'1';});}

/* ---------- render API (frame capture) ---------- */
window.__timeline=()=>TL.map(sc=>({num:SC[sc.si].num||'',title:SC[sc.si].title||'',kind:SC[sc.si].kind,ch:SC[sc.si].ch||0,start:sc.start,end:sc.end,cues:sc.cues}));
window.__seek=function(t){let si=TL.findIndex(sc=>t<sc.end);if(si<0)si=TL.length-1;const sc=TL[si];
  const p=clamp((t-sc.start)/TRANS);const c0=sc.cues.filter(c=>c.start<=t+1e-6).map(c=>c.start);
  show(si,si-1,p);renderScene(SC[si],t,c0);
  if(p<1&&si>0)renderScene(SC[si-1],t,TL[si-1].cues.map(c=>c.start));};
window.__plan=function(fps=25){const iv=[];
  TL.forEach((sc,si)=>{const s=SC[si],cs=sc.cues.map(c=>c.start);iv.push([sc.start,sc.start+TRANS]);
    s.items.forEach(it=>{const t0=cs[it.c];if(t0==null)return;iv.push([t0+it.d,t0+it.d+DUR]);
      if(it.x!=null&&cs[it.x]!=null)iv.push([cs[it.x]+it.xd,cs[it.x]+it.xd+XDUR]);});
    s.emph.forEach(e=>{if(cs[e.a]!=null)iv.push([cs[e.a],cs[e.a]+0.5]);if(cs[e.b]!=null)iv.push([cs[e.b],cs[e.b]+0.5]);});
    s.zooms.forEach(z=>z.k.forEach(k=>{if(cs[k[0]]!=null)iv.push([cs[k[0]]+k[1],cs[k[0]]+k[1]+ZDUR]);}));});
  const N=Math.round(TOTAL*fps),A=new Uint8Array(N+1);
  iv.forEach(([a,b])=>{for(let f=Math.floor(a*fps);f<=Math.min(N,Math.ceil(b*fps)+1);f++)A[f]=1;});
  const F=[];let f=0;while(f<N){if(A[f]){F.push([f,1]);f++;}else{let g=f;while(g<N&&!A[g])g++;F.push([f,g-f]);f=g;}}
  return {fps,total:TOTAL,frames:F};};
window.__ready=(async()=>{
  const faces=['700 40px Montserrat','800 40px Montserrat','400 20px Plex','500 20px Plex','600 20px Plex','700 20px Plex','500 20px PlexMono','600 20px PlexMono'];
  await Promise.all(faces.map(f=>document.fonts.load(f).catch(()=>{})));await document.fonts.ready;
  await Promise.all([...document.images].map(i=>i.decode?i.decode().catch(()=>{}):0));return true;})();

/* ---------- screen scaling ---------- */
const screen=document.getElementById('screen');
function fit(){if(RENDER){stage.style.transform='none';return;}const w=screen.clientWidth,h=screen.clientHeight;const k=Math.min(w/1920,h/1080);
  stage.style.transform=`translate(${(w-1920*k)/2}px,${(h-1080*k)/2}px) scale(${k})`;}
fit();if(window.ResizeObserver)new ResizeObserver(fit).observe(screen);else addEventListener('resize',fit);

if(RENDER){window.__seek(0);return;}

/* ================= LIVE PLAYER ================= */
const $=id=>document.getElementById(id);
const hasTTS='speechSynthesis' in window&&'SpeechSynthesisUtterance' in window;
const P={playing:false,started:false,vt:0,last:0,si:0,prev:-1,t0:0,c0:[],ci:-1,phase:'idle',until:0,sents:[],sj:0,tok:0,
  voice:null,voiceOn:hasTTS,rate:1,waitSpeech:false,sentT0:0,sentEst:0,cueMinEnd:0,respeak:false,captions:true};

function caption(t){const c=$('cap');c.textContent=t?fr(t).replace(/'/g,'’'):'';}
function cancelSpeech(){P.tok++;P.waitSpeech=false;if(hasTTS){try{speechSynthesis.cancel();}catch(e){}}}
function goto(si){cancelSpeech();P.prev=(P.si!==si)?P.si:-1;P.si=si;P.t0=P.vt;P.c0=[];P.ci=-1;P.phase='lead';P.until=P.vt+LEAD;caption('');ui();}
function startCue(i){const s=SC[P.si],c=s.cues[i];P.ci=i;P.c0[i]=P.vt;
  P.cueMinEnd=P.vt+(c.dur!=null?c.dur:Math.max(cueMin(s,i),1.2));
  P.sents=c.t?splitS(c.t):[];P.sj=0;
  if(!P.sents.length){P.phase='hold';P.until=P.cueMinEnd;return;}
  P.phase='speak';speakSent();}
function speakSent(){const txt=P.sents[P.sj];caption(txt);P.sentT0=P.vt;P.sentEst=words(txt)/WPS/P.rate;P.respeak=false;
  const tok=++P.tok;
  if(P.voiceOn&&hasTTS&&P.voice){
    const u=new SpeechSynthesisUtterance(toSpeech(txt));u.lang=P.voice.lang||'fr-FR';u.voice=P.voice;u.rate=P.rate;u.pitch=1;
    u.onend=()=>{if(tok===P.tok)sentDone();};
    u.onerror=e=>{if(tok===P.tok&&e.error!=='interrupted'&&e.error!=='canceled')sentDone();};
    P.u=u;P.waitSpeech=true;
    const go=()=>{if(tok===P.tok)speechSynthesis.speak(u);};
    if(speechSynthesis.speaking||speechSynthesis.pending){speechSynthesis.cancel();setTimeout(go,60);}else go();
  }else P.waitSpeech=false;}
function sentDone(){P.tok++;P.waitSpeech=false;P.sj++;
  if(P.sj<P.sents.length){P.phase='pause';P.until=P.vt+0.2;}
  else{P.phase='hold';P.until=Math.max(P.vt+GAP,P.cueMinEnd);}}
function endScene(){if(P.si+1<SC.length)goto(P.si+1);else{P.playing=false;P.phase='end';caption('');ui();}}
function step(){const s=SC[P.si];
  switch(P.phase){
  case 'lead':if(P.vt>=P.until){if(s.cues.length)startCue(0);else endScene();}break;
  case 'speak':if(P.respeak){speakSent();break;}
    if(!P.waitSpeech){if(P.vt-P.sentT0>=P.sentEst+0.15)sentDone();}
    else if(P.vt-P.sentT0>P.sentEst*2.6+5){cancelSpeech();sentDone();}break;
  case 'pause':if(P.vt>=P.until){P.phase='speak';speakSent();}break;
  case 'hold':if(P.vt>=P.until){caption('');if(P.ci+1<s.cues.length)startCue(P.ci+1);else{P.phase='tail';P.until=P.vt+(s.tail!=null?s.tail:TAIL);}}break;
  case 'tail':if(P.vt>=P.until)endScene();break;}}
function draw(){const p=clamp((P.vt-P.t0)/TRANS);show(P.si,P.prev,p);renderScene(SC[P.si],P.vt,P.c0);
  const sc=TL[P.si];const pos=Math.min(sc.end,sc.start+Math.max(0,P.vt-P.t0));$('fill').style.width=(100*pos/TOTAL).toFixed(2)+'%';}
function tick(now){now/=1000;const dt=Math.min(0.1,now-(P.last||now));P.last=now;if(P.playing){P.vt+=dt;step();}if(P.started)draw();requestAnimationFrame(tick);}

/* ---------- controls ---------- */
const PLAY='<svg viewBox="0 0 24 24"><polygon points="6 4 20 12 6 20 6 4" fill="currentColor"/></svg>';
const PAUSE='<svg viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" fill="currentColor"/><rect x="14" y="4" width="4" height="16" fill="currentColor"/></svg>';
function play(){if(!P.started){P.started=true;$('startov').hidden=true;P.vt=0;P.si=0;goto(0);P.prev=-1;}
  if(P.phase==='end'){goto(0);}
  P.playing=true;ui();}
function pause(){P.playing=false;if(P.phase==='speak'){const was=P.waitSpeech;cancelSpeech();if(was)P.respeak=true;}ui();}
function toggle(){P.playing?pause():play();}
function jump(si){si=Math.max(0,Math.min(SC.length-1,si));if(!P.started){P.started=true;$('startov').hidden=true;}goto(si);P.playing=true;ui();}
function ui(){const s=SC[P.si];$('pp').innerHTML=P.playing?PAUSE:PLAY;$('pp').setAttribute('aria-label',P.playing?'Pause':'Lecture');
  $('where').innerHTML=s.kind==='content'?`<b>${s.num}</b> ${fr(s.title)} <span>· ${CH[s.ch]}</span>`:`<b>${fr(s.title)}</b>`;
  document.querySelectorAll('.chapters button').forEach(b=>b.setAttribute('aria-current',+b.dataset.si===P.si?'true':'false'));}
$('pp').onclick=toggle;$('startBtn').onclick=play;
$('prev').onclick=()=>jump(P.si-1);$('next').onclick=()=>jump(P.si+1);
$('capt').onclick=()=>{P.captions=!P.captions;$('cap').hidden=!P.captions;$('capt').setAttribute('aria-pressed',String(P.captions));};
$('fs').onclick=()=>{if(document.fullscreenElement)document.exitFullscreen();else if(screen.requestFullscreen)screen.requestFullscreen();};
document.addEventListener('fullscreenchange',()=>setTimeout(fit,50));
$('prog').onclick=e=>{const r=e.currentTarget.getBoundingClientRect();const t=(e.clientX-r.left)/r.width*TOTAL;let si=TL.findIndex(sc=>t<sc.end);jump(si<0?SC.length-1:si);};
$('rate').onchange=e=>{P.rate=+e.target.value;};
document.addEventListener('keydown',e=>{if(e.target.closest('select,button'))return;
  if(e.code==='Space'){e.preventDefault();toggle();}else if(e.key==='ArrowRight')jump(P.si+1);else if(e.key==='ArrowLeft')jump(P.si-1);});
/* progress ticks per chapter */
TL.forEach(sc=>{if(SC[sc.si].kind==='chap'){const d=document.createElement('i');d.className='tick';d.style.left=(100*sc.start/TOTAL)+'%';$('prog').appendChild(d);}});
/* chapter navigation */
(function(){const nav=$('chapters');const groups=[{n:0,name:'Ouverture et clôture',items:[]},{n:1,items:[]},{n:2,items:[]},{n:3,items:[]},{n:4,items:[]}];
  SC.forEach((s,i)=>{if(s.kind==='content')groups[s.ch].items.push([i,s.num,s.title]);else if(s.kind==='intro'||s.kind==='outro')groups[0].items.push([i,'',s.title]);});
  [1,2,3,4,0].forEach(g=>{const G=groups[g];const sec=document.createElement('section');
    sec.innerHTML=`<h2>${g?g+'. '+CH[g]:G.name}</h2><ol>${G.items.map(([i,n,t])=>`<li><button data-si="${i}"><span>${n}</span>${fr(t)}</button></li>`).join('')}</ol>`;nav.appendChild(sec);});
  nav.addEventListener('click',e=>{const b=e.target.closest('button');if(b)jump(+b.dataset.si);});})();
/* voices */
function rank(v){let s=0;if(/^fr[-_]FR/i.test(v.lang))s+=5;else if(/^fr/i.test(v.lang))s+=2;
  if(/natural|neural|online|premium|enhanced|wavenet/i.test(v.name))s+=6;if(/google/i.test(v.name))s+=3;
  if(/denise|henri|vivienne|remi|rémi|eloise|amélie|amelie|thomas|audrey|aurélie|marie|julie|paul/i.test(v.name))s+=2;return s;}
let VO=[];
function loadVoices(){if(!hasTTS)return;const all=speechSynthesis.getVoices().filter(v=>/^fr/i.test(v.lang)).sort((a,b)=>rank(b)-rank(a));
  if(!all.length&&VO.length)return;VO=all;const sel=$('voice');const cur=sel.value;
  sel.innerHTML=VO.map((v,i)=>`<option value="${i}">${v.name.replace(/Microsoft |Google /,'')} (${v.lang})</option>`).join('')+'<option value="none">Sans voix, sous-titres seuls</option>';
  if(VO.length){sel.value=cur&&cur!=='none'&&VO[+cur]?cur:'0';P.voice=VO[+sel.value]||VO[0];P.voiceOn=true;$('vnote').hidden=true;}
  else{sel.value='none';P.voiceOn=false;P.voice=null;$('vnote').hidden=false;}}
if(hasTTS){loadVoices();speechSynthesis.onvoiceschanged=loadVoices;let n=0;const iv=setInterval(()=>{loadVoices();if(++n>10||VO.length)clearInterval(iv);},400);}
else{$('voice').innerHTML='<option value="none">Sans voix, sous-titres seuls</option>';$('vnote').hidden=false;}
$('voice').onchange=e=>{const v=e.target.value;if(v==='none'){P.voiceOn=false;P.voice=null;cancelSpeech();}else{P.voiceOn=true;P.voice=VO[+v];}
  if(P.phase==='speak'){cancelSpeech();P.respeak=true;}};
/* poster frame: intro fully revealed */
P.vt=100;P.t0=0;P.c0=[0,0];draw();P.c0=[];P.vt=0;$('fill').style.width='0%';
ui();requestAnimationFrame(tick);
})();
