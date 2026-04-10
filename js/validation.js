// validation.js

import { SELECTORS, FORM_CONFIG, MESSAGES } from './constants.js';

let form, nameInput, phoneInput, messageInput, consentCheckbox, submitBtn;
let errorTimeouts = {};

// Функция для получения спана ошибки рядом с элементом
/* function getErrorSpan(input) {
    // Для чекбокса — ищем спан после .custom-checkbox
    if (input.type === 'checkbox') {
        return input.closest('.custom-checkbox')?.nextElementSibling?.classList.contains('error-message') 
            ? input.closest('.custom-checkbox').nextElementSibling 
            : null;
    }
    // Для текстовых полей — ищем следующий элемент с классом error-message
    let sibling = input.nextElementSibling;
    while (sibling) {
        if (sibling.classList?.contains('error-message')) return sibling;
        sibling = sibling.nextElementSibling;
    }
    return null;
} */

/* function showError(input, message) {
    const errorSpan = getErrorSpan(input);
    if (!errorSpan) return;
    
    // Если ошибка уже висит и текст тот же — не создаём новую
    if (!errorSpan.hidden && errorSpan.textContent === message) return;
    
    errorSpan.textContent = message;
    errorSpan.hidden = false;
    input.style.borderBottomColor = 'var(--color-error)';
    input.setAttribute('aria-invalid', 'true');
    
    // Автоскрытие через 10 секунд
    const timeoutId = `${input.id}-timeout`;
    if (errorTimeouts[timeoutId]) clearTimeout(errorTimeouts[timeoutId]);
    errorTimeouts[timeoutId] = setTimeout(() => hideError(input), 10000);
} */

/* function hideError(input) {
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
} */

function hideAllErrors() {
    document.querySelectorAll('.error-message').forEach(span => {
        span.hidden = true;
        span.textContent = '';
    });
    [nameInput, phoneInput, messageInput].forEach(input => {
        if (input) {
            input.style.borderBottomColor = '';
            input.setAttribute('aria-invalid', 'false');
        }
    });
    if (consentCheckbox) {
        consentCheckbox.style.borderBottomColor = '';
        consentCheckbox.setAttribute('aria-invalid', 'false');
    }
}

function validateName() {
    const value = nameInput.value.trim();
    if (value === '') return false;
    if (value.length < FORM_CONFIG.nameMinLength) return false;
    return true;
}

function validatePhone() {
    const value = phoneInput.value.trim();
    if (value === '') return false;
    const digits = value.replace(/\D/g, '');
    return digits.length >= 10;
}

function validateMessage() {
    const value = messageInput.value.trim();
    if (value === '') return false;
    if (value.length < FORM_CONFIG.messageMinLength) return false;
    return true;
}

function validateConsent() {
    return consentCheckbox.checked;
}

function validateFormAndShowErrors() {
    // Сначала скрываем все старые ошибки
    /* hideAllErrors(); */
    
    let isValid = true;
    
    if (!validateName()) {
        /* showError(nameInput, MESSAGES.nameRequired); */
        isValid = false;
    }
    
    if (!validatePhone()) {
        /* showError(phoneInput, MESSAGES.phoneInvalid); */
        isValid = false;
    }
    
    if (!validateMessage()) {
        /* showError(messageInput, MESSAGES.messageRequired); */
        isValid = false;
    }
    
    if (!validateConsent()) {
        /* showError(consentCheckbox, MESSAGES.consentRequired); */
        isValid = false;
    }
    
    return isValid;
}

function showSuccessMessage() {
    /* const div = document.createElement('div');
    div.className = 'form-success';
    div.textContent = MESSAGES.formSuccess;
    div.style.cssText = 'background:var(--color-success);color:#fff;padding:12px 20px;border-radius:8px;margin-bottom:20px;text-align:center';
    form.insertBefore(div, form.firstChild);
    setTimeout(() => div.remove(), 5000); */
}

function showErrorMessage() {
    /* const div = document.createElement('div');
    div.className = 'form-error';
    div.textContent = MESSAGES.formError;
    div.style.cssText = 'background:var(--color-error);color:#fff;padding:12px 20px;border-radius:8px;margin-bottom:20px;text-align:center';
    form.insertBefore(div, form.firstChild);
    setTimeout(() => div.remove(), 5000); */
}

function handleSubmit(e) {
    e.preventDefault();
    if (validateFormAndShowErrors()) {
        /* showSuccessMessage(); */
        form.reset();
        /* hideAllErrors(); */
    } /* else {
        showErrorMessage();
    } */
}

export function initFormValidation() {
    form = document.querySelector(SELECTORS.form);
    if (!form) return;
    
    nameInput = document.querySelector(SELECTORS.formName);
    phoneInput = document.querySelector(SELECTORS.formPhone);
    messageInput = document.querySelector(SELECTORS.formMessage);
    consentCheckbox = document.querySelector(SELECTORS.formConsent);
    submitBtn = document.querySelector(SELECTORS.formSubmit);
    
    if (form) form.addEventListener('submit', handleSubmit);
}