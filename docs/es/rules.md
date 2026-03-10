# Documentación de Reglas

Referencia completa de las 61 reglas de auditoría implementadas en WAH.

## Reglas de Accesibilidad (26)

### ACC-01: Falta atributo `lang` en HTML

- **Severidad**: Warning
- **Categoría**: Accessibility
- **Descripción**: Verifica que el elemento HTML incluya un atributo `lang` válido para identificación de idioma.
- **Fix**: Define un idioma válido del documento agregando `lang` al elemento html, por ejemplo `<html lang="en">`.
- **WCAG**: 3.1.1 (Nivel A)

### ACC-02: Imagen sin texto alternativo

- **Severidad**: Critical
- **Categoría**: Accessibility
- **Descripción**: Verifica que imágenes significativas incluyan `alt` no vacío.
- **Fix**: Agrega texto `alt` descriptivo para imágenes informativas, o `alt=""` para imágenes decorativas.
- **WCAG**: 1.1.1 (Nivel A)

### ACC-03: Enlace sin nombre accesible

- **Severidad**: Warning
- **Categoría**: Accessibility
- **Descripción**: Verifica que los enlaces expongan texto accesible para lectores de pantalla.
- **Fix**: Asegura que cada enlace tenga un nombre accesible mediante texto visible, `aria-label` o contenido etiquetado.
- **WCAG**: 1.1.1 (Nivel A)

### ACC-04: Botón sin nombre accesible

- **Severidad**: Warning
- **Categoría**: Accessibility
- **Descripción**: Verifica que los botones expongan nombre accesible.
- **Fix**: Da a los botones un nombre accesible con texto, `aria-label` o `aria-labelledby`.
- **WCAG**: 1.1.1 (Nivel A)

### ACC-05: Control de formulario sin ID o Name

- **Severidad**: Critical
- **Categoría**: Accessibility
- **Descripción**: Verifica que controles de formulario tengan identificadores únicos.
- **Fix**: Agrega atributos estables `id` o `name` para que etiquetas y scripts puedan referenciarlos.
- **WCAG**: 1.3.1 (Nivel A)

### ACC-06: Label sin asociación `for`

- **Severidad**: Warning
- **Categoría**: Accessibility
- **Descripción**: Verifica que labels se asocien correctamente a controles.
- **Fix**: Asocia labels con controles mediante `for/id`, o envolviendo el input dentro del label.
- **WCAG**: 1.3.1 (Nivel A)

### ACC-07: Control sin etiqueta

- **Severidad**: Critical
- **Categoría**: Accessibility
- **Descripción**: Verifica que controles de formulario estén etiquetados.
- **Fix**: Proporciona etiqueta visible (o `aria-label`/`aria-labelledby`) para cada control.
- **WCAG**: 1.3.1 (Nivel A)

### ACC-09: Falta encabezado H1

- **Severidad**: Warning
- **Categoría**: Accessibility, SEO
- **Descripción**: Verifica que la página tenga al menos un H1 como encabezado principal.
- **Fix**: Agrega un H1 como encabezado principal para mejorar estructura y accesibilidad.
- **WCAG**: 1.3.1 (Nivel A)

### ACC-10: Salto en jerarquía de encabezados

- **Severidad**: Warning
- **Categoría**: Accessibility
- **Descripción**: Verifica orden jerárquico consistente en headings.
- **Fix**: Usa encabezados en orden (H1 → H2 → H3) evitando saltos de nivel.
- **WCAG**: 1.3.1 (Nivel A)

### ACC-11: Referencias `aria-labelledby` inválidas

- **Severidad**: Critical
- **Categoría**: Accessibility
- **Descripción**: Verifica que `aria-labelledby` apunte a IDs existentes.
- **Fix**: Actualiza `aria-labelledby` para apuntar a IDs existentes con texto significativo.
- **WCAG**: 1.3.1 (Nivel A)

### ACC-12: Referencias `aria-describedby` inválidas

- **Severidad**: Warning
- **Categoría**: Accessibility
- **Descripción**: Verifica que `aria-describedby` apunte a IDs existentes.
- **Fix**: Actualiza `aria-describedby` para apuntar a IDs existentes con descripciones útiles.
- **WCAG**: 1.3.1 (Nivel A)

