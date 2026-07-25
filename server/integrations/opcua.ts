import { EventEmitter } from "events";

export interface OpcTag {
  nodeId: string;
  name: string;
  value: any;
  dataType: "Double" | "Int32" | "Boolean" | "String";
  quality: "Good" | "Bad" | "Uncertain";
  timestamp: string;
}

export class OpcUaIntegration extends EventEmitter {
  public endpoint: string = "opc.tcp://192.168.1.100:4840";
  public status: "connected" | "disconnected" | "connecting" = "disconnected";
  private tags: Map<string, OpcTag> = new Map();
  private intervalTimer: NodeJS.Timeout | null = null;

  constructor() {
    super();
    this.initTags();
  }

  private initTags() {
    this.addOrUpdateTag("ns=2;s=CNC01.Temperature", "CNC-01 Temperature", 22.4, "Double");
    this.addOrUpdateTag("ns=2;s=CNC01.Vibration", "CNC-01 Vibration", 0.25, "Double");
    this.addOrUpdateTag("ns=2;s=CNC01.SpindleSpeed", "CNC-01 Spindle RPM", 8500, "Int32");
    this.addOrUpdateTag("ns=2;s=CNC02.Temperature", "CNC-02 Temperature", 26.8, "Double");
    this.addOrUpdateTag("ns=2;s=CNC02.Vibration", "CNC-02 Vibration", 0.58, "Double");
  }

  private addOrUpdateTag(nodeId: string, name: string, value: any, dataType: any) {
    this.tags.set(nodeId, {
      nodeId,
      name,
      value,
      dataType,
      quality: "Good",
      timestamp: new Date().toISOString()
    });
  }

  public async connect(endpoint?: string): Promise<boolean> {
    if (endpoint) this.endpoint = endpoint;
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
      // Simulate real-time tag updates
      for (const [nodeId, tag] of this.tags.entries()) {
        if (tag.dataType === "Double") {
          const drift = nodeId.includes("CNC02") ? 0.3 : 0.0;
          tag.value = Number((tag.value + (Math.random() - 0.5) * 0.4 + drift).toFixed(2));
        } else if (tag.dataType === "Int32") {
          tag.value = Math.round(tag.value + (Math.random() - 0.5) * 100);
        }
        tag.timestamp = new Date().toISOString();
        tag.quality = Math.random() > 0.01 ? "Good" : "Bad";
      }
      this.emit("data", this.getTags());
    }, 3000);
  }

  public getTags(): OpcTag[] {
    return Array.from(this.tags.values());
  }

  public writeNodeValue(nodeId: string, value: any): boolean {
    const tag = this.tags.get(nodeId);
    if (!tag) return false;
    tag.value = value;
    tag.timestamp = new Date().toISOString();
    this.emit("tagWrite", { nodeId, value });
    return true;
  }
}

export const opcUaService = new OpcUaIntegration();
opcUaService.connect().catch(console.error);
