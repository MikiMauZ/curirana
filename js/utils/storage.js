// Utilidades para almacenamiento y gestión de datos en Curirana

// Clase para gestionar almacenamiento con soporte local y Firestore
class StorageManager {
  constructor(collectionName, localStorageKey) {
    this.collectionName = collectionName;
    this.localStorageKey = localStorageKey;
    this.useLocalOnly = false; // Por defecto, intentar usar Firestore primero
  }
  
  // Configurar modo de almacenamiento (local o nube)
  setStorageMode(useLocalOnly) {
    this.useLocalOnly = useLocalOnly;
  }
  
  // Guardar datos
  async save(data, id = null) {
    // Agregar metadata
    const timestamp = new Date();
    const dataWithMetadata = {
      ...data,
      updatedAt: timestamp
    };
    
    if (!id) {
      dataWithMetadata.createdAt = timestamp;
    }
    
    // Si es solo local o no hay autenticación, almacenar localmente
    if (this.useLocalOnly || !this.isAuthenticated()) {
      return this.saveToLocalStorage(dataWithMetadata, id);
    }
    
    // Intentar guardar en Firestore
    try {
      const docId = await window.firebaseHelper.saveToFirestore(
        this.collectionName,
        id,
        dataWithMetadata
      );
      
      // Actualizar también en localStorage como respaldo
      this.saveToLocalStorage(dataWithMetadata, docId, false);
      
      return docId;
    } catch (error) {
      console.error('Error al guardar en Firestore:', error);
      
      // Fallback a localStorage
      return this.saveToLocalStorage(dataWithMetadata, id);
    }
  }
  
  // Obtener datos
  async get(id) {
    // Si es solo local o no hay autenticación, obtener desde localStorage
    if (this.useLocalOnly || !this.isAuthenticated()) {
      return this.getFromLocalStorage(id);
    }
    
    // Intentar obtener de Firestore
    try {
      const data = await window.firebaseHelper.getFromFirestore(
        this.collectionName,
        id
      );
      
      return data;
    } catch (error) {
      console.error('Error al obtener de Firestore:', error);
      
      // Fallback a localStorage
      return this.getFromLocalStorage(id);
    }
  }
  
  // Obtener lista de datos
  async getAll() {
    // Si es solo local o no hay autenticación, obtener desde localStorage
    if (this.useLocalOnly || !this.isAuthenticated()) {
      return this.getAllFromLocalStorage();
    }
    
    // Intentar obtener de Firestore
    try {
      const userId = window.authHelper.getCurrentUserId();
      const results = await window.firebaseHelper.queryFirestore(
        this.collectionName,
        'userId',
        '==',
        userId
      );
      
      return results;
    } catch (error) {
      console.error('Error al obtener lista de Firestore:', error);
      
      // Fallback a localStorage
      return this.getAllFromLocalStorage();
    }
  }
  
  // Eliminar datos
  async delete(id) {
    // Si es solo local o no hay autenticación, eliminar desde localStorage
    if (this.useLocalOnly || !this.isAuthenticated()) {
      return this.deleteFromLocalStorage(id);
    }
    
    // Intentar eliminar de Firestore
    try {
      await window.firebaseHelper.deleteFromFirestore(
        this.collectionName,
        id
      );
      
      // Eliminar también de localStorage
      this.deleteFromLocalStorage(id);
      
      return true;
    } catch (error) {
      console.error('Error al eliminar de Firestore:', error);
      
      // Eliminar de localStorage de todos modos
      return this.deleteFromLocalStorage(id);
    }
  }
  
  // Métodos para localStorage
  saveToLocalStorage(data, id = null, showMessage = true) {
    try {
      // Obtener datos actuales
      const items = this.getItemsFromLocalStorage();
      
      // Generar ID si no existe
      if (!id) {
        id = this.generateLocalId();
      }
      
      // Añadir userId si el usuario está autenticado
      if (this.isAuthenticated()) {
        data.userId = window.authHelper.getCurrentUserId();
      }
      
      // Actualizar o agregar item
      items[id] = data;
      
      // Guardar en localStorage
      localStorage.setItem(this.localStorageKey, JSON.stringify(items));
      
      if (showMessage) {
        console.log(`Datos guardados localmente en ${this.localStorageKey} con ID: ${id}`);
      }
      
      return id;
    } catch (error) {
      console.error('Error al guardar en localStorage:', error);
      throw error;
    }
  }
  
  getFromLocalStorage(id) {
    try {
      const items = this.getItemsFromLocalStorage();
      return items[id] || null;
    } catch (error) {
      console.error('Error al obtener de localStorage:', error);
      return null;
    }
  }
  
  getAllFromLocalStorage() {
    try {
      const items = this.getItemsFromLocalStorage();
      const userId = this.isAuthenticated() ? window.authHelper.getCurrentUserId() : null;
      
      // Convertir objeto a array con IDs
      return Object.entries(items)
        .filter(([_, item]) => !userId || item.userId === userId)
        .map(([id, item]) => ({ id, ...item }));
    } catch (error) {
      console.error('Error al obtener lista de localStorage:', error);
      return [];
    }
  }
  
  deleteFromLocalStorage(id) {
    try {
      const items = this.getItemsFromLocalStorage();
      
      if (items[id]) {
        delete items[id];
        localStorage.setItem(this.localStorageKey, JSON.stringify(items));
        console.log(`Item eliminado de localStorage con ID: ${id}`);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error al eliminar de localStorage:', error);
      return false;
    }
  }
  
  getItemsFromLocalStorage() {
    try {
      const data = localStorage.getItem(this.localStorageKey);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error al leer de localStorage:', error);
      return {};
    }
  }
  
  // Generar ID único para localStorage
  generateLocalId() {
    return 'local_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }
  
  // Verificar si el usuario está autenticado
  isAuthenticated() {
    return window.authHelper && window.authHelper.isUserLoggedIn();
  }
  
  // Sincronizar datos locales con Firestore cuando se conecta
  async syncWithFirestore() {
    if (this.useLocalOnly || !this.isAuthenticated()) {
      return false;
    }
    
    try {
      const localItems = this.getAllFromLocalStorage();
      
      // Para cada item local, verificar si tiene ID de Firestore
      for (const item of localItems) {
        const id = item.id;
        delete item.id; // Eliminar para guardar correctamente
        
        // Solo sincronizar items sin ID de Firestore o con ID local
        if (!id || id.startsWith('local_')) {
          await window.firebaseHelper.saveToFirestore(
            this.collectionName,
            id.startsWith('local_') ? null : id,
            item
          );
        }
      }
      
      console.log('Sincronización con Firestore completada');
      return true;
    } catch (error) {
      console.error('Error al sincronizar con Firestore:', error);
      return false;
    }
  }
}

// Exportar utilidades de almacenamiento
window.storageHelper = {
  createStorageManager: (collectionName, localStorageKey) => 
    new StorageManager(collectionName, localStorageKey)
};