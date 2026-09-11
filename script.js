document.getElementById('year').textContent = new Date().getFullYear();

(function () {
  const canvas = document.getElementById('bg');
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let width, height, dpr;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  window.addEventListener('resize', resize);
  resize();

  // Slow-drifting moody "aura" blobs — muted amber / deep teal / charcoal.
  const blobs = [
    { color: '201,162,75',  rx: 0.55, ry: 0.35, r: 0.42, sx: 0.021, sy: 0.017, phase: 0 },
    { color: '46,74,74',    rx: 0.20, ry: 0.70, r: 0.46, sx: 0.015, sy: 0.023, phase: 2 },
    { color: '90,60,100',   rx: 0.80, ry: 0.75, r: 0.38, sx: 0.019, sy: 0.013, phase: 4 },
  ];

  function draw(t) {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#08090a';
    ctx.fillRect(0, 0, width, height);

    const time = t / 1000;
    blobs.forEach((b) => {
      const cx = (b.rx + 0.06 * Math.sin(time * b.sx + b.phase)) * width;
      const cy = (b.ry + 0.06 * Math.cos(time * b.sy + b.phase)) * height;
      const radius = b.r * Math.max(width, height);

      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      grad.addColorStop(0, `rgba(${b.color}, 0.16)`);
      grad.addColorStop(0.5, `rgba(${b.color}, 0.06)`);
      grad.addColorStop(1, `rgba(${b.color}, 0)`);

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    });

    // subtle vignette to keep focus centered
    const vignette = ctx.createRadialGradient(
      width / 2, height / 2, Math.min(width, height) * 0.25,
      width / 2, height / 2, Math.max(width, height) * 0.75
    );
    vignette.addColorStop(0, 'rgba(0,0,0,0)');
    vignette.addColorStop(1, 'rgba(0,0,0,0.55)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);

    if (!reduceMotion) requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
  if (reduceMotion) draw(0); // draw a single static frame
})();
