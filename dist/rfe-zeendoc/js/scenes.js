const CH=['','Connexion','Paramétrage','Usage','Informations générales'];
const SC=[];
const DGFIP='Source : DGFiP, guide pratique de démarrage au 1er septembre 2026 (juillet 2026)';
function content(d){SC.push(Object.assign({kind:'content'},d));}
function chapter(n,items){
  /* ranks : rangs retenus (1 = n.1). Vidéo complète : tous les rangs. */
  const card=ranks=>`
  <div class="bign"${R(0,0)}>${n}<i></i></div>
  ${hills()}
  <div class="ckick"${R(0,.15)}>Chapitre ${n}</div>
  <h2 class="ctitle"${R(0,.25)}>${CH[n]}</h2>
  <ol class="clist${CH[n].length>14?' long':''}">${ranks.map((r,k)=>`<li${R(0,.55+k*.1)}><span>${n}.${r}</span>${items[r-1]}</li>`).join('')}</ol>`;
  SC.push({kind:'chap',ch:n,title:'Chapitre '+n+' : '+CH[n],html:card(items.map((t,k)=>k+1)),card,
  cues:[{t:'',dur:3.6}]});
}

/* ================= OUVERTURE ================= */
function intro(full){return {kind:'intro',title:'Ouverture',html:`
  ${hills()}
  <img class="ipicto"${R(0,0)} src="${A.picto}" alt="Logo Cuma">
  <div class="ikick"${R(0,.25)}>Facturation électronique</div>
  <h1 class="ititle"${R(0,.4)}>Vos factures fournisseur<br>dans Zeendoc</h1>
  <p class="isub"${R(0,.7)}>Pour les trésoriers de Cuma, état en septembre 2026</p>${full?`
  <div class="isum">${[1,2,3,4].map((n,k)=>`<div class="ichip"${R(1,[1.2,2.1,3.0,4.1][k])}><b>${n}</b>${CH[n]}</div>`).join('')}</div>`:''}`,
  cues:[
  'Depuis le 1er septembre 2026, votre Cuma doit pouvoir recevoir ses factures fournisseur via une plateforme agréée. Dans le réseau Cuma, vous les retrouvez dans Zeendoc.',
  ...(full?["Cette vidéo présente la connexion, le paramétrage, l'usage au quotidien, puis les informations générales à connaître."]:[])]};}
/* extrait à la carte : l'ouverture perd l'annonce des quatre parties (décision du 28 septembre 2026) */
SC.push(Object.assign(intro(true),{brief:()=>intro(false)}));

/* ================= 1 CONNEXION ================= */
chapter(1,['Le site','Activer votre compte','Accès perdu','Changement de trésorier']);

content({ch:1,num:'1.1',title:'Le site',html:`
<div class="center">
  <div class="urlbar"${R(0,0)}>${ic('lock')}<span class="u">ged.cuma.fr</span><span class="star pop"${R(0,2.9)}>${ic('star')}</span></div>
  <div class="callout ok"${R(0,3.1)}>${ic('star')}<div>Adresse à garder dans vos favoris</div></div>
</div>`,
cues:['Tout se passe sur un seul site : ged.cuma.fr. Gardez cette adresse dans vos favoris.']});

content({ch:1,num:'1.2',title:'Activer votre compte',html:`
<div class="cols" style="grid-template-columns:650px 1fr">
  <div>
    <div class="chips"${R(0,0)}>${chip('list','4 étapes')}${chip('clock','environ 5 minutes')}${chip('check','une seule fois')}</div>
    <div class="steps mt">
      ${step(1,"Ouvrez l'e-mail d'invitation","Expéditeur en @zeendoc, lien valable 24 heures. Pensez aux courriers indésirables.",0,.4,'1')}
      ${step(2,"Acceptez les conditions d'utilisation","Faites défiler le texte jusqu'en bas : le bouton s'active ensuite.",0,.55,'2')}
      ${step(3,'Choisissez votre mot de passe','Exigences strictes : lisez la liste affichée. Notez-le dans un endroit sûr.',0,.7,'3')}
      ${step(4,'Renseignez vos 4 questions de sécurité',"La quatrième, c'est vous qui la rédigez.",0,.85,'4')}
    </div>
  </div>
  <div class="panel">
    <div class="sw"${R(0,1.0,2)}>${shot('f01_mail',860,"Capture de l'e-mail d'invitation",hl(1,6.5,58.5,46.5,8.5,6.4))}</div>
    <div class="sw"${R(2,0,3)}>${shot('f01_cgu',860,"Capture : validation des conditions d'utilisation")}</div>
    <div class="sw"${R(3,0,4)}>${shot('f01_mdp',620,'Capture : changement du mot de passe',hl(3,29,54,46,24.5,5.0))}</div>
    <div class="sw"${R(4,0,5)}><div class="qcard"><div class="ch">${ic('shield','big')}<h3>4 questions de sécurité</h3></div>
      <div class="qline">Question 1<i></i></div><div class="qline">Question 2<i></i></div><div class="qline">Question 3<i></i></div>
      <div class="qline me">Question 4<i>rédigée par vous</i></div>
      <div class="qfoot">Les réponses servent à récupérer votre accès.</div></div></div>
    <div class="sw"${R(5,0)}><div class="fin"><div class="ok">${ic('check')}</div><h3>C'est terminé, vous êtes dans Zeendoc.</h3><p>Ensuite : votre identifiant et votre mot de passe.</p></div></div>
  </div>
</div>`,
cues:[
 "L'activation se fait une seule fois, en quatre étapes, en cinq minutes environ.",
 "Première étape : ouvrez l'e-mail d'invitation. Il provient d'une adresse Zeendoc et contient un lien, valable vingt-quatre heures, pour définir votre mot de passe. Pensez à regarder dans vos courriers indésirables.",
 "Deuxième étape : acceptez les conditions d'utilisation. Faites défiler le texte jusqu'en bas ; le bouton de validation ne s'active qu'une fois le texte parcouru.",
 "Troisième étape : choisissez votre mot de passe. Les exigences sont strictes : lisez la liste affichée avant de valider, et notez-le dans un endroit sûr.",
 "Quatrième étape : renseignez vos quatre questions de sécurité. La quatrième, c'est vous qui la rédigez. Ces réponses servent à récupérer votre accès.",
 "C'est terminé. Les fois suivantes, vous vous connectez avec votre identifiant et votre mot de passe."]});

