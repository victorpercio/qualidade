import React, { useState, useEffect } from 'react';
import { 
  Wrench, 
  ShieldCheck, 
  Clock, 
  Cpu, 
  Activity, 
  AlertTriangle, 
  Gauge, 
  FileText, 
  ChevronRight, 
  PlayCircle,
  Settings2,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { PROCEDURES_DATA } from '../data/procedures';

interface MyMachineViewProps {
  operatorName: string;
  onNavigateToProcedure: (procedureId: string) => void;
  colorTheme?: string;
  glovesMode?: boolean;
}

export default function MyMachineView({ 
  operatorName, 
  onNavigateToProcedure,
  colorTheme = 'default',
  glovesMode = false
}: MyMachineViewProps) {
  // Mock live fluctuating data for CNC-03
  const [rpm, setRpm] = useState(10500);
  const [temperature, setTemperature] = useState(23.5);
  const [vibration, setVibration] = useState(0.19);
  const [oee, setOee] = useState(92.4);
  const [producedToday, setProducedToday] = useState(42);
  
  // Local checklists for operator shift
  const [checklist, setChecklist] = useState([
    { id: 'cnc3-1', text: 'Inspecionar nível do fluido refrigerante (Solúvel 10%)', checked: true },
    { id: 'cnc3-2', text: 'Limpar guias lineares e barramento (Remoção de cavacos)', checked: true },
    { id: 'cnc3-3', text: 'Checar pressão pneumática do alimentador de barras (6.2 bar)', checked: false },
    { id: 'cnc3-4', text: 'Confirmar fixação do cabeçote móvel e guias de bucha', checked: false },
    { id: 'cnc3-5', text: 'Realizar dry-run do programa O0308_SCANIA_T8_REV4.nc', checked: false }
  ]);

  // Tool wear states (simulating critical T08 tool insert)
  const [tools, setTools] = useState([
    { slot: 'T01', name: 'Desbaste Externo WNMG', wear: 24, status: 'good' },
    { slot: 'T03', name: 'Rosqueamento ER22', wear: 41, status: 'good' },
    { slot: 'T05', name: 'Furação Metal Duro 8.5mm', wear: 62, status: 'warning' },
    { slot: 'T08', name: 'Acabamento Interno DCMT (Crítico)', wear: 88, status: 'danger' },
    { slot: 'T12', name: 'Bedame de Corte', wear: 12, status: 'good' }
  ]);

  const [activeTab, setActiveTab] = useState<'status' | 'tools' | 'checklist'>('status');

  useEffect(() => {
    const interval = setInterval(() => {
      // Fluctuating values for CNC-03
      setRpm(prev => Math.max(9800, Math.min(10800, Math.round(prev + (Math.random() - 0.5) * 80))));
      setTemperature(prev => Number(Math.max(21.0, Math.min(27.0, prev + (Math.random() - 0.5) * 0.3)).toFixed(2)));
      setVibration(prev => Number(Math.max(0.05, Math.min(0.40, prev + (Math.random() - 0.5) * 0.03)).toFixed(2)));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const toggleChecklistItem = (id: string) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const cnc03Procedures = PROCEDURES_DATA.filter(p => p.machineId === 'CNC-03');

  // Wear color generator
  const getWearColor = (wear: number) => {
    if (wear >= 85) return 'bg-red-500';
    if (wear >= 60) return 'bg-amber-500';
    return 'bg-[#0091FF]';
  };

  const getWearTextColor = (wear: number) => {
    if (wear >= 85) return 'text-red-500 border-red-500/20 bg-red-500/10';
    if (wear >= 60) return 'text-amber-500 border-amber-500/20 bg-amber-500/10';
    return 'text-[#0091FF] border-[#0091FF]/20 bg-[#0091FF]/10';
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans select-text">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#1E1E24] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-orange-500/10 text-orange-500 rounded-lg border border-orange-500/20 animate-pulse">
              <Activity className="w-5 h-5" />
            </span>
            <span className="font-mono text-xs font-black text-orange-500 tracking-widest uppercase block">
              MÓDULO DO OPERADOR: ESTAÇÃO CNC-03 LADO-MÁQUINA
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-white mt-1.5 uppercase tracking-tight">
            Torno Star SR-38 - Atribuição: {operatorName}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Console de assistência técnica direta, integrando telemetria em tempo real, controle de pastilhas de ferramentas e POPs de segurança.
          </p>
        </div>

        {/* MACHINE STATUS BADGES */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-mono bg-[#15151A] border border-[#1E1E24] px-3 py-1.5 rounded-lg text-slate-400 font-bold">
            PROGRAMA: <strong className="text-white">O0308_REV4.nc</strong>
          </span>
          <span className="text-[10px] font-mono bg-emerald-950/40 border border-emerald-900/40 px-3 py-1.5 rounded-lg text-[#00E676] font-bold flex items-center gap-1.5 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>CNC EM OPERAÇÃO</span>
          </span>
        </div>
      </div>

      {/* THREE-CARD QUICK DATA METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* TELEMETRIA GERAL */}
        <div className="bg-[#0F0F12] border border-[#1E1E24] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E1E24] pb-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-orange-500" />
              <span>Sensores Físicos (IoT)</span>
            </span>
            <span className="text-[9px] font-mono text-slate-500">Estável</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-[10px] text-[#666666] font-mono block uppercase">Velocidade Fuso</span>
              <div className="text-xl font-mono font-bold text-white tracking-tight">{rpm} <span className="text-xs text-slate-500">RPM</span></div>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-[#666666] font-mono block uppercase">Temperatura</span>
              <div className="text-xl font-mono font-bold text-white tracking-tight">{temperature} <span className="text-xs text-slate-500">°C</span></div>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-[#666666] font-mono block uppercase">Vibração Ativa</span>
              <div className="text-xl font-mono font-bold text-white tracking-tight">{vibration} <span className="text-xs text-slate-500">G</span></div>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-[#666666] font-mono block uppercase">OEE da Máquina</span>
              <div className="text-xl font-mono font-bold text-emerald-400 tracking-tight">{oee}%</div>
            </div>
          </div>
        </div>

        {/* PEÇA ATIVA & PRODUÇÃO */}
        <div className="bg-[#0F0F12] border border-[#1E1E24] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E1E24] pb-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-[#0091FF]" />
              <span>Peça Ativa & Rendimento</span>
            </span>
            <span className="text-[9px] font-mono text-[#00E676]">Metrologia OK</span>
          </div>
          <div className="space-y-3">
            <div className="space-y-1">
              <span className="text-[10px] text-[#666666] font-mono block uppercase">Desenho em Usinagem</span>
              <div className="text-xs font-bold text-white">Mancal Turbocompressor Scania T8</div>
              <span className="text-[9px] font-mono text-slate-500">Liga: Aço Inoxidável Cirúrgico ASTM F138</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#1E1E24]/60">
              <div>
                <span className="text-[10px] text-[#666666] font-mono block uppercase">Meta de Turno</span>
                <span className="text-sm font-bold text-white">50 un</span>
              </div>
              <div>
                <span className="text-[10px] text-[#666666] font-mono block uppercase">Produzido</span>
                <span className="text-sm font-bold text-[#00E676]">{producedToday} un</span>
              </div>
            </div>
          </div>
        </div>

        {/* PASTILHA T08 DE ALERTA CRÍTICO */}
        <div className="bg-[#0F0F12] border border-[#1E1E24] rounded-2xl p-5 space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/5 rounded-full blur-xl"></div>
          <div className="flex items-center justify-between border-b border-[#1E1E24] pb-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />
              <span>Estado da Ferramenta T08</span>
            </span>
            <span className="text-[9px] font-mono text-red-500 font-extrabold uppercase bg-red-950/40 border border-red-900/40 px-1.5 py-0.5 rounded animate-pulse">SUBSTITUIR</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 font-bold">Slot T08 (DCMT):</span>
              <span className="text-red-500 font-mono font-bold">88% de Desgaste</span>
            </div>
            {/* ProgressBar */}
            <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-[#1E1E24]">
              <div className="bg-red-500 h-full rounded-full" style={{ width: '88%' }}></div>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              O limite de segurança estrutural de rugosidade Zeiss está próximo. Substitua para evitar desvio dimensional.
            </p>
            <button
              onClick={() => onNavigateToProcedure('proc-t08')}
              className="w-full py-2 bg-red-600/10 hover:bg-red-600 hover:text-white border border-red-500/30 text-red-400 text-xs font-bold uppercase rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Iniciar Substituição da Pastilha</span>
            </button>
          </div>
        </div>

      </div>

      {/* CORE CONTROL AREA - TABS */}
      <div className="bg-[#0F0F12] border border-[#1E1E24] rounded-2xl overflow-hidden shadow-xl">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-[#1E1E24] bg-[#15151A]/30">
          <button
            onClick={() => setActiveTab('status')}
            className={`px-5 py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${activeTab === 'status' ? 'text-orange-500 border-orange-500 bg-[#0F0F12]' : 'text-slate-400 border-transparent hover:text-white'}`}
          >
            Pastilhas & Ferramentas do Magazine
          </button>
          <button
            onClick={() => setActiveTab('checklist')}
            className={`px-5 py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${activeTab === 'checklist' ? 'text-orange-500 border-orange-500 bg-[#0F0F12]' : 'text-slate-400 border-transparent hover:text-white'}`}
          >
            Checklist Diário do Turno
          </button>
        </div>

        {/* Content area */}
        <div className="p-6">
          
          {/* TAB 1: MAGAZINE TOOLS */}
          {activeTab === 'status' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 font-mono">
                  Magazine de Ferramentas Ativo (CNC Star)
                </h3>
                <span className="text-[10px] text-slate-500 font-mono">Último monitoramento há 2 minutos</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {tools.map((t) => (
                  <div key={t.slot} className="bg-[#15151A] border border-[#1E1E24] p-4 rounded-xl flex flex-col justify-between space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-black border border-[#1E1E24] text-[9.5px] font-mono rounded font-bold text-slate-400">{t.slot}</span>
                      <span className={`text-[9px] font-mono border px-1.5 py-0.5 rounded uppercase font-bold ${getWearTextColor(t.wear)}`}>
                        {t.wear >= 85 ? 'Crítico' : (t.wear >= 60 ? 'Ajuste' : 'Ok')}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-white line-clamp-2 min-h-8">{t.name}</h4>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 font-mono">
                        <span>Desgaste:</span>
                        <span className="font-bold text-slate-200">{t.wear}%</span>
                      </div>
                      <div className="w-full bg-black h-1.5 rounded-full overflow-hidden mt-1.5">
                        <div className={`h-full ${getWearColor(t.wear)}`} style={{ width: `${t.wear}%` }}></div>
                      </div>
                    </div>

                    {t.slot === 'T08' ? (
                      <button 
                        onClick={() => onNavigateToProcedure('proc-t08')}
                        className="w-full py-2 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white border border-red-500/20 text-[10px] font-bold uppercase rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Wrench className="w-3 h-3" />
                        <span>Substituir</span>
                      </button>
                    ) : (
                      <button 
                        disabled
                        className="w-full py-2 bg-black border border-[#1E1E24] text-[#666666] text-[10px] font-bold uppercase rounded-lg opacity-40 flex items-center justify-center gap-1"
                      >
                        <ShieldCheck className="w-3 h-3" />
                        <span>Conforme</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: OPERATOR CHECKLIST */}
          {activeTab === 'checklist' && (
            <div className="space-y-6 max-w-3xl">
              <div className="flex items-center justify-between border-b border-[#1E1E24]/60 pb-3">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 font-mono">
                    Checklist de Segurança Operacional & Partida de Turno
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-1">Siga rigorosamente as regulamentações NR-12 e ISO 9001 de controle industrial.</p>
                </div>
                <button
                  onClick={() => {
                    setChecklist(prev => prev.map(item => ({ ...item, checked: false })));
                  }}
                  className="px-2.5 py-1.5 border border-[#1E1E24] bg-[#15151A] hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Limpar Checklist</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {checklist.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => toggleChecklistItem(item.id)}
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${item.checked ? 'bg-emerald-950/15 border-emerald-900/30' : 'bg-[#15151A] border-[#1E1E24] hover:bg-[#1E1E24]'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${item.checked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-[#1E1E24] bg-black'}`}>
                        {item.checked && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </div>
                      <span className={`text-xs font-semibold ${item.checked ? 'text-slate-400 line-through' : 'text-slate-200'}`}>
                        {item.text}
                      </span>
                    </div>

                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase border ${item.checked ? 'text-[#00E676] bg-emerald-950/30 border-emerald-900/30' : 'text-amber-500 bg-amber-950/30 border-amber-900/30'}`}>
                      {item.checked ? 'Executado' : 'Pendente'}
                    </span>
                  </div>
                ))}
              </div>

              {checklist.every(item => item.checked) && (
                <div className="p-4 bg-emerald-950/30 border border-emerald-800/40 rounded-xl flex items-center gap-3 text-emerald-400 animate-fade-in">
                  <ShieldCheck className="w-5 h-5 shrink-0" />
                  <div className="text-xs font-sans">
                    <strong>Checklist Concluído!</strong> A estação CNC-03 está 100% calibrada e em conformidade NR-12 para operação produtiva normal.
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* PROCEDURES FOR THIS MACHINE */}
      <div className="bg-[#0F0F12] border border-[#1E1E24] rounded-2xl p-6 space-y-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 font-mono flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-orange-500" />
          <span>Procedimentos Recomendados para CNC-03 ({cnc03Procedures.length})</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cnc03Procedures.map((p) => (
            <div 
              key={p.id}
              onClick={() => onNavigateToProcedure(p.id)}
              className="bg-[#15151A] border border-[#1E1E24] p-4 rounded-xl flex items-center justify-between hover:border-orange-500/50 cursor-pointer transition-all"
            >
              <div className="space-y-1.5 max-w-[80%]">
                <span className="text-[9px] font-mono bg-orange-500/10 text-orange-500 border border-orange-500/20 px-1.5 py-0.5 rounded font-bold">{p.code}</span>
                <h4 className="text-xs font-bold text-white line-clamp-1">{p.title}</h4>
                <p className="text-[11px] text-slate-400 line-clamp-2">{p.description}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500 hover:text-white" />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

// Quick tiny helper for checkmark
function CheckCircle2({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      {...props}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
