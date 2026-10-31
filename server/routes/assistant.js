import express from 'express';
import { isAiAvailable, callOpenAI } from '../lib/openai.js';

const router = express.Router();

const STEP_KNOWLEDGE = {
  s1: {
    urdu: {
      stepTitle: 'قدم ۱: بل ادا کرنے کا بٹن',
      intro: 'یہ مین اسکرین ہے۔ یہاں مختلف سہولیات کے بٹن موجود ہیں۔',
      action: 'نیچے موجود بڑا ہرا بٹن جس پر "بل ادا کریں" لکھا ہے، اس پر دھیان دیں۔',
      reassurance: 'تسلی رکھیں: اس مرحلے پر دبانے سے کوئی پیسے نہیں کٹیں گے۔',
      audioText: 'یہ مین اسکرین ہے۔ بل ادا کرنے کے لیے نیچے والا بڑا ہرا بٹن دیکھیں۔ اس سے کوئی پیسے نہیں کٹیں گے، فکر نہ کریں۔',
      faqs: [
        {
          id: 's1_q1',
          q: 'اگر میں غلط جگہ دبا دوں تو کیا ہوگا؟',
          a: 'بالکل فکر نہ کریں! غلط جگہ دبانے سے کچھ خراب نہیں ہوگا۔ آپ ہمیشہ واپس جا سکتی ہیں۔'
        },
        {
          id: 's1_q2',
          q: 'کیا ابھی میرے اکاؤنٹ سے پیسے کٹیں گے؟',
          a: 'نہیں، بالکل نہیں! ابھی تو صرف بل کا عمل شروع ہو رہا ہے۔ پیسے صرف آخری مرحلے پر تصدیق کے بعد ہی کٹتے ہیں۔'
        },
        {
          id: 's1_q3',
          q: 'سب سے پہلے کیا ڈھونڈنا چاہیے؟',
          a: 'ہمیشہ اسکرین پر "بل ادا کریں" یا "Pay Bills" والا بڑا آپشن تلاش کرنا چاہیے۔'
        }
      ]
    },
    roman: {
      stepTitle: 'Qadam 1: Bill ada karne ka button',
      intro: 'Yeh app ki main screen hai jahan mukhtalif khidmaat mojood hain.',
      action: 'Neeche bara hara button jis par "Bill Ada Karein" likha hai, usey dekhein.',
      reassurance: 'Tasalli rakhein: Is qadam par koi raqam nahi kat sakti.',
      audioText: 'Yeh main screen hai. Bill ada karne ke liye neeche wala bara hara button dekhein. Ghabrayein nahi, abhi koi paise nahi katengay.',
      faqs: [
        {
          id: 's1_q1',
          q: 'Agar main ghalat jagah dabba doon to?',
          a: 'Bilkul fikr na karein! Ghalat jagah dabane se koi nuqsan nahi hota. Aap hamesha wapas ja sakti hain.'
        },
        {
          id: 's1_q2',
          q: 'Kya abhi mere paise kat jayengay?',
          a: 'Nahi, bilkul nahi! Abhi sirf shuruat ho rahi hai. Paise sirf aakhri step par aap ki tasdeeq ke baad hi kat-tay hain.'
        },
        {
          id: 's1_q3',
          q: 'Sab se pehle kya dhoondna hota hai?',
          a: 'Hamesha screen par "Bill Payment" ya "Bill Ada Karein" ka numayan button dhoondhein.'
        }
      ]
    }
  },
  s2: {
    urdu: {
      stepTitle: 'قدم ۲: صارف کا حوالہ نمبر (Consumer No)',
      intro: 'یہاں بجلی کمپنی آپ کے بل کی شناخت کے لیے 14 ہندسوں کا حوالہ نمبر مانگ رہی ہے۔',
      action: 'اپنے کاغذ والے بل سے 14 ہندسوں کا نمبر دیکھ کر لکھیں اور نیچے "آگے" پر جائیں۔',
      reassurance: 'تسلی رکھیں: اگر نمبر غلط ہو جائے تو ایپ خود بتا دیتی ہے، پریشانی کی کوئی بات نہیں۔',
      audioText: 'اپنے بل کے اوپر دائیں جانب چودہ ہندسوں کا حوالہ نمبر لکھا ہوتا ہے۔ وہ درج کر کے آگے جائیں۔',
      faqs: [
        {
          id: 's2_q1',
          q: 'حوالہ نمبر (Reference Number) بل پر کہاں ہوتا ہے؟',
          a: 'یہ آپ کے بجلی کے کاغذی بل کے اوپر والے حصے میں 14 ہندسوں کی شکل میں لکھا ہوتا ہے۔'
        },
        {
          id: 's2_q2',
          q: 'اگر میں غلط نمبر لکھ دوں تو؟',
          a: 'اگر نمبر غلط ہوا تو اگلے مرحلے پر آپ کے نام کا بل نہیں آئے گا، اس لیے آپ فوراً درست کر سکتی ہیں۔'
        },
        {
          id: 's2_q3',
          q: 'کتنے ہندسے ہوتے ہیں؟',
          a: 'پاکستان میں بجلی کے بلوں پر عام طور پر چودہ (14) ہندسے ہوتے ہیں۔'
        }
      ]
    },
    roman: {
      stepTitle: 'Qadam 2: Hawala Number (Consumer No)',
      intro: 'Yahan bijli company aap ke bill ki pehchan ke liye 14 hindson ka number mangti hai.',
      action: 'Apne kaghazi bill se 14 digits ka consumer number darj karein phir "Aage" dabayein.',
      reassurance: 'Tasalli rakhein: Agar number ghalat ho jaye to app khud bata deti hai, dobara theek kar sakte hain.',
      audioText: 'Apne bill ke ooper dayen janib chaudah hindson ka hawala number likha hota hai. Woh darj karein.',
      faqs: [
        {
          id: 's2_q1',
          q: 'Reference number bill par kahan hota hai?',
          a: 'Yeh kaghazi bill ke top par "Consumer No" ya "Reference No" ke samne 14 digits hotay hain.'
        },
        {
          id: 's2_q2',
          q: 'Agar main ghalat number likh doon to?',
          a: 'Agar number ghalat hoga to aglay step par aap ka naam show nahi hoga. Aap aram se theek kar sakti hain.'
        },
        {
          id: 's2_q3',
          q: 'Kitnay hindsay hotay hain?',
          a: 'Pakistan mein bijli ke bills (KE, LESCO waghera) par 14 digits hotay hain.'
        }
      ]
    }
  },
  s3: {
    urdu: {
      stepTitle: 'قدم ۳: بل کی رقم اور تاریخ کی تصدیق',
      intro: 'اسکرین پر آپ کے بل کی رقم اور آخری تاریخ آ چکی ہے۔',
      action: 'رقم کو اپنے کاغذی بل سے ملا لیں۔ جب تسلی ہو جائے تو ہرا بٹن دبائیں۔',
      reassurance: 'تسلی رکھیں: اگر رقم مختلف لگے تو آگے نہ بڑھیں، پہلے بل چیک کریں۔',
      audioText: 'بل کی رقم اور آخری تاریخ اچھی طرح دیکھ لیں۔ تسلی کے بعد آگے جائیں۔',
      faqs: [
        {
          id: 's3_q1',
          q: 'اگر رقم بل سے مختلف ہو تو کیا کریں؟',
          a: 'اگر اسکرین پر لکھی رقم آپ کے بل سے مختلف ہو تو فوراً رک جائیں اور آگے نہ بڑھیں۔'
        },
        {
          id: 's3_q2',
          q: 'آخری تاریخ گزرنے کے بعد کیا ہوتا ہے؟',
          a: 'آخری تاریخ کے بعد بل میں کچھ اضافی چارجز (Late Surcharge) شامل ہو جاتے ہیں۔'
        }
      ]
    },
    roman: {
      stepTitle: 'Qadam 3: Bill ki raqam aur tareekh tasdeeq',
      intro: 'Screen par aap ke bill ki raqam aur aakhri tareekh dikhai ja rahi hai.',
      action: 'Raqam ko apne kaghazi bill se mila lein. Tasalli ho jaye to hara button dabayein.',
      reassurance: 'Tasalli rakhein: Agar raqam mukhtalif lage to aage na barhein, pehle re-check karein.',
      audioText: 'Bill ki raqam aur aakhri tareekh achi tarah dekh lein. Tasalli ke baad aage barhein.',
      faqs: [
        {
          id: 's3_q1',
          q: 'Agar raqam bill se mukhtalif ho to?',
          a: 'Agar screen par aane wali raqam aap ke kaghazi bill se match na kare to rukh jayein, aage na barhein.'
        },
        {
          id: 's3_q2',
          q: 'Aakhri tareekh guzarne ke baad kya hota hai?',
          a: 'Due date guzarne ke baad late payment surcharge shamil ho jata hai.'
        }
      ]
    }
  },
  s4: {
    urdu: {
      stepTitle: 'قدم ۴: ادائیگی کا طریقہ منتخب کریں',
      intro: 'یہاں آپ چن سکتے ہیں کہ رقم موبائل والیٹ سے دینی ہے یا بینک اکاؤنٹ سے۔',
      action: 'اپنا پسندیدہ طریقہ دبائیں، مثلاً موبائل والیٹ۔',
      reassurance: 'تسلی رکھیں: دونوں طریقے محفوظ ہیں، بس اکاؤنٹ میں رقم ہونا ضروری ہے۔',
      audioText: 'منتخب کریں کہ بل کس اکاؤنٹ سے ادا کرنا ہے: موبائل والیٹ یا بینک اکاؤنٹ۔',
      faqs: [
        {
          id: 's4_q1',
          q: 'موبائل والیٹ اور بینک میں کیا فرق ہے؟',
          a: 'موبائل والیٹ جیسے ایزی پیسہ یا جاز کیش آپ کے فون سے جڑے ہوتے ہیں جبکہ بینک باقاعدہ اکاؤنٹ ہوتا ہے۔'
        },
        {
          id: 's4_q2',
          q: 'کیا دونوں محفوظ ہیں؟',
          a: 'جی ہاں، دونوں ریاستی بینک سے منظور شدہ اور محفوظ ہیں۔'
        }
      ]
    },
    roman: {
      stepTitle: 'Qadam 4: Adaigi ka tareeqa chunna',
      intro: 'Yahan aap chun sakte hain ke raqam wallet se deni hai ya bank account se.',
      action: 'Apna pasandeeda tareeqa dabayein, maslan Mobile Wallet.',
      reassurance: 'Tasalli rakhein: Dono tareeqay mehfooz hain, account mein raqam mojood honi chahiye.',
      audioText: 'Muntakhib karein ke bill kahan se ada karna hai: Mobile wallet ya bank account.',
      faqs: [
        {
          id: 's4_q1',
          q: 'Mobile wallet aur bank mein kya farq hai?',
          a: 'Mobile wallet phone number se jura hota hai, dono barabar sahulat bakhash hain.'
        },
        {
          id: 's4_q2',
          q: 'Kya dono mehfooz hain?',
          a: 'Ji haan, dono State Bank se registered aur mukammal mehfooz hain.'
        }
      ]
    }
  },
  s5: {
    urdu: {
      stepTitle: 'قدم ۵: آخری تصدیق اور ادائیگی',
      intro: 'یہ سب سے اہم اسکرین ہے جہاں آپ کا نام اور بل کی حتمی رقم لکھی ہے۔',
      action: 'نام اور رقم غور سے پڑھیں اور پھر "تصدیق کریں" دبائیں۔',
      reassurance: 'تسلی رکھیں: اس کے بعد آپ کو کامیابی کا پیغام ملے گا۔',
      audioText: 'آخری بار اپنا نام اور بل کی رقم دھیان سے پڑھیں۔ پھر تصدیق کریں۔',
      faqs: [
        {
          id: 's5_q1',
          q: 'پن کوڈ (PIN Code) کب ڈالنا ہوتا ہے؟',
          a: 'جب آپ اسکرین پر اپنا نام اور رقم تسلی سے دیکھ لیں، صرف تب ہی اپنا خفیہ پن کوڈ درج کریں۔'
        },
        {
          id: 's5_q2',
          q: 'کیا تصدیق کے بعد فوری رسید ملتی ہے؟',
          a: 'جی ہاں، فوری طور پر اسکرین پر رسید اور موبائل پر تصدیقی میسج آ جاتا ہے۔'
        }
      ]
    },
    roman: {
      stepTitle: 'Qadam 5: Aakhri tasdeeq aur adaigi',
      intro: 'Yeh sab se ahem screen hai jahan aap ka naam aur bill ki pakki raqam likhi hai.',
      action: 'Naam aur raqam ghaur se parhein aur phir "Tasdeeq Karein" dabayein.',
      reassurance: 'Tasalli rakhein: Is ke baad aap ko kamyabi ka message milay ga.',
      audioText: 'Aakhri baar apna naam aur bill ki raqam dhyan se parhein. Phir tasdeeq karein.',
      faqs: [
        {
          id: 's5_q1',
          q: 'PIN code kab daalna chahiye?',
          a: 'Jab aap naam aur raqam dekh kar tasalli kar lein, sirf tab apna 4 ya 5 hindson ka PIN code daalein.'
        },
        {
          id: 's5_q2',
          q: 'Kya raseed foran milti hai?',
          a: 'Ji haan, screen par foran raseed aur transaction ID aa jati hai.'
        }
      ]
    }
  },
  s6: {
    urdu: {
      stepTitle: 'قدم ۶: ہوشیار! دھوکہ دہی سے بچاؤ',
      intro: 'ایک نامعلوم کال آئی ہے جو کہہ رہی ہے کہ اپنا او ٹی پی (خفیہ کوڈ) بتائیں۔',
      action: 'ہرگز کوڈ نہ بتائیں اور کال کاٹ دیں! کوئی بھی بینک فون پر او ٹی پی نہیں مانگتا۔',
      reassurance: 'تسلی رکھیں: جب تک آپ اپنا او ٹی پی نہیں بتائیں گی، کوئی آپ کے اکاؤنٹ کو ہاتھ نہیں لگا سکتا۔',
      audioText: 'ہوشیار! فون کال کرنے والا خفیہ کوڈ مانگ رہا ہے۔ او ٹی پی کبھی کسی کو نہ بتائیں۔ محفوظ انتخاب کال کاٹنا ہے۔',
      faqs: [
        {
          id: 's6_q1',
          q: 'او ٹی پی (OTP) کیا ہوتا ہے؟',
          a: 'او ٹی پی ایک وقتی خفیہ پاس ورڈ ہوتا ہے جو صرف آپ کے فون پر آتا ہے۔ یہ آپ کے اکاؤنٹ کی چابی ہے، کسی کو مت بتائیں۔'
        },
        {
          id: 's6_q2',
          q: 'اگر کوئی کہے کہ میں بینک کا مینیجر ہوں؟',
          a: 'چاہے کوئی بھی کہے، بینک ملازم کبھی فون پر او ٹی پی یا پاس ورڈ نہیں مانگتے۔ فورا کال بند کر دیں۔'
        }
      ]
    },
    roman: {
      stepTitle: 'Qadam 6: Hoshiyar! Dhoka-dahi se bachao',
      intro: 'Ek anjaan call aayi hai jo bol rahi hai apna OTP (khufiya code) batayein.',
      action: 'Hargiz code na batayein aur call kaat dein! Bank kabhi call par OTP nahi mangta.',
      reassurance: 'Tasalli rakhein: Jab tak aap apna OTP kisi ko nahi batateingay, aap ke paise 100% mehfooz hain.',
      audioText: 'Hoshiyar! Caller khufiya code maang raha hai. OTP kisi ko na batayein. Mehfooz raasta call kaat dena hai.',
      faqs: [
        {
          id: 's6_q1',
          q: 'OTP kya hota hai aur kyun zaroori hai?',
          a: 'OTP ek secret code hota hai jo aap ke account ki chabi hai. Yeh kisi bhi shakhs ko nahi dena chahiye.'
        },
        {
          id: 's6_q2',
          q: 'Agar koi kahe ke main bank ka bara afsar hoon?',
          a: 'Chahay koi bhi ho, asli bank kabhi PIN ya OTP nahi maangta. Foran call kaat dein.'
        }
      ]
    }
  },
  s7: {
    urdu: {
      stepTitle: 'قدم ۷: مبارک ہو! رسید محفوظ کریں',
      intro: 'بل کامیابی سے ادا ہو چکا ہے۔ اسکرین پر رسید اور ٹرانزیکشن نمبر آ گیا ہے۔',
      action: '"رسید ڈاؤن لوڈ کریں" پر دبا کر اسے اپنے فون میں محفوظ کر لیں۔',
      reassurance: 'تسلی رکھیں: آپ کا بل جمع ہو گیا ہے، یہ رسید آپ کا ثبوت ہے۔',
      audioText: 'مبارک ہو! بل کامیابی سے ادا ہو گیا ہے۔ رسید محفوظ کر لیں۔',
      faqs: [
        {
          id: 's7_q1',
          q: 'یہ رسید کہاں کام آتی ہے؟',
          a: 'اگر کبھی بجلی کمپنی کہے کہ بل جمع نہیں ہوا تو آپ یہ رسید اور ٹرانزیکشن آئی ڈی دکھا سکتی ہیں۔'
        },
        {
          id: 's7_q2',
          q: 'کیا بجلی کا محکمہ فوراً اپڈیٹ کر دیتا ہے؟',
          a: 'جی ہاں، کمپیوٹرائزڈ نظام میں ادائیگی فوراً درج ہو جاتی ہے۔'
        }
      ]
    },
    roman: {
      stepTitle: 'Qadam 7: Mubarak ho! Raseed mehfooz karein',
      intro: 'Bill kamyabi se ada ho gaya hai. Screen par raseed aur Transaction ID aa chuki hai.',
      action: '"Raseed Mehfooz Karein" button par daba kar apne phone mein save kar lein.',
      reassurance: 'Tasalli rakhein: Aap ka bill ada ho gaya hai aur raseed aap ke paas saboot hai.',
      audioText: 'Mubarak ho! Bill kamyabi se ada ho gaya hai. Raseed mehfooz kar lein.',
      faqs: [
        {
          id: 's7_q1',
          q: 'Yeh raseed kahan kaam aati hai?',
          a: 'Agar kabhi bijli office wale kahein ke bill nahi mila, to aap yeh transaction ID dikha sakti hain.'
        },
        {
          id: 's7_q2',
          q: 'Kya bill foran jama ho jata hai?',
          a: 'Ji haan, online system mein payment foran darj ho jati hai aur SMS bhi aa jata hai.'
        }
      ]
    }
  }
};

