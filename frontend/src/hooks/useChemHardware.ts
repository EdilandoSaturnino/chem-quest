import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { RgbColor } from "../domain/elements/element-color";
import {
  ChemHardwareController,
  type HardwareResultKind,
} from "../infra/serial/chem-hardware-controller";

export type ChemHardwareStatus =
  | "unsupported"
  | "disconnected"
  | "connecting"
  | "connected"
  | "error";

export interface ChemHardwareControls {
  readonly status: ChemHardwareStatus;
  readonly error: string | null;
  readonly connect: () => Promise<void>;
  readonly disconnect: () => Promise<void>;
  readonly preview: (color: RgbColor) => Promise<void>;
  readonly mix: (color: RgbColor, durationMs: number) => Promise<void>;
  readonly result: (kind: HardwareResultKind, color: RgbColor) => Promise<void>;
  readonly off: () => Promise<void>;
}

export function useChemHardware(): ChemHardwareControls {
  const controllerRef = useRef<ChemHardwareController | null>(null);
  const [status, setStatus] = useState<ChemHardwareStatus>(() =>
    ChemHardwareController.isSupported() ? "disconnected" : "unsupported",
  );
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async () => {
    if (!ChemHardwareController.isSupported()) {
      setStatus("unsupported");
      setError("Web Serial API indisponível neste navegador.");
      return;
    }

    setStatus("connecting");
    setError(null);

    try {
      const controller = new ChemHardwareController();
      await controller.connect();
      controllerRef.current = controller;
      setStatus("connected");
    } catch (e) {
      controllerRef.current = null;
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

  const preview = useCallback((color: RgbColor) =>
    runIfConnected(controller => controller.preview(color)), [runIfConnected]);

  const mix = useCallback((color: RgbColor, durationMs: number) =>
    runIfConnected(controller => controller.mix(color, durationMs)), [runIfConnected]);

  const result = useCallback((kind: HardwareResultKind, color: RgbColor) =>
    runIfConnected(controller => controller.result(kind, color)), [runIfConnected]);

  const off = useCallback(() =>
    runIfConnected(controller => controller.off()), [runIfConnected]);

  useEffect(() => () => {
    void controllerRef.current?.disconnect();
  }, []);

  return useMemo(() => ({
    status,
    error,
    connect,
    disconnect,
    preview,
    mix,
    result,
    off,
  }), [status, error, connect, disconnect, preview, mix, result, off]);
}
