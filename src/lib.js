const ICONS={
check:'<path d="M20 6 9 17l-5-5"/>',
arrowR:'<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
arrowD:'<path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>',
mail:'<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
search:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
bell:'<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
save:'<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>',
lock:'<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
key:'<circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/>',
shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/>',
help:'<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',
file:'<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/>',
clip:'<rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/>',
alert:'<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
xcircle:'<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>',
xsquare:'<rect width="18" height="18" x="3" y="3" rx="2"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>',
x:'<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
clock:'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
home:'<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
network:'<rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><path d="M12 12V8"/>',
calc:'<rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/>',
sticky:'<path d="M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z"/><path d="M15 3v6h6"/>',
star:'<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
cal:'<rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>',
archive:'<rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/>',
user:'<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
refresh:'<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
link:'<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
scale:'<path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>',
eye:'<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
globe:'<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
db:'<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/>',
book:'<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
zap:'<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
card:'<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>',
grid:'<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
columns:'<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="M15 3v18"/>',
filter:'<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>',
hash:'<line x1="4" x2="20" y1="9" y2="9"/><line x1="4" x2="20" y1="15" y2="15"/><line x1="10" x2="8" y1="3" y2="21"/><line x1="16" x2="14" y1="3" y2="21"/>',
list:'<line x1="10" x2="21" y1="6" y2="6"/><line x1="10" x2="21" y1="12" y2="12"/><line x1="10" x2="21" y1="18" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/>',
layers:'<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
pointer:'<path d="m9 9 5 12 1.8-5.2L21 14Z"/><path d="M7.2 2.2 8 5.1"/><path d="m5.1 8-2.9-.8"/><path d="M14 4.1 12 6"/><path d="m6 12-1.9 2"/>',
tag:'<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/>',
edit:'<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
trash:'<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2"/>',
send:'<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>'
};
const ic=(n,c='')=>`<svg class="ic ${c}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n]}</svg>`;
/* reveal attributes: appear at cue c (+d s), optional exit at cue x (+xd s) */
const R=(c,d=0,x,xd=0)=>` data-c="${c}" data-d="${d}"`+(x!=null?` data-x="${x}" data-xd="${xd}"`:'');
const shot=(k,w,alt,inner='',z='')=>`<div class="shot"><div class="in"${z?` data-z='${z}'`:''}><img src="${A[k]}" style="width:${w}px" alt="${alt}">${inner}</div></div>`;
const hl=(c,x,y,w,h,d=0,xo,xd=0)=>`<div class="hl"${R(c,d,xo,xd)} style="left:${x}%;top:${y}%;width:${w}%;height:${h}%"></div>`;
const step=(n,t,p,c,d,e)=>`<div class="st"${R(c,d)}${e!=null?` data-e="${e}"`:''}><div class="n">${n}</div><div><h3>${t}</h3><p>${p}</p></div></div>`;
const chip=(i,t)=>`<span class="chip">${ic(i)}${t}</span>`;
let HID=0;
function hills(){const id='hc'+(HID++);return `<svg class="hills" viewBox="0 0 1920 1080" aria-hidden="true"><defs><clipPath id="${id}"><ellipse cx="380" cy="1470" rx="1260" ry="800"/></clipPath></defs><ellipse cx="380" cy="1470" rx="1260" ry="800" fill="#079959"/><ellipse cx="1720" cy="1530" rx="1240" ry="790" fill="#9AC035"/><ellipse cx="1720" cy="1530" rx="1240" ry="790" fill="#63B336" clip-path="url(#${id})"/></svg>`;}
/* French typography: narrow no-break space before : ; ? ! » and after « */
function fr(s){return s.replace(/ ([:;?!»])/g,'\u202F$1').replace(/« /g,'«\u202F');}
/* Extrait à la carte : paramètre s="1.1-1.4,3.2" <-> numéros de scène, toujours dans l'ordre de la vidéo.
   nums = numéros des scènes de contenu, dans l'ordre. Rien de reconnu : null (vidéo complète). */
function parseSel(str,nums){
  if(!str)return null;const pos=new Map(nums.map((n,i)=>[n,i])),on=new Set();
  for(const tok of String(str).split(',')){const m=tok.trim().match(/^(\d+\.\d+)(?:-(\d+\.\d+))?$/);if(!m)continue;
    const a=pos.get(m[1]),b=pos.get(m[2]||m[1]);if(a==null||b==null)continue;
    for(let i=Math.min(a,b);i<=Math.max(a,b);i++)on.add(i);}
  return on.size?[...on].sort((x,y)=>x-y).map(i=>nums[i]):null;}
function compactSel(sel,nums){
  const pos=new Map(nums.map((n,i)=>[n,i])),ch=n=>n.split('.')[0];
  const ix=[...new Set(sel)].map(n=>pos.get(n)).filter(i=>i!=null).sort((x,y)=>x-y),out=[];
  for(let k=0;k<ix.length;){let j=k;
    while(j+1<ix.length&&ix[j+1]===ix[j]+1&&ch(nums[ix[j+1]])===ch(nums[ix[k]]))j++;
    out.push(j>k?nums[ix[k]]+'-'+nums[ix[j]]:nums[ix[k]]);k=j+1;}
  return out.join(',');}
/* Scènes jouées pour une sélection : ouverture réduite (brief), cartons refaits (card), chapitres vides retirés.
   Renvoie de nouveaux objets : sc n'est pas modifié. */
function selectScenes(sc,sel){const keep=new Set(sel);
  return sc.flatMap(s=>{
    if(s.kind==='intro')return [Object.assign({},s,s.brief())];
    if(s.kind==='chap'){const ranks=sc.filter(c=>c.kind==='content'&&c.ch===s.ch&&keep.has(c.num)).map(c=>+c.num.split('.')[1]);
      return ranks.length?[Object.assign({},s,{html:s.card(ranks)})]:[];}
    if(s.kind==='content')return keep.has(s.num)?[s]:[];
    return [s];});}
