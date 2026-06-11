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
  fangamesSearch: '',
  fangamesFilter: 'all',
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
  initFangameFilters();
  initAdminNav();
  initModal();
  initMusicPlayer();
  initSoundToggle();
  initVhsToggle();
  initHeaderStatus();
  initVHSTimestamp();
  initDatabaseCards();
  initHeroIndicators();
  initCameraMap();
  initNavDropdowns();
  initScrollReveal();

  // Load page data
  loadPage('home');

  // Start color cycling
  initColorCycling();

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
  const formatted = now.toLocaleDateString('es-ES', opts);
  const el1 = $('#last-recovery');
  if (el1) el1.textContent = `Última recuperación: ${formatted}`;
  const el2 = $('#admin-sync');
  if (el2) el2.textContent = formatted;
}

// =============================================
// NAVIGATION
// =============================================
function initNavigation() {
  // Logo click -> home
  const logo = document.querySelector('.logo');
  if (logo) {
    logo.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo('home');
    });
  }

  const links = $$('#main-nav a');
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const page = link.dataset.page;
      navigateTo(page);
      closeNavDropdowns();
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

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'instant' });

  // Update nav
  $$('#main-nav a').forEach(a => {
    a.classList.toggle('active', a.dataset.page === page);
  });
  updateActiveNavGroup(page);

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
    case 'fnaf-ar':
      renderFnafAR();
      break;
    case 'books':
      renderBooks();
      break;
    case 'videos':
      renderVideos();
      break;
    case 'fangames':
      renderFangames();
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
    case 'eastereggs':
      renderEasterEggs();
      break;
    case 'gallery':
      renderGallery();
      break;
    case 'map':
      renderMap();
      break;
    case 'quiz':
      renderQuiz();
      break;
    case 'simulator':
      renderSimulator();
      break;
    case 'timeline-full':
      renderTimelineFull();
      break;
  }

  requestAnimationFrame(revealPageElements);
}

function initNavDropdowns() {
  const dropdowns = $$('#main-nav .nav-dropdown');
  if (!dropdowns.length) return;

  dropdowns.forEach(dropdown => {
    const trigger = dropdown.querySelector('.nav-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dropdown.classList.contains('is-open');
      closeNavDropdowns();
      dropdown.classList.toggle('is-open', !isOpen);
      trigger.setAttribute('aria-expanded', String(!isOpen));
    });

    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeNavDropdowns();
        trigger.focus();
      }
    });
  });

  document.addEventListener('click', closeNavDropdowns);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeNavDropdowns();
  });

  updateActiveNavGroup(state.currentPage);
}

function closeNavDropdowns() {
  $$('#main-nav .nav-dropdown').forEach(dropdown => {
    dropdown.classList.remove('is-open');
    const trigger = dropdown.querySelector('.nav-trigger');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
  });
}

function updateActiveNavGroup(page) {
  $$('#main-nav .nav-dropdown').forEach(dropdown => {
    const hasActivePage = !!dropdown.querySelector(`[data-page="${page}"]`);
    dropdown.classList.toggle('is-active', hasActivePage);
  });
}

function initScrollReveal() {
  if (!('IntersectionObserver' in window)) {
    revealPageElements(true);
    return;
  }

  state.revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      state.revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.16, rootMargin: '0px 0px -40px 0px' });

  revealPageElements();
}

function revealPageElements(showImmediately = false) {
  const targets = $$('.page.active .db-card, .page.active .character-card, .page.active .game-card, .page.active .book-card, .page.active .video-card, .page.active .folder-card, .page.active .fangame-card, .page.active .dashboard-card');
  targets.forEach((el, index) => {
    if (el.classList.contains('is-visible')) return;
    el.classList.add('reveal-target');
    el.style.transitionDelay = `${Math.min(index * 45, 360)}ms`;

    if (showImmediately || !state.revealObserver) {
      el.classList.add('is-visible');
      return;
    }

    state.revealObserver.observe(el);
  });
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
// COLOR CYCLING
// =============================================
const themeColors = [
  { primary: '#00FF66', glow: 'rgba(0,255,102,0.5)', glowDim: 'rgba(0,255,102,0.15)' },
  { primary: '#00BFFF', glow: 'rgba(0,191,255,0.5)', glowDim: 'rgba(0,191,255,0.15)' },
  { primary: '#CC66FF', glow: 'rgba(204,102,255,0.5)', glowDim: 'rgba(204,102,255,0.15)' },
  { primary: '#FF4444', glow: 'rgba(255,68,68,0.5)', glowDim: 'rgba(255,68,68,0.15)' },
  { primary: '#FF8C00', glow: 'rgba(255,140,0,0.5)', glowDim: 'rgba(255,140,0,0.15)' },
  { primary: '#FF69B4', glow: 'rgba(255,105,180,0.5)', glowDim: 'rgba(255,105,180,0.15)' },
  { primary: '#00E5FF', glow: 'rgba(0,229,255,0.5)', glowDim: 'rgba(0,229,255,0.15)' },
  { primary: '#E6B800', glow: 'rgba(230,184,0,0.5)', glowDim: 'rgba(230,184,0,0.15)' },
  { primary: '#FF1493', glow: 'rgba(255,20,147,0.5)', glowDim: 'rgba(255,20,147,0.15)' },
  { primary: '#00FF66', glow: 'rgba(0,255,102,0.5)', glowDim: 'rgba(0,255,102,0.15)' },
];

let colorIndex = 0;

function initColorCycling() {
  const root = document.documentElement;
  setInterval(() => {
    colorIndex = (colorIndex + 1) % themeColors.length;
    const c = themeColors[colorIndex];
    root.style.setProperty('--theme-primary', c.primary);
    root.style.setProperty('--theme-glow', c.glow);
    root.style.setProperty('--theme-glow-dim', c.glowDim);
  }, 6000);
}

// =============================================
// HOME
// =============================================
function renderHome() {
  renderTimelineHorizontal();
}

function renderTimelineHorizontal() {
  const container = $('#timeline-horizontal');
  if (!container) return;

  const sorted = [...games].sort((a, b) => {
    const ay = parseInt(a.year) || 0;
    const by = parseInt(b.year) || 0;
    return ay - by;
  });

  container.innerHTML = `
    <div class="tl-track">
      <div class="tl-line"></div>
      ${sorted.map(game => {
        const imgUrl = getImageUrl('games', game.id);
        return `
        <div class="tl-item" data-game="${game.id}" onclick="handleGameClick(this, '${game.id}')">
          <div class="tl-cover">
            ${imgUrl ? `<img src="${imgUrl}" alt="${game.title}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">` : ''}
            <div class="tl-cover-fallback" style="display:${imgUrl ? 'none' : 'flex'}">${game.title.charAt(0)}</div>
          </div>
          <div class="tl-dot-wrap">
            <div class="tl-dot"></div>
          </div>
          <div class="tl-year">${game.year}</div>
          <div class="tl-title">${game.title}</div>
        </div>
        `;
      }).join('')}
    </div>
  `;
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

  const arCharacterIds = ['freddy-fazbear','bonnie','chica','foxy','golden-freddy','toy-freddy','toy-bonnie','toy-chica','mangle','balloon-boy','shadow-bonnie','springtrap','jack-o-chica','jack-o-bonnie','plushtrap','circus-baby','ballora','funtime-freddy','bon-bon','freddy-frostbear','8bit-baby','endo-01'];

  if (filter !== 'all') {
    if (filter === 'AR') {
      filtered = filtered.filter(c => arCharacterIds.includes(c.id));
    } else {
      filtered = filtered.filter(c => c.category === filter);
    }
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
  if (element) {
    element.classList.add('jumpscare');
    triggerDistortion();
    setTimeout(() => {
      element.classList.remove('jumpscare');
      showGameModal(gameId);
    }, 550);
  } else {
    showGameModal(gameId);
  }
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
// FANGAMES
// =============================================
function renderFangames(filter = state.fangamesFilter, search = state.fangamesSearch) {
  const grid = $('#fangames-grid');
  let filtered = [...fangames];

  if (filter !== 'all') {
    filtered = filtered.filter(f => f.category === filter);
  }

  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(f =>
      f.title.toLowerCase().includes(s) ||
      f.description.toLowerCase().includes(s) ||
      f.developer.toLowerCase().includes(s)
    );
  }

  const statusLabels = ['FAN', 'MOD', 'INDIE', 'DEV', 'BUILD', 'HOME'];

  grid.innerHTML = filtered.map((fg, i) => {
    const order = fangames.indexOf(fg) + 1;
    const fanId = `FAN-${String(order).padStart(2, '0')}`;
    const status = statusLabels[i % statusLabels.length];

    const categoryLabels = {
      'clasico': 'CLASICO',
      'popular': 'POPULAR',
      'reciente': 'RECIENTE',
      'experimental': 'EXPERIMENTAL'
    };

    const statusColors = {
      'Released': '#00FF66',
      'In Development': '#E6B800',
      'Cancelled': '#FF2222'
    };

    return `
    <div class="fangame-card" onclick="handleFangameClick(this, '${fg.id}')">
      <div class="cam-corners"></div>
      <div class="static-overlay"></div>
      <div class="cam-scan-line"></div>

      <div class="cam-indicator">
        <span class="rec-dot"></span>
        <span>${status}</span>
      </div>

      <div class="cam-label">${fanId} • ${fg.developer.split('/')[0].trim().split('(')[0].trim()}</div>

      <div class="fangame-year-badge">${fg.year}</div>

      <div class="fangame-category-tag" style="background:${fg.status === 'Released' ? '#0A0A0A' : fg.status === 'In Development' ? '#1A1A00' : '#1A0000'};border-color:${statusColors[fg.status] || '#666'}">${fg.status.toUpperCase()}</div>

      <div class="power-indicator">${categoryLabels[fg.category] || fg.category.toUpperCase()}</div>

      <div class="fangame-content">
        <div class="fangame-title">${fg.title}</div>
        <div class="fangame-meta">
          <span>${fg.developer}</span>
          <span>${fg.year}</span>
        </div>
        <div class="fangame-desc">${fg.description.slice(0, 150)}...</div>
        <div class="fangame-neon-line"></div>
      </div>
    </div>
  `}).join('');

  const searchInput = $('#fangames-search');
  if (searchInput && !searchInput._fangamesListener) {
    searchInput._fangamesListener = true;
    searchInput.addEventListener('input', (e) => {
      state.fangamesSearch = e.target.value;
      renderFangames(state.fangamesFilter, state.fangamesSearch);
    });
  }
}

window.handleFangameClick = function(element, fangameId) {
  element.classList.add('jumpscare');
  triggerDistortion();
  setTimeout(() => {
    element.classList.remove('jumpscare');
    showFangameModal(fangameId);
  }, 550);
};

function initFangameFilters() {
  const searchInput = $('#fangames-search');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    state.fangamesSearch = e.target.value;
    renderFangames(state.fangamesFilter, state.fangamesSearch);
  });

  $$('#fangames-filters .filter-tag').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('#fangames-filters .filter-tag').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.fangamesFilter = btn.dataset.filter;
      renderFangames(state.fangamesFilter, state.fangamesSearch);
    });
  });
}

