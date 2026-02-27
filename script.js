const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const topbarLabel = document.getElementById('topbar-section-label');

const sectionNames = {
  home: 'CS Portfolio',
  about: 'I Love You.',
  projects: 'Wiped Out!',
  skills: 'Cry Baby',
  contact: 'Sweater Weather',
};

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach((l) => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[data-section="${id}"]`);
        if (active) active.classList.add('active');
        if (topbarLabel) topbarLabel.textContent = sectionNames[id] || 'CS Portfolio';
        if (id === 'skills') animateSkillBars();
      }
    });
  },
  { threshold: 0.25 }
);

sections.forEach((s) => observer.observe(s));

navLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

document.querySelectorAll('.track-row[data-href]').forEach((row) => {
  row.addEventListener('click', () => {
    const target = document.querySelector(row.dataset.href);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

document.querySelectorAll('.library-item').forEach((item) => {
  item.addEventListener('click', () => {
    const el = document.querySelector('#projects');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  });
});

const sectionIds = ['home', 'about', 'projects', 'skills', 'contact'];

function getCurrentIdx() {
  const active = document.querySelector('.nav-link.active');
  if (!active) return 0;
  const id = active.dataset.section;
  return sectionIds.indexOf(id);
}

document.getElementById('btn-back')?.addEventListener('click', () => {
  const idx = getCurrentIdx();
  if (idx > 0) {
    document.querySelector(`#${sectionIds[idx - 1]}`).scrollIntoView({ behavior: 'smooth' });
  }
});

document.getElementById('btn-fwd')?.addEventListener('click', () => {
  const idx = getCurrentIdx();
  if (idx < sectionIds.length - 1) {
    document.querySelector(`#${sectionIds[idx + 1]}`).scrollIntoView({ behavior: 'smooth' });
  }
});

let isPlaying = false;
let totalSeconds = 273;
let elapsed = 0;
let playerInterval = null;

const playBtn     = document.getElementById('play-btn');
const playIcon    = document.getElementById('play-icon');
const pauseIcon   = document.getElementById('pause-icon');
const progFill    = document.getElementById('prog-fill');
const progThumb   = document.getElementById('prog-thumb');
const progCurrent = document.getElementById('prog-current');
const progTotal   = document.getElementById('prog-total');

const tracks = [
  { name: 'Hans Chen',     sub: 'CS Portfolio · Open to Work', dur: 273 },
  { name: 'Project One',   sub: 'Type · Stack',                dur: 207 },
  { name: 'Project Two',   sub: 'Type · Stack',                dur: 251 },
  { name: 'Project Three', sub: 'Type · Stack',                dur: 178 },
  { name: 'Project Four',  sub: 'Type · Stack',                dur: 302 },
];
let trackIdx = 0;

function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

function setTrack(idx) {
  trackIdx = ((idx % tracks.length) + tracks.length) % tracks.length;
  const t = tracks[trackIdx];
  document.getElementById('player-track').textContent = t.name;
  document.getElementById('player-sub').textContent = t.sub;
  totalSeconds = t.dur;
  elapsed = 0;
  if (progTotal) progTotal.textContent = formatTime(totalSeconds);
  updateProgress();
}

function updateProgress() {
  const pct = totalSeconds > 0 ? (elapsed / totalSeconds) * 100 : 0;
  if (progFill)    progFill.style.width = `${pct}%`;
  if (progThumb)   progThumb.style.left = `${pct}%`;
  if (progCurrent) progCurrent.textContent = formatTime(elapsed);
}

function startPlay() {
  isPlaying = true;
  if (playIcon)  playIcon.style.display  = 'none';
  if (pauseIcon) pauseIcon.style.display = '';
  clearInterval(playerInterval);
  playerInterval = setInterval(() => {
    elapsed++;
    if (elapsed >= totalSeconds) {
      elapsed = 0;
      setTrack(trackIdx + 1);
    }
    updateProgress();
  }, 1000);
}

function pausePlay() {
  isPlaying = false;
  if (playIcon)  playIcon.style.display  = '';
  if (pauseIcon) pauseIcon.style.display = 'none';
  clearInterval(playerInterval);
}

playBtn?.addEventListener('click', () => {
  isPlaying ? pausePlay() : startPlay();
});

document.querySelectorAll('.ctrl-btn').forEach((btn) => {
  const label = btn.getAttribute('aria-label');
  if (label === 'prev') {
    btn.addEventListener('click', () => { setTrack(trackIdx - 1); if (isPlaying) startPlay(); });
  }
  if (label === 'next') {
    btn.addEventListener('click', () => { setTrack(trackIdx + 1); if (isPlaying) startPlay(); });
  }
});

document.getElementById('prog-track')?.addEventListener('click', (e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const pct = (e.clientX - rect.left) / rect.width;
  elapsed = Math.floor(pct * totalSeconds);
  updateProgress();
});

const volSlider = document.querySelector('.volume-slider');
volSlider?.addEventListener('input', () => {
  const pct = volSlider.value;
  volSlider.style.background = `linear-gradient(to right, #fff ${pct}%, #2a2a2a ${pct}%)`;
});

document.getElementById('player-heart')?.addEventListener('click', function () {
  this.classList.toggle('liked');
});

setTrack(0);
if (progTotal) progTotal.textContent = formatTime(tracks[0].dur);

function animateSkillBars() {
  document.querySelectorAll('.skill-bar-fill').forEach((bar) => {
    if (!bar.classList.contains('animated')) {
      bar.classList.add('animated');
    }
  });
}

window.handleForm = function (e) {
  e.preventDefault();
  const toast = document.createElement('div');
  toast.className = 'form-toast';
  toast.textContent = '✓ Message sent — I\'ll be in touch.';
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
  e.target.reset();
};

const resumeModal    = document.getElementById('resume-modal');
const resumeOpenBtn  = document.getElementById('resume-open-btn');
const resumeCloseBtn = document.getElementById('resume-close-btn');

function openResumeModal() {
  resumeModal.classList.add('open');
  resumeModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeResumeModal() {
  resumeModal.classList.remove('open');
  resumeModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

resumeOpenBtn?.addEventListener('click', openResumeModal);
resumeCloseBtn?.addEventListener('click', closeResumeModal);

resumeModal?.addEventListener('click', (e) => {
  if (e.target === resumeModal) closeResumeModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && resumeModal?.classList.contains('open')) closeResumeModal();
});

document.querySelectorAll('.library-item').forEach((item, i) => {
  const cards = document.querySelectorAll('.project-card');
  item.addEventListener('mouseenter', () => {
    if (cards[i]) cards[i].style.borderColor = 'rgba(255,255,255,0.3)';
  });
  item.addEventListener('mouseleave', () => {
    if (cards[i]) cards[i].style.borderColor = '';
  });
});

document.querySelectorAll('.track-row:not(.track-header)').forEach((row, i) => {
  const numEl = row.querySelector('.track-num');
  if (!numEl) return;
  const orig = numEl.textContent;
  row.addEventListener('mouseenter', () => { numEl.innerHTML = '▶'; });
  row.addEventListener('mouseleave', () => { numEl.textContent = orig; });
  row.addEventListener('click', () => {
    setTrack(i + 1);
    startPlay();
  });
});