content({ch:1,num:'1.3',title:'Accès perdu',html:`
<div class="cols" style="grid-template-columns:1fr 1fr;gap:48px;align-items:start;padding:6px 0 24px">
  <div class="card top" style="--c:var(--orange)"${R(0,0)}>
    <div class="ch">${ic('key','big or')}<h3>Mot de passe perdu ou expiré ?</h3></div>
    <p>Le lien « Mot de passe perdu » demande les réponses à vos 4 questions de sécurité.</p>
    <p class="strong">Le plus simple : votre référent Fédération / AGC fait envoyer un nouveau lien de réinitialisation, valable 24 heures.</p>
  </div>
  <div class="card top" style="--c:var(--sky)"${R(1,0)}>
    <div class="ch">${ic('link','big')}<h3>Lien de plus de 24 heures ?</h3></div>
    <p>Cliquez dessus et demandez à recevoir un nouveau lien.</p>
    <div class="mt" style="display:flex;justify-content:center">${shot('f01_lien',560,"Capture : ce lien n'est plus disponible",hl(1,36,54.5,27.5,7.5,2.4))}</div>
  </div>
</div>`,
cues:[
 "Mot de passe perdu ou expiré ? Le lien « Mot de passe perdu » vous demande les réponses à vos quatre questions. Le plus simple est de contacter votre référent Fédération ou AGC : il fait envoyer un nouveau lien de réinitialisation, valable vingt-quatre heures.",
 "Si votre lien a dépassé vingt-quatre heures, cliquez dessus : vous pourrez demander à en recevoir un nouveau."]});

content({ch:1,num:'1.4',title:'Changement de trésorier',html:`
<div class="stack" style="height:100%;justify-content:center;gap:60px">
  <div class="flow">
    <div class="fbox" style="flex:1"${R(0,0)}>${ic('user','big')}<div><b>Fonction de trésorier retirée</b><span>dans myCuma Infinity</span></div></div>
    <div class="farr"${R(0,2.2)}>${ic('arrowR')}</div>
    <div class="fbox g" style="flex:1"${R(0,2.8)}>${ic('lock','big')}<div><b>Compte désactivé</b><span>automatiquement</span></div></div>
  </div>
  <div class="callout"${R(1,0)}>${ic('refresh')}<div>Changement de trésorier ou de président : <b>pensez à transférer les accès.</b></div></div>
</div>`,
cues:[
 "Lorsque la fonction de trésorier est retirée dans myCuma Infinity, le compte est désactivé automatiquement.",
 "En cas de changement de trésorier ou de président, pensez à transférer les accès."]});

/* ================= 2 PARAMÉTRAGE ================= */
chapter(2,["Interface d'accueil",'Colonnes de la liste','Une alerte sur vos factures reçues','Notifications et rythme']);

content({ch:2,num:'2.1',title:"Interface d'accueil",html:`
<div class="cols" style="grid-template-columns:560px 1fr">
  <div class="steps">
    <div class="st tile"${R(0,.4)} data-e="1">${ic('grid','big')}<div><h3>Affichage</h3><p>Blocs d'accueil et colonnes de la liste</p></div></div>
    <div class="st tile"${R(0,1.3)}>${ic('bell','big')}<div><h3>Alerte</h3><p>La liste de vos factures à valider, par e-mail</p></div></div>
  </div>
  <div class="panel"><div class="sw"${R(1,0)}>${shot('f07_accueil',880,"Capture : bouton de personnalisation de l'accueil")}</div></div>
</div>`,
cues:["Deux réglages : l'affichage, puis une alerte.",
 "Pour personnaliser les blocs de votre interface d'accueil, cliquez sur le bouton en haut à droite."]});

content({ch:2,num:'2.2',title:'Colonnes de la liste',html:`
<div class="cols" style="grid-template-columns:620px 1fr">
  <div class="steps">
    ${step(1,'Lancez une recherche','Bouton « Rechercher », en bas à gauche.',0,.2,'0')}
    ${step(2,'Ouvrez le paramétrage','Roue crantée, puis « Modifier le tableau de résultats ».',0,.35,'1')}
    ${step(3,'Choisissez vos colonnes','Un bouton ajoute une colonne. Dans la première ligne : retirer ou faire glisser.',0,.5,'2')}
    ${step(4,'Enregistrez','« Sauvegarder les modifications dans mes préférences », puis « Valider ».',0,.65,'3')}
  </div>
  <div class="panel">
    <div class="sw"${R(0,.3,1)}>${shot('f07_rechercher',640,'Capture : bouton Rechercher')}</div>
    <div class="sw"${R(1,0,2)}>${shot('f07_roue',600,'Capture : roue crantée et menu')}</div>
    <div class="sw"${R(2,0,3)}>${shot('f07_colonnes',900,'Capture : modification du tableau de résultats')}</div>
    <div class="sw"${R(3,0)}>${shot('f07_enregistrer',900,'Capture : enregistrement des préférences')}</div>
  </div>
</div>`,
cues:[
 "Pour choisir les colonnes de la liste des factures, lancez d'abord une recherche avec le bouton « Rechercher », en bas à gauche.",
 "Cliquez ensuite sur la roue crantée, en haut à droite, puis sur « Modifier le tableau de résultats ».",
 "Chaque bouton ajoute une colonne. Pour en retirer une, cliquez dessus dans la première ligne, celle des boutons verts ; pour changer l'ordre, faites glisser ces boutons verts.",
 "Activez ensuite les deux choix proposés, surtout « Sauvegarder les modifications dans mes préférences », puis cliquez sur « Valider »."]});

