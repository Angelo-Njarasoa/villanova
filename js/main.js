// Point d'entrée — détecte la page via data-page et lance le bon module

import { initialiserMenuBurger }      from './modules/burger.js';
import { initialiserNavigationClavier } from './modules/navigation.js';
import { recupererEvenements }        from './modules/api.js';
import { construireCarrousel, initialiserBoutonsCarrousel } from './modules/carousel.js';
import { afficherEvenements }         from './modules/events.js';
import { initialiserCalendrier }      from './modules/calendar.js';
import { initialiserFormulaireContact } from './modules/contact.js';
import { initialiserPageDetail }      from './modules/detail.js';

async function initialiserPageAccueil() {
  const liste = document.getElementById('liste-evenements');
  if (!liste) return;
  liste.innerHTML = '<p class="message-chargement" aria-live="polite">Chargement…</p>';

  try {
    const evenements = await recupererEvenements();
    construireCarrousel(evenements);
    initialiserBoutonsCarrousel();
    afficherEvenements(evenements);
    initialiserCalendrier(evenements);
    initialiserNavigationClavier();

    const regionLive = document.getElementById('region-live');
    if (regionLive) regionLive.textContent = `${evenements.length} événements chargés.`;
  } catch (erreur) {
    console.error(erreur);
    if (liste) liste.innerHTML = '<p class="message-erreur" role="alert">Impossible de charger les événements.</p>';
  }
}

function initialiserPageContact() {
  initialiserFormulaireContact();
  initialiserNavigationClavier();
}

document.addEventListener('DOMContentLoaded', () => {
  initialiserMenuBurger();

  const page = document.body.dataset.page;
  if (page === 'accueil') initialiserPageAccueil();
  if (page === 'detail')  initialiserPageDetail();
  if (page === 'contact') initialiserPageContact();
});
