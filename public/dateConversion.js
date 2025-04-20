dateConvert();

function dateConvert() {
    document.addEventListener('DOMContentLoaded', () => {
        const dateElements = document.querySelectorAll('[data-post-date]');
        dateElements.forEach(element => {
            const isoDate = element.getAttribute('data-post-date');
            const utcDate = new Date(isoDate).toLocaleString('en-US', {
                timeZone: 'UTC',
                dateStyle: 'medium',
                timeStyle: 'short'
            });
            element.textContent = utcDate;
        });
    });
}
