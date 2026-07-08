# Lab 3: Plantillas de IaC (Terraform/CloudFormation) Generadas por Kiro

## Duracion: 60 minutos (8:15 - 9:15)

---

## Objetivo

Usar Kiro para generar plantillas de Infrastructure as Code sin necesidad de conocer la sintaxis a fondo. Kiro genera, explica y valida los recursos por ti.

---

## Lo que vas a lograr

- [ ] Generar un modulo Terraform completo para un servicio web
- [ ] Generar un template CloudFormation equivalente
- [ ] Crear variables, outputs y documentacion de la infra
- [ ] Usar Spec session para planificar infra compleja
- [ ] Validar plantillas generadas con herramientas de lint

---

## Importante: DevOps ligero (sin desplegar)

> En este lab **no vamos a desplegar infraestructura real**.
> Generamos, validamos y documentamos plantillas.
> El objetivo es aprender a usar Kiro como acelerador de IaC.

---

## Parte 1: Terraform basico con Kiro (20 min)

### 1.1 Preparar estructura

```bash
mkdir -p infra/terraform/{modules/webapp,environments/{dev,prod}}
```

### 1.2 Generar modulo Terraform para aplicacion web

> **Prompt para Kiro:**
> "Genera un modulo Terraform en `infra/terraform/modules/webapp/` que
> cree los siguientes recursos en AWS:
> - S3 bucket para assets estaticos con versionado habilitado
> - CloudFront distribution apuntando al bucket
> - Bucket policy que solo permita acceso desde CloudFront
>
> Incluye:
> - variables.tf con variables documentadas (nombre del proyecto, ambiente, tags)
> - outputs.tf con URLs y ARNs relevantes
> - main.tf con los recursos
> - README.md documentando el modulo
>
> Usa Terraform 1.5+ y provider AWS 5.x. Agrega comentarios en espanol."

### Resultado esperado - main.tf (fragmento):

```hcl
# infra/terraform/modules/webapp/main.tf

# ─────────────────────────────────────────────
# Bucket S3 para assets estaticos
# ─────────────────────────────────────────────
resource "aws_s3_bucket" "assets" {
  bucket = "${var.project_name}-${var.environment}-assets"

  tags = merge(var.tags, {
    Name        = "${var.project_name}-assets"
    Environment = var.environment
  })
}

# Habilitar versionado para rollback de assets
resource "aws_s3_bucket_versioning" "assets" {
  bucket = aws_s3_bucket.assets.id
  versioning_configuration {
    status = "Enabled"
  }
}

# ─────────────────────────────────────────────
# CloudFront Distribution
# ─────────────────────────────────────────────
resource "aws_cloudfront_distribution" "cdn" {
  origin {
    domain_name              = aws_s3_bucket.assets.bucket_regional_domain_name
    origin_id                = "S3-${aws_s3_bucket.assets.id}"
    origin_access_control_id = aws_cloudfront_origin_access_control.oac.id
  }

  enabled             = true
  default_root_object = "index.html"
  price_class         = "PriceClass_100"

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "S3-${aws_s3_bucket.assets.id}"
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = var.tags
}

# ─────────────────────────────────────────────
# Origin Access Control para seguridad S3-CloudFront
# ─────────────────────────────────────────────
resource "aws_cloudfront_origin_access_control" "oac" {
  name                              = "${var.project_name}-${var.environment}-oac"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}
```

### Resultado esperado - variables.tf:

```hcl
# infra/terraform/modules/webapp/variables.tf

variable "project_name" {
  description = "Nombre del proyecto (se usa como prefijo de recursos)"
  type        = string

  validation {
    condition     = can(regex("^[a-z0-9-]+$", var.project_name))
    error_message = "El nombre del proyecto solo puede contener minusculas, numeros y guiones"
  }
}

variable "environment" {
  description = "Ambiente de despliegue (dev, staging, prod)"
  type        = string

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "El ambiente debe ser dev, staging o prod"
  }
}

variable "tags" {
  description = "Tags comunes para todos los recursos"
  type        = map(string)
  default = {
    ManagedBy = "Terraform"
    Team      = "Carvajal-DevOps"
  }
}
```

### 1.3 Generar configuracion de ambiente

> **Prompt:**
> "Genera un archivo `infra/terraform/environments/dev/main.tf` que
> use el modulo webapp con valores para ambiente de desarrollo.
> Incluye el provider AWS apuntando a us-east-1 y un backend S3
> para el state (comentado, para no requerir infra previa)."

---

## Parte 2: CloudFormation con Kiro (15 min)

### 2.1 Generar template equivalente

> **Prompt:**
> "Genera un template de CloudFormation en `infra/cloudformation/webapp.yaml`
> que cree los mismos recursos que el modulo Terraform anterior:
> - S3 bucket con versionado
> - CloudFront distribution
> - Bucket policy
>
> Usa formato YAML, incluye Parameters para nombre de proyecto y ambiente,
> Outputs con las URLs, y Metadata con descripcion. Comentarios en espanol."

### Resultado esperado (estructura):

