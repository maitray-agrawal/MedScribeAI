import { SampleScenario } from '../types';

export const SAMPLE_SCENARIOS: SampleScenario[] = [
  {
    id: 'malaria-fever',
    title: 'Acute Febrile Illness / Suspected Malaria',
    category: 'Infectious Disease',
    language: 'en',
    description: 'Rural primary care visit for high fever, rigors, headache, and fatigue in an endemic area.',
    patientInfo: {
      name: 'Kwame Mensah',
      age: 28,
      sex: 'Male',
      medicalHistory: 'No chronic illness. Prior episode of malaria 2 years ago treated with AL.',
      currentMedications: 'Paracetamol 500mg as needed for fever',
      knownAllergies: 'NKDA (No Known Drug Allergies)',
      encounterType: 'Acute Unscheduled Visit',
      clinicLocation: 'Sub-District Health Center'
    },
    transcript: `Doctor: Good morning Kwame, come in and sit down. What brings you to the clinic today?
Patient: Morning doctor. I've been feeling very unwell for the past 3 days. I started having intense chills and shivering on Tuesday evening, followed by high fever and severe headache.
Doctor: I see. Have you noticed any other symptoms? Nausea, vomiting, joint body aches, or abdominal pain?
Patient: Yes, my whole body aches, especially my joints and back. I felt nauseous yesterday and vomited once after breakfast. I couldn't eat much today.
Doctor: Any cough, chest pain, difficulty breathing, or neck stiffness?
Patient: No cough or chest pain. My neck is fine, just a very heavy headache behind my eyes.
Doctor: Okay. Have you been sleeping under an insecticide-treated bed net consistently?
Patient: Mostly yes, but I traveled to my family's farm last week and forgot my net for two nights.
Doctor: Alright. Let's do a physical examination. I will check your vitals first. Temperature is 38.9°C, blood pressure is 118/76 mmHg, heart rate is 104 beats per minute, respiratory rate is 18, and oxygen saturation is 98% on room air.
Doctor: On examination, eyes show mild conjunctival pallor, no jaundice. Chest is clear on auscultation. Abdomen is soft, non-tender, but I can feel mild splenomegaly about 2cm below the left costal margin. No neck stiffness or rash.
Doctor: We will do a Malaria Rapid Diagnostic Test (mRDT) and a hemoglobin check right away.
Patient: Doctor, the nurse took the finger prick blood test earlier.
Doctor: Perfect. Let me read the result: mRDT is positive for Plasmodium falciparum. Hemoglobin level is 10.2 g/dL, which indicates mild anemia.
Doctor: So you have uncomplicated Plasmodium falciparum malaria. We will start you on Artemether-Lumefantrine (Coartem) 80/480mg, taken twice daily for 3 days. Take each dose with a fatty meal or milk so it absorbs properly. I'll also give you Paracetamol 1000mg three times a day for fever and body aches. Drink plenty of clean ORS or boiled water.
Patient: Thank you doctor. Should I come back?
Doctor: Yes, if your fever doesn't come down after 48 hours, or if you start vomiting repeatedly, feel unusually weak, or pass dark urine, come back immediately. Otherwise, review in 1 week if not fully recovered.`
  },
  {
    id: 'hypertension-diabetes',
    title: 'Uncontrolled Hypertension & Type 2 Diabetes',
    category: 'Chronic Care',
    language: 'en',
    description: 'Routine follow-up for hypertension and diabetes with elevated blood pressure and medication adherence check.',
    patientInfo: {
      name: 'Maria Santos',
      age: 54,
      sex: 'Female',
      medicalHistory: 'Type 2 Diabetes Mellitus (8 yrs), Essential Hypertension (5 yrs), Mild Osteoarthritis',
      currentMedications: 'Metformin 500mg BD, Amlodipine 5mg OD, Ibuprofen 400mg PRN for knee pain',
      knownAllergies: 'ACE Inhibitors (causes severe dry cough)',
      encounterType: 'Routine Chronic Disease Follow-up',
      clinicLocation: 'Community Primary Clinic'
    },
    transcript: `Doctor: Hello Maria, good to see you again. How have you been feeling since our last visit two months ago?
Patient: Good morning Doctor. Overall I feel okay, but I've been having mild morning headaches at the back of my head for the past two weeks, and sometimes my feet feel a little swollen in the evening.
Doctor: Thanks for letting me know. Are you taking your medications regularly every day?
Patient: To be honest doctor, I ran out of Amlodipine about 3 weeks ago because I couldn't make the trip to the central pharmacy, so I've only been taking the Metformin. Also, my knees were hurting so I took Ibuprofen almost daily last week.
Doctor: I understand. Taking NSAIDs like Ibuprofen daily can raise your blood pressure and strain your kidneys, so we need to be careful with that. Let's check your vitals now.
Doctor: Blood pressure is elevated today at 158/96 mmHg. Heart rate is 78 bpm. Weight is 74 kg.
Doctor: Physical exam shows mild +1 bilateral pedal edema up to the ankles. Heart sounds S1 and S2 present, no murmurs. Lungs clear to auscultation bilaterally. Fasting capillary blood glucose taken by nurse this morning was 8.6 mmol/L (155 mg/dL).
Doctor: Urine dipstick shows negative for protein and glucose today.
Doctor: Maria, your blood pressure is high today because you ran out of Amlodipine and took frequent Ibuprofen. We need to resume your blood pressure medicine immediately. We will increase Amlodipine to 10mg once daily to better control your BP. We'll continue Metformin 500mg twice daily with meals.
Doctor: For knee pain, please stop daily Ibuprofen. Use Paracetamol 500mg as needed instead, and try warm compresses. I will also refer you to our community health worker to help arrange local pharmacy refill delivery so you don't run out.
Patient: That would be so helpful doctor. When should I check my blood pressure again?
Doctor: Please visit the clinic nurse next week for a quick BP check, and see me in 4 weeks for repeat blood pressure, fasting blood glucose, and renal function test.`
  },
  {
    id: 'pediatric-urti',
    title: 'Pediatric Cough & Fever (Otitis Media)',
    category: 'Pediatrics',
    language: 'en',
    description: 'Mother brings 4-year-old child with 2-day fever, ear pulling, and runny nose.',
    patientInfo: {
      name: 'Liam O\'Connor (Mother: Sarah)',
      age: 4,
      sex: 'Male',
      medicalHistory: 'Fully immunized for age. No prior hospitalizations.',
      currentMedications: 'Children\'s Paracetamol syrup given twice yesterday',
      knownAllergies: 'NKDA',
      encounterType: 'Acute Pediatric Walk-in',
      clinicLocation: 'Maternal & Child Health Wing'
    },
    transcript: `Doctor: Hello Sarah, welcome. I see you brought little Liam today. What's been going on?
Mother: Doctor, Liam developed a fever two nights ago. He has a runny nose and woke up crying last night pulling at his right ear. He refused to eat his breakfast this morning.
Doctor: Poor little guy. Has he had any difficulty breathing, fast breathing, noisy wheezing, or stridor?
Mother: No fast breathing or wheezing, just congestion and ear pain.
Doctor: Has he had any vomiting, diarrhea, or rash?
Mother: No vomiting or diarrhea. He drank some apple juice earlier.
Doctor: Good. Let's examine Liam. Vitals: Temperature is 38.3°C, Heart rate is 110 bpm, Respiratory rate is 24 breaths/min (normal for age), Oxygen saturation 99% on room air. Weight is 16 kg.
Doctor: On physical exam: Child is alert, sitting on mother's lap, mild clear nasal discharge. Throat is mildly erythematous, tonsils 1+, no exudate. Otoscopy reveals right tympanic membrane is bulging, erythematous, with loss of landmarks. Left tympanic membrane is clear and translucent. Lungs clear bilaterally with good air entry, no chest indrawing or retractions. Abdomen soft and non-tender.
Doctor: Liam has Acute Right Otitis Media (middle ear infection) along with a viral upper respiratory infection.
Doctor: Because of his age, fever, and bulging ear drum, we will prescribe Amoxicillin oral suspension 400mg/5ml, 5ml (400mg) twice daily for 7 days. Give him Paracetamol syrup 250mg/5ml, 5ml every 6 hours as needed for pain and fever. Keep him well hydrated with water and soups.
Mother: Thank you doctor. When should I bring him back?
Doctor: Return immediately if he develops difficulty breathing, extreme lethargy, persistent vomiting, or if ear pain and fever persist after 48 hours of antibiotics.`
  },
  {
    id: 'antenatal-check',
    title: 'Routine Antenatal Care (2nd Trimester)',
    category: 'Maternal Care',
    language: 'en',
    description: 'Routine 24-week prenatal visit with routine blood test review showing mild gestational anemia.',
    patientInfo: {
      name: 'Amina Yusuf',
      age: 26,
      sex: 'Female',
      medicalHistory: 'G2P1L1, 24 weeks gestation by LMP. Normal spontaneous vaginal delivery 3 yrs ago.',
      currentMedications: 'Prenatal Multivitamin, Folic Acid 5mg daily',
      knownAllergies: 'NKDA',
      encounterType: 'Antenatal Consultation',
      clinicLocation: 'MCH Outreach Clinic'
    },
    transcript: `Doctor: Good morning Amina. Welcome to your 24-week antenatal checkup. How are you feeling, and are you feeling good baby movements?
Patient: Morning doctor. Yes, the baby is kicking very actively, especially in the evening! But I feel a bit more tired than usual in the afternoon.
Doctor: That's great about the baby movements. Any headache, vision changes, abdominal pain, vaginal bleeding, or fluid leaking?
Patient: No headache, no bleeding, no fluid leaking.
Doctor: Excellent. Let's check your vitals and examination.
Doctor: Blood pressure is 112/70 mmHg, pulse is 76 bpm, weight is 62 kg (gained 2 kg over last 4 weeks).
Doctor: Examination: Mild conjunctival paleness. Fundal height corresponds to 24 weeks gestation. Fetal heart rate is 142 beats per minute, regular rhythm using Doppler. No pedal edema. Urine dipstick: Protein negative, Glucose negative.
Doctor: Let's review your second trimester lab panel: Hemoglobin is 10.1 g/dL (mild anemia of pregnancy). Blood group O positive, Syphilis (VDRL) non-reactive, HIV rapid screening negative, Blood sugar 1-hour post 50g glucose loading is 6.2 mmol/L (normal, rules out gestational diabetes).
Doctor: Amina, baby is growing well and your blood pressure is normal. You have mild gestational iron-deficiency anemia, which is very common around 24 weeks. We will add Ferrous Sulfate 200mg (60mg elemental iron) taken once daily with orange juice or water on an empty stomach. Continue your Folic acid and prenatal vitamin.
Doctor: Also eat iron-rich foods like dark leafy greens, beans, and lean meats. Avoid drinking tea or coffee directly with your iron tablet because it reduces iron absorption.
Patient: Thank you doctor! When is my next visit?
Doctor: Return in 4 weeks at 28 weeks for your routine checkup, Tetanus toxoid booster, and repeat Hb check.`
  },
  {
    id: 'gastroenteritis-dehydration',
    title: 'Acute Gastroenteritis with Mild Dehydration',
    category: 'Gastrointestinal',
    language: 'en',
    description: 'Adult presenting with 1-day watery diarrhea and cramps after eating local street food.',
    patientInfo: {
      name: 'Rajesh Kumar',
      age: 32,
      sex: 'Male',
      medicalHistory: 'No known underlying medical conditions.',
      currentMedications: 'None',
      knownAllergies: 'NKDA',
      encounterType: 'Acute Walk-in Visit',
      clinicLocation: 'Primary Care Outpatient Clinic'
    },
    transcript: `Doctor: Hello Rajesh. What brings you to the clinic today?
Patient: Doctor, I started having frequent loose watery stools yesterday midnight. I've been to the toilet about 6 times since morning. I also have abdominal cramping and mild nausea.
Doctor: Any blood or mucus in the stool? High fever or severe vomiting?
Patient: No blood, just clear watery stool. I vomited once yesterday night after dinner, but today I've been able to sip some tea without vomiting. No high fever.
Doctor: Did you eat anything unusual recently?
Patient: I ate spicy street food from a roadside stall yesterday afternoon.
Doctor: I see. Let's do an examination. Vitals: Blood pressure 110/72 mmHg, Heart rate 92 bpm, Temperature 37.4°C, Respiratory rate 16, O2 sat 99%.
Doctor: Physical exam: Mucous membranes are slightly dry, skin turgor is normal with immediate recoil. Abdomen is soft, hyperactive bowel sounds in all four quadrants, mild diffuse tenderness on palpation, no localized guarding or rebound tenderness.
Doctor: You have acute non-cholera, non-dysenteric gastroenteritis with mild dehydration, likely foodborne.
Doctor: Treatment plan: Antibiotics are NOT indicated right now as there is no bloody stool or systemic fever. The main treatment is oral rehydration. I am giving you Oral Rehydration Salts (ORS) packets — dissolve 1 packet in exactly 1 liter of clean water and drink 1 glass after every loose stool. Also start Zinc Sulfate 20mg once daily for 10 days to aid mucosal recovery.
Doctor: Continue eating light meals like rice, bananas, porridge. Avoid fatty foods or dairy for 2 days.
Patient: Do I need any antibiotics or anti-diarrhea pills?
Doctor: No anti-motility pills like Loperamide, as we want your body to naturally flush out the toxin. If stool becomes bloody, or if you develop high fever, intractable vomiting, or dizziness, return immediately.`
  },
  {
    id: 'spanish-consultation-fever',
    title: 'Spanish Consultation (Gastroenteritis & Fever)',
    category: 'Spanish Consultation',
    language: 'es',
    description: 'Spanish language consultation for high fever, severe headache, and acute watery diarrhea.',
    patientInfo: {
      name: 'Carlos Rodríguez',
      age: 38,
      sex: 'Male',
      medicalHistory: 'Controlled essential hypertension.',
      currentMedications: 'Enalapril 10mg daily',
      knownAllergies: 'Penicillin allergy (causes skin rash)',
      encounterType: 'Acute Urgent Care Visit',
      clinicLocation: 'Centro de Salud Rural'
    },
    transcript: `Doctor: Buenos días Carlos, tome asiento. ¿Cuál es el motivo de su consulta el día de hoy?
Paciente: Buenos días doctor. Desde hace tres días tengo mucha fiebre, escalofríos y un dolor de cabeza muy fuerte. Además, ayer empecé con diarrea líquida y dolor abdominal.
Doctor: Entiendo. ¿Ha tenido náuseas o vómitos? ¿Ha notado sangre en la diarrea?
Paciente: Tuve dos episodios de vómito anoche y mucha náusea. No he visto sangre en las deposiciones, pero son totalmente líquidas.
Doctor: ¿Toma alguna medicina actualmente o tiene alguna alergia conocida?
Paciente: Tomo Enalapril de 10mg para la presión arterial todos los días. Soy alérgico a la penicilina, me da sarpullido.
Doctor: De acuerdo. Vamos a examinarlo y tomar sus funciones vitales. Presión arterial: 118/78 mmHg, Temperatura: 38.8°C, Frecuencia cardíaca: 96 latidos por minuto, Frecuencia respiratoria: 18.
Doctor: Al examen físico: Paciente febril, mucosas ligeramente secas. Abdomen blando, ruidos hidroaéreos aumentados, dolor leve a la palpación difusa sin irritación peritoneal.
Doctor: El diagnóstico es una Gastroenteritis Aguda Infecciosa con deshidratación leve y Síndrome Febril.
Doctor: Plan de tratamiento: Vamos a iniciar Sales de Rehidratación Oral (SRO), 1 sobre disuelto en 1 litro de agua hervida, tomando a libre demanda tras cada deposición. Para la fiebre, Paracetamol 500mg cada 8 horas por 3 días. No utilizaremos penicilina ni derivados debido a su alergia.
Paciente: Muchas gracias doctor. ¿Cuándo debo regresar a control?
Doctor: Si la fiebre no cede en 48 horas, si presenta vómitos persistentes o sangre en las heces, regrese de inmediato. Si mejora, control en 5 días.`
  },
  {
    id: 'hindi-consultation-fever',
    title: 'Hindi Consultation (Acute Febrile Illness / तीव्र ज्वर)',
    category: 'Hindi Consultation',
    language: 'hi',
    description: 'तीव्र बुखार, बदन दर्द और सिरदर्द के लिए प्राथमिक स्वास्थ्य केंद्र में परामर्श।',
    patientInfo: {
      name: 'राजेश शर्मा (Rajesh Sharma)',
      age: 35,
      sex: 'Male',
      medicalHistory: 'कोई पूर्व पुरानी बीमारी नहीं।',
      currentMedications: 'पैरासिटामोल 500mg आवश्यकतानुसार',
      knownAllergies: 'NKDA (कोई ज्ञात दवा एलर्जी नहीं)',
      encounterType: 'आकस्मिक परामर्श (Acute Visit)',
      clinicLocation: 'प्राथमिक स्वास्थ्य केंद्र, ब्लॉक 2'
    },
    transcript: `Doctor: नमस्ते राजेश जी, बैठिए। बताइए आज क्या परेशानी है?
मरीज: नमस्ते डॉक्टर साहब। मुझे पिछले तीन दिनों से बहुत तेज बुखार आ रहा है, कंपकंपी छूट रही है और सिर में बहुत तेज दर्द है।
Doctor: क्या आपको उल्टी, जी मिचलाना, या बदन में दर्द की शिकायत भी है?
मरीज: जी डॉक्टर साहब, पूरे शरीर और जोड़ों में बहुत तेज दर्द है। कल शाम को एक बार उल्टी भी हुई थी और भूख बिल्कुल नहीं लग रही।
Doctor: खांसी, सीने में दर्द या सांस लेने में कोई तकलीफ तो नहीं?
मरीज: नहीं डॉक्टर, खांसी नहीं है, बस आंखों के पीछे और सिर में बहुत भारीपन लग रहा है।
Doctor: ठीक है, आइए जांच कर लेते हैं। तापमान 38.8°C है, रक्तचाप 120/78 mmHg, और नाड़ी 98 प्रति मिनट है।
Doctor: शारीरिक परीक्षण में गले में कोई गंभीर संक्रमण नहीं है, पेट सामान्य है। हम तुरंत रैपिड मलेरिया टेस्ट (mRDT) और हीमोग्लोबिन की जांच करेंगे।
Doctor: लैब रिपोर्ट के अनुसार मलेरिया टेस्ट पॉजिटिव आया है (Plasmodium vivax)। हीमोग्लोबिन 11.4 g/dL है।
Doctor: आपको मलेरिया का संक्रमण हुआ है। हम क्लोरोक्वीन (Chloroquine) और प्राइमाक्वीन (Primaquine) का पूरा कोर्स शुरू करेंगे। बुखार और दर्द के लिए पैरासिटामोल 650mg दिन में तीन बार लें। खूब सारा उबला हुआ पानी और ओआरएस (ORS) पिएं।
मरीज: धन्यवाद डॉक्टर साहब। दोबारा कब दिखाना होगा?
Doctor: यदि दो दिन में बुखार कम न हो या अत्यधिक कमजोरी लगे तो तुरंत आएं, अन्यथा एक सप्ताह बाद पुनः जांच के लिए आएं।`
  },
  {
    id: 'marathi-consultation-htn',
    title: 'Marathi Consultation (Hypertension Follow-up / उच्च रक्तदाब)',
    category: 'Marathi Consultation',
    language: 'mr',
    description: 'रक्तदाब तपासणी आणि औषधोपचार नियमिततेसाठी पाठपुरावा सल्लामसलत.',
    patientInfo: {
      name: 'सचिन जोशी (Sachin Joshi)',
      age: 52,
      sex: 'Male',
      medicalHistory: 'आवश्यक उच्च रक्तदाब (Essential Hypertension, 4 वर्षे).',
      currentMedications: 'अम्लोडिपिन 5mg दररोज सकाळी',
      knownAllergies: 'कोणतीही औषध अ‍ॅलर्जी नाही (NKDA)',
      encounterType: 'नियमित पाठपुरावा (Follow-up)',
      clinicLocation: 'ग्रामीण प्राथमिक आरोग्य केंद्र'
    },
    transcript: `Doctor: नमस्कार सचिनराव, या बसा. कसे वाटत आहे सध्या? नियमित तपासणीसाठी आला आहात ना?
रुग्ण: नमस्कार डॉक्टर. होय, पण गेल्या आठवड्यापासून मला सकाळी उठल्यावर डोकेदुखी जाणवते आणि थोडे चक्कर आल्यासारखे वाटते.
Doctor: तुम्ही तुमची रक्तदाबाची गोळी दररोज न चुकता घेत आहात का?
रुग्ण: खरे सांगायचे तर डॉक्टर, गेल्या १५ दिवसांत शेतातील कामाच्या धावपळीत २-३ वेळा गोळी घ्यायची विसरून गेलो.
Doctor: रक्तदाबाची औषधे नियमित घेणे अत्यंत महत्त्वाचे असते. चला आधी तुमचा रक्तदाब तपासूया.
Doctor: रक्तदाब आज वाढलेला आहे: 154/94 mmHg. हृदयाचे ठोके 76 प्रति मिनिट आहेत. फुफ्फुसे आणि छातीची तपासणी सामान्य आहे.
Doctor: गोळी चुकवल्यामुळे रक्तदाब वाढला आहे. आपण तात्काळ अम्लोडिपिन 5mg पूर्ववत सुरू ठेवू, आणि आवश्यकता भासल्यास डोस वाढवू.
Doctor: आहारात मिठाचे प्रमाण कमी करा, रोज ३० मिनिटे चालण्याचा व्यायाम करा आणि गोळी अजिबात चुकवू नका.
रुग्ण: नक्की काळजी घेईन डॉक्टर. पुन्हा तपासणी कधी करू?
Doctor: पुढच्या आठवड्यात आरोग्य सेविकेकडून रक्तदाब तपासून घ्या आणि १५ दिवसांनी मला पुन्हा भेटा.`
  },
  {
    id: 'tamil-consultation-diabetes',
    title: 'Tamil Consultation (Diabetes Follow-up / நீரிழிவு நோய்)',
    category: 'Tamil Consultation',
    language: 'ta',
    description: 'வகை 2 நீரிழிவு நோய் மற்றும் இரத்த சர்க்கரை அளவை கண்காணிக்கும் மருத்துவ ஆலோசனை.',
    patientInfo: {
      name: 'செந்தில் குமார் (Senthil Kumar)',
      age: 48,
      sex: 'Male',
      medicalHistory: 'வகை 2 நீரிழிவு நோய் (5 ஆண்டுகள்), ஆரம்ப நிலை உயர் இரத்த அழுத்தம்.',
      currentMedications: 'மெட்ஃபோர்மின் 500mg தினமும் இருமுறை உணவுக்குப் பின்',
      knownAllergies: 'சல்ஃபா மருந்து ஒவ்வாமை (Sulfa Allergy)',
      encounterType: 'வழக்கமான நீரிழிவு பரிசோதனை',
      clinicLocation: 'சமூக ஆரம்ப சுகாதார நிலையம்'
    },
    transcript: `Doctor: வணக்கம் செந்தில், வாருங்கள். கடந்த இரண்டு மாதங்களாக உங்கள் உடல்நிலை எப்படி இருக்கிறது?
நோயாளி: வணக்கம் டாக்டர். பொதுவாக பரவாயில்லை, ஆனால் கடந்த பத்து நாட்களாக மாலை நேரங்களில் கால்களில் லேசான எரிச்சல் மற்றும் அதீத சோர்வு இருக்கிறது.
Doctor: உங்கள் மெட்ஃபோர்மின் மாத்திரையை தினமும் குறித்த நேரத்தில் எடுத்துக்கொள்கிறீர்களா? உணவுக்கட்டுப்பாடு எப்படி இருக்கிறது?
நோயாளி: மாத்திரைகளை தவறாமல் எடுக்கிறேன் டாக்டர். ஆனால் கடந்த வாரம் குடும்ப விசேஷம் காரணமாக இனிப்புகள் கொஞ்சம் அதிகம் சாப்பிட்டுவிட்டேன்.
Doctor: சரி செந்தில், நாம் உங்கள் இரத்த சர்க்கரை மற்றும் இரத்த அழுத்தத்தை பரிசோதிப்போம்.
Doctor: இரத்த அழுத்தம் 130/82 mmHg உள்ளது. இன்று காலை வெறும் வயிற்றில் எடுக்கப்பட்ட இரத்த சர்க்கரை அளவு 168 mg/dL (அதிகமாக உள்ளது).
Doctor: உடற்பரிசோதனையில் பாதங்களில் உணர்ச்சி சீராக உள்ளது, காயம் ஏதும் இல்லை. ஆனால் இரத்த சர்க்கரை அளவு கட்டுப்பாட்டில் இல்லை.
Doctor: மெட்ஃபோர்மின் அளவை 500mg-லிருந்து 850mg ஆக உயர்த்துகிறோம், தினமும் இருவேளை உணவுக்குப் பின் எடுத்துக் கொள்ளுங்கள். இனிப்பு மற்றும் அரிசி உணவைக் குறைத்து, காய்கறிகள் அதிகம் சேர்த்துக் கொள்ளுங்கள்.
நோயாளி: நன்றி டாக்டர், மீண்டும் எப்போது வர வேண்டும்?
Doctor: ஒரு மாதம் கழித்து HbA1c பரிசோதனை செய்துவிட்டு மீண்டும் வாருங்கள்.`
  }
];
