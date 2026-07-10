# Lab 2: Generacion de Pipelines con Prompts para CI

## Duracion: 60 minutos (9:30 - 10:30)

---

## Objetivo

Aprender a generar pipelines de CI completos y funcionales usando prompts en Kiro, entendiendo como iterar sobre los resultados y personalizar workflows de GitHub Actions.

---

## Lo que vas a lograr

- [ ] Generar un pipeline basico de CI con un solo prompt
- [ ] Iterar y mejorar el pipeline con prompts adicionales
- [ ] Agregar matriz de versiones y caching
- [ ] Crear un pipeline de PR validation
- [ ] Generar un pipeline de release automatizado
- [ ] Entender la anatomia de un buen prompt DevOps

---

## Contexto previo

Asegurate de tener el proyecto del Lab 1 abierto en Kiro con:
- El steering de estandares DevOps configurado
- La carpeta `.github/workflows/` creada
- `package.json` inicializado

---

## Parte 1: Tu primer pipeline con un prompt (15 min)

### 1.1 El arte del prompt DevOps

Un buen prompt para generar pipelines incluye:

```
┌─────────────────────────────────────────────────┐
│  ANATOMIA DE UN PROMPT DEVOPS                   │
├─────────────────────────────────────────────────┤
│                                                 │
│  1. QUE quieres (accion)                        │
│  2. DONDE se ejecuta (plataforma)               │
│  3. CUANDO se dispara (triggers)                │
│  4. CON QUE stack (runtime, tools)              │
│  5. QUE PASOS incluye (steps)                   │
│  6. RESTRICCIONES (seguridad, permisos)         │
│                                                 │
└─────────────────────────────────────────────────┘
```

### 1.2 Ejercicio: Pipeline basico

Abre una sesion Vibe en Kiro y usa este prompt:

> **Prompt:**
> "Genera un workflow de GitHub Actions llamado 'CI Pipeline' en
> `.github/workflows/ci.yml` que:
> - Se ejecute en push a main y en pull requests
> - Use Node.js 20 en Ubuntu latest
> - Instale dependencias con npm ci
> - Ejecute linting con npm run lint
> - Ejecute tests con npm run test
> - Ejecute build con npm run build
> - Agregue comentarios en espanol explicando cada step"

### Resultado esperado:

Kiro generara algo similar a:

```yaml
# Pipeline de Integracion Continua
# Se ejecuta en cada push a main y en pull requests
name: CI Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  ci:
    name: Integracion Continua
    runs-on: ubuntu-latest

    steps:
      # Paso 1: Descargar el codigo fuente
      - name: Checkout del codigo
        uses: actions/checkout@v4

      # Paso 2: Configurar el entorno Node.js
      - name: Configurar Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      # Paso 3: Instalar dependencias (ci es mas rapido y determinista)
      - name: Instalar dependencias
        run: npm ci

      # Paso 4: Verificar calidad del codigo
      - name: Ejecutar linting
        run: npm run lint

      # Paso 5: Ejecutar pruebas automatizadas
      - name: Ejecutar tests
        run: npm run test

      # Paso 6: Compilar el proyecto
      - name: Ejecutar build
        run: npm run build
```

### 1.3 Analizar el resultado

Revisa el archivo generado y observa:
- Los triggers (`on:`)
- La estructura de jobs y steps
- El uso de actions oficiales (`actions/checkout@v4`)
- El caching automatico de npm

---

## Parte 2: Iterar y mejorar (15 min)

### 2.1 Agregar matriz de versiones

> **Prompt:**
> "Modifica el pipeline CI para que pruebe en Node.js 18 y 20 usando
> una strategy matrix. Manten los comentarios en espanol."

### Resultado esperado (seccion modificada):

```yaml
    strategy:
      matrix:
        node-version: [18, 20]

    steps:
      - name: Checkout del codigo
        uses: actions/checkout@v4

      - name: Configurar Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
```

### 2.2 Agregar caching avanzado

> **Prompt:**
> "Agrega caching de node_modules al pipeline para acelerar
> ejecuciones subsecuentes. Usa actions/cache@v4."

### 2.3 Agregar badge de status

> **Prompt:**
> "Agrega el badge de estado del workflow de CI al README.md del proyecto."

Resultado esperado en README.md:
```markdown
![CI Pipeline](https://github.com/TU-USUARIO/kiro-devops-workshop/actions/workflows/ci.yml/badge.svg)
```

---

## Parte 3: Pipeline de validacion de PR (15 min)

### 3.1 Generar pipeline de PR

> **Prompt:**
> "Crea un workflow en `.github/workflows/pr-validation.yml` que:
> - Se ejecute solo en pull requests
> - Valide que el titulo del PR sigue Conventional Commits (feat:, fix:, docs:, etc.)
> - Ejecute tests con cobertura y falle si la cobertura es menor a 80%
> - Agregue un comentario automatico en el PR con el resumen de cobertura
> - Incluya labels automaticas segun los archivos modificados"

### 3.2 Crear archivo de labels

