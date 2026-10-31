# Brand Guidelines — Abbu Ka Tutor (ابو کا ٹیوٹر)
**Identity System, Design Principles & Cultural Strategy**  
*Build4Better Hackathon • NED University • October 2026*

---

## 1. Brand Essence & Strategy

### 1.1 The Purpose
**Abbu Ka Tutor** exists to close the digital confidence gap for 40+ million Pakistani elders (aged 50+). While the modern world moves rapidly toward digital transactions, our parents are paralyzed by fear—fearing they will press the wrong button, lose their hard-earned life savings, or fall victim to predatory scammers.

### 1.2 The Emotional Promise
> **"پہلے سیکھو، پھر کرو، بنا ڈر کے۔"**  
> *"Pehle seekho, phir karo, bina dar ke."*  
> *(Learn first, do later, without fear).*

We transform digital hesitation into generational pride. We teach them how to do it themselves—never completing the task for them, and never shaming their mistakes.

### 1.3 Core Metaphor: The Lantern & The Shield
* **The Lantern (*Chiragh* / چراغ):** Guidance, patience, and clarity illuminating an unfamiliar digital landscape.
* **The Protective Shield (*Dhal* / ڈھال):** An inviolable boundary safeguarding senior citizens from financial fraud, fake OTP calls, and panic traps.
* **The Letterform *Alif* (الف):** The first letter of the Urdu alphabet and the initial of *Abbu* (ابو), symbolizing the foundational first step of lifelong learning.

---

## 2. Logo System & Geometry

### 2.1 The Symbol
The primary mark fuses an **arched gateway / protective shield** with an **illuminating beacon / flame** in the center. Its silhouette subtly echoes both a mobile phone viewport and the classical Nastaliq *Mehraab*, balancing cultural reverence with modern digital utility.

### 2.2 Wordmark Lockup
* **Urdu Script:** `ابو کا ٹیوٹر` rendered in calibrated high-contrast Nastaliq.
* **English / Roman Urdu:** `Abbu Ka Tutor` set in bold, geometric Nunito.
* **Clearspace:** Always maintain clearspace equal to the height of the central flame icon around all four sides.

---

## 3. Color System & Contrast Ratios

The palette is rooted in warmth, dignity, and psychological reassurance. Unlike conventional software that uses harsh alarms for user errors, **Abbu Ka Tutor reserves red exclusively for actual fraud warnings.**

| Token | Hex Code | Swatch Name | Role & Usage | Contrast Ratio on `--bg` |
|---|---|---|---|---|
| `--primary` | `#0F5E4E` | **Forest Spruce** | Primary brand anchor, primary action buttons, confidence indicators. Evokes Pakistani state currency and growth. | **7.4 : 1** (WCAG AAA) |
| `--primary-soft` | `#EAF4F1` | **Spruce Tint** | Highlighted step containers, active tabs, icon backdrops. | — |
| `--gentle` | `#C7771E` | **Warm Amber** | **Zero-Blame Surface.** Used when wrong taps occur. Warm, encouraging, patient (never red). | **4.8 : 1** (WCAG AA) |
| `--gentle-soft` | `#FDF5EA` | **Amber Cream** | Reassurance card background, hint banners. | — |
| `--danger` | `#B43428` | **Crimson Alert** | **Strictly Reserved for Scams.** Used ONLY in Scam Dojo and "Mujhe Shak Hai" Emergency SOS. | **6.1 : 1** (WCAG AA) |
| `--bg` | `#F7F5F0` | **Warm Parchment** | App canvas. Reduces eye strain compared to stark white (`#FFFFFF`). | — |
| `--surface` | `#FFFFFF` | **Pure Paper** | Interactive cards, input fields, and mock phone viewports. | — |
| `--text` | `#171A1C` | **Deep Slate** | Primary text, titles, numbers. | **14.2 : 1** (WCAG AAA) |

---

