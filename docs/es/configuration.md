# Guía de Configuración

Referencia completa de todas las opciones de configuración de WAH.

## Configuración básica

```javascript
import { runWAH } from 'web-audit-helper';

await runWAH({
  logs: true,
  logLevel: 'full',
  issueLevel: 'all',
  locale: 'es',
  accessibility: {
    minFontSize: 12,
    contrastLevel: 'AA'
  },
  overlay: {
    enabled: true,
    position: 'bottom-right',
    theme: 'auto',
    hide: 0
  }
});
```

## Referencia completa de configuración

### Opciones de nivel raíz

| Opción        | Tipo                                | Default  | Descripción                                                  |
| ------------- | ----------------------------------- | -------- | ------------------------------------------------------------ |
| `logs`        | `boolean`                           | `true`   | Activar/desactivar el logging de resultados en consola       |
| `logLevel`    | `'full' \| 'summary' \| 'none'`    | `'full'` | Verbosidad de salida en consola                              |
| `issueLevel`  | `'critical' \| 'warnings' \| 'all'`| `'all'`  | Filtra qué severidades reportar                              |
| `locale`      | `'en' \| 'es'`                      | auto     | Idioma de mensajes para usuario (si no se define, autodetecta) |
| `scoringMode` | `'strict' \| 'normal' \| 'moderate' \| 'soft' \| 'custom'` | `'normal'` | Perfil de scoring y modo de análisis de visibilidad DOM |

### Resolucion y persistencia de locale

- `runWAH({ locale })` tiene la prioridad mas alta.
- Si no se define locale en config, WAH usa el idioma persistido desde Settings (pagina 2).
- Si no existe idioma persistido, WAH autodetecta el navegador (`es*` -> `es`, cualquier otro -> `en`).

Notas:
- El titulo principal del overlay se mantiene siempre como `WAH Report`.
- El titulo del reporte visible para usuario se mantiene como `Web Audit Helper Report`.
- El export JSON se mantiene en ingles para integraciones.

### Opciones de accesibilidad

```javascript
accessibility: {
  // Tamaño mínimo de fuente en píxeles (advierte si está por debajo)
  minFontSize: 12,           // default: 12

  // Nivel WCAG requerido para contraste
  contrastLevel: 'AA',       // 'AA' o 'AAA' (default: 'AA')

  // Opcional: ratio mínimo de contraste personalizado
  minContrastRatio: 4.5,     // default: 4.5 para AA, 7 para AAA

  // Opcional: line-height mínimo
  minLineHeight: 1.4         // default: 1.4
}
```

### Opciones del overlay

```javascript
overlay: {
  // Mostrar/ocultar la interfaz visual flotante
  enabled: true,             // default: true

  // Posición del overlay en pantalla
  position: 'bottom-right',  // 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'
                // default: 'bottom-right'

  // Tema visual
  theme: 'auto',             // 'auto' | 'dark' | 'light' (default UI: auto)

  // Ocultar overlay por X milisegundos al cargar
  hide: 0,                   // 0 = mostrar inmediatamente (default: 0)
                // 300000 = ocultar 5 minutos
                // -1 = ocultar hasta refrescar página
}
```

### Opciones de calidad (opcionales)

```javascript
quality: {
  // Umbral para detección de estilos inline
  inlineStylesThreshold: 10  // advierte si hay >10 elementos (default: 10)
}
```

## Presets de configuración

### Desarrollo (recomendado)

```javascript
await runWAH({
  logs: true,
  logLevel: 'full',
  issueLevel: 'all',
  locale: 'es',
  accessibility: {
    minFontSize: 12,
    contrastLevel: 'AA'
  },
  overlay: {
    enabled: true,
    position: 'bottom-right'
  }
});
```

### Modo estricto

```javascript
await runWAH({
  logs: true,
  logLevel: 'full',
  issueLevel: 'critical',  // Solo incidencias críticas
  accessibility: {
    minFontSize: 14,      // Más estricto
    contrastLevel: 'AAA'  // Contraste más estricto
  }
});
```

### Modo CI/CD

