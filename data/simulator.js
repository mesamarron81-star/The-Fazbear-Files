window.simulatorConfig = {
  nights: 6,
  animatronics: [
    { id: 'sim-freddy', name: 'Freddy Fazbear', startLevel: 0, ai: [0,0,1,1,2,3], movementPattern: 'hallway', icon: '🐻' },
    { id: 'sim-bonnie', name: 'Bonnie', startLevel: 0, ai: [3,5,7,8,9,10], movementPattern: 'left-door', icon: '🐰' },
    { id: 'sim-chica', name: 'Chica', startLevel: 0, ai: [2,5,7,8,9,10], movementPattern: 'right-door', icon: '🐤' },
    { id: 'sim-foxy', name: 'Foxy', startLevel: 0, ai: [1,3,5,7,8,9], movementPattern: 'pirate-cove', icon: '🦊' },
    { id: 'sim-golden', name: 'Golden Freddy', startLevel: 0, ai: [0,0,1,3,5,7], movementPattern: 'random', icon: '✨' }
  ],
  cameras: [
    { id: 'cam-1a', name: 'CAM 1A - Show Stage', animatronics: ['sim-freddy', 'sim-bonnie', 'sim-chica'] },
    { id: 'cam-1b', name: 'CAM 1B - Backstage', animatronics: ['sim-bonnie'] },
    { id: 'cam-1c', name: 'CAM 1C - Pirate\'s Cove', animatronics: ['sim-foxy'] },
    { id: 'cam-2a', name: 'CAM 2A - W. Hall', animatronics: [] },
    { id: 'cam-2b', name: 'CAM 2B - W. Hall Corner', animatronics: ['sim-bonnie'] },
    { id: 'cam-3', name: 'CAM 3 - Supply Closet', animatronics: [] },
    { id: 'cam-4a', name: 'CAM 4A - E. Hall', animatronics: [] },
    { id: 'cam-4b', name: 'CAM 4B - E. Hall Corner', animatronics: ['sim-chica'] },
    { id: 'cam-5', name: 'CAM 5 - Restrooms', animatronics: ['sim-chica'] },
    { id: 'cam-6', name: 'CAM 6 - Kitchen', animatronics: ['sim-chica'] },
    { id: 'cam-7', name: 'CAM 7 - Dining Area', animatronics: [] }
  ],
  sounds: {
    door: '🔊 Puerta',
    light: '💡 Luz',
    camera: '📷 Cámara',
    freddy: '🎵 Melodía de Freddy',
    foxy: '🏃 Pasos de Foxy',
    wind: '🌬️ Viento',
    breathing: '😤 Respiración'
  }
};
