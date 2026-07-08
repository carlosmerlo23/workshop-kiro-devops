# Code Challenge: DevOps Sprint con Kiro

## Duracion: 45 minutos (10:45 - 11:30)

---

## Formato

**Competencia por equipos** (2-3 personas por equipo)

Cada equipo debe completar un escenario DevOps end-to-end usando Kiro en el menor tiempo posible, con la mayor calidad.

---

## Reglas

1. **Tiempo**: 30 minutos para completar el challenge
2. **Herramienta**: Solo Kiro (prompts, specs, hooks)
3. **Equipos**: 2-3 personas. Uno conduce, los demas apoyan con ideas de prompts
4. **Entrega**: Push del resultado a un branch `challenge/equipo-N`
5. **Evaluacion**: 15 minutos para revisar y votar (11:30 - 12:00)

---

## El Escenario

> **Contexto**: El equipo de Carvajal necesita poner en produccion un nuevo
> microservicio de notificaciones que envia emails y SMS a clientes.
> Tienes 30 minutos para generar toda la infraestructura DevOps necesaria.

---

## Entregables requeridos

Cada equipo debe generar con Kiro los siguientes artefactos:

### 1. Codigo del servicio (3 puntos)

Archivo: `src/notification-service.js`

- Funcion Lambda que recibe un evento con: `type` (email/sms), `recipient`, `message`
- Validacion de inputs
- Manejo de errores
- Logs estructurados

### 2. Tests (3 puntos)

Archivo: `tests/notification-service.test.js`

- Minimo 5 tests cubriendo happy path y errores
- Cobertura de ambos tipos (email y sms)
- Test de validacion de inputs

### 3. Pipeline CI (3 puntos)

Archivo: `.github/workflows/notification-ci.yml`

- Lint, test, build
- Matrix con Node 18 y 20
- Caching de dependencias
- Badge en README

### 4. Infraestructura (3 puntos)

Archivo: `infra/terraform/modules/notifications/main.tf`

- Lambda function
- SQS queue para buffering
- Dead Letter Queue
- IAM role con permisos minimos
- Variables y outputs

### 5. Monitoreo (3 puntos)

Archivo: `infra/terraform/modules/notifications/monitoring.tf`

- Alarma de errores Lambda
- Alarma de DLQ no vacia
- Alarma de throttling

### 6. Documentacion (3 puntos)

Archivo: `docs/NOTIFICATION-SERVICE.md`

- Diagrama de arquitectura
- Como funciona el servicio
- Configuracion requerida
- Troubleshooting

### 7. Bonus: Hook de calidad (+2 puntos)

Archivo: `.kiro/hooks/notification-quality.json`

- Hook que valide que cambios al servicio incluyan test actualizado

---

## Tabla de puntuacion

| Entregable | Puntos | Criterio |
|-----------|--------|----------|
| Codigo del servicio | 0-3 | Funcional, limpio, con validacion |
| Tests | 0-3 | Cobertura, edge cases, claridad |
| Pipeline CI | 0-3 | Completo, funcional, buenas practicas |
| Infraestructura | 0-3 | Recursos correctos, seguridad |
| Monitoreo | 0-3 | Alarmas relevantes, umbrales sensatos |
| Documentacion | 0-3 | Clara, util, completa |
| Bonus: Hook | 0-2 | Creativo y funcional |
| **Total** | **20** | |

### Criterios de evaluacion

- **3 puntos**: Completo, funcional, sigue buenas practicas
- **2 puntos**: Funcional pero incompleto o con mejoras obvias
- **1 punto**: Parcial, necesita trabajo significativo
- **0 puntos**: No entregado o no funcional

---

## Estrategia sugerida

### Distribucion de tiempo (30 min):

```
┌──────────────────────────────────────────────────────┐
│  Min 0-5   → Setup: crear branch, decidir prompts   │
│  Min 5-12  → Codigo + Tests (usar un prompt combo)  │
│  Min 12-20 → Pipeline CI + Infra (paralelo si hay   │
│               2 personas con Kiro)                   │
│  Min 20-26 → Monitoreo + Docs                       │
│  Min 26-30 → Bonus hook + commit + push             │
└──────────────────────────────────────────────────────┘
```

### Prompts sugeridos (pista, no obligatorios):

**Prompt combo para codigo + tests:**
> "Crea un servicio de notificaciones en `src/notification-service.js`
> que sea una Lambda function. Recibe eventos con type (email/sms),
> recipient y message. Valida inputs, maneja errores, y usa logs
> estructurados. Genera tambien los tests en `tests/notification-service.test.js`
> con al menos 5 tests cubriendo happy path, validacion y errores."

**Prompt para infra completa:**
> "Genera un modulo Terraform en `infra/terraform/modules/notifications/`
> con: Lambda, SQS queue, DLQ, IAM role con least privilege.
> Agrega alarmas CloudWatch para errores, DLQ y throttling en un
> archivo monitoring.tf separado."

---

## Setup del challenge

### Antes de empezar (facilitador):

```bash
# Cada equipo crea su branch
git checkout -b challenge/equipo-1
# (equipo 2: challenge/equipo-2, etc.)
```

### Entrega:

```bash
git add -A
git commit -m "challenge: entrega equipo N - servicio de notificaciones"
git push origin challenge/equipo-N
```

---

## Evaluacion y premiacion (10 min)

### Dinamica de review:

1. Cada equipo muestra su resultado en 2 minutos (pantalla compartida)
2. El grupo vota por el mejor en cada categoria
3. El facilitador suma puntos

### Premios sugeridos:

| Posicion | Premio |
|----------|--------|
| 1er lugar | "DevOps Champion" + reconocimiento |
| 2do lugar | "Pipeline Master" |
| 3er lugar | "Quick Deployer" |
| Mejor prompt | "Prompt Engineer" (votacion del grupo) |

---

## Cierre del workshop

### Reflexion final (5 min)

Preguntas para el grupo:

1. Que fue lo mas sorprendente de usar Kiro para DevOps?
2. Cuanto tiempo les hubiera tomado sin Kiro?
3. Que van a implementar primero en su equipo esta semana?

### Compromisos de accion

> Cada participante comparte en el chat:
> "Esta semana voy a usar Kiro para _______________"

### Mensaje de cierre

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  Kiro + DevOps = Velocidad sin sacrificar calidad       │
│                                                         │
│  Lo que aprendieron hoy:                                │
│  ✓ Steering para estandarizar al equipo                 │
│  ✓ Prompts para generar pipelines en minutos            │
│  ✓ Tests y documentacion como ciudadanos de primera     │
│  ✓ IaC generada, validada y documentada                 │
│  ✓ Monitoreo y operaciones desde el codigo              │
│                                                         │
│  El proximo paso es suyo. Experimenten, iteren,         │
│  y compartan lo que descubran con el equipo.            │
│                                                         │
│  Gracias Carvajal!                                      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Recursos post-workshop

| Recurso | Link |
|---------|------|
| Kiro docs | https://kiro.dev/docs |
| GitHub Actions | https://docs.github.com/en/actions |
| Terraform AWS | https://registry.terraform.io/providers/hashicorp/aws |
| Repositorio del workshop | [URL del repo compartido] |
| Canal de soporte | [Slack/Teams del equipo] |

---

## Feedback final

> Encuesta de cierre: [Link TBD]
>
> Tu feedback nos ayuda a mejorar futuros workshops.
> Gracias por tu tiempo y energia!
