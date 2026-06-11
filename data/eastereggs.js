window.eastereggs = [
  // =============================================
  // FIVE NIGHTS AT FREDDY'S 1
  // =============================================
  {
    id: 'EE-001',
    name: 'Golden Freddy',
    game: 'fnaf1',
    type: 'visual',
    rarity: 'raro',
    location: 'Cámara 1A (Show Stage)',
    description: 'Un cuadro de Golden Freddy aparece aleatoriamente en la pared de la cámara 1A. Si se hace clic en él, el juego crashea con una imagen de Golden Freddy y el texto "IT\'S ME".',
    activation: [
      'Monitorear la cámara 1A (Show Stage) continuamente',
      'Esperar a que aparezca un cuadro con la imagen de Golden Freddy en la pared',
      'Hacer clic en el cuadro inmediatamente',
      'El juego mostrará una pantalla de error y se cerrará'
    ],
    loreSignificance: 'Golden Freddy es una manifestación del alma de Cassidy (o Crying Child, según la teoría). Representa un ente que no sigue las reglas normales del juego ni del lore.',
    theories: [
      'Golden Freddy es el alma de Cassidy, vengándose de William Afton',
      'Es una manifestación colectiva de las víctimas de Afton',
      'Representa al "Crying Child" de FNaF 4'
    ],
    connections: ['EE-002', 'EE-015', 'EE-023'],
    image: ''
  },
  {
    id: 'EE-002',
    name: 'IT\'S ME - Marcador de Pared',
    game: 'fnaf1',
    type: 'visual',
    rarity: 'común',
    location: 'Cámara 1A y 1B',
    description: 'Las palabras "IT\'S ME" aparecen escritas en las paredes de varias cámaras, cambiando entre partidas.',
    activation: [
      'Revisar las paredes de las cámaras 1A y 1B',
      'El texto aparece y desaparece aleatoriamente',
      'No requiere acción específica del jugador'
    ],
    loreSignificance: 'Es un mensaje directo de las víctimas atrapadas en los animatrónicos, intentando comunicarse con el jugador.',
    theories: [
      'Los niños asesinados intentan advertir al guardia',
      'Es William Afton burlándose de sus víctimas',
      'Un mensaje de Golden Freddy específicamente'
    ],
    connections: ['EE-001', 'EE-015'],
    image: ''
  },
  {
    id: 'EE-003',
    name: 'Bocina de Freddy',
    game: 'fnaf1',
    type: 'mecánico',
    rarity: 'común',
    location: 'Cámara 1A (Show Stage)',
    description: 'Al hacer clic en la nariz de Freddy Fazbear en la cámara 1A, suena un sonido de bocina. Es un easter egg humorístico sin implicaciones en el lore.',
    activation: [
      'Ir a la cámara 1A (Show Stage)',
      'Hacer clic en la nariz negra de Freddy',
      'Se reproducirá un sonido de bocina'
    ],
    loreSignificance: 'No tiene significado en el lore. Es un toque humorístico de Scott Cawthon.',
    theories: [],
    connections: [],
    image: ''
  },
  {
    id: 'EE-004',
    name: 'Flash en la Oficina',
    game: 'fnaf1',
    type: 'visual',
    rarity: 'raro',
    location: 'Oficina del guardia',
    description: 'Aleatoriamente, la cara de un animatrónico aparece brevemente en la oficina del guardia, causando un efecto de flash.',
    activation: [
      'Estar en la oficina del guardia',
      'Esperar a que aparezca aleatoriamente un flash con la cara de un animatrónico',
      'No se puede activar manualmente'
    ],
    loreSignificance: 'Representa la presencia constante de los animatronicos acechando al guardia.',
    theories: [
      'Los animatronicos están "observando" al guardia incluso fuera de las cámaras',
      'Es un efecto de la cordura deteriorada del guardia'
    ],
    connections: ['EE-010'],
    image: ''
  },
  {
    id: 'EE-005',
    name: 'Freddy Nose Honk Alternativo',
    game: 'fnaf1',
    type: 'visual',
    rarity: 'extremadamente_raro',
    location: 'Cámara 1A',
    description: 'En raras ocasiones, al hacer clic en la nariz de Freddy, su cara cambia brevemente a una expresión diferente.',
    activation: [
      'Hacer clic en la nariz de Freddy múltiples veces rápidamente',
      'En raras ocasiones, su expresión cambia'
    ],
    loreSignificance: 'Sin significado en el lore. Variedad del easter egg de la bocina.',
    theories: [],
    connections: ['EE-003'],
    image: ''
  },

  // =============================================
  // FIVE NIGHTS AT FREDDY'S 2
  // =============================================
  {
    id: 'EE-006',
    name: 'Shadow Freddy',
    game: 'fnaf2',
    type: 'visual',
    rarity: 'extremadamente_raro',
    location: 'Oficina del guardia',
    description: 'Shadow Freddy, una versión sombria y violeta de Freddy, aparece aleatoriamente sentado en la esquina de la oficina. Si se le hace clic, todos los animatrónicos se vuelven activos inmediatamente.',
    activation: [
      'Estar en la oficina del guardia',
      'Esperar a que aparezca Shadow Freddy sentado en la esquina',
      'Hacer clic en él',
      'Todos los animatrónicos se activarán instantáneamente'
    ],
    loreSignificance: 'Shadow Freddy es una manifestación misteriosa, posiblemente relacionada con William Afton o con el incidente de las sombras.',
    theories: [
      'Es William Afton en su forma "shadow"',
      'Una manifestación del dolor de las víctimas',
      'Relacionado con el incidente de Shadow Bonnie'
    ],
    connections: ['EE-007', 'EE-001'],
    image: ''
  },
  {
    id: 'EE-007',
    name: 'RWQFSFASXC (Shadow Bonnie)',
    game: 'fnaf2',
    type: 'visual',
    rarity: 'extremadamente_raro',
    location: 'Oficina del guardia',
    description: 'Una silueta negra y brillante de Bonnie aparece aleatoriamente en la oficina. Si se le hace clic, el juego crashea.',
    activation: [
      'Estar en la oficina del guardia',
      'Esperar a que aparezca la silueta de Shadow Bonnie',
      'Hacer clic en él',
      'El juego mostrará una pantalla de error'
    ],
    loreSignificance: 'RWQFSFASXC es una de las entidades más misteriosas de FNaF. Se cree que es una manifestación de un alma en conflicto.',
    theories: [
      'Es la manifestación del alma de uno de los niños asesinados',
      'Relacionado con el programa de anomalías de Fazbear Entertainment',
      'Una corrupción del sistema de los animatrónicos'
    ],
    connections: ['EE-006', 'EE-015'],
    image: ''
  },
  {
    id: 'EE-008',
    name: 'JJ (Balloon Girl)',
    game: 'fnaf2',
    type: 'visual',
    rarity: 'raro',
    location: 'Oficina del guardia',
    description: 'Una niña con un globo aparece debajo de la mesa de la oficina. No causa ningún efecto al hacer clic, pero su presencia es perturbadora.',
    activation: [
      'Revisar debajo de la mesa en la oficina del guardia',
      'Aparece aleatoriamente en algunas noches'
    ],
    loreSignificance: 'JJ es una de las entidades más ambiguas. Puede ser una manifestación de una de las víctimas o un error del sistema.',
    theories: [
      'Es Balloon Boy en forma femenina',
      'Una víctima diferente no incluida en el grupo principal',
      'Un error visual del juego'
    ],
    connections: ['EE-009'],
    image: ''
  },
  {
    id: 'EE-009',
    name: 'Paper Pals',
    game: 'fnaf2',
    type: 'visual',
    rarity: 'común',
    location: 'Oficina del guardia',
    description: 'Tres figuras de papel aparecen en la pared de atrás de la oficina. No tienen efecto en la jugabilidad.',
    activation: [
      'Revisar la pared de atrás de la oficina',
      'Aparecen aleatoriamente en algunas noches'
    ],
    loreSignificance: 'Los Paper Pals son uno de los misterios sin resolver. Se cree que representan a las víctimas del incidente de las desapariciones.',
    theories: [
      'Representan a los cinco niños asesinados',
      'Son dibujos dejados por uno de los niños',
      'Una pista sobre la ubicación de los cuerpos'
    ],
    connections: ['EE-008'],
    image: ''
  },
  {
    id: 'EE-010',
    name: 'Flash de Mangle en la Oficina',
    game: 'fnaf2',
    type: 'visual',
    rarity: 'raro',
    location: 'Oficina del guardia',
    description: 'Mangle aparece colgado del techo de la oficina durante un breve momento.',
    activation: [
      'Estar en la oficina del guardia',
      'Esperar a que aparezca Mangle colgado del techo',
      'Es un evento aleatorio sin activación manual'
    ],
    loreSignificance: 'Representa la capacidad de Mangle para moverse libremente por las instalaciones.',
    theories: [
      'Mangle se desplaza por el techo y las tuberías',
      'Es una manifestación del caos que causa Mangle'
    ],
    connections: ['EE-004'],
    image: ''
  },

  // =============================================
  // FIVE NIGHTS AT FREDDY'S 3
  // =============================================
  {
    id: 'EE-011',
    name: 'Minijuegos Secretos',
    game: 'fnaf3',
    type: 'mecánico',
    rarity: 'raro',
    location: 'Cámaras (eventos aleatorios)',
    description: 'Minijuegos en 8-bit aparecen aleatoriamente al revisar las cámaras. Revelan fragmentos del lore original, incluyendo el asesinato de los niños y la creación de Golden Freddy.',
    activation: [
      'Revisar las cámaras durante la noche',
      'Aparecerá aleatoriamente un minijuego en estilo 8-bit',
      'Completar el minijuego revela fragmentos del lore'
    ],
    loreSignificance: 'Los minijuegos revelan la historia completa del asesinato de los cinco niños, la creación de los Phantom animatronics, y la verdadera identidad de Springtrap.',
    theories: [
      'Cada minijuego representa un fragmento de la memoria de William Afton',
      'Son las últimas memorias de las víctimas antes de ser asesinadas'
    ],
    connections: ['EE-012', 'EE-013'],
    image: ''
  },
  {
    id: 'EE-012',
    name: 'Green Guy (Shadow Freddy Minigame)',
    game: 'fnaf3',
    type: 'narrativo',
    rarity: 'raro',
    location: 'Minijuego aleatorio',
    description: 'Un minijuego donde una figura verde guía a los niños sombras hacia un cuarto cerrado. Representa a William Afton luchando a los niños hacia la trampa.',
    activation: [
      'Esperar a que aparezca el minijuego aleatoriamente',
      'Guiar a los niños sombras hacia el cuarto',
      'El "Green Guy" los dirige a una trampa'
    ],
    loreSignificance: 'Este minijuego es una representación directa de cómo William Afton asesinó a los cinco niños, encerrándolos en la sala de los animatrónicos.',
    theories: [
      'El Green Guy es William Afton en forma de animatrónico',
      'Los niños sombras representan a las víctimas reales'
    ],
    connections: ['EE-011', 'EE-013'],
    image: ''
  },
  {
    id: 'EE-013',
    name: 'Give Gifts, Give Life',
    game: 'fnaf3',
    type: 'narrativo',
    rarity: 'raro',
    location: 'Minijuego aleatorio',
    description: 'Un minijuego donde el Puppet da regalos a cinco niños sombras. Al final, los niños cobran vida con los animatrónicos.',
    activation: [
      'Esperar a que aparezca el minijuego',
      'Recoger los regalos y entregarlos a los niños',
      'Los niños "cobran vida" al final'
    ],
    loreSignificance: 'Representa cómo el Puppet (posiblemente el alma de Emily) "dio vida" a los niños dentro de los animatrónicos.',
    theories: [
      'El Puppet es la primera víctima, intentando vengarse',
      'Los regalos representan los huesos de los niños dentro de los animatrónicos'
    ],
    connections: ['EE-011', 'EE-012', 'EE-022'],
    image: ''
  },
  {
    id: 'EE-014',
    name: 'Phantom Animatronics',
    game: 'fnaf3',
    type: 'visual',
    rarity: 'común',
    location: 'Cámaras y oficina',
    description: 'Los Phantom animatronics son versiones fantasma de los animatrónicos de FNaF 1. Aparecen como visiones y causan daño al jugador si se les hace caso.',
    activation: [
      'Revisar las cámaras y encontrar Phantom animatronics',
      'Si se les mira demasiado tiempo o se les hace clic, causan un jumpscare',
      'El jumpscare reduce la cantidad de ventanas de escape'
    ],
    loreSignificance: 'Los Phantom son las almas de los animatrónicos destruidos, intentando advertir al jugador sobre Springtrap.',
    theories: [
      'Son los fantasmas de los animatrónicos originales de FNaF 1',
      'Representan los recuerdos del guardia anterior'
    ],
    connections: ['EE-015'],
    image: ''
  },

  // =============================================
  // FIVE NIGHTS AT FREDDY'S 4
  // =============================================
  {
    id: 'EE-015',
    name: 'Nightmare Animatronics',
    game: 'fnaf4',
    type: 'visual',
    rarity: 'común',
    location: 'Habitación del niño',
    description: 'Los Nightmare animatronics son versiones terroríficas y exageradas de los animatrónicos clásicos. Aparecen en la habitación del niño durante la noche.',
    activation: [
      'Estar en la habitación del niño',
      'Escuchar los pasos de los Nightmare animatronics',
      'Cerrar las puertas a tiempo para evitarlos'
    ],
    loreSignificance: 'Representan los miedos del Crying Child (el niño que llora) proyectados en sus pesadillas.',
    theories: [
      'El Crying Child tiene poderes de illusion discs',
      'Los Nightmares son reales, no solo imaginación',
      'Representan el abuso psicológico de William Afton hacia su hijo'
    ],
    connections: ['EE-016', 'EE-017'],
    image: ''
  },
  {
    id: 'EE-016',
    name: 'Plush de Fredbear Hablante',
    game: 'fnaf4',
    type: 'auditivo',
    rarity: 'raro',
    location: 'Habitación del niño',
    description: 'El plush de Fredbear habla con voz distorsionada, dando pistas sobre los animatronicos y la situación del niño.',
    activation: [
      'Estar en la habitación del niño',
      'El plush hablará aleatoriamente',
      'Su voz cambia según la situación del juego'
    ],
    loreSignificance: 'El plush de Fredbear es una guía misteriosa. Puede ser la conciencia del padre del niño o una entidad sobrenatural.',
    theories: [
      'El plush es controlado por William Afton',
      'Es la conciencia del hermano mayor',
      'Una entidad protectora sobrenatural'
    ],
    connections: ['EE-015', 'EE-017'],
    image: ''
  },
  {
    id: 'EE-017',
    name: 'Crying Child - Fredbear\'s Family Diner',
    game: 'fnaf4',
    type: 'narrativo',
    rarity: 'extremadamente_raro',
    location: 'Minijuegos ocultos',
    description: 'Minijuegos que muestran al Crying Child siendo abusado por su hermano mayor y eventualmente atacado por Fredbear.',
    activation: [
      'Encontrar los minijuegos ocultos en la habitación',
      'Jugar a través de las escenas del Crying Child',
      'La secuencia final muestra el "Bite of \'83"'
    ],
    loreSignificance: 'Revela los eventos que llevaron al "Bite of \'83" y establece la relación entre el Crying Child y William Afton.',
    theories: [
      'El Crying Child es Michael Afton',
      'El hermano mayor es el "foxy guy" de FNaF 4',
      'El incidente de la mordida mató al Crying Child'
    ],
    connections: ['EE-015', 'EE-016'],
    image: ''
  },
  {
    id: 'EE-018',
    name: 'Fredbear Flash',
    game: 'fnaf4',
    type: 'visual',
    rarity: 'extremadamente_raro',
    location: 'Habitación del niño',
    description: 'Una imagen de Fredbear con los ojos vacíos aparece brevemente en la pared de la habitación.',
    activation: [
      'Revisar las paredes de la habitación',
      'Aparece aleatoriamente en momentos de tensión'
    ],
    loreSignificance: 'Representa la presencia constante del miedo del Crying Child hacia Fredbear.',
    theories: [
      'Es el trauma del Crying Child manifestándose',
      'Una pista sobre el "Bite of \'83"'
    ],
    connections: ['EE-015', 'EE-017'],
    image: ''
  },

  // =============================================
  // SISTER LOCATION
  // =============================================
  {
    id: 'EE-019',
    name: 'Bunker Oculto',
    game: 'sisterlocation',
    type: 'narrativo',
    rarity: 'raro',
    location: 'Bunker de Circus Baby',
    description: 'El bunker de Circus Baby es una instalación subterránea secreta donde William Afton experimentó con los animatrónicos.',
    activation: [
      'Avanzar en la historia principal',
      'Descubrir el bunker debajo de la casa de los Afton',
      'Explorar las instalaciones subterráneas'
    ],
    loreSignificance: 'El bunker revela que William Afton tenía una instalación secreta donde experimentaba con los animatrónicos y las víctimas.',
    theories: [
      'El bunker es donde Afton creó los Funtime animatronics',
      'Es la ubicación original de Circus Baby\'s Entertainment and Rental'
    ],
    connections: ['EE-020', 'EE-021'],
    image: ''
  },
  {
    id: 'EE-020',
    name: 'HandUnit - Número de Exótica',
    game: 'sisterlocation',
    type: 'mecánico',
    rarity: 'común',
    location: 'HandUnit (interfaz)',
    description: 'HandUnit pide números de exótica para acceder a diferentes áreas. Los números son una referencia a los códigos de seguridad de Fazbear Entertainment.',
    activation: [
      'Cuando HandUnit pida el número de exótica',
      'Ingresar los números correctos',
      'Acceder a las áreas restringidas'
    ],
    loreSignificance: 'Los números de exótica son códigos de acceso que William Afton usaba para controlar los animatrónicos.',
    theories: [
      'Los códigos contienen mensajes ocultos de Afton',
      'Son las coordenadas de las víctimas'
    ],
    connections: ['EE-019'],
    image: ''
  },
  {
    id: 'EE-021',
    name: 'Scooping Room',
    game: 'sisterlocation',
    type: 'narrativo',
    rarity: 'raro',
    location: 'Sala de Scooping',
    description: 'La Sala de Scooping es donde los animatrónicos eran "vaciados" de su endoesqueleto. Aquí, Ennard intenta vaciar al jugador.',
    activation: [
      'Avanzar en la historia hasta la Sala de Scooping',
      'Experimentar el intento de scooping por parte de Ennard',
      'Sobrevivir al evento'
    ],
    loreSignificance: 'La Sala de Scooping revela el método que Afton usaba para transferir los huesos de las víctimas a los animatrónicos.',
    theories: [
      'El scooping es cómo los niños fueron "puestos" dentro de los animatrónicos',
      'La sala fue diseñada para eliminar evidencia'
    ],
    connections: ['EE-019', 'EE-020'],
    image: ''
  },

  // =============================================
  // FFPS (Freddy Fazbear\'s Pizzeria Simulator)
  // =============================================
  {
    id: 'EE-022',
    name: 'Insanity Ending',
    game: 'ffps',
    type: 'narrativo',
    rarity: 'raro',
    location: 'Final alternativo',
    description: 'El final "Insanity" se desbloquea al recopilar suficiente información sobre William Afton y liberar a todas las almas.',
    activation: [
      'Recopilar suficiente información durante el juego',
      'Liberar a las almas de los animatrónicos',
      'Al final, Choose Left para el final Insanity'
    ],
    loreSignificance: 'El final Insanity revela que Henry Emily planeó destruir todos los animatrónicos y liberar a las almas de una vez por todas.',
    theories: [
      'Henry es el verdadero héroe de la historia',
      'El plan de Henry requirió el sacrificio de todos'
    ],
    connections: ['EE-023', 'EE-024'],
    image: ''
  },
  {
    id: 'EE-023',
    name: 'Lorekeeper Ending',
    game: 'ffps',
    type: 'narrativo',
    rarity: 'extremadamente_raro',
    location: 'Final más oculto',
    description: 'El final "Lorekeeper" se desbloquea al completar todas las tareas y encontrar todos los secretos. Muestra una imagen de los niños reunidos con sus animatrónicos.',
    activation: [
      'Completar todas las tareas del juego',
      'Encontrar todos los secretos y minijuegos',
      'Al final, Choose Left para el final Lorekeeper'
    ],
    loreSignificance: 'El Lorekeeper ending es el final "canon" que muestra la liberación de todas las almas y la paz de los niños.',
    theories: [
      'Este es el final verdadero de la historia principal',
      'Las almas finalmente encontraron la paz'
    ],
    connections: ['EE-022', 'EE-024'],
    image: ''
  },
  {
    id: 'EE-024',
    name: 'Mediocre Melodies - Rare Digits',
    game: 'ffps',
    type: 'mecánico',
    rarity: 'raro',
    location: 'Mediocre Melodies',
    description: 'Los Mediocre Melodies son animatrónicos de baja calidad que contienen dígitos ocultos en sus diseños.',
    activation: [
      'Examinar a los Mediocre Melodies en el tycoon',
      'Encontrar los dígitos ocultos en sus diseños',
      'Los dígitos forman parte de un código secreto'
    ],
    loreSignificance: 'Los dígitos son parte del código de acceso al bunker de Afton.',
    theories: [
      'Los Mediocre Melodies son trampas creadas por Henry',
      'Los dígitos son las coordenadas de la ubicación final'
    ],
    connections: ['EE-022', 'EE-023'],
    image: ''
  },

  // =============================================
  // ULTIMATE CUSTOM NIGHT
  // =============================================
  {
    id: 'EE-025',
    name: 'Golden Freddy - UCN',
    game: 'ucn',
    type: 'mecánico',
    rarity: 'extremadamente_raro',
    location: 'Oficina',
    description: 'Golden Freddy aparece aleatoriamente con una imagen distorsionada. Si no se le mira a tiempo, el juego se reinicia.',
    activation: [
      'Estar en la oficina',
      'Golden Freddy aparecerá aleatoriamente con una imagen distorsionada',
      'Mirar hacia abajo inmediatamente para evitarlo'
    ],
    loreSignificance: 'Golden Freddy en UCN es la manifestación de Cassidy, torturando a William Afton en el infierno.',
    theories: [
      'UCN es el infierno de William Afton',
      'Cassidy no permite que Afton muera'
    ],
    connections: ['EE-001', 'EE-026'],
    image: ''
  },
  {
    id: 'EE-026',
    name: 'Old Man Consequences',
    game: 'ucn',
    type: 'narrativo',
    rarity: 'extremadamente_raro',
    location: 'Minijuego secreto',
    description: 'Una entidad misteriosa que aparece en un minijuego de pesca. Le dice al jugador que "deje los cuerpos"',
    activation: [
      'Encontrar el minijuego secreto de pesca',
      'Pescar a Old Man Consequences',
      'Escuchar su mensaje: "Deja los cuerpos. Ven a pescar conmigo"'
    ],
    loreSignificance: 'Old Man Consequences es una entidad que representa la paz y el descanso. Su mensaje es para que las víctimas dejen ir el rencor.',
    theories: [
      'Es Golden Freddy/Cassidy siendo liberado',
      'Representa a Scott Cawthon dando un mensaje a los fans',
      'Es la conciencia de Henry Emily'
    ],
    connections: ['EE-025', 'EE-027'],
    image: ''
  },
  {
    id: 'EE-027',
    name: 'Death Coins',
    game: 'ucn',
    type: 'mecánico',
    rarity: 'raro',
    location: 'Oficina',
    description: 'Monedas de muerte que permiten eliminar temporalmente a un animatrónico específico de la noche.',
    activation: [
      'Recoger las Death Coins en la oficina',
      'Usarlas para eliminar temporalmente a un animatrónico',
      'Cada Death Coin tiene un costo diferente'
    ],
    loreSignificance: 'Las Death Coins representan el control que Afton tenía sobre los animatrónicos.',
    theories: [
      'Son los mismos monedas que Afton usaba para controlar a los animatrónicos',
      'Representan el poder de la corrupción'
    ],
    connections: ['EE-025', 'EE-026'],
    image: ''
  },

  // =============================================
  // HELP WANTED
  // =============================================
  {
    id: 'EE-028',
    name: 'Glitchtrap',
    game: 'helpwanted',
    type: 'narrativo',
    rarity: 'raro',
    location: 'Niveles de VR',
    description: 'Glitchtrap es una entidad maliciosa que se manifiesta dentro del juego de realidad virtual. Es William Afton convertido en un programa digital.',
    activation: [
      'Jugar a través de los niveles de VR',
      'Encontrar los momentos donde Glitchtrap aparece',
      'Glitchtrap intentará "poseer" al jugador'
    ],
    loreSignificance: 'Glitchtrap es la forma digital de William Afton, transferida al código del juego VR por medio de los circuitos de Springtrap.',
    theories: [
      'Afton logró transferir su conciencia al código digital',
      'Glitchtrap es la nueva forma de "vivir" de Afton'
    ],
    connections: ['EE-029', 'EE-030'],
    image: ''
  },
  {
    id: 'EE-029',
    name: 'Vanny',
    game: 'helpwanted',
    type: 'narrativo',
    rarity: 'raro',
    location: 'Niveles de VR',
    description: 'Vanny es una nueva antagonista que aparece brevemente en los niveles de VR. Es una persona poseída por Glitchtrap.',
    activation: [
      'Jugar los niveles de VR',
      'Encontrar las apariciones breves de Vanny',
      'Vanny aparece como una figura con máscara de conejo'
    ],
    loreSignificance: 'Vanny es la primera víctima de Glitchtrap, una programadora que fue corrompida por la conciencia digital de Afton.',
    theories: [
      'Vanny es Vanessa, la guardia de Security Breach',
      'Glitchtrap la controla completamente',
      'Ella misma es una víctima de Afton'
    ],
    connections: ['EE-028', 'EE-030'],
    image: ''
  },
  {
    id: 'EE-030',
    name: 'Hard Mode - Nightmares',
    game: 'helpwanted',
    type: 'mecánico',
    rarity: 'raro',
    location: 'Modo difícil',
    description: 'El modo difícil desbloquea versiones más agresivas de los animatrónicos con comportamientos más difíciles.',
    activation: [
      'Completar la noche en dificultad normal',
      'Desbloquear el modo difícil',
      'Jugar con animatrónicos más agresivos'
    ],
    loreSignificance: 'El modo difícil representa la "corrupción" del código por parte de Glitchtrap.',
    theories: [
      'La dificultad aumenta porque Glitchtrap está corrompiendo el juego',
      'Representa la escalada del terror en la historia'
    ],
    connections: ['EE-028'],
    image: ''
  },

  // =============================================
  // SECURITY BREACH
  // =============================================
  {
    id: 'EE-031',
    name: 'Burntrap',
    game: 'securitybreach',
    type: 'narrativo',
    rarity: 'raro',
    location: 'Bunker de Afton',
    description: 'Burntrap es la forma final de William Afton en Security Breach. Es un Springtrap parcialmente quemado que controla a los Glamrock animatronics.',
    activation: [
      'Explorar el bunker de Afton debajo del Pizzaplex',
      'Encontrar a Burntrap en su cámara de regeneración',
      'Enfrentarlo en la batalla final'
    ],
    loreSignificance: 'Burntrap confirma que William Afton sigue vivo (o al menos su conciencia) incluso después de los eventos de FFPS.',
    theories: [
      'Afton fue rescatado por Vanny/Glitchtrap',
      'Su cuerpo fue preservado en el bunker',
      'Controla a los Glamrock a través de la red'
    ],
    connections: ['EE-028', 'EE-032'],
    image: ''
  },
  {
    id: 'EE-032',
    name: 'The Blob',
    game: 'securitybreach',
    type: 'visual',
    rarity: 'extremadamente_raro',
    location: 'Bunker de Afton',
    description: 'The Blob es una masa gigante de partes de animatrónicos que ataca a Burntrap. Es la manifestación de todas las víctimas juntas.',
    activation: [
      'Avanzar hasta la batalla final con Burntrap',
      'The Blob emergerá para atacar a Burntrap',
      'Es un evento scripted, no requiere acción específica'
    ],
    loreSignificance: 'The Blob representa la venganza colectiva de todas las víctimas de Afton, unidas en una sola entidad.',
    theories: [
      'The Blob es la fusión de todos los animatrónicos destruidos',
      'Representa la ira colectiva de las víctimas',
      'Es la "justicia" que las víctimas finalmente logran'
    ],
    connections: ['EE-031'],
    image: ''
  },
  {
    id: 'EE-033',
    name: 'Glamrock Chica - Camera Secret',
    game: 'securitybreach',
    type: 'visual',
    rarity: 'raro',
    location: 'Cámara oculta del Pizzaplex',
    description: 'Una cámara oculta muestra a Glamrock Chica en un estado de destrucción, revelando su endoesqueleto.',
    activation: [
      'Explorar las cámaras ocultas del Pizzaplex',
      'Encontrar la cámara que muestra a Glamrock Chica destruida',
      'Observar su estado actual'
    ],
    loreSignificance: 'Revela que los Glamrock animatronics están siendo controlados externamente.',
    theories: [
      'Glamrock Chica fue dañada por Vanny',
      'Su estado refleja la corrupción de Glitchtrap'
    ],
    connections: ['EE-031'],
    image: ''
  },
  {
    id: 'EE-034',
    name: 'Monty Golf - Secret Area',
    game: 'securitybreach',
    type: 'mecánico',
    rarity: 'raro',
    location: 'Monty\'s Gator Golf',
    description: 'Un área secreta en Monty\'s Gator Golf contiene pistas sobre el pasado de los animatrónicos.',
    activation: [
      'Explorar Monty\'s Gator Golf',
      'Encontrar la entrada secreta',
      'Descubrir las pistas sobre los animatrronicos'
    ],
    loreSignificance: 'El área secreta contiene documentación sobre la creación de los Glamrock animatronics.',
    theories: [
      'Monty fue modificado para ser más agresivo',
      'El área es un laboratorio de investigación de Fazbear Entertainment'
    ],
    connections: ['EE-031'],
    image: ''
  },

  // =============================================
  // CROSS-GAME EASTER EGGS
  // =============================================
  {
    id: 'EE-035',
    name: 'Freddy Nose Honk Universal',
    game: 'varios',
    type: 'mecánico',
    rarity: 'común',
    location: 'Múltiples juegos',
    description: 'La mecánica de hacer clic en la nariz de Freddy para que suene una bocina aparece en múltiples juegos de la saga.',
    activation: [
      'En cualquier juego donde Freddy aparezca con nariz visible',
      'Hacer clic en su nariz',
      'Sonará el sonido de bocina característico'
    ],
    loreSignificance: 'Es el easter egg más icónico de la saga, un toque humorístico de Scott Cawthon.',
    theories: [],
    connections: ['EE-003'],
    image: ''
  },
  {
    id: 'EE-036',
    name: 'Purple Guy - Referencias',
    game: 'varios',
    type: 'visual',
    rarity: 'común',
    location: 'Múltiples juegos',
    description: 'William Afton (Purple Guy) aparece en forma de silueta púrpura en múltiples juegos, desde los minijuegos 8-bit hasta las apariciones en Security Breach.',
    activation: [
      'Revisar minijuegos y escenas en múltiples juegos',
      'Buscar la silueta púrpura characteristic',
      'Aparece en FNaF 2, 3, SL, FFPS, etc.'
    ],
    loreSignificance: 'Purple Guy es el antagonista principal de toda la saga, el asesino de los cinco niños.',
    theories: [
      'William Afton es el verdadero villain de toda la historia',
      'Su obsesión con la inmortalidad lo llevó a crear los animatrónicos'
    ],
    connections: ['EE-001', 'EE-012', 'EE-019', 'EE-022'],
    image: ''
  },
  {
    id: 'EE-037',
    name: 'The Puppet - Music Box',
    game: 'varios',
    type: 'auditivo',
    rarity: 'común',
    location: 'Múltiples juegos',
    description: 'La música del Music Box del Puppet aparece como motif recurrente en toda la saga, cada vez con variaciones.',
    activation: [
      'Escuchar la melodía del Music Box en diferentes juegos',
      'Cada versión tiene variaciones sutiles',
      'Representa la presencia del Puppet'
    ],
    loreSignificance: 'La música del Music Box es el tema del Puppet, una entidad que protege a las víctimas.',
    theories: [
      'El Puppet es la primera víctima de Afton',
      'Su música es una advertencia para los malhechores'
    ],
    connections: ['EE-013', 'EE-022'],
    image: ''
  },
  {
    id: 'EE-038',
    name: 'Hidden Fredbear References',
    game: 'varios',
    type: 'visual',
    rarity: 'raro',
    location: 'Múltiples juegos',
    description: 'Fredbear aparece en referencias ocultas en juegos posteriores, recordando los orígenes de la franquicia.',
    activation: [
      'Revisar fondos y detalles en diferentes juegos',
      'Buscar imágenes o referencias a Fredbear',
      'Aparece en posters, fotos y documentos'
    ],
    loreSignificance: 'Fredbear es el animatrónico original que inició toda la historia de Fazbear Entertainment.',
    theories: [
      'Fredbear es el primer animatrónico creado por Afton',
      'Su diseño fue la base para todos los demás'
    ],
    connections: ['EE-001', 'EE-017'],
    image: ''
  },
  {
    id: 'EE-039',
    name: 'Fazbear Entertainment Logo Changes',
    game: 'varios',
    type: 'visual',
    rarity: 'común',
    location: 'Menús y pantallas de carga',
    description: 'El logo de Fazbear Entertainment cambia sutilmente entre juegos, reflejando la decadencia de la empresa.',
    activation: [
      'Comparar los logos de Fazbear Entertainment en diferentes juegos',
      'Observar los cambios en colores, diseño y estado',
      'Los logos se vuelven más deteriorados con el tiempo'
    ],
    loreSignificance: 'Los cambios en el logo reflejan la caída de Fazbear Entertainment desde sus inicios hasta su colapso.',
    theories: [
      'Cada logo representa una era diferente de la empresa',
      'Los cambios son intencionales para mostrar la decadencia'
    ],
    connections: [],
    image: ''
  },
  {
    id: 'EE-040',
    name: 'Cassidy - The One You Should Not Have Killed',
    game: 'varios',
    type: 'narrativo',
    rarity: 'secreto_profundo',
    location: 'UCN y más allá',
    description: 'Cassidy es el alma de Golden Freddy que se niega a dejar morir a William Afton. Su presencia se siente en toda la saga.',
    activation: [
      'En UCN, completar el nivel 50/20',
      'Encontrar los mensajes ocultos de Cassidy',
      'Escuchar "I am the one you should not have killed"'
    ],
    loreSignificance: 'Cassidy es la víctima que se niega a perdonar, manteniendo a Afton atrapado en un ciclo eterno de sufrimiento.',
    theories: [
      'Cassidy es la víctima más vengativa',
      'UCN es el infierno personal de Afton, creado por Cassidy',
      'Cassidy nunca encontrará la paz hasta que Afton sea destruido completamente'
    ],
    connections: ['EE-001', 'EE-025', 'EE-026'],
    image: ''
  }
];
