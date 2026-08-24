// Sanftes Einblenden von Abschnitten beim Scrollen, eigenständig geschrieben,
// keine externe Bibliothek. Respektiert die Systemeinstellung "reduzierte
// Bewegung", dann wird sofort alles sichtbar gezeigt ohne Animation.
//
// Ergänzt am 20.08.2026 (Wettbewerbsanalyse ernaehrungscoach.melanieaurich.com):
// Karten innerhalb eines Grids (.cards, .cards-leistungen, .cards-three)
// blenden nacheinander statt gleichzeitig ein. Die Karten selbst tragen im
// Markup keine eigene .reveal-Klasse (nur die umschließenden Abschnitte),
// deshalb wird sie hier automatisch ergänzt, statt jede HTML-Datei einzeln
// anzufassen. Reine Optik, keine neue Struktur, kein neuer Inhalt.
(function () {
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var STAGGER_STEP_MS = 90;
  var STAGGER_MAX_MS = 360;

  document.querySelectorAll('.cards, .cards-leistungen, .cards-three, .leistungen-list, .situation-list').forEach(function (grid) {
    Array.prototype.forEach.call(grid.children, function (card, index) {
      card.classList.add('reveal', 'reveal-card');
      if (!prefersReduced) {
        card.style.transitionDelay = Math.min(index * STAGGER_STEP_MS, STAGGER_MAX_MS) + 'ms';
      }
    });
  });

  var targets = document.querySelectorAll('.reveal');

  if (prefersReduced || !('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('reveal-visible'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  targets.forEach(function (el) { observer.observe(el); });
})();
