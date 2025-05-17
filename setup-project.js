const fs = require('fs');
const path = require('path');

// Estructura de directorios y archivos
const structure = {
  'index.html': '',
  'manifest.json': '',
  'favicon.ico': '',
  'css': {
    'styles.css': '',
    'themes.css': '',
    'animations.css': '',
    'responsive.css': ''
  },
  'js': {
    'app.js': '',
    'auth.js': '',
    'firebase-config.js': '',
    'modules': {
      'emotions.js': '',
      'breathing.js': '',
      'gratitude.js': '',
      'reminders.js': '',
      'goals.js': '',
      'values.js': '',
      'quotes.js': '',
      'thoughts.js': '',
      'physical-sensations.js': '',
      'basic-needs.js': ''
    },
    'utils': {
      'storage.js': '',
      'ui-helpers.js': '',
      'date-helpers.js': ''
    }
  },
  'pages': {
    'home.html': '',
    'emotions.html': '',
    'breathing.html': '',
    'gratitude.html': '',
    'reminders.html': '',
    'goals.html': '',
    'values.html': '',
    'quotes.html': '',
    'settings.html': '',
    'login.html': '',
    'signup.html': '',
    'thoughts.html': '',
    'physical-sensations.html': '',
    'basic-needs.html': ''
  },
  'assets': {
    'images': {
      'characters': {},
      'icons': {},
      'backgrounds': {}
    },
    'fonts': {},
    'sounds': {},
    'animations': {
      'breathing': {},
      'thoughts': {}
    }
  },
  'components': {
    'header.html': '',
    'footer.html': '',
    'navigation.html': '',
    'emotion-picker.html': '',
    'breathing-animation.html': ''
  }
};

// Función para crear directorios y archivos recursivamente
function createStructure(basePath, structure) {
  Object.entries(structure).forEach(([name, content]) => {
    const fullPath = path.join(basePath, name);
    
    if (typeof content === 'object') {
      // Es un directorio
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        console.log(`Created directory: ${fullPath}`);
      }
      createStructure(fullPath, content);
    } else {
      // Es un archivo
      if (!fs.existsSync(fullPath)) {
        fs.writeFileSync(fullPath, content);
        console.log(`Created file: ${fullPath}`);
      }
    }
  });
}

// Crear la estructura en el directorio actual
createStructure('.', structure);
console.log('Project structure created successfully!');