window.showFangameModal = (id) => {
  const fg = fangames.find(f => f.id === id);
  if (!fg) return;

  const body = $('#modal-body');
  body.innerHTML = `
    <div class="fangame-modal">

      <div class="game-modal__hero">
        <div class="game-modal__hero-left">
          <div class="game-modal__img-frame">
            <div class="game-modal__img-fallback">${fg.title.charAt(0)}</div>
            <div class="game-modal__scanlines"></div>
            <div class="game-modal__corners"></div>
          </div>
        </div>

        <div class="game-modal__hero-right">
          <div class="game-modal__tags">
            <span class="game-modal__tag game-modal__tag--platform">${fg.genre}</span>
            <span class="game-modal__tag game-modal__tag--year">${fg.year}</span>
          </div>

          <h2 class="game-modal__title">${fg.title}</h2>
          <div class="game-modal__subtitle">${fg.developer}</div>

          <div class="game-modal__meta-row">
            <span class="game-modal__meta-badge">${fg.status.toUpperCase()}</span>
            <span class="game-modal__meta-badge game-modal__meta-badge--accent">${fg.category.toUpperCase()}</span>
          </div>

          <div class="game-modal__threat">
            <div class="game-modal__threat-label">PLATAFORMAS</div>
            <div class="game-modal__threat-bar">
              <div class="game-modal__threat-fill" style="width: ${Math.min(fg.platforms.length * 25, 100)}%"></div>
            </div>
            <div class="game-modal__threat-text">${fg.platforms.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(', ')}</div>
          </div>

          ${fg.downloadUrl ? `
            <a href="${fg.downloadUrl}" target="_blank" rel="noopener noreferrer" class="game-modal__steam-btn" style="background:#5500AA;border-color:#7700CC;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              DESCARGAR EN GAMEJOLT
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
            <div class="game-modal__info-value">${fg.title}</div>
          </div>
          <div class="game-modal__info-cell">
            <div class="game-modal__info-label">ANIO DE LANZAMIENTO</div>
            <div class="game-modal__info-value">${fg.year}</div>
          </div>
          <div class="game-modal__info-cell">
            <div class="game-modal__info-label">DESARROLLADOR</div>
            <div class="game-modal__info-value">${fg.developer}</div>
          </div>
          <div class="game-modal__info-cell">
            <div class="game-modal__info-label">ESTADO</div>
            <div class="game-modal__info-value">${fg.status}</div>
          </div>
          <div class="game-modal__info-cell">
            <div class="game-modal__info-label">CATEGORIA</div>
            <div class="game-modal__info-value">${fg.category.toUpperCase()}</div>
          </div>
          <div class="game-modal__info-cell">
            <div class="game-modal__info-label">GENERO</div>
            <div class="game-modal__info-value">${fg.genre}</div>
          </div>
        </div>
      </div>

      <div class="game-modal__section">
        <div class="game-modal__section-header" data-text="DESCRIPCION">
          <span class="game-modal__section-dot"></span> DESCRIPCION
        </div>
        <div class="game-modal__desc-full game-modal__desc-glitch">
          <p>${fg.description}</p>
        </div>
      </div>

      <div class="game-modal__section">
        <div class="game-modal__section-header" data-text="MECANICAS">
          <span class="game-modal__section-dot"></span> MECANICAS
        </div>
        <div class="game-modal__tags game-modal__tags--wrap">
          ${fg.mechanics.map(m => `<span class="game-modal__tag">${m}</span>`).join('')}
        </div>
      </div>

      ${fg.characters && fg.characters.length > 0 ? `
      <div class="game-modal__section">
        <div class="game-modal__section-header" data-text="PERSONAJES Y ANIMATRONICOS">
          <span class="game-modal__section-dot"></span> PERSONAJES Y ANIMATRONICOS
        </div>
        <div class="game-modal__chars-grid">
          ${fg.characters.slice(0, 20).map(c => {
            const slug = c.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
            const charImg = getImageUrl('characters', slug);
            const charData = characters.find(ch => ch.id === slug || ch.name.toLowerCase() === c.toLowerCase());
            const charDesc = charData ? charData.description : '';
            const charRole = charData ? (charData.trait || 'Animatronico') : 'Animatronico';
            return `
              <div class="game-modal__char-card" onclick="event.stopPropagation(); window.showCharacterFromFangame('${slug}')" title="${charDesc || c}">
                <div class="game-modal__char-avatar">
                  ${charImg ? `<img src="${charImg}" alt="${c}" loading="lazy" onerror="this.parentElement.innerHTML='<span class=\\'char-fallback\\'>${c.charAt(0)}</span>'">` : `<span class="char-fallback">${c.charAt(0)}</span>`}
                  <div class="game-modal__char-role">${charRole}</div>
                </div>
                <div class="game-modal__char-info">
                  <div class="game-modal__char-name">${c}</div>
                  ${charDesc ? `<div class="game-modal__char-desc">${charDesc.slice(0, 80)}${charDesc.length > 80 ? '...' : ''}</div>` : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>
        ${fg.characters.length > 20 ? `<div class="game-modal__more-chars">+${fg.characters.length - 20} personajes mas</div>` : ''}
        <div class="game-modal__char-nav">
          <button class="game-modal__nav-btn" onclick="event.stopPropagation(); window.navigateToCharacters('${fg.id}')">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
            VER TODOS LOS PERSONAJES EN LA SECCION DE PERSONAJES
          </button>
        </div>
      </div>
      ` : ''}

      <div class="game-modal__section">
        <div class="game-modal__section-header" data-text="CONEXIONES">
          <span class="game-modal__section-dot"></span> CONEXIONES
        </div>
        <ul class="game-modal__list">
          ${fg.connections.map(c => `<li class="game-modal__list-item">${c}</li>`).join('')}
        </ul>
      </div>

      ${fg.trivia && fg.trivia.length > 0 ? `
        <div class="game-modal__section">
          <div class="game-modal__section-header" data-text="DATOS DE ARCHIVO / CURIOSIDADES">
            <span class="game-modal__section-dot"></span> DATOS DE ARCHIVO / CURIOSIDADES
          </div>
          <ul class="game-modal__list">
            ${fg.trivia.map(t => `<li class="game-modal__list-item">${t}</li>`).join('')}
          </ul>
        </div>
      ` : ''}

      <div class="game-modal__footer">
        <span>FAZBEAR ENTERTAINMENT — ARCHIVO DE FANGAMES</span>
        <span>CONTENIDO CREADO POR FANS — USO BAJO PROPIA RESPONSABILIDAD</span>
      </div>
    </div>
  `;

  openModal();
};

window.showCharacterFromFangame = function(charId) {
  const modal = $('#modal');
  if (modal) modal.classList.remove('active');
  setTimeout(() => {
    const char = characters.find(c => c.id === charId || c.name.toLowerCase().replace(/ /g, '-') === charId);
    if (char) {
      window.showCharacterModal(char.id);
    } else {
      window.showSection('personajes');
      setTimeout(() => {
        const searchInput = $('#characters-search');
        if (searchInput) {
          searchInput.value = charId.replace(/-/g, ' ');
          searchInput.dispatchEvent(new Event('input'));
        }
      }, 300);
    }
  }, 300);
};

window.navigateToCharacters = function(fangameId) {
  const modal = $('#modal');
  if (modal) modal.classList.remove('active');
  setTimeout(() => {
    window.showSection('personajes');
    setTimeout(() => {
      const searchInput = $('#characters-search');
      if (searchInput) {
        const fg = fangames.find(f => f.id === fangameId);
        if (fg && fg.characters && fg.characters.length > 0) {
          searchInput.value = fg.characters[0].split(' ')[0];
          searchInput.dispatchEvent(new Event('input'));
        }
      }
    }, 300);
  }, 300);
};

// =============================================
// VIDEOS
// =============================================
const videoData = [
  // --- JUMPSCARES ---
  { id: 'OUxQJxMQORA', title: 'FNaF 1 - Todos los Jumpscares', category: 'JUMPSCARES', desc: 'Compilacion completa de jumpscares de FNaF 1' },
  { id: 'n0JdgL-VmR0', title: 'FNaF 2 - Todos los Jumpscares', category: 'JUMPSCARES', desc: 'Todos los jumpscares de FNaF 2 incluyendo Toy y Withered' },
  { id: 'X9QNFwyeBZ8', title: 'FNaF 3 - Springtrap Jumpscare', category: 'JUMPSCARES', desc: 'El jumpscare de Springtrap en Fazbear\'s Fright' },
  { id: '4qAv04yp5co', title: 'FNaF 4 - Todos los Jumpscares', category: 'JUMPSCARES', desc: 'Jumpscares de Nightmare Freddy, Bonnie, Chica, Foxy y Fredbear' },
  { id: '9TI0CHQFqdA', title: 'Security Breach - Todos los Jumpscares', category: 'JUMPSCARES', desc: 'Jumpscares de Glamrock animatronics y DJ Music Man' },
  { id: 'HEmQ_RP-ue4', title: '200+ Jumpscares - Todos los Juegos', category: 'JUMPSCARES', desc: 'Mega compilacion de mas de 200 jumpscares de toda la franquicia' },
  { id: 'h85S0xv4E5Q', title: 'FNaF 2 - Jumpscare Compilation Clasico', category: 'JUMPSCARES', desc: 'Compilacion clasica de FNaF 2 con Toy y Mangle' },
  { id: 'z1UWKRvMp2o', title: 'All FNAF Jumpscares 2014-2024', category: 'JUMPSCARES', desc: 'Todos los jumpscares de FNAF desde 2014 hasta 2024 en 12 minutos' },
  { id: '-mNzN17KLU4', title: 'FNAF Movie Game ALL Jumpscare', category: 'JUMPSCARES', desc: 'Compilacion de jumpscares del juego de la pelicula FNAF' },
  { id: 'Ujp2cqbr6KQ', title: 'FNAF 1 Jumpscare Compilation', category: 'JUMPSCARES', desc: 'Recopilacion de jumpscares del primer FNAF' },

  // --- TERROR / ANALOGICO ---
  { id: 'HJSZMFMgH04', title: 'FNAF - The Complete Tape (Analog Horror)', category: 'TERROR', desc: 'Cinta completa de terror analogico estilo VHS por Foxymations' },
  { id: 'VMJErb9-Qxo', title: 'Battington FNAF VHS Tapes', category: 'TERROR', desc: 'Analisis de las cintas VHS de terror analogico mas famosas de FNAF' },
  { id: '69nHymd4Q7Y', title: 'Deep Dish - Horror Short FNAF Inspired', category: 'TERROR', desc: 'Cortometraje de terror inspirado en Backrooms y Five Nights at Freddy\'s' },

  // --- AMBIENTAL ---
  { id: 'iOhD6pv2s-Y', title: 'FNaF 1 Ambience - 1 Hora', category: 'AMBIENTAL', desc: 'Ambientacion extendida de FNaF 1 para dormir o estudiar' },
  { id: '5Evk6JFMzGg', title: 'FNaF 1 - Power Out Ambience', category: 'AMBIENTAL', desc: 'La ambientacion iconica cuando se acaba la energia' },
  { id: 'YQ940SRcp-U', title: 'FNaF 3 - Office Ambience', category: 'AMBIENTAL', desc: 'Atmosfera de la oficina de Fazbear\'s Fright' },
  { id: 'fJIhjGSD3-0', title: 'FNaF Ambience Extended', category: 'AMBIENTAL', desc: 'Coleccion extendida de ambientacion de los juegos originales' },

  // --- GAMEPLAY ---
  { id: 'Ff7zoYvlin4', title: 'Security Breach - Full Game Walkthrough', category: 'GAMEPLAY', desc: 'Walkthrough completo sin commentary de Security Breach en 1080p' },
  { id: 'OF-5gCadqyU', title: 'Security Breach - Full Game', category: 'GAMEPLAY', desc: 'Juego completo mostrando todas las areas y encuentros' },
  { id: 'ocWVd7ZXlsY', title: 'Help Wanted VR - Full Gameplay', category: 'GAMEPLAY', desc: 'Experiencia completa de Help Wanted en VR' },
  { id: 'xYwP_pvM6u0', title: 'Security Breach Ruin - Full DLC', category: 'GAMEPLAY', desc: 'Walkthrough completo del DLC Ruin jugando como Cassie' },
  { id: 'mfnqomb4cJ0', title: 'Five Nights at Freddy\'s 1 - Full Game', category: 'GAMEPLAY', desc: 'Juego completo de FNaF 1 con todas las noches sin comentarios' },
  { id: 'PUHwoK2ZQzA', title: 'FNaF 1 - Full Gameplay Walkthrough', category: 'GAMEPLAY', desc: 'Partida completa del FNaF original sin comentarios' },
  { id: 'wr7cF5qtWRQ', title: 'Security Breach - Full Game (PrestonPlayz)', category: 'GAMEPLAY', desc: 'Partida completa de Security Breach con reacciones' },
  { id: 'X9WsssItUlI', title: 'FNAF Security Breach - Full Game 4K', category: 'GAMEPLAY', desc: 'Walkthrough en 4K de Security Breach sin comentarios' },

  // --- MUSICA ---
  { id: 'l18A5BOTlzE', title: 'Five Nights at Freddy\'s 1 Song', category: 'MUSICA', desc: 'La cancion original de FNAF - The Living Tombstone (oficial)' },
  { id: 'gu1IRT5KSxY', title: 'It\'s Been So Long - FNAF 2 Song', category: 'MUSICA', desc: 'La cancion de FNAF 2 - The Living Tombstone (animada)' },
  { id: 'Cw8nNnR6v6s', title: 'It\'s Been So Long (Live)', category: 'MUSICA', desc: 'The Living Tombstone interpreta Its Been So Long en vivo' },
  { id: 'xB8m8r9BE0s', title: 'Five Nights at Freddy\'s - Music Video', category: 'MUSICA', desc: 'Video musical oficial de la cancion de FNAF con letra' },

  // --- LORE ---
  { id: 'gWOXSh4-Iuc', title: 'FNAF - The ULTIMATE Timeline (Parte 1)', category: 'LORE', desc: 'Game Theory explica la linea temporal completa de FNAF' },
  { id: 'SugbaghWhqg', title: 'Inicio de la Timeline FNAF Explicado', category: 'LORE', desc: 'Explicacion del inicio de la cronologia y los primeros incidentes' },

  // --- PELICULA ---
  { id: 'f-zqS2CiZqw', title: 'Five Nights At Freddy\'s - Official Teaser', category: 'PELICULA', desc: 'El teaser trailer oficial de la pelicula por Universal Pictures' },
  { id: 'moQp0Bu2Grs', title: 'FNaF Movie - Detras de Escena', category: 'PELICULA', desc: 'Detras de escena de los animatronicos de la pelicula' },
];

const videosPerPage = 8;
let videoPage = 1;
let currentVideoFilter = 'TODOS';

function renderVideos() {
  const grid = $('#videos-grid');
  const categories = ['TODOS', 'JUMPSCARES', 'TERROR', 'AMBIENTAL', 'GAMEPLAY', 'MUSICA', 'LORE', 'PELICULA'];

  grid.innerHTML = `
    <div class="videos-filters" id="videos-filters">
      ${categories.map((cat, i) => `<button class="filter-tag ${i === 0 ? 'active' : ''}" data-vfilter="${cat}">${cat}</button>`).join('')}
    </div>
    <div class="video-player-container" id="video-player-container" style="display:none;">
      <div class="video-player-inner">
        <button class="video-player-close" onclick="closeVideoPlayer()">&times;</button>
        <div class="video-player-embed" id="video-player-embed"></div>
        <div class="video-player-title" id="video-player-title"></div>
      </div>
    </div>
    <div class="videos-list" id="videos-list"></div>
    <div class="videos-pagination" id="videos-pagination"></div>
  `;

  videoPage = 1;
  currentVideoFilter = 'TODOS';
  renderVideoPage();

  $$('#videos-filters .filter-tag').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('#videos-filters .filter-tag').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentVideoFilter = btn.dataset.vfilter;
      videoPage = 1;
      renderVideoPage();
    });
  });
}

