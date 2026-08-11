/* =========================================
   ETS RZ — Projets
   Charge assets/data/projets.json, trie par date
   décroissante et génère les cards.
   - #projectsGrid (page projets.html) : grille complète
   - #projectsPreview (page index.html) : 3 plus récents
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

  const fullGrid = document.getElementById('projectsGrid');
  const previewGrid = document.getElementById('projectsPreview');
  if (!fullGrid && !previewGrid) return;

  function cardHTML(p, i) {
    return `
      <div class="project-card reveal reveal-delay-${(i % 3) + 1}">
        <div class="project-img photo-placeholder" style="position:relative; height:220px;">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#aab0ba" stroke-width="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
          <span><img src="${p.image}" alt="${p.titre}" loading="lazy"></span>
          <span class="project-year">${p.annee}</span>
          <div class="overlay"><span></span></div>
        </div>
        <div class="project-info">
          <h3>${p.titre}</h3>
          <p>${p.description}</p>
          <span class="project-tag">${p.tag}</span>
        </div>
      </div>
    `;
  }

  function cardHTMLPreview(p, i) {
    return `
      <div class="project-card reveal reveal-delay-${(i % 3) + 1}">
        <div class="project-img" style="position:relative; height:200px; overflow:hidden;">
          <img src="${p.image}" alt="${p.titre}" loading="lazy" style="width:100%; height:100%; object-fit:cover;" />
        </div>
        <div class="project-info">
          <h3>${p.titre}</h3>
          <p>${p.description}</p>
          <span class="project-tag">${p.tag}</span>
        </div>
      </div>
    `;
  }

  fetch('assets/data/projets.json')
    .then(res => res.json())
    .then(projets => {
      projets.sort((a, b) => new Date(b.date) - new Date(a.date));

      if (fullGrid) {
        fullGrid.innerHTML = projets.map(cardHTML).join('');
      }
      if (previewGrid) {
        previewGrid.innerHTML = projets.slice(0, 3).map(cardHTMLPreview).join('');
      }

      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

      document.querySelectorAll('#projectsGrid .reveal, #projectsPreview .reveal')
        .forEach(el => revealObserver.observe(el));
    })
    .catch(err => {
      console.error('Erreur de chargement des projets :', err);
      const target = fullGrid || previewGrid;
      if (target) target.innerHTML = '<p style="grid-column:1/-1; text-align:center; color:var(--gray-text);">Impossible de charger les projets pour le moment.</p>';
    });

});
