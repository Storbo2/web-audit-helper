# Guía de Arquitectura

Visión general del diseño del sistema WAH y organización de módulos.

## Arquitectura del sistema

```text
┌─────────────────────────────────┐
│     Entorno de navegador        │
│   (DOM, CSS, APIs JavaScript)   │
└────────────┬────────────────────┘
    │
  ┌───────┴────────┐
  │    Núcleo WAH  │
  └───────┬────────┘
    │
 ┌────────┴─────────┐
 │                  │
 ▼                  ▼
┌──────────────┐  ┌──────────────┐
│ Motor Reglas │  │ Motor Scoring│
│  (60+ reglas)│  │              │
└──────┬───────┘  └──────┬───────┘
    │                 │
    └────────┬────────┘
    │
  ┌───────▼────────┐
  │  AuditResult   │
  │ (issues +      │
  │ score/grade)   │
  └───────┬────────┘
    │
 ┌───────────┴───────────┐
 │                       │
 ▼                       ▼
┌─────────────┐      ┌──────────────┐
│ Overlay UI  │      │  Reporters   │
│(drag, hide) │      │ (JSON/TXT/   │
└─────────────┘      │  HTML)       │
      └──────────────┘
```

## Organización de módulos

### Módulo Core (`src/core/`)

**Responsabilidad**: lógica del motor de auditoría.

**Estructura**:

```text
src/core/
├── index.ts           # Export principal runCoreAudit()
├── types.ts           # Definiciones de tipos (IssueCategory, Severity, etc.)
├── scoring.ts         # Algoritmo de cálculo de score
├── config/
│   ├── registry.ts    # Registro de reglas - agrega todas las reglas
│   └── ruleIds.ts     # Constantes de Rule ID (ACC-01, SEO-05, etc.)
└── rules/
 ├── index.ts       # Re-exporta todas las reglas
 ├── accessibility/ # 26 reglas de accesibilidad
 │   ├── aria.ts
 │   ├── buttons.ts
 │   ├── forms.ts
 │   ├── media.ts
 │   ├── text.ts
 │   └── ...
 ├── semantic.ts    # 7 reglas semánticas
 ├── seo.ts         # 8 reglas SEO
 ├── responsive.ts  # 5 reglas responsive
 ├── security.ts    # 1 regla seguridad
 ├── quality.ts     # 2 reglas calidad
 ├── performance.ts # 10 reglas rendimiento
 └── form.ts        # 4 reglas formularios
```

**Funciones clave**:

- `runCoreAudit(config, options?)`: ejecuta todas las reglas y puede usar un registro de reglas inyectado.
- `computeScore(issues)`: calcula score global en base a severidad y multiplicadores.
- `computeCategoryScores(issues)`: calcula score por categoría.

### Módulo Overlay (`src/overlay/`)

**Responsabilidad**: componentes UI y lógica de interacción visual.

**Estructura**:

```text
src/overlay/
├── Overlay.ts         # Ciclo de vida principal del overlay
├── config/
│   ├── settings.ts    # Estado de configuración de usuario
│   ├── hideStore.ts   # Estado de ocultamiento (temporal/hasta refresh)
│   └── settingsStore.ts  # Estado persistente de panel lateral
├── core/
│   ├── renderer.ts    # Generación de HTML para elementos del overlay
│   ├── template.ts    # Plantillas y estructura HTML
│   ├── utils.ts       # Utilidades DOM y selectores
│   ├── styles.ts      # Estilos CSS-in-JS
│   └── wahCss.ts      # Hoja de estilos WAH
├── interactions/
│   ├── drag.ts        # Funcionalidad drag & drop
│   ├── highlight.ts   # Resaltado de elementos con incidencias
│   └── position.ts    # Lógica de posicionamiento del overlay
└── popover/
 ├── Popover.ts     # Componente principal de popovers
 ├── utils.ts       # Utilidades de popover
 └── components/
  ├── Filters.ts
  ├── Settings.ts
  ├── UI.ts
  ├── Export.ts
  └── index.ts
```

