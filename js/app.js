// Villa Nova — script principal
// Navigation clavier, récupération API, carrousel, calendrier, menu burger

// ─── Configuration de l'API OpenAgenda ────────────────────────────────────────
const CONFIG = {
  identifiantAgenda: 'AGENDA_UID',   // remplacer par l'identifiant de l'agenda
  cleApi:            'API_KEY',       // remplacer par la clé publique OpenAgenda
  limiteEvenements:  6,
  urlBase:           'https://api.openagenda.com/v2'
};

// ─── Données de démonstration ─────────────────────────────────────────────────
// Utilisées automatiquement quand les clés API ne sont pas configurées
const EVENEMENTS_DEMO = [
  {
    identifiant: 1,
    titre:        { fr: 'Concert de Jazz au Théâtre Municipal' },
    description:  { fr: 'Une soirée exceptionnelle avec les meilleurs musiciens de jazz de Corse. Un voyage musical entre tradition et modernité.' },
    periodeDate:  { fr: 'Du 18 au 20 septembre 2025' },
    premierJour: '18', premierMois: 'SEP', dernierJour: '20', dernierMois: 'SEP',
    lieu: { nom: 'Théâtre Municipal', adresse: 'Place du Général de Gaulle, Villa Nova' },
    imageSource: 'https://picsum.photos/seed/jazz/1200/800'
  },
  {
    identifiant: 2,
    titre:        { fr: 'Exposition : Photographes Corses' },
    description:  { fr: 'Découvrez les œuvres de photographes locaux qui célèbrent la beauté sauvage de la Corse.' },
    periodeDate:  { fr: 'Du 1er octobre au 15 novembre 2025' },
    premierJour: '01', premierMois: 'OCT', dernierJour: '15', dernierMois: 'NOV',
    lieu: { nom: "Galerie d'Art Moderne", adresse: 'Rue des Arts, Villa Nova' },
    imageSource: 'https://picsum.photos/seed/expo/1200/800'
  },
  {
    identifiant: 3,
    titre:        { fr: 'Festival du Film Méditerranéen' },
    description:  { fr: 'Trois jours de cinéma, de rencontres et de débats autour de la culture méditerranéenne.' },
    periodeDate:  { fr: 'Du 5 au 7 novembre 2025' },
    premierJour: '05', premierMois: 'NOV', dernierJour: '07', dernierMois: 'NOV',
    lieu: { nom: 'Cinéma Le Palais', adresse: 'Avenue de la République, Villa Nova' },
    imageSource: 'https://picsum.photos/seed/film/1200/800'
  },
  {
    identifiant: 4,
    titre:        { fr: 'Marché de Noël Artisanal' },
    description:  { fr: 'Artisans locaux, produits corses, animations et musique traditionnelle.' },
    periodeDate:  { fr: 'Du 15 au 24 décembre 2025' },
    premierJour: '15', premierMois: 'DÉC', dernierJour: '24', dernierMois: 'DÉC',
    lieu: { nom: 'Place du Village', adresse: 'Centre-ville, Villa Nova' },
    imageSource: 'https://picsum.photos/seed/noel/1200/800'
  },
  {
    identifiant: 5,
    titre:        { fr: 'Spectacle de Danse Traditionnelle Corse' },
    description:  { fr: 'La compagnie Teatru di u Populu présente ses danses et chants polyphoniques.' },
    periodeDate:  { fr: 'Le 22 novembre 2025' },
    premierJour: '22', premierMois: 'NOV', dernierJour: '22', dernierMois: 'NOV',
    lieu: { nom: 'Salle des Fêtes', adresse: 'Chemin des Oliviers, Villa Nova' },
    imageSource: 'https://picsum.photos/seed/danse/1200/800'
  },
  {
    identifiant: 6,
    titre:        { fr: 'Conférence : Histoire et Patrimoine Corse' },
    description:  { fr: "Une plongée dans l'histoire millénaire de la Corse, de l'Antiquité à nos jours." },
    periodeDate:  { fr: 'Le 10 octobre 2025' },
    premierJour: '10', premierMois: 'OCT', dernierJour: '10', dernierMois: 'OCT',
    lieu: { nom: 'Médiathèque Municipale', adresse: 'Rue de la Bibliothèque, Villa Nova' },
    imageSource: 'https://picsum.photos/seed/conf/1200/800'
  }
];

