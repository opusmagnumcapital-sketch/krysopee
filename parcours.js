/* ════════════════════════════════════════════════════════
   Krysopée · parcours.js
   Gère le choix de voie à l'entrée (L'Œuvre Visible · technicien
   / L'Œuvre Intérieure · éveillé), l'adaptation du ton sur les
   pages communes, et l'invitation à basculer vers l'autre voie.
   Juin 2026 · Nemini Teneri
   ════════════════════════════════════════════════════════ */
(function () {

  function appliquer() {
    var parcours = sessionStorage.getItem('parcours') || '';
    document.documentElement.setAttribute('data-parcours', parcours);

    // Révèle le bloc de texte correspondant au parcours actif.
    // data-ton="defaut visible interieure" liste les contextes où l'élément doit s'afficher.
    document.querySelectorAll('[data-ton]').forEach(function (el) {
      var tons = el.getAttribute('data-ton').split(' ');
      var actif = (parcours && tons.indexOf(parcours) !== -1) || (!parcours && tons.indexOf('defaut') !== -1);
      el.style.display = actif ? '' : 'none';
    });

    // Bandeau "Vous suivez : ..." avec option de changer de voie à tout moment.
    var bandeau = document.getElementById('parcours-bandeau');
    if (bandeau) {
      if (parcours) {
        var estVisible = parcours === 'visible';
        var label = estVisible ? "L'Œuvre Visible ☉" : "L'Œuvre Intérieure ☿";
        var autreValeur = estVisible ? 'interieure' : 'visible';
        var autreHref = estVisible ? 'fondateur.html' : 'compte-propre.html';
        bandeau.innerHTML = 'Vous suivez : <strong>' + label + '</strong>' +
          '<a href="' + autreHref + '" onclick="choisirParcours(\'' + autreValeur + '\')">Changer de voie →</a>';
        bandeau.style.display = '';
      } else {
        bandeau.style.display = 'none';
      }
    }
  }

  // Fixe (ou change) le parcours en cours — appelable depuis n'importe quel lien.
  window.choisirParcours = function (valeur) {
    sessionStorage.setItem('parcours', valeur);
    sessionStorage.setItem('seuil-franchi', '1');
    appliquer();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', appliquer);
  } else {
    appliquer();
  }
})();
