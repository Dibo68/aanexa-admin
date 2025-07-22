# 📘 Aanexa Projektbauplan

## 1. Ziel & Vision

Aanexa ist eine skalierbare SaaS-Plattform zur Bereitstellung von AI-Lösungen für kleine und mittlere Unternehmen. Im Fokus stehen AI-Support-Chats mit Vektor-Datenbankanbindung, einfache Produktbuchung, sowie strukturierte Verwaltung von Kunden, Partnern und Administratoren.

## 2. Nutzergruppen

- **Kunden:** Buchen AI-Produkte, verwalten Uploads, Abos & Support
- **Admins:** Verwalten Kunden, Produkte, Abrechnungen, Rechte & Partner
- **Partner (Webmaster):** Bewerben Aanexa und erhalten Provision

## 3. Systemkomponenten & Subdomains

- `aanexa.com`: Marketing, Registrierung, Login
- `admin.aanexa.com`: Admin-Dashboard (nur für Admins)
- `kunde.aanexa.com` (alternativ `/kunde`): Kundenbereich
- `partner.aanexa.com` (alternativ `/partner`): Partnerbereich

## 4. Technologiestack

- **Frontend:** Next.js 15.4 (App Router, SSR, React 19)
- **Datenbank & Auth:** Supabase (extern gehostet)
- **AI Backend:** Flowise + Qdrant (self-hosted)
- **Automation:** n8n (self-hosted)
- **Deployment:** Coolify (Docker-basiert)
- **Server:** Hetzner Cloud (aktuell CX32 mit 40 GB SSD)

## 5. Authentifizierung & Rollen

- JWT-basiert (Token wird manuell gesetzt)
- Cookie-basiertes Login ist aufgrund Subdomain-Problematik nicht verlässlich (Free-Tier Supabase)
- Rollen: `customer`, `admin`, `super_admin`, `partner`

## 6. Modulplan

### Kundenbereich

- Account erstellen
- Produkte buchen (AI Chat, optional Abo)
- Dokumente hochladen (via n8n)
- Abo verwalten / kündigen
- Support kontaktieren

### Adminbereich

- Admins erstellen, bearbeiten, löschen (nur Super Admin)
- Kunden einsehen & verwalten
- Produktverwaltung
- Rechnungen erstellen / anzeigen
- Gutscheine & Rabatte verwalten
- Partnerverwaltung & Provisionsübersicht
- Disk-Usage-Widget (Systemmonitor)

### Partnerbereich

- Registrierung & Login
- Affiliate-Link einsehen
- Performance-Statistik
- Auszahlungshistorie

## 7. Infrastruktur – Monitoring & Wartung

- **Problem:** Speicher voll (Coolify crashte)
- **Lösung:**
  - Cronjob zum automatischen `docker system prune`
  - Disk-Monitoring-Widget im Admin-Panel (Anzeige in %)
  - Perspektivisch: Upgrade auf CPX31 (160 GB SSD)

## 8. Dokumentationsstruktur (lokal oder GitHub-basiert)

```
/docs
├── roadmap.md
├── auth-flow.md
├── rollenstruktur.md
├── disk-monitoring.md
├── changelog.md
```

## 9. Nächste technische Schritte

- ✅ Tokenbasierte Authentifizierung über Subdomain implementieren
- ✅ Disk Usage API bauen + Admin-Widget
- ✅ Middleware zur Rollenprüfung
- ✅ Deploymentstrategie dokumentieren
- ✅ Erste echte Buchung / Upload Flow testen (n8n + Qdrant)

## 10. Historie

- 2025-07-21: Systemausfall wegen Speicherüberlauf → manuell bereinigt
- 2025-07-22: Strukturplanung und Token-Auth beschlossen

---

> Dokument gepflegt von ChatGPT / Stand: 2025-07-22

