import type { RuntimeConfig } from "nuxt/schema";
import type {
  StreamEvent,
  StreamCallbacks,
  ChatMessage,
  CuentaResponse,
} from "~/types/fanzly-types";

class FanzlyApi {
  private baseUrl: string;

  constructor(config: RuntimeConfig) {
    this.baseUrl = config.public.apiUrl as string;
  }

  async sendMessage(
    messages: ChatMessage[],
    callbacks: StreamCallbacks,
  ): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      callbacks.onError("Error al conectar con el servidor. Intentá de nuevo.");
      return;
    }

    if (!response.body) {
      callbacks.onError("El servidor no devolvió respuesta.");
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8", { fatal: false });
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        try {
          const data = JSON.parse(line.slice(6)) as StreamEvent;

          if (data.type === "step") callbacks.onStep(data.text);
          if (data.type === "response")
            callbacks.onResponse(data.text, data.source);
          if (data.type === "error") callbacks.onError(data.text);
        } catch {
          // JSON malformado, ignorar
        }
      }
    }
  }

  async getCuenta(): Promise<CuentaResponse> {
    const data = await $fetch<CuentaResponse>(`${this.baseUrl}/api/cuenta`);
    return data;
  }
}

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const fanzlyApi = new FanzlyApi(config);

  return {
    provide: {
      fanzlyApi,
    },
  };
});
