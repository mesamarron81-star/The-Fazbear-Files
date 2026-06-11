# AGENTS.md — Proyecto FNAF: The Fazbear Files

## Session: Fangames — Imágenes, Modal y Enlaces

### Goal
Mejorar la sección de Fangames: agregar imágenes de portada y personajes, crear sección de personajes dentro del modal de fangames con imágenes/descripciones/roles, implementar enlaces bidireccionales entre Fangames ↔ Characters, y aplicar mejoras visuales.

### Constraints & Preferences
- **SOLO la sección de Fangames puede ser modificada** — no se modifican otras secciones
- Cada fangame DEBE tener imágenes de portada
- Cada animatrónico dentro de fangames DEBE tener imágenes
- Sin imágenes genéricas, sin imágenes rotas, sin placeholders vacíos
- Navegación bidireccional: fangame → detalle de personaje, personaje → fangame
- Las tarjetas de personajes dentro de fangames deben mostrar: nombre, imagen, descripción, rol
- Visual: tarjetas, thumbnails, efectos hover, animaciones suaves, responsive
- Todas las descripciones en español

### Done
- **27 imágenes de portada de fangames** agregadas a `data/images.js` desde FNAF Fangame Wiki
- **33 imágenes de personajes de fangames** agregadas a `data/images.js` incluyendo:
  - FNaC: Candy, Cindy, Penguin, Old Candy
  - POPGOES: Popgoes, Blackrabbit, Stone, Manora
  - TJOC: Ignited Freddy, Bonnie, Chica, Foxy, Golden Freddy
  - ONaF: Flumpty, Birthday Boy Blam, Golden Flumpty
- **Modal de fangames mejorado** (`js/main.js:843-930`):
  - Sección "PERSONAJES Y ANIMATRONICOS" con tarjetas de personajes
  - Imágenes de personajes con fallback a initial letter
  - Badge de rol por personaje (`game-modal__char-role`)
  - Descripción del personaje (`game-modal__char-desc`)
  - Click en personaje abre detalle en sección de Personajes
  - Botón "VER TODOS LOS PERSONAJES EN LA SECCION DE PERSONAJES"
- **Enlaces bidireccionales** (`js/main.js:937-965`):
  - `showCharacterFromFangame(charId)` — Abre detalle de personaje desde modal de fangame
  - `navigateToCharacters(fangameId)` — Navega a sección de Personajes filtrada por fangame
- **CSS mejorado** (`css/style.css:4529-4620`):
  - `.game-modal__char-role` — Badge de rol con color accent
  - `.game-modal__char-desc` — Descripción con line-clamp
  - `.game-modal__char-nav` — Botón de navegación con hover effects
  - `.game-modal__char-info` — Contenedor de información del personaje

### Fangame Image Coverage
| Status | Count | IDs |
|--------|-------|-----|
| ✅ With Image | 35 | fnac-1..4, fnac-remastered, onaflumpty-1..3, popgoes, popgoes-evergreen, popgoes-arcade, tjoc, tjoc-reborn, tjoc-story-mode, fnaf-plus, dayshift, dayshift-2, final-nights, super-fnaf, fredbears-fright, sinister-turmoil, fnaf-treasure-island, jolly, jolly-4, jrs, babys-nightmare-circus, obligus-casa, banshee, fnaw-rewritten, bubbas-diner, graveyard-shift, dormitabis, fnab-fan-game, post-shift-2, animators-hell |
| ❌ No Image | 6 | tyke-and-sons, trtf, frickbears, after-hours-cody, fnaf-blood-gears, fnaw-friedrichs |

### Character Image Coverage
| Category | With Image | Total |
|----------|-----------|-------|
| FNaC Characters | 7 | 22 |
| POPGOES Characters | 5 | 6 |
| TJOC Characters | 5 | 5 |
| ONaF Characters | 3 | 6 |
| Other Fangames | 13 | 26 |
| **Total** | **33** | **65** |