// ─── Stockage de session ──────────────────────────────────────────────────────
// Permet de conserver les données entre les pages sans rappeler l'API
function sauvegarderEvenementsEnSession(evenements) {
  try { sessionStorage.setItem('vn_evenements', JSON.stringify(evenements)); } catch(e) {}
}
function recupererEvenementsDeSession() {
  try {
    const donnees = sessionStorage.getItem('vn_evenements');
    return donnees ? JSON.parse(donnees) : null;
  } catch(e) { return null; }
}

// ─── Menu burger ──────────────────────────────────────────────────────────────
// Le bouton burger est le premier élément focusable sur toutes les pages.
// Entrée sur le burger → ouvre le tiroir, le focus se déplace à l'intérieur.
// Flèche bas/haut → navigue entre les éléments du tiroir.
// Échap ou clic sur le fond → ferme le tiroir, le focus revient sur le burger.
function initialiserMenuBurger() {
  const boutonMenu   = document.querySelector('.bouton-menu');
  const boutonFermer = document.querySelector('.bouton-fermer-menu');
  const fondMenu     = document.querySelector('.fond-menu');
  const tiroir       = document.querySelector('.tiroir-nav');
  if (!boutonMenu || !tiroir) return;

  // Récupère tous les éléments interactifs à l'intérieur du tiroir
  function obtenirElementsFocusables() {
    return [...tiroir.querySelectorAll('a[href], button:not([disabled]), input')];
  }

  function ouvrirMenu() {
    tiroir.classList.add('ouvert');
    if (fondMenu) fondMenu.classList.add('ouvert');
    boutonMenu.setAttribute('aria-expanded', 'true');
    tiroir.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    // Déplace le focus vers le bouton de fermeture
    setTimeout(() => { if (boutonFermer) boutonFermer.focus(); }, 50);
  }

  function fermerMenu() {
    tiroir.classList.remove('ouvert');
    if (fondMenu) fondMenu.classList.remove('ouvert');
    boutonMenu.setAttribute('aria-expanded', 'false');
    tiroir.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    // Retourne le focus sur le bouton burger
    boutonMenu.focus();
  }

  boutonMenu.addEventListener('click', ouvrirMenu);
  if (boutonFermer) boutonFermer.addEventListener('click', fermerMenu);
  if (fondMenu)     fondMenu.addEventListener('click', fermerMenu);
  tiroir.querySelectorAll('a').forEach(lien => lien.addEventListener('click', fermerMenu));

  document.addEventListener('keydown', (evenement) => {
    if (!tiroir.classList.contains('ouvert')) return;

    // Échap : ferme le tiroir
    if (evenement.key === 'Escape') { evenement.preventDefault(); fermerMenu(); return; }

    const focusables = obtenirElementsFocusables();
    if (!focusables.length) return;
    const premier  = focusables[0];
    const dernier  = focusables[focusables.length - 1];
    const position = focusables.indexOf(document.activeElement);

    // Tab / Maj+Tab : maintient le focus dans le tiroir (piège de focus)
    if (evenement.key === 'Tab') {
      if (evenement.shiftKey && document.activeElement === premier) { evenement.preventDefault(); dernier.focus(); }
      else if (!evenement.shiftKey && document.activeElement === dernier) { evenement.preventDefault(); premier.focus(); }
      return;
    }

    // Flèche bas : passe à l'élément suivant dans le tiroir
    if (evenement.key === 'ArrowDown') {
      evenement.preventDefault();
      focusables[(position + 1) % focusables.length].focus();
    }

    // Flèche haut : passe à l'élément précédent dans le tiroir
    if (evenement.key === 'ArrowUp') {
      evenement.preventDefault();
      focusables[(position - 1 + focusables.length) % focusables.length].focus();
    }
  });
}

// ─── Arrêts de navigation clavier sur la page ─────────────────────────────────
// Retourne la liste ordonnée de tous les éléments focusables sur la page,
// dans l'ordre logique du haut vers le bas.
// Le bouton burger est toujours en premier.
let indexCarrousel   = 0; // position actuelle dans le carrousel
let evenementsCarrousel = []; // liste des événements du carrousel

