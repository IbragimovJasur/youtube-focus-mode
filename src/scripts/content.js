const SELECTORS = {
    HOME_FEED: [
        'ytd-browse[page-subtype="home"]',
        'ytd-two-column-browse-results-renderer',
        'ytd-rich-grid-renderer',
        '#contents.ytd-rich-grid-renderer'
    ],

    HOME_LEFT_SIDEBAR: [
        '#guide-content',
        'ytd-guide-renderer',
        'ytd-mini-guide-renderer',
        '#guide',
        'tp-yt-app-drawer'
    ],

    SHORTS: [
        // home feed
        'ytd-rich-shelf-renderer[is-shorts]',

        // on-watch recommendations
        'ytd-reel-shelf-renderer',
        'ytm-shorts-lockup-view-model-v2',

        // search recommendations
        'grid-shelf-view-model',
        'ytm-shorts-lockup-view-model-v2',
        'ytm-shorts-lockup-view-model'
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
    ],

    ON_WATCH_RECOMMENDATIONS: [
        '#secondary',
        '#secondary-inner',
        '#related',
        'ytd-watch-next-secondary-results-renderer'
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

// by default: hide all features
for (const className of Object.values(HIDE_CLASSES)) {
    document.documentElement.classList.add(className);
}

(function () {
    'use strict';

    chrome.storage.onChanged.addListener((changes, areaName) => {
        if (areaName === 'sync') {
            for (let [key, { newValue }] of Object.entries(changes)) {
                settings[key] = newValue;
            }
            applySettings();
        }
    });

    let settings = {
        hideHomeFeed: false,
        hideHomeLeftSidebar: false,
        hideShorts: false,
        hidePlayables: false,
        hideComments: false,
        hideSearchRecommendations: false,
        hideOnWatchRecommendations: false
    };

    function loadSettings() {
        chrome.storage.sync.get(Object.keys(settings), (result) => {
            settings = { ...settings, ...result };
            applySettings();
        });
    }

    function applySettings() {
        // Home Feed
        if (settings.hideHomeFeed) {
            hideHomeFeed();
        } else {
            showHomeFeed();
        }

        // Home Left Sidebar
        if (settings.hideHomeLeftSidebar) {
            hideHomeLeftSidebar();
        }
        else {
            showHomeLeftSidebar();
        }

        // Shorts
        if (settings.hideShorts) {
            hideShorts();
        } else {
            showShorts();
        }

        // Playables
        if (settings.hidePlayables) {
            hidePlayables();
        }
        else {
            showPlayables();
        }

        // Comments
        if (settings.hideComments) {
            hideComments();
        }
        else {
            showComments();
        }

        // Search Recommendations
        if (settings.hideSearchRecommendations) {
            hideSearchRecommendations();
        }
        else {
            showSearchRecommendations();
        }

        // On-Watch Recommendations
        if (settings.hideOnWatchRecommendations) {
            hideOnWatchRecommendations();
        }
        else {
            showOnWatchRecommendations();
        }
    }


    // ========== Home Feed ==========
    function showHomeFeed() {
        document.querySelectorAll(`.${HIDE_CLASSES.HOME_FEED}`).forEach(el => {
            el.classList.remove(HIDE_CLASSES.HOME_FEED);
            el.style.display = '';
        })
    }

    function hideHomeFeed() {
        SELECTORS.HOME_FEED.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                el.classList.add(HIDE_CLASSES.HOME_FEED);
                el.style.display = 'none';
            });
        });
    }


    // ===== Home Left Sidebar =====
    function showHomeLeftSidebar() {
        document.querySelectorAll(`.${HIDE_CLASSES.HOME_LEFT_SIDEBAR}`).forEach(el => {
            el.classList.remove(HIDE_CLASSES.HOME_LEFT_SIDEBAR);
            el.style.display = '';
        });
    }

    function hideHomeLeftSidebar() {
        SELECTORS.HOME_LEFT_SIDEBAR.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.classList.add(HIDE_CLASSES.HOME_LEFT_SIDEBAR);
                el.style.display = 'none';
            });
        });
    }


    // ===== Shorts =====
    function showShorts() {
        document.querySelectorAll(`.${HIDE_CLASSES.SHORTS}`).forEach(el => {
            el.classList.remove(HIDE_CLASSES.SHORTS);
            el.style.display = '';
        });
    }

    function hideShorts() {
        SELECTORS.SHORTS.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.classList.add(HIDE_CLASSES.SHORTS);
                el.style.display = 'none';
            });
        });
    }


    // ========== Playables ==========
    function showPlayables() {
        document.querySelectorAll(`.${HIDE_CLASSES.PLAYABLES}`).forEach(el => {
            el.classList.remove(HIDE_CLASSES.PLAYABLES);
            el.style.display = '';
        });
    }

    function hidePlayables() {
        SELECTORS.PLAYABLES.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.classList.add(HIDE_CLASSES.PLAYABLES);
                el.style.display = 'none';
            });
        });
    }


    // ========== Comments ==========
    function showComments() {
        document.querySelectorAll(`.${HIDE_CLASSES.COMMENTS}`).forEach(el => {
            el.classList.remove(HIDE_CLASSES.COMMENTS);
            el.style.display = '';
        });
    }

    function hideComments() {
        SELECTORS.COMMENTS.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.classList.add(HIDE_CLASSES.COMMENTS);
                el.style.display = 'none';
            });
        });
    }

    // ========== Search Recommendations ==========
    function showSearchRecommendations() {
        document.querySelectorAll(`.${HIDE_CLASSES.SEARCH_RECOMMENDATIONS}`).forEach(el => {
            el.classList.remove(HIDE_CLASSES.SEARCH_RECOMMENDATIONS);
            el.style.display = '';
        });
    }

    function hideSearchRecommendations() {
        SELECTORS.SEARCH_RECOMMENDATIONS.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.classList.add(HIDE_CLASSES.SEARCH_RECOMMENDATIONS);
                el.style.display = 'none';
            });
        });
    }

    // ========== On-Watch Recommendations ==========
    function showOnWatchRecommendations() {
        document.querySelectorAll(`.${HIDE_CLASSES.ON_WATCH_RECOMMENDATIONS}`).forEach(el => {
            el.classList.remove(HIDE_CLASSES.ON_WATCH_RECOMMENDATIONS);
            el.style.display = '';
        });
    }

    function hideOnWatchRecommendations() {
        SELECTORS.ON_WATCH_RECOMMENDATIONS.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.classList.add(HIDE_CLASSES.ON_WATCH_RECOMMENDATIONS);
                el.style.display = 'none';
            });
        });
    }

    function observePage() {
        let timeout;

        const observer = new MutationObserver(() => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                applySettings();
            }, 300);
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                setTimeout(applySettings, 500);
            }
        }).observe(document.querySelector('title'), {
            subtree: true,
            characterData: true,
            childList: true
        });
    }

    function init() {
        loadSettings();
        observePage();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
