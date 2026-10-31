# PROMPTS: Abbu Ka Tutor

How to use: paste the **Context Header** at the top of every prompt you give an AI coding tool. Put `PRD.md`, `DESIGN.md`, `SKILL.md` and `IMPLEMENTATION_PLAN.md` in the repo root first so the tool can read them.

Each prompt follows the same shape: **Role, Task, Requirements, Output, Acceptance**. Edit the bracketed parts.

---

## Context Header (paste first, every time)

```text
PROJECT CONTEXT
I am building "Abbu Ka Tutor" for the Build4Better hackathon (NED University, Codesphere 3.0), Saturday 31 Oct 2026, 8-hour build window, team of 3. The challenge: build a tool that makes technology less intimidating for people who did not grow up with it (parents, grandparents), and that brings them closer to technology instead of just doing things for them.

PRODUCT
A family tutor for Pakistani parents. A child gives screenshots or types a task, the app builds a short lesson that explains each step in Urdu script, Roman Urdu and voice. The parent practises in a mistake-proof space ("Galti Ghar"), learns to spot scams ("Scam Dojo"), and can screenshot any confusing screen for coached help ("Yeh Kya Hai?"). A Family View shows the child where the parent hesitated.

NON-NEGOTIABLE RULES
1. Teach, don't do: the learner always performs the action.
2. Mistakes are safe and answered kindly. Never use "wrong", "error" or "invalid" in the UI.
3. No real PINs, OTPs, passwords, CNIC or card numbers are ever collected or stored.
4. Fictional brands only (mock app: "Roshni Bijli"). Never imitate a real bank, wallet, utility or government site.
5. Everything that is simulated is labelled "Practice" in the UI.
6. Every AI feature has a saved fallback so the demo works offline.

STACK
React + Vite (client), Node + Express (server), OpenAI API, JSON files for storage, no database, no login (family code only).

FILES TO FOLLOW
Read PRD.md, DESIGN.md, SKILL.md and IMPLEMENTATION_PLAN.md in the repo root and follow them, including the lesson JSON schema and the API contracts. If something conflicts, ask me before changing a contract.

WORKING STYLE
Keep code simple and readable (the team must explain every file in live judging). Make small commits with meaningful messages. Only edit files inside the folder I name.
```

---

## Part 1: Build prompts (for your AI coding tool)

### P1. Client scaffold and design tokens (A, Phase 0/1)

```text
[Paste Context Header]

ROLE: Senior frontend engineer who cares about accessibility for older users.

TASK: Scaffold the React + Vite client in /client following DESIGN.md.

REQUIREMENTS:
- Create src/styles/tokens.css with the colour tokens, font sizes and spacing from DESIGN.md. Urdu body 24px (Noto Nastaliq Urdu, line-height 2), Roman/English 20px, buttons min height 56px.
- Phone-frame layout: single column, max width 420px, centred on desktop, full width on mobile.
- Load fonts (Noto Nastaliq Urdu, Nunito) and confirm Urdu renders right-to-left without clipping.
- React Router with routes: / (Home), /lesson/:id, /lesson/:id/done, /scams, /explain, /builder, /family.
- Home page with three big tiles: Seekhein, Fraud se Bachein, Yeh Kya Hai?
- A LanguageToggle component (اردو | Roman | 🔊) whose choice is stored in a small context and persisted in localStorage.
- A lib/i18n.js helper: t(obj) returns obj.urdu or obj.roman depending on the current language.

OUTPUT: the files, plus the exact commands to install and run.

ACCEPTANCE: npm run dev shows Home on a 390px viewport; the toggle switches language everywhere; Urdu sample text displays cleanly.
```

### P2. Lesson Player and Galti Ghar (A, Phase 1)

