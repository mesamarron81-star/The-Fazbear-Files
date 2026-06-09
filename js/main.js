// =============================================
// THE FAZBEAR FILES - MAIN APPLICATION
// =============================================
// WARNING: CLASSIFIED MATERIAL
// UNAUTHORIZED ACCESS IS PROHIBITED
// =============================================

// =============================================
// STATE
// =============================================
const state = {
  currentPage: 'home',
  currentFilter: 'all',
  characterSearch: '',
  gamesSearch: '',
  booksSearch: '',
  soundEnabled: false,
  vhsEnabled: true,
  audioContext: null,
  isPlaying: false,
  goldenTimer: null,
  glitchTimer: null,
  distortionTimer: null,
  notificationTimer: null,
  galleryIndex: 0,
};

function getImageUrl(type, id) {
  try {
    const data = window.images && window.images[type] && window.images[type][id];
    return data && data.primary ? data.primary : '';
  } catch (e) { return ''; }
}

function getImageGallery(type, id) {
  try {
    const data = window.images && window.images[type] && window.images[type][id];
    return data && data.gallery && data.gallery.length > 0 ? data.gallery : [];
  } catch (e) { return []; }
}

// =============================================
// DOM REFS
// =============================================
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

// =============================================
// INIT
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  initLoadingScreen();
  initDate();
  initNavigation();
  initTabs();
  initCharacterFilters();
  initAdminNav();
  initModal();
  initMusicPlayer();
  initSoundToggle();
  initVhsToggle();

  // Load page data
  loadPage('home');

  // Start easter eggs
  setTimeout(initEasterEggs, 3000);

  // Start VHS effects
  initVHSEffects();
});

// =============================================
// LOADING SCREEN
// =============================================
function initLoadingScreen() {
  setTimeout(() => {
    $('#loading-screen').classList.add('hidden');
  }, 3500);
}

// =============================================
// DATE
// =============================================
function initDate() {
  const now = new Date();
  const opts = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  $('#last-recovery').textContent = `Última recuperación: ${now.toLocaleDateString('es-ES', opts)}`;
  $('#admin-sync').textContent = now.toLocaleDateString('es-ES', opts);
}

// =============================================
// NAVIGATION
// =============================================
function initNavigation() {
  const links = $$('#main-nav a');
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const page = link.dataset.page;
      navigateTo(page);
    });
  });

  // Hash routing
  window.addEventListener('hashchange', () => {
    const hash = location.hash.replace('#', '') || 'home';
    navigateTo(hash);
  });

  // Initial hash
  if (location.hash) {
    const hash = location.hash.replace('#', '') || 'home';
    navigateTo(hash);
  }
}

function navigateTo(page) {
  // Hide all pages
  $$('.page').forEach(p => p.classList.remove('active'));

  // Show target
  const target = $(`#page-${page}`);
  if (target) {
    target.classList.add('active');
    state.currentPage = page;
  }

  // Update nav
  $$('#main-nav a').forEach(a => {
    a.classList.toggle('active', a.dataset.page === page);
  });

  // Update hash
  if (location.hash !== `#${page}`) {
    history.pushState(null, '', `#${page}`);
  }

  // Load page data
  loadPage(page);

  // Trigger distortion on page change
  triggerDistortion();
}

function loadPage(page) {
  switch (page) {
    case 'home':
      renderHome();
      break;
    case 'characters':
      renderCharacters();
      break;
    case 'games':
      renderGames();
      break;
    case 'books':
      renderBooks();
      break;
    case 'series':
      renderSeries();
      break;
    case 'history':
      renderHistory();
      break;
    case 'music':
      renderMusic();
      break;
    case 'blog':
      renderBlog();
      break;
  }
}

// =============================================
// VHS DISTORTION EFFECT
// =============================================
function triggerDistortion() {
  const el = $('#vhs-distortion');
  el.classList.remove('active');
  void el.offsetWidth;
  el.classList.add('active');
  setTimeout(() => el.classList.remove('active'), 500);
}

// =============================================
// HOME
// =============================================
function renderHome() {
  // Stats
  $('#stat-characters').textContent = String(characters.length).padStart(3, '0');
  $('#stat-games').textContent = String(games.length).padStart(2, '0');
  $('#stat-incidents').textContent = '06';
  $('#stat-archives').textContent = String(stories.length + 50).padStart(3, '0');

  // Timeline
  renderTimelineHome();

  // Recent stories
  renderRecentStories();
}

function renderTimelineHome() {
  const container = $('#timeline-home');
  const sorted = [...timeline].sort((a, b) => {
    const ay = parseInt(a.year) || 0;
    const by = parseInt(b.year) || 0;
    return by - ay;
  }).slice(0, 6);

  container.innerHTML = sorted.map((item, i) => {
    const side = i % 2 === 0 ? '' : '';
    return `
      <div class="timeline-item" style="${i % 2 === 0 ? '' : 'margin-left:50%;'}">
        <div class="timeline-dot" style="${i % 2 === 0 ? 'left:-6px;' : 'right:-6px;'}"></div>
        <div class="timeline-content">
          <div class="timeline-year">${item.year}</div>
          <h4 style="color:#E6B800;margin:5px 0;font-family:'Share Tech Mono',monospace;">${item.title}</h4>
          <p style="color:#888;font-size:11px;">${item.description}</p>
          <span style="font-size:8px;color:#555;font-family:'Press Start 2P',monospace;margin-top:5px;display:inline-block;">${item.category}</span>
        </div>
      </div>
    `;
  }).join('');
}

function renderRecentStories() {
  const container = $('#recent-stories');
  const recent = stories.slice(0, 4);

  container.innerHTML = recent.map(entry => `
    <div class="terminal-entry">
      <div class="entry-date">> ${entry.date} <span class="entry-tag">[${entry.tags[0] || 'ARCHIVE'}]</span></div>
      <div class="entry-title">${entry.title}</div>
      <div class="entry-body">
        ${entry.content.slice(0, 2).join(' ')}
      </div>
    </div>
  `).join('');
}

