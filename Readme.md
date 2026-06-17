# Villa Nova — Agenda Culturel Corse

Application web mobile-first centralisant les événements culturels de la ville fictive de Villa Nova (Corse).  
Projet Bloc 2 — Titre RNCP Développeur Web Full Stack ·

---

## Structure

```
villanova/
├── index.html          # Accueil — carrousel, liste événements, calendrier
├── event-detail.html   # Fiche détail d'un événement
├── contact.html        # Formulaire de contact
├── css/
│   ├── style.scss      # Source SASS
│   └── style.css       # CSS compilé
├── js/
│   └── app.js          # API OpenAgenda, DOM, navigation clavier
├── images/
│   └── logo_vn.png
└── conception/         # Maquettes et wireframes du projet
```

---

## Lancer le projet

Aucune installation requise. Ouvrir avec **Live Server** (VS Code) ou :

```bash
python -m http.server 8000
```

---

## API OpenAgenda

Dans `js/app.js`, remplacer les valeurs par défaut :

```js
const CONFIG = {
  identifiantAgenda: 'VOTRE_AGENDA_UID',
  cleApi:            'VOTRE_CLE_API',
};
```

Sans clé configurée, le projet tourne en **mode démonstration** avec des données fictives corses.

---

## Stack

HTML5 · SASS · CSS3 · JavaScript vanilla · API OpenAgenda · Google Fonts

---

## Auteur

**Njarasoa Andoniaina Angelo**  
Projet étudiant · La Plateforme_ · Marseille
