// Navigation clavier globale : flèches haut/bas parcourent les éléments focusables de la page

import { indexCarrousel } from './carousel.js';
import { changerCalendrier } from './calendar.js';

function obtenirArretsPage() {
  const page = document.body.dataset.page;

  if (page === 'accueil') {
    const piste      = document.getElementById('piste-carrousel');
    const diapActive = piste ? piste.querySelectorAll('.diapo-interieur')[indexCarrousel] : null;
    return [
      document.querySelector('.bouton-menu'),
      document.querySelector('.bouton-recherche'),
      diapActive,
      ...document.querySelectorAll('.carte-evenement'),
      document.getElementById('cal-precedent'),
      document.getElementById('boite-calendrier'),
      document.getElementById('cal-suivant'),
      document.querySelector('.bouton-agenda'),
      ...document.querySelectorAll('.pied-page a, .pied-page button')
    ].filter(Boolean);
  }

  if (page === 'detail') {
    return [...document.querySelectorAll(
      '.bouton-menu, .bouton-recherche, .ligne-icone a, .bouton-reseau, .bouton-retour, .pied-page a'
    )].filter(Boolean);
  }

  if (page === 'contact') {
    return [...document.querySelectorAll(
      '.bouton-menu, .bouton-recherche, .infos-contact a, .bouton-envoyer, .pied-page a'
    )].filter(Boolean);
  }

  return [];
}

export function initialiserNavigationClavier() {
  document.addEventListener('keydown', (e) => {
    const tiroir = document.querySelector('.tiroir-nav');
    if (tiroir && tiroir.classList.contains('ouvert')) return;

    const balise = document.activeElement?.tagName;
    if (balise === 'INPUT' || balise === 'TEXTAREA' || balise === 'SELECT') return;

    const elementActif = document.activeElement;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const arrets   = obtenirArretsPage();
      const position = arrets.indexOf(elementActif);
      if (position === -1) {
        const burger = document.querySelector('.bouton-menu');
        if (burger) { burger.focus(); burger.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
        return;
      }
      if (position < arrets.length - 1) {
        const suivant = arrets[position + 1];
        suivant.focus();
        suivant.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const arrets   = obtenirArretsPage();
      const position = arrets.indexOf(elementActif);
      if (position <= 0) { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
      const precedent = arrets[position - 1];
      precedent.focus();
      precedent.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Flèches gauche/droite sur la boîte calendrier
    if (elementActif && elementActif.id === 'boite-calendrier') {
      if (e.key === 'ArrowLeft')  { e.preventDefault(); changerCalendrier(-1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); changerCalendrier(+1); }
    }
  });
}
