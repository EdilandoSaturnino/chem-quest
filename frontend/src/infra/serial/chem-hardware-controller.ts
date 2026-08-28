import type { BottleColors } from "../../domain/elements/element-color";

interface SerialPortLike {
  readonly readable: ReadableStream<Uint8Array> | null;
  readonly writable: WritableStream<Uint8Array> | null;
  open(options: { baudRate: number }): Promise<void>;
  close(): Promise<void>;
}

interface SerialApiLike {
  requestPort(): Promise<SerialPortLike>;
}

interface NavigatorWithSerial extends Navigator {
  readonly serial?: SerialApiLike;
}

interface PendingMix {
  readonly resolve: () => void;
  readonly reject: (reason: Error) => void;
  readonly timeoutId: ReturnType<typeof setTimeout>;
}

const BAUD_RATE = 9600;
const READY_TIMEOUT_MS = 5_000;
const READY_PING_INTERVAL_MS = 250;
const FLOW_TIMEOUT_MS = 75_000;

export class ChemHardwareController {
  private port: SerialPortLike | null = null;
  private writer: WritableStreamDefaultWriter<Uint8Array> | null = null;
  private reader: ReadableStreamDefaultReader<Uint8Array> | null = null;
  private readTask: Promise<void> | null = null;
  private pendingMix: PendingMix | null = null;
  private readonly encoder = new TextEncoder();
  private readonly decoder = new TextDecoder();
  private receivedText = "";
  private ready = false;

  static isSupported(): boolean {
    return typeof navigator !== "undefined" && Boolean((navigator as NavigatorWithSerial).serial);
  }

  get connected(): boolean {
    return this.writer !== null && this.reader !== null && this.ready;
  }

  async connect(): Promise<void> {
    const serial = (navigator as NavigatorWithSerial).serial;
    if (!serial) throw new Error("Web Serial API indisponível neste navegador.");

    const port = await serial.requestPort();
    await port.open({ baudRate: BAUD_RATE });

    if (!port.writable || !port.readable) {
      await port.close();
      throw new Error("A porta serial não está pronta para comunicação.");
    }

    this.port = port;
    this.writer = port.writable.getWriter();
    this.reader = port.readable.getReader();
    this.readTask = this.readResponses();

    try {
      await this.waitForReady();
    } catch (error) {
      await this.disconnect();
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    const port = this.port;
    if (!port) return;

    try {
      if (this.writer) await this.off();
    } catch {
      // The port may already be unavailable; closing still releases its locks.
    } finally {
      this.ready = false;
      this.rejectPendingMix(new Error("Conexão com o Arduino encerrada."));

      const reader = this.reader;
      this.reader = null;
      if (reader) {
        try {
          await reader.cancel();
        } catch {
          // A completed or disconnected stream does not need further handling.
        }
        reader.releaseLock();
      }

      try {
        await this.readTask;
      } catch {
        // Read errors are already reflected by the unavailable connection.
      }
      this.readTask = null;

      this.writer?.releaseLock();
      this.writer = null;
      this.port = null;
      await port.close();
    }
  }

  enterFreeMode(): Promise<void> {
    return this.sendRaw("ENTER_FREE_MODE");
  }

  preview(colors: BottleColors): Promise<void> {
    return this.sendBottleColorsCommand("PREVIEW", colors);
  }

  mix(colors: BottleColors, successful: boolean): Promise<void> {
    if (!this.connected) return Promise.resolve();
    if (this.pendingMix) return Promise.reject(new Error("Uma síntese já está em andamento."));

    return new Promise<void>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        this.rejectPendingMix(new Error("O Arduino não confirmou o fim da síntese."));
      }, FLOW_TIMEOUT_MS);
      this.pendingMix = { resolve, reject, timeoutId };

      const outcome = successful ? "SUCCESS" : "FAIL";
      void this.sendBottleColorsCommand("MIX", colors, outcome).catch((error: unknown) => {
        this.rejectPendingMix(toError(error, "Falha ao iniciar a síntese no Arduino."));
      });
    });
  }

  off(): Promise<void> {
    return this.sendRaw("OFF");
  }

  private async waitForReady(): Promise<void> {
    const deadline = Date.now() + READY_TIMEOUT_MS;
    while (!this.ready && Date.now() < deadline) {
      await this.sendRaw("PING");
      await delay(READY_PING_INTERVAL_MS);
    }

    if (!this.ready) {
      throw new Error("O Arduino não confirmou que está pronto para sintetizar.");
    }
  }

  private async readResponses(): Promise<void> {
    while (this.reader) {
      const { value, done } = await this.reader.read();
      if (done) break;
      if (!value) continue;

      this.receivedText += this.decoder.decode(value, { stream: true });
      this.processReceivedLines();
    }
  }

  private processReceivedLines(): void {
    let newlineIndex = this.receivedText.indexOf("\n");
    while (newlineIndex >= 0) {
      const line = this.receivedText.slice(0, newlineIndex).trim();
      this.receivedText = this.receivedText.slice(newlineIndex + 1);
      if (line) this.handleResponse(line);
      newlineIndex = this.receivedText.indexOf("\n");
    }
  }

  private handleResponse(line: string): void {
    if (line === "PONG READY") {
      this.ready = true;
      return;
    }

    if (line === "FLOW DONE") {
      this.resolvePendingMix();
      return;
    }

    if (line === "FLOW ABORTED") {
      this.rejectPendingMix(new Error("A síntese foi interrompida no Arduino."));
      return;
    }

    if (line.startsWith("ERROR ")) {
      this.rejectPendingMix(new Error(`Arduino: ${line.slice("ERROR ".length)}`));
    }
  }

  private sendBottleColorsCommand(
    action: string,
    colors: BottleColors,
    suffix = "",
  ): Promise<void> {
    const colorValues = [colors.left, colors.right, colors.middle]
      .flatMap(color => [clampByte(color.r), clampByte(color.g), clampByte(color.b)]);
    const command = `${action} ${colorValues.join(" ")}${suffix ? ` ${suffix}` : ""}`;
    return this.sendRaw(command);
  }

  private async sendRaw(command: string): Promise<void> {
    if (!this.writer) return;
    await this.writer.write(this.encoder.encode(`${command}\n`));
  }

  private resolvePendingMix(): void {
    const pendingMix = this.pendingMix;
    if (!pendingMix) return;

    clearTimeout(pendingMix.timeoutId);
    this.pendingMix = null;
    pendingMix.resolve();
  }

  private rejectPendingMix(error: Error): void {
    const pendingMix = this.pendingMix;
    if (!pendingMix) return;

    clearTimeout(pendingMix.timeoutId);
    this.pendingMix = null;
    pendingMix.reject(error);
  }
}

function clampByte(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function delay(durationMs: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, durationMs));
}

function toError(error: unknown, fallbackMessage: string): Error {
  return error instanceof Error ? error : new Error(fallbackMessage);
}
