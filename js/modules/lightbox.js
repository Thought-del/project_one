import { SELECTORS } from './constants.js';

let lightbox, overlay, closeBtn, thumbnailsContainer, lightboxImage, lightboxTitle, lightboxDesc;
let currentThumbnails = [];
let currentIndex = 0;

const slidesThumbnails = {
    1: ['images/slide1/B3389237-FC61-4BE2-9C70-F770AFFCBB6A.jpeg', 'images/slide1/15937D36-A714-401F-9669-D376D81D1FB8.jpeg', 'images/slide1/50451211-25D1-4013-91A5-76D34A647446.jpeg', 'images/slide1/C3B7059A-40FA-498D-BCC9-DB35BFA20F0C.jpeg', 'images/slide1/FAE73CFC-23E3-4A2D-A5E3-642E78DB4792.jpeg'],
    2: ['images/slide2/F7332D93-1E75-46B7-8DAC-5AB401679719.jpeg', 'images/slide2/62A84D71-ADEA-41CC-AF8A-A454C45DE491.jpeg', 'images/slide2/A146B87C-D0CE-47D0-AB19-4FE3CFD725C0.jpeg', 'images/slide2/F5E7F8E7-D2C2-46CD-964D-C8A9F6A1615F.jpeg'],
    3: ['images/slide3/A61C5EAE-55E8-402D-B2C9-477D9BD56970.jpeg', 'images/slide3/3F611454-05D6-4A17-996A-D0225258A8B4.jpeg', 'images/slide3/A50D51A1-2285-4256-B907-17003B764BBF.jpeg', 'images/slide3/AD2BAD1C-2058-4420-8439-3F83D7567C64.jpeg', 'images/slide3/CBBF3A0E-A4EA-46EC-8889-6AA639074F30.jpeg', 'images/slide3/DF72658A-8FAD-49E9-8C0C-CB43D1AC0C59.jpeg', 'images/slide3/F178C607-A4A0-47A8-B4B0-08D51486BBFC.jpeg'],
    4: ['images/slide4/42363671-F6BA-4B08-865A-C7A85B36DC68.jpeg', 'images/slide4/3B48DA09-0D4E-4038-8EBB-B75E2FF3EC33.jpeg', 'images/slide4/76A17635-906A-4E02-86A4-8CEADF678445.jpeg', 'images/slide4/98CD2BD8-54D5-4C78-87B9-79E595DB2F47.jpeg', 'images/slide4/B68F0B31-533C-4A75-AB78-89DA518F2610.jpeg', 'images/slide4/C21DD57D-F065-4141-858D-8792A9D264F7.jpeg']
};

function renderThumbnails(thumbnailsArray, activeIndex = 0) {
    if (!thumbnailsContainer) return;
    
    currentThumbnails = thumbnailsArray;
    thumbnailsContainer.innerHTML = '';
    
    thumbnailsArray.forEach((src, idx) => {
        const thumbBtn = document.createElement('button');
        thumbBtn.type = 'button';
        thumbBtn.className = 'thumbnail';
        thumbBtn.dataset.index = idx;
        thumbBtn.setAttribute('aria-label', `Миниатюра ${idx + 1}`);
        
        const thumbImg = document.createElement('img');
        thumbImg.src = src;
        thumbImg.width = 186;
        thumbImg.height = 123;
        thumbImg.alt = `Интерьер ${idx + 1}`;
        thumbImg.loading = 'lazy';
        
        thumbBtn.appendChild(thumbImg);
        
        thumbBtn.addEventListener('click', () => {
            if (lightboxImage) lightboxImage.src = src;
            currentIndex = idx;
            setActiveThumbnail(thumbBtn);
            preloadAdjacentImages(idx);
        });
        
        thumbnailsContainer.appendChild(thumbBtn);
    });
    
    const thumbs = thumbnailsContainer.querySelectorAll('.thumbnail');
    if (thumbs[activeIndex]) setActiveThumbnail(thumbs[activeIndex]);
}

function setActiveThumbnail(activeThumb) {
    thumbnailsContainer?.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.classList.remove('active');
        thumb.setAttribute('aria-current', 'false');
    });
    activeThumb.classList.add('active');
    activeThumb.setAttribute('aria-current', 'true');
}

function preloadAdjacentImages(index) {
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.as = 'image';
    
    if (currentThumbnails[index + 1]) {
        preloadLink.href = currentThumbnails[index + 1];
        document.head.appendChild(preloadLink);
    }
}

function openLightbox(slideIndex, bigImageSrc, title, desc) {
    if (!lightbox) return;
    
    if (lightboxTitle) lightboxTitle.textContent = title;
    if (lightboxDesc) lightboxDesc.textContent = desc;
    if (lightboxImage && bigImageSrc) lightboxImage.src = bigImageSrc;
    
    let originalIndex = slideIndex > 4 ? ((slideIndex - 1) % 4) + 1 : slideIndex;
    currentIndex = 0;
    
    const thumbnailsArray = slidesThumbnails[originalIndex] || [];
    renderThumbnails(thumbnailsArray);
    
    lightbox.removeAttribute('hidden');
    overlay?.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    lightbox.setAttribute('aria-hidden', 'false');
}

function openLightboxFromSlide(title, desc, bigImageSrc, slideIndex) {
    openLightbox(slideIndex, bigImageSrc, title, desc);
}

function closeLightbox() {
    if (!lightbox) return;
    
    lightbox.setAttribute('hidden', '');
    overlay?.setAttribute('hidden', '');
    document.body.style.overflow = '';
    lightbox.setAttribute('aria-hidden', 'true');
}

function initLightbox() {
    lightbox = document.querySelector(SELECTORS.lightbox);
    if (!lightbox) return;
    
    overlay = document.querySelector(SELECTORS.lightboxOverlay);
    closeBtn = document.querySelector(SELECTORS.lightboxClose);
    thumbnailsContainer = document.querySelector(SELECTORS.lightboxThumbnails);
    lightboxImage = lightbox.querySelector('.lightbox-image img');
    lightboxTitle = lightbox.querySelector('h2');
    lightboxDesc = lightbox.querySelector('p');
    
    closeBtn?.addEventListener('click', closeLightbox);
    overlay?.addEventListener('click', closeLightbox);
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox && !lightbox.hasAttribute('hidden')) {
            closeLightbox();
        }
    });
}

export { initLightbox, openLightboxFromSlide, closeLightbox };