// Section calendrier : affichage de l'affiche + navigation entre événements

let indexCalendrier      = 0;
let evenementsCalendrier = [];

export function initialiserCalendrier(evenements) {
  evenementsCalendrier = evenements;

  const boutonPrecedent = document.getElementById('cal-precedent');
  const boutonSuivant   = document.getElementById('cal-suivant');
  const boite           = document.getElementById('boite-calendrier');

  if (boutonPrecedent) boutonPrecedent.addEventListener('click', () => changerCalendrier(-1));
  if (boutonSuivant)   boutonSuivant.addEventListener('click',   () => changerCalendrier(+1));

  if (boite) {
    function ouvrirDetailCalendrier() {
      const ev = evenementsCalendrier[indexCalendrier];
      if (!ev) return;
      sessionStorage.setItem('vn_evenement_courant', JSON.stringify(ev));
      window.location.href = `event-detail.html?id=${ev.identifiant}`;
    }
    boite.addEventListener('click', ouvrirDetailCalendrier);
    boite.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ouvrirDetailCalendrier(); }
    });
  }

  mettreAJourCalendrier(0);
}

export function changerCalendrier(direction) {
  indexCalendrier = (indexCalendrier + direction + evenementsCalendrier.length) % evenementsCalendrier.length;
  mettreAJourCalendrier(indexCalendrier);
}

export function mettreAJourCalendrier(index) {
  const ev = evenementsCalendrier[index];
  if (!ev) return;

  const boiteImage   = document.getElementById('image-calendrier');
  const elementJour  = document.getElementById('cal-jour');
  const elementMois  = document.getElementById('cal-mois');
  const nomEvenement = document.getElementById('nom-evenement-cal');
  const compteur     = document.getElementById('compteur-calendrier');
  const boite        = document.getElementById('boite-calendrier');

  if (boiteImage)   { boiteImage.src = ev.imageSource || `https://picsum.photos/seed/${ev.identifiant}/1200/800`; boiteImage.alt = ''; }
  if (elementJour)  elementJour.textContent  = ev.premierJour  || '--';
  if (elementMois)  elementMois.textContent  = ev.premierMois  || '---';
  if (nomEvenement) nomEvenement.textContent = ev.titre.fr;
  if (compteur)     compteur.textContent     = `${index + 1} / ${evenementsCalendrier.length}`;
  if (boite)        boite.setAttribute('aria-label', `Voir : ${ev.titre.fr}. ${ev.periodeDate.fr}. Entrée pour les détails.`);

  const regionLive = document.getElementById('region-live');
  if (regionLive) regionLive.textContent = `Calendrier : ${ev.titre.fr}, ${ev.periodeDate.fr}`;
}
