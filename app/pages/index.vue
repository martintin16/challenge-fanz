<template>
  <div class="flex h-screen bg-gray-950 text-white">
    <ClientSidebar
      title="Cuenta Mock"
      :name="clientName"
      footer-text="Powered by Fanz"
    >
      <div class="space-y-2">
        <p class="text-xs text-gray-500 uppercase tracking-wider">Métricas</p>
        <InfoCard>
          <div class="flex justify-between text-sm">
            <span class="text-gray-400">Ingresos</span>
            <span class="font-medium">$2.450.800</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-400">Tickets vendidos</span>
            <span class="font-medium">1.847</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-400">Eventos activos</span>
            <span class="font-medium">3</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-400">Ticket promedio</span>
            <span class="font-medium">$1.326</span>
          </div>
        </InfoCard>
      </div>

      <div class="space-y-2">
        <p class="text-xs text-gray-500 uppercase tracking-wider">Eventos</p>
        <InfoCard
          v-for="event in mockEvents"
          :key="event.id"
          :title="event.name"
          :subtitle="`${event.sold}/${event.capacity} · ${event.status}`"
          :disabled="event.status === 'finalizado'"
        />
      </div>
    </ClientSidebar>
    <main class="chat-main">
      <div class="chat-header">
        <div class="chat-header_info">
          <div class="chat-header_status-dot"></div>
          <span class="chat-header_name">Fanzly</span>
          <span class="chat-header_subtitle">Asistente interno</span>
        </div>
        <Button @click="emptyChat" label="Nueva conversacion" />
      </div>

      <div ref="messagesContainer" class="chat-messages">
        <div v-if="messages.length === 0" class="chat-empty">
          <div class="chat-empty_icon">🤖</div>
          <div>
            <p class="font-semibold text-lg">¿En qué puedo ayudarte?</p>
            <p class="text-sm text-gray-400 mt-1">
              Preguntame sobre Fanz o pedime que haga algo con tu cuenta.
            </p>
          </div>
          <div class="flex flex-wrap gap-2 justify-center max-w-lg mt-2">
            <Button
              v-for="sug in suggestions"
              @click="suggestion(sug)"
              :key="sug"
              :label="sug"
              type="secondary"
            />
          </div>
        </div>

        <template v-else>
          <div
            v-for="msg in messages"
            :key="msg.id"
            class="chat-message"
            :class="msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'"
          >
            <div
              class="chat-message_avatar"
              :class="msg.role === 'user' ? 'bg-purple-600' : 'bg-gray-700'"
            >
              {{ msg.role === "user" ? formatInitials(clientName) : "F" }}
            </div>

            <div
              class="chat-message_bubble"
              :class="
                msg.role === 'user'
                  ? 'bg-purple-600 text-white rounded-tr-sm'
                  : 'bg-gray-800 text-gray-100 rounded-tl-sm'
              "
            >
              <div v-html="formatMessage(msg.content)"></div>

              <div v-if="msg.source" class="chat-message_source">
                <span class="text-xs text-gray-400">Fuente:</span>
                <a
                  :href="msg.source"
                  target="_blank"
                  class="chat-message_source-link"
                  >{{ msg.source }}</a
                >
              </div>
            </div>
          </div>

          <div v-if="steps.length > 0" class="chat-steps">
            <div v-for="(step, i) in steps" :key="i" class="chat-step">
              <div
                class="chat-step_dot"
                :class="i === steps.length - 1 ? 'bg-white' : 'bg-gray-600'"
              ></div>
              <span
                class="chat-step_text"
                :class="
                  i === steps.length - 1 ? 'text-gray-200' : 'text-gray-500'
                "
                >{{ step }}</span
              >
            </div>
          </div>

          <div v-if="isLoading && steps.length === 0" class="chat-typing">
            <span class="chat-typing_dot [animation-delay:0ms]"></span>
            <span class="chat-typing_dot [animation-delay:150ms]"></span>
            <span class="chat-typing_dot [animation-delay:300ms]"></span>
          </div>
        </template>
      </div>

      <ChatInput
        ref="chatInputRef"
        v-model="inputText"
        :disabled="isLoading"
        placeholder="Preguntá algo sobre Fanz o pedí una acción..."
        @send="sendMessage"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";
import InfoCard from "~/components/global/InfoCard.vue";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  source?: string;
}

interface Event {
  id: number;
  name: string;
  sold: number;
  capacity: number;
  status: "activo" | "finalizado";
}

const mockEvents: Event[] = [
  {
    id: 1,
    name: "Festival de Verano 2026",
    sold: 620,
    capacity: 1000,
    status: "activo",
  },
  {
    id: 2,
    name: "Noche de Jazz & Blues",
    sold: 340,
    capacity: 500,
    status: "activo",
  },
  {
    id: 3,
    name: "Congreso Tech 2026",
    sold: 185,
    capacity: 300,
    status: "activo",
  },
  {
    id: 4,
    name: "Show de Comedia",
    sold: 200,
    capacity: 200,
    status: "finalizado",
  },
];

