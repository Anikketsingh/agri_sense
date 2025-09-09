# AgriSense App Flow Redesign

## Overview
The new flow should feel structured and beginner‑friendly. The farmer’s journey inside the app should:
1. **Login →** Authenticate with OTP.
2. **Tutorial (App Intro) →** Explain app value props and how to use it.
3. **Tutorial (GPS Tracking) →** Hands‑on guide for scanning land by walking with GPS.
4. **Home Screen →** Entry point for main features: My Farm, Crop Disease, Market.
5. **Sub‑flows** inside Home → Farm Management (with/without sensor), Crop Recommendations, Fertilizer/Irrigation Monitors, Yield Prediction.

This change ensures onboarding is smooth and educates users before they jump into mapping or soil testing.

---

## New Navigation Flow
```
Splash → Login → TutorialIntro → TutorialGPS → Home

Home → My Farm
     ├─ With Sensor (step‑by‑step BLE soil reading)
     ├─ Without Sensor (manual input)
     ├─ Fertilizer Monitor
     ├─ Irrigation Monitor
     └─ Yield Prediction

Home → Crop Disease (image capture + ML)
Home → Market (prices, listings)
```

---

## CHANGES.md

### 1. Navigation
- [ ] Update navigation stack to:
  - SplashScreen
  - LoginScreen
  - TutorialIntroScreen (carousel style, explains app)
  - TutorialGPSScreen (map preview + animated walkthrough)
  - HomeScreen (grid of features)
- [ ] Ensure user cannot skip tutorials on first login (but allow Skip for repeat users).

### 2. Login Screen
- [ ] OTP auth (already implemented) → polish UI with farmer‑friendly illustrations.
- [ ] Add loading states, error handling.
- [ ] Multi‑language labels (English/Hindi).

### 3. Tutorial Screens
- **TutorialIntroScreen**
  - [ ] 3–4 slides with illustrations: “Map your field”, “Check soil health”, “Get crop suggestions”.
  - [ ] Use swiper component (e.g., `react-native-swiper` or custom flatlist pager).
  - [ ] Voice readout (TTS) option.

- **TutorialGPSScreen**
  - [ ] Show mock map + red pins dropping as demo.
  - [ ] Explain Start → Walk → Stop → Save.
  - [ ] Use animations (Lottie for walking + GPS icon).

### 4. Home Screen
- [ ] Card/grid layout with large icons and labels:
  - My Farm
  - Crop Disease
  - Market
- [ ] Consistent color palette (green tones for agriculture).
- [ ] Local language toggle visible.

### 5. My Farm
- [ ] Two entry points: With Sensor / Without Sensor.
- [ ] With Sensor → BLE connect UI, live soil data visualization (gauges, progress bars).
- [ ] Without Sensor → Manual entry form (pH, NPK, moisture).
- [ ] After saving sample → show Crop Recommendations.
- [ ] Sub‑tabs:
  - Fertilizer Monitor (bar chart usage vs. target)
  - Irrigation Monitor (weekly schedule)
  - Yield Prediction (AI‑powered forecast card)

### 6. Crop Disease
- [ ] Camera integration (capture/upload photo).
- [ ] Send to ML service → return probability of disease + suggestions.
- [ ] UI: full‑screen preview + ResultCard.

### 7. Market
- [ ] List of crops + current mandi prices.
- [ ] Search/filter by crop.
- [ ] Future: farmer‑to‑farmer listing.

### 8. Styling / UI
- [ ] Use Tailwind via `nativewind` or styled‑components.
- [ ] Card components: rounded corners (2xl), subtle shadows, icons (lucide‑react or custom agri icons).
- [ ] Animations: Framer Motion or Reanimated v3.
- [ ] Typography: Large, readable; avoid jargon.
- [ ] Accessibility: Voice‑friendly labels, minimum 48dp buttons.

### 9. Internationalization
- [ ] Add Hindi strings for all new screens.
- [ ] Extend i18next namespaces: `tutorial`, `home`, `farm`, `market`.

### 10. State Management
- [ ] Add `tutorialCompleted` flag in Zustand store.
- [ ] Track BLE state inside `sensors.store.ts`.
- [ ] Track GPS walkthrough completion.

### 11. Future Considerations
- Add offline tutorials (Lottie animations cached locally).
- Add farmer profile with progress (fields scanned, soil tests saved).

---

## Prompt for Cursor

Here’s a prompt you can give to Cursor to generate these changes screen‑by‑screen:

```
You are helping me refactor my React Native Expo app (AgriSense) with Supabase + Zustand.

### Context:
- Existing features: OTP login, GPS field mapping, field CRUD, BLE soil sensor integration, Supabase backend, Zustand state, i18next internationalization.
- Tech: Expo (managed workflow), Zustand, Supabase, nativewind/Tailwind, i18next, react-native-maps, react-native-ble-plx.

### Task:
Redesign the app flow as:
1. Splash → Login (OTP)
2. TutorialIntro (multi‑slide onboarding)
3. TutorialGPS (animated guide for walking field boundaries)
4. Home (cards for My Farm, Crop Disease, Market)
5. My Farm (With Sensor / Without Sensor → then Crop Recommendations, Fertilizer Monitor, Irrigation Monitor, Yield Prediction)
6. Crop Disease (camera upload + results)
7. Market (list mandi prices)

### Requirements:
- Implement navigation stack accordingly (React Navigation).
- Build new screens with good UI (Tailwind + shadcn/ui style, large buttons, rounded corners, icons).
- Add Zustand state slices: `tutorialCompleted`, `sensors`, `fields`.
- Each screen should be scaffolded with placeholder components and clean layout.
- Add i18next translations for English & Hindi.
- Add example Lottie animations for tutorial.
- Ensure accessibility: big buttons, voice‑friendly labels.

### Deliverables:
- Code each screen one by one.
- Provide updated navigation setup.
- Add mock components for BLE and GPS tutorials.
- Use dummy data for Market and Crop Disease until backend is ready.
- Keep code modular, well‑commented.

```

