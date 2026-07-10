# Lab 4: Monitoreo y Documentacion Basica de Operaciones

## Duracion: 60 minutos (9:30 - 10:30)

---

## Objetivo

Usar Kiro para generar configuraciones de monitoreo, alertas, dashboards como codigo, y documentacion operativa completa que permita a cualquier miembro del equipo operar el sistema.

---

## Lo que vas a lograr

- [ ] Generar alarmas de CloudWatch con Terraform
- [ ] Crear un dashboard como codigo (JSON/HCL)
- [ ] Generar health checks y status pages
- [ ] Crear documentacion operativa completa (SOP)
- [ ] Implementar hooks para mantener docs actualizadas
- [ ] Generar un playbook de incidentes

---

## Importante: Enfoque ligero

> No desplegamos infraestructura real.
> Generamos las configuraciones y documentacion que necesitarias
> para operar un servicio en produccion.

---

## Parte 1: Alarmas y monitoreo con Terraform (20 min)

### 1.1 Generar modulo de monitoreo

> **Prompt para Kiro:**
> "Genera un modulo Terraform en `infra/terraform/modules/monitoring/` que cree:
>
> 1. Alarma CloudWatch para errores de Lambda (threshold: 5 errores en 5 min)
> 2. Alarma para latencia de API Gateway (threshold: p99 > 3 segundos)
> 3. Alarma para DLQ con mensajes (threshold: > 0 mensajes)
> 4. Alarma para costos mensuales (threshold: > $100 USD)
> 5. SNS topic para notificaciones con subscription email
> 6. Dashboard CloudWatch con widgets para cada metrica
>
> Variables: nombre del proyecto, ambiente, email de notificacion, umbrales configurables.
> Comentarios en espanol. Provider AWS 5.x."

### Resultado esperado - main.tf (fragmento):

```hcl
# infra/terraform/modules/monitoring/main.tf

# ─────────────────────────────────────────────
# Topic SNS para notificaciones de alarmas
# ─────────────────────────────────────────────
resource "aws_sns_topic" "alerts" {
  name = "${var.project_name}-${var.environment}-alerts"
  tags = var.tags
}

resource "aws_sns_topic_subscription" "email" {
  topic_arn = aws_sns_topic.alerts.arn
  protocol  = "email"
  endpoint  = var.notification_email
}

# ─────────────────────────────────────────────
# Alarma: Errores en Lambda
# ─────────────────────────────────────────────
resource "aws_cloudwatch_metric_alarm" "lambda_errors" {
  alarm_name          = "${var.project_name}-${var.environment}-lambda-errors"
  alarm_description   = "Se dispara cuando hay mas de ${var.lambda_error_threshold} errores en 5 minutos"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "Errors"
  namespace           = "AWS/Lambda"
  period              = 300
  statistic           = "Sum"
  threshold           = var.lambda_error_threshold

  dimensions = {
    FunctionName = var.lambda_function_name
  }

  alarm_actions = [aws_sns_topic.alerts.arn]
  ok_actions    = [aws_sns_topic.alerts.arn]

  tags = var.tags
}

# ─────────────────────────────────────────────
# Alarma: Latencia alta en API Gateway
# ─────────────────────────────────────────────
resource "aws_cloudwatch_metric_alarm" "api_latency" {
  alarm_name          = "${var.project_name}-${var.environment}-api-latency-p99"
  alarm_description   = "Se dispara cuando la latencia p99 supera ${var.latency_threshold_ms}ms"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "Latency"
  namespace           = "AWS/ApiGateway"
  period              = 300
  extended_statistic  = "p99"
  threshold           = var.latency_threshold_ms

  dimensions = {
    ApiName = var.api_gateway_name
  }

  alarm_actions = [aws_sns_topic.alerts.arn]
  tags          = var.tags
}

# ─────────────────────────────────────────────
# Alarma: Mensajes en Dead Letter Queue
# ─────────────────────────────────────────────
resource "aws_cloudwatch_metric_alarm" "dlq_messages" {
  alarm_name          = "${var.project_name}-${var.environment}-dlq-not-empty"
  alarm_description   = "Se dispara cuando hay mensajes en la DLQ (posible fallo en procesamiento)"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "ApproximateNumberOfMessagesVisible"
  namespace           = "AWS/SQS"
  period              = 60
  statistic           = "Sum"
  threshold           = 0

  dimensions = {
    QueueName = var.dlq_name
  }

  alarm_actions = [aws_sns_topic.alerts.arn]
  tags          = var.tags
}
```

