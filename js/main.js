import { IS_DEV, isMobileOrTablet, prefersReducedMotion } from './modules/constants.js';
import { initSlider } from './modules/slider.js';
import { initLightbox } from './modules/lightbox.js';
import { initMenu } from './modules/menu.js';
import { initFormValidation } from './modules/validation.js';
import { initCountrySelector } from './modules/country-selector.js';
import { initConsultModal } from './modules/consult-modal.js';

if (IS_DEV) {
    window.__APP__ = {
        version: '1.0.0',
        modules: {}
    };
}

function init3D() {
    const hero3d = document.querySelector('.hero__3d');
    const fallback = document.querySelector('.hero__3d-fallback');
    
    if (!hero3d && !fallback) return;
    
    const isMobileTablet = isMobileOrTablet();
    const reducedMotion = prefersReducedMotion();
    
    if (reducedMotion || isMobileTablet) {
        if (hero3d) hero3d.style.display = 'none';
        if (fallback) fallback.style.display = 'block';
        if (IS_DEV) console.log('🎬 3D отключено:', reducedMotion ? 'reduced motion' : 'мобилка/планшет');
        return;
    }
    
    if (hero3d) hero3d.style.display = 'block';
    if (fallback) fallback.style.display = 'none';
    
    if (typeof UnicornStudio !== 'undefined') {
        UnicornStudio.init();
        if (IS_DEV) console.log('🦄 UnicornStudio инициализирован (был в кэше)');
    } else {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.1.6/dist/unicornStudio.umd.js';
        script.onload = () => {
            if (typeof UnicornStudio !== 'undefined') {
                UnicornStudio.init();
                if (IS_DEV) console.log('🦄 UnicornStudio загружен и инициализирован');
            }
        };
        document.head.appendChild(script);
    }
    
    if (hero3d) {
        hero3d.addEventListener('mouseenter', () => hero3d.style.zIndex = '20');
        hero3d.addEventListener('mouseleave', () => hero3d.style.zIndex = '1');
    }
}

function initCritical() {
    initSlider();
    initMenu();
    initFormValidation();
    initConsultModal(); // ← ВОТ ОНО
    
    if (IS_DEV) {
        console.log('✅ Критические модули инициализированы');
        window.__APP__.slider = 'initialized';
        window.__APP__.menu = 'initialized';
        window.__APP__.validation = 'initialized';
        window.__APP__.consultModal = 'initialized';
    }
}

function initDeferred() {
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            initLightbox();
            initCountrySelector();
            if (IS_DEV) console.log('⏳ Отложенные модули инициализированы');
        });
    } else {
        setTimeout(() => {
            initLightbox();
            initCountrySelector();
        }, 200);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    init3D();
    initCritical();
    initDeferred();
    
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', () => {
        init3D();
    });
    
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            init3D();
        }, 100);
    });
});

if (IS_DEV) {
    window.__APP__.reinit = {
        slider: initSlider,
        lightbox: initLightbox,
        menu: initMenu,
        validation: initFormValidation,
        consultModal: initConsultModal,
        threeD: init3D
    };
}