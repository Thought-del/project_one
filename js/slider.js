// slider.js

import { SELECTORS, SLIDER_CONFIG } from './constants.js';
import { openLightboxFromSlide } from './lightbox.js';

let currentIndex = 0;
let autoInterval = null;
let isAutoPlaying = true;
let track, slides, prevBtn, nextBtn, slideWidth = 0, sliderContainer;
let reducedMotion = false;
let isMobile = false;

function checkMobile() {
    isMobile = window.innerWidth <= 768;
    return isMobile;
}

function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getSlideWidth() { 
    const slide = slides[0]; 
    return slide ? slide.offsetWidth + SLIDER_CONFIG.gap : 0; 
}

function updateTransform(instant = false) {
    if (!track) return;
    
    const offset = -currentIndex * slideWidth;
    
    if (instant) {
        track.style.transition = 'none';
        track.style.transform = `translateX(${offset}px)`;
        track.offsetHeight;
        track.style.transition = `transform ${SLIDER_CONFIG.normalTransitionDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
    } else {
        track.style.transform = `translateX(${offset}px)`;
    }
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

function nextSlide() {
    const maxIndex = slides.length - SLIDER_CONFIG.visibleSlidesDesktop;
    if (currentIndex < maxIndex) {
        currentIndex++;
    } else {
        currentIndex = 0;
    }
    updateTransform();
}

function prevSlide() {
    const maxIndex = slides.length - SLIDER_CONFIG.visibleSlidesDesktop;
    if (currentIndex > 0) {
        currentIndex--;
    } else {
        currentIndex = maxIndex;
    }
    updateTransform();
}

function startAutoPlay() {
    if (autoInterval) clearInterval(autoInterval);
    if (reducedMotion) return;
    
    autoInterval = setInterval(() => {
        if (isAutoPlaying) {
            nextSlide();
        }
    }, isMobile ? SLIDER_CONFIG.mobileAutoPlayInterval : SLIDER_CONFIG.autoPlayInterval);
}

function stopAutoPlay() {
    isAutoPlaying = false;
    if (autoInterval) clearInterval(autoInterval);
}

function resumeAutoPlay() {
    isAutoPlaying = true;
    startAutoPlay();
}

function handleButtonClick(callback) {
    stopAutoPlay();
    callback();
    setTimeout(() => {
        startAutoPlay();
    }, SLIDER_CONFIG.fastTransitionDuration);
}

function handleSlideClick(e) {
    const slide = e.target.closest('.slide');
    if (!slide) return;
    
    const slides = document.querySelectorAll(SELECTORS.slides);
    const slideIndex = Array.from(slides).indexOf(slide) + 1;
    
    const img = slide.querySelector('.slide__image-wrapper img');
    const imageSrc = img ? img.src : '';
    const title = slide.querySelector('h3')?.textContent || '';
    const desc = slide.querySelector('p')?.textContent || '';
    
    openLightboxFromSlide(title, desc, imageSrc, slideIndex);
}

export function initSlider() {
    reducedMotion = prefersReducedMotion();
    checkMobile();
    
    track = document.querySelector(SELECTORS.sliderTrack);
    slides = document.querySelectorAll(SELECTORS.slides);
    prevBtn = document.querySelector(SELECTORS.sliderPrev);
    nextBtn = document.querySelector(SELECTORS.sliderNext);
    sliderContainer = document.querySelector(SELECTORS.sliderContainer);
    
    if (!track || slides.length === 0) return;
    
    slideWidth = getSlideWidth();
    updateTransform(true);
    addMoreSlides();
    updateTransform(true);
    
    startAutoPlay();
    
    if (prevBtn) prevBtn.addEventListener('click', () => handleButtonClick(prevSlide));
    if (nextBtn) nextBtn.addEventListener('click', () => handleButtonClick(nextSlide));
    
    if (sliderContainer) {
        sliderContainer.addEventListener('click', handleSlideClick);
        sliderContainer.addEventListener('mouseenter', stopAutoPlay);
        sliderContainer.addEventListener('mouseleave', startAutoPlay);
    }
    
    window.addEventListener('resize', () => { 
        slideWidth = getSlideWidth();
        updateTransform(true);
    });
}