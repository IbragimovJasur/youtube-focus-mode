const SELECTORS = {
    HOME_LEFT_SIDEBAR: [
        '#guide-content',
        'ytd-guide-renderer',
        'ytd-mini-guide-renderer',
        '#guide',
        'tp-yt-app-drawer'
    ],
    PLAYABLES: [
        'ytd-rich-item-renderer[is-mini-game-card-shelf]',
        'ytd-rich-shelf-renderer:has(ytd-rich-item-renderer[is-mini-game-card-shelf])'
    ],
    COMMENTS: [
        'ytd-comments#comments',
        'ytd-comment-thread-renderer'
    ],
    SEARCH_RECOMMENDATIONS: [
        'yt-searchbox [role="listbox"]',
        '.ytSearchboxComponentSuggestionsContainer',
        '.ytSuggestionComponentSuggestion'
    ]
};

const HIDE_CLASSES = {
    HOME_FEED: 'yt-focus-home-feed-hidden',
    HOME_LEFT_SIDEBAR: 'yt-focus-home-left-sidebar-hidden',
    SHORTS: 'yt-focus-shorts-hidden',
    PLAYABLES: 'yt-focus-playables-hidden',
    COMMENTS: 'yt-focus-comments-hidden',
    SEARCH_RECOMMENDATIONS: 'yt-focus-search-recommendations-hidden',
    ON_WATCH_RECOMMENDATIONS: 'yt-focus-onwatch-recommendations-hidden'
};

const SETTINGS_KEYS = {
    HIDE_HOME_FEED: 'hideHomeFeed',
    HIDE_HOME_LEFT_SIDEBAR: 'hideHomeLeftSidebar',
    HIDE_SHORTS: 'hideShorts',
    HIDE_PLAYABLES: 'hidePlayables',
    HIDE_COMMENTS: 'hideComments',
    HIDE_SEARCH_RECOMMENDATIONS: 'hideSearchRecommendations',
    HIDE_ON_WATCH_RECOMMENDATIONS: 'hideOnWatchRecommendations'
};

const TIME_TRACKING = {
    INTERVAL_MS: 30000,
    MILLISECONDS_PER_SECOND: 1000
};

const OBSERVER_DELAYS = {
    DOM_CHANGE_MS: 300,
    URL_CHANGE_MS: 500
};

// ============================================================================
// State Management
// ============================================================================

const settings = {
    [SETTINGS_KEYS.HIDE_HOME_FEED]: false,
    [SETTINGS_KEYS.HIDE_HOME_LEFT_SIDEBAR]: false,
    [SETTINGS_KEYS.HIDE_SHORTS]: false,
    [SETTINGS_KEYS.HIDE_PLAYABLES]: false,
    [SETTINGS_KEYS.HIDE_COMMENTS]: false,
    [SETTINGS_KEYS.HIDE_SEARCH_RECOMMENDATIONS]: false,
    [SETTINGS_KEYS.HIDE_ON_WATCH_RECOMMENDATIONS]: false
};

// ============================================================================
// DOM Utilities
// ============================================================================

/**
 * Shows elements by removing hide class and restoring display
 */
function showElements(hideClass) {
    document.querySelectorAll(`.${hideClass}`).forEach(element => {
        element.classList.remove(hideClass);
        element.style.display = '';
    });
}

/**
 * Hides elements by adding hide class and setting display to none
 */
function hideElements(selectors, hideClass) {
    selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(element => {
            element.classList.add(hideClass);
            element.style.display = 'none';
        });
    });
}

// ============================================================================
// Feature Toggle Functions
// ============================================================================

/**
 * Toggles home left sidebar visibility
 */
function toggleHomeLeftSidebar() {
    if (settings[SETTINGS_KEYS.HIDE_HOME_LEFT_SIDEBAR]) {
        hideElements(SELECTORS.HOME_LEFT_SIDEBAR, HIDE_CLASSES.HOME_LEFT_SIDEBAR);
    } else {
        showElements(HIDE_CLASSES.HOME_LEFT_SIDEBAR);
    }
}

/**
 * Toggles playables visibility
 */
function togglePlayables() {
    if (settings[SETTINGS_KEYS.HIDE_PLAYABLES]) {
        hideElements(SELECTORS.PLAYABLES, HIDE_CLASSES.PLAYABLES);
    } else {
        showElements(HIDE_CLASSES.PLAYABLES);
    }
}

/**
 * Toggles comments visibility
 */
