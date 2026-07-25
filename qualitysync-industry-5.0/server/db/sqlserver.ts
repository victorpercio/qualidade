import mssql from "mssql";
import dotenv from "dotenv";
import { PartInspection, Machine } from "../../src/types.js";

dotenv.config();

// SQL Server Configuration Schema
const config: mssql.config = {
  user: process.env.SQL_USER || "",
  password: process.env.SQL_PASSWORD || "",
  server: process.env.SQL_SERVER || "",
  database: process.env.SQL_DATABASE || "",
  options: {
    encrypt: true, // For cloud endpoints
    trustServerCertificate: true, // Change for production
  },
  connectionTimeout: 5000,
  requestTimeout: 10000,
};

let pool: mssql.ConnectionPool | null = null;
let isConnected = false;
let fallbackDatabaseMode = true;

// Query logs tracker for telemetry monitor in front-end
let queryLogs: Array<{ timestamp: string; query: string; durationMs: number; status: "success" | "error" }> = [];

// ==========================================
// IN-MEMORY FALLBACK STATE (DATABASE EMULATOR)
// ==========================================
let dbCustomers: any[] = [
  { id: "scania_br", name: "Scania Brasil S.A.", code: "SCANIA-BR", contactInfo: "qualidade@scania.com.br" },
  { id: "volvo_tr", name: "Volvo Trucks S.A.", code: "VOLVO-TR", contactInfo: "quality@volvo.com" },
  { id: "mercedes_bz", name: "Mercedes-Benz Indústrias", code: "MERCEDES-BZ", contactInfo: "cert@mercedes.de" }
];

let dbOperators: any[] = [
  { id: "jean_carlos", name: "Jean Carlos", role: "Supervisor de Célula", rfidCard: "RFID-OP-01", shift: "Turno A" },
  { id: "carlos_santos", name: "Carlos Santos", role: "Operador de Torno", rfidCard: "RFID-OP-02", shift: "Turno A" },
  { id: "mariana_souza", name: "Mariana Souza", role: "Operadora de Centro", rfidCard: "RFID-OP-03", shift: "Turno B" },
  { id: "renato_ramos", name: "Renato Ramos", role: "Operador de Corte", rfidCard: "RFID-OP-04", shift: "Turno B" },
  { id: "maria_clara", name: "Maria Clara", role: "Técnica de Metrologia", rfidCard: "RFID-OP-05", shift: "Turno A" }
];

let dbMaterialLots: any[] = [
  { id: "gerdau_a542", lotNumber: "Lote Gerdau A542", supplier: "Gerdau S.A.", materialType: "Aço SAE 1045", hardnessHRC: 62.0, heatNumber: "HN-29482" },
  { id: "gerdau_a200", lotNumber: "Lote Gerdau A200", supplier: "Gerdau S.A.", materialType: "Aço SAE 4140", hardnessHRC: 58.0, heatNumber: "HN-10482" }
];

let dbProductionOrders: any[] = [
  { id: "OP-90234-A", orderNumber: "OP-90234-A", customerId: "scania_br", partName: "Mancal Turbocompressor Scania T8", quantityPlanned: 824, quantityProduced: 142, status: "Em Execução" },
  { id: "OP-10294-B", orderNumber: "OP-10294-B", customerId: "volvo_tr", partName: "Cabeçote de Alta Pressão", quantityPlanned: 500, quantityProduced: 210, status: "Em Execução" },
  { id: "OP-88204-X", orderNumber: "OP-88204-X", customerId: "mercedes_bz", partName: "Bloco Motor V8", quantityPlanned: 200, quantityProduced: 50, status: "Planejada" }
];

let dbTools: any[] = [
  { id: "T08", name: "Pastilha de Metal Duro (Fresa de Acabamento)", type: "Fresa de Acabamento", maxUsefulLifePieces: 2000 },
  { id: "T05", name: "Fresa de Desbaste Rápido", type: "Fresa de Desbaste", maxUsefulLifePieces: 1500 },
  { id: "T02", name: "Broca Canhão Carbureto", type: "Broca Canhão", maxUsefulLifePieces: 800 }
];

let dbToolHistory: any[] = [
  { id: "TH01", toolId: "T08", machineId: "CNC-03", installedAt: "2026-07-10T08:00:00.000Z", removedAt: null, piecesProduced: 1420, wearMm: 0.012, changeReason: "Desgaste preventivo planejado por ciclo de usinagem", operatorId: "jean_carlos" },
  { id: "TH02", toolId: "T05", machineId: "CNC-01", installedAt: "2026-07-11T13:00:00.000Z", removedAt: null, piecesProduced: 850, wearMm: 0.024, changeReason: "Calibração de fuso", operatorId: "carlos_santos" }
];

let dbMachines: any[] = []; // Configured dynamically via seed

let dbParts: any[] = [
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
    temperature: 38.0,
    vibration: 0.18,
    hydraulicPressure: "55 bar",
    lubrication: "Lubrificação Ferramenta T08 (Fluido Ativo 8%)",
    customerId: "scania_br",
    orderId: "OP-90234-A",
    materialLotId: "gerdau_a542",
    status: "Aprovado",
    machiningTime: "6 min 12s",
    inspectionResult: "Conforme (98.2% de precisão nominal)"
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
    lubrication: "Lubrificação Ferramenta T08 (Fluido Ativo 8%)",
    customerId: "scania_br",
    orderId: "OP-90234-A",
    materialLotId: "gerdau_a542",
    status: "Aprovado",
    machiningTime: "6 min 10s",
    inspectionResult: "Conforme (97.9% de precisão nominal)"
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
    lubrication: "Fluido de refrigeração abaixo do ideal, causando drift térmico.",
    customerId: "volvo_tr",
    orderId: "OP-10294-B",
    materialLotId: "gerdau_a542",
    status: "Reprovado",
    machiningTime: "8 min 45s",
    inspectionResult: "Não Conforme - Sub-tolerância Crítica (Sucata)"
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
    rpm: 12000,
    feed: 2100,
    temperature: 26.8,
    vibration: 0.58,
    hydraulicPressure: "58 bar",
    lubrication: "Lubrificação Ativa 10%",
    customerId: "mercedes_bz",
    orderId: "OP-88204-X",
    materialLotId: "gerdau_a200",
    status: "Retrabalho",
    machiningTime: "12 min 05s",
    inspectionResult: "Revisar - Super-tolerância Calibrável"
  }
];

