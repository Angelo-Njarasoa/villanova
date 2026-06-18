// Menu burger : gestion du tiroir latéral + piège de focus WCAG

export function initialiserMenuBurger() {
  const boutonMenu   = document.querySelector('.bouton-menu');
  const boutonFermer = document.querySelector('.bouton-fermer-menu');
  const fondMenu     = document.querySelector('.fond-menu');
  const tiroir       = document.querySelector('.tiroir-nav');
  if (!boutonMenu || !tiroir) return;

  function obtenirElementsFocusables() {
    return [...tiroir.querySelectorAll('a[href], button:not([disabled]), input')];
  }

  function ouvrirMenu() {
    tiroir.classList.add('ouvert');
    if (fondMenu) fondMenu.classList.add('ouvert');
    boutonMenu.setAttribute('aria-expanded', 'true');
    tiroir.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    // Déplace le focus vers le bouton de fermeture dès l'ouverture
    setTimeout(() => { if (boutonFermer) boutonFermer.focus(); }, 50);
  }

  function fermerMenu() {
    tiroir.classList.remove('ouvert');
    if (fondMenu) fondMenu.classList.remove('ouvert');
    boutonMenu.setAttribute('aria-expanded', 'false');
    tiroir.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    boutonMenu.focus();
  }

  boutonMenu.addEventListener('click', ouvrirMenu);
  if (boutonFermer) boutonFermer.addEventListener('click', fermerMenu);
  if (fondMenu)     fondMenu.addEventListener('click', fermerMenu);
  tiroir.querySelectorAll('a').forEach(lien => lien.addEventListener('click', fermerMenu));

  document.addEventListener('keydown', (e) => {
    if (!tiroir.classList.contains('ouvert')) return;

    if (e.key === 'Escape') { e.preventDefault(); fermerMenu(); return; }

    const focusables = obtenirElementsFocusables();
    if (!focusables.length) return;
    const premier  = focusables[0];
    const dernier  = focusables[focusables.length - 1];
    const position = focusables.indexOf(document.activeElement);

    // Piège de focus : Tab/Maj+Tab restent dans le tiroir
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === premier) { e.preventDefault(); dernier.focus(); }
      else if (!e.shiftKey && document.activeElement === dernier) { e.preventDefault(); premier.focus(); }
      return;
    }

    if (e.key === 'ArrowDown') { e.preventDefault(); focusables[(position + 1) % focusables.length].focus(); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); focusables[(position - 1 + focusables.length) % focusables.length].focus(); }
  });
}
