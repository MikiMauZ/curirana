// Módulo de ejercicios de respiración para Curirana

// Configuración de ejercicios de respiración
const BREATHING_EXERCISES = [
  {
    id: 'relaxing',
    name: 'Respiración 4-7-8',
    description: 'Técnica relajante que ayuda a disminuir el estrés y favorecer el sueño.',
    instructions: 'Inhala por la nariz contando hasta 4, mantén la respiración contando hasta 7, y exhala lentamente por la boca contando hasta 8.',
    timings: {
      inhale: 4,
      hold: 7,
      exhale: 8,
      pause: 1
    },
    benefits: [
      'Reduce la ansiedad',
      'Favorece la relajación profunda',
      'Ayuda a conciliar el sueño',
      'Disminuye la tensión muscular'
    ],
    color: '#a1d9c9', // verde menta
    animation: 'circle',
    icon: 'moon'
  },
  {
    id: 'balanced',
    name: 'Respiración Cuadrada',
    description: 'Técnica equilibrante que ayuda a calmar la mente y estabilizar emociones.',
    instructions: 'Inhala por la nariz contando hasta 4, mantén la respiración contando hasta 4, exhala por la boca contando hasta 4, y mantén los pulmones vacíos contando hasta 4.',
    timings: {
      inhale: 4,
      hold: 4,
      exhale: 4,
      pause: 4
    },
    benefits: [
      'Equilibra el sistema nervioso',
      'Mejora la concentración',
      'Calma la mente',
      'Reduce el estrés inmediato'
    ],
    color: '#b5a4d0', // lavanda
    animation: 'square',
    icon: 'square'
  },
  {
    id: 'calming',
    name: 'Respiración Tranquilizante',
    description: 'Técnica fluida que genera sensación de calma y reduce la ansiedad.',
    instructions: 'Inhala lentamente por la nariz contando hasta 5, y exhala por la boca contando hasta 7, como si soplases suavemente a través de una pajita.',
    timings: {
      inhale: 5,
      hold: 0,
      exhale: 7,
      pause: 1
    },
    benefits: [
      'Activa el sistema nervioso parasimpático',
      'Reduce la frecuencia cardíaca',
      'Disminuye la presión arterial',
      'Proporciona sensación de calma inmediata'
    ],
    color: '#f8a6a1', // coral/salmón pastel
    animation: 'wave',
    icon: 'wind'
  },
  {
    id: 'body-scan',
    name: 'Relajación Progresiva',
    description: 'Técnica de respiración combinada con atención a las sensaciones corporales.',
    instructions: 'Inhala por la nariz mientras tensas un grupo muscular, mantén la respiración y la tensión por 2 segundos, y exhala por la boca mientras relajas los músculos.',
    timings: {
      inhale: 4,
      hold: 2,
      exhale: 6,
      pause: 2
    },
    benefits: [
      'Libera la tensión física acumulada',
      'Aumenta la conciencia corporal',
      'Reduce el insomnio',
      'Disminuye dolores causados por tensión'
    ],
    color: '#8fc0a9', // verde bosque claro
    animation: 'body',
    icon: 'target'
  }
];

// Estado de la aplicación
let currentExercise = null;
let isBreathingActive = false;
let breathingInterval = null;
let currentPhase = 'ready';
let secondsLeft = 0;
let totalCycles = 0;
let completedCycles = 0;
let breathingStartTime = null;

// Inicializar módulo de respiración
function initBreathingModule() {
  console.log('Módulo de respiración inicializado');
  
  // Configurar selector de ejercicios
  const exerciseSelector = document.getElementById('breathing-exercise-selector');
  if (exerciseSelector) {
    setupExerciseSelector(exerciseSelector);
  }
  
  // Configurar controles de respiración
  const breathingControls = document.getElementById('breathing-controls');
  if (breathingControls) {
    setupBreathingControls(breathingControls);
  }
  
  // Configurar animación de respiración
  const breathingAnimation = document.getElementById('breathing-animation');
  if (breathingAnimation) {
    setupBreathingAnimation(breathingAnimation);
  }
  
  // Configurar sección de beneficios
  const benefitsSection = document.getElementById('breathing-benefits');
  if (benefitsSection) {
    setupBenefitsSection(benefitsSection);
  }
  
  // Seleccionar ejercicio por defecto
  selectExercise('relaxing');
}

