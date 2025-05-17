// Utilidades para la interfaz de usuario de Curirana

// Mostrar mensaje de alerta
function showAlert(message, type = 'info', duration = 3000) {
  // Crear elemento de alerta
  const alertEl = document.createElement('div');
  alertEl.className = `alert alert-${type}`;
  alertEl.textContent = message;
  
  // Añadir estilos
  alertEl.style.position = 'fixed';
  alertEl.style.top = '1rem';
  alertEl.style.left = '50%';
  alertEl.style.transform = 'translateX(-50%)';
  alertEl.style.padding = '0.75rem 1.25rem';
  alertEl.style.borderRadius = '0.25rem';
  alertEl.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
  alertEl.style.zIndex = '9999';
  alertEl.style.opacity = '0';
  alertEl.style.transition = 'opacity 0.3s ease-in-out';
  
  // Estilos según tipo
  switch(type) {
    case 'success':
      alertEl.style.backgroundColor = '#d4edda';
      alertEl.style.color = '#155724';
      alertEl.style.borderColor = '#c3e6cb';
      break;
    case 'warning':
      alertEl.style.backgroundColor = '#fff3cd';
      alertEl.style.color = '#856404';
      alertEl.style.borderColor = '#ffeeba';
      break;
    case 'error':
      alertEl.style.backgroundColor = '#f8d7da';
      alertEl.style.color = '#721c24';
      alertEl.style.borderColor = '#f5c6cb';
      break;
    default: // info
      alertEl.style.backgroundColor = '#d1ecf1';
      alertEl.style.color = '#0c5460';
      alertEl.style.borderColor = '#bee5eb';
  }
  
  // Añadir al DOM
  document.body.appendChild(alertEl);
  
  // Mostrar con animación
  setTimeout(() => {
    alertEl.style.opacity = '1';
  }, 10);
  
  // Ocultar después de duración
  setTimeout(() => {
    alertEl.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(alertEl);
    }, 300);
  }, duration);
}

// Mostrar diálogo de confirmación
function showConfirm(message, onConfirm, onCancel) {
  // Crear overlay
  const overlay = document.createElement('div');
  overlay.className = 'confirm-overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  overlay.style.display = 'flex';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';
  overlay.style.zIndex = '9999';
  
  // Crear diálogo
  const dialog = document.createElement('div');
  dialog.className = 'confirm-dialog';
  dialog.style.backgroundColor = 'var(--background-tertiary)';
  dialog.style.borderRadius = 'var(--border-radius-medium)';
  dialog.style.boxShadow = 'var(--shadow-lg)';
  dialog.style.padding = '1.5rem';
  dialog.style.maxWidth = '400px';
  dialog.style.width = '90%';
  
  // Crear mensaje
  const messageEl = document.createElement('p');
  messageEl.textContent = message;
  messageEl.style.marginBottom = '1.5rem';
  
  // Crear botones
  const buttonsContainer = document.createElement('div');
  buttonsContainer.style.display = 'flex';
  buttonsContainer.style.justifyContent = 'flex-end';
  buttonsContainer.style.gap = '0.5rem';
  
  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'Cancelar';
  cancelBtn.className = 'btn';
  cancelBtn.style.backgroundColor = 'var(--background-secondary)';
  cancelBtn.style.color = 'var(--text-secondary)';
  cancelBtn.style.border = 'none';
  cancelBtn.style.padding = '0.5rem 1rem';
  cancelBtn.style.borderRadius = 'var(--border-radius-small)';
  cancelBtn.style.cursor = 'pointer';
  
  const confirmBtn = document.createElement('button');
  confirmBtn.textContent = 'Confirmar';
  confirmBtn.className = 'btn btn-primary';
  confirmBtn.style.backgroundColor = 'var(--primary-color)';
  confirmBtn.style.color = 'white';
  confirmBtn.style.border = 'none';
  confirmBtn.style.padding = '0.5rem 1rem';
  confirmBtn.style.borderRadius = 'var(--border-radius-small)';
  confirmBtn.style.cursor = 'pointer';
  
  // Añadir elementos al DOM
  buttonsContainer.appendChild(cancelBtn);
  buttonsContainer.appendChild(confirmBtn);
  
  dialog.appendChild(messageEl);
  dialog.appendChild(buttonsContainer);
  
  overlay.appendChild(dialog);
  document.body.appendChild(overlay);
  
  // Asignar eventos
  cancelBtn.addEventListener('click', () => {
    document.body.removeChild(overlay);
    if (typeof onCancel === 'function') {
      onCancel();
    }
  });
  
  confirmBtn.addEventListener('click', () => {
    document.body.removeChild(overlay);
    if (typeof onConfirm === 'function') {
      onConfirm();
    }
  });
}

