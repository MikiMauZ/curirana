// Módulo de emociones para Curirana

// Inicializar almacenamiento
const emotionsStorage = window.storageHelper.createStorageManager('emotions', 'curirana_emotions');

// Lista de emociones disponibles
const EMOTIONS_LIST = [
  { id: 'happy', name: 'Feliz', emoji: '😊', description: 'Sensación de bienestar y alegría', category: 'positive' },
  { id: 'sad', name: 'Triste', emoji: '😢', description: 'Sensación de pena o melancolía', category: 'difficult' },
  { id: 'angry', name: 'Enfadado', emoji: '😠', description: 'Sensación de irritación o indignación', category: 'difficult' },
  { id: 'fearful', name: 'Temeroso', emoji: '😨', description: 'Sensación de miedo o preocupación', category: 'difficult' },
  { id: 'disgusted', name: 'Disgustado', emoji: '🤢', description: 'Sensación de rechazo o repulsión', category: 'difficult' },
  { id: 'surprised', name: 'Sorprendido', emoji: '😲', description: 'Sensación de asombro o impresión', category: 'neutral' },
  { id: 'neutral', name: 'Neutral', emoji: '😐', description: 'Sin una emoción predominante', category: 'neutral' },
  { id: 'calm', name: 'Tranquilo', emoji: '😌', description: 'Sensación de paz y serenidad', category: 'positive' },
  { id: 'anxious', name: 'Ansioso', emoji: '😰', description: 'Sensación de inquietud o nerviosismo', category: 'difficult' },
  { id: 'excited', name: 'Emocionado', emoji: '🤩', description: 'Sensación de entusiasmo o exaltación', category: 'positive' },
  { id: 'tired', name: 'Cansado', emoji: '😴', description: 'Sensación de agotamiento o fatiga', category: 'neutral' },
  { id: 'grateful', name: 'Agradecido', emoji: '🙏', description: 'Sensación de gratitud o reconocimiento', category: 'positive' },
  { id: 'frustrated', name: 'Frustrado', emoji: '😤', description: 'Sensación de decepción o impotencia', category: 'difficult' },
  { id: 'lonely', name: 'Solo', emoji: '🥺', description: 'Sensación de aislamiento o soledad', category: 'difficult' },
  { id: 'overwhelmed', name: 'Abrumado', emoji: '😩', description: 'Sensación de sobrecarga o exceso', category: 'difficult' },
  { id: 'proud', name: 'Orgulloso', emoji: '😊', description: 'Sensación de satisfacción personal', category: 'positive' }
];

// Sensaciones físicas asociadas con ansiedad
const PHYSICAL_SENSATIONS = [
  { id: 'heartbeat', name: 'Latidos rápidos', icon: 'heart', description: 'Sensación de que el corazón late más rápido o fuerte' },
  { id: 'breathing', name: 'Respiración agitada', icon: 'wind', description: 'Dificultad para respirar o respiración más rápida' },
  { id: 'dizziness', name: 'Mareo', icon: 'loader', description: 'Sensación de inestabilidad o desequilibrio' },
  { id: 'sweating', name: 'Sudoración', icon: 'droplet', description: 'Sudoración excesiva sin esfuerzo físico' },
  { id: 'trembling', name: 'Temblor', icon: 'activity', description: 'Temblor en manos, piernas u otras partes del cuerpo' },
  { id: 'stomach', name: 'Malestar estomacal', icon: 'target', description: 'Molestias, tensión o "mariposas" en el estómago' },
  { id: 'chest', name: 'Presión en el pecho', icon: 'square', description: 'Sensación de opresión o dolor en el pecho' },
  { id: 'tense', name: 'Tensión muscular', icon: 'box', description: 'Músculos tensos, especialmente en cuello, hombros o espalda' },
  { id: 'tingling', name: 'Hormigueo', icon: 'zap', description: 'Sensación de hormigueo en manos, pies u otras partes' },
  { id: 'hot', name: 'Calor', icon: 'thermometer', description: 'Sensación repentina de calor en el cuerpo' },
  { id: 'cold', name: 'Frío', icon: 'cloud-snow', description: 'Sensación repentina de frío o escalofríos' },
  { id: 'numb', name: 'Adormecimiento', icon: 'moon', description: 'Sensación de entumecimiento en alguna parte del cuerpo' }
];