function renderVideoPage() {
  const list = $('#videos-list');
  const pagination = $('#videos-pagination');
  if (!list) return;

  const filtered = currentVideoFilter === 'TODOS'
    ? videoData
    : videoData.filter(v => v.category === currentVideoFilter);

  const totalPages = Math.ceil(filtered.length / videosPerPage);
  const start = (videoPage - 1) * videosPerPage;
  const pageVideos = filtered.slice(start, start + videosPerPage);

  list.innerHTML = pageVideos.map(v => `
    <div class="video-card" data-category="${v.category}" onclick="openVideoPlayer('${v.id}', '${v.title.replace(/'/g, "\\'")}')">
      <div class="video-thumb">
        <img src="https://img.youtube.com/vi/${v.id}/mqdefault.jpg" alt="${v.title}" loading="lazy">
        <div class="video-play">&#9654;</div>
        <div class="video-scanlines"></div>
      </div>
      <div class="video-info">
        <div class="video-category">${v.category}</div>
        <div class="video-title">${v.title}</div>
        <div class="video-desc">${v.desc}</div>
      </div>
    </div>
  `).join('');

  // Pagination
  if (totalPages <= 1) {
    pagination.innerHTML = '';
    return;
  }

  let pagHtml = '<div class="videos-pagination-inner">';
  pagHtml += `<button class="video-page-btn" onclick="changeVideoPage(${videoPage - 1})" ${videoPage <= 1 ? 'disabled' : ''}>&#9664; ANTERIOR</button>`;
  pagHtml += `<span class="video-page-info">${videoPage} / ${totalPages}</span>`;
  pagHtml += `<button class="video-page-btn" onclick="changeVideoPage(${videoPage + 1})" ${videoPage >= totalPages ? 'disabled' : ''}>SIGUIENTE &#9654;</button>`;
  pagHtml += '</div>';
  pagination.innerHTML = pagHtml;
}

window.changeVideoPage = function(page) {
  const filtered = currentVideoFilter === 'TODOS'
    ? videoData
    : videoData.filter(v => v.category === currentVideoFilter);
  const totalPages = Math.ceil(filtered.length / videosPerPage);
  if (page < 1 || page > totalPages) return;
  videoPage = page;
  renderVideoPage();
  document.getElementById('videos-list').scrollIntoView({ behavior: 'smooth', block: 'start' });
};

