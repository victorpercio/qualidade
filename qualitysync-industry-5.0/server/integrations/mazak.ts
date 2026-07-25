import { EventEmitter } from "events";

export interface MazakMtNode {
  id: string;
  category: "EVENT" | "SAMPLE" | "CONDITION";
  name: string;
  value: string | number;
  subType?: string;
  lastChanged: string;
}

export class MazakIntegration extends EventEmitter {
  public mtConnectUrl: string = "http://192.168.1.40:5000/current";
  public status: "connected" | "disconnected" | "connecting" = "disconnected";
  private mtNodes: Map<string, MazakMtNode> = new Map();
  private intervalTimer: NodeJS.Timeout | null = null;

  constructor() {
    super();
    this.initMtConnectNodes();
  }

  private initMtConnectNodes() {
    this.mtNodes.set("avail", { id: "avail", category: "EVENT", name: "Availability", value: "AVAILABLE", lastChanged: new Date().toISOString() });
    this.mtNodes.set("exec", { id: "exec", category: "EVENT", name: "Execution", value: "ACTIVE", lastChanged: new Date().toISOString() });
    this.mtNodes.set("mode", { id: "mode", category: "EVENT", name: "ControllerMode", value: "AUTOMATIC", lastChanged: new Date().toISOString() });
    this.mtNodes.set("path_feedrate", { id: "path_feedrate", category: "SAMPLE", name: "PathFeedrate", value: 360, subType: "ACTUAL", lastChanged: new Date().toISOString() });
    this.mtNodes.set("spindle_temp", { id: "spindle_temp", category: "SAMPLE", name: "Spindle_Temperature", value: 26.8, lastChanged: new Date().toISOString() });
    this.mtNodes.set("cond_lube", { id: "cond_lube", category: "CONDITION", name: "LubricationCondition", value: "NORMAL", lastChanged: new Date().toISOString() });
  }

  public async connect(url?: string): Promise<boolean> {
    if (url) this.mtConnectUrl = url;
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
      // Simulate MTConnect XML polling updates
      const feedNode = this.mtNodes.get("path_feedrate");
      if (feedNode) {
        feedNode.value = Math.round(350 + (Math.random() - 0.5) * 30);
        feedNode.lastChanged = new Date().toISOString();
      }
      
      const tempNode = this.mtNodes.get("spindle_temp");
      if (tempNode) {
        tempNode.value = Number((26.0 + Math.random() * 1.5).toFixed(2));
        tempNode.lastChanged = new Date().toISOString();
      }

      this.emit("data", this.getNodes());
    }, 1800);
  }

  public getNodes(): MazakMtNode[] {
    return Array.from(this.mtNodes.values());
  }

  public forceCondition(nodeId: string, status: "NORMAL" | "WARNING" | "FAULT"): boolean {
    const node = this.mtNodes.get(nodeId);
    if (!node || node.category !== "CONDITION") return false;
    node.value = status;
    node.lastChanged = new Date().toISOString();
    this.emit("conditionChange", { nodeId, status });
    return true;
  }
}

export const mazakService = new MazakIntegration();
mazakService.connect().catch(console.error);
