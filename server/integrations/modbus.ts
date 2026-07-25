import { EventEmitter } from "events";

export interface ModbusRegister {
  address: number;
  type: "HoldingRegister" | "InputRegister" | "Coil" | "DiscreteInput";
  name: string;
  value: number | boolean;
  unit?: string;
  lastUpdated: string;
}

export class ModbusIntegration extends EventEmitter {
  public ip: string = "192.168.1.150";
  public port: number = 502;
  public status: "connected" | "disconnected" | "connecting" = "disconnected";
  private registers: Map<number, ModbusRegister> = new Map();
  private intervalTimer: NodeJS.Timeout | null = null;

  constructor() {
    super();
    this.initRegisters();
  }

  private initRegisters() {
    this.registers.set(40001, { address: 40001, type: "HoldingRegister", name: "Spindle_Speed_Ref", value: 4500, unit: "RPM", lastUpdated: new Date().toISOString() });
    this.registers.set(40002, { address: 40002, type: "HoldingRegister", name: "Coolant_Pump_Status", value: true, lastUpdated: new Date().toISOString() });
    this.registers.set(30001, { address: 30001, type: "InputRegister", name: "Axis_X_Temperature", value: 385, unit: "0.1 °C", lastUpdated: new Date().toISOString() });
    this.registers.set(30002, { address: 30002, type: "InputRegister", name: "Axis_Y_Vibration", value: 125, unit: "0.01 G", lastUpdated: new Date().toISOString() });
    this.registers.set(1, { address: 1, type: "Coil", name: "Emergency_Stop_Cmd", value: false, lastUpdated: new Date().toISOString() });
    this.registers.set(10001, { address: 10001, type: "DiscreteInput", name: "Safety_Door_Closed", value: true, lastUpdated: new Date().toISOString() });
  }

  public async connect(ip?: string, port?: number): Promise<boolean> {
    if (ip) this.ip = ip;
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
      for (const [address, reg] of this.registers.entries()) {
        if (reg.type === "InputRegister") {
          // Add a minor fluctuation
          reg.value = Number(reg.value) + Math.round((Math.random() - 0.5) * 4);
        }
        reg.lastUpdated = new Date().toISOString();
      }
      this.emit("data", this.getRegisters());
    }, 2500);
  }

  public getRegisters(): ModbusRegister[] {
    return Array.from(this.registers.values());
  }

  public writeRegister(address: number, value: number | boolean): boolean {
    const reg = this.registers.get(address);
    if (!reg) return false;
    if (reg.type === "HoldingRegister" || reg.type === "Coil") {
      reg.value = value;
      reg.lastUpdated = new Date().toISOString();
      this.emit("write", { address, value });
      return true;
    }
    return false; // Input values cannot be written
  }
}

export const modbusService = new ModbusIntegration();
modbusService.connect().catch(console.error);
