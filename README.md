# 💸 Transactions API

API RESTful desenvolvida em NestJS para registro e estatísticas de transações financeiras.

> Projeto desenvolvido como desafio técnico, com foco em Clean Architecture, boas práticas, testes e segurança.

---

## ✅ Requisitos atendidos

- ✅ Desenvolvido com **NestJS + TypeScript**
- ✅ Dados armazenados **em memória** (sem banco)
- ✅ Estrutura em **Clean Architecture**
- ✅ Uso de **DTOs com validação** (`class-validator`)
- ✅ Padrão **RESTful**
- ✅ Logs estruturados com **Pino**
- ✅ Documentação com **Swagger**
- ✅ **Testes unitários e de integração** com Jest + Supertest
- ✅ Docker e Docker Compose
- ✅ Tratamento de erros e status HTTP adequados
- ✅ Segurança com **Helmet** e **Rate Limiting**
- ✅ Organização por **commits por endpoint**

---

## 🧰 Tecnologias

- NestJS
- TypeScript
- Supertest + Jest
- Pino (logs)
- Swagger
- Helmet
- Throttler (Rate Limiter)
- Docker + Docker Compose

---

## 📁 Estrutura de pastas (Clean Architecture)

```
src/
├── application/ # Casos de uso
├── domain/ # Entidades e interfaces
├── infra/ # Implementações (ex: repositório em memória, logger)
├── interfaces/ # Controllers (interface da aplicação)
├── app.module.ts # Módulo raiz
├── main.ts # Bootstrap da aplicação
```

---

## 🚀 Como rodar localmente

### 1. Instale as dependências

yarn install

### 2. Rode em modo dev

yarn start:dev

### 3. Acesse a API

- Health check: http://localhost:3000/health
- Swagger: http://localhost:3000/docs

---

## 🐳 Como rodar com Docker

### 1. Build e start com Docker Compose

docker compose up --build

### 2. Acesse

- http://localhost:3000/health
- http://localhost:3000/docs

---

## 🔐 Segurança

- Uso de Helmet para proteção contra cabeçalhos maliciosos
- Rate limiting configurado: 10 requisições por IP por minuto
- Apenas JSON aceito (sem HTML, XML etc.)

---

## 🧪 Testes

### Unitários

- Use cases testados isoladamente com mocks
- Executar:

yarn test

### Integração (Supertest)

- Controllers testados de ponta a ponta
- Executar:

yarn test test/controllers

### Cobertura

yarn test --coverage

> Gera pasta coverage/ com relatório HTML e métricas.

---

## 📄 Documentação Swagger

- Disponível em: http://localhost:3000/docs
- Gera automaticamente a partir dos decorators (@ApiTags, @ApiProperty, etc.)

---

## 📡 Endpoints

### ✅ POST /transactions

Registra uma nova transação

Payload:
{
"amount": 150.75,
"timestamp": "2025-05-21T13:30:00.000Z"
}

Validações:

- Valor deve ser positivo
- Timestamp deve estar no passado (UTC)
- Formato ISO 8601

---

### ✅ DELETE /transactions

Remove todas as transações

---

### ✅ GET /statistics

Retorna estatísticas das transações dos últimos 60 segundos

Exemplo de resposta:
{
"count": 3,
"sum": 350,
"avg": 116.66,
"min": 50,
"max": 200
}

---

### ✅ GET /health

Verifica se a API está ativa

Resposta:
{
"status": "ok",
"timestamp": "2025-05-21T16:54:12.123Z"
}

---

## 🧠 Observações técnicas

- Timestamps devem ser enviados em UTC (Z no final)
- API aceita apenas JSON
- Código estruturado para facilitar extensão (ex: trocar memória por banco depois)

---

## 👨‍💻 Autor

Desenvolvido por João Victor Fausto Souza para desafio técnico de backend.
