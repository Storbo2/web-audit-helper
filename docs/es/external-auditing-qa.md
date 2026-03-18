# Checklist QA de Auditoria Externa

Este checklist valida el flujo de auditoria externa de v1.5 bajo escenarios de CSP permisiva y CSP bloqueante.

## Alcance

- El bookmarklet carga runtime desde jsDelivr con version fija.
- La secuencia de fallback funciona: IIFE primero, ESM despues.
- En CSP bloqueante se muestra error explicito y se aborta la ejecucion.
- Los runs externos exportan metadata con `runtimeMode = external`.
- La comparacion entre runs esta disponible en JSON y HTML cuando existe baseline previo.

## Prerrequisitos

1. Compilar el proyecto:

```bash
npm run build
```

1. Crear bookmarklet desde `dist/bookmarklet.txt`.
2. Levantar servidor estatico local desde la raiz del repositorio:

```bash
npx http-server . -p 4173 --cors
```

1. Abrir DevTools del navegador (Console + Network).

## Bookmarklet Local para Validacion Pre-Release

Si npm `1.5.0` aun no esta publicado, usa bookmarklet local:

1. Levantar servidor local desde la raiz del repositorio:

```bash
npx http-server . -p 4173 --cors
```

1. Verificar en navegador que estos archivos respondan:
   - `http://127.0.0.1:4173/dist/external-runtime.iife.js`
   - `http://127.0.0.1:4173/dist/external-runtime.mjs`
2. Crear un bookmarklet cuyo `runtimeBaseUrl` apunte a `http://127.0.0.1:4173/dist`.

## Fixtures de prueba

- CSP permisiva: `http://127.0.0.1:4173/examples/csp-permissive.html`
- CSP bloqueante: `http://127.0.0.1:4173/examples/csp-blocking.html`

## Validacion en Paginas Reales (Gate de Release)

Despues de publicar npm `1.5.0` y regenerar bookmarklet con version fija:

1. Validar una pagina estatica (tipo marketing/docs).
2. Validar una pagina SPA (tipo React/Next/Vue).
3. Exportar JSON y verificar:
   - `meta.runtimeMode = external`
   - `meta.runId`, `meta.targetUrl`, `meta.executedAt`, `meta.wahVersion`
4. Ejecutar una segunda auditoria en la misma sesion y volver a exportar JSON/HTML.
5. Verificar que la comparacion incluya:
   - delta de score total
   - delta por severidad
   - altas/bajas por `ruleId`
   - deltas por categoria

## Matriz de validacion

### Caso A: CSP Permisiva (Exito esperado)

1. Abrir fixture permisiva.
2. Ejecutar bookmarklet.
3. Confirmar que carga el runtime:
   - `external-runtime.iife.js` debe cargar desde jsDelivr.
4. Confirmar que aparece el overlay de WAH.
5. Exportar reporte JSON desde el overlay.
6. Verificar metadata en JSON:
   - `meta.runtimeMode` igual a `external`
   - Existen `meta.runId`, `meta.targetUrl`, `meta.executedAt`, `meta.wahVersion`

Criterio de aprobado:

- Overlay visible.
- Sin error fatal de bootstrap externo.
- JSON con `runtimeMode = external`.

### Caso B: CSP Bloqueante (Fallo controlado esperado)

1. Abrir fixture bloqueante.
2. Ejecutar bookmarklet.
3. Confirmar fallo de carga de runtime jsDelivr en Network/Console.
4. Confirmar que el fallback ESM tambien falla.
5. Confirmar mensaje de error explicito al usuario:
   - `[WAH] External audit bootstrap failed. CSP may be blocking script injection. Review console for details.`
6. Confirmar que no aparece overlay.

Criterio de aprobado:

- Error claro para usuario.
- Ejecucion abortada sin estado parcial del overlay.

## Plantilla de evidencia

Registrar cada corrida con la plantilla siguiente.

### Registro de evidencia

- Fecha:
- Tester:
- Version WAH:
- Navegador + version:
- Escenario: `permissive` o `blocking`
- URL objetivo:
- Resultado: `pass` o `fail`
- Captura(s):
- Extracto de consola:
- Extracto de red:
- Notas:

## Ejemplos de Evidencia (Backlog de Media)

Assets recomendados para esta guia:

- Captura: overlay externo visible en pagina objetivo
- Captura: error controlado en CSP bloqueante
- Captura: seccion de comparacion en reporte HTML
- Captura: metadata JSON con `runtimeMode = external`
- GIF corto: instalacion y ejecucion del bookmarklet

Ubicaciones sugeridas:

- `docs/media/images/external-auditing/`
- `docs/media/gifs/external-auditing/`

## Troubleshooting rapido

- Si falla la fixture permisiva, validar que el bookmarklet apunta a la version actual del paquete.
- Si ambos casos fallan igual, revisar que el bookmarklet apunte a `dist/external-runtime.iife.js` y fallback `dist/external-runtime.mjs`.
- Si falta metadata, verificar que el export corresponde a run externo (no embebido).

Diagnostico de errores comunes:

- `ERR_CONNECTION_REFUSED`:
  - Runtime local inaccesible. Confirmar que el servidor este activo en `127.0.0.1:4173`.
- `Failed to load external-runtime.iife.js`:
  - IIFE bloqueado (usualmente CSP) o URL incorrecta.
- `Failed to fetch dynamically imported module`:
  - Fallback ESM bloqueado por CSP/CORS/politicas de red.
- Funciona en fixtures pero no en dominios enterprise:
  - Esperado cuando CSP estricta bloquea inyeccion de scripts. Registrar como fallo controlado.
