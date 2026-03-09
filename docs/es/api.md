# Referencia de API

Referencia completa de la API pública de WAH.

## Punto de entrada principal

### `runWAH(userConfig?: Partial<WAHConfig>): Promise<AuditResult>`

Ejecuta la auditoría completa e inicializa el overlay.

**Parámetros:**
- `userConfig` (opcional): configuración parcial para sobrescribir valores por defecto.

**Retorna:**
- `Promise<AuditResult>` que contiene el arreglo de incidencias y la puntuación general.

**Ejemplo:**
```javascript
import { runWAH } from 'web-audit-helper';

const result = await runWAH({
	logs: true,
	logLevel: 'full',
	overlay: { enabled: true }
});

console.log(`Puntuacion de auditoria: ${result.score}%`);
console.log(`Se encontraron ${result.issues.length} incidencias`);
```

---

## Comandos globales de consola

### `__WAH_FOCUS_ISSUE__(index: number): AuditIssue | null`

Enfoca una incidencia específica resaltando su elemento del DOM.

**Parámetros:**
- `index`: índice de incidencia de la tabla en consola.

**Retorna:**
- Objeto de incidencia o `null` si no se encuentra.

**Ejemplo:**
```javascript
__WAH_FOCUS_ISSUE__(0)  // Resalta la primera incidencia
__WAH_FOCUS_ISSUE__(5)  // Resalta la sexta incidencia
```

### `__WAH_RESET_HIDE__(): void`

Limpia el estado de ocultamiento y recarga el overlay.

**Ejemplo:**
```javascript
__WAH_RESET_HIDE__()  // Restaurar overlay si está oculto
```

### `__WAH_RERUN__(): void`

Re-ejecuta la auditoría después de cambios en el DOM.

**Ejemplo:**
```javascript
// Realiza cambios en el DOM
document.querySelector('img').setAttribute('alt', 'Corregido');

// Re-ejecuta auditoría
__WAH_RERUN__()
```

---

## Tipos

### `AuditIssue`

Incidencia individual detectada en la auditoría.

```typescript
interface AuditIssue {
	rule: string;              // "ACC-02", "SEO-01", etc.
	message: string;           // "Image missing alt"
	severity: Severity;        // "critical" | "warning" | "recommendation"
	category?: IssueCategory;  // "accessibility", "seo", etc.
	selector?: string;         // Selector CSS: "html > body > img:nth-of-type(1)"
	element?: HTMLElement;     // Referencia al elemento DOM
}
```

### `AuditResult`

Resultado completo de auditoría.

```typescript
interface AuditResult {
	issues: AuditIssue[];      // Todas las incidencias detectadas
	score: number;             // Puntuación global 0-100
}
```

### `WAHConfig`

Opciones de configuración pasadas a `runWAH()`.

```typescript
interface WAHConfig {
	// Logging de consola
	logs?: boolean;                    // Activar/desactivar logs
	logLevel?: 'full' | 'summary' | 'none';  // Verbosidad de consola

	// Idioma de salida para usuario
	locale?: 'en' | 'es';

	// Filtrado de incidencias
	issueLevel?: 'critical' | 'warnings' | 'all';

	// Ajustes de accesibilidad
	accessibility?: {
		minFontSize?: number;            // Tamaño mínimo de fuente (default: 12)
		contrastLevel?: 'AA' | 'AAA';    // Nivel WCAG (default: 'AA')
		minContrastRatio?: number;       // Ratio de contraste personalizado
		minLineHeight?: number;          // Interlineado mínimo (default: 1.4)
	};

	// UI del overlay
	overlay?: {
		enabled?: boolean;               // Mostrar overlay (default: true)
		position?: string;               // Posición en pantalla
		theme?: 'auto' | 'dark' | 'light';
		hide?: number;                   // Duración de ocultamiento en ms
	};

	// Ajustes de calidad
	quality?: {
		inlineStylesThreshold?: number;  // Umbral de advertencia (default: 10)
	};
}
```

### `Severity`

Nivel de severidad de incidencia.

```typescript
type Severity = 'critical' | 'warning' | 'recommendation';
```

### `IssueCategory`

Categoría de incidencia de auditoría.

```typescript
type IssueCategory =
	| 'accessibility'
	| 'semantic'
	| 'seo'
	| 'responsive'
	| 'security'
	| 'quality'
	| 'performance'
	| 'form';
```

### `LogLevel`

