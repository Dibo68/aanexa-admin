# 🚀 Aanexa AI-Service Platform - Projekt Übersicht

## 📖 **Projekt-Beschreibung**

**Aanexa = SaaS-Plattform für AI-Services für kleine Unternehmen**

**Vision:** "Shopify für AI-Services" - Restaurants, Yoga Studios, etc. können sich selbst AI-Chatbots einrichten

**Business Model:**
- **Self-Service Platform:** Kunden erstellen eigene Accounts (`kunde.aanexa.com`)
- **AI Support Chatbots:** Hauptprodukt mit Knowledge-Upload (Menü, FAQ, etc.)
- **Support Tiers:** Standard (48h) vs Premium (12h) Reaktionszeit
- **Skalierbare Preismodelle:** Verschiedene Service-Level und Add-ons

**Customer Journey:**
1. Registration → Email-Bestätigung → Eigene Subdomain
2. Dashboard Setup → Firmendetails, Zahlungsdaten eingeben
3. Produkt Selection → AI Support Chat auswählen und bezahlen
4. Knowledge Upload → Menü, Geschichte, FAQs für AI-Training
5. Code Integration → Snippet für eigene Website kopieren
6. Ongoing Management → Daten aktualisieren (neues Menü, etc.)

---

## 🏗️ **System-Architektur (3 Hauptkomponenten)**

### **1. 👨‍💼 ADMIN DASHBOARD** 
- **URL:** admin.aanexa.com ✅ LIVE & PROFESSIONELL GEBRANDET
- **Für:** Aanexa-Betreiber (Dibo)
- **Funktionen:** Kunden verwalten, Produkte konfigurieren, Collections überwachen
- **Status:** Frontend komplett mit Aanexa-Branding

### **2. 👤 CUSTOMER PORTALS** 
- **URL:** {kunde}.aanexa.com ❌ TODO
- **Für:** End-Kunden (Restaurant-Besitzer, etc.)
- **Funktionen:** Eigene Chatbots konfigurieren, Knowledge-Upload, Code-Snippets

### **3. 🤖 AI SERVICES BACKEND**
- **Flowise:** Chatbot-Engine ✅ LÄUFT
- **Qdrant:** Knowledge Storage ✅ LÄUFT  
- **n8n:** Automation ✅ LÄUFT

---