// Inicializar módulo de emociones
function initEmotionsModule() {
  console.log('Módulo de emociones inicializado');
  
  // Configurar eventos para selector de emociones si existe en la página
  const emotionPicker = document.querySelector('.emotion-picker');
  if (emotionPicker) {
    setupEmotionPicker(emotionPicker);
  }
  
  // Configurar eventos para formulario de registro de emoción
  const emotionForm = document.getElementById('emotion-form');
  if (emotionForm) {
    setupEmotionForm(emotionForm);
  }
  
  // Configurar eventos para historial de emociones
  const emotionHistory = document.getElementById('emotion-history');
  if (emotionHistory) {
    loadEmotionHistory(emotionHistory);
  }
  
  // Configurar eventos para selector de sensaciones físicas
  const sensationPicker = document.querySelector('.sensation-picker');
  if (sensationPicker) {
    setupSensationPicker(sensationPicker);
  }
}

// Configurar selector de emociones
function setupEmotionPicker(container) {
  // Crear contenedor de emociones
  const emotionsGrid = document.createElement('div');
  emotionsGrid.className = 'emotions-grid';
  
  // Generar botones para cada emoción
  EMOTIONS_LIST.forEach(emotion => {
    const button = document.createElement('button');
    button.className = 'emotion-button';
    button.dataset.emotionId = emotion.id;
    button.dataset.emotionCategory = emotion.category;
    button.innerHTML = `
      <div class="emotion-emoji">${emotion.emoji}</div>
      <div class="emotion-name">${emotion.name}</div>
    `;
    
    // Evento al hacer clic en una emoción
    button.addEventListener('click', () => {
      // Quitar selección previa
      document.querySelectorAll('.emotion-button.selected').forEach(el => {
        el.classList.remove('selected');
      });
      
      // Marcar como seleccionada
      button.classList.add('selected');
      
      // Actualizar campo oculto si existe
      const emotionInput = document.getElementById('selected-emotion');
      if (emotionInput) {
        emotionInput.value = emotion.id;
      }
      
      // Disparar evento personalizado
      const event = new CustomEvent('emotion-selected', {
        detail: { emotion }
      });
      container.dispatchEvent(event);
      
      // Mostrar descripción de la emoción si existe contenedor
      const descriptionEl = document.querySelector('.emotion-description');
      if (descriptionEl) {
        descriptionEl.textContent = emotion.description;
        descriptionEl.classList.add('visible');
      }
    });
    
    emotionsGrid.appendChild(button);
  });
  
  // Agregar contenedor al DOM
  container.appendChild(emotionsGrid);
  
  // Añadir contenedor para descripción
  const descriptionContainer = document.createElement('div');
  descriptionContainer.className = 'emotion-description';
  descriptionContainer.textContent = 'Selecciona una emoción';
  container.appendChild(descriptionContainer);
}

// Configurar selector de sensaciones físicas
function setupSensationPicker(container) {
  // Crear contenedor de sensaciones
  const sensationsGrid = document.createElement('div');
  sensationsGrid.className = 'sensations-grid';
  
  // Generar botones para cada sensación
  PHYSICAL_SENSATIONS.forEach(sensation => {
    const button = document.createElement('button');
    button.className = 'sensation-button';
    button.dataset.sensationId = sensation.id;
    button.innerHTML = `
      <div class="sensation-icon">
        <i data-feather="${sensation.icon}"></i>
      </div>
      <div class="sensation-name">${sensation.name}</div>
    `;
    
    // Evento al hacer clic en una sensación
    button.addEventListener('click', () => {
      // Alternar selección
      button.classList.toggle('selected');
      
      // Actualizar lista de sensaciones seleccionadas
      updateSelectedSensations();
      
      // Mostrar descripción de la sensación
      const descriptionEl = document.querySelector('.sensation-description');
      if (descriptionEl) {
        descriptionEl.textContent = sensation.description;
        descriptionEl.classList.add('visible');
      }
    });
    
    sensationsGrid.appendChild(button);
  });
  
  // Agregar contenedor al DOM
  container.appendChild(sensationsGrid);
  
  // Añadir contenedor para descripción
  const descriptionContainer = document.createElement('div');
  descriptionContainer.className = 'sensation-description';
  descriptionContainer.textContent = 'Selecciona las sensaciones físicas que experimentas';
  container.appendChild(descriptionContainer);
  
  // Inicializar iconos Feather
  if (typeof feather !== 'undefined') {
    feather.replace();
  }
}

// Actualizar lista de sensaciones seleccionadas
function updateSelectedSensations() {
  const selectedButtons = document.querySelectorAll('.sensation-button.selected');
  const sensationsInput = document.getElementById('selected-sensations');
  
  if (sensationsInput) {
    const selectedIds = Array.from(selectedButtons).map(button => button.dataset.sensationId);
    sensationsInput.value = JSON.stringify(selectedIds);
  }
}

