// Módulo de gestión de pensamientos para Curirana

// Inicializar almacenamiento de pensamientos
const thoughtsStorage = window.storageHelper.createStorageManager('thoughts', 'curirana_thoughts');

// Lista de categorías de pensamientos automáticos negativos
const THOUGHT_CATEGORIES = [
  { id: 'catastrophizing', name: 'Catastrofización', description: 'Anticipar el peor resultado posible', example: 'Todo va a salir mal' },
  { id: 'black-white', name: 'Pensamiento blanco/negro', description: 'Ver las situaciones en extremos', example: 'Si no es perfecto, es un fracaso' },
  { id: 'personalization', name: 'Personalización', description: 'Asumir responsabilidad excesiva', example: 'Es mi culpa que todos estén molestos' },
  { id: 'mind-reading', name: 'Lectura mental', description: 'Asumir que sabemos lo que otros piensan', example: 'Seguro piensa que soy incompetente' },
  { id: 'fortune-telling', name: 'Adivinación', description: 'Predecir eventos negativos futuros', example: 'Seguro voy a fracasar en la entrevista' },
  { id: 'filtering', name: 'Filtro mental', description: 'Enfocarse solo en lo negativo', example: 'Todo fue terrible, nada salió bien' },
  { id: 'labeling', name: 'Etiquetado', description: 'Definirse por errores o experiencias', example: 'Soy un fracasado' },
  { id: 'should', name: 'Deberías', description: 'Expectativas rígidas sobre uno mismo', example: 'Debería ser capaz de manejar esto sin ayuda' },
  { id: 'emotional-reasoning', name: 'Razonamiento emocional', description: 'Creer que algo es cierto porque se siente así', example: 'Me siento ansioso, debe haber peligro' }
];

// Técnicas de gestión de pensamientos
const THOUGHT_TECHNIQUES = [
  { 
    id: 'observe', 
    name: 'Observar sin juzgar', 
    description: 'Observar tus pensamientos como si fueran nubes pasando por el cielo',
    steps: [
      'Siéntate cómodamente y cierra los ojos',
      'Concéntrate en tu respiración durante unos minutos',
      'Observa los pensamientos que surgen sin engancharte a ellos',
      'No te juzgues si te distraes, simplemente vuelve a la observación',
      'Practica regularmente para fortalecer esta habilidad'
    ]
  },
  { 
    id: 'defusion', 
    name: 'Defusión cognitiva', 
    description: 'Crear distancia entre tú y tus pensamientos',
    steps: [
      'Identifica el pensamiento difícil',
      'Añade al inicio: "Estoy teniendo el pensamiento de que..."',
      'O prueba: "Mi mente está pensando que..."',
      'Observa cómo cambia tu relación con ese pensamiento',
      'Practica con diferentes variaciones (cantarlo, decirlo con voz graciosa, etc.)'
    ]
  },
  { 
    id: 'challenge', 
    name: 'Cuestionar pensamientos', 
    description: 'Examinar la validez de tus pensamientos automáticos',
    steps: [
      'Identifica el pensamiento automático',
      'Evalúa las evidencias a favor y en contra',
      'Considera otras interpretaciones posibles',
      'Piensa en qué le dirías a un amigo con ese pensamiento',
      'Desarrolla una respuesta más equilibrada y realista'
    ]
  },
  { 
    id: 'leaves', 
    name: 'Hojas en el río', 
    description: 'Visualizar pensamientos como hojas flotando en un río',
    steps: [
      'Imagina un río tranquilo con hojas flotando',
      'Cuando surja un pensamiento, colócalo en una hoja',
      'Observa cómo la hoja se aleja flotando río abajo',
      'No intentes cambiar o eliminar el pensamiento',
      'Continúa con cada pensamiento que surja'
    ]
  }
];

