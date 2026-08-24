// Sendet das Kontaktformular per fetch an Netlify Forms, statt die Seite neu
// zu laden oder auf Netlifys fremde Standard-Erfolgsseite umzuleiten.
// Eigenständig geschrieben, keine Bibliothek, greift nur, wenn das
// Formular auf der Seite vorhanden ist (kein Fehler auf anderen Seiten).
(function () {
  var form = document.getElementById('kontakt-formular');
  if (!form) return;

  var status = document.getElementById('kontakt-status');

  function encode(data) {
    return Object.keys(data)
      .map(function (key) {
        return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
      })
      .join('&');
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var formData = {};
    new FormData(form).forEach(function (value, key) {
      formData[key] = value;
    });

    var submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) submitButton.disabled = true;

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encode(formData)
    })
      .then(function (response) {
        if (!response.ok) throw new Error('Netlify Forms antwortete mit Status ' + response.status);
        form.reset();
        form.hidden = true;
        status.hidden = false;
        status.textContent = 'Danke für deine Nachricht! Ich melde mich so schnell wie möglich bei dir.';
      })
      .catch(function () {
        status.hidden = false;
        status.className = 'form-status form-status-error';
        status.textContent = 'Das hat leider nicht geklappt. Schreib mir gerne direkt an kristinoelmann@t-online.de.';
        if (submitButton) submitButton.disabled = false;
      });
  });
})();
