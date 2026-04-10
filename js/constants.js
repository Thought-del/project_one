export const SELECTORS = {
    sliderTrack: '[data-slider-track]',
    slides: '[data-slide]',
    sliderPrev: '[data-slider-prev]',
    sliderNext: '[data-slider-next]',
    sliderContainer: '[data-slider-container]',
    lightbox: '[data-lightbox]',
    lightboxOverlay: '[data-lightbox-overlay]',
    lightboxClose: '[data-lightbox-close]',
    thumbnails: '[data-thumbnail]',
    form: '[data-form]',
    formSubmit: '[data-form-submit]',
    formName: '#form-name',
    formPhone: '#form-phone',
    formMessage: '#form-message',
    formConsent: '#form-consent',
    burger: '[data-burger]',
    mobileMenu: '[data-mobile-menu]',
    mobileClose: '[data-mobile-close]',
    mobileNavLinks: '[data-mobile-nav-link]',
    desktopNavLinks: '[data-nav-link]'
};
export const SLIDER_CONFIG = {
    speed: 5,
    fastTransitionDuration: 200,
    normalTransitionDuration: 500,
    visibleSlidesDesktop: 2,
    gap: 28,
    infiniteCopies: 4
};
export const FORM_CONFIG = {
    phonePattern: /^(\+7|7|8)?[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/,
    nameMinLength: 2,
    messageMinLength: 10
};
export const MESSAGES = {
    nameRequired: 'Обязательное поле',
    nameMinLength: 'Минимум 2 символа',
    phoneRequired: 'Обязательное поле',
    phoneInvalid: 'Неверный формат',
    messageRequired: 'Обязательное поле',
    messageMinLength: 'Минимум 10 символов',
    consentRequired: 'Требуется согласие',
    formSuccess: 'Спасибо! Мы свяжемся с вами',
    formError: 'Проверьте правильность заполнения'
};