const GENERAL_RESPONSES = {
  urdu: {
    default: 'آپ نے بہت اچھا سوال پوچھا۔ ڈیجیٹل بینکنگ میں کبھی جلد بازی نہ کریں، ہمیشہ نام، رقم اور بٹن کو اطمینان سے پڑھ کر آگے بڑھیں۔ کوئی پریشانی ہو تو ہمیشہ واپس جا سکتی ہیں۔',
    pin: 'پن کوڈ (PIN Code) آپ کا خفیہ کوڈ ہے۔ یہ صرف اس وقت ڈالیں جب آپ اپنے فون میں خود بل کی تصدیق کر رہی ہوں۔ کسی بھی شخص کو کال یا میسج پر کبھی نہ بتائیں۔',
    mistake: 'اگر غلطی سے کچھ اور دب جائے تو پریشان نہ ہوں! ایپ میں اوپر بائیں طرف "واپس" کا تیر ہوتا ہے، اسے دبا کر آپ پچھلے صفحے پر واپس جا سکتی ہیں۔',
    money: 'جب تک آپ اپنا خفیہ پن کوڈ نہ ڈالیں اور آخری تصدیق نہ کریں، کوئی رقم نہیں کٹتی۔ اس لیے بے خوف ہو کر سیکھیں۔'
  },
  roman: {
    default: 'Aap ne bohat acha sawal poocha. Digital banking mein jaldbazi na karein, hamesha tasalli se parhein. Ghalati se kuch ghalat dabba bhi jaye to hamesha wapas ja sakti hain.',
    pin: 'PIN code aap ka khufiya code hai. Yeh sirf us waqt phone mein daalein jab aap khud screen par sab theek dekh lein. Kisi ko call ya message par na batayein.',
    mistake: 'Agar ghalti se kuch aur dab jaye to ghabrayein nahi! Pichli screen par wapas jane ke liye back ka nishan dabayein. Koi nuqsan nahi hota.',
    money: 'Jab tak aap apna khufiya PIN na daalein aur aakhri tasdeeq na karein, tab tak account se koi raqam nahi kat sakti. Befikr ho kar seekhein.'
  }
};

