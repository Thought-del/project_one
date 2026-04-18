import { SELECTORS, FORM_CONFIG, MESSAGES } from './constants.js';

let form, nameInput, phoneInput, messageInput, consentCheckbox;
const errorTimeouts = {};

function getErrorSpan(input) {
    if (input.type === 'checkbox') {
        const checkbox = input.closest('.custom-checkbox');
        return checkbox?.parentElement?.querySelector('.error-message');
    }
    
    const wrapper = input.closest('.form__field, .phone-input-wrapper, div');
    return wrapper?.querySelector('.error-message') || input.parentElement?.querySelector('.error-message');
}

/* РАСКОММЕНТИРОВАТЬ КОГДА НУЖНО БУДЕТ
function showError(input, message) {
    const errorSpan = getErrorSpan(input);
    if (!errorSpan) return;
    
    errorSpan.textContent = message;
    errorSpan.hidden = false;
    input.style.borderBottomColor = 'var(--color-error, #e74c3c)';
    input.setAttribute('aria-invalid', 'true');
    
    const timeoutId = `${input.id}-timeout`;
    if (errorTimeouts[timeoutId]) clearTimeout(errorTimeouts[timeoutId]);
    errorTimeouts[timeoutId] = setTimeout(() => hideError(input), 10000);
}

function hideError(input) {
    const errorSpan = getErrorSpan(input);
    if (errorSpan) {
        errorSpan.hidden = true;
        errorSpan.textContent = '';
    }
    input.style.borderBottomColor = '';
    input.setAttribute('aria-invalid', 'false');
    
    const timeoutId = `${input.id}-timeout`;
    if (errorTimeouts[timeoutId]) {
        clearTimeout(errorTimeouts[timeoutId]);
        delete errorTimeouts[timeoutId];
    }
}

function hideAllErrors() {
    [nameInput, phoneInput, messageInput, consentCheckbox].forEach(input => {
        if (input) hideError(input);
    });
}
*/

function validateName() {
    const value = nameInput.value.trim();
    if (!value) {
        // showError(nameInput, MESSAGES.nameRequired);
        return false;
    }
    if (value.length < FORM_CONFIG.nameMinLength) {
        // showError(nameInput, MESSAGES.nameMinLength);
        return false;
    }
    // hideError(nameInput);
    return true;
}

function validatePhone() {
    const value = phoneInput.value.trim();
    const digits = value.replace(/\D/g, '');
    
    if (!value) {
        // showError(phoneInput, MESSAGES.phoneRequired);
        return false;
    }
    if (digits.length < FORM_CONFIG.phoneMinDigits) {
        // showError(phoneInput, MESSAGES.phoneInvalid);
        return false;
    }
    // hideError(phoneInput);
    return true;
}

function validateMessage() {
    const value = messageInput.value.trim();
    if (!value) {
        // showError(messageInput, MESSAGES.messageRequired);
        return false;
    }
    if (value.length < FORM_CONFIG.messageMinLength) {
        // showError(messageInput, MESSAGES.messageMinLength);
        return false;
    }
    // hideError(messageInput);
    return true;
}

function validateConsent() {
    if (!consentCheckbox.checked) {
        // showError(consentCheckbox, MESSAGES.consentRequired);
        return false;
    }
    // hideError(consentCheckbox);
    return true;
}

function formatPhoneInput(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    
    let formatted = '+7 ';
    if (value.length > 1) formatted += `(${value.slice(1, 4)}`;
    if (value.length >= 4) formatted += `) ${value.slice(4, 7)}`;
    if (value.length >= 7) formatted += `-${value.slice(7, 9)}`;
    if (value.length >= 9) formatted += `-${value.slice(9, 11)}`;
    
    e.target.value = formatted;
}

function handleSubmit(e) {
    e.preventDefault();
    
    const isNameValid = validateName();
    const isPhoneValid = validatePhone();
    const isMessageValid = validateMessage();
    const isConsentValid = validateConsent();
    
    if (isNameValid && isPhoneValid && isMessageValid && isConsentValid) {
        console.log('✅ Форма валидна, отправка...');
        form.reset();
        // hideAllErrors();
    }
}

export function initFormValidation() {
    form = document.querySelector(SELECTORS.form);
    if (!form) return;
    
    nameInput = document.querySelector(SELECTORS.formName);
    phoneInput = document.querySelector(SELECTORS.formPhone);
    messageInput = document.querySelector(SELECTORS.formMessage);
    consentCheckbox = document.querySelector(SELECTORS.formConsent);
    
    if (phoneInput) {
        phoneInput.addEventListener('input', formatPhoneInput);
        phoneInput.addEventListener('blur', validatePhone);
    }
    
    nameInput?.addEventListener('blur', validateName);
    messageInput?.addEventListener('blur', validateMessage);
    consentCheckbox?.addEventListener('change', validateConsent);
    
    form.addEventListener('submit', handleSubmit);
}