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

1. Clone ou extraia o projeto:
```bash
unzip email-tracking-nextjs.zip
cd email-tracking-nextjs
