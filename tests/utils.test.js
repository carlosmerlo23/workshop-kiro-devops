// tests/utils.test.js
// Tests unitarios para el modulo de utilidades
// Workshop DevOps con Kiro - Carvajal

const { validateEmail, slugify, calculateDiscount, formatCurrency } = require('../src/utils');

// ─────────────────────────────────────────────
// Tests para validateEmail
// ─────────────────────────────────────────────
describe('validateEmail', () => {
  // --- Casos positivos (happy path) ---

  // Valida un email con formato estandar
  test('acepta un email con formato correcto', () => {
    expect(validateEmail('usuario@carvajal.com')).toBe(true);
  });

  // Valida emails con subdominios (comun en empresas)
  test('acepta email con subdominios', () => {
    expect(validateEmail('dev@mail.carvajal.com.co')).toBe(true);
  });

  // Valida emails con caracteres especiales validos antes del @
  test('acepta email con puntos y guiones en el usuario', () => {
    expect(validateEmail('nombre.apellido-dev@empresa.com')).toBe(true);
  });

  // --- Casos de borde (edge cases) ---

  // Rechaza email sin el simbolo @
  test('rechaza email sin @', () => {
    expect(validateEmail('usuario.carvajal.com')).toBe(false);
  });

  // Rechaza email sin dominio despues del @
  test('rechaza email sin dominio', () => {
    expect(validateEmail('usuario@')).toBe(false);
  });

  // Rechaza email con espacios
  test('rechaza email con espacios', () => {
    expect(validateEmail('usuario @carvajal.com')).toBe(false);
  });

  // --- Casos de error (inputs invalidos) ---

  // Rechaza string vacio
  test('rechaza string vacio', () => {
    expect(validateEmail('')).toBe(false);
  });

  // Rechaza null sin lanzar excepcion
  test('rechaza null gracefully', () => {
    expect(validateEmail(null)).toBe(false);
  });

  // Rechaza undefined sin lanzar excepcion
  test('rechaza undefined gracefully', () => {
    expect(validateEmail(undefined)).toBe(false);
  });

  // Rechaza numeros
  test('rechaza un numero como input', () => {
    expect(validateEmail(12345)).toBe(false);
  });
});

// ─────────────────────────────────────────────
// Tests para slugify
// ─────────────────────────────────────────────
describe('slugify', () => {
  // --- Casos positivos (happy path) ---

  // Convierte texto simple con espacios a slug
  test('convierte texto simple a slug', () => {
    expect(slugify('Hola Mundo')).toBe('hola-mundo');
  });

  // Convierte texto con mayusculas y espacios
  test('convierte texto con mayusculas y espacios', () => {
    expect(slugify('Pipeline de CI')).toBe('pipeline-de-ci');
  });

  // Maneja texto con numeros correctamente
  test('conserva numeros en el slug', () => {
    expect(slugify('Node.js 20 LTS')).toBe('nodejs-20-lts');
  });

  // --- Casos de borde (edge cases) ---

  // Elimina caracteres especiales (!, #, $, etc.)
  test('elimina caracteres especiales', () => {
    expect(slugify('Producto #1: Oferta!')).toBe('producto-1-oferta');
  });

  // Colapsa multiples espacios en un solo guion
  test('maneja multiples espacios consecutivos', () => {
    expect(slugify('  muchos   espacios  ')).toBe('muchos-espacios');
  });

  // Maneja guiones y underscores existentes
  test('normaliza guiones y underscores multiples', () => {
    expect(slugify('ya-tiene--guiones___y_underscores')).toBe('ya-tiene-guiones-y-underscores');
  });

  // No deja guiones al inicio o final
  test('remueve guiones al inicio y final', () => {
    expect(slugify('--texto-limpio--')).toBe('texto-limpio');
  });

  // --- Casos de error (inputs invalidos) ---

  // String vacio retorna string vacio
  test('retorna string vacio para input vacio', () => {
    expect(slugify('')).toBe('');
  });

  // Input no-string retorna string vacio sin lanzar error
  test('retorna string vacio para input no-string', () => {
    expect(slugify(null)).toBe('');
    expect(slugify(undefined)).toBe('');
    expect(slugify(123)).toBe('');
  });
});

