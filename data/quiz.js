window.quizData = {
  personality: {
    questions: [
      {
        id: 1,
        text: 'Estás solo en un restaurante abandonado de noche. ¿Qué haces primero?',
        options: [
          { text: 'Investigar los ruidos sospechosos', values: { fear: 0, aggression: 0, curiosity: 3, survival: 1 } },
          { text: 'Buscar una salida inmediata', values: { fear: 2, aggression: 0, curiosity: 0, survival: 3 } },
          { text: 'Esconderme y esperar hasta el amanecer', values: { fear: 3, aggression: 0, curiosity: 0, survival: 2 } },
          { text: 'Confrontar lo que sea que esté ahí', values: { fear: 0, aggression: 3, curiosity: 1, survival: 0 } }
        ]
      },
      {
        id: 2,
        text: 'Encuentras una puerta marcada "PROHIBIDO EL PASO". ¿Qué haces?',
        options: [
          { text: 'La abro inmediatamente, necesito saber qué hay dentro', values: { fear: 0, aggression: 1, curiosity: 3, survival: 0 } },
          { text: 'La examino primero, busco pistas antes de entrar', values: { fear: 1, aggression: 0, curiosity: 2, survival: 2 } },
          { text: 'La evito, no quiero problemas', values: { fear: 2, aggression: 0, curiosity: 0, survival: 3 } },
          { text: 'La derribo con fuerza', values: { fear: 0, aggression: 3, curiosity: 1, survival: 0 } }
        ]
      },
      {
        id: 3,
        text: 'Un animatrónico te está persiguiendo. ¿Cuál es tu instinto?',
        options: [
          { text: 'Correr lo más rápido posible', values: { fear: 2, aggression: 0, curiosity: 0, survival: 3 } },
          { text: 'Esconderme en un lugar oscuro', values: { fear: 3, aggression: 0, curiosity: 0, survival: 2 } },
          { text: 'Estudiar sus patrones de movimiento', values: { fear: 0, aggression: 0, curiosity: 3, survival: 1 } },
          { text: 'Enfrentarlo directamente', values: { fear: 0, aggression: 3, curiosity: 0, survival: 1 } }
        ]
      },
      {
        id: 4,
        text: '¿Qué te da más miedo del universo FNAF?',
        options: [
          { text: 'Los animatronics moviéndose en la oscuridad', values: { fear: 3, aggression: 0, curiosity: 0, survival: 1 } },
          { text: 'La historia detrás de las víctimas', values: { fear: 1, aggression: 0, curiosity: 2, survival: 0 } },
          { text: 'La idea de no poder escapar', values: { fear: 2, aggression: 0, curiosity: 0, survival: 3 } },
          { text: 'William Afton y su crueldad', values: { fear: 1, aggression: 2, curiosity: 1, survival: 0 } }
        ]
      },
      {
        id: 5,
        text: 'En un minijuego de 8-bit, ¿qué camino eliges?',
        options: [
          { text: 'El camino más oscuro y misterioso', values: { fear: 1, aggression: 0, curiosity: 3, survival: 0 } },
          { text: 'El camino seguro y marcado', values: { fear: 2, aggression: 0, curiosity: 0, survival: 3 } },
          { text: 'El camino que parece más peligroso', values: { fear: 0, aggression: 2, curiosity: 2, survival: 0 } },
          { text: 'El camino que ayuda a otros personajes', values: { fear: 0, aggression: 0, curiosity: 1, survival: 1 } }
        ]
      },
      {
        id: 6,
        text: '¿Qué cualidad te define mejor?',
        options: [
          { text: 'Liderazgo natural, siempre tomo el control', values: { fear: 0, aggression: 2, curiosity: 1, survival: 1 } },
          { text: 'Lealtad inquebrantable hacia quienes protejo', values: { fear: 1, aggression: 0, curiosity: 0, survival: 3 } },
          { text: 'Curiosidad insaciable, siempre busco respuestas', values: { fear: 0, aggression: 0, curiosity: 3, survival: 0 } },
          { text: 'Velocidad y astucia para superar obstáculos', values: { fear: 0, aggression: 1, curiosity: 1, survival: 2 } }
        ]
      },
      {
        id: 7,
        text: 'Si pudieras ser un animatrónico, ¿cuál elegirías?',
        options: [
          { text: 'Freddy Fazbear - el líder carismático', values: { fear: 0, aggression: 2, curiosity: 1, survival: 1 } },
          { text: 'Bonnie - el sigilioso y misterioso', values: { fear: 1, aggression: 1, curiosity: 2, survival: 0 } },
          { text: 'Chica - la que siempre está en acción', values: { fear: 0, aggression: 1, curiosity: 1, survival: 2 } },
          { text: 'Foxy - el rápido y salvaje', values: { fear: 0, aggression: 3, curiosity: 0, survival: 1 } }
        ]
      },
      {
        id: 8,
        text: 'Encuentras un diario con secretos oscuros. ¿Qué haces?',
        options: [
          { text: 'Lo leo entero, necesito saber la verdad', values: { fear: 0, aggression: 0, curiosity: 3, survival: 0 } },
          { text: 'Lo leo con precaución, preparado para lo peor', values: { fear: 1, aggression: 0, curiosity: 2, survival: 2 } },
          { text: 'Lo destruyo, mejor no saber', values: { fear: 2, aggression: 0, curiosity: 0, survival: 3 } },
          { text: 'Lo uso como arma o herramienta', values: { fear: 0, aggression: 2, curiosity: 1, survival: 1 } }
        ]
      },
      {
        id: 9,
        text: '¿Cómo enfrentas una situación de peligro extremo?',
        options: [
          { text: 'Mantengo la calma y analizo', values: { fear: 0, aggression: 0, curiosity: 2, survival: 3 } },
          { text: 'Actúo por instinto, sin pensar', values: { fear: 1, aggression: 2, curiosity: 0, survival: 2 } },
          { text: 'Busco ayuda o aliados', values: { fear: 1, aggression: 0, curiosity: 1, survival: 2 } },
          { text: 'Enfrento la amenaza de frente', values: { fear: 0, aggression: 3, curiosity: 0, survival: 0 } }
        ]
      },
      {
        id: 10,
        text: '¿Cuál es tu mayor fortaleza?',
        options: [
          { text: 'Mi coraje para enfrentar lo desconocido', values: { fear: 0, aggression: 2, curiosity: 2, survival: 0 } },
          { text: 'Mi habilidad para esconderme y sobrevivir', values: { fear: 2, aggression: 0, curiosity: 0, survival: 3 } },
          { text: 'Mi inteligencia para resolver misterios', values: { fear: 0, aggression: 0, curiosity: 3, survival: 1 } },
          { text: 'Mi velocidad para huir o atacar', values: { fear: 0, aggression: 1, curiosity: 0, survival: 2 } }
        ]
      }
    ],
    results: {
      freddy: {
        name: 'FREDDY FAZBEAR',
        emoji: '🐻',
        description: 'Eres un líder nato, carismático y controlador. Como Freddy, siempre estás al frente, tomando decisiones y protegiendo a tu grupo. Tu presencia inspira respeto (y algo de miedo). Tienes una dualidad: por fuera eres encantador, pero por dentro albergas una oscuridad que pocos conocen.',
        lore: 'Freddy Fazbear es el animatrónico principal de Freddy Fazbear\'s Pizza. Originalmente fue creado para entretener a los niños, pero tras el asesinato de cinco niños por parte de William Afton, las almas de las víctimas quedaron atrapadas dentro de los animatrónicos.',
        behavior: 'Líder natural, protector, con un lado oscuro oculto. Siempre está al tanto de lo que ocurre a su alrededor.',
        stats: { liderazgo: 90, misterio: 70, peligro: 80, lealtad: 85 }
      },
      bonnie: {
        name: 'BONNIE',
        emoji: '🐰',
        description: 'Eres misterioso, sigiloso e intelectual. Como Bonnie, prefieres observar desde las sombras antes de actuar. Tienes una mente analítica que te permite ver patrones donde otros solo ven caos. Tu naturaleza introspectiva te hace ser el más enigmático del grupo.',
        lore: 'Bonnie es el animatrónico conejo de Freddy Fazbear\'s Pizza. Es conocido por ser el más activo de los animatrónicos durante la noche, moviéndose frequentemente por las cámaras y el pasillo izquierdo.',
        behavior: 'Sigiloso, analítico, misterioso. Siempre observa antes de actuar y tiene la capacidad de moverse sin ser detectado.',
        stats: { lealtad: 75, misterio: 95, peligro: 70, curiosidad: 85 }
      },
      chica: {
        name: 'CHICA',
        emoji: '🐤',
        description: 'Eres enérgica, determinada y siempre estás en acción. Como Chica, no te quedas quieta; siempre estás buscando tu próxima movimiento. Tu naturaleza práctica te hace ser la más resolutiva del grupo, pero a veces tu impulsividad te puede jugar en contra.',
        lore: 'Chica the Cat (o Chica the Bunny en FNaF 1) es el animatrónico del sexo femenino de Freddy Fazbear\'s Pizza. Es conocida por ser la más activa en la cocina y por buscar comida constantemente.',
        behavior: 'Activa, práctica, impulsiva. Siempre está en movimiento y no tolera la inactividad.',
        stats: { lealtad: 80, misterio: 60, peligro: 75, supervivencia: 90 }
      },
      foxy: {
        name: 'FOXY',
        emoji: '🦊',
        description: 'Eres veloz, astuto y algo salvaje. Como Foxy, confías en tu velocidad y instinto para superar cualquier obstáculo. Eres el más independiente del grupo y prefieres actuar por tu cuenta. Tu naturaleza rebelde te hace impredecible y peligroso.',
        lore: 'Foxy es el animatrónico zorro de Freddy Fazbear\'s Pizza. A diferencia de los demás, Foxy no actúa en equipo; prefiere cazar por su cuenta en el Pirate\'s Cove. Es el más rápido y el más peligroso de los animatrónicos.',
        behavior: 'Independiente, rápido, salvaje. Caza por su cuenta y no sigue reglas. Es el más impredecible de todos.',
        stats: { lealtad: 50, misterio: 80, peligro: 95, supervivencia: 70 }
      },
      goldenFreddy: {
        name: 'GOLDEN FREDDY',
        emoji: '✨',
        description: 'Eres el más misterioso y poderoso de todos. Como Golden Freddy, existes fuera de las reglas normales. Tu presencia es etérea y tu poder es casi ilimitado. Eres la encarnación del misterio más profundo del universo FNAF.',
        lore: 'Golden Freddy es una de las entidades más misteriosas de FNaF. No sigue las reglas del juego ni del lore. Se cree que es la manifestación del alma de Cassidy, la víctima que se niega a dejar morir a William Afton.',
        behavior: 'Etereo, poderoso, omnipresente. Existe fuera de las reglas y su presencia causa terror absoluto.',
        stats: { lealtad: 100, misterio: 100, peligro: 100, supervivencia: 100 }
      }
    }
  },
  trivia: {
    easy: [
      { q: '¿Cómo se llama el restaurante principal de FNaF 1?', options: ['Freddy Fazbear\'s Pizza', 'Chica\'s Kitchen', 'Bonnie\'s Arcade', 'Foxy\'s Cove'], answer: 0 },
      { q: '¿Cuántas noches debe sobrevivir el guardia en FNaF 1?', options: ['4', '5', '6', '7'], answer: 1 },
      { q: '¿Quién es el asesino de los cinco niños?', options: ['Michael Afton', 'William Afton', 'Henry Emily', 'Phone Guy'], answer: 1 },
      { q: '¿Cuál es el nombre del animatrónico que se esconde en Pirate\'s Cove?', options: ['Freddy', 'Bonnie', 'Chica', 'Foxy'], answer: 3 },
      { q: '¿Qué animatrónico aparece en la cámara 1A de FNaF 1?', options: ['Foxy', 'Golden Freddy', 'Freddy, Bonnie y Chica', 'Springtrap'], answer: 2 },
      { q: '¿Cómo se llama el libro que revela la historia de William Afton?', options: ['The Silver Eyes', 'The Twisted Ones', 'The Fourth Closet', 'Fazbear Frights'], answer: 0 },
      { q: '¿Qué es lo que dice Golden Freddy cuando aparece?', options: ['HELP ME', 'IT\'S ME', 'I SEE YOU', 'RUN'], answer: 1 },
      { q: '¿En qué año se fundó Freddy Fazbear\'s Pizza?', options: ['1983', '1985', '1987', '1993'], answer: 0 }
    ],
    medium: [
      { q: '¿Cuál es el nombre real del Purple Guy?', options: ['Michael Afton', 'William Afton', 'Henry Emily', 'Dave Miller'], answer: 1 },
      { q: '¿Qué animatrónico contiene los huesos de las víctimas en FNaF 1?', options: ['Freddy', 'Bonnie', 'Chica', 'Foxy'], answer: 2 },
      { q: '¿Cómo se llama el padre del Crying Child?', options: ['Henry Emily', 'William Afton', 'Phone Guy', 'Scott'], answer: 1 },
      { q: '¿Qué es Ennard?', options: ['Un animatrónico de circo', 'Una fusión de animatrónicos', 'Un fantasma', 'Un programa de computadora'], answer: 1 },
      { q: '¿Cuál es el nombre del bunker secreto en Sister Location?', options: ['Circus Baby\'s Entertainment', 'Fazbear\'s Fright', 'The Underground', 'Afton Robotics'], answer: 0 },
      { q: '¿Qué es Glitchtrap?', options: ['Un virus informático', 'La conciencia digital de William Afton', 'Un animatrónico del juego VR', 'Un error del sistema'], answer: 1 },
      { q: '¿Cuántos niños asesinó William Afton originalmente?', options: ['3', '4', '5', '6'], answer: 2 },
      { q: '¿Qué es The Puppet?', options: ['Un animatrónico de marioneta', 'La manifestación del alma de Emily', 'Un programa de IA', 'Una herramienta de Afton'], answer: 1 }
    ],
    expert: [
      { q: '¿Qué es "The Bite of \'87"?', options: ['El ataque de Golden Freddy', 'El incidente donde un animatrónico mordió a un empleado', 'La destrucción de Fazbear\'s Fright', 'El asesinato de los cinco niños'], answer: 1 },
      { q: '¿Quién es Cassidy en el lore?', options: ['La primera víctima de Afton', 'El alma de Golden Freddy', 'La hermana del Crying Child', 'Una investigadora de Fazbear'], answer: 1 },
      { q: '¿Qué es "UCN" según la teoría más aceptada?', options: ['Un juego de VR', 'El infierno de William Afton', 'Un sueño de Michael', 'Una simulación de Fazbear'], answer: 1 },
      { q: '¿Cuál es la relación entre Henry Emily y William Afton?', options: ['Hermanos', 'Socios de negocio', 'Padre e hijo', 'Enemigos sin conexión'], answer: 1 },
      { q: '¿Qué es "The Blob" en Security Breach?', options: ['Un nuevo animatrónico', 'La fusión de todas las víctimas', 'Un virus digital', 'Una criatura del subsuelo'], answer: 1 },
      { q: '¿Quién creó los animatrónicos originales?', options: ['Scott Cawthon', 'William Afton', 'Henry Emily', 'Fazbear Entertainment'], answer: 1 },
      { q: '¿Qué es "Remnant" en el lore?', options: ['Un tipo de metal', 'Almas atrapadas en metal fundido', 'Un programa de IA', 'Una droga'], answer: 1 },
      { q: '¿Cuál es el destino final de William Afton según UCN?', options: ['Muerte eterna', 'Infierno personal de Cassidy', 'Reencarnación', 'Liberación'], answer: 1 }
    ],
    hidden: [
      { q: '¿Qué es "Fredbear\'s Family Diner" en relación con FNaF 4?', options: ['El restaurante del padre del Crying Child', 'La ubicación del "Bite of \'83"', 'El primer restaurante de Afton', 'Todo lo anterior'], answer: 3 },
      { q: '¿Qué son los "illusion discs" en el lore?', options: ['Discos que crean ilusiones visuales', 'Discos que cambian la forma de los animatrónicos', 'Discos que controlan la mente', 'Discos que graban recuerdos'], answer: 1 },
      { q: '¿Quién es "Old Man Consequences" en UCN?', options: ['Una entidad que representa la paz', 'William Afton en otra forma', 'Un guardia de seguridad', 'Un animatrónico oculto'], answer: 0 },
      { q: '¿Qué es "Remnant" y por qué es importante?', options: ['Es el metal que contiene las almas de las víctimas', 'Es un tipo de energía sobrenatural', 'Es la conciencia de los animatrónicos', 'Es la sangre de las víctimas'], answer: 0 }
    ]
  }
};