window.openVideoPlayer = (id, title) => {
  const container = document.getElementById('video-player-container');
  const embed = document.getElementById('video-player-embed');
  const titleEl = document.getElementById('video-player-title');
  embed.innerHTML = `<iframe src="https://www.youtube.com/embed/${id}?autoplay=1&rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
  titleEl.textContent = title;
  container.style.display = 'flex';
  document.body.style.overflow = 'hidden';
};

window.closeVideoPlayer = () => {
  const container = document.getElementById('video-player-container');
  const embed = document.getElementById('video-player-embed');
  embed.innerHTML = '';
  container.style.display = 'none';
  document.body.style.overflow = '';
};

// =============================================
// HISTORY
// =============================================
function renderHistory() {
  const grid = $('#folders-grid');
  const detailView = $('#history-detail-view');
  const foldersView = $('#history-folders-view');
  if (!grid) return;

  if (detailView) detailView.style.display = 'none';
  if (foldersView) foldersView.style.display = 'block';

  const sevColors = {
    'CRÍTICO': '#FF1744', 'ALTO': '#FF6D00', 'MEDIO': '#FFD600'
  };

  grid.innerHTML = window.incidents.map(inc => {
    const sevColor = sevColors[inc.severity] || '#FF1744';
    return `
      <div class="folder-card" data-incident="${inc.id}" onclick="openIncident('${inc.id}')">
        <div class="folder-tab"></div>
        <div class="folder-body">
          <div class="folder-label">
            <div class="folder-label-title">${inc.title}</div>
          </div>
          <div class="folder-year">${inc.year}</div>
          <div class="folder-severity" style="color:${sevColor};border-color:${sevColor};">${inc.severity}</div>
        </div>
      </div>
    `;
  }).join('');

  const backBtn = $('#folders-back');
  if (backBtn) {
    backBtn.onclick = () => {
      detailView.style.display = 'none';
      foldersView.style.display = 'block';
    };
  }
}

function openIncident(id) {
  const inc = window.incidents.find(i => i.id === id);
  if (!inc) return;

  const foldersView = $('#history-folders-view');
  const detailView = $('#history-detail-view');
  const timelineEl = $('#detail-timeline');
  const incidentEl = $('#detail-incident');

  foldersView.style.display = 'none';
  detailView.style.display = 'block';

  const incYear = parseInt(inc.year) || 0;
  const catColors = {
    'Incident': '#FF1744', 'Game': '#00FF66', 'History': '#00BCD4',
    'Birth': '#E6B800', 'Death': '#9C27B0'
  };

  const relatedTimelineIds = inc.relatedTimeline || [];
  const relatedEvents = timeline.filter(t => relatedTimelineIds.includes(t.id));
  const sorted = relatedEvents.sort((a, b) => {
    const ay = parseInt(a.year) || 0;
    const by = parseInt(b.year) || 0;
    return ay - by;
  });

  timelineEl.innerHTML = sorted.map(item => {
    const itemYear = parseInt(item.year) || 0;
    const isCurrent = Math.abs(itemYear - incYear) <= 2;
    const color = catColors[item.category] || '#00FF66';
    return `
      <div class="hdt-item">
        <div class="hdt-dot" style="background:${color};box-shadow:0 0 10px ${color}80;"></div>
        <div class="hdt-connector"></div>
        <div class="hdt-card${isCurrent ? ' highlight' : ''}">
          <div class="hdt-year" style="color:${color};">${item.year}</div>
          <div class="hdt-title">${item.title}</div>
          <div class="hdt-desc">${item.description}</div>
        </div>
      </div>
    `;
  }).join('');

  if (sorted.length === 0) {
    timelineEl.innerHTML = '<div style="color:#555;font-size:11px;padding:20px;text-align:center;font-family:Press Start 2P,monospace;">NO SE ENCONTRARON EVENTOS RELACIONADOS</div>';
  }

  const sevColors = {
    'CRÍTICO': '#FF1744', 'ALTO': '#FF6D00', 'MEDIO': '#FFD600'
  };
  const sevColor = sevColors[inc.severity] || '#FF1744';

  const animatronicCards = inc.animatronics.map(animId => {
    const char = window.characters.find(c => c.id === animId);
    if (!char) {
      return `
        <div class="hdi-anim-card">
          <div class="hdi-anim-avatar hdi-anim-avatar-fallback">${animId.charAt(0).toUpperCase()}</div>
          <div class="hdi-anim-info">
            <div class="hdi-anim-name">${animId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
            <div class="hdi-anim-status" style="color:#555;">Sin datos</div>
          </div>
        </div>
      `;
    }
    const charImg = getImageUrl('characters', animId);
    const statusColors = { 'Haunted': '#FF1744', 'Active': '#00FF66', 'Unknown': '#FFD600', 'Deactivated': '#666' };
    const sColor = statusColors[char.status] || '#888';
    return `
      <div class="hdi-anim-card" onclick="event.stopPropagation();navigateTo('characters');setTimeout(()=>showCharacterModal('${animId}'),400);" style="cursor:pointer;">
        <div class="hdi-anim-avatar">
          ${charImg ? `<img src="${charImg}" alt="${char.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">` : ''}
          <div class="hdi-anim-avatar-fallback" style="display:${charImg ? 'none' : 'flex'}">${char.name.charAt(0)}</div>
        </div>
        <div class="hdi-anim-info">
          <div class="hdi-anim-name">${char.name}</div>
          <div class="hdi-anim-status" style="color:${sColor};">${char.status}</div>
        </div>
      </div>
    `;
  }).join('');

  const relatedGameCards = (inc.relatedGames || []).map(gId => {
    const game = window.games.find(g => g.id === gId);
    if (!game) return '';
    const gameImg = getImageUrl('games', gId);
    return `
      <div class="hdi-game-card" onclick="event.stopPropagation();navigateTo('games');setTimeout(()=>handleGameClick(null,'${gId}'),400);" style="cursor:pointer;">
        <div class="hdi-game-cover">
          ${gameImg ? `<img src="${gameImg}" alt="${game.title}" onerror="this.style.display='none'">` : ''}
          <div class="hdi-game-scanlines"></div>
        </div>
        <div class="hdi-game-info">
          <div class="hdi-game-title">${game.title}</div>
          <div class="hdi-game-year">${game.year}</div>
        </div>
      </div>
    `;
  }).join('');

  incidentEl.innerHTML = `
    <div class="hdi-image">
      <img src="${inc.image}" alt="${inc.title}" loading="lazy" onerror="this.style.display='none'">
      <div class="hdi-image-overlay"></div>
      <div class="hdi-cam-label">CAM-${inc.id.slice(0,4).toUpperCase()}</div>
      <div class="hdi-rec"><span class="hdi-rec-dot"></span> REC</div>
    </div>
    <div class="hdi-body">
      <div class="hdi-meta">
        <span class="hdi-year">${inc.year}</span>
        <span class="hdi-severity" style="color:${sevColor};border-color:${sevColor};">${inc.severity}</span>
        <span class="hdi-class">${inc.classification}</span>
      </div>
      <div class="hdi-title">${inc.title}</div>
      <div class="hdi-desc">${inc.description}</div>
      <div class="hdi-footer">
        <div class="hdi-location"><span class="hdi-loc-icon">&#9673;</span> ${inc.location}</div>
        <div class="hdi-victims">${inc.victims > 0 ? `<span class="hdi-victims-count">${inc.victims}</span> víctimas` : 'Sin víctimas directas'}</div>
      </div>
      <div class="hdi-section-label">ANIMATRÓNICOS INVOLUCRADOS</div>
      <div class="hdi-anim-grid">
        ${animatronicCards}
      </div>
      <div class="hdi-section-label">JUEGOS RELACIONADOS</div>
      <div class="hdi-games-row">
        ${relatedGameCards}
      </div>
    </div>
  `;
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

// =============================================
// FNAF AR: SPECIAL DELIVERY
// =============================================
function renderFnafAR() {
  const animGrid = $('#ar-anim-grid');
  const skinsGrid = $('#ar-skins-grid');
  const timeline = $('#ar-timeline');
  const trivia = $('#ar-trivia');

  // Animatronics data
  const animatronics = [
    { id: 'freddy-fazbear', name: 'Freddy Fazbear', type: 'Original' },
    { id: 'bonnie', name: 'Bonnie', type: 'Original' },
    { id: 'chica', name: 'Chica', type: 'Original' },
    { id: 'foxy', name: 'Foxy', type: 'Original' },
    { id: 'golden-freddy', name: 'Golden Freddy', type: 'Original' },
    { id: 'toy-freddy', name: 'Toy Freddy', type: 'Toy' },
    { id: 'toy-bonnie', name: 'Toy Bonnie', type: 'Toy' },
    { id: 'toy-chica', name: 'Toy Chica', type: 'Toy' },
    { id: 'mangle', name: 'Mangle', type: 'Toy' },
    { id: 'balloon-boy', name: 'Balloon Boy', type: 'Toy' },
    { id: 'shadow-bonnie', name: 'RWQFSFASXC', type: 'Shadow' },
    { id: 'springtrap', name: 'Springtrap', type: 'Springlock' },
    { id: 'jack-o-chica', name: 'Jack-O-Chica', type: 'Halloween' },
    { id: 'jack-o-bonnie', name: 'Jack-O-Bonnie', type: 'Halloween' },
    { id: 'plushtrap', name: 'Plushtrap', type: 'Halloween' },
    { id: 'circus-baby', name: 'Circus Baby', type: 'Funtime' },
    { id: 'ballora', name: 'Ballora', type: 'Funtime' },
    { id: 'funtime-freddy', name: 'Funtime Freddy', type: 'Funtime' },
    { id: 'bon-bon', name: 'Bon-Bon', type: 'Funtime' },
    { id: 'freddy-frostbear', name: 'Freddy Frostbear', type: 'Special' },
    { id: '8bit-baby', name: '8-Bit Baby', type: 'Special' },
    { id: 'endo-01', name: 'Endo-01', type: 'Endoskeleton' },
  ];

  // Skins - organized by event with real images from wiki
  const skinEvents = [
    {
      event: "ST. PATRICK'S DAY", date: "Mar 2020",
      skins: [
        { name: 'Shamrock Freddy', base: 'Freddy Fazbear', img: 'https://static.wikia.nocookie.net/triple-a-fazbear/images/7/77/Shamrock_Freddy.png/revision/latest/scale-to-width-down/310?cb=20200709200121', desc: 'Freddy metálico verde y dorado temático de San Patricio.' }
      ]
    },
    {
      event: "EASTER", date: "Abr 2020",
      skins: [
        { name: 'Chocolate Bonnie', base: 'Bonnie', img: 'https://static.wikia.nocookie.net/triple-a-fazbear/images/8/88/Chocolatebonniear.png/revision/latest/scale-to-width-down/310?cb=20200410022847', desc: 'Bonnie de chocolate con botones de caramelos y marcas de mordiscos.' },
        { name: 'Easter Bonnie', base: 'Bonnie', img: 'https://static.wikia.nocookie.net/triple-a-fazbear/images/0/04/Easter_Bunny.png/revision/latest/scale-to-width-down/310?cb=20200417014001', desc: 'Bonnie blanco con lazo amarillo y patrón de huevo de Pascua.' },
        { name: 'Melted Chocolate Bonnie', base: 'Bonnie', img: 'https://static.wikia.nocookie.net/triple-a-fazbear/images/5/56/MeltedChocoBonnieAmqericaRender.png/revision/latest/scale-to-width-down/310?cb=20220309030910', desc: 'Variante derretida de Chocolate Bonnie.' }
      ]
    },
    {
      event: "ARCADE MAYHEM", date: "May 2020",
      skins: [
        { name: 'VR Toy Freddy', base: 'Toy Freddy', img: 'https://static.wikia.nocookie.net/triple-a-fazbear/images/1/17/VR_Toy_Freddyram.png/revision/latest/scale-to-width-down/310?cb=20200510033451', desc: 'Toy Freddy púrpura neón con gafas VR.' },
        { name: 'Highscore Toy Chica', base: 'Toy Chica', img: 'https://static.wikia.nocookie.net/triple-a-fazbear/images/f/f5/Ec20ojdvauy41.png/revision/latest/scale-to-width-down/310?cb=20200516065042', desc: 'Toy Chica azul neón con "HIGH SCORE" en su bib.' },
        { name: 'System Error Toy Bonnie', base: 'Toy Bonnie', img: 'https://static.wikia.nocookie.net/triple-a-fazbear/images/0/08/SystemErrorTB_PlushsuitIcon.png/revision/latest/scale-to-width-down/310?cb=20201121000356', desc: 'Toy Bonnie rojo con "SYSTEM ERROR" en el pecho.' }
      ]
    },
    {
      event: "WASTELAND", date: "Jun 2020",
      skins: [
        { name: 'Radioactive Foxy', base: 'Foxy', img: 'https://static.wikia.nocookie.net/triple-a-fazbear/images/5/5d/RadioactiveFoxyRender.png/revision/latest/scale-to-width-down/310?cb=20200625034838', desc: 'Foxy radiactivo con tonos verdes.' },
        { name: 'Toxic Springtrap', base: 'Springtrap', img: 'https://static.wikia.nocookie.net/triple-a-fazbear/images/4/49/ToxicSpringtrapRender.png/revision/latest/scale-to-width-down/310?cb=20200625034919', desc: 'Springtrap tóxico con sustancias químicas.' }
      ]
    },
    {
      event: "4TH OF JULY", date: "Jul 2020",
      skins: [
        { name: 'Firework Freddy', base: 'Freddy Fazbear', img: 'https://static.wikia.nocookie.net/triple-a-fazbear/images/0/0d/AC0DAF84-03B5-48A8-A3B9-5A4B3E5F7D44.png/revision/latest/scale-to-width-down/310?cb=20200706174607', desc: 'Freddy patriotero con fuegos artificiales.' },
        { name: 'Liberty Chica', base: 'Chica', img: 'https://static.wikia.nocookie.net/triple-a-fazbear/images/b/b5/Liberty_Chica.png/revision/latest/scale-to-width-down/310?cb=20200706174532', desc: 'Chica temática de la Estatua de la Libertad.' }
      ]
    },
    {
      event: "HEATWAVE", date: "Ago 2020",
      skins: [
        { name: 'Flamethrower Bare Endo', base: 'Endo-01', img: 'https://static.wikia.nocookie.net/triple-a-fazbear/images/e/e1/Flamethrower_Bare_Endo.png/revision/latest/scale-to-width-down/310?cb=20200821015512', desc: 'Endo con lanzallamas.' },
        { name: 'Broiler Baby', base: 'Circus Baby', img: 'https://static.wikia.nocookie.net/triple-a-fazbear/images/1/16/BroilerBabyRender.png/revision/latest/scale-to-width-down/310?cb=20200821015634', desc: 'Circus Baby con tema de horno.' },
        { name: 'Scorching Chica', base: 'Chica', img: 'https://static.wikia.nocookie.net/triple-a-fazbear/images/2/27/Scorching_Chica.png/revision/latest/scale-to-width-down/310?cb=20200821015703', desc: 'Chica quemada con fuego.' },
        { name: 'Flaming Springtrap', base: 'Springtrap', img: 'https://static.wikia.nocookie.net/triple-a-fazbear/images/0/09/Flaming_Springtrap.png/revision/latest/scale-to-width-down/310?cb=20200821015730', desc: 'Springtrap en llamas.' }
      ]
    },
    {
      event: "DARK CIRCUS", date: "Oct 2021",
      skins: [
        { name: 'Ringmaster Foxy', base: 'Foxy', img: 'https://static.wikia.nocookie.net/triple-a-fazbear/images/e/ed/RingmasterFoxyRender.png/revision/latest/scale-to-width-down/310?cb=20211002014702', desc: 'Foxy como maestro de ceremonia de circo.' },
        { name: 'Magician Mangle', base: 'Mangle', img: 'https://static.wikia.nocookie.net/triple-a-fazbear/images/0/04/MagicianMangleRender.png/revision/latest/scale-to-width-down/310?cb=20211002014741', desc: 'Mangle como mago de circo.' },
        { name: 'Clown Springtrap', base: 'Springtrap', img: 'https://static.wikia.nocookie.net/triple-a-fazbear/images/4/43/ClownSpringtrapRender.png/revision/latest/scale-to-width-down/310?cb=20211002014805', desc: 'Springtrap payaso de circo.' },
        { name: 'Great Escape Golden Freddy', base: 'Golden Freddy', img: 'https://static.wikia.nocookie.net/triple-a-fazbear/images/d/d2/Great_Escape_Golden_Freddy.png/revision/latest/scale-to-width-down/310?cb=20211213204045', desc: 'Golden Freddy con tema de gran escape.' }
      ]
    },
    {
      event: "HALLOWEEN", date: "Oct 2020",
      skins: [
        { name: 'Catrina Toy Chica', base: 'Toy Chica', img: 'https://static.wikia.nocookie.net/triple-a-fazbear/images/4/47/Catrina_Toy_Chica.png/revision/latest/scale-to-width-down/310?cb=20201027012032', desc: 'Toy Chica temática Día de Muertos.' }
      ]
    },
    {
      event: "HAUNTED FOREST", date: "Oct 2020",
      skins: [
        { name: 'Woodland Toy Freddy', base: 'Toy Freddy', img: 'https://static.wikia.nocookie.net/triple-a-fazbear/images/a/af/Woody.png/revision/latest/scale-to-width-down/310?cb=20201027012144', desc: 'Toy Freddy del bosque encantado.' },
        { name: 'Boulder Toy Bonnie', base: 'Toy Bonnie', img: 'https://static.wikia.nocookie.net/triple-a-fazbear/images/0/0e/BoulderToyBonnieRender.png/revision/latest/scale-to-width-down/310?cb=20201027012214', desc: 'Toy Bonnie de roca.' },
        { name: 'Swamp Balloon Boy', base: 'Balloon Boy', img: 'https://static.wikia.nocookie.net/triple-a-fazbear/images/4/4f/SwampBalloonBoyRender.png/revision/latest/scale-to-width-down/310?cb=20201027012245', desc: 'Balloon Boy del pantano.' }
      ]
    },
    {
      event: "WINTER WONDERLAND", date: "Dic 2020",
      skins: [
        { name: 'Black Ice Frostbear', base: 'Freddy Frostbear', img: 'https://static.wikia.nocookie.net/triple-a-fazbear/images/7/73/Black_Ice_Frostbear.png/revision/latest/scale-to-width-down/310?cb=20201211203043', desc: 'Freddy Frostbear de hielo negro.' },
        { name: 'Arctic Ballora', base: 'Ballora', img: 'https://static.wikia.nocookie.net/triple-a-fazbear/images/0/02/ArcticBalloraRender.png/revision/latest/scale-to-width-down/310?cb=20201211203118', desc: 'Ballora ártica.' },
        { name: 'Frostbite Balloon Boy', base: 'Balloon Boy', img: 'https://static.wikia.nocookie.net/triple-a-fazbear/images/7/7c/FrostbiteBalloonBoy.png/revision/latest/scale-to-width-down/310?cb=20201211203148', desc: 'Balloon Boy congelado.' },
        { name: 'Frost Plushtrap', base: 'Plushtrap', img: 'https://static.wikia.nocookie.net/triple-a-fazbear/images/d/d4/FrostPlushtrapRender.png/revision/latest/scale-to-width-down/310?cb=20201211203212', desc: 'Plushtrap helado.' }
      ]
    },
    {
      event: "HEART STOPPERS", date: "Feb 2021",
      skins: [
        { name: 'Heartsick Baby', base: 'Circus Baby', img: 'https://static.wikia.nocookie.net/triple-a-fazbear/images/5/53/HeartsickBabyRender.png/revision/latest/scale-to-width-down/310?cb=20210211212531', desc: 'Circus Baby con tema de corazones.' },
        { name: 'Black Heart Bonnie', base: 'Bonnie', img: 'https://static.wikia.nocookie.net/triple-a-fazbear/images/1/14/BlackHeartBonnieRender.png/revision/latest/scale-to-width-down/310?cb=20210211212604', desc: 'Bonnie con corazón negro.' }
      ]
    },
    {
      event: "ANCIENT EQUINOX", date: "Mar 2021",
      skins: [
        { name: 'Serpent Mangle', base: 'Mangle', img: 'https://static.wikia.nocookie.net/triple-a-fazbear/images/5/53/Serpent_Mangle.png/revision/latest/scale-to-width-down/310?cb=20210320005938', desc: 'Mangle serpiente.' },
        { name: 'Curse (Endo)', base: 'Endo-01', img: 'https://static.wikia.nocookie.net/triple-a-fazbear/images/a/af/CurseEndoRender.png/revision/latest/scale-to-width-down/310?cb=20210320010011', desc: 'Endo maldito.' }
      ]
    },
    {
      event: "SCARY TALES", date: "Jun 2021",
      skins: [
        { name: 'Little Red Chica', base: 'Chica', img: 'https://static.wikia.nocookie.net/triple-a-fazbear/images/b/b5/Little_Red_Chica.png/revision/latest/scale-to-width-down/310?cb=20210618215903', desc: 'Chica Caperucita Roja.' },
        { name: 'Big Bad Foxy', base: 'Foxy', img: 'https://static.wikia.nocookie.net/triple-a-fazbear/images/e/e2/Big_Bad_Foxy.png/revision/latest/scale-to-width-down/310?cb=20210618215932', desc: 'Foxy el Lobo Feroz.' }
      ]
    },
    {
      event: "WICKED TIDES", date: "Ago 2021",
      skins: [
        { name: 'Dark Water Bare Endo', base: 'Endo-01', img: 'https://static.wikia.nocookie.net/triple-a-fazbear/images/2/20/DarkWaterEndoRender.png/revision/latest/scale-to-width-down/310?cb=20210814021422', desc: 'Endo de agua oscura.' },
        { name: 'Sunken Toy Bonnie', base: 'Toy Bonnie', img: 'https://static.wikia.nocookie.net/triple-a-fazbear/images/3/37/SunkenToyBonnieRender.png/revision/latest/scale-to-width-down/310?cb=20210814021452', desc: 'Toy Bonnie hundido.' },
        { name: 'Piranha Plushtrap', base: 'Plushtrap', img: 'https://static.wikia.nocookie.net/triple-a-fazbear/images/1/14/PiranhaPlushtrapRender.png/revision/latest/scale-to-width-down/310?cb=20210814021517', desc: 'Plushtrap piraña.' }
      ]
    },
    {
      event: "SCREAMPUNK", date: "Oct 2021",
      skins: [
        { name: 'Clockwork Ballora', base: 'Ballora', img: 'https://static.wikia.nocookie.net/triple-a-fazbear/images/7/7b/Clockwork_Ballora.png/revision/latest/scale-to-width-down/310?cb=20211016013247', desc: 'Ballora de relojería.' },
        { name: 'Aeronaut Toy Freddy', base: 'Toy Freddy', img: 'https://static.wikia.nocookie.net/triple-a-fazbear/images/a/a4/Aeronaut_Toy_Freddy.png/revision/latest/scale-to-width-down/310?cb=20211016013315', desc: 'Toy Freddy aeronauta.' },
        { name: 'Jetpack Balloon Boy', base: 'Balloon Boy', img: 'https://static.wikia.nocookie.net/triple-a-fazbear/images/1/19/Jetpack_Balloon_Boy.png/revision/latest/scale-to-width-down/310?cb=20211016013342', desc: 'Balloon Boy con jetpack.' }
      ]
    }
  ];

  // Timeline
  const events = [
    { date: '25 Nov 2019', title: 'Lanzamiento oficial', desc: 'Juego lanzado para iOS y Android tras early access el 22 de noviembre.' },
    { date: '12 Mar 2020', title: 'Skins introducidas', desc: 'Primer skin: Shamrock Freddy. Evento de San Patricio.' },
    { date: '2020', title: 'Eventos de Halloween', desc: 'Jack-O-Chica, Jack-O-Bonnie y Plushtrap agregados junto con skins temáticas.' },
    { date: '2021', title: 'Nuevos animatrónicos', desc: 'Se agregaron Funtime Freddy, Bon-Bon, Ballora y más animatrónicos Funtime.' },
    { date: '13 Dic 2021', title: 'Último skin', desc: 'Great Escape Golden Freddy, durante el evento Dark Circus.' },
    { date: '1 Feb 2024', title: 'Cancelación anunciada', desc: 'Illumix anuncia el cierre de los servidores del juego.' },
    { date: '14 Mar 2024', title: 'Cierre de servidores', desc: 'Los servidores de FNAF AR: Special Delivery son apagados oficialmente.' },
  ];

  // Trivia
  const triviaData = [
    { text: 'Desarrollado por <strong>Illumix</strong> en colaboración con <strong>Scott Cawthon</strong>. Fue el primer juego de FNAF en realidad aumentada.' },
    { text: 'El juego utilizaba la <strong>cámara del teléfono</strong> y los sensores de <strong>movimiento</strong> para crear experiencias AR inmersivas.' },
    { text: 'Se implementaron un total de <strong>22 animatrónicos</strong> y <strong>39 skins</strong> durante el tiempo de vida del juego.' },
    { text: 'Los jugadores podían <strong>enviar animatrónicos</strong> contra amigos y otros jugadores para competir en leaderboards.' },
    { text: 'El sistema de <strong>Plush Suits</strong> permitía personalizar la apariencia de los endosqueletos enviados a otros jugadores.' },
    { text: 'El juego fue <strong>cancelado</strong> en febrero de 2024 y sus servidores cerraron en marzo del mismo año.' },
  ];

  // Render animatronics
  if (animGrid) {
    animGrid.innerHTML = animatronics.map(a => {
      const charData = window.characters ? window.characters.find(c => c.id === a.id) : null;
      const img = getImageUrl('characters', a.id);
      return `
        <div class="ar-anim-card" ${charData ? `onclick="event.stopPropagation();navigateTo('characters');setTimeout(()=>showCharacterModal('${a.id}'),400);"` : ''}>
          <div class="ar-anim-card__cover">
            ${img ? `<img src="${img}" alt="${a.name}" loading="lazy" onerror="this.style.display='none'">` : ''}
            <div class="ar-anim-card__scanlines"></div>
          </div>
          <div class="ar-anim-card__name">${a.name}</div>
          <div class="ar-anim-card__skin">${a.type}</div>
        </div>
      `;
    }).join('');
  }

  // Render skins grouped by event
  if (skinsGrid) {
    skinsGrid.innerHTML = skinEvents.map(ev => `
      <div class="ar-skin-event">
        <div class="ar-skin-event__header">
          <span class="ar-skin-event__name">${ev.event}</span>
          <span class="ar-skin-event__date">${ev.date}</span>
        </div>
        <div class="ar-skin-event__list">
          ${ev.skins.map(s => `
            <div class="ar-skin-card" title="${s.desc}">
              <div class="ar-skin-card__img">
                <img src="${s.img}" alt="${s.name}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'ar-skin-card__fallback\\'>${s.base.charAt(0)}</div>'">
                <div class="ar-skin-card__scanlines"></div>
              </div>
              <div class="ar-skin-card__info">
                <div class="ar-skin-card__name">${s.name}</div>
                <div class="ar-skin-card__base">${s.base}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');
  }

  // Render timeline
  if (timeline) {
    timeline.innerHTML = events.map(e => `
      <div class="ar-tl-item">
        <div class="ar-tl-item__date">${e.date}</div>
        <div class="ar-tl-item__title">${e.title}</div>
        <div class="ar-tl-item__desc">${e.desc}</div>
      </div>
    `).join('');
  }

  // Render trivia
  if (trivia) {
    trivia.innerHTML = triviaData.map(t => `
      <div class="ar-trivia-item">${t.text}</div>
    `).join('');
  }

  // Animate preview character
  const preview = $('#ar-anim-preview');
  if (preview) {
    const chars = [' Freddy', ' Bonnie', ' Chica', ' Foxy', '?'];
    let idx = 0;
    setInterval(() => {
      preview.textContent = chars[idx];
      idx = (idx + 1) % chars.length;
    }, 2000);
  }
}

function renderMusic() {
  const list = $('#music-list');
  const tracks = [
    { id: 1, title: 'CINTA #001 — ARCHIVO CENTRAL', sub: 'Freddy Fazbear\'s Pizza • 1983', duration: '3:42' },
    { id: 2, title: 'CINTA #002 — RUIDO AMBIENTAL', sub: 'Grabación nocturna • Cam 01', duration: '4:15' },
    { id: 3, title: 'CINTA #003 — FREDDY FAZBEAR\'S PIZZA', sub: 'Locución promocional • 1987', duration: '2:58' },
    { id: 4, title: 'CINTA #004 — TRANSMISIÓN DESCONOCIDA', sub: 'Señal interceptada • Origen desconocido', duration: '5:03' },
    { id: 5, title: 'CINTA #005 — MENSAJE INTERCEPTADO', sub: 'Llamada telefónica • Empleado #042', duration: '3:27' },
    { id: 6, title: 'CINTA #006 — REGISTRO DE SEGURIDAD', sub: 'CCTV Audio • Sala de rappel', duration: '4:44' },
    { id: 7, title: 'CINTA #007 — CINTA DAÑADA', sub: 'Audio corrupto • Datos parciales', duration: '2:19' },
    { id: 8, title: 'CINTA #008 — SEÑAL RECUPERADA', sub: 'Fuente desconocida • Clasificada', duration: '6:11' },
  ];

  window._musicTracks = tracks;
  window._musicCurrent = -1;
  window._musicPlaying = false;

  list.innerHTML = tracks.map((track, i) => `
    <div class="track-item" data-idx="${i}" onclick="selectTrack(${i})">
      <div class="track-item__num" id="track-num-${i}">${String(i + 1).padStart(2, '0')}</div>
      <div class="track-item__info">
        <div class="track-item__title">${track.title}</div>
        <div class="track-item__sub">${track.sub}</div>
      </div>
      <div class="track-item__duration">${track.duration}</div>
      <div class="track-item__glitch"></div>
    </div>
  `).join('');

  // Bind controls
  $('#play-btn').onclick = togglePlay;
  $('#stop-btn').onclick = stopTrack;
  $('#prev-btn').onclick = prevTrack;
  $('#next-btn').onclick = nextTrack;

  // Progress bar click
  const progressBar = document.querySelector('.progress-bar');
  if (progressBar) {
    progressBar.onclick = (e) => {
      const rect = progressBar.getBoundingClientRect();
      const pct = (e.clientX - rect.left) / rect.width;
      window._musicProgress = pct * 100;
      updateProgress();
    };
  }

  // Start progress simulation
  window._musicProgress = 0;
  window._musicInterval = null;
}

function selectTrack(idx) {
  window._musicCurrent = idx;
  window._musicPlaying = true;
  window._musicProgress = 0;

  // Update UI
  updateTrackUI();
  startPlayback();
}

function togglePlay() {
  if (window._musicCurrent === -1) {
    selectTrack(0);
    return;
  }

  window._musicPlaying = !window._musicPlaying;
  updatePlayButton();

  if (window._musicPlaying) {
    startPlayback();
  } else {
    pausePlayback();
  }
}

function stopTrack() {
  window._musicPlaying = false;
  window._musicProgress = 0;
  window._musicCurrent = -1;

  updateTrackUI();
  updatePlayButton();
  updateProgress();
  stopPlayback();
}

function prevTrack() {
  if (window._musicCurrent <= 0) {
    selectTrack(window._musicTracks.length - 1);
  } else {
    selectTrack(window._musicCurrent - 1);
  }
}

function nextTrack() {
  if (window._musicCurrent >= window._musicTracks.length - 1) {
    selectTrack(0);
  } else {
    selectTrack(window._musicCurrent + 1);
  }
}

function startPlayback() {
  stopPlayback();

  // Animate reels
  $('#tape-reel-left')?.classList.add('playing');
  $('#tape-reel-right')?.classList.add('playing');

  // Animate EQ
  const eq = $('#eq-container');
  if (eq) eq.classList.add('playing');

  // Update tape deck
  const deck = document.querySelector('.tape-deck');
  if (deck) deck.classList.add('playing');

  // Update status
  const status = $('#tape-info');
  if (status) {
    status.classList.add('playing');
    status.querySelector('span:last-child').textContent = 'REPRODUCIENDO';
  }

  // Update play button
  updatePlayButton();

  // Start progress
  window._musicInterval = setInterval(() => {
    window._musicProgress += 0.5;
    if (window._musicProgress >= 100) {
      window._musicProgress = 0;
      nextTrack();
    }
    updateProgress();
  }, 150);
}

function pausePlayback() {
  // Pause reels
  $('#tape-reel-left')?.classList.remove('playing');
  $('#tape-reel-right')?.classList.remove('playing');

  // Pause EQ
  const eq = $('#eq-container');
  if (eq) eq.classList.remove('playing');

  // Update status
  const status = $('#tape-info');
  if (status) {
    status.classList.remove('playing');
    status.querySelector('span:last-child').textContent = 'PAUSADO';
  }

  updatePlayButton();
}

function stopPlayback() {
  clearInterval(window._musicInterval);

  // Stop reels
  $('#tape-reel-left')?.classList.remove('playing');
  $('#tape-reel-right')?.classList.remove('playing');

  // Stop EQ
  const eq = $('#eq-container');
  if (eq) eq.classList.remove('playing');

  // Update deck
  const deck = document.querySelector('.tape-deck');
  if (deck) deck.classList.remove('playing');

  // Update status
  const status = $('#tape-info');
  if (status) {
    status.classList.remove('playing');
    status.querySelector('span:last-child').textContent = 'DETENIDO';
  }

  // Reset counter
  const counter = $('#tape-counter');
  if (counter) counter.textContent = '000';

  // Update play button
  updatePlayButton();
}

function updateTrackUI() {
  // Remove all active
  document.querySelectorAll('.track-item').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.track-item__num').forEach(el => {
    el.classList.remove('track-item__num--playing');
    el.innerHTML = el.id.replace('track-num-', '');
    const idx = parseInt(el.id.replace('track-num-', ''));
    el.innerHTML = String(idx + 1).padStart(2, '0');
  });

  const idx = window._musicCurrent;
  if (idx === -1) return;

  // Set active
  const activeItem = document.querySelector(`.track-item[data-idx="${idx}"]`);
  if (activeItem) {
    activeItem.classList.add('active');
    activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // Update number to mini eq
  const numEl = $(`#track-num-${idx}`);
  if (numEl) {
    numEl.innerHTML = `<div class="track-item__num--playing"><span></span><span></span><span></span></div>`;
  }

  // Update counter
  const counter = $('#tape-counter');
  if (counter) counter.textContent = String(idx + 1).padStart(3, '0');

  // Update time
  const track = window._musicTracks[idx];
  const timeTotal = $('#time-total');
  if (timeTotal && track) timeTotal.textContent = track.duration;
}

function updatePlayButton() {
  const btn = $('#play-btn');
  if (!btn) return;

  if (window._musicPlaying) {
    btn.textContent = '⏸';
    btn.classList.add('playing');
  } else {
    btn.textContent = '▶';
    btn.classList.remove('playing');
  }
}

function updateProgress() {
  const fill = $('#progress-fill');
  const head = $('#progress-head');
  const timeCurrent = $('#time-current');

  if (fill) fill.style.width = window._musicProgress + '%';
  if (head) head.style.left = window._musicProgress + '%';

  if (timeCurrent && window._musicCurrent >= 0) {
    const track = window._musicTracks[window._musicCurrent];
    if (track) {
      const parts = track.duration.split(':');
      const totalSec = parseInt(parts[0]) * 60 + parseInt(parts[1]);
      const currentSec = Math.floor((window._musicProgress / 100) * totalSec);
      const min = Math.floor(currentSec / 60);
      const sec = currentSec % 60;
      timeCurrent.textContent = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    }
  }
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

function openModal() {
  const mc = $('#modal');
  mc.classList.add('active');
  const inner = mc.querySelector('.modal-content') || mc.querySelector('[class*="modal"]');
  if (inner) inner.scrollTop = 0;
  window.scrollTo({ top: 0, behavior: 'instant' });
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
        <div class="char-modal__appearances-row">
          ${appearances.map(a => {
            const matchGame = window.games ? window.games.find(g => {
              const title = g.title.toLowerCase();
              const search = a.toLowerCase();
              return title.includes(search) || search.includes(title) ||
                     (g.id === 'fnaf-1' && (search.includes('fnaf 1') || search.includes('five nights at freddy\'s') && !search.includes('2') && !search.includes('3') && !search.includes('4') && !search.includes('world') && !search.includes('sister') && !search.includes('pizzeria') && !search.includes('ultimate') && !search.includes('vr') && !search.includes('security') && !search.includes('help wanted') && !search.includes('secret'))) ||
                     (g.id === 'fnaf-2' && (search.includes('fnaf 2') || search.includes('fna 2'))) ||
                     (g.id === 'fnaf-3' && (search.includes('fnaf 3') || search.includes('fna 3'))) ||
                     (g.id === 'fnaf-4' && (search.includes('fnaf 4') || search.includes('fna 4'))) ||
                     (g.id === 'fnaf-world' && search.includes('fnaf world')) ||
                     (g.id === 'sister-location' && (search.includes('sister location') || search.includes('sl'))) ||
                     (g.id === 'ffps' && (search.includes('pizzeria simulator') || search.includes('ffps') || search.includes('fazbear\'s pizzeria'))) ||
                     (g.id === 'ucn' && (search.includes('ultimate custom night') || search.includes('ucn'))) ||
                     (g.id === 'help-wanted' && (search.includes('help wanted') && !search.includes('2'))) ||
                     (g.id === 'security-breach' && (search.includes('security breach') || search.includes('sb'))) ||
                     (g.id === 'help-wanted-2' && search.includes('help wanted 2')) ||
                     (g.id === 'secret-of-the-mimic' && search.includes('secret'));
            }) : null;
            const gId = matchGame ? matchGame.id : null;
            const gImg = gId ? getImageUrl('games', gId) : null;
            return `
              <div class="char-appear-card${gId ? ' char-appear-card--linked' : ''}" ${gId ? `onclick="event.stopPropagation();navigateTo('games');setTimeout(()=>handleGameClick(null,'${gId}'),400);"` : ''}>
                ${gImg ? `
                  <div class="char-appear-card__cover">
                    <img src="${gImg}" alt="${a}" loading="lazy" onerror="this.style.display='none'">
                    <div class="char-appear-card__scanlines"></div>
                    ${gId ? '<div class="char-appear-card__play">▶</div>' : ''}
                  </div>
                ` : `<div class="char-appear-card__icon">🎮</div>`}
                <div class="char-appear-card__info">
                  <div class="char-appear-card__title">${a}</div>
                  ${matchGame ? `<div class="char-appear-card__year">${matchGame.year}</div>` : ''}
                </div>
              </div>
            `;
          }).join('')}
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
  const mc = $('#modal');
  mc.classList.add('active');
  const mcInner = mc.querySelector('.modal-content') || mc.querySelector('[class*="modal"]');
  if (mcInner) mcInner.scrollTop = 0;
  window.scrollTo({ top: 0, behavior: 'instant' });
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
            const charExists = window.characters && window.characters.find(ch => ch.id === slug);
            return `
              <div class="game-modal__char-card${charExists ? ' game-modal__char-card--link' : ''}" ${charExists ? `onclick="event.stopPropagation();$('#modal').classList.remove('active');navigateTo('characters');setTimeout(()=>showCharacterModal('${slug}'),400);"` : ''}>
                <div class="game-modal__char-avatar">
                  ${charImg ? `<img src="${charImg}" alt="${c}" loading="lazy">` : `<span class="char-fallback">${c.charAt(0)}</span>`}
                </div>
                <div class="game-modal__char-name">${c}</div>
                ${charExists ? '<div class="game-modal__char-arrow">▸</div>' : ''}
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

  openModal();
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

  openModal();
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
// HEADER STATUS BAR
// =============================================
function initHeaderStatus() {
  // Generate session ID
  const sessionId = '0x' + Math.random().toString(16).substr(2, 4).toUpperCase() + '-' + 
                    Math.random().toString(16).substr(2, 4).toUpperCase();
  const sessionEl = $('#hs-session-id');
  if (sessionEl) sessionEl.textContent = sessionId;

  // Update clock
  function updateClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    const clockEl = $('#hs-clock');
    if (clockEl) clockEl.textContent = `${h}:${m}:${s}`;
  }
  updateClock();
  setInterval(updateClock, 1000);

  // Random sync percentage
  const syncEl = $('#hs-sync');
  if (syncEl) {
    setInterval(() => {
      const sync = Math.floor(Math.random() * 5 + 95);
      syncEl.textContent = sync + '%';
    }, 3000);
  }
}

// =============================================
// VHS TIMESTAMP
// =============================================
function initVHSTimestamp() {
  const timestampEl = $('#vhs-timestamp');
  if (!timestampEl) return;

  function updateTimestamp() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    const ms = String(Math.floor(Math.random() * 99)).padStart(2, '0');
    timestampEl.textContent = `${h}:${m}:${s}:${ms}`;
  }
  updateTimestamp();
  setInterval(updateTimestamp, 100);
}

// =============================================
// DATABASE CARDS NAVIGATION
// =============================================
function initDatabaseCards() {
  $$('.db-card').forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const page = card.dataset.page;
      if (page) {
        navigateTo(page);
        // Scroll to top of content
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });
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
  const navKeys = ['home', 'characters', 'games', 'books', 'videos', 'history', 'music', 'blog', 'admin'];
  const num = parseInt(e.key);
  if (num >= 1 && num <= 9) {
    e.preventDefault();
    navigateTo(navKeys[num - 1]);
  }
});

// =============================================
// HERO COMMAND CENTER - REAL-TIME INDICATORS
// =============================================
function initHeroIndicators() {
  const uptimeEl = $('#hero-uptime');
  const powerEl = $('#hero-power');
  const startTime = Date.now();

  function updateUptime() {
    if (!uptimeEl) return;
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const h = String(Math.floor(elapsed / 3600)).padStart(2, '0');
    const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
    const s = String(elapsed % 60).padStart(2, '0');
    uptimeEl.textContent = h + ':' + m + ':' + s;
  }

  function updatePower() {
    if (!powerEl) return;
    const power = Math.floor(Math.random() * 6 + 82);
    powerEl.textContent = power + '%';
    const fill = document.querySelector('.hero-indicator:nth-child(3) .hero-indicator__fill');
    if (fill) fill.style.width = power + '%';
  }

  updateUptime();
  setInterval(updateUptime, 1000);
  setInterval(updatePower, 5000);
}

// =============================================
// INTERACTIVE CAMERA MAP
// =============================================
var cameraData = {
  'cam-01': {
    name: 'CAM-01 / PARTS & SERVICE',
    status: 'online', statusLabel: 'ONLINE',
    activity: 'Hace 5 min', signal: '94%', resolution: '480p',
    animatronics: ['ENDO-01', 'ENDO-02'],
    animatronicStatus: ['safe', 'safe']
  },
  'cam-02': {
    name: 'CAM-02 / SHOW STAGE',
    status: 'online', statusLabel: 'ONLINE',
    activity: 'Hace 2 min', signal: '98%', resolution: '720p',
    animatronics: ['FREDDY', 'BONNIE', 'CHICA'],
    animatronicStatus: ['alert', 'alert', 'alert']
  },
  'cam-03': {
    name: 'CAM-03 / DINING AREA',
    status: 'online', statusLabel: 'ONLINE',
    activity: 'Hace 1 min', signal: '99%', resolution: '720p',
    animatronics: [],
    animatronicStatus: []
  },
  'cam-04': {
    name: 'CAM-04 / BACKSTAGE',
    status: 'offline', statusLabel: 'OFFLINE',
    activity: 'Desconocida', signal: '0%', resolution: 'N/A',
    animatronics: [],
    animatronicStatus: []
  },
  'cam-05': {
    name: 'CAM-05 / OFFICE',
    status: 'online', statusLabel: 'ONLINE',
    activity: 'En vivo', signal: '100%', resolution: '1080p',
    animatronics: [],
    animatronicStatus: []
  },
  'cam-06': {
    name: 'CAM-06 / PRIZE CORNER',
    status: 'warning', statusLabel: 'ALERTA',
    activity: 'Hace 30 seg', signal: '72%', resolution: '720p',
    animatronics: ['MANGLE'],
    animatronicStatus: ['alert']
  },
  'cam-07': {
    name: 'CAM-07 / ARCADE',
    status: 'online', statusLabel: 'ONLINE',
    activity: 'Hace 8 min', signal: '91%', resolution: '720p',
    animatronics: [],
    animatronicStatus: []
  },
  'cam-08': {
    name: 'CAM-08 / KITCHEN',
    status: 'offline', statusLabel: 'OFFLINE',
    activity: 'Desconocida', signal: '0%', resolution: 'N/A',
    animatronics: [],
    animatronicStatus: []
  }
};

window.selectCamera = function(camId) {
  var cam = cameraData[camId];
  if (!cam) return;

  var nameEl = $('#cam-info-name');
  var statusEl = $('#cam-info-status');
  var activityEl = $('#cam-info-activity');
  var signalEl = $('#cam-info-signal');
  var animEl = $('#cam-info-animatronics');

  if (nameEl) nameEl.textContent = cam.name;

  if (statusEl) {
    statusEl.textContent = cam.statusLabel;
    statusEl.className = 'cam-info-card__status cam-info-card__status--' + cam.status;
  }

  if (activityEl) {
    activityEl.textContent = cam.activity;
    activityEl.className = 'cam-info-card__value';
    if (cam.status === 'online') activityEl.classList.add('cam-info-card__value--green');
    else if (cam.status === 'offline') activityEl.classList.add('cam-info-card__value--red');
    else activityEl.classList.add('cam-info-card__value--yellow');
  }

  if (signalEl) signalEl.textContent = cam.signal;

  if (animEl) {
    if (cam.animatronics.length === 0) {
      animEl.innerHTML = '<span class="cam-animatronic-tag cam-animatronic-tag--safe">NINGUNO DETECTADO</span>';
    } else {
      animEl.innerHTML = cam.animatronics.map(function(a, i) {
        var cls = cam.animatronicStatus[i] === 'safe' ? 'cam-animatronic-tag--safe' : '';
        return '<span class="cam-animatronic-tag ' + cls + '">' + a + '</span>';
      }).join('');
    }
  }

  // Highlight selected dot
  $$('.cam-dot').forEach(function(dot) {
    dot.style.opacity = dot.dataset.cam === camId ? '1' : '0.5';
  });
  setTimeout(function() {
    $$('.cam-dot').forEach(function(dot) { dot.style.opacity = '1'; });
  }, 2000);
};

// Initialize camera map
function initCameraMap() {
  $$('.cam-dot').forEach(function(dot) {
    dot.addEventListener('mouseenter', function() {
      var camId = dot.dataset.cam;
      if (camId) selectCamera(camId);
    });
  });

  // Default selection
  selectCamera('cam-02');
}

// =============================================
// EASTER EGGS
// =============================================
function renderEasterEggs(filter = 'all', search = '') {
  const grid = $('#ee-grid');
  if (!grid || !window.eastereggs) return;

  let filtered = [...window.eastereggs];
  if (filter !== 'all') {
    filtered = filtered.filter(e => e.game === filter);
  }
  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(e =>
      e.name.toLowerCase().includes(s) ||
      e.description.toLowerCase().includes(s) ||
      e.location.toLowerCase().includes(s)
    );
  }

  const gameLabels = {
    fnaf1: 'FNaF 1', fnaf2: 'FNaF 2', fnaf3: 'FNaF 3', fnaf4: 'FNaF 4',
    sisterlocation: 'Sister Location', ffps: 'FFPS', ucn: 'UCN',
    helpwanted: 'Help Wanted', securitybreach: 'Security Breach', varios: 'Cross-Game'
  };

  const typeIcons = { visual: '👁', mecanico: '⚙', narrativo: '📖', auditivo: '🔊' };
  const rarityColors = {
    común: '#00FF66', raro: '#00BFFF', extremadamente_raro: '#CC66FF', secreto_profundo: '#FF2222'
  };

  grid.innerHTML = filtered.map(ee => `
    <div class="ee-card" onclick="showEasterEggModal('${ee.id}')">
      <div class="ee-card__header">
        <span class="ee-card__id">${ee.id}</span>
        <span class="ee-card__type">${typeIcons[ee.type] || '❓'} ${ee.type.toUpperCase()}</span>
      </div>
      <div class="ee-card__name">${ee.name}</div>
      <div class="ee-card__game">${gameLabels[ee.game] || ee.game}</div>
      <div class="ee-card__location">${ee.location}</div>
      <div class="ee-card__desc">${ee.description.slice(0, 120)}...</div>
      <div class="ee-card__footer">
        <span class="ee-card__rarity" style="color:${rarityColors[ee.rarity] || '#888'}">${ee.rarity.replace(/_/g, ' ').toUpperCase()}</span>
      </div>
    </div>
  `).join('');

  // Bind filters
  const filterBtns = $$('#easteregg-filters .filter-tag');
  filterBtns.forEach(btn => {
    btn.onclick = () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderEasterEggs(btn.dataset.eefilter, $('#easteregg-search')?.value || '');
    };
  });

  const searchInput = $('#easteregg-search');
  if (searchInput && !searchInput._eeBound) {
    searchInput._eeBound = true;
    searchInput.addEventListener('input', (e) => {
      const activeFilter = document.querySelector('#easteregg-filters .filter-tag.active');
      renderEasterEggs(activeFilter?.dataset.eefilter || 'all', e.target.value);
    });
  }
}

window.showEasterEggModal = (id) => {
  const ee = window.eastereggs.find(e => e.id === id);
  if (!ee) return;
  const gameLabels = {
    fnaf1: 'FNaF 1', fnaf2: 'FNaF 2', fnaf3: 'FNaF 3', fnaf4: 'FNaF 4',
    sisterlocation: 'Sister Location', ffps: 'FFPS', ucn: 'UCN',
    helpwanted: 'Help Wanted', securitybreach: 'Security Breach', varios: 'Cross-Game'
  };
  const body = $('#modal-body');
  body.innerHTML = `
    <div class="ee-modal">
      <div class="ee-modal__header">
        <span class="ee-modal__id">${ee.id}</span>
        <h2 class="ee-modal__name">${ee.name}</h2>
        <div class="ee-modal__meta">
          <span class="ee-modal__game">${gameLabels[ee.game] || ee.game}</span>
          <span class="ee-modal__type">${ee.type.toUpperCase()}</span>
          <span class="ee-modal__rarity">${ee.rarity.replace(/_/g, ' ').toUpperCase()}</span>
        </div>
      </div>
      <div class="ee-modal__section">
        <div class="ee-modal__label">📍 UBICACIÓN</div>
        <div class="ee-modal__value">${ee.location}</div>
      </div>
      <div class="ee-modal__section">
        <div class="ee-modal__label">📝 DESCRIPCIÓN</div>
        <div class="ee-modal__value">${ee.description}</div>
      </div>
      <div class="ee-modal__section">
        <div class="ee-modal__label">🔧 ACTIVACIÓN</div>
        <ol class="ee-modal__steps">${ee.activation.map(a => `<li>${a}</li>`).join('')}</ol>
      </div>
      <div class="ee-modal__section">
        <div class="ee-modal__label">📖 SIGNIFICADO EN EL LORE</div>
        <div class="ee-modal__value">${ee.loreSignificance}</div>
      </div>
      ${ee.theories.length > 0 ? `
        <div class="ee-modal__section">
          <div class="ee-modal__label">🔮 TEORÍAS</div>
          <ul class="ee-modal__list">${ee.theories.map(t => `<li>${t}</li>`).join('')}</ul>
        </div>
      ` : ''}
      ${ee.connections.length > 0 ? `
        <div class="ee-modal__section">
          <div class="ee-modal__label">🔗 CONEXIONES</div>
          <div class="ee-modal__connections">${ee.connections.map(c => `<span class="ee-modal__conn-tag" onclick="showEasterEggModal('${c}')">${c}</span>`).join('')}</div>
        </div>
      ` : ''}
    </div>
  `;
  openModal();
};

// =============================================
// FAN ART GALLERY
// =============================================
function renderGallery() {
  const container = $('#gallery-container');
  if (!container || !window.galleryData) return;

  const g = window.galleryData;
  container.innerHTML = `
    <div class="gallery-filters">
      <div class="gallery-filter-group">
        <span class="gallery-filter-label">ESTILO:</span>
        ${g.styles.map((s, i) => `<button class="filter-tag ${i === 0 ? 'active' : ''}" data-gfilter-style="${s}">${s}</button>`).join('')}
      </div>
      <div class="gallery-filter-group">
        <span class="gallery-filter-label">PERSONAJE:</span>
        ${g.characters.map((c, i) => `<button class="filter-tag ${i === 0 ? 'active' : ''}" data-gfilter-char="${c}">${c}</button>`).join('')}
      </div>
    </div>
    <div class="gallery-grid" id="gallery-grid">
      ${g.featured.map(art => `
        <div class="gallery-card">
          <div class="gallery-card__img">
            <div class="gallery-card__fallback">${art.title.charAt(0)}</div>
            <div class="gallery-card__overlay">
              <div class="gallery-card__title">${art.title}</div>
            </div>
          </div>
          <div class="gallery-card__info">
            <div class="gallery-card__artist">por ${art.artist}</div>
            <div class="gallery-card__meta">${art.style} · ${art.game}</div>
            <div class="gallery-card__likes">❤ ${art.likes}</div>
          </div>
        </div>
      `).join('')}
    </div>
    <div class="gallery-empty" style="display:none;text-align:center;color:#555;padding:40px;font-family:'Press Start 2P',monospace;font-size:10px;">
      NO SE ENCONTRARON OBRAS CON ESTOS FILTROS
    </div>
  `;
}

// =============================================
// MAPA INTERACTIVO
// =============================================
function renderMap() {
  const container = $('#map-container');
  if (!container || !window.mapLocations) return;

  const dangerColors = { extremo: '#FF2222', alto: '#FF8C00', medio: '#E6B800', bajo: '#00FF66' };
  const statusLabels = { closed: 'CERRADO', destroyed: 'DESTRUIDO', abandoned: 'ABANDONADO', active: 'ACTIVO' };

  container.innerHTML = `
    <div class="map-grid">
      ${window.mapLocations.map(loc => `
        <div class="map-card" onclick="showMapModal('${loc.id}')" style="border-left: 3px solid ${dangerColors[loc.danger] || '#666'}">
          <div class="map-card__header">
            <div class="map-card__name">${loc.name}</div>
            <div class="map-card__year">${loc.year}</div>
          </div>
          <div class="map-card__type">${loc.type.toUpperCase()}</div>
          <div class="map-card__status" style="color:${dangerColors[loc.danger]}">${statusLabels[loc.status] || loc.status}</div>
          <div class="map-card__desc">${loc.description.slice(0, 100)}...</div>
          <div class="map-card__anims">${loc.animatronics.slice(0, 4).map(a => `<span class="map-card__anim-tag">${a}</span>`).join('')}${loc.animatronics.length > 4 ? `<span class="map-card__anim-tag">+${loc.animatronics.length - 4}</span>` : ''}</div>
        </div>
      `).join('')}
    </div>
  `;
}

window.showMapModal = (id) => {
  const loc = window.mapLocations.find(l => l.id === id);
  if (!loc) return;
  const dangerColors = { extremo: '#FF2222', alto: '#FF8C00', medio: '#E6B800', bajo: '#00FF66' };
  const statusLabels = { closed: 'CERRADO', destroyed: 'DESTRUIDO', abandoned: 'ABANDONADO', active: 'ACTIVO' };
  const body = $('#modal-body');
  body.innerHTML = `
    <div class="map-modal">
      <div class="map-modal__header" style="border-left: 4px solid ${dangerColors[loc.danger]}">
        <h2 class="map-modal__name">${loc.name}</h2>
        <div class="map-modal__meta">
          <span>${loc.type.toUpperCase()}</span>
          <span>${loc.year}</span>
          <span style="color:${dangerColors[loc.danger]}">${statusLabels[loc.status]}</span>
          <span>PELIGRO: ${loc.danger.toUpperCase()}</span>
        </div>
      </div>
      <div class="map-modal__section">
        <div class="map-modal__label">📝 DESCRIPCIÓN</div>
        <div class="map-modal__value">${loc.description}</div>
      </div>
      <div class="map-modal__section">
        <div class="map-modal__label">⚡ EVENTOS</div>
        <ul class="map-modal__list">${loc.events.map(e => `<li>${e}</li>`).join('')}</ul>
      </div>
      <div class="map-modal__section">
        <div class="map-modal__label">🎭 ANIMATRÓNICOS</div>
        <div class="map-modal__tags">${loc.animatronics.map(a => `<span class="map-modal__tag">${a}</span>`).join('')}</div>
      </div>
      <div class="map-modal__section">
        <div class="map-modal__label">🔑 SECRETOS</div>
        <ul class="map-modal__list">${loc.secrets.map(s => `<li>${s}</li>`).join('')}</ul>
      </div>
    </div>
  `;
  openModal();
};

// =============================================
// QUIZ
// =============================================
function renderQuiz() {
  const container = $('#quiz-container');
  if (!container || !window.quizData) return;
  container.innerHTML = `
    <div class="quiz-menu">
      <div class="quiz-menu-card" onclick="startPersonalityQuiz()">
        <div class="quiz-menu-card__icon">🐻</div>
        <div class="quiz-menu-card__title">¿QUÉ ANIMATRÓNICO ERES?</div>
        <div class="quiz-menu-card__desc">10 preguntas para descubrir tu personalidad FNAF</div>
      </div>
      <div class="quiz-menu-card" onclick="startTriviaQuiz('easy')">
        <div class="quiz-menu-card__icon">❓</div>
        <div class="quiz-menu-card__title">TRIVIA FÁCIL</div>
        <div class="quiz-menu-card__desc">Preguntas básicas sobre la saga</div>
      </div>
      <div class="quiz-menu-card" onclick="startTriviaQuiz('medium')">
        <div class="quiz-menu-card__icon">⚠️</div>
        <div class="quiz-menu-card__title">TRIVIA MEDIA</div>
        <div class="quiz-menu-card__desc">Conocimiento intermedio del lore</div>
      </div>
      <div class="quiz-menu-card" onclick="startTriviaQuiz('expert')">
        <div class="quiz-menu-card__icon">💀</div>
        <div class="quiz-menu-card__title">TRIVIA EXPERTA</div>
        <div class="quiz-menu-card__desc">Solo para verdaderos expertos</div>
      </div>
      <div class="quiz-menu-card" onclick="startTriviaQuiz('hidden')">
        <div class="quiz-menu-card__icon">🔮</div>
        <div class="quiz-menu-card__title">TRIVIA SECRETA</div>
        <div class="quiz-menu-card__desc">Los secretos más oscuros del lore</div>
      </div>
    </div>
    <div id="quiz-active" style="display:none;"></div>
  `;
}

let _quizState = { current: 0, answers: [], type: '', difficulty: '' };

window.startPersonalityQuiz = () => {
  _quizState = { current: 0, answers: [], type: 'personality', difficulty: '' };
  document.querySelector('.quiz-menu').style.display = 'none';
  renderQuizQuestion();
};

window.startTriviaQuiz = (diff) => {
  _quizState = { current: 0, answers: [], type: 'trivia', difficulty: diff };
  document.querySelector('.quiz-menu').style.display = 'none';
  renderQuizQuestion();
};

function renderQuizQuestion() {
  const el = $('#quiz-active');
  if (!el) return;
  el.style.display = 'block';

  if (_quizState.type === 'personality') {
    const qs = window.quizData.personality.questions;
    if (_quizState.current >= qs.length) { renderPersonalityResult(); return; }
    const q = qs[_quizState.current];
    el.innerHTML = `
      <div class="quiz-question">
        <div class="quiz-question__num">PREGUNTA ${_quizState.current + 1} / ${qs.length}</div>
        <div class="quiz-question__progress"><div class="quiz-question__fill" style="width:${(_quizState.current / qs.length) * 100}%"></div></div>
        <div class="quiz-question__text">${q.text}</div>
        <div class="quiz-question__options">
          ${q.options.map((o, i) => `<button class="quiz-option" onclick="answerPersonality(${i})">${o.text}</button>`).join('')}
        </div>
      </div>
    `;
  } else {
    const qs = window.quizData.trivia[_quizState.difficulty] || [];
    if (_quizState.current >= qs.length) { renderTriviaResult(); return; }
    const q = qs[_quizState.current];
    el.innerHTML = `
      <div class="quiz-question">
        <div class="quiz-question__num">PREGUNTA ${_quizState.current + 1} / ${qs.length}</div>
        <div class="quiz-question__progress"><div class="quiz-question__fill" style="width:${(_quizState.current / qs.length) * 100}%"></div></div>
        <div class="quiz-question__text">${q.q}</div>
        <div class="quiz-question__options">
          ${q.options.map((o, i) => `<button class="quiz-option" onclick="answerTrivia(${i}, ${q.answer})">${o}</button>`).join('')}
        </div>
      </div>
    `;
  }
}

window.answerPersonality = (idx) => {
  const q = window.quizData.personality.questions[_quizState.current];
  _quizState.answers.push(q.options[idx].values);
  _quizState.current++;
  renderQuizQuestion();
};

window.answerTrivia = (idx, correct) => {
  _quizState.answers.push(idx === correct);
  _quizState.current++;
  renderQuizQuestion();
};

function renderPersonalityResult() {
  const el = $('#quiz-active');
  const totals = { fear: 0, aggression: 0, curiosity: 0, survival: 0 };
  _quizState.answers.forEach(a => {
    Object.keys(a).forEach(k => { totals[k] = (totals[k] || 0) + a[k]; });
  });
  const max = Object.entries(totals).sort((a, b) => b[1] - a[1])[0][0];
  const charMap = { fear: 'goldenFreddy', aggression: 'foxy', curiosity: 'bonnie', survival: 'chica' };
  const result = window.quizData.personality.results[charMap[max] || 'freddy'];
  el.innerHTML = `
    <div class="quiz-result">
      <div class="quiz-result__emoji">${result.emoji}</div>
      <div class="quiz-result__title">ERES: ${result.name}</div>
      <div class="quiz-result__desc">${result.description}</div>
      <div class="quiz-result__lore"><strong>LORE:</strong> ${result.lore}</div>
      <div class="quiz-result__behavior"><strong>COMPORTAMIENTO:</strong> ${result.behavior}</div>
      <div class="quiz-result__stats">
        ${Object.entries(result.stats).map(([k, v]) => `
          <div class="quiz-stat">
            <div class="quiz-stat__label">${k.toUpperCase()}</div>
            <div class="quiz-stat__bar"><div class="quiz-stat__fill" style="width:${v}%"></div></div>
            <div class="quiz-stat__val">${v}%</div>
          </div>
        `).join('')}
      </div>
      <button class="quiz-restart" onclick="renderQuiz()">VOLVER A INTENTAR</button>
    </div>
  `;
}

function renderTriviaResult() {
  const el = $('#quiz-active');
  const correct = _quizState.answers.filter(Boolean).length;
  const total = _quizState.answers.length;
  const pct = Math.round((correct / total) * 100);
  el.innerHTML = `
    <div class="quiz-result">
      <div class="quiz-result__emoji">${pct >= 80 ? '🏆' : pct >= 50 ? '👍' : '💀'}</div>
      <div class="quiz-result__title">${correct} / ${total} CORRECTAS</div>
      <div class="quiz-result__desc">Has acertado el ${pct}% de las preguntas. ${pct >= 80 ? 'Eres un verdadero experto en FNAF!' : pct >= 50 ? 'Buen conocimiento, pero hay espacio para mejorar.' : 'Estudia más el lore de FNAF e intenta de nuevo.'}</div>
      <button class="quiz-restart" onclick="renderQuiz()">VOLVER A INTENTAR</button>
    </div>
  `;
}

// =============================================
// SIMULADOR DE OFICINA
// =============================================
function renderSimulator() {
  const container = $('#sim-container');
  if (!container || !window.simulatorConfig) return;
  const cfg = window.simulatorConfig;
  container.innerHTML = `
    <div class="sim-intro">
      <div class="sim-intro__title">FIVE NIGHTS AT FREDDY'S</div>
      <div class="sim-intro__sub">SIMULADOR DE OFICINA</div>
      <div class="sim-intro__desc">Sobrevive 6 noches enfrentando a los animatrónicos. Usa las cámaras, puertas y luces.</div>
      <div class="sim-intro__controls">
        <div class="sim-night-select">
          ${[1,2,3,4,5,6].map(n => `<button class="sim-night-btn" onclick="startSimNight(${n})">NOCHE ${n}</button>`).join('')}
        </div>
      </div>
    </div>
    <div id="sim-game" style="display:none;"></div>
  `;
}

let _simState = { night: 1, power: 100, camera: null, leftDoor: false, rightDoor: false, leftLight: false, rightLight: false, animatronics: [], tick: null };

window.startSimNight = (night) => {
  const cfg = window.simulatorConfig;
  _simState = {
    night,
    power: 100,
    camera: null,
    leftDoor: false,
    rightDoor: false,
    leftLight: false,
    rightLight: false,
    animatronics: cfg.animatronics.map(a => ({ ...a, level: a.ai[night - 1] || 0, pos: 'stage' })),
    tick: null
  };
  document.querySelector('.sim-intro').style.display = 'none';
  const el = $('#sim-active') || document.createElement('div');
  el.id = 'sim-active';
  el.style.display = 'block';
  if (!el.parentElement) $('#sim-container').appendChild(el);
  renderSimUI();
  _simState.tick = setInterval(simTick, 2000);
};

function renderSimUI() {
  const el = $('#sim-active');
  const cfg = window.simulatorConfig;
  if (!el) return;
  el.innerHTML = `
    <div class="sim-office">
      <div class="sim-hud">
        <div class="sim-hud-left">
          <span class="sim-time">12:00 AM</span>
          <span class="sim-night-label">NOCHE ${_simState.night}</span>
        </div>
        <div class="sim-hud-right">
          <div class="sim-power-bar">
            <div class="sim-power-label">ENERGÍA: ${Math.round(_simState.power)}%</div>
            <div class="sim-power-fill" style="width:${_simState.power}%;background:${_simState.power < 25 ? '#FF2222' : '#00FF66'}"></div>
          </div>
        </div>
      </div>
      <div class="sim-view">
        ${_simState.camera ? `
          <div class="sim-cam-view">
            <div class="sim-cam-header">${cfg.cameras.find(c => c.id === _simState.camera)?.name || _simState.camera}</div>
            <div class="sim-cam-feed">
              <div class="sim-cam-static"></div>
              ${_simState.animatronics.filter(a => {
                const cam = cfg.cameras.find(c => c.id === _simState.camera);
                return cam && cam.animatronics.includes(a.id);
              }).map(a => `<div class="sim-cam-anim" style="left:${30 + Math.random() * 40}%;top:${20 + Math.random() * 40}%">${a.icon}</div>`).join('')}
            </div>
            <div class="sim-cam-grid">
              ${cfg.cameras.map(c => `<div class="sim-cam-cell ${c.id === _simState.camera ? 'active' : ''}" onclick="switchSimCam('${c.id}')">${c.name.split(' - ')[0]}</div>`).join('')}
            </div>
          </div>
        ` : `
          <div class="sim-office-view">
            <div class="sim-office-main">
              <div class="sim-office-label">OFICINA DEL GUARDIA</div>
            </div>
            <div class="sim-office-doors">
              <div class="sim-door-panel">
                <button class="sim-door-btn ${_simState.leftDoor ? 'active' : ''}" onclick="toggleSimDoor('left')">🚪 PUERTA IZQ</button>
                <button class="sim-light-btn ${_simState.leftLight ? 'active' : ''}" onclick="toggleSimLight('left')">💡 LUZ IZQ</button>
              </div>
              <div class="sim-door-panel">
                <button class="sim-door-btn ${_simState.rightDoor ? 'active' : ''}" onclick="toggleSimDoor('right')">🚪 PUERTA DER</button>
                <button class="sim-light-btn ${_simState.rightLight ? 'active' : ''}" onclick="toggleSimLight('right')">💡 LUZ DER</button>
              </div>
            </div>
          </div>
        `}
      </div>
      <div class="sim-controls">
        <button class="sim-cam-toggle" onclick="toggleSimCam()">📷 ${_simState.camera ? 'CERRAR CÁMARAS' : 'ABRIR CÁMARAS'}</button>
      </div>
    </div>
  `;
}

window.toggleSimCam = () => {
  _simState.camera = _simState.camera ? null : 'cam-1a';
  renderSimUI();
};

window.switchSimCam = (camId) => {
  _simState.camera = camId;
  _simState.power = Math.max(0, _simState.power - 1);
  renderSimUI();
};

window.toggleSimDoor = (side) => {
  if (side === 'left') _simState.leftDoor = !_simState.leftDoor;
  else _simState.rightDoor = !_simState.rightDoor;
  _simState.power = Math.max(0, _simState.power - 1);
  renderSimUI();
};

window.toggleSimLight = (side) => {
  if (side === 'left') _simState.leftLight = !_simState.leftLight;
  else _simState.rightLight = !_simState.rightLight;
  _simState.power = Math.max(0, _simState.power - 0.5);
  renderSimUI();
};

function simTick() {
  if (_simState.power <= 0) {
    clearInterval(_simState.tick);
    const el = $('#sim-active');
    if (el) el.innerHTML = '<div class="sim-gameover"><div class="sim-gameover__title">SE TE ACABÓ LA ENERGÍA</div><div class="sim-gameover__sub">Los animatrónicos te encontraron...</div><button class="quiz-restart" onclick="renderSimulator()">INTENTAR DE NUEVO</button></div>';
    return;
  }
  _simState.power -= (_simState.leftDoor ? 1 : 0) + (_simState.rightDoor ? 1 : 0) + (_simState.leftLight ? 0.5 : 0) + (_simState.rightLight ? 0.5 : 0) + (_simState.camera ? 1 : 0.5);
  _simState.power = Math.max(0, _simState.power);
  renderSimUI();
}

// =============================================
// TIMELINE EXTENDIDA
// =============================================
function renderTimelineFull() {
  const container = $('#tfl-container');
  if (!container || !window.timelineFull || !window.eras) return;

  let html = `
    <div class="tfl-filters">
      <button class="filter-tag active" data-tflfilter="all">TODAS LAS ERAS</button>
      ${window.eras.map(e => `<button class="filter-tag" data-tflfilter="${e.id}">${e.name}</button>`).join('')}
      <button class="filter-tag" data-tflfilter="teoria">TEORÍAS</button>
      <button class="filter-tag" data-tflfilter="fanon">FANON</button>
    </div>
    <div class="tfl-timeline" id="tfl-timeline">
  `;

  const sorted = [...window.timelineFull].sort((a, b) => {
    const ay = parseInt(a.year.replace(/[^0-9-]/g, '')) || 0;
    const by = parseInt(b.year.replace(/[^0-9-]/g, '')) || 0;
    return ay - by;
  });

  sorted.forEach(item => {
    const era = window.eras.find(e => e.id === item.era);
    const catColors = { canon: '#00FF66', teoria: '#CC66FF', fanon: '#E6B800' };
    const color = catColors[item.category] || '#888';
    html += `
      <div class="tfl-item" data-era="${item.era}" data-cat="${item.category}">
        <div class="tfl-item__dot" style="background:${color};box-shadow:0 0 8px ${color}80"></div>
        <div class="tfl-item__connector"></div>
        <div class="tfl-item__card">
          <div class="tfl-item__year" style="color:${color}">${item.year}</div>
          <div class="tfl-item__era" style="border-color:${color}">${era ? era.name : item.era}</div>
          <div class="tfl-item__title">${item.title}</div>
          <div class="tfl-item__desc">${item.description}</div>
          <div class="tfl-item__meta">
            <span class="tfl-item__cert">CERTIDUMBRE: ${item.certainty}%</span>
            <span class="tfl-item__cat" style="color:${color}">${item.category.toUpperCase()}</span>
          </div>
          ${item.files.length > 0 ? `<div class="tfl-item__files">${item.files.map(f => `<span class="tfl-item__file">📄 ${f}</span>`).join('')}</div>` : ''}
        </div>
      </div>
    `;
  });

  html += '</div>';
  container.innerHTML = html;

  // Bind filters
  $$('#page-timeline-full .filter-tag').forEach(btn => {
    btn.onclick = () => {
      $$('#page-timeline-full .filter-tag').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.tflfilter;
      $$('.tfl-item').forEach(item => {
        if (f === 'all') { item.style.display = ''; return; }
        item.style.display = (item.dataset.era === f || item.dataset.cat === f) ? '' : 'none';
      });
    };
  });
}

console.log('%cTHE FAZBEAR FILES', 'font-size:24px;color:#FF2222;font-weight:bold;');
console.log('%cAcceso no autorizado detectado.', 'font-size:14px;color:#00FF66;');
console.log('%cEste sistema contiene material clasificado de Fazbear Entertainment.', 'font-size:12px;color:#888;');