content({ch:2,num:'2.3',title:'Une alerte sur vos factures reçues',html:`
<div class="cols" style="grid-template-columns:660px 1fr">
  <div class="steps sm">
    ${step(1,'Recherche en mode « Expert »','<span class="codes"><span class="code">FE - Statut de traitement des factures</span><span class="code">est égal à</span><span class="code">Reçue de la PA-R</span></span>',0,.3,'1')}
    ${step(2,'Enregistrez la recherche','La disquette, à côté de « Rechercher ».',0,.45,'2')}
    ${step(3,'Renseignez le paramétrage','Nom, réception régulière, jours et heure.',0,.6,'3')}
    ${step(4,'Validez','La recherche s\'affiche dans « Autres éléments ».',0,.75,'4')}
    ${step(5,'Modifier plus tard','Relancez la recherche, puis la disquette.',0,.9,'5')}
  </div>
  <div class="panel">
    <div class="sw"${R(0,.2,1)}><div class="bellc"><div class="bc">${ic('bell')}</div><h3>La liste de vos factures à valider, par e-mail</h3>
      <div class="chips" style="justify-content:center">${chip('list','5 étapes')}${chip('clock','environ 5 minutes')}${chip('check','une seule fois')}</div></div></div>
    <div class="sw"${R(1,0,2)}>${shot('f06_expert',560,'Capture : recherche en mode Expert',hl(1,7,41.5,80,33,3.4))}</div>
    <div class="sw"${R(2,0,3)}>${shot('f06_disquette',680,'Capture : bouton disquette')}</div>
    <div class="sw"${R(3,0,4)}>${shot('f06_param',470,"Capture : paramétrage de l'alerte")}</div>
    <div class="sw"${R(4,0,5)}>${shot('f06_accueil',900,"Capture : la recherche dans l'interface d'accueil")}</div>
    <div class="sw"${R(5,0)}>${shot('f06_disquette',680,'Capture : bouton disquette')}</div>
  </div>
</div>`,
cues:[
 "Le second réglage vous envoie par e-mail la liste de vos factures à valider. Cinq étapes, cinq minutes environ, une seule fois.",
 "Un : lancez une recherche en mode « Expert ». Choisissez le critère « FE - Statut de traitement des factures », puis « est égal à », puis « Reçue de la PA-R ». Cette recherche liste les factures pas encore validées par le réceptionnaire.",
 "Deux : enregistrez-la en cliquant sur la disquette, en bas à gauche, à côté du bouton « Rechercher ».",
 "Trois : nommez la recherche, par exemple « Mes factures reçues non validées ». Activez « Recevoir régulièrement la liste des nouveaux documents correspondants », puis choisissez les jours et l'heure d'envoi.",
 "Quatre : validez. La recherche apparaît sur votre interface d'accueil, dans le bloc « Autres éléments ». Le chiffre indique le nombre de factures concernées ; cliquez dessus pour les afficher.",
 "Cinq : pour modifier l'alerte, relancez la recherche, cliquez de nouveau sur la disquette, ajustez les paramètres et validez."]});

content({ch:2,num:'2.4',title:'Notifications et rythme',html:`
<div class="cols" style="grid-template-columns:1fr 1fr;gap:64px;align-items:center">
  <div>
    <h3 class="colh"${R(0,0)}>${ic('bell','big')}Notifications</h3>
    <div class="notes mt">
      <div class="note"${R(0,.3)}>${ic('mail')}<span>Envoyées sur l'adresse e-mail de votre compte</span></div>
      <div class="note"${R(0,2.2)}>${ic('user')}<span>Contenu et fréquence réglables par utilisateur</span></div>
      <div class="note"${R(0,5.0)}>${ic('bell')}<span>Aucune alerte imposée par défaut</span></div>
    </div>
    <div class="callout mt2"${R(0,7.4)}>${ic('alert')}<div>Alerte hebdomadaire déjà pré-paramétrée par votre fédération ? <b>Attention aux doublons.</b></div></div>
  </div>
  <div>
    <h3 class="colh"${R(1,0)}>${ic('cal','big')}Rythme de validation</h3>
    <div class="notes mt">
      <div class="note"${R(1,.3)}>${ic('x')}<span>Aucun délai légal de validation</span></div>
      <div class="note"${R(1,3.4)}>${ic('check')}<span>Logique de l'administration fiscale : valider avant la date d'échéance</span></div>
      <div class="note o"${R(2,0)}>${ic('alert')}<span>Des factures jamais validées qui s'accumulent peuvent valoir un rappel à l'ordre en cas de contrôle</span></div>
    </div>
    <div class="callout ok mt2"${R(3,0)}>${ic('cal')}<div><b>Préconisation du réseau : au moins une connexion par semaine</b><small>À adapter selon votre volume.</small>
      <div class="week"><span>lun</span><span>mar</span><span>mer</span><span>jeu</span><span>ven</span><span>sam</span><span>dim</span><em class="grow"${R(3,1.2)}></em></div></div></div>
  </div>
</div>`,
cues:[
 "Les e-mails partent sur l'adresse de votre compte. Leur contenu et leur fréquence se règlent par utilisateur ; aucune alerte n'est imposée par défaut. Certaines fédérations ont déjà pré-paramétré une alerte hebdomadaire : attention aux doublons.",
 "Aucun texte n'impose de délai pour valider une facture. La logique de l'administration fiscale : la valider avant sa date d'échéance, puisqu'elle doit être payée à cette date.",
 "Des factures jamais validées qui s'accumulent peuvent valoir un rappel à l'ordre en cas de contrôle.",
 "La préconisation du réseau : se connecter au moins une fois par semaine, à adapter selon votre volume."]});

/* ================= 3 USAGE ================= */
chapter(3,['Trouver et ouvrir une facture','Trois gestes','Refuser : trois motifs','Rejetée, refusée, en litige',"Ce qu'un refus déclenche",'Statuts et bouton « payé »','Annoter une facture',"L'assistant analytique",'Saisir les lignes','Regrouper et valider']);

content({ch:3,num:'3.1',title:'Trouver et ouvrir une facture',html:`
<div class="cols" style="grid-template-columns:1180px 1fr;gap:44px">
  <div class="panel">
    <div class="sw"${R(0,0,1,5.6)}>${shot('f02_accueil',1180,"Capture : interface d'accueil",
       hl(0,0.4,8.5,17.6,83,1.8,1,0)+hl(0,19,15.5,80.6,75,7.4,1,0)+hl(1,9.3,91.5,8.6,8,2.4),'[[1,1.0,1.9,6,97]]')}</div>
    <div class="sw"${R(1,5.6,2)}>${shot('f02_liste',1180,'Capture : liste des factures',hl(1,19,15,80.5,23.5,6.6))}</div>
    <div class="sw"${R(2,0)}>${shot('f02_facture',1180,'Capture : facture ouverte',hl(2,0.4,10.5,17,88.5,3.6)+hl(2,84,11,15.5,88,9.6))}</div>
  </div>
  <div style="position:relative;height:100%">
    <div class="lab" style="top:150px"${R(0,0,2)}>
      <div class="note"${R(0,1.8)}>${ic('filter')}<span>Filtres<small>date, n° de facture, fournisseur…</small></span></div>
      <div class="note"${R(0,7.4)}>${ic('grid')}<span>Encadrés<small>recherches rapides</small></span></div>
      <div class="note"${R(1,2.4)}>${ic('search')}<span>« Rechercher »<small>toutes les factures de votre Cuma</small></span></div>
    </div>
    <div class="lab" style="top:150px"${R(2,0)}>
      <div class="note"${R(2,3.6)}>${ic('file')}<span>Index<small>ce qui caractérise la facture, modifiable selon vos droits</small></span></div>
      <div class="note"${R(2,9.6)}>${ic('pointer')}<span>Actions<small>à droite de la facture</small></span></div>
    </div>
  </div>
</div>`,
cues:[
 "Sur l'interface d'accueil, le panneau de recherche permet de filtrer par date, numéro de facture ou fournisseur, et les encadrés du tableau de bord lancent des recherches rapides.",
 "Pour afficher toutes vos factures, cliquez sur « Rechercher », en bas à gauche : la liste présente toutes les factures adressées à votre Cuma.",
 "Cliquez sur une ligne pour ouvrir la facture. À gauche, les index : les informations qui caractérisent la facture, modifiables selon vos droits. À droite, les actions possibles."]});

