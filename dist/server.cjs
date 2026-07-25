var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_dotenv2 = __toESM(require("dotenv"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");

// server/db/sqlserver.ts
var import_mssql = __toESM(require("mssql"), 1);
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var config = {
  user: process.env.SQL_USER || "",
  password: process.env.SQL_PASSWORD || "",
  server: process.env.SQL_SERVER || "",
  database: process.env.SQL_DATABASE || "",
  options: {
    encrypt: true,
    // For cloud endpoints
    trustServerCertificate: true
    // Change for production
  },
  connectionTimeout: 5e3,
  requestTimeout: 1e4
};
var pool = null;
var isConnected = false;
var fallbackDatabaseMode = true;
var queryLogs = [];
var dbCustomers = [
  { id: "scania_br", name: "Scania Brasil S.A.", code: "SCANIA-BR", contactInfo: "qualidade@scania.com.br" },
  { id: "volvo_tr", name: "Volvo Trucks S.A.", code: "VOLVO-TR", contactInfo: "quality@volvo.com" },
  { id: "mercedes_bz", name: "Mercedes-Benz Ind\xFAstrias", code: "MERCEDES-BZ", contactInfo: "cert@mercedes.de" }
];
var dbOperators = [
  { id: "jean_carlos", name: "Jean Carlos", role: "Supervisor de C\xE9lula", rfidCard: "RFID-OP-01", shift: "Turno A" },
  { id: "carlos_santos", name: "Carlos Santos", role: "Operador de Torno", rfidCard: "RFID-OP-02", shift: "Turno A" },
  { id: "mariana_souza", name: "Mariana Souza", role: "Operadora de Centro", rfidCard: "RFID-OP-03", shift: "Turno B" },
  { id: "renato_ramos", name: "Renato Ramos", role: "Operador de Corte", rfidCard: "RFID-OP-04", shift: "Turno B" },
  { id: "maria_clara", name: "Maria Clara", role: "T\xE9cnica de Metrologia", rfidCard: "RFID-OP-05", shift: "Turno A" }
];
var dbMaterialLots = [
  { id: "gerdau_a542", lotNumber: "Lote Gerdau A542", supplier: "Gerdau S.A.", materialType: "A\xE7o SAE 1045", hardnessHRC: 62, heatNumber: "HN-29482" },
  { id: "gerdau_a200", lotNumber: "Lote Gerdau A200", supplier: "Gerdau S.A.", materialType: "A\xE7o SAE 4140", hardnessHRC: 58, heatNumber: "HN-10482" }
];
var dbProductionOrders = [
  { id: "OP-90234-A", orderNumber: "OP-90234-A", customerId: "scania_br", partName: "Mancal Turbocompressor Scania T8", quantityPlanned: 824, quantityProduced: 142, status: "Em Execu\xE7\xE3o" },
  { id: "OP-10294-B", orderNumber: "OP-10294-B", customerId: "volvo_tr", partName: "Cabe\xE7ote de Alta Press\xE3o", quantityPlanned: 500, quantityProduced: 210, status: "Em Execu\xE7\xE3o" },
  { id: "OP-88204-X", orderNumber: "OP-88204-X", customerId: "mercedes_bz", partName: "Bloco Motor V8", quantityPlanned: 200, quantityProduced: 50, status: "Planejada" }
];
var dbTools = [
  { id: "T08", name: "Pastilha de Metal Duro (Fresa de Acabamento)", type: "Fresa de Acabamento", maxUsefulLifePieces: 2e3 },
  { id: "T05", name: "Fresa de Desbaste R\xE1pido", type: "Fresa de Desbaste", maxUsefulLifePieces: 1500 },
  { id: "T02", name: "Broca Canh\xE3o Carbureto", type: "Broca Canh\xE3o", maxUsefulLifePieces: 800 }
];
var dbToolHistory = [
  { id: "TH01", toolId: "T08", machineId: "CNC-03", installedAt: "2026-07-10T08:00:00.000Z", removedAt: null, piecesProduced: 1420, wearMm: 0.012, changeReason: "Desgaste preventivo planejado por ciclo de usinagem", operatorId: "jean_carlos" },
  { id: "TH02", toolId: "T05", machineId: "CNC-01", installedAt: "2026-07-11T13:00:00.000Z", removedAt: null, piecesProduced: 850, wearMm: 0.024, changeReason: "Calibra\xE7\xE3o de fuso", operatorId: "carlos_santos" }
];
var dbMachines = [];
var dbParts = [
  {
    id: "20260714-CNC03-000152",
    serialNumber: "20260714-CNC03-000152",
    qrCode: "https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=20260714-CNC03-000152",
    dataMatrix: "DM-20260714-CNC03-000152",
    rfidCode: "RFID-90234-A-152",
    dateStr: "14/07/2026",
    timeStr: "09:45:12",
    timestamp: "2026-07-14T09:45:12.000Z",
    machineId: "CNC-03",
    operatorId: "jean_carlos",
    cncProgram: "PRG_SCANIA_T8_REV4.nc",
    toolId: "T08",
    toolUsefulLife: "84%",
    toolWear: "0,012 mm",
    offsetX: "+0,015",
    offsetZ: "-0,008",
    rpm: 4500,
    feed: 1800,
    temperature: 38,
    vibration: 0.18,
    hydraulicPressure: "55 bar",
    lubrication: "Lubrifica\xE7\xE3o Ferramenta T08 (Fluido Ativo 8%)",
    customerId: "scania_br",
    orderId: "OP-90234-A",
    materialLotId: "gerdau_a542",
    status: "Aprovado",
    machiningTime: "6 min 12s",
    inspectionResult: "Conforme (98.2% de precis\xE3o nominal)"
  },
  {
    id: "20260714-CNC03-000153",
    serialNumber: "20260714-CNC03-000153",
    qrCode: "https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=20260714-CNC03-000153",
    dataMatrix: "DM-20260714-CNC03-000153",
    rfidCode: "RFID-90234-A-153",
    dateStr: "14/07/2026",
    timeStr: "09:50:00",
    timestamp: "2026-07-14T09:50:00.000Z",
    machineId: "CNC-03",
    operatorId: "jean_carlos",
    cncProgram: "PRG_SCANIA_T8_REV4.nc",
    toolId: "T08",
    toolUsefulLife: "83%",
    toolWear: "0,013 mm",
    offsetX: "+0,015",
    offsetZ: "-0,008",
    rpm: 4500,
    feed: 1800,
    temperature: 37.5,
    vibration: 0.19,
    hydraulicPressure: "55 bar",
    lubrication: "Lubrifica\xE7\xE3o Ferramenta T08 (Fluido Ativo 8%)",
    customerId: "scania_br",
    orderId: "OP-90234-A",
    materialLotId: "gerdau_a542",
    status: "Aprovado",
    machiningTime: "6 min 10s",
    inspectionResult: "Conforme (97.9% de precis\xE3o nominal)"
  },
  {
    id: "20260714-CNC01-000110",
    serialNumber: "20260714-CNC01-000110",
    qrCode: "https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=20260714-CNC01-000110",
    dataMatrix: "DM-20260714-CNC01-000110",
    rfidCode: "RFID-10294-B-110",
    dateStr: "14/07/2026",
    timeStr: "08:15:30",
    timestamp: "2026-07-14T08:15:30.000Z",
    machineId: "CNC-01",
    operatorId: "carlos_santos",
    cncProgram: "PRG_VOLVO_C3_REV2.nc",
    toolId: "T05",
    toolUsefulLife: "42%",
    toolWear: "0,045 mm",
    offsetX: "+0,002",
    offsetZ: "+0,011",
    rpm: 8500,
    feed: 1200,
    temperature: 42.1,
    vibration: 0.65,
    hydraulicPressure: "52 bar",
    lubrication: "Fluido de refrigera\xE7\xE3o abaixo do ideal, causando drift t\xE9rmico.",
    customerId: "volvo_tr",
    orderId: "OP-10294-B",
    materialLotId: "gerdau_a542",
    status: "Reprovado",
    machiningTime: "8 min 45s",
    inspectionResult: "N\xE3o Conforme - Sub-toler\xE2ncia Cr\xEDtica (Sucata)"
  },
  {
    id: "20260714-CNC02-000120",
    serialNumber: "20260714-CNC02-000120",
    qrCode: "https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=20260714-CNC02-000120",
    dataMatrix: "DM-20260714-CNC02-000120",
    rfidCode: "RFID-88204-X-120",
    dateStr: "14/07/2026",
    timeStr: "10:30:00",
    timestamp: "2026-07-14T10:30:00.000Z",
    machineId: "CNC-02",
    operatorId: "mariana_souza",
    cncProgram: "PRG_MB_V8_REV1.nc",
    toolId: "T02",
    toolUsefulLife: "75%",
    toolWear: "0,005 mm",
    offsetX: "-0,022",
    offsetZ: "+0,004",
    rpm: 12e3,
    feed: 2100,
    temperature: 26.8,
    vibration: 0.58,
    hydraulicPressure: "58 bar",
    lubrication: "Lubrifica\xE7\xE3o Ativa 10%",
    customerId: "mercedes_bz",
    orderId: "OP-88204-X",
    materialLotId: "gerdau_a200",
    status: "Retrabalho",
    machiningTime: "12 min 05s",
    inspectionResult: "Revisar - Super-toler\xE2ncia Calibr\xE1vel"
  }
];
var dbTimelineEvents = [
  { id: "TE01", partId: "20260714-CNC03-000152", eventTime: "08:12", eventType: "MAT_RECEIVE", title: "Mat\xE9ria-prima recebida", description: "Verifica\xE7\xE3o de dureza de lote Gerdau A542 aprovada.", status: "neutral" },
  { id: "TE02", partId: "20260714-CNC03-000152", eventTime: "08:18", eventType: "MACH_START", title: "M\xE1quina CNC-03 iniciou usinagem", description: "Programa CNC carregado e ciclo autom\xE1tico disparado.", status: "neutral" },
  { id: "TE03", partId: "20260714-CNC03-000152", eventTime: "08:24", eventType: "TOOL_USE", title: "Ferramenta T08 utilizada", description: "Fresa de acabamento operando a 4500 RPM e avan\xE7o de 1800 mm/min.", status: "neutral" },
  { id: "TE04", partId: "20260714-CNC03-000152", eventTime: "08:26", eventType: "TEMP_ALERT", title: "Temperatura monitorada", description: "Foco de calor no fuso atingiu 38\xB0C (limite t\xE9rmico aceit\xE1vel).", status: "neutral" },
  { id: "TE05", partId: "20260714-CNC03-000152", eventTime: "08:27", eventType: "AI_TREND", title: "IA detectou tend\xEAncia de desvio", description: "Algoritmo preditivo estimou desvio geom\xE9trico iminente por vibra\xE7\xE3o.", status: "warning" },
  { id: "TE06", partId: "20260714-CNC03-000152", eventTime: "08:27", eventType: "CORRECTION", title: "Offset corrigido automaticamente", description: "Compensa\xE7\xE3o de +0.012mm no eixo X enviada diretamente ao CNC Haas.", status: "success" },
  { id: "TE07", partId: "20260714-CNC03-000152", eventTime: "08:28", eventType: "NEW_MEASURE", title: "Nova medi\xE7\xE3o realizada", description: "Varredura laser intra-processo na c\xE9lula validando estabilidade dimensional.", status: "neutral" },
  { id: "TE08", partId: "20260714-CNC03-000152", eventTime: "08:29", eventType: "INSP_APPROVED", title: "Pe\xE7a aprovada", description: "Metrologia tridimensional Zeiss validando toler\xE2ncia m\xE1xima de 0.05mm.", status: "success" },
  { id: "TE09", partId: "20260714-CNC03-000152", eventTime: "08:30", eventType: "SHIPMENT", title: "Expedi\xE7\xE3o", description: "C\xF3digo Data Matrix gravado a laser, pe\xE7a encaminhada para doca Scania.", status: "success" },
  // Seed Timeline for Part 153
  { id: "TE10", partId: "20260714-CNC03-000153", eventTime: "08:50", eventType: "MAT_RECEIVE", title: "Mat\xE9ria-prima recebida", description: "Uso do lote Gerdau A542.", status: "neutral" },
  { id: "TE11", partId: "20260714-CNC03-000153", eventTime: "08:52", eventType: "MACH_START", title: "Usinagem Iniciada", description: "Execu\xE7\xE3o est\xE1vel na CNC-03.", status: "neutral" },
  { id: "TE12", partId: "20260714-CNC03-000153", eventTime: "08:58", eventType: "INSP_APPROVED", title: "Aprovado Zeiss", description: "Controle dimensional aprovado.", status: "success" }
];
var dbMeasurements = [
  { id: "ME01", partId: "20260714-CNC03-000152", characteristic: "Comprimento Nominal", targetValue: "120.00 mm", tolerance: "\xB10.05", measuredValue: "120.015 mm", deviation: "+0.015 mm", status: "ok" },
  { id: "ME02", partId: "20260714-CNC03-000152", characteristic: "Largura Nominal", targetValue: "45.00 mm", tolerance: "\xB10.03", measuredValue: "44.992 mm", deviation: "-0.008 mm", status: "ok" },
  { id: "ME03", partId: "20260714-CNC03-000152", characteristic: "Di\xE2metro Furo Central", targetValue: "20.00 mm", tolerance: "\xB10.01", measuredValue: "20.003 mm", deviation: "+0.003 mm", status: "ok" }
];
var dbInspections = [
  { id: "IN01", partId: "20260714-CNC03-000152", equipment: "P\xF3rtico Tridimensional ZEISS PRISMO", programName: "ZEISS-PRISMO-GEAR-152", cmmFileName: "PRISMO_CNC03_152.cmm", operator: "Maria Clara", timestamp: "2026-07-14T09:45:22.000Z", result: "Conforme (98.2% de precis\xE3o nominal)" }
];
var dbAIActions = [
  { id: "AI01", partId: "20260714-CNC03-000152", probabilityOfFailure: "82%", modelUsed: "Gemini QualityPredic-3.5", decisionReason: "IA detectou aumento sutil de vibra\xE7\xE3o axial no fuso CNC-03", parametersAnalyzed: "RPM, Vibra\xE7\xE3o axial, Temperatura fuso", correctionSuggested: "Offset X compensado em +0.012mm", correctionApplied: "Offset X compensado em +0,012 mm dinamicamente via barramento EtherCAT", resultAfterCorrection: "Inspe\xE7\xE3o de conformidade recalculada com sucesso", responseTimeMs: 45, timestamp: "2026-07-14T09:45:22.000Z" }
];
var dbAuditLogs = [
  { id: "AU01", partId: "20260714-CNC03-000152", who: "Eng. Carlos Alberto", whenStr: "14/07/2026 07:15", fieldChanged: "Lubrifica\xE7\xE3o de fuso", oldValue: "Fluxo 6%", newValue: "Fluxo 8%", reason: "Otimiza\xE7\xE3o t\xE9rmica para ciclo de alta velocidade", origin: "Manual - Terminal de Controle" },
  { id: "AU02", partId: "20260714-CNC03-000152", who: "Jean Carlos", whenStr: "14/07/2026 08:00", fieldChanged: "Calibra\xE7\xE3o inicial", oldValue: "Zeramento G54 Standard", newValue: "G54 Compensado por sensor laser", reason: "Setup de lote matutino", origin: "Manual - Painel CNC" }
];
var dbShipments = [
  { id: "SH01", partId: "20260714-CNC03-000152", customerId: "scania_br", trackingNumber: "TR-SCANIA-90234-152", shippedAt: "2026-07-14T10:00:00.000Z", status: "Entregue" }
];
var dbQualityEvents = [
  { id: "QE01", partId: "20260714-CNC01-000110", eventType: "THERMAL_DRIFT", severity: "HIGH", description: "Desvio dimensional grave causado por falha no sistema de refrigera\xE7\xE3o", loggedBy: "Carlos Santos", loggedAt: "2026-07-14T08:16:00.000Z" }
];
function logQuery(type, query, durationMs, status) {
  queryLogs.unshift({
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    query: `[${type}] ${query}`,
    durationMs,
    status
  });
  if (queryLogs.length > 50) queryLogs.pop();
}
function getDbStats() {
  return {
    connectionMode: isConnected ? "SQL_SERVER_CONNECTED" : "SIMULATION_FALLBACK",
    server: config.server || "localhost (Simulated)",
    database: config.database || "QualitySync_DB",
    user: config.user || "sa_dev",
    isConnected,
    fallbackDatabaseMode,
    logs: queryLogs
  };
}
function seedMockDatabase(initialMachines2, initialInspections2) {
  if (dbMachines.length === 0) dbMachines = [...initialMachines2];
}
async function connectToSqlServer() {
  const hasCredentials = !!(process.env.SQL_SERVER && process.env.SQL_DATABASE);
  if (!hasCredentials) {
    fallbackDatabaseMode = true;
    isConnected = false;
    logQuery("CONNECT", "Nenhuma credencial do SQL Server fornecida. Ativando Modo de Simula\xE7\xE3o.", 0, "success");
    return false;
  }
  try {
    const start = Date.now();
    pool = await new import_mssql.default.ConnectionPool(config).connect();
    isConnected = true;
    fallbackDatabaseMode = false;
    logQuery("CONNECT", `Conex\xE3o estabelecida com SQL Server em ${config.server}`, Date.now() - start, "success");
    await bootstrapTables();
    return true;
  } catch (err) {
    console.warn("\u26A0\uFE0F Falha ao conectar ao banco SQL Server real. Ativando banco emulado:", err.message);
    fallbackDatabaseMode = true;
    isConnected = false;
    logQuery("CONNECT", `FALHA DE CONEX\xC3O: ${err.message}. Fallback emulado ativo.`, 120, "error");
    return false;
  }
}
async function bootstrapTables() {
  if (!pool || !isConnected) return;
  try {
    const start = Date.now();
    const req = pool.request();
    await req.query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Customers' AND xtype='U')
      CREATE TABLE Customers (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        code VARCHAR(100) UNIQUE,
        contactInfo NVARCHAR(MAX),
        createdAt DATETIME DEFAULT GETDATE()
      )
    `);
    await req.query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Operators' AND xtype='U')
      CREATE TABLE Operators (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(100),
        rfidCard VARCHAR(100) UNIQUE,
        shift VARCHAR(50),
        createdAt DATETIME DEFAULT GETDATE()
      )
    `);
    await req.query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='MaterialLots' AND xtype='U')
      CREATE TABLE MaterialLots (
        id VARCHAR(50) PRIMARY KEY,
        lotNumber VARCHAR(100) NOT NULL UNIQUE,
        supplier VARCHAR(255),
        materialType VARCHAR(100),
        hardnessHRC FLOAT,
        heatNumber VARCHAR(100),
        createdAt DATETIME DEFAULT GETDATE()
      )
    `);
    await req.query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Machines' AND xtype='U')
      CREATE TABLE Machines (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(100),
        status VARCHAR(50),
        temperature FLOAT,
        vibration FLOAT,
        speedRpm INT,
        oee FLOAT,
        utilization FLOAT,
        partsHeuristic FLOAT,
        positionX INT,
        positionY INT,
        lastUpdated DATETIME DEFAULT GETDATE()
      )
    `);
    await req.query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Tools' AND xtype='U')
      CREATE TABLE Tools (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(100),
        maxUsefulLifePieces INT,
        createdAt DATETIME DEFAULT GETDATE()
      )
    `);
    await req.query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='ProductionOrders' AND xtype='U')
      CREATE TABLE ProductionOrders (
        id VARCHAR(50) PRIMARY KEY,
        orderNumber VARCHAR(100) NOT NULL UNIQUE,
        customerId VARCHAR(50) FOREIGN KEY REFERENCES Customers(id),
        partName VARCHAR(255),
        quantityPlanned INT,
        quantityProduced INT,
        status VARCHAR(50),
        createdAt DATETIME DEFAULT GETDATE()
      )
    `);
    await req.query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='ToolHistory' AND xtype='U')
      CREATE TABLE ToolHistory (
        id VARCHAR(50) PRIMARY KEY,
        toolId VARCHAR(50) FOREIGN KEY REFERENCES Tools(id),
        machineId VARCHAR(50) FOREIGN KEY REFERENCES Machines(id),
        installedAt DATETIME,
        removedAt DATETIME,
        piecesProduced INT,
        wearMm FLOAT,
        changeReason NVARCHAR(MAX),
        operatorId VARCHAR(50) FOREIGN KEY REFERENCES Operators(id)
      )
    `);
    await req.query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Parts' AND xtype='U')
      CREATE TABLE Parts (
        id VARCHAR(50) PRIMARY KEY,
        serialNumber VARCHAR(100) NOT NULL UNIQUE,
        qrCode VARCHAR(255),
        dataMatrix VARCHAR(255),
        rfidCode VARCHAR(255),
        dateStr VARCHAR(50),
        timeStr VARCHAR(50),
        timestamp DATETIME DEFAULT GETDATE(),
        machineId VARCHAR(50) FOREIGN KEY REFERENCES Machines(id),
        operatorId VARCHAR(50) FOREIGN KEY REFERENCES Operators(id),
        cncProgram VARCHAR(100),
        toolId VARCHAR(50) FOREIGN KEY REFERENCES Tools(id),
        toolUsefulLife VARCHAR(50),
        toolWear VARCHAR(50),
        offsetX VARCHAR(50),
        offsetZ VARCHAR(50),
        rpm INT,
        feed INT,
        temperature FLOAT,
        vibration FLOAT,
        hydraulicPressure VARCHAR(100),
        lubrication NVARCHAR(MAX),
        customerId VARCHAR(50) FOREIGN KEY REFERENCES Customers(id),
        orderId VARCHAR(50) FOREIGN KEY REFERENCES ProductionOrders(id),
        materialLotId VARCHAR(50) FOREIGN KEY REFERENCES MaterialLots(id),
        status VARCHAR(50),
        machiningTime VARCHAR(50),
        inspectionResult VARCHAR(100)
      )
    `);
    await req.query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='TimelineEvents' AND xtype='U')
      CREATE TABLE TimelineEvents (
        id VARCHAR(50) PRIMARY KEY,
        partId VARCHAR(50) FOREIGN KEY REFERENCES Parts(id) ON DELETE CASCADE,
        eventTime VARCHAR(50),
        eventType VARCHAR(100),
        title VARCHAR(255),
        description NVARCHAR(MAX),
        status VARCHAR(50)
      )
    `);
    await req.query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Measurements' AND xtype='U')
      CREATE TABLE Measurements (
        id VARCHAR(50) PRIMARY KEY,
        partId VARCHAR(50) FOREIGN KEY REFERENCES Parts(id) ON DELETE CASCADE,
        characteristic VARCHAR(255),
        targetValue VARCHAR(50),
        tolerance VARCHAR(50),
        measuredValue VARCHAR(50),
        deviation VARCHAR(50),
        status VARCHAR(50)
      )
    `);
    await req.query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Inspections' AND xtype='U')
      CREATE TABLE Inspections (
        id VARCHAR(50) PRIMARY KEY,
        partId VARCHAR(50) FOREIGN KEY REFERENCES Parts(id) ON DELETE CASCADE,
        equipment VARCHAR(255),
        programName VARCHAR(255),
        cmmFileName VARCHAR(255),
        operator VARCHAR(255),
        timestamp DATETIME DEFAULT GETDATE(),
        result VARCHAR(100)
      )
    `);
    await req.query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='AIActions' AND xtype='U')
      CREATE TABLE AIActions (
        id VARCHAR(50) PRIMARY KEY,
        partId VARCHAR(50) FOREIGN KEY REFERENCES Parts(id) ON DELETE CASCADE,
        probabilityOfFailure VARCHAR(50),
        modelUsed VARCHAR(100),
        decisionReason NVARCHAR(MAX),
        parametersAnalyzed NVARCHAR(MAX),
        correctionSuggested NVARCHAR(MAX),
        correctionApplied NVARCHAR(MAX),
        resultAfterCorrection NVARCHAR(MAX),
        responseTimeMs INT,
        timestamp DATETIME DEFAULT GETDATE()
      )
    `);
    await req.query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='AuditLogs' AND xtype='U')
      CREATE TABLE AuditLogs (
        id VARCHAR(50) PRIMARY KEY,
        partId VARCHAR(50) FOREIGN KEY REFERENCES Parts(id) ON DELETE CASCADE,
        who VARCHAR(255),
        whenStr VARCHAR(100),
        fieldChanged VARCHAR(100),
        oldValue NVARCHAR(MAX),
        newValue NVARCHAR(MAX),
        reason NVARCHAR(MAX),
        origin VARCHAR(100)
      )
    `);
    await req.query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Shipments' AND xtype='U')
      CREATE TABLE Shipments (
        id VARCHAR(50) PRIMARY KEY,
        partId VARCHAR(50) FOREIGN KEY REFERENCES Parts(id),
        customerId VARCHAR(50) FOREIGN KEY REFERENCES Customers(id),
        trackingNumber VARCHAR(100),
        shippedAt DATETIME DEFAULT GETDATE(),
        status VARCHAR(50)
      )
    `);
    await req.query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='QualityEvents' AND xtype='U')
      CREATE TABLE QualityEvents (
        id VARCHAR(50) PRIMARY KEY,
        partId VARCHAR(50) FOREIGN KEY REFERENCES Parts(id),
        eventType VARCHAR(100),
        severity VARCHAR(50),
        description NVARCHAR(MAX),
        loggedBy VARCHAR(255),
        loggedAt DATETIME DEFAULT GETDATE()
      )
    `);
    logQuery("BOOTSTRAP", "Cria\xE7\xE3o de todas as 15 tabelas com constraints conclu\xEDda no SQL Server.", Date.now() - start, "success");
    const checkCust = await req.query("SELECT COUNT(*) as cnt FROM Customers");
    if (checkCust.recordset[0].cnt === 0) {
      await seedProductionSqlServer();
    }
  } catch (err) {
    logQuery("BOOTSTRAP", `FALHA NO BOOTSTRAP: ${err.message}`, 0, "error");
  }
}
async function seedProductionSqlServer() {
  if (!pool || !isConnected) return;
  try {
    const start = Date.now();
    const transaction = new import_mssql.default.Transaction(pool);
    await transaction.begin();
    try {
      const request = new import_mssql.default.Request(transaction);
      for (const c of dbCustomers) {
        await request.query(`INSERT INTO Customers (id, name, code, contactInfo) VALUES ('${c.id}', '${c.name}', '${c.code}', '${c.contactInfo}')`);
      }
      for (const op of dbOperators) {
        await request.query(`INSERT INTO Operators (id, name, role, rfidCard, shift) VALUES ('${op.id}', '${op.name}', '${op.role}', '${op.rfidCard}', '${op.shift}')`);
      }
      for (const l of dbMaterialLots) {
        await request.query(`INSERT INTO MaterialLots (id, lotNumber, supplier, materialType, hardnessHRC, heatNumber) VALUES ('${l.id}', '${l.lotNumber}', '${l.supplier}', '${l.materialType}', ${l.hardnessHRC}, '${l.heatNumber}')`);
      }
      for (const po of dbProductionOrders) {
        await request.query(`INSERT INTO ProductionOrders (id, orderNumber, customerId, partName, quantityPlanned, quantityProduced, status) VALUES ('${po.id}', '${po.orderNumber}', '${po.customerId}', '${po.partName}', ${po.quantityPlanned}, ${po.quantityProduced}, '${po.status}')`);
      }
      for (const t of dbTools) {
        await request.query(`INSERT INTO Tools (id, name, type, maxUsefulLifePieces) VALUES ('${t.id}', '${t.name}', '${t.type}', ${t.maxUsefulLifePieces})`);
      }
      for (const th of dbToolHistory) {
        await request.query(`INSERT INTO ToolHistory (id, toolId, machineId, installedAt, removedAt, piecesProduced, wearMm, changeReason, operatorId) VALUES ('${th.id}', '${th.toolId}', '${th.machineId}', '${th.installedAt}', ${th.removedAt ? `'${th.removedAt}'` : "NULL"}, ${th.piecesProduced}, ${th.wearMm}, '${th.changeReason}', '${th.operatorId}')`);
      }
      for (const p of dbParts) {
        await request.query(`INSERT INTO Parts (id, serialNumber, qrCode, dataMatrix, rfidCode, dateStr, timeStr, timestamp, machineId, operatorId, cncProgram, toolId, toolUsefulLife, toolWear, offsetX, offsetZ, rpm, feed, temperature, vibration, hydraulicPressure, lubrication, customerId, orderId, materialLotId, status, machiningTime, inspectionResult) VALUES ('${p.id}', '${p.serialNumber}', '${p.qrCode}', '${p.dataMatrix}', '${p.rfidCode}', '${p.dateStr}', '${p.timeStr}', '${p.timestamp}', '${p.machineId}', '${p.operatorId}', '${p.cncProgram}', '${p.toolId}', '${p.toolUsefulLife}', '${p.toolWear}', '${p.offsetX}', '${p.offsetZ}', ${p.rpm}, ${p.feed}, ${p.temperature}, ${p.vibration}, '${p.hydraulicPressure}', '${p.lubrication}', '${p.customerId}', '${p.orderId}', '${p.materialLotId}', '${p.status}', '${p.machiningTime}', '${p.inspectionResult}')`);
      }
      for (const te of dbTimelineEvents) {
        await request.query(`INSERT INTO TimelineEvents (id, partId, eventTime, eventType, title, description, status) VALUES ('${te.id}', '${te.partId}', '${te.eventTime}', '${te.eventType}', '${te.title}', '${te.description}', '${te.status}')`);
      }
      for (const me of dbMeasurements) {
        await request.query(`INSERT INTO Measurements (id, partId, characteristic, targetValue, tolerance, measuredValue, deviation, status) VALUES ('${me.id}', '${me.partId}', '${me.characteristic}', '${me.targetValue}', '${me.tolerance}', '${me.measuredValue}', '${me.deviation}', '${me.status}')`);
      }
      for (const ins of dbInspections) {
        await request.query(`INSERT INTO Inspections (id, partId, equipment, programName, cmmFileName, operator, timestamp, result) VALUES ('${ins.id}', '${ins.partId}', '${ins.equipment}', '${ins.programName}', '${ins.cmmFileName}', '${ins.operator}', '${ins.timestamp}', '${ins.result}')`);
      }
      for (const ai of dbAIActions) {
        await request.query(`INSERT INTO AIActions (id, partId, probabilityOfFailure, modelUsed, decisionReason, parametersAnalyzed, correctionSuggested, correctionApplied, resultAfterCorrection, responseTimeMs, timestamp) VALUES ('${ai.id}', '${ai.partId}', '${ai.probabilityOfFailure}', '${ai.modelUsed}', '${ai.decisionReason}', '${ai.parametersAnalyzed}', '${ai.correctionSuggested}', '${ai.correctionApplied}', '${ai.resultAfterCorrection}', ${ai.responseTimeMs}, '${ai.timestamp}')`);
      }
      for (const au of dbAuditLogs) {
        await request.query(`INSERT INTO AuditLogs (id, partId, who, whenStr, fieldChanged, oldValue, newValue, reason, origin) VALUES ('${au.id}', '${au.partId}', '${au.who}', '${au.whenStr}', '${au.fieldChanged}', '${au.oldValue}', '${au.newValue}', '${au.reason}', '${au.origin}')`);
      }
      for (const sh of dbShipments) {
        await request.query(`INSERT INTO Shipments (id, partId, customerId, trackingNumber, shippedAt, status) VALUES ('${sh.id}', '${sh.partId}', '${sh.customerId}', '${sh.trackingNumber}', '${sh.shippedAt}', '${sh.status}')`);
      }
      for (const qe of dbQualityEvents) {
        await request.query(`INSERT INTO QualityEvents (id, partId, eventType, severity, description, loggedBy, loggedAt) VALUES ('${qe.id}', '${qe.partId}', '${qe.eventType}', '${qe.severity}', '${qe.description}', '${qe.loggedBy}', '${qe.loggedAt}')`);
      }
      await transaction.commit();
      logQuery("SEED", "Seeding inicial realizado com sucesso em transa\xE7\xE3o de lote no SQL Server.", Date.now() - start, "success");
    } catch (txErr) {
      await transaction.rollback();
      throw txErr;
    }
  } catch (err) {
    logQuery("SEED", `FALHA SEED BANCO DE PRODU\xC7\xC3O: ${err.message}`, 0, "error");
  }
}
async function dbGetParts(filters = {}) {
  const start = Date.now();
  if (fallbackDatabaseMode || !pool || !isConnected) {
    let filtered = [...dbParts];
    const q = filters.search?.toLowerCase().trim();
    if (q) {
      filtered = filtered.filter((p) => {
        const op = dbOperators.find((o) => o.id === p.operatorId);
        const ml = dbMaterialLots.find((m) => m.id === p.materialLotId);
        const po = dbProductionOrders.find((o) => o.id === p.orderId);
        const cs = dbCustomers.find((c) => c.id === p.customerId);
        const tl = dbTools.find((t) => t.id === p.toolId);
        return p.id.toLowerCase().includes(q) || p.serialNumber.toLowerCase().includes(q) || p.qrCode && p.qrCode.toLowerCase().includes(q) || p.dataMatrix && p.dataMatrix.toLowerCase().includes(q) || p.rfidCode && p.rfidCode.toLowerCase().includes(q) || p.machineId.toLowerCase().includes(q) || p.status.toLowerCase().includes(q) || p.cncProgram.toLowerCase().includes(q) || op && op.name.toLowerCase().includes(q) || ml && ml.lotNumber.toLowerCase().includes(q) || po && po.orderNumber.toLowerCase().includes(q) || cs && cs.name.toLowerCase().includes(q) || tl && tl.name.toLowerCase().includes(q);
      });
    }
    if (filters.lot) {
      const ml = dbMaterialLots.find((m) => m.lotNumber.toLowerCase() === filters.lot.toLowerCase());
      if (ml) filtered = filtered.filter((p) => p.materialLotId === ml.id);
    }
    if (filters.customer) {
      const cs = dbCustomers.find((c) => c.name.toLowerCase() === filters.customer.toLowerCase());
      if (cs) filtered = filtered.filter((p) => p.customerId === cs.id);
    }
    if (filters.machine) {
      filtered = filtered.filter((p) => p.machineId.toLowerCase() === filters.machine.toLowerCase());
    }
    if (filters.operator) {
      const op = dbOperators.find((o) => o.name.toLowerCase() === filters.operator.toLowerCase());
      if (op) filtered = filtered.filter((p) => p.operatorId === op.id);
    }
    if (filters.tool) {
      filtered = filtered.filter((p) => p.toolId.toLowerCase() === filters.tool.toLowerCase());
    }
    if (filters.order) {
      const po = dbProductionOrders.find((o) => o.orderNumber.toLowerCase() === filters.order.toLowerCase());
      if (po) filtered = filtered.filter((p) => p.orderId === po.id);
    }
    logQuery("SELECT_PARTS", `SELECT * FROM Parts [MOCK FILTERED: ${filtered.length} records]`, Date.now() - start, "success");
    return filtered;
  }
  try {
    let sqlQuery = "SELECT * FROM Parts WHERE 1=1";
    const req = pool.request();
    if (filters.search) {
      req.input("search", import_mssql.default.VarChar, `%${filters.search}%`);
      sqlQuery += ` AND (
        id LIKE @search OR 
        serialNumber LIKE @search OR 
        qrCode LIKE @search OR 
        dataMatrix LIKE @search OR 
        rfidCode LIKE @search OR 
        machineId LIKE @search OR 
        status LIKE @search OR
        cncProgram LIKE @search
      )`;
    }
    if (filters.lot) {
      req.input("lot", import_mssql.default.VarChar, filters.lot);
      sqlQuery += " AND materialLotId IN (SELECT id FROM MaterialLots WHERE lotNumber = @lot)";
    }
    if (filters.customer) {
      req.input("customer", import_mssql.default.VarChar, filters.customer);
      sqlQuery += " AND customerId IN (SELECT id FROM Customers WHERE name = @customer)";
    }
    if (filters.machine) {
      req.input("machine", import_mssql.default.VarChar, filters.machine);
      sqlQuery += " AND machineId = @machine";
    }
    if (filters.operator) {
      req.input("operator", import_mssql.default.VarChar, filters.operator);
      sqlQuery += " AND operatorId IN (SELECT id FROM Operators WHERE name = @operator)";
    }
    if (filters.tool) {
      req.input("tool", import_mssql.default.VarChar, filters.tool);
      sqlQuery += " AND toolId = @tool";
    }
    if (filters.order) {
      req.input("order", import_mssql.default.VarChar, filters.order);
      sqlQuery += " AND orderId IN (SELECT id FROM ProductionOrders WHERE orderNumber = @order)";
    }
    sqlQuery += " ORDER BY timestamp DESC";
    const res = await req.query(sqlQuery);
    logQuery("SELECT_PARTS", `SELECT FROM Parts [SQL SERVER: ${res.recordset.length} records]`, Date.now() - start, "success");
    return res.recordset;
  } catch (err) {
    logQuery("SELECT_PARTS", `FALHA SELECT_PARTS: ${err.message}`, Date.now() - start, "error");
    return dbParts;
  }
}
async function dbGetPartById(id) {
  const start = Date.now();
  if (fallbackDatabaseMode || !pool || !isConnected) {
    const part = dbParts.find((p) => p.id === id || p.serialNumber === id || p.qrCode === id || p.dataMatrix === id || p.rfidCode === id);
    if (!part) return null;
    const opt = dbOperators.find((o) => o.id === part.operatorId);
    const ml = dbMaterialLots.find((m) => m.id === part.materialLotId);
    const po = dbProductionOrders.find((o) => o.id === part.orderId);
    const cs = dbCustomers.find((c) => c.id === part.customerId);
    const tl = dbTools.find((t) => t.id === part.toolId);
    const th = dbToolHistory.find((h) => h.toolId === part.toolId && h.machineId === part.machineId);
    const timeline = dbTimelineEvents.filter((e) => e.partId === part.id);
    const measurements = dbMeasurements.filter((m) => m.partId === part.id);
    const inspections = dbInspections.filter((i) => i.partId === part.id);
    const aiActions = dbAIActions.find((a) => a.partId === part.id) || null;
    const auditTrail = dbAuditLogs.filter((a) => a.partId === part.id);
    const lotParts = dbParts.filter((p) => p.materialLotId === part.materialLotId).map((p) => p.id.split("-").pop() || p.id);
    logQuery("SELECT_PART_BY_ID", `SELECT SINGLE PART id: ${part.id} [MOCK]`, Date.now() - start, "success");
    return {
      id: part.id,
      name: po ? po.partName : "Componente de Precis\xE3o",
      status: part.status,
      general: {
        date: part.dateStr,
        time: part.timeStr,
        machine: part.machineId + " (Torno Haas VF-3 Alpha)",
        operator: opt ? `${opt.name} (${opt.role})` : "Operador Desconhecido",
        cncProgram: part.cncProgram,
        toolUsed: tl ? `Ferramenta ${tl.id} (${tl.name})` : "Ferramenta Geral",
        rawMaterialBatch: ml ? ml.lotNumber : "Lote Gerdau",
        client: cs ? cs.name : "Cliente Geral",
        productionOrder: po ? po.orderNumber : "OP-00000",
        machiningTime: part.machiningTime,
        totalBatchQty: po ? `${po.quantityPlanned} pe\xE7as` : "100 pe\xE7as"
      },
      sensors: {
        rpm: part.rpm,
        feed: part.feed,
        temperature: part.temperature,
        vibration: part.vibration,
        offsetX: part.offsetX,
        offsetZ: part.offsetZ,
        hydraulicPressure: part.hydraulicPressure,
        lubrication: part.lubrication
      },
      tooling: {
        id: part.toolId,
        name: tl ? tl.name : "Fresa Geral",
        usefulLife: part.toolUsefulLife,
        piecesProduced: th ? th.piecesProduced : 1200,
        wear: part.toolWear,
        lastChangeDate: "10/07/2026",
        changedBy: "Eng. Carlos Alberto",
        changeReason: th ? th.changeReason : "Ciclo planejado"
      },
      metrology: {
        equipment: "P\xF3rtico Tridimensional ZEISS PRISMO",
        operator: opt ? opt.name : "Maria Clara",
        program: inspections[0]?.programName || "ZEISS-PRISMO-GEAR-152",
        result: part.inspectionResult,
        cmmFileName: inspections[0]?.cmmFileName || "PRISMO_CNC03_152.cmm",
        dimensions: measurements.length > 0 ? measurements.map((m) => ({
          desc: m.characteristic,
          target: m.targetValue,
          tolerance: m.tolerance,
          measured: m.measuredValue,
          deviation: m.deviation,
          status: m.status
        })) : [
          { desc: "Comprimento Nominal", target: "120.00 mm", tolerance: "\xB10.05", measured: "120.015 mm", deviation: "+0.015 mm", status: "ok" },
          { desc: "Largura Nominal", target: "45.00 mm", tolerance: "\xB10.03", measured: "44.992 mm", deviation: "-0.008 mm", status: "ok" },
          { desc: "Di\xE2metro Furo Central", target: "20.00 mm", tolerance: "\xB10.01", measured: "20.003 mm", deviation: "+0.003 mm", status: "ok" }
        ]
      },
      aiCorrections: aiActions ? {
        timestamp: part.timeStr,
        detectedIssue: aiActions.decisionReason,
        probability: aiActions.probabilityOfFailure,
        actionTaken: aiActions.correctionApplied,
        newStatus: aiActions.resultAfterCorrection
      } : {
        timestamp: part.timeStr,
        detectedIssue: "Nenhuma anomalia cr\xEDtica registrada pela IA",
        probability: "0%",
        actionTaken: "Monitoramento cont\xEDnuo em regime est\xE1vel",
        newStatus: "Inspe\xE7\xE3o dimensional validada"
      },
      auditTrail: auditTrail.map((a) => ({
        who: a.who,
        when: a.whenStr,
        action: a.fieldChanged,
        oldVal: a.oldValue,
        newVal: a.newValue,
        reason: a.reason
      })),
      batchReverse: {
        lot: ml ? ml.lotNumber.replace("Lote ", "") : "A542",
        parts: lotParts,
        impact: {
          totalProduced: po ? po.quantityPlanned : 824,
          affectedClients: [cs ? cs.name : "Scania Brasil", "Volvo Trucks S.A.", "Mercedes-Benz Ind\xFAstrias"],
          productionDays: ["10/07/2026", "11/07/2026", "12/07/2026"]
        }
      },
      timeline: timeline.map((t) => ({
        time: t.eventTime,
        event: t.title,
        desc: t.description,
        status: t.status
      }))
    };
  }
  try {
    const req = pool.request();
    req.input("id", import_mssql.default.VarChar, id);
    const partRes = await req.query("SELECT * FROM Parts WHERE id = @id OR serialNumber = @id OR qrCode = @id OR dataMatrix = @id OR rfidCode = @id");
    if (partRes.recordset.length === 0) return null;
    const part = partRes.recordset[0];
    const pId = part.id;
    const optRes = await pool.request().query(`SELECT * FROM Operators WHERE id = '${part.operatorId}'`);
    const mlRes = await pool.request().query(`SELECT * FROM MaterialLots WHERE id = '${part.materialLotId}'`);
    const poRes = await pool.request().query(`SELECT * FROM ProductionOrders WHERE id = '${part.orderId}'`);
    const csRes = await pool.request().query(`SELECT * FROM Customers WHERE id = '${part.customerId}'`);
    const tlRes = await pool.request().query(`SELECT * FROM Tools WHERE id = '${part.toolId}'`);
    const thRes = await pool.request().query(`SELECT * FROM ToolHistory WHERE toolId = '${part.toolId}' AND machineId = '${part.machineId}'`);
    const timelineRes = await pool.request().query(`SELECT * FROM TimelineEvents WHERE partId = '${pId}' ORDER BY eventTime ASC`);
    const measRes = await pool.request().query(`SELECT * FROM Measurements WHERE partId = '${pId}'`);
    const inspRes = await pool.request().query(`SELECT * FROM Inspections WHERE partId = '${pId}'`);
    const aiRes = await pool.request().query(`SELECT * FROM AIActions WHERE partId = '${pId}'`);
    const auditRes = await pool.request().query(`SELECT * FROM AuditLogs WHERE partId = '${pId}'`);
    const lotPartsRes = await pool.request().query(`SELECT id FROM Parts WHERE materialLotId = '${part.materialLotId}'`);
    const lotParts = lotPartsRes.recordset.map((lp) => lp.id.split("-").pop() || lp.id);
    const opt = optRes.recordset[0];
    const ml = mlRes.recordset[0];
    const po = poRes.recordset[0];
    const cs = csRes.recordset[0];
    const tl = tlRes.recordset[0];
    const th = thRes.recordset[0];
    const aiActions = aiRes.recordset[0];
    logQuery("SELECT_PART_DETAIL", `JOIN QUERY para montagem da genealogia da pe\xE7a ${pId} [PRODU\xC7\xC3O SQL SERVER]`, Date.now() - start, "success");
    return {
      id: part.id,
      name: po ? po.partName : "Componente de Precis\xE3o",
      status: part.status,
      general: {
        date: part.dateStr,
        time: part.timeStr,
        machine: part.machineId + " (Torno Haas VF-3)",
        operator: opt ? `${opt.name} (${opt.role})` : "Operador Geral",
        cncProgram: part.cncProgram,
        toolUsed: tl ? `Ferramenta ${tl.id} (${tl.name})` : "Ferramenta CNC",
        rawMaterialBatch: ml ? ml.lotNumber : "Lote Gerdau",
        client: cs ? cs.name : "Cliente Cadastrado",
        productionOrder: po ? po.orderNumber : "OP-GERAL",
        machiningTime: part.machiningTime,
        totalBatchQty: po ? `${po.quantityPlanned} pe\xE7as` : "500 pe\xE7as"
      },
      sensors: {
        rpm: part.rpm,
        feed: part.feed,
        temperature: part.temperature,
        vibration: part.vibration,
        offsetX: part.offsetX,
        offsetZ: part.offsetZ,
        hydraulicPressure: part.hydraulicPressure,
        lubrication: part.lubrication
      },
      tooling: {
        id: part.toolId,
        name: tl ? tl.name : "Fresa CNC",
        usefulLife: part.toolUsefulLife,
        piecesProduced: th ? th.piecesProduced : 1420,
        wear: part.toolWear,
        lastChangeDate: "10/07/2026",
        changedBy: "Eng. Carlos Alberto",
        changeReason: th ? th.changeReason : "Otimiza\xE7\xE3o preditiva"
      },
      metrology: {
        equipment: "P\xF3rtico Tridimensional ZEISS PRISMO",
        operator: opt ? opt.name : "Maria Clara",
        program: inspRes.recordset[0]?.programName || "ZEISS-PRISMO-GEAR-152",
        result: part.inspectionResult,
        cmmFileName: inspRes.recordset[0]?.cmmFileName || "PRISMO_CNC03_152.cmm",
        dimensions: measRes.recordset.map((m) => ({
          desc: m.characteristic,
          target: m.targetValue,
          tolerance: m.tolerance,
          measured: m.measuredValue,
          deviation: m.deviation,
          status: m.status
        }))
      },
      aiCorrections: aiActions ? {
        timestamp: part.timeStr,
        detectedIssue: aiActions.decisionReason,
        probability: aiActions.probabilityOfFailure,
        actionTaken: aiActions.correctionApplied,
        newStatus: aiActions.resultAfterCorrection
      } : {
        timestamp: part.timeStr,
        detectedIssue: "Nenhuma anomalia detectada no ciclo",
        probability: "0%",
        actionTaken: "Sem corre\xE7\xF5es aplicadas",
        newStatus: "Est\xE1vel"
      },
      auditTrail: auditRes.recordset.map((a) => ({
        who: a.who,
        when: a.whenStr,
        action: a.fieldChanged,
        oldVal: a.oldValue,
        newVal: a.newValue,
        reason: a.reason
      })),
      batchReverse: {
        lot: ml ? ml.lotNumber.replace("Lote ", "") : "A542",
        parts: lotParts,
        impact: {
          totalProduced: po ? po.quantityPlanned : 824,
          affectedClients: [cs ? cs.name : "Scania Brasil", "Volvo Trucks S.A.", "Mercedes-Benz Ind\xFAstrias"],
          productionDays: ["10/07/2026", "11/07/2026", "12/07/2026"]
        }
      },
      timeline: timelineRes.recordset.map((t) => ({
        time: t.eventTime,
        event: t.title,
        desc: t.description,
        status: t.status
      }))
    };
  } catch (err) {
    logQuery("SELECT_PART_DETAIL", `FALHA COMPILA\xC7\xC3O PE\xC7A: ${err.message}`, Date.now() - start, "error");
    return null;
  }
}
async function dbGetTimeline(partId) {
  if (fallbackDatabaseMode || !pool || !isConnected) {
    return dbTimelineEvents.filter((e) => e.partId === partId);
  }
  try {
    const res = await pool.request().query(`SELECT * FROM TimelineEvents WHERE partId = '${partId}'`);
    return res.recordset;
  } catch {
    return [];
  }
}
async function dbGetMeasurements(partId) {
  if (fallbackDatabaseMode || !pool || !isConnected) {
    return dbMeasurements.filter((m) => m.partId === partId);
  }
  try {
    const res = await pool.request().query(`SELECT * FROM Measurements WHERE partId = '${partId}'`);
    return res.recordset;
  } catch {
    return [];
  }
}
async function dbGetAudit(partId) {
  if (fallbackDatabaseMode || !pool || !isConnected) {
    return dbAuditLogs.filter((a) => a.partId === partId);
  }
  try {
    const res = await pool.request().query(`SELECT * FROM AuditLogs WHERE partId = '${partId}'`);
    return res.recordset;
  } catch {
    return [];
  }
}
async function dbGetAiActions(partId) {
  if (fallbackDatabaseMode || !pool || !isConnected) {
    return dbAIActions.filter((a) => a.partId === partId);
  }
  try {
    const res = await pool.request().query(`SELECT * FROM AIActions WHERE partId = '${partId}'`);
    return res.recordset;
  } catch {
    return [];
  }
}
async function dbGetTool(toolId) {
  if (fallbackDatabaseMode || !pool || !isConnected) {
    const tl = dbTools.find((t) => t.id === toolId);
    if (!tl) return null;
    const history = dbToolHistory.filter((h) => h.toolId === toolId);
    return { ...tl, history };
  }
  try {
    const tlRes = await pool.request().query(`SELECT * FROM Tools WHERE id = '${toolId}'`);
    if (tlRes.recordset.length === 0) return null;
    const thRes = await pool.request().query(`SELECT * FROM ToolHistory WHERE toolId = '${toolId}'`);
    return { ...tlRes.recordset[0], history: thRes.recordset };
  } catch {
    return null;
  }
}
async function dbGetMachine(machineId) {
  if (fallbackDatabaseMode || !pool || !isConnected) {
    return dbMachines.find((m) => m.id === machineId) || null;
  }
  try {
    const res = await pool.request().query(`SELECT * FROM Machines WHERE id = '${machineId}'`);
    return res.recordset[0] || null;
  } catch {
    return null;
  }
}
async function dbCreatePart(p) {
  const start = Date.now();
  if (fallbackDatabaseMode || !pool || !isConnected) {
    dbParts.unshift(p);
    logQuery("INSERT_PART", `INSERT INTO Parts (id: ${p.id}) [EMULADO]`, Date.now() - start, "success");
    return;
  }
  try {
    const req = pool.request();
    req.input("id", import_mssql.default.VarChar, p.id);
    req.input("serialNumber", import_mssql.default.VarChar, p.serialNumber);
    req.input("qrCode", import_mssql.default.VarChar, p.qrCode);
    req.input("dataMatrix", import_mssql.default.VarChar, p.dataMatrix);
    req.input("rfidCode", import_mssql.default.VarChar, p.rfidCode);
    req.input("dateStr", import_mssql.default.VarChar, p.dateStr);
    req.input("timeStr", import_mssql.default.VarChar, p.timeStr);
    req.input("machineId", import_mssql.default.VarChar, p.machineId);
    req.input("operatorId", import_mssql.default.VarChar, p.operatorId);
    req.input("cncProgram", import_mssql.default.VarChar, p.cncProgram);
    req.input("toolId", import_mssql.default.VarChar, p.toolId);
    req.input("toolUsefulLife", import_mssql.default.VarChar, p.toolUsefulLife);
    req.input("toolWear", import_mssql.default.VarChar, p.toolWear);
    req.input("offsetX", import_mssql.default.VarChar, p.offsetX);
    req.input("offsetZ", import_mssql.default.VarChar, p.offsetZ);
    req.input("rpm", import_mssql.default.Int, p.rpm);
    req.input("feed", import_mssql.default.Int, p.feed);
    req.input("temperature", import_mssql.default.Float, p.temperature);
    req.input("vibration", import_mssql.default.Float, p.vibration);
    req.input("hydraulicPressure", import_mssql.default.VarChar, p.hydraulicPressure);
    req.input("lubrication", import_mssql.default.NVarChar, p.lubrication);
    req.input("customerId", import_mssql.default.VarChar, p.customerId);
    req.input("orderId", import_mssql.default.VarChar, p.orderId);
    req.input("materialLotId", import_mssql.default.VarChar, p.materialLotId);
    req.input("status", import_mssql.default.VarChar, p.status);
    req.input("machiningTime", import_mssql.default.VarChar, p.machiningTime);
    req.input("inspectionResult", import_mssql.default.VarChar, p.inspectionResult);
    await req.query(`
      INSERT INTO Parts (
        id, serialNumber, qrCode, dataMatrix, rfidCode, dateStr, timeStr, 
        machineId, operatorId, cncProgram, toolId, toolUsefulLife, toolWear, 
        offsetX, offsetZ, rpm, feed, temperature, vibration, hydraulicPressure, 
        lubrication, customerId, orderId, materialLotId, status, machiningTime, inspectionResult
      ) VALUES (
        @id, @serialNumber, @qrCode, @dataMatrix, @rfidCode, @dateStr, @timeStr,
        @machineId, @operatorId, @cncProgram, @toolId, @toolUsefulLife, @toolWear,
        @offsetX, @offsetZ, @rpm, @feed, @temperature, @vibration, @hydraulicPressure,
        @lubrication, @customerId, @orderId, @materialLotId, @status, @machiningTime, @inspectionResult
      )
    `);
    logQuery("INSERT_PART", `INSERT INTO Parts (id: ${p.id}) [PRODU\xC7\xC3O SQL SERVER]`, Date.now() - start, "success");
  } catch (err) {
    logQuery("INSERT_PART", `FALHA INSERT: ${err.message}`, Date.now() - start, "error");
    dbParts.unshift(p);
  }
}
async function dbCreateTimelineEvent(te) {
  if (fallbackDatabaseMode || !pool || !isConnected) {
    dbTimelineEvents.push(te);
    return;
  }
  try {
    const req = pool.request();
    req.input("id", import_mssql.default.VarChar, te.id);
    req.input("partId", import_mssql.default.VarChar, te.partId);
    req.input("eventTime", import_mssql.default.VarChar, te.eventTime);
    req.input("eventType", import_mssql.default.VarChar, te.eventType);
    req.input("title", import_mssql.default.VarChar, te.title);
    req.input("description", import_mssql.default.NVarChar, te.description);
    req.input("status", import_mssql.default.VarChar, te.status);
    await req.query(`
      INSERT INTO TimelineEvents (id, partId, eventTime, eventType, title, description, status)
      VALUES (@id, @partId, @eventTime, @eventType, @title, @description, @status)
    `);
  } catch {
  }
}
async function dbCreateAuditLog(al) {
  if (fallbackDatabaseMode || !pool || !isConnected) {
    dbAuditLogs.push(al);
    return;
  }
  try {
    const req = pool.request();
    req.input("id", import_mssql.default.VarChar, al.id);
    req.input("partId", import_mssql.default.VarChar, al.partId);
    req.input("who", import_mssql.default.VarChar, al.who);
    req.input("whenStr", import_mssql.default.VarChar, al.whenStr);
    req.input("fieldChanged", import_mssql.default.VarChar, al.fieldChanged);
    req.input("oldValue", import_mssql.default.NVarChar, al.oldValue);
    req.input("newValue", import_mssql.default.NVarChar, al.newValue);
    req.input("reason", import_mssql.default.NVarChar, al.reason);
    req.input("origin", import_mssql.default.VarChar, al.origin);
    await req.query(`
      INSERT INTO AuditLogs (id, partId, who, whenStr, fieldChanged, oldValue, newValue, reason, origin)
      VALUES (@id, @partId, @who, @whenStr, @fieldChanged, @oldValue, @newValue, @reason, @origin)
    `);
  } catch {
  }
}
async function dbSaveInspection(inspection) {
  const start = Date.now();
  if (fallbackDatabaseMode || !pool || !isConnected) {
    const existing = dbParts.find((p) => p.id === inspection.id);
    if (!existing) {
      const mockPart = {
        id: inspection.id,
        serialNumber: inspection.id,
        qrCode: `https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=${inspection.id}`,
        dataMatrix: `DM-${inspection.id}`,
        rfidCode: `RFID-${inspection.id}`,
        dateStr: new Date(inspection.timestamp).toLocaleDateString("pt-BR"),
        timeStr: new Date(inspection.timestamp).toLocaleTimeString("pt-BR"),
        timestamp: inspection.timestamp,
        machineId: inspection.machineId,
        operatorId: "carlos_santos",
        cncProgram: "PRG_AUTO_HAAS.nc",
        toolId: "T08",
        toolUsefulLife: "90%",
        toolWear: "0,005 mm",
        offsetX: "+0,000",
        offsetZ: "+0,000",
        rpm: 6e3,
        feed: 1500,
        temperature: inspection.temperatureCelsius,
        vibration: inspection.vibrationG || 0.25,
        hydraulicPressure: "54 bar",
        lubrication: "Lubrifica\xE7\xE3o Ativa",
        customerId: "scania_br",
        orderId: "OP-90234-A",
        materialLotId: "gerdau_a542",
        status: inspection.status === "approved" ? "Aprovado" : inspection.status === "rework" ? "Retrabalho" : "Reprovado",
        machiningTime: "7 min",
        inspectionResult: inspection.notes || "Aprovado Zeiss"
      };
      dbParts.unshift(mockPart);
      dbMeasurements.push({ id: "ME_" + inspection.id + "_1", partId: inspection.id, characteristic: "Comprimento Nominal", targetValue: "120.00 mm", tolerance: "\xB10.05", measuredValue: inspection.measurements.lengthMm + " mm", deviation: inspection.deviations.lengthMm + " mm", status: Math.abs(inspection.deviations.lengthMm) <= 0.05 ? "ok" : "fail" });
      dbMeasurements.push({ id: "ME_" + inspection.id + "_2", partId: inspection.id, characteristic: "Largura Nominal", targetValue: "45.00 mm", tolerance: "\xB10.03", measuredValue: inspection.measurements.widthMm + " mm", deviation: inspection.deviations.widthMm + " mm", status: Math.abs(inspection.deviations.widthMm) <= 0.03 ? "ok" : "fail" });
      dbMeasurements.push({ id: "ME_" + inspection.id + "_3", partId: inspection.id, characteristic: "Altura Nominal", targetValue: "30.00 mm", tolerance: "\xB10.02", measuredValue: inspection.measurements.heightMm + " mm", deviation: inspection.deviations.heightMm + " mm", status: Math.abs(inspection.deviations.heightMm) <= 0.02 ? "ok" : "fail" });
      dbInspections.push({ id: "IN_" + inspection.id, partId: inspection.id, equipment: "P\xF3rtico Tridimensional ZEISS PRISMO", programName: "ZEISS-PRISMO-GEN-AUTO", cmmFileName: `PRISMO_${inspection.id}.cmm`, operator: inspection.operator, timestamp: inspection.timestamp, result: inspection.notes });
      dbTimelineEvents.push({ id: "TE_" + inspection.id + "_1", partId: inspection.id, eventTime: "10:00", eventType: "MAT_RECEIVE", title: "Mat\xE9ria-prima recebida", description: "Lote Gerdau.", status: "neutral" });
      dbTimelineEvents.push({ id: "TE_" + inspection.id + "_2", partId: inspection.id, eventTime: "10:10", eventType: "MACH_START", title: "Usinagem Iniciada", description: `In\xEDcio de ciclo na m\xE1quina ${inspection.machineId}.`, status: "neutral" });
      dbTimelineEvents.push({ id: "TE_" + inspection.id + "_3", partId: inspection.id, eventTime: "10:20", eventType: "INSP_APPROVED", title: "Inspe\xE7\xE3o Conclu\xEDda", description: `Registrada via Zeiss Prismo por ${inspection.operator}.`, status: inspection.status === "approved" ? "success" : "warning" });
    }
    logQuery("INSERT", `INSERT INTO Inspections (id) VALUES ('${inspection.id}') [EMULADO]`, Date.now() - start, "success");
    return;
  }
  try {
    const p = {
      id: inspection.id,
      serialNumber: inspection.id,
      qrCode: `https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=${inspection.id}`,
      dataMatrix: `DM-${inspection.id}`,
      rfidCode: `RFID-${inspection.id}`,
      dateStr: new Date(inspection.timestamp).toLocaleDateString("pt-BR"),
      timeStr: new Date(inspection.timestamp).toLocaleTimeString("pt-BR"),
      timestamp: inspection.timestamp,
      machineId: inspection.machineId,
      operatorId: "carlos_santos",
      cncProgram: "PRG_AUTO_HAAS.nc",
      toolId: "T08",
      toolUsefulLife: "90%",
      toolWear: "0,005 mm",
      offsetX: "+0,000",
      offsetZ: "+0,000",
      rpm: 6e3,
      feed: 1500,
      temperature: inspection.temperatureCelsius,
      vibration: inspection.vibrationG || 0.25,
      hydraulicPressure: "54 bar",
      lubrication: "Lubrifica\xE7\xE3o Ativa",
      customerId: "scania_br",
      orderId: "OP-90234-A",
      materialLotId: "gerdau_a542",
      status: inspection.status === "approved" ? "Aprovado" : inspection.status === "rework" ? "Retrabalho" : "Reprovado",
      machiningTime: "7 min",
      inspectionResult: inspection.notes || "Aprovado Zeiss"
    };
    await dbCreatePart(p);
    const req1 = pool.request();
    req1.input("id1", import_mssql.default.VarChar, `ME_${inspection.id}_1`);
    req1.input("pId", import_mssql.default.VarChar, inspection.id);
    req1.input("target1", import_mssql.default.VarChar, "120.00 mm");
    req1.input("tol1", import_mssql.default.VarChar, "\xB10.05");
    req1.input("val1", import_mssql.default.VarChar, inspection.measurements.lengthMm + " mm");
    req1.input("dev1", import_mssql.default.VarChar, inspection.deviations.lengthMm + " mm");
    req1.input("stat1", import_mssql.default.VarChar, Math.abs(inspection.deviations.lengthMm) <= 0.05 ? "ok" : "fail");
    await req1.query(`INSERT INTO Measurements (id, partId, characteristic, targetValue, tolerance, measuredValue, deviation, status) VALUES (@id1, @pId, 'Comprimento Nominal', @target1, @tol1, @val1, @dev1, @stat1)`);
    const req2 = pool.request();
    req2.input("id2", import_mssql.default.VarChar, `ME_${inspection.id}_2`);
    req2.input("pId", import_mssql.default.VarChar, inspection.id);
    req2.input("target2", import_mssql.default.VarChar, "45.00 mm");
    req2.input("tol2", import_mssql.default.VarChar, "\xB10.03");
    req2.input("val2", import_mssql.default.VarChar, inspection.measurements.widthMm + " mm");
    req2.input("dev2", import_mssql.default.VarChar, inspection.deviations.widthMm + " mm");
    req2.input("stat2", import_mssql.default.VarChar, Math.abs(inspection.deviations.widthMm) <= 0.03 ? "ok" : "fail");
    await req2.query(`INSERT INTO Measurements (id, partId, characteristic, targetValue, tolerance, measuredValue, deviation, status) VALUES (@id2, @pId, 'Largura Nominal', @target2, @tol2, @val2, @dev2, @stat2)`);
    const req3 = pool.request();
    req3.input("id3", import_mssql.default.VarChar, `ME_${inspection.id}_3`);
    req3.input("pId", import_mssql.default.VarChar, inspection.id);
    req3.input("target3", import_mssql.default.VarChar, "30.00 mm");
    req3.input("tol3", import_mssql.default.VarChar, "\xB10.02");
    req3.input("val3", import_mssql.default.VarChar, inspection.measurements.heightMm + " mm");
    req3.input("dev3", import_mssql.default.VarChar, inspection.deviations.heightMm + " mm");
    req3.input("stat3", import_mssql.default.VarChar, Math.abs(inspection.deviations.heightMm) <= 0.02 ? "ok" : "fail");
    await req3.query(`INSERT INTO Measurements (id, partId, characteristic, targetValue, tolerance, measuredValue, deviation, status) VALUES (@id3, @pId, 'Altura Nominal', @target3, @tol3, @val3, @dev3, @stat3)`);
    const reqI = pool.request();
    reqI.input("id", import_mssql.default.VarChar, `IN_${inspection.id}`);
    reqI.input("pId", import_mssql.default.VarChar, inspection.id);
    reqI.input("equip", import_mssql.default.VarChar, "P\xF3rtico Tridimensional ZEISS PRISMO");
    reqI.input("prog", import_mssql.default.VarChar, "ZEISS-PRISMO-GEN-AUTO");
    reqI.input("file", import_mssql.default.VarChar, `PRISMO_${inspection.id}.cmm`);
    reqI.input("op", import_mssql.default.VarChar, inspection.operator);
    reqI.input("res", import_mssql.default.VarChar, inspection.notes || "Aprovado Zeiss");
    await reqI.query(`INSERT INTO Inspections (id, partId, equipment, programName, cmmFileName, operator, result) VALUES (@id, @pId, @equip, @prog, @file, @op, @res)`);
    await dbCreateTimelineEvent({ id: `TE_${inspection.id}_1`, partId: inspection.id, eventTime: "10:00", eventType: "MAT_RECEIVE", title: "Mat\xE9ria-prima recebida", description: "Lote Gerdau.", status: "neutral" });
    await dbCreateTimelineEvent({ id: `TE_${inspection.id}_2`, partId: inspection.id, eventTime: "10:10", eventType: "MACH_START", title: "Usinagem Iniciada", description: `In\xEDcio de ciclo na m\xE1quina ${inspection.machineId}.`, status: "neutral" });
    await dbCreateTimelineEvent({ id: `TE_${inspection.id}_3`, partId: inspection.id, eventTime: "10:20", eventType: "INSP_APPROVED", title: "Inspe\xE7\xE3o Conclu\xEDda", description: `Registrada via Zeiss Prismo por ${inspection.operator}.`, status: inspection.status === "approved" ? "success" : "warning" });
    logQuery("INSERT", `INSERT INTO Inspections (id) VALUES ('${inspection.id}') [PRODU\xC7\xC3O SQL SERVER]`, Date.now() - start, "success");
  } catch (err) {
    logQuery("INSERT", `FALHA INSERT LEGACY: ${err.message}`, Date.now() - start, "error");
  }
}
async function dbGetInspections() {
  const start = Date.now();
  if (fallbackDatabaseMode || !pool || !isConnected) {
    const results = dbParts.map((p) => ({
      id: p.id,
      batch: p.materialLotId === "gerdau_a542" ? "LOTE-CNC02-05" : "LOTE-CNC01-12",
      operator: "Carlos Santos",
      machineId: p.machineId,
      timestamp: p.timestamp,
      measurements: { lengthMm: p.rpm === 4500 ? 120.015 : 120.08, widthMm: 45.01, heightMm: 30.01 },
      deviations: { lengthMm: p.rpm === 4500 ? 0.015 : 0.08, widthMm: 0.01, heightMm: 0.01 },
      temperatureCelsius: p.temperature,
      vibrationG: p.vibration,
      status: p.status === "Aprovado" ? "approved" : p.status === "Retrabalho" ? "rework" : "rejected",
      notes: p.inspectionResult,
      partObservation: p.lubrication,
      buyerName: p.customerId === "scania_br" ? "Scania" : "Volvo Trucks",
      partName: p.name
    }));
    return results;
  }
  try {
    const res = await pool.request().query("SELECT TOP 100 * FROM Parts ORDER BY timestamp DESC");
    const results = res.recordset.map((p) => ({
      id: p.id,
      batch: "LOTE-CNC02-05",
      operator: "Carlos Santos",
      machineId: p.machineId,
      timestamp: p.timestamp?.toISOString() || (/* @__PURE__ */ new Date()).toISOString(),
      measurements: { lengthMm: p.rpm === 4500 ? 120.015 : 120.08, widthMm: 45.01, heightMm: 30.01 },
      deviations: { lengthMm: p.rpm === 4500 ? 0.015 : 0.08, widthMm: 0.01, heightMm: 0.01 },
      temperatureCelsius: p.temperature,
      vibrationG: p.vibration,
      status: p.status === "Aprovado" ? "approved" : p.status === "Retrabalho" ? "rework" : "rejected",
      notes: p.inspectionResult,
      partObservation: p.lubrication,
      buyerName: p.customerId === "scania_br" ? "Scania" : "Volvo Trucks",
      partName: "Mancal Turbocompressor Scania T8"
    }));
    return results;
  } catch (err) {
    logQuery("SELECT", `FALHA LEGACY SELECT: ${err.message}`, Date.now() - start, "error");
    return [];
  }
}
async function dbSaveMachine(m) {
  const start = Date.now();
  if (fallbackDatabaseMode || !pool || !isConnected) {
    const idx = dbMachines.findIndex((item) => item.id === m.id);
    if (idx !== -1) {
      dbMachines[idx] = m;
    } else {
      dbMachines.push(m);
    }
    return;
  }
  try {
    const req = pool.request();
    req.input("id", import_mssql.default.VarChar, m.id);
    req.input("name", import_mssql.default.VarChar, m.name);
    req.input("type", import_mssql.default.VarChar, m.type);
    req.input("status", import_mssql.default.VarChar, m.status);
    req.input("temp", import_mssql.default.Float, m.temperature);
    req.input("vib", import_mssql.default.Float, m.vibration);
    req.input("rpm", import_mssql.default.Int, m.speedRpm);
    req.input("oee", import_mssql.default.Float, m.oee);
    req.input("utilization", import_mssql.default.Float, m.utilization);
    req.input("heuristic", import_mssql.default.Float, m.partsHeuristic);
    req.input("x", import_mssql.default.Int, m.position.x);
    req.input("y", import_mssql.default.Int, m.position.y);
    await req.query(`
      MERGE INTO Machines WITH (HOLDLOCK) AS target
      USING (SELECT @id AS id) AS source
      ON target.id = source.id
      WHEN MATCHED THEN
        UPDATE SET 
          name = @name, type = @type, status = @status,
          temperature = @temp, vibration = @vib, speedRpm = @rpm,
          oee = @oee, utilization = @utilization, partsHeuristic = @heuristic,
          positionX = @x, positionY = @y, lastUpdated = GETDATE()
      WHEN NOT MATCHED THEN
        INSERT (id, name, type, status, temperature, vibration, speedRpm, oee, utilization, partsHeuristic, positionX, positionY)
        VALUES (@id, @name, @type, @status, @temp, @vib, @rpm, @oee, @utilization, @heuristic, @x, @y);
    `);
  } catch (err) {
    logQuery("MERGE", `FALHA MERGE Machines: ${err.message}`, Date.now() - start, "error");
    const idx = dbMachines.findIndex((item) => item.id === m.id);
    if (idx !== -1) dbMachines[idx] = m;
  }
}
async function dbGetMachines() {
  const start = Date.now();
  if (fallbackDatabaseMode || !pool || !isConnected) {
    return dbMachines;
  }
  try {
    const res = await pool.request().query("SELECT * FROM Machines");
    const results = res.recordset.map((r) => ({
      id: r.id,
      name: r.name,
      type: r.type,
      status: r.status,
      temperature: r.temperature,
      vibration: r.vibration,
      speedRpm: r.speedRpm,
      oee: r.oee,
      utilization: r.utilization,
      partsHeuristic: r.partsHeuristic,
      position: { x: r.positionX, y: r.positionY }
    }));
    return results;
  } catch (err) {
    logQuery("SELECT_MACHINES", `FALHA SELECT Machines: ${err.message}`, Date.now() - start, "error");
    return dbMachines;
  }
}

// server/integrations/opcua.ts
var import_events = require("events");
var OpcUaIntegration = class extends import_events.EventEmitter {
  constructor() {
    super();
    this.endpoint = "opc.tcp://192.168.1.100:4840";
    this.status = "disconnected";
    this.tags = /* @__PURE__ */ new Map();
    this.intervalTimer = null;
    this.initTags();
  }
  initTags() {
    this.addOrUpdateTag("ns=2;s=CNC01.Temperature", "CNC-01 Temperature", 22.4, "Double");
    this.addOrUpdateTag("ns=2;s=CNC01.Vibration", "CNC-01 Vibration", 0.25, "Double");
    this.addOrUpdateTag("ns=2;s=CNC01.SpindleSpeed", "CNC-01 Spindle RPM", 8500, "Int32");
    this.addOrUpdateTag("ns=2;s=CNC02.Temperature", "CNC-02 Temperature", 26.8, "Double");
    this.addOrUpdateTag("ns=2;s=CNC02.Vibration", "CNC-02 Vibration", 0.58, "Double");
  }
  addOrUpdateTag(nodeId, name, value, dataType) {
    this.tags.set(nodeId, {
      nodeId,
      name,
      value,
      dataType,
      quality: "Good",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
  async connect(endpoint) {
    if (endpoint) this.endpoint = endpoint;
    this.status = "connecting";
    this.emit("statusChange", this.status);
    return new Promise((resolve) => {
      setTimeout(() => {
        this.status = "connected";
        this.emit("statusChange", this.status);
        this.startPolling();
        resolve(true);
      }, 1e3);
    });
  }
  disconnect() {
    this.status = "disconnected";
    if (this.intervalTimer) clearInterval(this.intervalTimer);
    this.emit("statusChange", this.status);
  }
  startPolling() {
    if (this.intervalTimer) clearInterval(this.intervalTimer);
    this.intervalTimer = setInterval(() => {
      for (const [nodeId, tag] of this.tags.entries()) {
        if (tag.dataType === "Double") {
          const drift = nodeId.includes("CNC02") ? 0.3 : 0;
          tag.value = Number((tag.value + (Math.random() - 0.5) * 0.4 + drift).toFixed(2));
        } else if (tag.dataType === "Int32") {
          tag.value = Math.round(tag.value + (Math.random() - 0.5) * 100);
        }
        tag.timestamp = (/* @__PURE__ */ new Date()).toISOString();
        tag.quality = Math.random() > 0.01 ? "Good" : "Bad";
      }
      this.emit("data", this.getTags());
    }, 3e3);
  }
  getTags() {
    return Array.from(this.tags.values());
  }
  writeNodeValue(nodeId, value) {
    const tag = this.tags.get(nodeId);
    if (!tag) return false;
    tag.value = value;
    tag.timestamp = (/* @__PURE__ */ new Date()).toISOString();
    this.emit("tagWrite", { nodeId, value });
    return true;
  }
};
var opcUaService = new OpcUaIntegration();
opcUaService.connect().catch(console.error);

// server/integrations/modbus.ts
var import_events2 = require("events");
var ModbusIntegration = class extends import_events2.EventEmitter {
  constructor() {
    super();
    this.ip = "192.168.1.150";
    this.port = 502;
    this.status = "disconnected";
    this.registers = /* @__PURE__ */ new Map();
    this.intervalTimer = null;
    this.initRegisters();
  }
  initRegisters() {
    this.registers.set(40001, { address: 40001, type: "HoldingRegister", name: "Spindle_Speed_Ref", value: 4500, unit: "RPM", lastUpdated: (/* @__PURE__ */ new Date()).toISOString() });
    this.registers.set(40002, { address: 40002, type: "HoldingRegister", name: "Coolant_Pump_Status", value: true, lastUpdated: (/* @__PURE__ */ new Date()).toISOString() });
    this.registers.set(30001, { address: 30001, type: "InputRegister", name: "Axis_X_Temperature", value: 385, unit: "0.1 \xB0C", lastUpdated: (/* @__PURE__ */ new Date()).toISOString() });
    this.registers.set(30002, { address: 30002, type: "InputRegister", name: "Axis_Y_Vibration", value: 125, unit: "0.01 G", lastUpdated: (/* @__PURE__ */ new Date()).toISOString() });
    this.registers.set(1, { address: 1, type: "Coil", name: "Emergency_Stop_Cmd", value: false, lastUpdated: (/* @__PURE__ */ new Date()).toISOString() });
    this.registers.set(10001, { address: 10001, type: "DiscreteInput", name: "Safety_Door_Closed", value: true, lastUpdated: (/* @__PURE__ */ new Date()).toISOString() });
  }
  async connect(ip, port) {
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
      }, 1e3);
    });
  }
  disconnect() {
    this.status = "disconnected";
    if (this.intervalTimer) clearInterval(this.intervalTimer);
    this.emit("statusChange", this.status);
  }
  startPolling() {
    if (this.intervalTimer) clearInterval(this.intervalTimer);
    this.intervalTimer = setInterval(() => {
      for (const [address, reg] of this.registers.entries()) {
        if (reg.type === "InputRegister") {
          reg.value = Number(reg.value) + Math.round((Math.random() - 0.5) * 4);
        }
        reg.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
      }
      this.emit("data", this.getRegisters());
    }, 2500);
  }
  getRegisters() {
    return Array.from(this.registers.values());
  }
  writeRegister(address, value) {
    const reg = this.registers.get(address);
    if (!reg) return false;
    if (reg.type === "HoldingRegister" || reg.type === "Coil") {
      reg.value = value;
      reg.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
      this.emit("write", { address, value });
      return true;
    }
    return false;
  }
};
var modbusService = new ModbusIntegration();
modbusService.connect().catch(console.error);

// server/integrations/mqtt.ts
var import_mqtt = __toESM(require("mqtt"), 1);
var import_events3 = require("events");
var MqttIntegration = class extends import_events3.EventEmitter {
  constructor() {
    super();
    this.brokerUrl = "mqtt://broker.hivemq.com:1883";
    this.status = "disconnected";
    this.client = null;
    this.messageHistory = [];
  }
  async connect(brokerUrl) {
    if (brokerUrl) this.brokerUrl = brokerUrl;
    if (this.client) {
      this.client.end();
    }
    this.status = "connecting";
    this.emit("statusChange", this.status);
    return new Promise((resolve) => {
      try {
        this.client = import_mqtt.default.connect(this.brokerUrl, {
          connectTimeout: 4e3,
          reconnectPeriod: 1e4
        });
        this.client.on("connect", () => {
          this.status = "connected";
          this.emit("statusChange", this.status);
          this.client?.subscribe("factory/telemetry/#");
          this.client?.subscribe("factory/alerts/#");
          resolve(true);
        });
        this.client.on("message", (topic, message) => {
          const payload = message.toString();
          const timestamp = (/* @__PURE__ */ new Date()).toISOString();
          const msgObj = { topic, payload, timestamp };
          this.messageHistory.unshift(msgObj);
          if (this.messageHistory.length > 50) this.messageHistory.pop();
          this.emit("message", msgObj);
        });
        this.client.on("error", (err) => {
          console.warn("MQTT connection error (acting as fallback/simulated):", err.message);
          this.status = "disconnected";
          this.emit("statusChange", this.status);
          resolve(false);
        });
        this.client.on("close", () => {
          this.status = "disconnected";
          this.emit("statusChange", this.status);
        });
      } catch (e) {
        console.warn("MQTT connect exception:", e.message);
        this.status = "disconnected";
        this.emit("statusChange", this.status);
        resolve(false);
      }
      setTimeout(() => {
        if (this.status !== "connected") {
          this.status = "connected";
          this.emit("statusChange", this.status);
          this.startSimulation();
          resolve(true);
        }
      }, 1500);
    });
  }
  startSimulation() {
    setInterval(() => {
      if (this.status !== "connected") return;
      const mockPayload = {
        machineId: "CNC-02",
        temperature: Number((25.5 + Math.random() * 2).toFixed(2)),
        vibration: Number((0.45 + Math.random() * 0.15).toFixed(2)),
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
      const msgObj = {
        topic: "factory/telemetry/CNC-02",
        payload: JSON.stringify(mockPayload),
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
      this.messageHistory.unshift(msgObj);
      if (this.messageHistory.length > 50) this.messageHistory.pop();
      this.emit("message", msgObj);
    }, 5e3);
  }
  publish(topic, message) {
    if (this.client && this.status === "connected") {
      this.client.publish(topic, message);
    }
    this.messageHistory.unshift({
      topic,
      payload: message,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
    this.emit("publish", { topic, message });
  }
  getMessages() {
    return this.messageHistory;
  }
  disconnect() {
    if (this.client) {
      this.client.end();
      this.client = null;
    }
    this.status = "disconnected";
    this.emit("statusChange", this.status);
  }
};
var mqttService = new MqttIntegration();
mqttService.connect().catch(console.error);

// server/integrations/siemens.ts
var import_events4 = require("events");
var SiemensIntegration = class extends import_events4.EventEmitter {
  constructor() {
    super();
    this.plcIp = "192.168.1.10";
    this.rack = 0;
    this.slot = 1;
    this.status = "disconnected";
    this.dbRegisters = /* @__PURE__ */ new Map();
    this.intervalTimer = null;
    this.initS7Data();
  }
  initS7Data() {
    this.registerS7("DB10.DBX0.0", 10, 0, "BOOL", "CNC_Alpha_AutoMode", true, "Indica se o torno est\xE1 em modo autom\xE1tico");
    this.registerS7("DB10.DBX0.1", 10, 1, "BOOL", "CNC_Alpha_Spindle_On", true, "Indica se o fuso principal est\xE1 ligado");
    this.registerS7("DB10.DBW2", 10, 2, "INT", "CNC_Alpha_Override", 100, "Porcentagem de override do fuso (0-120%)");
    this.registerS7("DB10.DBD4", 10, 4, "REAL", "CNC_Alpha_Spindle_Load", 45.8, "Carga de torque do motor do fuso (%)");
    this.registerS7("DB12.DBD10", 12, 10, "REAL", "CNC_Alpha_Coolant_Pressure", 6.2, "Press\xE3o do l\xEDquido de refrigera\xE7\xE3o (Bar)");
  }
  registerS7(key, dbNumber, offset, type, name, value, description) {
    this.dbRegisters.set(key, { dbNumber, offset, type, name, value, description });
  }
  async connect(ip, rack, slot) {
    if (ip) this.plcIp = ip;
    if (rack !== void 0) this.rack = rack;
    if (slot !== void 0) this.slot = slot;
    this.status = "connecting";
    this.emit("statusChange", this.status);
    return new Promise((resolve) => {
      setTimeout(() => {
        this.status = "connected";
        this.emit("statusChange", this.status);
        this.startPolling();
        resolve(true);
      }, 1e3);
    });
  }
  disconnect() {
    this.status = "disconnected";
    if (this.intervalTimer) clearInterval(this.intervalTimer);
    this.emit("statusChange", this.status);
  }
  startPolling() {
    if (this.intervalTimer) clearInterval(this.intervalTimer);
    this.intervalTimer = setInterval(() => {
      for (const [key, reg] of this.dbRegisters.entries()) {
        if (reg.name === "CNC_Alpha_Spindle_Load") {
          reg.value = Number((40 + Math.random() * 15).toFixed(1));
        } else if (reg.name === "CNC_Alpha_Coolant_Pressure") {
          reg.value = Number((6 + (Math.random() - 0.5) * 0.4).toFixed(2));
        }
      }
      this.emit("data", this.getRegisters());
    }, 2e3);
  }
  getRegisters() {
    return Array.from(this.dbRegisters.entries()).map(([key, value]) => ({
      addressKey: key,
      ...value
    }));
  }
  writeDBValue(key, value) {
    const reg = this.dbRegisters.get(key);
    if (!reg) return false;
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
};
var siemensService = new SiemensIntegration();
siemensService.connect().catch(console.error);

// server/integrations/fanuc.ts
var import_events5 = require("events");
var FanucIntegration = class extends import_events5.EventEmitter {
  constructor() {
    super();
    this.cncIp = "192.168.1.50";
    this.port = 8193;
    // Default FOCAS Ethernet port
    this.status = "disconnected";
    this.state = {
      programNumber: "O1004 (LOTE-VALVULA-AERO)",
      activeGCode: "G01 G17 G40 G90",
      feedRate: 350,
      spindleSpeed: 12e3,
      spindleLoad: 68.5,
      axes: {
        X: { absolute: 120.08, relative: 120.08, machine: 120.08 },
        Y: { absolute: 45.04, relative: 45.04, machine: 45.04 },
        Z: { absolute: 30.03, relative: 30.03, machine: 30.03 }
      },
      alarms: [],
      toolNumber: 5
    };
    this.intervalTimer = null;
  }
  async connect(ip, port) {
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
      }, 1e3);
    });
  }
  disconnect() {
    this.status = "disconnected";
    if (this.intervalTimer) clearInterval(this.intervalTimer);
    this.emit("statusChange", this.status);
  }
  startPolling() {
    if (this.intervalTimer) clearInterval(this.intervalTimer);
    this.intervalTimer = setInterval(() => {
      this.state.axes.X.absolute = Number((120 + (Math.random() - 0.5) * 0.15).toFixed(4));
      this.state.axes.Y.absolute = Number((45 + (Math.random() - 0.5) * 0.1).toFixed(4));
      this.state.axes.Z.absolute = Number((30 + (Math.random() - 0.5) * 0.05).toFixed(4));
      this.state.spindleLoad = Number((60 + Math.random() * 15).toFixed(1));
      this.state.feedRate = Math.round(340 + Math.random() * 20);
      if (this.state.spindleLoad > 73) {
        this.state.alarms = ["EXCESSO_DE_CARGA_SPINDLE"];
      } else {
        this.state.alarms = [];
      }
      this.emit("data", this.state);
    }, 1500);
  }
  getState() {
    return this.state;
  }
  sendMCodeCommand(mCode) {
    this.emit("mCodeCommand", mCode);
    if (mCode === 30) {
      this.state.feedRate = 0;
      this.state.spindleSpeed = 0;
      this.state.spindleLoad = 0;
    } else if (mCode === 3) {
      this.state.spindleSpeed = 12e3;
      this.state.feedRate = 350;
    }
  }
};
var fanucService = new FanucIntegration();
fanucService.connect().catch(console.error);

// server/integrations/mitsubishi.ts
var import_events6 = require("events");
var MitsubishiIntegration = class extends import_events6.EventEmitter {
  constructor() {
    super();
    this.plcIp = "192.168.1.12";
    this.plcPort = 5013;
    // Default MC Protocol UDP/TCP port
    this.status = "disconnected";
    this.registers = /* @__PURE__ */ new Map();
    this.intervalTimer = null;
    this.initMelsecData();
  }
  initMelsecData() {
    this.registerMelsec("D100", "D", 100, "FLOAT32", "Cutting_Force_Newton", 1250.5, "For\xE7a mec\xE2nica de usinagem (Newtons)");
    this.registerMelsec("D102", "D", 102, "INT16", "Active_Tool_Index", 3, "N\xFAmero da ferramenta atualmente engatada");
    this.registerMelsec("D200", "D", 200, "UINT16", "Completed_Part_Count", 1420, "Contador acumulador de pe\xE7as processadas");
    this.registerMelsec("M100", "M", 100, "BIT", "Melsec_Error_Active", false, "Bit de flag indicativo de falha ativa");
    this.registerMelsec("M102", "M", 102, "BIT", "Melsec_Vacuum_Pump", true, "Indica se a bomba de v\xE1cuo est\xE1 pressurizando");
  }
  registerMelsec(key, deviceCode, address, dataType, name, value, description) {
    this.registers.set(key, { deviceCode, address, name, value, dataType, description });
  }
  async connect(ip, port) {
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
      }, 1e3);
    });
  }
  disconnect() {
    this.status = "disconnected";
    if (this.intervalTimer) clearInterval(this.intervalTimer);
    this.emit("statusChange", this.status);
  }
  startPolling() {
    if (this.intervalTimer) clearInterval(this.intervalTimer);
    this.intervalTimer = setInterval(() => {
      const forceReg = this.registers.get("D100");
      if (forceReg) {
        forceReg.value = Number((1200 + Math.random() * 100).toFixed(1));
      }
      this.emit("data", this.getRegisters());
    }, 2e3);
  }
  getRegisters() {
    return Array.from(this.registers.entries()).map(([key, value]) => ({
      key,
      ...value
    }));
  }
  writeRegister(key, value) {
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
};
var mitsubishiService = new MitsubishiIntegration();
mitsubishiService.connect().catch(console.error);

// server/integrations/beckhoff.ts
var import_events7 = require("events");
var BeckhoffIntegration = class extends import_events7.EventEmitter {
  constructor() {
    super();
    this.amsNetIdTarget = "192.168.1.15.1.1";
    this.amsPortTarget = 851;
    // Default TwinCAT 3 PLC port
    this.status = "disconnected";
    this.variables = /* @__PURE__ */ new Map();
    this.intervalTimer = null;
    this.initAdsVariables();
  }
  initAdsVariables() {
    this.variables.set("MAIN.robotAxis1.bActive", { symbolName: "MAIN.robotAxis1.bActive", indexGroup: 16416, indexOffset: 0, dataType: "BOOL", value: true, comment: "Estado ativo do servo motor articulado 1" });
    this.variables.set("MAIN.robotAxis1.fPositionDegree", { symbolName: "MAIN.robotAxis1.fPositionDegree", indexGroup: 16416, indexOffset: 4, dataType: "REAL", value: 180.5, comment: "Posi\xE7\xE3o angular absoluta do bra\xE7o KUKA (\xB0)" });
    this.variables.set("MAIN.temperatureSensors[1]", { symbolName: "MAIN.temperatureSensors[1]", indexGroup: 61472, indexOffset: 10, dataType: "REAL", value: 21.8, comment: "Sensor de temperatura f\xEDsica do mancal de junta" });
    this.variables.set("MAIN.sActiveLotName", { symbolName: "MAIN.sActiveLotName", indexGroup: 61488, indexOffset: 50, dataType: "STRING", value: "LOTE-ROB03-01", comment: "Nome do lote ativo transmitido \xE0 metrologia" });
  }
  async connect(netId, port) {
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
      }, 1e3);
    });
  }
  disconnect() {
    this.status = "disconnected";
    if (this.intervalTimer) clearInterval(this.intervalTimer);
    this.emit("statusChange", this.status);
  }
  startPolling() {
    if (this.intervalTimer) clearInterval(this.intervalTimer);
    this.intervalTimer = setInterval(() => {
      const posVar = this.variables.get("MAIN.robotAxis1.fPositionDegree");
      if (posVar) {
        posVar.value = Number((180 + Math.sin(Date.now() / 1e3) * 45).toFixed(2));
      }
      const tempVar = this.variables.get("MAIN.temperatureSensors[1]");
      if (tempVar) {
        tempVar.value = Number((21.5 + (Math.random() - 0.5) * 0.3).toFixed(2));
      }
      this.emit("data", this.getVariables());
    }, 1200);
  }
  getVariables() {
    return Array.from(this.variables.values());
  }
  writeVariable(symbolName, value) {
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
};
var beckhoffService = new BeckhoffIntegration();
beckhoffService.connect().catch(console.error);

// server/integrations/haas.ts
var import_events8 = require("events");
var HaasIntegration = class extends import_events8.EventEmitter {
  constructor() {
    super();
    this.ipAddress = "192.168.1.30";
    this.port = 5051;
    // Haas Ethernet Q-command port
    this.status = "disconnected";
    this.state = {
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
    this.intervalTimer = null;
  }
  async connect(ip, port) {
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
      }, 1e3);
    });
  }
  disconnect() {
    this.status = "disconnected";
    if (this.intervalTimer) clearInterval(this.intervalTimer);
    this.emit("statusChange", this.status);
  }
  startPolling() {
    if (this.intervalTimer) clearInterval(this.intervalTimer);
    this.intervalTimer = setInterval(() => {
      this.state.spindleSpeed = Math.round(8500 + (Math.random() - 0.5) * 150);
      this.state.feedRate = Math.round(280 + (Math.random() - 0.5) * 10);
      this.state.coolantLevel = Number(Math.max(0, this.state.coolantLevel - 0.01).toFixed(2));
      if (Math.random() > 0.95) {
        this.state.partsCompleted += 1;
        this.emit("partCompleted", this.state.partsCompleted);
      }
      this.emit("data", this.state);
    }, 2e3);
  }
  getState() {
    return this.state;
  }
  writeMacroValue(number, value) {
    const macro = this.state.macroVariables.find((m) => m.number === number);
    if (!macro) return false;
    macro.value = value;
    this.state.lastCommand = `?W${number} [Write Macro] = ${value}`;
    this.emit("macroWrite", { number, value });
    return true;
  }
};
var haasService = new HaasIntegration();
haasService.connect().catch(console.error);

// server/integrations/mazak.ts
var import_events9 = require("events");
var MazakIntegration = class extends import_events9.EventEmitter {
  constructor() {
    super();
    this.mtConnectUrl = "http://192.168.1.40:5000/current";
    this.status = "disconnected";
    this.mtNodes = /* @__PURE__ */ new Map();
    this.intervalTimer = null;
    this.initMtConnectNodes();
  }
  initMtConnectNodes() {
    this.mtNodes.set("avail", { id: "avail", category: "EVENT", name: "Availability", value: "AVAILABLE", lastChanged: (/* @__PURE__ */ new Date()).toISOString() });
    this.mtNodes.set("exec", { id: "exec", category: "EVENT", name: "Execution", value: "ACTIVE", lastChanged: (/* @__PURE__ */ new Date()).toISOString() });
    this.mtNodes.set("mode", { id: "mode", category: "EVENT", name: "ControllerMode", value: "AUTOMATIC", lastChanged: (/* @__PURE__ */ new Date()).toISOString() });
    this.mtNodes.set("path_feedrate", { id: "path_feedrate", category: "SAMPLE", name: "PathFeedrate", value: 360, subType: "ACTUAL", lastChanged: (/* @__PURE__ */ new Date()).toISOString() });
    this.mtNodes.set("spindle_temp", { id: "spindle_temp", category: "SAMPLE", name: "Spindle_Temperature", value: 26.8, lastChanged: (/* @__PURE__ */ new Date()).toISOString() });
    this.mtNodes.set("cond_lube", { id: "cond_lube", category: "CONDITION", name: "LubricationCondition", value: "NORMAL", lastChanged: (/* @__PURE__ */ new Date()).toISOString() });
  }
  async connect(url) {
    if (url) this.mtConnectUrl = url;
    this.status = "connecting";
    this.emit("statusChange", this.status);
    return new Promise((resolve) => {
      setTimeout(() => {
        this.status = "connected";
        this.emit("statusChange", this.status);
        this.startPolling();
        resolve(true);
      }, 1e3);
    });
  }
  disconnect() {
    this.status = "disconnected";
    if (this.intervalTimer) clearInterval(this.intervalTimer);
    this.emit("statusChange", this.status);
  }
  startPolling() {
    if (this.intervalTimer) clearInterval(this.intervalTimer);
    this.intervalTimer = setInterval(() => {
      const feedNode = this.mtNodes.get("path_feedrate");
      if (feedNode) {
        feedNode.value = Math.round(350 + (Math.random() - 0.5) * 30);
        feedNode.lastChanged = (/* @__PURE__ */ new Date()).toISOString();
      }
      const tempNode = this.mtNodes.get("spindle_temp");
      if (tempNode) {
        tempNode.value = Number((26 + Math.random() * 1.5).toFixed(2));
        tempNode.lastChanged = (/* @__PURE__ */ new Date()).toISOString();
      }
      this.emit("data", this.getNodes());
    }, 1800);
  }
  getNodes() {
    return Array.from(this.mtNodes.values());
  }
  forceCondition(nodeId, status) {
    const node = this.mtNodes.get(nodeId);
    if (!node || node.category !== "CONDITION") return false;
    node.value = status;
    node.lastChanged = (/* @__PURE__ */ new Date()).toISOString();
    this.emit("conditionChange", { nodeId, status });
    return true;
  }
};
var mazakService = new MazakIntegration();
mazakService.connect().catch(console.error);

// server/integrations/index.ts
function getAllIntegrationsStatus() {
  return {
    opcua: {
      name: "OPC UA Client (Enterprise Link)",
      status: opcUaService.status,
      endpoint: opcUaService.endpoint,
      tags: opcUaService.getTags()
    },
    modbus: {
      name: "Modbus TCP Integration (PLC Core)",
      status: modbusService.status,
      address: `${modbusService.ip}:${modbusService.port}`,
      registers: modbusService.getRegisters()
    },
    mqtt: {
      name: "MQTT Client Subscriber (IIoT Telemetry)",
      status: mqttService.status,
      broker: mqttService.brokerUrl,
      messages: mqttService.getMessages().slice(0, 5)
    },
    siemens: {
      name: "Siemens S7 Connector (Data Blocks)",
      status: siemensService.status,
      plcAddress: `${siemensService.plcIp}, Rack ${siemensService.rack}, Slot ${siemensService.slot}`,
      registers: siemensService.getRegisters()
    },
    fanuc: {
      name: "FANUC FOCAS Connection (CNC Absolute Eixes)",
      status: fanucService.status,
      endpoint: `${fanucService.cncIp}:${fanucService.port}`,
      state: fanucService.getState()
    },
    mitsubishi: {
      name: "Mitsubishi MC Protocol (MELSEC PLC)",
      status: mitsubishiService.status,
      endpoint: `${mitsubishiService.plcIp}:${mitsubishiService.plcPort}`,
      registers: mitsubishiService.getRegisters()
    },
    beckhoff: {
      name: "Beckhoff ADS/AMS Link (TwinCAT)",
      status: beckhoffService.status,
      target: `${beckhoffService.amsNetIdTarget}:${beckhoffService.amsPortTarget}`,
      variables: beckhoffService.getVariables()
    },
    haas: {
      name: "Haas CNC Q-Commands Serial/Ethernet",
      status: haasService.status,
      endpoint: `${haasService.ipAddress}:${haasService.port}`,
      state: haasService.getState()
    },
    mazak: {
      name: "Mazak MTConnect XML Parser",
      status: mazakService.status,
      url: mazakService.mtConnectUrl,
      nodes: mazakService.getNodes()
    }
  };
}
function writeIntegrationValue(protocol, addressKey, value) {
  try {
    switch (protocol.toLowerCase()) {
      case "opcua":
        return opcUaService.writeNodeValue(addressKey, value);
      case "modbus":
        const modAddr = parseInt(addressKey, 10);
        const parsedVal = value === "true" || value === true ? true : value === "false" || value === false ? false : parseInt(value, 10);
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
async function triggerIntegrationConnect(protocol, config2) {
  try {
    switch (protocol.toLowerCase()) {
      case "opcua":
        return await opcUaService.connect(config2.endpoint);
      case "modbus":
        return await modbusService.connect(config2.ip, parseInt(config2.port, 10));
      case "mqtt":
        return await mqttService.connect(config2.broker);
      case "siemens":
        return await siemensService.connect(config2.ip, parseInt(config2.rack, 10), parseInt(config2.slot, 10));
      case "fanuc":
        return await fanucService.connect(config2.ip, parseInt(config2.port, 10));
      case "mitsubishi":
        return await mitsubishiService.connect(config2.ip, parseInt(config2.port, 10));
      case "beckhoff":
        return await beckhoffService.connect(config2.netId, parseInt(config2.port, 10));
      case "haas":
        return await haasService.connect(config2.ip, parseInt(config2.port, 10));
      case "mazak":
        return await mazakService.connect(config2.url);
      default:
        return false;
    }
  } catch (e) {
    console.error(`Error connecting ${protocol}:`, e);
    return false;
  }
}

// server.ts
import_dotenv2.default.config();
var app = (0, import_express.default)();
app.use(import_express.default.json());
var PORT = 3e3;
var aiClient = null;
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    return null;
  }
  if (!aiClient) {
    aiClient = new import_genai.GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return aiClient;
}
var initialInspections = [
  {
    id: "SN-9340-A22",
    batch: "LOTE-CNC02-05",
    operator: "Carlos Santos",
    machineId: "CNC-02",
    timestamp: new Date(Date.now() - 5 * 6e4).toISOString(),
    measurements: { lengthMm: 120.04, widthMm: 45.01, heightMm: 30.01 },
    deviations: { lengthMm: 0.04, widthMm: 0.01, heightMm: 0.01 },
    temperatureCelsius: 22.8,
    vibrationG: 0.38,
    status: "approved",
    notes: "Medi\xE7\xE3o de rotina p\xF3s fresagem. Altamente conforme.",
    partObservation: "A\xE7o r\xE1pido SAE 1045 sem deforma\xE7\xF5es na superf\xEDcie de contato.",
    buyerName: "Scania",
    partName: "Bloco Motor V8",
    routingSteps: [
      { machineId: "CNC-01", timestamp: "13:30", machineNotes: "Corte bruto inicial do tarugo met\xE1lico." },
      { machineId: "CNC-02", timestamp: "14:15", machineNotes: "Fresagem de precis\xE3o e acabamento lateral." },
      { machineId: "ZEISS-01", timestamp: "14:40", machineNotes: "Metrologia 3D \xF3ptica." }
    ]
  },
  {
    id: "SN-9340-A21",
    batch: "LOTE-CNC02-05",
    operator: "Carlos Santos",
    machineId: "CNC-02",
    timestamp: new Date(Date.now() - 15 * 6e4).toISOString(),
    measurements: { lengthMm: 120.08, widthMm: 45.04, heightMm: 30.03 },
    deviations: { lengthMm: 0.08, widthMm: 0.04, heightMm: 0.03 },
    temperatureCelsius: 24.1,
    vibrationG: 0.44,
    status: "rework",
    notes: "Desvio dimensional leve por dilata\xE7\xE3o t\xE9rmica. Mandar para ajuste manual.",
    defectType: "Desvio Dimensional T\xE9rmico",
    partObservation: "Superf\xEDcie externa \xE1spera, necessita ret\xEDfica lateral de desbaste.",
    buyerName: "Volvo Trucks",
    partName: "Mancal Central do Eixo",
    routingSteps: [
      { machineId: "CNC-02", timestamp: "13:45", machineNotes: "Fluido de refrigera\xE7\xE3o abaixo do ideal, causando drift t\xE9rmico." },
      { machineId: "ZEISS-01", timestamp: "14:10", machineNotes: "Dete\xE7\xE3o autom\xE1tica de desalinhamento de 0.08mm." }
    ]
  },
  {
    id: "SN-9310-B02",
    batch: "LOTE-CNC01-12",
    operator: "Mariana Souza",
    machineId: "CNC-01",
    timestamp: new Date(Date.now() - 30 * 6e4).toISOString(),
    measurements: { lengthMm: 119.98, widthMm: 44.99, heightMm: 29.99 },
    deviations: { lengthMm: -0.02, widthMm: -0.01, heightMm: -0.01 },
    temperatureCelsius: 21.6,
    vibrationG: 0.22,
    status: "approved",
    notes: "Padr\xE3o de metrologia calibrado sob especifica\xE7\xF5es ZEISS.",
    partObservation: "Lote super-conforme para aplica\xE7\xE3o aeroespacial.",
    buyerName: "Scania",
    partName: "Cabe\xE7ote 366 de Alta Press\xE3o",
    routingSteps: [
      { machineId: "CNC-01", timestamp: "11:15", machineNotes: "Usinagem sob rota\xE7\xE3o est\xE1vel de 8500 RPM." },
      { machineId: "ZEISS-01", timestamp: "12:00", machineNotes: "Inspe\xE7\xE3o dimensional por apalpador f\xEDsico de rubi." }
    ]
  },
  {
    id: "SN-9400-X01",
    batch: "LOTE-LAS01-08",
    operator: "Renato Ramos",
    machineId: "LASER-01",
    timestamp: new Date(Date.now() - 45 * 6e4).toISOString(),
    measurements: { lengthMm: 120.15, widthMm: 45.12, heightMm: 30.05 },
    deviations: { lengthMm: 0.15, widthMm: 0.12, heightMm: 0.05 },
    temperatureCelsius: 26.5,
    vibrationG: 0.65,
    status: "rejected",
    notes: "A largura e o comprimento excedem a toler\xE2ncia limite. Lente do cabe\xE7ote laser desalinhada.",
    defectType: "Excesso Dimensional Cr\xEDtico",
    partObservation: "Pe\xE7a descartada devido a queima de borda lateral por superaquecimento.",
    buyerName: "Mercedes-Benz",
    partName: "Bloco Motor V8",
    routingSteps: [
      { machineId: "CNC-01", timestamp: "10:10", machineNotes: "Usinagem da pr\xE9-forma sem anomalias registradas." },
      { machineId: "LASER-01", timestamp: "10:50", machineNotes: "Corte a laser com lente desalinhada detectado via sensor t\xE9rmico." }
    ]
  },
  {
    id: "SN-9120-Q10",
    batch: "LOTE-ROB03-01",
    operator: "Beatriz Costa",
    machineId: "ROB-03",
    timestamp: new Date(Date.now() - 60 * 6e4).toISOString(),
    measurements: { lengthMm: 120.01, widthMm: 45.01, heightMm: 30 },
    deviations: { lengthMm: 0.01, widthMm: 0.01, heightMm: 0 },
    temperatureCelsius: 21.9,
    vibrationG: 0.15,
    status: "approved",
    notes: "Alinhamento robotizado excelente.",
    partObservation: "Nenhuma distor\xE7\xE3o de furos ou encaixes cil\xEDndricos.",
    buyerName: "Iveco Linhas",
    partName: "Acoplamento de Mancal Direcional",
    routingSteps: [
      { machineId: "CNC-01", timestamp: "08:15", machineNotes: "Fura\xE7\xE3o de alta velocidade." },
      { machineId: "ROB-03", timestamp: "09:05", machineNotes: "Montagem final automatizada com torque de 15 Nm." }
    ]
  }
];
var initialMachines = [
  {
    id: "CNC-01",
    name: "Torno CNC Haas VF-2 (Linha Alpha)",
    type: "CNC Milling",
    status: "online",
    temperature: 22.4,
    vibration: 0.25,
    speedRpm: 8500,
    oee: 88.5,
    utilization: 92,
    partsHeuristic: 3.5,
    position: { x: 220, y: 150 }
  },
  {
    id: "CNC-02",
    name: "Portal CNC Mazak VCN (Linha Beta)",
    type: "CNC Milling",
    status: "maintenance",
    temperature: 26.8,
    // Calibrando um desvio leve
    vibration: 0.58,
    // vibração em alerta
    speedRpm: 12e3,
    oee: 72.1,
    utilization: 68,
    partsHeuristic: 2.1,
    position: { x: 380, y: 240 }
  },
  {
    id: "LASER-01",
    name: "Esta\xE7\xE3o Laser Trumpf 3030 (Linha Gamma)",
    type: "Laser Cutter",
    status: "online",
    temperature: 23.1,
    vibration: 0.18,
    speedRpm: 0,
    oee: 93.2,
    utilization: 95,
    partsHeuristic: 6.8,
    position: { x: 550, y: 150 }
  },
  {
    id: "ROB-03",
    name: "Bra\xE7o KUKA KR-16 (Esta\xE7\xE3o Montagem)",
    type: "Robotic Assembly",
    status: "online",
    temperature: 21.8,
    vibration: 0.12,
    speedRpm: 1800,
    oee: 91,
    utilization: 89,
    partsHeuristic: 4.2,
    position: { x: 740, y: 320 }
  },
  {
    id: "ZEISS-01",
    name: "Metrologia 3D ZEISS PRISMO",
    type: "Metrology Zeiss Station",
    status: "online",
    temperature: 21,
    // Altíssima precisão exige 21°C constantes
    vibration: 0.02,
    speedRpm: 0,
    oee: 98.4,
    utilization: 99,
    partsHeuristic: 1.5,
    position: { x: 480, y: 410 }
  }
];
seedMockDatabase(initialMachines, initialInspections);
connectToSqlServer().catch((err) => console.error("Initial SQL Server connection error:", err));
async function applyFluctuations() {
  try {
    const dbMachs = await dbGetMachines();
    const updated = dbMachs.map((m) => {
      if (m.status === "offline") return m;
      let tempDelta = (Math.random() - 0.5) * 0.4;
      let vibDelta = (Math.random() - 0.5) * 0.06;
      let rpmDelta = (Math.random() - 0.5) * 150;
      let temperature = Number((m.temperature + tempDelta).toFixed(2));
      let vibration = Number(Math.max(0.01, m.vibration + vibDelta).toFixed(2));
      let speedRpm = m.speedRpm > 0 ? Math.round(Math.max(0, m.speedRpm + rpmDelta)) : 0;
      if (m.id === "CNC-02") {
        if (temperature < 25) temperature += 0.5;
        if (vibration < 0.4) vibration += 0.08;
      }
      if (m.id === "ZEISS-01") {
        temperature = Number((21 + (Math.random() - 0.5) * 0.05).toFixed(2));
        vibration = Number((0.02 + Math.random() * 0.01).toFixed(2));
      }
      return {
        ...m,
        temperature,
        vibration,
        speedRpm
      };
    });
    for (const m of updated) {
      await dbSaveMachine(m);
    }
  } catch (err) {
    console.warn("Telemetry fluctuation sync error:", err);
  }
}
setInterval(applyFluctuations, 4e3);
var registerPartsAndRelatedRoutes = (prefix) => {
  app.get(`${prefix}/parts`, async (req, res) => {
    try {
      const parts = await dbGetParts(req.query);
      res.json(parts);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.get(`${prefix}/parts/lot/:lot`, async (req, res) => {
    try {
      const parts = await dbGetParts({ lot: req.params.lot });
      res.json(parts);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.get(`${prefix}/parts/customer/:customer`, async (req, res) => {
    try {
      const parts = await dbGetParts({ customer: req.params.customer });
      res.json(parts);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.get(`${prefix}/parts/order/:order`, async (req, res) => {
    try {
      const parts = await dbGetParts({ order: req.params.order });
      res.json(parts);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.get(`${prefix}/parts/serial/:serial`, async (req, res) => {
    try {
      const part = await dbGetPartById(req.params.serial);
      if (!part) {
        return res.status(404).json({ error: "Pe\xE7a n\xE3o localizada por n\xFAmero serial." });
      }
      res.json(part);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.get(`${prefix}/parts/:id`, async (req, res) => {
    try {
      const part = await dbGetPartById(req.params.id);
      if (!part) {
        return res.status(404).json({ error: "Pe\xE7a n\xE3o localizada." });
      }
      res.json(part);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.get(`${prefix}/timeline/:partId`, async (req, res) => {
    try {
      const timeline = await dbGetTimeline(req.params.partId);
      res.json(timeline);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.get(`${prefix}/measurements/:partId`, async (req, res) => {
    try {
      const measurements = await dbGetMeasurements(req.params.partId);
      res.json(measurements);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.get(`${prefix}/audit/:partId`, async (req, res) => {
    try {
      const audit = await dbGetAudit(req.params.partId);
      res.json(audit);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.get(`${prefix}/ai/:partId`, async (req, res) => {
    try {
      const ai = await dbGetAiActions(req.params.partId);
      res.json(ai);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.get(`${prefix}/tools/:toolId`, async (req, res) => {
    try {
      const tool = await dbGetTool(req.params.toolId);
      if (!tool) {
        return res.status(404).json({ error: "Ferramenta n\xE3o localizada." });
      }
      res.json(tool);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.get(`${prefix}/machines/:machineId`, async (req, res) => {
    try {
      const machine = await dbGetMachine(req.params.machineId);
      if (!machine) {
        return res.status(404).json({ error: "M\xE1quina n\xE3o localizada." });
      }
      res.json(machine);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.post(`${prefix}/parts`, async (req, res) => {
    try {
      const p = req.body;
      if (!p.id || !p.serialNumber) {
        return res.status(400).json({ error: "Campos 'id' e 'serialNumber' s\xE3o obrigat\xF3rios." });
      }
      await dbCreatePart(p);
      res.status(201).json({ success: true, part: p });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.put(`${prefix}/parts/:id`, async (req, res) => {
    try {
      const partId = req.params.id;
      const part = await dbGetPartById(partId);
      if (!part) {
        return res.status(404).json({ error: "Pe\xE7a n\xE3o localizada." });
      }
      const { who, fieldChanged, oldValue, newValue, reason, origin } = req.body;
      if (who && fieldChanged) {
        const auditLog = {
          id: `AU-${Math.floor(1e3 + Math.random() * 9e3)}`,
          partId,
          who,
          whenStr: (/* @__PURE__ */ new Date()).toLocaleString("pt-BR"),
          fieldChanged,
          oldValue: oldValue || "",
          newValue: newValue || "",
          reason: reason || "Par\xE2metro modificado pelo operador",
          origin: origin || "Terminal Industrial"
        };
        await dbCreateAuditLog(auditLog);
      }
      res.json({ success: true, message: "Par\xE2metro atualizado com sucesso na rastreabilidade." });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
};
registerPartsAndRelatedRoutes("/api");
registerPartsAndRelatedRoutes("");
app.get("/api/machines", async (req, res) => {
  try {
    const machinesList = await dbGetMachines();
    res.json(machinesList);
  } catch (e) {
    res.status(500).json({ error: "Erro ao carregar m\xE1quinas do banco de dados." });
  }
});
app.get("/api/inspections", async (req, res) => {
  try {
    const inspectionsList = await dbGetInspections();
    res.json(inspectionsList);
  } catch (e) {
    res.status(500).json({ error: "Erro ao carregar inspe\xE7\xF5es do banco de dados." });
  }
});
app.post("/api/inspections", async (req, res) => {
  const {
    batch,
    operator,
    machineId,
    lengthMm,
    widthMm,
    heightMm,
    temperatureCelsius,
    notes,
    routingSteps,
    partObservation,
    buyerName,
    partName,
    status: manualStatus
  } = req.body;
  if (!batch || !operator || !machineId || lengthMm === void 0 || widthMm === void 0 || heightMm === void 0) {
    return res.status(400).json({ error: "Faltam par\xE2metros obrigat\xF3rios de metrologia." });
  }
  const randNum = Math.floor(1e3 + Math.random() * 9e3);
  const partId = `SN-${randNum}-M${machineId.replace(/[^0-9]/g, "") || "A"}`;
  const lengthDev = Number((lengthMm - 120).toFixed(4));
  const widthDev = Number((widthMm - 45).toFixed(4));
  const heightDev = Number((heightMm - 30).toFixed(4));
  const lengthOut = Math.abs(lengthDev) > 0.05;
  const widthOut = Math.abs(widthDev) > 0.03;
  const heightOut = Math.abs(heightDev) > 0.02;
  let status = "approved";
  let defectType = "";
  if (manualStatus === "approved" || manualStatus === "rework" || manualStatus === "rejected") {
    status = manualStatus;
    if (status === "rework") {
      defectType = "Defini\xE7\xE3o Manual (Retrabalho)";
    } else if (status === "rejected") {
      defectType = "Defini\xE7\xE3o Manual (Sucata)";
    }
  } else if (lengthOut || widthOut || heightOut) {
    const isUnderfilled = lengthDev < -0.05 || widthDev < -0.03 || heightDev < -0.02;
    if (isUnderfilled) {
      status = "rejected";
      defectType = "Sub-toler\xE2ncia Cr\xEDtica (Sucata)";
    } else {
      status = "rework";
      defectType = "Super-toler\xE2ncia Calibr\xE1vel";
    }
  }
  const machinesList = await dbGetMachines();
  const matchedMachine = machinesList.find((m) => m.id === machineId);
  const vibrationG = matchedMachine ? matchedMachine.vibration : 0.25;
  const newInspection = {
    id: partId,
    batch,
    operator,
    machineId,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    measurements: {
      lengthMm: Number(lengthMm),
      widthMm: Number(widthMm),
      heightMm: Number(heightMm)
    },
    deviations: {
      lengthMm: lengthDev,
      widthMm: widthDev,
      heightMm: heightDev
    },
    temperatureCelsius: Number(temperatureCelsius || 22),
    vibrationG,
    status,
    notes: notes || `Auto-calculado sob normas industriais. Pe\xE7a em estado: ${status === "approved" ? "Aprovado" : status === "rework" ? "Retrabalho" : "Reprovado"}.`,
    defectType: defectType || void 0,
    routingSteps: routingSteps || [],
    partObservation: partObservation || "",
    buyerName: buyerName || "",
    partName: partName || ""
  };
  await dbSaveInspection(newInspection);
  if (matchedMachine) {
    const updatedInspectionsList = await dbGetInspections();
    const totalMach = updatedInspectionsList.filter((i) => i.machineId === machineId).length;
    const appMach = updatedInspectionsList.filter((i) => i.machineId === machineId && i.status === "approved").length;
    matchedMachine.oee = Number((70 + appMach / (totalMach || 1) * 28).toFixed(1));
    await dbSaveMachine(matchedMachine);
  }
  res.status(201).json(newInspection);
});
app.get("/api/db/stats", (req, res) => {
  res.json(getDbStats());
});
app.post("/api/db/connect", async (req, res) => {
  const { server, database, user, password } = req.body;
  if (server && database) {
    process.env.SQL_SERVER = server;
    process.env.SQL_DATABASE = database;
    if (user) process.env.SQL_USER = user;
    if (password) process.env.SQL_PASSWORD = password;
  }
  const connected = await connectToSqlServer();
  res.json({ success: connected, stats: getDbStats() });
});
app.get("/api/integrations", (req, res) => {
  res.json(getAllIntegrationsStatus());
});
app.post("/api/integrations/write", (req, res) => {
  const { protocol, addressKey, value } = req.body;
  if (!protocol || !addressKey) {
    return res.status(400).json({ error: "Faltam par\xE2metros obrigat\xF3rios para escrita." });
  }
  const success = writeIntegrationValue(protocol, addressKey, value);
  res.json({ success, message: success ? "Sinal transmitido com sucesso." : "Falha ao gravar sinal no registrador." });
});
app.post("/api/integrations/connect", async (req, res) => {
  const { protocol, config: config2 } = req.body;
  if (!protocol || !config2) {
    return res.status(400).json({ error: "Protocolo e configura\xE7\xF5es de rede s\xE3o obrigat\xF3rios." });
  }
  const success = await triggerIntegrationConnect(protocol, config2);
  res.json({ success, status: success ? "connected" : "failed" });
});
app.post("/api/ai/audit", async (req, res) => {
  const customPrompt = req.body.prompt || "";
  try {
    const dbInsps = await dbGetInspections();
    const dbMachs = await dbGetMachines();
    const summaryInspections = dbInsps.map((i) => ({
      id: i.id,
      machineId: i.machineId,
      status: i.status,
      deviationsMm: i.deviations,
      temp: i.temperatureCelsius,
      vibG: i.vibrationG,
      defect: i.defectType
    }));
    const machineSummary = dbMachs.map((m) => ({
      id: m.id,
      name: m.name,
      status: m.status,
      tempCelsius: m.temperature,
      vibrationG: m.vibration,
      oee: m.oee
    }));
    const systemInstruction = `Voc\xEA \xE9 o Co-Piloto Inteligente de Qualidade e Opera\xE7\xE3o do 'QualitySync Industry 5.0' \u2013 um engenheiro especialista em metrologia ZEISS, simula\xE7\xE3o de g\xEAmeos digitais e automa\xE7\xE3o cibern\xE9tica.
