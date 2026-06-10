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
  initHeaderStatus();
  initVHSTimestamp();
  initDatabaseCards();
  initHeroIndicators();
  initCameraMap();

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
    case 'videos':
      renderVideos();
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
function renderVideos() {
  const grid = $('#videos-grid');
  const videos = [
    { id: 'OUxQJxMQORA', title: 'FNaF 1 - Todos los Jumpscares', category: 'JUMPSCARES', desc: 'Compilacion completa de jumpscares de FNaF 1' },
    { id: 'n0JdgL-VmR0', title: 'FNaF 2 - Todos los Jumpscares', category: 'JUMPSCARES', desc: 'Todos los jumpscares de FNaF 2 incluyendo Toy y Withered' },
    { id: 'X9QNFwyeBZ8', title: 'FNaF 3 - Springtrap Jumpscare', category: 'JUMPSCARES', desc: 'El jumpscare de Springtrap en Fazbear\'s Fright' },
    { id: '4qAv04yp5co', title: 'FNaF 4 - Todos los Jumpscares', category: 'JUMPSCARES', desc: 'Jumpscares de Nightmare Freddy, Bonnie, Chica, Foxy y Fredbear' },
    { id: '9TI0CHQFqdA', title: 'Security Breach - Jumpscares', category: 'JUMPSCARES', desc: 'Jumpscares de Glamrock animatronics y DJ Music Man' },
    { id: 'HEmQ_RP-ue4', title: '200+ Jumpscares - Todos los Juegos', category: 'JUMPSCARES', desc: 'Mega compilacion de mas de 200 jumpscares de toda la franquicia' },
    { id: 'h85S0xv4E5Q', title: 'FNaF 2 - Jumpscare Compilation Clasico', category: 'JUMPSCARES', desc: 'Compilacion clasica de FNaF 2 con Toy y Mangle' },
    { id: 'VMJErb9-Qxo', title: 'Battington FNAF VHS Tapes', category: 'ANALOGICO', desc: 'La serie de terror analogico mas famosa de FNAF' },
    { id: 'iOhD6pv2s-Y', title: 'FNaF 1 Ambience - 1 Hora', category: 'AMBIENTAL', desc: 'Ambientacion extendida de FNaF 1 para dormir o estudiar' },
    { id: '5Evk6JFMzGg', title: 'FNaF 1 - Power Out Ambience', category: 'AMBIENTAL', desc: 'La ambientacion iconica cuando se acaba la energia' },
    { id: 'YQ940SRcp-U', title: 'FNaF 3 - Office Ambience', category: 'AMBIENTAL', desc: 'Atmosfera de la oficina de Fazbear\'s Fright' },
    { id: 'fJIhjGSD3-0', title: 'FNaF Ambience Extended', category: 'AMBIENTAL', desc: 'Coleccion extendida de ambientacion de los juegos originales' },
    { id: 'moQp0Bu2Grs', title: 'FNaF Movie - Animatronics Jumpscare', category: 'PELICULA', desc: 'Detras de escena de los animatronicos de la pelicula' },
    { id: 'Ff7zoYvlin4', title: 'Security Breach - Full Game Walkthrough', category: 'GAMEPLAY', desc: 'Walkthrough completo sin commentary de Security Breach' },
    { id: 'OF-5gCadqyU', title: 'Security Breach - Full Game No Commentary', category: 'GAMEPLAY', desc: 'Juego completo mostrando todas las areas y encuentros' },
    { id: 'ocWVd7ZXlsY', title: 'Help Wanted VR - Full Gameplay', category: 'GAMEPLAY', desc: 'Experiencia completa de Help Wanted en VR' },
    { id: 'xYwP_pvM6u0', title: 'Security Breach Ruin - Full DLC', category: 'GAMEPLAY', desc: 'Walkthrough completo del DLC Ruin jugando como Cassie' },
    { id: 'gWOXSh4-Iuc', title: 'FNAF - The ULTIMATE Timeline', category: 'LORE', desc: 'Game Theory explica la linea temporal completa de FNAF' },
    { id: 'SugbaghWhqg', title: 'Inicio de la Timeline FNAF', category: 'LORE', desc: 'Explicacion del inicio de la cronologia y los primeros muertos' },
  ];

  const categories = ['TODOS', 'JUMPSCARES', 'ANALOGICO', 'AMBIENTAL', 'PELICULA', 'GAMEPLAY', 'LORE'];

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
    <div class="videos-list" id="videos-list">
      ${videos.map(v => `
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
      `).join('')}
    </div>
  `;

  $$('#videos-filters .filter-tag').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('#videos-filters .filter-tag').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.vfilter;
      $$('.video-card').forEach(card => {
        if (cat === 'TODOS' || card.dataset.category === cat) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

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

console.log('%cTHE FAZBEAR FILES', 'font-size:24px;color:#FF2222;font-weight:bold;');
console.log('%cAcceso no autorizado detectado.', 'font-size:14px;color:#00FF66;');
console.log('%cEste sistema contiene material clasificado de Fazbear Entertainment.', 'font-size:12px;color:#888;');