// Configurar formulario de registro de emociones
function setupEmotionForm(form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Obtener datos del formulario
    const emotionId = document.getElementById('selected-emotion').value;
    const intensity = document.getElementById('emotion-intensity').value;
    const description = document.getElementById('emotion-description').value;
    const sensationsInput = document.getElementById('selected-sensations');
    
    // Validar datos
    if (!emotionId) {
      window.uiHelper.showAlert('Por favor, selecciona una emoción', 'warning');
      return;
    }
    
    // Obtener detalles de la emoción
    const emotion = EMOTIONS_LIST.find(e => e.id === emotionId);
    
    // Crear objeto de registro
    const emotionRecord = {
      emotionId,
      emotionName: emotion.name,
      emotionEmoji: emotion.emoji,
      emotionCategory: emotion.category,
      intensity: parseInt(intensity, 10),
      description,
      sensations: sensationsInput ? JSON.parse(sensationsInput.value || '[]') : [],
      timestamp: new Date().toISOString(),
      userId: window.authHelper && window.authHelper.getCurrentUserId ? window.authHelper.getCurrentUserId() : 'anonymous'
    };
    
    try {
      // Guardar registro
      await saveEmotionRecord(emotionRecord);
      
      // Mostrar mensaje
      window.uiHelper.showAlert('Emoción registrada correctamente', 'success');
      
      // Resetear formulario
      form.reset();
      
      // Desmarcar emociones seleccionadas
      document.querySelectorAll('.emotion-button.selected').forEach(el => {
        el.classList.remove('selected');
      });
      
      // Desmarcar sensaciones seleccionadas
      document.querySelectorAll('.sensation-button.selected').forEach(el => {
        el.classList.remove('selected');
      });
      
      // Actualizar historial si existe
      const historyContainer = document.getElementById('emotion-history');
      if (historyContainer) {
        loadEmotionHistory(historyContainer);
      }
    } catch (error) {
      console.error('Error al guardar emoción:', error);
      window.uiHelper.showAlert('Error al guardar la emoción', 'error');
    }
  });
}

// Guardar registro de emoción
async function saveEmotionRecord(record) {
  return await emotionsStorage.save(record);
}

// Cargar historial de emociones
async function loadEmotionHistory(container) {
  try {
    // Mostrar indicador de carga
    container.innerHTML = '<div class="loading">Cargando historial...</div>';
    
    // Obtener registros
    const records = await getEmotionRecords();
    
    // Si no hay registros
    if (!records || records.length === 0) {
      container.innerHTML = '<div class="no-records">No hay registros de emociones. ¡Empieza registrando cómo te sientes hoy!</div>';
      return;
    }
    
    // Ordenar por fecha (más reciente primero)
    records.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Crear contenedor
    const historyList = document.createElement('div');
    historyList.className = 'emotion-history-list';
    
    // Agrupar por día
    const groupedByDay = {};
    records.forEach(record => {
      const date = new Date(record.timestamp).toLocaleDateString();
      if (!groupedByDay[date]) {
        groupedByDay[date] = [];
      }
      groupedByDay[date].push(record);
    });
    
    // Generar elementos para cada día
    Object.entries(groupedByDay).forEach(([date, dayRecords]) => {
      // Crear grupo de día
      const dayGroup = document.createElement('div');
      dayGroup.className = 'emotion-day-group';
      
      // Cabecera del día
      const dayHeader = document.createElement('div');
      dayHeader.className = 'emotion-day-header';
      dayHeader.innerHTML = `
        <h3>${formatRelativeDate(date)}</h3>
        <span class="record-count">${dayRecords.length} ${dayRecords.length === 1 ? 'registro' : 'registros'}</span>
      `;
      dayGroup.appendChild(dayHeader);
      
      // Contenedor de registros del día
      const dayRecordsContainer = document.createElement('div');
      dayRecordsContainer.className = 'emotion-day-records';
      
      // Generar elementos para cada registro
      dayRecords.forEach(record => {
        const recordElement = createEmotionRecordElement(record);
        dayRecordsContainer.appendChild(recordElement);
      });
      
      dayGroup.appendChild(dayRecordsContainer);
      historyList.appendChild(dayGroup);
    });
    
    // Limpiar y agregar al DOM
    container.innerHTML = '';
    container.appendChild(historyList);
    
    // Inicializar iconos si es necesario
    if (typeof feather !== 'undefined') {
      feather.replace();
    }
  } catch (error) {
    console.error('Error al cargar historial de emociones:', error);
    container.innerHTML = '<div class="error">Error al cargar el historial de emociones</div>';
  }
}

