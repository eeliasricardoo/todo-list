#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Cores para o console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

console.log(`${colors.cyan}=== Configuração do Projeto Todo List ===${colors.reset}\n`);

// Verifica se o .env.local existe, se não, cria a partir do .env.example
function setupEnvFile() {
  const envExamplePath = path.join(process.cwd(), '.env.example');
  const envLocalPath = path.join(process.cwd(), '.env.local');

  if (!fs.existsSync(envLocalPath) && fs.existsSync(envExamplePath)) {
    console.log(`${colors.yellow}Arquivo .env.local não encontrado. Criando a partir do .env.example...${colors.reset}`);
    fs.copyFileSync(envExamplePath, envLocalPath);
    console.log(`${colors.green}Arquivo .env.local criado com sucesso!${colors.reset}`);
    console.log(`${colors.yellow}Por favor, edite o arquivo .env.local e adicione suas credenciais do Supabase.${colors.reset}\n`);
  } else if (fs.existsSync(envLocalPath)) {
    console.log(`${colors.green}Arquivo .env.local já existe.${colors.reset}\n`);
  } else {
    console.log(`${colors.red}Arquivo .env.example não encontrado. Não foi possível criar .env.local.${colors.reset}\n`);
  }
}

// Instala as dependências
function installDependencies() {
  console.log(`${colors.yellow}Instalando dependências...${colors.reset}`);
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log(`${colors.green}Dependências instaladas com sucesso!${colors.reset}\n`);
  } catch (error) {
    console.error(`${colors.red}Erro ao instalar dependências:${colors.reset}`, error.message);
    process.exit(1);
  }
}

// Verifica se o Supabase CLI está instalado
function checkSupabaseCLI() {
  try {
    execSync('supabase --version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

// Instruções para configurar o Supabase
function showSupabaseInstructions() {
  console.log(`${colors.cyan}=== Configuração do Supabase ===${colors.reset}`);
  console.log(`${colors.yellow}Para configurar o Supabase, siga estas etapas:${colors.reset}`);
  console.log(`1. Crie uma conta no Supabase (https://supabase.com)`);
  console.log(`2. Crie um novo projeto`);
  console.log(`3. Obtenha a URL e a chave anônima do projeto em Configurações > API`);
  console.log(`4. Adicione essas informações ao arquivo .env.local`);
  console.log(`5. Execute o script SQL em supabase/migrations/20230101000000_initial_schema.sql no Editor SQL do Supabase\n`);
  
  if (!checkSupabaseCLI()) {
    console.log(`${colors.yellow}Supabase CLI não encontrado. Para desenvolvimento local, considere instalar:${colors.reset}`);
    console.log(`npm install -g supabase\n`);
  } else {
    console.log(`${colors.green}Supabase CLI encontrado. Você pode usar comandos como:${colors.reset}`);
    console.log(`supabase login`);
    console.log(`supabase link --project-ref seu-project-id`);
    console.log(`supabase db push\n`);
  }
}

// Função principal
async function main() {
  setupEnvFile();
  
  rl.question(`${colors.yellow}Deseja instalar as dependências do projeto? (s/n) ${colors.reset}`, (answer) => {
    if (answer.toLowerCase() === 's') {
      installDependencies();
    }
    
    showSupabaseInstructions();
    
    console.log(`${colors.cyan}=== Próximos Passos ===${colors.reset}`);
    console.log(`1. Configure o Supabase conforme as instruções acima`);
    console.log(`2. Execute o servidor de desenvolvimento: ${colors.green}npm run dev${colors.reset}`);
    console.log(`3. Acesse o aplicativo em: ${colors.green}http://localhost:3000${colors.reset}\n`);
    
    console.log(`${colors.cyan}=== Documentação ===${colors.reset}`);
    console.log(`Para mais informações sobre a configuração do Supabase, consulte:`);
    console.log(`${colors.green}docs/supabase-setup.md${colors.reset}\n`);
    
    console.log(`${colors.green}Configuração concluída! Bom desenvolvimento!${colors.reset}`);
    
    rl.close();
  });
}

main().catch(error => {
  console.error(`${colors.red}Erro:${colors.reset}`, error);
  process.exit(1); 