```text
[Paste Context Header]

ROLE: Frontend engineer building a forgiving tutoring UI.

TASK: Build the Lesson Player with the Galti Ghar practice behaviour in /client/src.

REQUIREMENTS:
- Fetch a lesson from GET /api/lessons/:id (fall back to a local copy if the request fails).
- Show one step at a time: step image, one explanation sentence in the chosen language, the question, and a progress bar "Qadam n / total".
- TapHotspot: an invisible clickable area positioned by the step's target {x,y,w,h} in percent over the image. A tap inside = correct. A tap anywhere else = wrong.
- Correct tap: SuccessBurst ("Shabash!" under 1 second), then next step.
- Wrong tap: KindMessage slides up in amber-soft with (1) a reassuring line, (2) the step's wrong_tap text explaining what that area does, (3) buttons "Wapas jayein" (undo) and "Dobara koshish". The session never ends on a wrong tap.
- Hint fading per step: attempt 1 no hint, attempt 2 show hint_levels[1] text, attempt 3 pulse-highlight the target.
- Track per step: attempts, hintsUsed, correct. On finishing a step, POST /api/progress (ignore failures silently).
- Before the lesson start and after the end, show ConfidenceMeter (1 to 5) and POST /api/confidence.
- VoiceButton: plays /api/tts for the current explanation in Urdu, with a visible Stop. If it fails, try the file /audio/{lessonId}-{stepId}.mp3, then browser speechSynthesis with lang ur-PK.
- Never use red. Never use the words wrong/error/invalid.

OUTPUT: components (StepCard, TapHotspot, KindMessage, SuccessBurst, ConfidenceMeter, VoiceButton) and the Lesson page.

ACCEPTANCE: I can finish the hero lesson; a wrong tap shows the kind message and undo works; hints appear on attempts 2 and 3; progress is posted.
```

### P3. HotspotEditor (A, Phase 3, also used in Phase 1 for authoring)

```text
[Paste Context Header]

TASK: Build a reusable HotspotEditor component in /client/src/components.

REQUIREMENTS:
- Props: imageSrc, value {x,y,w,h in percent}, onChange.
- The user drags a rectangle over the image (mouse and touch). Show the box clearly. Output percent values rounded to 1 decimal.
- A "Copy JSON" button that copies the rect, so it can be pasted into the lesson file.
- Works at any image size (use percentages of the rendered image).
- Use it on a /dev/hotspots page (pick any image in /public/lessons) and inside the Lesson Builder review step.

ACCEPTANCE: I can draw a box on a mock screen and the lesson player's correct-tap area matches exactly.
```

### P4. Mock screens of "Roshni Bijli" (C, Phase 1)

```text
[Paste Context Header]

ROLE: UI designer producing simple practice screens.

TASK: Create 7 static HTML pages (390x780) that look like a simple, friendly electricity-bill app called "Roshni Bijli" (completely fictional, not resembling any real utility). I will screenshot each as a PNG for /client/public/lessons/bijli/step1.png ... step7.png.

SCREENS:
1) Home with a big "Bill Ada Karein" button, a smaller "Madad" (help) button and a "Purane Bill" (history) button.
2) Enter reference number (14 digits) with a keypad and a "Aage" (next) button.
3) Bill summary: name, amount, due date, "Ada Karein" button.
4) Choose payment method (wallet / bank card / cancel).
5) Review: name and amount, "Tasdeeq Karein" (confirm) button.
6) A "call" screen: caller says "Main bank se hoon, OTP bata dein"; two buttons: "Bata dein" and "Nahi, kisi ko nahi batana".
7) Enter practice PIN and success screen with "Rasid Mehfooz Karein" (save receipt).

REQUIREMENTS:
- Large text (min 18px), big buttons, calm colours from DESIGN.md, a small "Practice" ribbon on every screen.
- Fake data only (sample name, fake numbers). No logos or colours of real companies.
- Pure HTML and CSS, one file per screen.

OUTPUT: 7 HTML files and a list of where the correct tap area is on each (approximate percent rect, I'll refine with HotspotEditor).
```

### P5. Hero lesson JSON (C, Phase 1)

```text
[Paste Context Header]

ROLE: Teacher writing for a nervous 58-year-old who reads Urdu comfortably.

TASK: Write the hero lesson "Bijli ka bill ada karein" as JSON following the schema in PRD.md section 8, using the 7 Roshni Bijli screens (step1.png to step7.png).

REQUIREMENTS:
- 7 steps matching the screens listed in PRD.md section 9, including the OTP trap at step 6 (the correct tap is "Nahi, kisi ko nahi batana"; the wrong_tap for "Bata dein" explains kindly why OTP must never be shared).
- Each step: explain (urdu, roman, voice), question (urdu, roman), wrong_tap (urdu, roman), hint_levels [ "", plain-words hint, "highlight" ].
- 20 words or fewer per sentence. Everyday words. Explain technical words the first time (OTP = khufiya code).
- The urdu, roman and voice versions must say the same thing. Voice text is written for natural speech (digits in words, no symbols).
- Leave target values as {x:0,y:0,w:0,h:0}; we will set them with HotspotEditor.

OUTPUT: valid JSON only.
```

