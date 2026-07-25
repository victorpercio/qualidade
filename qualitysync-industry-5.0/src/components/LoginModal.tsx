import React, { useState } from 'react';
import { Mail, Lock, Building, User, Key, ArrowRight, Shield, X } from 'lucide-react';
import { UserProfile } from '../types';

interface LoginModalProps {
  onClose: () => void;
  onLoginSuccess: (profile: UserProfile) => void;
  userEmail: string;
}

export default function LoginModal({ onClose, onLoginSuccess, userEmail }: LoginModalProps) {
  const [tab, setTab] = useState<'login' | 'register' | 'recover'>('login');
  
  // Login standard fields
  const [email, setEmail] = useState(userEmail || 'globoestudio78@gmail.com');
  const [password, setPassword] = useState('admin123');
  
  // Registration fields
  const [regEmail, setRegEmail] = useState('');
  const [regCompany, setRegCompany] = useState('Usinagem Precision S.A.');
  const [regOperator, setRegOperator] = useState('Henrique Albuquerque');
  const [regPlan, setRegPlan] = useState<'starter' | 'professional' | 'enterprise'>('professional');

  // Recover fields
  const [recoverEmail, setRecoverEmail] = useState('');

  // Feedbacks
  const [feedback, setFeedback] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Por favor, preencha todos os campos.");
      return;
    }
    setErrorMsg(null);
    setFeedback("Acessando com sucesso...");
    setTimeout(() => {
      onLoginSuccess({
        email,
        companyName: "Metalúrgica AeroMetais Brass",
        operatorName: "Carlos Santos",
        role: "Engenheiro de Metrologia Sênior",
        planId: "professional"
      });
      onClose();
    }, 800);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regEmail || !regOperator || !regCompany) {
      setErrorMsg("Preencha todos os campos cadastrais.");
      return;
    }
    setErrorMsg(null);
    setFeedback("Registrando conta corporativa...");
    setTimeout(() => {
      onLoginSuccess({
        email: regEmail,
        companyName: regCompany,
        operatorName: regOperator,
        role: "Gestor Industrial",
        planId: regPlan
      });
      onClose();
    }, 1200);
  };

  const handleRecover = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoverEmail) {
      setErrorMsg("Digite o e-mail de administrador.");
      return;
    }
    setErrorMsg(null);
    setFeedback(`Token de recuperação enviado para: ${recoverEmail}`);
    setTimeout(() => {
      setTab('login');
      setFeedback(null);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
      
      {/* Container Card */}
      <div className="relative w-full max-w-md overflow-hidden bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl shadow-cyan-500/10 p-8">
        
        {/* Glow Header effect */}
        <div className="absolute top-0 right-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand */}
        <div className="text-center mb-6">
          <span className="font-mono text-[9px] tracking-widest text-cyan-400 font-extrabold bg-cyan-950/30 px-2 py-0.5 rounded border border-cyan-800/40">
            SECURE PORTAL COUPLING
          </span>
          <h3 className="text-xl font-bold text-white mt-2">QualitySync Portal</h3>
          <p className="text-slate-400 text-xs mt-1">Inspeção metrológica conectada à Indústria 5.0</p>
        </div>

        {/* Tabs for Login / Register */}
        {tab !== 'recover' && (
          <div className="grid grid-cols-2 bg-slate-950 p-1 rounded-lg border border-slate-800 mb-6">
            <button 
              onClick={() => { setTab('login'); setErrorMsg(null); setFeedback(null); }}
              className={`py-2 text-xs font-semibold rounded-md transition-all ${
                tab === 'login' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Iniciar Sessão
            </button>
            <button 
              onClick={() => { setTab('register'); setErrorMsg(null); setFeedback(null); }}
              className={`py-2 text-xs font-semibold rounded-md transition-all ${
                tab === 'register' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Criar Conta
            </button>
          </div>
        )}

        {/* FEEDBACK STATUS */}
        {errorMsg && (
          <div className="px-3 py-2 bg-red-950/50 border border-red-500/30 rounded text-red-300 text-xs mb-4">
            {errorMsg}
          </div>
        )}

        {feedback && (
          <div className="px-3 py-2 bg-cyan-990/60 border border-cyan-500/30 rounded text-cyan-300 text-xs mb-4 animate-pulse">
            {feedback}
          </div>
        )}

        {/* LOGIN FORM */}
        {tab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">E-mail Organizacional</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-500" />
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500"
                  placeholder="usuario@empresa.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400">Senha Privada</label>
                <button 
                  type="button"
                  onClick={() => setTab('recover')}
                  className="text-xs text-cyan-400 hover:underline"
                >
                  Esqueceu?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-500" />
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Quick prefill tip */}
            <div className="p-2.5 bg-slate-950/60 border border-slate-800 rounded text-[11px] text-slate-400">
              💡 <span className="font-semibold text-slate-200">Demonstração Ativa</span>: Clique em avançar para usar credenciais de metrologista corporativo simuladas para Carlos Santos.
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/10 hover:bg-cyan-400 transition-all flex items-center justify-center gap-2 pointer-events-auto cursor-pointer"
            >
              Autenticar Acesso <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* REGISTER FORM */}
        {tab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">Nome do Inspetor / Operador</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-500" />
                <input 
                  type="text"
                  required
                  value={regOperator}
                  onChange={(e) => setRegOperator(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500"
                  placeholder="Nome Completo"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">Identidade da Empresa</label>
              <div className="relative">
                <Building className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-500" />
                <input 
                  type="text"
                  required
                  value={regCompany}
                  onChange={(e) => setRegCompany(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500"
                  placeholder="Nome da Indústria S/A"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">E-mail de Trabalho</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-500" />
                <input 
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500"
                  placeholder="voce@industria.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">Arranjo de Contrato (SaaS)</label>
              <select 
                value={regPlan}
                onChange={(e) => setRegPlan(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-sm text-slate-300 focus:outline-none focus:border-cyan-500"
              >
                <option value="starter">Starter Precision — Max 2 máquinas</option>
                <option value="professional">Enterprise Pro 5.0 — Max 8 máquinas</option>
                <option value="enterprise">HyperFactory Zeiss Link — Ilimitado</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/10 hover:bg-cyan-400 transition-all flex items-center justify-center gap-2 pointer-events-auto cursor-pointer"
            >
              Criar Conta Gratuita <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* RECOVER PASSWORD FORM */}
        {tab === 'recover' && (
          <form onSubmit={handleRecover} className="space-y-4">
            <div className="text-sm text-slate-300 mb-4 leading-relaxed">
              Forneça seu endereço de e-mail registrado. Nós transmitiremos uma chave criptográfica de provisionamento temporário para repactuar suas credenciais.
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">E-mail Corporativo</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-500" />
                <input 
                  type="email"
                  required
                  value={recoverEmail}
                  onChange={(e) => setRecoverEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500"
                  placeholder="voce@industria.com"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/10 hover:bg-cyan-400 transition-all flex items-center justify-center gap-2 pointer-events-auto cursor-pointer"
            >
              Transmitir Link <ArrowRight className="w-4 h-4" />
            </button>

            <button 
              type="button"
              onClick={() => { setTab('login'); setErrorMsg(null); setFeedback(null); }}
              className="w-full text-xs text-slate-500 hover:text-white mt-4 block text-center"
            >
              Retornar para o Login
            </button>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-slate-950 flex items-center justify-center space-x-2 text-[10px] text-slate-500 font-mono">
          <Shield className="w-3.5 h-3.5 text-cyan-400" />
          <span>AUTENTICAÇÃO SEGURA SSL E ISO/IEC 27001</span>
        </div>
      </div>
    </div>
  );
}
