// Carrousel : construction des diapositives + navigation clavier/souris

export let indexCarrousel      = 0;
export let evenementsCarrousel = [];

export function construireCarrousel(evenements) {
  const piste  = document.getElementById('piste-carrousel');
  const points = document.getElementById('points-carrousel');
  if (!piste || !points) return;

  evenementsCarrousel = evenements;
  piste.innerHTML  = '';
  points.innerHTML = '';

  evenements.forEach((ev, i) => {
    const diapositive = document.createElement('div');
    diapositive.className = 'diapo-carrousel';

    const interieur = document.createElement('div');
    interieur.className = 'diapo-interieur';
    interieur.setAttribute('tabindex', '0');
    interieur.setAttribute('role', 'button');
    interieur.setAttribute('aria-label',
      `Événement ${i + 1} sur ${evenements.length} : ${ev.titre.fr}. Entrée pour les détails.`
    );

    const etiquette = document.createElement('p');
    etiquette.className   = 'diapo-etiquette';
    etiquette.textContent = 'Upcoming Events';

    const titre = document.createElement('h2');
    titre.className   = 'diapo-titre';
    titre.textContent = ev.titre.fr;

    const date = document.createElement('p');
    date.className   = 'diapo-date';
    date.textContent = ev.periodeDate.fr;

    const lieu = document.createElement('p');
    lieu.className   = 'diapo-lieu';
    lieu.textContent = ev.lieu.nom;

    interieur.append(etiquette, titre, date, lieu);
    diapositive.appendChild(interieur);
    piste.appendChild(diapositive);

    function allerAuDetail() {
      sessionStorage.setItem('vn_evenement_courant', JSON.stringify(ev));
      window.location.href = `event-detail.html?id=${ev.identifiant}`;
    }
    interieur.addEventListener('click', allerAuDetail);
    interieur.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); allerAuDetail(); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); allerADiapositive((indexCarrousel - 1 + evenementsCarrousel.length) % evenementsCarrousel.length); }
      if (e.key === 'ArrowRight') { e.preventDefault(); allerADiapositive((indexCarrousel + 1) % evenementsCarrousel.length); }
    });

    const point = document.createElement('span');
    point.setAttribute('role', 'tab');
    point.setAttribute('tabindex', '0');
    point.setAttribute('aria-label', `Événement ${i + 1}`);
    point.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    if (i === 0) point.classList.add('actif');
    point.addEventListener('click', () => allerADiapositive(i));
    point.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); allerADiapositive(i); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); allerADiapositive((i - 1 + evenements.length) % evenements.length); }
      if (e.key === 'ArrowRight') { e.preventDefault(); allerADiapositive((i + 1) % evenements.length); }
    });
    points.appendChild(point);
  });
}

export function allerADiapositive(index) {
  const piste  = document.getElementById('piste-carrousel');
  const points = document.querySelectorAll('#points-carrousel span');
  if (!piste) return;

  indexCarrousel = index;
  piste.style.transform = `translateX(-${index * 100}%)`;

  points.forEach((p, i) => {
    const actif = i === index;
    p.classList.toggle('actif', actif);
    p.setAttribute('aria-selected', actif ? 'true' : 'false');
  });

  const diapositives = piste.querySelectorAll('.diapo-interieur');
  if (diapositives[index]) diapositives[index].focus();

  const regionLive = document.getElementById('region-live');
  if (regionLive && evenementsCarrousel[index]) {
    regionLive.textContent = `Événement ${index + 1} sur ${evenementsCarrousel.length} : ${evenementsCarrousel[index].titre.fr}`;
  }
}

export function initialiserBoutonsCarrousel() {
  const boutonPrecedent = document.querySelector('.bouton-carrousel.precedent');
  const boutonSuivant   = document.querySelector('.bouton-carrousel.suivant');
  if (boutonPrecedent) boutonPrecedent.addEventListener('click', () => allerADiapositive((indexCarrousel - 1 + evenementsCarrousel.length) % evenementsCarrousel.length));
  if (boutonSuivant)   boutonSuivant.addEventListener('click',   () => allerADiapositive((indexCarrousel + 1) % evenementsCarrousel.length));
}
