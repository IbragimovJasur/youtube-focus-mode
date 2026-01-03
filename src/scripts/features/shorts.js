const SHORTS_SELECTORS = {
    HOME_FEED: {
        MAIN_RENDERER: 'ytd-rich-shelf-renderer[is-shorts]',
        ITEM_RENDERER: 'ytd-rich-item-renderer'
    },
    ON_WATCH: {
        PARENT_RENDERER: 'ytd-reel-shelf-renderer',
        CHILD_RENDERER: 'ytm-shorts-lockup-view-model',
        THUMBNAIL_IMAGE_SELECTOR: '.ytThumbnailViewModelImage img'
    },
    SEARCH: {
        MAIN_RENDERER: ['grid-shelf-view-model'],
        GRID_ITEM_SELECTOR: '.ytGridShelfViewModelGridShelfItem',
        ITEM_RENDERER: 'ytm-shorts-lockup-view-model-v2, ytm-shorts-lockup-view-model'
    }
}

const SHORTS_HIDE_CLASS = 'yt-focus-shorts-hidden';
const SHORTS_COUNTED_ATTR = 'yt-focus-stats-data-counted';
const SHORTS_COUNTED_VALUE = '1';
const SHORTS_HOME_FEED_HIDDEN_ATTR = 'hidden';


function showShorts() {
    document.querySelectorAll(`.${SHORTS_HIDE_CLASS}`).forEach(el => {
        el.classList.remove(SHORTS_HIDE_CLASS);
        el.style.display = '';
    });
}

function hideShorts() {
    if (!settings.hideShorts) return;

    const blockedHomeFeedShorts = hideHomeFeedShorts();
    if (blockedHomeFeedShorts > 0) {
        incrementStat(SHORTS_BLOCKED_STORAGE_KEY, blockedHomeFeedShorts);
    }

    const blockedOnWatchShorts = hideOnWatchShorts();
    if (blockedOnWatchShorts > 0) {
        incrementStat(SHORTS_BLOCKED_STORAGE_KEY, blockedOnWatchShorts);
    }

    const blockedSearchShorts = hideSearchShorts();
    if (blockedSearchShorts > 0) {
        incrementStat(SHORTS_BLOCKED_STORAGE_KEY, blockedSearchShorts);
    }
}

function hideHomeFeedShorts() {
    let blocked = 0;

    // Count Visible Shorts
    document
        .querySelectorAll(SHORTS_SELECTORS.HOME_FEED.MAIN_RENDERER)
        .forEach(shelf => {
            shelf.querySelectorAll(SHORTS_SELECTORS.HOME_FEED.ITEM_RENDERER).forEach(item => {
                if (
                    item.hasAttribute(SHORTS_HOME_FEED_HIDDEN_ATTR) ||
                    item.hasAttribute(SHORTS_COUNTED_ATTR)
                ) return;
                item.setAttribute(SHORTS_COUNTED_ATTR, SHORTS_COUNTED_VALUE);
                blocked++;
            });
        });

    // Hide Main Renderer
    document
        .querySelectorAll(SHORTS_SELECTORS.HOME_FEED.MAIN_RENDERER)
        .forEach(el => {
            el.classList.add(SHORTS_HIDE_CLASS);
            el.style.display = 'none';
        });

    return blocked;
}

function hideOnWatchShorts() {
    let blocked = 0;

    // Count Visible Shorts
    document
        .querySelectorAll(SHORTS_SELECTORS.ON_WATCH.PARENT_RENDERER)
        .forEach(shelf => {
            shelf
                .querySelectorAll(SHORTS_SELECTORS.ON_WATCH.CHILD_RENDERER)
                .forEach(shortEl => {
                    if (shortEl.hasAttribute(SHORTS_COUNTED_ATTR)) return;
                    const img = shortEl.querySelector(
                        SHORTS_SELECTORS.ON_WATCH.THUMBNAIL_IMAGE_SELECTOR
                    );
                    if (!img || !img.src) return;
                    shortEl.setAttribute(SHORTS_COUNTED_ATTR, SHORTS_COUNTED_VALUE);
                    blocked++;
                });
        });

    // Hide Main Renderers
    document
        .querySelectorAll(SHORTS_SELECTORS.ON_WATCH.PARENT_RENDERER)
        .forEach(el => {
            el.classList.add(SHORTS_HIDE_CLASS);
            el.style.display = 'none';
        });

    return blocked;
}

function hideSearchShorts() {
    let blocked = 0;

    document.querySelectorAll(SHORTS_SELECTORS.SEARCH.MAIN_RENDERER).forEach(shelf => {
        const items = shelf.querySelectorAll(SHORTS_SELECTORS.SEARCH.GRID_ITEM_SELECTOR);
        items.forEach(item => {
            if (item.hasAttribute(SHORTS_COUNTED_ATTR)) return;
            item.setAttribute(SHORTS_COUNTED_ATTR, SHORTS_COUNTED_VALUE);
            blocked++;
        });
    });

    // Hide Main Renderers
    document
        .querySelectorAll(SHORTS_SELECTORS.SEARCH.MAIN_RENDERER)
        .forEach(el => {
            el.classList.add(SHORTS_HIDE_CLASS);
            el.style.display = 'none';
        });

    return blocked;
}
