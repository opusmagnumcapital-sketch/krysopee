(function () {
  var b = document.querySelector('.nav-toggle');
  var n = document.getElementById('nav');
  if (!b || !n) return;
  b.addEventListener('click', function () {
    var o = n.classList.toggle('open');
    b.setAttribute('aria-expanded', o ? 'true' : 'false');
    b.setAttribute('aria-label', o ? 'Fermer le menu' : 'Ouvrir le menu');
  });
})();
