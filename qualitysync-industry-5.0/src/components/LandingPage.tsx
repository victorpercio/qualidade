import React, { useState } from 'react';
import { 
  ShieldCheck, Cpu, Settings, MessageSquareCode, Layers, Radio, HelpCircle, 
  ArrowRight, Check, Award, Zap, Building, Coins, Briefcase, TrendingUp, BarChart3 
} from 'lucide-react';
import { SaaSPlan } from '../types';

interface LandingPageProps {
  onStart: (plan: 'starter' | 'professional' | 'enterprise') => void;
  onOpenLogin: () => void;
}

export const PLANS: SaaSPlan[] = [
  {
    id: "starter",
    name: "Starter Precision",
    price: "R$ 490",
    period: "mês",
    maxMachines: 2,
    maxUsers: 5,
    features: [
      "Integração IoT com até 2 máquinas",
      "Medições de tolerância básicas",
      "Dashboard analítico padrão em tempo real",
      "Histórico de inspeções de até 30 dias",
      "Sem acesso ao Co-Piloto IA",
      "Suporte por e-mail comercial"
    ]
  },
  {
    id: "professional",
    name: "Plano Co-Piloto IA",
    price: "R$ 1.000",
    period: "mês",
    maxMachines: 8,
    maxUsers: 25,
    features: [
      "Acesso Exclusivo ao Co-Piloto IA",
      "Canal de Sintonia Fina Homem-IA (Gemini)",
      "Varrer com Co-Piloto IA do Operador",
      "Integração IoT para até 8 máquinas simultâneas",
      "Metrologia micrométrica ZEISS Avançada",
      "Histórico ilimitado com rastreabilidade completa",
      "Suporte dedicado 12x5"
    ]
  },
  {
    id: "enterprise",
    name: "HyperFactory Zeiss Link",
    price: "Sob Consulta",
    period: "custom",
    maxMachines: 100,
    maxUsers: 1000,
    features: [
      "Máquinas ilimitadas na infraestrutura",
      "Suíte Metrológica Completa (3D, ótica, laser)",
      "Inspeção visual por micrógrafo térmico cooperativo",
      "Sem acesso ao Co-Piloto IA",
      "Ambiente de teste e homologação homologado ISO 9001",
      "Hospedagem em nuvem privada",
      "SLA de suporte 24/7 com engenheiros de campo"
    ]
  }
];

