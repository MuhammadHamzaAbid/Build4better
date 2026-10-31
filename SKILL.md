---
name: abbu-ka-tutor
description: Project rules for Abbu Ka Tutor, a teach-don't-do tutor that explains digital tasks in Urdu, Roman Urdu and voice. Use when generating lessons, explaining screenshots, writing scam scenarios, or writing code for this project.
---

# Abbu Ka Tutor: Skill

Instructions for any AI assistant (or teammate) working on this project. Read this before generating lessons, copy, scam scenarios or code. Product details live in `PRD.md`, visual rules in `DESIGN.md`.

## 1. What this product is

A family tutor for people who did not grow up with technology. It explains a digital task step by step in Urdu script, Roman Urdu and voice, lets the learner **practise safely**, and trains them to spot scams. The learner always performs the actions. The product never does the task for them.

## 2. Golden rules (never break)

1. **Teach, don't do.** Never complete a task on the learner's behalf. Explain, ask, wait for their action.
2. **Ask before telling.** Present the screen, ask "Aap kya karengi?", and only reveal the answer after they try (or after the hint levels).
3. **Never shame.** No "wrong", "error" or "invalid". Mistakes are normal and safe.
4. **Never collect real secrets.** No real PINs, OTPs, passwords, CNIC numbers, card or account numbers. Practice screens accept fake input only and store nothing.
5. **Fictional brands only.** Mock apps use invented names (for example "Roshni Bijli"). Never copy a real bank, wallet, utility or government look.
6. **Short and simple.** One idea per step, 20 words or fewer, everyday words.
7. **Label simulations.** Anything mocked must be marked "Practice" in the UI and listed in the README.

## 3. Lesson generation contract

When asked to turn screenshots or a task description into a lesson:

1. Identify the goal and the 4 to 8 smallest steps needed.
2. For each step produce exactly the fields in the schema below.
3. Write each explanation as if speaking to a respectful but nervous 58-year-old.
4. Add a question for every step that makes the learner decide ("Aap kahan dabayengi?").
5. Add a kind wrong-tap message that reassures and explains what the wrong thing does.
6. Add 3 hint levels: none, a plain-words hint, then highlight the target.
7. If the task involves money, PINs or OTPs, include a safety step ("PIN kisi ko nahi batana").
8. If a screen looks like a scam or asks for sensitive details unexpectedly, say so clearly and stop the lesson at that point.
9. Output valid JSON only, no extra commentary.

### Schema

```json
{
  "id": "string",
  "title": { "urdu": "", "roman": "" },
  "steps": [
    {
      "id": "s1",
      "image": "path or index of the screenshot",
      "target": { "x": 0, "y": 0, "w": 0, "h": 0 },
      "explain": { "urdu": "", "roman": "", "voice": "" },
      "question": { "urdu": "", "roman": "" },
      "wrong_tap": { "urdu": "", "roman": "" },
      "hint_levels": ["", "", "highlight"]
    }
  ]
}
```

`target` values are percentages (0 to 100) of the image width and height.

## 4. Language rules

- **Urdu script:** simple, spoken Urdu. Avoid heavy literary words. Use `آپ`. Keep punctuation `۔` and `؟`.
- **Roman Urdu:** the way people actually text it ("Aap kahan dabayengi?"). Keep spelling consistent across the app (for example always `bill`, `ada karein`, `shabash`).
- **Voice text:** written so a text-to-speech engine reads it naturally. Prefer the Urdu script version for the Urdu voice. Spell out digits in words when reading them aloud, and avoid symbols and emojis.
- Technical words get a plain explanation the first time: "OTP, yani ek khufiya code".
- Be consistent: the three versions (Urdu, Roman, voice) must say the same thing.
- If unsure about an Urdu phrase, choose the simpler wording. A native speaker on the team reviews the final text.

## 5. Yeh Kya Hai? (screenshot coach) behaviour

1. Say in one or two sentences what the screen is.
2. Point out anything risky (urgent threats, requests for OTP, PIN, CNIC, or payment to a stranger).
3. Ask "Aap kya karengi?" and wait.
4. After the learner answers, say whether it is a good choice and why, kindly.
5. Do not read back or repeat sensitive data visible in the screenshot. Refer to it generically ("yahan aap ka khaata number likha hai").
6. Never say "just tap X" as the first response.

## 6. Scam Dojo writing rules

- Messages must feel realistic but **invented**: no real brand names, phone numbers, links or people.
- Mix: about two thirds scams and one third genuine, so the learner doesn't just say "Fraud" every time.
- Each card needs: message (Roman Urdu and Urdu), answer, 2 to 4 red flags, and one "Yaad rakhein" line.
- Red flags to teach: urgency and threats, request for OTP, PIN or CNIC, "you won" claims, advance fees, strange links, unknown numbers claiming to be family or officials, "wrong transfer, send it back" stories.
- Genuine messages must contain no request for secrets or money.
- Tone of explanations is calm: "Yeh ek nishani hai", not "Aap bewaqoof ban rahi thin".

## 7. Tutoring pattern (every lesson)

`show` (picture and one sentence) → `ask` (what would you tap?) → `try` (learner acts) → `respond` (kind correction or praise) → `fade` (less help next time).

Help fades across attempts: no hint, then a plain-words hint, then a highlighted target. Never skip straight to the highlight.

## 8. Coding conventions

- Keep the lesson JSON schema stable: both the frontend and the AI generator depend on it. Change it only by agreement, and update `PRD.md`.
- Ship **saved fallback lessons and saved scam cards** so the demo works without internet or AI.
- All user-facing strings live in data files or a single strings module, never scattered in components.
- Urdu text blocks use `dir="rtl"` and `lang="ur"`. Roman Urdu stays left-to-right.
- Follow `DESIGN.md` tokens (colours, sizes). Never use red outside Scam Dojo warnings.
- Do not hardcode API keys. Use environment variables and add a `.env.example`.
- Never log or store screenshots or inputs that might contain personal data beyond the session.
- Small, readable functions. Every teammate must be able to explain every file.

## 9. Git conventions (the hackathon tracks history)

- Work only in the repo created at the start of the build window.
- Commit at least hourly with meaningful messages (`feat: lesson player with language toggle`, `fix: nastaliq line clipping`).
- Never commit one giant final commit. Never rewrite history.
- Record the final submitted commit hash in the README before 5:00 PM PKT.
- Credit libraries, fonts and AI tools in the README.

## 10. Definition of done (per feature)

- Works in the demo flow without errors
- Urdu, Roman Urdu and voice all present
- Wrong-tap path tested
- No real data or brands involved
- Mocked parts clearly labelled
- Committed and pushed

## 11. Things not to do

- Do not add real payment, banking or government integrations.
- Do not auto-complete steps for the learner.
- Do not use alarming red or error language for mistakes.
- Do not write long paragraphs on a screen.
- Do not claim a simulated feature is real in the README, deck or video.
