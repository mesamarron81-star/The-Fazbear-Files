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
      <div class="char-threat ${getThreatClass(char.threatLevel)}">${char.threatLevel.toUpperCase()}</div>
      <div class="char-info">
        <div class="char-name">${char.name}</div>
        <div class="char-alias">${char.alias}</div>
        <div class="char-meta">
          <span class="status-${char.status.toLowerCase()}">${char.status.toUpperCase()}</span>
          <span>${char.category.toUpperCase()}</span>
        </div>
        <div class="char-desc">${char.description}</div>
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

  grid.innerHTML = filtered.map(game => {
    const imgUrl = getImageUrl('games', game.id);
    return `
    <div class="arcade-cabinet" onclick="showGameModal('${game.id}')">
      <div class="arcade-screen">
        ${imgUrl ? `<img src="${imgUrl}" alt="${game.title}" class="game-img" loading="lazy" onerror="this.style.display='none'">` : ''}
        <div class="arcade-title">${game.title}</div>
        <div class="arcade-subtitle">${game.developer}</div>
        <div class="arcade-year">${game.year}</div>
      </div>
      <div style="font-family:'Share Tech Mono',monospace;font-size:10px;color:#888;padding:0 10px;margin-bottom:10px;">
        ${game.description.slice(0, 120)}...
      </div>
    </div>
  `}).join('');

  // Search
  const searchInput = $('#games-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.gamesSearch = e.target.value;
      renderGames(state.gamesSearch);
    });
  }
}

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

  grid.innerHTML = filtered.map(book => {
    const imgUrl = getImageUrl('books', book.id);
    return `
    <div class="book" onclick="showBookModal('${book.id}')">
      <div class="book-spine" ${imgUrl ? `style="background-image:url('${imgUrl}');background-size:cover;background-position:center;"` : ''}>
        ${imgUrl ? `<div class="book-img-overlay"></div>` : `<div style="font-size:40px;opacity:0.2;font-family:'Press Start 2P',monospace;color:#E6B800;">${book.title.charAt(0)}</div>`}
      </div>
      <div class="book-title">${book.title}</div>
      <div class="book-author">${book.author} (${book.year})</div>
    </div>
  `}).join('');

  const searchInput = $('#books-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.booksSearch = e.target.value;
      renderBooks(state.booksSearch);
    });
  }
}

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

  const body = $('#modal-body');
  body.innerHTML = `
    ${imgUrl ? `
    <div class="modal-image-section">
      <div class="modal-image-wrapper">
        <img src="${imgUrl}" alt="${char.name}" class="modal-img" onerror="this.style.display='none'">
        <div class="modal-image-overlay"></div>
      </div>
      ${window._currentGallery.length > 1 ? `
      <div class="modal-gallery" id="modal-gallery">
        <div class="gallery-thumbs">
          ${window._currentGallery.map((u, i) => `
            <img src="${u}" class="gallery-thumb ${i === 0 ? 'active' : ''}" 
                 onclick="showGalleryImage(${i})" loading="lazy"
                 onerror="this.style.display='none'">
          `).join('')}
        </div>
        <div class="gallery-nav">
          <button class="gallery-btn" onclick="galleryNav(-1)">◀</button>
          <span class="gallery-counter" id="gallery-counter">1 / ${window._currentGallery.length}</span>
          <button class="gallery-btn" onclick="galleryNav(1)">▶</button>
        </div>
      </div>` : ''}
    </div>` : ''}

    <div class="doc-stamp restricted" style="position:relative;top:auto;right:auto;transform:none;display:inline-block;margin-bottom:15px;">${char.status.toUpperCase()}</div>
    <div class="doc-header">${char.name}</div>
    <div class="doc-meta">
      <div><span>ALIAS:</span> ${char.alias}</div>
      <div><span>PRIMERA APARICIÓN:</span> ${char.firstAppearance}</div>
      <div><span>ESTADO:</span> ${char.status}</div>
      <div><span>NIVEL DE AMENAZA:</span> <span style="color:${char.threatLevel === 'Critical' ? '#FF2222' : char.threatLevel === 'High' ? '#FF6600' : '#E6B800'}">${char.threatLevel.toUpperCase()}</span></div>
      <div><span>PROCEDENCIA:</span> ${char.origin}</div>
      <div><span>CATEGORÍA:</span> ${char.category}</div>
    </div>
    <div class="doc-body">
      <p>${char.description}</p>
      <p>${char.history}</p>
      <p><strong style="color:#00FF66;">COMPORTAMIENTO:</strong> ${char.behavior}</p>

      <div style="margin:15px 0;padding:10px;border:1px solid #1C1C1C;">
        <div style="font-family:'Press Start 2P',monospace;font-size:8px;color:#00FF66;margin-bottom:10px;">APARICIONES</div>
        <div style="display:flex;flex-wrap:wrap;gap:5px;">
          ${char.appearances.map(a => `<span style="font-size:9px;color:#888;border:1px solid #242424;padding:2px 6px;">${a}</span>`).join('')}
        </div>
      </div>

      <div style="margin:15px 0;padding:10px;border:1px solid #1C1C1C;">
        <div style="font-family:'Press Start 2P',monospace;font-size:8px;color:#00FF66;margin-bottom:10px;">RELACIONES</div>
        ${char.relationships.map(r => `<div style="font-size:11px;color:#888;margin-bottom:3px;"><span style="color:#E6B800;">${r.name}</span> — ${r.relation}</div>`).join('')}
      </div>

      ${char.trivia.length > 0 ? `
        <div style="margin:15px 0;padding:10px;border:1px solid #1C1C1C;">
          <div style="font-family:'Press Start 2P',monospace;font-size:8px;color:#00FF66;margin-bottom:10px;">DATOS DE ARCHIVO</div>
          <ul style="list-style:none;">
            ${char.trivia.map(t => `<li style="font-size:11px;color:#888;margin-bottom:5px;">> ${t}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
    </div>
  `;

  state.galleryIndex = 0;
  $('#modal').classList.add('active');
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

  window._currentGallery = getImageGallery('games', id);
  const imgUrl = getImageUrl('games', id);

  const body = $('#modal-body');
  body.innerHTML = `
    ${imgUrl ? `
    <div class="modal-image-section">
      <div class="modal-image-wrapper">
        <img src="${imgUrl}" alt="${game.title}" class="modal-img" onerror="this.style.display='none'">
        <div class="modal-image-overlay"></div>
      </div>
    </div>` : ''}

    <div class="doc-header" style="font-size:14px;">${game.title}</div>
    <div class="doc-meta">
      <div><span>AÑO:</span> ${game.year}</div>
      <div><span>DESARROLLADOR:</span> ${game.developer}</div>
      <div><span>PUBLICADOR:</span> ${game.publisher}</div>
      <div><span>PLATAFORMA:</span> ${game.platform}</div>
    </div>
    <div class="doc-body">
      <p>${game.description}</p>

      <div style="margin:15px 0;padding:10px;border:1px solid #1C1C1C;">
        <div style="font-family:'Press Start 2P',monospace;font-size:8px;color:#00FF66;margin-bottom:10px;">MECÁNICAS</div>
        <div style="display:flex;flex-wrap:wrap;gap:5px;">
          ${game.mechanics.map(m => `<span style="font-size:9px;color:#888;border:1px solid #242424;padding:2px 6px;">${m}</span>`).join('')}
        </div>
      </div>

      <div style="margin:15px 0;padding:10px;border:1px solid #1C1C1C;">
        <div style="font-family:'Press Start 2P',monospace;font-size:8px;color:#00FF66;margin-bottom:10px;">CONEXIONES</div>
        <ul style="list-style:none;">
          ${game.connections.map(c => `<li style="font-size:11px;color:#888;margin-bottom:5px;">> ${c}</li>`).join('')}
        </ul>
      </div>

      ${game.trivia.length > 0 ? `
        <div style="margin:15px 0;padding:10px;border:1px solid #1C1C1C;">
          <div style="font-family:'Press Start 2P',monospace;font-size:8px;color:#00FF66;margin-bottom:10px;">DATOS DE ARCHIVO</div>
          <ul style="list-style:none;">
            ${game.trivia.map(t => `<li style="font-size:11px;color:#888;margin-bottom:5px;">> ${t}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
    </div>
  `;

  $('#modal').classList.add('active');
};

window.showBookModal = (id) => {
  const book = books.find(b => b.id === id);
  if (!book) return;

  window._currentGallery = getImageGallery('books', id);
  const imgUrl = getImageUrl('books', id);

  const body = $('#modal-body');
  body.innerHTML = `
    ${imgUrl ? `
    <div class="modal-image-section">
      <div class="modal-image-wrapper">
        <img src="${imgUrl}" alt="${book.title}" class="modal-img" onerror="this.style.display='none'">
        <div class="modal-image-overlay"></div>
      </div>
    </div>` : ''}

    <div class="doc-header" style="font-size:14px;">${book.title}</div>
    <div class="doc-meta">
      <div><span>AUTOR:</span> ${book.author}</div>
      <div><span>AÑO:</span> ${book.year}</div>
      <div><span>TIPO:</span> ${book.type}</div>
      <div><span>SERIE:</span> ${book.series}</div>
    </div>
    <div class="doc-body">
      <p>${book.description}</p>

      ${book.characters && book.characters.length > 0 ? `
        <div style="margin:15px 0;padding:10px;border:1px solid #1C1C1C;">
          <div style="font-family:'Press Start 2P',monospace;font-size:8px;color:#00FF66;margin-bottom:10px;">PERSONAJES</div>
          <div style="display:flex;flex-wrap:wrap;gap:5px;">
            ${book.characters.map(c => `<span style="font-size:9px;color:#888;border:1px solid #242424;padding:2px 6px;">${c}</span>`).join('')}
          </div>
        </div>
      ` : ''}

      <div style="margin:15px 0;padding:10px;border:1px solid #1C1C1C;">
        <div style="font-family:'Press Start 2P',monospace;font-size:8px;color:#00FF66;margin-bottom:10px;">CONEXIONES</div>
        <ul style="list-style:none;">
          ${book.connections.map(c => `<li style="font-size:11px;color:#888;margin-bottom:5px;">> ${c}</li>`).join('')}
        </ul>
      </div>

      ${book.trivia && book.trivia.length > 0 ? `
        <div style="margin:15px 0;padding:10px;border:1px solid #1C1C1C;">
          <div style="font-family:'Press Start 2P',monospace;font-size:8px;color:#00FF66;margin-bottom:10px;">DATOS DE ARCHIVO</div>
          <ul style="list-style:none;">
            ${book.trivia.map(t => `<li style="font-size:11px;color:#888;margin-bottom:5px;">> ${t}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
    </div>
  `;

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
      const cards = $$('.character-card, .dashboard-card, .arcade-cabinet');
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
