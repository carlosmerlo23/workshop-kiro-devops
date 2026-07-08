# Guia del Facilitador - Workshop DevOps con Kiro

## Informacion confidencial (no compartir con participantes)

---

## Perfil del facilitador requerido

- Experiencia con CI/CD (GitHub Actions preferible)
- Familiaridad con Kiro IDE (al menos 2 semanas de uso)
- Conocimientos basicos de Terraform/CloudFormation
- Capacidad de improvisar demos en vivo
- Buen manejo de grupo y timing

---

## Preparacion previa (1 semana antes)

### Checklist del facilitador

- [ ] Verificar que Kiro IDE esta actualizado a la ultima version
- [ ] Tener un repositorio de prueba preparado como backup
- [ ] Preparar un repositorio "solucion" con todos los labs completados
- [ ] Probar cada lab end-to-end (verificar que los prompts generan resultados correctos)
- [ ] Tener slides de apoyo para la sesion teorica (opcional)
- [ ] Confirmar acceso a internet estable para todos
- [ ] Preparar canal de comunicacion (Slack/Teams) para soporte en vivo
- [ ] Enviar email de pre-requisitos a participantes (3 dias antes)

### Email de pre-requisitos (template)

```
Asunto: [Workshop Kiro DevOps] Preparacion para el workshop

Hola equipo Carvajal,

El 9 y 10 de julio tendremos el workshop de DevOps con Kiro (8:00 AM - 12:00 PM
ambos dias). Para aprovechar al maximo el tiempo, necesitamos que preparen
lo siguiente:

1. Instalar Kiro IDE: https://kiro.dev
   - Crear cuenta con AWS Builder ID (gratis)
   - Verificar que abre correctamente

2. Verificar Git:
   - git --version (debe ser 2.30+)
   - Tener cuenta GitHub activa
   - Poder hacer push a un repo propio

3. Node.js 18+:
   - node --version
   - npm --version

4. Crear un repositorio de prueba en GitHub:
   - Nombre sugerido: kiro-devops-workshop
   - Publico o privado (a su preferencia)

Si tienen problemas con la instalacion, contactenme antes del 7 de julio
para resolverlo.

Saludos,
[Facilitador]
```

---

## Repositorio solucion (backup)

Tener preparado un repositorio con todos los artefactos generados para usar como referencia o backup si algo falla:

```
workshop-solution/
├── .kiro/
│   ├── steering/
│   │   ├── devops-standards.md
│   │   ├── project-context.md
│   │   └── iac-standards.md
│   └── hooks/
│       ├── remind-tests.json
│       ├── docs-reminder.json
│       └── notification-quality.json
├── .github/
│   ├── workflows/
│   │   ├── ci.yml
│   │   ├── pr-validation.yml
│   │   └── release.yml
│   └── labeler.yml
├── src/
│   ├── utils.js
│   ├── health.js
│   ├── notification-service.js
│   └── status-page.js
├── tests/
│   ├── utils.test.js
│   ├── health.test.js
│   └── notification-service.test.js
├── infra/
│   ├── terraform/
│   │   ├── modules/
│   │   │   ├── webapp/
│   │   │   ├── notifications/
│   │   │   └── monitoring/
│   │   └── environments/dev/
│   └── cloudformation/webapp.yaml
├── docs/
│   ├── PIPELINE.md
│   ├── RUNBOOK.md
│   ├── INFRASTRUCTURE.md
│   ├── SOP.md
│   ├── INCIDENT-PLAYBOOK.md
│   └── NOTIFICATION-SERVICE.md
├── scripts/
│   └── validate-terraform.sh
└── package.json
```

---

## Timing detallado por sesion

### Day 1 (Jueves 9 de julio, 8:00 - 12:00)

| Hora | Sesion | Notas del facilitador |
|------|--------|----------------------|
| 8:00-8:15 | Bienvenida | Romper el hielo rapido. Verificar prerequisites. |
| 8:15-8:45 | Teoria DevOps+Kiro | No abusar de slides. Demo corta de 2 min mostrando Kiro en accion. |
| 8:45-9:30 | Lab 1 | Este es el lab mas critico. Si alguien no completa setup, queda atrasado todo el dia. |
| 9:30-10:30 | Lab 2 | El lab mas largo. Ajustar si van rapido: saltar Parte 4 (Release). |
| 10:30-10:45 | Break | Aprovechar para ayudar a rezagados. Descanso mental antes del taller. |
| 10:45-11:15 | Taller practico | Si van cortos de tiempo, enfocar solo en tests (skip docs). |
| 11:15-11:45 | Revision | No forzar presentaciones si el grupo es timido. Hacer tu la revision mostrando ejemplos. |
| 11:45-12:00 | Cierre | Motivar para el Dia 2. Dejar tarea: "prueben Kiro en algo de su proyecto real". |

