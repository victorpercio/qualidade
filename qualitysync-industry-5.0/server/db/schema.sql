-- =====================================================================
-- QUALITYSYNC INDUSTRY 5.0 - COMPLETE TRACEABILITY DATABASE SCHEMA
-- Target Database: Microsoft SQL Server
-- Created: 2026-07-14
-- =====================================================================

-- 1. Create Customers Table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Customers' AND xtype='U')
BEGIN
    CREATE TABLE Customers (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        code VARCHAR(100) UNIQUE,
        contactInfo NVARCHAR(MAX),
        createdAt DATETIME DEFAULT GETDATE()
    );
    CREATE INDEX IX_Customers_Name ON Customers(name);
END;

-- 2. Create Operators Table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Operators' AND xtype='U')
BEGIN
    CREATE TABLE Operators (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(100),
        rfidCard VARCHAR(100) UNIQUE,
        shift VARCHAR(50),
        createdAt DATETIME DEFAULT GETDATE()
    );
    CREATE INDEX IX_Operators_RfidCard ON Operators(rfidCard);
END;

-- 3. Create MaterialLots Table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='MaterialLots' AND xtype='U')
BEGIN
    CREATE TABLE MaterialLots (
        id VARCHAR(50) PRIMARY KEY,
        lotNumber VARCHAR(100) NOT NULL UNIQUE,
        supplier VARCHAR(255),
        materialType VARCHAR(100),
        hardnessHRC FLOAT,
        heatNumber VARCHAR(100),
        createdAt DATETIME DEFAULT GETDATE()
    );
    CREATE INDEX IX_MaterialLots_LotNumber ON MaterialLots(lotNumber);
END;

-- 4. Create Machines Table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Machines' AND xtype='U')
BEGIN
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
    );
END;

-- 5. Create Tools Table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Tools' AND xtype='U')
BEGIN
    CREATE TABLE Tools (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(100),
        maxUsefulLifePieces INT,
        createdAt DATETIME DEFAULT GETDATE()
    );
END;

-- 6. Create ProductionOrders Table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='ProductionOrders' AND xtype='U')
BEGIN
    CREATE TABLE ProductionOrders (
        id VARCHAR(50) PRIMARY KEY,
        orderNumber VARCHAR(100) NOT NULL UNIQUE,
        customerId VARCHAR(50) FOREIGN KEY REFERENCES Customers(id),
        partName VARCHAR(255),
        quantityPlanned INT,
        quantityProduced INT,
        status VARCHAR(50),
        createdAt DATETIME DEFAULT GETDATE()
    );
    CREATE INDEX IX_ProductionOrders_OrderNumber ON ProductionOrders(orderNumber);
END;

-- 7. Create ToolHistory Table (Tool wear and usage history)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='ToolHistory' AND xtype='U')
BEGIN
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
    );
    CREATE INDEX IX_ToolHistory_ToolId ON ToolHistory(toolId);
END;

-- 8. Create Parts Table (Core traceability unit)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Parts' AND xtype='U')
BEGIN
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
    );
    
    CREATE INDEX IX_Parts_SerialNumber ON Parts(serialNumber);
    CREATE INDEX IX_Parts_QrCode ON Parts(qrCode);
    CREATE INDEX IX_Parts_DataMatrix ON Parts(dataMatrix);
    CREATE INDEX IX_Parts_RfidCode ON Parts(rfidCode);
    CREATE INDEX IX_Parts_MaterialLotId ON Parts(materialLotId);
    CREATE INDEX IX_Parts_CustomerId ON Parts(customerId);
    CREATE INDEX IX_Parts_OrderId ON Parts(orderId);
END;

-- 9. Create TimelineEvents Table (Dynamic Events log)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='TimelineEvents' AND xtype='U')
BEGIN
    CREATE TABLE TimelineEvents (
        id VARCHAR(50) PRIMARY KEY,
        partId VARCHAR(50) FOREIGN KEY REFERENCES Parts(id) ON DELETE CASCADE,
        eventTime VARCHAR(50),
        eventType VARCHAR(100),
        title VARCHAR(255),
        description NVARCHAR(MAX),
        status VARCHAR(50)
    );
    CREATE INDEX IX_TimelineEvents_PartId ON TimelineEvents(partId);
END;

-- 10. Create Measurements Table (Metrology points)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Measurements' AND xtype='U')
BEGIN
    CREATE TABLE Measurements (
        id VARCHAR(50) PRIMARY KEY,
        partId VARCHAR(50) FOREIGN KEY REFERENCES Parts(id) ON DELETE CASCADE,
        characteristic VARCHAR(255),
        targetValue VARCHAR(50),
        tolerance VARCHAR(50),
        measuredValue VARCHAR(50),
        deviation VARCHAR(50),
        status VARCHAR(50)
    );
    CREATE INDEX IX_Measurements_PartId ON Measurements(partId);
END;

-- 11. Create Inspections Table (CMM quality records)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Inspections' AND xtype='U')
BEGIN
    CREATE TABLE Inspections (
        id VARCHAR(50) PRIMARY KEY,
        partId VARCHAR(50) FOREIGN KEY REFERENCES Parts(id) ON DELETE CASCADE,
        equipment VARCHAR(255),
        programName VARCHAR(255),
        cmmFileName VARCHAR(255),
        operator VARCHAR(255),
        timestamp DATETIME DEFAULT GETDATE(),
        result VARCHAR(100)
    );
    CREATE INDEX IX_Inspections_PartId ON Inspections(partId);
END;

-- 12. Create AIActions Table (AI Decisions and corrections logs)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='AIActions' AND xtype='U')
BEGIN
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
    );
    CREATE INDEX IX_AIActions_PartId ON AIActions(partId);
END;

-- 13. Create AuditLogs Table (Complete audit trail tracking modifications)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='AuditLogs' AND xtype='U')
BEGIN
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
    );
    CREATE INDEX IX_AuditLogs_PartId ON AuditLogs(partId);
END;

-- 14. Create Shipments Table (Outbound dispatch log)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Shipments' AND xtype='U')
BEGIN
    CREATE TABLE Shipments (
        id VARCHAR(50) PRIMARY KEY,
        partId VARCHAR(50) FOREIGN KEY REFERENCES Parts(id),
        customerId VARCHAR(50) FOREIGN KEY REFERENCES Customers(id),
        trackingNumber VARCHAR(100),
        shippedAt DATETIME DEFAULT GETDATE(),
        status VARCHAR(50)
    );
END;

-- 15. Create QualityEvents Table (Ad-hoc quality warnings)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='QualityEvents' AND xtype='U')
BEGIN
    CREATE TABLE QualityEvents (
        id VARCHAR(50) PRIMARY KEY,
        partId VARCHAR(50) FOREIGN KEY REFERENCES Parts(id),
        eventType VARCHAR(100),
        severity VARCHAR(50),
        description NVARCHAR(MAX),
        loggedBy VARCHAR(255),
        loggedAt DATETIME DEFAULT GETDATE()
    );
END;
