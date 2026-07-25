import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Wrench, 
  ShieldCheck, 
  Clock, 
  Video, 
  FileText, 
  Download, 
  ChevronRight, 
  BookOpen, 
  CheckSquare, 
  Square,
  Play,
  PlayCircle,
  Plus,
  Trash2,
  Edit3,
  X,
  FileDigit,
  Eye,
  Settings,
  History,
  AlertTriangle,
  Layers,
  ArrowLeft,
  Briefcase,
  AlertCircle
} from 'lucide-react';
import { PROCEDURES_DATA, WorkInstruction, WorkInstructionStep, WorkInstructionChange } from '../data/procedures';

interface ProceduresPanelProps {
  selectedInstructionId?: string | null;
  onClearSelectedInstruction?: () => void;
}

export default function ProceduresPanel({ 
  selectedInstructionId = null,
  onClearSelectedInstruction
}: ProceduresPanelProps) {
  // STATEFUL CONFIGURATIONS (To make everything configurable by any machining company)
  const [lines, setLines] = useState<Array<{ id: string; name: string }>>([
    { id: 'scania', name: 'Scania' },
    { id: 'volvo', name: 'Volvo' },
    { id: 'mercedes', name: 'Mercedes-Benz' },
    { id: 'volkswagen', name: 'Volkswagen' },
    { id: 'john_deere', name: 'John Deere' }
  ]);

  const [products, setProducts] = useState<Array<{ id: string; name: string; lineId: string }>>([
    // Scania products
    { id: 'bagie', name: 'Bagie (Mancal Especial Turbocompressor)', lineId: 'scania' },
    { id: 'cabecote', name: 'Cabeçote 366 de Alta Pressão', lineId: 'scania' },
    { id: 'suporte', name: 'Suporte de Alternador Traseiro', lineId: 'scania' },
    { id: 'bloco_motor', name: 'Bloco de Motor V8', lineId: 'scania' },
    // Volvo products
    { id: 'mancal_central', name: 'Mancal Central do Eixo', lineId: 'volvo' },
    { id: 'suporte_cardan', name: 'Suporte de Cardan Reforçado', lineId: 'volvo' },
    // Mercedes products
    { id: 'bloco_motor_v8', name: 'Bloco de Motor OM501', lineId: 'mercedes' },
    { id: 'carter', name: 'Cárter de Alumínio Fundido', lineId: 'mercedes' }
  ]);

  const [instructions, setInstructions] = useState<WorkInstruction[]>(PROCEDURES_DATA);

  // SELECTIONS
  const [selectedLineId, setSelectedLineId] = useState<string>('scania');
  const [selectedProductId, setSelectedProductId] = useState<string>('bagie');
  
  // Tab within active product (category of instruction)
  const categories = [
    "Como fabricar", 
    "Setup inicial", 
    "Troca de ferramenta", 
    "Inspeção", 
    "Medição", 
    "Limpeza", 
    "Encerramento"
  ];
  const [selectedCategory, setSelectedCategory] = useState<string>('Como fabricar');

  // Interactive Checklist
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [showPdfMock, setShowPdfMock] = useState(false);
  const [showBlueprintZoom, setShowBlueprintZoom] = useState(false);

  // CONFIGURATION MODALS
  const [showAddLineModal, setShowAddLineModal] = useState(false);
  const [newLineName, setNewLineName] = useState('');
  
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProductName, setNewProductName] = useState('');

  // INSTRUCTION CREATION / EDITING FORM
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [formInstructionId, setFormInstructionId] = useState<string>('');
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formEstimatedTime, setFormEstimatedTime] = useState('15 minutos');
  const [formVersion, setFormVersion] = useState('V1.0');
  const [formResponsible, setFormResponsible] = useState('Supervisor Técnico');
  const [formOberservations, setFormObservations] = useState('');
  const [formSteps, setFormSteps] = useState<string>('');
  const [formPpes, setFormPpes] = useState<string>('');
  const [formTools, setFormTools] = useState<string>('');

  // Handle deep-linking search from AI chat
  useEffect(() => {
    if (selectedInstructionId) {
      const match = instructions.find(inst => inst.id === selectedInstructionId);
      if (match) {
        setSelectedLineId(match.lineId);
        setSelectedProductId(match.productId);
        setSelectedCategory(match.category);
        setIsVideoPlaying(false);
        setCheckedSteps({});
      }
    }
  }, [selectedInstructionId, instructions]);

  const activeLine = lines.find(l => l.id === selectedLineId);
  const lineProducts = products.filter(p => p.lineId === selectedLineId);
  const activeProduct = products.find(p => p.id === selectedProductId && p.lineId === selectedLineId) || lineProducts[0];

  // Auto-correct product if selectedLine changes
  useEffect(() => {
    if (lineProducts.length > 0) {
      const alreadyMatches = lineProducts.some(p => p.id === selectedProductId);
      if (!alreadyMatches) {
        setSelectedProductId(lineProducts[0].id);
      }
    } else {
      setSelectedProductId('');
    }
  }, [selectedLineId]);

  // Find instruction matching current selection
  const activeInstruction = instructions.find(
    inst => inst.lineId === selectedLineId && 
            inst.productId === selectedProductId && 
            inst.category.toLowerCase() === selectedCategory.toLowerCase()
  );

  const toggleStep = (stepId: string) => {
    setCheckedSteps(prev => ({ ...prev, [stepId]: !prev[stepId] }));
  };

  const resetChecklist = () => {
    setCheckedSteps({});
  };

  // ADD LINE METHOD
  const handleAddLine = () => {
    if (!newLineName.trim()) return;
    const cleanId = newLineName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    if (lines.some(l => l.id === cleanId)) {
      alert('Esta linha já está cadastrada.');
      return;
    }
    const newLine = { id: cleanId, name: newLineName.trim() };
    setLines([...lines, newLine]);
    setSelectedLineId(cleanId);
    setNewLineName('');
    setShowAddLineModal(false);
  };

  // DELETE LINE METHOD
  const handleDeleteLine = (id: string) => {
    if (lines.length <= 1) {
      alert('Não é possível excluir a única linha cadastrada.');
      return;
    }
    if (window.confirm('Tem certeza que deseja excluir esta linha? Todos os produtos e instruções associados serão inacessíveis.')) {
      setLines(lines.filter(l => l.id !== id));
      if (selectedLineId === id) {
        const remaining = lines.filter(l => l.id !== id);
        setSelectedLineId(remaining[0].id);
      }
    }
  };

  // ADD PRODUCT METHOD
  const handleAddProduct = () => {
    if (!newProductName.trim() || !selectedLineId) return;
    const cleanId = newProductName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    if (products.some(p => p.id === cleanId && p.lineId === selectedLineId)) {
      alert('Este produto já está cadastrado nesta linha.');
      return;
    }
    const newProduct = { id: cleanId, name: newProductName.trim(), lineId: selectedLineId };
    setProducts([...products, newProduct]);
    setSelectedProductId(cleanId);
    setNewProductName('');
    setShowAddProductModal(false);
  };

  // DELETE PRODUCT METHOD
  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Excluir este produto apagará todas as instruções cadastradas. Deseja prosseguir?')) {
      setProducts(products.filter(p => p.id !== id || p.lineId !== selectedLineId));
      setInstructions(instructions.filter(inst => inst.productId !== id || inst.lineId !== selectedLineId));
    }
  };

  // OPEN FORM FOR CREATING OR EDITING
  const handleOpenForm = (mode: 'create' | 'edit') => {
    setFormMode(mode);
    if (mode === 'edit' && activeInstruction) {
      setFormInstructionId(activeInstruction.id);
      setFormTitle(activeInstruction.title);
      setFormDescription(activeInstruction.description);
      setFormEstimatedTime(activeInstruction.estimatedTime);
      setFormVersion(activeInstruction.version);
      setFormResponsible(activeInstruction.responsible);
      setFormObservations(activeInstruction.observations);
      setFormSteps(activeInstruction.steps.map(s => s.text).join('\n'));
      setFormPpes(activeInstruction.ppes.join('\n'));
      setFormTools(activeInstruction.tools.join('\n'));
    } else {
      setFormInstructionId(`inst-${Date.now()}`);
      setFormTitle(`Instrução de ${selectedCategory} - ${activeProduct?.name || 'Produto'}`);
      setFormDescription(`Este procedimento técnico orienta as melhores práticas de ${selectedCategory.toLowerCase()} para o componente ${activeProduct?.name || ''}.`);
      setFormEstimatedTime('15 minutos');
      setFormVersion('V1.0');
      setFormResponsible('Engenheiro de Processos');
      setFormObservations('Manter as ferramentas aferidas periodicamente.');
      setFormSteps('Passo 1: Preparar as ferramentas de precisão\nPasso 2: Limpar a área de fixação principal\nPasso 3: Posicionar a peça no mandril');
      setFormPpes('Óculos de proteção\nLuvas de segurança\nCalçado de biqueira');
      setFormTools('Paquímetro digital\nChave sextavada');
    }
    setShowForm(true);
  };

  // SAVE INSTRUCTION FORM
  const handleSaveInstruction = () => {
    if (!formTitle.trim()) {
      alert('O título da instrução é obrigatório.');
      return;
    }

    const stepsArray: WorkInstructionStep[] = formSteps
      .split('\n')
      .filter(line => line.trim() !== '')
      .map((text, i) => ({ id: `step-${Date.now()}-${i}`, text: text.trim() }));

    const ppesArray = formPpes.split('\n').filter(line => line.trim() !== '');
    const toolsArray = formTools.split('\n').filter(line => line.trim() !== '');

    const savedInstruction: WorkInstruction = {
      id: formMode === 'edit' ? formInstructionId : `inst-${Date.now()}`,
      code: activeInstruction?.code || `IT-${selectedLineId.substring(0,3).toUpperCase()}-${selectedCategory.substring(0,3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      title: formTitle,
      lineId: selectedLineId,
      lineName: activeLine?.name || 'Linha',
      productId: selectedProductId,
      productName: activeProduct?.name || 'Produto',
      category: selectedCategory,
      estimatedTime: formEstimatedTime,
      version: formVersion,
      revisionDate: new Date().toLocaleDateString('pt-BR'),
      responsible: formResponsible,
      description: formDescription,
      steps: stepsArray,
      ppes: ppesArray,
      tools: toolsArray,
      imageUrl: activeInstruction?.imageUrl || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=400",
      videoUrl: activeInstruction?.videoUrl || "https://www.w3schools.com/html/mov_bbb.mp4",
      pdfUrl: activeInstruction?.pdfUrl || "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      observations: formOberservations,
      changeHistory: formMode === 'edit' && activeInstruction ? [
        {
          date: new Date().toLocaleDateString('pt-BR'),
          version: formVersion,
          author: formResponsible,
          description: `Atualização de especificações de ${selectedCategory.toLowerCase()}.`
        },
        ...activeInstruction.changeHistory
      ] : [
        {
          date: new Date().toLocaleDateString('pt-BR'),
          version: formVersion,
          author: formResponsible,
          description: 'Criação inicial da instrução no sistema.'
        }
      ],
      machineId: activeInstruction?.machineId || "CNC-03"
    };

    if (formMode === 'edit') {
      setInstructions(instructions.map(inst => inst.id === formInstructionId ? savedInstruction : inst));
    } else {
      setInstructions([...instructions, savedInstruction]);
    }

    setShowForm(false);
    setCheckedSteps({});
  };

  // CALCULATE CHECKLIST PERCENTAGE
  const totalSteps = activeInstruction?.steps.length || 0;
  const completedStepsCount = activeInstruction?.steps.filter(s => checkedSteps[s.id]).length || 0;
  const completionPercentage = totalSteps > 0 ? Math.round((completedStepsCount / totalSteps) * 100) : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans select-text">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#1E1E24] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-[#0091FF]/10 text-[#0091FF] rounded-lg border border-[#0091FF]/20">
              <BookOpen className="w-5 h-5" />
            </span>
            <span className="font-mono text-xs font-black text-[#0091FF] tracking-widest uppercase block">
              MÓDULO DE INSTRUÇÕES DE TRABALHO & POPs
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-white mt-1.5 uppercase tracking-tight">
            Instruções de Trabalho Digitais
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Substituição completa de pastas de papel por guias eletrônicos passo-a-passo e interativos vinculados a cada linha e produto.
          </p>
        </div>

        {/* RESET DEEP LINK BUTTON */}
        {selectedInstructionId && (
          <button
            onClick={() => onClearSelectedInstruction && onClearSelectedInstruction()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 rounded-xl text-[11px] font-bold tracking-tight transition"
          >
            <X className="w-3.5 h-3.5" />
            <span>Limpar Busca de IA</span>
          </button>
        )}
      </div>

      {/* LINE CONFIGURATION BAR (FULLY CONFIGURABLE) */}
      <div className="bg-[#0F0F12] border border-[#1E1E24] rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <span className="text-[10px] font-mono text-[#666666] font-black uppercase tracking-wider block pr-2">
            LINHA DE PRODUÇÃO:
          </span>
          {lines.map((l) => (
            <div key={l.id} className="relative group/line">
              <button
                onClick={() => setSelectedLineId(l.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold font-sans transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedLineId === l.id
                    ? 'bg-[#0091FF] text-white shadow-lg'
                    : 'bg-[#15151A] text-slate-400 border border-[#1E1E24] hover:text-white'
                }`}
              >
                <span>{l.name}</span>
                {selectedLineId === l.id && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                )}
              </button>
              
              {/* DELETE LINE OVERLAY ACCESSIBLE ON HOVER */}
              <button
                onClick={(e) => { e.stopPropagation(); handleDeleteLine(l.id); }}
                className="absolute -top-1.5 -right-1.5 hidden group-hover/line:flex items-center justify-center bg-red-600 hover:bg-red-700 text-white w-5 h-5 rounded-full border border-black text-[9px] shadow-lg transition"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}

          {/* ADD LINE TRIGGER */}
          <button
            onClick={() => setShowAddLineModal(true)}
            className="p-2 border border-dashed border-[#1E1E24] text-slate-500 hover:text-white hover:border-[#0091FF] rounded-xl transition cursor-pointer"
            title="Cadastrar Nova Linha"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* CONFIGURED LABEL */}
        <span className="text-[10px] font-mono text-[#00E676] bg-emerald-950/20 border border-emerald-900/40 px-2 py-1 rounded-lg">
          ESTADO: SEGURO ISO 9001
        </span>
      </div>

      {/* PRODUCTS ROW UNDER ACTIVE LINE */}
      <div className="bg-[#15151A]/40 border border-[#1E1E24] rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-mono text-[#666666] font-black uppercase tracking-wider block pr-2">
            PRODUTO:
          </span>
          {lineProducts.length > 0 ? (
            lineProducts.map((p) => (
              <div key={p.id} className="relative group/prod">
                <button
                  onClick={() => setSelectedProductId(p.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-sans transition-all cursor-pointer ${
                    selectedProductId === p.id
                      ? 'bg-orange-500/10 border border-orange-500 text-orange-400'
                      : 'bg-black/30 text-slate-400 border border-[#1E1E24] hover:text-white'
                  }`}
                >
                  {p.name}
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDeleteProduct(p.id); }}
                  className="absolute -top-1 -right-1 hidden group-hover/prod:flex items-center justify-center bg-red-600 hover:bg-red-700 text-white w-4 h-4 rounded-full border border-black text-[8px] shadow-lg transition"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
            ))
          ) : (
            <span className="text-xs text-slate-500 font-mono italic">Nenhum produto cadastrado nesta linha.</span>
          )}

          {/* ADD PRODUCT TRIGGER */}
          <button
            onClick={() => setShowAddProductModal(true)}
            className="px-2.5 py-1.5 border border-dashed border-[#1E1E24] text-slate-500 hover:text-white hover:border-orange-500 rounded-lg transition text-xs flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Novo Produto</span>
          </button>
        </div>
      </div>

      {/* DETAILED CATEGORY SELECTION & MAIN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* LEFT COLUMN: CATEGORIES (Como fabricar, Setup, etc.) */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 font-mono">
            Roteiro de Instruções ({categories.length})
          </h3>

          <div className="space-y-1.5">
            {categories.map((cat) => {
              const matchedInst = instructions.find(
                i => i.lineId === selectedLineId && 
                     i.productId === selectedProductId && 
                     i.category.toLowerCase() === cat.toLowerCase()
              );
              const isActive = selectedCategory === cat;

              return (
                <button
                  key={cat}
                  onClick={() => { setSelectedCategory(cat); setIsVideoPlaying(false); }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-xs font-bold uppercase transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-orange-500 text-black border-orange-500 font-extrabold' 
                      : 'bg-[#0F0F12] text-slate-300 border-[#1E1E24] hover:bg-[#15151A]'
                  }`}
                >
                  <span>{cat}</span>
                  {matchedInst ? (
                    <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-black' : 'bg-emerald-500'}`} title="Instrução Cadastrada"></span>
                  ) : (
                    <span className={`text-[8.5px] px-1 py-0.5 rounded ${isActive ? 'bg-black/10 text-black' : 'bg-[#15151A] border border-[#1E1E24]/60 text-slate-500'}`}>Vazio</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* QUICK SUMMARY */}
          <div className="bg-[#0F0F12] border border-[#1E1E24] p-4 rounded-2xl text-xs font-mono space-y-2">
            <div className="text-[#666666] font-bold uppercase tracking-wider border-b border-[#1E1E24] pb-1.5 mb-2 flex items-center justify-between">
              <span>Metadados da Linha</span>
              <Settings className="w-3.5 h-3.5 text-slate-500" />
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Linha:</span>
              <span className="text-white font-bold">{activeLine?.name || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Peça Atual:</span>
              <span className="text-orange-400 font-bold">{activeProduct?.name || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Instruções:</span>
              <span className="text-white">
                {instructions.filter(i => i.lineId === selectedLineId && i.productId === selectedProductId).length} / 7
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIVE WORK INSTRUCTION VIEW */}
        <div className="lg:col-span-3">
          
          {activeInstruction ? (
            <div className="bg-[#0F0F12] border border-[#1E1E24] rounded-2xl overflow-hidden shadow-2xl space-y-6 pb-8 animate-fade-in">
              
              {/* HERO HEADER */}
              <div 
                className="h-48 relative bg-cover bg-center" 
                style={{ backgroundImage: `url(${activeInstruction.imageUrl})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F12] via-[#0F0F12]/60 to-transparent" />
                <div className="absolute bottom-5 left-6 right-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3">
                  <div className="space-y-1.5">
                    <span className="font-mono text-[9px] bg-[#0091FF] text-white px-2.5 py-0.5 rounded-full font-black uppercase shadow-lg">
                      {activeInstruction.code} • {activeInstruction.category}
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight leading-tight">
                      {activeInstruction.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => handleOpenForm('edit')}
                    className="px-3 py-1.5 bg-white hover:bg-slate-200 text-black rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Editar POP</span>
                  </button>
                </div>
              </div>

              {/* SPECIFIC FIELDS GRID */}
              <div className="px-6 space-y-6">
                
                {/* METADATA GRID */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-b border-[#1E1E24] pb-5 font-mono text-xs">
                  <div className="p-2.5 bg-[#15151A] border border-[#1E1E24] rounded-xl flex flex-col space-y-1">
                    <span className="text-[8px] text-slate-500 uppercase font-bold">⏱️ Tempo Estimado</span>
                    <span className="text-white font-black">{activeInstruction.estimatedTime}</span>
                  </div>
                  <div className="p-2.5 bg-[#15151A] border border-[#1E1E24] rounded-xl flex flex-col space-y-1">
                    <span className="text-[8px] text-slate-500 uppercase font-bold">📋 Versão / Revisão</span>
                    <span className="text-orange-500 font-black">{activeInstruction.version} ({activeInstruction.revisionDate})</span>
                  </div>
                  <div className="p-2.5 bg-[#15151A] border border-[#1E1E24] rounded-xl flex flex-col space-y-1">
                    <span className="text-[8px] text-slate-500 uppercase font-bold">👤 Responsável</span>
                    <span className="text-slate-300 font-bold truncate">{activeInstruction.responsible}</span>
                  </div>
                  <div className="p-2.5 bg-[#15151A] border border-[#1E1E24] rounded-xl flex flex-col space-y-1">
                    <span className="text-[8px] text-slate-500 uppercase font-bold">⚙️ Equipamento Alvo</span>
                    <span className="text-[#0091FF] font-black">{activeInstruction.machineId || 'Estação CNC'}</span>
                  </div>
                </div>

                {/* DESCRIPTION */}
                <div className="space-y-2 text-left">
                  <h4 className="text-xs font-black uppercase text-slate-500 font-mono tracking-wider">Descrição das Atividades</h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    {activeInstruction.description}
                  </p>
                </div>

                {/* PPES AND TOOLS (SAFETY FIRST) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
                  {/* PPE CARD */}
                  <div className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-xl space-y-3">
                    <h5 className="text-[10px] font-black uppercase tracking-wider text-orange-400 font-mono flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-orange-500" />
                      EPIs de Uso Obrigatório (Regulamento NR-12)
                    </h5>
                    <ul className="space-y-1.5">
                      {activeInstruction.ppes.map((ppe, i) => (
                        <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                          <span>{ppe}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* TOOLS CARD */}
                  <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl space-y-3">
                    <h5 className="text-[10px] font-black uppercase tracking-wider text-[#0091FF] font-mono flex items-center gap-1.5">
                      <Wrench className="w-4 h-4 text-[#0091FF]" />
                      Instrumentos e Ferramentas Calibradas
                    </h5>
                    <ul className="space-y-1.5">
                      {activeInstruction.tools.map((tool, i) => (
                        <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                          <Wrench className="w-3.5 h-3.5 text-[#0091FF] shrink-0 mt-0.5" />
                          <span>{tool}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* SHOP FLOOR INTERACTIVE CHECKLIST */}
                <div className="bg-[#15151A]/60 border border-[#1E1E24] rounded-xl p-5 space-y-4 text-left">
                  <div className="flex items-center justify-between border-b border-[#1E1E24] pb-3">
                    <div className="space-y-0.5">
                      <h5 className="text-xs font-black uppercase tracking-wider text-white font-mono">
                        Instruções Passo-a-Passo de Posto de Trabalho
                      </h5>
                      <p className="text-[10px] text-slate-500">Obrigatório realizar verificação sequencial para garantia da qualidade.</p>
                    </div>
                    <button 
                      onClick={resetChecklist}
                      className="text-[10px] font-mono text-orange-500 hover:underline bg-transparent font-bold cursor-pointer"
                    >
                      Resetar Checklist
                    </button>
                  </div>

                  {/* Progress Indicator */}
                  <div className="flex items-center gap-3 bg-black/40 border border-[#1E1E24] p-3 rounded-xl font-mono text-xs">
                    <div className="flex-1">
                      <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                        <span>Progresso do Operador:</span>
                        <span className="font-bold text-white">{completionPercentage}%</span>
                      </div>
                      <div className="w-full bg-[#15151A] h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full transition-all duration-300" style={{ width: `${completionPercentage}%` }}></div>
                      </div>
                    </div>
                    {completionPercentage === 100 && (
                      <span className="text-[10px] font-bold text-[#00E676] bg-emerald-950/40 border border-emerald-900/30 px-2 py-1 rounded">PRONTO PARA USINAR</span>
                    )}
                  </div>

                  <div className="space-y-2.5">
                    {activeInstruction.steps.map((step, index) => {
                      const isChecked = !!checkedSteps[step.id];
                      return (
                        <div 
                          key={step.id}
                          onClick={() => toggleStep(step.id)}
                          className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                            isChecked 
                              ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-300' 
                              : 'bg-[#0F0F12]/60 border-[#1E1E24]/60 text-slate-200 hover:border-slate-800'
                          }`}
                        >
                          <button className="shrink-0 mt-0.5 text-slate-500 cursor-pointer">
                            {isChecked ? (
                              <CheckSquare className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-600" />
                            )}
                          </button>
                          <div className="text-xs leading-relaxed flex gap-2">
                            <span className="font-mono text-slate-500 font-bold shrink-0">{String(index + 1).padStart(2, '0')}.</span>
                            <span className={isChecked ? 'line-through text-slate-500 font-medium' : 'font-medium'}>
                              {step.text}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* INTERACTIVE TECHNICAL BLUEPRINT (DESENHO TÉCNICO) */}
                <div className="bg-[#15151A]/60 border border-[#1E1E24] rounded-xl p-5 space-y-4 text-left">
                  <div className="flex items-center justify-between border-b border-[#1E1E24] pb-3">
                    <div>
                      <h5 className="text-xs font-black uppercase tracking-wider text-white font-mono">
                        Desenho Técnico Integrado (Especificação Nominal)
                      </h5>
                      <p className="text-[10px] text-slate-500">Desenho técnico eletrônico do componente para verificação de tolerância Zeiss.</p>
                    </div>
                    <button
                      onClick={() => setShowBlueprintZoom(!showBlueprintZoom)}
                      className="text-[10px] font-mono text-[#0091FF] hover:underline bg-transparent font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{showBlueprintZoom ? "Fechar Zoom" : "Ver Tolerâncias"}</span>
                    </button>
                  </div>

                  <div className="bg-black border border-[#1E1E24] rounded-xl p-4 flex flex-col items-center justify-center min-h-64 relative overflow-hidden font-mono">
                    
                    {/* Interative Technical Drawing Grid */}
                    <div className="absolute inset-0 bg-[radial-gradient(#1E1E24_1px,transparent_1px)] [background-size:16px_16px] opacity-45"></div>

                    {/* Vector Blueprint Simulation */}
                    <div className="relative w-full max-w-sm h-48 border border-dashed border-[#1E1E24]/60 p-4 rounded-lg flex items-center justify-center">
                      
                      {/* Blueprint Lines */}
                      <svg viewBox="0 0 100 50" className="w-full h-full text-[#0091FF]">
                        {/* Axial lines */}
                        <line x1="5" y1="25" x2="95" y2="25" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3,3" />
                        <line x1="50" y1="5" x2="50" y2="45" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3,3" />

                        {/* Outer profile */}
                        <rect x="25" y="15" width="50" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" />
                        
                        {/* Central bearing bore */}
                        <circle cx="50" cy="25" r="8" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />

                        {/* Internal cooling duct */}
                        <path d="M 30 15 L 35 25 L 30 35" fill="none" stroke="currentColor" strokeWidth="1" />
                        <path d="M 70 15 L 65 25 L 70 35" fill="none" stroke="currentColor" strokeWidth="1" />

                        {/* Dimensions markers */}
                        <path d="M 25 10 L 75 10" fill="none" stroke="white" strokeWidth="0.5" />
                        <path d="M 25 8 L 25 12" stroke="white" strokeWidth="0.5" />
                        <path d="M 75 8 L 75 12" stroke="white" strokeWidth="0.5" />

                        {/* Dimension text */}
                        <text x="50" y="8" fill="white" fontSize="3" textAnchor="middle" fontFamily="monospace">120.00mm (±0.05)</text>

                        <text x="18" y="26" fill="white" fontSize="3" textAnchor="middle" fontFamily="monospace">45mm (±0.03)</text>
                        <line x1="18" y1="15" x2="18" y2="35" stroke="white" strokeWidth="0.5" />
                        <line x1="16" y1="15" x2="20" y2="15" stroke="white" strokeWidth="0.5" />
                        <line x1="16" y1="35" x2="20" y2="35" stroke="white" strokeWidth="0.5" />
                      </svg>

                      {/* Hotspots for inspection */}
                      {showBlueprintZoom && (
                        <>
                          <div className="absolute top-[52%] left-[48%] -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 border-orange-500 bg-orange-500/10 flex items-center justify-center animate-ping"></div>
                          <div className="absolute top-[38%] left-[72%] p-2 bg-[#15151A] border border-orange-500 rounded-lg text-[9px] font-mono text-white max-w-28 space-y-1 z-10 shadow-xl">
                            <span className="font-bold text-orange-400 block uppercase">Alvo Crítico T08:</span>
                            <span>Usinagem Interna Ø20.00mm [±0.01mm]</span>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="w-full text-center mt-3 text-[10px] text-slate-500">
                      <span>Representação Esquemática Tridimensional. Foco de Calibração: <strong className="text-white font-bold">Furo central de bronze axial</strong></span>
                    </div>
                  </div>
                </div>

                {/* OBSERVATIONS (OBSERVAÇÕES) */}
                <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl space-y-1 text-left">
                  <h5 className="text-[10px] font-black uppercase text-amber-500 font-mono flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Observações Importantes e Cuidados do Posto</span>
                  </h5>
                  <p className="text-xs text-slate-400 leading-relaxed font-mono">
                    {activeInstruction.observations}
                  </p>
                </div>

                {/* MEDIA & SUPPORT AREA */}
                <div className="border-t border-[#1E1E24] pt-5 space-y-4 text-left">
                  <h4 className="text-xs font-black uppercase text-slate-500 font-mono tracking-wider flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-orange-500" />
                    Mídias de Apoio e Arquivo PDF do Setup
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* VIDEO PLAYER */}
                    <div className="bg-black rounded-xl border border-[#1E1E24] overflow-hidden flex flex-col justify-between relative h-48 group">
                      {!isVideoPlaying ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 p-6 text-center space-y-3">
                          <PlayCircle className="w-12 h-12 text-orange-500 group-hover:scale-110 transition cursor-pointer" onClick={() => setIsVideoPlaying(true)} />
                          <div>
                            <span className="text-[10px] font-mono text-slate-400 block uppercase">Vídeo Demonstrativo de Operação</span>
                            <span className="text-xs font-bold text-white uppercase">{activeInstruction.code} - Treinamento</span>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-full relative">
                          <video 
                            src={activeInstruction.videoUrl} 
                            controls 
                            autoPlay
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => setIsVideoPlaying(false)}
                            className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black rounded-lg text-white"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* DOCUMENTATION DOWNLOAD */}
                    <div className="p-5 bg-[#15151A]/60 border border-[#1E1E24] rounded-xl flex flex-col justify-between h-48 font-mono text-xs">
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5 text-orange-500">
                          <FileText className="w-4 h-4" />
                          <span className="text-[10px] font-bold uppercase">Manual PDF Oficial</span>
                        </div>
                        <h6 className="text-white font-bold uppercase leading-snug">Folha de Engenharia e Controle Estatístico (CEP)</h6>
                        <p className="text-[10px] text-slate-500 normal-case leading-relaxed">Baixe o manual oficial aprovado pelo gestor da qualidade contendo todas as cotas mecânicas toleradas.</p>
                      </div>

                      <div className="flex gap-2">
                        <button 
                          onClick={() => setShowPdfMock(true)}
                          className="flex-1 py-2 bg-[#0F0F12] border border-[#1E1E24] hover:border-[#0091FF] rounded-lg text-[10px] text-center font-bold text-slate-300 flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-400" />
                          <span>VISUALIZAR</span>
                        </button>

                        <a 
                          href={activeInstruction.pdfUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-3 py-2 bg-slate-900 border border-[#1E1E24] hover:bg-slate-800 text-slate-300 rounded-lg flex items-center justify-center"
                          title="Fazer Download do PDF"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      </div>
                    </div>

                  </div>
                </div>

                {/* REVISION HISTORY (HISTÓRICO DE ALTERAÇÕES) */}
                <div className="border-t border-[#1E1E24] pt-5 space-y-3 text-left">
                  <h4 className="text-xs font-black uppercase text-slate-500 font-mono tracking-wider flex items-center gap-1.5">
                    <History className="w-4 h-4 text-[#0091FF]" />
                    Histórico de Revisões e Controle de Alterações
                  </h4>

                  <div className="overflow-hidden border border-[#1E1E24] rounded-xl bg-black/20">
                    <table className="w-full text-left font-mono text-[10.5px] text-slate-300">
                      <thead>
                        <tr className="bg-[#15151A] border-b border-[#1E1E24] text-slate-500 uppercase font-bold text-[9px]">
                          <th className="py-2.5 px-4">Data</th>
                          <th className="py-2.5 px-4">Versão</th>
                          <th className="py-2.5 px-4">Autor</th>
                          <th className="py-2.5 px-4">Modificações Realizadas</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1E1E24]/60">
                        {activeInstruction.changeHistory?.map((hist, i) => (
                          <tr key={i} className="hover:bg-[#15151A]/30">
                            <td className="py-2.5 px-4 text-white font-bold">{hist.date}</td>
                            <td className="py-2.5 px-4 text-orange-400 font-bold">{hist.version}</td>
                            <td className="py-2.5 px-4">{hist.author}</td>
                            <td className="py-2.5 px-4 text-slate-400">{hist.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

            </div>
          ) : (
            /* EMPTY STATE FOR CATEGORY WITH OPTION TO CREATE POP */
            <div className="bg-[#0F0F12] border border-[#1E1E24] rounded-2xl p-12 text-center space-y-4 flex flex-col items-center justify-center">
              <div className="p-4 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-full">
                <FileDigit className="w-10 h-10 animate-bounce" />
              </div>
              <div className="space-y-1 max-w-md">
                <h3 className="text-base font-bold text-white uppercase">Nenhum POP Cadastrado</h3>
                <p className="text-xs text-slate-400">
                  Ainda não existe uma instrução de trabalho do tipo <strong className="text-white">"{selectedCategory}"</strong> cadastrada para o produto <strong className="text-white">"{activeProduct?.name}"</strong> na linha <strong className="text-white">"{activeLine?.name}"</strong>.
                </p>
              </div>

              <button
                onClick={() => handleOpenForm('create')}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-black font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Criar Instrução de Trabalho</span>
              </button>
            </div>
          )}

        </div>

      </div>

      {/* POPUP: PDF MOCK VIEW */}
      {showPdfMock && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F0F12] border border-[#1E1E24] w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[600px]">
            <div className="p-4 bg-[#15151A] border-b border-[#1E1E24] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4.5 h-4.5 text-orange-500" />
                <span className="text-xs font-bold text-white font-mono uppercase">FOLHA DE PROCESSO OFICIAL: {activeInstruction?.code}</span>
              </div>
              <button 
                onClick={() => setShowPdfMock(false)}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated PDF Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-white text-slate-900 font-sans text-left">
              <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
                <div>
                  <h1 className="text-xl font-black uppercase tracking-tight">MANUAL DE INSTRUÇÃO OPERACIONAL</h1>
                  <span className="font-mono text-xs text-slate-500">ISO 9001:2015 Certificado - Qualidade CNC</span>
                </div>
                <div className="text-right font-mono text-[10px] text-slate-500">
                  <div>DOCUMENTO: <strong className="text-slate-900">{activeInstruction?.code}</strong></div>
                  <div>VERSÃO: <strong className="text-slate-900">{activeInstruction?.version}</strong></div>
                  <div>REVISÃO: <strong className="text-slate-900">{activeInstruction?.revisionDate}</strong></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 font-bold uppercase block">Linha de Produção</span>
                  <span className="font-bold text-slate-900">{activeLine?.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase block">Componente de Usinagem</span>
                  <span className="font-bold text-slate-900">{activeProduct?.name}</span>
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="text-sm font-black border-b border-slate-200 pb-1 uppercase">1. OBJETIVO DO POP</h2>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {activeInstruction?.description}
                </p>
              </div>

              <div className="space-y-3">
                <h2 className="text-sm font-black border-b border-slate-200 pb-1 uppercase">2. PASSOS PROCEDIMENTAIS OBRIGATÓRIOS</h2>
                <ol className="list-decimal pl-5 space-y-1.5 text-xs text-slate-800">
                  {activeInstruction?.steps.map((s, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {s.text}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="space-y-3">
                <h2 className="text-sm font-black border-b border-slate-200 pb-1 uppercase">3. MEDIDAS DE SEGURANÇA E EPIS</h2>
                <div className="flex flex-wrap gap-2">
                  {activeInstruction?.ppes.map((ppe, i) => (
                    <span key={i} className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-800 rounded text-[10.5px] font-medium">🛡️ {ppe}</span>
                  ))}
                </div>
              </div>

              <div className="pt-8 border-t border-dashed border-slate-300 text-center font-mono text-[9px] text-slate-400">
                <span>Assinado eletronicamente por {activeInstruction?.responsible} - Departamento de Qualidade Industrial</span>
              </div>
            </div>

            <div className="p-4 bg-[#15151A] border-t border-[#1E1E24] flex justify-end gap-3">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl"
              >
                Imprimir Documento
              </button>
              <button
                onClick={() => setShowPdfMock(false)}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-black font-bold text-xs rounded-xl"
              >
                Concluído
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP MODAL: ADD LINE */}
      {showAddLineModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F0F12] border border-[#1E1E24] w-full max-w-sm rounded-2xl p-6 shadow-2xl space-y-4 text-left">
            <h3 className="text-sm font-bold text-white uppercase tracking-tight">Cadastrar Nova Linha</h3>
            <p className="text-xs text-slate-400">Insira o nome da nova linha industrial de usinagem.</p>
            <input 
              type="text" 
              value={newLineName} 
              onChange={(e) => setNewLineName(e.target.value)} 
              placeholder="Ex: Scania V8, John Deere Eixo..."
              className="w-full bg-[#15151A] border border-[#1E1E24] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#0091FF]"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowAddLineModal(false)} className="px-3.5 py-2 bg-[#15151A] text-slate-400 text-xs rounded-xl hover:text-white">Cancelar</button>
              <button onClick={handleAddLine} className="px-3.5 py-2 bg-[#0091FF] text-white text-xs font-bold rounded-xl hover:bg-[#007EE5]">Salvar</button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP MODAL: ADD PRODUCT */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F0F12] border border-[#1E1E24] w-full max-w-sm rounded-2xl p-6 shadow-2xl space-y-4 text-left">
            <h3 className="text-sm font-bold text-white uppercase tracking-tight">Cadastrar Novo Produto</h3>
            <p className="text-xs text-slate-400">Adicione um novo componente de usinagem na linha <strong className="text-white">"{activeLine?.name}"</strong>.</p>
            <input 
              type="text" 
              value={newProductName} 
              onChange={(e) => setNewProductName(e.target.value)} 
              placeholder="Ex: Bagie, Cabeçote..."
              className="w-full bg-[#15151A] border border-[#1E1E24] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowAddProductModal(false)} className="px-3.5 py-2 bg-[#15151A] text-slate-400 text-xs rounded-xl hover:text-white">Cancelar</button>
              <button onClick={handleAddProduct} className="px-3.5 py-2 bg-orange-500 text-black text-xs font-bold rounded-xl hover:bg-orange-600">Salvar</button>
            </div>
          </div>
        </div>
      )}

      {/* FULL INSTRUCTION EDIT/CREATE FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0F0F12] border border-[#1E1E24] w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] text-left">
            <div className="p-5 bg-[#15151A] border-b border-[#1E1E24] flex items-center justify-between">
              <h3 className="text-sm font-black text-white uppercase tracking-tight">
                {formMode === 'create' ? 'Criar Nova Instrução de Trabalho' : 'Editar Instrução de Trabalho'}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 font-bold uppercase">Título da Instrução</label>
                  <input type="text" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} className="w-full bg-black border border-[#1E1E24] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 font-bold uppercase">Linha / Produto Alvo</label>
                  <div className="w-full bg-[#15151A] border border-[#1E1E24] rounded-xl px-3 py-2 text-xs text-slate-400 font-semibold">{activeLine?.name} &gt; {activeProduct?.name}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 font-bold uppercase">Tempo Estimado</label>
                  <input type="text" value={formEstimatedTime} onChange={(e) => setFormEstimatedTime(e.target.value)} className="w-full bg-black border border-[#1E1E24] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 font-bold uppercase">Versão</label>
                  <input type="text" value={formVersion} onChange={(e) => setFormVersion(e.target.value)} className="w-full bg-black border border-[#1E1E24] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 font-bold uppercase">Responsável</label>
                  <input type="text" value={formResponsible} onChange={(e) => setFormResponsible(e.target.value)} className="w-full bg-black border border-[#1E1E24] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 font-bold uppercase">Categoria POP</label>
                  <div className="w-full bg-[#15151A] border border-[#1E1E24] rounded-xl px-3 py-2 text-xs text-slate-400 font-semibold">{selectedCategory}</div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 font-bold uppercase">Descrição Geral</label>
                <textarea rows={2} value={formDescription} onChange={(e) => setFormDescription(e.target.value)} className="w-full bg-black border border-[#1E1E24] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-orange-500" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 font-bold uppercase">Observações e Alertas</label>
                <textarea rows={2} value={formOberservations} onChange={(e) => setFormObservations(e.target.value)} className="w-full bg-black border border-[#1E1E24] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-orange-500" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 font-bold uppercase">Passo-a-Passo (Um por linha)</label>
                  <textarea rows={6} value={formSteps} onChange={(e) => setFormSteps(e.target.value)} placeholder="Passo 1..." className="w-full bg-black border border-[#1E1E24] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-orange-500 font-mono" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-[#666666] font-bold uppercase">EPIs Obrigatórios (Um por linha)</label>
                  <textarea rows={6} value={formPpes} onChange={(e) => setFormPpes(e.target.value)} placeholder="Óculos..." className="w-full bg-black border border-[#1E1E24] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-orange-500 font-mono" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-[#666666] font-bold uppercase">Ferramentas (Uma por linha)</label>
                  <textarea rows={6} value={formTools} onChange={(e) => setFormTools(e.target.value)} placeholder="Chave..." className="w-full bg-black border border-[#1E1E24] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-orange-500 font-mono" />
                </div>
              </div>

            </div>

            <div className="p-4 bg-[#15151A] border-t border-[#1E1E24] flex justify-end gap-2">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-[#0F0F12] hover:bg-black text-slate-400 text-xs font-bold rounded-xl">Cancelar</button>
              <button onClick={handleSaveInstruction} className="px-4 py-2 bg-[#0091FF] hover:bg-[#007EE5] text-white text-xs font-bold rounded-xl">Gravar POP</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
