// Données affichées quand les clés API ne sont pas configurées
export const EVENEMENTS_DEMO = [
  {
    identifiant: 1,
    titre:       { fr: 'Concert de Jazz au Théâtre Municipal' },
    description: { fr: 'Une soirée exceptionnelle avec les meilleurs musiciens de jazz de Corse. Un voyage musical entre tradition et modernité.' },
    periodeDate: { fr: 'Du 18 au 20 septembre 2025' },
    premierJour: '18', premierMois: 'SEP', dernierJour: '20', dernierMois: 'SEP',
    lieu: { nom: 'Théâtre Municipal', adresse: 'Place du Général de Gaulle, Villa Nova' },
    imageSource: 'images/evt_jazz.jpg'
  },
  {
    identifiant: 2,
    titre:       { fr: 'Exposition : Photographes Corses' },
    description: { fr: 'Découvrez les œuvres de photographes locaux qui célèbrent la beauté sauvage de la Corse.' },
    periodeDate: { fr: 'Du 1er octobre au 15 novembre 2025' },
    premierJour: '01', premierMois: 'OCT', dernierJour: '15', dernierMois: 'NOV',
    lieu: { nom: "Galerie d'Art Moderne", adresse: 'Rue des Arts, Villa Nova' },
    imageSource: 'images/evt_expo.jpg'
  },
  {
    identifiant: 3,
    titre:       { fr: 'Festival du Film Méditerranéen' },
    description: { fr: 'Trois jours de cinéma, de rencontres et de débats autour de la culture méditerranéenne.' },
    periodeDate: { fr: 'Du 5 au 7 novembre 2025' },
    premierJour: '05', premierMois: 'NOV', dernierJour: '07', dernierMois: 'NOV',
    lieu: { nom: 'Cinéma Le Palais', adresse: 'Avenue de la République, Villa Nova' },
    imageSource: 'images/evt_cinema.jpg'
  },
  {
    identifiant: 4,
    titre:       { fr: 'Marché de Noël Artisanal' },
    description: { fr: 'Artisans locaux, produits corses, animations et musique traditionnelle.' },
    periodeDate: { fr: 'Du 15 au 24 décembre 2025' },
    premierJour: '15', premierMois: 'DÉC', dernierJour: '24', dernierMois: 'DÉC',
    lieu: { nom: 'Place du Village', adresse: 'Centre-ville, Villa Nova' },
    imageSource: 'images/evt_noel.jpg'
  },
  {
    identifiant: 5,
    titre:       { fr: 'Spectacle de Danse Traditionnelle Corse' },
    description: { fr: 'La compagnie Teatru di u Populu présente ses danses et chants polyphoniques.' },
    periodeDate: { fr: 'Le 22 novembre 2025' },
    premierJour: '22', premierMois: 'NOV', dernierJour: '22', dernierMois: 'NOV',
    lieu: { nom: 'Salle des Fêtes', adresse: 'Chemin des Oliviers, Villa Nova' },
    imageSource: 'images/evt_danse.jpg'
  },
  {
    identifiant: 6,
    titre:       { fr: 'Conférence : Histoire et Patrimoine Corse' },
    description: { fr: "Une plongée dans l'histoire millénaire de la Corse, de l'Antiquité à nos jours." },
    periodeDate: { fr: 'Le 10 octobre 2025' },
    premierJour: '10', premierMois: 'OCT', dernierJour: '10', dernierMois: 'OCT',
    lieu: { nom: 'Médiathèque Municipale', adresse: 'Rue de la Bibliothèque, Villa Nova' },
    imageSource: 'images/evt_conf.jpg'
  }
];