### Day 2 (Viernes 10 de julio, 8:00 - 12:00)

| Hora | Sesion | Notas del facilitador |
|------|--------|----------------------|
| 8:00-8:15 | Recap | Preguntar que probaron entre Dia 1 y Dia 2. Energia alta. |
| 8:15-9:15 | Lab 3 | Si nadie conoce Terraform, enfocarse en CloudFormation o hacer demo-driven. |
| 9:15-9:30 | Break | Aprovechar para ayudar con dudas de IaC. |
| 9:30-10:30 | Lab 4 | Este lab es mas sobre documentacion que sobre codigo. Algunos equipos iran rapido. |
| 10:30-10:45 | Break | Preparar el Code Challenge (formar equipos). |
| 10:45-11:30 | Challenge | Energia competitiva. Timer visible. Musica de fondo opcional. |
| 11:30-12:00 | Presentacion y cierre | Cada equipo presenta en 2 min. Votacion. Premiacion. Feedback. |

---

## Manejo de situaciones comunes

### "Kiro no genera lo que espero"

**Solucion**: Mostrar como iterar. El primer prompt no tiene que ser perfecto.
- Agregar mas contexto
- Ser mas especifico con versiones y paths
- Usar steering para establecer defaults

### "Mi pipeline tiene errores de sintaxis"

**Solucion**: Esto es normal y parte del aprendizaje.
- Pedir a Kiro: "Este workflow tiene un error: [pegar error]. Corrigelo."
- Mostrar que la iteracion es el flujo natural

### "No tengo experiencia con Terraform"

**Solucion**: Enfatizar que Kiro genera y explica.
- Pedir a Kiro: "Explicame que hace cada recurso en este archivo Terraform"
- Ofrecer la alternativa CloudFormation
- Mostrar que el valor es aprender la estructura, no memorizarla

### "Esto parece magia, pero no confio en el resultado"

**Solucion**: Excelente punto! Mostrar el flujo de verificacion:
1. Kiro genera → Tu revisas → Kiro valida → Tu apruebas
2. Nunca deploy sin revision humana
3. Los hooks y CI son la red de seguridad

### "Voy mucho mas rapido que el grupo"

**Solucion**: Darle ejercicios extra:
- "Genera un pipeline multi-stage con aprobacion manual"
- "Crea un modulo Terraform para ECS Fargate"
- "Implementa canary deploys en el pipeline"

### "Voy mucho mas lento que el grupo"

**Solucion**: 
- Pair con alguien avanzado
- Usar el repo solucion como referencia
- Enfocarse en los conceptos, no en completar todo

---

## Tips para demos en vivo

### Preparar antes de la demo:

1. Tener Kiro abierto con un proyecto limpio
2. Sesion Vibe lista para escribir
3. Terminal visible
4. Font size grande (18+) para presentar

### Durante la demo:

