# AGENTS.md — Proyecto FNAF: The Fazbear Files

## Session: Videojuegos + Modal + Imágenes

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
