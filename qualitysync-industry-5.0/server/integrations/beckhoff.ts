import { EventEmitter } from "events";

export interface AdsVariable {
  symbolName: string;
  indexGroup: number;
  indexOffset: number;
  dataType: "BOOL" | "REAL" | "INT" | "STRING";
  value: any;
  comment: string;
}

export class BeckhoffIntegration extends EventEmitter {
  public amsNetIdTarget: string = "192.168.1.15.1.1";
  public amsPortTarget: number = 851; // Default TwinCAT 3 PLC port
  public status: "connected" | "disconnected" | "connecting" = "disconnected";
  private variables: Map<string, AdsVariable> = new Map();
  private intervalTimer: NodeJS.Timeout | null = null;

  constructor() {
    super();
    this.initAdsVariables();
  }

  private initAdsVariables() {
    this.variables.set("MAIN.robotAxis1.bActive", { symbolName: "MAIN.robotAxis1.bActive", indexGroup: 0x4020, indexOffset: 0, dataType: "BOOL", value: true, comment: "Estado ativo do servo motor articulado 1" });
    this.variables.set("MAIN.robotAxis1.fPositionDegree", { symbolName: "MAIN.robotAxis1.fPositionDegree", indexGroup: 0x4020, indexOffset: 4, dataType: "REAL", value: 180.5, comment: "Posição angular absoluta do braço KUKA (°)" });
    this.variables.set("MAIN.temperatureSensors[1]", { symbolName: "MAIN.temperatureSensors[1]", indexGroup: 0xF020, indexOffset: 10, dataType: "REAL", value: 21.8, comment: "Sensor de temperatura física do mancal de junta" });
    this.variables.set("MAIN.sActiveLotName", { symbolName: "MAIN.sActiveLotName", indexGroup: 0xF030, indexOffset: 50, dataType: "STRING", value: "LOTE-ROB03-01", comment: "Nome do lote ativo transmitido à metrologia" });
  }

  public async connect(netId?: string, port?: number): Promise<boolean> {
    if (netId) this.amsNetIdTarget = netId;
    if (port) this.amsPortTarget = port;
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
      // Simulate real-time TwinCAT ADS variables updates
      const posVar = this.variables.get("MAIN.robotAxis1.fPositionDegree");
      if (posVar) {
        posVar.value = Number((180.0 + Math.sin(Date.now() / 1000) * 45).toFixed(2));
      }
      
      const tempVar = this.variables.get("MAIN.temperatureSensors[1]");
      if (tempVar) {
        tempVar.value = Number((21.5 + (Math.random() - 0.5) * 0.3).toFixed(2));
      }

      this.emit("data", this.getVariables());
    }, 1200);
  }

  public getVariables(): AdsVariable[] {
    return Array.from(this.variables.values());
  }

  public writeVariable(symbolName: string, value: any): boolean {
    const variable = this.variables.get(symbolName);
    if (!variable) return false;
    
    if (variable.dataType === "BOOL") {
      variable.value = Boolean(value);
    } else if (variable.dataType === "REAL") {
      variable.value = parseFloat(value);
    } else if (variable.dataType === "INT") {
      variable.value = parseInt(value, 10);
    } else {
      variable.value = value;
    }
    
    this.emit("write", { symbolName, value: variable.value });
    return true;
  }
}

export const beckhoffService = new BeckhoffIntegration();
beckhoffService.connect().catch(console.error);
