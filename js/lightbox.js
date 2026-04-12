// lightbox.js

import { SELECTORS } from './constants.js';

let lightbox;
let overlay;
let closeBtn;
let thumbnails;
let lightboxImage;
let lightboxTitle;
let lightboxDesc;

// Массив больших изображений для лайтбокса
const largeImages = {
    1: 'images/Rectangle 148.png',
    2: 'images/kfd.png',
    3: 'images/kfd2.png',
    4: 'images/kfd3.png',
    5: 'images/kfd4.png'
};

function openLightbox(title, desc, imageKey) {
    if (lightboxTitle && title) lightboxTitle.textContent = title;
    if (lightboxDesc && desc) lightboxDesc.textContent = desc;
    
    if (imageKey && lightboxImage && largeImages[imageKey]) {
        lightboxImage.src = largeImages[imageKey];
    } else if (thumbnails.length > 0 && lightboxImage) {
        const firstThumbKey = thumbnails[0].dataset.thumbnail;
        lightboxImage.src = largeImages[firstThumbKey] || largeImages[1];
        setActiveThumbnail(thumbnails[0]);
    }
    
    if (lightbox) lightbox.removeAttribute('hidden');
    if (overlay) overlay.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
}

function openLightboxFromSlide(title, desc, imageKey) {
    openLightbox(title, desc, imageKey);
}

function closeLightbox() {
    if (lightbox) lightbox.setAttribute('hidden', '');
    if (overlay) overlay.setAttribute('hidden', '');
    document.body.style.overflow = '';
}

function setActiveThumbnail(activeThumb) {
    thumbnails.forEach(thumb => {
        thumb.classList.remove('active');
    });
    activeThumb.classList.add('active');
}

function initLightbox() {
    lightbox = document.querySelector(SELECTORS.lightbox);
    overlay = document.querySelector(SELECTORS.lightboxOverlay);
    closeBtn = document.querySelector(SELECTORS.lightboxClose);
    thumbnails = document.querySelectorAll(SELECTORS.thumbnails);
    
    if (!lightbox) return;
    
    lightboxImage = lightbox.querySelector('.lightbox-image img');
    lightboxTitle = lightbox.querySelector('h2');
    lightboxDesc = lightbox.querySelector('p');
    
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', () => {
            const imageKey = thumb.dataset.thumbnail;
            const img = thumb.querySelector('img');
            const title = lightboxTitle?.textContent || '';
            const desc = lightboxDesc?.textContent || '';
            
            if (imageKey && lightboxImage && largeImages[imageKey]) {
                lightboxImage.src = largeImages[imageKey];
                setActiveThumbnail(thumb);
                if (lightboxTitle) lightboxTitle.textContent = title;
                if (lightboxDesc) lightboxDesc.textContent = desc;
            } else if (img && lightboxImage) {
                // fallback если нет largeImages
                lightboxImage.src = img.src;
                setActiveThumbnail(thumb);
            }
        });
    });
    
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (overlay) overlay.addEventListener('click', closeLightbox);
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox && !lightbox.hidden) {
            closeLightbox();
        }
    });
}

export { initLightbox, openLightbox, openLightboxFromSlide, closeLightbox };