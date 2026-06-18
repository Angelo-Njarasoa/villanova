// Récupération des événements via OpenAgenda, ou données démo si clés absentes

import { CONFIG }          from './config.js';
import { EVENEMENTS_DEMO } from './demo-data.js';

export async function recupererEvenements() {
  if (CONFIG.identifiantAgenda === 'AGENDA_UID') {
    console.info('Mode démonstration : données locales utilisées');
    return EVENEMENTS_DEMO;
  }

  const url = `${CONFIG.urlBase}/agendas/${CONFIG.identifiantAgenda}/events?key=${CONFIG.cleApi}&limit=${CONFIG.limiteEvenements}&lang=fr`;
  const reponse = await fetch(url);
  if (!reponse.ok) throw new Error(`Erreur API ${reponse.status}`);
  const donnees = await reponse.json();

  const MOIS = ['JAN','FÉV','MAR','AVR','MAI','JUN','JUL','AOÛ','SEP','OCT','NOV','DÉC'];
  const mois = (date) => MOIS[new Date(date).getMonth()];
  const jour  = (date) => new Date(date).getDate().toString().padStart(2, '0');

  return (donnees.events || []).map(ev => ({
    identifiant: ev.uid,
    titre:       ev.title,
    description: ev.description,
    periodeDate: ev.dateRange,
    premierJour: ev.firstTiming?.begin ? jour(ev.firstTiming.begin) : '--',
    premierMois: ev.firstTiming?.begin ? mois(ev.firstTiming.begin) : '---',
    dernierJour: ev.lastTiming?.end    ? jour(ev.lastTiming.end)    : '--',
    dernierMois: ev.lastTiming?.end    ? mois(ev.lastTiming.end)    : '---',
    lieu:        { nom: ev.location?.name || '', adresse: ev.location?.address || '' },
    imageSource: ev.image?.base || null
  }));
}