content({ch:3,num:'3.2',title:'Trois gestes',html:`
<div class="cols" style="grid-template-columns:1fr 470px;gap:64px">
  <div class="stack" style="gap:20px">
    <div class="chips"${R(0,5.2)}>${chip('check','La facture concerne bien la Cuma')}<span class="chip"${R(0,8.6)}>${ic('check')}Les prix sont contrôlés</span></div>
    <div class="stat" style="--c:var(--green)"${R(0,10.4)} data-e="1">${ic('check')}<div><h3>Approuvée par l'acheteur</h3><p>La facture est correcte. Sans ce geste, elle ne descend pas en comptabilité.</p></div></div>
    <div class="stat" style="--c:var(--orange)"${R(0,10.7)} data-e="2">${ic('scale')}<div><h3>Mise en litige par l'acheteur</h3><p>Prix ou quantités contestés. Réversible : avoir, ou validation si le fournisseur s'explique.</p></div></div>
    <div class="stat" style="--c:var(--ink)"${R(0,11.0)} data-e="3">${ic('xsquare')}<div><h3>Refusée par l'acheteur <span class="tag">Irréversible</span></h3><p>Encadré par la loi. La facture sort du système et ne peut pas être réintégrée.</p></div></div>
  </div>
  <div class="panel"><div class="sw"${R(0,.3)}>${shot('f02_actions',450,"Capture : boutons de statut à droite de la facture",
    hl(1,59.5,36.6,36.5,8.4,.4,2)+hl(2,59.5,54.6,36.5,8.6,.4,3)+hl(3,59.5,71.4,36.5,8.4,.4))}</div></div>
</div>`,
cues:[
 "À réception, vous faites ce que vous faisiez en ouvrant une enveloppe : vérifier que la facture concerne bien la Cuma, et contrôler les prix. Puis vous choisissez entre trois gestes.",
 "La facture est correcte : vous l'approuvez. Sans ce geste, elle ne descendra pas en comptabilité.",
 "Vous contestez le prix ou les quantités : vous la mettez en litige. La facture reste dans le circuit, et ce statut est réversible : vous pouvez demander un avoir, ou valider si le fournisseur s'explique.",
 "Le refus, lui, est encadré par la loi et définitif : la facture sort du système et ne peut pas être réintégrée."]});

content({ch:3,num:'3.3',title:'Refuser : trois motifs, pas un de plus',html:`
<div class="stack" style="gap:14px">
  <p class="lead"${R(0,0)}>Un refus est toujours motivé, et seulement pour l'un de ces trois motifs.</p>
  <div class="mrow"${R(1,0)} data-e="1"><div class="sq">${ic('file')}</div><div><h3>Une mention obligatoire manque</h3><p>Non détectable par la plateforme : notamment le n° de bon de commande, alors que vous l'aviez établi.</p><small>Art. L441-9 du Code de commerce</small></div></div>
  <div class="mrow"${R(2,0)} data-e="2"><div class="sq">${ic('help')}</div><div><h3>La transaction est inconnue</h3><p>Vous ne connaissez ni le fournisseur, ni l'opération.</p></div></div>
  <div class="mrow"${R(3,0)} data-e="3"><div class="sq">${ic('clip')}</div><div><h3>Les conditions du contrat ne sont pas respectées</h3><p>Au point d'empêcher réellement de traiter la facture.</p></div></div>
  <div class="callout"${R(4,0)}>${ic('alert')}<div>Écart de prix, de quantité ou de taux de TVA : c'est un litige, pas un refus. <b>Au moindre doute, c'est le litige.</b></div></div>
</div>`,
cues:[
 "Un refus est toujours motivé, et seuls trois motifs le permettent.",
 "Une mention obligatoire manque, que la plateforme ne pouvait pas détecter, notamment le numéro de bon de commande alors que vous l'aviez établi.",
 "La transaction est inconnue : vous ne connaissez ni le fournisseur, ni l'opération.",
 "Ou les conditions du contrat ne sont pas respectées, au point d'empêcher réellement de traiter la facture.",
 "Un écart de prix, de quantité ou de taux de TVA ne justifie pas un refus : il se traite en litige. Au moindre doute, c'est le litige."]});

content({ch:3,num:'3.4',title:'Rejetée, refusée, en litige',html:`
<div class="tri">
  <div class="sit" style="--c:var(--red)"${R(0,.2)} data-e="1">${ic('xcircle','big')}<h3>Rejetée</h3>
    <p>Bloquée par la plateforme : fichier illisible, doublon, adresse erronée.</p><p>Vous ne la recevez jamais.</p>
    <div class="res">${ic('arrowR')}<span>Le fournisseur corrige et réémet.</span></div></div>
  <div class="sit" style="--c:var(--orange)"${R(0,.4)} data-e="2">${ic('xsquare','big')}<h3>Refusée</h3>
    <p>Bien arrivée, puis refusée par la Cuma pour l'un des trois motifs.</p>
    <div class="res">${ic('arrowR')}<span>Le fournisseur régularise et refacture.</span></div></div>
  <div class="sit" style="--c:var(--amber)"${R(0,.6)} data-e="3">${ic('scale','big')}<h3>En litige</h3>
    <p>Désaccord sur le contenu. La facture reste dans le circuit.</p>
    <div class="res">${ic('arrowR')}<span>Avoir ou facture rectificative du fournisseur.</span></div></div>
</div>`,
cues:[
 "Trois situations à ne pas confondre.",
 "Une facture rejetée est bloquée par la plateforme : fichier illisible, doublon, adresse erronée. Vous ne la recevez jamais ; le fournisseur la corrige et la réémet.",
 "Une facture refusée est bien arrivée : le fournisseur régularise et refacture.",
 "Une facture en litige reste dans le circuit ; elle se règle par un avoir ou une facture rectificative du fournisseur."]});

