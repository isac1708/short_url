# URL Shortener Microservice

Encurtador de URLs de alta performance desenvolvido com TypeScript, Fastify, Zod, Scalar API Reference, Base62 Hashids, MongoDB e Redis.

Projetado para suportar alta volumetria utilizando IDs atômicos no Redis e persistência no MongoDB.

## Tecnologias

- **Node.js** & **TypeScript**
- **Fastify**
- **fastify-type-provider-zod** & **Zod**
- **@scalar/fastify-api-reference** & **@fastify/swagger**
- **Hashids** (conversão Base62 com ofuscação)
- **ioredis** (contador atômico `INCR`)
- **MongoDB** & **Mongoose**
- **Docker Compose**

## Como Executar

### 1. Iniciar MongoDB e Redis
```bash
docker compose up -d
```

### 2. Instalar Dependências
```bash
npm install
```

### 3. Rodar em Desenvolvimento
```bash
npm run dev
```

A aplicação subirá em `http://localhost:3000`.

## Documentação Interativa da API
Acesse a documentação OpenAPI gerada pelo Scalar:
```
http://localhost:3000/docs
```

## Rotas da API

### `POST /api/shorten`
Encurta uma URL longa.

**Request Body:**
```json
{
  "url": "https://fullstackclub.com.br"
}
```

**Response (201 Created):**
```json
{
  "code": "GlwjYZ",
  "shortUrl": "http://localhost:3000/GlwjYZ",
  "originalUrl": "https://fullstackclub.com.br"
}
```

### `GET /:code`
Redireciona para a URL original com status **301 Moved Permanently**.
Se o código for inexistente ou inválido, retorna status **404 Not Found**.
