const STORAGE_KEYS = {
    STATS: 'ytFocusStats',
    SHORTS_BLOCKED: 'shortsBlocked',
    VIDEOS_BLOCKED: 'videosBlocked',
    TIME_SPENT: 'timeSpentInSeconds'
};

const SELECTORS = {
    SWITCH: '.yt-focus-switch',
    TOGGLE_BTN: '.yt-focus-toggle-btn',
    VIEW_PANEL: '.yt-focus-view-panel',
    STATS_DROPDOWN: '.yt-focus-stats-dropdown',
    DROPDOWN_TRIGGER: '.yt-focus-dropdown-trigger',
    DROPDOWN_OPTION: '.yt-focus-dropdown-option',
    SELECTED_TIME: '.yt-focus-selected-time',
    STAT_SHORTS: '#stat-shorts',
    STAT_VIDEOS: '#stat-videos',
    STAT_TIME: '#stat-time-spent'
};

const TIMEFRAMES = {
    TODAY: 'today',
    WEEK: 'week',
    MONTH: 'month',
    ALL: 'all'
};

const SECONDS_IN_ONE_MINUTE = 60;
const DAYS_IN_ONE_WEEK = 7;

// ============================================================================
// State Management
// ============================================================================
let statsCache = {};
let currentTimeframe = TIMEFRAMES.TODAY;

/**
 * Safely queries a single element, returns null if not found
 */
function queryElement(selector, parent = document) {
    return parent.querySelector(selector);
}

/**
 * Safely queries multiple elements, returns empty array if none found
 */
function queryElements(selector, parent = document) {
    return Array.from(parent.querySelectorAll(selector));
}

// ============================================================================
// Date Utilities
// ============================================================================
/**
 * Returns date key in YYYY-MM-DD format
 */
function getDateKey(date = new Date()) {
    return date.toISOString().slice(0, 10);
}

/**
 * Returns the start of the week (Monday) for a given date
 */
function startOfWeek(date = new Date()) {
    const d = new Date(date);
    const day = d.getDay() || DAYS_IN_ONE_WEEK; // Monday = 1
    d.setDate(d.getDate() - day + 1);
    d.setHours(0, 0, 0, 0);
    return d;
}

/**
 * Returns the start of the month for a given date
 */
function startOfMonth(date = new Date()) {
    const d = new Date(date);
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
}

// ============================================================================
// Statistics Functions
// ============================================================================
/**
 * Computes the total for a given stat key within a timeframe
 */
function computeStatTotal(timeframe, statKey) {
    const todayKey = getDateKey();
    const weekStart = startOfWeek();
    const monthStart = startOfMonth();

    return Object.entries(statsCache).reduce((total, [dateKey, values]) => {
        const valueForDay = values?.[statKey] ?? 0;
        if (!valueForDay) return total;

        const date = new Date(`${dateKey}T00:00:00`);

        switch (timeframe) {
            case TIMEFRAMES.TODAY:
                return dateKey === todayKey ? total + valueForDay : total;
            case TIMEFRAMES.WEEK:
                return date >= weekStart ? total + valueForDay : total;
            case TIMEFRAMES.MONTH:
                return date >= monthStart ? total + valueForDay : total;
            case TIMEFRAMES.ALL:
            default:
                return total + valueForDay;
        }
    }, 0);
}

/**
 * Renders statistics for the current timeframe
 */
function renderStats() {
    const shortsEl = queryElement(SELECTORS.STAT_SHORTS);
    const videosEl = queryElement(SELECTORS.STAT_VIDEOS);
    const timeEl = queryElement(SELECTORS.STAT_TIME);

    if (!shortsEl || !videosEl || !timeEl) {
        console.warn('Stats elements not found');
        return;
    }

    const shortsCount = computeStatTotal(currentTimeframe, STORAGE_KEYS.SHORTS_BLOCKED);
    const videosCount = computeStatTotal(currentTimeframe, STORAGE_KEYS.VIDEOS_BLOCKED);
    const timeSpentInSeconds = computeStatTotal(currentTimeframe, STORAGE_KEYS.TIME_SPENT);
    const timeSpentInMinutes = Math.round(timeSpentInSeconds / SECONDS_IN_ONE_MINUTE);

    shortsEl.textContent = shortsCount;
    videosEl.textContent = videosCount;
    timeEl.textContent = timeSpentInMinutes;
}