## 🏗️ **Server-Infrastructure (Hetzner Cloud)**
- **IP:** 95.216.205.115
- **Management:** Coolify (https://coolify.aanexa.com)
- **SSL:** Let's Encrypt automatisch
- **DNS:** Dreamhost → Hetzner Server

### **Dienste & URLs**
| Service | URL | Status | Zweck |
|---------|-----|---------|-------|
| **Admin Dashboard** | https://admin.aanexa.com | ✅ LIVE + GEBRANDET | Management Interface |
| **n8n** | https://n8n.aanexa.com | ✅ Aktiv | Workflow Automation |
| **Flowise** | https://flowise.aanexa.com | ✅ Aktiv | AI Chatbot Builder |
| **Qdrant** | https://qdrant.aanexa.com | ✅ Aktiv | Vektor Database |
| **HTML2PDF** | https://html2pdf.aanexa.com | ✅ Aktiv | PDF Generator |

### **Datenbanken**
- **Supabase:** https://oorpduqkhfsuqerlcubo.supabase.co ✅ KONFIGURIERT
- **Qdrant:** Vektor-Datenbank für AI Collections
- **WordPress:** Simple Membership Plugin für Customer Management (geplant)

---

## 💻 **Aktueller Entwicklungsstand**

### ✅ **KOMPLETT FERTIG:**
1. **Server-Setup** (Hetzner + Coolify + alle Services)
2. **Admin Dashboard Frontend** - Next.js App mit professionellem Aanexa-Branding
3. **Authentication System** - Login/Logout komplett funktional
4. **Supabase Integration** - Database Schema erstellt und verbunden
5. **Navigation & UI** - Vollständig responsive und modern
6. **External Image Configuration** - Aanexa Logo wird korrekt angezeigt
7. **GitHub Repository:** https://github.com/Dibo68/aanexa-admin

### 🔄 **AKTUELLER FOCUS:**
- **Admin Management System** - Nächster logischer Schritt
- **Database Integration** - CRUD Operations für Admins

### ❌ **TODO (Priorisierte Roadmap):**

#### **PHASE 1: Admin Management vervollständigen** ⬅️ **JETZT**
1. **Admin CRUD System**
   - Admin-Liste anzeigen (wer hat Zugang)
   - Neue Admins anlegen (Name, Email, Rolle)
   - Admins bearbeiten/löschen/deaktivieren
   - Admin-Rollen (Super Admin vs Normal Admin)

2. **Customer Management Backend**
   - Customer CRUD Operations
   - Subdomain-Management
   - Customer Dashboard Vorschau

#### **PHASE 2: Customer Portal System**
1. **Multi-Tenant Architecture**
   - Subdomain Routing ({kunde}.aanexa.com)
   - Customer Authentication System
   - Individual Customer Dashboards

2. **Customer Onboarding Flow**
   - Registration + Email Confirmation
   - Payment Integration (Stripe/PayPal)
   - Automatic Subdomain Creation

3. **Customer Dashboard Features**
   - Knowledge Upload (Menü, FAQ, etc.)
   - Flowise Chatbot Configuration
   - Code-Snippet Generation
   - Billing/Support Management

#### **PHASE 3: Advanced Features**
1. **AI Processing Pipeline**
   - Automatic Document Vectorization
   - Qdrant Collection Management per Customer
   - Flowise Chatflow Auto-Creation

2. **Business Features**
   - Support Ticket System (Standard vs Premium)
   - Usage Analytics per Customer
   - Automated Billing & Invoicing

---

## 🔑 **Environment Variables & Konfiguration**

```env
# Supabase (✅ KONFIGURIERT)
NEXT_PUBLIC_SUPABASE_URL=https://oorpduqkhfsuqerlcubo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[GESETZT]
SUPABASE_SERVICE_ROLE_KEY=[GESETZT]

# Qdrant (✅ KONFIGURIERT)
QDRANT_URL=https://qdrant.aanexa.com
QDRANT_API_KEY=[GESETZT]

# OpenAI (✅ KONFIGURIERT)
OPENAI_API_KEY=[GESETZT]

# App (✅ KONFIGURIERT)
NEXTAUTH_URL=https://admin.aanexa.com
NEXTAUTH_SECRET=[GESETZT]
```

---

## 🎯 **Nächste Prioritäten (Roadmap)**

### **JETZT: Admin Management System** ⬅️ **CURRENT FOCUS**
1. ✅ **Database Schema** (fertig)
2. ✅ **Authentication** (fertig)
3. 🏗️ **Admin CRUD Interface** (nächster Schritt)
4. 🏗️ **Admin Rollen & Permissions**

### **DANACH: Customer Management Backend**
1. 🏗️ **Customer CRUD System**
2. 🏗️ **Subdomain Management**
3. 🏗️ **Customer Dashboard Preview**

### **SPÄTER: Customer Portal MVP**
1. 🏗️ **Multi-Tenant System** ({kunde}.aanexa.com routing)
2. 🏗️ **Customer Registration Flow** (Email-Bestätigung)
3. 🏗️ **Basic Customer Dashboard** (Upload, Code-Snippet)

### **ZULETZT: Advanced Features**
1. 💰 **Payment Integration** (Stripe für Abos)
2. 🤖 **Auto-Chatbot Creation** (Flowise API)
3. 📊 **Analytics & Billing**

---

## 🔧 **Tech Stack & Entwickler-Info**

### **Frontend & Backend:**
- **Framework:** Next.js 15 + React 18 + TypeScript
- **Styling:** Tailwind CSS + Custom Components
- **Database:** Supabase (PostgreSQL)
- **Vectors:** Qdrant Cloud
- **AI:** OpenAI API
- **Deployment:** Coolify (Docker)
- **Repository:** GitHub (öffentlich)

### **Key Files:**
- **Main App:** `src/app/layout.tsx` ✅ (mit Aanexa Branding)
- **Login:** `src/app/login/page.tsx` ✅ (mit Logo)
- **Dashboard:** `src/app/dashboard/page.tsx` ✅ (modern design)
- **Navigation:** `src/components/Navigation.tsx` ✅ (mit Logo)
- **Config:** `next.config.js` ✅ (externe Images)
- **Docker:** `Dockerfile` ✅

---

## 📞 **Bei neuem Chat verwenden:**

**"Hi! Ich arbeite an Aanexa - einer SaaS-Plattform für AI-Services für kleine Unternehmen (Restaurants, Yoga Studios, etc.). Kunden bekommen eigene Subdomains und können sich selbst AI-Chatbots einrichten. 

AKTUELLER STAND: Das Admin Dashboard ist komplett fertig mit professionellem Aanexa-Branding, Authentication funktioniert, Supabase ist konfiguriert. Als nächstes arbeiten wir am Admin Management System (CRUD für Admin-Accounts).

Hier ist die komplette Projekt-Übersicht: [Diese Datei hochladen]"**

**Dann kannst du direkt fragen:** 
- "Lass uns das Admin Management System implementieren"
- "Können wir an der Admin-Liste und CRUD-Funktionen arbeiten?"
- "Wie implementieren wir Admin-Rollen und Permissions?"
- "Lass uns den nächsten Schritt aus der Roadmap angehen"

---

**Letztes Update:** 14. Juli 2025  
**Status:** Admin Dashboard komplett mit Branding ✅ - Bereit für Admin Management System 🚀