export default function LandingPage({ onStart, onOpenLogin }: LandingPageProps) {
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'professional' | 'enterprise'>('professional');
  const [selectedInvestmentReason, setSelectedInvestmentReason] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Background Graphic Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-20" />

      {/* Header */}
      <header className="relative z-10 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-cyan-500/30 blur-sm animate-pulse" />
              <div className="relative bg-slate-900 border border-cyan-500 rounded-lg p-2 flex items-center justify-center">
                <Cpu className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
            <div>
              <span className="font-mono text-xs tracking-widest text-cyan-400 font-bold">ZEISS METROLOGY PARTNER</span>
              <h1 className="font-sans font-bold text-lg text-white leading-tight">QualitySync 5.0</h1>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-cyan-400 transition-colors">Plataforma IoT</a>
            <a href="#industry5" className="hover:text-cyan-400 transition-colors">Indústria 5.0</a>
            <a href="#pricing" className="hover:text-cyan-400 transition-colors">Planos SaaS</a>
          </nav>

          <div className="flex items-center space-x-4">
            <button 
              onClick={onOpenLogin}
              className="text-sm font-medium text-slate-300 hover:text-white pointer-events-auto cursor-pointer"
              id="btn-login-header"
            >
              Iniciar Sessão
            </button>
            <button 
              onClick={() => onStart('professional')}
              className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 text-sm font-bold shadow-lg shadow-cyan-500/20 hover:bg-cyan-400 transition-all pointer-events-auto cursor-pointer"
              id="btn-access-header"
            >
              Acesso Rápido MVP
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center space-x-2 border border-cyan-500/30 bg-cyan-950/20 px-3 py-1.5 rounded-full text-xs font-semibold text-cyan-400 mb-6 backdrop-blur-sm shadow-[0_0_15px_rgba(6,182,212,0.1)]">
          <Radio className="w-1.5 h-1.5 text-cyan-400 animate-ping" />
          <span className="tracking-wider">HOMOLOGADO PARA SISTEMAS CYBER-FÍSICOS ZEISS TRUMPF HU</span>
        </div>

        <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
          Sincronização de Produção & <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500">
            Qualidade Metrológica por IA
          </span>
        </h2>

        <p className="max-w-2xl mx-auto text-slate-400 text-base md:text-lg mb-10 leading-relaxed">
          Monitore peças produzidas em tempo real utilizando tecnologia IoT adaptativa da Indústria 5.0. Integre de forma cirúrgica sensores de chão de fábrica com algoritmos de controle estatístico e diagnósticos preditivos do Co-piloto Generativo IA.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <button
            onClick={() => onStart('professional')}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-cyan-500 text-slate-950 font-bold text-base shadow-lg shadow-cyan-500/30 hover:bg-cyan-400 transition-all flex items-center justify-center gap-2 pointer-events-auto cursor-pointer hover:scale-105"
            id="btn-cta-hero"
          >
            Monitorar Fábrica em Tempo Real <ArrowRight className="w-5 h-5" />
          </button>
          <a
            href="#pricing"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-bold text-base hover:bg-slate-800 transition-all flex items-center justify-center gap-2 pointer-events-auto cursor-pointer"
          >
            Ver Planos SaaS
          </a>
        </div>

        {/* Floating Simulator Dashboard Demo Image/Component */}
        <div className="relative max-w-5xl mx-auto rounded-2xl border border-cyan-500/20 bg-slate-900/40 p-3 shadow-2xl shadow-cyan-500/5 backdrop-blur-xl">
          <div className="absolute top-0 right-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
          <div className="bg-slate-950 rounded-xl overflow-hidden border border-slate-900 shadow-inner py-8 px-6 text-left">
            {/* Top Bar window layout */}
            <div className="flex items-center justify-between border-b border-slate-900 pb-4 mb-6">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-red-500/30" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/30" />
                <span className="w-3 h-3 rounded-full bg-green-500/30" />
                <span className="text-xs font-mono text-slate-500 ml-4">METROLOGY_DASHBOARD_LIVE.EXE : 3000</span>
              </div>
              <div className="px-3 py-1 rounded bg-slate-900 border border-slate-800 flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-widest">ZEISS CONNECTED</span>
              </div>
            </div>

            {/* Simulated Live Grid inside Landing Screen */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-slate-900 bg-slate-900/20 rounded-lg p-4">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-1">CONFORMIDADE GERAL</span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold text-white">96.84%</span>
                  <span className="text-xs font-mono text-emerald-400">+1.2% residual</span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 mt-3 rounded-full overflow-hidden">
                  <div className="bg-cyan-400 h-full w-[96.8%]" />
                </div>
              </div>
              <div className="border border-slate-900 bg-slate-900/20 rounded-lg p-4">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-1">FALHAS DE TOLERÂNCIA (HOJE)</span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold text-red-400">1.8%</span>
                  <span className="text-xs font-mono text-slate-500">meta comercial &lt;2%</span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 mt-3 rounded-full overflow-hidden">
                  <div className="bg-red-400 h-full w-[1.8%]" />
                </div>
              </div>
              <div className="border border-slate-900 bg-slate-900/20 rounded-lg p-4">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-1">STATUS CO-PILOTO IA GÊMEO</span>
                <div className="flex items-center space-x-2 mt-2">
                  <div className="p-1 rounded bg-indigo-950 border border-indigo-500/30">
                    <Check className="w-4 h-4 text-cyan-400" />
                  </div>
                  <span className="text-xs font-medium text-slate-200">Ajustando offset CNC-02 automaticamente</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Propositions / Grid Features */}
      <section id="features" className="relative z-10 border-t border-slate-900 bg-slate-950/50 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-widest block mb-2">PRODUTIVIDADE & ACURÁCIA</span>
            <h3 className="text-2xl md:text-4xl font-bold text-white">Pilares de Excelência do QualitySync</h3>
            <p className="text-slate-400 max-w-xl mx-auto mt-3 text-sm md:text-base">
              Fundimos a tradição de metrologia do aço com simulação eletrônica avançada para fornecer confiabilidade imediata ao seu chão de fábrica.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 rounded-xl border border-slate-900 bg-slate-900/25 relative overflow-hidden group hover:border-cyan-500/30 transition-all">
              <div className="absolute top-0 left-0 bg-cyan-500/10 w-24 h-24 blur-2xl rounded-full" />
              <Cpu className="text-cyan-400 w-8 h-8 mb-4 relative" />
              <h4 className="text-lg font-bold text-white mb-2">Simulador de Sensores IoT</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Colete e analise vibrações rotacionais, telemetria térmica de ferramentas e tolerâncias tridimensionais em micrômetros diretamente na tela.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-900 bg-slate-900/25 relative overflow-hidden group hover:border-blue-500/30 transition-all">
              <div className="absolute top-0 left-0 bg-blue-500/10 w-24 h-24 blur-2xl rounded-full" />
              <ShieldCheck className="text-blue-400 w-8 h-8 mb-4 relative" />
              <h4 className="text-lg font-bold text-white mb-2">Controle Estático Conforme</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Aprovação, retrabalho ou scrap decididos instantaneamente com base em tolerâncias estruturais de Engenharia para blindar sua cadeia ISO 9001.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-900 bg-slate-900/25 relative overflow-hidden group hover:border-indigo-500/30 transition-all">
              <div className="absolute top-0 left-0 bg-indigo-500/10 w-24 h-24 blur-2xl rounded-full" />
              <MessageSquareCode className="text-indigo-400 w-8 h-8 mb-4 relative" />
              <h4 className="text-lg font-bold text-white mb-2">Auditor de IA do Operador</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Integração nativa com modelos generativos Gemini para entender no-compliance e propor compensações geométricas acionáveis no painel.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-900 bg-slate-900/25 relative overflow-hidden group hover:border-cyan-500/30 transition-all">
              <div className="absolute top-0 left-0 bg-cyan-500/10 w-24 h-24 blur-2xl rounded-full" />
              <Layers className="text-cyan-400 w-8 h-8 mb-4 relative" />
              <h4 className="text-lg font-bold text-white mb-2">SaaS Multi-planta</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Monitore e gerencie múltiplas linhagens e equipes a partir de um portal unificado, ajustando cotas de produção e provisionamento de forma escalável.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Human-Machine collaboration Indústria 5.0 Detail */}
      <section id="industry5" className="relative z-10 py-24 px-6 bg-slate-950">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="font-mono text-xs text-indigo-400 font-bold uppercase tracking-widest block mb-2">COOPERAÇÃO HOMEM + MÁQUINA</span>
            <h3 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              A Revolução Industrial Colaborativa da Indústria 5.0
            </h3>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-6">
              Enquanto a Indústria 4.0 focou puramente em automação em nuvem e coleta massiva de dados sem contexto, a **Indústria 5.0** coloca o operador humano de volta ao centro da equação, potencializado por parceiros de IA Generativa.
            </p>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-8">
              No QualitySync, a IA não substitui o metrologista ou o operador de usinagem Carlos Santos. Ela atua como um co-piloto instantâneo sugerindo offsets no controle numérico e calibrando desvios térmicos em tempo real enquanto o homem dita a aprovação final.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <div className="p-1.5 rounded-lg bg-emerald-950 border border-emerald-500/30 mt-1">
                  <Award className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h5 className="font-bold text-white text-sm">Aumento de OEE Real</h5>
                  <p className="text-xs text-slate-400 mt-1">Reduza no-compliance de eixos em até 42% via correções prescritivas.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="p-1.5 rounded-lg bg-cyan-950 border border-cyan-500/30 mt-1">
                  <Zap className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h5 className="font-bold text-white text-sm">Mitigação de Desperdício</h5>
                  <p className="text-xs text-slate-400 mt-1">Transforme peças que seriam descartadas em retrabalhos controlados com poucas passadas.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative rounded-2xl border border-slate-900 overflow-hidden bg-slate-900/20 p-8 flex flex-col justify-center">
            <h4 className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-4">GÊMEO DIGITAL DE TELEMETRIA ZEISS</h4>
            <div className="space-y-4">
              <div className="bg-slate-950/80 p-4 rounded-lg border border-slate-900">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-200">Fuso Haas VF-2 — CNC-01</span>
                  <span className="text-[10px] font-mono text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-950/30 border border-emerald-500/20 uppercase">CONFORME</span>
                </div>
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>Tem: 22.4°C</span>
                  <span>Vib: 0.25G</span>
                  <span>RPM: 8520</span>
                </div>
              </div>

              <div className="bg-slate-950/80 p-4 rounded-lg border border-red-500/20 shadow-red-500/5 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-200">Portal Mazak — CNC-02</span>
                  <span className="text-[10px] font-mono text-red-400 px-1.5 py-0.5 rounded bg-red-950/30 border border-red-500/20 uppercase">DERIVAÇÃO TÉRMICA DETECTADA (+4.8°C)</span>
                </div>
                <div className="flex justify-between text-[11px] font-mono text-red-400">
                  <span>Tem: 26.8°C (ALERTA)</span>
                  <span>Vib: 0.58G (CRÍTICO)</span>
                  <span>RPM: 12150</span>
                </div>
                <div className="mt-3 text-[10px] font-mono p-2 bg-indigo-950/40 border border-indigo-900 text-cyan-400 rounded">
                  💡 CORREÇÃO IA: Reduza velocidade axial em 12% ou injete offset spindle Z: -0.04mm.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Executive Boardroom & Investment Hub */}
      <section id="executive-hub" className="relative z-10 py-24 px-6 bg-slate-950 border-t border-slate-900/80">
        {/* Background glow effects */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-500/5 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="font-mono text-xs text-indigo-400 font-bold uppercase tracking-widest block mb-2">
              HUB EXECUTIVO DE DECISÃO
            </span>
            <h3 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
              A Visão Estratégica do QualitySync 5.0
            </h3>
            <p className="text-slate-400 max-w-xl mx-auto mt-3 text-sm md:text-base">
              Compreenda como fundimos inteligência artificial e telemetria industrial para destravar novos patamares de lucratividade e excelência operacional.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Column 1: The elegant continuous narrative prose (no bullet points, no topics) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="border border-slate-800/60 bg-slate-900/10 rounded-2xl p-8 relative overflow-hidden backdrop-blur-sm">
                <div className="absolute top-0 left-0 bg-cyan-500/10 w-32 h-32 blur-3xl rounded-full pointer-events-none" />
                
                <div className="flex items-center gap-2 mb-6">
                  <Briefcase className="w-5 h-5 text-cyan-400" />
                  <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest">
                    Proposta de Valor p/ Conselhos Executivos
                  </span>
                </div>

                <div className="text-slate-300 text-sm md:text-base leading-relaxed space-y-5 font-sans">
                  <p>
                    O QualitySync 5.0 redefine completamente a relação entre a velocidade de produção industrial e a rigidez da conformidade de qualidade. Historicamente, as indústrias operam sob um descompasso estrutural de tempo: enquanto o chão de fábrica usina componentes em alta velocidade, a verificação metrológica e geométrica ocorre de forma isolada em laboratórios de inspeção horas ou dias depois, o que frequentemente resulta no descarte tardio de lotes inteiros de materiais caros devido a imperfeições invisíveis ocorridas durante as passadas iniciais da máquina.
                  </p>
                  <p>
                    Nossa plataforma soluciona este gargalo financeiro de forma definitiva ao estabelecer um "fio digital" instantâneo que integra sensores IoT diretamente na instrumentação de campo com um Co-Piloto de IA Generativa. O sistema monitora de forma preditiva flutuações micro-térmicas e níveis de vibração em fusos CNC, alertando sobre possíveis variações micrométricas e sugerindo offsets mecânicos de precisão em tempo real, impedindo que uma peça fora de tolerância saia da máquina.
                  </p>
                  <p>
                    Ao digitalizar esse controle de ponta a ponta e agregar o histórico detalhado de processamento e calibração de cada componente fabricado em um portal unificado, o QualitySync 5.0 dota a alta liderança de uma visibilidade sem precedentes sobre a Eficiência Geral do Equipamento (OEE) de múltiplas plantas. Esse nível de governança não apenas reduz de forma drástica os custos com sucata e retrabalho, mas também blinda e qualifica a empresa a obter contratos exigentes com gigantes dos setores automotivo, aeroespacial e energético, garantindo um retorno financeiro sobre o investimento robusto, rápido e auditável sob as premissas ESG.
                  </p>
                </div>
              </div>
            </div>

            {/* Column 2: The interactive multiple choice question */}
            <div className="lg:col-span-7 space-y-6">
              <div className="border border-slate-800 bg-slate-900/30 rounded-2xl p-8 relative overflow-hidden backdrop-blur-sm">
                <div className="absolute top-0 right-0 bg-indigo-500/10 w-32 h-32 blur-3xl rounded-full pointer-events-none" />

                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-indigo-400" />
                    <span className="text-xs font-mono text-indigo-400 font-bold uppercase tracking-widest">
                      Simulador de Viabilidade e Retorno (ROI)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                    Análise Interativa
                  </span>
                </div>

                <h4 className="text-lg md:text-xl font-bold text-white leading-snug mb-6">
                  Como CIO ou Diretor de Operações, qual é o principal indicador de retorno financeiro que tornaria a contratação do QualitySync 5.0 prioritária para a sua fábrica?
                </h4>

                {/* Multiple choice choices */}
                <div className="space-y-3.5">
                  {[
                    {
                      id: "scrap",
                      title: "Redução Drástica do Custo com Refugo (Scrap)",
                      desc: "Detecção e compensação micrométrica que evita que peças fora de tolerância virem desperdício de material.",
                      metric: "Até 42% de economia em matéria-prima de alto custo.",
                      icon: <Coins className="w-5 h-5" />,
                      analysis: "Excelente escolha estratégica de impacto imediato na margem operacional de manufatura. A economia direta no refugo de materiais caros (como titânio ou ligas de aço estrutural) e o reaproveitamento preventivo geram retornos diretos no balanço mensal da empresa, recuperando o capital investido na licença SaaS já no primeiro mês de implantação."
                    },
                    {
                      id: "downtime",
                      title: "Mitigação de Paradas de Linha Não Planejadas",
                      desc: "Monitoramento preditivo térmico e vibracional para alertar e programar manutenções antes de quebras severas.",
                      metric: "Redução de até 85% no tempo de inatividade não programado.",
                      icon: <Zap className="w-5 h-5" />,
                      analysis: "Decisão crítica para a continuidade dos negócios. Uma parada não programada em uma célula de produção de alta demanda custa dezenas de milhares de dólares por hora. Ao antecipar variações anômalas vibracionais e térmicas, sua equipe de engenharia agenda reparos preventivos em janelas de menor impacto comercial."
                    },
                    {
                      id: "ai-copilot",
                      title: "Decisão Operacional Acelerada pelo Co-Piloto IA",
                      desc: "Instruções prescritivas em tempo real para os operadores tomarem decisões metrológicas em segundos.",
                      metric: "Redução de até 70% no tempo de análise e ajuste de processos.",
                      icon: <MessageSquareCode className="w-5 h-5" />,
                      analysis: "Visão moderna alinhada com as diretrizes da Indústria 5.0. Ao invés de investir em demissões ou robôs complexos, potencializamos a força de trabalho atual com um co-piloto metrológico assistido por inteligência artificial, democratizando o conhecimento de calibração avançada no chão de fábrica em segundos."
                    },
                    {
                      id: "compliance",
                      title: "Blindagem Legal e Habilitação em Novos Contratos",
                      desc: "Garantia de rastreabilidade 100% digital e imutável para auditorias rigorosas e conformidade ISO 9001.",
                      metric: "Conformidade metrológica certificada de ponta a ponta.",
                      icon: <ShieldCheck className="w-5 h-5" />,
                      analysis: "Foco de longo prazo na expansão e mitigação de riscos regulatórios. Setores de alto valor agregado (automotivo, aeroespacial, biomédico) exigem auditoria histórica intransigente de conformidade geométrica. O portal QualitySync garante relatórios instantâneos e auditabilidade que blindam seu negócio em negociações bilaterais de grande porte."
                    }
                  ].map((option) => {
                    const isSelected = selectedInvestmentReason === option.id;
                    return (
                      <div key={option.id} className="space-y-3">
                        <button
                          onClick={() => setSelectedInvestmentReason(option.id)}
                          className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-start gap-4 cursor-pointer relative ${
                            isSelected 
                              ? 'border-cyan-500 bg-cyan-950/20 shadow-[0_0_15px_rgba(6,182,212,0.15)] scale-[1.01]' 
                              : 'border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900/80'
                          }`}
                        >
                          <div className={`p-2 rounded-lg shrink-0 transition-colors ${
                            isSelected ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {option.icon}
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h5 className="text-sm font-bold text-white">{option.title}</h5>
                              {isSelected && (
                                <span className="text-[9px] bg-cyan-500 text-slate-950 px-1.5 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider">
                                  Selecionado
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 leading-snug">{option.desc}</p>
                            <p className="text-[11px] text-cyan-400 font-mono font-bold mt-1">Impacto: {option.metric}</p>
                          </div>
                        </button>

                        {/* Expandable expert analysis for selection */}
                        {isSelected && (
                          <div className="bg-[#0A0A0C] border border-cyan-500/20 rounded-xl p-5 space-y-3 shadow-inner animate-fade-in">
                            <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-800">
                              <span className="p-1.5 bg-cyan-500/10 text-cyan-400 rounded">
                                <Award className="w-4 h-4" />
                              </span>
                              <div>
                                <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest block font-bold">Diagnóstico de Viabilidade</span>
                                <h6 className="text-xs font-bold text-white">Análise da nossa Banca Executiva</h6>
                              </div>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed font-sans">
                              {option.analysis}
                            </p>
                            <div className="bg-cyan-950/20 border border-cyan-500/10 p-3 rounded-lg flex items-center justify-between text-xs">
                              <span className="text-slate-400 font-mono">Retorno Financeiro Esperado:</span>
                              <span className="font-mono text-[#00E676] font-bold">ROI em até 3 meses de uso comercial</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Pricing / Plan Area */}
      <section id="pricing" className="relative z-10 py-24 px-6 bg-slate-950 border-t border-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-widest block mb-2">NOSSOS PREÇOS</span>
            <h3 className="text-2xl md:text-4xl font-bold text-white">Investimento em Qualidade Conectada</h3>
            <p className="text-slate-400 max-w-xl mx-auto mt-3 text-sm md:text-base">
              Seja uma pequena oficina mecânica de peças agrícolas ou uma montadora aeroespacial de alta precisão ZEISS, temos o arranjo SaaS sob medida.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {PLANS.map((plan) => {
              const isSelected = selectedPlan === plan.id;
              return (
                <div 
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`border cursor-pointer p-8 rounded-2xl flex flex-col justify-between transition-all relative ${
                    isSelected 
                      ? 'border-cyan-500 bg-slate-900/40 shadow-[0_0_30px_rgba(6,182,212,0.1)] scale-102' 
                      : 'border-slate-900 bg-slate-900/10 hover:border-slate-800'
                  }`}
                >
                  {isSelected && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan-500 text-slate-950 text-[10px] font-bold uppercase px-3 py-1 rounded-full tracking-widest">
                      Mais Recomendado
                    </span>
                  )}
                  <div>
                    <h4 className="text-lg font-bold text-white uppercase font-mono tracking-wider mb-2">{plan.name}</h4>
                    <div className="flex items-baseline space-x-2 mb-6">
                      <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                      {plan.period !== 'custom' && (
                        <span className="text-xs text-slate-500">/ {plan.period}</span>
                      )}
                    </div>
                    <div className="space-y-2 mb-6 text-xs text-slate-400 border-b border-slate-900 pb-4">
                      <div className="flex justify-between">
                        <span>Máquinas IoT Ativas:</span>
                        <span className="text-white font-mono">{plan.maxMachines}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Usuários Operacionais:</span>
                        <span className="text-white font-mono">{plan.maxUsers}</span>
                      </div>
                    </div>
                    <ul className="space-y-3 text-sm text-slate-300">
                      {plan.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                          <span className="text-xs">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onStart(plan.id);
                    }}
                    className={`w-full py-3 rounded-lg font-bold text-xs uppercase tracking-widest mt-8 transition-all pointer-events-auto cursor-pointer ${
                      isSelected 
                        ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 hover:bg-cyan-400' 
                        : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    Contratar Plano {plan.name.split(' ')[0]}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-slate-600 text-xs">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Cpu className="w-5 h-5 text-slate-600" />
            <span>QualitySync Industry 5.0 © 2026. Todos os direitos reservados.</span>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-slate-400 transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Política de Privacidade</a>
            <a href="#" className="hover:text-slate-400 transition-colors">ZEISS API homologação</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
