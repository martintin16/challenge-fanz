# Fanzly — Demo

Agente interno estilo Amazon Q, conectado al contexto de Fanz. Aprende de la documentación oficial, responde preguntas sobre la plataforma y ejecuta acciones sobre una cuenta mock.

🔗 **[challenge-fanz.vercel.app](https://challenge-fanz.vercel.app)**

---

## Cuenta mock

No requiere login. Al entrar ya estás dentro de la cuenta de prueba con la informacion desde la bd:

| Campo             | Valor                       |
| ----------------- | --------------------------- |
| Organizador       | Martin Iglesias             |
| Email             | martin.iglesias21@gmail.com |
| Eventos activos   | 3                           |
| Evento finalizado | 1                           |

### Eventos disponibles

| Nombre                  | Capacidad | Vendidos | Estado     |
| ----------------------- | --------- | -------- | ---------- |
| Festival de Verano 2026 | 1.000     | 620      | Activo     |
| Noche de Jazz & Blues   | 500       | 340      | Activo     |
| Congreso Tech 2026      | 300       | 185      | Activo     |
| Show de Comedia         | 200       | 200      | Finalizado |

---

## Qué puede hacer el agente

### Preguntas sobre la plataforma

El agente busca en la documentación oficial de `ayuda.fanz.com.ar` y cita la fuente de cada respuesta. Puede responder preguntas generales, específicas, ambiguas o mal redactadas.

```
¿Cómo creo un evento?
¿Cuánto cobra Fanz por entrada?
¿Cómo conecto MercadoPago?
¿Qué es Fanz AI?
kmo configuro los pagos         ← mal escrito, igual responde
el tema de las entradas         ← ambiguo, pide aclaración
```

### Acciones sobre la cuenta mock

El agente puede leer y modificar datos reales de la cuenta en Supabase.

```
Mostrá mis eventos
¿Cuánto recaudé en el Festival de Verano?
Mostrá las ventas del evento 2
Cambiá el precio del Congreso Tech a $9.000
Dame un resumen de mi cuenta
```

### Manejo de ambigüedad

Si el pedido es incompleto, el agente pide aclaración en vez de inventar:

```
Usuario: "mostrá las ventas"
Agente:  lista los eventos y pregunta cuál
```

---

## Qué implementé

- **RAG sobre documentación real** — 236 artículos de `ayuda.fanz.com.ar` indexados con embeddings de Voyage AI y almacenados en Supabase con pgvector. El agente busca por similitud semántica, no por palabras clave.

- **Agentic loop con tools** — Claude decide qué herramienta usar según el pedido. Puede encadenar múltiples tools antes de responder.

- **5 tools de acción**
  - `buscar_documentacion` — RAG sobre ayuda de Fanz
  - `ver_eventos` — lista eventos de la cuenta
  - `ver_ventas_evento` — detalle de ventas por evento
  - `actualizar_precio_evento` — modifica precio en DB
  - `resumen_cuenta` — métricas generales

- **Streaming con trazabilidad** — mientras el agente trabaja se muestra en tiempo real qué está haciendo (buscando, ejecutando tool, armando respuesta).

- **Citas de fuente** — cada respuesta basada en documentación muestra la URL de origen.

---

## Stack

| Parte           | Tecnología                     |
| --------------- | ------------------------------ |
| Frontend        | Nuxt 3 + Tailwind CSS          |
| Backend         | Node.js + Express + TypeScript |
| LLM             | Claude (Anthropic)             |
| Embeddings      | Voyage AI (voyage-3)           |
| Vector DB       | Supabase + pgvector            |
| Deploy frontend | Vercel                         |
| Deploy backend  | Railway                        |

---

## Repositorios

- **Frontend:** [github.com/martintin16/challenge-fanz](https://github.com/martintin16/challenge-fanz)
- **Backend:** [github.com/martintin16/challenge-fanz-backend](https://github.com/martintin16/challenge-fanz-backend)