let dbTimelineEvents: any[] = [
  { id: "TE01", partId: "20260714-CNC03-000152", eventTime: "08:12", eventType: "MAT_RECEIVE", title: "Matéria-prima recebida", description: "Verificação de dureza de lote Gerdau A542 aprovada.", status: "neutral" },
  { id: "TE02", partId: "20260714-CNC03-000152", eventTime: "08:18", eventType: "MACH_START", title: "Máquina CNC-03 iniciou usinagem", description: "Programa CNC carregado e ciclo automático disparado.", status: "neutral" },
  { id: "TE03", partId: "20260714-CNC03-000152", eventTime: "08:24", eventType: "TOOL_USE", title: "Ferramenta T08 utilizada", description: "Fresa de acabamento operando a 4500 RPM e avanço de 1800 mm/min.", status: "neutral" },
  { id: "TE04", partId: "20260714-CNC03-000152", eventTime: "08:26", eventType: "TEMP_ALERT", title: "Temperatura monitorada", description: "Foco de calor no fuso atingiu 38°C (limite térmico aceitável).", status: "neutral" },
  { id: "TE05", partId: "20260714-CNC03-000152", eventTime: "08:27", eventType: "AI_TREND", title: "IA detectou tendência de desvio", description: "Algoritmo preditivo estimou desvio geométrico iminente por vibração.", status: "warning" },
  { id: "TE06", partId: "20260714-CNC03-000152", eventTime: "08:27", eventType: "CORRECTION", title: "Offset corrigido automaticamente", description: "Compensação de +0.012mm no eixo X enviada diretamente ao CNC Haas.", status: "success" },
  { id: "TE07", partId: "20260714-CNC03-000152", eventTime: "08:28", eventType: "NEW_MEASURE", title: "Nova medição realizada", description: "Varredura laser intra-processo na célula validando estabilidade dimensional.", status: "neutral" },
  { id: "TE08", partId: "20260714-CNC03-000152", eventTime: "08:29", eventType: "INSP_APPROVED", title: "Peça aprovada", description: "Metrologia tridimensional Zeiss validando tolerância máxima de 0.05mm.", status: "success" },
  { id: "TE09", partId: "20260714-CNC03-000152", eventTime: "08:30", eventType: "SHIPMENT", title: "Expedição", description: "Código Data Matrix gravado a laser, peça encaminhada para doca Scania.", status: "success" },

  // Seed Timeline for Part 153
  { id: "TE10", partId: "20260714-CNC03-000153", eventTime: "08:50", eventType: "MAT_RECEIVE", title: "Matéria-prima recebida", description: "Uso do lote Gerdau A542.", status: "neutral" },
  { id: "TE11", partId: "20260714-CNC03-000153", eventTime: "08:52", eventType: "MACH_START", title: "Usinagem Iniciada", description: "Execução estável na CNC-03.", status: "neutral" },
  { id: "TE12", partId: "20260714-CNC03-000153", eventTime: "08:58", eventType: "INSP_APPROVED", title: "Aprovado Zeiss", description: "Controle dimensional aprovado.", status: "success" }
];

let dbMeasurements: any[] = [
  { id: "ME01", partId: "20260714-CNC03-000152", characteristic: "Comprimento Nominal", targetValue: "120.00 mm", tolerance: "±0.05", measuredValue: "120.015 mm", deviation: "+0.015 mm", status: "ok" },
  { id: "ME02", partId: "20260714-CNC03-000152", characteristic: "Largura Nominal", targetValue: "45.00 mm", tolerance: "±0.03", measuredValue: "44.992 mm", deviation: "-0.008 mm", status: "ok" },
  { id: "ME03", partId: "20260714-CNC03-000152", characteristic: "Diâmetro Furo Central", targetValue: "20.00 mm", tolerance: "±0.01", measuredValue: "20.003 mm", deviation: "+0.003 mm", status: "ok" }
];

let dbInspections: any[] = [
  { id: "IN01", partId: "20260714-CNC03-000152", equipment: "Pórtico Tridimensional ZEISS PRISMO", programName: "ZEISS-PRISMO-GEAR-152", cmmFileName: "PRISMO_CNC03_152.cmm", operator: "Maria Clara", timestamp: "2026-07-14T09:45:22.000Z", result: "Conforme (98.2% de precisão nominal)" }
];

let dbAIActions: any[] = [
  { id: "AI01", partId: "20260714-CNC03-000152", probabilityOfFailure: "82%", modelUsed: "Gemini QualityPredic-3.5", decisionReason: "IA detectou aumento sutil de vibração axial no fuso CNC-03", parametersAnalyzed: "RPM, Vibração axial, Temperatura fuso", correctionSuggested: "Offset X compensado em +0.012mm", correctionApplied: "Offset X compensado em +0,012 mm dinamicamente via barramento EtherCAT", resultAfterCorrection: "Inspeção de conformidade recalculada com sucesso", responseTimeMs: 45, timestamp: "2026-07-14T09:45:22.000Z" }
];

let dbAuditLogs: any[] = [
  { id: "AU01", partId: "20260714-CNC03-000152", who: "Eng. Carlos Alberto", whenStr: "14/07/2026 07:15", fieldChanged: "Lubrificação de fuso", oldValue: "Fluxo 6%", newValue: "Fluxo 8%", reason: "Otimização térmica para ciclo de alta velocidade", origin: "Manual - Terminal de Controle" },
  { id: "AU02", partId: "20260714-CNC03-000152", who: "Jean Carlos", whenStr: "14/07/2026 08:00", fieldChanged: "Calibração inicial", oldValue: "Zeramento G54 Standard", newValue: "G54 Compensado por sensor laser", reason: "Setup de lote matutino", origin: "Manual - Painel CNC" }
];

let dbShipments: any[] = [
  { id: "SH01", partId: "20260714-CNC03-000152", customerId: "scania_br", trackingNumber: "TR-SCANIA-90234-152", shippedAt: "2026-07-14T10:00:00.000Z", status: "Entregue" }
];

let dbQualityEvents: any[] = [
  { id: "QE01", partId: "20260714-CNC01-000110", eventType: "THERMAL_DRIFT", severity: "HIGH", description: "Desvio dimensional grave causado por falha no sistema de refrigeração", loggedBy: "Carlos Santos", loggedAt: "2026-07-14T08:16:00.000Z" }
];

// ==========================================
// LOGGER & UTILS
// ==========================================
function logQuery(type: string, query: string, durationMs: number, status: "success" | "error") {
  queryLogs.unshift({
    timestamp: new Date().toISOString(),
    query: `[${type}] ${query}`,
    durationMs,
    status,
  });
  if (queryLogs.length > 50) queryLogs.pop();
}