// Crear elemento para un registro de emoción
function createEmotionRecordElement(record) {
  // Determinar clase según categoría
  let categoryClass = '';
  switch (record.emotionCategory) {
    case 'positive':
      categoryClass = 'emotion-positive';
      break;
    case 'difficult':
      categoryClass = 'emotion-difficult';
      break;
    default:
      categoryClass = 'emotion-neutral';
  }
  
  // Crear elemento
  const recordElement = document.createElement('div');
  recordElement.className = `emotion-record ${categoryClass}`;
  recordElement.dataset.recordId = record.id;
  
  // Formatear hora
  const time = new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  // Formatear intensidad
  const intensityStars = '★'.repeat(record.intensity) + '☆'.repeat(5 - record.intensity);
  
  // Contenido HTML
  recordElement.innerHTML = `
    <div class="emotion-record-header">
      <div class="emotion-emoji-container">
        <span class="emotion-emoji">${record.emotionEmoji}</span>
      </div>
      <div class="emotion-details">
        <div class="emotion-name-time">
          <span class="emotion-name">${record.emotionName}</span>
          <span class="emotion-time">${time}</span>
        </div>
        <div class="emotion-intensity" title="Intensidad: ${record.intensity}/5">
          ${intensityStars}
        </div>
      </div>
      <div class="emotion-actions">
        <button class="btn-icon btn-expand" title="Ver detalles">
          <i data-feather="chevron-down"></i>
        </button>
        <button class="btn-icon btn-delete" title="Eliminar registro">
          <i data-feather="trash-2"></i>
        </button>
      </div>
    </div>
    <div class="emotion-record-content" style="display: none;">
      ${record.description ? `<div class="emotion-description">${record.description}</div>` : ''}
      ${createSensationsElement(record.sensations)}
    </div>
  `;
  
  // Configurar eventos
  setTimeout(() => {
    const expandBtn = recordElement.querySelector('.btn-expand');
    const deleteBtn = recordElement.querySelector('.btn-delete');
    const content = recordElement.querySelector('.emotion-record-content');
    
    expandBtn.addEventListener('click', () => {
      const isExpanded = content.style.display !== 'none';
      content.style.display = isExpanded ? 'none' : 'block';
      expandBtn.innerHTML = isExpanded ? 
        '<i data-feather="chevron-down"></i>' : 
        '<i data-feather="chevron-up"></i>';
      feather.replace();
    });
    
    deleteBtn.addEventListener('click', () => {
      window.uiHelper.showConfirm(
        '¿Estás seguro de que quieres eliminar este registro?',
        async () => {
          try {
            await deleteEmotionRecord(record.id);
            recordElement.remove();
            window.uiHelper.showAlert('Registro eliminado correctamente', 'success');
          } catch (error) {
            console.error('Error al eliminar registro:', error);
            window.uiHelper.showAlert('Error al eliminar el registro', 'error');
          }
        }
      );
    });
  }, 0);
  
  return recordElement;
}

// Crear elemento HTML para sensaciones físicas
function createSensationsElement(sensationIds) {
  if (!sensationIds || sensationIds.length === 0) {
    return '';
  }
  
  // Filtrar sensaciones válidas
  const validSensations = sensationIds
    .map(id => PHYSICAL_SENSATIONS.find(s => s.id === id))
    .filter(Boolean);
  
  if (validSensations.length === 0) {
    return '';
  }
  
  // Crear HTML
  let html = '<div class="physical-sensations">';
  html += '<h4>Sensaciones físicas:</h4>';
  html += '<div class="sensations-list">';
  
  validSensations.forEach(sensation => {
    html += `
      <div class="sensation-item">
        <div class="sensation-icon">
          <i data-feather="${sensation.icon}"></i>
        </div>
        <div class="sensation-name">${sensation.name}</div>
      </div>
    `;
  });
  
  html += '</div></div>';
  return html;
}

// Formatear fecha relativa
function formatRelativeDate(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === today.toDateString()) {
    return 'Hoy';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Ayer';
  } else {
    return date.toLocaleDateString();
  }
}

// Obtener registros de emociones
async function getEmotionRecords() {
  try {
    const records = await emotionsStorage.getAll();
    return records;
  } catch (error) {
    console.error('Error al obtener registros de emociones:', error);
    return [];
  }
}

// Eliminar registro de emoción
async function deleteEmotionRecord(id) {
  return await emotionsStorage.delete(id);
}