### ACC-13: `tabindex` positivo

- **Severidad**: Recommendation
- **Categoría**: Accessibility
- **Descripción**: Detecta `tabindex` positivo que puede romper navegación por teclado.
- **Fix**: Elimina valores positivos de `tabindex`; usa `tabindex="0"` para controles personalizados enfocables o `tabindex="-1"` para foco programático.
- **WCAG**: 2.1.1 (Nivel A)

### ACC-14: Elementos interactivos anidados

- **Severidad**: Warning
- **Categoría**: Accessibility
- **Descripción**: Detecta anidación de elementos interactivos que confunde lectores de pantalla.
- **Fix**: Evita anidar elementos interactivos; deja un control interactivo por región clicable.
- **WCAG**: 2.1.1 (Nivel A)

### ACC-15: Iframe sin title

- **Severidad**: Warning
- **Categoría**: Accessibility
- **Descripción**: Verifica que iframes incluyan títulos descriptivos.
- **Fix**: Agrega atributo `title` conciso y descriptivo a cada iframe.
- **WCAG**: 2.4.1 (Nivel A)

### ACC-16: Video sin controles

- **Severidad**: Warning
- **Categoría**: Accessibility
- **Descripción**: Verifica que videos tengan controles accesibles.
- **Fix**: Agrega atributo `controls` a videos sin `autoplay` o `muted`.
- **WCAG**: 2.1.1 (Nivel A)

### ACC-17: Tabla sin caption

- **Severidad**: Recommendation
- **Categoría**: Accessibility
- **Descripción**: Verifica que tablas tengan caption o etiqueta significativa.
- **Fix**: Agrega elemento `caption` o `aria-label` para describir el propósito de la tabla.
- **WCAG**: 1.3.1 (Nivel A)

### ACC-18: Encabezado de tabla sin scope

- **Severidad**: Recommendation
- **Categoría**: Accessibility
- **Descripción**: Verifica que headers de tabla incluyan `scope`.
- **Fix**: Agrega `scope="row"` o `scope="col"` en `th` para mejor soporte de lectores de pantalla.
- **WCAG**: 1.3.1 (Nivel A)

### ACC-19: Texto de enlace vago

- **Severidad**: Warning
- **Categoría**: Accessibility
- **Descripción**: Detecta textos vagos como "click here".
- **Fix**: Reemplaza texto vago por acción/contexto específico.
- **WCAG**: 2.4.4 (Nivel A)

### ACC-20: Enlace sin href

- **Severidad**: Warning
- **Categoría**: Accessibility
- **Descripción**: Verifica que anclas incluyan atributo `href`.
- **Fix**: Usa `href` válido, o botón para acciones no navegables.
- **WCAG**: 1.3.1 (Nivel A)

### ACC-21: Foco no visible

- **Severidad**: Warning
- **Categoría**: Accessibility
- **Descripción**: Detecta elementos con `outline` deshabilitado sin alternativa visible.
- **Fix**: Elimina `outline: none` o agrega indicador alternativo de foco.
- **WCAG**: 2.4.7 (Nivel AA)

### ACC-22: Texto demasiado pequeño

- **Severidad**: Critical
- **Categoría**: Accessibility
- **Descripción**: Detecta texto bajo umbral mínimo de legibilidad.
- **Fix**: Incrementa tamaño de texto para cumplir objetivos de legibilidad.
- **WCAG**: 1.4.4 (Nivel AA)

### ACC-23: IDs duplicados

- **Severidad**: Critical
- **Categoría**: Accessibility
- **Descripción**: Verifica unicidad de IDs en DOM.
- **Fix**: Asegura que cada `id` sea único en todo el DOM.
- **HTML**: Requisito estándar

### ACC-24: Falta skip link

- **Severidad**: Recommendation
- **Categoría**: Accessibility
- **Descripción**: Detecta ausencia de enlace de salto a contenido principal.
- **Fix**: Agrega skip link al inicio de la página.
- **WCAG**: 2.4.1 (Nivel A)

