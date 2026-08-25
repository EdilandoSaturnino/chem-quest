import { useCallback, useEffect, useRef, useState } from "react";

const VOICE_WEBSOCKET_URL = import.meta.env.VITE_VOICE_WS_URL ?? "ws://localhost:8000/ws/voice";

export interface FreeModeVoiceContext {
  readonly mode: "livre";
  readonly mixedElementSymbols: readonly string[];
}

interface ActiveTurn {
  readonly id: string;
}

export function useVoiceTurnClient(context: FreeModeVoiceContext) {
  const contextRef = useRef(context);
  const socketRef = useRef<WebSocket | null>(null);
  const activeTurnRef = useRef<ActiveTurn | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    contextRef.current = context;
  }, [context]);

  useEffect(() => {
    const socket = new WebSocket(VOICE_WEBSOCKET_URL);
    socketRef.current = socket;

    socket.addEventListener("message", (event) => {
      if (typeof event.data !== "string") return;

      try {
        const message: unknown = JSON.parse(event.data);
        if (isSessionReadyMessage(message)) setIsReady(true);
      } catch {
        // The server only sends JSON protocol messages. Ignore malformed responses.
      }
    });

    socket.addEventListener("close", () => {
      if (socketRef.current === socket) {
        socketRef.current = null;
        activeTurnRef.current = null;
        setIsReady(false);
      }
    });

    return () => {
      activeTurnRef.current = null;
      setIsReady(false);
      socket.close();
      if (socketRef.current === socket) socketRef.current = null;
    };
  }, []);

  const beginTurn = useCallback(() => {
    const socket = socketRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN || activeTurnRef.current) return;

    const turn: ActiveTurn = { id: crypto.randomUUID() };
    activeTurnRef.current = turn;
    sendJson(socket, { type: "speech_start", turnId: turn.id });
    sendJson(socket, {
      type: "game_context",
      turnId: turn.id,
      context: contextRef.current,
    });
  }, []);

  const completeTurn = useCallback((audio: Float32Array) => {
    const socket = socketRef.current;
    const turn = activeTurnRef.current;
    activeTurnRef.current = null;

    if (!socket || socket.readyState !== WebSocket.OPEN || !turn) return;

    socket.send(toBinaryAudioFrame(audio));
    sendJson(socket, { type: "speech_end", turnId: turn.id });
  }, []);

  return { beginTurn, completeTurn, isReady };
}

function sendJson(socket: WebSocket, message: object): void {
  socket.send(JSON.stringify(message));
}

function toBinaryAudioFrame(samples: Float32Array): Uint8Array<ArrayBuffer> {
  const frame = new Uint8Array(samples.byteLength);
  frame.set(new Uint8Array(samples.buffer, samples.byteOffset, samples.byteLength));
  return frame;
}

function isSessionReadyMessage(message: unknown): boolean {
  return typeof message === "object" && message !== null &&
    "type" in message && message.type === "session_ready";
}