> **Prompt:**
> "Genera un archivo `.github/labeler.yml` que asigne labels automaticas:
> - 'ci' para cambios en .github/
> - 'docs' para cambios en *.md
> - 'tests' para cambios en tests/
> - 'source' para cambios en src/"

### Resultado esperado:

```yaml
# .github/labeler.yml
ci:
  - changed-files:
    - any-glob-to-any-file: '.github/**'

docs:
  - changed-files:
    - any-glob-to-any-file: '**/*.md'

tests:
  - changed-files:
    - any-glob-to-any-file: 'tests/**'

source:
  - changed-files:
    - any-glob-to-any-file: 'src/**'
```

---

## Parte 4: Pipeline de Release (15 min)

### 4.1 Generar pipeline de release automatizado

> **Prompt:**
> "Crea un workflow en `.github/workflows/release.yml` que:
> - Se dispare cuando se crea un tag con formato v*.*.* (semantic versioning)
> - Genere un changelog automatico basado en los commits desde el ultimo tag
> - Cree un GitHub Release con el changelog
> - Publique un artefacto de build como asset del release
> - Envie notificacion (step placeholder) en caso de exito
> - Usa el secret CARVAJAL_SLACK_WEBHOOK para la notificacion"

### Resultado esperado (estructura):

```yaml
name: Release Pipeline

on:
  push:
    tags:
      - 'v*.*.*'

jobs:
  release:
    name: Crear Release
    runs-on: ubuntu-latest
    permissions:
      contents: write

    steps:
      - name: Checkout del codigo
        uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Necesario para generar changelog

      - name: Configurar Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Instalar dependencias
        run: npm ci

      - name: Build del proyecto
        run: npm run build

      - name: Generar changelog
        id: changelog
        uses: conventional-changelog/conventional-changelog-action@v5
        with:
          preset: 'angular'

      - name: Crear GitHub Release
        uses: softprops/action-gh-release@v2
        with:
          body: ${{ steps.changelog.outputs.changelog }}
          files: dist/**
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Notificar al equipo (Slack)
        if: success()
        run: |
          curl -X POST -H 'Content-type: application/json' \
            --data '{"text":"Release ${{ github.ref_name }} publicado exitosamente"}' \
            ${{ secrets.CARVAJAL_SLACK_WEBHOOK }}
```

---

## Parte 5: Prompt Engineering para DevOps (bonus)

### Tabla de prompts utiles para pipelines

| Necesidad | Prompt recomendado |
|-----------|-------------------|
| Security scanning | "Agrega un step de escaneo de vulnerabilidades con Trivy al pipeline CI" |
| Docker build | "Agrega build y push de imagen Docker a ECR con tag del commit SHA" |
| Deploy staging | "Crea un job de deploy a staging que se ejecute solo desde main" |
| Rollback | "Agrega un workflow manual para rollback al release anterior" |
| Monorepo | "Modifica el pipeline para ejecutar solo los tests de los packages modificados" |
| Secrets rotation | "Documenta como rotar los secrets usados en este pipeline" |

### Tips para mejores resultados

```
┌─────────────────────────────────────────────────────────┐
│  TIPS PARA PROMPTS DEVOPS EN KIRO                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ✓ Se especifico con versiones (Node 20, no "latest")   │
│  ✓ Menciona la plataforma (GitHub Actions, no generico) │
│  ✓ Indica el path del archivo de salida                 │
│  ✓ Pide comentarios para documentar el pipeline         │
│  ✓ Incluye manejo de errores y notificaciones           │
│  ✓ Usa iteracion: genera basico → mejora → optimiza    │
│  ✗ No generes todo de una vez, itera paso a paso        │
│  ✗ No asumas que Kiro sabe tu estructura sin steering   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Verificacion final

Al terminar este lab deberias tener:

```
.github/
├── workflows/
│   ├── ci.yml              ✓ Pipeline CI con matrix
│   ├── pr-validation.yml   ✓ Validacion de PRs
│   └── release.yml         ✓ Release automatizado
└── labeler.yml             ✓ Labels automaticas
```

### Commit tu progreso

```bash
git add .github/
git commit -m "ci: agregar pipelines de CI, PR validation y release"
git push origin main
```

> **Nota**: Los comandos de `git` funcionan igual en macOS, Linux y Windows (PowerShell, CMD o Git Bash). Si usas CMD en Windows y `git add .github/` no funciona, usa `git add .github\` con backslash.

### Verificar en GitHub

1. Ve a tu repositorio en GitHub
2. Click en la pestana "Actions"
3. Deberia aparecer el workflow "CI Pipeline"
4. Si hay errores, usa Kiro para debuggear:

> "El pipeline CI falla con este error: [pegar error]. Como lo arreglo?"

---

## Ejercicio extra (si te sobra tiempo)

> **Prompt desafio:**
> "Crea un workflow de GitHub Actions que se ejecute cada lunes a las 9am
> y verifique si hay dependencias con vulnerabilidades conocidas usando
> npm audit. Si encuentra vulnerabilidades criticas, cree un issue
> automaticamente."

---

## Siguiente: [Taller practico - Pruebas y documentacion →](../taller-practico/README.md)
