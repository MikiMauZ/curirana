// app.js - Inicialización y funcionalidades principales de Curirana

// Configuración global
const CURIRANA = {
  version: '1.0.0',
  currentTheme: 'light',
  localStorageKey: 'curirana_settings',
  emotionsKey: 'curirana_emotions',
  reminderKey: 'curirana_reminders',
  factsData: [
    "La ansiedad es una reacción normal y sana. Todo el mundo la experimenta en circunstancias de peligro, en situaciones delicadas, o en momentos de preocupación.",
    "Las sensaciones físicas de la ansiedad no son peligrosas, aunque puedan sentirse intensas o incómodas.",
    "Tus pensamientos son solo información que crea tu mente, no son hechos ni la realidad.",
    "Tu cuerpo cuenta con mecanismos naturales para recuperar el equilibrio, solo necesita que le prestes atención.",
    "A veces las sensaciones físicas aparecen porque tu cuerpo necesita liberar tensión acumulada.",
    "Cuando intentas evitar o suprimir tus emociones, suelen volver con más fuerza.",
    "Respirar profundamente activa tu sistema nervioso parasimpático, ayudándote a calmarte naturalmente.",
    "El autocuidado no es egoísmo, es una forma responsable de mantener tu bienestar y poder cuidar a los demás.",
    "Los pensamientos son como los pájaros: si les das de comer, vienen más.",
    "Cuando aceptas tus emociones difíciles en lugar de luchar contra ellas, suelen disminuir su intensidad más rápido."
  ]
};

// Cuando el documento esté listo
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar la aplicación
  initApp();
  
  // Cargar componentes
  loadComponents();
  
  // Configurar listeners para botones y eventos
  setupEventListeners();
  
  // Cargar datos del usuario si está autenticado
  checkAuthAndLoadData();
});

// Función de inicialización
function initApp() {
  console.log(`Curirana v${CURIRANA.version} - Iniciando aplicación...`);
  
  // Cargar configuración del usuario (tema, preferencias, etc.)
  loadUserSettings();
  
  // Mostrar la interfaz principal después de una breve carga
  setTimeout(() => {
    document.getElementById('loader').style.display = 'none';
    document.getElementById('main-container').style.display = 'block';
  }, 1500);
  
  // Inicializar frase del día en la sección "¿Sabías que...?"
  initRandomFact();
}

// Cargar configuración de usuario desde localStorage
function loadUserSettings() {
  try {
    const savedSettings = localStorage.getItem(CURIRANA.localStorageKey);
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      
      // Aplicar tema
      if (settings.theme) {
        setTheme(settings.theme);
      } else {
        // Tema por defecto
        setTheme('light');
      }
      
      console.log('Configuración del usuario cargada');
    } else {
      // Primera vez - usar configuración predeterminada
      setTheme('light');
    }
  } catch (error) {
    console.error('Error al cargar configuración:', error);
    setTheme('light'); // Tema por defecto como fallback
  }
}

// Cambiar el tema de la aplicación
function setTheme(themeName) {
  const app = document.getElementById('app');
  
  // Eliminar clases de tema previas
  app.classList.remove('theme-light', 'theme-dark', 'theme-kawaii', 'theme-nature');
  
  // Aplicar el nuevo tema
  app.classList.add(`theme-${themeName}`);
  
  // Guardar el tema actual
  CURIRANA.currentTheme = themeName;
  
  // Actualizar configuración en localStorage
  saveUserSetting('theme', themeName);
  
  console.log(`Tema cambiado a: ${themeName}`);
}

// Guardar configuración en localStorage
function saveUserSetting(key, value) {
  try {
    // Obtener configuración actual
    let settings = {};
    const savedSettings = localStorage.getItem(CURIRANA.localStorageKey);
    
    if (savedSettings) {
      settings = JSON.parse(savedSettings);
    }
    
    // Actualizar con el nuevo valor
    settings[key] = value;
    
    // Guardar de nuevo
    localStorage.setItem(CURIRANA.localStorageKey, JSON.stringify(settings));
    
    console.log(`Configuración guardada: ${key} = ${value}`);
  } catch (error) {
    console.error('Error al guardar configuración:', error);
  }
}

// Configurar oyentes de eventos
function setupEventListeners() {
  // Oyente para mostrar una nueva frase aleatoria
  const nextFactBtn = document.getElementById('nextFact');
  if (nextFactBtn) {
    nextFactBtn.addEventListener('click', showRandomFact);
  }
  
  // Oyentes para las tarjetas de módulos (para animación)
  const moduleCards = document.querySelectorAll('.module-card');
  moduleCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      // Aquí podríamos añadir alguna animación o efecto específico
    });
  });
  
  console.log('Listeners de eventos configurados');
}

// Inicializar frase aleatoria
function initRandomFact() {
  showRandomFact();
}

// Mostrar una frase aleatoria
function showRandomFact() {
  const factContainer = document.querySelector('.fact');
  if (factContainer) {
    // Obtener índice aleatorio
    const randomIndex = Math.floor(Math.random() * CURIRANA.factsData.length);
    
    // Animación de desvanecimiento
    factContainer.classList.add('fade-out');
    
    // Cambiar el texto después de la animación
    setTimeout(() => {
      factContainer.textContent = CURIRANA.factsData[randomIndex];
      factContainer.classList.remove('fade-out');
      factContainer.classList.add('fade-in');
      
      // Eliminar clase fade-in después de la animación
      setTimeout(() => {
        factContainer.classList.remove('fade-in');
      }, 500);
    }, 500);
  }
}

// Verificar autenticación y cargar datos
function checkAuthAndLoadData() {
  // Esta función se completará cuando implementemos la autenticación
  // Por ahora, cargaremos algunos datos de ejemplo
  console.log('Verificación de autenticación pendiente');
}

// Función para cargar componentes HTML
function loadComponents() {
  // Esta función será implementada en el archivo components-loader.js
  console.log('Cargando componentes...');
}

// Exportar la configuración para que sea accesible desde otros archivos
window.CURIRANA = CURIRANA;