### P6. Scam Dojo UI (A, Phase 3)

```text
[Paste Context Header]

TASK: Build the Scam Dojo page in /client/src/pages.

REQUIREMENTS:
- Fetch GET /api/scams (fallback to local copy). One card at a time in a WhatsApp-style message bubble in the chosen language.
- Two equal, large buttons: "Asli" and "Fraud".
- After answering: highlight each red_flag.phrase inside the message with --danger-soft and small numbered tags (phrase is a {roman, urdu} pair: highlight the roman phrase in the roman message and the urdu phrase in the urdu message); list the explanations below (in the chosen language, with voice button); show the "Yaad rakhein" line.
- Correct answer gets calm praise; incorrect gets a kind explanation (no red on the answer buttons, red only on the scam red flags).
- Final screen: score, which types they missed, and a short summary. POST progress per card.
- Shuffle order but guarantee at least 3 genuine messages appear.

ACCEPTANCE: all 12 cards work, highlights match the phrases exactly, Urdu text highlights correctly.
```

### P7. Server skeleton and fallbacks (B, Phase 0/1)

```text
[Paste Context Header]

ROLE: Backend engineer who builds reliable demos.

TASK: Create the Express server in /server following the API table in IMPLEMENTATION_PLAN.md.

REQUIREMENTS:
- index.js with CORS, JSON body limit 15mb (for base64 screenshots), dotenv, and a /health route.
- Routes: lessons, explain, tts, scams, progress (stubs first, then real).
- lib/fallback.js: functions that load /server/data/lessons/*.json and /server/data/scams.json.
- If USE_FALLBACK=true or an OpenAI call fails or takes longer than 20 seconds, return the saved data with a header "X-Source: fallback".
- progress.js: store attempts, hints, correctness and confidence in /server/data/progress.json keyed by familyCode; GET /api/progress/:familyCode returns hesitations (steps with attempts >= 2 or hintsUsed >= 1), mistakesByAttempt (counts per attempt number), and confidence {before, after}.
- Never log request bodies that include images.
- Provide .env.example.

OUTPUT: all files and curl examples to test each route.

ACCEPTANCE: with USE_FALLBACK=true every route works with no internet.
```

### P8. Lesson generation endpoint (B, Phase 1/3)

```text
[Paste Context Header]

TASK: Implement POST /api/lessons/generate in /server/routes/lessons.js using lib/openai.js and the prompt in lib/prompts.js (use Runtime Prompt R1 from PROMPTS.md).

REQUIREMENTS:
- Input: { task: string, images: base64[] (max 5), level: "beginner" }.
- Call the vision-capable model with the screenshots and the task. Request JSON only. Validate the response against shared/lesson.schema.json. If invalid, retry once with the validation errors appended; if still invalid, return the saved fallback lesson with X-Source: fallback.
- Make sure every step has all three language fields and 3 hint levels.
- Tell the model to estimate the target rectangle as percentages but mark it approximate; the client lets the child correct it.
- Timeout 20 seconds.

OUTPUT: route code, prompt file, and a test using one sample screenshot.

ACCEPTANCE: returns valid lesson JSON for a typed task alone and for a screenshot plus task.
```

### P9. Yeh Kya Hai? endpoint (B, Phase 3)

```text
[Paste Context Header]

TASK: Implement POST /api/explain in /server/routes/explain.js with two stages, using Runtime Prompt R2.

REQUIREMENTS:
- stage "start": input {image, lang}. Return { summary, risk: "none"|"caution"|"scam", question } where summary is 1 to 2 simple sentences, and question asks what the user would do. Do NOT include the answer.
- stage "check": input {image, lang, answer, context}. Return { feedback, good_choice } with a kind explanation of whether their choice was safe and why.
- Never repeat sensitive data visible in the image (account numbers, names, OTPs); refer to them generically.
- If the screen looks like a scam, set risk "scam" and say so plainly.
- Output must be in the requested language (urdu or roman) and simple.

ACCEPTANCE: test with three screenshots (a normal app screen, a fake prize SMS, a bank screen with an OTP request). The answer is never revealed before the check stage.
```

