// ============================================================================
// Constants
// ============================================================================

const STORAGE_KEYS = {
    STATS: 'ytFocusStats',
    SHORTS_BLOCKED: 'shortsBlocked',
    VIDEOS_BLOCKED: 'videosBlocked',
    TIME_SPENT: 'timeSpentInSeconds'
};

const DATE_FORMAT = {
    ISO_DATE_LENGTH: 10, // YYYY-MM-DD format length
    ISO_DATE_START: 0
};

const WEEK_DAY = {
    SUNDAY: 0,
    MONDAY: 1,
    DEFAULT_WHEN_SUNDAY: 7
};

const DEFAULT_STAT_VALUE = 0;

// ============================================================================
// State Management
// ============================================================================

/**
 * Lock queue to prevent race conditions when incrementing stats
 * Key: date string (YYYY-MM-DD), Value: Promise chain
 */
const incrementLocks = {};

// ============================================================================
// Date Utilities
// ============================================================================

/**
 * Returns date key in YYYY-MM-DD format
 * @param {Date} date - Date object (defaults to today)
 * @returns {string} Date key in YYYY-MM-DD format
 */
function getDateKey(date = new Date()) {
    return date.toISOString().slice(DATE_FORMAT.ISO_DATE_START, DATE_FORMAT.ISO_DATE_LENGTH);
}

/**
 * Returns the start of the week (Monday) for a given date
 * @param {Date} date - Date object (defaults to today)
 * @returns {Date} Start of week date object
 */
function startOfWeek(date = new Date()) {
    const d = new Date(date);
    const day = d.getDay() || WEEK_DAY.DEFAULT_WHEN_SUNDAY; // Monday = 1
    d.setDate(d.getDate() - day + WEEK_DAY.MONDAY);
    d.setHours(0, 0, 0, 0);
    return d;
}

// ============================================================================
// Statistics Management
// ============================================================================

/**
 * Initializes default stats structure for a given date
 * @param {Object} stats - Stats object
 * @param {string} dateKey - Date key in YYYY-MM-DD format
 * @returns {Object} Initialized stats object
 */
function initializeDateStats(stats, dateKey) {
    if (!stats[dateKey]) {
        stats[dateKey] = {
            [STORAGE_KEYS.SHORTS_BLOCKED]: DEFAULT_STAT_VALUE,
            [STORAGE_KEYS.VIDEOS_BLOCKED]: DEFAULT_STAT_VALUE,
            [STORAGE_KEYS.TIME_SPENT]: DEFAULT_STAT_VALUE
        };
    }
    return stats;
}

/**
 * Increments a stat value safely with promise-based locking
 * @param {string} storageKey - Storage key to increment
 * @param {number} value - Value to increment by (defaults to 1)
 */
function incrementStat(storageKey, value) {
    const todayKey = getDateKey();

    // If a lock already exists for this date, queue this increment after it
    if (incrementLocks[todayKey]) {
        incrementLocks[todayKey] = incrementLocks[todayKey].then(() =>
            incrementStat(storageKey, value)
        );
        return;
    }

    // Create a new promise chain for this date
    incrementLocks[todayKey] = new Promise((resolve) => {
        chrome.storage.local.get([STORAGE_KEYS.STATS], (result) => {
            const stats = result[STORAGE_KEYS.STATS] ?? {};

            // Initialize today's stats if needed
            initializeDateStats(stats, todayKey);

            // Increment only the key we care about
            stats[todayKey][storageKey] = (stats[todayKey][storageKey] ?? DEFAULT_STAT_VALUE) + value;

            // Write back the full stats object
            chrome.storage.local.set({ [STORAGE_KEYS.STATS]: stats }, () => {
                resolve();
            });
        });
    }).finally(() => {
        // Release the lock for this date
        delete incrementLocks[todayKey];
    });
}

// ============================================================================
// Exports (for compatibility with existing code)
// ============================================================================
const YT_FOCUS_STATS_STORAGE_KEY = STORAGE_KEYS.STATS;
const SHORTS_BLOCKED_STORAGE_KEY = STORAGE_KEYS.SHORTS_BLOCKED;
const VIDEOS_BLOCKED_STORAGE_KEY = STORAGE_KEYS.VIDEOS_BLOCKED;
const TIME_SPENT_STORAGE_KEY = STORAGE_KEYS.TIME_SPENT;
