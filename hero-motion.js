/* A gentle moving atmosphere over the original generated background image. */
(function () {
  window.createAirSpaceAtmosphere = function (hero) {
    const canvas = hero.querySelector('.cinema-particles');
    const context = canvas?.getContext('2d');
    if (!context) return { setPaused() {}, destroy() {} };
    let width = 0, height = 0, frame = 0, last = 0, time = 0;
    let paused = hero.classList.contains('motion-paused');
    let inView = true, destroyed = false;
    const particles = Array.from({ length: 92 }, (_, i) => ({
      x: ((i * 0.61803398875) % 1),
      y: ((i * 0.41421356237 + .17) % 1),
      size: .45 + (i % 7) * .17,
      speed: .008 + (i % 9) * .0018,
      phase: i * 2.41
    }));
    function draw(delta) {
      time += delta;
      context.clearRect(0, 0, width, height);
      for (const p of particles) {
        const x = ((p.x - time * p.speed + 100) % 1);
        const y = ((p.y - time * p.speed * .27 + Math.sin(time * .32 + p.phase) * .018 + 100) % 1);
        const px = width * (.34 + x * .66);
        const py = height * (.12 + y * .78);
        const light = Math.exp(-Math.pow((x - .59) / .43, 2));
        const alpha = (.2 + .22 * Math.sin(time * .62 + p.phase) ** 2) * light;
        context.beginPath();
        context.fillStyle = `rgba(255,242,211,${alpha})`;
        context.arc(px, py, p.size, 0, Math.PI * 2);
        context.fill();
      }
    }
    function running() { return !paused && inView && !document.hidden && !destroyed; }
    function animate(now) {
      frame = 0;
      if (!running()) return;
      if (!last) last = now;
      const elapsed = now - last;
      if (elapsed >= 1000 / 30) { draw(Math.min(elapsed / 1000, .08)); last = now; }
      frame = requestAnimationFrame(animate);
    }
    function sync() {
      cancelAnimationFrame(frame); frame = 0; last = 0;
      hero.classList.toggle('atmosphere-sleeping', !running());
      if (running()) frame = requestAnimationFrame(animate);
    }
    function resize() {
      const rect = hero.getBoundingClientRect();
      width = rect.width; height = rect.height;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0); draw(0);
    }
    const resizeObserver = new ResizeObserver(resize);
    const visibilityObserver = new IntersectionObserver(entries => {
      inView = entries[0].isIntersecting; sync();
    });
    resizeObserver.observe(hero); visibilityObserver.observe(hero);
    document.addEventListener('visibilitychange', sync);
    resize(); sync();
    return {
      setPaused(value) { paused = value; sync(); },
      destroy() {
        destroyed = true; cancelAnimationFrame(frame);
        resizeObserver.disconnect(); visibilityObserver.disconnect();
        document.removeEventListener('visibilitychange', sync);
      }
    };
  };
})();