// =============================================
// CHARACTERS
// =============================================
function renderCharacters(filter = state.currentFilter, search = state.characterSearch) {
  const grid = $('#characters-grid');
  let filtered = [...characters];

  if (filter !== 'all') {
    filtered = filtered.filter(c => c.category === filter);
  }

  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(c =>
      c.name.toLowerCase().includes(s) ||
      c.alias.toLowerCase().includes(s) ||
      c.description.toLowerCase().includes(s)
    );
  }

  grid.innerHTML = filtered.map(char => {
    const imgUrl = getImageUrl('characters', char.id);
    const status = (char.status || 'UNKNOWN').toLowerCase();
    const threat = char.threatLevel || 'Medium';
    const threatPct = getThreatPercent(threat);
    const threatColor = getThreatColor(threat);
    return `
    <div class="character-card" onclick="showCharacterModal('${char.id}')">
      <div class="char-image">
        ${imgUrl ? `<img src="${imgUrl}" alt="${char.name}" class="char-img" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" loading="lazy">` : ''}
        <div class="char-img-fallback" style="display:${imgUrl ? 'none' : 'flex'}">
          <div class="char-fallback-letter">${char.name.charAt(0)}</div>
        </div>
        <div class="char-image-overlay"></div>
      </div>
      <div class="char-classified">ANIMATRONIC</div>
      <div class="char-threat ${getThreatClass(threat)}">${threat.toUpperCase()}</div>
      <div class="char-info">
        <div class="char-name">${char.name}</div>
        <div class="char-alias">${char.alias || ''}</div>
        <div class="char-meta">
          <span class="status-${status}">${status.toUpperCase()}</span>
          <span>${(char.category || '').toUpperCase()}</span>
        </div>
        <div class="char-desc">${(char.description || '').slice(0, 120)}${(char.description || '').length > 120 ? '...' : ''}</div>
        <div class="char-threat-bar">
          <div class="threat-fill" style="width:${threatPct}%;background:${threatColor};"></div>
        </div>
      </div>
    </div>
  `}).join('');
}

function getThreatClass(level) {
  switch(level.toLowerCase()) {
    case 'low': return 'low';
    case 'medium': return 'medium';
    case 'high': return 'high';
    case 'critical': return 'critical';
    default: return 'medium';
  }
}

function getThreatPercent(level) {
  switch((level || '').toLowerCase()) {
    case 'critical': return 95;
    case 'high': return 75;
    case 'medium': return 50;
    case 'low': return 25;
    default: return 50;
  }
}

function getThreatColor(level) {
  switch((level || '').toLowerCase()) {
    case 'critical': return '#FF2222';
    case 'high': return '#FF6600';
    case 'medium': return '#E6B800';
    case 'low': return '#00FF66';
    default: return '#E6B800';
  }
}

function initCharacterFilters() {
  const searchInput = $('#character-search');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    state.characterSearch = e.target.value;
    renderCharacters(state.currentFilter, state.characterSearch);
  });

  $$('#character-filters .filter-tag').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('#character-filters .filter-tag').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.currentFilter = btn.dataset.filter;
      renderCharacters(state.currentFilter, state.characterSearch);
    });
  });
}

// =============================================
// GAMES
// =============================================
function renderGames(search = state.gamesSearch) {
  const grid = $('#games-grid');
  let filtered = [...games];

  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(g =>
      g.title.toLowerCase().includes(s) ||
      g.description.toLowerCase().includes(s)
    );
  }

  const statusLabels = ['REC', 'LIVE', 'SIGNAL', 'MONITOR', 'CAM', 'VIEW'];

  grid.innerHTML = filtered.map((game, i) => {
    const imgUrl = getImageUrl('games', game.id);
    const order = games.indexOf(game) + 1;
    const camId = `CAM-${String(order).padStart(2, '0')}`;
    const status = statusLabels[i % statusLabels.length];
    const power = Math.floor(Math.random() * 35 + 10);
    const powerClass = power < 25 ? 'low' : '';

    return `
    <div class="game-card" data-game="${game.id}" onclick="handleGameClick(this, '${game.id}')">
      <div class="cam-corners"></div>
      <div class="cam-ready"></div>
      <div class="static-overlay"></div>
      <div class="cam-scan-line"></div>

      <div class="cam-indicator">
        <span class="rec-dot"></span>
        <span>${status}</span>
      </div>

      <div class="cam-status">● SYSTEM ACTIVE</div>

      <div class="game-year-badge">${game.year}</div>
      <div class="cam-label">${camId} • ${game.platform.split(',')[0].trim()}</div>

      <div class="power-indicator ${powerClass}">⚡ ${power}% POWER</div>

      <div class="game-content">
        ${imgUrl ? `<img src="${imgUrl}" alt="${game.title}" class="game-img" loading="lazy" onerror="this.style.display='none'">` : ''}
        <div class="game-title">${game.title}</div>
        <div class="game-meta">
          <span>${game.developer}</span>
          <span>${game.year}</span>
        </div>
        <div class="game-desc">${game.description.slice(0, 150)}...</div>
        <div class="game-neon-line"></div>
      </div>
    </div>
  `}).join('');

  // Search listener (one-time attach)
  const searchInput = $('#games-search');
  if (searchInput && !searchInput._gamesListener) {
    searchInput._gamesListener = true;
    searchInput.addEventListener('input', (e) => {
      state.gamesSearch = e.target.value;
      renderGames(state.gamesSearch);
    });
  }
}

window.handleGameClick = function(element, gameId) {
  element.classList.add('jumpscare');
  triggerDistortion();
  setTimeout(() => {
    element.classList.remove('jumpscare');
    showGameModal(gameId);
  }, 550);
};

// =============================================
// BOOKS
// =============================================
function renderBooks(search = state.booksSearch) {
  const grid = $('#books-grid');
  let filtered = [...books];

  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(b =>
      b.title.toLowerCase().includes(s) ||
      b.author.toLowerCase().includes(s)
    );
  }

  const statusLabels = ['DOC', 'FILE', 'CASE', 'ARCHIVE', 'LOG', 'DATA'];

  grid.innerHTML = filtered.map((book, i) => {
    const imgUrl = getImageUrl('books', book.id);
    const order = books.indexOf(book) + 1;
    const fileId = `FILE-${String(order).padStart(2, '0')}`;
    const status = statusLabels[i % statusLabels.length];
    const pages = Math.floor(Math.random() * 200 + 100);

    return `
    <div class="book-card" onclick="handleBookClick(this, '${book.id}')">
      <div class="cam-corners"></div>
      <div class="static-overlay"></div>
      <div class="cam-scan-line"></div>

      <div class="cam-indicator">
        <span class="rec-dot"></span>
        <span>${status}</span>
      </div>

      <div class="cam-label">${fileId} • ${book.type}</div>

      <div class="book-year-badge">${book.year}</div>

      <div class="power-indicator">📄 ${pages} PAGES</div>

      <div class="book-content">
        ${imgUrl ? `<img src="${imgUrl}" alt="${book.title}" class="book-img" loading="lazy" onerror="this.style.display='none'">` : ''}
        <div class="book-title">${book.title}</div>
        <div class="book-meta">
          <span>${book.author.split(' y ')[0]}</span>
          <span>${book.series}</span>
        </div>
        <div class="book-desc">${book.description.slice(0, 150)}...</div>
        <div class="book-neon-line"></div>
        ${book.buyUrl ? `<a href="${book.buyUrl}" target="_blank" class="book-buy-btn" onclick="event.stopPropagation()" title="Comprar en Amazon">COMPRAR</a>` : ''}
      </div>
    </div>
  `}).join('');

  const searchInput = $('#books-search');
  if (searchInput && !searchInput._booksListener) {
    searchInput._booksListener = true;
    searchInput.addEventListener('input', (e) => {
      state.booksSearch = e.target.value;
      renderBooks(state.booksSearch);
    });
  }
}

window.handleBookClick = function(element, bookId) {
  element.classList.add('jumpscare');
  triggerDistortion();
  setTimeout(() => {
    element.classList.remove('jumpscare');
    showBookModal(bookId);
  }, 550);
};

// =============================================
// SERIES
// =============================================
function renderSeries() {
  const grid = $('#series-grid');
  const seriesData = [
    { id: 'fnaf-1', title: 'FNaF 1', year: '2014' },
    { id: 'fnaf-2', title: 'FNaF 2', year: '2014' },
    { id: 'fnaf-3', title: 'FNaF 3', year: '2015' },
    { id: 'fnaf-4', title: 'FNaF 4', year: '2015' },
    { id: 'fnaf-sl', title: 'Sister Location', year: '2016' },
    { id: 'fnaf-ps', title: 'Pizzeria Simulator', year: '2017' },
    { id: 'fnaf-ucn', title: 'Ultimate Custom Night', year: '2018' },
    { id: 'fnaf-vr', title: 'Help Wanted', year: '2019' },
    { id: 'fnaf-sb', title: 'Security Breach', year: '2021' },
    { id: 'fnaf-hw2', title: 'Help Wanted 2', year: '2023' },
    { id: 'fnaf-movie', title: 'La Película', year: '2023' },
    { id: 'fnaf-sotm', title: 'Secret of the Mimic', year: '2026' },
  ];

  grid.innerHTML = seriesData.map(s => `
    <div class="vhs-tape" onclick="navigateTo('games')">
      <div class="vhs-spine">
        <div style="font-family:'Press Start 2P',monospace;font-size:24px;color:#333;letter-spacing:3px;">◆</div>
      </div>
      <div class="vhs-label">${s.title} (${s.year})</div>
    </div>
  `).join('');
}

// =============================================
// HISTORY
// =============================================
function renderHistory() {
  const container = $('#timeline-full');
  const sorted = [...timeline].sort((a, b) => {
    const ay = parseInt(a.year) || 0;
    const by = parseInt(b.year) || 0;
    return ay - by;
  });

  container.innerHTML = sorted.map((item, i) => {
    return `
      <div class="timeline-item" style="${i % 2 === 0 ? '' : 'margin-left:50%;'}">
        <div class="timeline-dot" style="${i % 2 === 0 ? 'left:-6px;' : 'right:-6px;'}"></div>
        <div class="timeline-content">
          <div class="timeline-year">${item.year}</div>
          <h4 style="color:#E6B800;margin:5px 0;font-family:'Share Tech Mono',monospace;">${item.title}</h4>
          <p style="color:#888;font-size:11px;">${item.description}</p>
          <span style="font-size:8px;color:#555;font-family:'Press Start 2P',monospace;margin-top:5px;display:inline-block;">${item.category}</span>
        </div>
      </div>
    `;
  }).join('');
}

// =============================================
// TABS
// =============================================
function initTabs() {
  $$('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('.tabs');
      $$('.tab-btn', parent).forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const tab = btn.dataset.tab;
      const content = parent.parentElement;
      $$('.tab-content', content).forEach(c => c.classList.remove('active'));
      const target = $(`#tab-${tab}`, content);
      if (target) target.classList.add('active');
    });
  });
}

