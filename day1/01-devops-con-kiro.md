# Que es DevOps y su Valor en Desarrollo con Kiro

## Duracion: 30 minutos (8:15 - 8:45)

---

## 1. DevOps en 5 minutos

### Definicion practica

DevOps es la union de **desarrollo** (Dev) y **operaciones** (Ops) en un ciclo continuo que busca:

- Entregar software mas rapido
- Con mayor calidad
- De forma repetible y predecible

### El ciclo DevOps

```
    ┌─────────────────────────────────────────┐
    │                                         │
    │   PLAN → CODE → BUILD → TEST           │
    │     ↑                       ↓           │
    │   MONITOR ← OPERATE ← DEPLOY ← RELEASE│
    │                                         │
    └─────────────────────────────────────────┘
```

### Pilares fundamentales

| Pilar | Que significa | Herramienta tipica |
|-------|--------------|-------------------|
| CI (Integracion Continua) | Integrar codigo frecuentemente | GitHub Actions, Jenkins |
| CD (Entrega Continua) | Desplegar automaticamente | ArgoCD, CodePipeline |
| IaC (Infra como Codigo) | Infraestructura versionada | Terraform, CloudFormation |
| Monitoreo | Observabilidad del sistema | CloudWatch, Datadog |
| Automatizacion | Reducir tareas manuales | Scripts, pipelines |

---

## 2. El problema que resuelve Kiro en DevOps

### Dolor comun en equipos DevOps

```
┌────────────────────────────────────────────────────────────┐
│  "Paso 2 horas configurando un pipeline de CI"            │
│  "No recuerdo la sintaxis de GitHub Actions"               │
│  "Escribir tests para cada cambio es tedioso"              │
│  "La documentacion siempre queda desactualizada"           │
│  "Terraform tiene tantos recursos que me pierdo"           │
└────────────────────────────────────────────────────────────┘
```

### Como Kiro transforma esto

| Sin Kiro | Con Kiro |
|----------|----------|
| Buscar documentacion de YAML | Describir que necesitas en lenguaje natural |
| Copiar/pegar templates obsoletos | Generar pipelines actualizados al contexto |
| Escribir tests manualmente | Generar tests con cobertura inteligente |
| Documentar retroactivamente | Documentacion generada junto al codigo |
| Debuggear errores de sintaxis IaC | Validacion y generacion asistida |

---

## 3. Kiro: Mas que un autocompletado

### Que es Kiro

Kiro es un **IDE potenciado por IA** desarrollado por AWS, construido sobre VS Code, que ofrece:

- **Sesiones Vibe**: Conversacion libre para explorar soluciones
- **Sesiones Spec**: Flujo estructurado (requisitos → diseno → tareas → implementacion)
- **Hooks**: Automatizaciones que se disparan con eventos del IDE
- **Steering**: Reglas y contexto persistente para el proyecto
- **Agentes autonomos**: Ejecucion de tareas complejas end-to-end

### Kiro en el contexto DevOps

```
┌─────────────────────────────────────────────────────────┐
│                    KIRO + DevOps                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [PLAN]     → Specs para definir requisitos de infra    │
│  [CODE]     → Generacion de pipelines y configs         │
│  [BUILD]    → Hooks para validar en cada save           │
│  [TEST]     → Tests automaticos generados por prompts   │
│  [DEPLOY]   → Templates IaC generados y validados       │
│  [MONITOR]  → Dashboards y alertas documentadas         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 4. Capacidades clave de Kiro para DevOps

### 4.1 Generacion de pipelines CI/CD

Kiro puede generar workflows completos a partir de prompts como:

> "Crea un pipeline de GitHub Actions que ejecute tests en Node.js 20,
> haga lint, y despliegue a AWS si estamos en la rama main"

### 4.2 Infrastructure as Code asistida

> "Genera un modulo Terraform para un bucket S3 con versionado,
> encriptacion, y politica de lifecycle de 90 dias"

### 4.3 Testing automatizado

> "Genera tests unitarios para esta funcion Lambda que procesa
> eventos de SQS"

### 4.4 Documentacion viva

> "Documenta este pipeline explicando cada step, los secretos
> necesarios, y como hacer troubleshooting"

### 4.5 Hooks para calidad continua

```json
{
  "version": "v1",
  "hooks": [{
    "name": "Validar YAML en save",
    "trigger": "PostFileSave",
    "matcher": "\\.(yml|yaml)$",
    "action": {
      "type": "command",
      "command": "yamllint ${file}"
    }
  }]
}
```

---

## 5. Flujo DevOps con Kiro - Ejemplo real

### Escenario: Nuevo microservicio con CI/CD

```
Paso 1: Spec Session
├── Definir requisitos del servicio
├── Kiro genera diseno tecnico
└── Kiro crea lista de tareas

Paso 2: Implementacion asistida
├── Kiro genera codigo del servicio
├── Kiro genera Dockerfile
├── Kiro genera pipeline CI (GitHub Actions)
└── Kiro genera tests

Paso 3: Hooks automaticos
├── PostFileSave → lint + format
├── PreToolUse → validacion de seguridad
└── PostTaskExec → ejecutar tests

Paso 4: Documentacion
├── Kiro genera README del servicio
├── Kiro documenta el pipeline
└── Kiro genera runbook operativo
```

---

## 6. Comparativa: Enfoque tradicional vs Kiro

### Tiempo estimado para configurar CI/CD de un microservicio

| Actividad | Tradicional | Con Kiro | Ahorro |
|-----------|-------------|----------|--------|
| Escribir pipeline CI | 2-4 horas | 10-15 min | ~90% |
| Configurar linting | 30-60 min | 5 min | ~90% |
| Escribir tests basicos | 2-3 horas | 20-30 min | ~85% |
| Documentar pipeline | 1-2 horas | 10 min | ~90% |
| Template Terraform basico | 1-2 horas | 15 min | ~85% |
| **Total** | **7-12 horas** | **~1 hora** | **~88%** |

---

## 7. Casos de uso en Carvajal

### Donde Kiro agrega valor inmediato:

1. **Estandarizacion de pipelines**: Generar templates consistentes para todos los equipos
2. **Onboarding acelerado**: Nuevos devs productivos mas rapido con asistencia de IA
3. **Documentacion al dia**: Generada junto con cada cambio de infra
4. **Calidad por defecto**: Hooks que validan antes de cada commit
5. **Reduccion de ticket de soporte**: Runbooks generados automaticamente

---

## 8. Preguntas de discusion (5 min)

> 1. Cual es su mayor dolor actual en el ciclo CI/CD?
> 2. Cuanto tiempo dedican a mantener pipelines?
> 3. Como manejan la documentacion de infraestructura hoy?

---

## Resumen

```
┌─────────────────────────────────────────────────┐
│  KEY TAKEAWAYS                                  │
├─────────────────────────────────────────────────┤
│                                                 │
│  ✓ DevOps = velocidad + calidad + repetibilidad │
│  ✓ Kiro no reemplaza DevOps, lo acelera         │
│  ✓ Prompts bien escritos = pipelines en minutos │
│  ✓ Hooks = calidad automatica sin friccion      │
│  ✓ El valor esta en la consistencia             │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## Siguiente: [Lab 1 - Setup de Kiro →](./lab1/README.md)