function toggleComments() {
    if (settings[SETTINGS_KEYS.HIDE_COMMENTS]) {
        hideElements(SELECTORS.COMMENTS, HIDE_CLASSES.COMMENTS);
    } else {
        showElements(HIDE_CLASSES.COMMENTS);
    }
}

/**
 * Toggles search recommendations visibility
 */
function toggleSearchRecommendations() {
    if (settings[SETTINGS_KEYS.HIDE_SEARCH_RECOMMENDATIONS]) {
        hideElements(SELECTORS.SEARCH_RECOMMENDATIONS, HIDE_CLASSES.SEARCH_RECOMMENDATIONS);
    } else {
        showElements(HIDE_CLASSES.SEARCH_RECOMMENDATIONS);
    }
}

// ============================================================================
// Settings Application
// ============================================================================

/**
 * Applies all settings to the page
 */
function applySettings() {
    // Features with external handlers (from feature files)
    if (settings[SETTINGS_KEYS.HIDE_HOME_FEED]) {
        hideHomeFeed();
    } else {
        showHomeFeed();
    }

    if (settings[SETTINGS_KEYS.HIDE_SHORTS]) {
        hideShorts();
    } else {
        showShorts();
    }

    if (settings[SETTINGS_KEYS.HIDE_ON_WATCH_RECOMMENDATIONS]) {
        hideOnWatchRecommendations();
    } else {
        showOnWatchRecommendations();
    }

    // Features with local handlers
    toggleHomeLeftSidebar();
    togglePlayables();
    toggleComments();
    toggleSearchRecommendations();
}

// ============================================================================
// Time Tracking
// ============================================================================

let lastTick = Date.now();

/**
 * Checks if YouTube is currently active (visible or on watch/shorts page)
 */
function isYouTubeActive() {
    if (document.visibilityState === 'visible') {
        return true;
    }
    const pathname = location.pathname;
    return pathname === '/watch' || pathname.startsWith('/shorts');
}

/**
 * Starts the time spent tracking interval
 */
function startTimeSpentTracker() {
    setInterval(() => {
        const now = Date.now();

        if (!isYouTubeActive()) {
            lastTick = now;
            return;
        }

        const deltaSeconds = Math.floor((now - lastTick) / TIME_TRACKING.MILLISECONDS_PER_SECOND);
        if (deltaSeconds <= 0) {
            return;
        }

        lastTick = now;
        incrementStat(TIME_SPENT_STORAGE_KEY, deltaSeconds);
    }, TIME_TRACKING.INTERVAL_MS);
}

// ============================================================================
// Storage Management
// ============================================================================

/**
 * Loads settings from Chrome storage and applies them
 */
function loadSettings() {
    chrome.storage.local.get(Object.keys(settings), (result) => {
        Object.assign(settings, result);
        applySettings();
    });
}

/**
 * Handles storage change events
 */
function setupStorageListener() {
    chrome.storage.onChanged.addListener((changes, areaName) => {
        if (areaName !== 'local') {
            return;
        }

        for (const [key, { newValue }] of Object.entries(changes)) {
            if (key in settings) {
                settings[key] = newValue;
            }
        }

        applySettings();
    });
}

// ============================================================================
// Page Observers
// ============================================================================

/**
 * Sets up DOM mutation observer to reapply settings on page changes
 */
function setupDOMObserver() {
    let timeout;

    new MutationObserver(() => {
        clearTimeout(timeout);
        timeout = setTimeout(applySettings, OBSERVER_DELAYS.DOM_CHANGE_MS);
    }).observe(document.body, {
        childList: true,
        subtree: true
    });
}

/**
 * Sets up URL change observer by watching title element mutations
 */
function setupURLObserver() {
    const titleElement = document.querySelector('title');
    if (!titleElement) {
        return;
    }

    let lastUrl = location.href;

    new MutationObserver(() => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            setTimeout(applySettings, OBSERVER_DELAYS.URL_CHANGE_MS);
        }
    }).observe(titleElement, {
        subtree: true,
        characterData: true,
        childList: true
    });
}

// ============================================================================
// Initialization
// ============================================================================

/**
 * Initializes all hide classes on document root
 */
function initializeHideClasses() {
    Object.values(HIDE_CLASSES).forEach(className => {
        document.documentElement.classList.add(className);
    });
}

/**
 * Initializes the content script
 */
function init() {
    initializeHideClasses();
    loadSettings();
    setupStorageListener();
    setupDOMObserver();
    setupURLObserver();
    startTimeSpentTracker();
}

// Start initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