// Mostrar modal/diálogo personalizado
function showModal(title, content, options = {}) {
  // Opciones por defecto
  const defaultOptions = {
    closeOnClickOutside: true,
    showCloseButton: true,
    fullscreen: false,
    onClose: null
  };
  
  const finalOptions = { ...defaultOptions, ...options };
  
  // Crear overlay
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  overlay.style.display = 'flex';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';
  overlay.style.zIndex = '9999';
  
  // Crear modal
  const modal = document.createElement('div');
  modal.className = 'modal-container';
  modal.style.backgroundColor = 'var(--background-tertiary)';
  modal.style.borderRadius = finalOptions.fullscreen ? '0' : 'var(--border-radius-medium)';
  modal.style.boxShadow = 'var(--shadow-lg)';
  modal.style.width = finalOptions.fullscreen ? '100%' : '90%';
  modal.style.maxWidth = finalOptions.fullscreen ? '100%' : '600px';
  modal.style.height = finalOptions.fullscreen ? '100%' : 'auto';
  modal.style.maxHeight = finalOptions.fullscreen ? '100%' : '90vh';
  modal.style.overflow = 'auto';
  modal.style.display = 'flex';
  modal.style.flexDirection = 'column';
  
  // Crear cabecera
  const header = document.createElement('div');
  header.className = 'modal-header';
  header.style.padding = '1rem 1.5rem';
  header.style.borderBottom = '1px solid var(--background-secondary)';
  header.style.display = 'flex';
  header.style.justifyContent = 'space-between';
  header.style.alignItems = 'center';
  
  const titleEl = document.createElement('h3');
  titleEl.textContent = title;
  titleEl.style.margin = '0';
  header.appendChild(titleEl);
  
  if (finalOptions.showCloseButton) {
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.background = 'none';
    closeBtn.style.border = 'none';
    closeBtn.style.fontSize = '1.5rem';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.color = 'var(--text-primary)';
    
    closeBtn.addEventListener('click', () => {
      closeModal();
    });
    
    header.appendChild(closeBtn);
  }
  
  // Crear cuerpo
  const body = document.createElement('div');
  body.className = 'modal-body';
  body.style.padding = '1.5rem';
  body.style.flex = '1';
  body.style.overflowY = 'auto';
  
  if (typeof content === 'string') {
    body.innerHTML = content;
  } else if (content instanceof HTMLElement) {
    body.appendChild(content);
  }
  
  // Añadir elementos al DOM
  modal.appendChild(header);
  modal.appendChild(body);
  
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  
  // Cerrar al hacer clic fuera si está habilitado
  if (finalOptions.closeOnClickOutside) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal();
      }
    });
  }
  
  // Función para cerrar el modal
  function closeModal() {
    document.body.removeChild(overlay);
    if (typeof finalOptions.onClose === 'function') {
      finalOptions.onClose();
    }
  }
  
  // Devolver función para cerrar modal
  return closeModal;
}

