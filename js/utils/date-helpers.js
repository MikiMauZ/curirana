// Utilidades para manejo de fechas en Curirana

// Obtener fecha actual en formato ISO
function getCurrentDateISO() {
  return new Date().toISOString();
}

// Obtener fecha actual en formato legible
function getCurrentDateFormatted(format = 'dd/MM/yyyy') {
  return formatDate(new Date(), format);
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

// Obtener nombre del mes
function getMonthName(monthIndex, short = false) {
  const months = [
    ['Enero', 'Ene'],
    ['Febrero', 'Feb'],
    ['Marzo', 'Mar'],
    ['Abril', 'Abr'],
    ['Mayo', 'May'],
    ['Junio', 'Jun'],
    ['Julio', 'Jul'],
    ['Agosto', 'Ago'],
    ['Septiembre', 'Sep'],
    ['Octubre', 'Oct'],
    ['Noviembre', 'Nov'],
    ['Diciembre', 'Dic']
  ];
  
  if (monthIndex < 0 || monthIndex > 11) {
    monthIndex = new Date().getMonth();
  }
  
  return months[monthIndex][short ? 1 : 0];
}

// Obtener nombre del día de la semana
function getDayName(dayIndex, short = false) {
  const days = [
    ['Domingo', 'Dom'],
    ['Lunes', 'Lun'],
    ['Martes', 'Mar'],
    ['Miércoles', 'Mié'],
    ['Jueves', 'Jue'],
    ['Viernes', 'Vie'],
    ['Sábado', 'Sáb']
  ];
  
  if (dayIndex < 0 || dayIndex > 6) {
    dayIndex = new Date().getDay();
  }
  
  return days[dayIndex][short ? 1 : 0];
}

// Obtener fecha de hoy al inicio del día (00:00:00)
function getStartOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

// Obtener fecha de hoy al final del día (23:59:59)
function getEndOfToday() {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return today;
}

// Obtener fecha de inicio de semana (lunes)
function getStartOfWeek() {
  const date = new Date();
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Ajustar cuando es domingo
  date.setDate(diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

// Obtener fecha de fin de semana (domingo)
function getEndOfWeek() {
  const date = new Date();
  const day = date.getDay();
  const diff = date.getDate() - day + 7; // domingo
  date.setDate(diff);
  date.setHours(23, 59, 59, 999);
  return date;
}

// Obtener fecha de inicio de mes
function getStartOfMonth() {
  const date = new Date();
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  return date;
}

// Obtener fecha de fin de mes
function getEndOfMonth() {
  const date = new Date();
  date.setMonth(date.getMonth() + 1, 0);
  date.setHours(23, 59, 59, 999);
  return date;
}

// Calcular diferencia en días entre dos fechas
function getDaysDifference(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  // Restar horas, minutos y segundos para obtener solo días
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);
  
  // Calcular diferencia en milisegundos y convertir a días
  const diffTime = Math.abs(d2 - d1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

// Verificar si una fecha es hoy
function isToday(date) {
  const today = new Date();
  const compareDate = new Date(date);
  
  return (
    compareDate.getDate() === today.getDate() &&
    compareDate.getMonth() === today.getMonth() &&
    compareDate.getFullYear() === today.getFullYear()
  );
}

// Verificar si una fecha es esta semana
function isThisWeek(date) {
  const compareDate = new Date(date);
  const startOfWeek = getStartOfWeek();
  const endOfWeek = getEndOfWeek();
  
  return compareDate >= startOfWeek && compareDate <= endOfWeek;
}

// Verificar si una fecha es este mes
function isThisMonth(date) {
  const today = new Date();
  const compareDate = new Date(date);
  
  return (
    compareDate.getMonth() === today.getMonth() &&
    compareDate.getFullYear() === today.getFullYear()
  );
}

// Obtener fecha relativa (ej: "Hoy", "Ayer", "Hace 3 días")
function getRelativeDate(date) {
  const today = new Date();
  const compareDate = new Date(date);
  
  // Restar horas, minutos y segundos para comparar solo fechas
  today.setHours(0, 0, 0, 0);
  compareDate.setHours(0, 0, 0, 0);
  
  const diffTime = today - compareDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Hoy';
  } else if (diffDays === 1) {
    return 'Ayer';
  } else if (diffDays < 7) {
    return `Hace ${diffDays} días`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `Hace ${weeks} ${weeks === 1 ? 'semana' : 'semanas'}`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `Hace ${months} ${months === 1 ? 'mes' : 'meses'}`;
  } else {
    const years = Math.floor(diffDays / 365);
    return `Hace ${years} ${years === 1 ? 'año' : 'años'}`;
  }
}

// Exportar utilidades de fechas
window.dateHelper = {
  getCurrentDateISO,
  getCurrentDateFormatted,
  formatDate,
  getMonthName,
  getDayName,
  getStartOfToday,
  getEndOfToday,
  getStartOfWeek,
  getEndOfWeek,
  getStartOfMonth,
  getEndOfMonth,
  getDaysDifference,
  isToday,
  isThisWeek,
  isThisMonth,
  getRelativeDate
};