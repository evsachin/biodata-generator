// Default biodata structure. Every field has Marathi + English labels.
// `options` refers to a key in OPTIONS (renders a <select>; the stored value is the Marathi option text).

const o = (mr, en) => ({ mr, en: en ?? mr });

export const OPTIONS = {
  complexion: [o('गोरा', 'Fair'), o('निमगोरा', 'Medium Fair'), o('गव्हाळ', 'Wheatish'), o('सावळा', 'Dusky')],
  bloodGroup: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((b) => o(b)),
  maritalStatus: [o('अविवाहित', 'Unmarried'), o('घटस्फोटित', 'Divorced'), o('विधुर', 'Widower'), o('विधवा', 'Widow')],
  diet: [o('शाकाहारी', 'Vegetarian'), o('मांसाहारी', 'Non-Vegetarian')],
  rashi: [
    o('मेष', 'Aries'), o('वृषभ', 'Taurus'), o('मिथुन', 'Gemini'), o('कर्क', 'Cancer'),
    o('सिंह', 'Leo'), o('कन्या', 'Virgo'), o('तूळ', 'Libra'), o('वृश्चिक', 'Scorpio'),
    o('धनु', 'Sagittarius'), o('मकर', 'Capricorn'), o('कुंभ', 'Aquarius'), o('मीन', 'Pisces'),
  ],
  nakshatra: [
    o('अश्विनी', 'Ashwini'), o('भरणी', 'Bharani'), o('कृत्तिका', 'Krittika'), o('रोहिणी', 'Rohini'),
    o('मृगशीर्ष', 'Mrigashira'), o('आर्द्रा', 'Ardra'), o('पुनर्वसू', 'Punarvasu'), o('पुष्य', 'Pushya'),
    o('आश्लेषा', 'Ashlesha'), o('मघा', 'Magha'), o('पूर्वा फाल्गुनी', 'Purva Phalguni'),
    o('उत्तरा फाल्गुनी', 'Uttara Phalguni'), o('हस्त', 'Hasta'), o('चित्रा', 'Chitra'), o('स्वाती', 'Swati'),
    o('विशाखा', 'Vishakha'), o('अनुराधा', 'Anuradha'), o('ज्येष्ठा', 'Jyeshtha'), o('मूळ', 'Mula'),
    o('पूर्वाषाढा', 'Purva Ashadha'), o('उत्तराषाढा', 'Uttara Ashadha'), o('श्रवण', 'Shravana'),
    o('धनिष्ठा', 'Dhanishta'), o('शततारका', 'Shatabhisha'), o('पूर्वाभाद्रपदा', 'Purva Bhadrapada'),
    o('उत्तराभाद्रपदा', 'Uttara Bhadrapada'), o('रेवती', 'Revati'),
  ],
  gan: [o('देव', 'Dev'), o('मनुष्य', 'Manushya'), o('राक्षस', 'Rakshas')],
  nadi: [o('आद्य', 'Aadya'), o('मध्य', 'Madhya'), o('अंत्य', 'Antya')],
  mangal: [o('नाही', 'No'), o('आहे', 'Yes'), o('अंशतः', 'Partial')],
};

const f = (id, mr, en, type = 'text', extra = {}) => ({ id, mr, en, type, ...extra });

