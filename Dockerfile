# ==============================================================================
# OmniGateway API - Production Multi-Stage Dockerfile
# Compatible with Render, Koyeb, Fly.io, Railway, and Kubernetes
# ==============================================================================

# 1. Builder Stage
FROM golang:1.24-bookworm AS builder

WORKDIR /app

# Install build essentials
RUN apt-get update && apt-get install -y --no-install-recommends build-essential git ca-certificates && rm -rf /var/lib/apt/lists/*

# Cache Go modules
COPY go.mod go.sum ./
RUN go mod download

# Copy source repository
COPY . .

ARG VERSION=7.0.0
ARG COMMIT=none
ARG BUILD_DATE=unknown

# Compile portable Linux binary without CGO dependencies
RUN CGO_ENABLED=0 GOOS=linux go build -buildvcs=false \
    -ldflags="-s -w -X 'main.Version=${VERSION}' -X 'main.Commit=${COMMIT}' -X 'main.BuildDate=${BUILD_DATE}'" \
    -o ./omni-gateway ./cmd/server/

# 2. Runtime Stage
FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y --no-install-recommends tzdata ca-certificates curl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy binary and all assets required by runtime (static management + frontend dashboard)
COPY --from=builder /app/omni-gateway /app/omni-gateway
COPY --from=builder /app/config.example.yaml /app/config.yaml
COPY --from=builder /app/static/ /app/static/
COPY --from=builder /app/frontend/ /app/frontend/

# Create runtime directories for persistent auths and configs
RUN mkdir -p /app/auths

EXPOSE 8317

ENV PORT=8317
ENV ALLOW_REMOTE=true
ENV TZ=UTC

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://127.0.0.1:${PORT:-8317}/healthz || exit 1

CMD ["./omni-gateway", "--local-model"]