// Configurar selector de ejercicios
function setupExerciseSelector(container) {
  // Crear contenedor de tarjetas
  const exercisesGrid = document.createElement('div');
  exercisesGrid.className = 'exercises-grid';
  
  // Generar tarjetas para cada ejercicio
  BREATHING_EXERCISES.forEach(exercise => {
    const card = document.createElement('div');
    card.className = 'exercise-card';
    card.dataset.exerciseId = exercise.id;
    
    card.innerHTML = `
      <div class="exercise-icon" style="background-color: ${exercise.color}">
        <i data-feather="${exercise.icon}"></i>
      </div>
      <div class="exercise-info">
        <h3>${exercise.name}</h3>
        <p>${exercise.description}</p>
      </div>
    `;
    
    // Evento al hacer clic en una tarjeta
    card.addEventListener('click', () => {
      // Si hay un ejercicio activo, confirmar cambio
      if (isBreathingActive) {
        window.uiHelper.showConfirm(
          '¿Estás seguro de que quieres cambiar de ejercicio? Se detendrá el ejercicio actual.',
          () => {
            stopBreathing();
            selectExercise(exercise.id);
          }
        );
      } else {
        selectExercise(exercise.id);
      }
    });
    
    exercisesGrid.appendChild(card);
  });
  
  // Agregar contenedor al DOM
  container.appendChild(exercisesGrid);
  
  // Inicializar iconos Feather
  if (typeof feather !== 'undefined') {
    feather.replace();
  }
}

// Seleccionar ejercicio
function selectExercise(exerciseId) {
  // Obtener ejercicio
  currentExercise = BREATHING_EXERCISES.find(ex => ex.id === exerciseId);
  
  if (!currentExercise) {
    console.error(`Ejercicio no encontrado: ${exerciseId}`);
    return;
  }
  
  // Actualizar tarjetas seleccionadas
  document.querySelectorAll('.exercise-card').forEach(card => {
    if (card.dataset.exerciseId === exerciseId) {
      card.classList.add('selected');
    } else {
      card.classList.remove('selected');
    }
  });
  
  // Actualizar instrucciones
  const instructionsEl = document.getElementById('breathing-instructions');
  if (instructionsEl) {
    instructionsEl.textContent = currentExercise.instructions;
  }
  
  // Actualizar beneficios
  updateBenefitsSection();
  
  // Configurar visualización de animación
  setupAnimationForExercise();
  
  console.log(`Ejercicio seleccionado: ${currentExercise.name}`);
}

// Configurar controles de respiración
function setupBreathingControls(container) {
  // Crear elementos de control
  const controlsHTML = `
    <div class="breathing-buttons">
      <button id="start-breathing" class="btn btn-primary">
        <i data-feather="play"></i>
        <span>Comenzar</span>
      </button>
      <button id="stop-breathing" class="btn" style="display: none;">
        <i data-feather="square"></i>
        <span>Detener</span>
      </button>
    </div>
    <div class="breathing-config">
      <div class="form-group">
        <label for="cycles-input">Ciclos:</label>
        <select id="cycles-input" class="form-control">
          <option value="3">3 ciclos (~ 2 min)</option>
          <option value="5" selected>5 ciclos (~ 3 min)</option>
          <option value="10">10 ciclos (~ 7 min)</option>
          <option value="0">Continuo</option>
        </select>
      </div>
      <div class="form-group">
        <label for="speed-input">Velocidad:</label>
        <select id="speed-input" class="form-control">
          <option value="0.75">Más lento</option>
          <option value="1" selected>Normal</option>
          <option value="1.25">Más rápido</option>
        </select>
      </div>
    </div>
    <div id="breathing-status" class="breathing-status" style="display: none;">
      <div class="breathing-phase">Preparado</div>
      <div class="breathing-progress">
        <div class="progress-bar"></div>
      </div>
      <div class="breathing-stats">
        <span id="cycle-counter">Ciclo 0 de 5</span>
        <span id="time-elapsed">00:00</span>
      </div>
    </div>
  `;
  
  // Agregar HTML al contenedor
  container.innerHTML = controlsHTML;
  
  // Configurar eventos
  const startBtn = document.getElementById('start-breathing');
  const stopBtn = document.getElementById('stop-breathing');
  
  if (startBtn && stopBtn) {
    startBtn.addEventListener('click', startBreathing);
    stopBtn.addEventListener('click', stopBreathing);
  }
  
  // Inicializar iconos Feather
  if (typeof feather !== 'undefined') {
    feather.replace();
  }
}

