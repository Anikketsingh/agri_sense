
# AgriSense — context.md

A concise, working context for the MVP app so any contributor (or AI coder) understands what we're building and can implement modules independently.

---

## 1) Product Snapshot
- **Goal:** Help farmers make quick, data-backed decisions using farm boundary scans, soil sensor stick readings, and simple recommendations.
- **Platforms:** Mobile-first (React Native / Flutter). Optional web dashboard later.
- **Offline-first:** Local DB with background sync when online.
- **Primary Regions:** India (start), with Hindi/English. Metric units by default.

### Target Users
- **Farmer (default mode):** Simple tiles, large buttons, quick actions, voice-friendly.
- **Analyst/Advisor (later):** Deeper charts & exports.
- **Field Tech (later):** Sensor health & deployment.

### Non-goals (MVP)
- Multi-season comparisons, advanced ML explainability UIs, custom model uploads.

---

## 2) MVP Scope (8–10 Screens)
1. **Auth** (Phone OTP, create Farmer ID)
2. **Home** (Tile navigation)
3. **My Fields** (List + map)
4. **Scan Farm** (GPS boundary polygon + area calc)
5. **Soil Analysis** (Hardware stick → readings + soil score)
6. **Crop Suggestions** (Top 2–3 crops with reasoning)
7. **Alerts & Tips** (Weather & irrigation prompts)
8. **Reports** (Past scans & suggestions; export basic PDF/CSV)
9. **Settings** (Language, units, sync, thresholds) — *lightweight*
10. **Add Note** (Photo/voice) — *optional in MVP*

---

## 3) High-Level Architecture
```
Mobile App
 ├─ UI Layer (Screens/Components)
 ├─ State (Query cache + app store)
 ├─ Services
 │   ├─ AuthService (OTP, FarmerID)
 │   ├─ FieldService (polygon, area)
 │   ├─ SoilService (BLE/USB read, parse, validate)
 │   ├─ SuggestionService (crop/irrigation/fertilizer)
 │   ├─ AlertService (weather, thresholds)
 │   ├─ ReportService (PDF/CSV)
 │   └─ SyncService (conflict strategy, queues)
 └─ Storage
     ├─ SQLite (entities below)
     └─ Media (photos/audio) → local + S3 when online
```
- **Maps:** Mapbox/Google
- **Charts:** Recharts/ECharts
- **BLE/USB:** Native module or plugin

---

## 4) Data Model (SQLite, minimal MVP)
### Entities
- **Farmer** `{ id, phone, name, language, createdAt }`
- **Field** `{ id, farmerId, name, polygonGeoJSON, area_m2, crop, createdAt }`
- **SoilScan** `{ id, fieldId, deviceId, ph, n_ppm, p_ppm, k_ppm, moisture_pct, ec_dS_m, temp_c, score, createdAt }`
- **Suggestion** `{ id, fieldId, soilScanId, type, title, rationale, createdAt }`
  - `type ∈ { "crop", "irrigation", "fertilizer" }`
- **Alert** `{ id, fieldId, kind, severity, message, createdAt, resolvedAt? }`
- **Report** `{ id, fieldId, rangeStart, rangeEnd, url?, createdAt }`

### Example Schemas
```json
// Field polygon (GeoJSON)
{
  "type": "Feature",
  "geometry": {
    "type": "Polygon",
    "coordinates": [[[lng, lat], [lng, lat], ...]]
  },
  "properties": { "name": "North Plot" }
}
```
```json
// Soil scan (hardware stick → parsed payload)
{
  "deviceId": "STICK-00123",
  "timestamp": "2025-09-05T09:42:00Z",
  "readings": {
    "ph": 6.5,
    "n_ppm": 18,
    "p_ppm": 14,
    "k_ppm": 110,
    "moisture_pct": 21.3,
    "ec_dS_m": 1.2,
    "temp_c": 29.4
  }
}
```

---

## 5) APIs (App-facing, can be local-first and sync later)
> For MVP, endpoints can be mocked or backed by a lightweight server.

- `POST /auth/otp/request` → `{ phone }`
- `POST /auth/otp/verify` → `{ phone, code }` → `{ farmerId, token }`
- `GET /farmers/:id`
- `POST /fields` → `{ polygonGeoJSON, name }`
- `GET /fields?farmerId=...`
- `POST /soil-scans` → payload from SoilService
- `POST /suggestions/crop` → `{ fieldId, soilScanId }` → top crops
- `GET /alerts?fieldId=...`
- `POST /reports` → `{ fieldId, rangeStart, rangeEnd }`

**Auth:** bearer token (JWT). **Sync:** batch endpoints later (e.g., `/sync/upload`, `/sync/download`).

---