## 4. Dual-Script Typography System

Pakistani elders read Nastaliq Urdu comfortably, but navigate apps using conversational Roman Urdu. Our typography supports both seamlessly.

### 4.1 Font Pairings
1. **Urdu Script:** `Noto Nastaliq Urdu` (fallback: `Noto Naskh Arabic`, `serif`).
   * Body: `font-size: 21px - 23px`
   * Line Height: `2.0 - 2.1` (crucial to prevent diacritic/aerab clipping).
   * Direction: `rtl` (Right to Left).
2. **English / Roman Urdu:** `Nunito` (fallback: `-apple-system`, `sans-serif`).
   * Body: `font-size: 17px - 19px`
   * Line Height: `1.45 - 1.5`
   * Direction: `ltr` (Left to Right).
3. **Numerals & Technical Data:** `JetBrains Mono` / `SF Mono`.
   * Clear tabular digits for amounts (e.g. `Rs. 4,850`), 14-digit reference numbers, and confidence ratings.

---

## 5. Interaction & Usability Standards (Elder-First)

### 5.1 The 52px Minimum Touch Rule
* Every clickable button, card, and interactive Hotspot target must measure at least **52px × 52px**.
* Generous padding prevents accidental mis-taps caused by hand tremors or presbyopia.

### 5.2 The Zero-Blame Pedagogy
* When an elder taps the wrong region:
  * ❌ **Forbidden:** "Ghalat!", "Error", "Invalid", red flashing banners, harsh buzzers.
  * ✅ **Enforced:** Amber card slide-up with audio: *"کوئی بات نہیں، یہ سب سے ہوتا ہے!"* (*"Koi baat nahi, yeh sab se hota hai!"*). Explains what that button does and how to get back on track.

### 5.3 Hands-Free Audio Accompaniment
* Every single explanation, question, and scam alert features a dedicated **"Suno" / "سنیں"** button.
* Spoken audio uses natural human cadence, avoids robotic TTS tones, and reads numbers in words (*"Chaudah hindson ka hawala number"* rather than *"One four..."*).

---

## 6. Tone of Voice & Cultural Etiquette

| Situation | Traditional App (Cold / Tech-Heavy) | Abbu Ka Tutor (Warm / Respectful) |
|---|---|---|
| **Form Error** | "Invalid consumer reference number." | *"کوئی بات نہیں! کاغذی بل پر چودہ ہندسے دھیان سے دیکھ کر دوبارہ لکھیں۔"* |
| **PIN Entry** | "Enter your 4-digit authentication PIN." | *"یہ آپ کا خفیہ پن کوڈ ہے۔ صرف اپنے فون پر ڈالیں، کسی کے کہنے پر نہیں۔"* |
| **Scam Call** | "Security warning: Suspicious activity flagged." | *"فوراً فون کاٹ دیں! یہ فراڈ ہے۔ اصلی بینک کبھی فون پر کوڈ نہیں مانگتا۔ آپ کے پیسے محفوظ ہیں۔"* |
| **Pronoun Usage** | "Tum / You" | Always respectful: **"آپ" (Aap)**, **"جی" (Ji)**. |

---

## 7. Brand Deliverables & Assets

* **Design Tokens:** [`client/src/styles/tokens.css`](file:///c:/Users/Test/Documents/build4better/client/src/styles/tokens.css)
* **Interactive Pitch Deck:** [`client/public/pitch-deck.html`](file:///c:/Users/Test/Documents/build4better/client/public/pitch-deck.html)
* **Pitch Narrative & Script:** [`pitch-deck.md`](file:///C:/Users/Test/.gemini/antigravity/brain/19a2ce3c-b694-4551-bd9b-b85cd5e0ae99/pitch-deck.md)
* **Emergency Scam Radar:** [`client/src/pages/ScamSOS.jsx`](file:///c:/Users/Test/Documents/build4better/client/src/pages/ScamSOS.jsx)