// Metáforas para enseñar gestión de pensamientos
const THOUGHT_METAPHORS = [
  {
    id: 'cotton-candy',
    name: 'El niño y el algodón de azúcar',
    description: 'Imagina que tus pensamientos son como un niño que te pide insistentemente algodón de azúcar. El niño representa tu mente, tú eres el adulto responsable, y el algodón de azúcar es tu atención. Cuando le das atención a un pensamiento, es como darle algodón de azúcar al niño: volverá a pedirte más. En cambio, si dejas de prestarle atención, poco a poco irá pidiendo cada vez menos hasta que dejará de insistir.'
  },
  {
    id: 'clouds',
    name: 'Nubes en el cielo',
    description: 'Imagina que tus pensamientos son como nubes en el cielo. Algunas son oscuras y tormentosas, otras son ligeras y brillantes. No importa qué tipo de nubes aparezcan, el cielo siempre está ahí, amplio y espacioso. Tú eres como el cielo, y los pensamientos solo son nubes que van y vienen.'
  },
  {
    id: 'passengers',
    name: 'Pasajeros en el autobús',
    description: 'Imagina que eres el conductor de un autobús y tus pensamientos son pasajeros. Algunos pasajeros son ruidosos y te dicen a dónde debes ir. Puedes escucharlos, pero recuerda que tú eres quien decide la dirección del autobús. Los pasajeros pueden hablar, pero no tienen que controlar tu viaje.'
  }
];

// Inicializar módulo de pensamientos
function initThoughtsModule() {
  console.log('Módulo de pensamientos inicializado');
  
  // Configurar eventos para el formulario de registro de pensamientos
  const thoughtForm = document.getElementById('thought-record-form');
  if (thoughtForm) {
    setupThoughtForm(thoughtForm);
  }
  
  // Configurar eventos para ejercicios de gestión de pensamientos
  setupThoughtExercises();
  
  // Cargar historial de pensamientos si existe el contenedor
  const thoughtHistoryContainer = document.getElementById('thought-history');
  if (thoughtHistoryContainer) {
    loadThoughtHistory(thoughtHistoryContainer);
  }
}

// Configurar formulario de registro de pensamientos
function setupThoughtForm(form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
      // Obtener datos del formulario
      const situation = document.getElementById('situation').value;
      const automaticThoughts = document.getElementById('automatic-thoughts').value;
      const emotions = document.getElementById('emotions').value;
      const alternativeThoughts = document.getElementById('alternative-thoughts').value;
      const balancedResponse = document.getElementById('balanced-response').value;
      
      // Validar datos mínimos
      if (!situation || !automaticThoughts) {
        window.uiHelper.showAlert('Por favor, completa al menos la situación y los pensamientos automáticos', 'warning');
        return;
      }
      
      // Crear objeto de registro
      const thoughtRecord = {
        situation,
        automaticThoughts,
        emotions,
        alternativeThoughts,
        balancedResponse,
        timestamp: new Date().toISOString(),
        userId: window.authHelper && window.authHelper.getCurrentUserId ? 
                window.authHelper.getCurrentUserId() : 'anonymous'
      };
      
      // Guardar registro
      await saveThoughtRecord(thoughtRecord);
      
      // Mostrar mensaje de éxito
      window.uiHelper.showAlert('Registro de pensamiento guardado correctamente', 'success');
      
      // Limpiar formulario
      form.reset();
      
      // Actualizar historial si existe
      const historyContainer = document.getElementById('thought-history');
      if (historyContainer) {
        loadThoughtHistory(historyContainer);
      }
      
    } catch (error) {
      console.error('Error al guardar registro de pensamiento:', error);
      window.uiHelper.showAlert('Error al guardar el registro', 'error');
    }
  });
}

// Configurar ejercicios de gestión de pensamientos
function setupThoughtExercises() {
  // Configurar botones de ejercicios si existen
  const exerciseButtons = document.querySelectorAll('.start-exercise');
  exerciseButtons.forEach(button => {
    button.addEventListener('click', () => {
      const exerciseType = button.dataset.exercise;
      startThoughtExercise(exerciseType);
    });
  });
  
  // Configurar eventos para la metáfora del algodón de azúcar
  setupCottonCandyMetaphor();
}