// =============================================
// ADMIN NAV
// =============================================
function initAdminNav() {
  $$('.admin-sidebar a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      $$('.admin-sidebar a').forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      const section = link.dataset.admin;
      $$('#admin-main > div').forEach(d => d.style.display = 'none');
      const target = $(`#admin-${section}`);
      if (target) target.style.display = 'block';
    });
  });
}

// =============================================
// MUSIC PLAYER
// =============================================
function initMusicPlayer() {
  const playBtn = $('#play-btn');
  const stopBtn = $('#stop-btn');
  const reel = $('#tape-reel');
  const info = $('#tape-info');
  const bars = $$('#audio-visualizer .bar');
  const volumeBtn = $('#volume-btn');

  let isPlaying = false;

  playBtn.addEventListener('click', () => {
    isPlaying = !isPlaying;
    if (isPlaying) {
      reel.classList.add('playing');
      playBtn.classList.add('playing');
      playBtn.textContent = '❚❚';
      info.textContent = 'STATUS: REPRODUCIENDO — CINTA #001';

      // Animate bars
      bars.forEach((bar, i) => {
        bar.classList.add('active');
        bar.style.animationDelay = `${i * 0.1}s`;
      });

      // Generate static audio
      if (state.soundEnabled) {
        playStaticAudio();
      }
    } else {
      reel.classList.remove('playing');
      playBtn.classList.remove('playing');
      playBtn.textContent = '▶';
      info.textContent = 'STATUS: PAUSADO';
      bars.forEach(bar => {
        bar.classList.remove('active');
        bar.style.height = '5px';
      });
      stopStaticAudio();
    }
  });

  stopBtn.addEventListener('click', () => {
    isPlaying = false;
    reel.classList.remove('playing');
    playBtn.classList.remove('playing');
    playBtn.textContent = '▶';
    info.textContent = 'STATUS: DETENIDO';
    bars.forEach(bar => {
      bar.classList.remove('active');
      bar.style.height = '5px';
    });
    stopStaticAudio();
  });

  volumeBtn.addEventListener('click', () => {
    state.soundEnabled = !state.soundEnabled;
    volumeBtn.style.color = state.soundEnabled ? '#00FF66' : '#666';
    info.textContent = state.soundEnabled
      ? 'STATUS: SONIDO ACTIVADO'
      : 'STATUS: SONIDO DESACTIVADO';

    if (!state.soundEnabled) {
      stopStaticAudio();
    }
  });
}