**Responsabilidades clave**:

- Crear overlay flotante con badge de score.
- Gestionar render y filtros de incidencias.
- Manejar interacciones (drag, click, filtros).
- Gestionar subpaneles popover.
- Exportar reportes en múltiples formatos.
- Ocultar temporalmente overlay.

### Módulo Reporters (`src/reporters/`)

**Responsabilidad**: generar y serializar reportes de auditoría.

**Estructura**:

```text
src/reporters/
├── index.ts           # Export principal
├── auditReport.ts     # Lógica de construcción de reportes
├── builder.ts         # Helpers para crear objetos de reporte
├── serializers.ts     # Serialización a JSON, TXT, HTML
├── utils.ts           # Utilidades de formateo
├── jsonReporter.ts    # Lógica específica JSON
├── textReporter.ts    # Lógica específica TXT
└── constants.ts       # Tokens, fixes y descripciones de reglas
```

**Funciones clave**:

- `buildAuditReport(result, config?, registry?)`: crea objeto de reporte estructurado y puede resolver metadata de reglas custom.
- `serializeReportToJSON(report)`: exporta a JSON.
- `serializeReportToTXT(report)`: exporta a texto.
- `serializeReportToHTML(report)`: exporta a HTML.

**Formato de reporte**:

```json
{
 "meta": {
  "url": "...",
  "date": "2026-03-01T...",
  "viewport": { "width": 1920, "height": 1080 },
  "scoringMode": "normal",
  "appliedFilters": { "severities": [...], "categories": [...] }
 },
 "score": {
  "overall": 75,
  "grade": "C",
  "byCategory": { "accessibility": 65, "seo": 80, ... }
 },
 "categories": [
  {
  "id": "accessibility",
  "title": "Accessibility",
  "score": 65,
  "rules": [
   {
   "id": "ACC-02",
   "title": "Image missing alt",
   "status": "critical",
   "message": "...",
   "fix": "...",
   "elements": [...]
   }
  ]
  }
 ],
 "stats": {
  "failed": 12,
  "warnings": 18,
  "recommendations": 5
 }
}
```

### Módulo Utils (`src/utils/`)

**Responsabilidad**: funciones utilitarias compartidas.

**Estructura**:

```text
src/utils/
├── dom.ts             # Helpers DOM (getCssSelector, etc.)
├── breakpoints.ts     # Información de breakpoints y viewport
├── i18n.ts            # Traducciones UI/consola/reportes
└── consoleLogger.ts   # Formateo de consola y logging
```

## Flujo de datos

### Flujo de ejecución de reglas

```text
runCoreAudit()
  ├── Instancia cada regla
  │   (ej.: checkMissingAlt, checkMissingTitle, etc.)
  │
  ├── Recolecta incidencias
  │   └── Cada issue: { rule, message, severity, category, element, selector }
  │
  └── Retorna AuditResult
   ├── issues: AuditIssue[]
   └── score: number
```

### Flujo de scoring

```text
computeScore(issues)
  ├── filterIssuesForScoring()
  │   └── Aplica filtros custom si mode='custom'
  │
  ├── getAdjustedMultipliers()
  │   └── Retorna pesos por severidad (critical/warning/recommendation)
  │
  ├── computeCategoryScores()
  │   └── Calcula score por categoría
  │       └── Por categoría: 100 - (critical*mult + warning*mult + ...)
  │
  ├── computeWeightedOverall()
  │   └── Promedio ponderado entre categorías
  │       └── Score = sum(categoryScore * categoryWeight) / totalWeight
  │
  └── Retorna: number (0-100)
```

### Flujo de render UI

```text
createOverlay()
  ├── Render overlay root
  ├── Muestra badge de score
  ├── Crea paneles popover
  │   ├── Filtros (severidad/categoría)
  │   ├── Settings
  │   ├── Export (JSON/TXT/HTML)
  │   └── UI (tema/opacidad/acento)
  │
  ├── Render lista de incidencias
  │   └── Filtrable por severidad y categoría
  │
  ├── Adjunta event listeners
  │   ├── Drag overlay
  │   ├── Click para foco de issue
  │   ├── Toggles de filtros
  │   └── Botones de export
  │
  └── Maneja interacciones
```