```
┌─────────────────────────────────────────────────────┐
│  REGLAS DE LA DEMO EN VIVO                          │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ✓ Narrar mientras escribes el prompt               │
│  ✓ Explicar POR QUE el prompt esta escrito asi      │
│  ✓ Mostrar el resultado y analizarlo con el grupo   │
│  ✓ Si algo falla: es una oportunidad de aprendizaje │
│  ✓ Iterar en vivo: "esto no quedo bien, mejoremos"  │
│  ✗ No copiar/pegar prompts pre-escritos sin leerlos │
│  ✗ No correr si Kiro tarda — explicar mientras      │
│  ✗ No panic si genera algo inesperado               │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Si Kiro genera algo incorrecto en vivo:

> "Perfecto, esto nos pasa a todos. Vean como itero:
> [ajustar el prompt y regenerar]
> La clave es que Kiro aprende del contexto. Cada iteracion mejora."

---

## Metricas de exito del workshop

### Cuantitativas (medir al final):

| Metrica | Objetivo minimo |
|---------|----------------|
| Participantes que completaron Lab 1 | 100% |
| Participantes que generaron al menos 1 pipeline | 90% |
| Participantes que generaron tests | 80% |
| Equipos que entregaron Code Challenge | 100% |
| NPS del workshop | > 8/10 |

### Cualitativas (observar):

- Nivel de engagement durante los labs
- Calidad de preguntas (van subiendo de nivel?)
- Creatividad en los prompts
- Colaboracion entre participantes
- Entusiasmo en el Code Challenge

---

## Materiales a llevar/preparar

### Si es presencial:

- [ ] Laptop con Kiro + repo solucion
- [ ] Adaptador HDMI/USB-C para proyectar
- [ ] Extension electrica (participantes necesitan cargar)
- [ ] Stickers/premios para el Code Challenge
- [ ] Tarjetas con prompts de referencia (impresas, opcional)
- [ ] WiFi estable verificada previamente

### Si es virtual:

- [ ] Compartir pantalla probado (Zoom/Teams/Meet)
- [ ] Breakout rooms configurados para el Code Challenge
- [ ] Repo compartido donde todos puedan ver cambios
- [ ] Timer compartido visible (timeanddate.com o similar)
- [ ] Backup de grabacion (pedir permiso)

---

## Prompt cheat sheet (para ayudar participantes)

Imprimir o compartir esta hoja de referencia:

```
╔══════════════════════════════════════════════════════════╗
║  PROMPT CHEAT SHEET - DevOps con Kiro                   ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  PIPELINE CI:                                            ║
║  "Genera un workflow de GitHub Actions en [path]         ║
║   que ejecute [steps] con Node.js [version]              ║
║   cuando [trigger]"                                      ║
║                                                          ║
║  TESTS:                                                  ║
║  "Genera tests en [path] para [archivo] cubriendo        ║
║   happy path, edge cases y errores. Minimo [N] tests"   ║
║                                                          ║
║  TERRAFORM:                                              ║
║  "Genera un modulo Terraform en [path] que cree          ║
║   [recursos] con variables para [params] y outputs"     ║
║                                                          ║
║  DOCUMENTACION:                                          ║
║  "Documenta [que] en [path] incluyendo diagrama,         ║
║   pasos, troubleshooting y contacto del equipo"         ║
║                                                          ║
║  DEBUGGING:                                              ║
║  "Este [tipo archivo] falla con: [error].                ║
║   Diagnostica y corrige el problema"                    ║
║                                                          ║
║  STEERING:                                               ║
║  "Crea un steering en .kiro/steering/[nombre].md        ║
║   que defina [estandares/reglas/contexto]"              ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
```

---

## Plan de contingencia

| Problema | Plan B |
|----------|--------|
| Internet cae | Tener demos pre-grabadas en video local |
| Kiro tiene outage | Pivotar a teoria + discusion + planeacion manual |
| Nadie completa setup | Compartir pantalla y hacer lab grupal (driver/navigator) |
| Van muy rapido | Agregar ejercicios extra de cada lab |
| Van muy lento | Reducir scope: skip release pipeline, skip CloudFormation |
| Grupo desenganchado | Pivot a formato competitivo antes: mini-challenges entre labs |
| Alguien con problemas tecnicos | Pair programming con vecino mientras resuelves |

---

## Post-workshop (seguimiento)

### Dia siguiente:
- [ ] Enviar email de agradecimiento con links a recursos
- [ ] Compartir repositorio solucion
- [ ] Enviar encuesta de feedback
- [ ] Compartir grabacion (si fue virtual)

### Semana siguiente:
- [ ] Office hours opcionales (30 min) para resolver dudas
- [ ] Revisar feedback y documentar aprendizajes
- [ ] Proponer siguiente paso con Carvajal (adopcion, mas workshops, etc.)

### Template email post-workshop:

```
Asunto: [Workshop Kiro DevOps] Materiales y proximos pasos

Hola equipo Carvajal,

Gracias por la energia de hoy en el workshop! Aqui van los recursos:

📁 Repositorio del workshop: [URL]
📁 Repositorio solucion: [URL]
📝 Encuesta de feedback: [URL]
📚 Documentacion de Kiro: https://kiro.dev/docs

Proximos pasos sugeridos:
1. Instalar Kiro en su proyecto actual
2. Crear steering con los estandares de su equipo
3. Generar un pipeline para un servicio existente
4. Compartir aprendizajes con el resto del equipo

Si tienen preguntas, estoy disponible en [canal].

Office hours opcionales: [FECHA] a las [HORA].

Saludos,
[Facilitador]
```

---

## Notas finales

> El exito de este workshop se mide por lo que los participantes
> hacen DESPUES, no durante. El objetivo es que salgan motivados
> y con las herramientas para ser autonomos con Kiro.
>
> Mantener el ritmo alto, los ejercicios practicos, y la energia
> positiva. DevOps puede ser intimidante — Kiro lo hace accesible.
