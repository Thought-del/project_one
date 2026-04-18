import { SELECTORS, SLIDER_CONFIG, IS_DEV, isMobile, prefersReducedMotion } from './constants.js';
import { openLightboxFromSlide } from './lightbox.js';

let track, slides, prevBtn, nextBtn, sliderContainer;
let slideWidth = 0;
let mobile = false;
let reducedMotion = false;
let animationFrame = null;
let autoInterval = null;
let currentPosition = 0;
let isAutoScrolling = true;
let touchStartX = 0;
let isDragging = false;
let resumeTimeout = null;
let resizeTimer = null;

const PAUSE_AFTER_CLICK = 5000;

function log(...args) {
    if (IS_DEV) console.log(...args);
}

function checkMobile() {
    mobile = isMobile();
    return mobile;
}

function checkReducedMotion() {
    reducedMotion = prefersReducedMotion();
    return reducedMotion;
}

function getSlideWidth() { 
    const slide = slides[0]; 
    return slide ? slide.offsetWidth + SLIDER_CONFIG.gap : 0; 
}

function cloneSlidesForInfinite() {
    if (!track || slides.length === 0) return;
    
    const originalSlides = Array.from(document.querySelectorAll(`${SELECTORS.slides}:not([data-clone])`));
    
    for (let i = 0; i < SLIDER_CONFIG.infiniteCopies; i++) {
        originalSlides.forEach(slide => {
            const clone = slide.cloneNode(true);
            clone.setAttribute('data-clone', 'true');
            clone.setAttribute('data-slide', '');
            track.appendChild(clone);
        });
    }
    
    slides = document.querySelectorAll(SELECTORS.slides);
}

function startDesktopScroll() {
    // НЕ ЗАПУСКАЕМ если reducedMotion или мобилка или уже выключено
    if (mobile || reducedMotion || !isAutoScrolling) return;
    
    if (resumeTimeout) {
        clearTimeout(resumeTimeout);
        resumeTimeout = null;
    }
    
    log('▶️ Десктоп: плавная прокрутка');
    
    function scroll() {
        if (!isAutoScrolling || mobile || reducedMotion) {
            animationFrame = null;
            return;
        }
        
        currentPosition += SLIDER_CONFIG.scrollSpeed;
        const totalWidth = (slideWidth * slides.length) / (SLIDER_CONFIG.infiniteCopies + 1);
        
        if (currentPosition >= totalWidth) currentPosition = 0;
        
        track.style.transform = `translateX(${-currentPosition}px)`;
        animationFrame = requestAnimationFrame(scroll);
    }
    
    if (animationFrame) cancelAnimationFrame(animationFrame);
    animationFrame = requestAnimationFrame(scroll);
}

