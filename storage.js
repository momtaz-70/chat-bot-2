/**
 * Storage utility for managing local storage operations
 * Handles API keys, settings, and chat history persistence
 */
class StorageManager {
    constructor() {
        this.storageKeys = {
            API_KEY: 'gemini_api_key',
            SETTINGS: 'gemini_settings',
            CHAT_HISTORY: 'gemini_chat_history',
            LAST_SESSION: 'gemini_last_session'
        };
        
        this.defaultSettings = {
            temperature: 0.7,
            maxTokens: 1024,
            autoSave: true,
            theme: 'light'
        };
    }

    /**
     * Check if localStorage is available
     * @returns {boolean} - Whether localStorage is supported
     */
    isStorageAvailable() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Safely parse JSON from localStorage
     * @param {string} key - Storage key
     * @param {*} defaultValue - Default value if parsing fails
     * @returns {*} - Parsed value or default
     */
    safeGetItem(key, defaultValue = null) {
        if (!this.isStorageAvailable()) {
            return defaultValue;
        }

        try {
            const item = localStorage.getItem(key);
            if (item === null) {
                return defaultValue;
            }
            return JSON.parse(item);
        } catch (error) {
            console.warn(`Error parsing localStorage item "${key}":`, error);
            return defaultValue;
        }
    }