// ─────────────────────────────────────────────
// Tests para calculateDiscount
// ─────────────────────────────────────────────
describe('calculateDiscount', () => {
  // --- Casos positivos (happy path) ---

  // Calcula descuento basico correctamente
  test('calcula descuento del 10% sobre 100', () => {
    expect(calculateDiscount(100, 10)).toBe(90);
  });

  // Calcula descuento con decimales
  test('calcula descuento del 15% sobre 200', () => {
    expect(calculateDiscount(200, 15)).toBe(170);
  });

  // Descuento del 50% (mitad de precio)
  test('calcula descuento del 50% correctamente', () => {
    expect(calculateDiscount(80, 50)).toBe(40);
  });

  // --- Casos de borde (edge cases) ---

  // Descuento de 0% devuelve el precio original sin modificar
  test('descuento de 0% devuelve precio original', () => {
    expect(calculateDiscount(50, 0)).toBe(50);
  });

  // Descuento de 100% devuelve 0 (gratis)
  test('descuento de 100% devuelve 0', () => {
    expect(calculateDiscount(200, 100)).toBe(0);
  });

  // Precio de 0 con cualquier descuento da 0
  test('precio 0 con cualquier descuento da 0', () => {
    expect(calculateDiscount(0, 50)).toBe(0);
  });

  // --- Casos de error (inputs invalidos) ---

  // Porcentaje negativo lanza error
  test('lanza error con porcentaje negativo', () => {
    expect(() => calculateDiscount(100, -5)).toThrow('El porcentaje debe estar entre 0 y 100');
  });

  // Porcentaje mayor a 100 lanza error
  test('lanza error con porcentaje mayor a 100', () => {
    expect(() => calculateDiscount(100, 150)).toThrow('El porcentaje debe estar entre 0 y 100');
  });

  // Precio negativo lanza error
  test('lanza error con precio negativo', () => {
    expect(() => calculateDiscount(-50, 10)).toThrow('El precio debe ser un numero positivo');
  });

  // Input no numerico lanza error
  test('lanza error si el precio no es numero', () => {
    expect(() => calculateDiscount('cien', 10)).toThrow();
  });
});

// ─────────────────────────────────────────────
// Tests para formatCurrency
// ─────────────────────────────────────────────
describe('formatCurrency', () => {
  // --- Casos positivos (happy path) ---

  // Formatea en COP por defecto (moneda colombiana)
  test('formatea en COP por defecto', () => {
    const result = formatCurrency(50000);
    expect(result).toContain('50.000');
  });

  // Formatea en USD cuando se especifica
  test('formatea en USD cuando se especifica', () => {
    const result = formatCurrency(100, 'USD');
    expect(result).toContain('100');
    expect(result).toContain('US');
  });

  // Formatea en EUR
  test('formatea en EUR correctamente', () => {
    const result = formatCurrency(250, 'EUR');
    expect(result).toContain('250');
  });

  // --- Casos de borde (edge cases) ---

  // Monto de 0 se formatea correctamente
  test('formatea monto 0 correctamente', () => {
    const result = formatCurrency(0);
    expect(result).toContain('0');
  });

  // Montos negativos (devoluciones) se formatean con signo
  test('formatea montos negativos', () => {
    const result = formatCurrency(-1500);
    expect(result).toContain('1.500');
  });

  // Montos con decimales se formatean correctamente
  test('formatea montos con decimales', () => {
    const result = formatCurrency(99.99, 'USD');
    expect(result).toContain('99');
  });

  // --- Casos de error (inputs invalidos) ---

  // Input no numerico lanza error
  test('lanza error si el monto no es numero', () => {
    expect(() => formatCurrency('mil')).toThrow('El monto debe ser un numero');
  });

  // Null lanza error
  test('lanza error con null', () => {
    expect(() => formatCurrency(null)).toThrow('El monto debe ser un numero');
  });

  // Undefined lanza error
  test('lanza error con undefined', () => {
    expect(() => formatCurrency(undefined)).toThrow('El monto debe ser un numero');
  });
});
