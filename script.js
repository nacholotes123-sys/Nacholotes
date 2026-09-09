document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- SALIDA: tarjeta expandiéndose a pantalla completa (index.html) ----------
  const cards = document.querySelectorAll('.categoria-card');
  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const href = card.getAttribute('href');

      if (prefersReducedMotion) {
        window.location.href = href;
        return;
      }

      const rect = card.getBoundingClientRect();
      const computed = getComputedStyle(card);

      const clone = card.cloneNode(true);
      clone.classList.add('card-clone');
      clone.style.top = rect.top + 'px';
      clone.style.left = rect.left + 'px';
      clone.style.width = rect.width + 'px';
      clone.style.height = rect.height + 'px';
      clone.style.margin = '0';
      clone.style.borderRadius = computed.borderRadius;
      clone.style.background = computed.backgroundImage !== 'none'
        ? computed.backgroundImage
        : computed.backgroundColor;
      document.body.appendChild(clone);

      const hero = document.querySelector('.hero');
      const main = document.querySelector('main');
      if (hero) { hero.style.transition = 'opacity 0.3s ease'; hero.style.opacity = '0'; }
      if (main) { main.style.transition = 'opacity 0.3s ease'; main.style.opacity = '0'; }

      requestAnimationFrame(() => {
        clone.style.top = '0';
        clone.style.left = '0';
        clone.style.width = '100vw';
        clone.style.height = '100vh';
        clone.style.borderRadius = '0';
      });

      clone.addEventListener('transitionend', () => {
        window.location.href = href;
      }, { once: true });
    });
  });

  // ---------- ENTRADA: la cortina de color se encoge hasta ser el encabezado (páginas de categoría) ----------
  const header = document.querySelector('.detalle-header');
  if (header && !prefersReducedMotion) {
    const overlay = document.createElement('div');
    overlay.classList.add('page-enter-overlay');
    overlay.style.background = getComputedStyle(header).backgroundColor;
    document.body.prepend(overlay);

    const headerHeight = header.getBoundingClientRect().height;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        overlay.style.height = headerHeight + 'px';
      });
    });

    overlay.addEventListener('transitionend', () => {
      overlay.remove();
    }, { once: true });
  }
});