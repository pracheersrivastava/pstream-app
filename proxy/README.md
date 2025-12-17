# P-Stream Proxy

A Nitro-based proxy server that serves as the **ONLY** entry point for the P-Stream mobile app.

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Mobile App    │────▶│     Proxy       │────▶│    Backend      │
│   (Port 3003)   │     │   (Port 3003)   │     │  (Port 3000)    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
      PUBLIC                  PUBLIC               INTERNAL ONLY
```

## Security Model

- The mobile app **ONLY** communicates with the proxy (port 3003)
- The backend (port 3000) is **NEVER** exposed to clients
- Only explicitly approved metadata routes are forwarded
- No generic catch-all forwarding exists
- The backend URL is an internal implementation detail

## Routes

### Metadata Routes (Passthrough)

| Route | Description |
|-------|-------------|
| `GET /home` | Home page content (trending, popular, etc.) |
| `GET /search?q=<query>` | Search for movies and TV shows |
| `GET /catalog/:id` | Get details for a specific media item |
| `GET /sources?tmdbId=<id>&type=<movie\|tv>` | Get streaming sources |

### Streaming Routes

| Route | Description |
|-------|-------------|
| `GET /m3u8` | HLS manifest (handled separately) |
| `GET /ts` | Video segments (handled separately) |

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy environment file:
   ```bash
   cp .env.example .env
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

## Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `BACKEND_INTERNAL_URL` | Internal backend URL | `http://127.0.0.1:3000` |
| `NODE_ENV` | Environment mode | `development` |

## Deployment

1. Build for production:
   ```bash
   npm run build
   ```

2. Start production server:
   ```bash
   npm run start
   ```

The proxy will run on port 3003 by default.

## Security Invariants

1. **No backend exposure**: The backend URL is never sent to clients
2. **Explicit routes only**: Only defined routes forward to backend
3. **No catch-all**: Unknown routes return 404
4. **Sanitized errors**: Backend errors are normalized before returning
5. **No redirects**: Automatic redirect following is disabled