// Configurar metáfora del algodón de azúcar
function setupCottonCandyMetaphor() {
  const feedButton = document.getElementById('feed-thoughts');
  const ignoreButton = document.getElementById('ignore-thoughts');
  
  if (feedButton && ignoreButton) {
    let candyCount = 0;
    
    feedButton.addEventListener('click', () => {
      createCottonCandy();
      candyCount++;
      window.uiHelper.showAlert('Has alimentado el pensamiento. Ahora vendrán más.', 'warning');
    });
    
    ignoreButton.addEventListener('click', () => {
      removeCottonCandy();
      candyCount = Math.max(0, candyCount - 1);
      window.uiHelper.showAlert('Has ignorado el pensamiento. Con el tiempo, vendrán menos.', 'success');
    });
  }
}

// Crear elemento visual de algodón de azúcar
function createCottonCandy() {
  const container = document.querySelector('.cotton-candy-animation');
  if (!container) return;
  
  const candy = document.createElement('div');
  candy.className = 'cotton-candy';
  candy.style.left = `${20 + Math.random() * 60}%`;
  
  container.appendChild(candy);
  
  // Animación de entrada
  setTimeout(() => {
    candy.classList.add('active');
  }, 10);
}

// Remover algodón de azúcar
function removeCottonCandy() {
  const candies = document.querySelectorAll('.cotton-candy.active');
  if (candies.length === 0) return;
  
  // Remover el último algodón añadido
  const lastCandy = candies[candies.length - 1];
  lastCandy.classList.add('eaten');
  
  // Remover después de la animación
  setTimeout(() => {
    lastCandy.remove();
  }, 500);
}

// Iniciar ejercicio de gestión de pensamientos
function startThoughtExercise(exerciseType) {
  // Buscar técnica por ID
  const technique = THOUGHT_TECHNIQUES.find(t => t.id === exerciseType);
  if (!technique) {
    console.error(`Técnica no encontrada: ${exerciseType}`);
    return;
  }
  
  // Contenido base para todas las técnicas
  let content = `
    <div class="exercise-container">
      <h3>${technique.name}</h3>
      <p>${technique.description}</p>
      <div class="exercise-steps">
        <h4>Instrucciones:</h4>
        <ol>
  `;
  
  // Añadir pasos
  technique.steps.forEach(step => {
    content += `<li>${step}</li>`;
  });
  
  content += `
        </ol>
      </div>
  `;
  
  // Contenido específico según el tipo de ejercicio
  switch (exerciseType) {
    case 'observe':
      content += createObservationExerciseContent();
      break;
    case 'defusion':
      content += createDefusionExerciseContent();
      break;
    case 'challenge':
      content += createChallengeExerciseContent();
      break;
    case 'leaves':
      content += createLeavesExerciseContent();
      break;
  }
  
  // Finalizar contenido
  content += `
      <div class="exercise-reflection">
        <h4>Reflexión:</h4>
        <textarea id="exercise-reflection" placeholder="¿Qué has observado durante este ejercicio? ¿Cómo te has sentido?"></textarea>
        <div class="form-actions">
          <button id="save-reflection" class="btn btn-primary">Guardar reflexión</button>
          <button id="close-exercise" class="btn">Cerrar</button>
        </div>
      </div>
    </div>
  `;
  
  // Mostrar modal con el ejercicio
  const closeModal = window.uiHelper.showModal(
    `Ejercicio: ${technique.name}`, 
    content, 
    { 
      closeOnClickOutside: false,
      onClose: () => {
        // Limpiar cualquier intervalo o temporizador si es necesario
        if (window.exerciseTimer) {
          clearInterval(window.exerciseTimer);
        }
      }
    }
  );
  
  // Configurar eventos después de mostrar el modal
  setTimeout(() => {
    // Botón de guardar reflexión
    const saveButton = document.getElementById('save-reflection');
    if (saveButton) {
      saveButton.addEventListener('click', () => {
        saveExerciseReflection(exerciseType);
      });
    }
    
    // Botón de cerrar
    const closeButton = document.getElementById('close-exercise');
    if (closeButton) {
      closeButton.addEventListener('click', closeModal);
    }
    
    // Configurar temporizador si el ejercicio lo requiere
    if (exerciseType === 'observe') {
      setupObservationTimer();
    }
  }, 100);
}