content({ch:3,num:'3.5',title:"Ce qu'un refus déclenche",html:`
<div class="stack" style="gap:34px;height:100%;justify-content:center">
  <div class="flow">
    <div class="fbox o" style="flex:1"${R(0,0)}>${ic('xsquare','big or')}<div><b>Statut « Refusée »</b><span>posé par la Cuma</span></div></div>
    <div class="farr"${R(0,1.2)}>${ic('arrowR')}</div>
    <div class="fbox" style="flex:1.2"${R(0,1.5)}>${ic('calc','big')}<div><b>TVA</b><span>données ignorées pour le pré-remplissage</span></div></div>
    <div class="farr"${R(0,3.4)}>${ic('arrowR')}</div>
    <div class="fbox" style="flex:1.2"${R(0,3.7)}>${ic('user','big')}<div><b>Fournisseur</b><span>il annule la facture dans ses comptes</span></div></div>
  </div>
  <div class="fbox g"${R(1,0)}>${ic('archive','big')}<div><b>Déjà comptabilisée ?</b><span>L'écriture est annulée. Le statut « Refusée » sert de pièce justificative : à conserver.</span></div></div>
  <div class="callout"${R(2,0)}>${ic('clock')}<div><b>Refusez vite, ou pas du tout.</b><small>Après la période de pré-remplissage, un refus n'a plus d'effet fiscal : au-delà, c'est le litige.</small></div></div>
</div>`,
cues:[
 "Un refus écarte la facture du pré-remplissage de TVA, et le fournisseur l'annule dans ses comptes.",
 "Si elle avait déjà été comptabilisée, l'écriture est annulée ; le statut « Refusée » sert alors de pièce justificative, à conserver.",
 "Enfin, refusez vite, ou pas du tout : après la période de pré-remplissage, un refus n'a plus d'effet fiscal. Au-delà, on utilise le litige."]});

content({ch:3,num:'3.6',title:'Statuts automatiques et bouton « payé »',html:`
<div class="cols" style="grid-template-columns:1fr 440px;gap:64px">
  <div class="stack" style="gap:30px">
    <div class="card top"${R(0,0)}><div class="ch">${ic('zap','big')}<h3>Le seul statut obligatoire en réception</h3></div>
      <p>Il est automatique : la plateforme signale qu'elle a reçu la facture, ou la rejette pour un motif technique.</p></div>
    <div class="card top" style="--c:var(--orange)"${R(1,0)}><div class="ch">${ic('card','big or')}<h3>Le bouton « payé »</h3></div>
      <div class="notes">
        <div class="note"${R(1,1.0)}>${ic('check')}<span>Facultatif en réception</span></div>
        <div class="note"${R(1,2.6)}>${ic('send')}<span>Transmet un statut au fournisseur</span></div>
        <div class="note o"${R(1,4.6)}>${ic('x')}<span>Ne déclenche aucun paiement</span></div>
        <div class="note"${R(1,7.0)}>${ic('clock')}<span>Deviendra obligatoire à l'encaissement</span></div>
      </div></div>
  </div>
  <div class="panel"><div class="sw"${R(0,.3)}>${shot('f02_actions',430,'Capture : boutons de statut',hl(1,59.5,80.2,36.5,8.6,1.0))}</div></div>
</div>`,
cues:[
 "Le seul statut obligatoire en réception est automatique : la plateforme signale qu'elle a reçu la facture, ou la rejette pour un motif technique.",
 "Le bouton « payé », lui, est facultatif en réception : il transmet un statut au fournisseur, mais ne déclenche aucun paiement. Il deviendra obligatoire à l'encaissement."]});

content({ch:3,num:'3.7',title:'Annoter une facture',html:`
<div class="cols" style="grid-template-columns:1020px 1fr;gap:56px">
  <div class="panel"><div class="sw"${R(0,0)}>${shot('f02_facture',1000,'Capture : facture ouverte',hl(0,84,11,15.5,88,3.6))}</div></div>
  <div class="stack" style="gap:26px">
    <div class="card top" style="--c:var(--sky)"${R(0,.4)}><div class="ch">${ic('sticky','big')}<h3>« Ajouter une note »</h3></div>
      <p>Dans le bandeau de droite. La note s'ajoute sans modifier l'original.</p></div>
    <div class="notes">
      <div class="note"${R(1,.3)}>${ic('eye')}<span>Visible dans la plateforme</span></div>
      <div class="note o"${R(1,2.8)}>${ic('x')}<span>Ne part pas vers la comptabilité</span></div>
      <div class="note"${R(1,5.8)}>${ic('file')}<span>Le comptable la voit s'il ouvre la facture</span></div>
    </div>
  </div>
</div>`,
cues:[
 "Pour annoter une facture, utilisez « Ajouter une note », dans le bandeau de droite. La note s'ajoute sans modifier l'original.",
 "Elle est visible dans la plateforme, mais ne part pas vers la comptabilité : le comptable ne la voit que s'il ouvre la facture."]});

content({ch:3,num:'3.8',title:"L'assistant analytique",html:`
<div class="layer"${R(0,0,2)}>
  <div class="cols" style="grid-template-columns:560px 1fr">
    <div class="stack">
      <p class="lead">Un développement réalisé par Zeendoc pour le réseau Cuma.</p>
      <div class="note"${R(0,2.6)}>${ic('tag')}<span>Saisir l'analytique et le matériel concernés par une facture</span></div>
      <div class="note"${R(0,7.6)}>${ic('edit')}<span>Remplace les annotations manuelles sur la facture papier</span></div>
    </div>
    <div class="panel">
      <div class="sw"${R(0,.4,1)}>${shot('f08_montant',900,"Capture : l'assistant analytique")}</div>
      <div class="sw"${R(1,0)}>${shot('f08_bouton',640,'Capture : bouton orange Assistant analytique')}</div>
    </div>
  </div>
</div>
<div class="layer" style="gap:30px;justify-content:center"${R(2,0)}>
  <div style="display:flex;justify-content:center">${shot('f08_montant',1340,"Capture : la facture à gauche, la saisie à droite",hl(2,0.4,1,49.6,98,.4,2,3.2)+hl(2,50.6,1,49,98,3.4))}</div>
  <div class="tiles4">
    <div class="colc"${R(2,6.9)}><b>Libellé</b><span>Texte libre : désignation, commentaire facultatif</span></div>
    <div class="colc"${R(2,9.9)}><b>Analytique</b><span>Le code = le matériel concerné</span></div>
    <div class="colc"${R(2,11.0)}><b>Quantité</b><span>La quantité</span></div>
    <div class="colc"${R(2,12.9)}><b>Montant HT</b><span>Le montant concerné par la ligne</span></div>
  </div>
</div>`,
cues:[
 "L'assistant analytique, développé par Zeendoc pour le réseau Cuma, sert à saisir l'analytique et le matériel concernés par une facture. Il remplace les annotations manuelles sur la facture papier.",
 "Facture ouverte, cliquez sur le bouton orange « Assistant analytique », dans le menu de droite.",
 "À gauche s'affiche la facture ; à droite, la saisie en quatre colonnes : le libellé, en texte libre ; le code analytique, c'est-à-dire le matériel concerné ; la quantité ; et le montant hors taxes."]});