// Respuestas mock del agente para simular el backend
const mockRespuestas: Record<
  string,
  { steps: string[]; response: string; source?: string }
> = {
  default: {
    steps: [
      "🔍 Buscando en documentación...",
      "✅ Encontré información relevante",
    ],
    response:
      "Estoy en modo demo sin backend conectado. Puedo mostrarte cómo funciona la interfaz, pero las respuestas reales vendrán del agente cuando conectes el backend.",
  },
  evento: {
    steps: ["⚙️ Ejecutando: ver_eventos...", "✅ Datos cargados"],
    response:
      "Estos son los eventos de tu cuenta:\n\n** Festival de Verano 2026** — 620/1000 vendidos · $5.000 c/u\n** Noche de Jazz & Blues** — 340/500 vendidos · $3.500 c/u\n** Congreso Tech 2026** — 185/300 vendidos · $8.000 c/u\n** Show de Comedia** — 200/200 vendidos · Finalizado",
  },
  ventas: {
    steps: ["⚙️ Ejecutando: ver_ventas_evento...", "✅ Datos cargados"],
    response:
      "**Ventas — Festival de Verano 2026**\n\nTotal recaudado: **$3.100.000**\nEntradas vendidas: **620 / 1000**\nOcupación: **62%**\n\nÚltimas ventas:\n- María García · $5.000 · 10 ene\n- Carlos López · $10.000 (x2) · 11 ene\n- Ana Martínez · $5.000 · 12 ene",
  },
  precio: {
    steps: [
      "🔍 Buscando en documentación...",
      "✅ Encontré información relevante",
    ],
    response:
      "Fanz cobra **8,26% + IVA** por entrada vendida. Es una tarifa única para todos los volúmenes, sin setup ni mensualidad mínima. El dinero va directo a tu cuenta a través de MercadoPago, Stripe o DLocal.",
    source: "https://fanz.com.ar/precio",
  },
  crear: {
    steps: [
      "🔍 Buscando en documentación...",
      "✅ Encontré información relevante",
    ],
    response:
      'Para crear un evento en Fanz:\n\n1. Ingresá al panel en **panel.fanz.com.ar**\n2. Hacé clic en **"Crear evento"**\n3. Completá nombre, fecha, descripción y tipos de entrada\n4. Configurá el método de pago\n5. Publicá y compartí el link\n\nTodo el proceso toma menos de 5 minutos.',
    source: "https://ayuda.fanz.com.ar",
  },
  mercadopago: {
    steps: [
      "🔍 Buscando en documentación...",
      "✅ Encontré información relevante",
    ],
    response:
      'Para conectar MercadoPago:\n\n1. Andá a **Configuración → Pagos** en tu panel\n2. Seleccioná MercadoPago como procesador\n3. Hacé clic en **"Conectar cuenta"** y autorizá el acceso\n4. Listo — los cobros irán directo a tu cuenta de MP\n\nTambién podés usar Stripe o DLocal si operás fuera de LATAM.',
    source: "https://ayuda.fanz.com.ar",
  },
  resumen: {
    steps: ["⚙️ Ejecutando: resumen_cuenta...", "✅ Datos cargados"],
    response:
      "**Resumen de tu cuenta — últimos 30 días**\n\nIngresos netos: **$2.450.800**\nTickets vendidos: **1.847**\nTicket promedio: **$1.326**\nEventos activos: **3**\nCompras totales: **360**\n\nEvento más vendido: 🎪 Festival de Verano 2026 con $980K recaudados.",
  },
  ai: {
    steps: [
      "🔍 Buscando en documentación...",
      "✅ Encontré información relevante",
    ],
    response:
      "**Fanz AI** es el copiloto de inteligencia artificial de la plataforma. Incluye 7 capacidades:\n\n- **Sitio web con IA** — generá tu página con un prompt\n- **Soporte omnicanal** — Email, WhatsApp e Instagram automáticos\n- **Campañas** — marketing que se lanza y mejora solo\n- **Textos** — descripciones y copy en segundos\n- **Guía 24/7** — responde preguntas sobre la plataforma\n- **Segmentación** — agrupá tu audiencia por comportamiento\n- **CMO con IA** — recomendaciones de pricing y ventas\n\nEstá incluido sin costo extra en todos los planes.",
    source: "https://fanz.com.ar/fanz-ai",
  },
};

const messages = ref<Message[]>([]);
const steps = ref<string[]>([]);
const isLoading = ref(false);
const inputText = ref("");
const messagesContainer = ref<HTMLElement | null>(null);
const chatInputRef = ref<{ focus: () => void } | null>(null);
const clientName = ref("Martin Iglesias");

