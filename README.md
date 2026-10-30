# OmniGateway API

<div align="center">

[![Go Version](https://img.shields.io/badge/Go-1.26%2B-00ADD8?style=for-the-badge&logo=go&logoColor=white)](https://go.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg?style=for-the-badge)](https://github.com/omen18/OmniGatewayAPI)
[![Docker Ready](https://img.shields.io/badge/Docker-Ready-2496ED.svg?style=for-the-badge&logo=docker&logoColor=white)](docker-compose.yml)
[![Platform](https://img.shields.io/badge/Platform-macOS%20%7C%20Linux%20%7C%20Windows-lightgrey.svg?style=for-the-badge)](https://github.com/omen18/OmniGatewayAPI)
[![Academic Level](https://img.shields.io/badge/Academic-3rd%20Year%20Major%20Project-blueviolet.svg?style=for-the-badge)](PROJECT_REPORT.md)

**Next-Generation Multi-Provider AI Proxy Gateway & Protocol Translator**

*Seamlessly bridge, load-balance, and translate requests between OpenAI, Anthropic Claude, Google Gemini, xAI Grok, and Moonshot Kimi.*

[English](README.md) • [Live Demo](https://omni-gateway-api.vercel.app) • [Project Report](PROJECT_REPORT.md) • [SDK Docs](docs/sdk-usage.md) • [中文 (Chinese)](README_CN.md) • [日本語 (Japanese)](README_JA.md)

<br>

<img src="./assets/screenshots/omnigateway_landing.png" alt="OmniGateway API — Unified Frontier Multiplexer" width="100%" />

</div>

---

### 🎓 Academic & Major Project Notice

> **Project Title**: OmniGateway API: High-Performance Multi-Provider AI Proxy Gateway & Protocol Translator  
> **Course / Track**: B.Tech / B.S. in Computer Science & Engineering (3rd Year Major Project)  
> **Developer & Maintainer**: **Yash Raj Sharan** ([yashraj10messi@gmail.com](mailto:yashraj10messi@gmail.com))  
> **Repository**: [https://github.com/omen18/OmniGatewayAPI](https://github.com/omen18/OmniGatewayAPI)  
> **Live Showcase**: [https://omni-gateway-api.vercel.app](https://omni-gateway-api.vercel.app)  
> **Comprehensive System Report**: See [`PROJECT_REPORT.md`](PROJECT_REPORT.md) for architecture, design patterns, and benchmarking.

---

## 💡 What is OmniGateway API?

Modern developer workflows rely heavily on frontier LLMs through coding assistants (Claude Code, Cursor, Aider, Continue) and agentic frameworks. However, developers face friction:
- **Protocol Fragmentation**: OpenAI, Anthropic, and Google use distinct schemas, streaming SSE formats, and tool-calling interfaces.
- **Quota & Rate Limits**: Heavy development hits HTTP `429 Too Many Requests` rapidly on single accounts.
- **Authentication Overhead**: Managing OAuth tokens with short lifespans, API keys, and service accounts is cumbersome.

**OmniGateway API** resolves these challenges by providing a single, unified, protocol-agnostic gateway. Connect any client configured for OpenAI, Claude, or Gemini to OmniGateway API, and let the gateway translate requests, rotate accounts in round-robin fashion, refresh OAuth credentials automatically, and spoof client TLS fingerprints.

---

## 📸 Visual Showcase & Interface Gallery

### 1. Web Studio, Architecture & Playground (`/dashboard`)

<table>
  <tr>
    <td width="50%" valign="top">
      <h4 align="center">Unified Frontier Multiplexer Overview</h4>
      <img src="./assets/screenshots/omnigateway_landing.png" alt="OmniGateway Landing Overview" width="100%" />
      <p align="center"><em>High-speed Go proxy dashboard with real-time router telemetry, sub-millisecond overhead metrics, and daemon status monitor.</em></p>
    </td>
    <td width="50%" valign="top">
      <h4 align="center">Interactive Pipeline & Protocol Router</h4>
      <img src="./assets/screenshots/omnigateway_architecture.png" alt="OmniGateway Architecture Diagram" width="100%" />
      <p align="center"><em>Visual pipeline mapping Client SDKs → Gin Multiplexer (<code>:8317</code>) → Canonical Thinking Engine & uTLS Spoofing → Frontier Providers.</em></p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h4 align="center">AI Studio & Live Model Playground</h4>
      <img src="./assets/screenshots/omnigateway_studio.png" alt="OmniGateway AI Studio Playground" width="100%" />
      <p align="center"><em>Interactive chat studio with canonical Extended Thinking token budget sliders, temperature controls, and real-time token/sec telemetry.</em></p>
    </td>
    <td width="50%" valign="top">
      <h4 align="center">1-Click Client Setup & Visual Config Builder</h4>
      <img src="./assets/screenshots/omnigateway_config.png" alt="OmniGateway Client Setup and Config Generator" width="100%" />
      <p align="center"><em>Instant SDK snippet generator (OpenAI, Claude Code CLI, cURL, Python, Go) and interactive <code>config.yaml</code> synthesizer.</em></p>
    </td>
  </tr>
</table>

### 2. Management Center Console & Browser Copilot (`/management.html` & Chrome MV3)

<table>
  <tr>
    <td width="50%" valign="top">
      <h4 align="center">Management Console — Live Traffic & Telemetry</h4>
      <img src="./assets/screenshots/omnigateway_console_dashboard.png" alt="OmniGateway Console Dashboard" width="100%" />
      <p align="center"><em>Real-time rolling request throughput, success/failure bucket analytics, active credentials, provider keys, and routed model counts.</em></p>
    </td>
    <td width="50%" valign="top">
      <h4 align="center">Multi-Provider API Key & Pool Manager</h4>
      <img src="./assets/screenshots/omnigateway_providers.png" alt="OmniGateway AI Providers" width="100%" />
      <p align="center"><em>Centralized credential pool management across Gemini, Kimi, Codex, Muse (Meta), xAI, Claude, Vertex, and OpenAI-compatible providers.</em></p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h4 align="center">Admin Management Center Authentication</h4>
      <img src="./assets/screenshots/omnigateway_management.png" alt="OmniGateway Management Center Login" width="100%" />
      <p align="center"><em>Secure bcrypt-authenticated Management Center portal (<code>/management.html</code>) with interactive dot-matrix hero display.</em></p>
    </td>
    <td width="50%" valign="top">
      <h4 align="center">Manifest V3 Chrome Extension Copilot</h4>
      <img src="./assets/screenshots/omnigateway_extension.png" alt="OmniGateway Chrome Extension" width="100%" />
      <p align="center"><em>Docked browser side-panel copilot for 1-click article summarization, active code review, and instant zero-fail AI answers.</em></p>
    </td>
  </tr>
</table>

---

## 🏛️ System Architecture

```mermaid
graph TD
    Client["Client Applications\n(Claude Code / Cursor / Aider / OpenAI SDK / cURL)"]
    Gateway["OmniGateway API Core\n(Gin HTTP Engine & Protocol Multiplexer :8317)"]
    AuthConductor["Auth & Concurrency Scheduler\n(Round-Robin Pool & Circuit Breaker)"]
    Thinking["Canonical Thinking Engine\n(internal/thinking/ - Reasoning Normalization)"]
    Translator["Protocol Translation Pipeline\n(OpenAI ↔ Claude ↔ Gemini ↔ Grok ↔ Kimi)"]
    Storage["Storage & Credential State\n(File-based / PostgreSQL / Redis / GitStore)"]
    Watcher["Zero-Downtime Hot Reload\n(internal/watcher/)"]
    Upstream["Upstream Frontier AI Providers\n(Anthropic / OpenAI / Google / xAI / Moonshot)"]

    Client -->|HTTP / SSE / WebSocket / Realtime| Gateway
    Gateway --> AuthConductor
    AuthConductor <--> Storage
    AuthConductor --> Thinking
    Thinking --> Translator
    Watcher -.->|Hot Reload Events| AuthConductor
    Translator -->|uTLS Fingerprint Spoofing / Transport| Upstream
```

### Architectural Highlights

- **Adapter Pattern (`internal/translator/`)**: Translates vendor-specific request and response payloads to a shared intermediate representation and converts them to the target upstream provider format.
- **Thinking / Reasoning Pipeline (`internal/thinking/`)**: Normalizes reasoning tokens, thinking budgets, and `:thinking` suffixes across providers without breaking client expectations.
- **Circuit Breaker & Cooldown Manager (`sdk/cliproxy/auth/`)**: Automatically detects upstream `429` (Rate Limited) and `5xx` errors, applies exponential cooldown to affected credentials, and immediately falls back to healthy accounts.
- **uTLS Fingerprint Spoofing**: Simulates realistic client browser TLS fingerprints to eliminate upstream vendor anti-bot rejections.
- **Zero-Downtime Watcher (`internal/watcher/`)**: Dynamically monitors filesystem configuration and authentication token changes, hot-reloading credentials without restarting the server.

---

## 🚀 Key Features

- **Multi-Protocol Translation**:
  - OpenAI-compatible endpoints: `/v1/chat/completions`, `/v1/completions`, `/v1/models`, `/v1/images`, `/v1/videos`, `/v1/responses`
  - Anthropic-compatible endpoints: `/v1/messages`, `/v1/messages/count_tokens`
  - Google Gemini-compatible endpoints: `/v1beta/models/...` (generateContent, streamGenerateContent)
  - Realtime WebSocket API: `/v1/realtime` for low-latency voice and event streaming
- **Multi-Account Round-Robin Scheduling**:
  - Pool multiple accounts for Gemini, OpenAI Codex, Claude Code, xAI Grok, and Kimi.
  - Automatically distribute incoming traffic to maximize quota thresholds.
- **Automated OAuth 2.0 & Token Refresh**:
  - One-click CLI authentication flows with PKCE and headless terminal modes.
  - Background renewal keeps long-running workflows uninterrupted.
- **Management & Visual Interfaces**:
  - **Cyber-Glass Web Dashboard & AI Studio (`/dashboard`)**: High-end GSAP-animated command center with live model playground, interactive account pool quota simulator, visual config generator, and client setup hub.
  - **Manifest V3 Chrome Extension (`chrome-extension/`)**: Browser copilot & persistent AI side panel with 1-click page summarization, context-menu actions, and real-time gateway HUD.
  - **Terminal UI (TUI)**: Full-screen terminal dashboard powered by Charm Bubbletea & Lipgloss (`--tui`).
  - **Web Management Panel**: Embedded control panel (`/management.html`) for configuration and credential management.
- **Enterprise Storage Options**:
  - File-based default (`~/.cli-proxy-api` / `auths/`)
  - PostgreSQL (`PGSTORE_*`), Redis (`go-redis/v9`), and GitStore (`GITSTORE_*`).
- **High Performance & Minimal Footprint**:
  - Written in Go 1.26+ with goroutine multiplexing.
  - Sub-millisecond translation overhead (< 1ms).
  - Handles 10,000+ parallel connections on a baseline memory footprint of ~15 MB.
- **Embeddable Go SDK**:
  - Reusable SDK in `sdk/cliproxy` to embed gateway routing, authentication, and translation directly into Go services.

---

## 🌐 Supported Providers & Frontier Models

<table>
<thead>
  <tr>
    <th align="center">Provider</th>
    <th>Frontier Models</th>
    <th>Supported Interfaces</th>
    <th>Authentication Methods</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td align="center">
      <a href="https://platform.openai.com/"><img src="./assets/logo/openai.svg" alt="OpenAI" width="32" height="32" /><br><strong>OpenAI</strong></a>
    </td>
    <td>
      <code>gpt-5.6</code>, <code>gpt-5.5</code>, <code>gpt-4o</code>, <code>o3-mini</code>, <code>o1</code>, Codex CLI series
    </td>
    <td>
      <code>/v1/chat/completions</code><br>
      <code>/v1/responses</code><br>
      <code>/v1/realtime</code>
    </td>
    <td>
      OAuth 2.0 (Codex Login)<br>
      Device Code Flow<br>
      Standard API Keys
    </td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://www.anthropic.com/claude"><img src="./assets/logo/claude.svg" alt="Anthropic" width="32" height="32" /><br><strong>Anthropic</strong></a>
    </td>
    <td>
      <code>claude-fable-5</code>, <code>claude-opus-4</code>, <code>claude-3-7-sonnet</code>, <code>claude-3-5-sonnet</code>
    </td>
    <td>
      <code>/v1/messages</code><br>
      <code>/v1/messages/count_tokens</code>
    </td>
    <td>
      OAuth 2.0 (Claude Code CLI)<br>
      Standard Anthropic API Keys
    </td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://antigravity.google/"><img src="./assets/logo/antigravity.svg" alt="Google" width="32" height="32" /><br><strong>Google</strong></a>
    </td>
    <td>
      <code>gemini-3.5-flash</code>, <code>gemini-3.1-pro</code>, <code>gemini-2.5-pro</code>, <code>gemini-2.5-flash</code>
    </td>
    <td>
      <code>/v1beta/models/*</code><br>
      <code>/v1/chat/completions</code>
    </td>
    <td>
      OAuth 2.0 (Google Antigravity)<br>
      Google AI Studio API Keys<br>
      Vertex AI Service Accounts
    </td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://x.ai/grok"><img src="./assets/logo/xai.svg" alt="xAI" width="32" height="32" /><br><strong>xAI</strong></a>
    </td>
    <td>
      <code>grok-4.5</code>, <code>grok-composer-2.5-fast</code>, Video & Vision Models
    </td>
    <td>
      <code>/v1/chat/completions</code><br>
      <code>/v1/videos</code>
    </td>
    <td>
      OAuth 2.0 (Grok Build)<br>
      Standard xAI API Keys
    </td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://www.kimi.com/code/"><img src="./assets/logo/kimi.svg" alt="Kimi" width="32" height="32" /><br><strong>Moonshot Kimi</strong></a>
    </td>
    <td>
      <code>kimi-k3</code> (3T-class 1M context), <code>kimi-k2.7-code</code>
    </td>
    <td>
      <code>/v1/chat/completions</code>
    </td>
    <td>
      OAuth 2.0 (Kimi Code Subscription)<br>
      Kimi Open Platform API Keys
    </td>
  </tr>
</tbody>
</table>

---

## ⚡ Quick Start

### 1. Installation

#### Option A: Build from Source (Go 1.26+)
```bash
# Clone the repository
git clone https://github.com/omen18/OmniGatewayAPI.git
cd OmniGatewayAPI

# Build the binary
go build -o omni-gateway ./cmd/server

# Verify installation
./omni-gateway --help
```

#### Option B: Docker Compose
```bash
# Start OmniGateway with Docker Compose
docker compose up -d

# Check running container logs
docker compose logs -f omni-gateway-api
```

---

### 2. Configure Your Gateway

Copy the example configuration:
```bash
cp config.example.yaml config.yaml
```

Minimal `config.yaml`:
```yaml
host: "0.0.0.0"
port: 8317

# Gateway access keys (used by your client applications)
api-keys:
  - "sk-my-gateway-secret-key"

# Directory where authenticated accounts and tokens are stored
auth-dir: "./auths"

# Web Management Dashboard (optional)
remote-management:
  allow-remote: false
  secret-key: "admin-secret-password"
```

---

### 3. Authenticate Your Accounts

Run the interactive CLI login commands to add accounts to your pool. The credentials will be saved in your configured `auth-dir` (`./auths`):

```bash
# Login to OpenAI Codex (ChatGPT Plus / Pro account)
./omni-gateway -codex-login

# Login via Device Code Flow (ideal for headless servers / SSH sessions)
./omni-gateway -codex-device-login

# Login to Anthropic Claude (Claude Code authorization)
./omni-gateway -claude-login

# Login to Google Gemini (Antigravity OAuth)
./omni-gateway -antigravity-login

# Login to xAI Grok (Grok Build OAuth)
./omni-gateway -xai-login

# Login to Moonshot Kimi
./omni-gateway -kimi-login

# Import a Google Cloud Vertex AI Service Account
./omni-gateway -vertex-import /path/to/service-account-key.json --vertex-import-prefix vertex
```

> [!TIP]
> If running on a remote headless machine, add the `-no-browser` flag to print the OAuth verification URL directly in your terminal.

---

### 4. Start the Gateway

```bash
# Standard server mode
./omni-gateway

# Start with real-time Terminal UI (TUI) monitoring
./omni-gateway --tui

# Start TUI in standalone mode
./omni-gateway --tui --standalone
```

The gateway listens on `http://127.0.0.1:8317` by default.

---

## 🔌 Client Integration Examples

### Claude Code CLI
Set the custom base URL to route all Claude Code requests through OmniGateway:
```bash
export ANTHROPIC_BASE_URL="http://localhost:8317"
export ANTHROPIC_API_KEY="sk-my-gateway-secret-key"

claude
```

### Cursor / VS Code
In Cursor Settings > **Models** > **OpenAI API Key**:
1. Enable **Override OpenAI Base URL**: `http://localhost:8317/v1`
2. Set API Key: `sk-my-gateway-secret-key`
3. Enter your desired model (e.g., `gpt-5.6`, `claude-3-7-sonnet`, `gemini-3.5-flash`)

### Python (OpenAI SDK)
```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:8317/v1",
    api_key="sk-my-gateway-secret-key",
)

response = client.chat.completions.create(
    model="claude-3-7-sonnet", # Handled via protocol translation!
    messages=[
        {"role": "system", "content": "You are a senior systems engineer."},
        {"role": "user", "content": "Explain raft consensus in Go."},
    ],
    stream=True,
)

for chunk in response:
    if chunk.choices and chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="", flush=True)
print()
```

### cURL Verification
```bash
curl http://localhost:8317/v1/chat/completions \
  -H "Authorization: Bearer sk-my-gateway-secret-key" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-3.5-flash",
    "messages": [
      {"role": "user", "content": "Hello from OmniGateway!"}
    ]
  }'
```

---

## 🎨 Cyber-Glass Web Dashboard & AI Studio

OmniGateway API features a dedicated, futuristic frontend dashboard with interactive GSAP animations, a live quantum neural particle canvas, a real-time AI playground, and visual configuration builders.

- **URL**: [http://localhost:8317/dashboard](http://localhost:8317/dashboard) (or [http://localhost:8317/](http://localhost:8317/) in any browser)
- **Standalone Mode**: Can also be launched independently by opening `frontend/index.html`.

### Dashboard Highlights:
1. **Interactive AI Studio**: Live chat playground with streaming SSE tokens, token-per-second latency counters, and dynamic model switching.
2. **Extended Reasoning Controller**: Interactive toggle and token budget slider for `:thinking` mode.
3. **Quota Multiplier Simulator**: Real-time slider to visualize throughput gains and rate-limit immunity as you pool 1 to 15 accounts.
4. **1-Click Integration Hub**: Dynamic code generator for Claude Code, Cursor, Windsurf, Python SDK, Node.js, and cURL.
5. **Visual Config Generator**: Interactive form that generates and exports production-ready `config.yaml` files.

---

## 🧩 Chrome Extension (Manifest V3)

Take OmniGateway intelligence into every browser tab with the included Chrome extension (`chrome-extension/`):

- **HUD Popup**: Instant gateway status, latency check, model list, and quick prompts.
- **Persistent AI Side Panel**: Docked beside your active tab for interactive conversations.
- **1-Click Page Intelligence**:
  - 📄 **Summarize Page**: Reads clean page text and distills top insights.
  - 🔍 **Explain Selection**: Select any text or code snippet to analyze edge cases and logic.
  - 💡 **Key Takeaways & Code Review**: Fast action templates for developer workflows.

### Installing the Extension:
1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (top right)
3. Click **Load unpacked** (top left)
4. Select the `chrome-extension` directory inside this repository.

---

## 🧠 Reasoning & Thinking Mode

OmniGateway API features a dedicated thinking engine (`internal/thinking/`). It unifies reasoning parameters across models:

- Add `:thinking` to any model name (e.g. `claude-3-7-sonnet:thinking`, `gpt-5.6:thinking`).
- Or pass thinking configurations in the request body.
- OmniGateway normalizes the configuration into a canonical `ThinkingConfig` and translates it into the appropriate provider format (Anthropic Thinking budget, OpenAI reasoning effort, or Gemini thinking parameters).

---

## 📋 CLI Flags Reference

| Flag | Type | Description |
| :--- | :--- | :--- |
| `-config <path>` | `string` | Path to `config.yaml` configuration file |
| `-tui` | `bool` | Launch interactive Charm Bubbletea terminal user interface |
| `-standalone` | `bool` | In TUI mode, starts an embedded local gateway server |
| `-local-model` | `bool` | Use embedded model catalogs; skips remote catalog fetching |
| `-codex-login` | `bool` | Initiate OAuth login for OpenAI Codex / ChatGPT |
| `-codex-device-login` | `bool` | Initiate headless device-code login for OpenAI Codex |
| `-claude-login` | `bool` | Initiate OAuth login for Anthropic Claude Code |
| `-antigravity-login`| `bool` | Initiate OAuth login for Google Gemini / Antigravity |
| `-xai-login` | `bool` | Initiate OAuth login for xAI Grok |
| `-kimi-login` | `bool` | Initiate OAuth login for Moonshot Kimi |
| `-no-browser` | `bool` | Suppress automatic browser opening for OAuth workflows |
| `-oauth-callback-port <port>` | `int` | Override default local OAuth callback listening port |
| `-vertex-import <path>` | `string` | Import Google Cloud Vertex AI service account key JSON |
| `-vertex-import-prefix <prefix>` | `string` | Custom prefix namespace for imported Vertex models |

---

## 🛠️ Embedding the Go SDK

OmniGateway API can be embedded directly into custom Go microservices without running the CLI binary:

```bash
go get github.com/router-for-me/OmniGatewayAPI/v7/sdk/cliproxy
```

```go
package main

import (
	"context"
	"log"

	"github.com/router-for-me/OmniGatewayAPI/v7/internal/config"
	"github.com/router-for-me/OmniGatewayAPI/v7/sdk/cliproxy"
)

func main() {
	cfg, err := config.LoadConfig("config.yaml")
	if err != nil {
		log.Fatalf("failed to load config: %v", err)
	}

	svc, err := cliproxy.NewBuilder().
		WithConfig(cfg).
		WithConfigPath("config.yaml").
		Build()
	if err != nil {
		log.Fatalf("failed to build proxy service: %v", err)
	}

	ctx := context.Background()
	if err := svc.Run(ctx); err != nil {
		log.Fatalf("service stopped: %v", err)
	}
}
```

*For more details, see the [SDK Documentation](docs/sdk-usage.md).*

---

## 🧪 Testing & Verification

OmniGateway API adheres to strict Go development standards:

```bash
# Run unit and integration tests
go test ./...

# Run a specific package test
go test -v -run TestProtocolMultiplexer ./internal/api

# Format code (required before pull requests)
gofmt -w .

# Verify clean compile
go build -o test-output ./cmd/server && rm test-output
```

---

## 🤝 Contributing

Contributions, bug reports, and feature requests are very welcome!

1. **Fork** the repository
2. **Create** your feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'feat: add support for new provider'`)
4. **Format & Test** (`gofmt -w . && go test ./...`)
5. **Push** to the branch (`git push origin feature/amazing-feature`)
6. **Open** a Pull Request

---

## 👤 Author & Academic Attribution

Developed and maintained by:

**Yash Raj Sharan**  
📧 Email: [yashraj10messi@gmail.com](mailto:yashraj10messi@gmail.com)  
🐙 GitHub: [@omen18](https://github.com/omen18)  
🎓 B.Tech / B.S. in Computer Science & Engineering (3rd Year Major Project)

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
