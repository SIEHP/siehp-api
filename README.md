# siehp-api
Interface de programação para a aplicação do Sistema Integrado de Ensino a Histologia e Patologia

## Pré-requisitos
- Sistema operacional Linux (Ubuntu 20.04 LTS ou superior recomendado)
- Docker (versão 20.10.0 ou superior)
- Docker Compose (versão 2.0.0 ou superior)

## Instalação dos Pré-requisitos

### 1. Instalar o Docker
```bash
# Atualizar os pacotes do sistema
sudo apt update
sudo apt upgrade -y

# Instalar dependências necessárias
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Adicionar a chave GPG oficial do Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Adicionar o repositório do Docker
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Atualizar a lista de pacotes
sudo apt update

# Instalar o Docker
sudo apt install -y docker-ce docker-ce-cli containerd.io

# Adicionar seu usuário ao grupo docker (para executar docker sem sudo)
sudo usermod -aG docker $USER
```

### 2. Instalar o Docker Compose
```bash
# Baixar a versão mais recente do Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Adicionar permissão de execução
sudo chmod +x /usr/local/bin/docker-compose
```

## Configuração do Projeto

### 1. Clonar o Repositório (Caso prefira clonar o repositório entre em contato com os desenvolvedores para liberarem seu acesso ao repositório)
```bash
git clone [URL_DO_REPOSITÓRIO]
cd siehp-api
```

### 2. Criar o Arquivo .env
Crie um arquivo chamado `.env` na raiz do projeto com o seguinte conteúdo:
```env
# Configurações do Banco de Dados
DATABASE_URL="postgresql://postgres:postgres@database:5432/local"
DATABASE_TEST_URL="postgresql://postgres:postgres@database-test:5432/test"

# Outras configurações do ambiente
NODE_ENV=development
PORT=8080
```

## Executando o Projeto

### 1. Iniciar os Containers
```bash
# Construir e iniciar os containers
docker-compose up --build
```

Para executar em segundo plano (modo detached):
```bash
docker-compose up -d --build
```

### 2. Parar os Containers
```bash
docker-compose down
```

## Acessando a Aplicação
Após a inicialização bem-sucedida, a aplicação estará disponível em:
- API: http://localhost:8080
- Banco de Dados Local: localhost:5432
- Banco de Dados de Teste: localhost:5433

## Solução de Problemas

### Verificar Logs
```bash
# Ver logs de todos os containers
docker-compose logs

# Ver logs de um serviço específico
docker-compose logs app
docker-compose logs database
```

### Reiniciar Serviços
```bash
# Reiniciar todos os serviços
docker-compose restart

# Reiniciar um serviço específico
docker-compose restart app
```

### Limpar Containers e Volumes
```bash
# Parar e remover containers, volumes e imagens
docker-compose down -v
```