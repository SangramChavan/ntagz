/* ── PRODUCT FILTER ── */
    function filterProducts(cat, btn) {
      document.querySelectorAll('.ftab').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      document.querySelectorAll('.product-card').forEach(card => {
        const show = cat === 'all' || card.dataset.cat === cat;
        card.style.display = show ? '' : 'none';
      });
    }

    /* ── PRODUCT IMAGE CAROUSEL (photo + spec sheet) ── */
    function setSlide(btn, idx) {
      const carousel = btn.closest('[data-carousel]');
      carousel.querySelectorAll('.product-photo').forEach((img, i) => {
        img.classList.toggle('active', i === idx);
      });
      carousel.querySelectorAll('.carousel-dots button').forEach((b, i) => {
        b.classList.toggle('active', i === idx);
      });
    }

    /* ── FAQ TOGGLE ── */
    function toggleFaq(el) {
      const item = el.parentElement;
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        el.setAttribute('aria-expanded', 'true');
      }
    }

    /* ── SCROLL REVEAL ── */
    const reveals = document.querySelectorAll('.reveal');
    const revealObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); revealObs.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    reveals.forEach(el => revealObs.observe(el));

    /* ── STAGGER grid children ── */
    document.querySelectorAll('.products-grid, .usecases-grid, .testi-grid, .steps-grid').forEach(grid => {
      Array.from(grid.children).forEach((child, i) => {
        child.style.transitionDelay = (i * 0.08) + 's';
        child.classList.add('reveal');
        revealObs.observe(child);
      });
    });

    /* ── ARIA: init faq expanded states ── */
    document.querySelectorAll('.faq-q').forEach(q => {
      q.setAttribute('aria-expanded', 'false');
      q.setAttribute('role', 'button');
    });