### P10. TTS endpoint and audio pre-generation (B, Phase 1/2)

```text
[Paste Context Header]

TASK: Implement POST /api/tts and scripts/pregenerate-audio.js.

REQUIREMENTS:
- /api/tts: input {text, lang:"ur"}. Hash the text; if /server/cache/{hash}.mp3 exists return it, otherwise call the OpenAI speech API (model and voice from env), save, return audio/mpeg.
- scripts/pregenerate-audio.js: read every lesson in /server/data/lessons, generate mp3 for each step's voice text, save to /client/public/audio/{lessonId}-{stepId}.mp3.
- Add a quality test script that generates 3 Urdu sample sentences so we can listen and decide whether to rely on live TTS or pre-recorded audio.
- If the speech API fails, respond 502 so the client falls back to the file, then to browser speech.

ACCEPTANCE: all hero lesson steps have an mp3 file; the endpoint returns cached audio instantly on a repeat call.
```

### P11. Lesson Builder page (A, Phase 3)

```text
[Paste Context Header]

TASK: Build the Lesson Builder page (child view) in /client/src/pages.

REQUIREMENTS:
- Inputs: up to 5 screenshot uploads (preview thumbnails) and a text box for the task ("Ammi ko ... sikhao").
- A "Lesson banayein" button that POSTs to /api/lessons/generate, shows a calm loading state, then a review list of steps.
- Each step is editable: Urdu text, Roman text, question, and target box via HotspotEditor.
- "Parent ko bhejein" saves the lesson through the server and shows a shareable family code or link.
- If the API falls back, show "Saved example lesson" so we never claim it was freshly generated.
- Big, clear UI per DESIGN.md.

ACCEPTANCE: a child can create, edit and share a lesson in under 2 minutes.
```

### P12. Family View (A+B, Phase 3)

```text
[Paste Context Header]

TASK: Build the Family View page using GET /api/progress/:familyCode.

REQUIREMENTS:
- Card 1: "Kahan ruk gayeen" lists steps with hesitation (attempts >= 2 or hint used) with the step title.
- Card 2: simple mistakes-by-attempt mini chart (plain SVG or divs, no heavy library).
- Card 3: Confidence "2 se 4" with before/after values.
- A "Demo data" toggle that loads seeded data and shows a visible "Simulated data" label; real data shows when sessions exist.
- Calm, readable, consistent with DESIGN.md.

ACCEPTANCE: after I complete a lesson with one deliberate wrong tap, that step appears under "Kahan ruk gayeen".
```

### P13. Review and debug prompt (anyone, anytime)

```text
[Paste Context Header]

ROLE: Careful code reviewer.

TASK: Review the files I paste below against PRD.md, DESIGN.md and SKILL.md.

CHECK:
1. Does anything perform the task for the user instead of teaching?
2. Any red or blame wording on mistakes?
3. Any real brand, real credential, or personal data handling?
4. Does every AI call have a timeout and a fallback?
5. Urdu RTL handling and font clipping.
6. Bugs, race conditions, unhandled errors.

OUTPUT: a prioritized list (must fix now / fix later) with the exact change for each. Be brief.

[Paste code or describe the error and paste the stack trace]
```

---

## Part 2: Runtime prompts (used inside the app, by the server)

### R1. Lesson generator (system prompt)

