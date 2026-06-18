// Persistance sessionStorage — conserve les données entre pages sans rappeler l'API

export function sauvegarderEvenementsEnSession(evenements) {
  try { sessionStorage.setItem('vn_evenements', JSON.stringify(evenements)); } catch (e) {}
}

export function recupererEvenementsDeSession() {
  try {
    const donnees = sessionStorage.getItem('vn_evenements');
    return donnees ? JSON.parse(donnees) : null;
  } catch (e) { return null; }
}
