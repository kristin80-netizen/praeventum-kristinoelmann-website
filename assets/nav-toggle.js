// Ergänzt aria-expanded am Hamburger-Button, damit Screenreader den
// Menüzustand ansagen. Die eigentliche Öffnen/Schließen-Funktion läuft rein
// über die Checkbox in partials/header.html und braucht dieses Skript nicht,
// falls JavaScript deaktiviert ist.
(function () {
  var toggle = document.getElementById('nav-toggle');
  var label = document.querySelector('.nav-toggle-label');
  if (!toggle || !label) return;

  toggle.addEventListener('change', function () {
    label.setAttribute('aria-expanded', toggle.checked ? 'true' : 'false');
  });

  // Menü schließen, sobald ein Link darin angeklickt wird (z. B. beim
  // Wechsel auf eine andere Seite bleibt sonst die Checkbox "checked"
  // im zurückgesetzten DOM der neuen Seite unsichtbar hängen).
  document.querySelectorAll('.main-nav a').forEach(function (link) {
    link.addEventListener('click', function () {
      toggle.checked = false;
      label.setAttribute('aria-expanded', 'false');
    });
  });
})();