// Crear contenido para ejercicio de observación
function createObservationExerciseContent() {
  return `
    <div class="timer-container">
      <div class="timer-display">
        <span id="minutes">05</span>:<span id="seconds">00</span>
      </div>
      <div class="timer-controls">
        <button id="start-timer" class="btn btn-primary">Comenzar</button>
        <button id="pause-timer" class="btn" style="display: none;">Pausar</button>
        <button id="reset-timer" class="btn" style="display: none;">Reiniciar</button>
      </div>
    </div>
    <div class="breathing-circle">
      <div class="breathing-text">Respira</div>
    </div>
  `;
}

// Configurar temporizador para ejercicio de observación
function setupObservationTimer() {
  const startButton = document.getElementById('start-timer');
  const pauseButton = document.getElementById('pause-timer');
  const resetButton = document.getElementById('reset-timer');
  const minutesDisplay = document.getElementById('minutes');
  const secondsDisplay = document.getElementById('seconds');
  const breathingCircle = document.querySelector('.breathing-circle');
  
  if (!startButton || !pauseButton || !resetButton || !minutesDisplay || !secondsDisplay) {
    return;
  }
  
  let totalSeconds = 5 * 60; // 5 minutos
  let timerRunning = false;
  
  // Actualizar visualización del temporizador
  function updateTimerDisplay() {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
  }
  
  // Iniciar temporizador
  startButton.addEventListener('click', () => {
    if (timerRunning) return;
    
    timerRunning = true;
    startButton.style.display = 'none';
    pauseButton.style.display = 'inline-block';
    resetButton.style.display = 'inline-block';
    
    if (breathingCircle) {
      breathingCircle.classList.add('active');
    }
    
    window.exerciseTimer = setInterval(() => {
      totalSeconds--;
      
      if (totalSeconds <= 0) {
        clearInterval(window.exerciseTimer);
        timerRunning = false;
        startButton.style.display = 'none';
        pauseButton.style.display = 'none';
        resetButton.style.display = 'inline-block';
        
        if (breathingCircle) {
          breathingCircle.classList.remove('active');
        }
        
        window.uiHelper.showAlert('¡Ejercicio completado!', 'success');
      }
      
      updateTimerDisplay();
    }, 1000);
  });
  
  // Pausar temporizador
  pauseButton.addEventListener('click', () => {
    clearInterval(window.exerciseTimer);
    timerRunning = false;
    startButton.style.display = 'inline-block';
    pauseButton.style.display = 'none';
    
    if (breathingCircle) {
      breathingCircle.classList.remove('active');
    }
  });
  
  // Reiniciar temporizador
  resetButton.addEventListener('click', () => {
    clearInterval(window.exerciseTimer);
    timerRunning = false;
    totalSeconds = 5 * 60;
    updateTimerDisplay();
    
    startButton.style.display = 'inline-block';
    pauseButton.style.display = 'none';
    resetButton.style.display = 'none';
    
    if (breathingCircle) {
      breathingCircle.classList.remove('active');
    }
  });
}

// Crear contenido para ejercicio de defusión
function createDefusionExerciseContent() {
  return `
    <div class="defusion-exercise">
      <div class="input-container">
        <label for="difficult-thought">Escribe un pensamiento difícil que tengas:</label>
        <textarea id="difficult-thought" placeholder="Por ejemplo: 'No puedo con esto', 'Soy un desastre', etc."></textarea>
      </div>
      
      <div class="defusion-techniques">
        <div class="technique-card">
          <h4>Añade un prefijo</h4>
          <p>Añade al inicio: "Estoy teniendo el pensamiento de que..."</p>
          <div class="result-box" id="prefix-result">El resultado aparecerá aquí</div>
          <button class="btn btn-primary apply-technique" data-technique="prefix">Aplicar</button>
        </div>
        
        <div class="technique-card">
          <h4>Voz graciosa</h4>
          <p>Imagina decir el pensamiento con voz de dibujos animados</p>
          <div class="result-box" id="voice-result">El resultado aparecerá aquí</div>
          <button class="btn btn-primary apply-technique" data-technique="voice">Aplicar</button>
        </div>
        
        <div class="technique-card">
          <h4>Agradece a tu mente</h4>
          <p>Responde: "Gracias mente por ese pensamiento tan útil"</p>
          <div class="result-box" id="thanks-result">El resultado aparecerá aquí</div>
          <button class="btn btn-primary apply-technique" data-technique="thanks">Aplicar</button>
        </div>
      </div>
    </div>
  `;
}