function obtenirArretsPage() {
  const page = document.body.dataset.page;

  if (page === 'accueil') {
    const piste        = document.getElementById('piste-carrousel');
    const diapActive   = piste ? piste.querySelectorAll('.diapo-interieur')[indexCarrousel] : null;
    const cartes       = [...document.querySelectorAll('.carte-evenement')];
    const flecheGauche = document.getElementById('cal-precedent');
    const boite        = document.getElementById('boite-calendrier');
    const flecheDroite = document.getElementById('cal-suivant');
    const boutonAgenda = document.querySelector('.bouton-agenda');
    const boutonsPied  = [...document.querySelectorAll('.pied-page a, .pied-page button')];
    return [
      document.querySelector('.bouton-menu'),     // burger en premier
      document.querySelector('.bouton-recherche'),// bouton recherche
      diapActive,                                 // diapositive active du carrousel
      ...cartes,                                  // cartes une par une
      flecheGauche, boite, flecheDroite,          // contrôles du calendrier
      boutonAgenda,                               // bouton voir tout l'agenda
      ...boutonsPied                              // liens du pied de page
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

// ─── Navigation clavier globale ───────────────────────────────────────────────
// Flèche bas : passe à l'arrêt suivant dans l'ordre de la page
// Flèche haut : passe à l'arrêt précédent
// Flèches gauche/droite sur la boîte calendrier : change l'événement affiché
function initialiserNavigationClavier() {
  document.addEventListener('keydown', (evenement) => {
    // Ne pas intercepter quand le tiroir est ouvert
    const tiroir = document.querySelector('.tiroir-nav');
    if (tiroir && tiroir.classList.contains('ouvert')) return;

    // Ne pas intercepter quand le focus est dans un champ de formulaire
    const balise = document.activeElement?.tagName;
    if (balise === 'INPUT' || balise === 'TEXTAREA' || balise === 'SELECT') return;

    const elementActif = document.activeElement;

    // Flèche bas : passe à l'arrêt suivant
    if (evenement.key === 'ArrowDown') {
      evenement.preventDefault();
      const arrets   = obtenirArretsPage();
      const position = arrets.indexOf(elementActif);

      if (position === -1) {
        // Le focus n'est pas sur un arrêt connu : aller au burger
        const burger = document.querySelector('.bouton-menu');
        if (burger) { burger.focus(); burger.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
        return;
      }
      if (position < arrets.length - 1) {
        const suivant = arrets[position + 1];
        suivant.focus();
        suivant.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      // Sur le dernier arrêt : ne rien faire
    }

    // Flèche haut : passe à l'arrêt précédent
    if (evenement.key === 'ArrowUp') {
      evenement.preventDefault();
      const arrets   = obtenirArretsPage();
      const position = arrets.indexOf(elementActif);

      if (position <= 0) {
        // Déjà au sommet : remonter la page en haut
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const precedent = arrets[position - 1];
      precedent.focus();
      precedent.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Flèches gauche/droite sur la boîte calendrier : change l'événement affiché
    if (elementActif && elementActif.id === 'boite-calendrier') {
      if (evenement.key === 'ArrowLeft')  { evenement.preventDefault(); changerCalendrier(-1); }
      if (evenement.key === 'ArrowRight') { evenement.preventDefault(); changerCalendrier(+1); }
    }
  });
}

// ─── Carrousel ────────────────────────────────────────────────────────────────
// Construit les diapositives à partir du tableau d'événements.
// Flèches gauche/droite changent la diapositive active.
// Entrée/Espace ouvre la page de détail de l'événement.
function construireCarrousel(evenements) {
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
      `Événement ${i+1} sur ${evenements.length} : ${ev.titre.fr}. Entrée pour les détails. Flèches pour naviguer.`
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

    // Point de navigation pour accès direct à une diapositive
    const point = document.createElement('span');
    point.setAttribute('role', 'tab');
    point.setAttribute('tabindex', '0');
    point.setAttribute('aria-label', `Événement ${i+1}`);
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

// Déplace le carrousel vers la diapositive à l'index donné et y met le focus
function allerADiapositive(index) {
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

  // Déplace le focus sur la diapositive nouvellement active
  const diapositives = piste.querySelectorAll('.diapo-interieur');
  if (diapositives[index]) diapositives[index].focus();

  // Annonce le changement aux lecteurs d'écran
  const regionLive = document.getElementById('region-live');
  if (regionLive && evenementsCarrousel[index]) {
    regionLive.textContent = `Événement ${index+1} sur ${evenementsCarrousel.length} : ${evenementsCarrousel[index].titre.fr}`;
  }
}

function initialiserBoutonsCarrousel() {
  const boutonPrecedent = document.querySelector('.bouton-carrousel.precedent');
  const boutonSuivant   = document.querySelector('.bouton-carrousel.suivant');
  if (boutonPrecedent) boutonPrecedent.addEventListener('click', () => allerADiapositive((indexCarrousel - 1 + evenementsCarrousel.length) % evenementsCarrousel.length));
  if (boutonSuivant)   boutonSuivant.addEventListener('click',   () => allerADiapositive((indexCarrousel + 1) % evenementsCarrousel.length));
}

// ─── Récupération des événements via l'API ────────────────────────────────────
// Retourne les données de démonstration si les clés ne sont pas configurées
async function recupererEvenements() {
  if (CONFIG.identifiantAgenda === 'AGENDA_UID') {
    console.info('Mode démonstration : données locales utilisées');
    return EVENEMENTS_DEMO;
  }
  const url = `${CONFIG.urlBase}/agendas/${CONFIG.identifiantAgenda}/events?key=${CONFIG.cleApi}&limit=${CONFIG.limiteEvenements}&lang=fr`;
  const reponse = await fetch(url);
  if (!reponse.ok) throw new Error(`Erreur API ${reponse.status}`);
  const donnees = await reponse.json();
  return (donnees.events || []).map(ev => ({
    identifiant: ev.uid,
    titre:       ev.title,
    description: ev.description,
    periodeDate: ev.dateRange,
    premierJour: ev.firstTiming?.begin ? new Date(ev.firstTiming.begin).getDate().toString().padStart(2,'0') : '--',
    premierMois: ev.firstTiming?.begin ? ['JAN','FÉV','MAR','AVR','MAI','JUN','JUL','AOÛ','SEP','OCT','NOV','DÉC'][new Date(ev.firstTiming.begin).getMonth()] : '---',
    dernierJour: ev.lastTiming?.end    ? new Date(ev.lastTiming.end).getDate().toString().padStart(2,'0')    : '--',
    dernierMois: ev.lastTiming?.end    ? ['JAN','FÉV','MAR','AVR','MAI','JUN','JUL','AOÛ','SEP','OCT','NOV','DÉC'][new Date(ev.lastTiming.end).getMonth()]     : '---',
    lieu:        { nom: ev.location?.name || '', adresse: ev.location?.address || '' },
    imageSource: ev.image?.base || null
  }));
}

// ─── Carte d'événement ────────────────────────────────────────────────────────
// Crée un élément article focusable pour chaque événement.
// Entrée/Espace ouvre la page de détail.
function creerCarteEvenement(ev, index) {
  const carte = document.createElement('article');
  carte.className = 'carte-evenement';
  carte.id        = `carte-evenement-${index}`;
  carte.setAttribute('tabindex', '0');
  carte.setAttribute('role', 'listitem');
  carte.setAttribute('aria-label',
    `Événement ${index+1} : ${ev.titre.fr}. ${ev.periodeDate.fr}. Appuyez sur Entrée pour les détails.`
  );

  // Image chargée en différé pour réduire la consommation réseau (éco-conception)
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
  // Entrée ou Espace activent la carte (les flèches sont gérées globalement)
  carte.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); allerAuDetail(); }
  });

  return carte;
}

// Injecte toutes les cartes dans le conteneur de la liste
function afficherEvenements(evenements) {
  const liste = document.getElementById('liste-evenements');
  if (!liste) return;
  liste.innerHTML = '';
  if (!evenements.length) { liste.innerHTML = '<p class="message-chargement">Aucun événement trouvé.</p>'; return; }
  sauvegarderEvenementsEnSession(evenements);
  evenements.forEach((ev, i) => liste.appendChild(creerCarteEvenement(ev, i)));
}

// ─── Section calendrier ───────────────────────────────────────────────────────
// Affiche l'affiche de l'événement, sa date et son nom dans une grande boîte cliquable.
// Flèches gauche/droite changent l'événement ; Entrée/Espace ouvre sa fiche.
let indexCalendrier    = 0;
let evenementsCalendrier = [];

function mettreAJourCalendrier(index) {
  const ev = evenementsCalendrier[index];
  if (!ev) return;

  const boiteImage    = document.getElementById('image-calendrier');
  const elementJour   = document.getElementById('cal-jour');
  const elementMois   = document.getElementById('cal-mois');
  const nomEvenement  = document.getElementById('nom-evenement-cal');
  const compteur      = document.getElementById('compteur-calendrier');
  const boite         = document.getElementById('boite-calendrier');

  // Remplace l'image par l'affiche de l'événement sélectionné
  if (boiteImage) { boiteImage.src = ev.imageSource || `https://picsum.photos/seed/${ev.identifiant}/1200/800`; boiteImage.alt = ''; }
  if (elementJour)  elementJour.textContent  = ev.premierJour  || '--';
  if (elementMois)  elementMois.textContent  = ev.premierMois  || '---';
  if (nomEvenement) nomEvenement.textContent = ev.titre.fr;
  if (compteur)     compteur.textContent     = `${index + 1} / ${evenementsCalendrier.length}`;
  if (boite) {
    boite.setAttribute('aria-label',
      `Voir : ${ev.titre.fr}. ${ev.periodeDate.fr}. Entrée pour les détails. Flèches pour naviguer.`
    );
  }

  // Annonce le changement aux lecteurs d'écran via la région live
  const regionLive = document.getElementById('region-live');
  if (regionLive) regionLive.textContent = `Calendrier : ${ev.titre.fr}, ${ev.periodeDate.fr}`;
}

// Avance (+1) ou recule (-1) dans le calendrier avec retour en boucle
function changerCalendrier(direction) {
  indexCalendrier = (indexCalendrier + direction + evenementsCalendrier.length) % evenementsCalendrier.length;
  mettreAJourCalendrier(indexCalendrier);
}

function initialiserCalendrier() {
  const boutonPrecedent = document.getElementById('cal-precedent');
  const boutonSuivant   = document.getElementById('cal-suivant');
  const boite           = document.getElementById('boite-calendrier');

  if (boutonPrecedent) boutonPrecedent.addEventListener('click', () => changerCalendrier(-1));
  if (boutonSuivant)   boutonSuivant.addEventListener('click',   () => changerCalendrier(+1));

  if (boite) {
    // Clic ou activation clavier → ouvre la fiche de l'événement courant
    function ouvrirDetailCalendrier() {
      const ev = evenementsCalendrier[indexCalendrier];
      if (!ev) return;
      sessionStorage.setItem('vn_evenement_courant', JSON.stringify(ev));
      window.location.href = `event-detail.html?id=${ev.identifiant}`;
    }
    boite.addEventListener('click', ouvrirDetailCalendrier);
    boite.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ouvrirDetailCalendrier(); }
      // Flèches gauche/droite gérées par initialiserNavigationClavier
    });
  }
}

// ─── Validation du formulaire de contact ──────────────────────────────────────
// Vérifie les champs obligatoires à la soumission.
// Affiche les erreurs sous chaque champ invalide et déplace le focus.
// En cas de succès, masque le formulaire et affiche un message de confirmation.
function initialiserFormulaireContact() {
  const formulaire = document.getElementById('formulaire-contact');
  if (!formulaire) return;

  const champsAValider = [
    { groupe: 'groupe-nom',     champ: 'nom',     validation: v => v.trim().length >= 2 },
    { groupe: 'groupe-prenom',  champ: 'prenom',  validation: v => v.trim().length >= 2 },
    { groupe: 'groupe-email',   champ: 'email',   validation: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
    { groupe: 'groupe-sujet',   champ: 'sujet',   validation: v => v !== '' },
    { groupe: 'groupe-message', champ: 'message', validation: v => v.trim().length >= 10 },
  ];

  formulaire.addEventListener('submit', (evenement) => {
    evenement.preventDefault();
    let formulaireValide = true;

    champsAValider.forEach(({ groupe, champ, validation }) => {
      const input  = document.getElementById(champ);
      const grp    = document.getElementById(groupe);
      if (!input || !grp) return;
      if (!validation(input.value)) { grp.classList.add('invalide'); formulaireValide = false; }
      else                          { grp.classList.remove('invalide'); }
    });

    if (formulaireValide) {
      formulaire.style.display = 'none';
      const messageSucces = document.getElementById('message-succes');
      if (messageSucces) { messageSucces.classList.add('visible'); messageSucces.focus(); }
    } else {
      // Déplace le focus sur le premier champ invalide
      const premierInvalide = formulaire.querySelector('.groupe.invalide input, .groupe.invalide select, .groupe.invalide textarea');
      if (premierInvalide) premierInvalide.focus();
    }
  });

  // Supprime l'état d'erreur dès que l'utilisateur commence à corriger un champ
  formulaire.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('input', () => {
      el.closest('.groupe')?.classList.remove('invalide');
    });
  });
}

