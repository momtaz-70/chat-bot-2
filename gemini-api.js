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
            maxOutputTokens: 2048  // Increased from 1024 to allow longer responses
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
            console.warn('⚠️ API key validation failed: Empty or invalid type');
            return false;
        }
        
        const trimmedKey = apiKey.trim();
        
        // Google API keys typically start with 'AIza' and are 39 characters long
        const apiKeyPattern = /^AIza[A-Za-z0-9_-]{35}$/;
        const isValid = apiKeyPattern.test(trimmedKey);
        
        if (!isValid) {
            console.warn('⚠️ API key validation failed: Invalid format. Expected format: AIza... (39 characters total)');
            console.warn('⚠️ Provided key length:', trimmedKey.length);
            console.warn('⚠️ Provided key starts with:', trimmedKey.substring(0, 4));
        } else {
            console.log('✅ API key format validation passed');
        }
        
        return isValid;
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
                message: 'کلید API ضروری است'
            };
        }

        if (!this.validateApiKeyFormat(testKey)) {
            return {
                success: false,
                message: 'فرمت کلید API نامعتبر است'
            };
        }

        try {
            const response = await this.sendMessage('Hello', testKey, {
                maxOutputTokens: 10
            });
            
            return {
                success: true,
                message: 'اتصال با موفقیت برقرار شد'
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
            throw new Error('کلید API ضروری است');
        }

        if (!message || message.trim().length === 0) {
            throw new Error('پیام نمی‌تواند خالی باشد');
        }

        if (message.length > 4000) {
            throw new Error('پیام خیلی طولانی است (حداکثر 4000 کاراکتر)');
        }

        const requestConfig = { ...this.defaultConfig, ...config };
        const url = `${this.baseURL}/models/${this.model}:generateContent?key=${key}`;
        
        console.log('📡 Making API request to:', url.replace(key, '[API_KEY_HIDDEN]'));
        console.log('🔧 Request config:', requestConfig);
        
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
        
        console.log('📜 Request body:', JSON.stringify(requestBody, null, 2));

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
            
            // Debug logging for API response
            console.log('🔍 Gemini API Response:', JSON.stringify(data, null, 2));
            
            if (!data.candidates || data.candidates.length === 0) {
                console.error('❌ No candidates in response:', data);
                throw new Error('هیچ پاسخی از مدل تولید نشد');
            }

            const candidate = data.candidates[0];
            console.log('🔍 Candidate data:', JSON.stringify(candidate, null, 2));
            
            if (candidate.finishReason === 'SAFETY') {
                throw new Error('پاسخ به دلیل ملاحظات ایمنی مسدود شد');
            }
            
            if (candidate.finishReason === 'RECITATION') {
                throw new Error('پاسخ به دلیل ملاحظات تکرار محتوا مسدود شد');
            }
            
            if (candidate.finishReason === 'MAX_TOKENS') {
                console.warn('⚠️ Response was truncated due to max tokens limit');
                // Continue processing but with a warning - we might still have partial content
            }

            // More flexible response handling
            let responseText = '';
            
            if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
                responseText = candidate.content.parts[0].text;
            } else if (candidate.content && candidate.content.text) {
                // Alternative response format
                responseText = candidate.content.text;
            } else if (candidate.text) {
                // Direct text property
                responseText = candidate.text;
            } else if (candidate.message) {
                // Another possible format
                responseText = candidate.message;
            } else {
                console.error('❌ Unexpected response structure:', candidate);
                
                // If MAX_TOKENS, provide a helpful message
                if (candidate.finishReason === 'MAX_TOKENS') {
                    throw new Error('پاسخ به دلیل محدودیت طول کوتاه شد. لطفاً پیام کوتاه‌تری بفرستید یا بیشینه طول پاسخ را در تنظیمات افزایش دهید.');
                }
                
                throw new Error('فرمت پاسخ مدل نامعتبر است');
            }
            
            if (!responseText || responseText.trim() === '') {
                if (candidate.finishReason === 'MAX_TOKENS') {
                    throw new Error('پاسخ به طور کامل به دلیل محدودیت طول کوتاه شد. لطفاً بیشینه طول پاسخ را در تنظیمات افزایش دهید.');
                }
            throw new Error('پاسخ خالی از مدل');
            }
            
            // Add truncation warning if needed
            if (candidate.finishReason === 'MAX_TOKENS') {
                responseText += '\n\n⚠️ *Note: This response was truncated due to token limit. You can increase the max tokens in settings for longer responses.*';
            }

            return responseText;

        } catch (error) {
            if (error instanceof APIError) {
                throw error;
            }
            
            if (error.name === 'AbortError') {
            throw new Error('درخواست لغو شد');
            }
            
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error('خطای شبکه - لطفاً اتصال اینترنت خود را بررسی کنید');
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
                    return 'درخواست نامعتبر. لطفاً فرمت پیام را بررسی کنید.';
                case 401:
                    return 'کلید API نامعتبر. لطفاً اعتبار خود را بررسی کنید.';
                case 403:
                    return 'دسترسی ممنوع. لطفاً مجوزهای کلید API خود را بررسی کنید.';
                case 404:
                    return 'API endpoint یافت نشد. لطفاً بعداً دوباره تلاش کنید.';
                case 429:
                    return 'حد مجاز درخواست رد شد. لطفاً قبل از ارسال پیام بعدی صبر کنید.';
                case 500:
                case 502:
                case 503:
                case 504:
                    return 'خطای سرور. لطفاً کمی بعد دوباره تلاش کنید.';
                default:
                    return `خطای API (${error.status}): ${error.message}`;
            }
        }

        if (error.message) {
            return error.message;
        }

        return 'خطای غیرمنتظره رخ داد. لطفاً دوباره تلاش کنید.';
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