content({ch:3,num:'3.9',title:'Saisir les lignes',html:`
<div class="cols" style="grid-template-columns:600px 1fr">
  <div class="steps">
    ${step(1,'Créer une ligne','« Ajouter une ligne », ou un clic sur un montant de la facture : la ligne reprend ce montant.',0,.2,'0')}
    ${step(2,'Libellé','Même principe pour le texte. Le libellé reste libre.',0,.35,'1')}
    ${step(3,'Code analytique','Les codes de votre Cuma, mis à jour chaque nuit. Par défaut : « 0 / A affecter ».',0,.5,'2')}
  </div>
  <div class="panel">
    <div class="sw"${R(0,.2,1)}>${shot('f08_montant',900,"Capture : clic sur un montant",hl(0,50.6,42.5,9.4,7.5,2.6)+hl(0,40.8,76.5,7.6,8,5.6)+hl(0,85.2,24,7.4,7,7.4))}</div>
    <div class="sw"${R(1,0,2)}>${shot('f08_texte',900,'Capture : sélection de texte dans la facture')}</div>
    <div class="sw"${R(2,0)}>${shot('f08_codes',500,'Capture : liste des codes analytiques')}</div>
  </div>
</div>`,
cues:[
 "Pour créer une ligne, cliquez sur « Ajouter une ligne », ou directement sur un montant de la facture : la ligne reprend ce montant.",
 "Même principe pour le texte. Le libellé reste libre.",
 "Choisissez ensuite le code dans la liste, en tapant un mot pour le rechercher. Les codes proposés sont ceux de votre Cuma, mis à jour chaque nuit. Une nouvelle ligne est par défaut sur « 0 / A affecter »."]});

content({ch:3,num:'3.10',title:'Regrouper et valider',html:`
<div class="cols" style="grid-template-columns:780px 1fr;gap:70px;align-items:center">
  <div class="stack" style="gap:30px">
    <div class="callout ok"${R(0,.3)}>${ic('check')}<div><b>1 ligne = 1 matériel.</b><small>Une ligne peut regrouper plusieurs lignes de la facture.</small></div></div>
    <div class="ledg"${R(0,6.0)}>
      <div class="lh"><span>Lignes de la facture</span><span>Montant HT</span></div>
      <div class="lr"${R(0,6.9)}><span>Dent…</span><span class="m">75,60 €</span></div>
      <div class="lr"${R(0,8.3)}><span>Soc…</span><span class="m">190,00 €</span></div>
      <div class="lsum"${R(0,9.8)}>${ic('arrowD')}<span>même code analytique</span></div>
      <div class="lt"${R(0,11.4)}><span><span class="code">CHA01</span> une seule ligne</span><span class="m tot">265,60 €</span></div>
    </div>
  </div>
  <div class="stack" style="gap:26px">
    <div${R(1,.3)}>${shot('f08_valider',520,'Capture : boutons Enregistrer en brouillon et Valider la facture')}</div>
    <div class="note"${R(1,.5)}>${ic('check')}<span>« Valider la facture »<small>en bas à droite</small></span></div>
    <div class="note"${R(1,5.0)}>${ic('save')}<span>« Enregistrer en brouillon »<small>pour reprendre plus tard</small></span></div>
    <div${R(1,8.4)}>${shot('f08_effacer',400,'Capture : bouton Tout effacer')}</div>
    <div class="note o"${R(1,8.6)}>${ic('trash')}<span>« Tout effacer »<small>en haut à droite, pour repartir de zéro</small></span></div>
  </div>
</div>`,
cues:[
 "Une ligne correspond à un matériel, et peut regrouper plusieurs lignes de la facture : par exemple, 75,60 euros et 190 euros sur le même code donnent une ligne de 265,60 euros.",
 "Pour terminer, cliquez sur « Valider la facture », en bas à droite. « Enregistrer en brouillon » permet de reprendre plus tard ; « Tout effacer », en haut à droite, de repartir de zéro."]});

/* ================= 4 INFORMATIONS GÉNÉRALES ================= */
chapter(4,['Qui fait quoi','Le SIREN, votre adresse de facturation','Une seule plateforme interopérée','Changer de plateforme','Démarrage : ce qui change','Démarrage : cas pratiques','Sanctions et pièces à garder','Ce qui est prévu']);

content({ch:4,num:'4.1',title:'Qui fait quoi',html:`
<div class="stack" style="gap:44px">
  <div class="tri" style="height:auto;padding:0">
    <div class="who"${R(0,.2)} data-e="1">${ic('home','big')}<h3>La Cuma</h3><p>Le trésorier <b>ouvre, vérifie, valide</b>.</p><p>Seule la Cuma, destinataire de la facture, peut la valider ou l'infirmer.</p></div>
    <div class="who"${R(0,.4)} data-e="2">${ic('network','big')}<h3>La fédération</h3><p>L'animateur <b>forme, dépanne</b> et répond à vos questions.</p><p>Il ne saisit pas à votre place.</p></div>
    <div class="who"${R(0,.6)} data-e="3">${ic('calc','big')}<h3>Le centre comptable</h3><p>La <b>saisie comptable</b> reste de son ressort.</p><p>Il télécharge les factures une fois validées.</p></div>
  </div>
  <div class="flow"${R(4,0)}>
    <div class="fbox" style="flex:1">${ic('mail','big')}<div><b>Facture reçue</b></div></div>
    <div class="farr">${ic('arrowR')}</div>
    <div class="fbox o" style="flex:1.3">${ic('lock','big or')}<div><b>Validée par la Cuma</b><span>sinon, téléchargement bloqué</span></div></div>
    <div class="farr">${ic('arrowR')}</div>
    <div class="fbox g" style="flex:1.3">${ic('download','big')}<div><b>Téléchargée</b><span>par le centre comptable</span></div></div>
  </div>
</div>`,
cues:[
 "Ce dossier fonctionne à trois.",
 "La Cuma : le trésorier ouvre, vérifie et valide ; seule la Cuma, destinataire de la facture, peut la valider ou l'infirmer.",
 "La fédération : l'animateur vous forme, vous dépanne et répond à vos questions ; il ne saisit pas à votre place.",
 "Le centre comptable : la saisie comptable reste de son ressort, et il télécharge les factures une fois validées.",
 "Ce téléchargement reste bloqué tant que la Cuma n'a pas validé la facture."]});

