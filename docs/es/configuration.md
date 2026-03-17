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

- `logs`
  Tipo: `boolean`
  Default: `true`
  Descripción: Activar/desactivar el logging de resultados en consola.

- `logLevel`
  Tipo: `'full' | 'summary' | 'none'`
  Default: `'full'`
  Descripción: Verbosidad de salida en consola.

- `issueLevel`
  Tipo: `'critical' | 'warnings' | 'all'`
  Default: `'all'`
  Descripción: Filtra qué severidades reportar.

- `locale`
  Tipo: `'en' | 'es'`
  Default: `auto`
  Descripción: Idioma de mensajes para usuario (si no se define, autodetecta).

- `scoringMode`
  Tipo: `'strict' | 'normal' | 'moderate' | 'soft' | 'custom'`
  Default: `'normal'`
  Descripción: Perfil de scoring y modo de análisis de visibilidad DOM.

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

## Inteligencia de reglas

### Deshabilitar reglas por ID

Cualquier regla puede deshabilitarse completamente pasando `'off'` como valor. Una regla desactivada se salta en tiempo de ejecución — no se ejecuta y su conteo queda reflejado en `AuditMetrics.skippedRules`.

```javascript
await runWAH({
  rules: {
    'ACC-02': 'off',    // Desactiva la verificación de alt text
    'SEO-05': 'off',    // Desactiva la verificación de canonical
    'PERF-06': 'off'    // Desactiva la verificación de cabeceras de caché
  }
});
```

### Overrides de severidad

Puedes cambiar la severidad de cualquier regla sin desactivarla. La regla se ejecuta con normalidad — WAH reemplaza la severidad en todos los issues devueltos antes del cálculo de score y el filtrado por `issueLevel`.

**Forma string (la más común):**

```javascript
await runWAH({
  rules: {
    'PERF-01': 'recommendation',    // Downgrade: era warning, ahora recommendation
    'SEO-02': 'critical',           // Upgrade: era warning, ahora critical
    'ACC-13': 'warning'             // Upgrade: era recommendation, ahora warning
  }
});
```

**Forma objeto (permite combinarlo con threshold):**

```javascript
await runWAH({
  rules: {
    'ACC-10': { severity: 'warning' }   // equivalente a la forma string 'warning'
  }
});
```

Valores válidos de severidad: `'critical'` | `'warning'` | `'recommendation'` | `'off'`

> **Nota**: Usar `{ severity: 'off' }` o el string `'off'` tiene el mismo efecto: deshabilitar la regla.

### Thresholds por regla

Las siguientes reglas exponen un threshold numérico configurable:

| ID Regla | Controla | Unidad | Reemplaza |
| ---------- | ---------- | -------- | ----------- |
| `ACC-22` | Tamaño mínimo de fuente | píxeles | `accessibility.minFontSize` |
| `ACC-25` | Ratio mínimo de contraste | ratio | derivado de `contrastLevel` (4.5 / 7) |
| `ACC-26` | Line-height mínimo | valor sin unidad | `accessibility.minLineHeight` |
| `UX-01` | Tamaño mínimo de touch target | píxeles | `quality.minTouchSize` |
| `ACC-21` | Elementos interactivos muestreados para focus-visibility | cantidad de elementos | - |
| `RWD-01` | Ancho mínimo marcado como riesgo de fixed-width | píxeles | - |
| `RWD-04` | Ratio mínimo de alto de viewport para fixed/sticky overlap | ratio (0-1) | - |
| `PERF-02` | Máximo de recursos de fuentes antes de warning | cantidad de recursos | - |
| `PERF-03` | Máximo de scripts externos antes de warning | cantidad de scripts | - |
| `PERF-06` | Mínimo de recursos estáticos que dispara recordatorio de caché | cantidad de recursos | - |
| `PERF-08` | Imágenes muestreadas para analizar formato moderno | cantidad de imágenes | - |

