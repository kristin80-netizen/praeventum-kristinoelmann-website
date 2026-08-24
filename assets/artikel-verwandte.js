// "Andere Blogbeiträge" am Ende eines Artikels, aus derselben
// ratgeber/artikel.json wie die Übersichtsseite, damit es nie zwei
// unterschiedliche Beitragslisten im Projekt gibt. Schließt den aktuellen
// Beitrag über data-slug am Container aus.
(function () {
  var container = document.getElementById('andere-beitraege');
  if (!container) return;
  var aktuellerSlug = container.getAttribute('data-slug');

  fetch('/ratgeber/artikel.json')
    .then(function (res) { return res.json(); })
    .then(function (artikel) {
      var andere = artikel
        .filter(function (a) { return a.slug !== aktuellerSlug && a.status === 'veröffentlicht'; })
        .slice(0, 3);

      if (!andere.length) {
        container.closest('section').style.display = 'none';
        return;
      }

      container.innerHTML = andere.map(function (a) {
        return (
          '<article class="card card-blog">' +
          '<img src="' + a.image + '" alt="' + a.imageAlt + '" width="' + a.imageWidth + '" height="' + a.imageHeight + '" loading="lazy">' +
          '<h3>' + a.title + '</h3>' +
          '<p>' + a.excerpt + '</p>' +
          '<a class="arrow-link" href="' + a.url + '">Beitrag lesen <span aria-hidden="true">→</span></a>' +
          '</article>'
        );
      }).join('');
    })
    .catch(function () {
      container.closest('section').style.display = 'none';
    });
})();
