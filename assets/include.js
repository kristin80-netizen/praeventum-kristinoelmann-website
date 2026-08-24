// Lädt Kopf- und Fußbereich aus je einer gemeinsamen Datei nach, statt sie
// auf jeder Seite zu kopieren. Läuft im Browser, sobald die Seite über einen
// Server ausgeliefert wird (z. B. Netlify), nicht bei direktem Öffnen der
// Datei ohne Server.
document.querySelectorAll('[data-include]').forEach(function (el) {
  fetch(el.getAttribute('data-include'))
    .then(function (res) { return res.text(); })
    .then(function (html) { el.innerHTML = html; })
    .catch(function () {
      el.innerHTML = '<!-- Einbindung fehlgeschlagen: ' + el.getAttribute('data-include') + ' -->';
    });
});
