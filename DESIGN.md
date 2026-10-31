# DESIGN: Abbu Ka Tutor

Design for a 58-year-old who is afraid of pressing the wrong thing. Every decision should make the product calmer, bigger and kinder.

## 1. Design principles

1. **One thing per screen.** One question, one main action.
2. **Big and readable.** If it needs squinting, it is wrong.
3. **Never punish.** No red for mistakes, no buzzers, no "Wrong!".
4. **Their language first.** Urdu script, Roman Urdu and voice are always one tap away.
5. **Familiar over clever.** WhatsApp-like patterns and everyday words beat novelty.
6. **Show, then ask.** Picture, short sentence, then the question.

## 2. Layout

- **Mobile-first**, single column. Design for a phone viewport of about 390 px wide. On desktop, show the app inside a centred phone frame (max width 420 px) so the demo looks right on a screen recording.
- Side padding 20 px. Generous vertical spacing (24 px between blocks).
- Primary action fixed at the bottom of the screen, within thumb reach.
- Maximum one primary button per screen.

## 3. Typography

| Use | Font | Size |
|---|---|---|
| Urdu text | Noto Nastaliq Urdu (fallback: Noto Naskh Arabic) | 24 px body, line height 2.0 |
| Roman Urdu and English | Nunito or Inter | 20 px body, line height 1.5 |
| Headings | Same family, bold | 28 px |
| Buttons | Same family, semibold | 20 px |

- Nastaliq needs generous line height or it gets clipped. Test early.
- Never go below 18 px anywhere.
- Set `dir="rtl"` and `lang="ur"` on Urdu blocks only. Keep Roman Urdu left-to-right.

## 4. Colour

Calm, warm and high-contrast.

| Token | Hex | Use |
|---|---|---|
| `--bg` | `#FAF7F2` | App background (warm off-white) |
| `--surface` | `#FFFFFF` | Cards |
| `--text` | `#1F2933` | Main text (contrast above 12:1 on bg) |
| `--primary` | `#0F6E5A` | Main buttons, progress (deep green) |
| `--primary-soft` | `#DFF2EC` | Right-answer background |
| `--gentle` | `#F4A93D` | **Wrong tap**: soft amber, never red |
| `--gentle-soft` | `#FFF1D9` | Kind-message background |
| `--danger` | `#C0392B` | **Only** scam red flags and warnings |
| `--danger-soft` | `#FBE4E1` | Scam highlight background |
| `--muted` | `#5B6770` | Secondary text |

Rules:
- Red appears only inside Scam Dojo and warning moments, so it keeps its meaning.
- Mistakes are amber and a warm message.
- Never rely on colour alone. Add an icon or text label.

## 5. Components

**LanguageToggle**
Three large pill buttons, always visible at the top: `اردو` | `Roman` | `🔊 Suno`. The selected one is filled. The choice persists across screens.

**StepCard**
Large screenshot or mock screen on top, then one sentence (max about 20 words), then the question. Step counter shown as "Qadam 2 / 7" with a thick progress bar.

**TapHotspot**
Invisible tap area over the mock UI, positioned by percentages. On the hint level it gets a soft pulsing outline in `--primary`.

**KindMessage**
A rounded amber-soft card that slides up from the bottom after a wrong tap. A friendly icon, one sentence of reassurance, one sentence explaining what the tapped thing does, and two buttons: **Wapas jayein** (Undo) and **Dobara koshish** (Try again).

**SuccessBurst**
A short, gentle green tick and one line of praise ("Shabash!"). Under 1 second, no confetti storms, no sound unless voice is on.

**ScamCard**
The message in a WhatsApp-style bubble. Two equal large buttons: **Asli** (Real) and **Fraud**. After answering, red-flag phrases are highlighted in `--danger-soft` with small numbered tags, and an explanation list appears below.

**ConfidenceMeter**
Five large faces or dots, "Kitna yaqeen hai?" Shown before and after a lesson.