let audioSource = null;
let audioGain = null;
let audioNode = null;

function playStaticAudio() {
  try {
    if (!state.audioContext) {
      state.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    const ctx = state.audioContext;
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.05;
    }

    audioSource = ctx.createBufferSource();
    audioSource.buffer = buffer;
    audioSource.loop = true;

    audioGain = ctx.createGain();
    audioGain.gain.value = 0.03;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;

    audioSource.connect(filter);
    filter.connect(audioGain);
    audioGain.connect(ctx.destination);
    audioSource.start();
  } catch (e) {
    // Silent fail
  }
}

function stopStaticAudio() {
  if (audioSource) {
    try { audioSource.stop(); } catch (e) {}
    audioSource = null;
  }
}

function renderMusic() {
  const list = $('#music-list');
  const tracks = [
    'CINTA #001 — ARCHIVO CENTRAL',
    'CINTA #002 — RUIDO AMBIENTAL',
    'CINTA #003 — FREDDY FAZBEAR\'S PIZZA',
    'CINTA #004 — TRANSMISIÓN DESCONOCIDA',
    'CINTA #005 — MENSAJE INTERCEPTADO',
    'CINTA #006 — REGISTRO DE SEGURIDAD',
    'CINTA #007 — CINTA DAÑADA',
    'CINTA #008 — SEÑAL RECUPERADA',
  ];

  list.innerHTML = tracks.map((track, i) => `
    <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #1C1C1C;font-size:11px;color:#888;cursor:pointer;transition:color 0.3s;"
         onmouseover="this.style.color='#00FF66'" onmouseout="this.style.color='#888'">
      <span>${track}</span>
      <span style="color:#444;">${String(i + 1).padStart(2, '0')}:00</span>
    </div>
  `).join('');
}

// =============================================
// BLOG
// =============================================
function renderBlog() {
  const container = $('#blog-entries');

  container.innerHTML = stories.map(entry => `
    <div class="terminal-entry">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div class="entry-date">> ${entry.date}</div>
        <div>
          ${entry.tags.map(t => `<span class="entry-tag" style="margin-left:5px;">[${t}]</span>`).join('')}
        </div>
      </div>
      <div class="entry-title">${entry.title}</div>
      <div class="entry-body">
        ${entry.content.map(p => `<p>${p}</p>`).join('')}
      </div>
    </div>
  `).join('');
}

// =============================================
// MODAL
// =============================================
function initModal() {
  const modal = $('#modal');
  const closeBtn = $('#modal-close');

  closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
}

window._currentGallery = [];