### 1.2 Generar variables del modulo

> **Prompt:**
> "Genera el `variables.tf` para el modulo de monitoring con todos los
> umbrales configurables, valores por defecto sensatos, y validaciones."

### Resultado esperado:

```hcl
# infra/terraform/modules/monitoring/variables.tf

variable "project_name" {
  description = "Nombre del proyecto"
  type        = string
}

variable "environment" {
  description = "Ambiente (dev, staging, prod)"
  type        = string
}

variable "notification_email" {
  description = "Email para recibir alertas"
  type        = string

  validation {
    condition     = can(regex("^[^@]+@[^@]+\\.[^@]+$", var.notification_email))
    error_message = "Debe ser un email valido"
  }
}

variable "lambda_function_name" {
  description = "Nombre de la funcion Lambda a monitorear"
  type        = string
}

variable "lambda_error_threshold" {
  description = "Numero de errores Lambda que disparan la alarma"
  type        = number
  default     = 5
}

variable "api_gateway_name" {
  description = "Nombre del API Gateway a monitorear"
  type        = string
}

variable "latency_threshold_ms" {
  description = "Umbral de latencia p99 en milisegundos"
  type        = number
  default     = 3000
}

variable "dlq_name" {
  description = "Nombre de la Dead Letter Queue"
  type        = string
}

variable "tags" {
  description = "Tags comunes"
  type        = map(string)
  default     = {}
}
```

---

## Parte 2: Dashboard como codigo (15 min)

### 2.1 Generar dashboard CloudWatch

> **Prompt:**
> "Agrega al modulo de monitoring un recurso `aws_cloudwatch_dashboard`
> que muestre:
> - Widget de linea: invocaciones Lambda (ultimas 3 horas)
> - Widget de linea: errores Lambda (ultimas 3 horas)
> - Widget de numero: latencia p99 actual del API
> - Widget de numero: mensajes en DLQ
> - Widget de linea: costo acumulado del mes
>
> Organiza el dashboard en 2 filas: metricas de salud arriba, costos abajo."

### Resultado esperado (fragmento):

```hcl
resource "aws_cloudwatch_dashboard" "main" {
  dashboard_name = "${var.project_name}-${var.environment}"

  dashboard_body = jsonencode({
    widgets = [
      {
        type   = "metric"
        x      = 0
        y      = 0
        width  = 12
        height = 6
        properties = {
          title   = "Lambda - Invocaciones y Errores"
          region  = "us-east-1"
          metrics = [
            ["AWS/Lambda", "Invocations", "FunctionName", var.lambda_function_name],
            ["AWS/Lambda", "Errors", "FunctionName", var.lambda_function_name]
          ]
          period = 300
          stat   = "Sum"
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 0
        width  = 6
        height = 6
        properties = {
          title   = "API Gateway - Latencia p99"
          region  = "us-east-1"
          metrics = [
            ["AWS/ApiGateway", "Latency", "ApiName", var.api_gateway_name]
          ]
          period = 300
          stat   = "p99"
        }
      },
      {
        type   = "metric"
        x      = 18
        y      = 0
        width  = 6
        height = 6
        properties = {
          title   = "DLQ - Mensajes pendientes"
          region  = "us-east-1"
          metrics = [
            ["AWS/SQS", "ApproximateNumberOfMessagesVisible", "QueueName", var.dlq_name]
          ]
          period = 60
          stat   = "Sum"
          view   = "singleValue"
        }
      }
    ]
  })
}
```