export const DEFAULT_SECTIONS = [
  {
    id: 'personal', mr: 'वैयक्तिक माहिती', en: 'Personal Details',
    fields: [
      f('name', 'पूर्ण नाव', 'Full Name', 'text', { placeholder: 'उदा. प्रिया सुनील पाटील' }),
      f('dob', 'जन्म तारीख', 'Date of Birth', 'date'),
      f('tob', 'जन्म वेळ', 'Time of Birth', 'time'),
      f('pob', 'जन्म ठिकाण', 'Place of Birth', 'text', { placeholder: 'पुणे' }),
      f('height', 'उंची', 'Height', 'text', { placeholder: '5 फूट 4 इंच' }),
      f('weight', 'वजन', 'Weight', 'text', { placeholder: '55 किलो' }),
      f('complexion', 'वर्ण', 'Complexion', 'select', { options: 'complexion' }),
      f('bloodGroup', 'रक्तगट', 'Blood Group', 'select', { options: 'bloodGroup' }),
      f('maritalStatus', 'वैवाहिक स्थिती', 'Marital Status', 'select', { options: 'maritalStatus' }),
      f('diet', 'आहार', 'Diet', 'select', { options: 'diet' }),
      f('religion', 'धर्म', 'Religion', 'text', { placeholder: 'हिंदू' }),
      f('caste', 'जात', 'Caste', 'text', { placeholder: '९६ कुळी मराठा' }),
      f('subCaste', 'पोटजात', 'Sub-caste'),
      f('motherTongue', 'मातृभाषा', 'Mother Tongue', 'text', { placeholder: 'मराठी' }),
    ],
  },
  {
    id: 'horoscope', mr: 'कुंडली / ज्योतिष माहिती', en: 'Horoscope Details',
    fields: [
      f('rashi', 'रास', 'Rashi', 'select', { options: 'rashi' }),
      f('nakshatra', 'नक्षत्र', 'Nakshatra', 'select', { options: 'nakshatra' }),
      f('charan', 'चरण', 'Charan', 'text', { placeholder: '२' }),
      f('gan', 'गण', 'Gan', 'select', { options: 'gan' }),
      f('nadi', 'नाडी', 'Nadi', 'select', { options: 'nadi' }),
      f('gotra', 'गोत्र', 'Gotra'),
      f('kuldaivat', 'कुलदैवत', 'Kuldaivat', 'text', { placeholder: 'खंडोबा / तुळजाभवानी' }),
      f('devak', 'देवक', 'Devak'),
      f('mangal', 'मंगळ', 'Mangal', 'select', { options: 'mangal' }),
    ],
  },
  {
    id: 'education', mr: 'शिक्षण', en: 'Education',
    fields: [
      f('education', 'शिक्षण', 'Education', 'text', { placeholder: 'B.E. (Computer)' }),
      f('institute', 'महाविद्यालय / विद्यापीठ', 'College / University'),
      f('extraQual', 'इतर पात्रता', 'Other Qualification'),
    ],
  },
  {
    id: 'occupation', mr: 'व्यवसाय / नोकरी', en: 'Occupation',
    fields: [
      f('occupation', 'व्यवसाय / नोकरी', 'Occupation', 'text', { placeholder: 'सॉफ्टवेअर इंजिनिअर' }),
      f('company', 'कंपनी / संस्था', 'Company / Organisation'),
      f('workPlace', 'कामाचे ठिकाण', 'Work Location'),
      f('income', 'वार्षिक उत्पन्न', 'Annual Income', 'text', { placeholder: '₹ 8 लाख' }),
    ],
  },
  {
    id: 'family', mr: 'कौटुंबिक माहिती', en: 'Family Details',
    fields: [
      f('fatherName', 'वडिलांचे नाव', "Father's Name"),
      f('fatherOcc', 'वडिलांचा व्यवसाय', "Father's Occupation"),
      f('motherName', 'आईचे नाव', "Mother's Name"),
      f('motherOcc', 'आईचा व्यवसाय', "Mother's Occupation"),
      f('brothers', 'भाऊ', 'Brother(s)', 'text', { placeholder: '१ (अविवाहित)' }),
      f('sisters', 'बहीण', 'Sister(s)', 'text', { placeholder: '१ (विवाहित)' }),
      f('maternalUncle', 'मामा', 'Maternal Uncle'),
      f('nativePlace', 'मूळ गाव', 'Native Place'),
      f('property', 'शेती / मालमत्ता', 'Property / Land'),
    ],
  },
  {
    id: 'contact', mr: 'संपर्क', en: 'Contact Details',
    fields: [
      f('address', 'पत्ता', 'Address', 'textarea', { placeholder: 'फ्लॅट नं., सोसायटी, परिसर, शहर - पिन' }),
      f('phone', 'मोबाईल नंबर', 'Mobile Number', 'tel', { placeholder: '98XXXXXXXX' }),
      f('altPhone', 'पर्यायी नंबर', 'Alternate Number', 'tel'),
      f('email', 'ई-मेल', 'Email', 'email'),
    ],
  },
  {
    id: 'expectations', mr: 'विवाह विषयक अपेक्षा', en: 'Marriage Expectations',
    fields: [
      f('expectations', 'अपेक्षा', 'Expectations', 'textarea', {
        placeholder: 'उदा. सुशिक्षित, नोकरी करणारी, कौटुंबिक मूल्ये जपणारी वधू हवी.',
      }),
    ],
  },
];

// Used by "Fill sample data" so people can see a template instantly.
export const SAMPLE_VALUES = {
  name: 'प्रिया सुनील पाटील', dob: '1999-08-15', tob: '06:30', pob: 'पुणे', height: '5 फूट 4 इंच',
  weight: '55 किलो', complexion: 'गोरा', bloodGroup: 'B+', maritalStatus: 'अविवाहित', diet: 'शाकाहारी',
  religion: 'हिंदू', caste: '९६ कुळी मराठा', motherTongue: 'मराठी',
  rashi: 'कन्या', nakshatra: 'हस्त', charan: '२', gan: 'देव', nadi: 'मध्य', gotra: 'कश्यप',
  kuldaivat: 'जेजुरीचा खंडोबा', mangal: 'नाही',
  education: 'B.E. (Computer Engineering)', institute: 'पुणे विद्यापीठ, पुणे',
  occupation: 'सॉफ्टवेअर इंजिनिअर', company: 'Infosys, पुणे', income: '₹ 9 लाख',
  fatherName: 'श्री. सुनील बाळासाहेब पाटील', fatherOcc: 'शेती व व्यवसाय',
  motherName: 'सौ. सविता सुनील पाटील', motherOcc: 'गृहिणी',
  brothers: '१ (अविवाहित)', sisters: 'नाही', maternalUncle: 'श्री. रमेश जाधव, सातारा',
  nativePlace: 'कराड, जि. सातारा',
  address: 'सहकारनगर, पुणे - ४११००९', phone: '98XXXXXX10', email: 'priya.patil@example.com',
  expectations: 'सुशिक्षित, नोकरी करणारा, व्यसनमुक्त व कौटुंबिक मूल्ये जपणारा वर हवा.',
};