    /**
     * Safely set item in localStorage
     * @param {string} key - Storage key
     * @param {*} value - Value to store
     * @returns {boolean} - Whether operation succeeded
     */
    safeSetItem(key, value) {
        if (!this.isStorageAvailable()) {
            return false;
        }

        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.warn(`Error setting localStorage item "${key}":`, error);
            return false;
        }
    }

    /**
     * Safely remove item from localStorage
     * @param {string} key - Storage key
     * @returns {boolean} - Whether operation succeeded
     */
    safeRemoveItem(key) {
        if (!this.isStorageAvailable()) {
            return false;
        }

        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.warn(`Error removing localStorage item "${key}":`, error);
            return false;
        }
    }

    // API Key Management
    
    /**
     * Save API key to storage
     * @param {string} apiKey - The API key to save
     * @returns {boolean} - Whether save succeeded
     */
    saveApiKey(apiKey) {
        if (!apiKey || typeof apiKey !== 'string') {
            return false;
        }
        
        // Basic encryption (base64 encoding for simple obfuscation)
        const encodedKey = btoa(apiKey.trim());
        return this.safeSetItem(this.storageKeys.API_KEY, encodedKey);
    }

    /**
     * Load API key from storage
     * @returns {string|null} - The API key or null if not found
     */
    loadApiKey() {
        const encodedKey = this.safeGetItem(this.storageKeys.API_KEY);
        if (!encodedKey) {
            return null;
        }

        try {
            return atob(encodedKey);
        } catch (error) {
            console.warn('Error decoding API key:', error);
            this.removeApiKey(); // Remove corrupted key
            return null;
        }
    }

    /**
     * Remove API key from storage
     * @returns {boolean} - Whether removal succeeded
     */
    removeApiKey() {
        return this.safeRemoveItem(this.storageKeys.API_KEY);
    }

    /**
     * Check if API key exists in storage
     * @returns {boolean} - Whether API key is stored
     */
    hasApiKey() {
        return this.loadApiKey() !== null;
    }

    // Settings Management

    /**
     * Save settings to storage
     * @param {Object} settings - Settings object
     * @returns {boolean} - Whether save succeeded
     */
    saveSettings(settings) {
        const mergedSettings = { ...this.defaultSettings, ...settings };
        return this.safeSetItem(this.storageKeys.SETTINGS, mergedSettings);
    }

    /**
     * Load settings from storage
     * @returns {Object} - Settings object with defaults applied
     */
    loadSettings() {
        const settings = this.safeGetItem(this.storageKeys.SETTINGS, {});
        return { ...this.defaultSettings, ...settings };
    }

    /**
     * Update specific setting
     * @param {string} key - Setting key
     * @param {*} value - Setting value
     * @returns {boolean} - Whether update succeeded
     */
    updateSetting(key, value) {
        const settings = this.loadSettings();
        settings[key] = value;
        return this.saveSettings(settings);
    }

    /**
     * Reset settings to defaults
     * @returns {boolean} - Whether reset succeeded
     */
    resetSettings() {
        return this.saveSettings(this.defaultSettings);
    }

    // Chat History Management

    /**
     * Save chat message to history
     * @param {Object} message - Message object
     * @returns {boolean} - Whether save succeeded
     */
    saveChatMessage(message) {
        if (!message || !message.id) {
            return false;
        }

        const history = this.loadChatHistory();
        history.push({
            ...message,
            timestamp: message.timestamp || new Date().toISOString()
        });

        // Limit history to last 100 messages to prevent storage bloat
        if (history.length > 100) {
            history.splice(0, history.length - 100);
        }

        return this.safeSetItem(this.storageKeys.CHAT_HISTORY, history);
    }

    /**
     * Load chat history from storage
     * @returns {Array} - Array of message objects
     */
    loadChatHistory() {
        return this.safeGetItem(this.storageKeys.CHAT_HISTORY, []);
    }

    /**
     * Clear chat history
     * @returns {boolean} - Whether clear succeeded
     */
    clearChatHistory() {
        return this.safeSetItem(this.storageKeys.CHAT_HISTORY, []);
    }

    /**
     * Get chat history statistics
     * @returns {Object} - Statistics about chat history
     */
    getChatHistoryStats() {
        const history = this.loadChatHistory();
        const userMessages = history.filter(msg => msg.type === 'user');
        const botMessages = history.filter(msg => msg.type === 'bot');
        
        return {
            totalMessages: history.length,
            userMessages: userMessages.length,
            botMessages: botMessages.length,
            oldestMessage: history.length > 0 ? history[0].timestamp : null,
            newestMessage: history.length > 0 ? history[history.length - 1].timestamp : null
        };
    }

    // Session Management

    /**
     * Save current session state
     * @param {Object} sessionData - Session data to save
     * @returns {boolean} - Whether save succeeded
     */
    saveSession(sessionData) {
        const session = {
            ...sessionData,
            timestamp: new Date().toISOString()
        };
        return this.safeSetItem(this.storageKeys.LAST_SESSION, session);
    }

    /**
     * Load last session state
     * @returns {Object|null} - Last session data or null
     */
    loadSession() {
        return this.safeGetItem(this.storageKeys.LAST_SESSION);
    }

    /**
     * Clear session data
     * @returns {boolean} - Whether clear succeeded
     */
    clearSession() {
        return this.safeRemoveItem(this.storageKeys.LAST_SESSION);
    }

    // Data Export/Import

    /**
     * Export all data for backup
     * @returns {Object} - Exported data object
     */
    exportData() {
        return {
            settings: this.loadSettings(),
            chatHistory: this.loadChatHistory(),
            session: this.loadSession(),
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
    }

    /**
     * Import data from backup
     * @param {Object} data - Data to import
     * @returns {boolean} - Whether import succeeded
     */
    importData(data) {
        if (!data || typeof data !== 'object') {
            return false;
        }

        let success = true;

        if (data.settings) {
            success &= this.saveSettings(data.settings);
        }

        if (data.chatHistory && Array.isArray(data.chatHistory)) {
            success &= this.safeSetItem(this.storageKeys.CHAT_HISTORY, data.chatHistory);
        }

        if (data.session) {
            success &= this.saveSession(data.session);
        }

        return Boolean(success);
    }

    /**
     * Get storage usage information
     * @returns {Object} - Storage usage stats
     */
    getStorageInfo() {
        if (!this.isStorageAvailable()) {
            return {
                available: false,
                error: 'localStorage not available'
            };
        }

        try {
            // Calculate approximate storage usage
            let totalSize = 0;
            for (let key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    totalSize += localStorage[key].length;
                }
            }

            // Gemini-specific storage
            const geminiKeys = Object.values(this.storageKeys);
            let geminiSize = 0;
            geminiKeys.forEach(key => {
                const item = localStorage.getItem(key);
                if (item) {
                    geminiSize += item.length;
                }
            });

            return {
                available: true,
                totalSize: `${(totalSize / 1024).toFixed(2)} KB`,
                geminiSize: `${(geminiSize / 1024).toFixed(2)} KB`,
                hasApiKey: this.hasApiKey(),
                messagesCount: this.loadChatHistory().length,
                lastSession: this.loadSession()?.timestamp || null
            };
        } catch (error) {
            return {
                available: true,
                error: 'Could not calculate storage usage'
            };
        }
    }

    /**
     * Clear all Gemini-related data
     * @returns {boolean} - Whether clear succeeded
     */
    clearAllData() {
        const keys = Object.values(this.storageKeys);
        let success = true;
        
        keys.forEach(key => {
            success &= this.safeRemoveItem(key);
        });

        return success;
    }

    /**
     * Migrate data from older versions (if needed)
     * @returns {boolean} - Whether migration succeeded
     */
    migrateData() {
        // This method can be used for future data migrations
        // For now, just ensure settings have all required fields
        const settings = this.loadSettings();
        const updated = { ...this.defaultSettings, ...settings };
        
        return this.saveSettings(updated);
    }
}

// Create and export singleton instance
const storageManager = new StorageManager();

// Auto-migrate data on load
try {
    storageManager.migrateData();
} catch (error) {
    console.warn('Data migration failed:', error);
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { StorageManager, storageManager };
}