// slider.js

import { SELECTORS, SLIDER_CONFIG } from './constants.js';
import { openLightboxFromSlide } from './lightbox.js';

let currentPosition = 0, animationId = null, lastTimestamp = 0, isAutoPlaying = true;
let track, slides, prevBtn, nextBtn, slideWidth = 0, sliderContainer;
let reducedMotion = false;
let isMobile = false;

function checkMobile() {
    isMobile = window.innerWidth <= 768;
    return isMobile;
}

function getSlideWidth() { 
    const slide = slides[0]; 
    return slide ? slide.offsetWidth + SLIDER_CONFIG.gap : 0; 
}

function addMoreSlides() {
    if (!track || slides.length === 0) return;
    const originalSlides = Array.from(document.querySelectorAll(SELECTORS.slides + ':not([data-clone])'));
    originalSlides.forEach(slide => { 
        const clone = slide.cloneNode(true); 
        clone.setAttribute('data-clone', 'true'); 
        track.appendChild(clone); 
    });
    slides = document.querySelectorAll(SELECTORS.slides);
    slideWidth = getSlideWidth();
}

function updateTransform() { 
    if (track) track.style.transform = `translateX(${currentPosition}px)`; 
}

function checkAndAddMore() {
    const totalWidth = slides.length * slideWidth;
    const remainingWidth = totalWidth + currentPosition;
    const threshold = SLIDER_CONFIG.visibleSlidesDesktop * slideWidth * 2;
    if (remainingWidth < threshold) addMoreSlides();
}

function smoothAutoPlay(timestamp) {
    // На мобилках автопрокрутку отключаем
    if (!isAutoPlaying || reducedMotion || isMobile) { 
        animationId = requestAnimationFrame(smoothAutoPlay); 
        return; 
    }
    if (!lastTimestamp) { 
        lastTimestamp = timestamp; 
        animationId = requestAnimationFrame(smoothAutoPlay); 
        return; 
    }
    const delta = Math.min(timestamp - lastTimestamp, 50);
    const step = SLIDER_CONFIG.speed * (delta / 16.67);
    currentPosition -= step;
    checkAndAddMore();
    updateTransform();
    lastTimestamp = timestamp;
    animationId = requestAnimationFrame(smoothAutoPlay);
}

function startAutoPlay() { 
    if (reducedMotion || isMobile) return;
    if (animationId) cancelAnimationFrame(animationId); 
    isAutoPlaying = true; 
    lastTimestamp = 0; 
    animationId = requestAnimationFrame(smoothAutoPlay); 
}

function stopAutoPlay() { 
    isAutoPlaying = false; 
}

function nextSlide() {
    if (reducedMotion || isMobile) {
        currentPosition -= slideWidth;
        checkAndAddMore();
        updateTransform();
        return;
    }
    stopAutoPlay();
    currentPosition -= slideWidth;
    checkAndAddMore();
    track.style.transition = `transform ${SLIDER_CONFIG.fastTransitionDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
    updateTransform();
    setTimeout(() => { 
        track.style.transition = `transform ${SLIDER_CONFIG.normalTransitionDuration}ms linear`; 
        startAutoPlay(); 
    }, SLIDER_CONFIG.fastTransitionDuration);
}

function prevSlide() {
    if (reducedMotion || isMobile) {
        currentPosition += slideWidth;
        updateTransform();
        return;
    }
    stopAutoPlay();
    currentPosition += slideWidth;
    track.style.transition = `transform ${SLIDER_CONFIG.fastTransitionDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
    updateTransform();
    setTimeout(() => { 
        track.style.transition = `transform ${SLIDER_CONFIG.normalTransitionDuration}ms linear`; 
        startAutoPlay(); 
    }, SLIDER_CONFIG.fastTransitionDuration);
}

function handleSlideClick(e) {
    const slide = e.target.closest('.slide');
    if (!slide) return;
    const title = slide.querySelector('h3')?.textContent || '';
    const desc = slide.querySelector('p')?.textContent || '';
    openLightboxFromSlide(title, desc);
}

export function initSlider() {
    reducedMotion = false; /* window.matchMedia('(prefers-reduced-motion: reduce)').matches; */
    checkMobile();
    
    track = document.querySelector(SELECTORS.sliderTrack);
    slides = document.querySelectorAll(SELECTORS.slides);
    prevBtn = document.querySelector(SELECTORS.sliderPrev);
    nextBtn = document.querySelector(SELECTORS.sliderNext);
    sliderContainer = document.querySelector(SELECTORS.sliderContainer);
    
    if (!track || slides.length === 0) return;
    
    slideWidth = getSlideWidth();
    currentPosition = 0;
    updateTransform();
    addMoreSlides();
    
    // На мобилках автопрокрутку не запускаем
    if (!reducedMotion && !isMobile) {
        startAutoPlay();
    }
    
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    
    if (sliderContainer) {
        if (!reducedMotion && !isMobile) {
            sliderContainer.addEventListener('mouseenter', stopAutoPlay);
            sliderContainer.addEventListener('mouseleave', startAutoPlay);
        }
        sliderContainer.addEventListener('click', handleSlideClick);
    }
    
    window.addEventListener('resize', () => { 
        const wasMobile = isMobile;
        checkMobile();
        slideWidth = getSlideWidth();
        updateTransform();
        
        // Если изменилось с десктопа на мобилку или наоборот
        if (wasMobile !== isMobile) {
            if (isMobile || reducedMotion) {
                stopAutoPlay();
            } else {
                startAutoPlay();
            }
        }
    });
}