router.post('/', async (req, res) => {
  const { lessonId = 'bijli-bill-01', stepId = 's1', userQuestion, lang = 'roman' } = req.body;
  const isUrdu = lang === 'urdu';
  const langKey = isUrdu ? 'urdu' : 'roman';

  const stepData = STEP_KNOWLEDGE[stepId]?.[langKey] || STEP_KNOWLEDGE.s1[langKey];

  // If user asked a specific question
  if (userQuestion && typeof userQuestion === 'string' && userQuestion.trim().length > 0) {
    const qLower = userQuestion.toLowerCase();

    // Check if matching an FAQ
    const matchedFaq = stepData.faqs.find(f =>
      qLower.includes(f.q.toLowerCase().slice(0, 15)) || f.q.toLowerCase().includes(qLower.slice(0, 15))
    );

    if (matchedFaq) {
      return res.json({
        stepId,
        question: userQuestion,
        answer: matchedFaq.a,
        audioText: matchedFaq.a,
        guide: stepData
      });
    }

    // Try OpenAI if available
    if (isAiAvailable()) {
      try {
        const prompt = `You are "Madadgar AI" (مددگار AI), a gentle, respectful Pakistani elder tutor helping a 58-year-old parent navigate their phone.
Current lesson: Electricity Bill Payment.
Current step: ${stepId} (${stepData.stepTitle}).
The elder asks: "${userQuestion}"
Respond in 2 to 3 gentle, reassuring sentences in ${isUrdu ? 'pure Urdu script (اردو)' : 'simple conversational Roman Urdu'}.
Do not use technical jargon. Never shame or blame. Always emphasize safety and reassurance. Output JSON: {"answer": "your answer here"}`;

        const raw = await callOpenAI([
          { role: 'system', content: 'You are Madadgar AI, an empathetic elder assistant. Answer in JSON.' },
          { role: 'user', content: prompt }
        ]);

        const parsed = JSON.parse(raw);
        if (parsed.answer) {
          return res.json({
            stepId,
            question: userQuestion,
            answer: parsed.answer,
            audioText: parsed.answer,
            guide: stepData
          });
        }
      } catch (err) {
        console.warn('AI assistant call failed, using rule-based answer:', err.message);
      }
    }

    // Rule-based keyword matching fallback
    let fallbackAnswer = GENERAL_RESPONSES[langKey].default;
    if (qLower.includes('pin') || qLower.includes('پن') || qLower.includes('code') || qLower.includes('کوڈ')) {
      fallbackAnswer = GENERAL_RESPONSES[langKey].pin;
    } else if (qLower.includes('ghalat') || qLower.includes('غلط') || qLower.includes('mistake') || qLower.includes('back')) {
      fallbackAnswer = GENERAL_RESPONSES[langKey].mistake;
    } else if (qLower.includes('paise') || qLower.includes('پیسے') || qLower.includes('kat') || qLower.includes('money')) {
      fallbackAnswer = GENERAL_RESPONSES[langKey].money;
    }

    return res.json({
      stepId,
      question: userQuestion,
      answer: fallbackAnswer,
      audioText: fallbackAnswer,
      guide: stepData
    });
  }

  // Default response for this step: returns full step guidance, reassuring tip, and quick FAQs
  return res.json({
    stepId,
    guide: stepData
  });
});

export default router;
