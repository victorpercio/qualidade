import { EventEmitter } from "events";

export interface FanucCncState {
  programNumber: string;
  activeGCode: string;
  feedRate: number; // mm/min
  spindleSpeed: number; // RPM
  spindleLoad: number; // %
  axes: {
    X: { absolute: number; relative: number; machine: number };
    Y: { absolute: number; relative: number; machine: number };
    Z: { absolute: number; relative: number; machine: number };
  };
  alarms: string[];
  toolNumber: number;
}

export class FanucIntegration extends EventEmitter {
  public cncIp: string = "192.168.1.50";
  public port: number = 8193; // Default FOCAS Ethernet port
  public status: "connected" | "disconnected" | "connecting" = "disconnected";
  private state: FanucCncState = {
    programNumber: "O1004 (LOTE-VALVULA-AERO)",
    activeGCode: "G01 G17 G40 G90",
    feedRate: 350,
    spindleSpeed: 12000,
    spindleLoad: 68.5,
    axes: {
      X: { absolute: 120.08, relative: 120.08, machine: 120.08 },
      Y: { absolute: 45.04, relative: 45.04, machine: 45.04 },
      Z: { absolute: 30.03, relative: 30.03, machine: 30.03 }
    },
    alarms: [],
    toolNumber: 5
  };
  private intervalTimer: NodeJS.Timeout | null = null;

  constructor() {
    super();
  }

  public async connect(ip?: string, port?: number): Promise<boolean> {
    if (ip) this.cncIp = ip;
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
      // Simulate absolute coordinate fluctuations during active cutting path
      this.state.axes.X.absolute = Number((120.0 + (Math.random() - 0.5) * 0.15).toFixed(4));
      this.state.axes.Y.absolute = Number((45.0 + (Math.random() - 0.5) * 0.10).toFixed(4));
      this.state.axes.Z.absolute = Number((30.0 + (Math.random() - 0.5) * 0.05).toFixed(4));
      
      // Update load slightly
      this.state.spindleLoad = Number((60 + Math.random() * 15).toFixed(1));
      this.state.feedRate = Math.round(340 + Math.random() * 20);

      // Trigger alerts if load or coordinates drift too high
      if (this.state.spindleLoad > 73) {
        this.state.alarms = ["EXCESSO_DE_CARGA_SPINDLE"];
      } else {
        this.state.alarms = [];
      }

      this.emit("data", this.state);
    }, 1500);
  }

  public getState(): FanucCncState {
    return this.state;
  }

  public sendMCodeCommand(mCode: number) {
    this.emit("mCodeCommand", mCode);
    if (mCode === 30) {
      this.state.feedRate = 0;
      this.state.spindleSpeed = 0;
      this.state.spindleLoad = 0;
    } else if (mCode === 3) {
      this.state.spindleSpeed = 12000;
      this.state.feedRate = 350;
    }
  }
}

export const fanucService = new FanucIntegration();
fanucService.connect().catch(console.error);
