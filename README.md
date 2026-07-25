# 🏭 QualitySync Industry 5.0 - Metrologia & Inteligência Industrial

Plataforma completa de monitoramento e controle de qualidade industrial com suporte a metrologia ZEISS, simulação de gêmeos digitais, telemetria IoT (Modbus, OPC UA, MQTT, Siemens) e Inteligência Artificial preditiva via Google Gemini.

---

## 🚀 Como subir este projeto no GitHub

### 1. Criar um repositório no GitHub
1. Acesse [github.com/new](https://github.com/new)
2. Defina o nome do repositório (ex: `qualitysync-industry`)
3. Escolha **Público** ou **Privado**
4. Clique em **Create repository**

### 2. Enviar o código para o GitHub
No seu terminal local, dentro da pasta do projeto, execute:

```bash
# Inicializar o repositório git (caso ainda não esteja inicializado)
git init

# Adicionar todos os arquivos
git add .

# Criar o commit inicial
git commit -m "feat: QualitySync Industry 5.0 initial commit"

# Definir a branch principal para main
git branch -M main

# Vincular ao seu repositório remoto (substitua com o seu link do GitHub)
git remote add origin https://github.com/SEU_USUARIO/qualitysync-industry.git

# Enviar o código
git push -u origin main
```

---

## 🌐 Publicar no GitHub Pages (Deploy Automático)

Este repositório já inclui um fluxo do **GitHub Actions** configurado no arquivo `.github/workflows/deploy.yml`.

### Passo a passo para ativar o GitHub Pages no seu repositório:
1. No seu repositório no GitHub, acesse a aba **Settings** (Configurações).
2. Na barra lateral esquerda, clique em **Pages**.
3. Em **Build and deployment** > **Source**, selecione **GitHub Actions**.
4. Sempre que você fizer um `git push` na branch `main`, o GitHub irá compilar o projeto e publicá-lo automaticamente na sua URL do GitHub Pages:
   `https://SEU_USUARIO.github.io/qualitysync-industry/`

---

## 💻 Executar Localmente

### Pré-requisitos
- **Node.js** v18 ou superior instalado
- **npm** instalado

### Instalação e Execução

```bash
# 1. Clonar o repositório
git clone https://github.com/SEU_USUARIO/qualitysync-industry.git
cd qualitysync-industry

# 2. Instalar as dependências
npm install

# 3. Configurar variáveis de ambiente (opcional para chave Gemini)
cp .env.example .env

# 4. Iniciar o servidor de desenvolvimento
npm run dev
```

Acesse a aplicação no navegador em `http://localhost:3000`.

---

## ⚙️ Scripts do Projeto

- `npm run dev`: Inicia o servidor em modo de desenvolvimento na porta 3000.
- `npm run build`: Compila o frontend e o servidor Node.js backend para produção em `dist/`.
- `npm run build:gh-pages`: Compila o frontend estático com caminhos relativos otimizados para hospedagem no GitHub Pages.
- `npm run start`: Inicia o servidor compilado em produção (`dist/server.cjs`).
- `npm run lint`: Checa a sintaxe e tipos do TypeScript (`tsc --noEmit`).

---

## 🌟 Funcionalidades do Projeto
- **Painel Metrológico ZEISS**: Inspeção e tolerâncias dimensionais.
- **Telemetria de Máquinas**: Monitoramento de rotação (RPM), vibração (G) e temperatura (°C) em tempo real.
- **Assistente IA de Qualidade**: Diagnóstico e auditoria preditiva.
- **Rastreabilidade de Peças**: Histórico completo de lotes, auditorias e matrizes de defeitos.
