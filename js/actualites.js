/* =========================================
   ETS RZ — Actualités
   Charge assets/data/actualites.json et génère
   les cards + la modale de lecture complète.
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

  const grid = document.getElementById('actuGrid');
  if (!grid) return; // on n'est pas sur la page actualites.html

  const modal = document.getElementById('actuModal');
  const modalBody = document.getElementById('actuModalBody');
  const modalClose = document.getElementById('actuModalClose');

  const moisFr = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];

  function formatDate(iso) {
    const d = new Date(iso + 'T00:00:00');
    return `${d.getDate()} ${moisFr[d.getMonth()]} ${d.getFullYear()}`;
  }

  function openModal(post) {
    modalBody.innerHTML = `
      <span class="project-tag">${post.categorie}</span>
      <h2>${post.titre}</h2>
      <div class="actu-modal-date">${formatDate(post.date)}</div>
      <img src="${post.image}" alt="${post.titre}" class="actu-modal-img" />
      ${post.contenu.split('\n\n').map(p => `<p>${p}</p>`).join('')}
    `;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  fetch('assets/data/actualites.json')
    .then(res => res.json())
    .then(posts => {
      posts.sort((a, b) => new Date(b.date) - new Date(a.date));

      if (posts.length === 0) {
        grid.innerHTML = '<p style="grid-column:1/-1; text-align:center; color:var(--gray-text);">Aucune actualité pour le moment.</p>';
        return;
      }

      grid.innerHTML = posts.map((post, i) => `
        <div class="project-card actu-card reveal reveal-delay-${(i % 3) + 1}" data-id="${post.id}">
          <div class="project-img" style="position:relative; height:200px; overflow:hidden;">
            <img src="${post.image}" alt="${post.titre}" loading="lazy" style="width:100%; height:100%; object-fit:cover;" />
            <span class="project-year">${formatDate(post.date)}</span>
          </div>
          <div class="project-info">
            <span class="project-tag">${post.categorie}</span>
            <h3>${post.titre}</h3>
            <p>${post.extrait}</p>
          </div>
        </div>
      `).join('');

      grid.querySelectorAll('.actu-card').forEach(card => {
        card.addEventListener('click', () => {
          const post = posts.find(p => p.id === parseInt(card.dataset.id, 10));
          if (post) openModal(post);
        });
      });

      // Réactive le scroll-reveal pour les cards générées dynamiquement
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
      grid.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
    })
    .catch(err => {
      console.error('Erreur de chargement des actualités :', err);
      grid.innerHTML = '<p style="grid-column:1/-1; text-align:center; color:var(--gray-text);">Impossible de charger les actualités pour le moment.</p>';
    });

});
