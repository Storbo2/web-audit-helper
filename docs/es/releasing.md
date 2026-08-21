# Publicar una versión en GitHub y npm

Este proyecto publica `web-audit-helper` en npm desde `.github/workflows/ci.yml`
cuando se empuja un tag `v*`. El job usa Trusted Publishing de npm con OIDC, por
lo que no necesita un `NPM_TOKEN` permanente.

## Configuración única en npmjs.com

1. Abre el paquete `web-audit-helper` en npmjs.com.
2. Entra en **Settings → Trusted publishing**.
3. Selecciona **GitHub Actions** e ingresa:
   - Organization or user: `Storbo2`
   - Repository: `web-audit-helper`
   - Workflow filename: `ci.yml`
   - Allowed action: `npm publish`
4. Guarda la configuración.
5. Después de validar la primera publicación OIDC, considera seleccionar
   **Require two-factor authentication and disallow tokens** en Publishing
   access y revocar el antiguo `NPM_TOKEN`.

Trusted Publishing requiere un runner alojado por GitHub, permiso
`id-token: write`, npm 11.5.1 o superior y Node.js 22.14 o superior. El job de
publicación usa Node.js 24.

Documentación oficial:

- <https://docs.npmjs.com/trusted-publishers/>
- <https://docs.npmjs.com/cli/v11/commands/npm-publish/>

## Flujo de cada versión

Primero integra la rama de trabajo en `main`. Luego, desde una copia limpia y
actualizada de `main`:

```bash
git switch main
git pull --ff-only origin main
pnpm install --frozen-lockfile
pnpm run test:all
npm pack --dry-run
```

Elige una versión que todavía no exista en npm. Para esta entrega, que añade la
extensión Chromium, `2.2.0` es una versión semántica razonable:

```bash
pnpm run release:tag -- 2.2.0
```

El comando valida el proyecto, actualiza `package.json` y `pnpm-lock.yaml`, crea
el commit `chore(release): v2.2.0`, crea el tag anotado `v2.2.0` y empuja el
branch y el tag. El tag inicia CI y npm se publica solamente cuando las pruebas,
cobertura, E2E normales y E2E de la extensión terminan correctamente.

Una combinación exacta de nombre y versión publicada en npm no puede volver a
utilizarse, aunque sea eliminada. Ante un fallo posterior, publica una versión
nueva en lugar de intentar sobrescribirla.

## Crear el Release de GitHub

Cuando CI y npm estén verdes, genera el ZIP con la versión nueva y adjúntalo al
Release de GitHub:

```bash
pnpm run package:extension
gh release create v2.2.0 dist/web-audit-helper-extension-v2.2.0.zip --title "v2.2.0" --generate-notes
```

También puedes hacerlo desde **GitHub → Releases → Draft a new release**,
seleccionando el tag existente y subiendo manualmente el ZIP. El ZIP de la
extensión es un artefacto de GitHub Release; el paquete npm contiene solamente
los archivos declarados en `package.json#files`.

Documentación oficial:

- <https://docs.github.com/en/get-started/using-git/pushing-commits-to-a-remote-repository>
- <https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository>

