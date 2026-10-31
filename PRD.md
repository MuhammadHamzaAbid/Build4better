# PRD: Abbu Ka Tutor

**Event:** Build4Better (NED University, Codesphere 3.0), Sat 31 Oct 2026, build window 9:00 AM to 5:00 PM PKT
**Team:** 3 members (fill in names)
**Status:** Draft v1

---

## 1. Summary

Abbu Ka Tutor is a family tutor for people who did not grow up with technology. A son or daughter gives the app a few screenshots (or just types the task). The app turns them into a short lesson that explains each step in **Urdu script, Roman Urdu and voice**. The parent then practises in a **mistake-proof space** where wrong taps get a kind answer, not an error. The same app trains the parent to spot scams and can coach them on any confusing screen. The goal is a parent who stops needing to call.

**One-line pitch:** *Pehle seekho, phir karo, bina dar ke.* (Learn first, then do it, without fear.)

## 2. Problem

Parents get stuck on things their children find trivial: a banking app that logs them out, a confusing bill, a scam message that looks real. They call their children, or they quietly avoid tools that would help them, afraid of breaking something or looking foolish. The issue is not intelligence. Technology is built for people who already speak its language.

In Pakistan this is sharper because:
- Most apps are English-first, and many parents read Urdu more comfortably than English, or prefer to listen.
- Scams (fake prize messages, "your account will be blocked", OTP requests, fake wrong-transfer calls) target exactly this group.
- Family is the support system, and the support calls are constant.

## 3. Users

**Primary: the Parent ("Ammi / Abbu")**
- 50 to 70 years old, Urdu-first, comfortable with calls and WhatsApp, avoids banking and bill apps.
- Fear: "Agar kuch galat daba diya to?" (What if I press something wrong?)
- Needs: big text, one action per screen, their own language, voice, and no judgement.

**Secondary: the Child ("Beta / Beti")**
- Creates lessons, sees where the parent hesitated, and wants fewer panic calls.

## 4. Product principles

1. **Teach, don't do.** The app never completes the task for the user. The parent always makes the tap, enters the value or gives the verdict.
2. **Mistakes are safe.** Wrong taps are expected and answered kindly, with an undo.
3. **Their language.** Urdu script, Roman Urdu and voice are first-class, switchable in one tap.
4. **One thing per screen.** Short sentences, large text, no clutter.
5. **Aim to be unnecessary.** Help fades as confidence grows (explain, then hint, then no help).

## 5. Goals and non-goals

**Goals**
- A parent can complete one real-feeling everyday task (pay an electricity bill) in a practice space, with confidence.
- A parent can correctly judge fake versus real messages and understand why.
- A child can create a lesson in under 2 minutes.
- A clear 2-minute demo that separates working features from simulations.

**Non-goals**
- No real banking, wallet or government portal integration.
- No real credentials, PINs, OTPs, CNIC numbers or personal data collected.
- No automation that performs actions for the user.
- No production deployment (a deployed link is optional and not needed).

## 6. Features

| ID | Feature | Priority |
|---|---|---|
| F1 | Lesson Builder (child creates a lesson) | P0 |
| F2 | Lesson Player with language toggle and voice | P0 |
| F3 | Galti Ghar (safe practice mode) | P0 |
| F4 | Scam Dojo (judge Real or Scam) | P0 |
| F5 | Yeh Kya Hai? (screenshot coach) | P1 |
| F6 | Family View (hesitation and confidence) | P1 |
| F7 | Voice answers from the parent | P2 |

### F1. Lesson Builder (P0)
The child uploads 1 to 5 screenshots and/or types a task ("Ammi ko bijli ka bill bharna sikhao"). The app generates a lesson in the lesson format (section 8).
- Acceptance: lesson appears within about 20 seconds; the child can review and edit any step's text before sharing.
- Fallback: a pre-generated hero lesson is always available, so the demo never depends on live AI.

### F2. Lesson Player (P0)
Shows one step at a time: a large image, one short sentence, and a question ("Aap kahan tap karengi?").
- Acceptance: language toggle (اردو | Roman | 🔊) switches instantly; voice plays the step in Urdu; step text never exceeds about 20 words.

