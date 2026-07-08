# Lab 1: Setup de Kiro para Proyectos DevOps

## Duracion: 45 minutos (9:00 - 9:45)

---

## Objetivo

Configurar Kiro IDE como entorno principal para trabajo DevOps, incluyendo integracion con repositorios, configuracion de steering files, y creacion de hooks basicos.

---

## Lo que vas a lograr

- [ ] Crear y clonar un repositorio de trabajo
- [ ] Configurar steering files para estandares DevOps del equipo
- [ ] Crear tu primer hook de automatizacion
- [ ] Verificar la integracion Git dentro de Kiro
- [ ] Familiarizarte con sesiones Vibe y Spec

---

## Parte 1: Preparacion del repositorio (10 min)

### 1.1 Crear repositorio en GitHub

1. Ve a https://github.com/new
2. Nombre: `kiro-devops-workshop`
3. Visibilidad: Publico (o privado si prefieres)
4. Inicializar con README
5. Agregar `.gitignore` para Node.js
6. Click en "Create repository"

### 1.2 Clonar en Kiro

Abre la terminal integrada de Kiro (`Ctrl+` ` `) y ejecuta:

```bash
# Clonar tu repositorio
git clone https://github.com/TU-USUARIO/kiro-devops-workshop.git

# Entrar al directorio
cd kiro-devops-workshop
```

Luego abre la carpeta en Kiro: **File → Open Folder → selecciona `kiro-devops-workshop`**

### 1.3 Inicializar proyecto base

En la terminal de Kiro:

```bash
# Inicializar proyecto Node.js
npm init -y

# Crear estructura basica
mkdir -p src tests .github/workflows
```

---

## Parte 2: Configurar Steering Files (15 min)

Los steering files son instrucciones persistentes que Kiro sigue en todas las interacciones. Son perfectos para definir estandares DevOps del equipo.

### 2.1 Crear la carpeta de steering

```bash
mkdir -p .kiro/steering
```

### 2.2 Crear steering de estandares DevOps

Pide a Kiro que te ayude. Abre una sesion Vibe (chat) y escribe:

> **Prompt para Kiro:**
> "Crea un steering file en `.kiro/steering/devops-standards.md` que defina los siguientes estandares para nuestro equipo:
> - Todos los pipelines deben usar GitHub Actions
> - Los workflows deben tener nombres descriptivos en espanol
> - Siempre incluir steps de lint, test y build
> - Usar Node.js 20 como version por defecto
> - Los secrets se referencian con el prefijo CARVAJAL_
> - Incluir notificacion a Slack en caso de fallo"

### Resultado esperado:

Kiro creara un archivo similar a este:

```markdown
# Estandares DevOps - Equipo Carvajal

## Pipelines CI/CD
- Plataforma: GitHub Actions
- Nombres de workflows: descriptivos en espanol
- Steps obligatorios: lint, test, build
- Runtime: Node.js 20 (LTS)

## Convenciones
- Prefijo para secrets: CARVAJAL_
- Notificaciones: Slack channel en caso de fallo
- Branch protection: main requiere PR con al menos 1 aprobacion

## Estructura de archivos
- Workflows en: .github/workflows/
- Tests en: tests/
- Codigo fuente en: src/
```

### 2.3 Crear steering de contexto del proyecto

> **Prompt para Kiro:**
> "Crea un steering file en `.kiro/steering/project-context.md` que explique:
> - Este es un workshop de DevOps para aprender a usar Kiro
> - El stack es Node.js con Express
> - Usamos Jest para tests
> - El deploy target es AWS (Lambda o ECS)
> - Preferimos respuestas en espanol"

### 2.4 Verificar que Kiro usa el steering

Prueba preguntando en el chat:

> "Que version de Node.js debo usar en mis pipelines?"

Kiro deberia responder mencionando Node.js 20, segun tu steering.

---

## Parte 3: Crear tu primer Hook (10 min)

Los hooks son automatizaciones que se disparan con eventos en el IDE.

### 3.1 Hook: Recordatorio de tests en archivos nuevos

Pide a Kiro:

> **Prompt para Kiro:**
> "Crea un hook que cuando se cree un archivo .js en la carpeta src/,
> me recuerde que debo crear el test correspondiente en tests/"

### Resultado esperado:

Kiro creara un archivo `.kiro/hooks/remind-tests.json`:

```json
{
  "version": "v1",
  "hooks": [{
    "name": "Recordar crear tests",
    "trigger": "PostFileCreate",
    "matcher": "src/.*\\.js$",
    "action": {
      "type": "agent",
      "prompt": "Se ha creado un nuevo archivo en src/. Recuerda al usuario que debe crear el test correspondiente en la carpeta tests/ siguiendo el patron: tests/<nombre>.test.js"
    }
  }]
}
```

### 3.2 Hook: Validar commits (opcional avanzado)

> **Prompt para Kiro:**
> "Crea un hook que antes de usar la herramienta de escritura de archivos
> en .github/workflows/, valide que el YAML incluya un step de tests"

---

## Parte 4: Explorar las sesiones de Kiro (10 min)

### 4.1 Sesion Vibe (conversacional)

La sesion Vibe es ideal para:
- Explorar soluciones rapidas
- Preguntas puntuales
- Generacion rapida de codigo

**Ejercicio**: Abre una sesion Vibe y pregunta:

> "Dame un ejemplo de .gitignore para un proyecto Node.js con Terraform"

### 4.2 Sesion Spec (estructurada)

La sesion Spec es ideal para:
- Features complejas que requieren planificacion
- Proyectos con multiples archivos
- Cuando necesitas requisitos claros antes de implementar

**Ejercicio**: Inicia una sesion Spec con:

> "Quiero crear un pipeline CI para mi proyecto Node.js que ejecute
> lint con ESLint, tests con Jest, y build. Debe correr en push a
> main y en pull requests."

Observa como Kiro:
1. Define requisitos
2. Propone un diseno
3. Genera tareas de implementacion
4. Ejecuta las tareas paso a paso

---

## Verificacion final

Antes de pasar al Lab 2, verifica que tienes:

```
kiro-devops-workshop/
├── .kiro/
│   ├── steering/
│   │   ├── devops-standards.md    ✓
│   │   └── project-context.md     ✓
│   └── hooks/
│       └── remind-tests.json      ✓
├── .github/
│   └── workflows/                 ✓ (vacia por ahora)
├── src/                           ✓
├── tests/                         ✓
├── package.json                   ✓
├── .gitignore                     ✓
└── README.md                      ✓
```

### Commit tu progreso

```bash
git add -A
git commit -m "feat: setup inicial de Kiro para DevOps workshop"
git push origin main
```

---

## Troubleshooting

| Problema | Solucion |
|----------|----------|
| Kiro no responde | Verificar sesion iniciada (AWS Builder ID) |
| No se crean archivos | Verificar modo Autopilot activado |
| Git push falla | Verificar credenciales de GitHub |
| Hook no se dispara | Verificar que el matcher regex es correcto |
| Steering no se aplica | Verificar que el archivo esta en .kiro/steering/ |

---

## Siguiente: [Lab 2 - Generacion de pipelines →](../lab2/README.md)
