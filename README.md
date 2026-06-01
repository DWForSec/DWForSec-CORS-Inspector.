# DWForSec-CORS-Inspector

> **Web-based CORS Configuration Security Testing Tool for Ethical Security Research**

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat-square&logo=tailwindcss)
![Express](https://img.shields.io/badge/Express-5-000000?style=flat-square&logo=express)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## 📋 Description

**DWForSec-CORS-Inspector** is a web-based CORS configuration testing tool designed to help security testers validate CORS headers, origin reflection behavior, credential exposure risk, and remediation guidance in an ethical and structured way.

The tool sends controlled requests with custom `Origin` headers through a backend proxy and analyzes the server's CORS response headers to determine the security posture of the target endpoint.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎯 **Target Endpoint Testing** | Test any HTTP/HTTPS endpoint with proper URL validation |
| 🔄 **Origin Reflection Testing** | Test with custom origins or use preset attacker origins |
| 📡 **Multiple HTTP Methods** | Support for GET, POST, and OPTIONS (preflight) requests |
| 🛡️ **Risk Analysis** | Automatic risk classification: SAFE, REVIEW, HIGH RISK, CRITICAL |
| 📊 **Header Inspection** | Detailed CORS header analysis with highlighted dangerous values |
| 🔍 **Response Preview** | Optional response body preview (max 500 chars) with toggle |
| 🔧 **Recommended Fixes** | Actionable remediation guidance for each finding |
| ⏱️ **Rate Limiting** | Built-in rate limiting (1 req/2s) to prevent abuse |
| 🎨 **Cyber Dark Theme** | Premium DWForSec-branded dark UI with glow effects |

---

## 🔬 How It Works

```
┌──────────────┐     POST /api/analyze-cors      ┌──────────────┐
│              │  ─────────────────────────────▶  │              │
│   Frontend   │   { targetUrl, origin, method }  │   Backend    │
│   (React)    │                                  │  (Express)   │
│              │  ◀─────────────────────────────  │              │
└──────────────┘   { corsHeaders, riskLevel, ... } └──────┬───────┘
                                                          │
                                                          │ HTTP Request
                                                          │ with Origin header
                                                          ▼
                                                   ┌──────────────┐
                                                   │   Target     │
                                                   │   Server     │
                                                   └──────────────┘
```

1. **User inputs** a target endpoint URL and selects/enters an Origin header
2. **Frontend sends** the configuration to the backend proxy
3. **Backend sends** the actual HTTP request to the target with the specified Origin header
4. **Backend analyzes** the CORS response headers and determines risk level
5. **Frontend displays** a detailed result card with risk assessment and recommendations

### Risk Level Classification

| Risk Level | Condition |
|------------|-----------|
| ✅ **SAFE** | No `Access-Control-Allow-Origin` header, or origin not allowed |
| ⚠️ **REVIEW** | ACAO header present with a specific allowed origin |
| 🔶 **HIGH RISK** | Wildcard `*` in ACAO detected |
| 🔴 **CRITICAL MISCONFIGURATION** | ACAO reflects attacker origin + `Access-Control-Allow-Credentials: true` |

---

## 🚀 Installation

### Prerequisites

- **Node.js** >= 18.x
- **npm** >= 8.x

### Setup

```bash
# Clone the repository
git clone https://github.com/DWForSec/DWForSec-CORS-Inspector.git

# Navigate to project directory
cd DWForSec-CORS-Inspector

# Install all dependencies
npm install
```

---

## 💻 Running Locally

### Option 1: Run both frontend + backend together (recommended)

```bash
npm run start
```

This starts:
- Frontend (Vite) at `http://localhost:5173`
- Backend (Express) at `http://localhost:3001`

### Option 2: Run separately

**Terminal 1 — Frontend:**
```bash
npm run dev
```

**Terminal 2 — Backend:**
```bash
npm run server
```

---

## 🏗️ Build

```bash
# Build production bundle
npm run build

# Preview production build
npm run preview
```

The production build outputs to the `dist/` directory.

---

## 📦 Package Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `npm install` | Install dependencies | Install all project dependencies |
| `npm run dev` | `vite` | Start frontend dev server |
| `npm run server` | `node server/index.js` | Start backend server |
| `npm run start` | `concurrently` | Start both frontend + backend |
| `npm run build` | `vite build` | Build production bundle |
| `npm run preview` | `vite preview` | Preview production build |

---

## 🌐 Deployment

### Frontend → Cloudflare Pages

1. Push your code to GitHub
2. Go to [Cloudflare Pages](https://pages.cloudflare.com/)
3. Create a new project → Connect to your GitHub repository
4. Configure build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Node.js version:** 18+ (set in Environment Variables: `NODE_VERSION` = `18`)
5. Deploy

> **Note:** The frontend on Cloudflare Pages will need the backend API URL. Update the fetch URL in the frontend or use environment variables for the backend endpoint.

### Backend Options

| Platform | Notes |
|----------|-------|
| **Railway** | `npm run server` — Free tier available, auto-deploy from GitHub |
| **Render** | Node.js web service — Free tier with cold starts |
| **Fly.io** | Containerized deployment — Great for low-latency |
| **VPS (DigitalOcean/Linode)** | Full control with PM2 process manager |
| **Docker** | Containerize with a Dockerfile for any platform |

For production deployment, update the frontend API URL to point to your deployed backend (e.g., using `VITE_API_URL` environment variable).

---

## 🔒 Safety Guardrails

- ❌ No mass/bulk scanning capability
- ❌ No aggressive brute-force origin testing
- ❌ No request/response data storage or logging
- ❌ No sensitive response body logging
- ✅ Rate limiting: 1 request per 2 seconds per IP
- ✅ Request timeout: 10 seconds
- ✅ Input validation on both frontend and backend

---

## 📁 Project Structure

```
DWForSec-CORS-Inspector/
├── index.html                    # HTML entry point with SEO meta tags
├── package.json                  # Dependencies and scripts
├── vite.config.js                # Vite config with API proxy
├── tailwind.config.js            # Tailwind CSS v3 configuration
├── postcss.config.js             # PostCSS configuration
├── .gitignore                    # Git ignore rules
├── README.md                     # This file
├── LICENSE                       # MIT License
├── server/
│   └── index.js                  # Express backend server
└── src/
    ├── main.jsx                  # React entry point
    ├── App.jsx                   # Main application component
    ├── index.css                 # Global styles + cyber theme
    └── components/
        ├── Header.jsx            # App header with branding
        ├── Disclaimer.jsx        # Responsible use disclaimer
        ├── CorsForm.jsx          # CORS analysis input form
        ├── ResultCard.jsx        # Analysis result display
        └── Footer.jsx            # App footer
```

---

## ⚠️ Responsible Use Disclaimer

> **This tool is intended only for authorized security testing, education, and responsible security research. Do not test systems without permission.**

Usage of this tool against targets without explicit written authorization is illegal and unethical. The developers assume no liability for misuse of this software.

---

## 🎨 Portfolio

**DWForSec-CORS-Inspector** is a web-based CORS configuration testing tool designed to help security testers validate CORS headers, origin reflection behavior, credential exposure risk, and remediation guidance in an ethical and structured way.

---

## 📄 License

MIT License

Copyright (c) 2026 DWForSec

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
