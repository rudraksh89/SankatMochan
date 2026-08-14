# 🚨 Sankat Mochan — Emergency Identity System

> *Sankat Mochan* ("remover of crisis") — an AI-powered emergency medical ID platform that helps first responders instantly access an accident victim's critical medical information when they cannot speak for themselves.

![Status](https://img.shields.io/badge/status-active-success)
![License](https://img.shields.io/badge/license-MIT-blue)

## 🩺 The Problem

During accidents, disasters, or medical emergencies, victims are often unable to communicate basic but life-critical information — blood group, allergies, existing conditions, current medications, and emergency contact details. This delays treatment and can cost lives.

## 💡 The Solution

Sankat Mochan lets every citizen register their medical profile once, then carry it everywhere as a **QR code** or **NFC tag**. Any verified first responder — police, paramedics, hospital staff, or quick response teams — can scan it instantly, with **no app or internet connection required on their end**, and get:

- Blood group & allergy alerts
- Chronic conditions & current medications
- Emergency contact (one tap to call)
- AI-generated triage guidance for faster, safer treatment

## ✨ Key Features

| Feature | Description |
|---|---|
| 🔲 **QR Code Generation** | Encodes the full medical profile into a scannable, offline-readable QR code |
| 📡 **NFC Tag Support** | Write/read profile data via Web NFC API (Chrome on Android) |
| 🤖 **AI Health Assistant** | Claude-powered chatbot for health questions, risk analysis, and paramedic guidance |
| 🚑 **AI Triage Advisor** | Responders get instant AI-generated first-aid and triage advice after a scan |
| 👤 **Dual Interface** | Separate portals for citizens (register/manage ID) and verified responders (scan/search) |
| 🔍 **Search by Name/ID** | Responders can look up records manually as a scan fallback |
| 📊 **Responder Dashboard** | Live stats, full citizen records table, CSV export, activity audit log |
| 📱 **Fully Responsive** | Works on mobile, tablet, and desktop |
| 🔐 **Local-first Storage** | All data stored in browser localStorage — no backend, no data leaves the device |

## 🎯 Use Cases

- 🪖 **Army & NCC personnel** — field identification during exercises or operations
- 🚗 **Road accident victims** — faster, safer hospital triage
- 🌊 **Disaster relief zones** — identify victims and reunite families
- 🏃 **Marathons/sports events** — instant medical info for cardiac/heat emergencies
- 👴 **Elderly/Alzheimer's patients** — NFC wristband identification
- ✈️ **Tourists & travellers** — language-independent emergency ID anywhere in India

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3 (custom design system, no framework), vanilla JavaScript
- **QR Codes:** [qrcode.js](https://github.com/soldair/node-qrcode) (CDN)
- **NFC:** Web NFC API (`NDEFReader`)
- **AI:** Anthropic Claude API (`claude-sonnet-4-6`) for health assistant & triage advice
- **Storage:** Browser `localStorage` (no backend/database required)
- **Geolocation:** Browser Geolocation API

## 📂 Project Structure

```
sankat-mochan/
├── index.html      # App markup & structure
├── style.css        # Full design system (dark theme, animations, components)
├── script.js        # App logic: auth, registration, QR/NFC, AI calls, responder dashboard
└── README.md
```

## 🚀 Getting Started

### Run locally
Just open `index.html` in any modern browser — no build step, no install required.

```bash
git clone https://github.com/<your-username>/sankat-mochan.git
cd sankat-mochan
open index.html        # macOS
# or double-click index.html on Windows/Linux
```

### Deploy on GitHub Pages
1. Push this repo to GitHub
2. Go to **Settings → Pages**
3. Set source to the `main` branch, root folder
4. Your live demo will be at `https://<your-username>.github.io/sankat-mochan/`

> **Note on the AI features:** The AI Health Assistant and AI Triage Advisor call the Anthropic API directly from the browser. For a public deployment, you'll want to proxy these calls through your own backend to avoid exposing API keys — see [Anthropic's API docs](https://docs.claude.com) for details. Without a configured backend, these features will show a connection error but the rest of the app (registration, QR/NFC generation, scanning, search) works fully offline.

## 👥 Demo Accounts

**Citizen Portal** — any name + any 4-digit PIN registers a new account instantly.

**Responder Access** — use PIN `9999` for demo access.

Two demo profiles are pre-seeded so you can try scanning/search immediately:
- *Cadet Arjun Verma* (NCC, B+ blood, Penicillin allergy)
- *Priya Mehta* (Police, O− blood, Type 1 Diabetic)

## 🗺️ Roadmap

- [ ] Backend + database for multi-device sync
- [ ] Government ID (Aadhaar/DigiLocker) verification integration
- [ ] Multi-language support (Hindi, regional languages)
- [ ] SMS-based fallback for non-smartphone users
- [ ] Hospital-side dashboard for bulk triage during mass casualty events
- [ ] Encrypted QR payloads (AES) instead of plain JSON

## 📄 License

MIT License — free to use, modify, and deploy.

## 🙏 Acknowledgements

Built to address a real gap in India's emergency response infrastructure — inspired by the thousands of road accident victims who could be identified and treated faster with better technology.
