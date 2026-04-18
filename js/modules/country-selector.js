import { SELECTORS } from './constants.js';

function initCountrySelector() {
    const dropdowns = document.querySelectorAll(SELECTORS.countryDropdown);
    
    dropdowns.forEach(dropdown => {
        const wrapper = dropdown.closest('.phone-input-wrapper');
        if (!wrapper) return;
        
        const btn = wrapper.querySelector(SELECTORS.countrySelector);
        const codeSpan = wrapper.querySelector(SELECTORS.countryCode);
        const phoneInput = wrapper.querySelector('input[type="tel"]');
        
        if (!btn || !codeSpan) return;
        
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-haspopup', 'listbox');
        
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isHidden = dropdown.hidden;
            
            document.querySelectorAll(SELECTORS.countryDropdown).forEach(d => d.hidden = true);
            
            dropdown.hidden = !isHidden;
            btn.setAttribute('aria-expanded', !isHidden);
        });
        
        dropdown.querySelectorAll('.country-dropdown__item').forEach(item => {
            item.setAttribute('role', 'option');
            item.addEventListener('click', () => {
                const code = item.dataset.countryCode;
                codeSpan.textContent = code;
                dropdown.hidden = true;
                btn.setAttribute('aria-expanded', 'false');
                phoneInput?.focus();
            });
        });
    });
    
    document.addEventListener('click', () => {
        document.querySelectorAll(SELECTORS.countryDropdown).forEach(d => d.hidden = true);
        document.querySelectorAll(SELECTORS.countrySelector).forEach(b => b.setAttribute('aria-expanded', 'false'));
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll(SELECTORS.countryDropdown).forEach(d => d.hidden = true);
            document.querySelectorAll(SELECTORS.countrySelector).forEach(b => b.setAttribute('aria-expanded', 'false'));
        }
    });
}

export { initCountrySelector };