Analise os dados das pe\xE7as inspecionadas e das m\xE1quinas em tempo real enviadas pelo usu\xE1rio.
Gere um relat\xF3rio t\xE9cnico de diagn\xF3stico industrial de alt\xEDssimo valor com 4 se\xE7\xF5es estruturadas perfeitamente em Markdown:
1. **DASHBOARD AUDIT STATUS**: Resumo t\xE1tico r\xE1pido do estado atual.
2. **PADR\xD5ES DE ANOMALIA DETECTADOS**: Explique desvios baseando-se nos acoplamento m\xE1quina x temperatura x vibra\xE7\xE3o. Se a linha CNC-02 apresentar desvios, fale sobre desalinhamento t\xE9rmico ou calibragem microsc\xF3pica do spindle.
3. **DIRETRIZES DE FLUXOS HOMEM-IA (IND\xDASTRIA 5.0)**: Como a for\xE7a operacional humana deve interagir com as recomenda\xE7\xF5es de IA para corrigir a calibra\xE7\xE3o com precis\xE3o ZEISS.
4. **RECOMENDADORES DE MANUTEN\xC7\xC3O PREDITIVA**: Forne\xE7a 2 a\xE7\xF5es espec\xEDficas de interven\xE7\xE3o.

A linguagem deve ser em Portugu\xEAs do Brasil, profissional, formal, concisa e orientada a processos industriais s\xE9rios (evite jarg\xF5es infantis ou marqueteiros).`;
    const inputPrompt = `DADOS DE ENTRADA DO CH\xC3O DE F\xC1BRICA:
MAQUIN\xC1RIO:
${JSON.stringify(machineSummary, null, 2)}

\xDALTIMAS INSPE\xC7\xD5ES REGISTRADAS:
${JSON.stringify(summaryInspections, null, 2)}

SOLICITA\xC7\xC3O COMPLEMENTAR DO ENGENHEIRO:
${customPrompt || "Realizar auditoria t\xE1tica geral e sugerir melhorias de conformidade do lote."}
`;
    const ai = getGeminiClient();
    if (ai) {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: inputPrompt,
        config: {
          systemInstruction,
          temperature: 0.2
        }
      });
      res.json({ text: response.text });
    } else {
      const cnc02 = dbMachs.find((m) => m.id === "CNC-02");
      const cnc02Temp = cnc02 ? cnc02.temperature : 26.8;
      const cnc02Vib = cnc02 ? cnc02.vibration : 0.58;
      const mockAudit = `### 1. **DASHBOARD AUDIT STATUS**
* **Lotes Processados**: 12,500 faturados | **Sensoriamento IoT**: Ativo com 100% de integridade (ZEISS Digital Link).
* **Taxa de Conformidade Global**: **80.0%** (Inst\xE1vel devido \xE0 deriva\xE7\xE3o t\xE9cnica na linha CNC-02).
* **Efici\xEAncia Geral (OEE M\xE9dio)**: **88.64%** | Gargalo de Qualidade localizado na fia\xE7\xE3o microsc\xF3pica da fita helicoidal.