// Crear contenido para ejercicio de cuestionamiento
function createChallengeExerciseContent() {
  return `
    <div class="challenge-exercise">
      <div class="challenge-form">
        <div class="form-group">
          <label for="challenge-thought">Pensamiento automático:</label>
          <textarea id="challenge-thought" placeholder="Escribe el pensamiento que quieres cuestionar..."></textarea>
        </div>
        
        <div class="form-group">
          <label for="evidence-for">Evidencia a favor:</label>
          <textarea id="evidence-for" placeholder="¿Qué evidencia tienes de que este pensamiento es cierto?"></textarea>
        </div>
        
        <div class="form-group">
          <label for="evidence-against">Evidencia en contra:</label>
          <textarea id="evidence-against" placeholder="¿Qué evidencia tienes de que este pensamiento no es completamente cierto?"></textarea>
        </div>
        
        <div class="form-group">
          <label for="alternative-perspectives">Perspectivas alternativas:</label>
          <textarea id="alternative-perspectives" placeholder="¿Qué otras formas hay de ver esta situación?"></textarea>
        </div>
        
        <div class="form-group">
          <label for="friend-advice">Consejo a un amigo:</label>
          <textarea id="friend-advice" placeholder="¿Qué le dirías a un amigo que tuviera este pensamiento?"></textarea>
        </div>
        
        <div class="form-group">
          <label for="balanced-thought">Pensamiento equilibrado:</label>
          <textarea id="balanced-thought" placeholder="¿Cuál sería una forma más equilibrada y realista de ver esta situación?"></textarea>
        </div>
      </div>
    </div>
  `;
}

// Crear contenido para ejercicio de hojas en el río
function createLeavesExerciseContent() {
  return `
    <div class="leaves-exercise">
      <div class="river-container">
        <div class="river">
          <div class="water"></div>
          <div class="leaves-container" id="leaves-container"></div>
        </div>
      </div>
      
      <div class="thought-input">
        <textarea id="leaf-thought" placeholder="Escribe un pensamiento que quieras dejar ir..."></textarea>
        <button id="add-leaf" class="btn btn-primary">Colocar en una hoja</button>
      </div>
    </div>
  `;
}

// Guardar reflexión de ejercicio
async function saveExerciseReflection(exerciseType) {
  const reflectionText = document.getElementById('exercise-reflection').value;
  
  if (!reflectionText) {
    window.uiHelper.showAlert('Por favor, escribe una reflexión antes de guardar', 'warning');
    return;
  }
  
  try {
    // Obtener detalles del ejercicio
    const technique = THOUGHT_TECHNIQUES.find(t => t.id === exerciseType);
    
    // Crear objeto de reflexión
    const reflection = {
      exerciseType,
      exerciseName: technique ? technique.name : exerciseType,
      reflection: reflectionText,
      timestamp: new Date().toISOString(),
      userId: window.authHelper && window.authHelper.getCurrentUserId ? 
              window.authHelper.getCurrentUserId() : 'anonymous'
    };
    
    // Si es un ejercicio de cuestionamiento, guardar también los detalles
    if (exerciseType === 'challenge') {
      reflection.thought = document.getElementById('challenge-thought').value;
      reflection.evidenceFor = document.getElementById('evidence-for').value;
      reflection.evidenceAgainst = document.getElementById('evidence-against').value;
      reflection.alternativePerspectives = document.getElementById('alternative-perspectives').value;
      reflection.friendAdvice = document.getElementById('friend-advice').value;
      reflection.balancedThought = document.getElementById('balanced-thought').value;
    }
    
    // Guardar reflexión
    await saveThoughtReflection(reflection);
    
    // Mostrar mensaje de éxito
    window.uiHelper.showAlert('Reflexión guardada correctamente', 'success');
    
    // Cerrar modal
    const closeButton = document.getElementById('close-exercise');
    if (closeButton) {
      closeButton.click();
    }
  } catch (error) {
    console.error('Error al guardar reflexión:', error);
    window.uiHelper.showAlert('Error al guardar la reflexión', 'error');
  }
}