// Iniciar ejercicio de respiración
function startBreathing() {
  if (!currentExercise) {
    window.uiHelper.showAlert('Por favor, selecciona un ejercicio de respiración', 'warning');
    return;
  }
  
  // Obtener configuración
  const cyclesInput = document.getElementById('cycles-input');
  const speedInput = document.getElementById('speed-input');
  
  totalCycles = cyclesInput ? parseInt(cyclesInput.value, 10) : 5;
  const speed = speedInput ? parseFloat(speedInput.value) : 1;
  
  // Resetear contadores
  completedCycles = 0;
  breathingStartTime = new Date();
  
  // Actualizar UI
  document.getElementById('start-breathing').style.display = 'none';
  document.getElementById('stop-breathing').style.display = 'inline-flex';
  document.getElementById('breathing-status').style.display = 'block';
  document.getElementById('cycle-counter').textContent = `Ciclo ${completedCycles} de ${totalCycles > 0 ? totalCycles : '∞'}`;
  
  // Desactivar cambio de ejercicios durante la respiración
  document.querySelectorAll('.exercise-card').forEach(card => {
    card.classList.add('disabled');
  });
  
  // Iniciar respiración
  isBreathingActive = true;
  startBreathingCycle(speed);
  
  // Iniciar temporizador
  startElapsedTimeCounter();
  
  console.log(`Iniciando ejercicio: ${currentExercise.name}, Ciclos: ${totalCycles}, Velocidad: ${speed}`);
}

// Detener ejercicio de respiración
function stopBreathing() {
  isBreathingActive = false;
  
  // Detener intervalos
  clearInterval(breathingInterval);
  clearInterval(window.breathingTimeInterval);
  
  // Actualizar UI
  document.getElementById('start-breathing').style.display = 'inline-flex';
  document.getElementById('stop-breathing').style.display = 'none';
  document.getElementById('breathing-status').style.display = 'none';
  
  // Habilitar cambio de ejercicios
  document.querySelectorAll('.exercise-card').forEach(card => {
    card.classList.remove('disabled');
  });
  
  // Resetear animación
  resetBreathingAnimation();
  
  console.log('Ejercicio detenido');
  
  // Mostrar mensaje de finalización
  if (completedCycles > 0) {
    const timeElapsed = Math.floor((new Date() - breathingStartTime) / 1000);
    const minutes = Math.floor(timeElapsed / 60);
    const seconds = timeElapsed % 60;
    
    window.uiHelper.showAlert(
      `¡Bien hecho! Has completado ${completedCycles} ${completedCycles === 1 ? 'ciclo' : 'ciclos'} en ${minutes}:${seconds.toString().padStart(2, '0')}.`,
      'success',
      5000
    );
  }
}

