import { EventEmitter } from "events";

export interface S7Register {
  dbNumber: number;
  offset: number;
  type: "REAL" | "INT" | "BOOL" | "DINT";
  name: string;
  value: any;
  description: string;
}

export class SiemensIntegration extends EventEmitter {
  public plcIp: string = "192.168.1.10";
  public rack: number = 0;
  public slot: number = 1;
  public status: "connected" | "disconnected" | "connecting" = "disconnected";
  private dbRegisters: Map<string, S7Register> = new Map();
  private intervalTimer: NodeJS.Timeout | null = null;

  constructor() {
    super();
    this.initS7Data();
  }

  private initS7Data() {
    // Siemens S7 Data Blocks (DB10 for CNC state, DB12 for general operations)
    this.registerS7("DB10.DBX0.0", 10, 0, "BOOL", "CNC_Alpha_AutoMode", true, "Indica se o torno está em modo automático");
    this.registerS7("DB10.DBX0.1", 10, 1, "BOOL", "CNC_Alpha_Spindle_On", true, "Indica se o fuso principal está ligado");
    this.registerS7("DB10.DBW2", 10, 2, "INT", "CNC_Alpha_Override", 100, "Porcentagem de override do fuso (0-120%)");
    this.registerS7("DB10.DBD4", 10, 4, "REAL", "CNC_Alpha_Spindle_Load", 45.8, "Carga de torque do motor do fuso (%)");
    this.registerS7("DB12.DBD10", 12, 10, "REAL", "CNC_Alpha_Coolant_Pressure", 6.2, "Pressão do líquido de refrigeração (Bar)");
  }

  private registerS7(key: string, dbNumber: number, offset: number, type: any, name: string, value: any, description: string) {
    this.dbRegisters.set(key, { dbNumber, offset, type, name, value, description });
  }

  public async connect(ip?: string, rack?: number, slot?: number): Promise<boolean> {
    if (ip) this.plcIp = ip;
    if (rack !== undefined) this.rack = rack;
    if (slot !== undefined) this.slot = slot;
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
      // Simulate Siemens DB real-time data flow
      for (const [key, reg] of this.dbRegisters.entries()) {
        if (reg.name === "CNC_Alpha_Spindle_Load") {
          reg.value = Number((40 + Math.random() * 15).toFixed(1));
        } else if (reg.name === "CNC_Alpha_Coolant_Pressure") {
          reg.value = Number((6.0 + (Math.random() - 0.5) * 0.4).toFixed(2));
        }
      }
      this.emit("data", this.getRegisters());
    }, 2000);
  }

  public getRegisters(): Array<S7Register & { addressKey: string }> {
    return Array.from(this.dbRegisters.entries()).map(([key, value]) => ({
      addressKey: key,
      ...value
    }));
  }

  public writeDBValue(key: string, value: any): boolean {
    const reg = this.dbRegisters.get(key);
    if (!reg) return false;
    
    // Type conversion safety
    if (reg.type === "BOOL") {
      reg.value = Boolean(value);
    } else if (reg.type === "INT") {
      reg.value = parseInt(value, 10);
    } else if (reg.type === "REAL") {
      reg.value = parseFloat(value);
    } else {
      reg.value = value;
    }
    
    this.emit("write", { key, value: reg.value });
    return true;
  }
}

export const siemensService = new SiemensIntegration();
siemensService.connect().catch(console.error);