### F3. Galti Ghar (P0)
The practice layer on top of the player. The parent taps on the mock screen.
- Right tap: praise, then the next step.
- Wrong tap: a kind message ("Koi baat nahi, yeh sab se hota hai"), a plain explanation of what that button does, and an Undo.
- Help fades: first attempt gets no hint, second gets a hint, third highlights the target.
- Acceptance: it is impossible to "break" anything, and no wrong tap ends the session.

### F4. Scam Dojo (P0)
A set of about 12 realistic scam and real messages in Roman Urdu and Urdu. The parent taps **Asli** (Real) or **Fraud** (Scam). The app then shows the red flags highlighted on the message and explains them simply.
- Acceptance: at least 8 scams and 4 genuine messages; every card has red-flag explanations in Urdu, Roman Urdu and voice; a final score and "what to remember" summary.
- Uses a trap moment in the hero lesson: a fake "caller" asks for an OTP and the parent must refuse.

### F5. Yeh Kya Hai? (P1)
The parent uploads any screenshot of a confusing screen. The AI explains what it is in simple Urdu, then asks "Aap kya karengi?" and reveals the answer only after the parent tries.
- Acceptance: explanation in the chosen language; never says "just tap X" before asking; refuses to read out or store sensitive data it sees, and warns if the screen looks like a scam.

### F6. Family View (P1)
Shows the child which steps the parent hesitated on, how mistakes dropped across attempts, and a simple **Confidence Meter** (the parent rates "kitna yaqeen hai?" 1 to 5 before and after).
- Acceptance: demo data is clearly labelled where simulated.

### F7. Voice answers (P2)
The parent says "bill ada karein" instead of tapping. Cut first if time runs short.

## 7. Key flows

**Flow A: Child creates a lesson**
Open Builder, add screenshots or type task, review generated steps, share with parent.

**Flow B: Parent learns**
Open lesson, hear and read Step 1, answer "what would you tap?", get right or kind-wrong response, finish, rate confidence.

**Flow C: Parent trains against scams**
Open Scam Dojo, judge each card, see red flags, get a score and summary.

**Flow D: Parent asks about a confusing screen**
Upload screenshot, receive coached explanation, try an answer, see the result.

**Flow E: Child checks progress**
Open Family View, see hesitation points and the confidence change.

## 8. Lesson data model

```json
{
  "id": "bijli-bill-01",
  "title": { "urdu": "بجلی کا بل ادا کریں", "roman": "Bijli ka bill ada karein" },
  "language_default": "roman",
  "steps": [
    {
      "id": "s1",
      "image": "assets/roshni/step1.png",
      "target": { "x": 12, "y": 68, "w": 76, "h": 12 },
      "explain": {
        "urdu": "یہاں سے بل ادا کرنے کا آغاز ہوتا ہے۔",
        "roman": "Yahan se bill ada karne ka aghaz hota hai.",
        "voice": "Yahan se bill ada karne ka aghaz hota hai."
      },
      "question": { "urdu": "آپ کہاں دبائیں گی؟", "roman": "Aap kahan dabayengi?" },
      "wrong_tap": {
        "urdu": "کوئی بات نہیں۔ یہ بٹن مدد کھولتا ہے۔ واپس چلتے ہیں۔",
        "roman": "Koi baat nahi. Yeh button madad kholta hai. Wapas chalte hain."
      },
      "hint_levels": ["", "Neeche wala bara button", "highlight"]
    }
  ]
}
```

Percent coordinates keep the tap targets working on any screen size.

## 9. Hero lesson: pay an electricity bill

Uses a **fictional** provider and app ("Roshni Bijli"). It does not imitate any real utility.

1. Open the app and tap **Bill Ada Karein**.
2. Find the reference number at the top of the bill and type it in.
3. Check the amount and the due date.
4. Choose how to pay (wallet or bank).
5. Check the name and amount before confirming.
6. **Trap:** a "caller" says "Main bank se hoon, OTP bata dein". The parent must choose **Nahi, kisi ko nahi batana**.
7. Enter a practice PIN yourself (any digits; it is never stored) and finish. Save the receipt.

