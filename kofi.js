const button = document.getElementById('kofi-button');
const popup = document.getElementById('kofi-popup');
const closeButton = document.getElementById('kofi-close');
let previousFocus = null;

function openKofi() {
    previousFocus = document.activeElement;
    popup.classList.remove('hidden');
    popup.setAttribute('aria-hidden', 'false');
    closeButton.focus();
}

function closeKofi() {
    popup.classList.add('hidden');
    popup.setAttribute('aria-hidden', 'true');
    if (previousFocus instanceof HTMLElement) previousFocus.focus();
}

button.addEventListener('click', openKofi);
closeButton.addEventListener('click', closeKofi);

popup.addEventListener('click', (event) => {
    if (event.target === popup) closeKofi();
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !popup.classList.contains('hidden')) {
        event.preventDefault();
        closeKofi();
    }
});