// ─── Initialisation de la page d'accueil ──────────────────────────────────────
async function initialiserPageAccueil() {
  const liste = document.getElementById('liste-evenements');
  if (!liste) return;
  liste.innerHTML = '<p class="message-chargement" aria-live="polite">Chargement…</p>';

  try {
    const evenements = await recupererEvenements();
    construireCarrousel(evenements);
    initialiserBoutonsCarrousel();
    afficherEvenements(evenements);
    evenementsCalendrier = evenements;
    initialiserCalendrier();
    mettreAJourCalendrier(0);
    initialiserNavigationClavier();

    const regionLive = document.getElementById('region-live');
    if (regionLive) regionLive.textContent = `${evenements.length} événements chargés.`;
  } catch (erreur) {
    console.error(erreur);
    if (liste) liste.innerHTML = '<p class="message-erreur" role="alert">Impossible de charger les événements.</p>';
  }
}

// ─── Initialisation de la page de détail ─────────────────────────────────────
// Lit l'identifiant de l'événement dans l'URL et remplit tous les éléments de la page.
function afficherDetailEvenement(ev) {
  const titreEvenement = document.getElementById('titre-evenement');
  if (titreEvenement) titreEvenement.textContent = ev.titre.fr;

  // Remplit les deux badges de dates (début et fin)
  const correspondances = {
    'badge1-jour':  ev.premierJour,
    'badge1-mois':  ev.premierMois,
    'badge2-jour':  ev.dernierJour,
    'badge2-mois':  ev.dernierMois
  };
  Object.entries(correspondances).forEach(([id, valeur]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = valeur;
  });

  const photoprincipale = document.getElementById('photo-evenement');
  if (photoprincipale) {
    photoprincipale.src = ev.imageSource || `https://picsum.photos/seed/${ev.identifiant}/1200/800`;
    photoprincipale.alt = `Photo : ${ev.titre.fr}`;
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

async function initialiserPageDetail() {
  const id = new URLSearchParams(window.location.search).get('id');
  if (!id) { window.location.href = 'index.html'; return; }

  let evenement = null;

  // 1. Cherche dans l'événement courant sauvegardé en session
  try {
    const s = sessionStorage.getItem('vn_evenement_courant');
    if (s) { const p = JSON.parse(s); if (String(p.identifiant) === id) evenement = p; }
  } catch(e) {}

  // 2. Cherche dans la liste complète sauvegardée en session
  if (!evenement) {
    const liste = recupererEvenementsDeSession();
    if (liste) evenement = liste.find(e => String(e.identifiant) === id);
  }

  // 3. Cherche dans les données de démonstration en dernier recours
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

// ─── Initialisation de la page contact ────────────────────────────────────────
function initialiserPageContact() {
  initialiserFormulaireContact();
  initialiserNavigationClavier();
}

// ─── Point d'entrée du script ─────────────────────────────────────────────────
// Détecte la page courante via data-page et lance l'initialisation correspondante
document.addEventListener('DOMContentLoaded', () => {
  initialiserMenuBurger();

  const page = document.body.dataset.page;
  if (page === 'accueil') initialiserPageAccueil();
  if (page === 'detail')  initialiserPageDetail();
  if (page === 'contact') initialiserPageContact();
});
