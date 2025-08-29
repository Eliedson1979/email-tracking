# Email Tracking API (Next.js)

Sistema de envio e rastreamento de e-mails de alto volume com microserviço em **Next.js** e persistência em **PostgreSQL**.

---

## 📦 Funcionalidades

- Endpoint `POST /api/events` — Recebe lista de eventos (`sent`, `open`, `click`) e armazena sem duplicação.
- Endpoint `GET /api/stats/daily` — Retorna agregados diários por site.
- Endpoint `GET /api/health` — Health check básico.
- Endpoint `GET /api/metrics` — Métricas básicas de eventos.
- Autenticação simples via **API Key** (`x-api-key`).
- Persistência com PostgreSQL (migrations + seed).
- Observabilidade mínima: health check + métricas.
- Docker + Docker Compose.
- CI simples com testes unitários (Jest).

---

## ⚙️ Requisitos

- Node.js >= 18
- Docker & Docker Compose
- Postman ou Insomnia para testes

---

## 1️⃣ Configuração do ambiente

### 1 - Clone o repositório:

```
git clone https://github.com/Eliedson1979/email-tracking
```

### 2 - Apos ter o repositório clonado em sua maquina, execute este comando para acessar a pasta do projeto:

```sh
cd email-tracking
```

### 3 - O arquivo .env já vem configurado:

 Arquivo .env:

```sh
DATABASE_URL=postgres://postgres:postgres@localhost:5432/email_tracking
API_KEYS=devkey123
PORT=3000
```

## 2️⃣ Rodar PostgreSQL com Docker:

```sh
docker-compose up -d
```

## 3️⃣ Instalar dependências e rodar migrações:

```sh
npm install
npm run migrate
npm run seed
```

## 4️⃣ Rodar o serviço:

 

5️⃣ Testando a API
a) POST /api/events

URL: http://localhost:3000/api/events

Método: POST

Headers:

```sh
Content-Type: application/json
x-api-key: devkey123
```

```sh
{
  "events": [
    { "site": "siteA", "type": "sent", "user_id": "u100" },
    { "site": "siteA", "type": "open", "user_id": "u100" },
    { "site": "siteB", "type": "click", "user_id": "u200" }
  ]
}
```
