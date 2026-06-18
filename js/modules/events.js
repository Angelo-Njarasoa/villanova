// Cartes d'événements : création DOM et injection dans la liste

import { sauvegarderEvenementsEnSession } from './storage.js';

function creerCarteEvenement(ev, index) {
  const carte = document.createElement('article');
  carte.className = 'carte-evenement';
  carte.id        = `carte-evenement-${index}`;
  carte.setAttribute('tabindex', '0');
  carte.setAttribute('role', 'listitem');
  carte.setAttribute('aria-label',
    `Événement ${index + 1} : ${ev.titre.fr}. ${ev.periodeDate.fr}. Appuyez sur Entrée pour les détails.`
  );

  // Dimensions explicites pour éviter le layout shift (CLS)
  const image = document.createElement('img');
  image.className = 'carte-image';
  image.loading   = 'lazy';
  image.width     = 120;
  image.height    = 88;
  image.alt       = `Photo : ${ev.titre.fr}`;
  image.src       = ev.imageSource || `https://picsum.photos/seed/${ev.identifiant}/1200/800`;

  const infos = document.createElement('div');
  infos.className = 'carte-infos';

  const titre = document.createElement('h3');
  titre.className   = 'carte-titre';
  titre.textContent = ev.titre.fr;

  const date = document.createElement('p');
  date.className   = 'carte-date';
  date.textContent = ev.periodeDate.fr;

  const lieu = document.createElement('p');
  lieu.className   = 'carte-lieu';
  lieu.textContent = ev.lieu.nom;

  const description = document.createElement('p');
  description.className   = 'carte-description';
  description.textContent = ev.description.fr;

  infos.append(titre, date, lieu, description);
  carte.append(image, infos);

  function allerAuDetail() {
    sessionStorage.setItem('vn_evenement_courant', JSON.stringify(ev));
    window.location.href = `event-detail.html?id=${ev.identifiant}`;
  }
  carte.addEventListener('click', allerAuDetail);
  carte.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); allerAuDetail(); }
  });

  return carte;
}

export function afficherEvenements(evenements) {
  const liste = document.getElementById('liste-evenements');
  if (!liste) return;
  liste.innerHTML = '';
  if (!evenements.length) {
    liste.innerHTML = '<p class="message-chargement">Aucun événement trouvé.</p>';
    return;
  }
  sauvegarderEvenementsEnSession(evenements);
  evenements.forEach((ev, i) => liste.appendChild(creerCarteEvenement(ev, i)));
}