export function getDbStats() {
  return {
    connectionMode: isConnected ? "SQL_SERVER_CONNECTED" : "SIMULATION_FALLBACK",
    server: config.server || "localhost (Simulated)",
    database: config.database || "QualitySync_DB",
    user: config.user || "sa_dev",
    isConnected,
    fallbackDatabaseMode,
    logs: queryLogs,
  };
}

// SEED MOCK STATE IF FALLBACK
export function seedMockDatabase(initialMachines: Machine[], initialInspections: PartInspection[]) {
  if (dbMachines.length === 0) dbMachines = [...initialMachines];
}

// ==========================================
// CONNECT AND BOOTSTRAP REAL SQL SERVER
// ==========================================
export async function connectToSqlServer(): Promise<boolean> {
  const hasCredentials = !!(process.env.SQL_SERVER && process.env.SQL_DATABASE);
  if (!hasCredentials) {
    fallbackDatabaseMode = true;
    isConnected = false;
    logQuery("CONNECT", "Nenhuma credencial do SQL Server fornecida. Ativando Modo de Simulação.", 0, "success");
    return false;
  }

  try {
    const start = Date.now();
    pool = await new mssql.ConnectionPool(config).connect();
    isConnected = true;
    fallbackDatabaseMode = false;
    logQuery("CONNECT", `Conexão estabelecida com SQL Server em ${config.server}`, Date.now() - start, "success");
    
    // Auto-bootstrap schemas on SQL Server if tables don't exist
    await bootstrapTables();
    return true;
  } catch (err: any) {
    console.warn("⚠️ Falha ao conectar ao banco SQL Server real. Ativando banco emulado:", err.message);
    fallbackDatabaseMode = true;
    isConnected = false;
    logQuery("CONNECT", `FALHA DE CONEXÃO: ${err.message}. Fallback emulado ativo.`, 120, "error");
    return false;
  }
}

async function bootstrapTables() {
  if (!pool || !isConnected) return;
  try {
    const start = Date.now();
    const req = pool.request();
    
    // Create Customers Table
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

    // Create Operators Table
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

    // Create MaterialLots Table
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

    // Create Machines Table if not exists
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

    // Create Tools Table
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

    // Create ProductionOrders Table
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

    // Create ToolHistory Table
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

    // Create Parts Table
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

    // Create TimelineEvents Table
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

    // Create Measurements Table
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

    // Create Inspections Table
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

    // Create AIActions Table
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

    // Create AuditLogs Table
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

    // Create Shipments Table
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

    // Create QualityEvents Table
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

    logQuery("BOOTSTRAP", "Criação de todas as 15 tabelas com constraints concluída no SQL Server.", Date.now() - start, "success");

    // Seed production database if customers table is empty
    const checkCust = await req.query("SELECT COUNT(*) as cnt FROM Customers");
    if (checkCust.recordset[0].cnt === 0) {
      await seedProductionSqlServer();
    }

  } catch (err: any) {
    logQuery("BOOTSTRAP", `FALHA NO BOOTSTRAP: ${err.message}`, 0, "error");
  }
}

async function seedProductionSqlServer() {
  if (!pool || !isConnected) return;
  try {
    const start = Date.now();
    const transaction = new mssql.Transaction(pool);
    await transaction.begin();

    try {
      const request = new mssql.Request(transaction);

      // Customers Seed
      for (const c of dbCustomers) {
        await request.query(`INSERT INTO Customers (id, name, code, contactInfo) VALUES ('${c.id}', '${c.name}', '${c.code}', '${c.contactInfo}')`);
      }

      // Operators Seed
      for (const op of dbOperators) {
        await request.query(`INSERT INTO Operators (id, name, role, rfidCard, shift) VALUES ('${op.id}', '${op.name}', '${op.role}', '${op.rfidCard}', '${op.shift}')`);
      }

      // MaterialLots Seed
      for (const l of dbMaterialLots) {
        await request.query(`INSERT INTO MaterialLots (id, lotNumber, supplier, materialType, hardnessHRC, heatNumber) VALUES ('${l.id}', '${l.lotNumber}', '${l.supplier}', '${l.materialType}', ${l.hardnessHRC}, '${l.heatNumber}')`);
      }

      // ProductionOrders Seed
      for (const po of dbProductionOrders) {
        await request.query(`INSERT INTO ProductionOrders (id, orderNumber, customerId, partName, quantityPlanned, quantityProduced, status) VALUES ('${po.id}', '${po.orderNumber}', '${po.customerId}', '${po.partName}', ${po.quantityPlanned}, ${po.quantityProduced}, '${po.status}')`);
      }

      // Tools Seed
      for (const t of dbTools) {
        await request.query(`INSERT INTO Tools (id, name, type, maxUsefulLifePieces) VALUES ('${t.id}', '${t.name}', '${t.type}', ${t.maxUsefulLifePieces})`);
      }

      // ToolHistory Seed
      for (const th of dbToolHistory) {
        await request.query(`INSERT INTO ToolHistory (id, toolId, machineId, installedAt, removedAt, piecesProduced, wearMm, changeReason, operatorId) VALUES ('${th.id}', '${th.toolId}', '${th.machineId}', '${th.installedAt}', ${th.removedAt ? `'${th.removedAt}'` : 'NULL'}, ${th.piecesProduced}, ${th.wearMm}, '${th.changeReason}', '${th.operatorId}')`);
      }

      // Parts Seed
      for (const p of dbParts) {
        await request.query(`INSERT INTO Parts (id, serialNumber, qrCode, dataMatrix, rfidCode, dateStr, timeStr, timestamp, machineId, operatorId, cncProgram, toolId, toolUsefulLife, toolWear, offsetX, offsetZ, rpm, feed, temperature, vibration, hydraulicPressure, lubrication, customerId, orderId, materialLotId, status, machiningTime, inspectionResult) VALUES ('${p.id}', '${p.serialNumber}', '${p.qrCode}', '${p.dataMatrix}', '${p.rfidCode}', '${p.dateStr}', '${p.timeStr}', '${p.timestamp}', '${p.machineId}', '${p.operatorId}', '${p.cncProgram}', '${p.toolId}', '${p.toolUsefulLife}', '${p.toolWear}', '${p.offsetX}', '${p.offsetZ}', ${p.rpm}, ${p.feed}, ${p.temperature}, ${p.vibration}, '${p.hydraulicPressure}', '${p.lubrication}', '${p.customerId}', '${p.orderId}', '${p.materialLotId}', '${p.status}', '${p.machiningTime}', '${p.inspectionResult}')`);
      }

      // TimelineEvents Seed
      for (const te of dbTimelineEvents) {
        await request.query(`INSERT INTO TimelineEvents (id, partId, eventTime, eventType, title, description, status) VALUES ('${te.id}', '${te.partId}', '${te.eventTime}', '${te.eventType}', '${te.title}', '${te.description}', '${te.status}')`);
      }

      // Measurements Seed
      for (const me of dbMeasurements) {
        await request.query(`INSERT INTO Measurements (id, partId, characteristic, targetValue, tolerance, measuredValue, deviation, status) VALUES ('${me.id}', '${me.partId}', '${me.characteristic}', '${me.targetValue}', '${me.tolerance}', '${me.measuredValue}', '${me.deviation}', '${me.status}')`);
      }

      // Inspections Seed
      for (const ins of dbInspections) {
        await request.query(`INSERT INTO Inspections (id, partId, equipment, programName, cmmFileName, operator, timestamp, result) VALUES ('${ins.id}', '${ins.partId}', '${ins.equipment}', '${ins.programName}', '${ins.cmmFileName}', '${ins.operator}', '${ins.timestamp}', '${ins.result}')`);
      }

      // AIActions Seed
      for (const ai of dbAIActions) {
        await request.query(`INSERT INTO AIActions (id, partId, probabilityOfFailure, modelUsed, decisionReason, parametersAnalyzed, correctionSuggested, correctionApplied, resultAfterCorrection, responseTimeMs, timestamp) VALUES ('${ai.id}', '${ai.partId}', '${ai.probabilityOfFailure}', '${ai.modelUsed}', '${ai.decisionReason}', '${ai.parametersAnalyzed}', '${ai.correctionSuggested}', '${ai.correctionApplied}', '${ai.resultAfterCorrection}', ${ai.responseTimeMs}, '${ai.timestamp}')`);
      }

      // AuditLogs Seed
      for (const au of dbAuditLogs) {
        await request.query(`INSERT INTO AuditLogs (id, partId, who, whenStr, fieldChanged, oldValue, newValue, reason, origin) VALUES ('${au.id}', '${au.partId}', '${au.who}', '${au.whenStr}', '${au.fieldChanged}', '${au.oldValue}', '${au.newValue}', '${au.reason}', '${au.origin}')`);
      }

      // Shipments Seed
      for (const sh of dbShipments) {
        await request.query(`INSERT INTO Shipments (id, partId, customerId, trackingNumber, shippedAt, status) VALUES ('${sh.id}', '${sh.partId}', '${sh.customerId}', '${sh.trackingNumber}', '${sh.shippedAt}', '${sh.status}')`);
      }

      // QualityEvents Seed
      for (const qe of dbQualityEvents) {
        await request.query(`INSERT INTO QualityEvents (id, partId, eventType, severity, description, loggedBy, loggedAt) VALUES ('${qe.id}', '${qe.partId}', '${qe.eventType}', '${qe.severity}', '${qe.description}', '${qe.loggedBy}', '${qe.loggedAt}')`);
      }

      await transaction.commit();
      logQuery("SEED", "Seeding inicial realizado com sucesso em transação de lote no SQL Server.", Date.now() - start, "success");
    } catch (txErr: any) {
      await transaction.rollback();
      throw txErr;
    }
  } catch (err: any) {
    logQuery("SEED", `FALHA SEED BANCO DE PRODUÇÃO: ${err.message}`, 0, "error");
  }
}

