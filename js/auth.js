// Funciones de autenticación para Curirana

// Estado del usuario
let currentUser = null;

// Escuchar cambios en el estado de autenticación
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // Usuario autenticado
    currentUser = user;
    onUserLoggedIn(user);
  } else {
    // Usuario desconectado
    currentUser = null;
    onUserLoggedOut();
  }
});

// Manejar inicio de sesión exitoso
function onUserLoggedIn(user) {
  console.log(`Usuario autenticado: ${user.email || 'Anónimo'}`);
  
  // Actualizar interfaz para usuario autenticado
  const authStatusElements = document.querySelectorAll('[data-auth-status]');
  authStatusElements.forEach(element => {
    if (element.dataset.authStatus === 'logged-in') {
      element.style.display = 'block';
    } else if (element.dataset.authStatus === 'logged-out') {
      element.style.display = 'none';
    }
  });
  
  // Mostrar nombre de usuario si está disponible
  const userNameElements = document.querySelectorAll('[data-user-name]');
  userNameElements.forEach(element => {
    element.textContent = user.displayName || user.email || 'Usuario';
  });
  
  // Cargar datos del usuario
  loadUserData(user.uid);
}

// Manejar cierre de sesión
function onUserLoggedOut() {
  console.log('Usuario desconectado');
  
  // Actualizar interfaz para usuario no autenticado
  const authStatusElements = document.querySelectorAll('[data-auth-status]');
  authStatusElements.forEach(element => {
    if (element.dataset.authStatus === 'logged-in') {
      element.style.display = 'none';
    } else if (element.dataset.authStatus === 'logged-out') {
      element.style.display = 'block';
    }
  });
  
  // Limpiar cualquier dato del usuario en la interfaz
  const userNameElements = document.querySelectorAll('[data-user-name]');
  userNameElements.forEach(element => {
    element.textContent = 'Invitado';
  });
}

// Registrar un nuevo usuario
async function registerUser(email, password, displayName) {
  try {
    // Crear usuario con email y contraseña
    const result = await firebase.auth().createUserWithEmailAndPassword(email, password);
    
    // Actualizar perfil con nombre visible
    if (result.user) {
      await result.user.updateProfile({
        displayName: displayName
      });
      
      // Crear documento de usuario en Firestore
      await createUserProfile(result.user.uid, {
        displayName,
        email,
        createdAt: new Date(),
        theme: 'light',
        notifications: true
      });
      
      console.log('Usuario registrado correctamente');
      return result.user;
    }
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    throw error;
  }
}

// Iniciar sesión con email y contraseña
async function loginWithEmail(email, password) {
  try {
    const result = await firebase.auth().signInWithEmailAndPassword(email, password);
    console.log('Inicio de sesión exitoso');
    return result.user;
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    throw error;
  }
}

// Iniciar sesión con Google
async function loginWithGoogle() {
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await firebase.auth().signInWithPopup(provider);
    
    // Comprobar si es primera vez
    const isNewUser = result.additionalUserInfo.isNewUser;
    
    if (isNewUser && result.user) {
      // Crear perfil para nuevo usuario
      await createUserProfile(result.user.uid, {
        displayName: result.user.displayName,
        email: result.user.email,
        createdAt: new Date(),
        theme: 'light',
        notifications: true
      });
    }
    
    console.log('Inicio de sesión con Google exitoso');
    return result.user;
  } catch (error) {
    console.error('Error al iniciar sesión con Google:', error);
    throw error;
  }
}

// Cerrar sesión
async function logout() {
  try {
    await firebase.auth().signOut();
    console.log('Sesión cerrada correctamente');
    return true;
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    throw error;
  }
}

// Recuperar contraseña
async function resetPassword(email) {
  try {
    await firebase.auth().sendPasswordResetEmail(email);
    console.log('Email de recuperación enviado');
    return true;
  } catch (error) {
    console.error('Error al enviar email de recuperación:', error);
    throw error;
  }
}

// Crear perfil de usuario en Firestore
async function createUserProfile(userId, userData) {
  try {
    await firebase.firestore().collection('users').doc(userId).set(userData);
    console.log('Perfil de usuario creado en Firestore');
    return true;
  } catch (error) {
    console.error('Error al crear perfil de usuario:', error);
    throw error;
  }
}

// Cargar datos del usuario
async function loadUserData(userId) {
  try {
    const userDoc = await firebase.firestore().collection('users').doc(userId).get();
    
    if (userDoc.exists) {
      const userData = userDoc.data();
      
      // Aplicar preferencias del usuario
      if (userData.theme) {
        setTheme(userData.theme);
      }
      
      console.log('Datos de usuario cargados');
      return userData;
    } else {
      console.log('No se encontró perfil de usuario');
      return null;
    }
  } catch (error) {
    console.error('Error al cargar datos de usuario:', error);
    return null;
  }
}

// Actualizar perfil de usuario
async function updateUserProfile(updates) {
  if (!currentUser) {
    throw new Error('No hay usuario autenticado');
  }
  
  try {
    // Actualizar en Auth si hay displayName
    if (updates.displayName) {
      await currentUser.updateProfile({
        displayName: updates.displayName
      });
    }
    
    // Actualizar en Firestore
    await firebase.firestore().collection('users').doc(currentUser.uid).update(updates);
    
    console.log('Perfil actualizado correctamente');
    return true;
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    throw error;
  }
}

// Eliminar cuenta de usuario
async function deleteUserAccount() {
  if (!currentUser) {
    throw new Error('No hay usuario autenticado');
  }
  
  try {
    // Eliminar documento de usuario en Firestore
    await firebase.firestore().collection('users').doc(currentUser.uid).delete();
    
    // Eliminar usuario de autenticación
    await currentUser.delete();
    
    console.log('Cuenta eliminada correctamente');
    return true;
  } catch (error) {
    console.error('Error al eliminar cuenta:', error);
    throw error;
  }
}

// Comprobar si el usuario está autenticado
function isUserLoggedIn() {
  return currentUser !== null;
}

// Obtener ID del usuario actual
function getCurrentUserId() {
  return currentUser ? currentUser.uid : null;
}

// Obtener email del usuario actual
function getCurrentUserEmail() {
  return currentUser ? currentUser.email : null;
}

// Exportar funciones de autenticación
window.authHelper = {
  registerUser,
  loginWithEmail,
  loginWithGoogle,
  logout,
  resetPassword,
  updateUserProfile,
  deleteUserAccount,
  isUserLoggedIn,
  getCurrentUserId,
  getCurrentUserEmail
};