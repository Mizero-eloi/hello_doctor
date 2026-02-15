/**
 * HelloDoctor USSD Flow Definition
 * Matches HelloDoctor Telehealth Service Flow document.
 * Short code: *333#. All amounts in SSP (no $).
 */

import { getOrCreateSession } from './session.js';

// --- Welcome (after dial *333#) ---
const WELCOME_TEXT =
  'Welcome to HelloDoctor telehealth service. Please select a service:\n' +
  '1.\n' +
  'Doctor Consultation\n' +
  '2.\n' +
  'Specialist Appointment\n' +
  '3.\n' +
  'Laboratory\n' +
  '4.\n' +
  'Pharmacy\n' +
  '5.\n' +
  'Vaccination\n' +
  '6.\n' +
  'Ambulance\n' +
  '7.\n' +
  'Follow up';

// --- Doctor consultation: Self / Other ---
const DOCTOR_CONSULT_WHO =
  'Remote doctor consultation for:\n\n1. Self\n2. Other\n\n0. Back';

// --- Payment method (after Self) ---
const PAYMENT_METHOD_SELF =
  'Remote doctor consultation fee is SSP 20,000. Select payment method.\n\n' +
  '1. MoMo\n2. Insurance\n3. eWallet\n4. Back';

// --- Other: enter phone number ---
const OTHER_PHONE_PROMPT =
  'Remote doctor consultation fee is SSP 20,000. Enter phone number: 09xxxxxxxx.\n\n0. Back';

// --- PIN / details prompts (Self). User must enter value in input box and press Send before success. ---
const MOMO_PIN_SELF =
  'You are paying SSP 20,000 for remote doctor consultation for "Self". Enter MoMo PIN.\n\n(Enter PIN below and press Send)\n\n0. Back';
const INSURANCE_NUMBER_SELF =
  'You are crediting insurance service for remote doctor consultation. Enter Insurance Number.\n\n(Enter number below and press Send)\n\n0. Back';
const EWALLET_PIN_SELF =
  'You are paying SSP 20,000 for remote doctor consultation for MySelf. Enter eWallet PIN.\n\n(Enter PIN below and press Send)\n\n0. Back';

// --- Other: after phone, enter PIN ---
const OTHER_PIN_PROMPT =
  'You are paying SSP 20,000 for remote doctor consultation for "Other". Enter PIN.\n\n(Enter PIN below and press Send)\n\n0. Back';

// --- Success messages (Doctor Consultation) ---
const SUCCESS_SELF = 'Request for remote doctor consultation is successful. A doctor will call you shortly.';
const SUCCESS_OTHER = (phone) =>
  `Request for remote doctor consultation is successful. A doctor will call ${phone} shortly.`;

// --- Specialist Appointment (option 2) ---
const SPECIALIST_WHO =
  'Specialist Appointment for in-person consultation is for:\n\n1. Self\n2. Other\n\n0. Back';
const SPECIALIST_PAYMENT =
  'Appointment fee for in-person consultation with a specialist is SSP 40,000. Select payment method.\n\n' +
  '1. MoMo\n2. Insurance\n3. eWallet\n4. Back';
const SPECIALIST_MOMO_PIN =
  'You are paying SSP 40,000 for in-person consultation with specialist for "Self". Enter MoMo PIN.\n\n(Enter PIN below and press Send)\n\n0. Back';
const SPECIALIST_INSURANCE_NUMBER =
  'You are crediting insurance service for remote doctor consultation. Enter Insurance Number.\n\n(Enter number below and press Send)\n\n0. Back';
const SPECIALIST_EWALLET_PIN =
  'You are paying SSP 40,000 for in-person consultation with specialist for MySelf. Enter eWallet PIN.\n\n(Enter PIN below and press Send)\n\n0. Back';
const SPECIALIST_SUCCESS_SELF = 'Request for in-person consultation with a specialist is successful. A doctor will call you shortly.';
const SPECIALIST_OTHER_PHONE =
  'Specialist appointment fee is SSP 40,000. Enter phone number: 09xxxxxxxx.\n\n0. Back';
const SPECIALIST_OTHER_PIN =
  'You are paying SSP 40,000 for in-person consultation with specialist for "Other". Enter PIN.\n\n(Enter PIN below and press Send)\n\n0. Back';
const SPECIALIST_SUCCESS_OTHER = (phone) =>
  `Request for in-person consultation with a specialist is successful. A doctor will call ${phone} shortly.`;

// --- Laboratory (option 3) ---
const LABORATORY_SCREEN =
  'Laboratory test and transport costs are paid in cash during sample pickup.\n\n1. Accept\n2. Back';
