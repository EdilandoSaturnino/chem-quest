import type { RgbColor } from "../../domain/elements/element-color";

export type HardwareResultKind = "success" | "partial" | "fail";

interface SerialPortLike {
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

const BAUD_RATE = 9600;

export class ChemHardwareController {
  private port: SerialPortLike | null = null;
  private writer: WritableStreamDefaultWriter<Uint8Array> | null = null;
  private readonly encoder = new TextEncoder();

  static isSupported(): boolean {
    return typeof navigator !== "undefined" && Boolean((navigator as NavigatorWithSerial).serial);
  }

  get connected(): boolean {
    return this.writer !== null;
  }

  async connect(): Promise<void> {
    const serial = (navigator as NavigatorWithSerial).serial;
    if (!serial) throw new Error("Web Serial API indisponível neste navegador.");

    const port = await serial.requestPort();
    await port.open({ baudRate: BAUD_RATE });

    if (!port.writable) {
      await port.close();
      throw new Error("A porta serial não está pronta para escrita.");
    }

    this.port = port;
    this.writer = port.writable.getWriter();
    await this.sendRaw("PING");
  }

  async disconnect(): Promise<void> {
    if (!this.port) return;

    try {
      if (this.writer) await this.off();
    } finally {
      this.writer?.releaseLock();
      this.writer = null;
      await this.port.close();
      this.port = null;
    }
  }

  preview(color: RgbColor): Promise<void> {
    return this.sendColorCommand("PREVIEW", color);
  }

  mix(color: RgbColor, durationMs: number): Promise<void> {
    return this.sendColorCommand("MIX", color, durationMs);
  }

  result(kind: HardwareResultKind, color: RgbColor): Promise<void> {
    return this.sendColorCommand(`RESULT ${kind}`, color);
  }

  off(): Promise<void> {
    return this.sendRaw("OFF");
  }

  private sendColorCommand(prefix: string, color: RgbColor, suffix?: number): Promise<void> {
    const command = `${prefix} ${clampByte(color.r)} ${clampByte(color.g)} ${clampByte(color.b)}` +
      (suffix === undefined ? "" : ` ${suffix}`);
    return this.sendRaw(command);
  }

  private async sendRaw(command: string): Promise<void> {
    if (!this.writer) return;
    await this.writer.write(this.encoder.encode(`${command}\n`));
  }
}

function clampByte(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)));
}