## Algoritmo de scoring

### Cálculo por categoría

Para cada categoría:

```text
1. Cuenta issues critical, warning, recommendation
2. Aplica multiplicadores (según modo)
3. categoryScore = max(0, 100 - (critical*20 + warning*8 + recommendation*4))
```

### Score global ponderado

```text
Pesos:
 accessibility: 0.25
 seo:          0.20
 responsive:   0.15
 semantic:     0.10
 security:     0.10
 quality:      0.10
 performance:  0.05
 form:         0.05

overallScore = sum(categoryScore * weight) / totalWeight
```

### Calibración en filtros custom

Cuando hay 1 categoría activa, los multiplicadores se dividen por 4:

- critical: 20 → 5
- warning: 8 → 2
- recommendation: 4 → 1

Esto evita que el score se hunda con filtros demasiado restrictivos.

## Sistema de tipos

### Tipos principales

```typescript
interface AuditIssue {
 rule: string;
 message: string;
 severity: Severity;
 category?: IssueCategory;
 selector?: string;
 element?: HTMLElement;
}

interface AuditResult {
 issues: AuditIssue[];
 score: number;
}

interface WAHConfig {
 logs: boolean;
 logLevel: LogLevel;
 issueLevel: IssueLevel;
 locale?: 'en' | 'es';
 accessibility: {
  minFontSize: number;
  contrastLevel: ContrastLevel;
 };
 overlay: {
  enabled: boolean;
  position: string;
  theme: 'auto' | 'dark' | 'light';
  hide?: number;
 };
 quality?: {
  inlineStylesThreshold?: number;
 };
}

interface AuditReport {
 meta: ReportMeta;
 score: ReportScore;
 categories: CategoryReport[];
 stats: AuditStats;
}
```

## Consideraciones de rendimiento

### Estrategias de optimización

1. **Muestreo de reglas**: algunas reglas muestrean elementos (por ejemplo, máximo 100 textos para contraste).
2. **Render lazy**: elementos de lista se renderizan cuando corresponde.
3. **Delegación de eventos**: un listener para múltiples nodos donde aplica.
4. **Cacheo DOM**: cache de resultados de querySelector durante ejecución de regla.
5. **Scoring controlado**: recalcular score solo cuando cambian filtros.

### Tamaño de bundle

- **Total**: ~108 KB (minificado)
- **Core**: ~45 KB
- **Overlay**: ~35 KB
- **Reporters**: ~20 KB
- **Utils**: ~8 KB

### Compatibilidad de navegador

- Navegadores modernos con soporte ES2019
- Funciona con APIs DOM estándar (sin shims)
- CSS Grid y Flexbox para layout del overlay

## Puntos de extensión

### Agregar nuevas reglas

Consulta [CONTRIBUTING.md](../CONTRIBUTING.md) para guía detallada.

### Reporters personalizados

Extiende funciones `serializeReportToXYZ()` para crear nuevos formatos de exportación.

### Scoring personalizado

Modifica `computeScore()` o `computeCategoryScores()` para algoritmos alternativos.

## Gestión de estado

### Estado local

- **Overlay Settings**: en `overlaySettingsStore` (en memoria)
- **Hide State**: en `hideStore` (localStorage)
- **UI State**: en componente Overlay (vista actual, paneles expandidos)

### Sin dependencias externas

Toda la gestión de estado es interna (sin Redux, MobX ni librerías similares).

## Estrategia de testing

- **Unit tests**: lógica de reglas (vitest)
- **Integration tests**: cálculo de scoring
- **Component tests**: render e interacciones de overlay
- **E2E tests**: flujo completo de auditoría (futuro)

Consulta `docs/testing.md` para lineamientos de testing.
