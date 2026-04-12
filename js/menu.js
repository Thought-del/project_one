// menu.js

import { SELECTORS } from './constants.js';

let mobileMenu;
let burgerBtn;
let closeBtn;
let mobileLinks;
let body;

function openMenu() {
    mobileMenu.classList.add('active');
    burgerBtn?.setAttribute('aria-expanded', 'true');
    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.width = '100%';
    body.style.height = '100%';
}

function closeMenu() {
    mobileMenu.classList.remove('active');
    burgerBtn?.setAttribute('aria-expanded', 'false');
    body.style.overflow = '';
    body.style.position = '';
    body.style.width = '';
    body.style.height = '';
}

function handleLinkClick(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
        closeMenu();
        targetSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function handleEscape(e) {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        closeMenu();
    }
}

function handleClickOutside(e) {
    if (mobileMenu.classList.contains('active') && !mobileMenu.contains(e.target) && !burgerBtn?.contains(e.target)) {
        closeMenu();
    }
}

export function initMenu() {
    mobileMenu = document.querySelector(SELECTORS.mobileMenu);
    burgerBtn = document.querySelector(SELECTORS.burger);
    closeBtn = document.querySelector(SELECTORS.mobileClose);
    mobileLinks = document.querySelectorAll(SELECTORS.mobileNavLinks);
    body = document.body;
    
    if (!mobileMenu || !burgerBtn) return;
    
    burgerBtn.addEventListener('click', openMenu);
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeMenu);
    }
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', handleLinkClick);
    });
    
    document.addEventListener('keydown', handleEscape);
    document.addEventListener('click', handleClickOutside);
}