import { EventEmitter } from "events";

export interface HaasMachineState {
  cncState: "IDLE" | "RUNNING" | "ALARM" | "FEED_HOLD";
  activeTool: number;
  coolantLevel: number; // %
  spindleSpeed: number; // RPM
  feedRate: number; // mm/min
  partsCompleted: number;
  macroVariables: Array<{ number: number; name: string; value: any }>;
  lastCommand: string;
}

export class HaasIntegration extends EventEmitter {
  public ipAddress: string = "192.168.1.30";
  public port: number = 5051; // Haas Ethernet Q-command port
  public status: "connected" | "disconnected" | "connecting" = "disconnected";
  private state: HaasMachineState = {
    cncState: "RUNNING",
    activeTool: 12,
    coolantLevel: 91.5,
    spindleSpeed: 8500,
    feedRate: 280,
    partsCompleted: 350,
    macroVariables: [
      { number: 501, name: "Calib_Offset_X", value: 0.04 },
      { number: 502, name: "Calib_Offset_Y", value: 0.01 },
      { number: 503, name: "Calib_Offset_Z", value: 0.01 }
    ],
    lastCommand: "?Q100 (Request CNC Info)"
  };
  private intervalTimer: NodeJS.Timeout | null = null;

  constructor() {
    super();
  }

  public async connect(ip?: string, port?: number): Promise<boolean> {
    if (ip) this.ipAddress = ip;
    if (port) this.port = port;
    this.status = "connecting";
    this.emit("statusChange", this.status);

    return new Promise((resolve) => {
      setTimeout(() => {
        this.status = "connected";
        this.emit("statusChange", this.status);
        this.startPolling();
        resolve(true);
      }, 1000);
    });
  }

  public disconnect() {
    this.status = "disconnected";
    if (this.intervalTimer) clearInterval(this.intervalTimer);
    this.emit("statusChange", this.status);
  }

  private startPolling() {
    if (this.intervalTimer) clearInterval(this.intervalTimer);
    this.intervalTimer = setInterval(() => {
      // Simulate Haas Q-command responses
      this.state.spindleSpeed = Math.round(8500 + (Math.random() - 0.5) * 150);
      this.state.feedRate = Math.round(280 + (Math.random() - 0.5) * 10);
      this.state.coolantLevel = Number(Math.max(0, this.state.coolantLevel - 0.01).toFixed(2));
      
      // Periodically finish a part
      if (Math.random() > 0.95) {
        this.state.partsCompleted += 1;
        this.emit("partCompleted", this.state.partsCompleted);
      }

      this.emit("data", this.state);
    }, 2000);
  }

  public getState(): HaasMachineState {
    return this.state;
  }

  public writeMacroValue(number: number, value: any): boolean {
    const macro = this.state.macroVariables.find(m => m.number === number);
    if (!macro) return false;
    macro.value = value;
    this.state.lastCommand = `?W${number} [Write Macro] = ${value}`;
    this.emit("macroWrite", { number, value });
    return true;
  }
}

export const haasService = new HaasIntegration();
haasService.connect().catch(console.error);
