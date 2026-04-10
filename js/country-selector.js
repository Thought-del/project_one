// country-selector.js

function initCountrySelector() {
    const dropdownBtn = document.querySelector('[data-country-selector]');
    const dropdown = document.querySelector('[data-country-dropdown]');
    const codeSpan = document.querySelector('[data-country-code]');
    const phoneInput = document.querySelector('#form-phone');
    
    if (!dropdownBtn || !dropdown || !codeSpan) return;
    
    // Открыть/закрыть dropdown
    dropdownBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.hidden = !dropdown.hidden;
    });
    
    // Закрыть при клике вне
    document.addEventListener('click', () => {
        dropdown.hidden = true;
    });
    
    dropdown.addEventListener('click', (e) => {
        e.stopPropagation();
    });
    
    // Выбор страны
    dropdown.querySelectorAll('.country-dropdown__item').forEach(item => {
        item.addEventListener('click', () => {
            const code = item.dataset.countryCode;
            codeSpan.textContent = code;
            dropdown.hidden = true;
            phoneInput?.focus();
        });
    });
}

export { initCountrySelector };