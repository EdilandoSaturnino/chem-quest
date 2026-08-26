import { useCallback, useEffect, useRef, useState } from "react";

const VOICE_WEBSOCKET_URL = import.meta.env.VITE_VOICE_WS_URL ?? "ws://localhost:8000/ws/voice";

export interface FreeModeVoiceContext {
  readonly mode: "livre";
  readonly mixedElementSymbols: readonly string[];
}

interface ActiveTurn {
  readonly id: string;
}

interface AssistantAudioMessage {
  readonly type: "assistant_audio";
  readonly turnId: string;
  readonly mimeType: "audio/wav";
}

export function useVoiceTurnClient(context: FreeModeVoiceContext) {
  const contextRef = useRef(context);
  const socketRef = useRef<WebSocket | null>(null);
  const activeTurnRef = useRef<ActiveTurn | null>(null);
  const latestTurnIdRef = useRef<string | null>(null);
  const pendingAudioRef = useRef<AssistantAudioMessage | null>(null);
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isReady, setIsReady] = useState(false);

  const stopAssistantAudio = useCallback(() => {
    const audio = activeAudioRef.current;
    if (!audio) return;

    activeAudioRef.current = null;
    const objectUrl = audio.src;
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
    URL.revokeObjectURL(objectUrl);
  }, []);

  const playAssistantAudio = useCallback((audioData: ArrayBuffer, mimeType: string) => {
    stopAssistantAudio();

    const objectUrl = URL.createObjectURL(new Blob([audioData], { type: mimeType }));
    const audio = new Audio(objectUrl);
    activeAudioRef.current = audio;

    const releaseAudio = () => {
      if (activeAudioRef.current === audio) activeAudioRef.current = null;
      URL.revokeObjectURL(objectUrl);
    };

    audio.addEventListener("ended", releaseAudio, { once: true });
    audio.addEventListener("error", releaseAudio, { once: true });
    void audio.play().catch(releaseAudio);
  }, [stopAssistantAudio]);

  useEffect(() => {
    contextRef.current = context;
  }, [context]);

  useEffect(() => {
    const socket = new WebSocket(VOICE_WEBSOCKET_URL);
    socket.binaryType = "arraybuffer";
    socketRef.current = socket;

    socket.addEventListener("message", (event) => {
      if (event.data instanceof ArrayBuffer) {
        const pendingAudio = pendingAudioRef.current;
        pendingAudioRef.current = null;
        if (!pendingAudio || pendingAudio.turnId !== latestTurnIdRef.current) return;

        playAssistantAudio(event.data, pendingAudio.mimeType);
        return;
      }

      if (typeof event.data !== "string") return;

      try {
        const message: unknown = JSON.parse(event.data);
        if (isSessionReadyMessage(message)) setIsReady(true);
        if (isAssistantAudioMessage(message)) {
          pendingAudioRef.current = message.turnId === latestTurnIdRef.current ? message : null;
        }
      } catch {
        // The server only sends JSON protocol messages. Ignore malformed responses.
      }
    });

    socket.addEventListener("close", () => {
      if (socketRef.current === socket) {
        socketRef.current = null;
        activeTurnRef.current = null;
        pendingAudioRef.current = null;
        setIsReady(false);
      }
    });

    return () => {
      activeTurnRef.current = null;
      latestTurnIdRef.current = null;
      pendingAudioRef.current = null;
      stopAssistantAudio();
      setIsReady(false);
      socket.close();
      if (socketRef.current === socket) socketRef.current = null;
    };
  }, [playAssistantAudio, stopAssistantAudio]);

  const beginTurn = useCallback(() => {
    const socket = socketRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN || activeTurnRef.current) return;

    stopAssistantAudio();
    pendingAudioRef.current = null;
    const turn: ActiveTurn = { id: crypto.randomUUID() };
    activeTurnRef.current = turn;
    latestTurnIdRef.current = turn.id;
    sendJson(socket, { type: "speech_start", turnId: turn.id });
    sendJson(socket, {
      type: "game_context",
      turnId: turn.id,
      context: contextRef.current,
    });
  }, [stopAssistantAudio]);

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

function isAssistantAudioMessage(message: unknown): message is AssistantAudioMessage {
  return typeof message === "object" && message !== null &&
    "type" in message && message.type === "assistant_audio" &&
    "turnId" in message && typeof message.turnId === "string" &&
    "mimeType" in message && message.mimeType === "audio/wav";
}
