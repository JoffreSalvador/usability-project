// lighthouserc.js - Configuración para auditoría de ACCESIBILIDAD
module.exports = {
  ci: {
    collect: {
      // URLs de tu proyecto a auditar
      url: [
        'http://localhost:8080/index.html',
        'http://localhost:8080/pages/dashboard.html',
        'http://localhost:8080/pages/games.html',
        'http://localhost:8080/pages/about.html',
        'http://localhost:8080/pages/features.html',
        'http://localhost:8080/pages/login.html',
        'http://localhost:8080/pages/register.html',
        // Juegos específicos
        'http://localhost:8080/pages/vocabulary-game.html',
        'http://localhost:8080/pages/listening-game.html',
        'http://localhost:8080/pages/video-game.html',
        // Página de resumen de usabilidad
        'http://localhost:8080/pages/resumen-usabilidad.html'
      ],
      settings: {
        // SOLO AUDITORÍA DE ACCESIBILIDAD
        onlyCategories: ['accessibility'],
        // Configuración de dispositivo
        formFactor: 'desktop',
        screenEmulation: {
          mobile: false,
          width: 1350,
          height: 940,
          deviceScaleFactor: 1,
          disabled: false,
        },
        // Configuración específica para accesibilidad
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
          requestLatencyMs: 0,
          downloadThroughputKbps: 0,
          uploadThroughputKbps: 0,
        }
      }
    },
    assert: {
      assertions: {
        // PUNTAJE MÍNIMO DE ACCESIBILIDAD (90%)
        'categories:accessibility': ['error', { minScore: 0.9 }],
        
        // AUDITORÍAS ESPECÍFICAS DE ACCESIBILIDAD (CRÍTICAS)
        'color-contrast': 'error',              // Contraste de colores
        'image-alt': 'error',                   // Texto alternativo en imágenes
        'label': 'error',                       // Labels en formularios
        'link-name': 'error',                   // Nombres accesibles en links
        'button-name': 'error',                 // Nombres accesibles en botones
        'aria-roles': 'error',                  // Roles ARIA válidos
        'aria-valid-attr': 'error',             // Atributos ARIA válidos
        'aria-required-attr': 'error',          // Atributos ARIA requeridos
        
        // AUDITORÍAS IMPORTANTES (WARNINGS)
        'heading-order': 'warn',                // Orden de headings (h1, h2, h3...)
        'landmark-one-main': 'warn',            // Landmark main
        'page-has-heading-one': 'warn',         // Página tiene h1
        'bypass': 'warn',                       // Skip links
        'focus-traps': 'warn',                  // Trampas de foco en modals
        'focusable-controls': 'warn',           // Controles enfocables
        'interactive-element-affordance': 'warn', // Elementos interactivos claros
        'logical-tab-order': 'warn'             // Orden lógico de tabulación
      }
    },
    upload: {
      // Almacenamiento temporal (30 días)
      target: 'temporary-public-storage'
    }
  }
};
