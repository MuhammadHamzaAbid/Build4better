# Abbu Ka Tutor (ابو کا ٹیوٹر)

> **"Pehle seekho, phir karo, bina dar ke."**  
> *(Learn first, then do it, without fear.)*

**Build4Better Hackathon** (Codesphere 3.0, Department of Software Engineering, NED University of Engineering & Technology)  
**Date:** Saturday, 31 October 2026 | **Build Window:** 9:00 AM – 5:00 PM PKT  
**Team Members:** Team Build4Better (3 Members)

---

## 1. Problem Statement

Most Computer Science students grew up with touchscreens and digital systems, making software interactions feel automatic. Our parents and grandparents did not. They frequently get stuck on everyday tasks their children find trivial:
* A utility or banking app that logs them out or presents unfamiliar terminology.
* Unfamiliar, intimidating bill payment workflows with fears of *"Agar ghalat dabaya to paise doob jayenge"* (What if I tap wrong and lose money?).
* Sophisticated scam calls and phishing SMS messages ("Aap ka account block ho raha hai, foran OTP bataein") that specifically prey on non-tech-savvy elders.

When parents get stuck, they either constantly call their children in panic or quietly avoid essential digital tools altogether out of fear of looking foolish or breaking something. 

**Abbu Ka Tutor** solves this by adhering to one golden rule: **Teach, don't do.** It never completes tasks on behalf of the parent. Instead, it provides a mistake-proof, gentle environment where wrong taps are answered with patience, explanations are delivered in Urdu script, Roman Urdu, and voice, and confidence is systematically built.

---

## 2. Core Features

### 🌟 F1: Lesson Builder (Child View)
* A son or daughter types a task (e.g., *"Ammi ko bijli ka bill bharna sikhao"*) or uploads screenshots.
* Generates a step-by-step interactive lesson with percentage-based tap hotspots.
* The child can review, adjust hotspots using the visual `HotspotEditor`, customize text, and generate a shareable Family Code (`AMMI-2026`).

### 📖 F2: Lesson Player & 3-Way Language Toggle
* Shows one task at a time with a clear progress bar (*Qadam 2 / 7*).
* Instant toggle across **Urdu Script (اردو)** with Noto Nastaliq font, **Roman Urdu**, and **Voice Narration (🔊 Suno)**.
* Spoken voice feedback via TTS or browser speech synthesis (`ur-PK`).

### 🛡️ F3: Galti Ghar (Safe Practice Mode)
* Complete mistake-proof practice space. It is **impossible to break anything**.
* **Zero Blame:** Never uses words like *"Error"*, *"Wrong"*, or *"Invalid"*. No red alert screens for user mistakes.
* **Gentle Amber Guidance:** If the learner taps the wrong area, a warm card slides up with reassurance (*"Koi baat nahi, yeh sab se hota hai"*), explains what the tapped element does, and offers **Wapas Jayein (Undo)** and **Dobara Koshish (Try Again)**.
* **Fading Assistance:**
  * Attempt 1: No hint (test knowledge).
  * Attempt 2: Plain-language text hint.
  * Attempt 3+: Visual pulse glow highlight on the target.

### 🎯 F4: Scam Dojo
* 12 realistic Pakistani scam and genuine message cards (e.g., prize SMS, fake bank account suspension, fake OTP caller, wrong-transfer bait, parcel courier fees, and genuine utility reminders).
* Large dual options: **Asli (Real)** and **Fraud (Scam)**.
* Instant educational breakdown: highlights red-flag phrases in `--danger-soft` with numbered tags and provides clear, comforting explanations of *why* the message is dangerous and a *"Yaad Rakhein"* takeaway rule.

### 🔍 F5: Yeh Kya Hai? (Screenshot Coach)
* A parent can upload or select an unfamiliar mobile screen.
* Two-stage interactive coaching:
  1. **Stage 1 (Summary & Inquiry):** Explains what the screen is in 1–2 plain sentences, checks for scam indicators, and asks *"Aap kya karengi?"* without giving away the answer.
  2. **Stage 2 (Check & Feedback):** The parent states their intended action, and the coach evaluates whether it is safe and why.