function startMobileAutoPlay() {
    // НЕ ЗАПУСКАЕМ если не мобилка, reducedMotion или выключено
    if (!mobile || reducedMotion || !isAutoScrolling) return;
    
    if (autoInterval) clearInterval(autoInterval);
    if (resumeTimeout) {
        clearTimeout(resumeTimeout);
        resumeTimeout = null;
    }
    
    log('📱 Мобилка: дискретная автопрокрутка');
    
    autoInterval = setInterval(() => {
        if (!isAutoScrolling || !mobile || reducedMotion) return;
        
        const totalWidth = (slideWidth * slides.length) / (SLIDER_CONFIG.infiniteCopies + 1);
        currentPosition += slideWidth;
        if (currentPosition >= totalWidth) currentPosition = 0;
        
        track.style.transition = `transform ${SLIDER_CONFIG.normalTransitionDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
        track.style.transform = `translateX(${-currentPosition}px)`;
        
        setTimeout(() => track.style.transition = 'none', SLIDER_CONFIG.normalTransitionDuration);
    }, SLIDER_CONFIG.mobileAutoPlayInterval);
}

function stopAutoScroll() {
    isAutoScrolling = false;
    if (animationFrame) cancelAnimationFrame(animationFrame);
    if (autoInterval) clearInterval(autoInterval);
    animationFrame = null;
    autoInterval = null;
}

function pauseAutoScroll() {
    stopAutoScroll();
    if (resumeTimeout) clearTimeout(resumeTimeout);
    
    resumeTimeout = setTimeout(() => {
        isAutoScrolling = true;
        mobile ? startMobileAutoPlay() : startDesktopScroll();
        resumeTimeout = null;
    }, PAUSE_AFTER_CLICK);
}

function moveSlider(direction) {
    const step = mobile ? slideWidth : slideWidth * 2;
    const totalWidth = (slideWidth * slides.length) / (SLIDER_CONFIG.infiniteCopies + 1);
    
    currentPosition += direction * step;
    if (currentPosition < 0) currentPosition = totalWidth + currentPosition;
    if (currentPosition >= totalWidth) currentPosition -= totalWidth;
    
    track.style.transition = `transform ${SLIDER_CONFIG.normalTransitionDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
    track.style.transform = `translateX(${-currentPosition}px)`;
    
    setTimeout(() => track.style.transition = 'none', SLIDER_CONFIG.normalTransitionDuration);
}

function handlePrevClick() {
    stopAutoScroll();
    pauseAutoScroll();
    moveSlider(-1);
}

function handleNextClick() {
    stopAutoScroll();
    pauseAutoScroll();
    moveSlider(1);
}

function handleSlideClick(e) {
    const slide = e.target.closest('.slide');
    if (!slide) return;
    
    const allSlides = document.querySelectorAll(SELECTORS.slides);
    const slideIndex = Array.from(allSlides).indexOf(slide) + 1;
    const img = slide.querySelector('.slide__image-wrapper img');
    
    openLightboxFromSlide(
        slide.querySelector('h3')?.textContent || '',
        slide.querySelector('p')?.textContent || '',
        img?.src || '',
        slideIndex
    );
}

function handleTouchStart(e) {
    if (!mobile) return;
    
    isDragging = true;
    touchStartX = e.changedTouches[0].screenX;
    if (autoInterval) clearInterval(autoInterval);
    if (resumeTimeout) clearTimeout(resumeTimeout);
    track.style.transition = 'none';
}

function handleTouchMove(e) {
    if (!mobile || !isDragging) return;
    
    const diff = e.changedTouches[0].screenX - touchStartX;
    track.style.transform = `translateX(${-(currentPosition - diff)}px)`;
}

function handleTouchEnd(e) {
    if (!mobile || !isDragging) return;
    
    isDragging = false;
    const swipeDistance = e.changedTouches[0].screenX - touchStartX;
    const totalWidth = (slideWidth * slides.length) / (SLIDER_CONFIG.infiniteCopies + 1);
    
    track.style.transition = `transform ${SLIDER_CONFIG.normalTransitionDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
    
    if (Math.abs(swipeDistance) > SLIDER_CONFIG.swipeThreshold) {
        currentPosition += swipeDistance > 0 ? -slideWidth : slideWidth;
        if (currentPosition < 0) currentPosition = totalWidth - slideWidth;
        if (currentPosition >= totalWidth) currentPosition = 0;
    }
    
    track.style.transform = `translateX(${-currentPosition}px)`;
    
    setTimeout(() => {
        track.style.transition = 'none';
        if (mobile && isAutoScrolling && !reducedMotion) startMobileAutoPlay();
    }, SLIDER_CONFIG.normalTransitionDuration);
}

function handleResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        const wasMobile = mobile;
        checkMobile();
        checkReducedMotion();
        slideWidth = getSlideWidth();
        
        stopAutoScroll();
        isAutoScrolling = true;
        
        if (resumeTimeout) clearTimeout(resumeTimeout);
        
        if (mobile) {
            startMobileAutoPlay();
        } else {
            startDesktopScroll();
        }
        
        log('🔄 Режим сменён:', wasMobile ? 'мобилка → десктоп' : 'десктоп → мобилка');
    }, 100);
}

export function initSlider() {
    checkMobile();
    checkReducedMotion();
    
    track = document.querySelector(SELECTORS.sliderTrack);
    slides = document.querySelectorAll(SELECTORS.slides);
    prevBtn = document.querySelector(SELECTORS.sliderPrev);
    nextBtn = document.querySelector(SELECTORS.sliderNext);
    sliderContainer = document.querySelector(SELECTORS.sliderContainer);
    
    if (!track || slides.length === 0) {
        console.error('❌ Слайдер не запущен');
        return;
    }
    
    cloneSlidesForInfinite();
    slideWidth = getSlideWidth();
    
    track.style.transform = 'translateX(0px)';
    
    if (mobile) {
        startMobileAutoPlay();
    } else {
        startDesktopScroll();
    }
    
    prevBtn?.addEventListener('click', handlePrevClick);
    nextBtn?.addEventListener('click', handleNextClick);
    
    if (sliderContainer) {
        sliderContainer.addEventListener('click', handleSlideClick);
        sliderContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
        sliderContainer.addEventListener('touchmove', handleTouchMove, { passive: true });
        sliderContainer.addEventListener('touchend', handleTouchEnd, { passive: true });
    }
    
    window.addEventListener('resize', handleResize);
    
    // Слушаем изменение prefers-reduced-motion
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
        checkReducedMotion();
        stopAutoScroll();
        isAutoScrolling = true;
        mobile ? startMobileAutoPlay() : startDesktopScroll();
    });
}