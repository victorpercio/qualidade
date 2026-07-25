import React, { useState, useEffect } from 'react';
import { 
  Cpu, ShieldCheck, AlertTriangle, Play, RefreshCw, Send, Sparkles, Map, 
  Layers, LogOut, User, Activity, CheckCircle, XCircle, Sliders, Settings2, 
  Volume2, Compass, ArrowRight, HelpCircle, FileText, Check, DollarSign, CreditCard,
  Search, Download, Filter, ArrowUpRight, FileSpreadsheet, Eye, Plus, FilePlus, Save,
  Trash2, Clock, Lock, ChevronDown, ChevronUp, WifiOff, Database, Globe,
  Monitor, Tablet, Menu, X, ChevronRight, Info, Gauge, History, SlidersHorizontal, Scale
} from 'lucide-react';
import LandingPage, { PLANS } from './components/LandingPage';
import LoginModal from './components/LoginModal';
import IntegrationsPanel from './components/IntegrationsPanel';
import EmergencyPanel from './components/EmergencyPanel';
import TraceabilityPanel from './components/TraceabilityPanel';
import ProceduresPanel from './components/ProceduresPanel';
import MyMachineView from './components/MyMachineView';
import { PartInspection, Machine, UserProfile, AIInsight } from './types';

export default function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  // Connection Mode for Offline presentation capability
  const [connectionMode, setConnectionMode] = useState<'online' | 'offline'>('offline');

  // Active state initialized with high-fidelity local data for offline stability
  const [machines, setMachines] = useState<Machine[]>([
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
      vibration: 0.58,
      speedRpm: 12000,
      oee: 72.1,
      utilization: 68,
      partsHeuristic: 2.1,
      position: { x: 380, y: 240 }
    },
    {
      id: "LASER-01",
      name: "Estação Laser Trumpf 3030 (Linha Gamma)",
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
      name: "Braço KUKA KR-16 (Estação Montagem)",
      type: "Robotic Assembly",
      status: "online",
      temperature: 21.8,
      vibration: 0.12,
      speedRpm: 1800,
      oee: 91.0,
      utilization: 89,
      partsHeuristic: 4.2,
      position: { x: 740, y: 320 }
    },
    {
      id: "CNC-03",
      name: "Torno de Cabeçote Móvel Star SR-38 (Linha Alpha)",
      type: "CNC Turning",
      status: "online",
      temperature: 23.5,
      vibration: 0.19,
      speedRpm: 10500,
      oee: 92.4,
      utilization: 91,
      partsHeuristic: 4.8,
      position: { x: 300, y: 300 }
    },
    {
      id: "ZEISS-01",
      name: "Metrologia 3D ZEISS PRISMO",
      type: "Metrology Zeiss Station",
      status: "online",
      temperature: 21.0,
      vibration: 0.02,
      speedRpm: 0,
      oee: 98.4,
      utilization: 99,
      partsHeuristic: 1.5,
      position: { x: 480, y: 410 }
    }
  ]);
  const [inspections, setInspections] = useState<PartInspection[]>([
    {
      id: "SN-9340-A22",
      batch: "LOTE-CNC02-05",
      operator: "Carlos Santos",
      machineId: "CNC-02",
      timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
      measurements: { lengthMm: 120.04, widthMm: 45.01, heightMm: 30.01 },
      deviations: { lengthMm: 0.04, widthMm: 0.01, heightMm: 0.01 },
      temperatureCelsius: 22.8,
      vibrationG: 0.38,
      status: "approved",
      notes: "Medição de rotina pós fresagem. Altamente conforme.",
      partObservation: "Aço rápido SAE 1045 sem deformações na superfície de contato.",
      buyerName: "Scania",
      partName: "Bloco Motor V8",
      routingSteps: [
        { machineId: "CNC-01", timestamp: "13:30", machineNotes: "Corte bruto inicial do tarugo metálico." },
        { machineId: "CNC-02", timestamp: "14:15", machineNotes: "Fresagem de precisão e acabamento lateral." },
        { machineId: "ZEISS-01", timestamp: "14:40", machineNotes: "Metrologia 3D óptica." }
      ]
    },
    {
      id: "SN-9340-A21",
      batch: "LOTE-CNC02-05",
      operator: "Carlos Santos",
      machineId: "CNC-02",
      timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
      measurements: { lengthMm: 120.08, widthMm: 45.04, heightMm: 30.03 },
      deviations: { lengthMm: 0.08, widthMm: 0.04, heightMm: 0.03 },
      temperatureCelsius: 24.1,
      vibrationG: 0.44,
      status: "rework",
      notes: "Desvio dimensional leve por dilatação térmica. Mandar para ajuste manual.",
      defectType: "Desvio Dimensional Térmico",
      partObservation: "Superfície externa áspera, necessita retífica lateral de desbaste.",
      buyerName: "Volvo Trucks",
      partName: "Mancal Central do Eixo",
      routingSteps: [
        { machineId: "CNC-02", timestamp: "13:45", machineNotes: "Fluido de refrigeração abaixo do ideal, causando drift térmico." },
        { machineId: "ZEISS-01", timestamp: "14:10", machineNotes: "Deteção automática de desalinhamento de 0.08mm." }
      ]
    },
    {
      id: "SN-9310-B02",
      batch: "LOTE-CNC01-12",
      operator: "Mariana Souza",
      machineId: "CNC-01",
      timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
      measurements: { lengthMm: 119.98, widthMm: 44.99, heightMm: 29.99 },
      deviations: { lengthMm: -0.02, widthMm: -0.01, heightMm: -0.01 },
      temperatureCelsius: 21.6,
      vibrationG: 0.22,
      status: "approved",
      notes: "Padrão de metrologia calibrado sob especificações ZEISS.",
      partObservation: "Lote super-conforme para aplicação aeroespacial.",
      buyerName: "Scania",
      partName: "Cabeçote 366 de Alta Pressão",
      routingSteps: [
        { machineId: "CNC-01", timestamp: "11:15", machineNotes: "Usinagem sob rotação estável de 8500 RPM." },
        { machineId: "ZEISS-01", timestamp: "12:00", machineNotes: "Inspeção dimensional por apalpador físico de rubi." }
      ]
    },
    {
      id: "SN-9400-X01",
      batch: "LOTE-LAS01-08",
      operator: "Renato Ramos",
      machineId: "LASER-01",
      timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
      measurements: { lengthMm: 120.15, widthMm: 45.12, heightMm: 30.05 },
      deviations: { lengthMm: 0.15, widthMm: 0.12, heightMm: 0.05 },
      temperatureCelsius: 26.5,
      vibrationG: 0.65,
      status: "rejected",
      notes: "A largura e o comprimento excedem a tolerância limite. Lente do cabeçote laser desalinhada.",
      defectType: "Excesso Dimensional Crítico",
      partObservation: "Peça descartada devido a queima de borda lateral por superaquecimento.",
      buyerName: "Mercedes-Benz",
      partName: "Bloco Motor V8",
      routingSteps: [
        { machineId: "CNC-01", timestamp: "10:10", machineNotes: "Usinagem da pré-forma sem anomalias registradas." },
        { machineId: "LASER-01", timestamp: "10:50", machineNotes: "Corte a laser com lente desalinhada detectado via sensor térmico." }
      ]
    },
    {
      id: "SN-9120-Q10",
      batch: "LOTE-ROB03-01",
      operator: "Beatriz Costa",
      machineId: "ROB-03",
      timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
      measurements: { lengthMm: 120.01, widthMm: 45.01, heightMm: 30.00 },
      deviations: { lengthMm: 0.01, widthMm: 0.01, heightMm: 0.00 },
      temperatureCelsius: 21.9,
      vibrationG: 0.15,
      status: "approved",
      notes: "Alinhamento robotizado excelente.",
      partObservation: "Nenhuma distorção de furos ou encaixes cilíndricos.",
      buyerName: "Iveco Linhas",
      partName: "Acoplamento de Mancal Direcional",
      routingSteps: [
        { machineId: "CNC-01", timestamp: "08:15", machineNotes: "Furação de alta velocidade." },
        { machineId: "ROB-03", timestamp: "09:05", machineNotes: "Montagem final automatizada com torque de 15 Nm." }
      ]
    }
  ]);
  const [selectedMachineId, setSelectedMachineId] = useState<string>("CNC-01");
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inspection' | 'factory' | 'ia-chat' | 'saas-billing' | 'integrations' | 'emergency' | 'traceability' | 'procedures' | 'my-machine'>('dashboard');
  const [selectedInstructionId, setSelectedInstructionId] = useState<string | null>(null);

  // Interactive Metrology Scanning State
  const [scanningPart, setScanningPart] = useState<PartInspection | null>(null);
  const [isScanningActive, setIsScanningActive] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  // Machine Production input form
  const [inputBatch, setInputBatch] = useState("LOTE-CNC01-15");
  const [inputLength, setInputLength] = useState("120.01");
  const [inputWidth, setInputWidth] = useState("45.01");
  const [inputHeight, setInputHeight] = useState("30.01");
  const [inputTemp, setInputTemp] = useState("22.1");
  const [inputNotes, setInputNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // AI auditor & chatbot variables
  const [auditResult, setAuditResult] = useState<string>("");
  const [isAuditing, setIsAuditing] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{ sender: 'user' | 'ai'; text: string; time: string }[]>([
    { 
      sender: "ai", 
      text: "Saudações operacionais. Sou o assistente cibernético QualitySync. Como posso ajudar nas compensações de precisão ZEISS hoje?", 
      time: "15:11" 
    }
  ]);
  const [isGeneratingChat, setIsGeneratingChat] = useState(false);

  // SaaS simulated billing state
  const [selectedBillingPlan, setSelectedBillingPlan] = useState<'starter' | 'professional' | 'enterprise'>('professional');
  const [paymentStep, setPaymentStep] = useState<'selection' | 'checkout' | 'success'>('selection');
  const [cardNumber, setCardNumber] = useState('4000 1234 5678 9010');
  const [cardHolder, setCardHolder] = useState('CARLOS SANTOS METROLOGIA');
  const [cardExpiry, setCardExpiry] = useState('12/30');
  const [cvv, setCvv] = useState('999');

  // Traceability Spreadsheet filter & search states
  const [traceSearch, setTraceSearch] = useState("");
  const [traceStatusFilter, setTraceStatusFilter] = useState<string>("ALL");
  const [traceMachineFilter, setTraceMachineFilter] = useState<string>("ALL");
  const [selectedTracePart, setSelectedTracePart] = useState<PartInspection | null>(null);

  // States for adding information directly to the spreadsheet
  const [isAddingTraceItem, setIsAddingTraceItem] = useState(false);
  const [tracePartId, setTracePartId] = useState("BME-1002");
  const [traceBatch, setTraceBatch] = useState("LOTE-CNC01-15");
  const [traceOperator, setTraceOperator] = useState("");
  const [traceMachineId, setTraceMachineId] = useState("CNC-01");
  const [traceLength, setTraceLength] = useState("120.00");
  const [traceWidth, setTraceWidth] = useState("45.05");
  const [traceHeight, setTraceHeight] = useState("30.01");
  const [traceTemp, setTraceTemp] = useState("22.0");
  const [traceBuyerName, setTraceBuyerName] = useState("Scania");
  const [tracePartName, setTracePartName] = useState("Bloco Motor V8");
  const [tracePartStatus, setTracePartStatus] = useState<string>("approved"); // 'approved' (aceita), 'rework' (retrabalhada), 'rejected' (rejeitada)
  const [colorTheme, setColorTheme] = useState<'default' | 'light' | 'colorblind' | 'inverted'>('default');
  
  // New UX Redesign Environment & Accessibility States
  const [userEnvironment, setUserEnvironment] = useState<'computer' | 'tablet'>('computer');
  const [fontSizeMode, setFontSizeMode] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [glovesMode, setGlovesMode] = useState<boolean>(false);
  const [tabletSubView, setTabletSubView] = useState<'search' | 'traceability' | 'machines' | 'production' | 'quality' | 'assistant' | 'settings' | 'help' | 'procedures' | 'my-machine'>('search');
  const [tabletSearchQuery, setTabletSearchQuery] = useState<string>("");
  const [tabletSelectedPartId, setTabletSelectedPartId] = useState<string | null>(null);
  const [tabletShowDetails, setTabletShowDetails] = useState<boolean>(false);
  const [tabletShowHistory, setTabletShowHistory] = useState<boolean>(false);
  const [tabletShowTrace, setTabletShowTrace] = useState<boolean>(false);
  const [isTabletSidebarOpen, setIsTabletSidebarOpen] = useState<boolean>(false);
  const [computerGlobalSearchQuery, setComputerGlobalSearchQuery] = useState<string>("");
  const [isComputerSearchFocused, setIsComputerSearchFocused] = useState<boolean>(false);

  const [copiedAudit, setCopiedAudit] = useState(false);
  const [expandedPartId, setExpandedPartId] = useState<string | null>(null);
  const [isTraceSubmitting, setIsTraceSubmitting] = useState(false);
  const [traceFormError, setTraceFormError] = useState("");
  const [traceFormSuccess, setTraceFormSuccess] = useState(false);

  // Custom industrial per-step machines trace logs and physical notes addition
  const [tracePartObservation, setTracePartObservation] = useState("");
  const [traceRoutingSteps, setTraceRoutingSteps] = useState<Array<{ machineId: string; timestamp: string; machineNotes?: string }>>([
    { machineId: "CNC-01", timestamp: "09:30", machineNotes: "Corte bruto do tarugo e preparação dimensional inicial." },
    { machineId: "CNC-02", timestamp: "10:15", machineNotes: "Fresagem de precisão e canais prismáticos." }
  ]);
  const [newStepMachine, setNewStepMachine] = useState("LASER-01");
  const [newStepTime, setNewStepTime] = useState("10:50");
  const [newStepNotes, setNewStepNotes] = useState("Gravação de código serial óptico e polimento de borda.");

  // Triggering simulation tickers
  const [utcTime, setUtcTime] = useState("");

  // Smart Search Parser for Operator (Tablet) and Manager (Computer)
  const getFilteredInspections = (searchQuery: string) => {
    if (!searchQuery) return [];
    const q = searchQuery.toLowerCase().trim();
    
    return inspections.filter(i => {
      // 1. Natural date matches
      if (q.includes("semana passada")) {
        const partDate = new Date(i.timestamp);
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
        return partDate >= twoWeeksAgo && partDate <= oneWeekAgo;
      }
      if (q.includes("ontem")) {
        const partDate = new Date(i.timestamp).toDateString();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return partDate === yesterday.toDateString();
      }
      if (q.includes("hoje")) {
        const partDate = new Date(i.timestamp).toDateString();
        return partDate === new Date().toDateString();
      }
      if (q.includes("mês") || q.includes("mes") || q.includes("trinta dias")) {
        const partDate = new Date(i.timestamp);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return partDate >= thirtyDaysAgo;
      }

      // 2. Exact or partial field matching
      const idMatch = i.id.toLowerCase().includes(q);
      const batchMatch = i.batch.toLowerCase().includes(q);
      const partNameMatch = i.partName ? i.partName.toLowerCase().includes(q) : false;
      const operatorMatch = i.operator ? i.operator.toLowerCase().includes(q) : false;
      const machineMatch = i.machineId.toLowerCase().includes(q);
      const buyerMatch = i.buyerName ? i.buyerName.toLowerCase().includes(q) : false;
      const notesMatch = i.notes ? i.notes.toLowerCase().includes(q) : false;
      const obsMatch = i.partObservation ? i.partObservation.toLowerCase().includes(q) : false;
      const defectMatch = i.defectType ? i.defectType.toLowerCase().includes(q) : false;

      // CNC tool or serial code mappings
      const t08Match = q === "t08" && (notesMatch || obsMatch || idMatch || batchMatch);

      return idMatch || batchMatch || partNameMatch || operatorMatch || machineMatch || buyerMatch || notesMatch || obsMatch || defectMatch || t08Match;
    });
  };

  const selectedMachine = machines.find(m => m.id === selectedMachineId) || machines[0];

  useEffect(() => {
    // Generate simulated clock
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.getUTCHours().toString().padStart(2, '0') + ":" + 
                 now.getUTCMinutes().toString().padStart(2, '0') + ":" + 
                 now.getUTCSeconds().toString().padStart(2, '0') + " UTC");
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Simulates telemetry fluctuations directly on the client for true offline capability
  const applyClientFluctuations = () => {
    setMachines(prevMachines => {
      if (!prevMachines || prevMachines.length === 0) return prevMachines;
      return prevMachines.map((m) => {
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
          temperature = Number((21.0 + (Math.random() - 0.5) * 0.05).toFixed(2));
          vibration = Number((0.02 + Math.random() * 0.01).toFixed(2));
        }

        return {
          ...m,
          temperature,
          vibration,
          speedRpm
        };
      });
    });
  };

  // Fetch telemetry from fullstack backend or fallback locally
  const fetchTelemetry = async () => {
    if (connectionMode === 'offline') {
      applyClientFluctuations();
      return;
    }
    try {
      const resMach = await fetch("/api/machines");
      const dataMach = await resMach.json();
      setMachines(dataMach);

      const resIns = await fetch("/api/inspections");
      const dataIns = await resIns.json();
      setInspections(dataIns);

      // Default the scanned part view
      if (dataIns.length > 0 && !scanningPart) {
        setScanningPart(dataIns[0]);
      }
    } catch (e) {
      console.warn("API industrial de rede local não encontrada. Operando localmente no navegador (Modo Borda).", e);
      setConnectionMode('offline');
      applyClientFluctuations();
    }
  };

  useEffect(() => {
    if (connectionMode === 'online') {
      fetchTelemetry();
      const timer = setInterval(fetchTelemetry, 5000);
      return () => clearInterval(timer);
    } else {
      applyClientFluctuations();
      const timer = setInterval(applyClientFluctuations, 4000);
      return () => clearInterval(timer);
    }
  }, [connectionMode]);

  // Set default profile if user clicks Quick Access from Landing
  const handleQuickStart = (chosenPlan: 'starter' | 'professional' | 'enterprise') => {
    setProfile({
      email: "globoestudio78@gmail.com",
      companyName: "Metalúrgica AeroMetais Brass",
      operatorName: "Carlos Santos",
      role: "Engenheiro de Metrologia Sênior",
      planId: chosenPlan
    });
    setSelectedBillingPlan(chosenPlan);
  };

  const handleMetrologySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const lengthVal = parseFloat(inputLength);
    const widthVal = parseFloat(inputWidth);
    const heightVal = parseFloat(inputHeight);
    const tempVal = parseFloat(inputTemp);

    const reqPayload = {
      id: "SN-" + Math.floor(1000 + Math.random() * 9000) + "-" + String.fromCharCode(65 + Math.floor(Math.random() * 26)) + Math.floor(10 + Math.random() * 90),
      batch: inputBatch,
      operator: profile?.operatorName || "Carlos Santos",
      machineId: selectedMachineId,
      measurements: { lengthMm: lengthVal, widthMm: widthVal, heightMm: heightVal },
      deviations: { 
        lengthMm: Number((lengthVal - 120.0).toFixed(2)), 
        widthMm: Number((widthVal - 45.0).toFixed(2)), 
        heightMm: Number((heightVal - 30.0).toFixed(2)) 
      },
      temperatureCelsius: tempVal,
      vibrationG: Number((0.15 + Math.random() * 0.4).toFixed(2)),
      status: Math.abs(lengthVal - 120.0) <= 0.1 && Math.abs(widthVal - 45.0) <= 0.1 && Math.abs(heightVal - 30.0) <= 0.05 
        ? "approved" 
        : (Math.abs(lengthVal - 120.0) <= 0.2 ? "rework" : "rejected"),
      notes: inputNotes || "Lançamento de Metrologia Rápido",
      partObservation: "Inspeção dimensional por sensor de borda local.",
      buyerName: "Cliente Geral",
      partName: selectedMachineId === "CNC-01" ? "Cabeçote 366 de Alta Pressão" : "Bloco Motor V8",
      routingSteps: [
        { machineId: selectedMachineId, timestamp: "Atual", machineNotes: "Operação e medição direta." }
      ],
      timestamp: new Date().toISOString()
    };

    if (connectionMode === 'offline') {
      setTimeout(() => {
        setInspections(prev => [reqPayload as PartInspection, ...prev]);
        setScanningPart(reqPayload as PartInspection);
        setInputNotes("");
        setIsSubmitting(false);

        // Trigger automated scanning visualization sequence for the brand new part
        setIsScanningActive(true);
        setScanProgress(0);
        let progress = 0;
        const progressTimer = setInterval(() => {
          progress += 10;
          setScanProgress(progress);
          if (progress >= 100) {
            clearInterval(progressTimer);
            setIsScanningActive(false);
          }
        }, 150);

        // Switch to the inspection tab so they can see the gorgeous real-time sweep
        setActiveTab('inspection');
      }, 500);
      return;
    }

    try {
      const res = await fetch("/api/inspections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reqPayload)
      });

      if (res.ok) {
        const newPart = await res.json();
        setInspections(prev => [newPart, ...prev]);
        setScanningPart(newPart);
        setInputNotes("");
        
        // Trigger automated scanning visualization sequence for the brand new part
        setIsScanningActive(true);
        setScanProgress(0);
        let progress = 0;
        const progressTimer = setInterval(() => {
          progress += 10;
          setScanProgress(progress);
          if (progress >= 100) {
            clearInterval(progressTimer);
            setIsScanningActive(false);
          }
        }, 150);

        // Switch to the inspection tab so they can see the gorgeous real-time sweep
        setActiveTab('inspection');
      }
    } catch (err) {
      console.warn("Servidor offline. Salvando metrologia localmente no browser:", err);
      // Failover to offline saving
      setInspections(prev => [reqPayload as PartInspection, ...prev]);
      setScanningPart(reqPayload as PartInspection);
      setInputNotes("");
      setConnectionMode('offline');
      // Trigger sweep
      setIsScanningActive(true);
      setScanProgress(0);
      let progress = 0;
      const progressTimer = setInterval(() => {
        progress += 10;
        setScanProgress(progress);
        if (progress >= 100) {
          clearInterval(progressTimer);
          setIsScanningActive(false);
        }
      }, 150);
      setActiveTab('inspection');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit handler specifically for the inline spreadsheet traceability registrant form
  const handleTraceItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTraceFormError("");
    setTraceFormSuccess(false);

    const lengthVal = parseFloat(traceLength);
    const widthVal = parseFloat(traceWidth);
    const heightVal = parseFloat(traceHeight);
    const tempVal = parseFloat(traceTemp);

    if (!traceBatch.trim()) {
      setTraceFormError("Código do Lote de Fabricação é obrigatório.");
      return;
    }
    if (isNaN(lengthVal) || lengthVal <= 0) {
      setTraceFormError("O Comprimento (X) deve ser um número positivo válido.");
      return;
    }
    if (isNaN(widthVal) || widthVal <= 0) {
      setTraceFormError("A Largura (Y) deve ser um número positivo válido.");
      return;
    }
    if (isNaN(heightVal) || heightVal <= 0) {
      setTraceFormError("A Altura (Z) deve ser um número positivo válido.");
      return;
    }
    if (isNaN(tempVal)) {
      setTraceFormError("A Temperatura Celsius deve ser informada corretamente.");
      return;
    }

    setIsTraceSubmitting(true);

    const reqPayload = {
      id: "SN-" + Math.floor(1000 + Math.random() * 9000) + "-REG",
      batch: traceBatch,
      operator: traceOperator || profile?.operatorName || "Carlos Santos",
      machineId: traceMachineId,
      measurements: { lengthMm: lengthVal, widthMm: widthVal, heightMm: heightVal },
      deviations: { 
        lengthMm: Number((lengthVal - 120.0).toFixed(2)), 
        widthMm: Number((widthVal - 45.0).toFixed(2)), 
        heightMm: Number((heightVal - 30.0).toFixed(2)) 
      },
      temperatureCelsius: tempVal,
      vibrationG: Number((0.15 + Math.random() * 0.35).toFixed(2)),
      notes: "Lançamento manual direto na Planilha de Rastreabilidade",
      routingSteps: traceRoutingSteps,
      partObservation: tracePartObservation,
      buyerName: traceBuyerName || "Scania",
      partName: tracePartName || "Bloco Motor V8",
      status: tracePartStatus,
      timestamp: new Date().toISOString()
    };

    if (connectionMode === 'offline') {
      setTimeout(() => {
        setInspections(prev => [reqPayload as PartInspection, ...prev]);
        setTraceFormSuccess(true);
        setTracePartObservation("");
        setTraceRoutingSteps([
          { machineId: "CNC-01", timestamp: "09:30", machineNotes: "Corte bruto do tarugo e preparação dimensional inicial." },
          { machineId: "CNC-02", timestamp: "10:15", machineNotes: "Fresagem de precisão e canais prismáticos." }
        ]);
        setTraceLength("120.00");
        setTraceWidth("45.00");
        setTraceHeight("30.00");
        setTraceTemp("21.5");
        setIsTraceSubmitting(false);
        setTimeout(() => setTraceFormSuccess(false), 9000);
      }, 500);
      return;
    }

    try {
      const res = await fetch("/api/inspections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reqPayload)
      });

      if (res.ok) {
        const newPart = await res.json();
        setInspections(prev => [newPart, ...prev]);
        setTraceFormSuccess(true);
        setTracePartObservation("");
        setTraceRoutingSteps([
          { machineId: "CNC-01", timestamp: "09:30", machineNotes: "Corte bruto do tarugo e preparação dimensional inicial." },
          { machineId: "CNC-02", timestamp: "10:15", machineNotes: "Fresagem de precisão e canais prismáticos." }
        ]);
        setTraceLength("120.00");
        setTraceWidth("45.00");
        setTraceHeight("30.00");
        setTraceTemp("21.5");
        setTimeout(() => setTraceFormSuccess(false), 9000);
      } else {
        const errorData = await res.json();
        setTraceFormError(errorData.error || "Ocorreu um erro no processador de metrologia.");
      }
    } catch (err) {
      console.warn("Erro ao comunicar com o servidor. Persistindo localmente offline:", err);
      setInspections(prev => [reqPayload as PartInspection, ...prev]);
      setTraceFormSuccess(true);
      setConnectionMode('offline');
      setTimeout(() => setTraceFormSuccess(false), 9000);
    } finally {
      setIsTraceSubmitting(false);
    }
  };

  // Run Real-time AI Industrial Auditor
  const triggerAiAuditor = async () => {
    setIsAuditing(true);
    setAuditResult("");

    if (connectionMode === 'offline') {
      setTimeout(() => {
        const cnc02Temp = machines.find(m => m.id === "CNC-02")?.temperature || 26.8;
        const cnc02Vib = machines.find(m => m.id === "CNC-02")?.vibration || 0.58;
        const mockAudit = `### 1. **DASHBOARD AUDIT STATUS (PROCESSAMENTO LOCAL / OFFLINE)**
* **Lotes Processados**: 12,500 faturados | **Sensoriamento IoT de Borda**: Ativo com 100% de integridade (ZEISS Digital Link).
* **Taxa de Conformidade Global**: **80.0%** (Instável devido à derivação técnica na linha CNC-02).
* **Eficiência Geral (OEE Médio)**: **88.64%** | Processamento executado na infraestrutura local da fábrica para máxima segurança.

---

### 2. **PADRÕES DE ANOMALIA DETECTADOS (EDGE DETECT)**
* **Deriva Térmica na CNC-02 (${cnc02Temp}°C)**: Identificamos uma variação dimensional linear nas amostras (\`+0.08mm\` de comprimento). Este comportamento correlaciona-se com o aquecimento contínuo do fuso (spindle) operando na rotação máxima de 12.000 RPM. A dilatação térmica do cabeçote distorce o valor metrológico ideal.
* **Sobrecarga de Vibração (${cnc02Vib} G)**: A máquina CNC-02 registrou pico de vibração ressonante. A análise de harmônica infere desalinhamento axial ou desgaste nas guias prismáticas lineares inferiores, comprometendo a precisão micron da metrologia ZEISS.

---

### 3. **DIRETRIZES DE FLUXOS HOMEM-IA (INDÚSTRIA 5.0)**
* **Calibragem Monitorada**: Em vez de parar totalmente a linha, a IA calcula compensações automáticas baseando-se nas equações de expansão do material. Exiba ao operador Carlos Santos, em sua tela de controle industrial, a indicação para setar um offset corretivo de \`-0.045mm\` no eixo Z nas configurações do controlador CNC.
* **Preempção Inteligente**: O operador pode aprovar peças marcadas como 'rework' no portal de qualidade central. A IA direciona as peças diretamente para desbaste assistido, integrando a decisão humana na otimização cirúrgica do aço.

---

### 4. **RECOMENDADORES DE MANUTENÇÃO PREDITIVA**
* **AÇÃO 1 - Inspeção do Sistema de Refrigeração (CNC-02)**: Limpeza dos filtros e verificação do nível de fluido de corte refrigerante de alta pressão dentro das próximas 4 horas nominais de operação.
* **AÇÃO 2 - Verificação de Torque e Mancal**: Agendar aperto preditivo de rolamentos e reaperto dos eixos guia da máquina CNC-02 via lubrificação autógena com óleo sintético ISO VG 68.`;

        setAuditResult(mockAudit);
        setIsAuditing(false);
      }, 700);
      return;
    }

    try {
      const res = await fetch("/api/ai/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: "Auditar lote e prever anomalias térmicas." })
      });
      const data = await res.json();
      setAuditResult(data.text || "Relatório gerado com sucesso.");
    } catch (e) {
      console.warn("Falha no auditor online. Ativando auditor de borda local.");
      setConnectionMode('offline');
      triggerAiAuditor(); // retry using offline mode
    } finally {
      setIsAuditing(false);
    }
  };

  // Submit chat query to Gemini helper
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userText = chatMessage;
    const now = new Date();
    const timeStr = now.getUTCHours().toString().padStart(2, '0') + ":" + now.getUTCMinutes().toString().padStart(2, '0');
    
    // Add user message to UI immediately
    setChatHistory(prev => [...prev, { sender: 'user', text: userText, time: timeStr }]);
    setChatMessage("");
    setIsGeneratingChat(true);

    // AI Deep-Linking Interceptor for work instructions
    const lower = userText.toLowerCase();
    let detectedInstruction: string | null = null;
    let productName = "";

    if (lower.includes("bagie")) {
      detectedInstruction = "bagie";
      productName = "Bagie (Mancal Especial Turbocompressor)";
    } else if (lower.includes("cabeçote") || lower.includes("cabecote")) {
      detectedInstruction = "cabecote";
      productName = "Cabeçote 366 de Alta Pressão";
    } else if (lower.includes("suporte")) {
      detectedInstruction = "suporte";
      productName = "Suporte de Alternador Traseiro";
    } else if (lower.includes("bloco")) {
      detectedInstruction = "bloco_motor";
      productName = "Bloco de Motor V8";
    } else if (lower.includes("mancal")) {
      detectedInstruction = "mancal_central";
      productName = "Mancal Central do Eixo";
    }

    if (detectedInstruction) {
      setSelectedInstructionId(detectedInstruction);
      if (activeTab !== 'procedures') {
        setActiveTab('procedures');
      }
      
      const reply = `Encontrei as **Instruções de Trabalho** para o produto **${productName}** e acabei de abrir o painel operacional para você! 

No painel de Instruções, você pode conferir:
- O passo a passo das etapas de fabricação (OP-010 a OP-070);
- Lista de EPIs e Ferramentas obrigatórias;
- Simulações de desenho técnico de engenharia (PDF/CAD);
- Checklists interativos de processo.`;
      
      setTimeout(() => {
        setChatHistory(prev => [...prev, { sender: 'ai', text: reply, time: timeStr }]);
        setIsGeneratingChat(false);
      }, 600);
      return;
    }

    if (connectionMode === 'offline') {
      setTimeout(() => {
        let reply = "";
        const lower = userText.toLowerCase();

        if (lower.includes("calibrar") || lower.includes("calibração")) {
          reply = `Para calibrar metrologicamente uma estação de usinagem como a **CNC-02** sob padrões **ZEISS** [MODO OFFLINE]:\n\n1. **Estabilização Térmica**: Certifique-se de que a máquina operou em rotação de aquecimento por pelo menos 15 minutos até atingir a temperatura padrão (idealmente de 21°C a 23°C).\n2. **Offset Compensatório**: Ajuste o offset de ferramenta no painel CNC inserindo o erro de posicionamento de \`-0.05 mm\` calculado pelo fuso.\n3. **Zeramento por Apalpador**: Execute o ciclo automático de calibração utilizando o apalpador Zeiss físico.`;
        } else if (lower.includes("vibrar") || lower.includes("vibração") || lower.includes("g")) {
          const cnc02Vib = machines.find(m => m.id === "CNC-02")?.vibration || 0.58;
          reply = `O nível de vibração ideal para operações de corte CNC contínuo deve ficar abaixo de **0.25 G**.\n\nNo momento, as leituras do sensor IoT acoplado ao rolamento superior da **CNC-02** acusam **${cnc02Vib} G** [ALERTA LOCAL OFFLINE].\n\n**Recomendação**: Reduzir em 15% o avanço da ferramenta por rotação e verificar folga mecânica nos mancais guia inferiores da Linha Beta.`;
        } else if (lower.includes("oee") || lower.includes("eficiência")) {
          reply = `A média de **OEE** da planta está consolidada localmente em **88.6%**:\n\n* CNC-01: **88.5%** (Excelente)\n* CNC-02: **72.1%** (Baixo por paradas térmicas)\n* Estação Laser: **93.2%** (Líder em rendimento)\n\nPara otimizar o OEE na CNC-02, execute o ajuste de fuso corretivo sugerido pelo Co-Piloto.`;
        } else {
          reply = `Olá! Sou o especialista de automação industrial e metrologia **QualitySync AI** operando em **Modo Borda Local (Offline)**.\n\nPosso apoiar sua equipe de qualidade na fábrica a:\n- Ajustar desvios de calibração micrométricos de equipamentos **ZEISS PRISMO**;\n- Diagnosticar derivas térmicas e mecânicas por vibração excessiva nas CNCs;\n- Calcular e simular taxas de OEE, conformidade técnica e fluxos cooperativos Homem-IA.\n\nQual instrução operacional de fábrica você deseja otimizar agora?`;
        }

        setChatHistory(prev => [...prev, { sender: 'ai', text: reply, time: timeStr }]);
        setIsGeneratingChat(false);
      }, 800);
      return;
    }

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText })
      });
      const data = await res.json();
      setChatHistory(prev => [...prev, { sender: 'ai', text: data.text, time: timeStr }]);
    } catch (err) {
      console.warn("Falha no chatbot online. Usando inteligência local.");
      setConnectionMode('offline');
      let reply = `[Fallback Offline] Olá! Sou o especialista de metrologia **QualitySync AI**. Detectamos interrupção no link de nuvem, mas nossa inteligência de borda local está ativa.\n\nComo posso apoiar suas compensações dimensionais no maquinário de fábrica de forma offline?`;
      setChatHistory(prev => [...prev, { sender: 'ai', text: reply, time: timeStr }]);
    } finally {
      setIsGeneratingChat(false);
    }
  };

  // Automated layout metrics calculation
  const totalInspected = inspections.length;
  const approvedInspections = inspections.filter(i => i.status === 'approved');
  const rejectedInspections = inspections.filter(i => i.status === 'rejected');
  const reworkInspections = inspections.filter(i => i.status === 'rework');

  const complianceRate = totalInspected > 0 
    ? Number(((approvedInspections.length / totalInspected) * 100).toFixed(2)) 
    : 100;

  const oeeAverage = machines.length > 0
    ? Number((machines.reduce((acc, m) => acc + m.oee, 0) / machines.length).toFixed(1))
    : 90.0;

  // Render original beautiful landing or modal before launching workstation
  if (!profile) {
    return (
      <div className="relative">
        <LandingPage 
          onStart={handleQuickStart} 
          onOpenLogin={() => setIsLoginModalOpen(true)} 
        />
        {isLoginModalOpen && (
          <LoginModal 
            onClose={() => setIsLoginModalOpen(false)} 
            onLoginSuccess={(prof) => setProfile(prof)} 
            userEmail="globoestudio78@gmail.com"
          />
        )}
      </div>
    );
  }

  return (
    <div className={`w-full min-h-screen bg-[#0A0A0C] text-[#E0E0E0] font-sans flex flex-col justify-between overflow-x-hidden antialiased select-none selection:bg-[#0091FF] selection:text-white theme-${colorTheme} theme-font-${fontSizeMode} ${glovesMode ? 'gloves-mode-active' : ''}`}>
      <style>{`
        /* --- ACCESSIBILITY FONT ADJUSTER --- */
        .theme-font-large {
          font-size: 112% !important;
        }
        .theme-font-large input, .theme-font-large select, .theme-font-large button, .theme-font-large table {
          font-size: 14px !important;
        }
        .theme-font-large p, .theme-font-large span, .theme-font-large label, .theme-font-large td, .theme-font-large li {
          font-size: 13.5px !important;
        }
        .theme-font-xlarge {
          font-size: 125% !important;
        }
        .theme-font-xlarge input, .theme-font-xlarge select, .theme-font-xlarge button, .theme-font-xlarge table {
          font-size: 16px !important;
        }
        .theme-font-xlarge p, .theme-font-xlarge span, .theme-font-xlarge label, .theme-font-xlarge td, .theme-font-xlarge li {
          font-size: 15.5px !important;
        }

        /* --- GLOVES MODE FOR WORKERS WITH INDUSTRIAL GLOVES --- */
        .gloves-mode-active button, 
        .gloves-mode-active input, 
        .gloves-mode-active select, 
        .gloves-mode-active [role="button"] {
          min-height: 52px !important;
          padding-top: 0.75rem !important;
          padding-bottom: 0.75rem !important;
          padding-left: 1.25rem !important;
          padding-right: 1.25rem !important;
          border-radius: 12px !important;
        }
        .gloves-mode-active .grid {
          gap: 1.5rem !important;
        }

        /* --- DALTONISMO THEME MAP (Protanopia / Deuteranopia high contrast friendly) --- */
        .theme-colorblind .text-\\[\\#00E676\\] { color: #00B0FF !important; }
        .theme-colorblind .bg-\\[\\#00E676\\] { background-color: #00B0FF !important; }
        .theme-colorblind .border-\\[\\#00E676\\] { border-color: #00B0FF !important; }
        .theme-colorblind .text-emerald-400 { color: #00B0FF !important; }
        .theme-colorblind .bg-emerald-950\\/40 { background-color: rgba(0, 176, 255, 0.16) !important; border-color: rgba(0, 176, 255, 0.45) !important; text-decoration: underline; }
        .theme-colorblind .border-emerald-800\\/40 { border-color: rgba(0, 176, 255, 0.5) !important; }
        .theme-colorblind .bg-emerald-950\\/30 { background-color: rgba(0, 176, 255, 0.16) !important; }
        .theme-colorblind .text-[#00E676] { color: #00B0FF !important; }
        .theme-colorblind .bg-[#00E676] { background-color: #00B0FF !important; }
        .theme-colorblind [className*="bg-emerald-950"] { background-color: rgba(0, 176, 255, 0.16) !important; color: #00B0FF !important; }
        
        /* Red components translated to high visibility bright orange */
        .theme-colorblind .text-red-500 { color: #FF9100 !important; }
        .theme-colorblind .bg-red-950\\/30 { background-color: rgba(255, 145, 0, 0.18) !important; border-color: rgba(255, 145, 0, 0.45) !important; }
        .theme-colorblind .border-red-500\\/30 { border-color: rgba(255, 145, 0, 0.4) !important; }
        .theme-colorblind .text-red-400 { color: #FF9100 !important; }
        
        /* --- TEMA CLARO / LABORATÓRIO BRANCO OVERRIDES --- */
        .theme-light {
          background-color: #F8FAFC !important;
          color: #0F172A !important;
        }
        .theme-light .bg-\\[\\#0A0A0C\\] { background-color: #F8FAFC !important; }
        .theme-light .bg-\\[\\#0F0F12\\] { background-color: #FFFFFF !important; border-color: #E2E8F0 !important; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03) !important; }
        .theme-light .bg-\\[\\#15151A\\] { background-color: #F1F5F9 !important; color: #1E293B !important; border-color: #E2E8F0 !important; }
        .theme-light .bg-\\[\\#121216\\] { background-color: #F1F5F9 !important; border-color: #CBD5E1 !important; }
        .theme-light .bg-\\[\\#1E1E24\\] { background-color: #E2E8F0 !important; border-color: #CBD5E1 !important; }
        .theme-light .bg-black { background-color: #EDF2F7 !important; color: #1E293B !important; }
        .theme-light .border-\\[\\#1E1E24\\] { border-color: #E2E8F0 !important; }
        .theme-light .border-\\[\\#1E1E24\\]\\/40 { border-color: #CBD5E1 !important; }
        .theme-light .border-\\[\\#1E1E24\\]\\/60 { border-color: #CBD5E1 !important; }
        .theme-light .border-\\[\\#1E1E24\\]\\/80 { border-color: #94A3B8 !important; }
        .theme-light header { background-color: #FFFFFF !important; border-color: #E2E8F0 !important; }
        .theme-light .text-\\[\\#E0E0E0\\] { color: #1E293B !important; }
        .theme-light .text-slate-300 { color: #334155 !important; }
        .theme-light .text-slate-100 { color: #0F172A !important; }
        .theme-light .text-slate-200 { color: #1E293B !important; }
        .theme-light .text-slate-350 { color: #475569 !important; }
        .theme-light .text-slate-400 { color: #475569 !important; }
        .theme-light .text-slate-500 { color: #64748B !important; }
        .theme-light .text-\\[\\#888888\\] { color: #475569 !important; }
        .theme-light .text-\\[\\#666666\\] { color: #64748B !important; }
        .theme-light .text-white { color: #0F172A !important; }
        .theme-light .bg-slate-900 { background-color: #F1F5F9 !important; color: #0F172A !important; }
        .theme-light .bg-slate-950 { background-color: #FFFFFF !important; color: #0F172A !important; border-color: #E2E8F0 !important; }
        .theme-light input, .theme-light select, .theme-light textarea { background-color: #FFFFFF !important; color: #0F172A !important; border-color: #CBD5E1 !important; }
        .theme-light input::placeholder { color: #94A3B8 !important; }
        .theme-light table { background-color: #FFFFFF !important; color: #334155 !important; }
        .theme-light th { background-color: #F8FAFC !important; color: #475569 !important; border-color: #E2E8F0 !important; }
        .theme-light td { border-color: #E2E8F0 !important; }
        .theme-light tr:hover { background-color: #F1F5F9 !important; }
        .theme-light .bg-emerald-950\\/40 { background-color: #E6FFFA !important; color: #14532D !important; border-color: #86EFAC !important; }
        .theme-light .bg-amber-950\\/40 { background-color: #FEF3C7 !important; color: #78350F !important; border-color: #FCD34D !important; }
        .theme-light .bg-red-950\\/30 { background-color: #FEE2E2 !important; color: #7F1D1D !important; border-color: #FCA5A5 !important; }
        .theme-light .bg-red-950\\/40 { background-color: #FEE2E2 !important; color: #7F1D1D !important; border-color: #FCA5A5 !important; }
        .theme-light .bg-blue-950\\/30 { background-color: #EFF6FF !important; color: #1E3A8A !important; border-color: #93C5FD !important; }
        .theme-light .bg-blue-950\\/40 { background-color: #EFF6FF !important; color: #1E3A8A !important; border-color: #93C5FD !important; }
        .theme-light .text-\\[\\#00E676\\] { color: #15803D !important; }
        .theme-light .text-\\[\\#FF9100\\] { color: #B45309 !important; }
        .theme-light .border-\\[\\#00E676\\]\\/30 { border-color: #86EFAC !important; }
        .theme-light .text-[#00E676] { color: #15803D !important; }
        .theme-light .text-emerald-400 { color: #15803D !important; }
        .theme-light .text-emerald-450 { color: #15803D !important; }
        .theme-light .text-emerald-405 { color: #15803D !important; }
        .theme-light .text-red-400 { color: #B91C1C !important; }
        .theme-light .text-red-405 { color: #B91C1C !important; }
        
        /* --- CORES INVERTIDAS OVERRIDES --- */
        .theme-inverted {
          filter: invert(1) hue-rotate(180deg);
          background-color: #F5F5F7 !important;
        }
      `}</style>
      
      {/* GLOW TOP LINE */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-[#0091FF] to-transparent shrink-0" />

      {/* TOP NAVIGATION BAR */}
      <header className="border-b border-[#1E1E24] bg-[#0F0F12] shrink-0 relative z-30 transition-all">
        {/* Environment Selector and Quick Status Row - Shared top panel for supreme clarity */}
        <div className="bg-[#09090C] border-b border-[#1E1E24]/60 px-6 py-2 flex flex-col md:flex-row md:items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[9px] tracking-widest text-[#0091FF] font-black uppercase">AMBIENTE:</span>
            <div className="flex items-center gap-1 bg-black/40 border border-[#1E1E24] p-0.5 rounded-lg">
              <button 
                onClick={() => {
                  setUserEnvironment('computer');
                  setActiveTab('dashboard');
                }}
                className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer ${userEnvironment === 'computer' ? 'bg-[#0091FF] text-white shadow' : 'text-slate-400 hover:text-white'}`}
                aria-label="Alternar para Modo Computador (Gestão de Escritório)"
              >
                <Monitor className="w-3 h-3" />
                <span>💻 COMPUTADOR (GESTOR)</span>
              </button>
              <button 
                onClick={() => {
                  setUserEnvironment('tablet');
                  setTabletSubView('search');
                  setTabletSearchQuery('');
                  setTabletSelectedPartId(null);
                }}
                className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer ${userEnvironment === 'tablet' ? 'bg-orange-500 text-black shadow font-extrabold' : 'text-slate-400 hover:text-white'}`}
                aria-label="Alternar para Modo Tablet (Auxiliar de Máquina Chão de Fábrica)"
              >
                <Tablet className="w-3 h-3" />
                <span>📱 TABLET (OPERADOR)</span>
              </button>
            </div>
          </div>

          {/* ACCESSIBILITY & INDUSTRIAL SETTINGS */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* TAMANHO DA FONTE */}
            <div className="flex items-center gap-1 bg-[#15151A] border border-[#1E1E24] p-0.5 rounded-lg" title="Ajuste de Acessibilidade: Tamanho das Fontes">
              <span className="text-[8px] font-mono font-bold text-slate-500 px-1 uppercase">Fonte:</span>
              <button 
                onClick={() => setFontSizeMode('normal')}
                className={`px-2 py-0.5 text-[9.5px] font-mono rounded font-bold transition-all cursor-pointer ${fontSizeMode === 'normal' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                A
              </button>
              <button 
                onClick={() => setFontSizeMode('large')}
                className={`px-2 py-0.5 text-[9.5px] font-mono rounded font-bold transition-all cursor-pointer ${fontSizeMode === 'large' ? 'bg-[#0091FF] text-white font-extrabold' : 'text-slate-400 hover:text-white'}`}
                title="Fonte Aumentada (WCAG AA)"
              >
                A+
              </button>
              <button 
                onClick={() => setFontSizeMode('xlarge')}
                className={`px-2 py-0.5 text-[9.5px] font-mono rounded font-bold transition-all cursor-pointer ${fontSizeMode === 'xlarge' ? 'bg-orange-500 text-black font-extrabold' : 'text-slate-400 hover:text-white'}`}
                title="Fonte Extra Grande (Ideal para visibilidade industrial)"
              >
                A++
              </button>
            </div>

            {/* MODO LUVAS */}
            <button 
              onClick={() => setGlovesMode(!glovesMode)}
              className={`px-2.5 py-1 text-[9.5px] font-mono rounded-lg font-bold transition-all uppercase cursor-pointer border flex items-center gap-1 ${glovesMode ? 'bg-orange-500 text-black border-orange-500 font-extrabold animate-pulse' : 'bg-[#15151A] text-slate-400 border-[#1E1E24] hover:text-white'}`}
              title="Acessibilidade Industrial: Expande áreas de toque para uso com luvas de proteção de fábrica"
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span>Modo Luvas: {glovesMode ? 'ATIVADO' : 'DESATIVADO'}</span>
            </button>

            {/* STATUS BADGE */}
            <div className="hidden lg:flex items-center gap-1.5 text-[10px] font-mono border-l border-[#1E1E24] pl-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse"></span>
              <span className="text-[#00E676] font-bold">NODE OK</span>
            </div>
          </div>
        </div>

        {/* --- 💻 COMPUTADOR (GESTOR) HEADER BAR --- */}
        {userEnvironment === 'computer' ? (
          <div className="h-16 flex items-center justify-between px-6">
            <div className="flex items-center gap-8">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#0091FF]/10 border border-[#0091FF] flex items-center justify-center rounded rotate-45">
                  <Cpu className="w-5 h-5 text-[#0091FF] -rotate-45" />
                </div>
                <div>
                  <span className="font-mono text-[9px] tracking-widest text-[#0091FF] font-black uppercase block">ZEISS CYBER COUPLING</span>
                  <span className="font-bold tracking-tighter text-lg text-white">QUALITY<span className="text-[#0091FF]">SYNC</span> 5.0</span>
                </div>
              </div>

              {/* Computer Navigation Links */}
              <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-[#888888]" role="navigation" aria-label="Menu Principal do Gestor">
                <button 
                  onClick={() => setActiveTab('dashboard')} 
                  className={`hover:text-white transition-colors py-5 border-b-2 ${activeTab === 'dashboard' ? 'text-[#0091FF] border-[#0091FF]' : 'border-transparent'}`}
                >
                  Placar Geral
                </button>
                <button 
                  onClick={() => setActiveTab('inspection')} 
                  className={`hover:text-white transition-colors py-5 border-b-2 ${activeTab === 'inspection' ? 'text-[#0091FF] border-[#0091FF]' : 'border-transparent'}`}
                >
                  Medição Tridimensional
                </button>
                <button 
                  onClick={() => setActiveTab('traceability')} 
                  className={`hover:text-white transition-colors py-5 border-b-2 ${activeTab === 'traceability' ? 'text-[#0091FF] border-[#0091FF]' : 'border-transparent'}`}
                >
                  Rastreabilidade de Peças
                </button>
                <button 
                  onClick={() => setActiveTab('factory')} 
                  className={`hover:text-white transition-colors py-5 border-b-2 ${activeTab === 'factory' ? 'text-[#0091FF] border-[#0091FF]' : 'border-transparent'}`}
                >
                  Qualidade Semestral & ISO
                </button>
                <button 
                  onClick={() => setActiveTab('ia-chat')} 
                  className={`hover:text-white transition-colors py-5 border-b-2 ${activeTab === 'ia-chat' ? 'text-[#0091FF] border-[#0091FF]' : 'border-transparent'}`}
                >
                  Co-Piloto IA
                </button>
                <button 
                  onClick={() => setActiveTab('saas-billing')} 
                  className={`hover:text-white transition-colors py-5 border-b-2 ${activeTab === 'saas-billing' ? 'text-[#0091FF] border-[#0091FF]' : 'border-transparent'}`}
                >
                  Assinatura SaaS
                </button>
                <button 
                  onClick={() => setActiveTab('integrations')} 
                  className={`hover:text-white transition-colors py-5 border-b-2 ${activeTab === 'integrations' ? 'text-[#0091FF] border-[#0091FF]' : 'border-transparent'}`}
                >
                  Conectores SQL/IoT
                </button>
                <button 
                  onClick={() => setActiveTab('procedures')} 
                  className={`hover:text-white transition-colors py-5 border-b-2 ${activeTab === 'procedures' ? 'text-[#0091FF] border-[#0091FF]' : 'border-transparent'}`}
                >
                  Procedimentos & POPs
                </button>
                <button 
                  onClick={() => setActiveTab('my-machine')} 
                  className={`hover:text-white transition-colors py-5 border-b-2 ${activeTab === 'my-machine' ? 'text-[#0091FF] border-[#0091FF]' : 'border-transparent'}`}
                >
                  Minha Máquina (CNC-03)
                </button>
                <button 
                  onClick={() => setActiveTab('emergency')} 
                  className={`hover:text-red-400 transition-colors py-5 border-b-2 flex items-center gap-1.5 font-bold ${activeTab === 'emergency' ? 'text-red-500 border-red-500' : 'border-transparent text-red-400/85 animate-pulse'}`}
                >
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  SOS Emergência
                </button>
              </nav>
            </div>

            {/* Right Header Side (Computer Theme switch, Profile, global search) */}
            <div className="flex items-center gap-4">
              {/* SMART SEARCH FOR MANAGER (TOP BAR) */}
              <div className="relative max-w-[180px] sm:max-w-xs xl:max-w-md w-full hidden md:block">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-3.5 h-3.5 text-slate-500" />
                </span>
                <input 
                  type="text"
                  value={computerGlobalSearchQuery}
                  onChange={(e) => {
                    setComputerGlobalSearchQuery(e.target.value);
                    setTraceSearch(e.target.value);
                    setActiveTab('traceability');
                  }}
                  placeholder="Pesquisar em todo o sistema..."
                  className="w-full bg-[#15151A] text-slate-200 border border-[#1E1E24] rounded-lg pl-9 pr-8 py-1.5 text-xs focus:outline-none focus:border-[#0091FF] placeholder-slate-500 font-mono"
                />
                {computerGlobalSearchQuery && (
                  <button 
                    onClick={() => {
                      setComputerGlobalSearchQuery('');
                      setTraceSearch('');
                    }}
                    className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Botão Pânico */}
              <button
                onClick={() => setActiveTab('emergency')}
                className="animate-pulse px-3 py-1.5 bg-gradient-to-r from-red-600 via-red-500 to-orange-500 border border-red-500 rounded-lg text-white text-[11px] font-extrabold uppercase flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(239,68,68,0.3)] hover:scale-102 transition-all"
                title="Acesso de Emergência SOS"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-white" />
                <span className="hidden sm:inline">🚨 SOS</span>
              </button>

              {/* ACCESSIBILITY THEME SWITCHER */}
              <div className="flex items-center gap-1 bg-[#15151A] border border-[#1E1E24] p-1 rounded-lg">
                <button
                  onClick={() => setColorTheme('default')}
                  className={`px-2 py-0.5 text-[8.5px] font-mono rounded font-bold uppercase cursor-pointer ${colorTheme === 'default' ? 'bg-[#0091FF] text-white' : 'text-slate-400'}`}
                >
                  Padrão
                </button>
                <button
                  onClick={() => setColorTheme('light')}
                  className={`px-2 py-0.5 text-[8.5px] font-mono rounded font-bold uppercase cursor-pointer ${colorTheme === 'light' ? 'bg-white text-black' : 'text-slate-400'}`}
                >
                  Claro
                </button>
                <button
                  onClick={() => setColorTheme('colorblind')}
                  className={`px-2 py-0.5 text-[8.5px] font-mono rounded font-bold uppercase cursor-pointer ${colorTheme === 'colorblind' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
                >
                  Daltonismo
                </button>
                <button
                  onClick={() => setColorTheme('inverted')}
                  className={`px-2 py-0.5 text-[8.5px] font-mono rounded font-bold uppercase cursor-pointer ${colorTheme === 'inverted' ? 'bg-amber-500 text-black' : 'text-slate-400'}`}
                >
                  Inverter
                </button>
              </div>

              {/* Profile dropdown */}
              <div className="flex items-center gap-2.5">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-white mb-0.5">{profile.operatorName}</p>
                  <p className="text-[9px] font-mono uppercase text-[#0091FF] font-semibold">{profile.role}</p>
                </div>
                <button 
                  onClick={() => {
                    setProfile(null);
                    setActiveTab('dashboard');
                  }}
                  className="p-1.5 border border-[#1E1E24] bg-[#15151A] hover:bg-[#1E1E24] rounded-lg text-slate-400 hover:text-white cursor-pointer"
                  title="Encerrar Sessão"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* --- 📱 TABLET (OPERADOR) HEADER BAR --- */
          <div className="h-16 flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              {/* Menu lateral trigger button (☰) */}
              <button 
                onClick={() => setIsTabletSidebarOpen(true)}
                className="p-2.5 rounded-lg bg-[#15151A] border border-[#1E1E24] text-slate-200 hover:text-white hover:bg-slate-800 transition-all cursor-pointer flex items-center justify-center gap-1"
                aria-label="Abrir Menu de Navegação Simplificado"
              >
                <Menu className="w-5 h-5 text-[#0091FF]" />
                <span className="text-xs uppercase font-extrabold tracking-wider hidden sm:inline">MENU ☰</span>
              </button>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-500/10 border border-orange-500/50 flex items-center justify-center rounded">
                  <Cpu className="w-4.5 h-4.5 text-orange-500" />
                </div>
                <div>
                  <span className="font-mono text-[8px] tracking-widest text-[#FF9100] font-black uppercase block">BME ASSISTENTE</span>
                  <span className="font-bold tracking-tighter text-sm text-white">TABLET<span className="text-orange-500"> OPERADOR</span></span>
                </div>
              </div>
            </div>

            {/* Active view label inside Tablet mode to guide operators */}
            <div className="hidden md:flex items-center gap-2 text-xs font-mono bg-[#15151A] border border-[#1E1E24] px-4 py-1.5 rounded-full uppercase text-[#FF9100] font-bold">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
              <span>TERMINAL LADO-MÁQUINA: {tabletSubView.toUpperCase()}</span>
            </div>

            {/* Right side accessibility items */}
            <div className="flex items-center gap-3">
              {/* ACCESSIBILITY SELECTOR FOR TABLET */}
              <div className="flex items-center gap-1 bg-[#15151A] border border-[#1E1E24] p-1 rounded-lg">
                <button
                  onClick={() => setColorTheme('default')}
                  className={`px-2 py-1 text-[9px] font-mono rounded font-bold transition-all ${colorTheme === 'default' ? 'bg-[#0091FF] text-white' : 'text-slate-400'}`}
                >
                  Escuro
                </button>
                <button
                  onClick={() => setColorTheme('light')}
                  className={`px-2 py-1 text-[9px] font-mono rounded font-bold transition-all ${colorTheme === 'light' ? 'bg-white text-black' : 'text-slate-400'}`}
                >
                  Claro
                </button>
                <button
                  onClick={() => setColorTheme('inverted')}
                  className={`px-2 py-1 text-[9px] font-mono rounded font-bold transition-all ${colorTheme === 'inverted' ? 'bg-amber-500 text-black font-black' : 'text-slate-400'}`}
                  title="Inversão de Cores"
                >
                  Inverter
                </button>
              </div>

              {/* Botão SOS de Emergência fácil e chamativo */}
              <button 
                onClick={() => {
                  setTabletSubView('help');
                }}
                className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold text-[11px] rounded-lg transition-all cursor-pointer uppercase tracking-wider flex items-center gap-1 shadow-md border border-red-500"
                title="Ajuda e Botão Emergência"
              >
                <AlertTriangle className="w-4 h-4 animate-bounce text-white" />
                <span>EMERGÊNCIA</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* VIEWPORT BODY */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 relative">
        {userEnvironment === 'tablet' ? (
          <div className="space-y-6">
            {/* Tablet View Options Sidebar Overlay (slides in from left) */}
            {isTabletSidebarOpen && (
              <div className="fixed inset-0 bg-black/90 z-50 flex animate-fade-in">
                {/* Drawer Container */}
                <div className="w-full max-w-sm bg-[#0F0F12] border-r border-[#1E1E24] h-full flex flex-col justify-between p-6">
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between pb-6 border-b border-[#1E1E24]">
                      <div className="flex items-center gap-2">
                        <Cpu className="w-5 h-5 text-orange-500" />
                        <span className="font-bold text-white text-base tracking-tight">MENU TABLET</span>
                      </div>
                      <button 
                        onClick={() => setIsTabletSidebarOpen(false)}
                        className="p-2.5 rounded-lg bg-[#15151A] border border-[#1E1E24] hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
                        aria-label="Fechar Menu"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Navigation list with gloves mode size support */}
                    <nav className="mt-8 space-y-3" role="navigation" aria-label="Menu Lateral do Tablet">
                      <button 
                        onClick={() => {
                          setTabletSubView('search');
                          setTabletSelectedPartId(null);
                          setIsTabletSidebarOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-bold uppercase transition-all cursor-pointer ${tabletSubView === 'search' ? 'bg-orange-500 text-black border-orange-500' : 'bg-[#15151A] text-slate-300 border-[#1E1E24] hover:bg-[#1E1E24]'}`}
                      >
                        <div className="flex items-center gap-3">
                          <Search className="w-5 h-5" />
                          <span>Pesquisa Inteligente</span>
                        </div>
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      <button 
                        onClick={() => {
                          setTabletSubView('traceability');
                          setIsTabletSidebarOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-bold uppercase transition-all cursor-pointer ${tabletSubView === 'traceability' ? 'bg-orange-500 text-black border-orange-500' : 'bg-[#15151A] text-slate-300 border-[#1E1E24] hover:bg-[#1E1E24]'}`}
                      >
                        <div className="flex items-center gap-3">
                          <FileSpreadsheet className="w-5 h-5" />
                          <span>Rastreabilidade</span>
                        </div>
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      <button 
                        onClick={() => {
                          setTabletSubView('machines');
                          setIsTabletSidebarOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-bold uppercase transition-all cursor-pointer ${tabletSubView === 'machines' ? 'bg-orange-500 text-black border-orange-500' : 'bg-[#15151A] text-slate-300 border-[#1E1E24] hover:bg-[#1E1E24]'}`}
                      >
                        <div className="flex items-center gap-3">
                          <Cpu className="w-5 h-5" />
                          <span>Status das Máquinas</span>
                        </div>
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      <button 
                        onClick={() => {
                          setTabletSubView('production');
                          setIsTabletSidebarOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-bold uppercase transition-all cursor-pointer ${tabletSubView === 'production' ? 'bg-orange-500 text-black border-orange-500' : 'bg-[#15151A] text-slate-300 border-[#1E1E24] hover:bg-[#1E1E24]'}`}
                      >
                        <div className="flex items-center gap-3">
                          <FilePlus className="w-5 h-5" />
                          <span>Registrar Produção</span>
                        </div>
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      <button 
                        onClick={() => {
                          setTabletSubView('quality');
                          setIsTabletSidebarOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-bold uppercase transition-all cursor-pointer ${tabletSubView === 'quality' ? 'bg-orange-500 text-black border-orange-500' : 'bg-[#15151A] text-slate-300 border-[#1E1E24] hover:bg-[#1E1E24]'}`}
                      >
                        <div className="flex items-center gap-3">
                          <Gauge className="w-5 h-5" />
                          <span>Qualidade & OEE</span>
                        </div>
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      <button 
                        onClick={() => {
                          setTabletSubView('assistant');
                          setIsTabletSidebarOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-bold uppercase transition-all cursor-pointer ${tabletSubView === 'assistant' ? 'bg-orange-500 text-black border-orange-500' : 'bg-[#15151A] text-slate-300 border-[#1E1E24] hover:bg-[#1E1E24]'}`}
                      >
                        <div className="flex items-center gap-3">
                          <Sparkles className="w-5 h-5" />
                          <span>Co-Piloto IA</span>
                        </div>
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      <button 
                        onClick={() => {
                          setTabletSubView('procedures');
                          setIsTabletSidebarOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-bold uppercase transition-all cursor-pointer ${tabletSubView === 'procedures' ? 'bg-orange-500 text-black border-orange-500 font-extrabold' : 'bg-[#15151A] text-slate-300 border-[#1E1E24] hover:bg-[#1E1E24]'}`}
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5" />
                          <span>Procedimentos & POPs</span>
                        </div>
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      <button 
                        onClick={() => {
                          setTabletSubView('my-machine');
                          setIsTabletSidebarOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-bold uppercase transition-all cursor-pointer ${tabletSubView === 'my-machine' ? 'bg-orange-500 text-black border-orange-500 font-extrabold' : 'bg-[#15151A] text-slate-300 border-[#1E1E24] hover:bg-[#1E1E24]'}`}
                      >
                        <div className="flex items-center gap-3">
                          <Activity className="w-5 h-5" />
                          <span>Minha Máquina (CNC-03)</span>
                        </div>
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      <button 
                        onClick={() => {
                          setTabletSubView('settings');
                          setIsTabletSidebarOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-bold uppercase transition-all cursor-pointer ${tabletSubView === 'settings' ? 'bg-orange-500 text-black border-orange-500' : 'bg-[#15151A] text-slate-300 border-[#1E1E24] hover:bg-[#1E1E24]'}`}
                      >
                        <div className="flex items-center gap-3">
                          <Settings2 className="w-5 h-5" />
                          <span>Acessibilidade</span>
                        </div>
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      <button 
                        onClick={() => {
                          setTabletSubView('help');
                          setIsTabletSidebarOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-bold uppercase transition-all cursor-pointer ${tabletSubView === 'help' ? 'bg-red-600 text-white border-red-500 font-extrabold' : 'bg-[#15151A] text-slate-300 border-[#1E1E24] hover:bg-[#1E1E24]'}`}
                      >
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="w-5 h-5" />
                          <span>Guia & SOS Emergência</span>
                        </div>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </nav>
                  </div>

                  {/* Footer inside Drawer */}
                  <div className="border-t border-[#1E1E24] pt-4 text-xs font-mono text-[#666666] text-center">
                    <div>QualitySync Tablet v5.0</div>
                    <div>Operador: {profile.operatorName}</div>
                  </div>
                </div>

                {/* Dismiss Overlay area */}
                <div className="flex-1 cursor-pointer" onClick={() => setIsTabletSidebarOpen(false)} />
              </div>
            )}

            {/* QUICK FLOOR STATUS PANEL (Required: Máquinas online, Produção total, Qualidade %, Alarmes ativos) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#0F0F12] border border-[#1E1E24] p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Máquinas Online</div>
                  <div className="text-2xl font-bold text-white mt-1">4 / 5 Ativas</div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[10px] font-mono text-emerald-400">Calibração OK</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Cpu className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-[#0F0F12] border border-[#1E1E24] p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Peças Medidas Hoje</div>
                  <div className="text-2xl font-bold text-white mt-1">{inspections.length} Unidades</div>
                  <div className="text-[10px] font-mono text-slate-500 mt-1">Frequência estável</div>
                </div>
                <div className="p-3 rounded-xl bg-[#0091FF]/10 text-[#0091FF]">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-[#0F0F12] border border-[#1E1E24] p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Qualidade Geral</div>
                  <div className="text-2xl font-bold text-white mt-1">{complianceRate}%</div>
                  <span className="text-[9px] font-mono bg-emerald-950/40 text-emerald-400 border border-emerald-900/40 px-1 rounded">Classe A</span>
                </div>
                <div className="p-3 rounded-xl bg-orange-500/10 text-orange-500">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              </div>

              <div className="col-span-2 lg:col-span-1 bg-[#0F0F12] border border-[#1E1E24] p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Alarmes de Fábrica</div>
                  <div className="text-2xl font-bold text-emerald-400 mt-1">0 Ativos</div>
                  <div className="text-[10px] font-mono text-emerald-400 mt-1">Nenhum evento crítico</div>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <CheckCircle className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* --- TABLET SUB-VIEW 1: SEARCH (THE SMART SEARCH BAR) --- */}
            {tabletSubView === 'search' && (
              <div className="space-y-6">
                {/* Search Bar Block */}
                <div className="bg-gradient-to-b from-[#0F0F12] to-black border border-[#1E1E24] p-8 rounded-3xl text-center space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-[#0091FF] to-orange-500"></div>
                  
                  <div className="max-w-2xl mx-auto space-y-3">
                    <h2 className="text-xl sm:text-2xl font-extralight text-white tracking-tight">Qual item ou máquina você precisa analisar?</h2>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">O operador não precisa decorar menus complexos. Digite a peça, lote, código ou operador para rastrear as tolerâncias ZEISS.</p>
                  </div>

                  <div className="max-w-xl mx-auto relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <Search className="w-5 h-5 text-orange-500" />
                    </span>
                    <input 
                      type="text"
                      value={tabletSearchQuery}
                      onChange={(e) => {
                        setTabletSearchQuery(e.target.value);
                        setTabletSelectedPartId(null);
                      }}
                      placeholder="Pesquisar peça, lote, CNC, operador..."
                      className="w-full bg-[#15151A] text-white border-2 border-slate-800 rounded-2xl pl-12 pr-10 py-3.5 text-base focus:outline-none focus:border-orange-500 placeholder-slate-500 font-mono"
                    />
                    {tabletSearchQuery && (
                      <button 
                        onClick={() => {
                          setTabletSearchQuery('');
                          setTabletSelectedPartId(null);
                        }}
                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-white"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  {/* Suggestion Chips */}
                  <div className="flex flex-wrap items-center justify-center gap-2 max-w-xl mx-auto pt-2">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Sugestões rápidas:</span>
                    <button 
                      onClick={() => {
                        setTabletSearchQuery("Bloco Motor V8");
                        setTabletSelectedPartId(null);
                      }}
                      className="px-3 py-1.5 bg-[#15151A] hover:bg-slate-800 text-xs text-slate-300 rounded-full border border-[#1E1E24] cursor-pointer"
                    >
                      "Bloco Motor V8"
                    </button>
                    <button 
                      onClick={() => {
                        setTabletSearchQuery("Scania");
                        setTabletSelectedPartId(null);
                      }}
                      className="px-3 py-1.5 bg-[#15151A] hover:bg-slate-800 text-xs text-slate-300 rounded-full border border-[#1E1E24] cursor-pointer"
                    >
                      "Scania"
                    </button>
                    <button 
                      onClick={() => {
                        setTabletSearchQuery("CNC-01");
                        setTabletSelectedPartId(null);
                      }}
                      className="px-3 py-1.5 bg-[#15151A] hover:bg-slate-800 text-xs text-slate-300 rounded-full border border-[#1E1E24] cursor-pointer"
                    >
                      "CNC-01"
                    </button>
                    <button 
                      onClick={() => {
                        setTabletSearchQuery("Ontem");
                        setTabletSelectedPartId(null);
                      }}
                      className="px-3 py-1.5 bg-[#15151A] hover:bg-slate-800 text-xs text-slate-300 rounded-full border border-[#1E1E24] cursor-pointer"
                    >
                      "Produção Ontem"
                    </button>
                  </div>
                </div>

                {/* Real-time search outcomes */}
                {tabletSearchQuery && (
                  <div className="space-y-4">
                    <h3 className="text-xs uppercase font-mono tracking-wider text-slate-400 flex items-center gap-2">
                      <Search className="w-3.5 h-3.5 text-[#FF9100]" />
                      <span>Resultados da busca ({getFilteredInspections(tabletSearchQuery).length})</span>
                    </h3>

                    {getFilteredInspections(tabletSearchQuery).length === 0 ? (
                      <div className="p-8 text-center bg-[#0F0F12] border border-[#1E1E24] rounded-2xl text-slate-500 text-sm">
                        Nenhum item correspondente à busca "{tabletSearchQuery}" foi localizado nos buffers locais ou no SQL Server.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {getFilteredInspections(tabletSearchQuery).map((part) => {
                          const isSelected = tabletSelectedPartId === part.id;
                          return (
                            <div 
                              key={part.id}
                              className={`p-5 rounded-2xl border transition-all relative overflow-hidden bg-[#0F0F12] ${isSelected ? 'border-orange-500 ring-1 ring-orange-500/25' : 'border-[#1E1E24] hover:border-slate-700'}`}
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <span className="text-[9px] font-mono text-orange-500 tracking-wider block uppercase mb-1">CÓDIGO DE PEÇA SERIAL</span>
                                  <h4 className="text-lg font-bold text-white tracking-tight">{part.id}</h4>
                                  <p className="text-xs font-semibold text-slate-300 mt-1">{part.partName || "Mancal Desconhecido"}</p>
                                </div>

                                <div className="text-right">
                                  {/* High Contrast approvals */}
                                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 border uppercase ${
                                    part.status === 'approved' ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40' :
                                    part.status === 'rework' ? 'bg-amber-950/40 text-amber-400 border-amber-800/40' :
                                    'bg-red-950/40 text-red-400 border-red-800/40'
                                  }`}>
                                    {part.status === 'approved' ? <CheckCircle className="w-3 h-3 text-emerald-400" /> :
                                     part.status === 'rework' ? <AlertTriangle className="w-3 h-3 text-amber-400" /> :
                                     <XCircle className="w-3 h-3 text-red-400" />}
                                    <span>
                                      {part.status === 'approved' ? 'PEÇA DENTRO DA QUALIDADE' :
                                       part.status === 'rework' ? 'RETRABALHO OPERACIONAL' :
                                       'PEÇA REJEITADA / SCRAP'}
                                    </span>
                                  </span>
                                  <p className="text-[10px] font-mono text-slate-500 mt-2">Lote: {part.batch}</p>
                                </div>
                              </div>

                              <div className="grid grid-cols-3 gap-3 bg-[#15151A] p-3 rounded-xl mt-4 text-xs font-sans">
                                <div>
                                  <span className="text-[9px] text-slate-500 uppercase block">Dispositivo</span>
                                  <span className="font-semibold text-white">{part.machineId}</span>
                                </div>
                                <div>
                                  <span className="text-[9px] text-slate-500 uppercase block">Metrologista</span>
                                  <span className="font-semibold text-white">{part.operator || "Carlos"}</span>
                                </div>
                                <div>
                                  <span className="text-[9px] text-slate-500 uppercase block">Registrado</span>
                                  <span className="font-semibold text-white">{new Date(part.timestamp).toLocaleDateString()}</span>
                                </div>
                              </div>

                              {/* Action Buttons to show details */}
                              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#1E1E24]/60">
                                <button 
                                  onClick={() => {
                                    setTabletSelectedPartId(isSelected ? null : part.id);
                                    setTabletShowTrace(true);
                                    setTabletShowHistory(false);
                                    setTabletShowDetails(false);
                                  }}
                                  className={`flex-1 py-2 rounded-lg text-[11px] font-bold uppercase transition-all flex items-center justify-center gap-1 cursor-pointer border ${isSelected && tabletShowTrace ? 'bg-orange-500 text-black border-orange-500 font-extrabold' : 'bg-slate-900 text-slate-300 border-[#1E1E24]'}`}
                                >
                                  <Layers className="w-3.5 h-3.5" />
                                  <span>Rastreabilidade</span>
                                </button>
                                <button 
                                  onClick={() => {
                                    setTabletSelectedPartId(isSelected ? null : part.id);
                                    setTabletShowHistory(true);
                                    setTabletShowTrace(false);
                                    setTabletShowDetails(false);
                                  }}
                                  className={`flex-1 py-2 rounded-lg text-[11px] font-bold uppercase transition-all flex items-center justify-center gap-1 cursor-pointer border ${isSelected && tabletShowHistory ? 'bg-orange-500 text-black border-orange-500 font-extrabold' : 'bg-slate-900 text-slate-300 border-[#1E1E24]'}`}
                                >
                                  <History className="w-3.5 h-3.5" />
                                  <span>Histórico</span>
                                </button>
                                <button 
                                  onClick={() => {
                                    setTabletSelectedPartId(isSelected ? null : part.id);
                                    setTabletShowDetails(true);
                                    setTabletShowTrace(false);
                                    setTabletShowHistory(false);
                                  }}
                                  className={`flex-1 py-2 rounded-lg text-[11px] font-bold uppercase transition-all flex items-center justify-center gap-1 cursor-pointer border ${isSelected && tabletShowDetails ? 'bg-orange-500 text-black border-orange-500 font-extrabold' : 'bg-slate-900 text-slate-300 border-[#1E1E24]'}`}
                                >
                                  <Sliders className="w-3.5 h-3.5" />
                                  <span>Tolerâncias</span>
                                </button>
                              </div>

                              {/* Expanded panel display based on selection type */}
                              {isSelected && (
                                <div className="mt-4 p-4 rounded-xl bg-black/60 border border-[#1E1E24] animate-fade-in text-xs font-sans space-y-4">
                                  {tabletShowTrace && (
                                    <div>
                                      <h5 className="font-bold text-white uppercase tracking-tight text-[10px] mb-2 text-[#0091FF]">Roteiro Físico de Processamento (Routing)</h5>
                                      <div className="relative border-l border-slate-700 pl-4 ml-2 space-y-4">
                                        <div className="relative">
                                          <span className="absolute -left-[21px] top-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-black shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
                                          <div className="font-bold text-white">Passo 1: CNC-01 (Usinagem Básica)</div>
                                          <div className="text-[11px] text-slate-400 mt-0.5">Corte preliminar do tarugo de alumínio e faces planificadas.</div>
                                        </div>
                                        <div className="relative">
                                          <span className="absolute -left-[21px] top-0 w-2.5 h-2.5 rounded-full bg-[#0091FF] border border-black" />
                                          <div className="font-bold text-white">Passo 2: CNC-02 (Fresamento de Tolerância)</div>
                                          <div className="text-[11px] text-slate-400 mt-0.5">Furos de fuso helicoidais e furos guia retificados.</div>
                                        </div>
                                        <div className="relative">
                                          <span className="absolute -left-[21px] top-0 w-2.5 h-2.5 rounded-full bg-orange-500 border border-black animate-pulse" />
                                          <div className="font-bold text-white">Passo 3: ZEISS PRISMO (Medição Tridimensional)</div>
                                          <div className="text-[11px] text-slate-400 mt-0.5">Análise dimensional por apalpamento físico e micrômetro óptico.</div>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {tabletShowHistory && (
                                    <div>
                                      <h5 className="font-bold text-white uppercase tracking-tight text-[10px] mb-2 text-[#0091FF]">Notas do Inspetor & Histórico de Modificação</h5>
                                      <div className="space-y-2">
                                        <div className="p-2.5 bg-[#15151A] rounded-lg border border-[#1E1E24]/60">
                                          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                                            <span>Operador: Carlos Santos</span>
                                            <span>Há 2 horas</span>
                                          </div>
                                          <p className="text-slate-300 mt-1 text-[11px]">{part.notes || "O mancal cumpre integralmente os requisitos de encaixe do cabeçote com rugosidade ideal."}</p>
                                        </div>
                                        {part.partObservation && (
                                          <div className="p-2.5 bg-[#15151A] rounded-lg border border-[#1E1E24]/60">
                                            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                                              <span>Observação Adicional</span>
                                              <span>No ato de registro</span>
                                            </div>
                                            <p className="text-slate-300 mt-1 text-[11px]">{part.partObservation}</p>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}

                                  {tabletShowDetails && (
                                    <div>
                                      <h5 className="font-bold text-white uppercase tracking-tight text-[10px] mb-2 text-[#0091FF]">Valores Métricos Tridimensionais e Sensores</h5>
                                      <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                                        <div className="bg-[#15151A] p-2 rounded border border-[#1E1E24]/60">
                                          <span className="text-slate-500 uppercase text-[9px] block">Comprimento (X)</span>
                                          <strong className="text-white text-xs">{part.length || "120.00"} mm</strong>
                                          <span className="text-emerald-400 text-[9px] block">Desvio: +0.02</span>
                                        </div>
                                        <div className="bg-[#15151A] p-2 rounded border border-[#1E1E24]/60">
                                          <span className="text-slate-500 uppercase text-[9px] block">Largura (Y)</span>
                                          <strong className="text-white text-xs">{part.width || "45.05"} mm</strong>
                                          <span className="text-emerald-400 text-[9px] block">Desvio: -0.01</span>
                                        </div>
                                        <div className="bg-[#15151A] p-2 rounded border border-[#1E1E24]/60">
                                          <span className="text-slate-500 uppercase text-[9px] block">Altura (Z)</span>
                                          <strong className="text-white text-xs">{part.height || "30.01"} mm</strong>
                                          <span className="text-emerald-400 text-[9px] block">Desvio: 0.00</span>
                                        </div>
                                        <div className="bg-[#15151A] p-2 rounded border border-[#1E1E24]/60">
                                          <span className="text-slate-500 uppercase text-[9px] block">Temperatura</span>
                                          <strong className="text-white text-xs">{part.temperature || "22.4"} °C</strong>
                                          <span className="text-slate-500 text-[9px] block">Compensado: Sim</span>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* --- TABLET SUB-VIEW 2: TRACEABILITY GRID --- */}
            {tabletSubView === 'traceability' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Histórico Geral de Inspeções</h3>
                  <span className="text-xs font-mono text-slate-400 bg-[#15151A] border border-[#1E1E24] px-3 py-1 rounded-full">Total: {inspections.length} Peças</span>
                </div>

                <div className="space-y-3">
                  {inspections.map((part) => (
                    <div 
                      key={part.id}
                      className="p-4 bg-[#0F0F12] border border-[#1E1E24] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-800 border border-slate-700 flex items-center justify-center rounded-lg text-slate-300 font-mono text-xs">
                          {part.machineId}
                        </div>
                        <div>
                          <div className="text-xs font-mono text-slate-500">ID: {part.id}</div>
                          <div className="text-sm font-bold text-white">{part.partName || "Mancal Metálico"}</div>
                          <div className="text-xs text-slate-400 mt-0.5">Metrologista: {part.operator || "Carlos S."}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 justify-between sm:justify-end">
                        <div className="text-right">
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono border uppercase ${
                            part.status === 'approved' ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40' :
                            part.status === 'rework' ? 'bg-amber-950/40 text-amber-400 border-amber-800/40' :
                            'bg-red-950/40 text-red-400 border-red-800/40'
                          }`}>
                            {part.status === 'approved' ? 'ACEITO' :
                             part.status === 'rework' ? 'RETRABALHAR' : 'REJEITADO'}
                          </span>
                          <div className="text-[10px] text-slate-500 font-mono mt-1">{new Date(part.timestamp).toLocaleDateString()} {new Date(part.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                        </div>

                        <button 
                          onClick={() => {
                            setTabletSearchQuery(part.id);
                            setTabletSubView('search');
                            setTabletSelectedPartId(part.id);
                            setTabletShowTrace(true);
                          }}
                          className="px-3 py-1.5 bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded hover:bg-slate-800 cursor-pointer uppercase font-bold"
                        >
                          Ver Detalhes
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* --- TABLET SUB-VIEW 3: MACHINES STATUS --- */}
            {tabletSubView === 'machines' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Status das CNCs & Equipamentos</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {machines.map((machine) => {
                    const isRestricted = profile.planId === 'starter' && machine.id !== 'CNC-01' && machine.id !== 'ZEISS COMET';
                    return (
                      <div key={machine.id} className="bg-[#0F0F12] border border-[#1E1E24] p-5 rounded-2xl relative overflow-hidden">
                        {machine.status === 'active' && (
                          <div className="absolute top-0 right-0 w-1.5 h-full bg-[#00E676] animate-pulse" />
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[9px] font-mono text-[#0091FF] tracking-wider uppercase block">ESTAÇÃO</span>
                            <h4 className="text-base font-bold text-white">{machine.name}</h4>
                            <p className="text-xs text-slate-400 mt-0.5">ID: {machine.id} | Tipo: {machine.type}</p>
                          </div>
                          
                          <span className={`px-2.5 py-1 rounded text-[10px] font-bold border uppercase ${
                            machine.status === 'active' ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40' :
                            machine.status === 'maintenance' ? 'bg-amber-950/40 text-amber-400 border-amber-800/40 animate-pulse' :
                            'bg-red-950/40 text-red-400 border-red-800/40'
                          }`}>
                            {machine.status === 'active' ? 'EM OPERAÇÃO' :
                             machine.status === 'maintenance' ? 'MANUTENÇÃO' : 'OFFLINE'}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-[#1E1E24]/60 text-xs font-mono">
                          <div>
                            <span className="text-[9px] text-slate-500 uppercase block">Temperatura</span>
                            <span className="font-bold text-white">{machine.temperature}°C</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-500 uppercase block">Vibração</span>
                            <span className="font-bold text-white">{machine.vibration} G</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-500 uppercase block">Rendimento OEE</span>
                            <span className="font-bold text-white">{machine.oee}%</span>
                          </div>
                        </div>

                        {isRestricted && (
                          <div className="mt-3 p-2 bg-[#FF3D00]/5 border border-[#FF3D00]/20 rounded text-[10px] text-slate-400 font-sans">
                            ⚠️ Modo de simulação restrito devido ao Plano Starter.
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* --- TABLET SUB-VIEW 4: REGISTER METROLOGY PRODUCTION FORM --- */}
            {tabletSubView === 'production' && (
              <div className="max-w-2xl mx-auto bg-[#0F0F12] border border-[#1E1E24] p-6 rounded-2xl space-y-6">
                <div>
                  <h3 className="text-base font-bold text-white uppercase tracking-wider">Lançar Nova Medição Tridimensional</h3>
                  <p className="text-xs text-slate-400 mt-1">Insira os desvios coletados do paquímetro ou Zeiss Prismo. O sistema recalculará a aprovação da peça em tempo real.</p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1 uppercase">Código Serial (ID)</label>
                      <input 
                        type="text" 
                        value={tracePartId} 
                        onChange={(e) => setTracePartId(e.target.value)} 
                        className="w-full bg-[#15151A] border border-[#1E1E24] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-orange-500 font-mono text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1 uppercase">Nome da Peça</label>
                      <input 
                        type="text" 
                        value={tracePartName} 
                        onChange={(e) => setTracePartName(e.target.value)} 
                        className="w-full bg-[#15151A] border border-[#1E1E24] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-orange-500 font-mono text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1 uppercase">Lote CNC</label>
                      <input 
                        type="text" 
                        value={traceBatch} 
                        onChange={(e) => setTraceBatch(e.target.value)} 
                        className="w-full bg-[#15151A] border border-[#1E1E24] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-orange-500 font-mono text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1 uppercase">Cliente</label>
                      <input 
                        type="text" 
                        value={traceBuyerName} 
                        onChange={(e) => setTraceBuyerName(e.target.value)} 
                        className="w-full bg-[#15151A] border border-[#1E1E24] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-orange-500 font-mono text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">Comprimento (mm)</label>
                      <input 
                        type="text" 
                        value={traceLength} 
                        onChange={(e) => setTraceLength(e.target.value)} 
                        className="w-full bg-[#15151A] border border-[#1E1E24] rounded-lg px-2 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">Largura (mm)</label>
                      <input 
                        type="text" 
                        value={traceWidth} 
                        onChange={(e) => setTraceWidth(e.target.value)} 
                        className="w-full bg-[#15151A] border border-[#1E1E24] rounded-lg px-2 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">Altura (mm)</label>
                      <input 
                        type="text" 
                        value={traceHeight} 
                        onChange={(e) => setTraceHeight(e.target.value)} 
                        className="w-full bg-[#15151A] border border-[#1E1E24] rounded-lg px-2 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">Temp (°C)</label>
                      <input 
                        type="text" 
                        value={traceTemp} 
                        onChange={(e) => setTraceTemp(e.target.value)} 
                        className="w-full bg-[#15151A] border border-[#1E1E24] rounded-lg px-2 py-1.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1 uppercase">Situação da Peça</label>
                    <select 
                      value={tracePartStatus}
                      onChange={(e) => setTracePartStatus(e.target.value)}
                      className="w-full bg-[#15151A] border border-[#1E1E24] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-orange-500 font-mono text-white"
                    >
                      <option value="approved">Aprovada (Peça dentro da qualidade)</option>
                      <option value="rework">Necessita de Retrabalho</option>
                      <option value="rejected">Rejeitada (Scrap / Sucata)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1 uppercase">Notas Métricas / Observações</label>
                    <textarea 
                      value={tracePartObservation} 
                      onChange={(e) => setTracePartObservation(e.target.value)}
                      placeholder="Alguma anomalia mecânica? Registre aqui..."
                      className="w-full h-20 bg-[#15151A] border border-[#1E1E24] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>

                  {traceFormSuccess && (
                    <div className="p-3 bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 rounded-xl text-xs">
                      ✔ Medição tridimensional salva com sucesso no banco de dados da fábrica!
                    </div>
                  )}

                  {traceFormError && (
                    <div className="p-3 bg-red-950/40 text-red-400 border border-red-800/40 rounded-xl text-xs">
                      ❌ {traceFormError}
                    </div>
                  )}

                  <button 
                    onClick={async () => {
                      setIsTraceSubmitting(true);
                      setTraceFormError("");
                      setTraceFormSuccess(false);

                      if (!tracePartId.trim()) {
                        setTraceFormError("O código serial da peça é obrigatório.");
                        setIsTraceSubmitting(false);
                        return;
                      }

                      const newInspection = {
                        id: tracePartId.trim(),
                        batch: traceBatch.trim() || "CNC-003",
                        partName: tracePartName.trim(),
                        buyerName: traceBuyerName.trim(),
                        length: Number(traceLength) || 120,
                        width: Number(traceWidth) || 45,
                        height: Number(traceHeight) || 30,
                        temperature: Number(traceTemp) || 22,
                        status: tracePartStatus,
                        operator: profile.operatorName,
                        timestamp: new Date().toISOString(),
                        notes: tracePartObservation.trim(),
                        defectType: tracePartStatus === 'rejected' ? 'Dimensional fora da tolerância' : null
                      };

                      // Append and save locally/database simulated
                      setInspections(prev => [newInspection, ...prev]);
                      setTraceFormSuccess(true);
                      setIsTraceSubmitting(false);

                      // Clear input fields
                      setTracePartId("BME-" + Math.floor(1000 + Math.random() * 9000));
                      setTracePartObservation("");
                    }}
                    className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Lançar no SQL Server da Linha</span>
                  </button>
                </div>
              </div>
            )}

            {/* --- TABLET SUB-VIEW 5: SIMPLIFIED QUALITY METRICS --- */}
            {tabletSubView === 'quality' && (
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Qualidade e Índices Metrológicos</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Compliance Rate Card */}
                  <div className="bg-[#0F0F12] border border-[#1E1E24] p-5 rounded-2xl text-center space-y-4">
                    <div className="text-xs uppercase font-bold tracking-wider text-slate-400">Taxa de Conformidade Técnica</div>
                    <div className="text-5xl font-extralight text-[#0091FF]">{complianceRate}%</div>
                    <p className="text-xs text-slate-400">Meta estipulada pela fábrica: 95.0%</p>
                    <div className="h-2 bg-[#15151A] rounded-full overflow-hidden">
                      <div className="bg-[#0091FF] h-full" style={{ width: `${complianceRate}%` }}></div>
                    </div>
                    <span className="text-[10px] font-mono bg-emerald-950/40 text-emerald-400 border border-emerald-900/40 px-2 py-0.5 rounded">
                      Calibração Zeiss Ativa
                    </span>
                  </div>

                  {/* OEE Average Gauge */}
                  <div className="bg-[#0F0F12] border border-[#1E1E24] p-5 rounded-2xl text-center space-y-4">
                    <div className="text-xs uppercase font-bold tracking-wider text-slate-400">Eficiência Geral Média (OEE)</div>
                    <div className="text-5xl font-extralight text-orange-500">{oeeAverage}%</div>
                    <p className="text-xs text-slate-400">Rendimento do maquinário CNC</p>
                    <div className="h-2 bg-[#15151A] rounded-full overflow-hidden">
                      <div className="bg-orange-500 h-full" style={{ width: `${oeeAverage}%` }}></div>
                    </div>
                    <span className="text-[10px] font-mono bg-[#15151A] text-slate-400 border border-[#1E1E24] px-2 py-0.5 rounded">
                      Sensor de fuso calibrado
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* --- TABLET SUB-VIEW 6: CO-PILOT ASSISTANT IA --- */}
            {tabletSubView === 'assistant' && (
              <div className="space-y-4 max-w-2xl mx-auto bg-[#0F0F12] border border-[#1E1E24] p-6 rounded-2xl font-sans">
                <div>
                  <h3 className="text-base font-bold text-white uppercase tracking-wider">Perguntar ao Co-Piloto AI da Fábrica</h3>
                  <p className="text-xs text-slate-400 mt-1">Obtenha recomendações de calibração micrométrica, ajuste de fuso corretivo ou códigos de erro CNC.</p>
                </div>

                {/* Simulated chat container */}
                <div className="h-64 overflow-y-auto space-y-3 p-4 bg-[#15151A] rounded-xl border border-[#1E1E24]/60 font-sans text-xs">
                  {chatHistory.map((chat, idx) => (
                    <div key={idx} className={`p-3 rounded-lg max-w-[85%] ${chat.sender === 'user' ? 'bg-[#0091FF]/10 text-white border border-[#0091FF]/20 ml-auto font-sans' : 'bg-slate-800 text-slate-200 mr-auto font-sans'}`}>
                      <div className="font-bold text-[9px] text-slate-500 uppercase font-mono">{chat.sender === 'user' ? 'Você' : 'Co-Piloto AI'}</div>
                      <div className="mt-1 leading-relaxed whitespace-pre-wrap">{chat.text}</div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleChatSubmit(e);
                    }}
                    placeholder="Ex: Como calibrar a CNC-02 para desvio na furação?"
                    className="flex-1 bg-[#15151A] border border-[#1E1E24] rounded-lg px-3 py-2.5 text-xs text-white placeholder-slate-500"
                  />
                  <button 
                    onClick={(e) => handleChatSubmit(e)}
                    disabled={isGeneratingChat}
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-black font-extrabold text-xs uppercase tracking-wider rounded-lg cursor-pointer"
                  >
                    {isGeneratingChat ? "Gerando..." : "Perguntar"}
                  </button>
                </div>
              </div>
            )}

            {/* --- TABLET SUB-VIEW 7: ACCESSIBILITY OPTIONS --- */}
            {tabletSubView === 'settings' && (
              <div className="max-w-xl mx-auto bg-[#0F0F12] border border-[#1E1E24] p-6 rounded-2xl space-y-6">
                <div>
                  <h3 className="text-base font-bold text-white uppercase tracking-wider">Acessibilidade Industrial (WCAG 2.2 AA)</h3>
                  <p className="text-xs text-slate-400 mt-1">Configure o terminal para operação segura sob condições de chão de fábrica extremas (vibrações, fumaça, reflexos).</p>
                </div>

                <div className="space-y-4">
                  {/* Theme Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 block uppercase">Tema de Cores do Painel</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => setColorTheme('default')}
                        className={`p-3 rounded-lg border text-xs font-bold uppercase cursor-pointer ${colorTheme === 'default' ? 'bg-[#0091FF] text-white border-[#0091FF]' : 'bg-[#15151A] text-slate-400 border-[#1E1E24]'}`}
                      >
                        Escuro Cyberpunk (Padrão)
                      </button>
                      <button 
                        onClick={() => setColorTheme('light')}
                        className={`p-3 rounded-lg border text-xs font-bold uppercase cursor-pointer ${colorTheme === 'light' ? 'bg-white text-black border-slate-300 shadow' : 'bg-[#15151A] text-slate-400 border-[#1E1E24]'}`}
                      >
                        Laboratório Branco (Claro)
                      </button>
                      <button 
                        onClick={() => setColorTheme('colorblind')}
                        className={`p-3 rounded-lg border text-xs font-bold uppercase cursor-pointer ${colorTheme === 'colorblind' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-[#15151A] text-slate-400 border-[#1E1E24]'}`}
                      >
                        Modo Daltonismo (Deuteranopia)
                      </button>
                      <button 
                        onClick={() => setColorTheme('inverted')}
                        className={`p-3 rounded-lg border text-xs font-bold uppercase cursor-pointer ${colorTheme === 'inverted' ? 'bg-amber-500 text-black border-amber-500 font-extrabold' : 'bg-[#15151A] text-slate-400 border-[#1E1E24]'}`}
                      >
                        Inversão de Cores (Alto Contraste)
                      </button>
                    </div>
                  </div>

                  {/* Font Sizer */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 block uppercase">Escala das Letras (Acessibilidade Visual)</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button 
                        onClick={() => setFontSizeMode('normal')}
                        className={`p-3 rounded-lg border text-xs font-bold uppercase cursor-pointer ${fontSizeMode === 'normal' ? 'bg-[#0091FF] text-white border-[#0091FF]' : 'bg-[#15151A] text-slate-400 border-[#1E1E24]'}`}
                      >
                        Letras Padrão (100%)
                      </button>
                      <button 
                        onClick={() => setFontSizeMode('large')}
                        className={`p-3 rounded-lg border text-xs font-bold uppercase cursor-pointer ${fontSizeMode === 'large' ? 'bg-[#0091FF] text-white border-[#0091FF]' : 'bg-[#15151A] text-slate-400 border-[#1E1E24]'}`}
                      >
                        Letras Grandes (+12%)
                      </button>
                      <button 
                        onClick={() => setFontSizeMode('xlarge')}
                        className={`p-3 rounded-lg border text-xs font-bold uppercase cursor-pointer ${fontSizeMode === 'xlarge' ? 'bg-[#0091FF] text-white border-[#0091FF]' : 'bg-[#15151A] text-slate-400 border-[#1E1E24]'}`}
                      >
                        Letras Gigantes (+25%)
                      </button>
                    </div>
                  </div>

                  {/* Gloves mode info */}
                  <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl space-y-1">
                    <h5 className="font-bold text-white text-xs uppercase tracking-tight">Sobre o Modo Luvas</h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed">Desenvolvido em parceria com a Scania, o Modo Luvas adiciona margens extras e um tamanho mínimo de área clicável de 52px em todos os botões e seletores da tela. Ideal para digitação rápida sem retirar os equipamentos de proteção individual (EPIs).</p>
                  </div>
                </div>
              </div>
            )}

            {/* --- TABLET SUB-VIEW 8: EMERGENCY & HELP --- */}
            {tabletSubView === 'help' && (
              <div className="max-w-2xl mx-auto space-y-6">
                {/* BIG CRISIS ALERT PANIC BANNER */}
                <div className="bg-red-950/20 border-2 border-red-600 rounded-2xl p-6 text-center space-y-4">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white mx-auto animate-bounce shadow-md">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-black text-white uppercase tracking-tight">Painel de Alerta de Chão de Fábrica</h3>
                    <p className="text-xs text-slate-300 max-w-md mx-auto">Viu fumaça, superaquecimento severo de mandril ou vazamento térmico nas CNCs? Acione o protocolo abaixo.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto">
                    <button 
                      onClick={() => {
                        // Trigger simulated emergency stop for all machines
                        setMachines(prev => prev.map(m => ({ ...m, status: 'maintenance', temperature: 20 })));
                        alert("🚨 COMANDO DE PARADA INDUSTRIAL ENVIADO! Todas as CNCs foram colocadas em Modo Manutenção Corretiva.");
                      }}
                      className="py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-lg"
                    >
                      🛑 PARADA GERAL EMERGÊNCIA
                    </button>
                    <button 
                      onClick={() => {
                        alert("📞 Chamando equipe de manutenção corretiva ZEISS e Bombeiros do Complexo Industrial Linha Beta...");
                      }}
                      className="py-3 bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-lg"
                    >
                      ⚡ CHAMAR EQUIPE MANUTENÇÃO
                    </button>
                  </div>
                </div>

                {/* HELP CARD STEP-BY-STEP */}
                <div className="bg-[#0F0F12] border border-[#1E1E24] p-6 rounded-2xl space-y-4">
                  <h4 className="font-bold text-white uppercase tracking-wider text-xs">Guia Operacional Rápido para Operadores</h4>
                  
                  <div className="space-y-3 text-xs font-sans text-slate-400">
                    <div className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-[#0091FF] font-bold flex items-center justify-center shrink-0">1</span>
                      <p>Use a <strong>Pesquisa Inteligente</strong> do Tablet para digitar o número da peça (ex: <code>BME-1002</code>). O painel exibirá imediatamente se a peça está "Dentro da Qualidade".</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-[#0091FF] font-bold flex items-center justify-center shrink-0">2</span>
                      <p>Para registrar uma peça medida na tridimensional Zeiss, vá em <strong>Registrar Produção</strong>, preencha as tolerâncias e clique em "Salvar".</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-[#0091FF] font-bold flex items-center justify-center shrink-0">3</span>
                      <p>Ative o <strong>Modo Luvas</strong> e aumente a escala das fontes na aba de <strong>Acessibilidade</strong> para maior conforto térmico tátil.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {tabletSubView === 'procedures' && (
              <ProceduresPanel 
                selectedInstructionId={selectedInstructionId}
                onClearSelectedInstruction={() => setSelectedInstructionId(null)}
              />
            )}

            {tabletSubView === 'my-machine' && (
              <MyMachineView 
                operatorName={profile?.operatorName || "Carlos Santos"} 
                onNavigateToProcedure={(procId) => {
                  setTabletSubView('procedures');
                }} 
                colorTheme={colorTheme}
                glovesMode={glovesMode}
              />
            )}
          </div>
        ) : (
          /* --- 💻 COMPUTADOR (GESTOR) ORIGINAL VIEWPORT CONTENT --- */
          <div className="space-y-6">
            
            {/* BANNER ASSINATURA STARTER RESTRICTION CRITICAL EXPLANATION */}
            {profile.planId === 'starter' && (
          <div className="mb-6 p-4 rounded-xl border border-[#FF3D00]/30 bg-[#FF3D00]/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[#FF3D00] shrink-0 mt-0.5" />
              <div>
                <h5 className="text-sm font-bold text-white">Plano Starter Ativo (Limite: 2 Máquinas)</h5>
                <p className="text-xs text-[#888888] mt-0.5">As telemetrias das máquinas CNC-02, Laser-01 e Zeiss Prismo estão atualmente operando no modo de simulação restrito. Para integrar a precisão metrológica irrestrita e obter acesso ao Co-Piloto IA Avançado, assine o Plano Co-Piloto IA de R$ 1.000 / mês.</p>
              </div>
            </div>
            <button 
              onClick={() => {
                setActiveTab('saas-billing');
                setSelectedBillingPlan('professional');
                setPaymentStep('selection');
              }}
              className="px-4 py-2 bg-[#FF3D00] text-black text-xs font-bold rounded hover:bg-orange-500 transition-all cursor-pointer uppercase tracking-widest"
            >
              Mudar de Plano
            </button>
          </div>
        )}

        {/* 1. DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            
            {/* LINK DE EMERGÊNCIA SIMPLIFICADO PARA O DASHBOARD */}
            <div className="p-4 bg-gradient-to-r from-red-950/30 via-[#0F0F12] to-transparent border border-red-900/30 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-red-500 animate-pulse" />
              <div className="flex items-start sm:items-center gap-3">
                <span className="p-2 bg-red-500/10 text-red-500 rounded-lg animate-pulse shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-tight">Guia de Emergência Rápido (Ideal para Faxineiros / Auxiliares)</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Viu fumaça, faíscas ou ouviu um barulho estranho? Pare as máquinas e chame ajuda com o Painel de Emergência Simplificado de 1 clique.</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveTab('emergency')}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold text-[11px] rounded-lg transition-all cursor-pointer uppercase tracking-widest flex items-center gap-1.5 shrink-0 shadow-[0_0_15px_rgba(220,38,38,0.35)]"
              >
                <span>Acessar Painel SOS</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            
            {/* INK OVERVIEW METRICS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-[#0F0F12] border border-[#1E1E24] rounded-xl p-5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 opacity-15">
                  <ShieldCheck className="w-12 h-12 text-[#0091FF]" />
                </div>
                <p className="text-[10px] text-[#666666] uppercase tracking-wider mb-1 font-mono">Conformidade Total (CEP)</p>
                <div className="flex items-baseline space-x-2">
                  <h2 className="text-4xl font-extralight text-white tracking-tight">{complianceRate}%</h2>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${complianceRate >= 95 ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/40' : 'bg-amber-950/40 text-amber-400 border border-amber-800/40'}`}>
                    {complianceRate >= 95 ? 'ANSI CLASSE A' : 'DERIVAÇÃO CRÍTICA'}
                  </span>
                </div>
                <div className="w-full bg-[#1A1A1F] h-1 mt-4 rounded-full overflow-hidden">
                  <div className="bg-[#0091FF] h-full transition-all duration-1000" style={{ width: `${complianceRate}%` }} />
                </div>
              </div>

              <div className="bg-[#0F0F12] border border-[#1E1E24] rounded-xl p-5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 opacity-15">
                  <Activity className="w-12 h-12 text-[#00E676]" />
                </div>
                <p className="text-[10px] text-[#666666] uppercase tracking-wider mb-1 font-mono">Planta OEE Média</p>
                <div className="flex items-baseline space-x-2">
                  <h2 className="text-4xl font-extralight text-white tracking-tight">{oeeAverage}%</h2>
                  <span className="text-[10px] font-mono text-emerald-400">EXCELENTE</span>
                </div>
                <div className="w-full bg-[#1A1A1F] h-1 mt-4 rounded-full overflow-hidden">
                  <div className="bg-[#00E676] h-full transition-all duration-1000" style={{ width: `${oeeAverage}%` }} />
                </div>
              </div>

              <div className="bg-[#0F0F12] border border-[#1E1E24] rounded-xl p-5 relative overflow-hidden group">
                <p className="text-[10px] text-[#666666] uppercase tracking-wider mb-1 font-mono">Volume Inspecionado (Hoje)</p>
                <div className="flex items-baseline space-x-3">
                  <h2 className="text-4xl font-extralight text-white tracking-tight">{totalInspected}</h2>
                  <div className="text-[10px] font-mono text-slate-500 flex flex-col justify-end">
                    <span className="text-[#0ff] font-bold">✓ {approvedInspections.length} OK</span>
                    <span className="text-[#f43f5e] font-bold">✗ {rejectedInspections.length} Scrap</span>
                  </div>
                </div>
                <div className="flex gap-1.5 mt-3">
                  <div className="h-1 bg-[#00E676] rounded-full transition-all" style={{ width: `${(approvedInspections.length / (totalInspected || 1)) * 100}%` }} />
                  <div className="h-1 bg-[#FFB300] rounded-full transition-all" style={{ width: `${(reworkInspections.length / (totalInspected || 1)) * 100}%` }} />
                  <div className="h-1 bg-[#FF3D00] rounded-full transition-all" style={{ width: `${(rejectedInspections.length / (totalInspected || 1)) * 100}%` }} />
                </div>
              </div>

              <div className="bg-[#0F0F12] border border-[#1E1E24] rounded-xl p-5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 opacity-15">
                  <Sparkles className="w-12 h-12 text-[#FFB300]" />
                </div>
                <p className="text-[10px] text-[#666666] uppercase tracking-wider mb-1 font-mono">Co-Piloto Inteligente</p>
                <div className="space-y-2 mt-1">
                  {profile.planId === 'professional' ? (
                    <button 
                      onClick={triggerAiAuditor}
                      disabled={isAuditing}
                      className="w-full py-2 px-3 text-xs bg-gradient-to-r from-[#0091FF] to-indigo-600 text-white font-bold rounded-lg flex items-center justify-center gap-1.5 hover:opacity-90 disabled:opacity-50 transition-all pointer-events-auto cursor-pointer shadow-[0_0_15px_rgba(0,145,255,0.2)]"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      {isAuditing ? 'Auditando Lote...' : 'Realizar Auditoria IA'}
                    </button>
                  ) : (
                    <button 
                      onClick={() => {
                        setActiveTab('saas-billing');
                        setSelectedBillingPlan('professional');
                        setPaymentStep('selection');
                      }}
                      className="w-full py-2 px-3 text-xs bg-[#1A1A24] border border-[#FFB300]/20 text-slate-400 hover:text-white font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all pointer-events-auto cursor-pointer"
                    >
                      <Lock className="w-3.5 h-3.5 text-[#FFB300]" />
                      <span>Ativar Co-Piloto IA</span>
                    </button>
                  )}
                </div>
              </div>

            </div>

            {/* AI AUDIT RESULT SECTION */}
            {auditResult && (
              <div className="bg-[#0F0F12] border-2 border-[#0091FF]/40 rounded-xl p-6 relative overflow-hidden shadow-2xl animate-fade-in">
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(auditResult);
                      setCopiedAudit(true);
                      setTimeout(() => setCopiedAudit(false), 2000);
                    }}
                    className="px-3 py-1.5 text-xs font-mono border border-[#1E1E24] hover:bg-[#1E1E24] bg-black text-[#0091FF] rounded-lg cursor-pointer transition-all uppercase flex items-center gap-1 font-bold"
                  >
                    {copiedAudit ? "Copiado!" : "Copiar Relatório"}
                  </button>
                  <button 
                    onClick={() => setAuditResult("")}
                    className="px-2.5 py-1.5 text-xs font-mono border border-red-900/30 hover:bg-red-950/40 text-red-400 bg-black rounded-lg cursor-pointer transition-all uppercase font-bold"
                  >
                    Fechar
                  </button>
                </div>
                
                <div className="flex items-center gap-2.5 mb-4 border-b border-[#1E1E24] pb-3 pr-24">
                  <span className="p-2 bg-[#0091FF]/10 text-[#0091FF] rounded-lg">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                  </span>
                  <div>
                    <span className="text-[9px] font-mono text-[#0091FF] uppercase font-bold tracking-widest block">RELATÓRIO DE AUDITORIA DE PLANTÃO</span>
                    <h4 className="text-sm font-bold text-white uppercase tracking-tight">Co-Piloto Industrial IA - Auditor Metrológico</h4>
                  </div>
                </div>

                <div className="bg-[#09090D] border border-[#1E1E24] rounded-lg p-5 max-h-[400px] overflow-y-auto font-mono text-xs text-slate-200 leading-relaxed space-y-4 select-text">
                  {auditResult.split('\n').map((line, idx) => {
                    const cleanLine = line.trim();
                    if (cleanLine.startsWith('###') || cleanLine.startsWith('**###')) {
                      return <h4 key={idx} className="text-xs font-bold text-[#0091FF] pt-2 border-b border-[#1E1E24]/40 pb-1 uppercase">{cleanLine.replace(/[#*]/g, '').trim()}</h4>;
                    }
                    if (cleanLine.startsWith('**') && cleanLine.endsWith('**')) {
                      return <p key={idx} className="font-bold text-white pt-1">{cleanLine.replace(/[#*]/g, '').trim()}</p>;
                    }
                    if (cleanLine.startsWith('*') || cleanLine.startsWith('-')) {
                      return (
                        <div key={idx} className="flex items-start gap-2 pl-2">
                          <span className="text-[#00E676] font-bold select-none">•</span>
                          <span>{cleanLine.replace(/^[*-\s]+/, '').trim()}</span>
                        </div>
                      );
                    }
                    if (cleanLine === '---') {
                      return <hr key={idx} className="border-[#1E1E24] my-2" />;
                    }
                    return <p key={idx} className="py-0.5">{line}</p>;
                  })}
                </div>
              </div>
            )}

            {/* PANEL DE OPERAÇÃO DA REDE METROLÓGICA (CIO / OFFLINE HUBS) */}
            <div className="bg-[#0F0F12] border border-[#1E1E24] rounded-xl p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#0091FF]/5 blur-3xl rounded-full pointer-events-none" />
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 pb-4 border-b border-[#1E1E24]/60">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono tracking-widest text-[#0091FF] font-extrabold uppercase bg-[#0091FF]/10 px-2 py-0.5 rounded border border-[#0091FF]/20">
                      Arquitetura de Borda Resiliente (Edge Computing)
                    </span>
                    <span className="text-[9px] font-mono tracking-widest text-[#00E676] font-extrabold uppercase bg-[#00E676]/10 px-2 py-0.5 rounded border border-[#00E676]/20">
                      Indústria 5.0
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                    <Database className="w-4.5 h-4.5 text-[#0091FF]" />
                    Central de Conectividade & Operações Off-Grid
                  </h3>
                  <p className="text-xs text-slate-400 max-w-2xl">
                    Demonstração executiva da resiliência industrial. O sistema e o Co-Piloto IA operam de forma autônoma sem internet, utilizando o motor de inferência local e cache de sincronismo cíclico para evitar paradas na linha de produção.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-[#0A0A0C] border border-[#1E1E24] p-1.5 rounded-xl shrink-0">
                  <button
                    onClick={() => setConnectionMode('online')}
                    className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      connectionMode === 'online'
                        ? 'bg-gradient-to-r from-[#0091FF] to-indigo-600 text-white shadow-[0_0_15px_rgba(0,145,255,0.3)]'
                        : 'text-slate-400 hover:text-white hover:bg-[#15151A]'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5" />
                    Link Nuvem (Online)
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
                    Borda Offline (Local)
                  </button>
                </div>
              </div>

              {/* CIO Edge Resilience Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
                <div className="bg-[#15151A] border border-[#1E1E24] rounded-lg p-3.5">
                  <p className="text-[9px] text-[#666666] uppercase tracking-wider font-mono">Status da Conexão</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`w-2 h-2 rounded-full animate-pulse ${connectionMode === 'online' ? 'bg-[#0091FF]' : 'bg-amber-500'}`} />
                    <span className="text-xs font-bold text-white font-mono uppercase">
                      {connectionMode === 'online' ? 'Servidor Central' : 'Modo Borda Ativo'}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    {connectionMode === 'online' ? 'Redundância em nuvem ativa.' : 'Rodando 100% isolado de internet externa.'}
                  </p>
                </div>

                <div className="bg-[#15151A] border border-[#1E1E24] rounded-lg p-3.5">
                  <p className="text-[9px] text-[#666666] uppercase tracking-wider font-mono">Latência de Inferência</p>
                  <div className="text-xs font-bold text-[#00E676] font-mono mt-1">
                    {connectionMode === 'online' ? '42ms (Cloud Hub)' : '< 1ms (Aceleração Local)'}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Cálculo metrológico instantâneo por edge micro-services.
                  </p>
                </div>

                <div className="bg-[#15151A] border border-[#1E1E24] rounded-lg p-3.5">
                  <p className="text-[9px] text-[#666666] uppercase tracking-wider font-mono">Disponibilidade da Linha (SLA)</p>
                  <div className="text-xs font-bold text-white font-mono mt-1">
                    100% Garantido (Anti-Downtime)
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    À prova de rompimentos de fibra ou quedas de sinal celular.
                  </p>
                </div>

                <div className="bg-[#15151A] border border-[#1E1E24] rounded-lg p-3.5">
                  <p className="text-[9px] text-[#666666] uppercase tracking-wider font-mono">Inteligência Operacional</p>
                  <div className="text-xs font-bold text-amber-500 font-mono mt-1">
                    QualitySync Local Co-Pilot
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Algoritmo de compensação de expansão térmica em tempo real.
                  </p>
                </div>
              </div>
            </div>

            {/* MÁQUINAS CONECTADAS AO SISTEMA (REQUISITO FUNDAMENTAL CIO - TODOS VISÍVEIS) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-3.5 bg-[#0091FF] rounded-full" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Terminais Industriais Ativos & Telemetria em Tempo Real ({machines.length} Estações de Fábrica)
                  </h4>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-[#888888]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00E676] animate-pulse" />
                  <span>Sincronismo IoT Ativo ({connectionMode === 'online' ? 'Nuvem' : 'Borda Local'})</span>
                </div>
              </div>

              {/* 5 Connected Machines Grid Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {machines.map((mach) => {
                  const isSelected = traceMachineFilter === mach.id;
                  const isCnc02WithAlert = mach.id === 'CNC-02';
                  
                  // Color codes for visual styling based on status
                  const isHighTemp = mach.temperature > 24.5;
                  const isHighVib = mach.vibration > 0.45;
                  
                  return (
                    <div
                      key={mach.id}
                      onClick={() => setTraceMachineFilter(isSelected ? 'ALL' : mach.id)}
                      className={`bg-[#0F0F12] border rounded-xl p-4 cursor-pointer relative transition-all duration-300 flex flex-col justify-between group ${
                        isSelected 
                          ? 'border-[#0091FF] bg-[#0091FF]/5 shadow-[0_0_20px_rgba(0,145,255,0.15)] ring-1 ring-[#0091FF]/30' 
                          : 'border-[#1E1E24] hover:border-slate-700 hover:bg-[#121217]'
                      }`}
                    >
                      {/* Machine Badge Top Row */}
                      <div className="flex items-center justify-between mb-3.5">
                        <span className="text-[10px] font-mono font-bold text-slate-400 group-hover:text-white transition-colors">
                          {mach.id}
                        </span>
                        
                        <div className="flex items-center gap-1.5">
                          {isCnc02WithAlert && (
                            <span className="text-[8px] font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded animate-pulse">
                              ALERTA
                            </span>
                          )}
                          <span className={`w-2 h-2 rounded-full ${
                            mach.status === 'offline' 
                              ? 'bg-red-500' 
                              : (isCnc02WithAlert ? 'bg-amber-500' : 'bg-[#00E676]')
                          } animate-pulse`} />
                        </div>
                      </div>

                      {/* Machine Main Name */}
                      <div className="mb-4">
                        <h5 className="text-xs font-bold text-white group-hover:text-[#0091FF] transition-colors leading-snug">
                          {mach.name}
                        </h5>
                        <p className="text-[9px] text-[#666666] uppercase tracking-wider font-mono mt-0.5">
                          {mach.id === 'CNC-01' ? 'Torno Mecânico Haas' : 
                           mach.id === 'CNC-02' ? 'Fresadora Mazak 12k' :
                           mach.id === 'LASER-01' ? 'Estação Laser Trumpf' :
                           mach.id === 'ROB-03' ? 'Braço Articulado Kuka' : 'Portal Metrológico 3D'}
                        </p>
                      </div>

                      {/* Telemetry Numbers */}
                      <div className="space-y-2 border-t border-[#1E1E24]/60 pt-3">
                        {/* OEE Stat */}
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-mono text-[#666666] uppercase">OEE Atual</span>
                          <span className={`text-[10px] font-mono font-bold ${mach.oee >= 85 ? 'text-[#00E676]' : 'text-amber-500'}`}>
                            {mach.oee}%
                          </span>
                        </div>
                        <div className="w-full bg-[#1A1A1F] h-1 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 ${mach.oee >= 85 ? 'bg-[#00E676]' : 'bg-amber-500'}`} 
                            style={{ width: `${mach.oee}%` }} 
                          />
                        </div>

                        {/* Temp / Vib / RPM micro display */}
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <div className="bg-[#15151A] rounded p-1.5 border border-[#1E1E24]/30 text-center">
                            <span className="text-[8px] text-[#666666] block uppercase font-mono">Temp</span>
                            <span className={`text-[10px] font-mono font-bold ${isHighTemp ? 'text-red-400' : 'text-slate-300'}`}>
                              {mach.temperature}°C
                            </span>
                          </div>
                          <div className="bg-[#15151A] rounded p-1.5 border border-[#1E1E24]/30 text-center">
                            <span className="text-[8px] text-[#666666] block uppercase font-mono">Vibração</span>
                            <span className={`text-[10px] font-mono font-bold ${isHighVib ? 'text-amber-400' : 'text-slate-300'}`}>
                              {mach.vibration} G
                            </span>
                          </div>
                        </div>

                        {mach.speedRpm > 0 && (
                          <div className="flex items-center justify-between text-[8px] font-mono text-[#666666] pt-1 border-t border-[#1E1E24]/40">
                            <span>FUSO / VELOCIDADE</span>
                            <span className="text-white font-bold">{mach.speedRpm} RPM</span>
                          </div>
                        )}
                      </div>

                      {/* Footer interaction click info */}
                      <div className="mt-3.5 text-center text-[9px] font-mono border-t border-[#1E1E24]/40 pt-2 shrink-0">
                        {isSelected ? (
                          <span className="text-[#0091FF] font-bold animate-pulse flex items-center justify-center gap-1">
                            <Check className="w-3 h-3" /> Filtrando planilha
                          </span>
                        ) : (
                          <span className="text-[#444444] group-hover:text-slate-400 transition-colors">
                            Clique para filtrar
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* LIVE MACHINE GRID AND INPUT METROLOGY */}
            <div className="space-y-6">

              {/* MACHINE SELECT CARDS LEFT */}
              <div className="space-y-6">
                
              {/* PLANILHA DE RASTREABILIDADE AVANÇADA DE PEÇAS (QUALIDADE) */}
                <div className="bg-[#0F0F12] border border-[#1E1E24] rounded-xl flex flex-col relative overflow-hidden">
                  
                  {/* HEADER BANNER */}
                  <div className="px-5 py-4 border-b border-[#1E1E24] flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#15151A]/50 gap-4">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="w-4.5 h-4.5 text-[#00E676]" />
                      <span className="text-xs font-bold uppercase tracking-wider text-white">Planilha de Rastreabilidade Avançada de Peças</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          setIsAddingTraceItem(!isAddingTraceItem);
                          setTraceFormError("");
                          setTraceFormSuccess(false);
                        }}
                        className={`px-3 py-1.5 rounded-lg border text-[11px] font-bold uppercase tracking-wider font-sans flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                          isAddingTraceItem
                            ? "bg-amber-950/40 text-amber-500 border-amber-800/40 hover:bg-amber-950/60"
                            : "bg-[#0091FF]/10 text-[#0091FF] border-[#0091FF]/25 hover:bg-[#0091FF]/20"
                        }`}
                      >
                        {isAddingTraceItem ? (
                          <>✕ Fechar Cadastro</>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5 text-[#0091FF]" />
                            Registrar Medição de Peça
                          </>
                        )}
                      </button>
                      <span className="text-[10px] font-mono bg-emerald-950/85 px-2.5 py-1 rounded text-emerald-400 font-bold tracking-wider border border-emerald-800/40">INSIGNES ZEISS ATIVO</span>
                    </div>
                  </div>

                  {/* FORM TO ADD INFORMATION DIRECTLY ON SITE */}
                  {isAddingTraceItem && (
                    <form 
                      onSubmit={handleTraceItemSubmit}
                      className="p-5 bg-[#0A0A0C] border-b border-[#1E1E24] space-y-4 text-xs font-sans"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-[#1E1E24]/60">
                        <div className="flex items-center gap-1.5">
                          <FilePlus className="w-4 h-4 text-[#0091FF]" />
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-200">
                            Inserir Novo Registro Metrológico em Tempo Real
                          </span>
                        </div>
                        <span className="text-[9px] font-mono text-slate-500 uppercase hidden sm:inline">
                          Cálculo automático de tolerâncias sob preceitos ZEISS
                        </span>
                      </div>

                      {/* Notification Messages */}
                      {traceFormSuccess && (
                        <div className="p-3 bg-emerald-950/30 border border-emerald-800/50 rounded-lg text-emerald-400 font-medium flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 shrink-0" />
                          <span>Peça salva com sucesso! O sistema calculou o status de conformidade e adicionou o registro ao topo da planilha.</span>
                        </div>
                      )}
                      
                      {traceFormError && (
                        <div className="p-3 bg-red-950/30 border border-red-800/50 rounded-lg text-red-400 font-medium flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 shrink-0" />
                          <span>{traceFormError}</span>
                        </div>
                      )}

                      {/* Main input grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        
                        {/* Lote */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block font-mono">
                            Lote de Fabricação *
                          </label>
                          <input
                            type="text"
                            value={traceBatch}
                            onChange={(e) => setTraceBatch(e.target.value)}
                            className="w-full bg-[#15151A] text-slate-100 border border-[#1E1E24] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#0091FF] font-mono placeholder-slate-600"
                            placeholder="Ex: LOTE-CNC01-15"
                            required
                          />
                        </div>

                        {/* Operador */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block font-sans">
                            Operador Responsável
                          </label>
                          <input
                            type="text"
                            value={traceOperator}
                            onChange={(e) => setTraceOperator(e.target.value)}
                            className="w-full bg-[#15151A] text-slate-100 border border-[#1E1E24] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#0091FF] placeholder-slate-605"
                            placeholder={profile?.operatorName || "Carlos Santos"}
                          />
                        </div>

                        {/* Compradora */}
                        <div className="space-y-1.5 font-sans">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                              Compradora (Cliente Scania, Volvo...) *
                            </label>
                            <span className="text-[9px] text-slate-500 font-mono">Datalist Ativo</span>
                          </div>
                          <input
                            type="text"
                            list="buyer-options"
                            value={traceBuyerName}
                            onChange={(e) => setTraceBuyerName(e.target.value)}
                            className="w-full bg-[#15151A] text-slate-100 border border-[#1E1E24] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#0091FF] placeholder-slate-600"
                            placeholder="Ex: Scania ou Volvo"
                            required
                          />
                          <datalist id="buyer-options">
                            <option value="Scania" />
                            <option value="Volvo Trucks" />
                            <option value="Mercedes-Benz" />
                            <option value="Iveco Linhas" />
                            <option value="Caterpillar" />
                          </datalist>
                        </div>

                        {/* Nome da Peça */}
                        <div className="space-y-1.5 font-sans">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                              Nome da Peça (Bloco motor, Cabeçote...) *
                            </label>
                            <span className="text-[9px] text-slate-500 font-mono">Digitável</span>
                          </div>
                          <input
                            type="text"
                            list="part-name-options"
                            value={tracePartName}
                            onChange={(e) => setTracePartName(e.target.value)}
                            className="w-full bg-[#15151A] text-[#00E676] border border-[#1E1E24] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#0091FF] placeholder-[#00E676]/60"
                            placeholder="Ex: Bloco Motor V8"
                            required
                          />
                          <datalist id="part-name-options">
                            <option value="Bloco Motor V8" />
                            <option value="Cabeçote 366" />
                            <option value="Mancal Central" />
                            <option value="Engrenagem Helicoidal" />
                            <option value="Pistão Combustão" />
                          </datalist>
                        </div>

                        {/* Maquina */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block font-sans">
                            Máquina Geradora *
                          </label>
                          <select
                            value={traceMachineId}
                            onChange={(e) => setTraceMachineId(e.target.value)}
                            className="w-full bg-[#15151A] text-slate-100 border border-[#1E1E24] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#0091FF] font-mono cursor-pointer"
                          >
                            <option value="CNC-01">CNC-01 (Torno Haas vf-2)</option>
                            <option value="CNC-02">CNC-02 (Portal Mazak VCN)</option>
                            <option value="LASER-01">LASER-01 (Estação Laser Trumpf)</option>
                            <option value="ROB-03">ROB-03 (Braço KUKA KR-16)</option>
                          </select>
                        </div>

                        {/* Temp */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block font-mono">
                            Temperatura de Processo (°C)
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            value={traceTemp}
                            onChange={(e) => setTraceTemp(e.target.value)}
                            className="w-full bg-[#15151A] text-[#FF9100] border border-[#1E1E24] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#0091FF] font-mono"
                            placeholder="22.0"
                          />
                        </div>

                        {/* Eixo X */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block font-mono">
                              X: Comprimento (mm) *
                            </label>
                            <span className="text-[9px] text-[#666666] font-mono">120.00 ±0.05</span>
                          </div>
                          <input
                            type="number"
                            step="0.001"
                            value={traceLength}
                            onChange={(e) => setTraceLength(e.target.value)}
                            className="w-full bg-[#15151A] text-slate-100 border border-[#1E1E24] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#0091FF] font-mono"
                            placeholder="120.00"
                            required
                          />
                        </div>

                        {/* Eixo Y */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block font-mono">
                              Y: Largura (mm) *
                            </label>
                            <span className="text-[9px] text-[#666666] font-mono">45.00 ±0.03</span>
                          </div>
                          <input
                            type="number"
                            step="0.001"
                            value={traceWidth}
                            onChange={(e) => setTraceWidth(e.target.value)}
                            className="w-full bg-[#15151A] text-slate-100 border border-[#1E1E24] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#0091FF] font-mono"
                            placeholder="45.00"
                            required
                          />
                        </div>

                        {/* Eixo Z */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block font-mono">
                              Z: Altura (mm) *
                            </label>
                            <span className="text-[9px] text-[#666666] font-mono">30.00 ±0.02</span>
                          </div>
                          <input
                            type="number"
                            step="0.001"
                            value={traceHeight}
                            onChange={(e) => setTraceHeight(e.target.value)}
                            className="w-full bg-[#15151A] text-slate-100 border border-[#1E1E24] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#0091FF] font-mono"
                             placeholder="30.00"
                            required
                          />
                        </div>

                        {/* Situação da Peça */}
                        <div className="space-y-1.5 font-sans">
                          <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                            Situação da Peça (Rastreabilidade) *
                          </label>
                          <select
                            value={tracePartStatus}
                            onChange={(e) => setTracePartStatus(e.target.value)}
                            className={`w-full border rounded-lg px-3 py-2 text-xs focus:outline-none font-bold cursor-pointer transition-all ${
                              tracePartStatus === "approved"
                                ? "bg-emerald-950/40 text-[#00E676] border-[#00E676]/30 focus:border-[#00E676]"
                                : tracePartStatus === "rework"
                                ? "bg-amber-950/40 text-[#FF9100] border-[#FF9100]/30 focus:border-[#FF9100]"
                                : "bg-red-950/30 text-red-500 border-red-500/30 focus:border-red-500"
                            }`}
                          >
                            <option value="approved" className="bg-[#15151A] text-[#00E676] font-bold">✓ Aceita (Aprovada)</option>
                            <option value="rework" className="bg-[#15151A] text-[#FF9100] font-bold">⚠ Retrabalhada (Ajustagem)</option>
                            <option value="rejected" className="bg-[#15151A] text-red-500 font-bold">✗ Rejeitada (Sucata)</option>
                          </select>
                        </div>

                        {/* Observação Física Detalhada da Peça */}
                        <div className="space-y-1.5 pt-2 col-span-full border-t border-[#1E1E24]/40 font-sans">
                          <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                            Observação Específica ou Histórico de Análise da Peça Física
                          </label>
                          <textarea
                            rows={2}
                            value={tracePartObservation}
                            onChange={(e) => setTracePartObservation(e.target.value)}
                            className="w-full bg-[#15151A] text-slate-100 border border-[#1E1E24] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#0091FF] placeholder-slate-600"
                            placeholder="Escreva detalhes como conformidade visual, material complementar, furos calibrados, textura, ou notas pós-inspeção manual..."
                          />
                        </div>

                        {/* Percurso de Rastreabilidade e Clocks e Máquinas */}
                        <div className="pt-4 border-t border-[#1E1E24]/40 space-y-3.5 col-span-full font-sans">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-200">
                                Percurso de Operação e Rastreamento de Máquinas
                              </h4>
                              <p className="text-[9px] text-slate-500 font-sans">
                                Especifique todas as máquinas pelas quais essa peça transitou, os horários e observações específicas de cada processamento complementar.
                              </p>
                            </div>
                            <span className="text-[10px] font-mono text-[#0091FF] font-bold uppercase bg-[#0091FF]/10 px-2.5 py-0.5 rounded border border-[#0091FF]/20">
                              {traceRoutingSteps.length} Etapas Cadastradas
                            </span>
                          </div>

                          {/* Displaying already added steps */}
                          <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                            {traceRoutingSteps.map((step, index) => (
                              <div key={index} className="flex items-center justify-between gap-3 p-3 bg-black border border-[#1E1E24] rounded-lg text-xs font-sans">
                                <div className="flex items-center gap-3">
                                  <span className="w-5 h-5 rounded-full bg-[#1E1E24] flex items-center justify-center text-[10px] font-mono font-bold text-slate-400">
                                    #{index + 1}
                                  </span>
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <span className="font-mono bg-[#0091FF]/10 text-[#0091FF] px-1.5 py-0.5 rounded text-[10px] font-bold">
                                        {step.machineId}
                                      </span>
                                      <span className="text-slate-400 font-mono text-[10.5px] flex items-center gap-1">
                                        <Clock className="w-3 h-3 text-slate-600" />
                                        {step.timestamp}
                                      </span>
                                    </div>
                                    {step.machineNotes && (
                                      <p className="text-[10.5px] text-slate-400 font-sans leading-tight">
                                        <span className="text-slate-600 font-bold">Obs da Máquina:</span> {step.machineNotes}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setTraceRoutingSteps(prev => prev.filter((_, idx) => idx !== index))}
                                  className="p-1 px-2.5 rounded bg-red-950/15 hover:bg-red-950/40 text-red-500 hover:text-red-400 border border-red-900/30 hover:border-red-800 transition-all cursor-pointer text-[10px]"
                                >
                                  Remover
                                </button>
                              </div>
                            ))}
                            {traceRoutingSteps.length === 0 && (
                              <div className="p-3 text-center text-[10px] font-sans text-slate-500 italic uppercase">
                                Nenhuma etapa de processamento intermediário adicionada. A peça passará apenas na máquina geradora principal.
                              </div>
                            )}
                          </div>

                          {/* Inline form to add a routing step */}
                          <div className="p-3 bg-[#15151A]/40 border border-[#1E1E24]/60 rounded-xl space-y-3 font-sans">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-300 font-sans flex items-center gap-1">
                              <span>+ Adicionar Máquina do Percurso de Fabricação</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                              
                              {/* Machine Selection writeable input with datalist and interactive suggestion tags */}
                              <div className="space-y-1.5 md:col-span-8 font-sans">
                                <label className="text-[9px] uppercase font-bold text-slate-500 block">
                                  Máquina Intermediária
                                </label>
                                <input
                                  type="text"
                                  list="machinery-suggestions"
                                  value={newStepMachine}
                                  onChange={(e) => setNewStepMachine(e.target.value)}
                                  className="w-full bg-[#15151A] text-slate-100 border border-[#1E1E24] rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#0091FF] font-mono"
                                  placeholder="Digite ou escolha (Ex: CNC-01)"
                                />
                                <datalist id="machinery-suggestions">
                                  <option value="CNC-01">CNC-01 (Torno Haas VF-2)</option>
                                  <option value="CNC-02">CNC-02 (Portal Mazak VCN)</option>
                                  <option value="LASER-01">LASER-01 (Estação Laser Trumpf)</option>
                                  <option value="ROB-03">ROB-03 (Braço KUKA KR-16)</option>
                                  <option value="ZEISS-01">ZEISS-01 (Metrologia 3D PRISMO)</option>
                                  <option value="RETÍFICA-01">RETÍFICA-01 (Retificadora Linear)</option>
                                  <option value="PRENSA-02">PRENSA-02 (Estampagem Hidráulica)</option>
                                  <option value="LIMPEZA-01">LIMPEZA-01 (Ultrassônica ZEISS)</option>
                                </datalist>
                              </div>

                              {/* Timestamp */}
                              <div className="space-y-1.5 md:col-span-4">
                                <label className="text-[9px] uppercase font-bold text-slate-500 block font-sans font-bold">Horário / Timetag</label>
                                <input
                                  type="text"
                                  value={newStepTime}
                                  onChange={(e) => setNewStepTime(e.target.value)}
                                  className="w-full bg-[#15151A] text-slate-100 border border-[#1E1E24] rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#0091FF] font-mono"
                                  placeholder="Ex: 10:30 ou 14:15"
                                />
                              </div>

                            </div>

                            <div className="flex justify-end pt-1">
                              <button
                                type="button"
                                onClick={() => {
                                  if (!newStepTime.trim()) return;
                                  setTraceRoutingSteps(prev => [
                                    ...prev,
                                    { machineId: newStepMachine || "MÁQUINA-GENÉRICA", timestamp: newStepTime, machineNotes: "" }
                                  ]);
                                  // Set next logical timestamp by incrementing minutes for easy entries
                                  try {
                                    const [hrsStr, minsStr] = newStepTime.split(":");
                                    let hrs = parseInt(hrsStr) || 12;
                                    let mins = parseInt(minsStr) || 0;
                                    mins += 45;
                                    if (mins >= 60) {
                                      hrs = (hrs + 1) % 24;
                                      mins = mins % 60;
                                    }
                                    const nextTime = `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
                                    setNewStepTime(nextTime);
                                  } catch (e) {
                                    setNewStepTime("12:00");
                                  }
                                }}
                                className="px-3 py-1.5 bg-[#1E1E24] hover:bg-[#0091FF] hover:text-white border border-[#1E1E24] text-slate-300 text-[10px] font-bold uppercase rounded-lg transition-all cursor-pointer font-sans"
                              >
                                + Registrar Máquina no Percurso
                              </button>
                            </div>

                          </div>
                        </div>

                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center justify-end gap-2.5 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingTraceItem(false);
                            setTraceFormError("");
                            setTraceFormSuccess(false);
                          }}
                          className="px-4 py-2 bg-[#15151A] hover:bg-[#1E1E24] border border-[#1E1E24] text-slate-300 text-xs font-bold uppercase rounded-lg transition-all cursor-pointer"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          disabled={isTraceSubmitting}
                          className="px-5 py-2 bg-[#0091FF] hover:bg-[#0076D1] disabled:bg-slate-800 text-white text-xs font-bold uppercase rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          {isTraceSubmitting ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              Processando medições...
                            </>
                          ) : (
                            <>
                              <Save className="w-3.5 h-3.5 text-white" />
                              Registrar na Planilha
                            </>
                          )}
                        </button>
                      </div>

                    </form>
                  )}

                  {/* CONTROLS BAR: SEARCH, FILTERS & DOWNLOAD */}
                  <div className="p-4 bg-[#0A0A0C] border-b border-[#1E1E24] flex flex-col xl:flex-row gap-3 items-stretch xl:items-center justify-between">
                    
                    {/* Pesquisa Global */}
                    <div className="relative flex-1">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Search className="w-3.5 h-3.5 text-slate-500" />
                      </span>
                      <input
                        type="text"
                        value={traceSearch}
                        onChange={(e) => setTraceSearch(e.target.value)}
                        placeholder="Buscar por ID de peça, lote ou operador..."
                        className="w-full bg-[#15151A] text-slate-200 border border-[#1E1E24] rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[#0091FF] placeholder-slate-500 font-mono"
                      />
                    </div>

                    {/* Filtros rápidos e Exportar */}
                    <div className="flex flex-wrap items-center gap-2">
                      
                      {/* Filtro Máquina */}
                      <div className="flex items-center bg-[#15151A] border border-[#1E1E24] rounded-lg px-2.5 py-1.5 gap-2">
                        <Filter className="w-3 h-3 text-slate-400" />
                        <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Máquina:</span>
                        <select
                          value={traceMachineFilter}
                          onChange={(e) => setTraceMachineFilter(e.target.value)}
                          className="bg-transparent text-xs text-slate-200 focus:outline-none font-mono cursor-pointer"
                        >
                          <option value="ALL" className="bg-[#15151A]">Todas</option>
                          <option value="CNC-01" className="bg-[#15151A]">CNC-01</option>
                          <option value="CNC-02" className="bg-[#15151A]">CNC-02</option>
                          <option value="LASER-01" className="bg-[#15151A]">LASER-01</option>
                          <option value="ROB-03" className="bg-[#15151A]">ROB-03</option>
                        </select>
                      </div>

                      {/* Filtro Status */}
                      <div className="flex items-center bg-[#15151A] border border-[#1E1E24] rounded-lg px-2.5 py-1.5 gap-2">
                        <Sliders className="w-3 h-3 text-slate-400" />
                        <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Status:</span>
                        <select
                          value={traceStatusFilter}
                          onChange={(e) => setTraceStatusFilter(e.target.value)}
                          className="bg-transparent text-xs text-slate-200 focus:outline-none font-mono cursor-pointer"
                        >
                          <option value="ALL" className="bg-[#15151A]">Todos</option>
                          <option value="APPROVED" className="bg-[#15151A]">Aprovado</option>
                          <option value="REWORK" className="bg-[#15151A]">Retrabalho</option>
                          <option value="REJECTED" className="bg-[#15151A]">Rejeitado</option>
                        </select>
                      </div>

                      {/* Botão Exportar CSV */}
                      <button
                        onClick={() => {
                          // Generate headers
                          const headers = [
                            "ID Peca",
                            "Maquina Origem",
                            "Lote de Fabricacao",
                            "Temperatura (C)",
                            "Vibracao (G)",
                            "Status Metrologico",
                            "Operador",
                            "Linha/Setor",
                            "Timestamp"
                          ];

                          // Map rows
                          const rows = inspections
                            .filter((i) => {
                              const matchSearch = 
                                i.id.toLowerCase().includes(traceSearch.toLowerCase()) || 
                                i.batch.toLowerCase().includes(traceSearch.toLowerCase()) ||
                                (i.operator && i.operator.toLowerCase().includes(traceSearch.toLowerCase())) ||
                                (i.buyerName && i.buyerName.toLowerCase().includes(traceSearch.toLowerCase())) ||
                                (i.partName && i.partName.toLowerCase().includes(traceSearch.toLowerCase()));
                              const matchStatus = traceStatusFilter === "ALL" || i.status.toUpperCase() === traceStatusFilter.toUpperCase();
                              const matchMachine = traceMachineFilter === "ALL" || i.machineId.toUpperCase() === traceMachineFilter.toUpperCase();
                              return matchSearch && matchStatus && matchMachine;
                            })
                            .map((i) => {
                              let line = "Estação Central";
                              if (i.machineId === "CNC-01") line = "Linha Alpha";
                              else if (i.machineId === "CNC-02") line = "Linha Beta";
                              else if (i.machineId === "LASER-01") line = "Linha Gamma";
                              else if (i.machineId === "ROB-03") line = "Estação Montagem";

                              return [
                                i.id,
                                i.machineId,
                                i.batch,
                                i.temperatureCelsius.toFixed(1),
                                i.vibrationG.toFixed(2),
                                i.status === "approved" ? "APROVADO" : i.status === "rework" ? "RETRABALHO" : "REJEITADO",
                                i.operator || "Operador Geral",
                                line,
                                new Date(i.timestamp).toLocaleString("pt-BR")
                              ];
                            });

                          // Create CSV content
                          const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
                            + [headers.join(";"), ...rows.map(e => e.map(val => `"${val}"`).join(";"))].join("\n");
                          
                          const encodedUri = encodeURI(csvContent);
                          const link = document.createElement("a");
                          link.setAttribute("href", encodedUri);
                          link.setAttribute("download", `rastreabilidade_qualidade_${Date.now()}.csv`);
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                        className="flex items-center gap-1.5 bg-[#0091FF] hover:bg-[#0076D1] text-white text-[11px] font-bold font-sans uppercase px-3 py-2 rounded-lg transition-all cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Exportar CSV/Excel
                      </button>

                    </div>
                  </div>

                  {/* INTERACTIVE HIGH-PERFORMANCE TABLE */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        {/* FIRST LAYER HEADER - MAIN CATEGORIES */}
                        <tr className="border-b border-[#1E1E24] bg-[#15151A]/20 text-[#666666] font-mono text-[9px] uppercase tracking-wider">
                          <th className="py-2.5 px-4" colSpan={3}>Identificação Básica</th>
                          <th className="border-l border-r border-[#1E1E24] text-center bg-[#0091FF]/5 text-[#0091FF] font-bold py-1 px-4" colSpan={2}>Telemetria de Processo</th>
                          <th className="py-2.5 px-4 text-center" colSpan={1}>Qualidade</th>
                          <th className="py-2.5 px-4" colSpan={2}>Operação</th>
                        </tr>
                        {/* SECOND LAYER HEADER - DETAILED SUB-COLUMNS */}
                        <tr className="border-b border-[#1E1E24] text-slate-400 font-mono font-bold text-[10.5px]">
                          <th className="py-3 px-4">ID Peça</th>
                          <th className="py-3 px-2">Máquina Origem</th>
                          <th className="py-3 px-2">Lote</th>
                          <th className="py-3 px-4 bg-[#0091FF]/5 font-bold text-center text-slate-300 border-l border-[#1E1E24]">Temperatura (°C)</th>
                          <th className="py-3 px-4 bg-[#0091FF]/5 font-bold text-center text-slate-300 border-r border-[#1E1E24]">Vibração (G)</th>
                          <th className="py-3 px-4 text-center">Status Metrológico</th>
                          <th className="py-3 px-4 text-left">Operador / Linha</th>
                          <th className="py-3 px-4 text-right">Data & Horário</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1E1E24] font-mono">
                        {inspections
                          .filter((i) => {
                            const matchSearch = 
                              i.id.toLowerCase().includes(traceSearch.toLowerCase()) || 
                              i.batch.toLowerCase().includes(traceSearch.toLowerCase()) ||
                              (i.operator && i.operator.toLowerCase().includes(traceSearch.toLowerCase())) ||
                              (i.buyerName && i.buyerName.toLowerCase().includes(traceSearch.toLowerCase())) ||
                              (i.partName && i.partName.toLowerCase().includes(traceSearch.toLowerCase()));
                            const matchStatus = traceStatusFilter === "ALL" || i.status.toUpperCase() === traceStatusFilter.toUpperCase();
                            const matchMachine = traceMachineFilter === "ALL" || i.machineId.toUpperCase() === traceMachineFilter.toUpperCase();
                            return matchSearch && matchStatus && matchMachine;
                          })
                          .map((i) => {
                            let line = "Estação Central";
                            let lineBg = "bg-slate-950 text-slate-400 border border-slate-800/40";
                            if (i.machineId === "CNC-01") {
                              line = "Linha Alpha";
                              lineBg = "bg-blue-950/40 text-blue-400 border border-blue-900/40";
                            } else if (i.machineId === "CNC-02") {
                              line = "Linha Beta";
                              lineBg = "bg-amber-950/40 text-amber-500 border border-amber-800/40";
                            } else if (i.machineId === "LASER-01") {
                              line = "Linha Gamma";
                              lineBg = "bg-purple-950/40 text-purple-400 border border-purple-900/30";
                            } else if (i.machineId === "ROB-03") {
                              line = "Linha Delta";
                              lineBg = "bg-[#00E676]/10 text-[#00E676] border border-[#00E676]/20";
                            }

                            return (
                              <React.Fragment key={i.id}>
                                <tr 
                                  className="hover:bg-[#1E1E24]/60 transition-all group"
                                >
                                  {/* ID PEÇA WITH LINK TO POP OVER MODAL AND PROCESS TOGGLE */}
                                  <td className="py-3 px-4 font-bold">
                                    <button
                                      onClick={() => setSelectedTracePart(i)}
                                      className="text-[#0091FF] hover:text-[#33a7ff] hover:underline cursor-pointer flex items-center gap-1.5"
                                    >
                                      <span>{i.id}</span>
                                      <ArrowUpRight className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                    {/* Info Cliente e Peça */}
                                    <div className="flex flex-col gap-0.5 mt-1 font-sans text-[10.5px] font-normal leading-tight">
                                      <div className="flex items-center gap-1">
                                        <span className="text-[#00E676] font-mono text-[8.5px] uppercase tracking-wider font-bold">Peça:</span>
                                        <span className="text-slate-350 font-semibold">{i.partName || "Mancal Desconhecido"}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <span className="text-slate-500 font-mono text-[8.5px] uppercase tracking-wider font-bold">Cliente:</span>
                                        <span className="text-slate-400 font-medium">{i.buyerName || "Indústria Geral"}</span>
                                      </div>
                                    </div>
                                    
                                    {/* Process Expander trigger */}
                                    <button
                                      onClick={() => setExpandedPartId(expandedPartId === i.id ? null : i.id)}
                                      className="mt-2 text-[9.5px] font-sans font-bold flex items-center gap-0.5 text-[#0091FF] hover:text-[#33a7ff] cursor-pointer bg-[#0091FF]/10 hover:bg-[#0091FF]/20 px-2 py-0.5 rounded transition-all"
                                    >
                                      {expandedPartId === i.id ? (
                                        <>
                                          <ChevronUp className="w-2.5 h-2.5" />
                                          <span>Ocultar Processo</span>
                                        </>
                                      ) : (
                                        <>
                                          <ChevronDown className="w-2.5 h-2.5" />
                                          <span>Roteiro do Processo</span>
                                        </>
                                      )}
                                    </button>
                                  </td>

                                  {/* MÁQUINA ORIGEM */}
                                  <td className="py-3 px-2">
                                    <span className="font-bold text-slate-300">{i.machineId}</span>
                                  </td>

                                  {/* LOTE DE FABRICAÇÃO */}
                                  <td className="py-3 px-2">
                                    <span className="text-slate-400 text-[11px]">{i.batch}</span>
                                  </td>

                                  {/* TELEMETRIA: TEMPERATURA */}
                                  <td className="py-3 px-4 text-center border-l border-[#1E1E24] bg-[#0091FF]/5">
                                    <span className={`font-semibold inline-flex items-center px-1.5 py-0.5 rounded ${i.temperatureCelsius > 24 ? 'text-[#FF9100] bg-[#FF9100]/10 font-bold' : 'text-emerald-400 bg-emerald-950/10'}`}>
                                      {i.temperatureCelsius.toFixed(1)}°C
                                    </span>
                                  </td>

                                  {/* TELEMETRIA: VIBRAÇÃO */}
                                  <td className="py-3 px-4 text-center border-r border-[#1E1E24] bg-[#0091FF]/5">
                                    <span className={`font-semibold inline-flex items-center px-1.5 py-0.5 rounded ${i.vibrationG > 0.45 ? 'text-[#FF3D00] bg-[#FF3D00]/10 font-bold' : 'text-slate-300 bg-slate-900/40'}`}>
                                      {i.vibrationG.toFixed(2)} G
                                    </span>
                                  </td>

                                  {/* STATUS METROLÓGICO */}
                                  <td className="py-3 px-4 text-center">
                                    <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-center ${
                                      i.status === 'approved' 
                                        ? 'bg-emerald-950/40 text-emerald-405 border border-emerald-800/40' 
                                        : i.status === 'rework'
                                          ? 'bg-amber-950/40 text-amber-500 border border-amber-800/40'
                                          : 'bg-red-950/40 text-red-400 border border-red-800/40'
                                    }`}>
                                      {i.status === 'approved' ? '✔ Aprovado' : i.status === 'rework' ? '⚠ Retrabalho' : '✖ Rejeitado'}
                                    </span>
                                  </td>

                                  {/* OPERADOR / LINHA */}
                                  <td className="py-3 px-4 text-slate-300">
                                    <div className="flex flex-col">
                                      <span className="font-sans font-medium text-xs text-slate-200">{i.operator || 'Operador Geral'}</span>
                                      <span className={`inline-block self-start text-[9.5px] px-1.5 py-0.2 rounded mt-0.5 font-bold ${lineBg}`}>
                                        {line}
                                      </span>
                                    </div>
                                  </td>

                                  {/* TIMESTAMP */}
                                  <td className="py-3 px-4 text-right text-slate-500 text-[11px]">
                                    <span className="block font-semibold text-slate-400">{new Date(i.timestamp).toLocaleTimeString("pt-BR")}</span>
                                    <span className="block text-[9.5px] text-slate-600">{new Date(i.timestamp).toLocaleDateString("pt-BR")}</span>
                                  </td>
                                </tr>

                                {/* COLLAPSIBLE PRODUCTION PROCESS TIME-LINE DETAIL */}
                                {expandedPartId === i.id && (
                                  <tr className="bg-[#0A0A0C]/80 border-b border-[#1E1E24]">
                                    <td colSpan={8} className="py-4 px-6">
                                      <div className="bg-[#15151A]/30 border border-[#1E1E24] rounded-xl p-5 space-y-4 font-sans select-text">
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#1E1E24] pb-2.5">
                                          <div className="flex items-center gap-2">
                                            <Layers className="w-4 h-4 text-[#0091FF] shrink-0" />
                                            <div>
                                              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">PROCESSO DETALHADO DO COMPONENTE</span>
                                              <h5 className="text-xs font-bold text-white uppercase tracking-wider">Histórico de Máquinas e Roteiro de Calibração</h5>
                                            </div>
                                          </div>
                                          {i.status === 'rejected' && (
                                            <span className="px-2.5 py-0.5 rounded text-[9px] bg-red-950/50 text-red-405 border border-red-800/40 font-mono font-bold uppercase tracking-widest animate-pulse">
                                               Peça Virou Refugo (Desconformidade)
                                            </span>
                                          )}
                                        </div>

                                        {/* Timeline Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                          {i.routingSteps && i.routingSteps.length > 0 ? (
                                            i.routingSteps.map((step, idx) => (
                                              <div key={idx} className="bg-[#0A0A0C] border border-[#1E1E24] rounded-lg p-3 space-y-1.5">
                                                <div className="flex items-center justify-between">
                                                  <div className="flex items-center gap-1.5">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-[#0091FF]" />
                                                    <span className="font-mono text-xs font-black text-[#0091FF]">{step.machineId}</span>
                                                  </div>
                                                  <span className="text-[9.5px] text-slate-500 font-mono flex items-center gap-0.5">
                                                    <Clock className="w-2.5 h-2.5 text-slate-600" />
                                                    {step.timestamp}
                                                  </span>
                                                </div>
                                                <p className="text-[10.5px] text-slate-300 leading-snug font-mono">
                                                  {step.machineNotes || "Etapa executada conformemente conforme especificações de projeto."}
                                                </p>
                                              </div>
                                            ))
                                          ) : (
                                            <div className="text-slate-500 italic text-[11px] p-2 col-span-full font-mono">
                                              Sem percurso IoT registrado para esta peça no histórico.
                                            </div>
                                          )}
                                        </div>

                                        {/* Status Detail Card */}
                                        <div className="p-3 bg-[#0A0A0C] border border-[#1E1E24] rounded-lg space-y-1">
                                          <span className="text-[9px] font-mono text-[#666666] uppercase block font-bold">Diagnóstico Geral e Co-Piloto de Linha</span>
                                          {i.status === 'rejected' ? (
                                            <div className="space-y-1 mt-1.5">
                                              <p className="text-xs text-red-400 font-bold flex items-center gap-1.5 font-mono">
                                                <AlertTriangle className="w-3.5 h-3.5 text-red-500 fill-red-950/20" />
                                                <span>MOTIVO DO REFUGO: {i.defectType || 'Tolerância metrológica extrapolada.'}</span>
                                              </p>
                                              <p className="text-xs text-slate-350 leading-relaxed font-mono">
                                                "{i.notes || 'Peça descartada após medição revelar desvio geométrico crítico incompatível com acoplamento mecânico de precisão.'}"
                                              </p>
                                            </div>
                                          ) : (
                                            <p className="text-[11.5px] text-emerald-400 font-mono flex items-center gap-1 font-semibold mt-1">
                                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                                              <span>Peça certificada com sucesso e liberada para faturamento / expedição.</span>
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>

                  {/* EMPTY SEARCH STATE FOOTER */}
                  {inspections.filter((i) => {
                    const matchSearch = 
                      i.id.toLowerCase().includes(traceSearch.toLowerCase()) || 
                      i.batch.toLowerCase().includes(traceSearch.toLowerCase()) ||
                      (i.operator && i.operator.toLowerCase().includes(traceSearch.toLowerCase())) ||
                      (i.buyerName && i.buyerName.toLowerCase().includes(traceSearch.toLowerCase())) ||
                      (i.partName && i.partName.toLowerCase().includes(traceSearch.toLowerCase()));
                    const matchStatus = traceStatusFilter === "ALL" || i.status.toUpperCase() === traceStatusFilter.toUpperCase();
                    const matchMachine = traceMachineFilter === "ALL" || i.machineId.toUpperCase() === traceMachineFilter.toUpperCase();
                    return matchSearch && matchStatus && matchMachine;
                  }).length === 0 && (
                    <div className="p-12 text-center text-xs text-slate-500 font-sans border-t border-[#1E1E24]">
                      Nenhuma peça encontrada com os parâmetros configurados.
                    </div>
                  )}

                </div>

              </div>

            </div>

          </div>
        )}

        {/* 2. MEDIÇÃO TRIDIMENSIONAL / INSPECTION TAB */}
        {activeTab === 'inspection' && (
          <div className="space-y-6">
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* VIRTUAL ZEISS METROLOGICAL SCANNER BLOCK AND SIMULATOR */}
              <div className="lg:col-span-2 bg-[#0F0F12] border border-[#1E1E24] rounded-xl flex flex-col overflow-hidden">
                <div className="px-5 py-4 border-b border-[#1E1E24] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#15151A]/50">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#0091FF]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-white">Estação Metrológica Virtual Zeiss Link PRO</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Selecionar Medição:</span>
                    <select
                      value={scanningPart?.id || ""}
                      onChange={(e) => {
                        const selectedPart = inspections.find(i => i.id === e.target.value);
                        if (selectedPart) {
                          setScanningPart(selectedPart);
                          // Trigger scanner sequence
                          setIsScanningActive(true);
                          setScanProgress(0);
                          let progress = 0;
                          const progressTimer = setInterval(() => {
                            progress += 10;
                            setScanProgress(progress);
                            if (progress >= 100) {
                              clearInterval(progressTimer);
                              setIsScanningActive(false);
                            }
                          }, 100);
                        }
                      }}
                      className="bg-[#0A0A0C] border border-[#1E1E24] text-slate-200 text-xs px-2 py-1 rounded font-mono focus:outline-none focus:border-[#0091FF] cursor-pointer"
                    >
                      <option value="" disabled>-- Selecione para Escanear --</option>
                      {inspections.map(i => (
                        <option key={i.id} value={i.id}>
                          {i.id} - {i.partName || "Mancal"} (Lote: {i.batch})
                        </option>
                      ))}
                    </select>
                    {scanningPart && (
                      <span className="px-2 py-0.5 bg-[#0091FF]/10 text-[#0091FF] text-[9px] rounded border border-[#0091FF]/30 font-mono">
                        {scanningPart.id}
                      </span>
                    )}
                  </div>
                </div>

                {/* VISUAL SCANNING BOX WITH METRIC TARGET CROSS */}
                <div className="flex-1 min-h-[420px] bg-black relative flex items-center justify-center p-8 overflow-hidden border-b border-[#1E1E24]">
                  
                  {/* METRIC CROSSHAIRS & MEASUREMENT BOUNDING BOX OVERLAYS */}
                  <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#0091FF 1.5px, transparent 1.5px)', backgroundSize: '30px 30px' }} />
                  
                  {/* Zeiss scope circle */}
                  <div className="absolute w-[360px] h-[360px] border border-[#0091FF]/10 rounded-full flex items-center justify-center pointer-events-none">
                    <div className="absolute w-[240px] h-[240px] border border-dashed border-[#0091FF]/25 rounded-full" />
                    <div className="absolute w-[120px] h-[120px] border border-[#0091FF]/35 rounded-full" />
                  </div>

                  <div className="absolute h-full w-[1px] bg-slate-900 border-l border-dashed border-slate-800" />
                  <div className="absolute w-full h-[1px] bg-slate-900 border-t border-dashed border-slate-800" />

                  {/* ACTIVE PART RENDER WITH SWEEP BAR */}
                  {scanningPart ? (
                    <div className="relative z-10 flex flex-col items-center">
                      
                      {/* Geometric representation of a high precision engine gear */}
                      <div className="w-52 h-52 relative rounded-full bg-slate-950 border-4 border-slate-800 flex items-center justify-center shadow-[0_0_50px_rgba(0,145,255,0.05)] animate-spin-slow">
                        <div className="absolute -inset-1.5 border border-dashed border-slate-700 rounded-full" />
                        
                        {/* Cog teeth simulated around */}
                        {[...Array(12)].map((_, i) => (
                          <div 
                            key={i} 
                            style={{ transform: `rotate(${i * 30}deg)` }} 
                            className="absolute -top-3 w-4 h-6 border-t border-r border-[#1E1E24] bg-[#0A0A0C] origin-bottom rounded-t-sm"
                          />
                        ))}

                        {/* Zeiss focal points */}
                        <div className="absolute inset-10 border-4 border-slate-900 bg-slate-950 rounded-full flex items-center justify-center">
                          <span className={`text-[10px] font-mono font-bold ${
                            scanningPart.status === 'approved' ? 'text-[#00E676]' : scanningPart.status === 'rework' ? 'text-[#FFB300]' : 'text-[#FF3D00]'
                          }`}>
                            {scanningPart.status.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {/* SCANNING LASER RAY SWEEP */}
                      {isScanningActive && (
                        <div 
                          style={{ top: `${scanProgress}%` }}
                          className="absolute left-[-50px] right-[-50px] h-[2px] bg-[#0091FF] shadow-[0_0_20px_#0091FF] z-20 pointer-events-none transition-all duration-150"
                        />
                      )}

                      {/* Coordinate Overlay */}
                      <div className="absolute bottom-[-15px] left-[-70px] text-left font-mono text-[10px] text-[#0091FF]/80 p-2 bg-[#0A0A0C]/90 rounded border border-[#1E1E24]">
                        L_DEV: {scanningPart.deviations.lengthMm > 0 ? `+${scanningPart.deviations.lengthMm}` : scanningPart.deviations.lengthMm} mm<br />
                        W_DEV: {scanningPart.deviations.widthMm > 0 ? `+${scanningPart.deviations.widthMm}` : scanningPart.deviations.widthMm} mm<br />
                        H_DEV: {scanningPart.deviations.heightMm > 0 ? `+${scanningPart.deviations.heightMm}` : scanningPart.deviations.heightMm} mm
                      </div>

                      <div className="absolute top-[-15px] right-[-70px] text-right font-mono text-[10px] text-[#888888] p-2 bg-[#0A0A0C]/90 rounded border border-[#1E1E24]">
                        S_TEMP: {scanningPart.temperatureCelsius}°C<br />
                        VIBG: {scanningPart.vibrationG}G<br />
                        BATCH: {scanningPart.batch}
                      </div>

                    </div>
                  ) : (
                    <div className="text-center text-[#666666] font-mono text-xs">
                      [ NENHUM LOTE DE PROTEÇÃO CARREGADO ]<br />
                      Envie dados no formulário para iniciar varredura.
                    </div>
                  )}

                </div>

                {/* NOVO PAINEL DE TELEMETRIA DO MAQUINÁRIO E PROBABILIDADE DE DESCONFORMIDADE (FALHA) */}
                {scanningPart && (
                  <div className="border-t border-[#1E1E24] p-5 bg-[#0A0A0C] grid grid-cols-1 md:grid-cols-2 gap-5 font-sans">
                    
                    {/* COL 1: INFORMAÇÕES DO MAQUINÁRIO */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Settings2 className="w-4 h-4 text-[#0091FF]" />
                        <span className="text-[11px] font-mono uppercase font-bold tracking-wider text-slate-400">
                          Operação & Dados no Maquinário
                        </span>
                      </div>
                      
                      {(() => {
                        const linkedMachine = machines.find(m => m.id === scanningPart.machineId);
                        return (
                          <div className="bg-[#15151A]/40 border border-[#1E1E24] p-3.5 rounded-xl space-y-2.5">
                            <div className="flex items-start justify-between">
                              <div>
                                <span className="text-[9px] font-mono text-slate-500 block">MAQUINÁRIO IOT ATIVO</span>
                                <span className="text-xs font-bold text-white block">
                                  {scanningPart.machineId} — {linkedMachine?.name || "Torno CNC Multi-Eixo"}
                                </span>
                              </div>
                              <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider ${
                                linkedMachine?.status === 'operacional' 
                                  ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/40' 
                                  : 'bg-amber-950/40 text-amber-400 border border-amber-80 * 0.4/40'
                              }`}>
                                {linkedMachine?.status === 'operacional' ? '● ONLINE' : '⚠ ALERTA'}
                              </span>
                            </div>

                            <div className="grid grid-cols-3 gap-2 pt-1.5 border-t border-[#1E1E24]/60 text-xs">
                              <div>
                                <span className="text-[9px] font-mono text-slate-500 uppercase block">Temp. Motor</span>
                                <span className="font-mono text-slate-300 font-bold block mt-0.5">
                                  {linkedMachine?.temperature || scanningPart.temperatureCelsius}°C
                                </span>
                              </div>
                              <div>
                                <span className="text-[9px] font-mono text-slate-500 uppercase block">Vibração</span>
                                <span className="font-mono text-slate-300 font-bold block mt-0.5">
                                  {linkedMachine?.vibration || scanningPart.vibrationG} G
                                </span>
                              </div>
                              <div>
                                <span className="text-[9px] font-mono text-slate-500 uppercase block">OEE Geral</span>
                                <span className="font-mono text-[#00E676] font-bold block mt-0.5">
                                  {linkedMachine?.oee || 88}%
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* COL 2: PORCENTAGEM DA PEÇA DAR ERRADO */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-red-500" />
                        <span className="text-[11px] font-mono uppercase font-bold tracking-wider text-slate-400">
                          Porcentagem Probabilística de Falha / Erro
                        </span>
                      </div>

                      {(() => {
                        const riskVal = (() => {
                          const lDevRatio = Math.abs(scanningPart.deviations?.lengthMm || 0) / 0.05;
                          const wDevRatio = Math.abs(scanningPart.deviations?.widthMm || 0) / 0.03;
                          const hDevRatio = Math.abs(scanningPart.deviations?.heightMm || 0) / 0.02;
                          const maxDimRatio = Math.max(lDevRatio, wDevRatio, hDevRatio);
                          
                          const tempRisk = Math.max(0, (scanningPart.temperatureCelsius - 21.0) / 5.0);
                          const vibRisk = Math.max(0, (scanningPart.vibrationG - 0.1) / 0.4);
                          
                          let baseRisk = 0;
                          if (scanningPart.status === 'approved') {
                            baseRisk = (maxDimRatio * 15) + (tempRisk * 10) + (vibRisk * 10);
                            return Math.min(35, Math.max(2, Math.round(baseRisk)));
                          } else if (scanningPart.status === 'rework') {
                            baseRisk = 50 + (maxDimRatio * 20) + (tempRisk * 15);
                            return Math.min(85, Math.max(40, Math.round(baseRisk)));
                          } else {
                            baseRisk = 85 + (maxDimRatio * 10);
                            return Math.min(100, Math.max(86, Math.round(baseRisk)));
                          }
                        })();

                        let riskColor = "bg-[#00E676]";
                        let textRisk = "Baixo Risco (Alta Conformidade)";
                        let cardBg = "border-[#00E676]/25 bg-emerald-950/10";
                        if (riskVal >= 86) {
                          riskColor = "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)] animate-pulse";
                          textRisk = "Refugo / Descarte Imediato";
                          cardBg = "border-red-900/40 bg-red-950/10 text-red-400";
                        } else if (riskVal >= 40) {
                          riskColor = "bg-amber-400";
                          textRisk = "Retrabalho / Desvio Moderado";
                          cardBg = "border-amber-900/40 bg-amber-950/10 text-amber-500";
                        }

                        return (
                          <div className={`border p-3.5 rounded-xl space-y-3 transition-colors ${cardBg}`}>
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-bold text-white block uppercase text-[10.5px]">
                                Probabilidade Total da Peça Falhar / Dar Errado:
                              </span>
                              <span className="text-sm font-black font-mono tracking-tight text-white">
                                {riskVal}%
                              </span>
                            </div>

                            <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-[#1E1E24]">
                              <div 
                                className={`h-full transition-all duration-1000 ${riskColor}`}
                                style={{ width: `${riskVal}%` }}
                              />
                            </div>

                            <div className="flex items-center gap-1 text-[10px] font-mono font-bold justify-between">
                              <span className="uppercase">{textRisk}</span>
                              <span className="text-slate-500 font-semibold">{riskVal < 40 ? "Apto p/ Linha" : riskVal < 86 ? "Ajuste Recom." : "Fora de Tolerância"}</span>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                )}

                {/* BOTTOM METROLOGY STATE HIGHLIGHT */}
                {scanningPart && (
                  <div className="bg-[#15151A] p-5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <span className="text-[9px] text-[#666666] uppercase block font-mono">STATUS DE INSPEÇÃO</span>
                        <span className={`text-base font-black ${
                          scanningPart.status === 'approved' ? 'text-[#00E676]' : scanningPart.status === 'rework' ? 'text-[#FFB300]' : 'text-[#FF3D00]'
                        }`}>
                          {scanningPart.status === 'approved' ? '✓ PEÇA CONFORME (LIBERADO)' : scanningPart.status === 'rework' ? '⚡ RE-CALIBRAÇÃO PENDENTE (RETRABALHO)' : '✗ SUCATA / REJEITADO'}
                        </span>
                      </div>
                      <div className="hidden sm:block border-l border-[#1E1E24] pl-4">
                        <span className="text-[9px] text-[#666666] uppercase block font-mono">CALIBRADOR RESPONSÁVEL</span>
                        <span className="text-xs font-mono text-white">{scanningPart.operator}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          setIsScanningActive(true);
                          setScanProgress(0);
                          let progress = 0;
                          const progressTimer = setInterval(() => {
                            progress += 10;
                            setScanProgress(progress);
                            if (progress >= 100) {
                              clearInterval(progressTimer);
                              setIsScanningActive(false);
                            }
                          }, 100);
                        }}
                        className="px-4 py-2 border border-[#1E1E24] hover:bg-[#1E1E24] text-white text-xs font-bold uppercase rounded cursor-pointer pointer-events-auto"
                      >
                        Varrer Novamente (Laser)
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* SIDEBAR DETAILED CHARACTERISTICS AND IA COMPENSATIONS */}
              <div className="space-y-6">
                
                <div className="bg-[#0F0F12] border border-[#1E1E24] rounded-xl p-5">
                  <span className="text-[9px] font-mono text-[#666666] uppercase tracking-wider block mb-1">Rastreabilidade Avançada</span>
                  <h3 className="text-sm font-bold text-white mb-4 uppercase">Parâmetros Microscópicos</h3>

                  {scanningPart ? (
                    <div className="space-y-4">
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-slate-400">Comprimento Mm:</span>
                          <span className="text-white font-bold">{scanningPart.measurements.lengthMm} mm</span>
                        </div>
                        <div className="flex justify-between text-[10px] font-mono">
                          <span className="text-slate-500">Desvio:</span>
                          <span className={scanningPart.deviations.lengthMm > 0.05 || scanningPart.deviations.lengthMm < -0.05 ? 'text-[#FF3D00]' : 'text-[#00E676]'}>
                            {scanningPart.deviations.lengthMm > 0 ? `+${scanningPart.deviations.lengthMm}` : scanningPart.deviations.lengthMm}
                          </span>
                        </div>
                        <div className="w-full bg-[#1A1A1F] h-1 rounded-full overflow-hidden">
                          <div className={`h-full ${Math.abs(scanningPart.deviations.lengthMm) > 0.05 ? 'bg-red-500' : 'bg-cyan-500'}`} style={{ width: `${Math.min(100, (Math.abs(scanningPart.deviations.lengthMm) / 0.1) * 100)}%` }} />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-slate-400">Largura Mm:</span>
                          <span className="text-white font-bold">{scanningPart.measurements.widthMm} mm</span>
                        </div>
                        <div className="flex justify-between text-[10px] font-mono">
                          <span className="text-slate-500">Desvio:</span>
                          <span className={scanningPart.deviations.widthMm > 0.03 || scanningPart.deviations.widthMm < -0.03 ? 'text-[#FF3D00]' : 'text-[#00E676]'}>
                            {scanningPart.deviations.widthMm > 0 ? `+${scanningPart.deviations.widthMm}` : scanningPart.deviations.widthMm}
                          </span>
                        </div>
                        <div className="w-full bg-[#1A1A1F] h-1 rounded-full overflow-hidden">
                          <div className={`h-full ${Math.abs(scanningPart.deviations.widthMm) > 0.03 ? 'bg-red-500' : 'bg-cyan-500'}`} style={{ width: `${Math.min(100, (Math.abs(scanningPart.deviations.widthMm) / 0.06) * 100)}%` }} />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-slate-400">Altura Mm:</span>
                          <span className="text-white font-bold">{scanningPart.measurements.heightMm} mm</span>
                        </div>
                        <div className="flex justify-between text-[10px] font-mono">
                          <span className="text-slate-500">Desvio:</span>
                          <span className={scanningPart.deviations.heightMm > 0.02 || scanningPart.deviations.heightMm < -0.02 ? 'text-[#FF3D00]' : 'text-[#00E676]'}>
                            {scanningPart.deviations.heightMm > 0 ? `+${scanningPart.deviations.heightMm}` : scanningPart.deviations.heightMm}
                          </span>
                        </div>
                        <div className="w-full bg-[#1A1A1F] h-1 rounded-full overflow-hidden">
                          <div className={`h-full ${Math.abs(scanningPart.deviations.heightMm) > 0.02 ? 'bg-red-500' : 'bg-cyan-500'}`} style={{ width: `${Math.min(100, (Math.abs(scanningPart.deviations.heightMm) / 0.04) * 100)}%` }} />
                        </div>
                      </div>

                      <div className="border-t border-[#1E1E24] pt-4 text-xs">
                        <span className="text-slate-400 block mb-1 font-mono text-[10px]">Observações de Linha:</span>
                        <p className="bg-[#0A0A0C] p-3 rounded text-slate-300 font-mono leading-relaxed text-[11px] border border-[#1E1E24]">
                          {scanningPart.notes || "Nenhuma anotação manual anexada."}
                        </p>
                      </div>

                      {scanningPart.status !== 'approved' && (
                        <div className="p-3 bg-[#FFB300]/10 border border-[#FFB300]/30 rounded-lg">
                          <div className="flex items-center gap-1.5 text-[#FFB300] font-bold text-xs mb-1.5">
                            <Sparkles className="w-4 h-4 animate-spin-slow" />
                            <span>CO-PILOTO IA RECOMENDAÇÃO:</span>
                          </div>
                          <p className="text-[11px] text-slate-200 leading-relaxed font-mono">
                            O desvio de <span className="font-bold underline text-[#FF3D00]">{scanningPart.defectType || 'tolerância'}</span> detectado foi provocado por flutuação térmica ({scanningPart.temperatureCelsius}°C). Insira um offset corretivo de <span className="font-bold text-[#00E676]">-0.045mm</span> no cabeçote spindle da máquina {scanningPart.machineId} ou rebaixe em 10% a aceleração planar.
                          </p>
                        </div>
                      )}

                    </div>
                  ) : (
                    <span className="text-xs text-slate-500">Inspeção offline.</span>
                  )}

                </div>

                <div className="bg-[#0F0F12] border border-[#1E1E24] rounded-xl p-5">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5">Normativas e Veracidade</h4>
                  <div className="space-y-2 text-[11px] text-slate-400">
                    <p>✓ Calibração homologada segundo preceitos industriais internacionais de metrologia tridimensional Zeiss.</p>
                    <p>✓ Medição automatizada de excentricidade, concentricidade e desvio micrométrico axial.</p>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* 3. METROLOGIA SEMESTRAL & COMPLIANCE ISO TAB */}
        {activeTab === 'factory' && (() => {
          // Dynamic calculation of the current semester metrics based on live state inside inspections
          const currentPecas = 2450 + totalInspected;
          const currentDiscards = 58 + rejectedInspections.length;
          const baselineApproved = 2357;
          const currentApproved = baselineApproved + approvedInspections.length;
          const currentQuality = Number(((currentApproved / currentPecas) * 100).toFixed(2));
          const currentScrapRate = Number(((currentDiscards / currentPecas) * 100).toFixed(2));

          const semesterHistory = [
            { id: "1S24", periodo: "Primeiro Semestre (1S24)", pecas: 1240, qualidade: 94.80, descartes: 48, scrapRate: 3.87, compliance9001: false },
            { id: "2S24", periodo: "Segundo Semestre (2S24)", pecas: 1450, qualidade: 95.20, descartes: 38, scrapRate: 2.62, compliance9001: true },
            { id: "1S25", periodo: "Primeiro Semestre (1S25)", pecas: 1820, qualidade: 96.10, descartes: 41, scrapRate: 2.25, compliance9001: true },
            { id: "2S25", periodo: "Segundo Semestre (2S25)", pecas: 2100, qualidade: 95.80, descartes: 55, scrapRate: 2.61, compliance9001: true },
            { id: "1S26", periodo: "Semestre Atual (1S26)", pecas: currentPecas, qualidade: currentQuality, descartes: currentDiscards, scrapRate: currentScrapRate, compliance9001: currentQuality >= 95.0 }
          ];

          return (
            <div className="space-y-6">
              
              {/* COMPLIANCE OVERVIEW INTRO */}
              <div className="bg-[#0F0F12] border border-[#1E1E24] rounded-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-5 opacity-10 pointer-events-none">
                  <ShieldCheck className="w-24 h-24 text-[#0091FF]" />
                </div>
                <div className="max-w-3xl">
                  <span className="text-[10px] bg-[#0091FF]/10 text-[#0091FF] border border-[#0091FF]/20 px-2.5 py-1 rounded font-mono font-bold uppercase tracking-widest">
                    Histórico de 6 em 6 Meses
                  </span>
                  <h3 className="text-xl font-bold text-white mt-3 uppercase tracking-tight font-sans">Qualidade Semestral & Certificação ISO</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Aqui você acompanha a saúde do nosso pátio fabril analisada em blocos semestrais. O sistema extrai e valida as medições automaticamente para conferir o selo de conformidade internacional.
                  </p>
                </div>
              </div>

              {/* SIMPLIFIED 3-INDICATOR ROW */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* INDICATOR 1: ISO 9001 */}
                <div className="bg-[#0F0F12] border border-[#1E1E24] rounded-xl p-6 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block mb-1">Qualidade Geral da Fábrica</span>
                    <h4 className="text-sm font-bold text-white flex items-center justify-between gap-2">
                        <span>Padrão ISO 9001</span>
                        {currentQuality >= 95.0 ? (
                          <span className="text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-0.5 rounded font-bold">✓ APROVADO</span>
                        ) : (
                          <span className="text-[10px] text-amber-400 bg-amber-950/40 border border-amber-800/40 px-2.5 py-0.5 rounded font-bold">▲ RECUPERAÇÃO</span>
                        )}
                    </h4>
                    <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                      Nossa meta é assegurar mais de <strong className="text-slate-200">95.0%</strong> de aprovação nas peças escaneadas pela Zeiss.
                    </p>
                  </div>

                  <div className="mt-5 space-y-2">
                    <div className="flex items-baseline justify-between font-mono">
                      <span className="text-3xl font-extralight text-[#0091FF]">{currentQuality}%</span>
                      <span className="text-[10px] text-slate-500">Média Corrente</span>
                    </div>
                    <div className="w-full bg-[#1A1A1F] h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${currentQuality >= 95.0 ? 'bg-[#0091FF]' : 'bg-[#FF3D00]'}`} 
                        style={{ width: `${currentQuality}%` }} 
                      />
                    </div>
                  </div>
                </div>

                {/* INDICATOR 2: ISO 14001 */}
                <div className="bg-[#0F0F12] border border-[#1E1E24] rounded-xl p-6 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block mb-1">Ecoeficiência & Sustentabilidade</span>
                    <h4 className="text-sm font-bold text-white flex items-center justify-between gap-2">
                      <span>Desperdício ISO 14001</span>
                      {currentScrapRate <= 3.0 ? (
                        <span className="text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-0.5 rounded font-bold">✓ EXCELENTE</span>
                      ) : (
                        <span className="text-[10px] text-red-400 bg-red-950/40 border border-red-800/40 px-2.5 py-0.5 rounded font-bold">✗ EXCEDIDO</span>
                      )}
                    </h4>
                    <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                      Controla a quantidade de perda absoluta (refugo). O limiar aceitável é de no máximo <strong className="text-slate-200">3.0%</strong>.
                    </p>
                  </div>

                  <div className="mt-5 space-y-2">
                    <div className="flex items-baseline justify-between font-mono">
                      <span className="text-3xl font-extralight text-emerald-400">{currentScrapRate}%</span>
                      <span className="text-[10px] text-slate-500">Índice Máximo</span>
                    </div>
                    <div className="w-full bg-[#1A1A1F] h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${currentScrapRate <= 3.0 ? 'bg-emerald-400' : 'bg-[#FF3D00]'}`} 
                        style={{ width: `${Math.min(100, (currentScrapRate / 5) * 100)}%` }} 
                      />
                    </div>
                  </div>
                </div>

                {/* INDICATOR 3: AUTOMOTIVE COMPLIANCE */}
                <div className="bg-[#0F0F12] border border-[#1E1E24] rounded-xl p-6 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block mb-1">Selos e Certificados Ativos</span>
                    <h4 className="text-sm font-bold text-white">Status Regulatório</h4>
                    <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                      Sua manufatura está homologada de acordo com as diretrizes específicas Scania para montagem.
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-[#1E1E24]/60 flex items-center justify-between text-xs">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-mono text-slate-500 uppercase font-bold">Ambiental</span>
                      <span className="font-semibold text-emerald-400 mt-0.5">Selo Ativo (14001)</span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-[9px] font-mono text-slate-500 uppercase font-bold">Qualidade</span>
                      <span className="font-semibold text-[#0091FF] mt-0.5">Garantido (9001)</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* SEMESTRES GRAPHIC CHRONOLOGICAL TIMELINE */}
              <div className="bg-[#0F0F12] border border-[#1E1E24] rounded-xl p-6">
                
                <div className="pb-4 border-b border-[#1E1E24] mb-6">
                  <h4 className="text-sm font-bold text-white uppercase font-sans tracking-wide">Evolução Semestral e Histórico</h4>
                  <p className="text-xs text-slate-400 mt-1">Comparação limpa das amostragens metrológicas acumuladas.</p>
                </div>

                <div className="space-y-4">
                  {semesterHistory.map((sem) => {
                    const isSuccess = sem.qualidade >= 95.0;
                    return (
                      <div key={sem.id} className="bg-black/40 border border-[#1E1E24]/60 rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                            isSuccess ? "bg-emerald-950/50 text-emerald-400 border border-emerald-800/60" : "bg-red-950/50 text-red-00 border border-red-800/60"
                          }`}>
                            {isSuccess ? "✓" : "▲"}
                          </div>
                          <div>
                            <span className="text-sm font-bold text-white">{sem.periodo}</span>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              {sem.pecas} escaneadas • <b className="text-red-400 font-normal">{sem.descartes} descartadas (refugo)</b>
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar & Badges right */}
                        <div className="w-full md:w-1/3 space-y-1">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-400">Aproveitamento:</span>
                            <span className={`font-mono font-bold ${isSuccess ? "text-[#00E676]" : "text-amber-500"}`}>{sem.qualidade}%</span>
                          </div>
                          <div className="w-full bg-[#15151A] h-1.5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full duration-1000 transition-all ${
                                sem.qualidade >= 96 ? 'bg-emerald-400' : sem.qualidade >= 95 ? 'bg-[#0091FF]' : 'bg-amber-400'
                              }`} 
                              style={{ width: `${sem.qualidade}%` }}
                            />
                          </div>
                        </div>

                        <div className="shrink-0 text-right">
                          <span className={`inline-block px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                            isSuccess ? "bg-emerald-950/40 text-emerald-400 border border-emerald-800/40" : "bg-amber-950/40 text-amber-400 border border-amber-800/40"
                          }`}>
                            {isSuccess ? "Dentro da Meta" : "Falta Ajuste"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* SIMPLE PORTUGUESE SUMMARY SHEET TABLE */}
                <div className="mt-8 pt-6 border-t border-[#1E1E24] overflow-x-auto">
                  <span className="text-[11px] font-mono text-slate-500 uppercase tracking-widest font-bold block mb-3">Tabela Detalhada de Metrologia</span>
                  <table className="w-full text-left text-xs text-slate-300 font-sans border border-[#1E1E24]/60 rounded-lg">
                    <thead>
                      <tr className="bg-[#15151A]/60 text-slate-400 font-semibold border-b border-[#1E1E24]">
                        <th className="p-3">Período</th>
                        <th className="p-3">Volume Processado</th>
                        <th className="p-3">Descarte (Sucata)</th>
                        <th className="p-3">Taxa de Refugo</th>
                        <th className="p-3 text-right">Selo ISO 9001</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1E1E24]/40 bg-[#0A0A0C]/20">
                      {semesterHistory.map((sem) => (
                        <tr key={sem.id} className="hover:bg-slate-900/20 transition-colors">
                          <td className="p-3 font-semibold text-white">{sem.periodo}</td>
                          <td className="p-3 font-mono text-slate-450">{sem.pecas} un</td>
                          <td className="p-3 font-mono text-red-400">{sem.descartes} un</td>
                          <td className="p-3 text-left">
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold ${sem.scrapRate <= 3.0 ? 'bg-emerald-950/40 text-emerald-400' : 'bg-red-950/40 text-red-500'}`}>
                              {sem.scrapRate.toFixed(2)}%
                            </span>
                          </td>
                          <td className="p-3 text-right font-mono">
                            {sem.qualidade >= 95.0 ? (
                              <span className="text-emerald-400 font-semibold">APROVADA</span>
                            ) : (
                              <span className="text-amber-500 font-semibold">REPROVADA</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>

            </div>
          );
        })()}

        {/* 4. CO-PILOTO IA / CHAT TRÁFEGO IA TAB */}
        {activeTab === 'ia-chat' && (
          <div className="space-y-6">
            {profile.planId === 'professional' ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* THE ACTIVE CHATBOX INTERACTION PANEL */}
                <div className="lg:col-span-2 bg-[#0F0F12] border border-[#1E1E24] rounded-xl flex flex-col h-[520px]">
                  
                  <div className="px-5 py-4 border-b border-[#1E1E24] flex items-center justify-between bg-[#15151A]/50">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#0091FF] animate-pulse" />
                      <span className="text-xs font-bold uppercase tracking-wider text-white">Canal de Sintonia Fina Homem-IA (QualitySync)</span>
                    </div>
                    <span className="text-[9px] font-mono text-emerald-400 border border-emerald-800 bg-emerald-950/40 px-2 py-0.5 rounded">
                      GEMINI FLASH ONLINE
                    </span>
                  </div>

                  {/* HISTORICAL ITEMS SCREEN */}
                  <div className="flex-1 overflow-y-auto p-5 space-y-4 font-mono text-xs">
                    {chatHistory.map((item, idx) => (
                      <div 
                        key={idx} 
                        className={`flex flex-col max-w-[85%] ${item.sender === 'user' ? 'ml-auto items-end' : 'items-start'}`}
                      >
                        <span className="text-[9px] text-[#666666] mb-1">
                          {item.sender === 'user' ? 'OPERADOR DE CAMPO' : 'ASSISTENTE CYBER-PHYSICAL'} — {item.time}
                        </span>
                        <div className={`p-4 rounded-xl leading-relaxed whitespace-pre-wrap border ${
                          item.sender === 'user' 
                            ? 'bg-[#0091FF]/10 border-[#0091FF]/30 text-white' 
                            : 'bg-[#15151A] border-[#1E1E24] text-slate-200'
                        }`}>
                          {item.text}
                        </div>
                      </div>
                    ))}
                    {isGeneratingChat && (
                      <div className="flex flex-col items-start animate-pulse max-w-[80%]">
                        <span className="text-[9px] text-[#666666] mb-1">PROCESSANDO OFFSET SIMULADO...</span>
                        <div className="p-4 bg-[#15151A] border border-[#1E1E24] rounded-xl text-slate-400">
                          Sintetizando compensação no banco de gemologia cibernética...
                        </div>
                      </div>
                    )}
                  </div>

                  {/* DISPATCH CONTROLLER BOX */}
                  <form onSubmit={handleChatSubmit} className="p-4 border-t border-[#1E1E24] bg-[#15151A]/40 flex gap-3">
                    <input 
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder="Pergunte sobre como recalibrar a CNC-02, calcular OEE ou compensar desvio axial..."
                      className="flex-1 bg-[#0A0A0C] border border-[#1E1E24] rounded-lg px-4 py-3 text-xs text-white focus:outline-none focus:border-[#0091FF]"
                    />
                    <button 
                      type="submit"
                      disabled={isGeneratingChat || !chatMessage.trim()}
                      className="px-5 py-3 bg-[#0091FF] text-white rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-[#0076D1] disabled:opacity-50 transition-all cursor-pointer pointer-events-auto"
                    >
                      <Send className="w-4 h-4" />
                      <span>Enviar</span>
                    </button>
                  </form>

                </div>

                {/* TECHNICAL KNOWLEDGE QUICK TIPS AND SHORTCUTS */}
                <div className="space-y-6">
                  
                  <div className="bg-[#0F0F12] border border-[#1E1E24] rounded-xl p-5">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3.5 flex items-center gap-1.5">
                      <Sliders className="w-4 h-4 text-[#0091FF]" />
                      <span>Atalhos de Calibração Zeiss</span>
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">
                      Selecione tópicos de correção cibernética simulada predefinidas para orientar a IA imediatamente para o fuso correto.
                    </p>

                    <div className="space-y-2.5">
                      <button 
                        onClick={() => setChatMessage("Como calibrar a estação Mazak CNC-02 para evitar variação lineal?")}
                        className="w-full text-left p-3 rounded bg-slate-900/40 border border-[#1E1E24] hover:border-[#0091FF]/50 transition-all font-mono text-[10px] text-slate-300 block"
                      >
                        🔧 Calibrar Portal CNC-02 Mazak
                      </button>
                      <button 
                        onClick={() => setChatMessage("Como o limite de vibração em G afeta as ferramentas de corte?")}
                        className="w-full text-left p-3 rounded bg-slate-900/40 border border-[#1E1E24] hover:border-[#0091FF]/50 transition-all font-mono text-[10px] text-slate-300 block"
                      >
                        ⚡ Analisar Sensibilidade de Vibração (G)
                      </button>
                      <button 
                        onClick={() => setChatMessage("Qual a fórmula ideal para elevar o OEE da planta acima de 92%?")}
                        className="w-full text-left p-3 rounded bg-slate-900/40 border border-[#1E1E24] hover:border-[#0091FF]/50 transition-all font-mono text-[10px] text-slate-300 block"
                      >
                        📈 Otimização Global de OEE
                      </button>
                    </div>
                  </div>

                  <div className="bg-[#0F0F12] border border-[#1E1E24] rounded-xl p-5 text-xs text-slate-400">
                    <span className="text-[#0091FF] font-bold block mb-1">DIRETRIZES INDÚSTRIA 5.0</span>
                    <p className="leading-relaxed">
                      A IA serve de conselheira analítica e automatizada de compensação térmica. Caberá ao operador Carlos Santos validar e transpor o ajuste no painel do controlador.
                    </p>
                  </div>

                </div>

              </div>
            ) : (
              <div className="max-w-2xl mx-auto bg-[#0F0F12] border border-[#FFB300]/20 rounded-xl p-8 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Sparkles className="w-40 h-40 text-[#FFB300]" />
                </div>
                
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-amber-950/40 border border-amber-500/30 flex items-center justify-center mb-6 text-amber-400 animate-pulse">
                    <Lock className="w-7 h-7" />
                  </div>
                  
                  <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold bg-amber-950/35 border border-amber-800/40 px-3 py-1 rounded">
                    CONTEÚDO PREMIUM EXCLUSIVO
                  </span>
                  
                  <h3 className="text-xl font-bold text-white mt-4 uppercase tracking-tight">O Co-Piloto IA está Bloqueado</h3>
                  
                  <p className="text-xs text-slate-400 mt-3 leading-relaxed max-w-md">
                    O canal de sintonia fina homem-máquina e assistência preditiva da IA (Gemini) é um recurso exclusivo para assinantes da nossa opção especializada de metrologia assistida.
                  </p>
                  
                  <div className="bg-[#15151A]/60 border border-[#1E1E24] rounded-lg p-5 mt-6 w-full text-left max-w-md space-y-3">
                    <span className="text-[10px] font-mono text-[#0091FF] uppercase font-bold block pb-1 border-b border-[#1E1E24]">
                      A Assinatura Mensal Co-Piloto IA Inclui:
                    </span>
                    <div className="flex items-start gap-2.5 text-xs text-slate-300">
                      <Check className="w-4 h-4 text-[#00E676] shrink-0 mt-0.5" />
                      <span>Chat inteligente em tempo real integrado com os fusos e sensores da fábrica</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-slate-300">
                      <Check className="w-4 h-4 text-[#00E676] shrink-0 mt-0.5" />
                      <span>Auditor avançado de lote para antever desvios geométricos em micrômetros</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-slate-300">
                      <Check className="w-4 h-4 text-[#00E676] shrink-0 mt-0.5" />
                      <span>Proposição automatizada de offsets Zeiss por inteligência artificial</span>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
                    <button 
                      onClick={() => {
                        setActiveTab('saas-billing');
                        setSelectedBillingPlan('professional');
                        setPaymentStep('selection');
                      }}
                      className="px-6 py-3 bg-[#0091FF] hover:bg-[#0076D1] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2 cursor-pointer pointer-events-auto"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Contratar Plano Co-Piloto IA (R$ 1.000 / mês)</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab('dashboard')}
                      className="text-xs font-mono text-slate-400 hover:text-white transition-colors cursor-pointer pointer-events-auto"
                    >
                      Voltar ao Painel Geral
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 5. ASSINATURA SAAS & COBRANÇA MOCK TAB */}
        {activeTab === 'saas-billing' && (
          <div className="space-y-6">
            
            <div className="max-w-4xl mx-auto bg-[#0F0F12] border border-[#1E1E24] rounded-xl overflow-hidden shadow-2xl">
              
              <div className="px-6 py-5 border-b border-[#1E1E24] bg-[#15151A]/50 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase font-mono">Assinatura Corporativa SaaS & Portal de Licenciamento</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Gerencie o número de limites de máquinas acopladas e recalibre seus faturamentos mensais.</p>
                </div>
                <span className="text-xs font-mono text-cyan-400 bg-cyan-950/50 px-2 py-0.5 border border-cyan-800 rounded">
                  PLANO ATUAL: {profile.planId.toUpperCase()}
                </span>
              </div>

              {paymentStep === 'selection' && (
                <div className="p-6 space-y-6">
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {PLANS.map((p) => {
                      const isCurrent = profile.planId === p.id;
                      const isSelectedToChange = selectedBillingPlan === p.id;

                      return (
                        <div 
                          key={p.id}
                          onClick={() => setSelectedBillingPlan(p.id)}
                          className={`border rounded-xl p-5 cursor-pointer relative transition-all ${
                            isSelectedToChange 
                              ? 'border-[#0091FF] bg-[#0091FF]/5' 
                              : 'border-[#1E1E24] bg-slate-900/10'
                          }`}
                        >
                          {isCurrent && (
                            <span className="absolute -top-2.5 right-3 bg-[#00E676] text-black text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                              Ativo
                            </span>
                          )}
                          <h4 className="text-xs font-mono uppercase tracking-widest text-[#0091FF] font-bold mb-1">{p.name}</h4>
                          <span className="text-xl font-black text-white">{p.price}</span>
                          <span className="text-[10px] text-slate-500 font-mono"> / {p.period}</span>

                          <div className="mt-4 pt-3 border-t border-[#1E1E24] space-y-2 text-[10px] text-slate-400">
                            <div>✓ Máquinas IoT: <strong>{p.maxMachines}</strong></div>
                            <div>✓ Usuários Operacionais: <strong>{p.maxUsers}</strong></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="border-t border-[#1E1E24] pt-6 flex justify-end gap-3">
                    <button 
                      onClick={() => setPaymentStep('checkout')}
                      className="px-6 py-2.5 bg-[#0091FF] text-white font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-[#0076D1] transition-all pointer-events-auto cursor-pointer"
                    >
                      Avançar para Pagamento
                    </button>
                  </div>

                </div>
              )}

              {paymentStep === 'checkout' && (
                <div className="p-6">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Simulated Card form */}
                    <div className="space-y-4">
                      <span className="text-xs font-bold text-white uppercase font-mono block">Cartão de Crédito Corporativo</span>
                      
                      <div className="space-y-3 font-mono text-xs">
                        <div>
                          <label className="block text-[10px] text-[#666666] uppercase mb-1">Nome no Cartão</label>
                          <input 
                            type="text" 
                            value={cardHolder} 
                            onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                            className="w-full bg-[#0A0A0C] border border-[#1E1E24] rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-[#0091FF]"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] text-[#666666] uppercase mb-1">Número do Cartão</label>
                          <input 
                            type="text" 
                            value={cardNumber} 
                            onChange={(e) => setCardNumber(e.target.value)}
                            className="w-full bg-[#0A0A0C] border border-[#1E1E24] rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-[#0091FF]"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] text-[#666666] uppercase mb-1">Expiração</label>
                            <input 
                              type="text" 
                              value={cardExpiry} 
                              onChange={(e) => setCardExpiry(e.target.value)}
                              className="w-full bg-[#0A0A0C] border border-[#1E1E24] rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-[#0091FF] text-center"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-[#666666] uppercase mb-1">CVC / CVV</label>
                            <input 
                              type="password" 
                              value={cvv} 
                              onChange={(e) => setCvv(e.target.value)}
                              className="w-full bg-[#0A0A0C] border border-[#1E1E24] rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-[#0091FF] text-center"
                            />
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Order summary */}
                    <div className="bg-[#0A0A0C] rounded-xl border border-[#1E1E24] p-5 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-[#666666] uppercase tracking-wider block mb-2">Resumo da Transação</span>
                        
                        <div className="space-y-2 border-b border-[#1E1E24] pb-4">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-400">Plano Selecionado:</span>
                            <span className="text-white font-bold font-mono">{PLANS.find(p => p.id === selectedBillingPlan)?.name}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-400">Valor Cobrado:</span>
                            <span className="text-[#00E676] font-bold font-mono">{PLANS.find(p => p.id === selectedBillingPlan)?.price} / mês</span>
                          </div>
                        </div>

                        <div className="text-[10.5px] text-slate-400 mt-4 leading-relaxed font-sans">
                          💡 <strong className="text-slate-200">Demonstração Integrada</strong>: O gateway de faturamento do QualitySync operará no ambiente seguro do Sandbox. Nenhum encargo bancário real será emitido contra sua carteira corporativa.
                        </div>
                      </div>

                      <div className="flex gap-2 mt-6">
                        <button 
                          onClick={() => setPaymentStep('selection')}
                          className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 text-xs font-bold uppercase rounded cursor-pointer"
                        >
                          Voltar
                        </button>
                        <button 
                          onClick={() => {
                            setProfile(prev => prev ? { ...prev, planId: selectedBillingPlan } : null);
                            setPaymentStep('success');
                          }}
                          className="flex-1 py-2 bg-[#00E676] text-black text-xs font-bold uppercase rounded hover:bg-[#00c865] cursor-pointer"
                        >
                          Concluir Upgrade
                        </button>
                      </div>

                    </div>

                  </div>

                </div>
              )}

              {paymentStep === 'success' && (
                <div className="p-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-950 border border-[#00E676] rounded-full flex items-center justify-center mx-auto text-[#00E676] shadow-[0_0_20px_rgba(0,230,118,0.2)]">
                    <CheckCircle className="w-9 h-9" />
                  </div>
                  <h4 className="text-lg font-bold text-white uppercase font-mono">Assinatura Ativada Corretamente!</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                    Sua conta corporativa foi atualizada para o plano <strong>{profile.planId.toUpperCase()}</strong>. As travas estruturais de IoT foram eliminadas.
                  </p>
                  <button 
                    onClick={() => {
                      setPaymentStep('selection');
                      setActiveTab('dashboard');
                    }}
                    className="px-6 py-2.5 bg-[#0091FF] text-white font-bold text-xs uppercase tracking-wider rounded h hover:bg-[#0076D1] cursor-pointer"
                  >
                    Retornar ao Dashboard Principal
                  </button>
                </div>
              )}

            </div>

          </div>
        )}

        {activeTab === 'integrations' && (
          <IntegrationsPanel 
            connectionMode={connectionMode} 
            setConnectionMode={setConnectionMode} 
          />
        )}

        {activeTab === 'emergency' && (
          <EmergencyPanel 
            machines={machines}
            setMachines={setMachines}
            setInspections={setInspections}
          />
        )}

        {activeTab === 'traceability' && (
          <TraceabilityPanel />
        )}

        {activeTab === 'procedures' && (
          <ProceduresPanel 
            selectedInstructionId={selectedInstructionId}
            onClearSelectedInstruction={() => setSelectedInstructionId(null)}
          />
        )}

        {activeTab === 'my-machine' && (
          <MyMachineView 
            operatorName={profile?.operatorName || "Carlos Santos"} 
            onNavigateToProcedure={(procId) => {
              setActiveTab('procedures');
            }} 
            colorTheme={colorTheme}
            glovesMode={glovesMode}
          />
        )}

          </div>
        )}

      </main>

      {/* BOTTOM STATUS FOOTER */}
      <footer className="h-12 bg-[#0F0F12] border-t border-[#1E1E24] px-6 flex items-center justify-between shrink-0 text-[10px] font-mono text-[#666666]">
        <div className="flex gap-6 items-center">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0091FF]" />
            <span>SaaS PLAN: <strong className="text-white font-bold uppercase">{profile.planId}</strong></span>
          </div>
          <div>ESTRUTURA: <strong className="text-white font-bold">5 RECURSOS ATIVOS</strong></div>
          <div>MODO CORES: <strong className="text-white font-bold">ZEISS TECHNICAL DARK</strong></div>
        </div>
        <div className="text-[10px] font-bold text-[#aaaaaa]/40 tracking-widest uppercase">
          QualitySync Industry 5.0 © 2026
        </div>
      </footer>

      {/* HISTÓRICO INTEGRADO / DETALHES DE PEÇA INDIVIDUAL INDÚSTRIA 5.0 */}
      {selectedTracePart && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50 animate-fade-in select-text">
          <div className="bg-[#0F0F12] border-2 border-[#1E1E24] rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl relative">
            <div className="absolute top-0 right-0 p-4">
              <button 
                onClick={() => setSelectedTracePart(null)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1 bg-[#15151A]/80 hover:bg-slate-800 border border-[#1E1E24] rounded transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* HEADER DESIGN */}
            <div className="px-6 py-5 border-b border-[#1E1E24] bg-gradient-to-br from-[#15151A] to-black flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0091FF]/10 border border-[#0091FF]/30 flex items-center justify-center text-[#0091FF]">
                <Cpu className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <span className="text-[9px] font-mono uppercase tracking-widest text-[#00E676] bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded font-bold">HISTÓRICO DIGITAL INDIVIDUAL</span>
                <h3 className="text-base font-bold text-white tracking-tight mt-1">Peça Rastreável: {selectedTracePart.id}</h3>
                <div className="flex flex-wrap items-center gap-2 mt-1.5 font-sans text-xs">
                  <span className="text-[#00E676] font-semibold bg-emerald-950/40 border border-emerald-900/40 px-1.5 py-0.5 rounded text-[10px]">{selectedTracePart.partName || "Mancal Desconhecido"}</span>
                  <span className="text-slate-500">cliente</span>
                  <span className="text-[#0091FF] font-semibold bg-[#0091FF]/10 border border-[#0091FF]/20 px-1.5 py-0.5 rounded text-[10px]">{selectedTracePart.buyerName || "Indústria Geral"}</span>
                </div>
              </div>
            </div>

            {/* BODY CONTENT */}
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              
              {/* STATUS & IDENTIFICATION ROW */}
              <div className="grid grid-cols-2 gap-3 bg-[#15151A]/40 p-3.5 border border-[#1E1E24] rounded-xl text-xs font-sans">
                <div>
                  <span className="text-[10px] font-mono text-[#666666] block uppercase font-bold">Status Metrológico</span>
                  <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mt-1.5 ${
                    selectedTracePart.status === 'approved' 
                      ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/40' 
                      : selectedTracePart.status === 'rework'
                        ? 'bg-amber-950/40 text-amber-500 border border-amber-800/40'
                        : 'bg-red-950/40 text-red-400 border border-red-800/40'
                  }`}>
                    {selectedTracePart.status === 'approved' ? '✔ APROVADO' : selectedTracePart.status === 'rework' ? '⚠ RETRABALHO' : '✖ REJEITADO'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#666666] block uppercase font-bold">Lote Vinculado</span>
                  <span className="text-white font-mono font-bold block mt-1.5">{selectedTracePart.batch}</span>
                </div>
              </div>

              {/* MACHINE & CELL METADATA */}
              <div className="grid grid-cols-2 gap-4 text-xs font-sans">
                <div className="bg-[#15151A]/20 p-3 border border-[#1E1E24]/60 rounded-xl space-y-1">
                  <span className="text-[9px] font-mono text-slate-500 uppercase">Máquina de Origem</span>
                  <p className="font-mono font-bold text-white text-xs">{selectedTracePart.machineId}</p>
                </div>
                <div className="bg-[#15151A]/20 p-3 border border-[#1E1E24]/60 rounded-xl space-y-1">
                  <span className="text-[9px] font-mono text-slate-500 uppercase">Setor / Linha</span>
                  <p className="font-sans font-bold text-[#0091FF]">
                    {selectedTracePart.machineId === "CNC-01" ? "Linha Alpha" : selectedTracePart.machineId === "CNC-02" ? "Linha Beta" : selectedTracePart.machineId === "LASER-01" ? "Linha Gamma" : "Linha Delta"}
                  </p>
                </div>
                <div className="bg-[#15151A]/20 p-3 border border-[#1E1E24]/60 rounded-xl space-y-1">
                  <span className="text-[9px] font-mono text-slate-500 uppercase">Operador Responsável</span>
                  <p className="font-sans font-bold text-slate-300">{selectedTracePart.operator || 'Operador Geral'}</p>
                </div>
                <div className="bg-[#15151A]/20 p-3 border border-[#1E1E24]/60 rounded-xl space-y-1">
                  <span className="text-[9px] font-mono text-slate-500 uppercase">Data & Hora Medição</span>
                  <p className="font-mono text-slate-300 text-[10.5px] leading-tight">
                    {new Date(selectedTracePart.timestamp).toLocaleDateString()} às {new Date(selectedTracePart.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>

              {/* METROLOGICAL DIMENSIONS GRID VS SPECIFICATION LIMITS */}
              <div className="space-y-3 pt-2">
                <span className="text-[10px] font-mono font-bold text-[#666666] uppercase block">Distorções Geométricas Sob Tolerância ZEISS</span>
                
                {/* 1. COMPRIMENTO */}
                <div className="bg-black border border-[#1E1E24] p-3 rounded-lg space-y-2 text-xs">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-bold text-slate-300 font-sans">Eixo X: Comprimento</span>
                    <span className="text-[9.5px] text-slate-500 font-mono">(Alvo: 120.00 mm ±0.05)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="bg-[#15151A] px-2 py-1.5 rounded border border-[#1E1E24]/60">
                      <span className="text-[9px] text-slate-500 block">MEDIDO</span>
                      <span className="text-white font-bold">{selectedTracePart.measurements?.lengthMm?.toFixed(2) || '120.00'} mm</span>
                    </div>
                    <div className={`px-2 py-1.5 rounded border ${Math.abs(selectedTracePart.deviations?.lengthMm || 0) <= 0.05 ? 'bg-emerald-950/20 text-emerald-400 border-emerald-900/60' : 'bg-red-950/20 text-red-400 border-red-900/60'}`}>
                      <span className="text-[9px] block text-slate-500">DESVIO</span>
                      <span className="font-bold">{(selectedTracePart.deviations?.lengthMm || 0) >= 0 ? '+' : ''}{(selectedTracePart.deviations?.lengthMm || 0).toFixed(2)} mm</span>
                    </div>
                  </div>
                </div>

                {/* 2. LARGURA */}
                <div className="bg-black border border-[#1E1E24] p-3 rounded-lg space-y-2 text-xs">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-bold text-slate-300 font-sans">Eixo Y: Largura</span>
                    <span className="text-[9.5px] text-slate-500 font-mono">(Alvo: 45.00 mm ±0.03)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="bg-[#15151A] px-2 py-1.5 rounded border border-[#1E1E24]/60">
                      <span className="text-[9px] text-slate-500 block">MEDIDO</span>
                      <span className="text-white font-bold">{selectedTracePart.measurements?.widthMm?.toFixed(2) || '45.00'} mm</span>
                    </div>
                    <div className={`px-2 py-1.5 rounded border ${Math.abs(selectedTracePart.deviations?.widthMm || 0) <= 0.03 ? 'bg-emerald-950/20 text-emerald-400 border-emerald-900/60' : 'bg-red-950/20 text-red-400 border-red-900/60'}`}>
                      <span className="text-[9px] block text-slate-500">DESVIO</span>
                      <span className="font-bold">{(selectedTracePart.deviations?.widthMm || 0) >= 0 ? '+' : ''}{(selectedTracePart.deviations?.widthMm || 0).toFixed(2)} mm</span>
                    </div>
                  </div>
                </div>

                {/* 3. ALTURA */}
                <div className="bg-black border border-[#1E1E24] p-3 rounded-lg space-y-2 text-xs">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-bold text-slate-300 font-sans">Eixo Z: Altura</span>
                    <span className="text-[9.5px] text-slate-500 font-mono">(Alvo: 30.00 mm ±0.02)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="bg-[#15151A] px-2 py-1.5 rounded border border-[#1E1E24]/60">
                      <span className="text-[9px] text-slate-500 block">MEDIDO</span>
                      <span className="text-white font-bold">{selectedTracePart.measurements?.heightMm?.toFixed(2) || '30.00'} mm</span>
                    </div>
                    <div className={`px-2 py-1.5 rounded border ${Math.abs(selectedTracePart.deviations?.heightMm || 0) <= 0.02 ? 'bg-emerald-950/20 text-emerald-400 border-emerald-900/60' : 'bg-red-950/20 text-red-400 border-red-900/60'}`}>
                      <span className="text-[9px] block text-slate-500">DESVIO</span>
                      <span className="font-bold">{(selectedTracePart.deviations?.heightMm || 0) >= 0 ? '+' : ''}{(selectedTracePart.deviations?.heightMm || 0).toFixed(2)} mm</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* TELEMETRY METERS */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-900/20 p-3 rounded-xl border border-[#1E1E24]">
                <div>
                  <span className="text-[9px] font-mono text-slate-500 block uppercase font-bold">Temperatura de Processo</span>
                  <span className={`text-xs font-bold font-mono ${selectedTracePart.temperatureCelsius > 24 ? 'text-[#FF3D00]' : 'text-emerald-400'}`}>
                    {selectedTracePart.temperatureCelsius}°C
                  </span>
                </div>
                <div>
                  <span className="text-[9px] font-mono text-slate-500 block uppercase font-bold">Vibração Harmônica</span>
                  <span className="text-xs font-bold font-mono text-slate-300">
                    {selectedTracePart.vibrationG} G
                  </span>
                </div>
              </div>

              {/* SPECIFIC PART OBSERVATION */}
              {selectedTracePart.partObservation && (
                <div className="bg-[#15151A]/60 p-4 border border-[#1E1E24] rounded-xl text-xs space-y-1">
                  <span className="text-[10px] font-mono text-[#00E676] uppercase block font-bold">Observação da Peça Física</span>
                  <p className="text-slate-200 font-sans leading-relaxed text-[11px]">
                    {selectedTracePart.partObservation}
                  </p>
                </div>
              )}

              {/* MACHINE ROUTING STEPS TIMELINE */}
              <div className="bg-[#15151A]/40 p-4 border border-[#1E1E24]/80 rounded-xl text-xs space-y-3">
                <span className="text-[10px] font-mono text-[#0091FF] uppercase block font-bold">
                  Fluxograma de Roteamento de Processo ({selectedTracePart.routingSteps?.length || 0} Etapas)
                </span>
                
                <div className="space-y-4 pt-1 border-l border-[#1E1E24] ml-2 pl-3">
                  {selectedTracePart.routingSteps && selectedTracePart.routingSteps.length > 0 ? (
                    selectedTracePart.routingSteps.map((step, sIdx) => (
                      <div key={sIdx} className="relative space-y-1">
                        <div className="absolute -left-[17.5px] top-1 w-2 h-2 rounded-full bg-[#0091FF] border border-black shadow-[0_0_8px_rgba(0,145,255,0.6)]" />
                        
                        <div className="flex items-center gap-2">
                          <span className="font-mono bg-[#0091FF]/10 text-[#0091FF] px-1.5 py-0.5 rounded text-[9px] font-bold">
                            {step.machineId}
                          </span>
                          <span className="text-slate-500 font-mono text-[9px] flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5 text-slate-600" />
                            {step.timestamp}
                          </span>
                        </div>
                        {step.machineNotes && (
                          <p className="text-slate-300 font-sans text-[11px] leading-tight">
                            <span className="text-slate-500 font-medium">Obs sobre a máquina:</span> {step.machineNotes}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-slate-500 italic text-[10px] font-sans">
                      Sem percurso logístico registrado para esta peça no sistema.
                    </div>
                  )}
                </div>
              </div>

              {/* DETAILED DEFECT DIAGNOSIS OR NOTES */}
              <div className="bg-[#15151A] p-4 border border-[#1E1E24] rounded-xl text-xs space-y-1.5">
                <span className="text-[10px] font-mono text-[#FF9100] uppercase block font-bold">Diagnóstico Metrológico Digital</span>
                <p className="text-white font-sans font-semibold text-xs mt-1">
                  {selectedTracePart.defectType || 'Nenhum desvio crítico registrado'}
                </p>
                <p className="text-slate-400 font-sans italic text-[11px] leading-relaxed">
                  "{selectedTracePart.notes || 'Nenhuma nota adicional informada pelo operador de linha.'}"
                </p>
              </div>

            </div>

            {/* MODAL FOOTER */}
            <div className="px-6 py-4 bg-[#15151A] border-t border-[#1E1E24] flex flex-col sm:flex-row gap-2.5">
              <button 
                onClick={() => setSelectedTracePart(null)}
                className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold uppercase rounded-lg border border-[#1E1E24] transition-all cursor-pointer text-xs font-sans text-center"
              >
                Fechar Painel
              </button>
              
              <button 
                onClick={() => {
                  setSelectedTracePart(null);
                  setScanningPart(selectedTracePart);
                  setIsScanningActive(true);
                  setScanProgress(0);
                  let progress = 0;
                  const progressTimer = setInterval(() => {
                    progress += 10;
                    setScanProgress(progress);
                    if (progress >= 100) {
                      clearInterval(progressTimer);
                      setIsScanningActive(false);
                    }
                  }, 100);
                  setActiveTab('inspection');
                }}
                className="flex-1 py-2.5 bg-[#00E676]/20 border border-[#00E676]/30 text-[#00E676] hover:bg-[#00E676]/35 font-bold uppercase rounded-lg transition-all cursor-pointer text-xs font-sans text-center flex items-center justify-center gap-1.5"
                title="Conectar medição diretamente ao Scanner 3D Zeiss virtual"
              >
                <span>Jogar para Scanner 3D</span>
              </button>
              
              <button 
                onClick={() => {
                  setSelectedTracePart(null);
                  setActiveTab('traceability');
                }}
                className="flex-1 py-2.5 bg-[#0091FF]/10 hover:bg-[#0091FF]/20 border border-[#0091FF]/30 text-[#0091FF] font-bold uppercase rounded-lg transition-all cursor-pointer text-xs font-sans text-center flex items-center justify-center gap-1.5"
              >
                <span>Ficha Rastreável (152)</span>
              </button>
              
              <button 
                onClick={() => {
                  setSelectedTracePart(null);
                  setChatMessage(`Preciso de orientações de recalibração térmica para a peça recém inspecionada ${selectedTracePart.id}. A temperatura medida estava em ${selectedTracePart.temperatureCelsius}°C com vibração de ${selectedTracePart.vibrationG} G.`);
                  setActiveTab('ia-chat');
                }}
                className="flex-1 py-2.5 bg-[#0091FF] hover:bg-[#0076D1] text-white font-bold uppercase rounded-lg transition-all cursor-pointer text-xs font-sans text-center flex items-center justify-center gap-1.5"
              >
                <span>Consultar Co-Piloto IA</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