### ACC-25: Contraste de color insuficiente

- **Severidad**: Critical
- **Categoría**: Accessibility
- **Descripción**: Detecta texto con ratio de contraste insuficiente.
- **Fix**: Mejora contraste de color para cumplir WCAG AA (4.5:1) o AAA (7:1).
- **WCAG**: 1.4.3 (Nivel AA) / 1.4.11 (Nivel AAA)

### ACC-26: Line-height bajo

- **Severidad**: Recommendation
- **Categoría**: Accessibility
- **Descripción**: Detecta `line-height` bajo umbral de legibilidad.
- **Fix**: Aumenta `line-height` al menos a 1.4 (o 1.5x del tamaño de fuente).
- **WCAG**: 1.4.12 (Nivel AA)

---

## Reglas SEO (8)

### SEO-01: Falta título

- **Descripción**: Falta o está vacío el elemento `<title>`.
- **Fix**: Agrega `<title>` descriptivo en `<head>`.

### SEO-02: Meta description débil o ausente

- **Descripción**: Falta etiqueta meta description.
- **Fix**: Agrega meta description con resumen conciso de contenido.

### SEO-03: Falta charset

- **Descripción**: Falta declaración de charset.
- **Fix**: Agrega `<meta charset="UTF-8">` en `<head>`.

### SEO-05: Falta canonical

- **Descripción**: Falta etiqueta canonical.
- **Fix**: Agrega canonical para indicar URL preferida de la página.

### SEO-06: Directiva noindex

- **Descripción**: Meta robots contiene `noindex`.
- **Fix**: Elimina o revisa `noindex` para permitir indexación.

### SEO-07: Falta Open Graph

- **Descripción**: Faltan meta tags Open Graph.
- **Fix**: Agrega tags OG (`og:title`, `og:description`, `og:image`).

### SEO-08: Falta Twitter Card

- **Descripción**: Faltan meta tags de Twitter Card.
- **Fix**: Agrega tags (`twitter:card`, `twitter:title`, `twitter:description`).

---

## Reglas de HTML semántico (7)

### SEM-01: Usa Strong/Em en lugar de B/I

- **Descripción**: Uso de etiquetas no semánticas `<b>` y `<i>`.
- **Fix**: Usa `<strong>` en lugar de `<b>` y `<em>` en lugar de `<i>`.

### SEM-02: Estructura semántica baja

- **Descripción**: Documento con baja semántica (muchos `div` genéricos).
- **Fix**: Mejora la semántica con elementos HTML5 apropiados.

### SEM-03: Múltiples H1

- **Descripción**: La página contiene más de un H1.
- **Fix**: Usa un único H1 principal por página.

### SEM-04: Falta elemento main

- **Descripción**: Falta elemento `<main>`.
- **Fix**: Agrega `<main>` para identificar contenido principal.

### SEM-05: Múltiples main

- **Descripción**: La página contiene más de un `<main>`.
- **Fix**: Usa solo un `<main>` por página.

### SEM-06: Navegación sin lista

- **Descripción**: `<nav>` no contiene lista.
- **Fix**: Envuelve enlaces de navegación en lista (`ul`/`ol`).

### SEM-07: Estructura de lista falsa

- **Descripción**: Lista contiene hijos no válidos (`div` en vez de `li`).
- **Fix**: Reemplaza hijos no lista por elementos `<li>`.

---

## Reglas Responsive (5)

### RWD-01: Elementos de ancho fijo grande

- **Descripción**: Elementos con ancho fijo en píxeles.
- **Fix**: Usa unidades relativas (`%`, `rem`, `em`) o `max-width`.

### RWD-02: Falta meta viewport

- **Descripción**: Falta etiqueta viewport.
- **Fix**: Agrega `<meta name="viewport" content="width=device-width, initial-scale=1">`.

### RWD-03: Overflow horizontal

- **Descripción**: Se detecta desbordamiento horizontal.
- **Fix**: Corrige overflow removiendo anchos fijos o usando `max-width` + `overflow-x`.

### RWD-04: Elemento fijo tapa contenido