### 2.2 Health check endpoint

> **Prompt:**
> "Genera un archivo `src/health.js` que exporte un handler de health check
> para Lambda que retorne:
> - status: 'healthy' o 'degraded'
> - version: del package.json
> - timestamp
> - checks: conectividad a DynamoDB y SQS (simulados)
>
> Y genera el test correspondiente en tests/health.test.js"

---

## Parte 3: Documentacion operativa (15 min)

### 3.1 Generar Standard Operating Procedures (SOP)

> **Prompt:**
> "Genera un archivo `docs/SOP.md` (Standard Operating Procedures) que incluya
> procedimientos paso a paso para:
>
> 1. **Deploy a produccion**: pre-requisitos, pasos, verificacion post-deploy
> 2. **Rollback de emergencia**: cuando hacerlo, pasos, verificacion
> 3. **Escalamiento de incidentes**: niveles (P1-P4), tiempos de respuesta, contactos
> 4. **Rotacion de secrets**: cuales rotar, como, cada cuanto
> 5. **Backup y restore**: que se respalda, RTO/RPO, pasos de restore
>
> Formato: pasos numerados, comandos copy-paste, checklists.
> Contexto: equipo de Carvajal operando servicios en AWS."

### Resultado esperado (fragmento):

```markdown
# Standard Operating Procedures (SOP)

## 1. Deploy a Produccion

### Pre-requisitos
- [ ] Todos los tests pasan en CI
- [ ] PR aprobado por al menos 1 reviewer
- [ ] Changelog actualizado
- [ ] No hay alarmas activas en produccion

### Pasos
1. Merge PR a main
2. Verificar que el pipeline CI pasa
3. Crear tag de release:
   ```bash
   git tag v1.x.x
   git push origin v1.x.x
   ```
4. Monitorear el pipeline de release
5. Verificar health check post-deploy:
   ```bash
   curl https://api.carvajal.com/health
   ```

### Verificacion post-deploy
- [ ] Health check retorna 200
- [ ] Dashboard sin errores por 15 minutos
- [ ] Latencia dentro de parametros normales
- [ ] No hay mensajes nuevos en DLQ
```

### 3.2 Generar playbook de incidentes

> **Prompt:**
> "Genera un `docs/INCIDENT-PLAYBOOK.md` con playbooks para los
> escenarios mas comunes:
>
> 1. Lambda con errores altos (>50 errores/min)
> 2. API con latencia degradada (p99 > 5s)
> 3. DLQ acumulando mensajes
> 4. Servicio completamente caido (health check falla)
> 5. Posible brecha de seguridad
>
> Cada playbook debe tener: severidad, sintomas, diagnostico,
> resolucion, y post-mortem checklist."

### Resultado esperado (fragmento de un playbook):

```markdown
## Playbook: Lambda con errores altos

### Severidad: P2 (Alta)

### Sintomas
- Alarma `lambda-errors` activada
- Dashboard muestra spike de errores
- Posibles timeouts reportados por usuarios

### Diagnostico (5 min max)
1. Revisar logs recientes:
   ```bash
   aws logs tail /aws/lambda/FUNCTION_NAME --since 15m --format short
   ```
2. Identificar patron de error (timeout, memoria, codigo)
3. Verificar si hay deploy reciente:
   ```bash
   aws lambda get-function --function-name FUNCTION_NAME \
     --query 'Configuration.LastModified'
   ```

### Resolucion
| Causa | Accion |
|-------|--------|
| Deploy reciente con bug | Rollback al version anterior |
| Timeout por dependencia | Verificar estado de downstream |
| Out of memory | Incrementar memoria de Lambda |
| Error en datos de entrada | Revisar payload en DLQ |

### Post-mortem checklist
- [ ] Incidente documentado en [sistema de tickets]
- [ ] Root cause identificado
- [ ] Fix permanente creado (PR)
- [ ] Alarma ajustada si es necesario
- [ ] Equipo notificado del resolucion
```

