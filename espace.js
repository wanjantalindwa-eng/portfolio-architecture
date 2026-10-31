/* Espace client : coordonnées, rendez-vous et accès à la proposition. Rien n'est envoyé par le site : tout passe par WhatsApp. */
(function(){
const CABINET={nom:"Wanja Ntalindwa",wa:"243975856178",waVu:"+243 97 585 61 78",tel:"+243826836115",telVu:"+243 82 683 61 15",mail:"wanjastan@live.fr",ville:"Kinshasa"};
const q=s=>document.querySelector(s);
const waLien=t=>"https://wa.me/"+CABINET.wa+"?text="+encodeURIComponent(t);
const salut=()=>new Date().getHours()<17?"Bonjour":"Bonsoir";
function toast(t){let z=q("#toast");if(!z){z=document.createElement("div");z.id="toast";z.setAttribute("role","status");document.body.appendChild(z)}z.textContent=t;z.classList.add("on");clearTimeout(toast.m);toast.m=setTimeout(()=>z.classList.remove("on"),2400)}
async function copier(t,el){try{await navigator.clipboard.writeText(t);toast("✓ Copié")}catch(e){if(el){const r=document.createRange();r.selectNodeContents(el);const s=getSelection();s.removeAllRanges();s.addRange(r)}toast("Sélectionné : copiez-le")}}
function ouvrir(u){const a=document.createElement("a");a.href=u;a.target="_blank";a.rel="noopener";document.body.appendChild(a);a.click();a.remove()}

/* 1. Ma proposition : un lien reçu (avec #p= ou #r=) ou un n° de note */
const lien=q("#ec-lien"),msg=q("#ec-msg"),bOuv=q("#ec-ouvrir");
function lireSaisie(){
 const v=(lien.value||"").trim();if(!v)return{type:"vide"};
 const h=/#([pr]=[^\s]+)/.exec(v);if(h)return{type:"page",hash:h[1]};
 const n=/(HN-[0-9A-Z-]+)|HSN1\|num=([^|\s&]+)/i.exec(v);if(n)return{type:"num",num:(n[1]||n[2]).toUpperCase()};
 return{type:"autre",v};
}
function majNote(){const s=lireSaisie();
 bOuv.textContent=s.type==="num"?"Demander ma note sur WhatsApp":"Ouvrir ma proposition";
 msg.textContent=s.type==="page"?"Lien reconnu : votre proposition s'ouvre dans la page client.":s.type==="num"?"Je vous renvoie le lien de la note "+s.num+" sur WhatsApp.":s.type==="autre"?"Collez le lien reçu sur WhatsApp, ou le numéro qui commence par HN-.":""}
if(lien){lien.addEventListener("input",majNote);bOuv.addEventListener("click",()=>{const s=lireSaisie();
 if(s.type==="page")location.href="client/index.html#"+s.hash;
 else if(s.type==="num")ouvrir(waLien(`${salut()} 🙂 Je souhaite revoir ma note d'honoraires ${s.num}. Pouvez-vous me renvoyer le lien ?`));
 else{lien.focus();msg.textContent="Collez le lien reçu sur WhatsApp, ou le numéro qui commence par HN-."}});majNote()}

/* 2. Contacts */
document.querySelectorAll("[data-copier]").forEach(b=>b.addEventListener("click",()=>{const el=q(b.dataset.copier);copier(el.textContent.replace(/\s+/g,el.dataset.brut?"":" ").trim(),el)}));
const bWa=q("#ec-wa");if(bWa)bWa.href=waLien(`${salut()} 🙂 J'ai vu votre site et j'aimerais parler de mon projet.`);

/* 3. Rendez-vous : message prêt pour WhatsApp */
const rj=q("#rv-j"),rh=q("#rv-h"),rn=q("#rv-n"),rm=q("#rv-m");let lieu="au cabinet";
if(rj){const d=new Date();d.setDate(d.getDate()+1);if(d.getDay()===0)d.setDate(d.getDate()+1);rj.value=d.toISOString().slice(0,10);rj.min=new Date().toISOString().slice(0,10);rh.value="10:00"}
function texteRdv(){if(!rj||!rj.value)return"";
 const d=new Date(rj.value+"T"+(rh.value||"10:00"));const jour=d.toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"});
 const h=(rh.value||"10:00").replace(":"," h ");const nom=(rn.value||"").trim();
 return `${salut()} 🙂${nom?" Je suis "+nom+".":""} Je souhaite un rendez-vous ${lieu==="par téléphone"?"téléphonique":lieu} le ${jour} à ${h}, pour parler de mon projet. Ce créneau vous convient-il ?`}
function majRdv(){if(rm)rm.textContent=texteRdv()}
document.querySelectorAll("#rv-lieu button").forEach(b=>b.addEventListener("click",()=>{lieu=b.dataset.lieu;document.querySelectorAll("#rv-lieu button").forEach(x=>x.setAttribute("aria-pressed",x===b));majRdv()}));
[rj,rh,rn].forEach(e=>e&&e.addEventListener("input",majRdv));majRdv();
const bRdv=q("#rv-env");if(bRdv)bRdv.addEventListener("click",()=>{if(!rj.value){rj.focus();return}ouvrir(waLien(texteRdv()));toast("✓ Message prêt dans WhatsApp")});

/* Les boutons « Parlons d'un projet similaire » écrivent sur WhatsApp avec le nom du projet */
const titre=q("#dialogtitle"),bSim=document.querySelector("dialog .blackbutton");
if(titre&&bSim){const maj=()=>{bSim.href=waLien(`${salut()} 🙂 J'ai vu « ${titre.textContent} » sur votre site. J'aimerais un projet dans le même esprit.`);bSim.target="_blank";bSim.rel="noopener"};new MutationObserver(maj).observe(titre,{childList:true,characterData:true,subtree:true});maj()}
})();
