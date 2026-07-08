// jest.config.js
// Configuracion de Jest para el proyecto - Workshop DevOps con Kiro

module.exports = {
  // Directorio raiz para buscar tests
  roots: ['<rootDir>/tests'],

  // Patron para encontrar archivos de test
  testMatch: ['**/*.test.js'],

  // Habilitar cobertura por defecto con npm run test:coverage
  coverageDirectory: 'coverage',

  // Archivos a incluir en el reporte de cobertura
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.config.js',
  ],

  // Umbrales minimos de cobertura (falla si no se cumplen)
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },

  // Formato del reporte de cobertura
  coverageReporters: ['text', 'text-summary', 'json-summary', 'lcov'],

  // Entorno de ejecucion
  testEnvironment: 'node',

  // Limpiar mocks automaticamente entre tests
  clearMocks: true,
};
