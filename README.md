# 🚨 Sankat Mochan — Full-Stack AI Emergency Identity & Triage Platform

> **Sankat Mochan** ("remover of crisis") is a full-stack, AI-powered emergency medical identity platform designed to help first responders instantly access an accident victim's critical medical information and receive real-time AI triage advice when victims cannot speak for themselves.

![Status](https://img.shields.io/badge/status-active-success)
![Stack](https://img.shields.io/badge/stack-MERN--Vite-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 🩺 The Problem

During accidents, disasters, or medical emergencies, victims are often unable to communicate basic but life-critical information — blood group, allergies, existing conditions, current medications, and emergency contact details. This delays treatment and costs lives.

---

## 💡 The Solution

Sankat Mochan allows citizens to register their medical profile once and carry it everywhere as a scannable **Emergency QR Code** or **NFC Tag**. 

Any first responder or paramedic can scan the QR code to instantly view essential emergency contacts and blood type. Verified responders gain authenticated access to full medical history, insurance details, uploaded medical documents, and **AI-generated Triage & First-Aid Advice**.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🔲 **Signed QR Code Generation** | Encodes a compact, HMAC-SHA256 signed medical payload scannable by any mobile camera or scanner |
| 📡 **NFC Tag Support** | Write/read profile data via Web NFC API |
| 🤖 **AI Emergency Triage Engine** | Google Gemini 1.5 Flash integration generating rapid, multi-part triage protocols for paramedics (with intelligent rule engine fallback) |
| 📡 **Real-time SOS Radar (WebSockets)** | Live emergency dispatch map broadcast powered by Socket.IO |
| 👤 **Role-Based Portals** | Separate authenticated flows for **Citizens**, **Verified First Responders**, and **System Admins** |
| 🛡️ **Responder Verification** | Professional ID & Medical License verification workflow reviewed by Admins |
| 📄 **Document Vault** | Secure Cloudinary storage for prescriptions, blood reports, and discharge summaries |
| 📱 **Responsive & Lazy Loaded** | Ultra-fast React 19 + Vite frontend with asynchronous chunk splitting |

---

## 🛠️ Tech Stack

### Frontend (`/client`)
- **Framework:** React 19 + Vite 8
- **Styling:** Tailwind CSS v4, Lucide React icons, Framer Motion
- **State & Routing:** React Router v7, Context API
- **Real-Time & Export:** Socket.io-client, Axios, HTML2Canvas / JSPDF / QR Code React

### Backend (`/server`)
- **Runtime & Server:** Node.js, Express 5
- **Database:** MongoDB Atlas (Mongoose v9)
- **Real-Time:** Socket.IO
- **AI Integration:** Google Gemini 1.5 Flash REST API (`server/services/aiService.js`)
- **Storage & Mail:** Cloudinary (Multer memory buffer), Nodemailer (SMTP OTP)
- **Security:** JWT Authentication, Bcrypt password hashing, Express Rate Limiting

---

## 📂 Project Structure

```
SankatMochan/
├── client/                   # Vite + React 19 Frontend
│   ├── src/
│   │   ├── api/              # Axios instance & config
│   │   ├── components/       # UI, Dashboard, Emergency, Admin components
│   │   ├── context/          # AuthContext & ThemeContext
│   │   ├── pages/            # App pages (Home, Emergency, SOS Radar, etc.)
│   │   ├── routes/           # AppRoutes (with React.lazy code-splitting)
│   │   └── styles/           # Tailwind CSS styles
│   ├── .env.example          # Client environment template
│   └── package.json
│
├── server/                   # Node.js + Express 5 Backend
│   ├── config/               # Database, Cloudinary, Socket.IO config
│   ├── controllers/          # Auth, Profile, Emergency, QR, Verification controllers
│   ├── middleware/           # Auth, Admin, Upload (Multer), Rate Limiters
│   ├── models/               # Mongoose schemas (User, MedicalProfile, EmergencyAlert, etc.)
│   ├── routes/               # API Express routes
│   ├── services/             # Gemini AI Service & triage engine
│   ├── .env.example          # Server environment template
│   └── server.js             # HTTP & WebSocket server entry point
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB Database URI (Local or MongoDB Atlas)
- Google Gemini API Key *(Optional, for live AI Triage Advice)*
- Cloudinary Credentials *(Optional, for document uploads)*

---

### 1. Backend Setup

```bash
cd server
npm install

# Copy environment template
cp .env.example .env   # (or copy manually on Windows)
```

Edit `server/.env`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
GEMINI_API_KEY=your_gemini_api_key
```

Run the backend dev server:
```bash
npm run dev
```
*Server will start with WebSockets on `http://localhost:5000`.*

---

### 2. Frontend Setup

Open a new terminal:
```bash
cd client
npm install

# Copy environment template
cp .env.example .env
```

Edit `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_PUBLIC_FRONTEND_URL=http://localhost:5173
```

Run the frontend dev server:
```bash
npm run dev
```
*Frontend app will run on `http://localhost:5173`.*

---

## 👥 Roles & Workflows

1. **Citizen Portal (`/register`):**
   - Register account, complete email OTP verification.
   - Build medical profile (Blood group, allergies, medications, emergency contacts).
   - Generate scannable Emergency QR Card or write to NFC wristband.

2. **Responder Portal (`/dashboard/verification`):**
   - Responders register with `accountType: "responder"`.
   - Upload official badge/ID document for admin verification.
   - Once approved, access verified emergency patient files and live **SOS Radar**.

3. **Admin Portal (`/dashboard/admin/verifications`):**
   - Review pending responder verification requests and approve/reject credentials.

---

## 📄 License

MIT License — free to use, modify, and deploy.

---

## 🙏 Acknowledgements

Built to solve emergency response delays — empowering first responders with instant, accurate medical data and AI triage insights.