```javascript
await runWAH({
  rules: {
    'ACC-22': { threshold: 16 },    // Exige fuente >= 16px
    'ACC-25': { threshold: 5.0 },   // Exige ratio de contraste >= 5.0
    'ACC-26': { threshold: 1.5 },   // Exige line-height >= 1.5
    'UX-01':  { threshold: 48 },    // Exige touch targets >= 48px
    'RWD-01': { threshold: 1024 },  // Reporta solo anchos > 1024px
    'RWD-04': { threshold: 0.25 },  // Reporta overlap fixed/sticky a partir de 25% del viewport
    'PERF-02': { threshold: 2 },    // Permite como maximo 2 recursos de fuentes
    'PERF-03': { threshold: 8 },    // Permite como maximo 8 scripts externos
    'PERF-06': { threshold: 10 },   // Solo dispara si hay >10 recursos estaticos
    'PERF-08': { threshold: 150 },  // Inspecciona las primeras 150 imagenes
    'ACC-21': { threshold: 60 }     // Inspecciona los primeros 60 elementos interactivos
  }
});
```

### Reglas costosas y ajuste de performance

Algunas heurísticas pesan mas en paginas grandes (escaneos de layout/computed-style o recorridos amplios del DOM). Usa thresholds por regla y overrides con `off` para mantener tiempos de auditoría predecibles.

Controles mas relevantes:

| ID Regla | Por qué puede ser costosa | Ajuste recomendado |
| ---------- | --------------------------- | -------------------- |
| `ACC-21` | Checks de computed-style sobre elementos interactivos | Baja el threshold para reducir muestra (por ejemplo `40-80`) |
| `ACC-25` | Calculo de contraste en nodos de texto visibles | Mantener por defecto salvo necesidad; ya muestrea hasta 100 elementos |
| `ACC-26` | Check de line-height computado en contenedores de texto | Mantener por defecto salvo necesidad; ya muestrea hasta 100 elementos |
| `RWD-01` | Recorrido amplio de elementos con parseo de width | Sube el threshold para reducir ruido en layouts pesados |
| `RWD-04` | Escaneo de elementos fixed/sticky + chequeos de geometría | Sube el ratio (por ejemplo `0.22-0.3`) para enfocarte en solapamientos de alto impacto |
| `PERF-08` | Recorrido de imagenes en paginas con mucho contenido multimedia | Baja el threshold (por ejemplo `100-200`) |

Si necesitas limites estrictos de tiempo para CI o demos, combina ajuste y desactivación selectiva:

```javascript
await runWAH({
  rules: {
    'ACC-21': { threshold: 50 },
    'RWD-04': { threshold: 0.25 },
    'PERF-08': { threshold: 120 },
    'PERF-06': 'off'
  }
});
```

Threshold y severidad pueden combinarse en la misma regla:

```javascript
await runWAH({
  rules: {
    'ACC-22': { severity: 'critical', threshold: 16 },        // Override de threshold Y severidad
    'UX-01':  { severity: 'recommendation', threshold: 40 }   // Más laxo + severidad bajada
  }
});
```

### Referencia de IDs de reglas

Todos los IDs estables están disponibles en `RULE_IDS` (exportado del paquete para usuarios de TypeScript):

```typescript
import { RULE_IDS } from 'web-audit-helper';

await runWAH({
  rules: {
    [RULE_IDS.accessibility.imgMissingAlt]: 'off',
    [RULE_IDS.accessibility.textTooSmall]: { threshold: 16 }
  }
});
```

O usa los string literals directamente — los IDs son estables entre versiones menores:

```text
Accesibilidad: ACC-01 – ACC-29
SEO:           SEO-01 – SEO-08
Semántica:     SEM-01 – SEM-07
Responsive:    RWD-01 – RWD-05
Seguridad:     SEC-01
Calidad:       HTML-01, HTML-02, QLT-01, QLT-02, UX-01
Performance:   IMG-01 – IMG-03, MEDIA-01, PERF-01 – PERF-08
Formularios:   FORM-01 – FORM-04
```

---

## Preset de salida en consola

La opción `consoleOutput` selecciona un preset que controla todo el comportamiento de salida en consola como una sola elección coherente. Puede configurarse en código o cambiarse interactivamente desde el overlay de Settings (se persiste en `localStorage`).

```javascript
await runWAH({
  consoleOutput: 'standard'   // 'none' | 'minimal' | 'standard' | 'detailed' | 'debug'
});
```