// Obtener emociones registradas en un período
async function getEmotionsInPeriod(startDate, endDate) {
  try {
    const allRecords = await getEmotionRecords();
    
    return allRecords.filter(record => {
      const recordDate = new Date(record.timestamp);
      return recordDate >= startDate && recordDate <= endDate;
    });
  } catch (error) {
    console.error('Error al obtener emociones del período:', error);
    return [];
  }
}

// Analizar patrones de emociones
function analyzeEmotionPatterns(records) {
  if (!records || records.length < 3) {
    return {
      hasEnoughData: false,
      message: 'Se necesitan al menos 3 registros para analizar patrones.'
    };
  }
  
  // Contar frecuencia de emociones
  const emotionCounts = {};
  records.forEach(record => {
    if (!emotionCounts[record.emotionId]) {
      emotionCounts[record.emotionId] = 0;
    }
    emotionCounts[record.emotionId]++;
  });
  
  // Encontrar emociones más frecuentes
  const sortedEmotions = Object.entries(emotionCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([id, count]) => {
      const emotion = EMOTIONS_LIST.find(e => e.id === id);
      return {
        id,
        name: emotion ? emotion.name : id,
        emoji: emotion ? emotion.emoji : '',
        count,
        percentage: Math.round((count / records.length) * 100)
      };
    });
  
  // Evaluar categorías predominantes
  const categoryCount = {
    positive: 0,
    neutral: 0,
    difficult: 0
  };
  
  records.forEach(record => {
    if (record.emotionCategory && categoryCount[record.emotionCategory] !== undefined) {
      categoryCount[record.emotionCategory]++;
    }
  });
  
  // Calcular promedios de intensidad
  const avgIntensity = records.reduce((sum, record) => sum + record.intensity, 0) / records.length;
  
  // Analizar patrones de sensaciones físicas
  const sensationCounts = {};
  let totalSensations = 0;
  
  records.forEach(record => {
    if (record.sensations && Array.isArray(record.sensations)) {
      record.sensations.forEach(sensationId => {
        if (!sensationCounts[sensationId]) {
          sensationCounts[sensationId] = 0;
        }
        sensationCounts[sensationId]++;
        totalSensations++;
      });
    }
  });
  
  const topSensations = Object.entries(sensationCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([id, count]) => {
      const sensation = PHYSICAL_SENSATIONS.find(s => s.id === id);
      return {
        id,
        name: sensation ? sensation.name : id,
        count,
        percentage: totalSensations ? Math.round((count / totalSensations) * 100) : 0
      };
    });
  
  // Generar resumen y recomendaciones
  let summary = '';
  let recommendations = [];
  
  // Evaluar estado emocional general
  const predominantCategory = Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])[0][0];
  
  switch (predominantCategory) {
    case 'positive':
      summary = 'Parece que has experimentado principalmente emociones positivas en este período.';
      recommendations.push('Continúa haciendo las actividades que te hacen sentir bien');
      recommendations.push('Reflexiona sobre qué factores contribuyen a tu bienestar emocional');
      break;
    case 'difficult':
      summary = 'Has experimentado varias emociones difíciles en este período.';
      recommendations.push('Considera dedicar más tiempo a actividades que te relajen');
      recommendations.push('Practicar respiración consciente puede ayudarte a manejar mejor estas emociones');
      if (topSensations.length > 0) {
        recommendations.push(`Presta atención a sensaciones como "${topSensations[0].name}" que acompañan tus emociones difíciles`);
      }
      break;
    case 'neutral':
      summary = 'Tu estado emocional ha sido principalmente neutral durante este período.';
      recommendations.push('Podrías probar nuevas actividades que estimulen emociones positivas');
      recommendations.push('La rutina diaria puede a veces llevarnos a un estado neutral prolongado');
      break;
  }
  
  return {
    hasEnoughData: true,
    summary,
    recommendations,
    emotionFrequency: sortedEmotions,
    categories: categoryCount,
    avgIntensity: avgIntensity.toFixed(1),
    topSensations
  };
}

// Exportar funciones del módulo de emociones
window.emotionsHelper = {
  getEmotionsList: () => EMOTIONS_LIST,
  getPhysicalSensations: () => PHYSICAL_SENSATIONS,
  saveEmotionRecord,
  getEmotionRecords,
  deleteEmotionRecord,
  getEmotionsInPeriod,
  analyzeEmotionPatterns,
  initEmotionsModule
};

// Inicializar módulo cuando se carga la página
document.addEventListener('DOMContentLoaded', initEmotionsModule);