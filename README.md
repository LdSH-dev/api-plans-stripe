# API de Assinaturas - NestJS + PostgreSQL + Stripe

## 🚀 Sobre o projeto
Este projeto é uma API desenvolvida com **NestJS**, utilizando **PostgreSQL** como banco de dados e **Stripe** para gerenciamento de pagamentos e assinaturas. A API suporta autenticação JWT, criação de planos, assinaturas e faturas automáticas.

## 🛠 Tecnologias
- **NestJS** (Framework Node.js)
- **Prisma** (ORM para PostgreSQL)
- **PostgreSQL** (Banco de dados)
- **Stripe** (Pagamentos e assinaturas)
- **Docker e Docker Compose**

## 📂 Estrutura de Pastas
```
📦 api-plans-stripe
 ┣ 📂 prisma      # Configuração do Prisma ORM
 ┣ 📂 src
 ┃ ┣ 📂 auth        # Módulo de autenticação (JWT)
 ┃ ┣ 📂 payments    # Módulo de pagamentos com Stripe
 ┃ ┣ 📂 plans       # Módulo de planos
 ┃ ┣ 📂 subscriptions # Módulo de assinaturas
 ┃ ┣ 📂 invoices    # Módulo de faturas
 ┃ ┣ 📂 email       # Serviço de envio de emails
 ┃ ┗ 📜 main.ts     # Ponto de entrada da aplicação
 ┣ 📜 Dockerfile    # Configuração do Docker
 ┣ 📜 docker-compose.yml # Configuração do Docker Compose
 ┣ 📜 .env.example  # Exemplo de variáveis de ambiente
 ┣ 📜 postman_collection.json  # Arquivo JSON do Postman para facilitar testes
 ┗ 📜 README.md     # Documentação do projeto
```

## 📦 Configuração e Execução com Docker

### 1️⃣ Clonar o repositório
```sh
git clone https://github.com/LdSH-dev/api-plans-stripe.git
cd api-plans-stripe
```

### 2️⃣ Criar o arquivo `.env`
```sh
cp .env.example .env
```

### 3️⃣ Construir e iniciar os containers
```sh
docker-compose up --build
```
Isso irá:
- Iniciar a API NestJS
- Subir o PostgreSQL
- Configurar o Stripe CLI para escutar webhooks

### 4️⃣ Acessar a API
- **API NestJS:** `http://localhost:3000`
- **Banco de Dados:** `localhost:5432`

## 🔄 Rodando Migrações Prisma
Caso precise rodar migrações manualmente:
```sh
docker-compose exec api npx prisma migrate dev
```

## 🔗 Endpoints Principais
### 🔑 Autenticação
- `POST /auth/register` - Criar usuário
- `POST /auth/login` - Login e obtenção do JWT

### 📦 Planos
- `POST /plans` - Criar plano
- `GET /plans` - Listar planos
- `GET /plans/:id` - Buscar plano por ID

### 📄 Assinaturas
- `POST /subscriptions` - Criar assinatura
- `GET /subscriptions/:id` - Buscar assinatura
- `DELETE /subscriptions/:id` - Cancelar assinatura

### 💰 Pagamentos
- `POST /payments` - Criar intenção de pagamento
- `GET /payments/:id` - Buscar status do pagamento
- `POST /webhooks/stripe` - Webhook do Stripe

### 📜 Faturas
- `GET /invoices/:id` - Buscar fatura específica
- `GET /invoices/user/:userId` - Listar faturas de um usuário

## 📧 Envio de E-mails
O sistema envia faturas via **Nodemailer**, mas já configurei as credenciais SMTP no `.env` para ativar esse recurso.

## 🛑 Parar e Remover Containers
```sh
docker-compose down
```

---
Projeto desenvolvido para o desafio técnico com integração completa de assinaturas e pagamentos utilizando **NestJS, Prisma, Stripe e Docker**. O projeto contém um **arquivo JSON do Postman** para facilitar os testes da API.