const LABORATORY_PIN =
  'Laboratory sample pickup request fee is SSP 3000. Enter PIN.\n\n(Enter PIN below and press Send)\n\n0. Back';
const LABORATORY_SUCCESS = 'Request for lab sample pickup from your place is successful. Our lab staff will call you shortly.';

// --- Pharmacy (option 4) ---
const PHARMACY_SCREEN =
  'Pharmacy home/workplace delivery service cost per OTC drug is paid during home delivery.\n\n1. Accept\n2. Back';
const PHARMACY_PIN =
  'Pharmacy home delivery /workplace service request fee is SSP 3000. Enter PIN.\n\n(Enter PIN below and press Send)\n\n0. Back';
const PHARMACY_SUCCESS = 'Request for pharmacy home /workplace delivery service is successful. Our lab staff will call you shortly.';

// --- Vaccination (option 5) ---
const VACCINATION_SCREEN =
  'Vaccination service cost is paid during home /workplace immunization.\n\n1. Accept\n2. Back';
const VACCINATION_PIN =
  'Vaccination service request fee is SSP 3000. Enter PIN.\n\n(Enter PIN below and press Send)\n\n0. Back';
const VACCINATION_SUCCESS = 'Request for home /workplace vaccination service is successful. Our vaccination professional will contact you shortly.';

// --- Ambulance (option 6) ---
const AMBULANCE_SCREEN =
  'Ambulance transport service cost is paid in cash before or after emergency medical transportation.\n\n1. Accept\n2. Back';
const AMBULANCE_PIN =
  'Ambulance transport service request fee is SSP 3000. Enter PIN.\n\n(Enter PIN below and press Send)\n\n0. Back';
const AMBULANCE_SUCCESS = 'Request for ambulance transport service is successful. You will be contacted shortly.';

// --- Follow up (option 7) ---
const FOLLOWUP_SCREEN =
  'Request for a follow up call is successful. Select one to proceed:\n\n1. Speak to staff\n2. Back';
const FOLLOWUP_VOICEMAIL_TEXT =
  "Voicemail: 'Welcome to HelloDoctor telehealth service. Please wait as we direct you to speak to one of our staff.'";

export function getWelcomeText() {
  return WELCOME_TEXT;
}

/**
 * Process user input and return { text, end }.
 */
