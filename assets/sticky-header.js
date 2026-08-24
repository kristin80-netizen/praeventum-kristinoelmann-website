// Fügt der Kopfzeile beim Scrollen einen leichten Schatten hinzu (.is-scrolled),
// unabhängig davon, wann header.html per include.js nachgeladen wurde. Die
// Kopfzeile selbst bleibt dank CSS (position: sticky) auf jeder Seite sichtbar,
// dieses Skript ergänzt nur die optische Kante beim Scrollen (Wunsch Kristin
// 20.08.2026). Kein externes Skript, keine Abhängigkeit von include.js.
(function () {
  function updateShadow() {
    var header = document.querySelector('.site-header');
    if (!header) { return; }
    if (window.scrollY > 8) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }

  window.addEventListener('scroll', updateShadow, { passive: true });
  window.addEventListener('load', updateShadow);
  // Läuft zusätzlich kurz nach dem Start, falls header.html erst danach
  // per fetch() eingesetzt wird.
  setTimeout(updateShadow, 300);
})();