## 6) Business Logic (Rules for MVP)
- **Soil score:** weighted range-normalized sub-scores (pH, NPK, moisture, EC) → 0–100.
- **Crop suitability:** map soil ranges + season (location-based calendar) to shortlist crops; show **confidence**.
- **Irrigation suggestion:** if `moisture_pct < threshold` and `rainChance < X%` → recommend liters/acre (simple rule for MVP).
- **Alerts:** threshold breaches (pH too low/high, moisture low, upcoming heatwave).

---

## 7) Hardware Stick Integration
- **Transport:** BLE preferred; fallback USB-OTG (Android).
- **Handshake:** device advertises `deviceId` and firmware version.
- **Payload:** see SoilScan schema above.
- **Validation:** range checks + drift/outlier flags.
- **Error states:** `NO_SIGNAL`, `LOW_BATTERY`, `SENSOR_WARMUP`, `OUT_OF_RANGE`.

---

## 8) Screens — Responsibilities & Components
### Auth
- **Flows:** Register (OTP) → assign `FarmerID` (UUID short form, shown prominently). Login (OTP).
- **Components:** PhoneInput, OTPInput, PrimaryButton, ErrorBanner.
- **Success:** route to **Home**.

### Home (Tiles)
- **Tiles:** My Fields • Scan Farm • Soil Analysis • Crop Suggestions • Alerts • Reports • Settings
- **Header:** FarmerID + name + sync status.
- **Offline banner** if not connected.

### My Fields
- **List + Map toggle.** Create/edit fields.
- **FieldTile:** name, crop, area, alert count.

### Scan Farm (GPS)
- Start/Stop scan, show polygon path & live area.
- Manual vertex edit; save to field.

### Soil Analysis
- Connect to stick, fetch readings, compute score.
- Save scan and link to field.
- Show gauges + pass/fail tags.

### Crop Suggestions
- Top 2–3 crop cards with rationale (soil fit, season).
- CTA: “Accept suggestion → set crop for field”.

### Alerts & Tips
- Sorted by severity/time. Swipe to resolve.
- Simple “What to do now” steps.

### Reports
- Choose field + date range, generate summary.
- Export (PDF/CSV) and share (WhatsApp/Email).

### Settings (lightweight)
- Language, units, thresholds, data sync.

---

## 9) Navigation & State
- **Navigation:** Stack (Auth) → Tab (Home, Fields, Alerts, Reports) → Modals (Scan, Soil Analysis).
- **State:** React Query (remote) + Zustand/Redux (UI/app); normalized entities.
- **Caching:** last 30 days of readings locally.

---

## 10) Security & Privacy
- OTP auth; device PIN/biometric app lock (optional).
- Encrypt local DB if feasible; never log raw OTP.
- PII minimal: phone + FarmerID.

---

## 11) i18n & Accessibility
- Strings in i18n JSON; start with Hindi/English.
- Large touch targets; offline icons/text.
- Avoid color-only signals; include labels.

---

## 12) Telemetry (Optional MVP)
- Screen views, task completion (scan, soil, suggestion).
- Crash logging.

---

## 13) Testing Strategy
- **Unit:** services (SoilService parsing, Suggestion rules).
- **Integration:** BLE data → soil scan saved → suggestion generated.
- **E2E:** scan polygon → save field → run soil → accept crop.

---

## 14) Project Structure (React Native example)
```
/app
  /screens
    Auth/
    Home/
    Fields/
    Scan/
    Soil/
    Suggestions/
    Alerts/
    Reports/
    Settings/
  /components
  /services
  /store
  /hooks
  /assets
  /i18n
  /lib (utils, geo, pdf)
/tests
```

---

## 15) Checklists (Do-First)
- [ ] Auth: OTP request/verify + store FarmerID
- [ ] Home: tile grid + header with sync status
- [ ] Fields: create + list + map toggle
- [ ] Scan: GPS polygon + area calc + save
- [ ] Soil: BLE connect + parse + validate + score
- [ ] Suggestions: simple rule engine + UI
- [ ] Alerts: threshold & weather placeholder
- [ ] Reports: basic PDF/CSV export
- [ ] Offline: SQLite mirror + sync button

---

## 16) Milestones
- **M1:** Auth + Home + Fields CRUD + Scan Farm (2 weeks)
- **M2:** Soil Analysis (BLE) + Suggestions (2 weeks)
- **M3:** Alerts + Reports + Offline sync polish (2 weeks)

---

## 17) Glossary
- **FarmerID:** short unique identifier for the farmer, derived from UUID (e.g., `F-92A7C3`).
- **Polygon/Field:** boundary of a farm plot captured via GPS walk.
- **Soil Score:** 0–100 composite metric from sensor readings.

---

## 18) Open Questions
- Weather provider for forecasts? (Needed for irrigation logic)
- Final thresholds for soil parameters per crop? (Agronomy table source)
- BLE protocol finalization for the hardware stick?