### Relevant Files
- `index.html` — Fangames grid section
- `css/style.css` — .fangame-card, .fangame-modal, .game-modal__char-* styles
- `js/main.js` — renderFangames(), showFangameModal(), showCharacterFromFangame(), navigateToCharacters()
- `data/fangames.js` — 41 fangames con datos y URLs corregidas
- `data/images.js` — window.images.fangames + fangame character images
- `data/characters.js` — ~401 personajes (253 originales + 83 FNaF AR + 65 fangame)

### Known Issues
- 6 fangames sin imágenes (tyke-and-sons, trtf, frickbears, after-hours-cody, fnaf-blood-gears, fnaw-friedrichs)
- 32 personajes de fangames sin imágenes específicas (usan fallback a initial letter)
- Texto en games.js tiene encoding roto (?? en vez de acentos) — preexistente

---

## Session: Videojuegos + Modal + Imágenes (Original)

### Goal
Implementar sección de videojuegos con temática FNAF (cámaras de seguridad), modal mejorado con colores por juego, e imágenes de portada desde la wiki Fandom.

### Done
- **HTML**: `#games-grid` con clase `games-grid`
- **CSS** (`style.css:1462+`): sistema `.game-card` con:
  - Colores temáticos por juego via CSS variables (`--card-accent`, `--card-glow`)
  - 12 paletas: FNaF1 verde, FNaF2 azul, FNaF3 amarillo, FNaF4 rojo, FNaF World morado, SL rosa, FFPS naranja, UCN rojo, HW cyan, SB magenta, HW2 azul-violeta, SotM turquesa
  - Borde superior coloreado con glow
  - Efecto glitch + static overlay al hover
  - Scanline animado + esquinas CRT
  - Jumpscare (scale + shake)
  - Neon pulse per-game
  - Imágenes brightness(0.75)→1 en hover, saturate(1.1)
- **JS** (`main.js:320`): `renderGames()` con `data-game="${game.id}"` en cada card
- **JS** (`main.js:809`): `showGameModal()` reescrito:
  - Hero split (imagen + info), galería thumbnails con nav
  - Tags de plataforma, botón Steam (`target="_blank"`)
  - Secciones: Mecánicas, Conexiones, Datos de Archivo, Personajes
  - `data-game-modal` attribute para CSS variables
- **CSS** (`style.css:2430+`): modal-content con per-game colors, scrollbar custom, hero image scanlines
- **Imágenes** (`data/images.js`): 12 portadas desde Fandom Wiki
- **Steam URLs** (`data/games.js`): 10 de 12 juegos con enlace a Steam

### Image URLs
| Game ID | Source |
|---------|--------|
| fnaf-1 | FNaF1.jpg |
| fnaf-2 | FNaF_2_Switch.jpg |
| fnaf-3 | FNaF_3_Switch.jpg |
| fnaf-4 | FNaF_4_Switch.jpg |
| fnaf-world | FNaFWorld-SteamHeader.jpg |
| sister-location | FNAFSL-NintendoSwitch.jpg |
| ffps | FFPS_Steam_Header.jpg |
| ucn | UCN-header.jpg |
| help-wanted | FNaFHW-SteamCoverArt.jpg |
| security-breach | Security_breach_poster.jpg |
| help-wanted-2 | HelpWanted2_KeyArt_WithLogo.jpg |
| secret-of-the-mimic | SecretoftheMimic_PSIcon2.jpg |

### Relevant Files
- `index.html` — #games-grid class
- `css/style.css` — .game-card security camera system + game-modal system
- `js/main.js` — renderGames(), handleGameClick(), showGameModal()
- `data/games.js` — datos de 12 juegos con steamUrl y platforms
- `data/images.js` — window.images.games con las 12 portadas

### Known Issues
- Texto en games.js tiene encoding roto (?? en vez de acentos) — preexistente
