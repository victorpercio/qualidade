import React, { useState, useEffect } from 'react';
import { 
  QrCode, 
  Cpu, 
  User, 
  Calendar, 
  Clock, 
  Database, 
  ChevronRight, 
  Layers, 
  Search, 
  ShieldCheck, 
  Wrench, 
  TrendingUp, 
  History, 
  AlertTriangle, 
  Workflow, 
  Activity,
  FileText,
  Download,
  CheckCircle2,
  Sliders,
  Sparkles,
  RefreshCw,
  Package,
  MapPin,
  AlertCircle,
  Eye,
  EyeOff,
  Filter,
  BarChart2,
  GitPullRequest,
  CheckSquare
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ReferenceLine 
} from 'recharts';

export default function TraceabilityPanel() {
  // NAVIGATION HIERARCHY STATE
  const [selectedLineId, setSelectedLineId] = useState<string>('scania');
  const [selectedDate, setSelectedDate] = useState<string>('14/07/2026');
  const [selectedProductId, setSelectedProductId] = useState<string>('bagie');
  const [selectedOpId, setSelectedOpId] = useState<string>('OP-070');
  const [selectedPartId, setSelectedPartId] = useState<string>('20260714-CNC03-000152');

  // INTERACTIVE TOGGLES
  const [showTechnicalInfo, setShowTechnicalInfo] = useState<boolean>(false);
  const [selectedReader, setSelectedReader] = useState<'qrcode' | 'datamatrix' | 'rfid'>('qrcode');
  const [cmmDownloaded, setCmmDownloaded] = useState(false);

  // SEARCH ENGINE STATES
  const [searchTerm, setSearchTerm] = useState('Bagie ontem');
  const [searchFeedback, setSearchFeedback] = useState<string | null>(null);

  // CONFIGURABLE LINES & PRODUCTS (Matching standard SaaS layouts)
  const [lines, setLines] = useState([
    { id: 'scania', name: 'Scania Linha Alpha' },
    { id: 'volvo', name: 'Volvo Linha Beta' },
    { id: 'mercedes', name: 'Mercedes-Benz Linha Gama' },
    { id: 'volkswagen', name: 'Volkswagen Cargo' },
    { id: 'john_deere', name: 'John Deere Eixos' }
  ]);

  const [products, setProducts] = useState([
    { id: 'bagie', name: 'Bagie (Mancal Especial Turbocompressor)', lineId: 'scania', quantity: 152 },
    { id: 'cabecote', name: 'Cabeçote 366 de Alta Pressão', lineId: 'scania', quantity: 80 },
    { id: 'suporte', name: 'Suporte de Alternador Traseiro', lineId: 'scania', quantity: 45 },
    { id: 'bloco_motor', name: 'Bloco de Motor V8', lineId: 'scania', quantity: 12 },
    { id: 'mancal_central', name: 'Mancal Central do Eixo', lineId: 'volvo', quantity: 95 },
    { id: 'suporte_cardan', name: 'Suporte de Cardan Reforçado', lineId: 'volvo', quantity: 60 },
    { id: 'bloco_motor_v8', name: 'Bloco de Motor OM501', lineId: 'mercedes', quantity: 18 },
    { id: 'carter', name: 'Cárter de Alumínio Fundido', lineId: 'mercedes', quantity: 40 }
  ]);

  const [productionHistory, setProductionHistory] = useState([
    { date: '14/07/2026', label: 'Hoje (14/07/2026)' },
    { date: '13/07/2026', label: 'Ontem (13/07/2026)' },
    { date: '12/07/2026', label: '12/07/2026' },
    { date: '11/07/2026', label: '11/07/2026' },
    { date: '10/07/2026', label: '10/07/2026' }
  ]);

  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // ON-DEMAND OPERATIONS (Configurable and can be any count)
  const operations = [
    { id: 'OP-010', name: 'Serramento & Corte de Tarugo', status: 'concluido' },
    { id: 'OP-020', name: 'Torneamento de Desbaste Geral', status: 'concluido' },
    { id: 'OP-030', name: 'Fresamento de Canais Ópticos', status: 'concluido' },
    { id: 'OP-040', name: 'Furação de Precisão Axial CNC', status: 'concluido' },
    { id: 'OP-050', name: 'Rosqueamento Interno Rosca Helic', status: 'concluido' },
    { id: 'OP-060', name: 'Gravação Laser de Código Serial', status: 'concluido' },
    { id: 'OP-070', name: 'Medição Zeiss Sala Tridimensional', status: 'concluido' }
  ];

  // API STATES
  const [allParts, setAllParts] = useState<any[]>([]);
  const [partData, setPartData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // FETCH ALL PARTS LIST ON MOUNT
  const fetchPartsList = async () => {
    try {
      const res = await fetch('/api/parts');
      if (res.ok) {
        const data = await res.json();
        setAllParts(data);
      }
    } catch (e) {
      console.error("Erro ao carregar peças do SQL Server", e);
    }
  };

  // FETCH SPECIFIC PART DETAILS
  const fetchPartDetail = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/parts/${id.trim()}`);
      if (!res.ok) {
        throw new Error("Peça não localizada no barramento.");
      }
      const data = await res.json();
      setPartData(data);
      setSelectedPartId(data.id);
    } catch (e: any) {
      setError(e.message || "Erro de conexão com o banco de dados SQL Server.");
      setPartData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartsList();
    fetchPartDetail("20260714-CNC03-000152");
  }, []);

  // RECHART SPC GRAPH DATA
  const spcChartData = [
    { piece: '#140', dev: 0.012, toleranceMin: -0.05, toleranceMax: 0.05, target: 0.00 },
    { piece: '#141', dev: -0.008, toleranceMin: -0.05, toleranceMax: 0.05, target: 0.00 },
    { piece: '#142', dev: -0.015, toleranceMin: -0.05, toleranceMax: 0.05, target: 0.00 },
    { piece: '#143', dev: 0.003, toleranceMin: -0.05, toleranceMax: 0.05, target: 0.00 },
    { piece: '#144', dev: 0.024, toleranceMin: -0.05, toleranceMax: 0.05, target: 0.00 },
    { piece: '#145', dev: 0.018, toleranceMin: -0.05, toleranceMax: 0.05, target: 0.00 },
    { piece: '#146', dev: -0.005, toleranceMin: -0.05, toleranceMax: 0.05, target: 0.00 },
    { piece: '#147', dev: -0.022, toleranceMin: -0.05, toleranceMax: 0.05, target: 0.00 },
    { piece: '#148', dev: 0.007, toleranceMin: -0.05, toleranceMax: 0.05, target: 0.00 },
    { piece: '#149', dev: 0.015, toleranceMin: -0.05, toleranceMax: 0.05, target: 0.00 },
    { piece: '#150', dev: -0.011, toleranceMin: -0.05, toleranceMax: 0.05, target: 0.00 },
    { piece: '#151', dev: 0.004, toleranceMin: -0.05, toleranceMax: 0.05, target: 0.00 },
    { piece: '#152', dev: 0.015, toleranceMin: -0.05, toleranceMax: 0.05, target: 0.00 }
  ];

  // POWERFUL SEARCH INTERPRETER (INTERPRETS MULTIPLE TERMS IN PORTUGUESE)
  const handleSmartSearch = (query: string) => {
    const normalized = query.toLowerCase().trim();
    if (!normalized) return;

    setSearchFeedback(null);
    
    // Split into words
    const terms = normalized.split(/\s+/);
    
    let matchedLine = '';
    let matchedDate = '';
    let matchedProd = '';
    let matchedOp = '';
    let matchedPart = '';

    // Direct Exact Serial Search
    const directSerialMatch = allParts.find(p => p.id === query.trim() || p.id.split('-').pop() === query.trim());
    if (directSerialMatch) {
      setSelectedLineId(directSerialMatch.id.includes("CNC03") ? "scania" : "volvo");
      setSelectedDate(directSerialMatch.dateStr);
      setSelectedProductId("bagie");
      setSelectedOpId("OP-070");
      setSelectedPartId(directSerialMatch.id);
      fetchPartDetail(directSerialMatch.id);
      setSearchFeedback("Sucesso: Serial exato localizado no SQL Server.");
      return;
    }

    // Term-by-term scanning
    terms.forEach(term => {
      // 1. Lines
      if (term.includes('scania')) matchedLine = 'scania';
      else if (term.includes('volvo')) matchedLine = 'volvo';
      else if (term.includes('mercedes') || term.includes('benz')) matchedLine = 'mercedes';
      else if (term.includes('volks') || term.includes('vw')) matchedLine = 'volkswagen';
      else if (term.includes('deere') || term.includes('john')) matchedLine = 'john_deere';

      // 2. Dates
      if (term === 'hoje') matchedDate = '14/07/2026';
      else if (term === 'ontem') matchedDate = '13/07/2026';
      else if (term.includes('passada') || term.includes('passado') || term === 'semana') matchedDate = '12/07/2026';
      else if (term === 'março' || term === 'marco') matchedDate = '10/07/2026';
      else if (term.match(/^\d{2}\/\d{2}\/\d{4}$/)) matchedDate = term;

      // 3. Products
      if (term.includes('bagie')) matchedProd = 'bagie';
      else if (term.includes('cabeçot') || term.includes('cabecot')) matchedProd = 'cabecote';
      else if (term.includes('suport')) matchedProd = 'suporte';
      else if (term.includes('bloco') || term.includes('motor')) matchedProd = 'bloco_motor';
      else if (term.includes('mancal')) matchedProd = 'mancal_central';

      // 4. Operations
      if (term.match(/^op(eração)?_?\d+$/) || term.match(/^\d{3}$/)) {
        const num = term.replace(/\D/g, '');
        matchedOp = `OP-0${num}`;
      }

      // 5. Piece references or operators
      if (term.includes('joão') || term.includes('jean')) {
        // Find a piece with Jean Carlos as operator (simulated match)
        matchedPart = '20260714-CNC03-000152';
      }
    });

    // Apply navigated states
    if (matchedLine) setSelectedLineId(matchedLine);
    if (matchedDate) setSelectedDate(matchedDate);
    if (matchedProd) setSelectedProductId(matchedProd);
    if (matchedOp) setSelectedOpId(matchedOp);

    // Filter parts matching criteria to load active detailed piece
    const possibleParts = allParts.filter(p => {
      let isOk = true;
      if (matchedDate && p.dateStr !== matchedDate) isOk = false;
      return isOk;
    });

    if (possibleParts.length > 0) {
      const selected = possibleParts[0];
      fetchPartDetail(selected.id);
      setSearchFeedback(`Navegado para: ${matchedLine ? 'Linha ' + matchedLine.toUpperCase() : ''} ${matchedDate ? 'Data ' + matchedDate : ''} ${matchedProd ? 'Produto ' + matchedProd.toUpperCase() : ''}`);
    } else {
      // Fallback standard
      fetchPartDetail("20260714-CNC03-000152");
      setSearchFeedback("Filtros aplicados. Nenhuma peça específica encontrada para essa combinação; exibindo peça padrão #152.");
    }
  };

  // HANDLERS FOR ADDING CUSTOM DATES TO HISTORY
  const handleApplyCustomPeriod = () => {
    if (!customStartDate) {
      alert('Selecione a data de início.');
      return;
    }
    const formattedStart = customStartDate.split('-').reverse().join('/');
    const customLabel = `Período: ${formattedStart}`;
    
    // Add custom date entry to state
    if (!productionHistory.some(h => h.date === formattedStart)) {
      setProductionHistory([
        { date: formattedStart, label: customLabel },
        ...productionHistory
      ]);
    }
    setSelectedDate(formattedStart);
  };

  // BREADCRUMB BUILDER
  const activeLine = lines.find(l => l.id === selectedLineId);
  const activeProduct = products.find(p => p.id === selectedProductId && p.lineId === selectedLineId) || products.find(p => p.lineId === selectedLineId);
  const activeOp = operations.find(o => o.id === selectedOpId);

  // SIMULATED FILTERED PARTS LIST FOR SELECTION CARDS
  const filteredParts = allParts.filter(p => {
    if (selectedDate && p.dateStr !== selectedDate) return false;
    // Simple mock filter for machines matching the line
    if (selectedLineId === 'scania' && !p.machineId.includes('CNC-03')) return false;
    if (selectedLineId === 'volvo' && p.machineId.includes('CNC-03')) return false;
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans select-text">
      
      {/* 1. SEÇÃO HEADER */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#1E1E24] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-[#0091FF]/10 text-[#0091FF] rounded-lg border border-[#0091FF]/20">
              <Workflow className="w-5 h-5" />
            </span>
            <span className="font-mono text-xs font-black text-[#0091FF] tracking-widest uppercase block">
              MÓDULO DE RASTREABILIDADE INDUSTRIAL TOTAL (SQL SERVER)
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-white mt-1.5 uppercase tracking-tight">
            Genealogia e Rastreabilidade de Processos
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Navegue hierarquicamente pelas linhas de fabricação ou use a pesquisa inteligente interpretadora de múltiplos termos para recuperar dados de fundição, sensores e Zeiss CMM.
          </p>
        </div>

        {/* INTEGRATED INTELLIGENT SEARCH INPUT */}
        <div className="relative w-full md:w-[420px] flex flex-col gap-1.5">
          <div className="relative flex">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-slate-500" />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSmartSearch(searchTerm); }}
              placeholder="Ex: Bagie ontem, Scania março, Op 070..."
              className="w-full bg-[#15151A] text-slate-200 border border-[#1E1E24] rounded-xl pl-9 pr-24 py-2.5 text-xs focus:outline-none focus:border-orange-500 placeholder-slate-500 font-mono"
            />
            <button
              onClick={() => handleSmartSearch(searchTerm)}
              className="absolute right-1 top-1 bottom-1 px-3 bg-orange-500 hover:bg-orange-600 text-black rounded-lg text-[10.5px] font-bold uppercase transition"
            >
              Interpretar
            </button>
          </div>
          {searchFeedback && (
            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>{searchFeedback}</span>
            </span>
          )}
        </div>
      </div>

      {/* 2. DYNAMIC BREADCRUMB (Hierarchical navigation segment click back) */}
      <div className="bg-[#0F0F12] border border-[#1E1E24] rounded-xl px-4 py-3 flex flex-wrap items-center gap-2 text-xs font-mono">
        <span className="text-[#666666] uppercase font-black tracking-wider text-[10px] mr-2 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-[#0091FF]" />
          Genealogia:
        </span>
        <button 
          onClick={() => { setSelectedLineId('scania'); setSelectedPartId(''); }}
          className="text-white hover:text-[#0091FF] font-bold"
        >
          {activeLine?.name || 'Selecione Linha'}
        </button>
        <ChevronRight className="w-3 h-3 text-[#333333]" />
        
        <button 
          onClick={() => { setSelectedPartId(''); }}
          className="text-slate-400 hover:text-[#0091FF] font-semibold"
        >
          {selectedDate || 'Data'}
        </button>
        <ChevronRight className="w-3 h-3 text-[#333333]" />

        <button 
          onClick={() => { setSelectedPartId(''); }}
          className="text-slate-400 hover:text-[#0091FF] font-semibold"
        >
          {activeProduct?.name.split(" ")[0] || 'Produto'}
        </button>
        <ChevronRight className="w-3 h-3 text-[#333333]" />

        <span className="text-orange-400 font-semibold">{selectedOpId}</span>
        
        {partData && (
          <>
            <ChevronRight className="w-3 h-3 text-[#333333]" />
            <span className="text-emerald-400 font-black">#{partData.id.split('-').pop()}</span>
          </>
        )}
      </div>

      {/* 3. NEW HIERARCHICAL NAVIGATION WORKFLOW */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        
        {/* PANEL: EMPRESA -> LINHAS */}
        <div className="bg-[#0F0F12] border border-[#1E1E24] rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-1.5 border-b border-[#1E1E24] pb-2 text-slate-400">
            <Filter className="w-4 h-4 text-[#0091FF]" />
            <span className="text-[10px] font-mono font-black uppercase tracking-wider">1. Linhas Cadastradas</span>
          </div>
          <div className="space-y-1.5">
            {lines.map((l) => (
              <button
                key={l.id}
                onClick={() => { setSelectedLineId(l.id); setSelectedPartId(''); }}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                  selectedLineId === l.id 
                    ? 'bg-[#0091FF] text-white shadow' 
                    : 'bg-black/30 text-slate-400 border border-[#1E1E24] hover:text-white'
                }`}
              >
                <span className="truncate">{l.name.replace(" Linha", "")}</span>
                <ChevronRight className="w-3.5 h-3.5 shrink-0 ml-1 opacity-70" />
              </button>
            ))}
          </div>
        </div>

        {/* PANEL: HISTÓRICO DE PRODUÇÃO (DATA) */}
        <div className="bg-[#0F0F12] border border-[#1E1E24] rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-1.5 border-b border-[#1E1E24] pb-2 text-slate-400">
            <Calendar className="w-4 h-4 text-[#0091FF]" />
            <span className="text-[10px] font-mono font-black uppercase tracking-wider">2. Histórico (Datas)</span>
          </div>

          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {productionHistory.map((h) => (
              <button
                key={h.date}
                onClick={() => { setSelectedDate(h.date); setSelectedPartId(''); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold font-mono transition cursor-pointer ${
                  selectedDate === h.date 
                    ? 'bg-orange-500/10 border border-orange-500 text-orange-400' 
                    : 'bg-black/30 text-slate-400 border border-[#1E1E24] hover:text-white'
                }`}
              >
                {h.label.includes("Hoje") ? "🔥 " + h.label : h.label}
              </button>
            ))}
          </div>

          {/* CUSTOM PERIOD SELECTOR */}
          <div className="border-t border-[#1E1E24]/60 pt-3 space-y-2">
            <span className="text-[9px] font-mono font-bold text-slate-500 uppercase block">Período Customizado:</span>
            <div className="grid grid-cols-2 gap-1.5">
              <input 
                type="date" 
                value={customStartDate} 
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="bg-[#15151A] text-[10px] text-white border border-[#1E1E24] rounded-lg px-1 py-1 focus:outline-none" 
              />
              <input 
                type="date" 
                value={customEndDate} 
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="bg-[#15151A] text-[10px] text-white border border-[#1E1E24] rounded-lg px-1 py-1 focus:outline-none" 
              />
            </div>
            <button
              onClick={handleApplyCustomPeriod}
              className="w-full py-1.5 bg-[#15151A] hover:bg-slate-800 border border-[#1E1E24] text-[9.5px] font-mono font-bold text-slate-300 rounded-lg transition"
            >
              Filtrar Intervalo
            </button>
          </div>
        </div>

        {/* PANEL: PRODUTOS PRODUZIDOS NAQUELE DIA */}
        <div className="bg-[#0F0F12] border border-[#1E1E24] rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-1.5 border-b border-[#1E1E24] pb-2 text-slate-400">
            <Package className="w-4 h-4 text-[#0091FF]" />
            <span className="text-[10px] font-mono font-black uppercase tracking-wider">3. Produtos Produzidos</span>
          </div>

          <div className="space-y-1.5 max-h-72 overflow-y-auto">
            {products.filter(p => p.lineId === selectedLineId).map((p) => (
              <button
                key={p.id}
                onClick={() => { setSelectedProductId(p.id); setSelectedPartId(''); }}
                className={`w-full text-left p-2.5 rounded-xl border text-xs transition flex flex-col space-y-1 cursor-pointer ${
                  selectedProductId === p.id 
                    ? 'bg-emerald-950/20 border-emerald-500 text-emerald-400' 
                    : 'bg-black/30 text-slate-400 border-[#1E1E24] hover:text-white'
                }`}
              >
                <span className="font-bold uppercase tracking-tight">{p.id}</span>
                <span className="text-[9px] text-slate-500 font-mono block">Produção: <strong>{p.quantity} peças</strong></span>
              </button>
            ))}
          </div>
        </div>

        {/* PANEL: OPERAÇÕES (On-demand stepper loading) */}
        <div className="bg-[#0F0F12] border border-[#1E1E24] rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-1.5 border-b border-[#1E1E24] pb-2 text-slate-400">
            <GitPullRequest className="w-4 h-4 text-[#0091FF]" />
            <span className="text-[10px] font-mono font-black uppercase tracking-wider">4. Operações (Usinagem)</span>
          </div>

          <div className="space-y-1.5 max-h-72 overflow-y-auto">
            {operations.map((op) => (
              <button
                key={op.id}
                onClick={() => { setSelectedOpId(op.id); setSelectedPartId(''); }}
                className={`w-full text-left p-2 rounded-xl text-[11px] font-bold transition flex items-center justify-between cursor-pointer ${
                  selectedOpId === op.id 
                    ? 'bg-[#0091FF] text-white' 
                    : 'bg-black/30 text-slate-400 border border-[#1E1E24] hover:text-white'
                }`}
              >
                <div className="flex flex-col">
                  <span>{op.id}</span>
                  <span className="text-[8px] font-mono font-medium opacity-80 truncate max-w-[120px]">{op.name}</span>
                </div>
                <CheckSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-1" />
              </button>
            ))}
          </div>
        </div>

        {/* PANEL: PEÇAS PRODUZIDAS */}
        <div className="bg-[#0F0F12] border border-[#1E1E24] rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-1.5 border-b border-[#1E1E24] pb-2 text-slate-400">
            <Sliders className="w-4 h-4 text-[#0091FF]" />
            <span className="text-[10px] font-mono font-black uppercase tracking-wider">5. Peças Gravadas</span>
          </div>

          <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
            {filteredParts.length > 0 ? (
              filteredParts.map((p) => {
                const isSelected = selectedPartId === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => { setSelectedPartId(p.id); fetchPartDetail(p.id); }}
                    className={`w-full text-left p-2 rounded-xl border text-[11.5px] transition flex flex-col space-y-1 cursor-pointer ${
                      isSelected 
                        ? 'bg-[#0091FF]/15 border-[#0091FF] text-white ring-1 ring-[#0091FF]/30 font-bold' 
                        : 'bg-black/30 text-slate-400 border-[#1E1E24] hover:text-white'
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="font-mono font-black text-[10px] text-slate-300">#{p.id.split('-').pop()}</span>
                      <span className={`text-[8px] px-1 py-0.5 rounded font-mono font-bold uppercase ${
                        p.status === 'Aprovado' ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30' : 'bg-red-950/40 text-red-400 border border-red-900/30'
                      }`}>{p.status}</span>
                    </div>
                    <span className="text-[9.5px] font-mono text-slate-500 block">Hora: {p.timeStr} • Célula: {p.machineId}</span>
                  </button>
                );
              })
            ) : (
              <div className="py-8 text-center text-slate-600 font-mono text-[10.5px]">
                Nenhuma peça neste período.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* LOADING INDICATOR FOR FULL DETAIL SECTION */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <RefreshCw className="w-8 h-8 text-[#0091FF] animate-spin" />
          <p className="text-sm text-slate-400 font-mono">Carregando dados físicos do SQL Server...</p>
        </div>
      )}

      {/* ERROR MESSAGE BAR */}
      {!loading && error && (
        <div className="bg-red-950/20 border border-red-800/40 p-6 rounded-2xl flex flex-col items-center text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-red-500" />
          <h3 className="text-md font-bold text-white uppercase">Erro de Localização</h3>
          <p className="text-xs text-slate-400 max-w-md">{error}</p>
        </div>
      )}

      {/* 4. SEÇÃO: DETALHES COMPLETOS DO ITEM SELECIONADO */}
      {!loading && !error && partData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in text-left">
          
          {/* COLUNA ESQUERDA: IDENTIFICAÇÃO BÁSICA, BOTÕES E LEITORES */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* CARD: IDENTIFICAÇÃO E BOTÕES GERAIS */}
            <div className="bg-[#0F0F12] border border-[#1E1E24] rounded-2xl p-5 space-y-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#1E1E24] pb-3">
                <div className="space-y-0.5">
                  <span className="text-[9px] font-mono text-[#666666] font-bold uppercase tracking-wider block">ID DO REGISTRO</span>
                  <h3 className="text-sm font-black text-white font-mono uppercase">{partData.id}</h3>
                </div>
                <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-black uppercase ${
                  partData.status === 'Aprovado' ? 'bg-emerald-950/40 border border-emerald-800/40 text-[#00E676]' : 'bg-red-950/40 border border-red-800/40 text-red-400'
                }`}>{partData.status}</span>
              </div>

              {/* ACTION BUTTONS (Histórico e Mais detalhes) */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const timelineEl = document.getElementById('high-res-timeline');
                    if (timelineEl) timelineEl.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex-1 py-2.5 bg-slate-900 border border-[#1E1E24] hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-bold font-sans transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <History className="w-4 h-4 text-[#0091FF]" />
                  <span>Histórico Linha</span>
                </button>

                <button
                  onClick={() => setShowTechnicalInfo(!showTechnicalInfo)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold font-sans transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    showTechnicalInfo 
                      ? 'bg-orange-500 text-black font-extrabold' 
                      : 'bg-[#15151A] text-slate-300 border border-[#1E1E24] hover:text-white'
                  }`}
                >
                  {showTechnicalInfo ? (
                    <>
                      <EyeOff className="w-4 h-4" />
                      <span>Ocultar Técnico</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 text-orange-400" />
                      <span>Mais Detalhes</span>
                    </>
                  )}
                </button>
              </div>

              {/* READERS SIMULATOR (QR, Matrix, RFID) */}
              <div className="border-t border-[#1E1E24] pt-4 space-y-4">
                <div className="bg-[#070709] border border-[#1E1E24] p-4 rounded-2xl flex items-center justify-center h-48 relative overflow-hidden">
                  {selectedReader === 'qrcode' && (
                    <img 
                      src={`https://chart.googleapis.com/chart?cht=qr&chs=180x180&chl=${encodeURIComponent(partData.id)}`} 
                      alt="QR Code"
                      className="w-32 h-32 border border-slate-800 p-1 bg-white rounded-lg"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  {selectedReader === 'datamatrix' && (
                    <div className="grid grid-cols-8 gap-[3px] bg-white p-3.5 rounded-lg border border-slate-800 w-32 h-32">
                      {Array.from({ length: 64 }).map((_, i) => (
                        <div 
                          key={i} 
                          className={`w-2.5 h-2.5 rounded-sm ${
                            (i * 17 + partData.id.charCodeAt(i % partData.id.length)) % 2 === 0 ? "bg-slate-950" : "bg-transparent"
                          }`} 
                        />
                      ))}
                    </div>
                  )}
                  {selectedReader === 'rfid' && (
                    <div className="flex flex-col items-center justify-center text-center space-y-2 p-2 w-full h-full">
                      <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-[#0091FF] animate-pulse">
                        <Activity className="w-8 h-8" />
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 font-bold tracking-widest uppercase">
                        RFID-ID-{partData.id.substring(0,6).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-1.5 bg-[#15151A] p-1 border border-[#1E1E24] rounded-xl w-full text-center">
                  <button onClick={() => setSelectedReader('qrcode')} className={`flex-1 py-1 text-[9.5px] font-bold uppercase rounded-lg cursor-pointer ${selectedReader === 'qrcode' ? 'bg-[#0091FF] text-white font-extrabold' : 'text-slate-500'}`}>QR</button>
                  <button onClick={() => setSelectedReader('datamatrix')} className={`flex-1 py-1 text-[9.5px] font-bold uppercase rounded-lg cursor-pointer ${selectedReader === 'datamatrix' ? 'bg-[#0091FF] text-white font-extrabold' : 'text-slate-500'}`}>DataMatrix</button>
                  <button onClick={() => setSelectedReader('rfid')} className={`flex-1 py-1 text-[9.5px] font-bold uppercase rounded-lg cursor-pointer ${selectedReader === 'rfid' ? 'bg-[#0091FF] text-white font-extrabold' : 'text-slate-500'}`}>RFID</button>
                </div>
              </div>

              {/* GENERAL SPECIFICATIONS */}
              <div className="border-t border-[#1E1E24] pt-4 space-y-3 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Componente:</span>
                  <span className="text-white font-bold">{partData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Estação de Trabalho:</span>
                  <span className="text-white font-bold">{partData.general.machine}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Operador:</span>
                  <span className="text-white font-bold">{partData.general.operator}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Lote Fornecedor:</span>
                  <span className="text-[#0091FF] font-black">{partData.general.rawMaterialBatch}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Cliente Final:</span>
                  <span className="text-white font-bold">{partData.general.client}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tempo Usinagem:</span>
                  <span className="text-emerald-400 font-bold">{partData.general.machiningTime}</span>
                </div>
              </div>
            </div>

          </div>

          {/* COLUNA CENTRAL & DIREITA COMPARTILHADA (ZEISS METROLOGY & PROCESS TIMELINES) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* ZEISS METROLOGY REPORT CARD */}
            <div className="bg-[#0F0F12] border border-[#1E1E24] rounded-2xl p-6 shadow-2xl space-y-4">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 border-b border-[#1E1E24] pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4.5 h-4.5 text-[#00E676]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-white font-sans">
                    Qualidade Dimensional Tridimensional (Zeiss CMM Report)
                  </span>
                </div>
                
                <button 
                  onClick={() => {
                    setCmmDownloaded(true);
                    setTimeout(() => setCmmDownloaded(false), 3000);
                  }}
                  className="px-3 py-1 bg-[#15151A] border border-[#1E1E24] hover:border-slate-700 text-slate-300 rounded-lg text-[10px] font-mono font-bold transition flex items-center gap-1.5"
                >
                  <Download className="w-3 h-3 text-slate-400" />
                  <span>{cmmDownloaded ? "BAIXADO!" : "ARQUIVO CMM"}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs pb-2 border-b border-[#1E1E24]/60">
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-500 uppercase block">PÓRTICO DE MEDIÇÃO</span>
                  <span className="text-white font-bold block">{partData.metrology.equipment}</span>
                </div>
                <div className="space-y-1 text-right">
                  <span className="text-[9px] text-slate-500 uppercase block">PROGRAMA EXECUTADO</span>
                  <span className="text-orange-400 font-bold block">{partData.metrology.program}</span>
                </div>
              </div>

              {/* Metrology Dimensions Table */}
              <div className="overflow-x-auto">
                <table className="w-full font-mono text-xs text-slate-300 text-left">
                  <thead className="bg-[#15151A] border-b border-[#1E1E24] text-[9px] uppercase text-slate-500">
                    <tr>
                      <th className="py-2.5 px-4 font-bold">Dimensão Analisada</th>
                      <th className="py-2.5 px-4">Valor Nominal</th>
                      <th className="py-2.5 px-4">Tolerância</th>
                      <th className="py-2.5 px-4">Valor Medido</th>
                      <th className="py-2.5 px-4 text-right">Desvio</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E1E24]/60 text-[11px]">
                    {partData.metrology.dimensions.map((dim: any, idx: number) => (
                      <tr key={idx} className="hover:bg-[#15151A]/30">
                        <td className="py-2.5 px-4 text-white font-bold">{dim.desc}</td>
                        <td className="py-2.5 px-4 text-slate-400">{dim.target}</td>
                        <td className="py-2.5 px-4 text-slate-500">{dim.tolerance}</td>
                        <td className="py-2.5 px-4 text-slate-300 font-bold">{dim.measured}</td>
                        <td className="py-2.5 px-4 text-right">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${dim.status === 'ok' ? 'bg-emerald-950/40 text-[#00E676]' : 'bg-red-950/40 text-red-400'}`}>
                            {dim.deviation}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* 5. SEÇÃO: INFORMAÇÕES TÉCNICAS RECOVÁVEIS (SPC, CEP, Sensores, Offsets, IA) */}
          {showTechnicalInfo && (
            <div className="col-span-1 lg:col-span-3 grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up">
              
              {/* CELL 1: CEP (SPC) DIMENSIONAL CHART & STATS (Cp, Cpk) */}
              <div className="lg:col-span-2 bg-[#0F0F12] border border-[#1E1E24] rounded-2xl p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-[#1E1E24] pb-3">
                  <div className="flex items-center gap-2 font-sans">
                    <TrendingUp className="w-4.5 h-4.5 text-[#0091FF]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-white">
                      Controle Estatístico de Processo (CEP / SPC Chart)
                    </span>
                  </div>

                  <div className="flex gap-4 font-mono text-[10px]">
                    <div className="px-2 py-0.5 bg-emerald-950/40 border border-emerald-900/30 rounded text-emerald-400 font-black">
                      Cp: 1.62
                    </div>
                    <div className="px-2 py-0.5 bg-emerald-950/40 border border-emerald-900/30 rounded text-emerald-400 font-black">
                      Cpk: 1.54
                    </div>
                  </div>
                </div>

                {/* SPC Chart with Recharts */}
                <div className="h-48 font-mono text-[9px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={spcChartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1A1A24" />
                      <XAxis dataKey="piece" stroke="#555555" />
                      <YAxis domain={[-0.07, 0.07]} stroke="#555555" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0F0F12', borderColor: '#1E1E24', color: '#ffffff' }} 
                        itemStyle={{ color: '#0091FF' }}
                      />
                      <ReferenceLine y={0.05} label={{ value: 'LSE', fill: '#ef4444', position: 'insideRight' }} stroke="#ef4444" strokeDasharray="3 3" />
                      <ReferenceLine y={-0.05} label={{ value: 'LIE', fill: '#ef4444', position: 'insideRight' }} stroke="#ef4444" strokeDasharray="3 3" />
                      <ReferenceLine y={0.00} stroke="#22c55e" strokeDasharray="1 1" />
                      <Line type="monotone" dataKey="dev" stroke="#0091FF" strokeWidth={2} activeDot={{ r: 6 }} name="Desvio Medido" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <p className="text-[10px] font-mono text-slate-500">
                  *LIE: Limite Inferior de Especificação (-0.05mm). *LSE: Limite Superior de Especificação (+0.05mm). Processo centrado sob capacidade estatística robusta.
                </p>
              </div>

              {/* CELL 2: TEMPERATURE, VIBRATION & REAL-TIME SENSORS */}
              <div className="bg-[#0F0F12] border border-[#1E1E24] rounded-2xl p-6 shadow-2xl space-y-4">
                <div className="flex items-center gap-2 border-b border-[#1E1E24] pb-3">
                  <Activity className="w-4.5 h-4.5 text-orange-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    Leituras Sensores IoT Físicos (Tempo Real)
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 font-mono text-[11px]">
                  <div className="p-2.5 bg-[#15151A] border border-[#1E1E24] rounded-xl">
                    <span className="text-[8px] text-slate-500 block uppercase font-bold">RPM MÁXIMO</span>
                    <span className="text-white font-extrabold block text-sm">{partData.sensors.rpm} rpm</span>
                  </div>
                  <div className="p-2.5 bg-[#15151A] border border-[#1E1E24] rounded-xl">
                    <span className="text-[8px] text-slate-500 block uppercase font-bold">VIBRAÇÃO ACOPLADA</span>
                    <span className="text-white font-extrabold block text-sm">{partData.sensors.vibration} G</span>
                  </div>
                  <div className="p-2.5 bg-[#15151A] border border-[#1E1E24] rounded-xl">
                    <span className="text-[8px] text-slate-500 block uppercase font-bold">DESVIO AXIAL X</span>
                    <span className="text-emerald-400 font-extrabold block text-sm">{partData.sensors.offsetX} mm</span>
                  </div>
                  <div className="p-2.5 bg-[#15151A] border border-[#1E1E24] rounded-xl">
                    <span className="text-[8px] text-slate-500 block uppercase font-bold">DESVIO AXIAL Z</span>
                    <span className="text-emerald-400 font-extrabold block text-sm">{partData.sensors.offsetZ} mm</span>
                  </div>
                  <div className="p-2.5 bg-[#15151A] border border-[#1E1E24] rounded-xl col-span-2">
                    <span className="text-[8px] text-slate-500 block uppercase font-bold">LUBRIFICAÇÃO & TEMPERATURA</span>
                    <span className="text-slate-300 font-extrabold block text-sm">{partData.sensors.lubrication} ({partData.sensors.temperature}°C)</span>
                  </div>
                </div>
              </div>

              {/* CELL 3: TOOLING & USEFUL LIFE */}
              <div className="bg-[#0F0F12] border border-[#1E1E24] rounded-2xl p-6 shadow-2xl space-y-4">
                <div className="flex items-center gap-2 border-b border-[#1E1E24] pb-3">
                  <Wrench className="w-4.5 h-4.5 text-[#0091FF]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    Condição do Ferramental (Pastilha T08)
                  </span>
                </div>

                <div className="p-4 bg-slate-950/40 border border-[#1E1E24]/60 rounded-xl space-y-4 text-xs font-mono">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-bold">Desgaste Estimado:</span>
                    <span className="text-white font-black text-sm">{partData.tooling.wear}</span>
                  </div>
                  <div className="w-full bg-[#15151A] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-red-500 h-full rounded-full" style={{ width: partData.tooling.wear }}></div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400">
                    <div>
                      <span>Vida Útil:</span>
                      <strong className="text-white block mt-0.5">{partData.tooling.usefulLife}</strong>
                    </div>
                    <div>
                      <span>Peças Usinadas:</span>
                      <strong className="text-white block mt-0.5">{partData.tooling.piecesProduced} peças</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* CELL 4: EDGE AI SYSTEM INTERVENTION LOGS */}
              <div className="bg-[#0F0F12] border border-[#1E1E24] rounded-2xl p-6 shadow-2xl space-y-4 col-span-1 lg:col-span-3">
                <div className="flex items-center justify-between border-b border-[#1E1E24] pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4.5 h-4.5 text-orange-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-white">
                      Correções Dinâmicas e Histórico de Decisão da IA (Edge AI Log)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/30 border border-emerald-900/30 px-2 py-0.5 rounded font-black uppercase">
                    Estabilidade: 99.8%
                  </span>
                </div>

                <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl space-y-3 font-mono text-xs">
                  <div className="flex flex-col sm:flex-row justify-between border-b border-[#1E1E24]/40 pb-2">
                    <span className="text-slate-500 font-bold">Problema Detectado:</span>
                    <span className="text-white font-extrabold">{partData.aiCorrections.detectedIssue}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between border-b border-[#1E1E24]/40 pb-2">
                    <span className="text-slate-500 font-bold">Probabilidade de Fadiga:</span>
                    <span className="text-red-400 font-extrabold">{partData.aiCorrections.probability}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between border-b border-[#1E1E24]/40 pb-2">
                    <span className="text-slate-500 font-bold">Ação Corretiva Aplicada:</span>
                    <span className="text-emerald-400 font-extrabold">{partData.aiCorrections.actionTaken}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between">
                    <span className="text-slate-500 font-bold">Estado Pós-Correção:</span>
                    <span className="text-white font-extrabold">{partData.aiCorrections.newStatus}</span>
                  </div>
                </div>
              </div>

              {/* CELL 5: PARAMETER CHANGE AUDIT TRAILS */}
              <div className="bg-[#0F0F12] border border-[#1E1E24] rounded-2xl p-6 shadow-2xl space-y-4 col-span-1 lg:col-span-3">
                <div className="flex items-center gap-2 border-b border-[#1E1E24] pb-3">
                  <History className="w-4.5 h-4.5 text-[#0091FF]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-white font-sans">
                    Histórico de Auditoria Manual (Trilha de Parâmetros Modificados por Humanos)
                  </span>
                </div>

                <div className="overflow-x-auto border border-[#1E1E24]/80 rounded-xl">
                  <table className="w-full font-mono text-xs text-slate-300 text-left">
                    <thead className="bg-[#15151A] border-b border-[#1E1E24] text-[9.5px] uppercase text-slate-500">
                      <tr>
                        <th className="py-2.5 px-4 font-bold">Quem Alterou</th>
                        <th className="py-2.5 px-4">Quando</th>
                        <th className="py-2.5 px-4">O que Alterou</th>
                        <th className="py-2.5 px-4">Valor Antigo</th>
                        <th className="py-2.5 px-4">Novo Valor</th>
                        <th className="py-2.5 px-4 text-right">Motivo da Modificação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1E1E24]/60 text-[11px]">
                      {partData.auditTrail && partData.auditTrail.length > 0 ? (
                        partData.auditTrail.map((audit: any, idx: number) => (
                          <tr key={idx} className="hover:bg-[#15151A]/30">
                            <td className="py-2.5 px-4 text-white font-bold">{audit.who}</td>
                            <td className="py-2.5 px-4 text-slate-400">{audit.when}</td>
                            <td className="py-2.5 px-4 text-slate-300 font-semibold">{audit.action}</td>
                            <td className="py-2.5 px-4 text-red-400 line-through">{audit.oldVal}</td>
                            <td className="py-2.5 px-4 text-emerald-400 font-bold">{audit.newVal}</td>
                            <td className="py-2.5 px-4 text-right text-slate-400 font-medium max-w-xs truncate">{audit.reason}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-4 text-center text-slate-500 font-mono">
                            Nenhuma alteração de parâmetro manual registrada para este ciclo.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* 6. COLUNA TOTAL: FLOWCHART OF CHÃO DE FÁBRICA TO CLIENT */}
          <div className="col-span-1 lg:col-span-3 bg-[#0F0F12] border border-[#1E1E24] rounded-2xl p-6 shadow-2xl space-y-4 overflow-hidden">
            <div className="flex items-center gap-2 border-b border-[#1E1E24] pb-3">
              <Workflow className="w-4.5 h-4.5 text-[#0091FF]" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Fluxograma de Rastreabilidade Total (Genealogia Ponta a Ponta)
              </span>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto pb-4 pt-2 font-mono text-[9.5px]">
              <div className="bg-[#15151A] border border-[#1E1E24] p-3 rounded-xl w-32 shrink-0 text-center space-y-1">
                <span className="text-[8px] text-slate-500 block uppercase">1. FORNECEDOR</span>
                <span className="text-white font-bold block">Gerdau S.A.</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600 shrink-0" />

              <div className="bg-[#15151A] border border-[#1E1E24] p-3 rounded-xl w-32 shrink-0 text-center space-y-1">
                <span className="text-[8px] text-slate-500 block uppercase">2. MATÉRIA-PRIMA</span>
                <span className="text-white font-bold block">Aço SAE 1045</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600 shrink-0" />

              <div className="bg-[#15151A] border border-[#1E1E24] p-3 rounded-xl w-32 shrink-0 text-center space-y-1">
                <span className="text-[8px] text-slate-500 block uppercase">3. LOTE</span>
                <span className="text-[#0091FF] font-black block">Lote {partData.batchReverse.lot}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600 shrink-0" />

              <div className="bg-[#15151A] border border-[#1E1E24] p-3 rounded-xl w-32 shrink-0 text-center space-y-1">
                <span className="text-[8px] text-slate-500 block uppercase">4. MÁQUINA</span>
                <span className="text-white font-bold block">{partData.general.machine.split(" ")[0]}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600 shrink-0" />

              <div className="bg-[#15151A] border border-[#1E1E24] p-3 rounded-xl w-32 shrink-0 text-center space-y-1 bg-emerald-950/20 border-emerald-800">
                <span className="text-[8px] text-emerald-500 block uppercase font-bold">5. EXPEDIÇÃO</span>
                <span className="text-emerald-400 font-black block">Scania Despacho</span>
              </div>
            </div>
          </div>

          {/* 7. HIGH RESOLUTION STEP TIMELINE (VINCULADA DIRETAMENTE AO HISTÓRICO DA PEÇA) */}
          <div id="high-res-timeline" className="col-span-1 lg:col-span-3 bg-[#0F0F12] border border-[#1E1E24] rounded-2xl p-6 shadow-2xl space-y-6">
            <div className="flex items-center gap-2 border-b border-[#1E1E24] pb-3">
              <Clock className="w-4.5 h-4.5 text-slate-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Linha do Tempo de Alta Resolução da Produção (Passo a Passo)
              </span>
            </div>

            <div className="relative border-l border-[#1E1E24] ml-3.5 pl-6 space-y-6 font-sans text-xs">
              {partData.timeline && partData.timeline.length > 0 ? (
                partData.timeline.map((item: any, idx: number) => (
                  <div key={idx} className="relative">
                    <span className={`absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full border-2 border-[#0F0F12] flex items-center justify-center ${
                      item.status === 'success' ? 'bg-emerald-500' : 'bg-slate-700'
                    }`} />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-500 font-bold bg-[#15151A] px-2 py-0.5 rounded border border-[#1E1E24]/60">{item.time}</span>
                        <h4 className="font-bold text-white uppercase text-[11px] tracking-wide">{item.event}</h4>
                      </div>
                      <p className="text-slate-400 pl-1 text-[11.5px] font-medium leading-relaxed max-w-2xl">{item.desc}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-slate-500 font-mono text-xs">Nenhum evento registrado no histórico temporal desta peça.</div>
              )}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