## 10. Scam Dojo content spec

Scenario types (generic wording, no real brand names or numbers):
- "Aap ka inaam nikla hai" prize message with a link
- "Account block ho jayega, OTP bhejein"
- "Galti se paise aa gaye, wapas kar dein" wrong-transfer call
- Fake government aid message asking for CNIC and a fee
- Fake bill disconnection threat with a link
- Family emergency message from an unknown number ("Abbu, main mushkil mein hoon")
- Fake job offer asking for an advance fee
- Fake parcel or courier fee message
- 4 genuine messages (a real bill reminder, a family message, a delivery update, a bank alert with no request for anything)

Each card holds: message text (Roman Urdu and Urdu), answer, 2 to 4 red flags with explanations, and one "yaad rakhein" (remember) line.

## 11. Real versus simulated (required in README and video)

| Component | Status |
|---|---|
| Lesson generation from screenshots or text | Working (live AI), with a saved fallback |
| Urdu, Roman Urdu text and voice | Working |
| Practice screens (Roshni Bijli app, bill) | **Simulated** (mock UI, fictional brand) |
| Scam messages | **Simulated** (written examples, not real messages) |
| Yeh Kya Hai? | Working on any uploaded screenshot |
| Family View data | **Simulated** demo data unless real sessions are recorded |
| Payments, OTP, PIN | **Simulated**, nothing real is processed or stored |

## 12. AI use and safety

- AI is used for lesson generation, screenshot explanation and voice, plus coding help during the build. Disclose all of it in the README.
- The AI must never perform the task for the user, ask for real credentials, or repeat sensitive data from screenshots.
- Prompts instruct the model to say when a screen looks like a scam.
- All brands in mock screens are fictional.
- The team must be able to explain every part of the code in live judging.

## 13. Success metrics (demo level)

- Parent completes the hero lesson with the help fading across attempts.
- Scam Dojo score improves between the first and second round.
- Confidence Meter moves from low to high in the demo.
- A new lesson is created in under 2 minutes.

## 14. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Urdu voice sounds poor | Test in the first hour; use pre-recorded audio for fixed lessons |
| Live AI or internet fails in the demo | Pre-generated lessons and saved Yeh Kya Hai? examples |
| Too much scope | Cut order below; freeze features at 3:00 PM |
| Judges think the AI does the work | Show the parent doing every action; say it in the video |
| Urdu text rendering or right-to-left bugs | Use one tested Urdu font; test early |
| Repo history looks suspicious | Public repo from minute one; commit at least hourly |

## 15. Cut order if time runs short

1. F7 voice answers
2. Extras in F6 (keep only the confidence change)
3. F5 Yeh Kya Hai?
4. Never cut: F1 to F4

## 16. Submission checklist (Hackathon Hub, by 5:00 PM PKT)

- [ ] Public GitHub repo, new, with regular commits (test in a private window)
- [ ] README: title and members, target user and problem, solution and features, setup and run steps, tech stack, AI tools and third-party credits, known limitations and mocked features, final commit ID
- [ ] Demo video, 2 minutes at most, publicly accessible
- [ ] Pitch deck (problem, solution, impact)
- [ ] Up to 5 screenshots
- [ ] Team registered with consistent name and members everywhere
- [ ] Submitted by 4:15 PM, not 4:59

## 17. Demo video script (2:00)

| Time | Content |
|---|---|
| 0:00 to 0:20 | The problem: a parent calling their son in panic, and avoiding the bill app |
| 0:20 to 0:50 | The child creates the electricity bill lesson from screenshots |
| 0:50 to 1:25 | The parent practises: a wrong tap gets a kind reply, Urdu voice plays, the OTP trap is refused |
| 1:25 to 1:45 | Scam Dojo: the parent catches a fake message and sees the red flags |
| 1:45 to 2:00 | Family View shows confidence rising. Close: "Ab Ammi ko call nahi karni padti." Label what is simulated |
