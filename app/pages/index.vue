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
            <span class="font-medium">{{ metricas.ingresos }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-400">Tickets vendidos</span>
            <span class="font-medium">{{ metricas.vendidos }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-400">Eventos activos</span>
            <span class="font-medium">{{ metricas.activos }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-400">Ticket promedio</span>
            <span class="font-medium">{{ metricas.promedio }}</span>
          </div>
        </InfoCard>
      </div>

      <div class="space-y-2">
        <p class="text-xs text-gray-500 uppercase tracking-wider">Eventos</p>
        <InfoCard
          v-for="event in events"
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
import type { Evento as EventoDB } from "~/types/fanzly-types";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  source?: string;
}

interface EventoSidebar {
  id: number;
  name: string;
  sold: number;
  capacity: number;
  status: "activo" | "finalizado";
  price: number;
}

const { $fanzlyApi } = useNuxtApp();

const clientName = ref("");
const events = ref<EventoSidebar[]>([]);
const messages = ref<Message[]>([]);
const steps = ref<string[]>([]);
const isLoading = ref(false);
const inputText = ref("");
const messagesContainer = ref<HTMLElement | null>(null);
const chatInputRef = ref<{ focus: () => void } | null>(null);

const suggestions = [
  "¿Cómo creo un evento?",
  "¿Puedo crear una web?",
  "¿Cuánto cobra Fanz?",
  "¿Cómo uso MercadoPago?",
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

const suggestion = (texto: string) => {
  inputText.value = texto;
  nextTick(() => sendMessage());
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

  const assistantMsg: Message = {
    id: Date.now() + 1,
    role: "assistant",
    content: "",
  };
  messages.value.push(assistantMsg);

  const historial = messages.value
    .filter((m) => m.content !== "")
    .map((m) => ({ role: m.role, content: m.content }));

  try {
    await $fanzlyApi.sendMessage(historial, {
      onStep(text) {
        steps.value.push(text);
        scrollToBottom();
      },
      onResponse(text, source) {
        steps.value = [];
        const idx = messages.value.findIndex((m) => m.id === assistantMsg.id);
        const msg = messages.value[idx];
        if (idx !== -1 && msg) {
          msg.content = text;
          if (source) msg.source = source;
        }
        scrollToBottom();
      },
      onError(text) {
        steps.value = [];
        const idx = messages.value.findIndex((m) => m.id === assistantMsg.id);
        const msg = messages.value[idx];
        if (idx !== -1 && msg) {
          msg.content = text;
        }
        scrollToBottom();
      },
    });
  } catch {
    const idx = messages.value.findIndex((m) => m.id === assistantMsg.id);
    const msg = messages.value[idx];
    if (idx !== -1 && msg) {
      msg.content =
        "Error al conectar con el servidor. Verificá que el backend esté corriendo.";
    }
  } finally {
    isLoading.value = false;
    steps.value = [];
  }
};

const metricas = computed(() => {
  const activos = events.value.filter((e) => e.status === "activo");
  const totalVendidos = events.value.reduce((acc, e) => acc + e.sold, 0);
  const totalIngresos = events.value.reduce(
    (acc, e) => acc + e.sold * e.price,
    0,
  );
  const ticketPromedio =
    totalVendidos > 0 ? Math.round(totalIngresos / totalVendidos) : 0;

  return {
    ingresos: totalIngresos.toLocaleString("es-AR"),
    vendidos: totalVendidos.toLocaleString("es-AR"),
    activos: activos.length,
    promedio: ticketPromedio.toLocaleString("es-AR"),
  };
});
onMounted(async () => {
  try {
    const { cuenta, eventos: eventosDB } = await $fanzlyApi.getCuenta();
    clientName.value = cuenta.nombre;
    events.value = eventosDB.map((e: EventoDB) => ({
      id: e.id,
      name: e.nombre,
      sold: e.vendidos,
      capacity: e.capacidad,
      status: e.estado,
      price: e.precio,
    }));
  } catch {
    console.error("No se pudo cargar la cuenta");
  }
});
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
