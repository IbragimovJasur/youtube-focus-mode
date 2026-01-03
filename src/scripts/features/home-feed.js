const HOME_FEED_SELECTORS = [
    'ytd-browse[page-subtype="home"]',
    'ytd-two-column-browse-results-renderer',
    'ytd-rich-grid-renderer',
    '#contents.ytd-rich-grid-renderer',
];

const HOME_FEED_HIDE_CLASS = 'yt-focus-home-feed-hidden';

const HOME_FEED_ITEMS_SELECTORS = {
    MAIN_RENDERER: 'ytd-browse[page-subtype="home"] ytd-two-column-browse-results-renderer ytd-rich-grid-renderer div#contents',
    ITEM_RENDERER: 'ytd-rich-item-renderer'
};
const HOME_FEED_COUNTED_ATTR = 'data-home-feed-counted';
const HOME_FEED_COUNTED_VALUE = '1';


// ========== Home Feed ==========
function showHomeFeed() {
    document.querySelectorAll(`.${HOME_FEED_HIDE_CLASS}`).forEach(el => {
        el.classList.remove(HOME_FEED_HIDE_CLASS);
        el.style.display = '';
    });
}

function hideHomeFeed() {
    // Need to hide elements separately to make stats for each feature
    HOME_FEED_SELECTORS.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            el.classList.add(HOME_FEED_HIDE_CLASS);
            el.style.display = 'none';
        });
    });

    const blockedHomeFeedVideos = hideHomeFeedVideos();
    if (blockedHomeFeedVideos > 0) {
        incrementStat(VIDEOS_BLOCKED_STORAGE_KEY, blockedHomeFeedVideos);
    }
}

function hideHomeFeedVideos() {
    let blocked = 0;

    // Get the main container
    const shelves = document.querySelectorAll(HOME_FEED_ITEMS_SELECTORS.MAIN_RENDERER);

    shelves.forEach(shelf => {
        shelf.querySelectorAll(HOME_FEED_ITEMS_SELECTORS.ITEM_RENDERER).forEach(item => {
            // Skip if already counted
            if (item.hasAttribute(HOME_FEED_COUNTED_ATTR)) return;
            if (item.hasAttribute('is-shelf-item')) return;

            // Mark as counted
            item.setAttribute(HOME_FEED_COUNTED_ATTR, HOME_FEED_COUNTED_VALUE);
            blocked++;
        });
    });

    return blocked;
}