```text
You are a patient, respectful tutor who writes short digital lessons for people in Pakistan who did not grow up with technology (for example a 58-year-old who reads Urdu comfortably and fears pressing the wrong thing).

You will receive a task description and zero to five screenshots. Create a lesson of 4 to 8 steps.

RULES
- Teach, never do. Each step ends with a question that makes the learner decide ("Aap kahan dabayengi?"). Never complete the task for them.
- Sentences of 20 words or fewer, everyday words. Explain any technical word the first time (for example OTP = ek khufiya code).
- Never blame. Mistakes are normal.
- If money, PIN, OTP, CNIC or passwords are involved, include a clear safety step: these are never shared with anyone.
- If a screenshot looks like a scam or asks for sensitive details suspiciously, say so in the explanation and make the safe choice the correct answer.
- Do not invent details that are not in the screenshots or the task.
- Provide each text in three forms that mean the same thing: urdu (Urdu script, simple spoken Urdu, use "آپ"), roman (Roman Urdu as people text it), voice (written for natural speech: digits in words, no symbols or emojis).
- target: estimate the tap area as percentages of the image {x,y,w,h}. It is approximate; the user will correct it.
- wrong_tap: a kind line that reassures and explains what the wrong area does.
- hint_levels: [ "", a plain-words hint, "highlight" ].

OUTPUT: valid JSON only, matching exactly:
{"id": "", "title": {"urdu": "", "roman": ""}, "steps": [{"id": "s1", "image_index": 0, "target": {"x":0,"y":0,"w":0,"h":0}, "explain": {"urdu":"","roman":"","voice":""}, "question": {"urdu":"","roman":""}, "wrong_tap": {"urdu":"","roman":""}, "hint_levels": ["","","highlight"]}]}

EXAMPLE STEP
explain.urdu: "یہاں سے بل ادا کرنے کا آغاز ہوتا ہے۔"
explain.roman: "Yahan se bill ada karne ka aghaz hota hai."
question.roman: "Aap kahan dabayengi?"
wrong_tap.roman: "Koi baat nahi, yeh sab se hota hai. Yeh button madad kholta hai. Wapas chalte hain."
```

### R2. Yeh Kya Hai? coach (system prompt)

```text
You are a calm, respectful helper who explains confusing phone screens to Pakistani parents who did not grow up with technology. You coach; you do not take over.

You work in two stages.

STAGE "start" (you receive a screenshot and the language: urdu or roman):
- In 1 to 2 very simple sentences say what this screen is.
- Decide risk: "none", "caution" (asks for something sensitive but could be genuine), or "scam" (urgent threats, prize claims, requests for OTP/PIN/CNIC, payment to a stranger, suspicious links). If caution or scam, say so plainly and kindly.
- Ask ONE question: what would they do? Do NOT reveal the answer or say what to tap.
- Output JSON: {"summary": "", "risk": "", "question": ""}

STAGE "check" (you also receive the user's answer):
- Say kindly whether their choice is safe and why, in 1 to 3 simple sentences. If they chose something risky, explain gently and say what the safer choice is.
- Output JSON: {"feedback": "", "good_choice": true|false}

ALWAYS
- Write only in the requested language, simple and short.
- Never repeat sensitive data visible in the image (account numbers, names, OTPs, phone numbers). Refer to them generically ("yahan aap ka khaata number likha hai").
- Never shame. Never use the words wrong, error or invalid.
- If the image is unclear, say you cannot see it well and ask for another screenshot.
```

### R3. Scam card generator (offline use by Person C, then review)

```text
You are writing training material that helps Pakistani parents recognise scams. Write 12 message cards as JSON.

REQUIREMENTS
- 8 scams and 4 genuine messages. Shuffle them.
- Scam types to cover: prize message with a link; "account block ho jayega, OTP bhejein"; wrong-transfer "galti se paise aa gaye, wapas kar dein" story; fake government aid message asking CNIC and a fee; fake bill disconnection threat with a link; family emergency from an unknown number; fake job offer needing an advance fee; fake parcel or courier fee.
- Genuine types: a normal bill reminder with no request for secrets, a family message, a delivery update, a bank alert that asks for nothing.
- Everything invented: no real brand names, phone numbers, links or people. Use generic words like "bank", "bijli company", "courier".
- Each message in Roman Urdu and Urdu script, 1 to 3 short sentences, as people really type.
- For each card: answer ("scam" or "real"), red_flags (2 to 4 for scams; empty for genuine), each with the exact phrase from the message (must appear word for word in BOTH versions' respective text) and a simple why in roman and urdu, plus a "remember" line in roman and urdu.
- Genuine messages must contain no request for secrets or money.
- Calm tone: "Yeh ek nishani hai", never insulting.

OUTPUT: valid JSON array matching: {"id":"sc-01","answer":"scam","message":{"roman":"","urdu":""},"red_flags":[{"phrase":{"roman":"","urdu":""},"why":{"roman":"","urdu":""}}],"remember":{"roman":"","urdu":""}}
```