### 📊 F6: Family View & Confidence Meter
* Tracks learner confidence before and after lessons (1 to 5 face scale: *"Kitna yaqeen hai?"*).
* Visualizes **Hesitation Points** (where the parent needed $\ge 2$ attempts or hints) so children know where to offer gentle offline reassurance.
* Learning curve chart demonstrating how mistakes drop across attempts.

---

## 3. Real vs. Simulated Features (Strict Transparency)

In compliance with the Build4Better Rulebook, all simulated and live components are explicitly distinguished:

| Feature / Component | Status | Implementation Details |
|---|---|---|
| **Lesson Player & Hint Fading** | **Real / Working** | Full interactive state engine, percentage hotspots, and fading hints (attempts 1–3). |
| **Galti Ghar (Kind Feedback & Undo)** | **Real / Working** | Active slide-up card with gentle guidance and non-punitive retry logic. |
| **Scam Dojo** | **Real / Working** | Interactive evaluation of 12 realistic scenarios with in-message red-flag highlights. |
| **Language Toggle & Urdu Typography** | **Real / Working** | RTL Nastaliq Urdu, Roman Urdu, and voice narration toggle. |
| **Voice Audio (TTS)** | **Real / Working** | Server-cached TTS with automated browser `SpeechSynthesis` (`ur-PK`) fallback. |
| **Lesson Builder & Hotspot Editor** | **Real / Working** | Drag-and-drop hotspot authoring with OpenAI lesson generation API and offline fallback. |
| **Yeh Kya Hai? (Screenshot Coach)** | **Real / Working** | Two-stage AI evaluation with saved sample screenshot fallbacks. |
| **Roshni Bijli Utility App Screens** | **Simulated** | Completely fictional brand ("Roshni Bijli"), sample customer name, and mock utility data with visible "PRACTICE" badges. |
| **Payments, OTPs & PINs** | **Simulated** | No real bank or payment gateway integrations. No personal CNICs, PINs, or credentials collected or stored. |
| **Family Progress Data** | **Real & Simulated** | Tracks live local sessions; includes a toggleable "Demo Data" view with a visible simulation badge for demonstration. |

---

## 4. Technology Stack & Architecture

* **Frontend:** React 18, Vite, React Router v6, custom CSS Design System (`tokens.css`) following `DESIGN.md`.
* **Backend:** Node.js (v24), Express, CORS, flat JSON storage (zero database setup needed).
* **AI Integration:** OpenAI API (`gpt-4o` for vision/lesson/coaching, `tts-1` for audio speech).
* **Offline Guarantee:** `USE_FALLBACK=true` ensures the entire application runs with zero external internet dependencies or API keys.

---

## 5. Setup & Running Instructions

### Prerequisites
* Node.js (v18+ recommended)
* npm (v9+)

### Installation
Clone the repository and install dependencies:

```bash
# Clone the repository
git clone <repo-url>
cd build4better

# Install dependencies for both server and client
npm --prefix server install
npm --prefix client install
```

### Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(Optional: add your `OPENAI_API_KEY` in `.env`. If left blank or if `USE_FALLBACK=true`, the app seamlessly runs using offline fallback lessons, scam cards, and browser voice).*

### Run the Application

**Option A: Run Server and Client Together**
```bash
# Terminal 1: Start Backend (Port 3001)
npm --prefix server start

# Terminal 2: Start Frontend (Port 5173)
npm --prefix client run dev
```

**Option B: Production Preview**
```bash
npm --prefix client run build
npm --prefix client run preview
```

Open your browser at: **`http://localhost:5173`**

---

## 6. AI Tools Disclosure & Third-Party Credits

* **AI Tools Used:**
  * Claude & Gemini for ideation, PRD/Design structuring, and code pair-programming.
  * OpenAI GPT-4o for dynamic lesson generation and screenshot coaching prompts.
  * OpenAI TTS-1 for Urdu speech synthesis.
* **Fonts & Icons:**
  * *Noto Nastaliq Urdu* and *Noto Naskh Arabic* (Google Fonts, Open Font License).
  * *Nunito* (Google Fonts, Open Font License).
  * Lucide Icons & native high-contrast emojis.

---

## 7. Final Submission Commit Identifier

* **Submitted Commit Hash:** `INITIAL_SUBMISSION_CANDIDATE` (See git commit log)
