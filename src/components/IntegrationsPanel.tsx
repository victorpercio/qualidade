import React, { useState, useEffect } from 'react';
import { 
  Database, Cpu, Wifi, WifiOff, RefreshCw, Send, CheckCircle, XCircle, 
  Activity, Sliders, Play, AlertTriangle, ShieldCheck, Terminal, Globe
} from 'lucide-react';

interface IntegrationsPanelProps {
  connectionMode: 'online' | 'offline';
  setConnectionMode: (mode: 'online' | 'offline') => void;
  onAddMachine?: (newMachine: any) => void;
  machinesList?: any[];
}

interface DBStats {
  engine: string;
  connected: boolean;
  activeDatabase: string;
  tables: {
    inspections: number;
    machines: number;
  };
}

interface ProtocolStatus {
  connected: boolean;
  deviceIP: string;
  port: number;
  frequencyMs: number;
  lastSync: string;
  registers: Record<string, any>;
}

export default function IntegrationsPanel({ 
  connectionMode, 
  setConnectionMode, 
  onAddMachine, 
  machinesList 
}: IntegrationsPanelProps) {
  // Main Panel View state
  const [activeSubTab, setActiveSubTab] = useState<'connectors' | 'bmeconnect'>('connectors');

  // BME Connect Setup Wizard states
  const [wizardStep, setWizardStep] = useState(1);
  const [machId, setMachId] = useState('');
  const [machName, setMachName] = useState('');
  const [machManufacturer, setMachManufacturer] = useState('Siemens');
  const [machModel, setMachModel] = useState('S7-1500');
  const [machSerial, setMachSerial] = useState('SN-9482-A');
  const [machType, setMachType] = useState('CNC Milling');
  const [machLine, setMachLine] = useState('Alpha');
  const [machSector, setMachSector] = useState('Usinagem Leve');
  const [machProduct, setMachProduct] = useState('Bagie (Mancal)');
  const [machOp, setMachOp] = useState('OP-020');
  const [machTablet, setMachTablet] = useState('TAB-CNC-04');
  
  // Integration Types: 'automatic' | 'gateway' | 'sensors' | 'tablet' | 'manual'
  const [integrationType, setIntegrationType] = useState<'automatic' | 'gateway' | 'sensors' | 'tablet' | 'manual'>('automatic');
  const [netProtocol, setNetProtocol] = useState('opcua');
  const [ipAddress, setIpAddress] = useState('192.168.1.155');
  const [ipPort, setIpPort] = useState(4840);
  const [gatewayType, setGatewayType] = useState('RS485');
  const [gatewaySerialPort, setGatewaySerialPort] = useState('COM3');
  const [baudRate, setBaudRate] = useState(9600);
  const [sensorType, setSensorType] = useState('Indutivo (Contagem)');
  const [sensorPin, setSensorPin] = useState('GPIO-12');
  
  // Connection tester
  const [isTesting, setIsTesting] = useState(false);
  const [testLogs, setTestLogs] = useState<string[]>([]);
  const [testResult, setTestResult] = useState<boolean | null>(null);
  const [wizardFeedback, setWizardFeedback] = useState('');

  // DB States
  const [dbConfig, setDbConfig] = useState({
    server: 'localhost',
    database: 'QualitySyncDB',
    user: 'sa',
    password: 'SuperSecurePassword123'
  });
  const [dbStats, setDbStats] = useState<DBStats>({
    engine: 'Simulation Engine',
    connected: false,
    activeDatabase: 'In-Memory Cache',
    tables: { inspections: 5, machines: 5 }
  });
  const [isConnectingDb, setIsConnectingDb] = useState(false);
  const [dbFeedback, setDbFeedback] = useState({ type: '', message: '' });

  // Protocols States
  const [protocols, setProtocols] = useState<Record<string, ProtocolStatus>>({});
  const [isLoadingProtocols, setIsLoadingProtocols] = useState(true);
  const [selectedProtocol, setSelectedProtocol] = useState('opcua');
  
  // Custom CLP network edit state
  const [networkConfig, setNetworkConfig] = useState({
    deviceIP: '192.168.1.150',
    port: 4840,
    topic: 'factory/data',
    unitId: 1
  });

  // Signal Writing Form
  const [writeForm, setWriteForm] = useState({
    addressKey: 'ns=2;s=Temperature',
    value: '24.5'
  });
  const [writeFeedback, setWriteFeedback] = useState({ type: '', message: '' });
  const [isWriting, setIsWriting] = useState(false);

  // Load and sync stats
  const fetchDbStats = async () => {
    try {
      const res = await fetch('/api/db/stats');
      if (res.ok) {
        const data = await res.json();
        setDbStats(data);
      }
    } catch (e) {
      console.warn("Failed to fetch database stats:", e);
    }
  };

  const fetchProtocols = async () => {
    try {
      const res = await fetch('/api/integrations');
      if (res.ok) {
        const data = await res.json();
        setProtocols(data);
      }
    } catch (e) {
      console.warn("Failed to fetch industrial protocols:", e);
    } finally {
      setIsLoadingProtocols(false);
    }
  };

  useEffect(() => {
    fetchDbStats();
    fetchProtocols();
    
    // Auto refresh every 4 seconds
    const interval = setInterval(() => {
      fetchDbStats();
      fetchProtocols();
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Handle SQL Server connect request
  const handleConnectDb = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConnectingDb(true);
    setDbFeedback({ type: '', message: '' });

    try {
      const res = await fetch('/api/db/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dbConfig)
      });
      const data = await res.json();
      if (data.success) {
        setDbFeedback({ 
          type: 'success', 
          message: 'Banco SQL Server conectado e sincronizado com sucesso! Tabelas mapeadas.' 
        });
        fetchDbStats();
      } else {
        setDbFeedback({ 
          type: 'warning', 
          message: 'Falha ao conectar no SQL Server. O sistema ativou o modo de Simulação em Memória para manter o app operacional.' 
        });
      }
    } catch (error) {
      setDbFeedback({ 
        type: 'error', 
        message: 'Servidor inacessível no momento. Operando sob o buffer off-grid local.' 
      });
    } finally {
      setIsConnectingDb(false);
    }
  };

  // Handle Connect to CLP Protocol
  const handleProtocolConnect = async (protocolKey: string) => {
    try {
      const res = await fetch('/api/integrations/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          protocol: protocolKey,
          config: networkConfig
        })
      });
      const data = await res.json();
      if (data.success) {
        fetchProtocols();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handle Write Signal Value
  const handleWriteSignal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!writeForm.addressKey || !writeForm.value) return;
    
    setIsWriting(true);
    setWriteFeedback({ type: '', message: '' });

    try {
      const res = await fetch('/api/integrations/write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          protocol: selectedProtocol,
          addressKey: writeForm.addressKey,
          value: isNaN(Number(writeForm.value)) ? writeForm.value : Number(writeForm.value)
        })
      });
      
      const data = await res.json();
      if (data.success) {
        setWriteFeedback({
          type: 'success',
          message: `Sinal gravado! [${selectedProtocol.toUpperCase()}] chave ${writeForm.addressKey} alterada para ${writeForm.value}.`
        });
        fetchProtocols();
      } else {
        setWriteFeedback({
          type: 'error',
          message: 'Falha na transmissão do CLP: Registrador inacessível ou fora de alcance.'
        });
      }
    } catch (err) {
      setWriteFeedback({
        type: 'error',
        message: 'Erro na conexão de transmissão IoT. Gateway offline.'
      });
    } finally {
      setIsWriting(false);
    }
  };

  const getFriendlyProtocolName = (key: string) => {
    const names: Record<string, string> = {
      opcua: 'OPC UA (ZEISS PRISMO Client)',
      modbus: 'Modbus TCP (Industrial Sensors)',
      mqtt: 'MQTT Broker (Telemetry Stream)',
      siemens: 'Siemens S7 (Industrial PLC)',
      fanuc: 'Fanuc FOCAS (CNC Milling Controller)',
      mitsubishi: 'Mitsubishi MELSEC (CNC Controller)',
      beckhoff: 'Beckhoff TwinCAT (PC-based Control)',
      haas: 'Haas CNC (Serial Ethernet Link)',
      mazak: 'Mazak Smooth (High-speed CNC Link)'
    };
    return names[key] || key.toUpperCase();
  };

  const getProtocolIconColor = (key: string) => {
    const colors: Record<string, string> = {
      opcua: 'text-blue-400 bg-blue-950/40 border-blue-900/30',
      modbus: 'text-emerald-400 bg-emerald-950/40 border-emerald-900/30',
      mqtt: 'text-cyan-400 bg-cyan-950/40 border-cyan-900/30',
      siemens: 'text-[#0091FF] bg-[#0091FF]/10 border-[#0091FF]/20',
      fanuc: 'text-amber-400 bg-amber-950/40 border-amber-900/30',
      mitsubishi: 'text-red-400 bg-red-950/30 border-red-900/20',
      beckhoff: 'text-purple-400 bg-purple-950/40 border-purple-900/30',
      haas: 'text-pink-400 bg-pink-950/40 border-pink-900/30',
      mazak: 'text-orange-400 bg-orange-950/40 border-orange-900/30'
    };
    return colors[key] || 'text-slate-400 bg-slate-900 border-slate-800';
  };

  const updateWriteKeyForProtocol = (proto: string) => {
    setSelectedProtocol(proto);
    const defaults: Record<string, { address: string; val: string }> = {
      opcua: { address: 'ns=2;s=Temperature', val: '24.5' },
      modbus: { address: '40001', val: '1' },
      mqtt: { address: 'factory/cnc/cnc-01/command', val: '{"calib": -0.05}' },
      siemens: { address: 'DB10.DBW2', val: '8600' },
      fanuc: { address: 'axis_offset_x', val: '-0.04' },
      mitsubishi: { address: 'M100', val: '1' },
      beckhoff: { address: 'GVL.temperature', val: '22.8' },
      haas: { address: 'Q_SETTING_51', val: '12.4' },
      mazak: { address: 'offset_z', val: '-0.08' }
    };
    if (defaults[proto]) {
      setWriteForm({
        addressKey: defaults[proto].address,
        value: defaults[proto].val
      });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* EXPLAINER TOP BAR */}
      <div className="bg-[#0F0F12] border border-[#1E1E24] rounded-xl p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#0091FF]/5 blur-3xl rounded-full pointer-events-none" />
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono tracking-widest text-[#0091FF] font-extrabold uppercase bg-[#0091FF]/10 px-2 py-0.5 rounded border border-[#0091FF]/20">
                Padrão CIO de Alta Arquitetura
              </span>
              <span className="text-[9px] font-mono tracking-widest text-emerald-400 font-extrabold uppercase bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-900/30">
                SQL Server + 9 Protocolos Ativos
              </span>
            </div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Database className="w-5 h-5 text-[#0091FF]" />
              Painel Integrado de Conectividade Industrial & Banco de Dados
            </h3>
            <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
              Consola unificada para gerenciar o acoplamento cyber-físico da planta. Este módulo integra diretamente as leituras do banco relacional **SQL Server** e mapeia canais de comunicação com CLPs das 9 maiores fabricantes de automação do mundo em tempo de execução.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-[#0A0A0C] border border-[#1E1E24] p-1.5 rounded-xl shrink-0 font-sans">
            <button
              onClick={() => setConnectionMode('online')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                connectionMode === 'online'
                  ? 'bg-gradient-to-r from-[#0091FF] to-indigo-600 text-white shadow-[0_0_15px_rgba(0,145,255,0.3)]'
                  : 'text-slate-400 hover:text-white hover:bg-[#15151A]'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              Conexão Nuvem
            </button>
            <button
              onClick={() => setConnectionMode('offline')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                connectionMode === 'offline'
                  ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.35)]'
                  : 'text-slate-400 hover:text-white hover:bg-[#15151A]'
              }`}
            >
              <WifiOff className="w-3.5 h-3.5" />
              Borda Off-Grid
            </button>
          </div>
        </div>
      </div>

      {/* SUB-TABS SELECTOR FOR SAAS CONNECTIVITY */}
      <div className="flex border-b border-[#1E1E24] gap-6 mb-2" role="tablist">
        <button
          role="tab"
          aria-selected={activeSubTab === 'connectors'}
          onClick={() => setActiveSubTab('connectors')}
          className={`pb-3 text-xs uppercase tracking-wider font-extrabold transition-all relative cursor-pointer ${
            activeSubTab === 'connectors' ? 'text-[#0091FF] border-b-2 border-[#0091FF]' : 'text-slate-400 hover:text-white'
          }`}
        >
          🔌 Conectores Ativos & Logs de Rede
        </button>
        <button
          role="tab"
          aria-selected={activeSubTab === 'bmeconnect'}
          onClick={() => setActiveSubTab('bmeconnect')}
          className={`pb-3 text-xs uppercase tracking-wider font-extrabold transition-all relative cursor-pointer ${
            activeSubTab === 'bmeconnect' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-slate-400 hover:text-white'
          }`}
        >
          ⚡ Assistente BME Connect Setup (Instalador Universal)
        </button>
      </div>

      {activeSubTab === 'connectors' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* 1. SQL SERVER DATABASE CONNECTOR CARD */}
        <div className="bg-[#0F0F12] border border-[#1E1E24] rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-[#1E1E24] pb-3">
              <span className="p-1.5 bg-[#0091FF]/10 text-[#0091FF] rounded-lg">
                <Database className="w-4 h-4" />
              </span>
              <div>
                <span className="text-[9px] font-mono text-[#0091FF] uppercase font-bold tracking-widest block">BANCO DE DADOS RELACIONAL</span>
                <h4 className="text-xs font-bold text-white uppercase tracking-tight">Conector SQL Server</h4>
              </div>
            </div>

            {/* DB Configuration Form */}
            <form onSubmit={handleConnectDb} className="space-y-3 text-xs font-sans">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-mono uppercase font-bold">Endereço do Servidor (Host/IP)</label>
                <input 
                  type="text"
                  value={dbConfig.server}
                  onChange={e => setDbConfig({...dbConfig, server: e.target.value})}
                  className="w-full bg-[#15151A] text-slate-200 border border-[#1E1E24] rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#0091FF]"
                  placeholder="localhost,1433"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-mono uppercase font-bold">Nome do Banco de Dados</label>
                <input 
                  type="text"
                  value={dbConfig.database}
                  onChange={e => setDbConfig({...dbConfig, database: e.target.value})}
                  className="w-full bg-[#15151A] text-slate-200 border border-[#1E1E24] rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#0091FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-mono uppercase font-bold">Usuário (sa)</label>
                  <input 
                    type="text"
                    value={dbConfig.user}
                    onChange={e => setDbConfig({...dbConfig, user: e.target.value})}
                    className="w-full bg-[#15151A] text-slate-200 border border-[#1E1E24] rounded-lg px-2.5 py-2 text-xs font-mono focus:outline-none focus:border-[#0091FF]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-mono uppercase font-bold">Senha de Acesso</label>
                  <input 
                    type="password"
                    value={dbConfig.password}
                    onChange={e => setDbConfig({...dbConfig, password: e.target.value})}
                    className="w-full bg-[#15151A] text-slate-200 border border-[#1E1E24] rounded-lg px-2.5 py-2 text-xs font-mono focus:outline-none focus:border-[#0091FF]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isConnectingDb}
                className="w-full py-2.5 bg-gradient-to-r from-[#0091FF] to-indigo-600 hover:opacity-90 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 cursor-pointer pointer-events-auto transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isConnectingDb ? 'animate-spin' : ''}`} />
                {isConnectingDb ? 'Conectando ao SQL...' : 'Conectar ao SQL Server'}
              </button>
            </form>

            {/* DB Feedback message */}
            {dbFeedback.message && (
              <div className={`p-3 border rounded-lg flex items-start gap-2.5 text-xs font-sans ${
                dbFeedback.type === 'success' 
                  ? 'bg-emerald-950/20 border-emerald-900/30 text-emerald-400' 
                  : dbFeedback.type === 'warning'
                    ? 'bg-amber-950/20 border-amber-900/30 text-amber-500'
                    : 'bg-red-950/20 border-red-900/30 text-red-400'
              }`}>
                {dbFeedback.type === 'success' ? (
                  <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
                )}
                <span className="leading-snug">{dbFeedback.message}</span>
              </div>
            )}
          </div>

          {/* Database Live Stats Dashboard */}
          <div className="bg-[#15151A]/60 border border-[#1E1E24] rounded-xl p-3.5 space-y-3.5 font-mono text-xs">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block border-b border-[#1E1E24] pb-1.5">TELEMETRIA DO DRIVER SQL</span>
            
            <div className="flex items-center justify-between">
              <span className="text-[#666666]">Engine Ativo:</span>
              <span className="text-white font-bold text-right text-[11px] bg-black px-2 py-0.5 border border-[#1E1E24] rounded">{dbStats.engine}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#666666]">Host Conectado:</span>
              <span className="text-white font-bold">{dbConfig.server}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#666666]">Schema Database:</span>
              <span className="text-blue-400 font-bold">{dbStats.activeDatabase}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="bg-black/40 border border-[#1E1E24] p-2 rounded text-center">
                <span className="text-[8px] text-[#666666] block uppercase">Medições</span>
                <span className="text-xs text-[#00E676] font-bold">{dbStats.tables.inspections} rows</span>
              </div>
              <div className="bg-black/40 border border-[#1E1E24] p-2 rounded text-center">
                <span className="text-[8px] text-[#666666] block uppercase">Terminais</span>
                <span className="text-xs text-blue-400 font-bold">{dbStats.tables.machines} rows</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. CLP PROTOCOL REGISTER WRITE/COMMAND PANEL */}
        <div className="bg-[#0F0F12] border border-[#1E1E24] rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-[#1E1E24] pb-3">
              <span className="p-1.5 bg-[#0091FF]/10 text-[#0091FF] rounded-lg">
                <Sliders className="w-4 h-4 animate-pulse" />
              </span>
              <div>
                <span className="text-[9px] font-mono text-[#0091FF] uppercase font-bold tracking-widest block">TELECOMANDOS DE REDE CLP</span>
                <h4 className="text-xs font-bold text-white uppercase tracking-tight">Escrita de Registradores IoT</h4>
              </div>
            </div>

            {/* Protocol Selector and configuration */}
            <form onSubmit={handleWriteSignal} className="space-y-3.5 text-xs font-sans">
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-500 font-mono uppercase font-bold">Selecione o Protocolo Ativo</label>
                <select
                  value={selectedProtocol}
                  onChange={e => updateWriteKeyForProtocol(e.target.value)}
                  className="w-full bg-[#15151A] text-slate-200 border border-[#1E1E24] rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#0091FF] cursor-pointer"
                >
                  <option value="opcua">OPC UA (Zeiss Station Client)</option>
                  <option value="modbus">Modbus TCP Gateway</option>
                  <option value="mqtt">MQTT Broker Stream</option>
                  <option value="siemens">Siemens S7 Protocol</option>
                  <option value="fanuc">Fanuc FOCAS CNC</option>
                  <option value="mitsubishi">Mitsubishi MELSEC CNC</option>
                  <option value="beckhoff">Beckhoff TwinCAT ADS</option>
                  <option value="haas">Haas CNC Ethernet</option>
                  <option value="mazak">Mazak Smooth Link</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] text-slate-500 font-mono uppercase font-bold">Registrador / Chave de Endereço</label>
                  <span className="text-[8px] font-mono text-slate-600">Ex: DB10.DBW2</span>
                </div>
                <input 
                  type="text"
                  value={writeForm.addressKey}
                  onChange={e => setWriteForm({...writeForm, addressKey: e.target.value})}
                  className="w-full bg-[#15151A] text-slate-200 border border-[#1E1E24] rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#0091FF]"
                  placeholder="ns=2;s=Temperature"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] text-slate-500 font-mono uppercase font-bold">Valor para Transmissão</label>
                  <span className="text-[8px] font-mono text-slate-600">String / Número</span>
                </div>
                <input 
                  type="text"
                  value={writeForm.value}
                  onChange={e => setWriteForm({...writeForm, value: e.target.value})}
                  className="w-full bg-[#15151A] text-slate-200 border border-[#1E1E24] rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#0091FF]"
                  placeholder="24.5"
                />
              </div>

              <button
                type="submit"
                disabled={isWriting || !writeForm.addressKey}
                className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 cursor-pointer pointer-events-auto transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                {isWriting ? 'Gravando Registrador...' : 'Transmitir via CLP / IoT'}
              </button>
            </form>

            {/* Write feedback */}
            {writeFeedback.message && (
              <div className={`p-3 border rounded-lg flex items-start gap-2.5 text-xs font-sans ${
                writeFeedback.type === 'success' 
                  ? 'bg-emerald-950/20 border-emerald-900/30 text-emerald-400' 
                  : 'bg-red-950/20 border-red-900/30 text-red-400'
              }`}>
                {writeFeedback.type === 'success' ? (
                  <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                ) : (
                  <XCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                )}
                <span className="leading-snug">{writeFeedback.message}</span>
              </div>
            )}
          </div>

          {/* Technical Protocol Notes */}
          <div className="bg-[#15151A]/60 border border-[#1E1E24] rounded-xl p-3.5 text-xs text-slate-400 leading-relaxed font-sans space-y-2">
            <span className="text-[9.5px] font-mono text-slate-500 uppercase font-bold block pb-1 border-b border-[#1E1E24]">Mapeamento Físico de CLPs</span>
            <p>
              Ao transmitir o sinal, a antena gateway ou o roteador de borda envia um comando assíncrono para o fuso, simulando a interferência ou alterando o sensor de OEE em tempo real no driver SQL Server.
            </p>
          </div>
        </div>

        {/* 3. TERMINAL CONSOLE / REAL-TIME IoT LOGS */}
        <div className="bg-[#0F0F12] border border-[#1E1E24] rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-4 flex-1 flex flex-col">
            <div className="flex items-center gap-2 border-b border-[#1E1E24] pb-3 shrink-0">
              <span className="p-1.5 bg-[#0091FF]/10 text-[#0091FF] rounded-lg">
                <Terminal className="w-4 h-4 animate-pulse" />
              </span>
              <div>
                <span className="text-[9px] font-mono text-[#0091FF] uppercase font-bold tracking-widest block">TELEMETRIA DE BORDA CONSOLE</span>
                <h4 className="text-xs font-bold text-white uppercase tracking-tight">Console de Tráfego de Rede</h4>
              </div>
            </div>

            {/* Real-time logging screen */}
            <div className="flex-1 min-h-[220px] bg-black rounded-lg p-3 border border-[#1E1E24] font-mono text-[9.5px] text-slate-400 space-y-1.5 overflow-y-auto max-h-[280px]">
              <p className="text-slate-600">[13:02:44 UTC] - QUALITYSYNC INDUSTRIAL NODE INICIADO.</p>
              <p className="text-[#0091FF] font-semibold">[13:02:45 UTC] - Borda offline carregada com sucesso.</p>
              <p className="text-slate-500">[13:03:00 UTC] - Escaneando barramento Modbus TCP em 192.168.1.150...</p>
              <p className="text-emerald-400">[13:03:01 UTC] - Modbus: Sensor de Vibração CNC-02 respondendo: OK</p>
              <p className="text-[#0091FF]">[13:03:10 UTC] - SQL Server: Conexão simulada estável no cache.</p>
              {Object.keys(protocols).length > 0 && (
                <>
                  <p className="text-[#00E676]">[13:03:15 UTC] - OPC UA Zeiss Link montado no barramento principal.</p>
                  <p className="text-purple-400">[13:03:20 UTC] - Beckhoff TwinCAT ADS conectado ao IP de controle.</p>
                </>
              )}
              {writeFeedback.message && (
                <p className="text-[#FF9100] font-bold">[Transmitido] - CLP: {writeForm.addressKey} setado para {writeForm.value}</p>
              )}
              <p className="text-slate-600 animate-pulse">_ [Esperando sinal de CLP...]</p>
            </div>
          </div>

          <div className="bg-[#15151A]/60 border border-[#1E1E24] rounded-xl p-3.5 text-xs text-slate-400 font-mono space-y-1">
            <span className="text-[9.5px] font-bold uppercase text-[#0091FF]">Gêmeo Digital Co-Pilot</span>
            <p className="text-[10.5px]">As transmissões retroalimentam os blocos térmicos da IA para recalcular compensações metrológicas no chatbot.</p>
          </div>
        </div>

      </div>

      {/* 4. ALL 9 PROTOCOLS STATUS GRID */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-3.5 bg-gradient-to-b from-[#0091FF] to-indigo-600 rounded-full" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Barramento de Barramentos: Status dos 9 Protocolos de Linha de Fábrica
            </h4>
          </div>
          <span className="text-[9.5px] font-mono text-slate-500">
            Sincronismo IoT Ativo ({connectionMode === 'online' ? 'Nuvem' : 'Edge Computing'})
          </span>
        </div>

        {isLoadingProtocols ? (
          <div className="py-12 text-center text-xs text-slate-500 font-mono">
            Carregando barramentos de fábrica...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(protocols).map(([key, rawData]) => {
              const data = rawData as ProtocolStatus;
              const isSelectedToWrite = selectedProtocol === key;
              const hasAlert = key === 'modbus' && (data.registers as any)?.vibration > 0.45;
              
              return (
                <div
                  key={key}
                  onClick={() => updateWriteKeyForProtocol(key)}
                  className={`bg-[#0F0F12] border rounded-xl p-4.5 cursor-pointer relative transition-all duration-300 flex flex-col justify-between group ${
                    isSelectedToWrite 
                      ? 'border-[#0091FF] bg-[#0091FF]/5 shadow-[0_0_15px_rgba(0,145,255,0.15)] ring-1 ring-[#0091FF]/30' 
                      : 'border-[#1E1E24] hover:border-slate-700 hover:bg-[#121217]'
                  }`}
                >
                  <div className="space-y-3">
                    
                    {/* Top Protocol Header Badge */}
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border ${getProtocolIconColor(key)}`}>
                        {key.toUpperCase()}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {hasAlert && (
                          <span className="text-[8px] font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded animate-pulse">
                            ALTOS Gs
                          </span>
                        )}
                        <span className={`w-2 h-2 rounded-full ${data.connected ? 'bg-emerald-400' : 'bg-amber-400'} animate-pulse`} />
                      </div>
                    </div>

                    {/* CLP Protocol Name */}
                    <div>
                      <h5 className="text-xs font-bold text-white group-hover:text-[#0091FF] transition-colors">
                        {getFriendlyProtocolName(key)}
                      </h5>
                      <span className="text-[10px] text-slate-500 font-mono">IP: {data.deviceIP}:{data.port}</span>
                    </div>

                    {/* Registers and telemetry values block */}
                    <div className="bg-[#15151A]/60 border border-[#1E1E24]/60 rounded-lg p-2.5 font-mono text-[10.5px] space-y-1.5">
                      <span className="text-[8px] text-[#666666] uppercase block font-bold tracking-widest">Registradores Ativos</span>
                      {Object.entries(data.registers || {}).map(([regKey, regValue]) => (
                        <div key={regKey} className="flex items-center justify-between">
                          <span className="text-slate-400">{regKey}:</span>
                          <span className="text-white font-bold">
                            {typeof regValue === 'number' ? regValue.toFixed(2) : String(regValue)}
                          </span>
                        </div>
                      ))}
                    </div>

                  </div>

                  {/* Frequency and synchronization details */}
                  <div className="mt-4 pt-2.5 border-t border-[#1E1E24]/40 flex items-center justify-between text-[9px] font-mono text-slate-500">
                    <span>Taxa: {data.frequencyMs}ms</span>
                    <span>Sinc: {new Date(data.lastSync).toLocaleTimeString("pt-BR")}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  )}

  {activeSubTab === 'bmeconnect' && (
    <div className="bg-[#0F0F12] border border-[#1E1E24] rounded-xl p-6 space-y-6">
      <div className="flex items-center gap-3 border-b border-[#1E1E24] pb-4">
        <span className="p-2 bg-orange-500/10 text-orange-500 rounded-lg">
          <Cpu className="w-5 h-5" />
        </span>
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-tight">
            Assistente BME Connect Setup
          </h4>
          <p className="text-xs text-slate-400">
            Instalador Universal de Borda para CLP, Sensores e Coleta IoT
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans text-xs">
        <div className="bg-[#15151A] border border-[#1E1E24] p-4 rounded-lg space-y-2">
          <span className="text-[10px] font-mono text-orange-500 font-bold uppercase">Passo 1</span>
          <h5 className="font-bold text-white text-xs">Identificar Equipamento</h5>
          <p className="text-slate-400 text-[11px]">Selecione o fabricante e modelo da máquina ou terminal de borda.</p>
        </div>
        <div className="bg-[#15151A] border border-[#1E1E24] p-4 rounded-lg space-y-2">
          <span className="text-[10px] font-mono text-orange-500 font-bold uppercase">Passo 2</span>
          <h5 className="font-bold text-white text-xs">Configurar Barramento</h5>
          <p className="text-slate-400 text-[11px]">Defina o protocolo (OPC UA, Modbus TCP, Siemens, MQTT, etc.).</p>
        </div>
        <div className="bg-[#15151A] border border-[#1E1E24] p-4 rounded-lg space-y-2">
          <span className="text-[10px] font-mono text-orange-500 font-bold uppercase">Passo 3</span>
          <h5 className="font-bold text-white text-xs">Testar &amp; Sincronizar</h5>
          <p className="text-slate-400 text-[11px]">Valide a comunicação e vincule os registradores ao QualitySync.</p>
        </div>
      </div>
    </div>
  )}

</div>
);
}
