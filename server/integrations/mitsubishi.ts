import { EventEmitter } from "events";

export interface MelsecRegister {
  deviceCode: "D" | "W" | "R" | "M" | "X" | "Y";
  address: number;
  name: string;
  value: any;
  dataType: "INT16" | "UINT16" | "FLOAT32" | "BIT";
  description: string;
}

export class MitsubishiIntegration extends EventEmitter {
  public plcIp: string = "192.168.1.12";
  public plcPort: number = 5013; // Default MC Protocol UDP/TCP port
  public status: "connected" | "disconnected" | "connecting" = "disconnected";
  private registers: Map<string, MelsecRegister> = new Map();
  private intervalTimer: NodeJS.Timeout | null = null;

  constructor() {
    super();
    this.initMelsecData();
  }

  private initMelsecData() {
    this.registerMelsec("D100", "D", 100, "FLOAT32", "Cutting_Force_Newton", 1250.5, "Força mecânica de usinagem (Newtons)");
    this.registerMelsec("D102", "D", 102, "INT16", "Active_Tool_Index", 3, "Número da ferramenta atualmente engatada");
    this.registerMelsec("D200", "D", 200, "UINT16", "Completed_Part_Count", 1420, "Contador acumulador de peças processadas");
    this.registerMelsec("M100", "M", 100, "BIT", "Melsec_Error_Active", false, "Bit de flag indicativo de falha ativa");
    this.registerMelsec("M102", "M", 102, "BIT", "Melsec_Vacuum_Pump", true, "Indica se a bomba de vácuo está pressurizando");
  }

  private registerMelsec(key: string, deviceCode: any, address: number, dataType: any, name: string, value: any, description: string) {
    this.registers.set(key, { deviceCode, address, name, value, dataType, description });
  }

  public async connect(ip?: string, port?: number): Promise<boolean> {
    if (ip) this.plcIp = ip;
    if (port) this.plcPort = port;
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
      // Simulate fluctuations in cutting force
      const forceReg = this.registers.get("D100");
      if (forceReg) {
        forceReg.value = Number((1200 + Math.random() * 100).toFixed(1));
      }
      
      this.emit("data", this.getRegisters());
    }, 2000);
  }

  public getRegisters(): Array<MelsecRegister & { key: string }> {
    return Array.from(this.registers.entries()).map(([key, value]) => ({
      key,
      ...value
    }));
  }

  public writeRegister(key: string, value: any): boolean {
    const reg = this.registers.get(key);
    if (!reg) return false;
    
    if (reg.dataType === "BIT") {
      reg.value = Boolean(value);
    } else if (reg.dataType === "INT16" || reg.dataType === "UINT16") {
      reg.value = parseInt(value, 10);
    } else if (reg.dataType === "FLOAT32") {
      reg.value = parseFloat(value);
    } else {
      reg.value = value;
    }
    
    this.emit("write", { key, value: reg.value });
    return true;
  }
}

export const mitsubishiService = new MitsubishiIntegration();
mitsubishiService.connect().catch(console.error);
