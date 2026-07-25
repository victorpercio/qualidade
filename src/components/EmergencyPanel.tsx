import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, Power, RefreshCw, Volume2, VolumeX } from 'lucide-react';
import { Machine, PartInspection } from '../types';

interface EmergencyPanelProps {
  machines: Machine[];
  setMachines: React.Dispatch<React.SetStateAction<Machine[]>>;
  setInspections: React.Dispatch<React.SetStateAction<PartInspection[]>>;
}

export default function EmergencyPanel({ machines, setMachines, setInspections }: EmergencyPanelProps) {
  const [isStopped, setIsStopped] = useState(false);
  
  // Referências para o áudio da sirene
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Iniciar sirene com som oscilante industrial
  const startAlarmSound = () => {
    try {
      if (oscillatorRef.current) return; // Já está tocando

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sawtooth';
      
      // Frequência oscilante básica
      osc.frequency.setValueAtTime(500, ctx.currentTime);

      // Oscilação periódica do alarme (efeito "uua-uua")
      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(2.0, ctx.currentTime); // 2 oscilações por segundo
      
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(150, ctx.currentTime); // Variação de frequência em Hz

      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Volume moderado e seguro
      gainNode.gain.setValueAtTime(0.12, ctx.currentTime);

      lfo.start();
      osc.start();

      oscillatorRef.current = osc;
      gainNodeRef.current = gainNode;
    } catch (e) {
      console.warn("Navegador bloqueou reprodução de áudio automático.", e);
    }
  };

  // Parar som da sirene
  const stopAlarmSound = () => {
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      } catch (e) {}
      oscillatorRef.current = null;
    }
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch (e) {}
      audioContextRef.current = null;
    }
  };

  // Acionar o botão vermelho grande (Parar Fábrica)
  const handleStopFactory = () => {
    setIsStopped(true);
    startAlarmSound();

    // Desliga totalmente todas as máquinas
    setMachines(prev => prev.map(m => ({
      ...m,
      status: 'offline',
      temperature: 20.0,
      vibration: 0.0,
      speedRpm: 0,
      oee: 0.0,
      utilization: 0
    })));

    // Adiciona evento na lista de metrologia indicando parada manual de pânico
    setInspections(prev => [
      {
        id: `SOS-${Date.now().toString().slice(-4)}`,
        batch: "SOS-PANICO",
        operator: "Plantão de Emergência",
        machineId: "GLOBAL",
        timestamp: new Date().toISOString(),
        measurements: { lengthMm: 0, widthMm: 0, heightMm: 0 },
        deviations: { lengthMm: 0, widthMm: 0, heightMm: 0 },
        temperatureCelsius: 20.0,
        vibrationG: 0.0,
        status: "rejected",
        notes: "SISTEMA INTERROMPIDO PELO BOTÃO EMERGENCIAL DE PARADA GERAL DA FÁBRICA.",
        defectType: "Parada Geral Manual",
        partObservation: "Corte de energia preventiva ativado via botão de pânico.",
        buyerName: "SEGURANÇA",
        partName: "Interrupção Total"
      },
      ...prev
    ]);
  };

  // Religar a fábrica e silenciar sirene
  const handleRestartFactory = () => {
    setIsStopped(false);
    stopAlarmSound();

    // Retorna as máquinas para o funcionamento padrão estável
    setMachines([
      { id: "CNC-01", name: "Torno CNC Haas VF-2 (Linha Alpha)", type: "CNC Milling", status: "online", temperature: 22.4, vibration: 0.25, speedRpm: 8500, oee: 88.5, utilization: 92, partsHeuristic: 3.5, position: { x: 220, y: 150 } },
      { id: "CNC-02", name: "Portal CNC Mazak VCN (Linha Beta)", type: "CNC Milling", status: "online", temperature: 22.8, vibration: 0.28, speedRpm: 9500, oee: 84.2, utilization: 85, partsHeuristic: 2.1, position: { x: 380, y: 240 } },
      { id: "LASER-01", name: "Estação Laser Trumpf 3030 (Linha Gamma)", type: "Laser Cutter", status: "online", temperature: 23.1, vibration: 0.18, speedRpm: 0, oee: 93.2, utilization: 95, partsHeuristic: 6.8, position: { x: 550, y: 150 } },
      { id: "ROB-03", name: "Braço KUKA KR-16 (Estação Montagem)", type: "Robotic Assembly", status: "online", temperature: 21.8, vibration: 0.12, speedRpm: 1800, oee: 91.0, utilization: 89, partsHeuristic: 4.2, position: { x: 740, y: 320 } },
      { id: "ZEISS-01", name: "Metrologia 3D ZEISS PRISMO", type: "Metrology Zeiss Station", status: "online", temperature: 21.0, vibration: 0.02, speedRpm: 0, oee: 98.4, utilization: 99, partsHeuristic: 1.5, position: { x: 480, y: 410 } }
    ]);
  };

  // Limpar áudio ao sair da tela
  useEffect(() => {
    return () => {
      stopAlarmSound();
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 font-sans text-center">
      
      {/* TÍTULO E FEEDBACK DE ESTADO SIMPLES COM CORES SÓLIDAS */}
      <div className="mb-8">
        <h2 className="text-xl font-bold uppercase tracking-wider text-slate-400 mb-2">
          Controle de Emergência Simplificado
        </h2>
        
        {isStopped ? (
          <div className="bg-red-600 text-white font-extrabold text-lg py-4 px-6 rounded-xl uppercase tracking-wide inline-flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 animate-bounce" />
            <span>ALERTA ACIONADO: TODAS AS MÁQUINAS PARADAS</span>
          </div>
        ) : (
          <div className="bg-emerald-600 text-white font-extrabold text-base py-3 px-6 rounded-xl uppercase tracking-wide inline-flex items-center gap-2">
            <span>MÁQUINAS EM OPERAÇÃO NORMAL</span>
          </div>
        )}
      </div>

      {/* ÁREA CENTRAL - BOTÃO GIGANTE DE PARADA */}
      <div className="flex flex-col items-center justify-center py-10">
        
        {!isStopped ? (
          <button
            onClick={handleStopFactory}
            className="w-72 h-72 rounded-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white flex flex-col items-center justify-center select-none shadow-2xl cursor-pointer transition-all border-4 border-white"
          >
            <Power className="w-16 h-16 mb-2" />
            <span className="text-3xl font-black tracking-widest">PARAR FÁBRICA</span>
            <span className="text-xs font-mono text-red-200 mt-2 uppercase font-semibold">Desliga tudo & Toca Alarme</span>
          </button>
        ) : (
          <div className="flex flex-col items-center space-y-6">
            {/* ÍCONE DE ESTADO PARADO */}
            <div className="w-48 h-48 rounded-full bg-slate-800 text-red-500 flex items-center justify-center border-4 border-red-600">
              <AlertTriangle className="w-24 h-24 animate-pulse" />
            </div>

            {/* BOTÃO VERDE SÓLIDO PARA RELIGAR */}
            <button
              onClick={handleRestartFactory}
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-black text-lg rounded-xl uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all border border-emerald-500"
            >
              <RefreshCw className="w-5 h-5" />
              Religar Fábrica / Desligar Alarme
            </button>
          </div>
        )}

      </div>

      {/* TEXTO DE ORIENTAÇÃO ULTRA SIMPLIFICADO */}
      <div className="mt-8 max-w-xl mx-auto bg-[#15151A] border border-slate-800 p-5 rounded-xl">
        <p className="text-sm text-slate-300 leading-relaxed font-medium">
          <strong>Para casos de emergência (fumaça, faísca ou barulhos anormais):</strong> Aperte o botão vermelho acima. Ele interrompe a energia principal de todas as frentes de trabalho imediatamente e toca uma sirene sonora de alerta.
        </p>
      </div>

    </div>
  );
}