**FamilyView**
A simple summary card: steps with hesitation marked, a mistakes-over-attempts mini chart, and the confidence change as "2 se 4".

**VoiceButton**
Large speaker button on every step. Shows a clear playing state with a visible "Ruk jayein" (Stop) control.

## 6. Screens

1. **Home (Parent):** three big tiles: *Seekhein* (Lessons), *Fraud se Bachein* (Scam Dojo), *Yeh Kya Hai?* (Screenshot coach).
2. **Lesson Player:** language toggle, step card, question, and (after a tap) the kind or success message.
3. **Lesson Complete:** praise, confidence rating, "Dobara karein" (Again).
4. **Scam Dojo:** card, answer buttons, red-flag reveal, score at the end.
5. **Yeh Kya Hai?:** upload button, explanation card, "Aap kya karengi?" question, reveal.
6. **Lesson Builder (Child):** upload area plus a text box, generated steps list with editable text, a **Share** button.
7. **Family View (Child):** the summary cards above.

Sketch of the Lesson Player:

```
┌───────────────────────────┐
│  [ اردو ] [ Roman ] [ 🔊 ] │
│  Qadam 2 / 7  ▓▓░░░░░     │
│ ┌───────────────────────┐ │
│ │   (mock app screen)   │ │
│ │      [tap target]     │ │
│ └───────────────────────┘ │
│  Yahan bill ki amount     │
│  likhi hoti hai.          │
│  Aap kahan dabayengi?     │
│                           │
│  (kind message slides up  │
│   here after a wrong tap) │
└───────────────────────────┘
```

## 7. Voice and copy

Tone: a patient, respectful family member. Use "aap". Short sentences. No technical words without a plain explanation.

| Moment | Roman Urdu | Urdu |
|---|---|---|
| Wrong tap | Koi baat nahi, yeh sab se hota hai. | کوئی بات نہیں، یہ سب سے ہو جاتا ہے۔ |
| Right tap | Shabash! Bilkul theek. | شاباش! بالکل ٹھیک۔ |
| Ask | Aap kahan dabayengi? | آپ کہاں دبائیں گی؟ |
| Undo | Wapas chalte hain. | واپس چلتے ہیں۔ |
| Scam warning | Ruk jayein. Yeh fraud ho sakta hai. | رک جائیں۔ یہ فراڈ ہو سکتا ہے۔ |
| OTP rule | OTP kisi ko nahi batana. | او ٹی پی کسی کو نہیں بتانا۔ |

Avoid: "Error", "Invalid", "Wrong", "Failed", and anything that sounds like blame.
Address both genders: use neutral wording or let the lesson set "Ammi" or "Abbu".

## 8. Mock screens

- Use a **fictional brand**: "Roshni Bijli". Do not copy the logos, colours or layout of any real utility, bank or wallet.
- Add a small, always-visible "Practice" ribbon on mock screens so nobody confuses them with a real app.
- Use fake data only (sample name, fake reference number, fake amount).

## 9. Accessibility

- Tap targets at least 56 px high and 8 px apart.
- Contrast at least 4.5:1 for text (the palette above exceeds this).
- Everything spoken is also visible as text.
- Text can scale up. Use relative units.
- No time limits, no auto-advancing steps, no flashing animations.
- Respect reduced-motion preferences.

## 10. Motion

Slow and soft: 200 to 300 ms ease-out. Slide-up for messages, gentle fade for step changes. Nothing bounces or shakes. A wrong tap never shakes the screen.

## 11. Demo polish checklist

- [ ] Urdu renders correctly right-to-left with no clipped Nastaliq
- [ ] Language toggle works on every screen
- [ ] The wrong-tap moment looks gentle on camera
- [ ] Phone frame looks clean in the screen recording
- [ ] Practice ribbon visible on all mock screens
- [ ] No real brand names anywhere