// Iniciar temporizador
function startElapsedTimeCounter() {
  const timeElement = document.getElementById('time-elapsed');
  if (!timeElement) return;
  
  const startTime = new Date();
  
  window.breathingTimeInterval = setInterval(() => {
    if (!isBreathingActive) {
      clearInterval(window.breathingTimeInterval);
      return;
    }
    
    const elapsedSeconds = Math.floor((new Date() - startTime) / 1000);
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;
    
    timeElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, 1000);
}

// Iniciar ciclo de respiración
function startBreathingCycle(speed = 1) {
  if (!isBreathingActive || !currentExercise) return;
  
  const phases = [
    { name: 'inhale', duration: currentExercise.timings.inhale, text: 'Inhala', delay: 0 },
    { name: 'hold', duration: currentExercise.timings.hold, text: 'Mantén', delay: currentExercise.timings.inhale },
    { name: 'exhale', duration: currentExercise.timings.exhale, text: 'Exhala', delay: currentExercise.timings.inhale + currentExercise.timings.hold },
    { name: 'pause', duration: currentExercise.timings.pause, text: 'Pausa', delay: currentExercise.timings.inhale + currentExercise.timings.hold + currentExercise.timings.exhale }
  ];
  
  // Filtrar fases con duración > 0
  const activePhases = phases.filter(phase => phase.duration > 0);
  
  // Duración total del ciclo
  const totalDuration = phases.reduce((sum, phase) => sum + phase.duration, 0);
  
  // Ajustar tiempos según velocidad
  activePhases.forEach(phase => {
    phase.duration = phase.duration / speed;
    phase.delay = phase.delay / speed;
  });
  
  // Iniciar fases
  activePhases.forEach(phase => {
    setTimeout(() => {
      if (!isBreathingActive) return;
      
      currentPhase = phase.name;
      secondsLeft = phase.duration;
      
      // Actualizar UI
      const phaseElement = document.querySelector('.breathing-phase');
      if (phaseElement) {
        phaseElement.textContent = phase.text;
      }
      
      // Actualizar animación
      updateBreathingAnimation(phase.name);
      
      // Iniciar contador regresivo para esta fase
      const progressBar = document.querySelector('.progress-bar');
      if (progressBar) {
        progressBar.style.width = '100%';
        progressBar.style.transition = `width ${phase.duration}s linear`;
        
        // Forzar repintado
        progressBar.offsetHeight;
        
        // Iniciar transición
        progressBar.style.width = '0%';
      }
      
      console.log(`Fase: ${phase.text}, Duración: ${phase.duration}s`);
    }, phase.delay * 1000);
  });
  
  // Planificar el siguiente ciclo
  breathingInterval = setTimeout(() => {
    if (!isBreathingActive) return;
    
    completedCycles++;
    
    // Actualizar contador de ciclos
    const cycleCounter = document.getElementById('cycle-counter');
    if (cycleCounter) {
      cycleCounter.textContent = `Ciclo ${completedCycles} de ${totalCycles > 0 ? totalCycles : '∞'}`;
    }
    
    // Verificar si se ha completado el número de ciclos
    if (totalCycles > 0 && completedCycles >= totalCycles) {
      stopBreathing();
    } else {
      // Iniciar siguiente ciclo
      startBreathingCycle(speed);
    }
  }, (totalDuration / speed) * 1000);
}

// Configurar animación para el ejercicio seleccionado
function setupAnimationForExercise() {
  if (!currentExercise) return;
  
  const animationContainer = document.getElementById('breathing-animation');
  if (!animationContainer) return;
  
  // Limpiar animación anterior
  animationContainer.innerHTML = '';
  
  // Crear elemento de animación según tipo
  switch (currentExercise.animation) {
    case 'circle':
      createCircleAnimation(animationContainer);
      break;
    case 'square':
      createSquareAnimation(animationContainer);
      break;
    case 'wave':
      createWaveAnimation(animationContainer);
      break;
    case 'body':
      createBodyScanAnimation(animationContainer);
      break;
    default:
      createCircleAnimation(animationContainer);
  }
}

// Crear animación de círculo
function createCircleAnimation(container) {
  const circleContainer = document.createElement('div');
  circleContainer.className = 'circle-animation-container';
  
  const circle = document.createElement('div');
  circle.className = 'breathing-circle';
  circle.style.backgroundColor = currentExercise.color;
  
  const innerText = document.createElement('div');
  innerText.className = 'breathing-text';
  innerText.textContent = 'Respira';
  
  circle.appendChild(innerText);
  circleContainer.appendChild(circle);
  container.appendChild(circleContainer);
}

// Crear animación de cuadrado
function createSquareAnimation(container) {
  const squareContainer = document.createElement('div');
  squareContainer.className = 'square-animation-container';
  
  const square = document.createElement('div');
  square.className = 'breathing-square';
  square.style.borderColor = currentExercise.color;
  
  const dot = document.createElement('div');
  dot.className = 'breathing-dot';
  dot.style.backgroundColor = currentExercise.color;
  
  const innerText = document.createElement('div');
  innerText.className = 'breathing-text';
  innerText.textContent = 'Respira';
  
  square.appendChild(innerText);
  squareContainer.appendChild(square);
  squareContainer.appendChild(dot);
  container.appendChild(squareContainer);
}

// Crear animación de onda
function createWaveAnimation(container) {
  const waveContainer = document.createElement('div');
  waveContainer.className = 'wave-animation-container';
  
  // Crear ondas
  for (let i = 0; i < 3; i++) {
    const wave = document.createElement('div');
    wave.className = 'breathing-wave';
    wave.style.borderColor = currentExercise.color;
    wave.style.animationDelay = `${i * 0.2}s`;
    waveContainer.appendChild(wave);
  }
  
  const innerText = document.createElement('div');
  innerText.className = 'breathing-text';
  innerText.textContent = 'Respira';
  
  waveContainer.appendChild(innerText);
  container.appendChild(waveContainer);
}

// Crear animación de escaneo corporal
function createBodyScanAnimation(container) {
  const bodyContainer = document.createElement('div');
  bodyContainer.className = 'body-scan-container';
  
  const bodyOutline = document.createElement('div');
  bodyOutline.className = 'body-outline';
  bodyOutline.innerHTML = `
    <svg viewBox="0 0 100 200" xmlns="http://www.w3.org/2000/svg">
      <path d="M50,10 C60,10 70,15 70,30 C70,45 65,50 65,60 C65,70 80,80 80,100 C80,120 75,150 70,170 C65,190 60,195 50,195 C40,195 35,190 30,170 C25,150 20,120 20,100 C20,80 35,70 35,60 C35,50 30,45 30,30 C30,15 40,10 50,10 Z" 
        fill="transparent" 
        stroke="${currentExercise.color}" 
        stroke-width="2" />
    </svg>
  `;
  
  const scanLine = document.createElement('div');
  scanLine.className = 'scan-line';
  scanLine.style.backgroundColor = currentExercise.color;
  
  const innerText = document.createElement('div');
  innerText.className = 'breathing-text';
  innerText.textContent = 'Respira y relaja';
  
  bodyContainer.appendChild(bodyOutline);
  bodyContainer.appendChild(scanLine);
  bodyContainer.appendChild(innerText);
  container.appendChild(bodyContainer);
}

// Actualizar animación según fase de respiración
function updateBreathingAnimation(phase) {
  if (!currentExercise) return;
  
  const animationType = currentExercise.animation;
  const textElement = document.querySelector('.breathing-text');
  
  if (textElement) {
    textElement.textContent = phase === 'inhale' ? 'Inhala' : 
                             phase === 'hold' ? 'Mantén' : 
                             phase === 'exhale' ? 'Exhala' : 'Pausa';
  }
  
  switch (animationType) {
    case 'circle':
      updateCircleAnimation(phase);
      break;
    case 'square':
      updateSquareAnimation(phase);
      break;
    case 'wave':
      updateWaveAnimation(phase);
      break;
    case 'body':
      updateBodyScanAnimation(phase);
      break;
    default:
      updateCircleAnimation(phase);
  }
}

// Actualizar animación de círculo
function updateCircleAnimation(phase) {
  const circle = document.querySelector('.breathing-circle');
  if (!circle) return;
  
  // Quitar clases anteriores
  circle.classList.remove('inhale', 'hold', 'exhale', 'pause');
  
  // Añadir clase para la fase actual
  circle.classList.add(phase);
  
  switch (phase) {
    case 'inhale':
      circle.style.transform = 'scale(1.5)';
      circle.style.opacity = '1';
      break;
    case 'hold':
      circle.style.transform = 'scale(1.5)';
      circle.style.opacity = '1';
      break;
    case 'exhale':
      circle.style.transform = 'scale(1)';
      circle.style.opacity = '0.8';
      break;
    case 'pause':
      circle.style.transform = 'scale(1)';
      circle.style.opacity = '0.8';
      break;
  }
}

// Actualizar animación de cuadrado
function updateSquareAnimation(phase) {
  const dot = document.querySelector('.breathing-dot');
  if (!dot) return;
  
  // Duración de la animación según la fase
  const duration = currentExercise.timings[phase] + 's';
  dot.style.transition = `top ${duration}, left ${duration}`;
  
  switch (phase) {
    case 'inhale': // Mover hacia arriba
      dot.style.top = '0';
      dot.style.left = '50%';
      break;
    case 'hold': // Mover hacia la derecha
      dot.style.top = '50%';
      dot.style.left = '100%';
      break;
    case 'exhale': // Mover hacia abajo
      dot.style.top = '100%';
      dot.style.left = '50%';
      break;
    case 'pause': // Mover hacia la izquierda
      dot.style.top = '50%';
      dot.style.left = '0';
      break;
  }
}

// Actualizar animación de onda
function updateWaveAnimation(phase) {
  const waves = document.querySelectorAll('.breathing-wave');
  if (!waves.length) return;
  
  waves.forEach(wave => {
    // Quitar clases anteriores
    wave.classList.remove('inhale', 'hold', 'exhale', 'pause');
    
    // Añadir clase para la fase actual
    wave.classList.add(phase);
  });
  
  switch (phase) {
    case 'inhale':
      waves.forEach(wave => {
        wave.style.transform = 'scale(1.5)';
        wave.style.opacity = '0.8';
      });
      break;
    case 'hold':
      waves.forEach(wave => {
        wave.style.transform = 'scale(1.5)';
        wave.style.opacity = '0.8';
      });
      break;
    case 'exhale':
      waves.forEach(wave => {
        wave.style.transform = 'scale(1)';
        wave.style.opacity = '0.4';
      });
      break;
    case 'pause':
      waves.forEach(wave => {
        wave.style.transform = 'scale(1)';
        wave.style.opacity = '0.4';
      });
      break;
  }
}

// Actualizar animación de escaneo corporal
function updateBodyScanAnimation(phase) {
  const scanLine = document.querySelector('.scan-line');
  if (!scanLine) return;
  
  // Duración de la animación según la fase
  const duration = currentExercise.timings[phase] + 's';
  scanLine.style.transition = `top ${duration}`;
  
  switch (phase) {
    case 'inhale': // Mover desde arriba hacia abajo
      scanLine.style.top = '80%';
      break;
    case 'hold': // Mantener abajo
      scanLine.style.top = '80%';
      break;
    case 'exhale': // Mover hacia arriba
      scanLine.style.top = '20%';
      break;
    case 'pause': // Mantener arriba
      scanLine.style.top = '20%';
      break;
  }
}

// Resetear animación
function resetBreathingAnimation() {
  if (!currentExercise) return;
  
  const animationType = currentExercise.animation;
  
  switch (animationType) {
    case 'circle':
      const circle = document.querySelector('.breathing-circle');
      if (circle) {
        circle.style.transform = 'scale(1)';
        circle.style.opacity = '0.8';
      }
      break;
    case 'square':
      const dot = document.querySelector('.breathing-dot');
      if (dot) {
        dot.style.transition = 'none';
        dot.style.top = '50%';
        dot.style.left = '0';
      }
      break;
    case 'wave':
      const waves = document.querySelectorAll('.breathing-wave');
      waves.forEach(wave => {
        wave.style.transform = 'scale(1)';
        wave.style.opacity = '0.4';
      });
      break;
    case 'body':
      const scanLine = document.querySelector('.scan-line');
      if (scanLine) {
        scanLine.style.transition = 'none';
        scanLine.style.top = '20%';
      }
      break;
  }
  
  // Resetear texto
  const textElement = document.querySelector('.breathing-text');
  if (textElement) {
    textElement.textContent = 'Respira';
  }
}

// Configurar sección de beneficios
function setupBenefitsSection(container) {
  updateBenefitsSection();
}

// Actualizar sección de beneficios
function updateBenefitsSection() {
  if (!currentExercise) return;
  
  const container = document.getElementById('breathing-benefits');
  if (!container) return;
  
  // Crear lista de beneficios
  let benefitsHTML = '<h3>Beneficios</h3><ul class="benefits-list">';
  
  currentExercise.benefits.forEach(benefit => {
    benefitsHTML += `<li><i data-feather="check-circle"></i> ${benefit}</li>`;
  });
  
  benefitsHTML += '</ul>';
  
  // Agregar al DOM
  container.innerHTML = benefitsHTML;
  
  // Inicializar iconos Feather
  if (typeof feather !== 'undefined') {
    feather.replace();
  }
}

// Guardar estadísticas de ejercicios
async function saveBreathingStats(exercise, cycles, duration) {
  try {
    // Verificar si el usuario está autenticado
    const userId = window.authHelper && window.authHelper.getCurrentUserId ? 
                  window.authHelper.getCurrentUserId() : 'anonymous';
    
    // Crear objeto de estadísticas
    const stats = {
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      cycles,
      durationSeconds: duration,
      timestamp: new Date().toISOString(),
      userId
    };
    
    // Guardar en localStorage
    let breathingStats = JSON.parse(localStorage.getItem('curirana_breathing_stats') || '[]');
    breathingStats.push(stats);
    localStorage.setItem('curirana_breathing_stats', JSON.stringify(breathingStats));
    
    // Si el usuario está autenticado, guardar también en Firestore
    if (userId !== 'anonymous' && window.firebaseHelper) {
      await window.firebaseHelper.saveToFirestore('breathingStats', null, stats);
    }
    
    console.log('Estadísticas de respiración guardadas');
    return true;
  } catch (error) {
    console.error('Error al guardar estadísticas de respiración:', error);
    return false;
  }
}

// Obtener estadísticas de ejercicios
async function getBreathingStats() {
  try {
    // Verificar si el usuario está autenticado
    const userId = window.authHelper && window.authHelper.getCurrentUserId ? 
                  window.authHelper.getCurrentUserId() : 'anonymous';
    
    let stats = [];
    
    // Obtener de localStorage
    const localStats = JSON.parse(localStorage.getItem('curirana_breathing_stats') || '[]');
    
    // Si el usuario está autenticado, obtener también de Firestore
    if (userId !== 'anonymous' && window.firebaseHelper) {
      const firestoreStats = await window.firebaseHelper.queryFirestore(
        'breathingStats',
        'userId',
        '==',
        userId
      );
      
      // Combinar estadísticas y eliminar duplicados
      stats = [...localStats];
      
      firestoreStats.forEach(fsStat => {
        const exists = localStats.some(ls => 
          ls.timestamp === fsStat.timestamp && 
          ls.exerciseId === fsStat.exerciseId
        );
        
        if (!exists) {
          stats.push(fsStat);
        }
      });
    } else {
      stats = localStats;
    }
    
    return stats;
  } catch (error) {
    console.error('Error al obtener estadísticas de respiración:', error);
    return [];
  }
}

// Obtener recomendaciones personalizadas basadas en las estadísticas
async function getPersonalizedRecommendations() {
  try {
    const stats = await getBreathingStats();
    
    if (!stats || stats.length === 0) {
      return {
        hasData: false,
        message: "¡Comienza tu práctica de respiración! Te recomendamos empezar con la Respiración 4-7-8 para relajarte.",
        recommendedExercise: 'relaxing'
      };
    }
    
    // Analizar estadísticas
    const exerciseCounts = {};
    let totalDuration = 0;
    let totalCycles = 0;
    let lastExerciseTimestamp = null;
    
    stats.forEach(stat => {
      // Contar frecuencia de ejercicios
      if (!exerciseCounts[stat.exerciseId]) {
        exerciseCounts[stat.exerciseId] = 0;
      }
      exerciseCounts[stat.exerciseId]++;
      
      // Sumar duración y ciclos
      totalDuration += stat.durationSeconds || 0;
      totalCycles += stat.cycles || 0;
      
      // Actualizar última práctica
      const timestamp = new Date(stat.timestamp);
      if (!lastExerciseTimestamp || timestamp > lastExerciseTimestamp) {
        lastExerciseTimestamp = timestamp;
      }
    });
    
    // Determinar ejercicio más practicado
    let mostUsedExercise = null;
    let maxCount = 0;
    
    Object.entries(exerciseCounts).forEach(([exerciseId, count]) => {
      if (count > maxCount) {
        maxCount = count;
        mostUsedExercise = exerciseId;
      }
    });
    
    // Determinar ejercicio menos practicado
    const allExercises = BREATHING_EXERCISES.map(ex => ex.id);
    const unusedExercises = allExercises.filter(id => !exerciseCounts[id]);
    
    // Calcular días desde la última práctica
    const daysSinceLastPractice = lastExerciseTimestamp ? 
      Math.floor((new Date() - lastExerciseTimestamp) / (1000 * 60 * 60 * 24)) :
      null;
    
    // Construir recomendación
    let recommendedExercise;
    let message;
    
    if (unusedExercises.length > 0) {
      // Recomendar un ejercicio no utilizado
      recommendedExercise = unusedExercises[0];
      const exercise = BREATHING_EXERCISES.find(ex => ex.id === recommendedExercise);
      message = `¡Prueba algo nuevo! Aún no has practicado ${exercise.name}, que es excelente para ${exercise.benefits[0].toLowerCase()}.`;
    } else if (daysSinceLastPractice && daysSinceLastPractice > 3) {
      // Si hace más de 3 días que no practica
      recommendedExercise = mostUsedExercise;
      message = `Han pasado ${daysSinceLastPractice} días desde tu última práctica. ¿Qué tal retomar con tu favorita, la ${BREATHING_EXERCISES.find(ex => ex.id === mostUsedExercise).name}?`;
    } else {
      // Recomendar algo relacionado con el momento del día
      const hour = new Date().getHours();
      
      if (hour < 10) {
        // Mañana - Energizante
        recommendedExercise = 'balanced';
        message = "Por la mañana, la Respiración Cuadrada puede ayudarte a equilibrar tu energía para el día.";
      } else if (hour < 18) {
        // Tarde - Equilibrante
        recommendedExercise = 'body-scan';
        message = "Durante el día, la Relajación Progresiva puede ayudarte a liberar tensiones acumuladas.";
      } else {
        // Noche - Relajante
        recommendedExercise = 'relaxing';
        message = "Por la noche, la Respiración 4-7-8 es perfecta para relajarte antes de dormir.";
      }
    }
    
    return {
      hasData: true,
      totalSessions: stats.length,
      totalDuration,
      totalCycles,
      daysSinceLastPractice,
      favoriteExercise: mostUsedExercise,
      message,
      recommendedExercise
    };
  } catch (error) {
    console.error('Error al obtener recomendaciones personalizadas:', error);
    return {
      hasData: false,
      message: "Error al procesar tus datos. Te recomendamos la Respiración 4-7-8 para relajarte.",
      recommendedExercise: 'relaxing'
    };
  }
}

// Exportar funciones del módulo de respiración
window.breathingHelper = {
  getBreathingExercises: () => BREATHING_EXERCISES,
  selectExercise,
  startBreathing,
  stopBreathing,
  saveBreathingStats,
  getBreathingStats,
  getPersonalizedRecommendations,
  initBreathingModule
};

// Inicializar módulo cuando se carga la página
document.addEventListener('DOMContentLoaded', initBreathingModule);