const suggestions = [
  "¿Cómo creo un evento?",
  "Mostrá mis eventos",
  "¿Cuánto cobra Fanz?",
  "¿Cómo configuro MercadoPago?",
  "Resumen de mi cuenta",
  "¿Qué es Fanz AI?",
];

const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

const formatMessage = (text: string) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(
      /`(.*?)`/g,
      '<code class="bg-gray-700 px-1 rounded text-xs font-mono">$1</code>',
    )
    .replace(/\n/g, "<br>");
};

const formatInitials = (name: string) => {
  const words = name?.trim().split(/\s+/) ?? [];

  if (!words.length) return "";

  return [words[0]![0], words.length > 1 ? words.at(-1)?.[0] : ""]
    .join("")
    .toUpperCase();
};

const detectarMock = (texto: string): string => {
  const t = texto.toLowerCase();
  if (
    t.includes("evento") &&
    (t.includes("mostr") || t.includes("ver") || t.includes("lista"))
  )
    return "evento";
  if (t.includes("venta")) return "ventas";
  if (
    t.includes("precio") ||
    t.includes("cuesta") ||
    t.includes("cobra") ||
    t.includes("tarifa")
  )
    return "precio";
  if (
    t.includes("crear") ||
    t.includes("publicar") ||
    t.includes("nuevo evento")
  )
    return "crear";
  if (t.includes("mercadopago") || t.includes("pago") || t.includes("cobro"))
    return "mercadopago";
  if (t.includes("resumen") || t.includes("estadística")) return "resumen";
  if (
    t.includes("fanz ai") ||
    t.includes("inteligencia") ||
    t.includes(" ia") ||
    t.includes(" ai")
  )
    return "ai";
  return "default";
};

// Simula delay
const simularStreaming = async (key: string) => {
  const mock = mockRespuestas[key];
  for (const step of mock!.steps) {
    steps.value.push(step);
    await scrollToBottom();
    await new Promise((r) => setTimeout(r, 700));
  }
  steps.value = [];
  messages.value.push({
    id: Date.now(),
    role: "assistant",
    content: mock!.response,
    source: mock!.source,
  });
  await scrollToBottom();
};

const suggestion = (texto: string) => {
  inputText.value = texto;
  nextTick(() => chatInputRef.value?.focus());
};

const emptyChat = () => {
  messages.value = [];
  steps.value = [];
  inputText.value = "";
};

const sendMessage = async () => {
  const texto = inputText.value.trim();
  if (!texto || isLoading.value) return;

  messages.value.push({ id: Date.now(), role: "user", content: texto });
  inputText.value = "";
  isLoading.value = true;
  steps.value = [];
  await scrollToBottom();

  // Cuando el back este ready cambiar esto
  // por el fetch real
  const mockKey = detectarMock(texto);
  await simularStreaming(mockKey);
  // ──────────────────────────────────────────────────────────

  isLoading.value = false;
};
</script>

<style scoped>
.chat-main {
  @apply flex-1 flex flex-col min-w-0;
}

.chat-header {
  @apply flex items-center justify-between px-6 py-3 border-b border-gray-800 bg-gray-900;
}
.chat-header_info {
  @apply flex items-center gap-2;
}
.chat-header_status-dot {
  @apply w-2 h-2 rounded-full bg-green-400;
}
.chat-header_name {
  @apply font-semibold text-sm;
}
.chat-header_subtitle {
  @apply text-xs text-gray-500;
}

.chat-messages {
  @apply flex-1 overflow-y-auto p-6 space-y-4;
}

.chat-empty {
  @apply flex flex-col items-center justify-center h-full gap-4 text-center;
}
.chat-empty_icon {
  @apply w-12 h-12 rounded-2xl bg-gray-800 flex items-center justify-center text-2xl;
}

.chat-message {
  @apply flex gap-3;
}
.chat-message_avatar {
  @apply w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1;
}
.chat-message_bubble {
  @apply max-w-xl rounded-2xl px-4 py-3 text-sm leading-relaxed;
}
.chat-message_source {
  @apply mt-2 pt-2 border-t border-gray-700 flex items-center gap-1;
}
.chat-message_source-link {
  @apply text-xs text-purple-400 hover:underline truncate;
}

.chat-steps {
  @apply flex flex-col gap-1.5 bg-gray-800/50 rounded-xl px-4 py-3 max-w-xs;
}
.chat-step {
  @apply flex items-center gap-2;
}
.chat-step_dot {
  @apply w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors;
}
.chat-step_text {
  @apply text-xs transition-colors;
}

.chat-typing {
  @apply flex gap-1.5 bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3 w-fit;
}
.chat-typing_dot {
  @apply w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce;
}
</style>
