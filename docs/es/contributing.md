# Guia de Contribucion

Esta guia define como agregar o actualizar reglas de auditoria y su documentacion en WAH.

## Alcance

Usa esta guia cuando:

- Agregas una regla nueva
- Cambias logica o severidad de una regla existente
- Actualizas documentacion educativa de una regla
- Actualizas metadata de integracion de "Learn more"

## Checklist para reglas

Para cada cambio de regla, completa todo:

1. La implementacion de la regla existe y devuelve ID estable (`rule`), severidad y mensaje.
2. El ID esta registrado en `RULE_IDS` y en el registry de categoria.
3. El texto de correccion existe en `RULE_FIXES`.
4. Existe pagina de docs en `docs/rules/{RULE-ID}.md`.
5. La regla esta mapeada en `RULE_DOCS_SLUG`.
6. La metadata de la regla es consistente:
   - `RULE_DESCRIPTIONS`
   - `RULE_WHY`
   - `RULE_STANDARD_TYPE`
   - `RULE_STANDARD_LABEL`
7. Se agregan o actualizan pruebas.
8. Build y pruebas objetivo pasan.

## Plantilla de documentacion (obligatoria)

Cada pagina de regla debe incluir:

- Problem
- Why it matters
- How to fix
- Bad example
- Good example
- References

Manten el contenido breve y accionable.

## Standard vs Heuristic

Marca correctamente el tipo de guia:

- `standard`: respaldado por WCAG, HTML spec, OWASP, web.dev, etc.
- `heuristic`: buena practica sin requisito normativo estricto.

No presentar heuristicas como cumplimiento obligatorio de estandar.

## Enlaces y Learn More

Cuando agregues una pagina de regla:

1. Agrega/confirma `docs/rules/{RULE-ID}.md`.
2. Agrega/confirma `RULE_DOCS_SLUG[{RULE-ID}] = "{RULE-ID}"`.
3. Verifica salida en:
   - Learn more en reporte HTML
   - Learn more en detalle de consola
   - Learn more en menu contextual del overlay

## Estilo y consistencia

Mantener redaccion consistente entre:

- Pagina de docs de la regla
- Metadata en constants
- Texto visible para usuario en overlay/reportes

Estilo recomendado:

- Frases cortas
- Fixes concretos
- Un ejemplo minimo malo y uno bueno

## Comandos de validacion

Ejecutar antes de PR/commit:

```bash
npm run build
npm test -- --run src/reporters/builder.test.ts src/reporters/serializers/serializers.test.ts src/overlay/interactions/highlight.test.ts
```

Cuando cambie la logica de reglas, ejecutar suite mas amplia:

```bash
npm test
```

## Expectativas de Pull Request

Incluir en la descripcion del PR:

- IDs de reglas afectadas
- Si el cambio es standard o heuristic
- Paginas de docs agregadas/actualizadas
- Pruebas agregadas/actualizadas
- Cambios visibles para usuario en overlay/reporte/consola