// ==========================================
// DB OPERATIONS & QUERIES
// ==========================================

export async function dbGetParts(filters: any = {}): Promise<any[]> {
  const start = Date.now();
  if (fallbackDatabaseMode || !pool || !isConnected) {
    // Client-side filtering simulation matching search options
    let filtered = [...dbParts];
    const q = filters.search?.toLowerCase().trim();

    if (q) {
      filtered = filtered.filter(p => {
        const op = dbOperators.find(o => o.id === p.operatorId);
        const ml = dbMaterialLots.find(m => m.id === p.materialLotId);
        const po = dbProductionOrders.find(o => o.id === p.orderId);
        const cs = dbCustomers.find(c => c.id === p.customerId);
        const tl = dbTools.find(t => t.id === p.toolId);

        return (
          p.id.toLowerCase().includes(q) ||
          p.serialNumber.toLowerCase().includes(q) ||
          (p.qrCode && p.qrCode.toLowerCase().includes(q)) ||
          (p.dataMatrix && p.dataMatrix.toLowerCase().includes(q)) ||
          (p.rfidCode && p.rfidCode.toLowerCase().includes(q)) ||
          p.machineId.toLowerCase().includes(q) ||
          p.status.toLowerCase().includes(q) ||
          p.cncProgram.toLowerCase().includes(q) ||
          (op && op.name.toLowerCase().includes(q)) ||
          (ml && ml.lotNumber.toLowerCase().includes(q)) ||
          (po && po.orderNumber.toLowerCase().includes(q)) ||
          (cs && cs.name.toLowerCase().includes(q)) ||
          (tl && tl.name.toLowerCase().includes(q))
        );
      });
    }

    if (filters.lot) {
      const ml = dbMaterialLots.find(m => m.lotNumber.toLowerCase() === filters.lot.toLowerCase());
      if (ml) filtered = filtered.filter(p => p.materialLotId === ml.id);
    }
    if (filters.customer) {
      const cs = dbCustomers.find(c => c.name.toLowerCase() === filters.customer.toLowerCase());
      if (cs) filtered = filtered.filter(p => p.customerId === cs.id);
    }
    if (filters.machine) {
      filtered = filtered.filter(p => p.machineId.toLowerCase() === filters.machine.toLowerCase());
    }
    if (filters.operator) {
      const op = dbOperators.find(o => o.name.toLowerCase() === filters.operator.toLowerCase());
      if (op) filtered = filtered.filter(p => p.operatorId === op.id);
    }
    if (filters.tool) {
      filtered = filtered.filter(p => p.toolId.toLowerCase() === filters.tool.toLowerCase());
    }
    if (filters.order) {
      const po = dbProductionOrders.find(o => o.orderNumber.toLowerCase() === filters.order.toLowerCase());
      if (po) filtered = filtered.filter(p => p.orderId === po.id);
    }

    logQuery("SELECT_PARTS", `SELECT * FROM Parts [MOCK FILTERED: ${filtered.length} records]`, Date.now() - start, "success");
    return filtered;
  }

  try {
    let sqlQuery = "SELECT * FROM Parts WHERE 1=1";
    const req = pool.request();

    if (filters.search) {
      req.input("search", mssql.VarChar, `%${filters.search}%`);
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
      req.input("lot", mssql.VarChar, filters.lot);
      sqlQuery += " AND materialLotId IN (SELECT id FROM MaterialLots WHERE lotNumber = @lot)";
    }
    if (filters.customer) {
      req.input("customer", mssql.VarChar, filters.customer);
      sqlQuery += " AND customerId IN (SELECT id FROM Customers WHERE name = @customer)";
    }
    if (filters.machine) {
      req.input("machine", mssql.VarChar, filters.machine);
      sqlQuery += " AND machineId = @machine";
    }
    if (filters.operator) {
      req.input("operator", mssql.VarChar, filters.operator);
      sqlQuery += " AND operatorId IN (SELECT id FROM Operators WHERE name = @operator)";
    }
    if (filters.tool) {
      req.input("tool", mssql.VarChar, filters.tool);
      sqlQuery += " AND toolId = @tool";
    }
    if (filters.order) {
      req.input("order", mssql.VarChar, filters.order);
      sqlQuery += " AND orderId IN (SELECT id FROM ProductionOrders WHERE orderNumber = @order)";
    }

    sqlQuery += " ORDER BY timestamp DESC";
    const res = await req.query(sqlQuery);
    logQuery("SELECT_PARTS", `SELECT FROM Parts [SQL SERVER: ${res.recordset.length} records]`, Date.now() - start, "success");
    return res.recordset;
  } catch (err: any) {
    logQuery("SELECT_PARTS", `FALHA SELECT_PARTS: ${err.message}`, Date.now() - start, "error");
    return dbParts;
  }
}