/**
 * Loads statistics from Chrome storage and renders them
 */
function loadStats() {
    chrome.storage.local.get([STORAGE_KEYS.STATS], (result) => {
        statsCache = result[STORAGE_KEYS.STATS] ?? {};
        renderStats();
    });
}

// ============================================================================
// Switch Toggle Functions
// ============================================================================
/**
 * Initializes switch states from Chrome storage
 */
function initializeSwitches() {
    const switches = queryElements(SELECTORS.SWITCH);
    if (switches.length === 0) return;

    const settings = switches.map(switchEl => switchEl.dataset.setting);

    chrome.storage.local.get(settings, (result) => {
        switches.forEach((switchElement) => {
            const setting = switchElement.dataset.setting;
            if (result[setting]) {
                switchElement.classList.add('active');
            }
        });
    });
}

/**
 * Sets up click handlers for all switches
 */
function setupSwitchHandlers() {
    const switches = queryElements(SELECTORS.SWITCH);

    switches.forEach((switchElement) => {
        switchElement.addEventListener('click', () => {
            const setting = switchElement.dataset.setting;
            const isActive = switchElement.classList.toggle('active');
            chrome.storage.local.set({ [setting]: isActive });
        });
    });
}

// ============================================================================
// View Toggle Functions
// ============================================================================
/**
 * Sets up the toggle buttons for switching between Focus and Stats views
 */
function setupViewToggle() {
    const buttons = queryElements(SELECTORS.TOGGLE_BTN);
    const panels = queryElements(SELECTORS.VIEW_PANEL);

    if (buttons.length === 0 || panels.length === 0) return;

    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            const view = button.dataset.view;
            if (!view) return;

            // Update button states
            buttons.forEach((btn) => {
                btn.classList.remove('is-active');
                btn.setAttribute('aria-pressed', 'false');
            });
            button.classList.add('is-active');
            button.setAttribute('aria-pressed', 'true');

            // Update panel visibility
            panels.forEach((panel) => {
                panel.classList.toggle('is-active', panel.dataset.viewPanel === view);
            });
        });
    });
}

// ============================================================================
// Dropdown Functions
// ============================================================================
/**
 * Sets up the stats dropdown functionality
 */
function setupStatsDropdown() {
    const dropdown = queryElement(SELECTORS.STATS_DROPDOWN);
    if (!dropdown) return;

    const trigger = queryElement(SELECTORS.DROPDOWN_TRIGGER, dropdown);
    const options = queryElements(SELECTORS.DROPDOWN_OPTION, dropdown);
    const selectedTimeEl = queryElement(SELECTORS.SELECTED_TIME, trigger);

    if (!trigger || options.length === 0 || !selectedTimeEl) {
        console.warn('Dropdown elements not found');
        return;
    }

    // Toggle dropdown on trigger click
    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('dropdown-open');
    });

    // Handle option selection
    options.forEach((option) => {
        option.addEventListener('click', () => {
            selectedTimeEl.textContent = option.textContent;
            dropdown.classList.remove('dropdown-open');
            currentTimeframe = option.dataset.value || TIMEFRAMES.TODAY;
            renderStats();
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove('dropdown-open');
        }
    });
}

// ============================================================================
// Initialization
// ============================================================================
/**
 * Initializes the popup when DOM is ready
 */
function init() {
    initializeSwitches();
    setupSwitchHandlers();
    setupViewToggle();
    setupStatsDropdown();
    loadStats();
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    // DOM is already ready
    init();
}