```yaml
# infra/cloudformation/webapp.yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: |
  Stack para aplicacion web estatica con S3 + CloudFront.
  Generado con Kiro - Workshop DevOps Carvajal.

Metadata:
  AWS::CloudFormation::Interface:
    ParameterGroups:
      - Label:
          default: "Configuracion General"
        Parameters:
          - ProjectName
          - Environment

Parameters:
  ProjectName:
    Type: String
    Description: Nombre del proyecto
    AllowedPattern: '^[a-z0-9-]+$'

  Environment:
    Type: String
    Description: Ambiente de despliegue
    AllowedValues:
      - dev
      - staging
      - prod

Resources:
  # Bucket para assets estaticos
  AssetsBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: !Sub '${ProjectName}-${Environment}-assets'
      VersioningConfiguration:
        Status: Enabled
      Tags:
        - Key: Environment
          Value: !Ref Environment
        - Key: ManagedBy
          Value: CloudFormation

  # ... (CloudFront, OAC, BucketPolicy)

Outputs:
  CloudFrontURL:
    Description: URL de la distribucion CloudFront
    Value: !GetAtt CDNDistribution.DomainName

  BucketARN:
    Description: ARN del bucket de assets
    Value: !GetAtt AssetsBucket.Arn
```

### 2.2 Comparar Terraform vs CloudFormation

> **Prompt:**
> "Crea una tabla comparativa entre el modulo Terraform y el template
> CloudFormation que generamos. Incluye: lineas de codigo, legibilidad,
> flexibilidad, curva de aprendizaje, y estado del ecosistema."

---

## Parte 3: IaC avanzada con Spec Session (15 min)

### 3.1 Usar Spec para infra compleja

Para infraestructura mas compleja, usa una sesion Spec:

> **Iniciar Spec Session:**
> "Necesito disenar la infraestructura para un microservicio que:
> - Corre en AWS Lambda detras de API Gateway
> - Tiene una base de datos DynamoDB
> - Usa SQS para procesamiento asincrono
> - Necesita un Dead Letter Queue para mensajes fallidos
> - Tiene alarmas de CloudWatch para errores y latencia
>
> Genera la plantilla Terraform con modulos separados para cada componente."

Observa como Kiro:
1. Define los requisitos de infraestructura
2. Propone la arquitectura y modulos
3. Genera el plan de implementacion
4. Ejecuta modulo por modulo

### 3.2 Resultado esperado de la Spec

```
infra/terraform/modules/
├── webapp/          (ya creado)
├── api/             (API Gateway + Lambda)
│   ├── main.tf
│   ├── variables.tf
│   └── outputs.tf
├── database/        (DynamoDB)
│   ├── main.tf
│   ├── variables.tf
│   └── outputs.tf
├── messaging/       (SQS + DLQ)
│   ├── main.tf
│   ├── variables.tf
│   └── outputs.tf
└── monitoring/      (CloudWatch Alarms)
    ├── main.tf
    ├── variables.tf
    └── outputs.tf
```

---

## Parte 4: Validar y documentar IaC (10 min)

### 4.1 Validar sintaxis Terraform

> **Prompt:**
> "Genera un script en `scripts/validate-terraform.sh` que:
> - Ejecute terraform fmt -check en todos los modulos
> - Ejecute terraform validate en cada modulo
> - Reporte errores de forma legible
> - Pueda integrarse en el pipeline CI"

### 4.2 Agregar validacion al pipeline CI

> **Prompt:**
> "Agrega un job al pipeline CI en `.github/workflows/ci.yml` que
> valide los archivos Terraform usando el script de validacion.
> Usa la action hashicorp/setup-terraform para instalar terraform."

### Resultado esperado (job adicional):

```yaml
  validate-terraform:
    name: Validar Terraform
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v3
        with:
          terraform_version: '1.5'

      - name: Terraform Format Check
        run: terraform fmt -check -recursive infra/terraform/

      - name: Terraform Validate
        run: |
          for dir in infra/terraform/modules/*/; do
            echo "Validando: $dir"
            terraform -chdir="$dir" init -backend=false
            terraform -chdir="$dir" validate
          done
```

### 4.3 Generar documentacion de infraestructura

> **Prompt:**
> "Genera un archivo `docs/INFRASTRUCTURE.md` que documente:
> - Diagrama de arquitectura en ASCII/mermaid
> - Lista de modulos Terraform y su proposito
> - Variables requeridas por ambiente
> - Proceso para agregar nuevos recursos
> - Convencion de nombres de recursos"

---

## Parte 5: Steering para IaC (bonus, 5 min)

### 5.1 Crear steering de estandares IaC

> **Prompt:**
> "Crea un steering file en `.kiro/steering/iac-standards.md` con:
> - Usar Terraform 1.5+ con provider AWS 5.x
> - Todos los recursos deben tener tags: Environment, ManagedBy, Team
> - Nombres de recursos siguen: {proyecto}-{ambiente}-{recurso}
> - Variables siempre con description y validation
> - Modulos deben incluir README.md con ejemplos de uso
> - State remoto en S3 con locking en DynamoDB"

---

## Verificacion final

```
infra/
├── terraform/
│   ├── modules/
│   │   └── webapp/
│   │       ├── main.tf            ✓
│   │       ├── variables.tf       ✓
│   │       ├── outputs.tf         ✓
│   │       └── README.md          ✓
│   └── environments/
│       └── dev/
│           └── main.tf            ✓
├── cloudformation/
│   └── webapp.yaml                ✓
scripts/
└── validate-terraform.sh          ✓
docs/
└── INFRASTRUCTURE.md              ✓
```

### Commit

```bash
git add infra/ scripts/ docs/INFRASTRUCTURE.md .kiro/steering/iac-standards.md
git commit -m "feat: agregar plantillas IaC (Terraform + CloudFormation)"
git push origin main
```

---

## Siguiente: [Lab 4 - Monitoreo y documentacion →](../lab4/README.md)