| Nivel | Descripción |
| ------- | ------------- |
| `'none'` | Desactiva toda salida de auditoría. Solo aparecen avisos esenciales de hide/reset de WAH |
| `'minimal'` | Solo resumen compacto: contexto de pantalla, score e issue count |
| `'standard'` | Tabla única de issues ordenada por severidad (sin agrupación por categoría) |
| `'detailed'` | Issues agrupados por categoría + resumen estadístico |
| `'debug'` | Todo lo de Detailed más desglose de score, timestamps y métricas por regla |

> Cada preset configura `logLevel`, `logging`, `scoreDebug` y `auditMetrics` como unidad. Si pasas `consoleOutput`, esos campos individuales son sobreescritos por el preset.

### Métricas de performance del audit

Controladas por `auditMetrics` (o automáticamente por el preset de consola `debug`):

```javascript
await runWAH({
  auditMetrics: {
    enabled: true,                // Registrar tiempo total + por regla (default: true)
    includeInReports: true,       // Incluir sección de métricas en exports JSON/TXT/HTML (default: false)
    consoleTopSlowRules: 5,       // Mostrar top N reglas más lentas en consola (default: 10)
    consoleMinRuleMs: 1           // Ms mínimos que debe tardar una regla para aparecer (default: 0)
  }
});
```

El `AuditResult` devuelto por `runWAH()` siempre contiene un objeto `metrics` cuando `enabled: true`:

```typescript
const result = await runWAH({ auditMetrics: { enabled: true } });
console.log(result.metrics?.totalMs);        // Tiempo total de auditoría en ms
console.log(result.metrics?.executedRules);  // Reglas que se ejecutaron
console.log(result.metrics?.skippedRules);   // Reglas desactivadas por overrides
console.log(result.metrics?.ruleTimings);    // Array de tiempos por regla
```

### Depuración de score

```javascript
await runWAH({ scoreDebug: true });
```

Cuando está activado, la salida de consola incluye un desglose detallado del cálculo del score: scores por categoría, multiplicadores, conteo de reglas y contribuciones ponderadas.

### Opciones de logging avanzado

```javascript
await runWAH({
  logging: {
    timestamps: true,           // Incluir timestamps en los logs de consola
    groupByCategory: true,      // Agrupar issues por bloque de categoría en lugar de tabla plana
    showStatsSummary: true,     // Mostrar tablas estadísticas (distribución de severidad, breakdown por categoría)
    useIcons: true              // Añadir iconos visuales a severidades y categorías (🔴 ⚠️ 💡)
  }
});
```

> Estas opciones son más útiles al usar `consoleOutput: 'none'` o construir un pipeline de salida propio. Para uso típico, el preset `consoleOutput` es el enfoque recomendado.

---

## Definiciones de tipo

```typescript
import type { WAHConfig } from 'web-audit-helper';

const config: WAHConfig = {
  logs: true,
  consoleOutput: 'standard',
  issueLevel: 'all',
  locale: 'es',
  rules: {
    'ACC-02': 'off',
    'ACC-22': { severity: 'critical', threshold: 16 }
  },
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
  },
  auditMetrics: {
    enabled: true,
    includeInReports: false
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

**P: ¿Cuál es la diferencia entre `consoleOutput` y `logLevel`?**
R: `consoleOutput` es el preset de alto nivel recomendado (`none/minimal/standard/detailed/debug`). Configura `logLevel`, `logging`, `scoreDebug` y `auditMetrics` juntos como unidad. Para uso típico, usa `consoleOutput`. `logLevel` es un campo de bajo nivel que `consoleOutput` sobreescribe.

**P: ¿Puedo desactivar una regla solo para una página?**
R: Sí — pasa `rules: { 'RULE-ID': 'off' }` al llamar `runWAH()`. Como WAH corre por page-load, esto queda naturalmente acotado a esa ejecución.

**P: ¿Los overrides de severidad afectan al score?**
R: Sí. La severidad sobreescrita se usa en todas partes: cálculo de score, filtrado por `issueLevel`, visualización en el overlay y reportes.

**P: ¿Debería usar contraste AAA?**
R: AA (4.5:1) cubre la mayoría de casos. AAA (7:1) se recomienda para texto de cuerpo en aplicaciones críticas.

**P: ¿Puedo ocultar datos sensibles en reportes exportados?**
R: Actualmente no, pero puedes usar `consoleOutput: 'none'` y `auditMetrics: { includeInReports: false }` para minimizar la salida.
