window.timelineFull = [
  // PRE-HISTORY
  { id: 'th-001', year: '~1940', era: 'pre-history', category: 'canon', title: 'Nacimiento de Henry Emily', description: 'Henry Emily, genio creativo y cofundador de Fazbear Entertainment, nace. Diseñó los animatrónicos originales y la Marioneta.', certainty: 70, connections: ['th-002', 'th-005'], files: ['Archivo Familiar'] },
  { id: 'th-002', year: '~1940', era: 'pre-history', category: 'canon', title: 'Nacimiento de William Afton', description: 'William Afton, cofundador y antagonista principal, nace. Su obsesión con la inmortalidad lo llevaría a cometer atrocidades.', certainty: 70, connections: ['th-001', 'th-003'], files: ['Archivo Criminal'] },
  { id: 'th-003', year: '~1965', era: 'pre-history', category: 'canon', title: 'Fundación de Fazbear Entertainment', description: 'Henry Emily y William Afton fundan Fazbear Entertainment y abren Fredbear\'s Family Diner.', certainty: 80, connections: ['th-001', 'th-002', 'th-004'], files: ['Registro Corporativo'] },

  // FREDBEAR ERA
  { id: 'th-004', year: '~1970', era: 'fredbear', category: 'canon', title: 'Apertura de Fredbear\'s Family Diner', description: 'Primer restaurante con los animatrónicos Fredbear y Spring Bonnie. Henry y William inaugurAN el local.', certainty: 85, connections: ['th-003', 'th-005', 'th-006'], files: ['Documento de Apertura', 'Foto del Local'] },
  { id: 'th-005', year: '~1975', era: 'fredbear', category: 'canon', title: 'Creación de la Marioneta', description: 'Henry Emily diseña la Marioneta (The Puppet) como su creación más avanzada, diseñada para proteger a los niños.', certainty: 75, connections: ['th-001', 'th-008'], files: ['Planos de Diseño'] },
  { id: 'th-006', year: '~1980', era: 'fredbear', category: 'canon', title: 'Nacimiento de los hijos Afton', description: 'William y sus hijos nacen: Elizabeth, Michael y el Crying Child. La familia Afton comienza su tragedia.', certainty: 80, connections: ['th-002', 'th-007'], files: ['Registro Familiar'] },
  { id: 'th-007', year: '1983', era: 'fredbear', category: 'canon', title: 'Asesinato de Charlotte Emily', description: 'William Afton asesina a Charlotte "Charlie" Emily, hija de Henry, fuera de Fredbear\'s. Su alma posee a la Marioneta.', certainty: 90, connections: ['th-001', 'th-008', 'th-009'], files: ['Reporte Policial', 'Grabación de Seguridad'] },
  { id: 'th-008', year: '1983', era: 'fredbear', category: 'canon', title: 'The Bite of \'83', description: 'El hermano mayor de los Afton coloca al Crying Child dentro de la boca de Fredbear. El mecanismo se activa y aplasta su cráneo.', certainty: 95, connections: ['th-004', 'th-006', 'th-007'], files: ['Minijuego Fredbear\'s', 'Testigo Ocular'] },

  // MISSING CHILDREN ERA
  { id: 'th-009', year: '1985', era: 'missing-children', category: 'canon', title: 'Incidente de los Niños Desaparecidos', description: 'William Afton asesina a cinco niños en Freddy Fazbear\'s Pizza. Sus cuerpos se esconden dentro de los animatrónicos.', certainty: 95, connections: ['th-007', 'th-010', 'th-011', 'th-012'], files: ['Reporte Policial #1985', 'Periódico'] },
  { id: 'th-010', year: '1985', era: 'missing-children', category: 'canon', title: 'Muerte de Elizabeth Afton', description: 'Elizabeth Afton muere al ser capturada por Circus Baby, animatrónico diseñado por su padre. Su alma posee a Baby.', certainty: 90, connections: ['th-006', 'th-009', 'th-015'], files: ['Reporte Circus Baby'] },
  { id: 'th-011', year: '1985', era: 'missing-children', category: 'canon', title: 'Creación de Golden Freddy', description: 'Las almas de las víctimas poseen a los animatrónicos. Golden Freddy es una entidad especial que no sigue las reglas.', certainty: 85, connections: ['th-009', 'th-020'], files: ['Análisis de Anomalía'] },
  { id: 'th-012', year: '1985', era: 'missing-children', category: 'fanon', title: 'William Afton es arrestado', description: 'Según algunas teorías, William fue arrestado temporalmente pero liberado por falta de pruebas. Los cuerpos nunca se encontraron.', certainty: 40, connections: ['th-009'], files: ['Expediente Criminal'] },

  // FNAF 2 ERA
  { id: 'th-013', year: '1987', era: 'fnaf2', category: 'canon', title: 'Apertura de la Nueva Freddy Fazbear\'s Pizza', description: 'Nueva ubicación con Toy Animatronics y tecnología mejorada. Jeremy Fitzgerald trabaja como guardia.', certainty: 90, connections: ['th-009', 'th-014'], files: ['Documento de Apertura'] },
  { id: 'th-014', year: '1987', era: 'fnaf2', category: 'canon', title: 'The Bite of \'87', description: 'Un animatrónico muerde el lóbulo frontal de un empleado. Prohibición de que animatrónicos deambulen libremente.', certainty: 85, connections: ['th-013', 'th-016'], files: ['Reporte de Incidente'] },
  { id: 'th-015', year: '1987', era: 'fnaf2', category: 'fanon', title: 'William como "Purple Guy"', description: 'William Afton opera bajo el alias "Purple Guy", manipulando a los animatrónicos desde las sombras.', certainty: 60, connections: ['th-009', 'th-013'], files: ['Silueta Púrpura'] },

  // FNAF 1 ERA
  { id: 'th-016', year: '~1993', era: 'fnaf1', category: 'canon', title: 'Apertura de la Ubicación Original', description: 'Freddy Fazbear\'s Pizza abre con los animatrónicos originales. Mike Schmidt trabaja como guardia.', certainty: 80, connections: ['th-009', 'th-017'], files: ['FOTO: Freddy\'s Original'] },
  { id: 'th-017', year: '~1993', era: 'fnaf1', category: 'canon', title: 'Cierre de Freddy Fazbear\'s Pizza', description: 'La ubicación cierra definitivamente. Mike Schmidt completa su última semana. Los animatrónicos permanecen activos.', certainty: 85, connections: ['th-016', 'th-018'], files: ['Documento de Cierre'] },

  // FNAF 3 ERA
  { id: 'th-018', year: '~2023', era: 'fnaf3', category: 'canon', title: 'Apertura de Fazbear\'s Fright', description: 'Atracción de terror inspirada en las leyendas de Freddy\'s. Recuperan el traje de Springtrap.', certainty: 80, connections: ['th-017', 'th-019'], files: ['FOTO: Fazbear\'s Fright'] },
  { id: 'th-019', year: '~2023', era: 'fnaf3', category: 'canon', title: 'Incendio de Fazbear\'s Fright', description: 'La atracción se incendia durante la última noche. Springtrap sobrevive pero la estructura es destruida.', certainty: 85, connections: ['th-018', 'th-021'], files: ['Reporte de Incendio'] },

  // SISTER LOCATION ERA
  { id: 'th-020', year: '~2024', era: 'sister-location', category: 'canon', title: 'Eventos de Sister Location', description: 'Michael Afton trabaja en Circus Baby\'s Entertainment. Los Funtime se fusionan en Ennard y escapan.', certainty: 85, connections: ['th-010', 'th-021'], files: ['Grabación de HandUnit'] },
  { id: 'th-021', year: '~2024', era: 'sister-location', category: 'canon', title: 'Ennard posee a Michael Afton', description: 'Los animatrónicos Funtime usan el cuerpo de Michael para escapar del bunker. Michael sobrevive.', certainty: 80, connections: ['th-020', 'th-022'], files: ['Cuerpo Recuperado'] },

  // FFPS ERA
  { id: 'th-022', year: '~2025', era: 'ffps', category: 'canon', title: 'Incendio de Pizzeria Simulator', description: 'Henry ejecuta su plan final. Atrae a todos los animatrónicos y los destruye con fuego. Michael se sacrifica.', certainty: 90, connections: ['th-021', 'th-023'], files: ['Grabación Final de Henry'] },

  // MODERN ERA
  { id: 'th-023', year: '~2026', era: 'modern', category: 'canon', title: 'Surgimiento de Glitchtrap', description: 'La conciencia de William Afton se digitaliza como Glitchtrap en el juego VR. Posee a Vanessa.', certainty: 85, connections: ['th-022', 'th-024'], files: ['Código Corrupto'] },
  { id: 'th-024', year: '~2027', era: 'modern', category: 'canon', title: 'Construcción del Mega Pizzaplex', description: 'Fazbear Entertainment construye el enorme centro comercial temático sobre los restos de la ubicación original.', certainty: 80, connections: ['th-023', 'th-025'], files: ['Planos del Pizzaplex'] },
  { id: 'th-025', year: '~2030', era: 'modern', category: 'canon', title: 'Eventos de Security Breach', description: 'Gregory sobrevive la noche en el Pizzaplex con ayuda de Glamrock Freddy. Vanessa/Vanny lo persigue.', certainty: 85, connections: ['th-024', 'th-026'], files: ['Grabación de Cámaras'] },
  { id: 'th-026', year: '~2030', era: 'modern', category: 'canon', title: 'Eventos de Security Breach: Ruin', description: 'Cassie regresa al Pizzaplex en ruinas. Descubre la verdad sobre el Mimic y la manipulación.', certainty: 80, connections: ['th-025', 'th-027'], files: ['Dato Recuperado'] },
  { id: 'th-027', year: '~2035', era: 'modern', category: 'canon', title: 'Eventos de Secret of the Mimic', description: 'Los orígenes del Mimic se revelan. La entidad ha manipulado los eventos durante décadas.', certainty: 75, connections: ['th-026'], files: ['Archivo Mimic'] },

  // THEORIES
  { id: 'th-030', year: '1983', era: 'fredbear', category: 'teoria', title: 'Teoría: El Bite de \'83 vs \'87', description: 'El "Bite of \'83" (Crying Child) y el "Bite of \'87" son eventos diferentes. El primero mató al niño, el segundo causó daño cerebral.', certainty: 70, connections: ['th-008', 'th-014'], files: ['Análisis Comparativo'] },
  { id: 'th-031', year: '1985', era: 'missing-children', category: 'teoria', title: 'Teoría: Golden Freddy es Cassidy', description: 'Golden Freddy contiene el alma de Cassidy, la víctima que se niega a dejar morir a William Afton.', certainty: 75, connections: ['th-011', 'th-032'], files: ['Análisis de Entidad'] },
  { id: 'th-032', year: '~2026', era: 'modern', category: 'teoria', title: 'Teoría: UCN es el Infierno de Afton', description: 'Ultimate Custom Night representa el infierno personal de William Afton, creado por Cassidy para torturarlo eternamente.', certainty: 65, connections: ['th-031', 'th-022'], files: ['Análisis de UCN'] },
  { id: 'th-033', year: '~2026', era: 'modern', category: 'teoria', title: 'Teoría: El Mimic es el verdadero antagonista', description: 'El Mimic es una IA creada por Edwin que ha manipulado los eventos de Fazbear Entertainment durante décadas.', certainty: 60, connections: ['th-027'], files: ['Análisis de IA'] },
  { id: 'th-034', year: '~1985', era: 'missing-children', category: 'fanon', title: 'Fanon: Los niños son felices en el más allá', description: 'Los niños asesinados encuentran la paz después de ser liberados de los animatrónicos.', certainty: 30, connections: ['th-009'], files: ['Historia Alternativa'] }
];

window.eras = [
  { id: 'pre-history', name: 'PRE-HISTORIA', color: '#666', range: '~1940 - ~1965' },
  { id: 'fredbear', name: 'ERA FREDREAR', color: '#E6B800', range: '~1970 - 1983' },
  { id: 'missing-children', name: 'NIÑOS DESAPARECIDOS', color: '#FF4444', range: '1985' },
  { id: 'fnaf2', name: 'FNAF 2', color: '#00BFFF', range: '1987' },
  { id: 'fnaf1', name: 'FNAF 1', color: '#00FF66', range: '~1993' },
  { id: 'fnaf3', name: 'FNAF 3', color: '#FF8C00', range: '~2023' },
  { id: 'sister-location', name: 'SISTER LOCATION', color: '#FF69B4', range: '~2024' },
  { id: 'ffps', name: 'FFPS', color: '#CC66FF', range: '~2025' },
  { id: 'modern', name: 'ERA MODERNA', color: '#00E5FF', range: '~2026 - ~2035' }
];
