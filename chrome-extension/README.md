# OmniGateway AI — Chrome Extension (Manifest V3)

A high-performance browser assistant HUD and AI Side Panel connecting directly to your **OmniGateway API** server.

![Extension Preview](../assets/logo/antigravity.svg)

## 🌟 Key Features

- **OmniGateway HUD Popup**: Check gateway latency, live health status, and active models at a glance.
- **Persistent AI Side Panel**: Browse any webpage with OmniGateway directly docked on your browser sidebar.
- **1-Click Webpage Intelligence**:
  - 📄 **Summarize Page**: Automatically extracts clean page text and generates executive summaries.
  - 🔍 **Explain Selection**: Select any text or code on the web to get immediate breakdown.
  - 💡 **Extract Key Takeaways**: Distills lengthy documentation or articles into top insights.
  - 💻 **Code Review**: Analyzes code on GitHub, StackOverflow, or blogs.
- **Streaming & Reasoning Mode**: Real-time token streaming with dedicated Thinking / Reasoning block display.
- **Right-Click Context Menu**: Instant action on any highlighted text across any browser tab.

---

## 🚀 How to Install in Google Chrome

1. Open Google Chrome and navigate to:
   ```text
   chrome://extensions
   ```
2. In the top-right corner, toggle **Developer mode** to **ON**.
3. In the top-left corner, click the **Load unpacked** button.
4. Select the `chrome-extension` directory inside this repository:
   ```text
   /Users/yash/Documents/CLIProxyAPI-main/chrome-extension
   ```
5. Click **Select Folder**. The **OmniGateway AI** icon will appear in your Chrome toolbar!

---

## ⚙️ Configuration

By default, the extension connects to:
- **Gateway Base URL**: `http://127.0.0.1:8317`
- **Default Key**: `sk-omni-gateway-demo-key` (or your configured `api-keys` from `config.yaml`)

Click the **OmniGateway icon** in your extensions bar, open **⚙️ Gateway Settings**, update the URL or key if customized, and click **Save Settings & Reconnect**.
