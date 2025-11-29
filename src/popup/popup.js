
document.addEventListener('DOMContentLoaded', () => {
    const switches = Array.from(document.querySelectorAll('.yt-focus-switch'));
    const settings = switches.map(sw => sw.dataset.setting);

    chrome.storage.sync.get(settings, (result) => {
        document.querySelectorAll('.yt-focus-switch').forEach((switchElement) => {
            const setting = switchElement.dataset.setting;
            if (result[setting]) {
                switchElement.classList.add('active');
            }
        });
    });
});


document.querySelectorAll('.yt-focus-switch').forEach((switchElement) => {
    switchElement.addEventListener('click', () => {
        const setting = switchElement.dataset.setting;
        const isActive = switchElement.classList.toggle('active');
        chrome.storage.sync.set({ [setting]: isActive });
    });
});
