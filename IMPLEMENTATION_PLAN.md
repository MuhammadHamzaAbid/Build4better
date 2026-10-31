# Implementation Plan: Abbu Ka Tutor

**Build window:** Sat 31 Oct 2026, 9:00 AM to 5:00 PM PKT. **Submit by 4:15 PM.** Feature freeze at 3:00 PM.
**Team of 3:** A = Frontend, B = Backend and AI, C = Content and submission. Assign names first.
Companion files: `PRD.md` (what), `DESIGN.md` (how it looks), `SKILL.md` (rules for AI tools), `PROMPTS.md` (prompts to paste).

---

## 1. Architecture

```
┌──────────────────────── Browser (React + Vite) ────────────────────────┐
│ Home │ Lesson Player + Galti Ghar │ Scam Dojo │ Yeh Kya Hai? │        │
│ Lesson Builder (child) │ Family View │ HotspotEditor (shared)          │
└───────────────┬─────────────────────────────────────────────────────────┘
                │ fetch /api/*
┌───────────────▼─────────────── Server (Node + Express) ────────────────┐
│ /api/lessons  /api/explain  /api/tts  /api/scams  /api/progress        │
│  ├─ OpenAI: vision/text model (lesson + explain), TTS (voice)          │
│  ├─ Fallback: saved lessons, saved scam cards, pre-recorded audio      │
│  └─ Storage: JSON files in server/data (no database)                   │
└─────────────────────────────────────────────────────────────────────────┘
```

**Decisions (keep it simple):**
- No database. JSON files for lessons, scam cards and progress.
- No login. A **family code** (for example `AMMI-2026`) links parent and child.
- Every AI feature has a **saved fallback**. `USE_FALLBACK=true` makes the whole app run with zero internet.
- Mock screens are **static images** with tap hotspots in percentages. One shared `HotspotEditor` is used both to author the hero lesson and to let the child fix AI-generated hotspots.
- Stack is a suggestion (React + Vite, Express, OpenAI API). Swap it if your team is faster in something else, but keep the API and JSON contracts below.

## 2. Repo structure

```
abbu-ka-tutor/
├─ README.md                 (C)  final deliverable
├─ PRD.md  DESIGN.md  SKILL.md  PROMPTS.md  IMPLEMENTATION_PLAN.md
├─ .env.example
├─ shared/
│  └─ lesson.schema.json     (A+B agree in Phase 0, then freeze)
├─ client/                   (A)
│  ├─ public/lessons/bijli/step1.png ...
│  ├─ public/audio/          pre-recorded voice files
│  └─ src/
│     ├─ styles/tokens.css   colours, sizes from DESIGN.md
│     ├─ components/         LanguageToggle StepCard TapHotspot KindMessage
│     │                      ScamCard ConfidenceMeter VoiceButton HotspotEditor
│     ├─ pages/              Home Lesson Complete ScamDojo Explain Builder Family
│     ├─ lib/api.js  lib/i18n.js
│     └─ data/               (fallback copies if needed)
├─ server/                   (B)
│  ├─ index.js
│  ├─ routes/                lessons.js explain.js tts.js scams.js progress.js
│  ├─ lib/openai.js  lib/prompts.js  lib/fallback.js
│  ├─ data/lessons/bijli-bill-01.json
│  ├─ data/scams.json
│  ├─ data/progress.json
│  └─ cache/                 tts cache (gitignored)
├─ content/                  (C)
│  ├─ scams.roman-urdu.md    source text before it goes to JSON
│  └─ lesson-drafts/
└─ scripts/
   └─ pregenerate-audio.js   (B) creates mp3 for every fixed lesson step
```

**Ownership rule:** each person edits only their folders. Shared files (`shared/`, `README.md`) are changed by agreement. This avoids merge conflicts.

## 3. Contracts (freeze in Phase 0)

### 3.1 Lesson JSON (`shared/lesson.schema.json`)
Same as `PRD.md` section 8. Fields per step: `id`, `image`, `target {x,y,w,h in %}`, `explain {urdu, roman, voice}`, `question {urdu, roman}`, `wrong_tap {urdu, roman}`, `hint_levels[3]`.

### 3.2 Scam card JSON (`server/data/scams.json`)
```
{ "id": "sc-01", "answer": "scam" | "real",
  "message": { "roman": "", "urdu": "" },
  "red_flags": [ { "phrase": { "roman": "", "urdu": "" }, "why": { "roman": "", "urdu": "" } } ],
  "remember": { "roman": "", "urdu": "" } }
```