export async function dbGetPartById(id: string): Promise<any | null> {
  const start = Date.now();
  if (fallbackDatabaseMode || !pool || !isConnected) {
    // Find inside mockParts
    const part = dbParts.find(p => p.id === id || p.serialNumber === id || p.qrCode === id || p.dataMatrix === id || p.rfidCode === id);
    if (!part) return null;

    // Compile dynamic aggregate payload
    const opt = dbOperators.find(o => o.id === part.operatorId);
    const ml = dbMaterialLots.find(m => m.id === part.materialLotId);
    const po = dbProductionOrders.find(o => o.id === part.orderId);
    const cs = dbCustomers.find(c => c.id === part.customerId);
    const tl = dbTools.find(t => t.id === part.toolId);
    const th = dbToolHistory.find(h => h.toolId === part.toolId && h.machineId === part.machineId);

    const timeline = dbTimelineEvents.filter(e => e.partId === part.id);
    const measurements = dbMeasurements.filter(m => m.partId === part.id);
    const inspections = dbInspections.filter(i => i.partId === part.id);
    const aiActions = dbAIActions.find(a => a.partId === part.id) || null;
    const auditTrail = dbAuditLogs.filter(a => a.partId === part.id);

    // List other parts produced in the same material lot
    const lotParts = dbParts.filter(p => p.materialLotId === part.materialLotId).map(p => p.id.split("-").pop() || p.id);

    logQuery("SELECT_PART_BY_ID", `SELECT SINGLE PART id: ${part.id} [MOCK]`, Date.now() - start, "success");

    return {
      id: part.id,
      name: po ? po.partName : "Componente de Precisão",
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
        totalBatchQty: po ? `${po.quantityPlanned} peças` : "100 peças",
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
        equipment: "Pórtico Tridimensional ZEISS PRISMO",
        operator: opt ? opt.name : "Maria Clara",
        program: inspections[0]?.programName || "ZEISS-PRISMO-GEAR-152",
        result: part.inspectionResult,
        cmmFileName: inspections[0]?.cmmFileName || "PRISMO_CNC03_152.cmm",
        dimensions: measurements.length > 0 ? measurements.map(m => ({
          desc: m.characteristic,
          target: m.targetValue,
          tolerance: m.tolerance,
          measured: m.measuredValue,
          deviation: m.deviation,
          status: m.status
        })) : [
          { desc: "Comprimento Nominal", target: "120.00 mm", tolerance: "±0.05", measured: "120.015 mm", deviation: "+0.015 mm", status: "ok" },
          { desc: "Largura Nominal", target: "45.00 mm", tolerance: "±0.03", measured: "44.992 mm", deviation: "-0.008 mm", status: "ok" },
          { desc: "Diâmetro Furo Central", target: "20.00 mm", tolerance: "±0.01", measured: "20.003 mm", deviation: "+0.003 mm", status: "ok" }
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
        detectedIssue: "Nenhuma anomalia crítica registrada pela IA",
        probability: "0%",
        actionTaken: "Monitoramento contínuo em regime estável",
        newStatus: "Inspeção dimensional validada"
      },
      auditTrail: auditTrail.map(a => ({
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
          affectedClients: [cs ? cs.name : "Scania Brasil", "Volvo Trucks S.A.", "Mercedes-Benz Indústrias"],
          productionDays: ["10/07/2026", "11/07/2026", "12/07/2026"]
        }
      },
      timeline: timeline.map(t => ({
        time: t.eventTime,
        event: t.title,
        desc: t.description,
        status: t.status
      }))
    };
  }

  try {
    const req = pool.request();
    req.input("id", mssql.VarChar, id);

    const partRes = await req.query("SELECT * FROM Parts WHERE id = @id OR serialNumber = @id OR qrCode = @id OR dataMatrix = @id OR rfidCode = @id");
    if (partRes.recordset.length === 0) return null;

    const part = partRes.recordset[0];
    const pId = part.id;

    // Fetch operators, customers, lots, orders, tools
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
    const lotParts = lotPartsRes.recordset.map((lp: any) => lp.id.split("-").pop() || lp.id);

    const opt = optRes.recordset[0];
    const ml = mlRes.recordset[0];
    const po = poRes.recordset[0];
    const cs = csRes.recordset[0];
    const tl = tlRes.recordset[0];
    const th = thRes.recordset[0];
    const aiActions = aiRes.recordset[0];

    logQuery("SELECT_PART_DETAIL", `JOIN QUERY para montagem da genealogia da peça ${pId} [PRODUÇÃO SQL SERVER]`, Date.now() - start, "success");

    return {
      id: part.id,
      name: po ? po.partName : "Componente de Precisão",
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
        totalBatchQty: po ? `${po.quantityPlanned} peças` : "500 peças",
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
        changeReason: th ? th.changeReason : "Otimização preditiva"
      },
      metrology: {
        equipment: "Pórtico Tridimensional ZEISS PRISMO",
        operator: opt ? opt.name : "Maria Clara",
        program: inspRes.recordset[0]?.programName || "ZEISS-PRISMO-GEAR-152",
        result: part.inspectionResult,
        cmmFileName: inspRes.recordset[0]?.cmmFileName || "PRISMO_CNC03_152.cmm",
        dimensions: measRes.recordset.map((m: any) => ({
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
        actionTaken: "Sem correções aplicadas",
        newStatus: "Estável"
      },
      auditTrail: auditRes.recordset.map((a: any) => ({
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
          affectedClients: [cs ? cs.name : "Scania Brasil", "Volvo Trucks S.A.", "Mercedes-Benz Indústrias"],
          productionDays: ["10/07/2026", "11/07/2026", "12/07/2026"]
        }
      },
      timeline: timelineRes.recordset.map((t: any) => ({
        time: t.eventTime,
        event: t.title,
        desc: t.description,
        status: t.status
      }))
    };
  } catch (err: any) {
    logQuery("SELECT_PART_DETAIL", `FALHA COMPILAÇÃO PEÇA: ${err.message}`, Date.now() - start, "error");
    return null;
  }
}

// REST GETS FOR SECTIONS
export async function dbGetTimeline(partId: string): Promise<any[]> {
  if (fallbackDatabaseMode || !pool || !isConnected) {
    return dbTimelineEvents.filter(e => e.partId === partId);
  }
  try {
    const res = await pool.request().query(`SELECT * FROM TimelineEvents WHERE partId = '${partId}'`);
    return res.recordset;
  } catch {
    return [];
  }
}

export async function dbGetMeasurements(partId: string): Promise<any[]> {
  if (fallbackDatabaseMode || !pool || !isConnected) {
    return dbMeasurements.filter(m => m.partId === partId);
  }
  try {
    const res = await pool.request().query(`SELECT * FROM Measurements WHERE partId = '${partId}'`);
    return res.recordset;
  } catch {
    return [];
  }
}

export async function dbGetAudit(partId: string): Promise<any[]> {
  if (fallbackDatabaseMode || !pool || !isConnected) {
    return dbAuditLogs.filter(a => a.partId === partId);
  }
  try {
    const res = await pool.request().query(`SELECT * FROM AuditLogs WHERE partId = '${partId}'`);
    return res.recordset;
  } catch {
    return [];
  }
}

export async function dbGetAiActions(partId: string): Promise<any[]> {
  if (fallbackDatabaseMode || !pool || !isConnected) {
    return dbAIActions.filter(a => a.partId === partId);
  }
  try {
    const res = await pool.request().query(`SELECT * FROM AIActions WHERE partId = '${partId}'`);
    return res.recordset;
  } catch {
    return [];
  }
}

export async function dbGetTool(toolId: string): Promise<any | null> {
  if (fallbackDatabaseMode || !pool || !isConnected) {
    const tl = dbTools.find(t => t.id === toolId);
    if (!tl) return null;
    const history = dbToolHistory.filter(h => h.toolId === toolId);
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

export async function dbGetMachine(machineId: string): Promise<any | null> {
  if (fallbackDatabaseMode || !pool || !isConnected) {
    return dbMachines.find(m => m.id === machineId) || null;
  }
  try {
    const res = await pool.request().query(`SELECT * FROM Machines WHERE id = '${machineId}'`);
    return res.recordset[0] || null;
  } catch {
    return null;
  }
}

export async function dbGetOperators(): Promise<any[]> {
  return dbOperators;
}

export async function dbGetCustomers(): Promise<any[]> {
  return dbCustomers;
}

export async function dbGetProductionOrders(): Promise<any[]> {
  return dbProductionOrders;
}

export async function dbGetMaterialLots(): Promise<any[]> {
  return dbMaterialLots;
}

// POSTS / CREATORS
export async function dbCreatePart(p: any): Promise<void> {
  const start = Date.now();
  if (fallbackDatabaseMode || !pool || !isConnected) {
    dbParts.unshift(p);
    logQuery("INSERT_PART", `INSERT INTO Parts (id: ${p.id}) [EMULADO]`, Date.now() - start, "success");
    return;
  }
  try {
    const req = pool.request();
    req.input("id", mssql.VarChar, p.id);
    req.input("serialNumber", mssql.VarChar, p.serialNumber);
    req.input("qrCode", mssql.VarChar, p.qrCode);
    req.input("dataMatrix", mssql.VarChar, p.dataMatrix);
    req.input("rfidCode", mssql.VarChar, p.rfidCode);
    req.input("dateStr", mssql.VarChar, p.dateStr);
    req.input("timeStr", mssql.VarChar, p.timeStr);
    req.input("machineId", mssql.VarChar, p.machineId);
    req.input("operatorId", mssql.VarChar, p.operatorId);
    req.input("cncProgram", mssql.VarChar, p.cncProgram);
    req.input("toolId", mssql.VarChar, p.toolId);
    req.input("toolUsefulLife", mssql.VarChar, p.toolUsefulLife);
    req.input("toolWear", mssql.VarChar, p.toolWear);
    req.input("offsetX", mssql.VarChar, p.offsetX);
    req.input("offsetZ", mssql.VarChar, p.offsetZ);
    req.input("rpm", mssql.Int, p.rpm);
    req.input("feed", mssql.Int, p.feed);
    req.input("temperature", mssql.Float, p.temperature);
    req.input("vibration", mssql.Float, p.vibration);
    req.input("hydraulicPressure", mssql.VarChar, p.hydraulicPressure);
    req.input("lubrication", mssql.NVarChar, p.lubrication);
    req.input("customerId", mssql.VarChar, p.customerId);
    req.input("orderId", mssql.VarChar, p.orderId);
    req.input("materialLotId", mssql.VarChar, p.materialLotId);
    req.input("status", mssql.VarChar, p.status);
    req.input("machiningTime", mssql.VarChar, p.machiningTime);
    req.input("inspectionResult", mssql.VarChar, p.inspectionResult);

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
    logQuery("INSERT_PART", `INSERT INTO Parts (id: ${p.id}) [PRODUÇÃO SQL SERVER]`, Date.now() - start, "success");
  } catch (err: any) {
    logQuery("INSERT_PART", `FALHA INSERT: ${err.message}`, Date.now() - start, "error");
    dbParts.unshift(p);
  }
}

export async function dbCreateTimelineEvent(te: any): Promise<void> {
  if (fallbackDatabaseMode || !pool || !isConnected) {
    dbTimelineEvents.push(te);
    return;
  }
  try {
    const req = pool.request();
    req.input("id", mssql.VarChar, te.id);
    req.input("partId", mssql.VarChar, te.partId);
    req.input("eventTime", mssql.VarChar, te.eventTime);
    req.input("eventType", mssql.VarChar, te.eventType);
    req.input("title", mssql.VarChar, te.title);
    req.input("description", mssql.NVarChar, te.description);
    req.input("status", mssql.VarChar, te.status);

    await req.query(`
      INSERT INTO TimelineEvents (id, partId, eventTime, eventType, title, description, status)
      VALUES (@id, @partId, @eventTime, @eventType, @title, @description, @status)
    `);
  } catch {}
}

export async function dbCreateAuditLog(al: any): Promise<void> {
  if (fallbackDatabaseMode || !pool || !isConnected) {
    dbAuditLogs.push(al);
    return;
  }
  try {
    const req = pool.request();
    req.input("id", mssql.VarChar, al.id);
    req.input("partId", mssql.VarChar, al.partId);
    req.input("who", mssql.VarChar, al.who);
    req.input("whenStr", mssql.VarChar, al.whenStr);
    req.input("fieldChanged", mssql.VarChar, al.fieldChanged);
    req.input("oldValue", mssql.NVarChar, al.oldValue);
    req.input("newValue", mssql.NVarChar, al.newValue);
    req.input("reason", mssql.NVarChar, al.reason);
    req.input("origin", mssql.VarChar, al.origin);

    await req.query(`
      INSERT INTO AuditLogs (id, partId, who, whenStr, fieldChanged, oldValue, newValue, reason, origin)
      VALUES (@id, @partId, @who, @whenStr, @fieldChanged, @oldValue, @newValue, @reason, @origin)
    `);
  } catch {}
}

// ----------------------------------------------------
// ORIGINAL METHODS RETAINED FOR RETRO-COMPATIBILITY
// ----------------------------------------------------
export async function dbSaveInspection(inspection: PartInspection): Promise<void> {
  const start = Date.now();
  
  if (fallbackDatabaseMode || !pool || !isConnected) {
    // Retain compatibility with legacy endpoint
    const existing = dbParts.find(p => p.id === inspection.id);
    if (!existing) {
      // Map PartInspection to Parts Table
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
        rpm: 6000,
        feed: 1500,
        temperature: inspection.temperatureCelsius,
        vibration: inspection.vibrationG || 0.25,
        hydraulicPressure: "54 bar",
        lubrication: "Lubrificação Ativa",
        customerId: "scania_br",
        orderId: "OP-90234-A",
        materialLotId: "gerdau_a542",
        status: inspection.status === "approved" ? "Aprovado" : inspection.status === "rework" ? "Retrabalho" : "Reprovado",
        machiningTime: "7 min",
        inspectionResult: inspection.notes || "Aprovado Zeiss"
      };
      dbParts.unshift(mockPart);

      // Save Zeiss measurements
      dbMeasurements.push({ id: "ME_" + inspection.id + "_1", partId: inspection.id, characteristic: "Comprimento Nominal", targetValue: "120.00 mm", tolerance: "±0.05", measuredValue: inspection.measurements.lengthMm + " mm", deviation: inspection.deviations.lengthMm + " mm", status: Math.abs(inspection.deviations.lengthMm) <= 0.05 ? "ok" : "fail" });
      dbMeasurements.push({ id: "ME_" + inspection.id + "_2", partId: inspection.id, characteristic: "Largura Nominal", targetValue: "45.00 mm", tolerance: "±0.03", measuredValue: inspection.measurements.widthMm + " mm", deviation: inspection.deviations.widthMm + " mm", status: Math.abs(inspection.deviations.widthMm) <= 0.03 ? "ok" : "fail" });
      dbMeasurements.push({ id: "ME_" + inspection.id + "_3", partId: inspection.id, characteristic: "Altura Nominal", targetValue: "30.00 mm", tolerance: "±0.02", measuredValue: inspection.measurements.heightMm + " mm", deviation: inspection.deviations.heightMm + " mm", status: Math.abs(inspection.deviations.heightMm) <= 0.02 ? "ok" : "fail" });

      // Save Zeiss CMM inspection record
      dbInspections.push({ id: "IN_" + inspection.id, partId: inspection.id, equipment: "Pórtico Tridimensional ZEISS PRISMO", programName: "ZEISS-PRISMO-GEN-AUTO", cmmFileName: `PRISMO_${inspection.id}.cmm`, operator: inspection.operator, timestamp: inspection.timestamp, result: inspection.notes });

      // Create initial timeline
      dbTimelineEvents.push({ id: "TE_" + inspection.id + "_1", partId: inspection.id, eventTime: "10:00", eventType: "MAT_RECEIVE", title: "Matéria-prima recebida", description: "Lote Gerdau.", status: "neutral" });
      dbTimelineEvents.push({ id: "TE_" + inspection.id + "_2", partId: inspection.id, eventTime: "10:10", eventType: "MACH_START", title: "Usinagem Iniciada", description: `Início de ciclo na máquina ${inspection.machineId}.`, status: "neutral" });
      dbTimelineEvents.push({ id: "TE_" + inspection.id + "_3", partId: inspection.id, eventTime: "10:20", eventType: "INSP_APPROVED", title: "Inspeção Concluída", description: `Registrada via Zeiss Prismo por ${inspection.operator}.`, status: inspection.status === "approved" ? "success" : "warning" });
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
      rpm: 6000,
      feed: 1500,
      temperature: inspection.temperatureCelsius,
      vibration: inspection.vibrationG || 0.25,
      hydraulicPressure: "54 bar",
      lubrication: "Lubrificação Ativa",
      customerId: "scania_br",
      orderId: "OP-90234-A",
      materialLotId: "gerdau_a542",
      status: inspection.status === "approved" ? "Aprovado" : inspection.status === "rework" ? "Retrabalho" : "Reprovado",
      machiningTime: "7 min",
      inspectionResult: inspection.notes || "Aprovado Zeiss"
    };

    await dbCreatePart(p);

    // Save Zeiss Measurements
    const req1 = pool.request();
    req1.input("id1", mssql.VarChar, `ME_${inspection.id}_1`);
    req1.input("pId", mssql.VarChar, inspection.id);
    req1.input("target1", mssql.VarChar, "120.00 mm");
    req1.input("tol1", mssql.VarChar, "±0.05");
    req1.input("val1", mssql.VarChar, inspection.measurements.lengthMm + " mm");
    req1.input("dev1", mssql.VarChar, inspection.deviations.lengthMm + " mm");
    req1.input("stat1", mssql.VarChar, Math.abs(inspection.deviations.lengthMm) <= 0.05 ? "ok" : "fail");
    await req1.query(`INSERT INTO Measurements (id, partId, characteristic, targetValue, tolerance, measuredValue, deviation, status) VALUES (@id1, @pId, 'Comprimento Nominal', @target1, @tol1, @val1, @dev1, @stat1)`);

    const req2 = pool.request();
    req2.input("id2", mssql.VarChar, `ME_${inspection.id}_2`);
    req2.input("pId", mssql.VarChar, inspection.id);
    req2.input("target2", mssql.VarChar, "45.00 mm");
    req2.input("tol2", mssql.VarChar, "±0.03");
    req2.input("val2", mssql.VarChar, inspection.measurements.widthMm + " mm");
    req2.input("dev2", mssql.VarChar, inspection.deviations.widthMm + " mm");
    req2.input("stat2", mssql.VarChar, Math.abs(inspection.deviations.widthMm) <= 0.03 ? "ok" : "fail");
    await req2.query(`INSERT INTO Measurements (id, partId, characteristic, targetValue, tolerance, measuredValue, deviation, status) VALUES (@id2, @pId, 'Largura Nominal', @target2, @tol2, @val2, @dev2, @stat2)`);

    const req3 = pool.request();
    req3.input("id3", mssql.VarChar, `ME_${inspection.id}_3`);
    req3.input("pId", mssql.VarChar, inspection.id);
    req3.input("target3", mssql.VarChar, "30.00 mm");
    req3.input("tol3", mssql.VarChar, "±0.02");
    req3.input("val3", mssql.VarChar, inspection.measurements.heightMm + " mm");
    req3.input("dev3", mssql.VarChar, inspection.deviations.heightMm + " mm");
    req3.input("stat3", mssql.VarChar, Math.abs(inspection.deviations.heightMm) <= 0.02 ? "ok" : "fail");
    await req3.query(`INSERT INTO Measurements (id, partId, characteristic, targetValue, tolerance, measuredValue, deviation, status) VALUES (@id3, @pId, 'Altura Nominal', @target3, @tol3, @val3, @dev3, @stat3)`);

    // Inspections Record
    const reqI = pool.request();
    reqI.input("id", mssql.VarChar, `IN_${inspection.id}`);
    reqI.input("pId", mssql.VarChar, inspection.id);
    reqI.input("equip", mssql.VarChar, "Pórtico Tridimensional ZEISS PRISMO");
    reqI.input("prog", mssql.VarChar, "ZEISS-PRISMO-GEN-AUTO");
    reqI.input("file", mssql.VarChar, `PRISMO_${inspection.id}.cmm`);
    reqI.input("op", mssql.VarChar, inspection.operator);
    reqI.input("res", mssql.VarChar, inspection.notes || "Aprovado Zeiss");
    await reqI.query(`INSERT INTO Inspections (id, partId, equipment, programName, cmmFileName, operator, result) VALUES (@id, @pId, @equip, @prog, @file, @op, @res)`);

    // Create Initial Timeline Events
    await dbCreateTimelineEvent({ id: `TE_${inspection.id}_1`, partId: inspection.id, eventTime: "10:00", eventType: "MAT_RECEIVE", title: "Matéria-prima recebida", description: "Lote Gerdau.", status: "neutral" });
    await dbCreateTimelineEvent({ id: `TE_${inspection.id}_2`, partId: inspection.id, eventTime: "10:10", eventType: "MACH_START", title: "Usinagem Iniciada", description: `Início de ciclo na máquina ${inspection.machineId}.`, status: "neutral" });
    await dbCreateTimelineEvent({ id: `TE_${inspection.id}_3`, partId: inspection.id, eventTime: "10:20", eventType: "INSP_APPROVED", title: "Inspeção Concluída", description: `Registrada via Zeiss Prismo por ${inspection.operator}.`, status: inspection.status === "approved" ? "success" : "warning" });

    logQuery("INSERT", `INSERT INTO Inspections (id) VALUES ('${inspection.id}') [PRODUÇÃO SQL SERVER]`, Date.now() - start, "success");
  } catch (err: any) {
    logQuery("INSERT", `FALHA INSERT LEGACY: ${err.message}`, Date.now() - start, "error");
  }
}

export async function dbGetInspections(): Promise<PartInspection[]> {
  const start = Date.now();
  if (fallbackDatabaseMode || !pool || !isConnected) {
    // Reconstruct list from mock parts to maintain compatibility
    const results: PartInspection[] = dbParts.map(p => ({
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
    const results: PartInspection[] = res.recordset.map((p: any) => ({
      id: p.id,
      batch: "LOTE-CNC02-05",
      operator: "Carlos Santos",
      machineId: p.machineId,
      timestamp: p.timestamp?.toISOString() || new Date().toISOString(),
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
  } catch (err: any) {
    logQuery("SELECT", `FALHA LEGACY SELECT: ${err.message}`, Date.now() - start, "error");
    return [];
  }
}

export async function dbSaveMachine(m: Machine): Promise<void> {
  const start = Date.now();
  if (fallbackDatabaseMode || !pool || !isConnected) {
    const idx = dbMachines.findIndex(item => item.id === m.id);
    if (idx !== -1) {
      dbMachines[idx] = m;
    } else {
      dbMachines.push(m);
    }
    return;
  }

  try {
    const req = pool.request();
    req.input("id", mssql.VarChar, m.id);
    req.input("name", mssql.VarChar, m.name);
    req.input("type", mssql.VarChar, m.type);
    req.input("status", mssql.VarChar, m.status);
    req.input("temp", mssql.Float, m.temperature);
    req.input("vib", mssql.Float, m.vibration);
    req.input("rpm", mssql.Int, m.speedRpm);
    req.input("oee", mssql.Float, m.oee);
    req.input("utilization", mssql.Float, m.utilization);
    req.input("heuristic", mssql.Float, m.partsHeuristic);
    req.input("x", mssql.Int, m.position.x);
    req.input("y", mssql.Int, m.position.y);

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

  } catch (err: any) {
    logQuery("MERGE", `FALHA MERGE Machines: ${err.message}`, Date.now() - start, "error");
    const idx = dbMachines.findIndex(item => item.id === m.id);
    if (idx !== -1) dbMachines[idx] = m;
  }
}

export async function dbGetMachines(): Promise<Machine[]> {
  const start = Date.now();
  if (fallbackDatabaseMode || !pool || !isConnected) {
    return dbMachines;
  }

  try {
    const res = await pool.request().query("SELECT * FROM Machines");
    const results: Machine[] = res.recordset.map((r: any) => ({
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
  } catch (err: any) {
    logQuery("SELECT_MACHINES", `FALHA SELECT Machines: ${err.message}`, Date.now() - start, "error");
    return dbMachines;
  }
}
