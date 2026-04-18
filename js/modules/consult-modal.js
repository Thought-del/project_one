import { SELECTORS } from './constants.js';

let modal, overlay, closeBtn, container, form;
let lastActiveElement = null;

function openModal() {
    if (!modal) return;
    
    lastActiveElement = document.activeElement;
    modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    document.body.setAttribute('aria-hidden', 'true');
    modal.setAttribute('aria-hidden', 'false');
    
    const firstInput = modal.querySelector('input');
    if (firstInput) firstInput.focus();
}

function closeModal() {
    if (!modal) return;
    
    modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
    document.body.removeAttribute('aria-hidden');
    modal.setAttribute('aria-hidden', 'true');
    
    if (lastActiveElement?.focus) {
        lastActiveElement.focus();
        lastActiveElement = null;
    }
}

function handleSubmit(e) {
    e.preventDefault();
    console.log('Форма консультации отправлена');
    // Здесь будет отправка на сервер
}

function initConsultModal() {
    modal = document.querySelector(SELECTORS.consultModal);
    if (!modal) return;
    
    overlay = modal.querySelector(SELECTORS.consultOverlay);
    closeBtn = modal.querySelector(SELECTORS.consultClose);
    container = modal.querySelector('.consult-modal__container');
    form = modal.querySelector(SELECTORS.consultForm);
    
    const triggers = document.querySelectorAll(SELECTORS.consultTriggers);
    
    triggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    });
    
    if (overlay) overlay.addEventListener('click', closeModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && !modal.hasAttribute('hidden')) {
            closeModal();
        }
    });
    
    if (container) {
        container.addEventListener('click', (e) => e.stopPropagation());
    }
    
    if (form) {
        form.addEventListener('submit', handleSubmit);
    }
}

export { initConsultModal };