- **Descripción**: Elemento fixed/sticky ocupa demasiado viewport.
- **Fix**: Reduce altura o evita obstrucción de contenido importante.

### RWD-05: Uso problemático de 100vh

- **Descripción**: Uso de `100vh` que puede causar overflow en móvil.
- **Fix**: Usa `100%` o `min(100vh, 100%)`, o unidades de viewport adaptativas.

---

## Reglas de seguridad (1)

### SEC-01: `target=_blank` inseguro

- **Descripción**: Enlace con `target="_blank"` sin `rel="noopener noreferrer"`.
- **Fix**: Añade `rel="noopener noreferrer"` para evitar tabnabbing.

---

## Reglas de calidad (2)

### QLT-01: Exceso de estilos inline

- **Descripción**: Uso excesivo de estilos inline.
- **Fix**: Mueve estilos inline a CSS externo o bloques de estilo.

### QLT-02: Enlaces dummy

- **Descripción**: Enlaces con `href="#"` u otros placeholders.
- **Fix**: Reemplaza por URL real o usa botón para acciones.

---

## Reglas de rendimiento (10)

### IMG-01: Imágenes sin dimensiones

- **Descripción**: Imágenes sin atributos `width`/`height`.
- **Fix**: Agrega dimensiones para evitar layout shifts.

### IMG-02: Imágenes sin lazy loading

- **Descripción**: Imágenes sin `loading="lazy"`.
- **Fix**: Agrega lazy loading a imágenes fuera de la primera vista.

### IMG-03: Imágenes sin async decode

- **Descripción**: Imágenes sin `decoding="async"`.
- **Fix**: Agrega decode asíncrono para render no bloqueante.

### MEDIA-01: Video autoplay sin muted

- **Descripción**: Video con autoplay sin `muted`.
- **Fix**: Agrega `muted` para cumplir políticas de autoplay.

### PERF-01: Imágenes sin srcset

- **Descripción**: Falta `srcset` y `sizes`.
- **Fix**: Agrega atributos responsivos de imagen.

### PERF-02: Exceso de fuentes/pesos

- **Descripción**: Muchas familias o pesos tipográficos cargados.
- **Fix**: Reduce familias/pesos; considera fuentes del sistema.

### PERF-03: Exceso de scripts

- **Descripción**: Demasiados scripts externos.
- **Fix**: Agrupa scripts o elimina dependencias innecesarias.

### PERF-04: Scripts sin defer

- **Descripción**: Scripts en `head` sin `defer`/`async`.
- **Fix**: Agrega `defer` o `async` para evitar bloqueo de render.

### PERF-05: CSS bloqueante

- **Descripción**: CSS que puede bloquear renderizado inicial.
- **Fix**: Inyecta CSS crítico o usa preload/carga asíncrona.

### PERF-06: Falta configuración de caché

- **Descripción**: Recursos estáticos sin estrategia de cache headers.
- **Fix**: Configura `Cache-Control` o usa caché en CDN.

---

## Reglas de formularios (4)

### FORM-01: Submit fuera del formulario

- **Severidad**: Warning
- **Descripción**: Botón submit fuera de su elemento `form`.
- **Fix**: Coloca submit dentro del form o enlázalo con atributo `form`.

### FORM-02: Campo requerido sin indicador

- **Severidad**: Recommendation
- **Descripción**: Label de campo requerido no lo indica visualmente.
- **Fix**: Indica campos requeridos en la etiqueta (por ejemplo `*` o `(required)`).

### FORM-03: Email/Tel con type incorrecto

- **Severidad**: Recommendation
- **Descripción**: Campo email/teléfono con tipo equivocado.
- **Fix**: Usa `type="email"` y `type="tel"` según corresponda.

### FORM-04: Falta autocomplete

- **Severidad**: Recommendation
- **Descripción**: Campos comunes sin `autocomplete`.
- **Fix**: Agrega `autocomplete` en nombre, email, teléfono, etc.

---

## Resumen

- **Total de reglas**: 61
- **Severidad Critical**: 14
- **Severidad Warning**: 23
- **Severidad Recommendation**: 24

Para ejemplos e implementación detallada, revisa el código fuente en `src/core/rules/`.
