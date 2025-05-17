// Configuración de Firebase para Curirana

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDiU2YIYRrJNX2axmdLAUsXAAP2_fIHQFw",
  authDomain: "curirana.firebaseapp.com",
  projectId: "curirana",
  storageBucket: "curirana.firebasestorage.app",
  messagingSenderId: "250075686799",
  appId: "1:250075686799:web:5af788f7b7a8ef4d7dcdfa",
  measurementId: "G-D70J0B2PN6"
};

// Inicialización de Firebase con compatibilidad
try {
  // Inicializar Firebase
  firebase.initializeApp(firebaseConfig);
  
  // Habilitar la persistencia offline para Firestore
  firebase.firestore().enablePersistence({
    synchronizeTabs: true
  })
  .then(() => {
    console.log("Firebase offline persistence habilitada");
  })
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn("La persistencia offline no pudo ser habilitada porque múltiples pestañas están abiertas");
    } else if (err.code === 'unimplemented') {
      console.warn("El navegador actual no soporta persistencia offline");
    }
  });
  
  console.log("Firebase inicializado correctamente");
} catch (error) {
  console.error("Error al inicializar Firebase:", error);
}

// Funciones de ayuda para Firebase

// Obtener instancia de Firestore
function getFirestore() {
  return firebase.firestore();
}

// Obtener instancia de Auth
function getAuth() {
  return firebase.auth();
}

// Guardar datos en Firestore
async function saveToFirestore(collection, docId, data) {
  try {
    const db = getFirestore();
    let docRef;
    
    if (docId) {
      docRef = db.collection(collection).doc(docId);
      await docRef.set(data, { merge: true });
    } else {
      docRef = await db.collection(collection).add(data);
    }
    
    console.log(`Datos guardados en ${collection} con ID: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error(`Error al guardar en ${collection}:`, error);
    throw error;
  }
}

// Obtener documento de Firestore
async function getFromFirestore(collection, docId) {
  try {
    const db = getFirestore();
    const docRef = db.collection(collection).doc(docId);
    const docSnap = await docRef.get();
    
    if (docSnap.exists) {
      return docSnap.data();
    } else {
      console.log(`No existe documento con ID ${docId} en ${collection}`);
      return null;
    }
  } catch (error) {
    console.error(`Error al obtener documento de ${collection}:`, error);
    throw error;
  }
}

// Consultar documentos de Firestore con filtros
async function queryFirestore(collection, fieldPath, opStr, value) {
  try {
    const db = getFirestore();
    const querySnapshot = await db.collection(collection)
      .where(fieldPath, opStr, value)
      .get();
    
    const results = [];
    querySnapshot.forEach((doc) => {
      results.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return results;
  } catch (error) {
    console.error(`Error en consulta a ${collection}:`, error);
    throw error;
  }
}

// Eliminar documento de Firestore
async function deleteFromFirestore(collection, docId) {
  try {
    const db = getFirestore();
    await db.collection(collection).doc(docId).delete();
    console.log(`Documento eliminado de ${collection} con ID: ${docId}`);
    return true;
  } catch (error) {
    console.error(`Error al eliminar documento de ${collection}:`, error);
    throw error;
  }
}

// Exportar funciones de Firebase
window.firebaseHelper = {
  getFirestore,
  getAuth,
  saveToFirestore,
  getFromFirestore,
  queryFirestore,
  deleteFromFirestore
};