window.showCharacterModal = (id) => {
  const char = characters.find(c => c.id === id);
  if (!char) return;

  window._currentGallery = getImageGallery('characters', id);
  const imgUrl = getImageUrl('characters', id);

  const related = characters.filter(c =>
    c.id !== char.id &&
    (c.category === char.category || c.firstAppearance === char.firstAppearance)
  ).slice(0, 6);

  const status = (char.status || 'UNKNOWN').toUpperCase();
  const category = (char.category || '').toUpperCase();
  const threat = char.threatLevel || 'Medium';
  const threatColor = getThreatColor(threat);
  const threatPct = getThreatPercent(threat);
  const alias = char.alias || '';
  const origin = char.origin || '';
  const firstApp = char.firstAppearance || '';
  const description = char.description || '';
  const history = char.history || '';
  const behavior = char.behavior || '';
  const appearances = char.appearances || [];
  const relationships = char.relationships || [];
  const trivia = char.trivia || [];

  const body = $('#modal-body');
  body.innerHTML = `
    <div class="char-modal">

      <div class="char-modal__hero">
        <div class="char-modal__hero-left">
          <div class="char-modal__img-frame">
            ${imgUrl ? `<img src="${imgUrl}" alt="${char.name}" class="char-modal__img" onerror="this.parentElement.innerHTML='<div class=\\'char-modal__img-fallback\\'>${char.name.charAt(0)}</div>'">` : `<div class="char-modal__img-fallback">${char.name.charAt(0)}</div>`}
            <div class="char-modal__scanlines"></div>
            <div class="char-modal__corners"></div>
          </div>
          ${window._currentGallery.length > 1 ? `
            <div class="char-modal__gallery">
              <div class="char-modal__thumbs" id="char-thumbs">
                ${window._currentGallery.map((url, i) => `
                  <div class="char-modal__thumb ${i === 0 ? 'active' : ''}" data-idx="${i}" onclick="window._switchCharImg(this, ${i})">
                    <img src="${url}" alt="Thumb ${i+1}">
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>

        <div class="char-modal__hero-right">
          <div class="char-modal__tags">
            <span class="char-modal__tag char-modal__tag--status">${status}</span>
            <span class="char-modal__tag char-modal__tag--category">${category}</span>
            <span class="char-modal__tag char-modal__tag--threat" style="color:${threatColor};border-color:${threatColor};">${threat.toUpperCase()}</span>
          </div>

          <h2 class="char-modal__title">${char.name}</h2>
          <div class="char-modal__subtitle">${alias}</div>

          <div class="char-modal__info-grid">
            <div class="char-modal__info-item">
              <div class="char-modal__info-label">PRIMERA APARICION</div>
              <div class="char-modal__info-value">${firstApp}</div>
            </div>
            <div class="char-modal__info-item">
              <div class="char-modal__info-label">PROCEDENCIA</div>
              <div class="char-modal__info-value">${origin}</div>
            </div>
            <div class="char-modal__info-item">
              <div class="char-modal__info-label">CATEGORIA</div>
              <div class="char-modal__info-value">${category}</div>
            </div>
            <div class="char-modal__info-item">
              <div class="char-modal__info-label">NIVEL DE AMENAZA</div>
              <div class="char-modal__info-value" style="color:${threatColor};">
                <div class="char-modal__threat-bar">
                  <div class="char-modal__threat-fill" style="width:${threatPct}%;background:${threatColor};"></div>
                </div>
                ${char.threatLevel.toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="char-modal__section">
        <div class="char-modal__section-title">
          <span class="char-modal__section-icon">&#9679;</span> INFORMACION GENERAL
        </div>
        <div class="char-modal__section-content">
          <p>${description}</p>
        </div>
      </div>

      <div class="char-modal__section">
        <div class="char-modal__section-title">
          <span class="char-modal__section-icon">&#9679;</span> HISTORIA
        </div>
        <div class="char-modal__section-content">
          <p>${history}</p>
        </div>
      </div>

      <div class="char-modal__section">
        <div class="char-modal__section-title">
          <span class="char-modal__section-icon">&#9679;</span> COMPORTAMIENTO
        </div>
        <div class="char-modal__section-content">
          <p>${behavior}</p>
        </div>
      </div>

      <div class="char-modal__section">
        <div class="char-modal__section-title">
          <span class="char-modal__section-icon">&#9679;</span> APARICIONES
        </div>
        <div class="char-modal__tags-row">
          ${appearances.map(a => `<span class="char-modal__appear-tag">${a}</span>`).join('')}
        </div>
      </div>

      ${relationships.length > 0 ? `
        <div class="char-modal__section">
          <div class="char-modal__section-title">
            <span class="char-modal__section-icon">&#9679;</span> PERSONAJES RELACIONADOS
          </div>
          <div class="char-modal__related-grid">
            ${relationships.map(r => {
              const relChar = characters.find(c => c.name.toLowerCase() === r.name.toLowerCase());
              const relImg = relChar ? getImageUrl('characters', relChar.id) : '';
              const relId = relChar ? relChar.id : '';
              return `
                <div class="char-modal__related-card" ${relId ? `onclick="window.showCharacterModal('${relId}')"` : ''}>
                  <div class="char-modal__related-img">
                    ${relImg ? `<img src="${relImg}" alt="${r.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">` : ''}
                    <div class="char-modal__related-fallback" style="${relImg ? 'display:none' : ''}">${r.name.charAt(0)}</div>
                  </div>
                  <div class="char-modal__related-name">${r.name}</div>
                  <div class="char-modal__related-relation">${r.relation}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      ` : ''}

      ${related.length > 0 ? `
        <div class="char-modal__section">
          <div class="char-modal__section-title">
            <span class="char-modal__section-icon">&#9679;</span> OTROS DE LA MISMA CATEGORIA
          </div>
          <div class="char-modal__related-grid">
            ${related.map(c => {
              const rImg = getImageUrl('characters', c.id);
              return `
                <div class="char-modal__related-card" onclick="window.showCharacterModal('${c.id}')">
                  <div class="char-modal__related-img">
                    ${rImg ? `<img src="${rImg}" alt="${c.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">` : ''}
                    <div class="char-modal__related-fallback" style="${rImg ? 'display:none' : ''}">${c.name.charAt(0)}</div>
                  </div>
                  <div class="char-modal__related-name">${c.name}</div>
                  <div class="char-modal__related-relation">${c.category}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      ` : ''}

      ${trivia.length > 0 ? `
        <div class="char-modal__section">
          <div class="char-modal__section-title">
            <span class="char-modal__section-icon">&#9679;</span> DATOS DE ARCHIVO
          </div>
          <div class="char-modal__section-content">
            <ul class="char-modal__trivia-list">
              ${trivia.map(t => `<li>${t}</li>`).join('')}
            </ul>
          </div>
        </div>
      ` : ''}

      <div class="char-modal__footer">
        <span>ARCHIVO CENTRAL — FAZBEAR ENTERTAINMENT</span>
        <span>CASO #${id.toUpperCase().replace(/-/g, '')}</span>
      </div>
    </div>
  `;

  state.galleryIndex = 0;
  $('#modal').classList.add('active');
};

window._switchCharImg = (el, idx) => {
  const g = window._currentGallery;
  if (!g || !g[idx]) return;
  state.galleryIndex = idx;
  const wrapper = document.querySelector('.char-modal__img-frame');
  if (wrapper) {
    const img = wrapper.querySelector('img');
    if (img) img.src = g[idx];
  }
  document.querySelectorAll('.char-modal__thumb').forEach((t, i) => t.classList.toggle('active', i === idx));
};

window.showGalleryImage = (index) => {
  const g = window._currentGallery;
  if (!g || !g[index]) return;
  state.galleryIndex = index;
  const wrapper = document.querySelector('.modal-image-wrapper');
  if (wrapper) {
    const img = wrapper.querySelector('img');
    if (img) img.src = g[index];
  }
  document.querySelectorAll('.gallery-thumb').forEach((t, i) => t.classList.toggle('active', i === index));
  const counter = document.querySelector('#gallery-counter');
  if (counter) counter.textContent = `${index + 1} / ${g.length}`;
};

window.galleryNav = (dir) => {
  const g = window._currentGallery;
  if (!g || g.length === 0) return;
  state.galleryIndex = (state.galleryIndex + dir + g.length) % g.length;
  showGalleryImage(state.galleryIndex);
};

window.showGameModal = (id) => {
  const game = games.find(g => g.id === id);
  if (!game) return;

  const imgs = getImageGallery('games', id);
  const mainImg = imgs.length > 0 ? imgs[0] : getImageUrl('games', id);

  const platformIcons = {
    windows: '🖥', ios: '📱', android: '🤖', console: '🎮',
    playstation: '🎮', xbox: '🎮', switch: '🎮', vr: '🥽'
  };
  const platformLabels = {
    windows: 'PC', ios: 'iOS', android: 'Android', console: 'Consolas',
    playstation: 'PlayStation', xbox: 'Xbox', switch: 'Switch', vr: 'VR'
  };

  const body = $('#modal-body');
  body.innerHTML = `
    <div class="game-modal game-modal--${id}">

      <div class="game-modal__hero">
        <div class="game-modal__hero-left">
          <div class="game-modal__img-frame">
            ${mainImg ? `<img src="${mainImg}" alt="${game.title}" class="game-modal__img" onerror="this.parentElement.innerHTML='<div class=\\'game-modal__img-fallback\\'>${game.title.charAt(0)}</div>'">` : `<div class="game-modal__img-fallback">${game.title.charAt(0)}</div>`}
            <div class="game-modal__scanlines"></div>
            <div class="game-modal__corners"></div>
          </div>
          ${imgs.length > 1 ? `
            <div class="game-modal__gallery">
              <div class="game-modal__thumbs" id="game-thumbs">
                ${imgs.map((url, i) => `
                  <div class="game-modal__thumb ${i === 0 ? 'active' : ''}" data-idx="${i}" onclick="window._switchGameImg(this, ${i})">
                    <img src="${url}" alt="Thumb ${i+1}">
                  </div>
                `).join('')}
              </div>
              <div class="game-modal__gallery-nav">
                <button class="game-modal__nav-btn" onclick="window._navGameGallery(-1)">◂ ANTERIOR</button>
                <span class="game-modal__gallery-count"><span id="game-thumb-idx">1</span> / ${imgs.length}</span>
                <button class="game-modal__nav-btn" onclick="window._navGameGallery(1)">SIGUIENTE ▸</button>
              </div>
            </div>
          ` : ''}
        </div>

        <div class="game-modal__hero-right">
          <div class="game-modal__tags">
            ${game.platforms ? game.platforms.map(p => `<span class="game-modal__tag game-modal__tag--platform">${platformLabels[p] || p}</span>`).join('') : `<span class="game-modal__tag game-modal__tag--platform">${game.platform.split(',')[0].trim()}</span>`}
            <span class="game-modal__tag game-modal__tag--year">${game.year}</span>
          </div>

          <h2 class="game-modal__title">${game.title}</h2>
          <div class="game-modal__subtitle">${game.developer} — ${game.publisher}</div>

          <div class="game-modal__meta-row">
            <span class="game-modal__meta-badge">ORIGINAL</span>
            <span class="game-modal__meta-badge game-modal__meta-badge--accent">${game.title}</span>
          </div>

          <div class="game-modal__threat">
            <div class="game-modal__threat-label">PLATAFORMAS</div>
            <div class="game-modal__threat-bar">
              <div class="game-modal__threat-fill" style="width: ${Math.min(game.platforms ? game.platforms.length * 25 : 50, 100)}%"></div>
            </div>
            <div class="game-modal__threat-text">${game.platform}</div>
          </div>

          ${game.steamUrl ? `
            <a href="${game.steamUrl}" target="_blank" rel="noopener noreferrer" class="game-modal__steam-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
              COMPRAR EN STEAM
            </a>
          ` : ''}
        </div>
      </div>

      <div class="game-modal__divider"></div>

      <div class="game-modal__section">
        <div class="game-modal__section-header" data-text="INFORMACION GENERAL">
          <span class="game-modal__section-dot"></span> INFORMACION GENERAL
        </div>
        <div class="game-modal__info-grid">
          <div class="game-modal__info-cell">
            <div class="game-modal__info-label">TITULO</div>
            <div class="game-modal__info-value">${game.title}</div>
          </div>
          <div class="game-modal__info-cell">
            <div class="game-modal__info-label">ANIO DE LANZAMIENTO</div>
            <div class="game-modal__info-value">${game.year}</div>
          </div>
          <div class="game-modal__info-cell">
            <div class="game-modal__info-label">DESARROLLADOR</div>
            <div class="game-modal__info-value">${game.developer}</div>
          </div>
          <div class="game-modal__info-cell">
            <div class="game-modal__info-label">PUBLICADOR</div>
            <div class="game-modal__info-value">${game.publisher}</div>
          </div>
          <div class="game-modal__info-cell game-modal__info-cell--full">
            <div class="game-modal__info-label">PLATAFORMAS</div>
            <div class="game-modal__info-value">${game.platform}</div>
          </div>
        </div>
      </div>

      <div class="game-modal__section">
        <div class="game-modal__section-header" data-text="DESCRIPCION">
          <span class="game-modal__section-dot"></span> DESCRIPCION
        </div>
        <div class="game-modal__desc-full game-modal__desc-glitch">
          <p>${game.description}</p>
        </div>
      </div>

      <div class="game-modal__section">
        <div class="game-modal__section-header" data-text="MECANICAS">
          <span class="game-modal__section-dot"></span> MECANICAS
        </div>
        <div class="game-modal__tags game-modal__tags--wrap">
          ${game.mechanics.map(m => `<span class="game-modal__tag">${m}</span>`).join('')}
        </div>
      </div>

      <div class="game-modal__section">
        <div class="game-modal__section-header" data-text="PERSONAJES PRINCIPALES">
          <span class="game-modal__section-dot"></span> PERSONAJES PRINCIPALES
        </div>
        <div class="game-modal__chars-grid">
          ${game.characters.slice(0, 12).map(c => {
            const slug = c.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
            const charImg = getImageUrl('characters', slug);
            return `
              <div class="game-modal__char-card">
                <div class="game-modal__char-avatar">
                  ${charImg ? `<img src="${charImg}" alt="${c}" loading="lazy">` : `<span class="char-fallback">${c.charAt(0)}</span>`}
                </div>
                <div class="game-modal__char-name">${c}</div>
              </div>
            `;
          }).join('')}
        </div>
        ${game.characters.length > 12 ? `<div class="game-modal__more-chars">+${game.characters.length - 12} personajes mas</div>` : ''}
      </div>

      <div class="game-modal__section">
        <div class="game-modal__section-header" data-text="CONEXIONES">
          <span class="game-modal__section-dot"></span> CONEXIONES
        </div>
        <ul class="game-modal__list">
          ${game.connections.map(c => `<li class="game-modal__list-item">${c}</li>`).join('')}
        </ul>
      </div>

      ${game.trivia.length > 0 ? `
        <div class="game-modal__section">
          <div class="game-modal__section-header" data-text="DATOS DE ARCHIVO / CURIOSIDADES">
            <span class="game-modal__section-dot"></span> DATOS DE ARCHIVO / CURIOSIDADES
          </div>
          <ul class="game-modal__list">
            ${game.trivia.map(t => `<li class="game-modal__list-item">${t}</li>`).join('')}
          </ul>
        </div>
      ` : ''}

      <div class="game-modal__footer">
        <span>FAZBEAR ENTERTAINMENT — DOCUMENTACION INTERNA</span>
        <span>SOLO PERSONAL AUTORIZADO — DIFUSION LIMITADA</span>
      </div>
    </div>
  `;

  const mc = body.closest('.modal-content') || body.parentElement;
  if (mc) mc.setAttribute('data-game-modal', id);

  window._gameGalleryIdx = 0;
  window._gameGalleryImgs = imgs;

  $('#modal').classList.add('active');
};

window._switchGameImg = function(el, idx) {
  const mainImg = document.querySelector('.game-modal__img');
  if (!mainImg || !window._gameGalleryImgs || !window._gameGalleryImgs[idx]) return;
  mainImg.src = window._gameGalleryImgs[idx];
  document.querySelectorAll('.game-modal__thumb').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  const idxEl = document.getElementById('game-thumb-idx');
  if (idxEl) idxEl.textContent = idx + 1;
  window._gameGalleryIdx = idx;
};

window._navGameGallery = function(dir) {
  if (!window._gameGalleryImgs || window._gameGalleryImgs.length < 2) return;
  let newIdx = window._gameGalleryIdx + dir;
  if (newIdx < 0) newIdx = window._gameGalleryImgs.length - 1;
  if (newIdx >= window._gameGalleryImgs.length) newIdx = 0;
  const thumbs = document.querySelectorAll('.game-modal__thumb');
  if (thumbs[newIdx]) window._switchGameImg(thumbs[newIdx], newIdx);
};

window.showBookModal = (id) => {
  const book = books.find(b => b.id === id);
  if (!book) return;

  const imgs = getImageGallery('books', id);
  const mainImg = imgs.length > 0 ? imgs[0] : getImageUrl('books', id);

  const body = $('#modal-body');
  body.innerHTML = `
    <div class="game-modal game-modal--books">

      <div class="game-modal__hero">
        <div class="game-modal__hero-left">
          <div class="game-modal__img-frame">
            ${mainImg ? `<img src="${mainImg}" alt="${book.title}" class="game-modal__img" onerror="this.parentElement.innerHTML='<div class=\\'game-modal__img-fallback\\'>${book.title.charAt(0)}</div>'">` : `<div class="game-modal__img-fallback">${book.title.charAt(0)}</div>`}
            <div class="game-modal__scanlines"></div>
            <div class="game-modal__corners"></div>
          </div>
          ${imgs.length > 1 ? `
            <div class="game-modal__gallery">
              <div class="game-modal__thumbs" id="game-thumbs">
                ${imgs.map((url, i) => `
                  <div class="game-modal__thumb ${i === 0 ? 'active' : ''}" data-idx="${i}" onclick="window._switchGameImg(this, ${i})">
                    <img src="${url}" alt="Thumb ${i+1}">
                  </div>
                `).join('')}
              </div>
              <div class="game-modal__gallery-nav">
                <button class="game-modal__nav-btn" onclick="window._navGameGallery(-1)">◂ ANTERIOR</button>
                <span class="game-modal__gallery-count"><span id="game-thumb-idx">1</span> / ${imgs.length}</span>
                <button class="game-modal__nav-btn" onclick="window._navGameGallery(1)">SIGUIENTE ▸</button>
              </div>
            </div>
          ` : ''}
        </div>

        <div class="game-modal__hero-right">
          <div class="game-modal__tags">
            <span class="game-modal__tag game-modal__tag--platform">${book.type}</span>
            <span class="game-modal__tag game-modal__tag--year">${book.year}</span>
          </div>

          <h2 class="game-modal__title">${book.title}</h2>
          <div class="game-modal__subtitle">${book.author}</div>

          <div class="game-modal__meta-row">
            <span class="game-modal__meta-badge">${book.series}</span>
          </div>

          ${book.buyUrl ? `
            <a href="${book.buyUrl}" target="_blank" rel="noopener noreferrer" class="game-modal__steam-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
              COMPRAR EN AMAZON
            </a>
          ` : ''}
        </div>
      </div>

      <div class="game-modal__divider"></div>

      <div class="game-modal__section">
        <div class="game-modal__section-header" data-text="INFORMACION DEL LIBRO">
          <span class="game-modal__section-dot"></span> INFORMACION DEL LIBRO
        </div>
        <div class="game-modal__info-grid">
          <div class="game-modal__info-cell">
            <div class="game-modal__info-label">TITULO</div>
            <div class="game-modal__info-value">${book.title}</div>
          </div>
          <div class="game-modal__info-cell">
            <div class="game-modal__info-label">AUTOR</div>
            <div class="game-modal__info-value">${book.author}</div>
          </div>
          <div class="game-modal__info-cell">
            <div class="game-modal__info-label">ANIO</div>
            <div class="game-modal__info-value">${book.year}</div>
          </div>
          <div class="game-modal__info-cell">
            <div class="game-modal__info-label">TIPO</div>
            <div class="game-modal__info-value">${book.type}</div>
          </div>
          <div class="game-modal__info-cell game-modal__info-cell--full">
            <div class="game-modal__info-label">DESCRIPCION</div>
            <div class="game-modal__info-value game-modal__info-value--desc">${book.description}</div>
          </div>
        </div>
      </div>

      ${book.characters && book.characters.length > 0 ? `
      <div class="game-modal__divider"></div>
      <div class="game-modal__section">
        <div class="game-modal__section-header" data-text="PERSONAJES">
          <span class="game-modal__section-dot"></span> PERSONAJES
        </div>
        <div class="game-modal__char-grid">
          ${book.characters.slice(0, 20).map(c => `
            <div class="game-modal__char-card">
              <div class="game-modal__char-avatar">${c.charAt(0)}</div>
              <div class="game-modal__char-name">${c}</div>
            </div>
          `).join('')}
        </div>
      </div>
      ` : ''}

      <div class="game-modal__divider"></div>
      <div class="game-modal__section">
        <div class="game-modal__section-header" data-text="CONEXIONES">
          <span class="game-modal__section-dot"></span> CONEXIONES
        </div>
        <ul style="list-style:none;">
          ${book.connections.map(c => `<li style="font-size:11px;color:#888;margin-bottom:8px;font-family:'IBM Plex Mono',monospace;">▸ ${c}</li>`).join('')}
        </ul>
      </div>

      ${book.trivia && book.trivia.length > 0 ? `
      <div class="game-modal__divider"></div>
      <div class="game-modal__section">
        <div class="game-modal__section-header" data-text="DATOS DE ARCHIVO">
          <span class="game-modal__section-dot"></span> DATOS DE ARCHIVO
        </div>
        <ul style="list-style:none;">
          ${book.trivia.map(t => `<li style="font-size:11px;color:#888;margin-bottom:8px;font-family:'IBM Plex Mono',monospace;">▸ ${t}</li>`).join('')}
        </ul>
      </div>
      ` : ''}

    </div>
  `;

  const mc = body.closest('.modal-content') || body.parentElement;
  if (mc) mc.setAttribute('data-game-modal', 'books');

  $('#modal').classList.add('active');
};

// =============================================
// STATIC POPUP (admin button)
// =============================================
window.triggerStatic = () => {
  const popup = $('#static-popup');
  popup.classList.add('active');

  // VHS distortion
  triggerDistortion();

  setTimeout(() => {
    popup.classList.remove('active');
  }, 2000);
};

// =============================================
// SOUND TOGGLE
// =============================================
function initSoundToggle() {
  const toggle = $('#sound-toggle');
  if (toggle) {
    toggle.addEventListener('change', (e) => {
      state.soundEnabled = e.target.value === 'on';
      if (!state.soundEnabled) {
        stopStaticAudio();
      }
    });
  }
}

// =============================================
// VHS TOGGLE
// =============================================
function initVhsToggle() {
  const toggle = $('#vhs-toggle');
  if (toggle) {
    toggle.addEventListener('change', (e) => {
      state.vhsEnabled = e.target.value === 'on';
      const overlay = $('#vhs-overlay');
      const crt = $('#crt-overlay');
      if (state.vhsEnabled) {
        overlay.style.display = 'block';
        crt.style.display = 'block';
      } else {
        overlay.style.display = 'none';
        crt.style.display = 'none';
      }
    });
  }
}

// =============================================
// VHS EFFECTS (continuous)
// =============================================
function initVHSEffects() {
  // Random VHS distortion events
  setInterval(() => {
    if (Math.random() < 0.15) {
      triggerDistortion();
    }
  }, 30000);

  // Update audio visualizer when playing
  setInterval(() => {
    if (state.isPlaying) {
      const bars = $$('#audio-visualizer .bar');
      bars.forEach(bar => {
        bar.style.height = `${5 + Math.random() * 35}px`;
      });
    }
  }, 200);
}

// =============================================
// EASTER EGGS
// =============================================
function initEasterEggs() {
  // Golden Freddy random appearance (1% chance every 60 seconds)
  state.goldenTimer = setInterval(() => {
    if (Math.random() < 0.01) {
      showGoldenFreddy();
    }
  }, 60000);

  // Random glitch effect on elements (5% chance every 30 seconds)
  state.glitchTimer = setInterval(() => {
    if (Math.random() < 0.05) {
      const cards = $$('.character-card, .dashboard-card, .game-card');
      if (cards.length > 0) {
        const randomCard = cards[Math.floor(Math.random() * cards.length)];
        randomCard.style.animation = 'glitch 0.3s ease-in-out';
        setTimeout(() => {
          randomCard.style.animation = '';
        }, 500);
      }
    }
  }, 30000);

  // Show notification about "unusual activity"
  setTimeout(() => {
    showNotification('ADVERTENCIA: Se ha detectado actividad inusual en los servidores. Posible acceso no autorizado.');
  }, 15000);

  // Shadow Freddy / Puppet presence effect - millisecond flash
  setInterval(() => {
    if (Math.random() < 0.03) {
      const flash = document.createElement('div');
      flash.className = 'presence-flash';
      flash.textContent = Math.random() < 0.5 ? '?' : '';
      document.body.appendChild(flash);
      setTimeout(() => flash.remove(), 150);
      triggerDistortion();
    }
  }, 45000);

  // Random camera switch effect - dark overlay
  setInterval(() => {
    if (Math.random() < 0.08) {
      const cam = document.createElement('div');
      cam.className = 'camera-scan';
      document.body.appendChild(cam);
      const lines = ['SCANNING...', 'SIGNAL LOST', 'NO SIGNAL', 'STATIC', '▌RECONNECTING▐'];
      cam.textContent = lines[Math.floor(Math.random() * lines.length)];
      setTimeout(() => cam.remove(), 800);
    }
  }, 20000);

  // Springtrap whisper (just text flash)
  setInterval(() => {
    if (Math.random() < 0.04) {
      const whisper = document.createElement('div');
      whisper.className = 'presence-flash';
      whisper.textContent = 'I ALWAYS COME BACK';
      whisper.style.color = '#55AA00';
      whisper.style.fontSize = '10px';
      whisper.style.fontFamily = "'Press Start 2P',monospace";
      document.body.appendChild(whisper);
      setTimeout(() => whisper.remove(), 200);
    }
  }, 60000);
}

function showGoldenFreddy() {
  const egg = $('#golden-egg');
  egg.classList.add('active');
  triggerDistortion();

  setTimeout(() => {
    egg.classList.remove('active');
  }, 3000);
}

function showNotification(message) {
  const el = $('#notification');
  el.textContent = message;
  el.classList.add('show');

  if (state.notificationTimer) clearTimeout(state.notificationTimer);
  state.notificationTimer = setTimeout(() => {
    el.classList.remove('show');
  }, 8000);
}

// =============================================
// KEYBOARD SHORTCUTS
// =============================================
document.addEventListener('keydown', (e) => {
  // Ctrl+Shift+G = Golden Freddy easter egg
  if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'g') {
    showGoldenFreddy();
  }

  // Esc = close modal
  if (e.key === 'Escape') {
    $('#modal').classList.remove('active');
    $('#static-popup').classList.remove('active');
  }

  // 1-9 = navigation
  const navKeys = ['home', 'characters', 'games', 'books', 'series', 'history', 'music', 'blog', 'admin'];
  const num = parseInt(e.key);
  if (num >= 1 && num <= 9) {
    e.preventDefault();
    navigateTo(navKeys[num - 1]);
  }
});

console.log('%c⚠ THE FAZBEAR FILES ⚠', 'font-size:24px;color:#FF2222;font-weight:bold;');
console.log('%cAcceso no autorizado detectado.', 'font-size:14px;color:#00FF66;');
console.log('%cEste sistema contiene material clasificado de Fazbear Entertainment.', 'font-size:12px;color:#888;');