---

### 2. **PADR\xD5ES DE ANOMALIA DETECTADOS**
* **Deriva T\xE9rmica na CNC-02 (${cnc02Temp}\xB0C)**: Identificamos uma varia\xE7\xE3o dimensional linear nas amostras (\`+0.08mm\` de comprimento). Este comportamento correlaciona-se com o aquecimento cont\xEDnuo do fuso (spindle) operando na rota\xE7\xE3o m\xE1xima de 12.000 RPM. A dilata\xE7\xE3o t\xE9rmica do cabe\xE7ote distorce o valor metrol\xF3gico ideal.
* **Sobrecarga de Vibra\xE7\xE3o (${cnc02Vib} G)**: A m\xE1quina CNC-02 registrou pico de vibra\xE7\xE3o ressonante. A an\xE1lise de harm\xF4nica infere desalinhamento axial ou desgaste nas guias prism\xE1ticas lineares inferiores, comprometendo a precis\xE3o micron da metrologia ZEISS.

---

### 3. **DIRETRIZES DE FLUXOS HOMEM-IA (IND\xDASTRIA 5.0)**
* **Calibragem Monitorada**: Em vez de parar totalmente a linha, a IA calcula compensa\xE7\xF5es autom\xE1ticas baseando-se nas equa\xE7\xF5es de expans\xE3o do material. Exiba ao operador Carlos Santos, em sua tela de controle industrial, a indica\xE7\xE3o para setar um offset corretivo de \`-0.045mm\` no eixo Z nas configura\xE7\xF5es do controlador CNC.
* **Preemp\xE7\xE3o Inteligente**: O operador pode aprovar pe\xE7as marcadas como 'rework' no portal de qualidade central. A IA direciona as pe\xE7as diretamente para desbaste assistido, integrando a decis\xE3o humana na otimiza\xE7\xE3o cir\xFArgica do a\xE7o.

---

### 4. **RECOMENDADORES DE MANUTEN\xC7\xC3O PREDITIVA**
* **A\xC7\xC3O 1 - Inspe\xE7\xE3o do Sistema de Refrigera\xE7\xE3o (CNC-02)**: Limpeza dos filtros e verifica\xE7\xE3o do n\xEDvel de fluido de corte refrigerante de alta press\xE3o dentro das pr\xF3ximas 4 horas nominais de opera\xE7\xE3o.
* **A\xC7\xC3O 2 - Verifica\xE7\xE3o de Torque e Mancal**: Agendar aperto preditivo de rolamentos e reaperto dos eixos guia da m\xE1quina CNC-02 via lubrifica\xE7\xE3o aut\xF3gena com \xF3leo sint\xE9tico ISO VG 68.`;
      res.json({ text: mockAudit });
    }
  } catch (error) {
    console.error("Gemini Audit Error: ", error);
    res.status(500).json({ error: "Erro na gera\xE7\xE3o do relat\xF3rio de IA.", detail: error.message });
  }
});
app.post("/api/ai/chat", async (req, res) => {
  const { message, history } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Mensagem obrigat\xF3ria." });
  }
  const systemInstruction = `Voc\xEA \xE9 o Assistente Especialista de Metrologia e Qualidade ZEISS da plataforma QualitySync.
Sua miss\xE3o \xE9 dar respostas e insights precisos sobre a Ind\xFAstria 5.0, calibra\xE7\xE3o mec\xE2nica, controle estat\xEDstico de processo (CEP), normas ISO 9001, OEE, sensores IoT, etc.
Seja t\xE9cnico, prestativo e extremamente focado no contexto mec\xE2nico-industrial. Responda em Portugu\xEAs do Brasil com excelente formata\xE7\xE3o de c\xF3digo ou tabelas quando apropriado.`;
  try {
    const ai = getGeminiClient();
    if (ai) {
      const chat = ai.chats.create({
        model: "gemini-3.5-flash",
        config: {
          systemInstruction,
          temperature: 0.7
        }
      });
      if (history && history.length > 0) {
        for (const turn of history) {
          await chat.sendMessage({ message: turn.text });
        }
      }
      const response = await chat.sendMessage({ message });
      res.json({ text: response.text });
    } else {
      let reply = "";
      const lower = message.toLowerCase();
      const dbMachs = await dbGetMachines();
      const cnc02 = dbMachs.find((m) => m.id === "CNC-02");
      const cnc02Vib = cnc02 ? cnc02.vibration : 0.58;
      if (lower.includes("calibrar") || lower.includes("calibra\xE7\xE3o")) {
        reply = `Para calibrar metrologicamente uma esta\xE7\xE3o de usinagem como a **CNC-02** sob padr\xF5es **ZEISS**:
1. **Estabiliza\xE7\xE3o T\xE9rmica**: Certifique-se de que a m\xE1quina operou em rota\xE7\xE3o de aquecimento por pelo menos 15 minutos at\xE9 atingir a temperatura padr\xE3o (idealmente de 21\xB0C a 23\xB0C).
2. **Offset Compensat\xF3rio**: Ajuste o offset de ferramenta no painel CNC inserindo o erro de posicionamento calculated de \`-0.05 mm\` obtido pelas medi\xE7\xF5es de metrologia 3D do m\xF3dulo Zeiss.
3. **Zeramento por Apalpador**: Execute o ciclo autom\xE1tico de calibra\xE7\xE3o utilizando o apalpador de toque (Renishaw/Zeiss) instalado no magazine.

Isso previne as varia\xE7\xF5es dimensionais registradas no lote atual!`;
      } else if (lower.includes("vibrar") || lower.includes("vibra\xE7\xE3o") || lower.includes("g")) {
        reply = `O n\xEDvel de vibra\xE7\xE3o ideal para opera\xE7\xF5es de corte CNC cont\xEDnuo de metais ferrosos deve ficar abaixo de **0.25 G**.
Atualmente, as leituras do sensor IoT acoplado ao rolamento superior da **CNC-02** est\xE3o em **${cnc02Vib} G**. 
Este limite de alerta indica um fen\xF4meno de **chuttering (vibra\xE7\xE3o regenerativa)** ou folga mec\xE2nica no fuso.
**Recomenda\xE7\xE3o**: Reduzir em 15% o avan\xE7o da ferramenta por rota\xE7\xE3o e programar uma inspe\xE7\xE3o por an\xE1lises de frequ\xEAncia vibracional (FFT) para verificar desgaste precoce nos mancais de rolamento.`;
      } else if (lower.includes("oee") || lower.includes("efici\xEAncia")) {
        const cnc01Oee = dbMachs.find((m) => m.id === "CNC-01")?.oee || 88.5;
        const cnc02Oee = cnc02 ? cnc02.oee : 72.1;
        const laserOee = dbMachs.find((m) => m.id === "LASER-01")?.oee || 93.2;
        reply = `A m\xE9dia de **OEE** da sua planta est\xE1 consolidada em **${Number(((cnc01Oee + cnc02Oee + laserOee) / 3).toFixed(1))}%**.
* CNC-01: **${cnc01Oee}%** (Excelente desempenho e disponibilidade)
* CNC-02: **${cnc02Oee}%** (Baixo \xEDndice devido a paradas preventivas de recalibragem de material)
* Esta\xE7\xE3o Laser: **${laserOee}%** (L\xEDder em rendimento)

Para elevar o OEE da CNC-02 acima de 85%, sugerimos implantar a metodologia de **Mudan\xE7a R\xE1pida de Ferramenta (SMED)** e compensar o desgaste da ferramenta no pr\xF3prio controlador em lotes reduzidos.`;
      } else {
        reply = `Ol\xE1! Sou o especialista de automa\xE7\xE3o industrial e metrologia **QualitySync AI**.
Posso apoiar sua equipe de controle de qualidade na f\xE1brica a:
- Ajustar desvios de calibra\xE7\xE3o microm\xE9tricos de equipamentos **ZEISS PRISMO**;
- Diagnosticar derivas t\xE9rmicas e mec\xE2nicas por vibra\xE7\xE3o excessiva nas CNCs (padr\xE3o limite de vibra\xE7\xE3o, guias lineares);
- Calcular e simular taxas de OEE, conformidade t\xE9cnica e fluxos cooperativos Homem-IA.

Qual instru\xE7\xE3o operacional de f\xE1brica voc\xEA deseja otimizar agora?`;
      }
      res.json({ text: reply });
    }
  } catch (error) {
    console.error("Gemini Chat Error: ", error);
    res.status(500).json({ error: "Erro no respondente de chat da IA.", detail: error.message });
  }
});
var startServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`QualitySync Fullstack Server running on http://localhost:${PORT}`);
  });
};
startServer();
//# sourceMappingURL=server.cjs.map
