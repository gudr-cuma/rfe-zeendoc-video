(function(){
/* Mêmes constantes que src/engine.js. Les durées minimales liées aux animations sont ignorées : estimation. */
const WPS=2.35,GAP=0.55,LEAD=0.8,TAIL=0.5;
const $=id=>document.getElementById(id);
const txt=t=>fr(t).replace(/'/g,'’');
const words=t=>{t=(t||'').trim();return t?t.split(/\s+/).length:0;};
const cueEst=c=>{c=typeof c==='string'?{t:c}:c;return Math.max(c.dur!=null?c.dur:words(c.t)/WPS+GAP,1.6);};
const sceneEst=s=>LEAD+s.cues.reduce((a,c)=>a+cueEst(c),0)+(s.tail!=null?s.tail:TAIL);
const CONTENT=SC.filter(s=>s.kind==='content'),NUMS=CONTENT.map(s=>s.num);
const BASE=new URL(location.protocol==='file:'?'../index.html':'../',location.href).href;
const sel=new Set();

/* chapitres et scènes */
const box=$('chs');
[1,2,3,4].forEach(n=>{const sc=CONTENT.filter(s=>s.ch===n);const d=document.createElement('section');d.className='chb';
  d.innerHTML=`<div class="chh"><label><input type="checkbox" data-ch="${n}"><span>${n}. ${txt(CH[n])}</span></label>
    <span class="cnt" data-cnt="${n}"></span>
    <button class="btn" aria-expanded="false" aria-controls="l${n}" aria-label="Détail du chapitre ${txt(CH[n])}">Détail</button></div>
    <ol id="l${n}" hidden>${sc.map(s=>`<li><label><input type="checkbox" data-num="${s.num}"><span class="num">${s.num}</span><span>${txt(s.title)}</span></label></li>`).join('')}</ol>`;
  box.appendChild(d);});
box.addEventListener('click',e=>{const b=e.target.closest('button[aria-controls]');if(!b)return;
  const open=b.getAttribute('aria-expanded')!=='true';b.setAttribute('aria-expanded',String(open));$(b.getAttribute('aria-controls')).hidden=!open;});
box.addEventListener('change',e=>{const i=e.target;
  if(i.dataset.num){i.checked?sel.add(i.dataset.num):sel.delete(i.dataset.num);}
  else if(i.dataset.ch){CONTENT.filter(s=>s.ch===+i.dataset.ch).forEach(s=>i.checked?sel.add(s.num):sel.delete(s.num));}
  update();});

/* état, lien, durée */
function current(){return NUMS.filter(n=>sel.has(n));}
function update(){const list=current();
  box.querySelectorAll('input[data-num]').forEach(i=>{i.checked=sel.has(i.dataset.num);});
  [1,2,3,4].forEach(n=>{const all=CONTENT.filter(s=>s.ch===n),k=all.filter(s=>sel.has(s.num)).length;
    const c=box.querySelector(`input[data-ch="${n}"]`);c.checked=k===all.length;c.indeterminate=k>0&&k<all.length;
    box.querySelector(`[data-cnt="${n}"]`).textContent=`${k} / ${all.length}`;});
  const none=!list.length,full=list.length===NUMS.length; /* tout coché : vidéo complète, lien sans sélection */
  $('link').value=none?'':full?BASE:BASE+'?s='+compactSel(list,NUMS);
  $('copy').disabled=$('open').disabled=none;$('empty').hidden=!none;
  if(none){$('sum').textContent='';return;}
  const t=(full?SC:selectScenes(SC,list)).reduce((a,s)=>a+sceneEst(s),0),m=Math.max(1,Math.round(t/60));
  $('sum').textContent=`${list.length} scène${list.length>1?'s':''} retenue${list.length>1?'s':''}, environ ${m} min`;}

/* actions */
$('none').onclick=()=>{sel.clear();$('msg').textContent='';update();};
$('open').onclick=()=>{if($('link').value)window.open($('link').value,'_blank','noopener');};
$('copy').onclick=async()=>{const v=$('link').value;if(!v)return;
  try{await navigator.clipboard.writeText(v);}catch(e){$('link').select();if(!document.execCommand('copy'))return;}
  $('copy').textContent='Lien copié';setTimeout(()=>{$('copy').textContent='Copier le lien';},2000);};
$('load').onclick=()=>{const v=$('paste').value.trim();let s=v;
  try{s=new URL(v).searchParams.get('s')||'';}catch(e){s=v.replace(/^\?s=/,'');}
  const list=parseSel(s,NUMS);
  if(!list){$('msg').textContent='Aucune scène reconnue dans ce lien.';return;}
  sel.clear();list.forEach(n=>sel.add(n));
  $('msg').textContent=`${list.length} scène${list.length>1?'s':''} reprise${list.length>1?'s':''}.`;update();};
$('paste').addEventListener('keydown',e=>{if(e.key==='Enter')$('load').click();});
update();
})();