---

## Parte 4: Automatizar con hooks (10 min)

### 4.1 Hook: Actualizar docs cuando cambie infra

> **Prompt:**
> "Crea un hook que cuando se modifique cualquier archivo .tf en
> el directorio infra/, me sugiera actualizar docs/INFRASTRUCTURE.md
> y docs/SOP.md con los cambios realizados."

### 4.2 Hook: Validar que alarmas existan para nuevos recursos

> **Prompt:**
> "Crea un hook de tipo agent que cuando se cree un archivo .tf nuevo,
> recuerde al usuario que todo recurso nuevo debe tener alarma de
> monitoreo asociada en el modulo de monitoring."

### Resultado:

```json
{
  "version": "v1",
  "hooks": [
    {
      "name": "Recordar monitoreo para nuevos recursos",
      "trigger": "PostFileCreate",
      "matcher": "infra/.*\\.tf$",
      "action": {
        "type": "agent",
        "prompt": "Se ha creado un nuevo archivo Terraform. Recuerda al usuario que todo recurso nuevo debe tener: 1) Alarma CloudWatch asociada en el modulo monitoring, 2) Widget en el dashboard, 3) Entrada en el playbook de incidentes."
      }
    },
    {
      "name": "Actualizar docs cuando cambie infra",
      "trigger": "PostFileSave",
      "matcher": "infra/.*\\.tf$",
      "action": {
        "type": "agent",
        "prompt": "Se ha modificado un archivo de infraestructura. Sugiere al usuario actualizar docs/INFRASTRUCTURE.md y docs/SOP.md para reflejar los cambios."
      }
    }
  ]
}
```

---

## Parte 5: Generar status page interna (bonus)

> **Prompt:**
> "Genera un archivo `src/status-page.js` que sea una funcion Lambda
> que retorne un HTML simple con:
> - Estado de cada servicio (Lambda, API, DB, Queue)
> - Ultima vez que se verifico
> - Historial de incidentes (ultimas 24h, hardcodeado como ejemplo)
> - Estilo CSS inline, responsive, colores verde/amarillo/rojo
>
> No necesita conectar a servicios reales, usa datos de ejemplo."

---

## Verificacion final

```
infra/terraform/modules/monitoring/
├── main.tf              ✓ Alarmas + Dashboard
├── variables.tf         ✓ Umbrales configurables
├── outputs.tf           ✓ ARNs de alarmas y topic
└── README.md            ✓ Documentacion del modulo

docs/
├── PIPELINE.md          ✓ (del Dia 1)
├── RUNBOOK.md           ✓ (del Dia 1)
├── INFRASTRUCTURE.md    ✓ (del Lab 3)
├── SOP.md               ✓ Procedimientos operativos
└── INCIDENT-PLAYBOOK.md ✓ Playbooks de incidentes

src/
├── utils.js             ✓ (del Dia 1)
├── health.js            ✓ Health check
└── status-page.js       ✓ Status page (bonus)
```

### Commit

```bash
git add infra/terraform/modules/monitoring/ docs/ src/health.js .kiro/hooks/
git commit -m "feat: agregar monitoreo, alarmas, SOP y playbook de incidentes"
git push origin main
```

> **Nota Windows**: Si las rutas con `/` fallan en CMD, usa `git add -A` como alternativa o usa Git Bash. Los comandos `curl` y `aws` que aparecen en los documentos generados (SOP, Runbook) son ejemplos para entornos de produccion, no necesitas ejecutarlos durante el lab.

---

## Siguiente: [Code Challenge →](../code-challenge/README.md)