export function processInput(sessionId, input) {
  const session = getOrCreateSession(sessionId);
  const state = session.getState();
  const trimmed = String(input).trim();

  switch (state) {
    case 'WELCOME': {
      if (trimmed === '0') {
        return { text: 'Thank you for using HelloDoctor. Goodbye!', end: true };
      }
      if (trimmed === '1') {
        session.pushHistory('WELCOME');
        session.setState('DOCTOR_CONSULT_WHO');
        return { text: DOCTOR_CONSULT_WHO, end: false };
      }
      if (trimmed === '2') {
        session.pushHistory('WELCOME');
        session.setState('SPECIALIST_WHO');
        return { text: SPECIALIST_WHO, end: false };
      }
      if (trimmed === '3') {
        session.pushHistory('WELCOME');
        session.setState('LABORATORY');
        return { text: LABORATORY_SCREEN, end: false };
      }
      if (trimmed === '4') {
        session.pushHistory('WELCOME');
        session.setState('PHARMACY');
        return { text: PHARMACY_SCREEN, end: false };
      }
      if (trimmed === '5') {
        session.pushHistory('WELCOME');
        session.setState('VACCINATION');
        return { text: VACCINATION_SCREEN, end: false };
      }
      if (trimmed === '6') {
        session.pushHistory('WELCOME');
        session.setState('AMBULANCE');
        return { text: AMBULANCE_SCREEN, end: false };
      }
      if (trimmed === '7') {
        session.pushHistory('WELCOME');
        session.setState('FOLLOWUP');
        return { text: FOLLOWUP_SCREEN, end: false };
      }
      return { text: WELCOME_TEXT + '\n\nInvalid option. Please choose 1-7 or 0.', end: false };
    }

    case 'DOCTOR_CONSULT_WHO': {
      if (trimmed === '0') {
        session.goBack();
        return { text: WELCOME_TEXT, end: false };
      }
      if (trimmed === '1') {
        session.setData('forWho', 'Self');
        session.pushHistory('DOCTOR_CONSULT_WHO');
        session.setState('PAYMENT_METHOD');
        return { text: PAYMENT_METHOD_SELF, end: false };
      }
      if (trimmed === '2') {
        session.setData('forWho', 'Other');
        session.pushHistory('DOCTOR_CONSULT_WHO');
        session.setState('OTHER_ENTER_PHONE');
        return { text: OTHER_PHONE_PROMPT, end: false };
      }
      return { text: DOCTOR_CONSULT_WHO + '\n\nInvalid. Choose 1, 2 or 0 Back.', end: false };
    }

    case 'SPECIALIST_WHO': {
      if (trimmed === '0') {
        session.goBack();
        return { text: WELCOME_TEXT, end: false };
      }
      if (trimmed === '1') {
        session.setData('forWho', 'Self');
        session.pushHistory('SPECIALIST_WHO');
        session.setState('SPECIALIST_PAYMENT');
        return { text: SPECIALIST_PAYMENT, end: false };
      }
      if (trimmed === '2') {
        session.setData('forWho', 'Other');
        session.pushHistory('SPECIALIST_WHO');
        session.setState('SPECIALIST_OTHER_PHONE');
        return { text: SPECIALIST_OTHER_PHONE, end: false };
      }
      return { text: SPECIALIST_WHO + '\n\nInvalid. Choose 1, 2 or 0 Back.', end: false };
    }

    case 'SPECIALIST_PAYMENT': {
      if (trimmed === '0' || trimmed === '4') {
        session.goBack();
        session.setState('WELCOME');
        session.history = [];
        return { text: WELCOME_TEXT, end: false };
      }
      if (trimmed === '1') {
        session.setData('payment', 'MoMo');
        session.pushHistory('SPECIALIST_PAYMENT');
        session.setState('SPECIALIST_ENTER_MOMO_PIN');
        return { text: SPECIALIST_MOMO_PIN, end: false };
      }
      if (trimmed === '2') {
        session.setData('payment', 'Insurance');
        session.pushHistory('SPECIALIST_PAYMENT');
        session.setState('SPECIALIST_ENTER_INSURANCE_NUMBER');
        return { text: SPECIALIST_INSURANCE_NUMBER, end: false };
      }
      if (trimmed === '3') {
        session.setData('payment', 'eWallet');
        session.pushHistory('SPECIALIST_PAYMENT');
        session.setState('SPECIALIST_ENTER_EWALLET_PIN');
        return { text: SPECIALIST_EWALLET_PIN, end: false };
      }
      return { text: SPECIALIST_PAYMENT + '\n\nInvalid. Choose 1-4 or 0 Back.', end: false };
    }

    case 'SPECIALIST_ENTER_MOMO_PIN':
    case 'SPECIALIST_ENTER_EWALLET_PIN': {
      if (trimmed === '0') {
        session.goBack();
        return { text: SPECIALIST_PAYMENT, end: false };
      }
      if (trimmed.length < 4) {
        const cur = state === 'SPECIALIST_ENTER_MOMO_PIN' ? SPECIALIST_MOMO_PIN : SPECIALIST_EWALLET_PIN;
        return { text: cur + '\n\nEnter a valid PIN (at least 4 characters).', end: false };
      }
      session.clearBookingData();
      session.setState('WELCOME');
      session.history = [];
      return { text: SPECIALIST_SUCCESS_SELF, end: true };
    }

    case 'SPECIALIST_ENTER_INSURANCE_NUMBER': {
      if (trimmed === '0') {
        session.goBack();
        return { text: SPECIALIST_PAYMENT, end: false };
      }
      if (trimmed.length < 3) {
        return { text: SPECIALIST_INSURANCE_NUMBER + '\n\nEnter a valid Insurance Number (at least 3 characters).', end: false };
      }
      session.clearBookingData();
      session.setState('WELCOME');
      session.history = [];
      return { text: SPECIALIST_SUCCESS_SELF, end: true };
    }

    case 'SPECIALIST_OTHER_PHONE': {
      if (trimmed === '0') {
        session.goBack();
        return { text: SPECIALIST_WHO, end: false };
      }
      const digitsSpec = trimmed.replace(/\D/g, '');
      if (digitsSpec.length < 9) {
        return { text: SPECIALIST_OTHER_PHONE + '\n\nEnter a valid phone number (e.g. 09xxxxxxxx).', end: false };
      }
      session.setData('otherPhone', trimmed);
      session.pushHistory('SPECIALIST_OTHER_PHONE');
      session.setState('SPECIALIST_OTHER_PIN');
      return { text: SPECIALIST_OTHER_PIN, end: false };
    }

    case 'SPECIALIST_OTHER_PIN': {
      if (trimmed === '0') {
        session.goBack();
        return { text: SPECIALIST_OTHER_PHONE, end: false };
      }
      if (trimmed.length < 4) {
        return { text: SPECIALIST_OTHER_PIN + '\n\nEnter a valid PIN (at least 4 characters).', end: false };
      }
      const specialistPhone = session.getData('otherPhone') || '09xxxxxxxx';
      session.clearBookingData();
      session.setState('WELCOME');
      session.history = [];
      return { text: SPECIALIST_SUCCESS_OTHER(specialistPhone), end: true };
    }

    case 'PAYMENT_METHOD': {
      if (trimmed === '0' || trimmed === '4') {
        session.goBack();
        session.setState('WELCOME');
        session.history = [];
        return { text: WELCOME_TEXT, end: false };
      }
      if (trimmed === '1') {
        session.setData('payment', 'MoMo');
        session.pushHistory('PAYMENT_METHOD');
        session.setState('ENTER_MOMO_PIN');
        return { text: MOMO_PIN_SELF, end: false };
      }
      if (trimmed === '2') {
        session.setData('payment', 'Insurance');
        session.pushHistory('PAYMENT_METHOD');
        session.setState('ENTER_INSURANCE_NUMBER');
        return { text: INSURANCE_NUMBER_SELF, end: false };
      }
      if (trimmed === '3') {
        session.setData('payment', 'eWallet');
        session.pushHistory('PAYMENT_METHOD');
        session.setState('ENTER_EWALLET_PIN');
        return { text: EWALLET_PIN_SELF, end: false };
      }
      return { text: PAYMENT_METHOD_SELF + '\n\nInvalid. Choose 1-4 or 0 Back.', end: false };
    }

    case 'ENTER_MOMO_PIN':
    case 'ENTER_EWALLET_PIN': {
      if (trimmed === '0') {
        session.goBack();
        return { text: PAYMENT_METHOD_SELF, end: false };
      }
      if (trimmed.length < 4) {
        const cur = state === 'ENTER_MOMO_PIN' ? MOMO_PIN_SELF : EWALLET_PIN_SELF;
        return { text: cur + '\n\nEnter a valid PIN (at least 4 characters).', end: false };
      }
      session.clearBookingData();
      session.setState('WELCOME');
      session.history = [];
      return { text: SUCCESS_SELF, end: true };
    }

    case 'ENTER_INSURANCE_NUMBER': {
      if (trimmed === '0') {
        session.goBack();
        return { text: PAYMENT_METHOD_SELF, end: false };
      }
      if (trimmed.length < 3) {
        return { text: INSURANCE_NUMBER_SELF + '\n\nEnter a valid Insurance Number (at least 3 characters).', end: false };
      }
      session.clearBookingData();
      session.setState('WELCOME');
      session.history = [];
      return { text: SUCCESS_SELF, end: true };
    }

    case 'OTHER_ENTER_PHONE': {
      if (trimmed === '0') {
        session.goBack();
        return { text: DOCTOR_CONSULT_WHO, end: false };
      }
      const digits = trimmed.replace(/\D/g, '');
      if (digits.length < 9) {
        return { text: OTHER_PHONE_PROMPT + '\n\nEnter a valid phone number (e.g. 09xxxxxxxx).', end: false };
      }
      session.setData('otherPhone', trimmed);
      session.pushHistory('OTHER_ENTER_PHONE');
      session.setState('OTHER_ENTER_PIN');
      return { text: OTHER_PIN_PROMPT, end: false };
    }

    case 'LABORATORY': {
      if (trimmed === '0' || trimmed === '2') {
        session.goBack();
        return { text: WELCOME_TEXT, end: false };
      }
      if (trimmed === '1') {
        session.pushHistory('LABORATORY');
        session.setState('LABORATORY_ENTER_PIN');
        return { text: LABORATORY_PIN, end: false };
      }
      return { text: LABORATORY_SCREEN + '\n\nInvalid. Choose 1 or 2.', end: false };
    }

    case 'LABORATORY_ENTER_PIN': {
      if (trimmed === '0') {
        session.goBack();
        return { text: LABORATORY_SCREEN, end: false };
      }
      if (trimmed.length < 4) {
        return { text: LABORATORY_PIN + '\n\nEnter a valid PIN (at least 4 characters).', end: false };
      }
      session.setState('WELCOME');
      session.history = [];
      return { text: LABORATORY_SUCCESS, end: true };
    }

    case 'PHARMACY': {
      if (trimmed === '0' || trimmed === '2') {
        session.goBack();
        return { text: WELCOME_TEXT, end: false };
      }
      if (trimmed === '1') {
        session.pushHistory('PHARMACY');
        session.setState('PHARMACY_ENTER_PIN');
        return { text: PHARMACY_PIN, end: false };
      }
      return { text: PHARMACY_SCREEN + '\n\nInvalid. Choose 1 or 2.', end: false };
    }

    case 'PHARMACY_ENTER_PIN': {
      if (trimmed === '0') {
        session.goBack();
        return { text: PHARMACY_SCREEN, end: false };
      }
      if (trimmed.length < 4) {
        return { text: PHARMACY_PIN + '\n\nEnter a valid PIN (at least 4 characters).', end: false };
      }
      session.setState('WELCOME');
      session.history = [];
      return { text: PHARMACY_SUCCESS, end: true };
    }

    case 'VACCINATION': {
      if (trimmed === '0' || trimmed === '2') {
        session.goBack();
        return { text: WELCOME_TEXT, end: false };
      }
      if (trimmed === '1') {
        session.pushHistory('VACCINATION');
        session.setState('VACCINATION_ENTER_PIN');
        return { text: VACCINATION_PIN, end: false };
      }
      return { text: VACCINATION_SCREEN + '\n\nInvalid. Choose 1 or 2.', end: false };
    }

    case 'VACCINATION_ENTER_PIN': {
      if (trimmed === '0') {
        session.goBack();
        return { text: VACCINATION_SCREEN, end: false };
      }
      if (trimmed.length < 4) {
        return { text: VACCINATION_PIN + '\n\nEnter a valid PIN (at least 4 characters).', end: false };
      }
      session.setState('WELCOME');
      session.history = [];
      return { text: VACCINATION_SUCCESS, end: true };
    }

    case 'AMBULANCE': {
      if (trimmed === '0' || trimmed === '2') {
        session.goBack();
        return { text: WELCOME_TEXT, end: false };
      }
      if (trimmed === '1') {
        session.pushHistory('AMBULANCE');
        session.setState('AMBULANCE_ENTER_PIN');
        return { text: AMBULANCE_PIN, end: false };
      }
      return { text: AMBULANCE_SCREEN + '\n\nInvalid. Choose 1 or 2.', end: false };
    }

    case 'AMBULANCE_ENTER_PIN': {
      if (trimmed === '0') {
        session.goBack();
        return { text: AMBULANCE_SCREEN, end: false };
      }
      if (trimmed.length < 4) {
        return { text: AMBULANCE_PIN + '\n\nEnter a valid PIN (at least 4 characters).', end: false };
      }
      session.setState('WELCOME');
      session.history = [];
      return { text: AMBULANCE_SUCCESS, end: true };
    }

    case 'FOLLOWUP': {
      if (trimmed === '0' || trimmed === '2') {
        session.goBack();
        return { text: WELCOME_TEXT, end: false };
      }
      if (trimmed === '1') {
        session.pushHistory('FOLLOWUP');
        session.setState('FOLLOWUP_VOICEMAIL');
        return { text: FOLLOWUP_VOICEMAIL_TEXT + '\n\n0. Main Menu', end: false };
      }
      return { text: FOLLOWUP_SCREEN + '\n\nInvalid. Choose 1 or 2.', end: false };
    }

    case 'FOLLOWUP_VOICEMAIL': {
      if (trimmed === '0' || trimmed === '1') {
        session.setState('WELCOME');
        session.history = [];
        return { text: WELCOME_TEXT, end: false };
      }
      return { text: FOLLOWUP_VOICEMAIL_TEXT + '\n\nPress 0 for Main Menu.', end: false };
    }

    case 'OTHER_SERVICE': {
      if (trimmed === '0') {
        session.goBack();
        return { text: WELCOME_TEXT, end: false };
      }
      return { text: WELCOME_TEXT + '\n\nInvalid. Press 0 to go back.', end: false };
    }

    case 'OTHER_ENTER_PIN': {
      if (trimmed === '0') {
        session.goBack();
        return { text: OTHER_PHONE_PROMPT, end: false };
      }
      if (trimmed.length < 4) {
        return { text: OTHER_PIN_PROMPT + '\n\nEnter a valid PIN (at least 4 characters).', end: false };
      }
      const phone = session.getData('otherPhone') || '09xxxxxxxx';
      session.clearBookingData();
      session.setState('WELCOME');
      session.history = [];
      return { text: SUCCESS_OTHER(phone), end: true };
    }

    default:
      session.setState('WELCOME');
      session.history = [];
      return { text: WELCOME_TEXT, end: false };
  }
}

export function getInitialResponse(sessionId) {
  getOrCreateSession(sessionId);
  return { text: getWelcomeText(), end: false };
}
