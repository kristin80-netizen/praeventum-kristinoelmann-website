// Blog-Teaser auf der Startseite: liest artikel.json aus, wie assets/ratgeber-archiv.js
// es für die Ratgeber-Übersicht selbst schon tut. 26.08.2026 eingeführt, weil die
// bisherigen drei Karten hier fest im HTML standen und deshalb bei jedem neuen
// Ratgeberbeitrag stumm veraltet blieben, statt sich automatisch zu aktualisieren
// (Kristin hatte den neuesten Beitrag, "Langlebigkeit durch Ernährung", deshalb hier
// nicht gesehen, obwohl er längst veröffentlicht war). Zeigt immer die drei neuesten
// veröffentlichten Beiträge, keine Landingpages/Checklisten dazwischen.
(function () {
  var container = document.getElementById('homepage-blog-teaser');
  if (!container) return;

  fetch('/ratgeber/artikel.json')
    .then(function (res) { return res.json(); })
    .then(function (artikel) {
      var veroeffentlicht = artikel.filter(function (a) { return a.status === 'veröffentlicht'; });

      function vergleicheNachDatum(a, b) {
        if (a.publishDate && b.publishDate) return new Date(b.publishDate) - new Date(a.publishDate);
        if (a.publishDate && !b.publishDate) return -1;
        if (!a.publishDate && b.publishDate) return 1;
        return 0;
      }
      veroeffentlicht.sort(vergleicheNachDatum);

      var neueste = veroeffentlicht.slice(0, 3);

      var formatDatum = function (iso) {
        if (!iso) return null;
        var d = new Date(iso);
        return d.toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' });
      };

      var html = neueste.map(function (a) {
        var metaTeile = [];
        if (a.readingTime) metaTeile.push(a.readingTime + ' Lesezeit');
        if (a.publishDate) {
          metaTeile.push('<time datetime="' + a.publishDate + '">' + formatDatum(a.publishDate) + '</time>');
        } else {
          metaTeile.push('<span class="tag">Datum folgt</span>');
        }

        return (
          '<article class="card card-blog">' +
          '<img src="' + a.image + '" alt="' + a.imageAlt + '" width="' + a.imageWidth + '" height="' + a.imageHeight + '" loading="lazy">' +
          '<p class="blog-meta">' + metaTeile.join(' · ') + '</p>' +
          '<h3>' + a.title + '</h3>' +
          '<p>' + a.excerpt + '</p>' +
          '<a class="arrow-link" href="' + a.url + '">' + a.category + ' ansehen <span aria-hidden="true">→</span></a>' +
          '</article>'
        );
      }).join('');

      container.innerHTML = html;
    })
    .catch(function () {
      container.innerHTML = '<p>Die Beiträge konnten nicht geladen werden. <a href="/ratgeber/">Zum Ratgeber</a>.</p>';
    });
})();