// Mostrar tooltips/ayudas
function showTooltip(element, text) {
  // Crear tooltip
  const tooltip = document.createElement('div');
  tooltip.className = 'tooltip';
  tooltip.textContent = text;
  
  // Estilos
  tooltip.style.position = 'absolute';
  tooltip.style.backgroundColor = 'var(--background-secondary)';
  tooltip.style.color = 'var(--text-primary)';
  tooltip.style.padding = '0.5rem 0.75rem';
  tooltip.style.borderRadius = 'var(--border-radius-small)';
  tooltip.style.fontSize = 'var(--font-size-sm)';
  tooltip.style.boxShadow = 'var(--shadow-sm)';
  tooltip.style.zIndex = '1000';
  tooltip.style.pointerEvents = 'none';
  tooltip.style.opacity = '0';
  tooltip.style.transition = 'opacity 0.2s ease-in-out';
  
  // Añadir al DOM
  document.body.appendChild(tooltip);
  
  // Posicionar tooltip
  function positionTooltip() {
    const rect = element.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    
    // Posición inicial (por encima del elemento)
    let top = rect.top - tooltipRect.height - 10;
    let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
    
    // Ajustar si está fuera de la ventana
    if (top < 10) {
      // Mostrar debajo si no hay espacio arriba
      top = rect.bottom + 10;
    }
    
    if (left < 10) {
      left = 10;
    } else if (left + tooltipRect.width > window.innerWidth - 10) {
      left = window.innerWidth - tooltipRect.width - 10;
    }
    
    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
  }
  
  // Eventos del elemento
  element.addEventListener('mouseenter', () => {
    positionTooltip();
    tooltip.style.opacity = '1';
  });
  
  element.addEventListener('mouseleave', () => {
    tooltip.style.opacity = '0';
  });
  
  // Limpiar eventos y eliminar tooltip si el elemento se elimina
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (Array.from(mutation.removedNodes).includes(element)) {
        document.body.removeChild(tooltip);
        observer.disconnect();
      }
    });
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
}

// Función para animar elementos entrando en pantalla
function animateOnScroll() {
  const elements = document.querySelectorAll('.animate-on-scroll');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });
  
  elements.forEach(el => {
    observer.observe(el);
  });
}

// Crear elemento con clase y atributos
function createElement(tag, attributes = {}, content = '') {
  const element = document.createElement(tag);
  
  // Configurar atributos
  for (const key in attributes) {
    if (key === 'class' || key === 'className') {
      element.className = attributes[key];
    } else if (key === 'style' && typeof attributes[key] === 'object') {
      Object.assign(element.style, attributes[key]);
    } else {
      element.setAttribute(key, attributes[key]);
    }
  }
  
  // Añadir contenido
  if (typeof content === 'string') {
    element.innerHTML = content;
  } else if (content instanceof HTMLElement) {
    element.appendChild(content);
  }
  
  return element;
}

// Cargar contenido HTML en elemento
async function loadHTML(element, url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error cargando ${url}: ${response.status} ${response.statusText}`);
    }
    
    const html = await response.text();
    element.innerHTML = html;
    
    // Ejecutar scripts dentro del HTML cargado
    const scripts = element.querySelectorAll('script');
    scripts.forEach(oldScript => {
      const newScript = document.createElement('script');
      Array.from(oldScript.attributes).forEach(attr => {
        newScript.setAttribute(attr.name, attr.value);
      });
      newScript.appendChild(document.createTextNode(oldScript.innerHTML));
      oldScript.parentNode.replaceChild(newScript, oldScript);
    });
    
    return true;
  } catch (error) {
    console.error('Error al cargar HTML:', error);
    return false;
  }
}

// Formatear fecha
function formatDate(date, format = 'dd/MM/yyyy') {
  if (!date) return '';
  
  if (typeof date === 'string' || typeof date === 'number') {
    date = new Date(date);
  }
  
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return format
    .replace('dd', day)
    .replace('MM', month)
    .replace('yyyy', year)
    .replace('HH', hours)
    .replace('mm', minutes);
}

// Exportar utilidades de UI
window.uiHelper = {
  showAlert,
  showConfirm,
  showModal,
  showTooltip,
  animateOnScroll,
  createElement,
  loadHTML,
  formatDate
};