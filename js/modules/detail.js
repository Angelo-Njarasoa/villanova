// Page détail : récupère l'événement depuis sessionStorage ou les données démo, remplit le DOM

import { EVENEMENTS_DEMO }           from './demo-data.js';
import { recupererEvenementsDeSession } from './storage.js';
import { initialiserNavigationClavier } from './navigation.js';

function afficherDetailEvenement(ev) {
  const titreEvenement = document.getElementById('titre-evenement');
  if (titreEvenement) titreEvenement.textContent = ev.titre.fr;

  const correspondances = {
    'badge1-jour': ev.premierJour,
    'badge1-mois': ev.premierMois,
    'badge2-jour': ev.dernierJour,
    'badge2-mois': ev.dernierMois
  };
  Object.entries(correspondances).forEach(([id, valeur]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = valeur;
  });

  const photo = document.getElementById('photo-evenement');
  if (photo) {
    photo.src = ev.imageSource || `https://picsum.photos/seed/${ev.identifiant}/1200/800`;
    photo.alt = `Photo : ${ev.titre.fr}`;
  }

  const champsTexte = {
    'detail-quand':   ev.periodeDate.fr,
    'detail-ou':      ev.lieu.nom,
    'detail-adresse': ev.lieu.adresse,
    'pres-titre':     ev.titre.fr,
    'pres-texte':     ev.description.fr
  };
  Object.entries(champsTexte).forEach(([id, valeur]) => {
    const el = document.getElementById(id);
    if (el && valeur) el.textContent = valeur;
  });

  document.title = `${ev.titre.fr} — Villa Nova`;
}

export async function initialiserPageDetail() {
  const id = new URLSearchParams(window.location.search).get('id');
  if (!id) { window.location.href = 'index.html'; return; }

  let evenement = null;

  // 1. Événement courant sauvegardé lors du clic
  try {
    const s = sessionStorage.getItem('vn_evenement_courant');
    if (s) { const p = JSON.parse(s); if (String(p.identifiant) === id) evenement = p; }
  } catch (e) {}

  // 2. Liste complète en session
  if (!evenement) {
    const liste = recupererEvenementsDeSession();
    if (liste) evenement = liste.find(e => String(e.identifiant) === id);
  }

  // 3. Données démo en dernier recours
  if (!evenement) evenement = EVENEMENTS_DEMO.find(e => String(e.identifiant) === id);

  if (evenement) {
    afficherDetailEvenement(evenement);
    initialiserNavigationClavier();
  } else {
    document.body.innerHTML = `
      <div style="text-align:center;padding:40px;">
        <p>Événement introuvable.</p>
        <a href="index.html" style="display:inline-block;margin-top:16px;
          background:#1a3a5c;color:#fff;padding:10px 24px;
          border-radius:24px;font-weight:600;">← Retour</a>
      </div>`;
  }
}