```javascript
await runWAH({
  logs: false,              // Sin salida en consola
  logLevel: 'none',
  issueLevel: 'critical',   // Solo incidencias críticas
  overlay: {
    enabled: false        // No mostrar overlay
  }
});
```

### Enfocado en rendimiento

```javascript
await runWAH({
  logs: true,
  logLevel: 'summary',      // Menos verboso
  issueLevel: 'warnings',   // Omite recomendaciones
  accessibility: {
    minFontSize: 14,
    contrastLevel: 'AA'
  },
  overlay: {
    enabled: true
  }
});
```

## Configuración de scoring

WAH aplica distintos multiplicadores según configuración:

- **strict**: 25/10/5 (critical/warning/recommendation)
- **normal**: 20/8/4 (por defecto)
- **moderate**: 20/8/0 (ignora recomendaciones)
- **soft**: 20/0/0 (solo críticas)
- **custom**: filtros definidos por usuario

El `scoringMode` puede cambiarse desde la UI del overlay después de inicializar (o pasarse directamente en config).

### Comportamiento de visibilidad DOM por scoring mode

- **strict**: analiza el DOM completo, incluyendo variantes ocultas.
- **normal / moderate / soft / custom**: analiza solo elementos perceptibles.

El filtrado de elementos perceptibles excluye elementos ocultos por mecanismos comunes como:

- `display: none`
- `visibility: hidden`
- `opacity: 0`
- `[hidden]`
- `[inert]`
- `aria-hidden="true"`

## Configuración por entorno

### Desarrollo

```javascript
if (process.env.NODE_ENV === 'development') {
  await runWAH({
    logs: true,
    logLevel: 'full',
    locale: 'es',
    overlay: { enabled: true }
  });
}
```

### Staging

```javascript
if (process.env.NODE_ENV === 'staging') {
  await runWAH({
    logs: true,
    logLevel: 'summary',
    overlay: { enabled: true }
  });
}
```

### Producción

```javascript
if (process.env.NODE_ENV === 'production') {
  // Normalmente desactivado en producción, pero puede habilitarse para pruebas:
  // await runWAH({
  //   logs: false,
  //   overlay: { enabled: false }
  // });
}
```

## Manejo de errores

```javascript
try {
  const result = await runWAH({
    /* config */
  });

  if (result.score < 50) {
    console.warn('Se detectaron problemas críticos de accesibilidad');
  }
} catch (error) {
  console.error('WAH encontró un error:', error);
}
```

## Definiciones de tipo

```typescript
import type { WAHConfig } from 'web-audit-helper';

const config: WAHConfig = {
  logs: true,
  logLevel: 'full',
  issueLevel: 'all',
  locale: 'es',
  accessibility: {
    minFontSize: 12,
    contrastLevel: 'AA'
  },
  overlay: {
    enabled: true,
    position: 'bottom-right',
    theme: 'auto',
    hide: 0
  },
  quality: {
    inlineStylesThreshold: 10
  }
};

await runWAH(config);
```

## FAQ

**P: ¿Cómo desactivo el overlay pero mantengo los logs en consola?**
```javascript
await runWAH({
  logs: true,
  overlay: { enabled: false }
});
```

**P: ¿Puedo cambiar la configuración después de inicializar?**
R: No. Configura antes de llamar `runWAH()`. Para re-ejecutar con otra configuración, usa `__WAH_RERUN__()` y vuelve a llamar `runWAH()`.

**P: ¿Cuál es la diferencia entre `logLevel` y `issueLevel`?**
- `logLevel`: controla la verbosidad de salida en consola (`full/summary/none`).
- `issueLevel`: filtra qué severidades se reportan (`critical/warnings/all`).

**P: ¿Debería usar contraste AAA?**
R: AA (4.5:1) cubre la mayoría de casos. AAA (7:1) se recomienda para texto de cuerpo en aplicaciones críticas.

**P: ¿Puedo ocultar datos sensibles en reportes exportados?**
R: Actualmente no, pero puedes usar `logLevel: 'none'` y evitar compartir salida de consola.