Nivel de verbosidad de salida en consola.

```typescript
type LogLevel = 'full' | 'summary' | 'none';
```

### `ScoringMode`

Modo de cálculo de puntuación.

```typescript
type ScoringMode = 'strict' | 'normal' | 'moderate' | 'soft' | 'custom';
```

---

## Ejemplos de uso

### Configuración por defecto

```javascript
import { runWAH } from 'web-audit-helper';

// Ejecuta con ajustes por defecto
await runWAH();
```

### Configuración personalizada

```javascript
import { runWAH } from 'web-audit-helper';

const result = await runWAH({
	logs: true,
	logLevel: 'full',
	issueLevel: 'all',
	locale: 'es',
	accessibility: {
		minFontSize: 14,
		contrastLevel: 'AAA'
	},
	overlay: {
		enabled: true,
		position: 'top-right',
		hide: 0
	}
});
```

### Acceso a resultados

```javascript
const result = await runWAH();

// Puntuación global
console.log(`Score: ${result.score}%`);

// Total de incidencias
console.log(`Issues: ${result.issues.length}`);

// Solo incidencias críticas
const criticalIssues = result.issues.filter(i => i.severity === 'critical');
console.log(`Critical: ${criticalIssues.length}`);

// Por categoría
const accessibilityIssues = result.issues.filter(i => i.category === 'accessibility');
console.log(`Accessibility issues: ${accessibilityIssues.length}`);
```

### Lógica condicional

```javascript
const result = await runWAH();

if (result.score < 50) {
	console.error('Se detectaron problemas críticos de calidad');
	// Fallar CI/CD
	process.exit(1);
} else if (result.score < 70) {
	console.warn('Hay incidencias de calidad que requieren atención');
} else {
	console.log('Buena puntuación');
}
```

### Integración con CI/CD

```javascript
import { runWAH } from 'web-audit-helper';

async function auditPage() {
	const result = await runWAH({
		logs: false,            // Sin ruido en consola
		logLevel: 'none',
		issueLevel: 'critical', // Solo incidencias críticas
		overlay: {
			enabled: false       // Sin UI en CI
		}
	});

	// Reporte
	console.log(`Audit Score: ${result.score}%`);

	// Fallar si hay demasiadas incidencias críticas
	const criticalCount = result.issues.filter(i => i.severity === 'critical').length;
	if (criticalCount > 5) {
		throw new Error(`Demasiadas incidencias críticas: ${criticalCount}`);
	}
}

await auditPage();
```

### Cálculo programático de reporte

```javascript
const result = await runWAH();

// Construir reporte personalizado
const report = {
	score: result.score,
	timestamp: new Date(),
	issues: result.issues,
	summary: {
		critical: result.issues.filter(i => i.severity === 'critical').length,
		warnings: result.issues.filter(i => i.severity === 'warning').length,
		recommendations: result.issues.filter(i => i.severity === 'recommendation').length
	}
};

// Guardar en base de datos
await saveAuditReport(report);
```

### Configuración por entorno

```javascript
const isDev = process.env.NODE_ENV === 'development';

await runWAH({
	logs: isDev,
	logLevel: isDev ? 'full' : 'none',
	overlay: {
		enabled: isDev,
		position: 'bottom-right'
	}
});
```

---

## No expuesto actualmente

Los siguientes componentes son detalles internos de implementación y no forman parte de la API pública:

- Funciones individuales de reglas (`checkMissingAlt`, etc.)
- Funciones de cálculo de scoring
- Internals de componentes del overlay
- Funciones de serialización de reportes
- Gestión de estado/localStorage

Usa solo la API pública documentada para mantener estabilidad entre versiones.

---

## Soporte de navegadores

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Requiere soporte ES2019 (async/await nativo, Promise, etc.).

---

## Manejo de errores

WAH no lanza errores en operación normal. Las incidencias se capturan como objetos `AuditIssue` en el resultado.

```javascript
try {
	const result = await runWAH();
	// Manejar resultado
} catch (error) {
	// Manejar errores inesperados (deberían ser raros)
	console.error('WAH encontró un error:', error);
}
```

---

## Versionado

WAH sigue versionado semántico:
- **MAJOR**: cambios incompatibles de API
- **MINOR**: nuevas funcionalidades (compatibles hacia atrás)
- **PATCH**: corrección de bugs

La API pública documentada aquí es estable dentro de la misma versión MAJOR.