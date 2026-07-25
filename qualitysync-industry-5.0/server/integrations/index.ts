import { opcUaService } from "./opcua.js";
import { modbusService } from "./modbus.js";
import { mqttService } from "./mqtt.js";
import { siemensService } from "./siemens.js";
import { fanucService } from "./fanuc.js";
import { mitsubishiService } from "./mitsubishi.js";
import { beckhoffService } from "./beckhoff.js";
import { haasService } from "./haas.js";
import { mazakService } from "./mazak.js";

export function getAllIntegrationsStatus() {
  return {
    opcua: {
      name: "OPC UA Client (Enterprise Link)",
      status: opcUaService.status,
      endpoint: opcUaService.endpoint,
      tags: opcUaService.getTags(),
    },
    modbus: {
      name: "Modbus TCP Integration (PLC Core)",
      status: modbusService.status,
      address: `${modbusService.ip}:${modbusService.port}`,
      registers: modbusService.getRegisters(),
    },
    mqtt: {
      name: "MQTT Client Subscriber (IIoT Telemetry)",
      status: mqttService.status,
      broker: mqttService.brokerUrl,
      messages: mqttService.getMessages().slice(0, 5),
    },
    siemens: {
      name: "Siemens S7 Connector (Data Blocks)",
      status: siemensService.status,
      plcAddress: `${siemensService.plcIp}, Rack ${siemensService.rack}, Slot ${siemensService.slot}`,
      registers: siemensService.getRegisters(),
    },
    fanuc: {
      name: "FANUC FOCAS Connection (CNC Absolute Eixes)",
      status: fanucService.status,
      endpoint: `${fanucService.cncIp}:${fanucService.port}`,
      state: fanucService.getState(),
    },
    mitsubishi: {
      name: "Mitsubishi MC Protocol (MELSEC PLC)",
      status: mitsubishiService.status,
      endpoint: `${mitsubishiService.plcIp}:${mitsubishiService.plcPort}`,
      registers: mitsubishiService.getRegisters(),
    },
    beckhoff: {
      name: "Beckhoff ADS/AMS Link (TwinCAT)",
      status: beckhoffService.status,
      target: `${beckhoffService.amsNetIdTarget}:${beckhoffService.amsPortTarget}`,
      variables: beckhoffService.getVariables(),
    },
    haas: {
      name: "Haas CNC Q-Commands Serial/Ethernet",
      status: haasService.status,
      endpoint: `${haasService.ipAddress}:${haasService.port}`,
      state: haasService.getState(),
    },
    mazak: {
      name: "Mazak MTConnect XML Parser",
      status: mazakService.status,
      url: mazakService.mtConnectUrl,
      nodes: mazakService.getNodes(),
    },
  };
}

export function writeIntegrationValue(protocol: string, addressKey: string, value: any): boolean {
  try {
    switch (protocol.toLowerCase()) {
      case "opcua":
        return opcUaService.writeNodeValue(addressKey, value);
      case "modbus":
        const modAddr = parseInt(addressKey, 10);
        const parsedVal = value === "true" || value === true ? true : (value === "false" || value === false ? false : parseInt(value, 10));
        return modbusService.writeRegister(modAddr, parsedVal);
      case "siemens":
        return siemensService.writeDBValue(addressKey, value);
      case "mitsubishi":
        return mitsubishiService.writeRegister(addressKey, value);
      case "beckhoff":
        return beckhoffService.writeVariable(addressKey, value);
      case "haas":
        const macroNum = parseInt(addressKey, 10);
        return haasService.writeMacroValue(macroNum, parseFloat(value));
      case "mazak":
        return mazakService.forceCondition(addressKey, value);
      case "mqtt":
        mqttService.publish(addressKey, typeof value === "string" ? value : JSON.stringify(value));
        return true;
      case "fanuc":
        const mCode = parseInt(addressKey, 10);
        fanucService.sendMCodeCommand(mCode);
        return true;
      default:
        return false;
    }
  } catch (e) {
    console.error(`Error writing value to ${protocol}:`, e);
    return false;
  }
}

export async function triggerIntegrationConnect(protocol: string, config: any): Promise<boolean> {
  try {
    switch (protocol.toLowerCase()) {
      case "opcua":
        return await opcUaService.connect(config.endpoint);
      case "modbus":
        return await modbusService.connect(config.ip, parseInt(config.port, 10));
      case "mqtt":
        return await mqttService.connect(config.broker);
      case "siemens":
        return await siemensService.connect(config.ip, parseInt(config.rack, 10), parseInt(config.slot, 10));
      case "fanuc":
        return await fanucService.connect(config.ip, parseInt(config.port, 10));
      case "mitsubishi":
        return await mitsubishiService.connect(config.ip, parseInt(config.port, 10));
      case "beckhoff":
        return await beckhoffService.connect(config.netId, parseInt(config.port, 10));
      case "haas":
        return await haasService.connect(config.ip, parseInt(config.port, 10));
      case "mazak":
        return await mazakService.connect(config.url);
      default:
        return false;
    }
  } catch (e) {
    console.error(`Error connecting ${protocol}:`, e);
    return false;
  }
}
