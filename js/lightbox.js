import { SELECTORS } from './constants.js';
let lightbox, overlay, closeBtn, thumbnails, lightboxImage, lightboxTitle, lightboxDesc;
function openLightbox(title, desc) {
    if (lightboxTitle && title) lightboxTitle.textContent = title;
    if (lightboxDesc && desc) lightboxDesc.textContent = desc;
    if (thumbnails.length > 0 && lightboxImage) {
        const firstThumbImg = thumbnails[0].querySelector('img');
        if (firstThumbImg) lightboxImage.src = firstThumbImg.src;
        setActiveThumbnail(thumbnails[0]);
    }
    if (lightbox) lightbox.removeAttribute('hidden');
    if (overlay) overlay.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
}
export function openLightboxFromSlide(title, desc) { openLightbox(title, desc); }
function closeLightbox() {
    if (lightbox) lightbox.setAttribute('hidden', '');
    if (overlay) overlay.setAttribute('hidden', '');
    document.body.style.overflow = '';
}
function setActiveThumbnail(activeThumb) {
    thumbnails.forEach(thumb => thumb.classList.remove('active'));
    activeThumb.classList.add('active');
}
export function initLightbox() {
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
            const img = thumb.querySelector('img');
            if (img && lightboxImage) { lightboxImage.src = img.src; setActiveThumbnail(thumb); }
        });
    });
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (overlay) overlay.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && lightbox && !lightbox.hidden) closeLightbox(); });
}