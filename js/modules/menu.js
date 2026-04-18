import { SELECTORS } from './constants.js';

let mobileMenu, burgerBtn, closeBtn, mobileLinks, body, mainContent;

function openMenu() {
    if (!mobileMenu || !burgerBtn) return;
    
    mobileMenu.classList.add('active');
    mobileMenu.removeAttribute('hidden');
    burgerBtn.setAttribute('aria-expanded', 'true');
    
    body.classList.add('menu-open');
    mainContent?.setAttribute('aria-hidden', 'true');
    mobileMenu.setAttribute('aria-hidden', 'false');
}

function closeMenu() {
    if (!mobileMenu || !burgerBtn) return;
    
    mobileMenu.classList.remove('active');
    mobileMenu.setAttribute('hidden', '');
    burgerBtn.setAttribute('aria-expanded', 'false');
    
    body.classList.remove('menu-open');
    mainContent?.removeAttribute('aria-hidden');
    mobileMenu.setAttribute('aria-hidden', 'true');
}

function handleLinkClick(e) {
    const targetId = this.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
        closeMenu();
        targetSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function initMenu() {
    mobileMenu = document.querySelector(SELECTORS.mobileMenu);
    burgerBtn = document.querySelector(SELECTORS.burger);
    closeBtn = document.querySelector(SELECTORS.mobileClose);
    mobileLinks = document.querySelectorAll(SELECTORS.mobileNavLinks);
    body = document.body;
    mainContent = document.querySelector('main') || document.querySelector('.hero')?.parentElement;
    
    if (!mobileMenu || !burgerBtn) return;
    
    burgerBtn.addEventListener('click', openMenu);
    closeBtn?.addEventListener('click', closeMenu);
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            handleLinkClick.call(link, e);
        });
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMenu();
        }
    });
    
    document.addEventListener('click', (e) => {
        if (mobileMenu.classList.contains('active') && 
            !mobileMenu.contains(e.target) && 
            !burgerBtn.contains(e.target)) {
            closeMenu();
        }
    });
}

export { initMenu };