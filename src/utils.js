// src/utils.js
// Modulo de utilidades - Workshop DevOps con Kiro (Carvajal)

/**
 * Valida si un string tiene formato de email valido
 * @param {string} email - El email a validar
 * @returns {boolean} true si el email tiene formato valido, false en caso contrario
 */
function validateEmail(email) {
  if (typeof email !== 'string' || email.trim() === '') {
    return false;
  }
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Convierte un texto a formato slug URL-friendly
 * @param {string} text - Texto a convertir en slug
 * @returns {string} Texto en formato slug
 */
function slugify(text) {
  if (typeof text !== 'string') {
    return '';
  }
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Calcula el precio final despues de aplicar un porcentaje de descuento
 * @param {number} price - Precio original (debe ser positivo)
 * @param {number} percentage - Porcentaje de descuento (0-100)
 * @returns {number} Precio con descuento aplicado
 */
function calculateDiscount(price, percentage) {
  if (typeof price !== 'number' || price < 0) {
    throw new Error('El precio debe ser un numero positivo');
  }
  if (typeof percentage !== 'number' || percentage < 0 || percentage > 100) {
    throw new Error('El porcentaje debe estar entre 0 y 100');
  }
  return price - (price * percentage / 100);
}

/**
 * Formatea un monto numerico como moneda con simbolo y separadores locales
 * @param {number} amount - Monto a formatear
 * @param {string} [currency='COP'] - Codigo ISO de moneda (COP, USD, EUR)
 * @returns {string} Monto formateado como moneda
 */
function formatCurrency(amount, currency = 'COP') {
  if (typeof amount !== 'number') {
    throw new Error('El monto debe ser un numero');
  }
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

module.exports = { validateEmail, slugify, calculateDiscount, formatCurrency };
