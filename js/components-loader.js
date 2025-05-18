// js/components-loader.js - Cargador de componentes HTML reutilizables para Curirana

// Lista de componentes disponibles y sus rutas
const COMPONENTS = {
  'main-header': 'components/header.html',
  'main-footer': 'components/footer.html',
  'navigation': 'components/navigation.html',
  'emotion-picker': 'components/emotion-picker.html',
  'breathing-animation': 'components/breathing-animation.html'
};

// Función para cargar componentes
async function loadComponents() {
  // Obtener ruta base
  const basePath = getBasePath();
  
  // Intentar cargar cada componente
  const componentPromises = [];
  
  // Para cada componente en el DOM
  Object.keys(COMPONENTS).forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      // Construir ruta completa
      const componentPath = `${basePath}${COMPONENTS[id]}`;
      
      // Añadir promesa para cargar el componente
      componentPromises.push(
        loadComponent(element, componentPath)
          .catch(error => {
            console.error(`Error al cargar componente ${id}:`, error);
            element.innerHTML = `<div class="error">Error al cargar componente</div>`;
          })
      );
    }
  });
  
  // Esperar a que todos los componentes se carguen
  try {
    await Promise.all(componentPromises);
    console.log('Todos los componentes cargados correctamente');
    
    // Inicializar iconos Feather después de cargar componentes
    if (typeof feather !== 'undefined') {
      feather.replace();
    }
    
    // Disparar evento personalizado
    document.dispatchEvent(new CustomEvent('components-loaded'));
  } catch (error) {
    console.error('Error al cargar componentes:', error);
  }
}

// Cargar un componente individual
async function loadComponent(element, url) {
  try {
    // Obtener HTML del componente
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Error al cargar ${url}: ${response.status} ${response.statusText}`);
    }
    
    const html = await response.text();
    
    // Insertar HTML en el elemento
    element.innerHTML = html;
    
    // Ejecutar scripts dentro del componente
    executeComponentScripts(element);
    
    return true;
  } catch (error) {
    console.error(`Error al cargar componente desde ${url}:`, error);
    throw error;
  }
}

// Ejecutar scripts dentro de un componente
function executeComponentScripts(element) {
  // Buscar todos los scripts
  const scripts = element.querySelectorAll('script');
  
  scripts.forEach(oldScript => {
    // Crear nuevo script
    const newScript = document.createElement('script');
    
    // Copiar atributos
    Array.from(oldScript.attributes).forEach(attr => {
      newScript.setAttribute(attr.name, attr.value);
    });
    
    // Copiar contenido
    newScript.appendChild(document.createTextNode(oldScript.innerHTML));
    
    // Reemplazar script original
    oldScript.parentNode.replaceChild(newScript, oldScript);
  });
}

// Obtener ruta base para las URL de componentes
function getBasePath() {
  // Determinar la profundidad de la URL actual
  const path = window.location.pathname;
  const depth = (path.match(/\//g) || []).length - 1;
  
  // Si estamos en una subcarpeta, ajustar la ruta base
  if (path.includes('/pages/')) {
    return '../';
  } else if (depth > 1) {
    return Array(depth).fill('..').join('/') + '/';
  }
  
  return '';
}

// Ajustar rutas relativas en el componente cargado
function adjustComponentPaths(element, basePath) {
  // Ajustar src en imágenes
  element.querySelectorAll('img').forEach(img => {
    if (img.src && img.src.startsWith('./')) {
      img.src = basePath + img.src.substring(2);
    }
  });
  
  // Ajustar href en enlaces
  element.querySelectorAll('a').forEach(link => {
    if (link.href && link.href.startsWith('./')) {
      link.href = basePath + link.href.substring(2);
    }
  });
}

// Cargar componentes cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', loadComponents);

// Exportar funciones
window.componentsHelper = {
  loadComponents,
  loadComponent
};