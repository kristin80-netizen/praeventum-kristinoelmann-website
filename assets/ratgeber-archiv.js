// Ratgeber-Archiv: liest artikel.json aus und baut die Übersicht daraus auf.
// Einmal geschrieben, nie wieder von Hand anzupassen: ein neuer Beitrag wird
// einfach als neuer Eintrag in artikel.json ergänzt, erscheint dann
// automatisch hier, richtig einsortiert nach Veröffentlichungsdatum.
// Eigenständig geschrieben, keine externe Bibliothek (Bauregel 6).
(function () {
  var container = document.getElementById('ratgeber-liste');
  if (!container) return;

  fetch('/ratgeber/artikel.json')
    .then(function (res) { return res.json(); })
    .then(function (artikel) {
      // Neueste zuerst. Beiträge ohne bekanntes Datum (aktuell alle drei
      // veröffentlichten, siehe CLAUDE.md) rutschen ans Ende der jeweiligen
      // Gruppe, statt zufällig irgendwo einsortiert zu werden.
      var veroeffentlicht = artikel.filter(function (a) { return a.status === 'veröffentlicht'; });
      var inVorbereitung = artikel.filter(function (a) { return a.status !== 'veröffentlicht'; });

      function vergleicheNachDatum(a, b) {
        if (a.publishDate && b.publishDate) return new Date(b.publishDate) - new Date(a.publishDate);
        if (a.publishDate && !b.publishDate) return -1;
        if (!a.publishDate && b.publishDate) return 1;
        return 0;
      }
      veroeffentlicht.sort(vergleicheNachDatum);

      var sortiert = veroeffentlicht.concat(inVorbereitung);

      var formatDatum = function (iso) {
        if (!iso) return null;
        var d = new Date(iso);
        return d.toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' });
      };

      var html = sortiert.map(function (a) {
        var metaTeile = [];
        if (a.publishDate) {
          metaTeile.push('<time datetime="' + a.publishDate + '">' + formatDatum(a.publishDate) + '</time>');
        } else {
          metaTeile.push('<span class="tag">Datum folgt</span>');
        }
        if (a.readingTime) metaTeile.push(a.readingTime + ' Lesezeit');
        if (a.status !== 'veröffentlicht') metaTeile.push('<span class="tag">in Vorbereitung</span>');

        return (
          '<article class="card card-blog">' +
          '<img src="' + a.image + '" alt="' + a.imageAlt + '" width="' + a.imageWidth + '" height="' + a.imageHeight + '" loading="lazy">' +
          '<p class="blog-meta">' + metaTeile.join(' · ') + '</p>' +
          '<h2>' + a.title + '</h2>' +
          '<p>' + a.excerpt + '</p>' +
          '<a class="arrow-link" href="' + a.url + '">' + a.category + ' ansehen <span aria-hidden="true">→</span></a>' +
          '</article>'
        );
      }).join('');

      container.innerHTML = html;

      // CollectionPage-Auszeichnung aus denselben Daten erzeugen, damit sie
      // nie aus dem Takt mit der sichtbaren Liste geraten kann.
      var schema = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Ratgeber Ernährung, Hormone und Blutwerte – Präventum',
        hasPart: sortiert.map(function (a) {
          return { '@type': 'Article', headline: a.title, url: a.url };
        })
      };
      var script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    })
    .catch(function () {
      container.innerHTML = '<p>Die Beiträge konnten nicht geladen werden. <a href="mailto:kristinoelmann@t-online.de">Schreib mir gerne direkt</a>.</p>';
    });
})();