### 3.3 API
| Method and path | Request | Response |
|---|---|---|
| `GET /api/lessons` | none | list of `{id, title}` |
| `GET /api/lessons/:id` | none | lesson JSON |
| `POST /api/lessons/generate` | `{ task, images[] (base64), level }` | lesson JSON (steps may have approximate targets) |
| `POST /api/explain` | `{ stage: "start", image, lang }` or `{ stage: "check", image, lang, answer, context }` | start: `{ summary, risk, question }`. check: `{ feedback, good_choice }` |
| `POST /api/tts` | `{ text, lang: "ur" }` | `audio/mpeg` (cached by hash of text) |
| `GET /api/scams` | none | array of scam cards |
| `POST /api/progress` | `{ familyCode, lessonId, stepId, attempts, hintsUsed, correct }` | `{ ok: true }` |
| `POST /api/confidence` | `{ familyCode, lessonId, phase: "before"|"after", value: 1-5 }` | `{ ok: true }` |
| `GET /api/progress/:familyCode` | none | `{ hesitations[], mistakesByAttempt[], confidence {before, after} }` |

### 3.4 Environment (`.env.example`)
```
OPENAI_API_KEY=
MODEL_TEXT=            # text/vision-capable model name, set at build time
TTS_MODEL=             # speech model name
TTS_VOICE=
USE_FALLBACK=false
PORT=3001
```
Never commit `.env`. Check the current model names in the OpenAI docs before filling these in.

## 4. Phases

### Phase 0: Setup (9:55 to 10:20), all three together
- [ ] Create a **new public GitHub repo**, add both teammates, first commit (README skeleton, empty folders, `.gitignore`, `.env.example`).
- [ ] Register the team on Hackathon Hub (do not wait until 2:00 PM). Keep the team name and member details identical everywhere.
- [ ] Copy `PRD.md`, `DESIGN.md`, `SKILL.md`, `PROMPTS.md` and this plan into the repo and commit.
- [ ] Agree and freeze the lesson JSON and API contracts above.
- [ ] Confirm the hero task (electricity bill) and the fictional app name (Roshni Bijli).
- [ ] B tests an OpenAI text call, a vision call and an Urdu TTS call. **If Urdu voice is poor, decide now:** pre-record the fixed lessons and use live TTS only as a bonus.
- [ ] A and B start `npm create vite` and the Express skeleton in parallel.

**Done when:** repo is public, team registered, contracts frozen, both apps start with "hello".

### Phase 1: Core build (10:20 to 12:30), parallel
| Person | Tasks (in priority order) |
|---|---|
| **A** | 1) `tokens.css` and base layout (phone frame, fonts). 2) `LanguageToggle`, `StepCard`, `TapHotspot`. 3) Lesson Player loop: show, ask, tap, respond. 4) `KindMessage` with Undo. 5) Hint fading (attempt 1 none, 2 hint, 3 highlight). 6) `VoiceButton` playing audio files. |
| **B** | 1) Express routes with fallback loading. 2) `GET /api/lessons`, `/api/scams`. 3) `/api/tts` with caching and the pre-recorded fallback. 4) `POST /api/lessons/generate` using the lesson generator prompt. 5) `/api/progress` and `/api/confidence` writing to JSON. |
| **C** | 1) Build the 7 mock screens of Roshni Bijli (see the prompts file) and export PNGs. 2) Hand-write `bijli-bill-01.json` (all Urdu, Roman Urdu and voice text). 3) Write 12 scam cards. 4) Native-speaker review of the Urdu. |

**Commit checkpoints:** 10:45 (scaffolds), 11:30, 12:15.
**Checkpoint at 12:30:** the parent can complete the whole hero lesson using hand-written data. **If this works, you have a submittable product.**

### Phase 2: Integration and break (12:30 to 1:30)
- [ ] Short Zuhr and lunch break (30 minutes).
- [ ] A connects the player to the real `/api/lessons/:id` and `/api/tts`. B runs `pregenerate-audio.js` for the hero lesson.
- [ ] Add the OTP trap step to the hero lesson.
- [ ] Everyone clicks through the whole lesson once and files issues in a shared list.

