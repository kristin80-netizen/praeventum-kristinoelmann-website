// Baut die Gliederung rechts automatisch aus den H2-Überschriften im
// Artikeltext auf. Kein Duplizieren von Hand: eine Überschrift ändern oder
// ergänzen genügt, die Gliederung zieht immer nach. Eigenständig
// geschrieben, keine externe Bibliothek (Bauregel 6).
(function () {
  var artikel = document.querySelector('.article-body');
  var tocList = document.querySelector('.article-toc-list');
  if (!artikel || !tocList) return;

  var ueberschriften = artikel.querySelectorAll('h2');
  if (!ueberschriften.length) {
    document.querySelector('.article-toc').style.display = 'none';
    return;
  }

  var html = '';
  ueberschriften.forEach(function (h, i) {
    if (!h.id) h.id = 'abschnitt-' + (i + 1);
    html += '<li><a href="#' + h.id + '">' + h.textContent + '</a></li>';
  });
  tocList.innerHTML = html;

  // Aktiven Abschnitt beim Scrollen markieren.
  var links = tocList.querySelectorAll('a');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = tocList.querySelector('a[href="#' + entry.target.id + '"]');
        if (!link) return;
        if (entry.isIntersecting) {
          links.forEach(function (l) { l.classList.remove('is-active'); });
          link.classList.add('is-active');
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    ueberschriften.forEach(function (h) { observer.observe(h); });
  }
})();
