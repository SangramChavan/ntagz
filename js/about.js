const reveals = document.querySelectorAll('.reveal');
    const revealObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); revealObs.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    reveals.forEach(el => revealObs.observe(el));

    document.querySelectorAll('.tech-grid, .cat-grid, .prop-grid').forEach(grid => {
      Array.from(grid.children).forEach((child, i) => {
        child.style.transitionDelay = (i * 0.08) + 's';
        child.classList.add('reveal');
        revealObs.observe(child);
      });
    });
