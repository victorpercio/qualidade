export interface WorkInstructionStep {
  id: string;
  text: string;
}

export interface WorkInstructionChange {
  date: string;
  version: string;
  author: string;
  description: string;
}

export interface WorkInstruction {
  id: string;
  code: string;
  title: string;
  lineId: string;       // e.g. "scania", "volvo", "mercedes", "volkswagen", "john_deere"
  lineName: string;     // e.g. "Scania", "Volvo"
  productId: string;    // e.g. "bagie", "cabecote", "suporte", "bloco_motor"
  productName: string;  // e.g. "Bagie", "Cabeçote"
  category: string;     // e.g. "Como fabricar", "Setup inicial", "Troca de ferramenta", "Inspeção", "Medição", "Limpeza", "Encerramento"
  estimatedTime: string;
  version: string;
  revisionDate: string;
  responsible: string;
  description: string;
  steps: WorkInstructionStep[];
  ppes: string[];
  tools: string[];
  imageUrl: string;
  videoUrl: string;
  pdfUrl: string;
  blueprintUrl?: string;
  observations: string;
  changeHistory: WorkInstructionChange[];
  machineId?: string;   // For machine view compatibility
}

// Keep Procedure alias for backwards compatibility
export type Procedure = WorkInstruction;
export type ProcedureChecklistItem = WorkInstructionStep;