### Phase 3: Second layer (1:30 to 3:00)
| Person | Tasks |
|---|---|
| **A** | Scam Dojo page (`ScamCard`, red-flag reveal, score). Lesson Builder page with `HotspotEditor`. Family View page. Confidence Meter. |
| **B** | `/api/explain` (start and check stages). Wire Builder to `/api/lessons/generate`. `GET /api/progress/:familyCode` aggregation. Error handling and timeouts that fall back to saved data. |
| **C** | Pitch deck draft. README draft (limitations and mocked-features list). Demo video script and shot list. Seed Family View demo data (labelled simulated). |

**Commit checkpoints:** 1:45, 2:15, 2:45.
**Registration deadline 2:00 PM:** confirm the team is fully registered.

### Phase 4: Feature freeze (3:00)
No new features after this. Only bug fixes and polish. Tag a commit (`git tag demo-candidate`).

### Phase 5: Demo assets (3:00 to 3:45)
- [ ] Run the demo checklist (section 7).
- [ ] Rehearse once, then record the **2-minute** video (script in `PRD.md` section 17). Say what is real and what is simulated.
- [ ] Take the 5 screenshots: Home, Lesson with a kind wrong-tap message, Scam Dojo red-flag reveal, Yeh Kya Hai?, Family View.
- [ ] Finish the pitch deck (problem, solution, impact).
- [ ] Upload the video somewhere accessible (unlisted link) and test it in a private window.

### Phase 6: Submit (3:45 to 4:15)
- [ ] Finish the README (all required sections, AI tools and their roles, third-party credits, limitations, **final commit ID**).
- [ ] Make a final commit, copy the hash into the README, and commit that. State in the README which commit is the submitted one.
- [ ] Open the repo and video links in a **private window**.
- [ ] Submit on Hackathon Hub. Two people should know how to do it.
- [ ] 4:15 to 5:00: buffer only. **Stop coding at 5:00 PM.**

## 5. Fallback and "if X breaks" table

| If this breaks | Do this |
|---|---|
| OpenAI quota or network fails | Set `USE_FALLBACK=true`. Saved lessons, scam cards and audio keep the demo alive |
| Urdu TTS sounds bad | Use pre-recorded audio for fixed lessons. Browser speech (`ur-PK`) as a last resort |
| Lesson generation gives bad hotspots | Child fixes them in `HotspotEditor`. Demo the hero lesson from saved data |
| Nastaliq font clips or renders wrong | Increase line height. Fall back to Noto Naskh Arabic |
| Yeh Kya Hai? is unreliable | Cut it (P1). Show 2 saved example screens, labelled as saved examples |
| Merge conflict near the deadline | Folder ownership prevents most. If it happens, the owner of that folder resolves it |
| Video over 2 minutes | Cut the Family View segment first, then shorten the Builder segment |

## 6. Cut order
1. Voice answers from the parent (P2)
2. Extras in Family View (keep only the confidence change)
3. Yeh Kya Hai? (P1)
4. Never cut: Lesson Builder or saved lesson, Player, Galti Ghar, Scam Dojo

## 7. Demo checklist (run at 3:00 and again at 4:00)
- [ ] App starts from a clean clone with the README steps
- [ ] Hero lesson completes end to end, in all three language modes
- [ ] A wrong tap shows the kind message, undo works, hints fade
- [ ] OTP trap step works
- [ ] Scam Dojo shows 12 cards, red flags and score
- [ ] Builder creates a lesson (or falls back cleanly)
- [ ] Family View shows data, simulated parts labelled
- [ ] "Practice" ribbon shows on all mock screens
- [ ] No real brand names, keys or personal data in the repo
- [ ] `.env` is not committed, `.env.example` is

## 8. Git workflow
- One `main` branch. Small commits, pushed at least hourly, with messages like `feat(client): lesson player with hint fading`.
- Pull before you push. Do not force-push or rewrite history (history is tracked).
- Commit assets (PNGs, audio) as you create them, not in one batch at the end.

## 9. Live judging prep
- Judging is also live, so be reachable at your assigned time and ready to run the submitted version.
- Each member should be able to explain: how lessons are generated and stored, how hint fading works, how fallbacks work, and what is simulated.
- Practise answering: "What if the AI gets it wrong?" (child reviews and edits; fixed lessons are hand-written), "How do you know it builds confidence?" (the Confidence Meter and hesitation tracking), "What is real versus mocked?" (PRD section 11).