// Guardar registro de pensamiento
async function saveThoughtRecord(record) {
  return await thoughtsStorage.save(record);
}

// Guardar reflexión de ejercicio
async function saveThoughtReflection(reflection) {
  // Crear gestor de almacenamiento para reflexiones
  const reflectionsStorage = window.storageHelper.createStorageManager('thoughtReflections', 'curirana_thought_reflections');
  return await reflectionsStorage.save(reflection);
}

// Cargar historial de pensamientos
async function loadThoughtHistory(container) {
  try {
    // Mostrar indicador de carga
    container.innerHTML = '<div class="loading">Cargando registros...</div>';
    
    // Obtener registros
    const records = await getThoughtRecords();
    
    // Si no hay registros
    if (!records || records.length === 0) {
      container.innerHTML = '<div class="no-records">No hay registros de pensamientos. ¡Empieza registrando tus pensamientos hoy!</div>';
      return;
    }
    
    // Ordenar por fecha (más reciente primero)
    records.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Crear tabla de registros
    let html = `
      <div class="thought-records">
        <table class="thought-record-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Situación</th>
              <th>Pensamientos automáticos</th>
              <th>Pensamientos alternativos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
    `;
    
    // Generar filas para cada registro
    records.forEach(record => {
      const date = new Date(record.timestamp);
      const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
      
      html += `
        <tr data-record-id="${record.id}">
          <td>${formattedDate}</td>
          <td>${record.situation}</td>
          <td>${record.automaticThoughts}</td>
          <td>${record.alternativeThoughts || 'No registrado'}</td>
          <td>
            <div class="thought-record-actions">
              <button class="btn-icon view-record" title="Ver detalles">
                <i data-feather="eye"></i>
              </button>
              <button class="btn-icon delete-record" title="Eliminar registro">
                <i data-feather="trash-2"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    });
    
    html += `
          </tbody>
        </table>
      </div>
    `;
    
    // Actualizar contenedor
    container.innerHTML = html;
    
    // Inicializar iconos
    if (typeof feather !== 'undefined') {
      feather.replace();
    }
    
    // Configurar eventos para botones de acción
    const viewButtons = container.querySelectorAll('.view-record');
    const deleteButtons = container.querySelectorAll('.delete-record');
    
    viewButtons.forEach(button => {
      button.addEventListener('click', () => {
        const recordId = button.closest('tr').dataset.recordId;
        viewThoughtRecord(recordId);
      });
    });
    
    deleteButtons.forEach(button => {
      button.addEventListener('click', () => {
        const recordId = button.closest('tr').dataset.recordId;
        confirmDeleteThoughtRecord(recordId);
      });
    });
    
  } catch (error) {
    console.error('Error al cargar historial de pensamientos:', error);
    container.innerHTML = '<div class="error">Error al cargar los registros de pensamientos</div>';
  }
}

// Ver detalles de un registro de pensamiento
async function viewThoughtRecord(recordId) {
  try {
    // Obtener registro
    const record = await getThoughtRecord(recordId);
    
    if (!record) {
      window.uiHelper.showAlert('Registro no encontrado', 'error');
      return;
    }
    
    // Formatear fecha
    const date = new Date(record.timestamp);
    const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
    
    // Crear contenido del modal
    const content = `
      <div class="thought-record-details">
        <div class="detail-group">
          <div class="detail-label">Fecha:</div>
          <div class="detail-value">${formattedDate}</div>
        </div>
        
        <div class="detail-group">
          <div class="detail-label">Situación:</div>
          <div class="detail-value">${record.situation}</div>
        </div>
        
        <div class="detail-group">
          <div class="detail-label">Pensamientos automáticos:</div>
          <div class="detail-value">${record.automaticThoughts}</div>
        </div>
        
        <div class="detail-group">
          <div class="detail-label">Emociones:</div>
          <div class="detail-value">${record.emotions || 'No registradas'}</div>
        </div>
        
        <div class="detail-group">
          <div class="detail-label">Pensamientos alternativos:</div>
          <div class="detail-value">${record.alternativeThoughts || 'No registrados'}</div>
        </div>
        
        <div class="detail-group">
          <div class="detail-label">Respuesta equilibrada:</div>
          <div class="detail-value">${record.balancedResponse || 'No registrada'}</div>
        </div>
      </div>
    `;
    
    // Mostrar modal
    window.uiHelper.showModal('Detalles del registro', content, { closeOnClickOutside: true });
    
  } catch (error) {
    console.error('Error al ver detalles del registro:', error);
    window.uiHelper.showAlert('Error al cargar los detalles del registro', 'error');
  }
}

// Confirmar eliminación de registro
function confirmDeleteThoughtRecord(recordId) {
  window.uiHelper.showConfirm(
    '¿Estás seguro de que deseas eliminar este registro? Esta acción no se puede deshacer.',
    async () => {
      try {
        // Eliminar registro
        await deleteThoughtRecord(recordId);
        
        // Mostrar mensaje de éxito
        window.uiHelper.showAlert('Registro eliminado correctamente', 'success');
        
        // Actualizar historial
        const historyContainer = document.getElementById('thought-history');
        if (historyContainer) {
          loadThoughtHistory(historyContainer);
        }
      } catch (error) {
        console.error('Error al eliminar registro:', error);
        window.uiHelper.showAlert('Error al eliminar el registro', 'error');
      }
    }
  );
}

// Obtener todos los registros de pensamientos
async function getThoughtRecords() {
  try {
    const records = await thoughtsStorage.getAll();
    return records;
  } catch (error) {
    console.error('Error al obtener registros de pensamientos:', error);
    return [];
  }
}

// Obtener un registro de pensamiento específico
async function getThoughtRecord(id) {
  try {
    const record = await thoughtsStorage.get(id);
    return record;
  } catch (error) {
    console.error('Error al obtener registro de pensamiento:', error);
    return null;
  }
}

// Eliminar un registro de pensamiento
async function deleteThoughtRecord(id) {
  try {
    await thoughtsStorage.delete(id);
    return true;
  } catch (error) {
    console.error('Error al eliminar registro de pensamiento:', error);
    throw error;
  }
}

// Obtener los datos de un ejercicio específico
function getThoughtTechnique(techniqueId) {
  return THOUGHT_TECHNIQUES.find(technique => technique.id === techniqueId);
}

// Obtener las categorías de pensamientos automáticos
function getThoughtCategories() {
  return THOUGHT_CATEGORIES;
}

// Obtener las metáforas para la gestión de pensamientos
function getThoughtMetaphors() {
  return THOUGHT_METAPHORS;
}

// Generar sugerencias personalizadas basadas en los registros del usuario
async function getPersonalizedSuggestions() {
  try {
    const records = await getThoughtRecords();
    
    if (!records || records.length < 3) {
      return {
        hasEnoughData: false,
        message: "Registra más pensamientos para recibir sugerencias personalizadas.",
        suggestedTechnique: "observe" // Técnica básica por defecto
      };
    }
    
    // Analizar patrones
    const recentRecords = records
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 10); // Últimos 10 registros
    
    // Contar cuántos tienen pensamientos alternativos
    const withAlternativeThoughts = recentRecords.filter(r => 
      r.alternativeThoughts && r.alternativeThoughts.trim().length > 0
    ).length;
    
    const withBalancedResponse = recentRecords.filter(r => 
      r.balancedResponse && r.balancedResponse.trim().length > 0
    ).length;
    
    // Buscar palabras clave en los pensamientos automáticos
    let hasWorryThoughts = 0;
    let hasSelfCriticalThoughts = 0;
    let hasCatastrophizingThoughts = 0;
    
    const worryKeywords = ['preocup', 'podría', 'y si', 'quizás', 'tal vez'];
    const selfCriticalKeywords = ['soy un', 'no valg', 'no sirv', 'no pued', 'incapaz'];
    const catastrophizingKeywords = ['terrible', 'horrible', 'nunca', 'siempre', 'desastre', 'caos'];
    
    recentRecords.forEach(record => {
      const thoughts = record.automaticThoughts.toLowerCase();
      
      if (worryKeywords.some(kw => thoughts.includes(kw))) {
        hasWorryThoughts++;
      }
      
      if (selfCriticalKeywords.some(kw => thoughts.includes(kw))) {
        hasSelfCriticalThoughts++;
      }
      
      if (catastrophizingKeywords.some(kw => thoughts.includes(kw))) {
        hasCatastrophizingThoughts++;
      }
    });
    
    // Determinar técnica recomendada
    let suggestedTechnique;
    let rationale;
    
    if (withAlternativeThoughts / recentRecords.length < 0.3) {
      // Si menos del 30% tiene pensamientos alternativos
      suggestedTechnique = 'challenge';
      rationale = 'Te recomendamos practicar el cuestionamiento de pensamientos para desarrollar perspectivas alternativas.';
    } else if (hasCatastrophizingThoughts > hasWorryThoughts && hasCatastrophizingThoughts > hasSelfCriticalThoughts) {
      suggestedTechnique = 'defusion';
      rationale = 'Parece que tienes tendencia a la catastrofización. La defusión cognitiva puede ayudarte a tomar distancia de estos pensamientos.';
    } else if (hasWorryThoughts > hasSelfCriticalThoughts) {
      suggestedTechnique = 'leaves';
      rationale = 'Notamos pensamientos de preocupación. La técnica de las hojas en el río puede ayudarte a dejarlos pasar.';
    } else {
      suggestedTechnique = 'observe';
      rationale = 'La observación sin juzgar puede ayudarte a aumentar tu conciencia sobre tus patrones de pensamiento.';
    }
    
    // Construir mensaje personalizado
    let message = `Basado en tus ${recentRecords.length} registros más recientes, `;
    
    if (hasWorryThoughts > hasSelfCriticalThoughts && hasWorryThoughts > hasCatastrophizingThoughts) {
      message += 'notamos que tiendes a tener pensamientos de preocupación. ';
    } else if (hasSelfCriticalThoughts > hasWorryThoughts && hasSelfCriticalThoughts > hasCatastrophizingThoughts) {
      message += 'observamos un patrón de autocrítica en tus pensamientos. ';
    } else if (hasCatastrophizingThoughts > hasWorryThoughts && hasCatastrophizingThoughts > hasSelfCriticalThoughts) {
      message += 'identificamos una tendencia a la catastrofización en tus pensamientos. ';
    }
    
    message += rationale;
    
    return {
      hasEnoughData: true,
      message,
      suggestedTechnique,
      worryThoughts: hasWorryThoughts,
      selfCriticalThoughts: hasSelfCriticalThoughts,
      catastrophizingThoughts: hasCatastrophizingThoughts,
      withAlternativeThoughts,
      withBalancedResponse
    };
  } catch (error) {
    console.error('Error al generar sugerencias personalizadas:', error);
    return {
      hasEnoughData: false,
      message: "Hubo un error al analizar tus registros. Intenta de nuevo más tarde.",
      suggestedTechnique: "observe"
    };
  }
}

// Exportar funciones del módulo de pensamientos
window.thoughtsHelper = {
  // Funciones de registro de pensamientos
  saveThoughtRecord,
  getThoughtRecords,
  getThoughtRecord,
  deleteThoughtRecord,
  
  // Funciones de técnicas y metáforas
  getThoughtTechnique,
  getThoughtCategories,
  getThoughtMetaphors,
  
  // Funciones de ejercicios
  startThoughtExercise,
  saveThoughtReflection,
  
  // Funciones de sugerencias personalizadas
  getPersonalizedSuggestions,
  
  // Inicialización
  initThoughtsModule
};

// Inicializar módulo cuando se carga la página
document.addEventListener('DOMContentLoaded', initThoughtsModule);