content({ch:4,num:'4.2',title:'Le SIREN, votre adresse de facturation',html:`
<div class="stack" style="gap:44px;padding-top:10px">
  <div class="siren">
    <div class="sbox no"${R(0,0)}>${ic('mail')}<div>Une adresse e-mail</div><div class="strike grow"${R(0,2.6)}></div></div>
    <div class="farr"${R(0,3.4)}>${ic('arrowR')}</div>
    <div class="sbox yes"${R(0,3.8)}>${ic('hash')}<div>Le SIREN<small>l'adresse électronique de facturation</small></div></div>
  </div>
  <div class="two"${R(1,0)}>
    <div class="fbox">${ic('home','big')}<div><b>Dossier de la Cuma</b><span>son SIREN</span></div></div>
    <div class="wall"><i></i></div>
    <div class="fbox">${ic('user','big')}<div><b>Exploitation d'un adhérent</b><span>un autre SIREN, un autre dossier</span></div></div>
  </div>
  <div class="callout"${R(2,0)}>${ic('send')}<div><b>Communiquez le bon SIREN à vos fournisseurs.</b><small>Sinon, la facture peut être rejetée ou ne pas être distribuée.</small></div></div>
</div>`,
cues:[
 "Une facture électronique n'arrive pas par une adresse e-mail, mais via le SIREN : c'est lui, l'adresse électronique de facturation.",
 "C'est aussi lui qui sépare le dossier de la Cuma de celui de l'exploitation d'un adhérent.",
 "Communiquez le bon SIREN à vos fournisseurs : sinon, la facture peut être rejetée ou ne pas être distribuée."]});

content({ch:4,num:'4.3',title:'Une seule plateforme interopérée',html:`
<div class="stack" style="gap:70px;padding-top:40px">
  <div class="drow"${R(0,0)}>
    <div class="node">${ic('globe')}Plateforme du réseau</div>
    <div class="link"><span>${ic('zap')}interopérée</span></div>
    <div class="node">${ic('db')}Logiciel métier</div>
    <div class="link"><span>automatique</span></div>
    <div class="node">${ic('book')}Comptabilité</div>
  </div>
  <div class="drow"${R(1,0)}>
    <div class="node alt">${ic('globe')}Autre plateforme</div>
    <div class="link broken"><span>ressaisie à la main, dépôt manuel des PDF</span><div class="x">${ic('x')}</div></div>
    <div class="node">${ic('book')}Comptabilité</div>
  </div>
  <div class="callout ok"${R(2,0)}>${ic('db')}<div><b>Avec myCuma Infinity, la plateforme du réseau reste payée</b>, même si la Cuma en choisit une autre.<small>Son tarif a été négocié sur le volume de tout le réseau.</small></div></div>
</div>`,
cues:[
 "Le réseau a interopéré une seule plateforme avec le logiciel métier.",
 "Une Cuma reste libre d'en choisir une autre, mais elle perd la remontée automatique vers la comptabilité : ressaisie à la main, dépôt manuel des PDF.",
 "Si elle utilise myCuma Infinity, elle paie quand même la plateforme du réseau, dont le tarif a été négocié sur le volume de tout le réseau."]});

content({ch:4,num:'4.4',title:'Changer de plateforme',html:`
<div class="stack" style="gap:46px;padding-top:6px">
  <div class="cols" style="grid-template-columns:1fr 1fr;gap:34px;height:auto">
    <div class="fbox"${R(0,.2)}>${ic('xcircle','big or')}<div><b>Pas de portabilité automatique</b></div></div>
    <div class="fbox"${R(0,2.6)}>${ic('xcircle','big or')}<div><b>Pas d'obligation légale de transférer les documents</b></div></div>
  </div>
  <div${R(1,0)}>
    <h3 class="colh">${ic('archive','big')}Conservation des pièces</h3>
    <div class="bars">
      <div class="bar"><span>Minimum légal pour les plateformes</span><div class="tr"><div class="fill grow" style="width:20%;background:#7FA88F"${R(1,1.0)}>2 ans</div></div></div>
      <div class="bar"><span>Plateforme du réseau</span><div class="tr"><div class="fill grow" style="width:100%;background:var(--green)"${R(1,3.6)}>10 ans</div></div></div>
    </div>
  </div>
  <div class="callout"${R(2,0)}>${ic('download')}<div><b>Avant de partir, récupérez vos documents.</b></div></div>
</div>`,
cues:[
 "En cas de changement de plateforme, il n'y a ni portabilité automatique, ni obligation légale de transférer les documents.",
 "La loi impose aux plateformes de les conserver deux ans ; celle du réseau en propose dix.",
 "C'est à vous de récupérer vos documents avant de partir."]});

content({ch:4,num:'4.5',title:'Démarrage : ce qui change',src:DGFIP,html:`
<div class="stack" style="gap:40px;padding-top:6px">
  <p class="lead"${R(0,.3)}>La réforme change le canal, pas les règles de fond.</p>
  <div class="tiles4">
    <div class="t4"${R(0,6.2)}><b>Dette</b><span>${ic('check')}inchangée</span></div>
    <div class="t4"${R(0,6.7)}><b>Paiement</b><span>${ic('check')}inchangé</span></div>
    <div class="t4"${R(0,7.2)}><b>Comptabilisation</b><span>${ic('check')}inchangée</span></div>
    <div class="t4"${R(0,8.4)}><b>Déduction de TVA</b><span>${ic('check')}inchangée</span></div>
  </div>
  <div class="tl"${R(1,0)}>
    <div class="ln"><em class="grow"${R(1,.3)}></em></div>
    <div class="ms" style="left:0"><i></i><b>1<sup>er</sup> septembre 2026</b><span>Recevoir ses factures via une plateforme agréée</span></div>
    <div class="ms b" style="left:58%"${R(1,1.2)}><i></i><b>Septembre 2027</b><span>Émettre ses factures électroniques</span></div>
  </div>
</div>`,
cues:[
 "Côté administration fiscale, la réforme change le canal, pas les règles de fond : dette, paiement, comptabilisation et déduction de TVA restent les mêmes.",
 "Votre obligation d'émettre des factures électroniques commence en septembre 2027."]});