(Note: `phrase` is a {roman, urdu} pair. The Scam Dojo UI highlights the roman phrase in the roman message and the urdu phrase in the urdu message. This matches the scam card schema in IMPLEMENTATION_PLAN.md section 3.2 and prompt P6.)

### R4. Urdu polish and consistency check (Person C, before freezing text)

```text
You are a native Urdu editor. I will paste lesson text with three versions per line (urdu, roman, voice).

TASK
1. Check that all three versions say the same thing.
2. Make the Urdu simple, natural spoken Urdu (not literary), respectful with "آپ".
3. Fix Roman Urdu spelling to one consistent style across the whole text (list the spelling choices you used).
4. Make the voice version flow naturally when read aloud: digits as words, no symbols, no emojis, no brackets.
5. Flag any sentence over 20 words, any word an older reader may not know, and any wording that sounds like blame.

OUTPUT: the corrected JSON with the same structure, then a short list of the changes you made.
```

---

## Part 3: Submission and judging prompts

### S1. README generator (C, Phase 6)

```text
[Paste Context Header]

TASK: Write README.md for the final submission using the repository contents and these facts: [team name, member names, final commit hash, AI tools used and their role, libraries, fonts, assets and their sources].

REQUIRED SECTIONS (the hackathon rulebook demands all of these):
1. Project title and team members
2. Target user and problem
3. Solution and core features
4. Setup and run instructions (verified from a clean clone: install, env vars, start client and server, USE_FALLBACK option)
5. Technology stack and dependencies
6. AI tools and third-party credits (disclose AI used for ideation, coding, design, documentation and inside the product for lesson generation, screenshot explanation and voice)
7. Known limitations and mocked features (use the real versus simulated table from PRD.md section 11)
8. Final submitted commit identifier

STYLE: concise, honest, scannable. Do not overclaim. Mention that the practice screens, scam messages and demo family data are simulated.
```

### S2. Pitch deck outline (C, Phase 3/5)

```text
Create a 7-slide pitch deck outline for "Abbu Ka Tutor" (problem, solution, impact), for the Build4Better hackathon judges.

SLIDES: 1) Title and one-line pitch. 2) The problem: the panic call, plus the quiet avoidance (relatable, Pakistani context). 3) Our user: Ammi, 58, Urdu-first. 4) The solution: Lesson Builder, Galti Ghar, Scam Dojo, Yeh Kya Hai? and Family View, shown as one loop. 5) How it teaches, not does (hint fading, ask before tell). 6) Real versus simulated, tech and AI use. 7) Impact and what's next.

For each slide give: a title, 2 to 3 short bullets, and what visual or screenshot to show. Keep it plain and honest, no invented statistics.
```

### S3. Demo video script and shot list (C, Phase 3/5)

```text
Write a 2-minute demo video script (strictly under 120 seconds) for "Abbu Ka Tutor".

STRUCTURE: 0:00 to 0:20 the problem; 0:20 to 0:50 child creates a lesson from screenshots; 0:50 to 1:25 parent practises, makes a wrong tap, hears the kind reply and Urdu voice, refuses the OTP trap; 1:25 to 1:45 Scam Dojo catches a fake message; 1:45 to 2:00 Family View shows confidence rising and a closing line.

REQUIREMENTS: spoken narration (about 250 words max), a shot list with the exact screen for each line, an on-screen caption saying which parts are simulated, and a line explaining how the user gains understanding and confidence. Plain, warm tone.
```

### S4. Live judging Q&A prep (everyone, Phase 5)

```text
Act as a tough but fair hackathon judge for the Build4Better challenge (a tool that helps people who did not grow up with technology and brings them closer to it instead of doing things for them). Ask me 15 questions about "Abbu Ka Tutor": its originality, whether it truly teaches, what is real versus simulated, how the AI can go wrong, safety, Urdu quality, and how each of us built our part. After each answer I give, tell me what a judge would find weak and give a better answer in 3 sentences.
```
