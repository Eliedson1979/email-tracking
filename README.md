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

```sh
npm run dev
```

 

## 5️⃣ Testando a API:
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
{
"id": "evt_001",
"type": "sent",
"email": "user@example.com",
"site": "site-a.com",
"timestamp": "2024-01-20T10:30:00Z",
"metadata": {
"campaign_id": "camp_123",
"subject": "Welcome Email"
}
},
{
"id": "evt_002",
"type": "open",
"email": "user@example.com",
"site": "site-a.com",
"timestamp": "2024-01-20T10:35:00Z",
"metadata": {
"ip": "192.168.1.1",
"user_agent": "Mozilla/5.0..."
}
}
]
}
```

```sh
Resposta esperada:

{
"processed": 2,
"duplicates": 0,
"errors": []
}
```

b) GET /api/stats/daily

URL: http://localhost:3000/api/stats/daily

Método: GET

Header:

```sh
x-api-key: devkey123
```

```sh
Resposta exemplo:

{
	"2025-08-29": {
		"siteA": {
			"sent": 1,
			"open": 1
		}
	},

	"2024-01-20": {
		"site-a.com": {
			"sent": 1,
			"open": 2
		}
	}
}
```

c) GET /api/health

URL: http://localhost:3000/api/health

Método: GET

```sh
Resposta esperada:

{ "ok": true, "db": true }
```

d) GET /api/metrics

URL: http://localhost:3000/api/metrics

Método: GET

Header:

```sh
x-api-key: devkey123

Resposta esperada:

{ "total_events": 5, "events_today": 5 }
```

## 6️⃣ Testes:

```sh
npm test
```

