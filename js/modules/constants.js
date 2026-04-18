// ===== СЕЛЕКТОРЫ =====
export const SELECTORS = {
    // Slider
    sliderTrack: '[data-slider-track]',
    slides: '[data-slide]',
    sliderPrev: '[data-slider-prev]',
    sliderNext: '[data-slider-next]',
    sliderContainer: '[data-slider-container]',
    
    // Lightbox
    lightbox: '[data-lightbox]',
    lightboxOverlay: '[data-lightbox-overlay]',
    lightboxClose: '[data-lightbox-close]',
    lightboxThumbnails: '.lightbox-thumbnails',
    
    // Form
    form: '[data-form]',
    formName: '#form-name',
    formPhone: '#form-phone',
    formMessage: '#form-message',
    formConsent: '#form-consent',
    
    // Mobile Menu
    burger: '[data-mobile-open]',
    mobileMenu: '[data-mobile-menu]',
    mobileClose: '[data-mobile-close]',
    mobileNavLinks: '[data-mobile-nav-link]',
    
    // Consult Modal
    consultModal: '[data-consult-modal]',
    consultOverlay: '[data-consult-overlay]',
    consultClose: '[data-consult-close]',
    consultForm: '[data-consult-form]',
    consultTriggers: '[data-consult], [data-phone-open]',
    
    // Country Selector
    countryDropdown: '[data-country-dropdown]',
    countrySelector: '[data-country-selector]',
    countryCode: '[data-country-code]'
};

// ===== КОНФИГ СЛАЙДЕРА =====
export const SLIDER_CONFIG = {
    scrollSpeed: 5,
    mobileAutoPlayInterval: 4000,
    fastTransitionDuration: 200,
    normalTransitionDuration: 500,
    visibleSlidesDesktop: 2,
    gap: 28,
    infiniteCopies: 4,
    swipeThreshold: 50
};

// ===== КОНФИГ ФОРМЫ =====
export const FORM_CONFIG = {
    nameMinLength: 2,
    messageMinLength: 10,
    phoneMinDigits: 10
};

// ===== СООБЩЕНИЯ ОШИБОК =====
export const MESSAGES = {
    nameRequired: 'Введите имя',
    nameMinLength: 'Минимум 2 символа',
    phoneRequired: 'Введите телефон',
    phoneInvalid: 'Неверный формат телефона',
    messageRequired: 'Введите сообщение',
    messageMinLength: 'Минимум 10 символов',
    consentRequired: 'Необходимо согласие',
    formSuccess: 'Заявка отправлена! Скоро свяжемся',
    formError: 'Проверьте правильность заполнения'
};

// ===== ФЛАГ ДЕБАГА =====
export const IS_DEV = false;

// ===== УТИЛИТЫ =====
export function isMobile() {
    return window.innerWidth <= 768;
}

export function isMobileOrTablet() {
    return window.innerWidth <= 1024;
}

export function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}