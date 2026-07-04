(function(){
  // ---------------- floating background bunnies / hearts / sparkles ----------------
  const bgLayer = document.getElementById('bg-layer');
  const emojiSet = ['🐰','🌸','💗','✨','🎀'];
  const count = 18;
  for(let i=0;i<count;i++){
    const el = document.createElement('div');
    el.className = 'floater';
    el.textContent = emojiSet[Math.floor(Math.random()*emojiSet.length)];
    const size = 14 + Math.random()*22;
    el.style.fontSize = size + 'px';
    el.style.left = Math.random()*100 + 'vw';
    const dur = 10 + Math.random()*14;
    el.style.animationDuration = dur + 's';
    el.style.animationDelay = (-Math.random()*dur) + 's';
    el.style.opacity = 0.35 + Math.random()*0.5;
    bgLayer.appendChild(el);
  }

  // ---------------- page navigation ----------------
  const pages = Array.from(document.querySelectorAll('.page'));
  const dotsWrap = document.getElementById('dots');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  let current = 0;

  pages.forEach((_, i) => {
    const d = document.createElement('div');
    d.className = 'dot' + (i===0 ? ' active' : '');
    d.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(d);
  });
  const dots = Array.from(dotsWrap.children);

  function goTo(i){
    if(i<0 || i>=pages.length) return;
    pages[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = i;
    pages[current].classList.add('active');
    dots[current].classList.add('active');
    prevBtn.disabled = current===0;
    nextBtn.disabled = current===pages.length-1;
    if(current === pages.length-1){ setTimeout(burstConfetti, 300); }
  }

  function animateButton(btn, evt){
    // ripple centered on click/tap position
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const size = Math.max(rect.width, rect.height) * 1.4;
    const clientX = (evt && evt.clientX) ? evt.clientX : rect.left + rect.width/2;
    const clientY = (evt && evt.clientY) ? evt.clientY : rect.top + rect.height/2;
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (clientX - rect.left - size/2) + 'px';
    ripple.style.top = (clientY - rect.top - size/2) + 'px';
    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());

    // bounce pop
    btn.classList.remove('bounce');
    void btn.offsetWidth; // restart animation
    btn.classList.add('bounce');
  }

  prevBtn.addEventListener('click', (e) => { animateButton(prevBtn, e); goTo(current-1); });
  nextBtn.addEventListener('click', (e) => { animateButton(nextBtn, e); goTo(current+1); });
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'ArrowRight') goTo(current+1);
    if(e.key === 'ArrowLeft') goTo(current-1);
  });
  goTo(0);

  // swipe support
  let touchX = null;
  document.addEventListener('touchstart', e => touchX = e.touches[0].clientX);
  document.addEventListener('touchend', e => {
    if(touchX===null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if(dx > 50) goTo(current-1);
    else if(dx < -50) goTo(current+1);
    touchX = null;
  });

  // ---------------- candle interaction ----------------
  const flame = document.getElementById('flame');
  const cakeScene = document.getElementById('cakeScene');
  const candleHint = document.getElementById('candleHint');
  cakeScene.addEventListener('click', () => {
    flame.classList.add('out');
    candleHint.textContent = 'wish made 🤍';
    burstConfetti();
  });

  document.getElementById('replayBtn').addEventListener('click', burstConfetti);

  // ---------------- background music (your uploaded track) ----------------
  const musicBtn = document.getElementById('musicBtn');
  const bgm = document.getElementById('bgm');
  bgm.volume = 0.55;
  let musicPlaying = false;

  function startMusic(){
    bgm.play().then(() => {
      musicPlaying = true;
      musicBtn.classList.add('playing');
      musicBtn.title = 'Pause music';
    }).catch(() => { /* needs a user gesture; the open button already provides one */ });
  }
  function stopMusic(){
    bgm.pause();
    musicPlaying = false;
    musicBtn.classList.remove('playing');
    musicBtn.title = 'Play music';
  }
  musicBtn.addEventListener('click', () => {
    if(musicPlaying) stopMusic(); else startMusic();
  });

  // ---------------- cover page reveal ----------------
  const coverPage = document.getElementById('coverPage');
  const openBtn = document.getElementById('openBtn');
  const coverHearts = document.getElementById('coverHearts');
  const coverEmoji = ['🐰','💗','🌸','✨'];
  for(let i=0;i<14;i++){
    const el = document.createElement('div');
    el.className = 'floater';
    el.textContent = coverEmoji[Math.floor(Math.random()*coverEmoji.length)];
    el.style.fontSize = (12 + Math.random()*18) + 'px';
    el.style.left = Math.random()*100 + '%';
    const dur = 8 + Math.random()*10;
    el.style.animationDuration = dur + 's';
    el.style.animationDelay = (-Math.random()*dur) + 's';
    el.style.opacity = 0.4 + Math.random()*0.5;
    coverHearts.appendChild(el);
  }

  openBtn.addEventListener('click', () => {
    startMusic();
    coverPage.classList.add('hide');
    burstConfetti();
    setTimeout(() => { coverPage.style.display = 'none'; }, 950);
  });

  // ---------------- confetti ----------------
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  function resize(){ canvas.width = innerWidth; canvas.height = innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  let particles = [];
  const colors = ['#ff8fb3','#ffd166','#ff5d94','#ffffff','#ffc9dd'];

  function burstConfetti(){
    for(let i=0;i<70;i++){
      particles.push({
        x: canvas.width/2 + (Math.random()-0.5)*120,
        y: canvas.height*0.4,
        vx: (Math.random()-0.5)*8,
        vy: Math.random()*-8 - 3,
        size: 4+Math.random()*6,
        color: colors[Math.floor(Math.random()*colors.length)],
        rot: Math.random()*360,
        vr: (Math.random()-0.5)*10,
        life: 0
      });
    }
  }

  function tick(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach(p=>{
      p.vy += 0.25;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.life++;
      ctx.save();
      ctx.translate(p.x,p.y);
      ctx.rotate(p.rot*Math.PI/180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size*0.6);
      ctx.restore();
    });
    particles = particles.filter(p => p.y < canvas.height+40 && p.life < 260);
    requestAnimationFrame(tick);
  }
  tick();
})();
