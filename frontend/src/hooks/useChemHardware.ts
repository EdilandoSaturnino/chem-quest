import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { BottleColors } from "../domain/elements/element-color";
import { ChemHardwareController } from "../infra/serial/chem-hardware-controller";

export type ChemHardwareStatus =
  | "unsupported"
  | "disconnected"
  | "connecting"
  | "connected"
  | "error";

export interface ChemHardwareControls {
  readonly status: ChemHardwareStatus;
  readonly error: string | null;
  readonly dismissConnectionError: () => void;
  readonly connect: () => Promise<void>;
  readonly disconnect: () => Promise<void>;
  readonly enterFreeMode: () => Promise<void>;
  readonly preview: (colors: BottleColors) => Promise<void>;
  readonly mix: (colors: BottleColors, successful: boolean) => Promise<void>;
  readonly off: () => Promise<void>;
}

export function useChemHardware(): ChemHardwareControls {
  const controllerRef = useRef<ChemHardwareController | null>(null);
  const [status, setStatus] = useState<ChemHardwareStatus>(() =>
    ChemHardwareController.isSupported() ? "disconnected" : "unsupported",
  );
  const [error, setError] = useState<string | null>(null);

  const dismissConnectionError = useCallback(() => {
    setError(null);
    setStatus(current => current === "error"
      ? (ChemHardwareController.isSupported() ? "disconnected" : "unsupported")
      : current);
  }, []);

  const connect = useCallback(async () => {
    // Retain the controller as soon as a connection starts. This prevents two
    // device pickers or TTY opens from being started before React re-renders.
    if (controllerRef.current) return;

    if (!ChemHardwareController.isSupported()) {
      setStatus("unsupported");
      setError("Web Serial API indisponível neste navegador.");
      return;
    }

    setStatus("connecting");
    setError(null);

    try {
      const controller = new ChemHardwareController();
      controllerRef.current = controller;
      await controller.connect();
      setStatus("connected");
    } catch (e) {
      controllerRef.current = null;
      if (isPortPickerCancellation(e)) {
        setStatus("disconnected");
        return;
      }
      setStatus("error");
      setError(e instanceof Error ? e.message : "Falha ao conectar ao Arduino.");
    }
  }, []);

  const disconnect = useCallback(async () => {
    try {
      await controllerRef.current?.disconnect();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao desconectar o Arduino.");
    } finally {
      controllerRef.current = null;
      setStatus(ChemHardwareController.isSupported() ? "disconnected" : "unsupported");
    }
  }, []);

  const runIfConnected = useCallback(async (
    action: (controller: ChemHardwareController) => Promise<void>,
  ) => {
    const controller = controllerRef.current;
    if (!controller?.connected) return;

    try {
      await action(controller);
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Falha ao enviar comando para o Arduino.");
    }
  }, []);

  const enterFreeMode = useCallback(() =>
    runIfConnected(controller => controller.enterFreeMode()), [runIfConnected]);

  const preview = useCallback((colors: BottleColors) =>
    runIfConnected(controller => controller.preview(colors)), [runIfConnected]);

  const mix = useCallback(async (colors: BottleColors, successful: boolean) => {
    const controller = controllerRef.current;
    if (!controller?.connected) return;

    try {
      await controller.mix(colors, successful);
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Falha durante a síntese no Arduino.");
      throw e;
    }
  }, []);

  const off = useCallback(() =>
    runIfConnected(controller => controller.off()), [runIfConnected]);

  useEffect(() => () => {
    void controllerRef.current?.disconnect();
  }, []);

  return useMemo(() => ({
    status,
    error,
    dismissConnectionError,
    connect,
    disconnect,
    enterFreeMode,
    preview,
    mix,
    off,
  }), [status, error, dismissConnectionError, connect, disconnect, enterFreeMode, preview, mix, off]);
}

function isPortPickerCancellation(error: unknown): boolean {
  if (!(error instanceof Error)) return false;

  // Web Serial uses NotFoundError when its native device picker is dismissed.
  // Some browsers report the same user cancellation as AbortError.
  return error.name === "NotFoundError" || error.name === "AbortError";
}
