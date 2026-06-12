export interface StreamEvent {
  type: "step" | "response" | "error";
  text: string;
  source?: string;
}

export interface StreamCallbacks {
  onStep: (text: string) => void;
  onResponse: (text: string, source?: string) => void;
  onError: (text: string) => void;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface Evento {
  id: number;
  nombre: string;
  fecha: string;
  precio: number;
  capacidad: number;
  vendidos: number;
  estado: "activo" | "finalizado";
}

export interface Cuenta {
  id: number;
  nombre: string;
  email: string;
}

export interface CuentaResponse {
  cuenta: Cuenta;
  eventos: Evento[];
}