content({ch:4,num:'4.6',title:'Démarrage : cas pratiques',src:DGFIP,html:`
<div class="stack" style="gap:18px;padding-top:4px">
  <div class="case"${R(0,0)} data-e="0"><div class="sit2">${ic('mail')}Facture reçue par e-mail, en PDF ou sur papier</div><div class="arr">${ic('arrowR')}</div>
    <div class="rep">Elle se traite et se paie. <b>TVA déductible</b> si l'opération est réelle et les mentions présentes.</div></div>
  <div class="case"${R(1,0)} data-e="1"><div class="sit2">${ic('layers')}Même facture reçue par deux canaux</div><div class="arr">${ic('arrowR')}</div>
    <div class="rep">Rapprochement : n°, fournisseur, date, HT, TVA, TTC. Une seule sert au paiement, l'autre est marquée « duplicata ». <b>Jamais deux paiements, ni deux TVA.</b></div></div>
  <div class="case"${R(2,0)} data-e="2"><div class="sit2">${ic('alert')}Votre logiciel n'affiche pas la facture</div><div class="arr">${ic('arrowR')}</div>
    <div class="rep">Signalez-le à la fédération, au centre comptable ou au support de la SAS. Traitement transitoire tracé, <b>sans retarder le paiement</b>.</div></div>
</div>`,
cues:[
 "Une facture reçue par e-mail, en PDF ou sur papier se traite et se paie ; sa TVA se déduit si l'opération est réelle et les mentions présentes.",
 "Si la même facture arrive par deux canaux, et que numéro, fournisseur, date et montants concordent, c'est une seule facture : l'une sert au paiement, l'autre est marquée « duplicata ». Jamais deux paiements, ni deux TVA.",
 "Si votre logiciel n'affiche pas une facture, signalez-le à votre fédération, à votre centre comptable ou au support de la SAS, et appliquez un traitement transitoire tracé. Un souci de paramétrage ne justifie pas de retarder un paiement."]});

content({ch:4,num:'4.7',title:'Sanctions et pièces à garder',src:DGFIP,html:`
<div class="cols" style="grid-template-columns:1fr 720px;gap:64px;align-items:center">
  <div class="stack" style="gap:24px">
    <h3 class="colh"${R(0,0)}>${ic('shield','big')}Pas de sanction automatique</h3>
    <div class="note"${R(0,.4)}>${ic('check')}<span>Difficulté réelle, documentée et vite corrigée<small>pas de sanction d'emblée</small></span></div>
    <div class="note"${R(0,5.3)}>${ic('clock')}<span>En réception : mise en demeure de 3 mois<small>avant toute amende</small></span></div>
    <div class="note"${R(0,10.0)}>${ic('cal')}<span>Tolérance de délai<small>accordée au moins jusqu'à fin 2026</small></span></div>
    <div class="callout"${R(1,0)}>${ic('alert')}<div><b>L'obligation n'est ni reportée ni suspendue.</b></div></div>
  </div>
  <div class="dos"${R(2,0)}>
    <div class="ch">${ic('archive','big')}<h3>Pièces à garder</h3></div>
    <div class="dline"${R(2,3.6)}>${ic('check')}Factures reçues et leur date</div>
    <div class="dline"${R(2,4.5)}>${ic('check')}Preuves d'incident ou de rejet</div>
    <div class="dline"${R(2,6.0)}>${ic('check')}Échanges avec l'éditeur ou le centre comptable</div>
    <div class="dline"${R(2,8.6)}>${ic('check')}Tickets de support</div>
  </div>
</div>`,
cues:[
 "Une difficulté réelle, documentée et vite corrigée n'est pas sanctionnée d'emblée : en réception, une mise en demeure de trois mois précède l'amende, et une tolérance de délai a été accordée au moins jusqu'à fin 2026.",
 "L'obligation, elle, n'est ni reportée ni suspendue.",
 "Gardez donc les pièces de votre démarche : factures reçues, preuves d'incident, échanges avec l'éditeur ou le centre comptable, tickets de support."]});

content({ch:4,num:'4.8',title:'Ce qui est prévu',html:`
<div class="stack" style="gap:34px">
  <div${R(0,0)}><span class="banner">${ic('cal')}État en septembre 2026</span></div>
  <div class="cols" style="grid-template-columns:1fr 1fr;gap:64px;align-items:start;height:auto">
    <div>
      <h3 class="colh"${R(1,.2)}><i></i>En cours</h3>
      <div class="notes">
        <div class="note"${R(1,1.0)}>${ic('mail')}<span>Une lettre d'information reprenant les fiches pratiques</span></div>
        <div class="note"${R(1,4.0)}>${ic('user')}<span>Désactivation des comptes inactifs depuis plus d'un an</span></div>
        <div class="note"${R(1,8.4)}>${ic('refresh')}<span>Traitement des mandats bloqués et des erreurs d'inscription</span></div>
        <div class="note"${R(2,.3)}>${ic('x')}<span>Statuts inutiles retirés de l'affichage<small>approbation partielle, annulation</small></span></div>
      </div>
    </div>
    <div>
      <h3 class="colh q"${R(3,.2)}><i></i>À confirmer</h3>
      <div class="notes">
        <div class="note o"${R(3,.9)}>${ic('grid')}<span>Un affichage paramétré par défaut</span></div>
        <div class="note o"${R(3,3.1)}>${ic('bell')}<span>Une alerte de base automatique</span></div>
        <div class="note o"${R(3,5.3)}>${ic('sticky')}<span>La transmission des notes vers la comptabilité</span></div>
        <div class="note o"${R(3,8.3)}>${ic('tag')}<span>Le libellé : « prise en charge » ou « approuvé par l'acheteur »</span></div>
      </div>
    </div>
  </div>
</div>`,
cues:[
 "Plusieurs évolutions sont annoncées.",
 "En cours : une lettre d'information reprenant les fiches pratiques, la désactivation des comptes inactifs depuis plus d'un an, et le traitement des mandats bloqués et des erreurs d'inscription.",
 "Les statuts inutiles, comme l'approbation partielle ou l'annulation, seront retirés de l'affichage.",
 "À confirmer : un affichage paramétré par défaut, une alerte de base automatique, la transmission des notes vers la comptabilité, et le choix entre les libellés « prise en charge » et « approuvé par l'acheteur »."]});

/* ================= CLÔTURE ================= */
SC.push({kind:'outro',title:'Clôture',html:`
  ${hills()}
  <h2 class="otitle"${R(0,0)}>Une question ?</h2>
  <p class="osub"${R(0,.3)}>Votre référent Fédération / AGC</p>
  <div class="ourl"${R(0,.8)}>${ic('lock')}ged.cuma.fr</div>
  <img class="ologo"${R(0,1.4)} src="${A.logo_white}" alt="Cuma France">
  <div class="odate"${R(0,1.6)}>Réseau Cuma, septembre 2026</div>`,
  cues:['Pour toute question, adressez-vous à votre référent Fédération ou AGC.'],tail:4});
