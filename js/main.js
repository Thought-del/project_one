import { initSlider } from './slider.js';
import { initLightbox } from './lightbox.js';
import { initFormValidation } from './validation.js';
import { initCountrySelector } from './country-selector.js';
function init3D() {
    const hero3d = document.querySelector('.hero__3d');
    const fallback = document.querySelector('.hero__3d-fallback');
    const prefersReducedMotion = false /* window.matchMedia('(prefers-reduced-motion: reduce)').matches; */
    if (prefersReducedMotion) {
        if (hero3d) hero3d.style.display = 'none';
        if (fallback) fallback.style.display = 'block';
    } else {
        if (hero3d) hero3d.style.display = 'block';
        if (fallback) fallback.style.display = 'none';
        if (typeof UnicornStudio !== 'undefined') UnicornStudio.init();
        else {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.1.6/dist/unicornStudio.umd.js';
            script.onload = () => UnicornStudio.init();
            document.head.appendChild(script);
        }
        if (hero3d) {
            hero3d.addEventListener('mouseenter', () => hero3d.style.zIndex = '20');
            hero3d.addEventListener('mouseleave', () => hero3d.style.zIndex = '1');
        }
    }
}
function init() {
    init3D();
    initSlider();
    initLightbox();
    initFormValidation();
    initCountrySelector();
}
document.addEventListener('DOMContentLoaded', init);