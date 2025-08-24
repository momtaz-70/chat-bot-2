/**
 * Gemini API Service Class
 * Handles communication with Google's Gemini 2.5 Flash model
 */
class GeminiAPIService {
    constructor() {
        this.baseURL = 'https://generativelanguage.googleapis.com/v1beta';
        this.model = 'gemini-2.5-flash';
        this.apiKey = null;
        this.defaultConfig = {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024
        };
    }

    /**
     * Set the API key for authentication
     * @param {string} apiKey - The Gemini API key
     */
    setApiKey(apiKey) {
        this.apiKey = apiKey;
    }

    /**
     * Validate API key format
     * @param {string} apiKey - The API key to validate
     * @returns {boolean} - Whether the key format is valid
     */
    validateApiKeyFormat(apiKey) {
        if (!apiKey || typeof apiKey !== 'string') {
            return false;
        }
        
        // Basic validation for Google API key format
        const apiKeyPattern = /^[A-Za-z0-9_-]{39}$/;
        return apiKeyPattern.test(apiKey.trim());
    }

    /**
     * Test connection to the API
     * @param {string} apiKey - Optional API key to test
     * @returns {Promise<{success: boolean, message: string}>}
     */
    async testConnection(apiKey = null) {
        const testKey = apiKey || this.apiKey;
        
        if (!testKey) {
            return {
                success: false,
                message: 'API key is required'
            };
        }

        if (!this.validateApiKeyFormat(testKey)) {
            return {
                success: false,
                message: 'Invalid API key format'
            };
        }

        try {
            const response = await this.sendMessage('Hello', testKey, {
                maxOutputTokens: 10
            });
            
            return {
                success: true,
                message: 'Connection successful'
            };
        } catch (error) {
            return {
                success: false,
                message: this.getErrorMessage(error)
            };
        }
    }

    /**
     * Send a message to the Gemini API
     * @param {string} message - The user message
     * @param {string} apiKey - Optional API key override
     * @param {Object} config - Optional configuration override
     * @returns {Promise<string>} - The AI response
     */
    async sendMessage(message, apiKey = null, config = {}) {
        const key = apiKey || this.apiKey;
        
        if (!key) {
            throw new Error('API key is required');
        }

        if (!message || message.trim().length === 0) {
            throw new Error('Message cannot be empty');
        }

        if (message.length > 4000) {
            throw new Error('Message is too long (max 4000 characters)');
        }

        const requestConfig = { ...this.defaultConfig, ...config };
        const url = `${this.baseURL}/models/${this.model}:generateContent?key=${key}`;
        
        const requestBody = {
            contents: [
                {
                    parts: [
                        {
                            text: message.trim()
                        }
                    ]
                }
            ],
            generationConfig: {
                temperature: requestConfig.temperature,
                topK: requestConfig.topK,
                topP: requestConfig.topP,
                maxOutputTokens: requestConfig.maxOutputTokens
            },
            safetySettings: [
                {
                    category: "HARM_CATEGORY_HARASSMENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_HATE_SPEECH",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                }
            ]
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new APIError(response.status, errorData);
            }

            const data = await response.json();
            
            if (!data.candidates || data.candidates.length === 0) {
                throw new Error('No response generated from the model');
            }

            const candidate = data.candidates[0];
            
            if (candidate.finishReason === 'SAFETY') {
                throw new Error('Response blocked due to safety concerns');
            }
            
            if (candidate.finishReason === 'RECITATION') {
                throw new Error('Response blocked due to recitation concerns');
            }

            if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
                throw new Error('Invalid response format from the model');
            }

            return candidate.content.parts[0].text || 'No response text available';

        } catch (error) {
            if (error instanceof APIError) {
                throw error;
            }
            
            if (error.name === 'AbortError') {
                throw new Error('Request was cancelled');
            }
            
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('Network error - please check your internet connection');
            }
            
            throw error;
        }
    }

    /**
     * Get a user-friendly error message from an error object
     * @param {Error|APIError} error - The error object
     * @returns {string} - User-friendly error message
     */
    getErrorMessage(error) {
        if (error instanceof APIError) {
            switch (error.status) {
                case 400:
                    return 'Invalid request. Please check your message format.';
                case 401:
                    return 'Invalid API key. Please check your credentials.';
                case 403:
                    return 'Access forbidden. Please check your API key permissions.';
                case 404:
                    return 'API endpoint not found. Please try again later.';
                case 429:
                    return 'Rate limit exceeded. Please wait before sending another message.';
                case 500:
                case 502:
                case 503:
                case 504:
                    return 'Server error. Please try again in a moment.';
                default:
                    return `API error (${error.status}): ${error.message}`;
            }
        }

        if (error.message) {
            return error.message;
        }

        return 'An unexpected error occurred. Please try again.';
    }

    /**
     * Get the current configuration
     * @returns {Object} - Current configuration
     */
    getConfig() {
        return { ...this.defaultConfig };
    }

    /**
     * Update the default configuration
     * @param {Object} newConfig - New configuration values
     */
    updateConfig(newConfig) {
        this.defaultConfig = { ...this.defaultConfig, ...newConfig };
    }

    /**
     * Check if API key is set and valid format
     * @returns {boolean} - Whether API key is ready
     */
    isReady() {
        return this.apiKey && this.validateApiKeyFormat(this.apiKey);
    }

    /**
     * Get API usage information (mock implementation)
     * @returns {Object} - Usage statistics
     */
    getUsageInfo() {
        return {
            model: this.model,
            endpoint: `${this.baseURL}/models/${this.model}:generateContent`,
            rateLimit: '10 requests per minute (free tier)',
            maxTokens: this.defaultConfig.maxOutputTokens
        };
    }
}

/**
 * Custom API Error class for better error handling
 */
class APIError extends Error {
    constructor(status, errorData = {}) {
        const message = errorData.error?.message || 
                       errorData.message || 
                       `HTTP ${status} error`;
        
        super(message);
        this.name = 'APIError';
        this.status = status;
        this.errorData = errorData;
    }
}

/**
 * Rate limiter utility to prevent API abuse
 */
class RateLimiter {
    constructor(maxRequests = 10, windowMs = 60000) { // 10 requests per minute
        this.maxRequests = maxRequests;
        this.windowMs = windowMs;
        this.requests = [];
    }

    /**
     * Check if request is allowed
     * @returns {boolean} - Whether request can proceed
     */
    canMakeRequest() {
        const now = Date.now();
        
        // Remove old requests outside the window
        this.requests = this.requests.filter(timestamp => 
            now - timestamp < this.windowMs
        );

        return this.requests.length < this.maxRequests;
    }

    /**
     * Record a new request
     */
    recordRequest() {
        this.requests.push(Date.now());
    }

    /**
     * Get time until next request is allowed
     * @returns {number} - Milliseconds to wait
     */
    getTimeToWait() {
        if (this.canMakeRequest()) {
            return 0;
        }

        const oldestRequest = Math.min(...this.requests);
        return this.windowMs - (Date.now() - oldestRequest);
    }

    /**
     * Get remaining requests in current window
     * @returns {number} - Number of requests remaining
     */
    getRemainingRequests() {
        const now = Date.now();
        this.requests = this.requests.filter(timestamp => 
            now - timestamp < this.windowMs
        );
        
        return Math.max(0, this.maxRequests - this.requests.length);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GeminiAPIService, APIError, RateLimiter };
}