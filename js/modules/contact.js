// Formulaire de contact : validation à la soumission + feedback en temps réel

export function initialiserFormulaireContact() {
  const formulaire = document.getElementById('formulaire-contact');
  if (!formulaire) return;

  const champsAValider = [
    { groupe: 'groupe-nom',     champ: 'nom',     validation: v => v.trim().length >= 2 },
    { groupe: 'groupe-prenom',  champ: 'prenom',  validation: v => v.trim().length >= 2 },
    { groupe: 'groupe-email',   champ: 'email',   validation: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
    { groupe: 'groupe-sujet',   champ: 'sujet',   validation: v => v !== '' },
    { groupe: 'groupe-message', champ: 'message', validation: v => v.trim().length >= 10 }
  ];

  formulaire.addEventListener('submit', (e) => {
    e.preventDefault();
    let formulaireValide = true;

    champsAValider.forEach(({ groupe, champ, validation }) => {
      const input = document.getElementById(champ);
      const grp   = document.getElementById(groupe);
      if (!input || !grp) return;
      if (!validation(input.value)) { grp.classList.add('invalide'); formulaireValide = false; }
      else                          { grp.classList.remove('invalide'); }
    });

    if (formulaireValide) {
      formulaire.style.display = 'none';
      const messageSucces = document.getElementById('message-succes');
      if (messageSucces) { messageSucces.classList.add('visible'); messageSucces.focus(); }
    } else {
      // Déplace le focus sur le premier champ invalide pour guider l'utilisateur
      const premierInvalide = formulaire.querySelector('.groupe.invalide input, .groupe.invalide select, .groupe.invalide textarea');
      if (premierInvalide) premierInvalide.focus();
    }
  });

  // Supprime l'état d'erreur dès que l'utilisateur commence à corriger
  formulaire.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('input', () => el.closest('.groupe')?.classList.remove('invalide'));
  });
}