export const PROCEDURES_DATA: WorkInstruction[] = [
  // SCANIA -> BAGIE INSTRUCTIONS
  {
    id: "scania-bagie-fabricar",
    code: "IT-SCA-BAG-01",
    title: "Como fabricar o Bagie (Mancal Especial Turbocompressor)",
    lineId: "scania",
    lineName: "Scania",
    productId: "bagie",
    productName: "Bagie",
    category: "Como fabricar",
    estimatedTime: "20 minutos",
    version: "V1.4",
    revisionDate: "12/03/2026",
    responsible: "Jean Carlos (Supervisor de Célula)",
    description: "Instruções oficiais de usinagem e torneamento para fabricação do componente Bagie (Mancal Especial Turbocompressor da Linha Alpha), utilizando a liga metálica de aço inox ASTM F138.",
    ppes: [
      "Óculos de proteção com blindagem lateral",
      "Luvas nitrílicas anti-corte (Grau 5)",
      "Protetor auricular de silicone",
      "Calçado de segurança com biqueira reforçada"
    ],
    tools: [
      "Torno Star SR-38 Cabeçote Móvel",
      "Pastilha de Metal Duro DCMT T08",
      "Gabarito de concentricidade mecânica",
      "Micrômetro centesimal digital 0-50mm"
    ],
    steps: [
      { id: "step-b1", text: "Verificar se a pinça de tração está ajustada para barras cilíndricas de 38mm." },
      { id: "step-b2", text: "Carregar o programa CNC O0308_SCANIA_T8_REV4.nc no comando Fanuc." },
      { id: "step-b3", text: "Garantir pressão de óleo refrigerante a no mínimo 12 bar para fluxo contínuo." },
      { id: "step-b4", text: "Iniciar usinagem externa com avanço controlado de 0.12 mm/rot e velocidade de 10500 RPM." },
      { id: "step-b5", text: "Efetuar a usinagem interna das guias flutuantes de bronze com a pastilha T08 de acabamento." },
      { id: "step-b6", text: "Executar corte (bedame) com velocidade periférica constante para evitar rebarbas no chanfro." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    observations: "Manter a bucha de guia bem lubrificada. Qualquer sinal de vibração axial acima de 0.25 G interrompe o ciclo de tolerância e deve ser corrigido por offset.",
    changeHistory: [
      { date: "12/03/2026", version: "V1.4", author: "Jean Carlos", description: "Alteração da taxa de avanço do fuso de acabamento de 0.15 para 0.12 mm/rot para melhorar rugosidade superficial." },
      { date: "05/01/2026", version: "V1.2", author: "Carlos Alberto", description: "Inclusão de calibração micrométrica intra-processo na lista de EPIs." }
    ],
    machineId: "CNC-03"
  },
  {
    id: "scania-bagie-setup",
    code: "IT-SCA-BAG-02",
    title: "Setup Inicial da Linha Scania Bagie",
    lineId: "scania",
    lineName: "Scania",
    productId: "bagie",
    productName: "Bagie",
    category: "Setup inicial",
    estimatedTime: "35 minutos",
    version: "V2.1",
    revisionDate: "14/04/2026",
    responsible: "Renato Ramos (Técnico de Setup)",
    description: "Roteiro detalhado para a preparação e zeramento mecânico da máquina CNC-03 para o lote inicial do produto Bagie.",
    ppes: [
      "Óculos de proteção anti-embaçante",
      "Luvas de kevlar para manuseio de ferramentas de corte",
      "Calçado de segurança",
      "Creme de proteção dérmica"
    ],
    tools: [
      "Chave dinamométrica de precisão",
      "Apalpador 3D sensorizado G54",
      "Relógio comparador centesimal",
      "Calibrador de folga mecânica"
    ],
    steps: [
      { id: "step-s1", text: "Limpar completamente a mesa porta-ferramentas e remover cavacos metálicos remanescentes." },
      { id: "step-s2", text: "Instalar as ferramentas nos slots especificados no mapa de ferramentas (T01, T03, T05, T08, T12)." },
      { id: "step-s3", text: "Executar o zeramento do eixo Z (G54) tocando a face do tarugo com o apalpador sensorizado." },
      { id: "step-s4", text: "Ajustar os corretores de geometria (Offsets de fuso) conforme as dimensões nominais do desenho." },
      { id: "step-s5", text: "Alimentar a barra de aço ASTM F138 no carregador automático e alinhar as guias flutuantes." },
      { id: "step-s6", text: "Efetuar o Dry-Run (simulação no vazio sem material) a 50% de avanço rápido para evitar colisões." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=400",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    observations: "Garantir que a fixação da placa principal esteja com torque de 42 Nm para evitar vibração axial excessiva.",
    changeHistory: [
      { date: "14/04/2026", version: "V2.1", author: "Renato Ramos", description: "Otimização do tempo de dry-run e inclusão do mapa eletrônico de ferramentas no painel." }
    ],
    machineId: "CNC-03"
  },
  {
    id: "scania-bagie-ferramenta",
    code: "PROC-T08", // Matches original proc-t08
    title: "Troca de Pastilha de Metal Duro - Ferramenta T08",
    lineId: "scania",
    lineName: "Scania",
    productId: "bagie",
    productName: "Bagie",
    category: "Troca de ferramenta",
    estimatedTime: "15 minutos",
    version: "Rev 04",
    revisionDate: "12/03/2026",
    responsible: "Jean Carlos (Supervisor de Célula)",
    description: "Este procedimento operacional padrão orienta a substituição segura e precisa da pastilha de metal duro na ferramenta de acabamento T08, visando evitar desvios mecânicos na furação da linha Alpha.",
    ppes: [
      "Óculos de proteção com blindagem lateral",
      "Luvas nitrílicas anti-corte (Grau 5)",
      "Protetor auricular (tipo concha)",
      "Calçado de segurança com biqueira de composite"
    ],
    tools: [
      "Chave Torx T15 de precisão",
      "Calibrador de altura micrométrico (Zeiss standard)",
      "Micrômetro digital centesimal (0-25mm)",
      "Torquímetro de estalo calibrado (ajustado para 3.5 Nm)"
    ],
    steps: [
      { id: "step-t1", text: "Desacionar o fuso (spindle) e confirmar o status 'MANUTENÇÃO' no tablet BME." },
      { id: "step-t2", text: "Abrir a porta protetora pneumática de acesso ao magazine de ferramentas." },
      { id: "step-t3", text: "Posicionar a ferramenta T08 no berço manual de troca rápida." },
      { id: "step-t4", text: "Usar a chave Torx T15 para soltar com cuidado o parafuso de aperto da pastilha." },
      { id: "step-t5", text: "Remover a pastilha gasta, inspecionando visualmente se há trincas no alojamento." },
      { id: "step-t6", text: "Limpar o alojamento da ferramenta com spray de ar comprimido (pressão < 2 bar)." },
      { id: "step-t7", text: "Encaixar a nova pastilha de metal duro revestida com nitreto de titânio (TiN)." },
      { id: "step-t8", text: "Rosquear o parafuso e aplicar o torque exato de 3.5 Nm com o torquímetro." },
      { id: "step-t9", text: "Utilizar o calibrador de altura Zeiss para validar o offset do eixo Z." },
      { id: "step-t10", text: "Fechar a porta de segurança, reativar o fuso e executar o programa CNC em modo dry-run." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=400",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    observations: "A pastilha deve ser girada ou descartada a cada 2000 peças para evitar perdas dimensionais.",
    changeHistory: [
      { date: "12/03/2026", version: "Rev 04", author: "Jean Carlos", description: "Procedimento migrado para o novo módulo de Instruções de Trabalho." }
    ],
    machineId: "CNC-03"
  },
  {
    id: "scania-bagie-inspecao",
    code: "IT-SCA-BAG-04",
    title: "Inspeção Dimensional Estágio 1",
    lineId: "scania",
    lineName: "Scania",
    productId: "bagie",
    productName: "Bagie",
    category: "Inspeção",
    estimatedTime: "10 minutos",
    version: "V1.0",
    revisionDate: "18/02/2026",
    responsible: "Maria Clara (Qualidade)",
    description: "Método de inspeção dimensional manual com instrumentos portáteis para conferência imediata do Bagie na saída da máquina CNC.",
    ppes: [
      "Óculos de proteção",
      "Luvas nitrílicas finas",
      "Calçado de segurança"
    ],
    tools: [
      "Paquímetro digital mitutoyo de 150mm",
      "Calibrador Passa / Não-Passa de diâmetro",
      "Rugosímetro eletrônico de superfície"
    ],
    steps: [
      { id: "step-i1", text: "Retirar a peça recém cortada da rampa de saída utilizando luvas adequadas para evitar queimaduras." },
      { id: "step-i2", text: "Secar a peça com ar comprimido para eliminar resíduos do óleo de usinagem solúvel." },
      { id: "step-i3", text: "Medir o comprimento total nominal da peça (especificação: 120,00mm ± 0,05)." },
      { id: "step-i4", text: "Medir o diâmetro externo do mancal com o micrômetro digital (especificação: 45,00mm ± 0,03)." },
      { id: "step-i5", text: "Utilizar o calibrador passa/não-passa no canal de rolamento central." },
      { id: "step-i6", text: "Medir a rugosidade superficial Ra na área de usinagem (máximo permitido: 0.8 micrômetros)." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1537462715879-360eeb61a0bc?auto=format&fit=crop&q=80&w=400",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    observations: "Caso a rugosidade Ra ultrapasse 0.8 micrômetros, pausar o fuso imediatamente para verificar desgaste da pastilha T08.",
    changeHistory: [
      { date: "18/02/2026", version: "V1.0", author: "Maria Clara", description: "Criação do procedimento para controle de qualidade direto de chão de fábrica." }
    ],
    machineId: "CNC-03"
  },
  {
    id: "scania-bagie-medicao",
    code: "IT-SCA-BAG-05",
    title: "Medição de Alta Precisão (CMM ZEISS)",
    lineId: "scania",
    lineName: "Scania",
    productId: "bagie",
    productName: "Bagie",
    category: "Medição",
    estimatedTime: "15 minutos",
    version: "V3.0",
    revisionDate: "10/05/2026",
    responsible: "Maria Clara (Metrologista Líder)",
    description: "Método de medição com pórtico tridimensional óptico ZEISS PRISMO para validação estatística de lote e liberação de envio Scania.",
    ppes: [
      "Óculos de segurança",
      "Luvas especiais de algodão branco anti-manchas",
      "Calçado de segurança"
    ],
    tools: [
      "Pórtico Tridimensional ZEISS PRISMO",
      "Apalpador Zeiss de Rubi 2mm",
      "Software ZEISS Calypso de Medição"
    ],
    steps: [
      { id: "step-m1", text: "Limpar o mármore da bancada Zeiss com álcool isopropílico para remover qualquer fuligem." },
      { id: "step-m2", text: "Fixar o Bagie no dispositivo de fixação autocentrante dedicado Zeiss-Gear." },
      { id: "step-m3", text: "Carregar o programa ZEISS-PRISMO-GEAR-152 no computador de medição." },
      { id: "step-m4", text: "Realizar o alinhamento óptico inicial utilizando os 3 pontos de referência." },
      { id: "step-m5", text: "Executar o ciclo de medição automática por apalpação contínua." },
      { id: "step-m6", text: "Exportar o arquivo de coordenadas .cmm diretamente para o banco de dados SQL Server." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    observations: "A sala de metrologia tridimensional deve manter rigidez térmica estrita de 20°C ± 0.5°C.",
    changeHistory: [
      { date: "10/05/2026", version: "V3.0", author: "Maria Clara", description: "Otimização de rotas de apalpação pelo software Calypso, reduzindo tempo de ciclo de 22 para 15 minutos." }
    ],
    machineId: "ZEISS-01"
  },
  {
    id: "scania-bagie-limpeza",
    code: "IT-SCA-BAG-06",
    title: "Limpeza Operacional e Desbaste de Rebarbas",
    lineId: "scania",
    lineName: "Scania",
    productId: "bagie",
    productName: "Bagie",
    category: "Limpeza",
    estimatedTime: "8 minutos",
    version: "V1.1",
    revisionDate: "20/01/2026",
    responsible: "Renato Ramos (Operador)",
    description: "Instruções para a limpeza da estação CNC-03 e desengraxe das peças produzidas antes da entrega na metrologia.",
    ppes: [
      "Luvas nitrílicas pesadas",
      "Óculos de segurança",
      "Calçado de segurança"
    ],
    tools: [
      "Lavadora ultrassônica industrial",
      "Detergente desengraxante biodegradável 5%",
      "Soprador de ar comprimido com bico silenciador"
    ],
    steps: [
      { id: "step-l1", text: "Recolher o cesto coletor contendo as peças produzidas no turno." },
      { id: "step-l2", text: "Imergir o cesto na cuba da lavadora ultrassônica pré-aquecida a 60°C." },
      { id: "step-l3", text: "Acionar o ciclo de ultrassom desengraxante por 4 minutos para remoção total de óleos." },
      { id: "step-l4", text: "Retirar o cesto e enxaguar em água corrente limpa por 30 segundos." },
      { id: "step-l5", text: "Secar as peças utilizando a pistola de ar comprimido em cabine fechada de aspiração." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=400",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    observations: "Não utilizar solventes clorados para limpeza de aço inox, para evitar contaminação por cloro ativo.",
    changeHistory: [
      { date: "20/01/2026", version: "V1.1", author: "Renato Ramos", description: "Inclusão de lavagem ultrassônica obrigatória para melhor acabamento superficial." }
    ],
    machineId: "CNC-03"
  },
  {
    id: "scania-bagie-encerramento",
    code: "IT-SCA-BAG-07",
    title: "Protocolo de Encerramento e Passagem de Turno",
    lineId: "scania",
    lineName: "Scania",
    productId: "bagie",
    productName: "Bagie",
    category: "Encerramento",
    estimatedTime: "10 minutos",
    version: "V1.0",
    revisionDate: "15/02/2026",
    responsible: "Jean Carlos (Supervisor de Célula)",
    description: "Normas de encerramento de atividades diárias na célula CNC-03 e registro de estatísticas no banco de dados.",
    ppes: [
      "Calçado de segurança",
      "Óculos de proteção"
    ],
    tools: [
      "Terminal eletrônico MES",
      "Checklist em papel ou tablet"
    ],
    steps: [
      { id: "step-e1", text: "Pausar o ciclo de alimentação de barras cilíndricas no carregador pneumático." },
      { id: "step-e2", text: "Aguardar a conclusão da usinagem da última peça em andamento." },
      { id: "step-e3", text: "Desligar o fuso da máquina Star SR-38 e acionar o botão de parada segura." },
      { id: "step-e4", text: "Limpar as guias com rodo plástico e remover todo o acúmulo de cavacos na rampa." },
      { id: "step-e5", text: "Registrar a quantidade de peças conformes e reprovadas no terminal do operador." },
      { id: "step-e6", text: "Transmitir relatório de produtividade OEE do turno para o banco SQL Server." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=400",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    observations: "Deixar a cabine do torno limpa e seca para o operador do turno seguinte.",
    changeHistory: [
      { date: "15/02/2026", version: "V1.0", author: "Jean Carlos", description: "Definição do padrão de limpeza terminal pós-operação." }
    ],
    machineId: "CNC-03"
  },

  // OTHER GENERIC PROCEDURES PRESERVED FOR FULL MACHINE COMPATIBILITY
  {
    id: "proc-cnc02",
    code: "PROC-CNC02",
    title: "Calibração de Fuso e Ajuste de Desvio Térmico",
    lineId: "scania",
    lineName: "Scania",
    productId: "cabecote",
    productName: "Cabeçote",
    category: "Setup inicial",
    estimatedTime: "25 minutos",
    version: "Rev 02",
    revisionDate: "15/04/2026",
    responsible: "Maria Clara (Técnica de Metrologia)",
    description: "Instruções críticas para mitigar o drift térmico linear do cabeçote Mazak na linha Beta, corrigindo desvios em comprimento acima do limite de 0.08mm causados pela fadiga térmica do fuso.",
    ppes: [
      "Óculos de segurança anti-embaçante",
      "Luvas térmicas de proteção contra calor de contato",
      "Calçado de segurança",
      "Protetor auricular"
    ],
    tools: [
      "Apalpador óptico de toque (Renishaw/Zeiss)",
      "Barra de comprimento padrão calibrada (120mm nominal)",
      "Chave Allen métrica 6mm",
      "Limpador de cone de fuso cônico ISO 40"
    ],
    steps: [
      { id: "step-c1", text: "Aguardar o resfriamento natural do spindle até atingir temperatura inferior a 28°C." },
      { id: "step-c2", text: "Limpar o cone receptor cônico com solvente dielétrico leve e pano isento de fiapos." },
      { id: "step-c3", text: "Acoplar a barra de calibração padrão de 120mm na pinça do cabeçote Mazak." },
      { id: "step-c4", text: "Mover os eixos manualmente via manivela eletrônica (MPG) até encostar o apalpador." },
      { id: "step-c5", text: "Iniciar o script automático 'CALIBRATION_THERMAL_DRIFT.nc' no painel." },
      { id: "step-c6", text: "Registrar a compensação micrométrica computada (offset X e Z) no barramento IoT." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1537462715879-360eeb61a0bc?auto=format&fit=crop&q=80&w=400",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    observations: "Executar calibração a cada início de turno ou se a variação térmica da cabine exceder 5°C.",
    changeHistory: [
      { date: "15/04/2026", version: "Rev 02", author: "Maria Clara", description: "Inclusão do apalpador Renishaw óptico no checklist." }
    ],
    machineId: "CNC-02"
  },
  {
    id: "proc-laser",
    code: "PROC-LAS01",
    title: "Alinhamento de Lente e Limpeza do Cabeçote Laser",
    lineId: "volvo",
    lineName: "Volvo",
    productId: "mancal_central",
    productName: "Mancal Central",
    category: "Troca de ferramenta",
    estimatedTime: "12 minutos",
    version: "Rev 03",
    revisionDate: "01/06/2026",
    responsible: "Renato Ramos (Operador Especialista)",
    description: "Protocolo para remoção de incrustações de fuligem e alinhamento da lente colimadora da estação laser Trumpf 3030, evitando rebarbas e queima excessiva nas bordas das chapas de aço.",
    ppes: [
      "Óculos de proteção especial contra radiação laser CO2 (OD7+)",
      "Luvas descartáveis de nitrilo isentas de silicone",
      "Calçado de segurança",
      "Avental de raspa para calor"
    ],
    tools: [
      "Papel de limpeza óptica Lens-Clean",
      "Álcool isopropílico purificado 99.9%",
      "Gabarito de alinhamento de foco",
      "Fita adesiva térmica de teste de queima"
    ],
    steps: [
      { id: "step-la1", text: "Assegurar que a emissão laser está desligada (CHAVE DO LASER EM ZERO e sinalizador apagado)." },
      { id: "step-la2", text: "Aguardar 5 minutos para descarga completa de capacitores internos do ressonador." },
      { id: "step-la3", text: "Desmontar o bocal de latão e remover o cartucho protetor da lente óptica." },
      { id: "step-la4", text: "Pingar duas gotas de álcool isopropílico no papel óptico e limpar a lente em espiral." },
      { id: "step-la5", text: "Colar fita adesiva térmica no bocal para teste de queima central." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=400",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    observations: "Lente riscada ou trincada deve ser descartada imediatamente para evitar reflexão retroativa perigosa.",
    changeHistory: [
      { date: "01/06/2026", version: "Rev 03", author: "Renato Ramos", description: "Procedimento atualizado para alinhamento Trumpf." }
    ],
    machineId: "LASER-01"
  }
];
