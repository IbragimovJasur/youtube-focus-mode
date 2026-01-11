const ON_WATCH_RECOMMENDATIONS_SELECTORS = [
    '#secondary',
    '#secondary-inner',
    '#related',
    'ytd-watch-next-secondary-results-renderer'
];
const ON_WATCH_RECOMMENDATIONS_HIDE_CLASS = 'yt-focus-onwatch-recommendations-hidden';
const WATCH_FEED_COUNTED_ATTR = 'data-watch-feed-counted';
const WATCH_FEED_COUNTED_VALUE = '1';
const WATCH_FEED_SELECTORS = {
    MAIN_CONTAINER: 'div#related ytd-watch-next-secondary-results-renderer div#items',
    ITEM_RENDERER: 'ytd-item-section-renderer yt-lockup-view-model'
};


function showOnWatchRecommendations() {
    document.querySelectorAll(`.${ON_WATCH_RECOMMENDATIONS_HIDE_CLASS}`).forEach(el => {
        el.classList.remove(ON_WATCH_RECOMMENDATIONS_HIDE_CLASS);
        el.style.display = '';
    });
}

function hideOnWatchRecommendations() {
    const blockedOnWatchRecommendations = hideWatchFeed();
    if (blockedOnWatchRecommendations > 0) {
        incrementStat(VIDEOS_BLOCKED_STORAGE_KEY, blockedOnWatchRecommendations);
    }

    ON_WATCH_RECOMMENDATIONS_SELECTORS.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.classList.add(ON_WATCH_RECOMMENDATIONS_HIDE_CLASS);
            el.style.display = 'none';
        });
    });
}

function hideWatchFeed() {
    let blocked = 0;
    const shelves = document.querySelectorAll(WATCH_FEED_SELECTORS.MAIN_CONTAINER);
    shelves.forEach(shelf => {
        shelf.querySelectorAll(WATCH_FEED_SELECTORS.ITEM_RENDERER).forEach(item => {
            if (item.hasAttribute(WATCH_FEED_COUNTED_ATTR)) return;
            item.setAttribute(WATCH_FEED_COUNTED_ATTR, WATCH_FEED_COUNTED_VALUE);
            blocked++;
        });
    });

    return blocked;
}
