/**
 * Main Chatbot Application
 * Manages the UI and integrates all components
 */
class ChatbotApp {
    constructor() {
        this.geminiAPI = new GeminiAPIService();
        this.storage = storageManager;
        this.rateLimiter = new RateLimiter(10, 60000); // 10 requests per minute
        
        this.state = {
            messages: [],
            isLoading: false,
            currentMessage: '',
            apiKeyConfigured: false,
            settings: this.storage.loadSettings()
        };

        this.elements = {};
        this.messageIdCounter = 0;
        
        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        this.bindElements();
        this.bindEvents();
        this.loadInitialData();
        this.updateUI();
        
        console.log('Gemini Chatbot initialized');
    }

    /**
     * Bind DOM elements to the app
     */
    bindElements() {
        // Main elements
        this.elements.messagesContainer = document.getElementById('messagesContainer');
        this.elements.messageInput = document.getElementById('messageInput');
        this.elements.sendBtn = document.getElementById('sendBtn');
        this.elements.loadingIndicator = document.getElementById('loadingIndicator');
        this.elements.charCount = document.getElementById('charCount');
        this.elements.apiStatus = document.getElementById('apiStatus');
        this.elements.apiStatusIcon = document.getElementById('apiStatusIcon');

        // Header buttons
        this.elements.settingsBtn = document.getElementById('settingsBtn');
        this.elements.clearChatBtn = document.getElementById('clearChatBtn');
        this.elements.configureBtn = document.getElementById('configureBtn');

        // Modal elements
        this.elements.settingsModal = document.getElementById('settingsModal');
        this.elements.closeModalBtn = document.getElementById('closeModalBtn');
        this.elements.apiKeyInput = document.getElementById('apiKeyInput');
        this.elements.toggleApiKeyVisibility = document.getElementById('toggleApiKeyVisibility');
        this.elements.temperatureSlider = document.getElementById('temperatureSlider');
        this.elements.temperatureValue = document.getElementById('temperatureValue');
        this.elements.maxTokensInput = document.getElementById('maxTokensInput');
        this.elements.testConnectionBtn = document.getElementById('testConnectionBtn');
        this.elements.saveSettingsBtn = document.getElementById('saveSettingsBtn');

        // Toast elements
        this.elements.errorToast = document.getElementById('errorToast');
        this.elements.successToast = document.getElementById('successToast');
        this.elements.errorMessage = document.getElementById('errorMessage');
        this.elements.successMessage = document.getElementById('successMessage');
        this.elements.closeErrorBtn = document.getElementById('closeErrorBtn');
        this.elements.closeSuccessBtn = document.getElementById('closeSuccessBtn');
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Message input events
        this.elements.messageInput.addEventListener('input', () => this.handleInputChange());
        this.elements.messageInput.addEventListener('keydown', (e) => this.handleKeyDown(e));
        this.elements.sendBtn.addEventListener('click', () => this.sendMessage());

        // Header button events
        this.elements.settingsBtn.addEventListener('click', () => this.openSettings());
        this.elements.clearChatBtn.addEventListener('click', () => this.clearChat());
        if (this.elements.configureBtn) {
            this.elements.configureBtn.addEventListener('click', () => this.openSettings());
        }

        // Modal events
        this.elements.closeModalBtn.addEventListener('click', () => this.closeSettings());
        this.elements.settingsModal.addEventListener('click', (e) => {
            if (e.target === this.elements.settingsModal) {
                this.closeSettings();
            }
        });

        // Settings form events
        this.elements.toggleApiKeyVisibility.addEventListener('click', () => this.toggleApiKeyVisibility());
        this.elements.temperatureSlider.addEventListener('input', () => this.updateTemperatureDisplay());
        this.elements.testConnectionBtn.addEventListener('click', () => this.testConnection());
        this.elements.saveSettingsBtn.addEventListener('click', () => this.saveSettings());

        // Toast events
        this.elements.closeErrorBtn.addEventListener('click', () => this.hideErrorToast());
        this.elements.closeSuccessBtn.addEventListener('click', () => this.hideSuccessToast());

        // Auto-hide toasts
        setTimeout(() => this.hideErrorToast(), 5000);
        setTimeout(() => this.hideSuccessToast(), 3000);

        // Handle browser close/refresh
        window.addEventListener('beforeunload', () => this.saveSession());

        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeSettings();
            }
        });
    }

    /**
     * Load initial data from storage
     */
    loadInitialData() {
        // Load API key
        const apiKey = this.storage.loadApiKey();
        if (apiKey) {
            this.geminiAPI.setApiKey(apiKey);
            this.state.apiKeyConfigured = true;
        }

        // Load settings
        this.state.settings = this.storage.loadSettings();
        this.geminiAPI.updateConfig({
            temperature: this.state.settings.temperature,
            maxOutputTokens: this.state.settings.maxTokens
        });

        // Load chat history
        this.state.messages = this.storage.loadChatHistory();
        
        // Update message counter
        this.messageIdCounter = this.state.messages.length;
    }

    /**
     * Update UI based on current state
     */
    updateUI() {
        this.updateApiStatus();
        this.updateChatContainer();
        this.updateInputState();
        this.updateSettingsForm();
    }

    /**
     * Update API status indicator
     */
    updateApiStatus() {
        if (this.state.apiKeyConfigured && this.geminiAPI.isReady()) {
            this.elements.apiStatus.textContent = 'Connected';
            this.elements.apiStatusIcon.innerHTML = '<i class="fas fa-check-circle text-success"></i>';
            this.elements.messageInput.disabled = false;
            this.elements.sendBtn.disabled = false;
        } else {
            this.elements.apiStatus.textContent = 'No API Key';
            this.elements.apiStatusIcon.innerHTML = '<i class="fas fa-times-circle text-error"></i>';
            this.elements.messageInput.disabled = true;
            this.elements.sendBtn.disabled = true;
        }
    }

    /**
     * Update chat container with messages
     */
    updateChatContainer() {
        if (this.state.messages.length === 0) {
            // Show welcome message
            this.elements.messagesContainer.innerHTML = `
                <div class="welcome-message">
                    <i class="fas fa-robot welcome-icon"></i>
                    <h2>Welcome to Gemini Chatbot</h2>
                    <p>I'm powered by Google's Gemini 2.5 Flash model. ${this.state.apiKeyConfigured ? 'Send me a message to get started!' : 'To get started, please configure your API key in the settings.'}</p>
                    ${!this.state.apiKeyConfigured ? '<button id="configureBtn" class="btn btn-primary"><i class="fas fa-key"></i> Configure API Key</button>' : ''}
                </div>
            `;
            
            // Re-bind configure button if needed
            const configureBtn = document.getElementById('configureBtn');
            if (configureBtn) {
                configureBtn.addEventListener('click', () => this.openSettings());
            }
        } else {
            // Render messages
            this.renderMessages();
        }
    }

    /**
     * Render all messages in the chat
     */
    renderMessages() {
        const messagesHTML = this.state.messages.map(message => this.renderMessage(message)).join('');
        this.elements.messagesContainer.innerHTML = messagesHTML;
        
        // Bind message action buttons
        this.bindMessageActions();
        
        // Scroll to bottom
        this.scrollToBottom();
    }

    /**
     * Render a single message
     * @param {Object} message - Message object
     * @returns {string} - HTML string
     */
    renderMessage(message) {
        const timestamp = new Date(message.timestamp).toLocaleTimeString();
        const isUser = message.type === 'user';
        
        return `
            <div class="message ${message.type}" data-message-id="${message.id}">
                <div class="message-content">
                    ${this.formatMessageContent(message.content)}
                    <div class="message-timestamp">${timestamp}</div>
                    ${!isUser ? `
                        <div class="message-actions">
                            <button class="message-action-btn copy-btn" title="Copy message">
                                <i class="fas fa-copy"></i>
                            </button>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    /**
     * Format message content (basic markdown support)
     * @param {string} content - Raw message content
     * @returns {string} - Formatted HTML
     */
    formatMessageContent(content) {
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/\n/g, '<br>')
            .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    }

    /**
     * Bind event listeners to message action buttons
     */
    bindMessageActions() {
        const copyBtns = document.querySelectorAll('.copy-btn');
        copyBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const messageElement = e.target.closest('.message');
                const messageId = messageElement.dataset.messageId;
                const message = this.state.messages.find(m => m.id === messageId);
                if (message) {
                    this.copyToClipboard(message.content);
                }
            });
        });
    }

    /**
     * Copy text to clipboard
     * @param {string} text - Text to copy
     */
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showSuccessToast('Message copied to clipboard!');
        } catch (error) {
            console.error('Failed to copy text:', error);
            this.showErrorToast('Failed to copy message');
        }
    }

    /**
     * Update input state and character count
     */
    updateInputState() {
        const length = this.elements.messageInput.value.length;
        this.elements.charCount.textContent = `${length} / 4000`;
        
        if (length > 4000) {
            this.elements.charCount.classList.add('text-error');
            this.elements.sendBtn.disabled = true;
        } else {
            this.elements.charCount.classList.remove('text-error');
            this.elements.sendBtn.disabled = !this.state.apiKeyConfigured || length === 0 || this.state.isLoading;
        }
    }

    /**
     * Update settings form with current values
     */
    updateSettingsForm() {
        if (this.elements.apiKeyInput) {
            this.elements.apiKeyInput.value = this.storage.loadApiKey() || '';
        }
        
        this.elements.temperatureSlider.value = this.state.settings.temperature;
        this.elements.temperatureValue.textContent = this.state.settings.temperature;
        this.elements.maxTokensInput.value = this.state.settings.maxTokens;
    }

    /**
     * Handle input change events
     */
    handleInputChange() {
        this.state.currentMessage = this.elements.messageInput.value;
        this.updateInputState();
        this.autoResizeTextarea();
    }

    /**
     * Auto-resize textarea based on content
     */
    autoResizeTextarea() {
        const textarea = this.elements.messageInput;
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 150) + 'px';
    }

    /**
     * Handle keydown events
     * @param {KeyboardEvent} event - The keyboard event
     */
    handleKeyDown(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.sendMessage();
        }
    }

    /**
     * Send a message to the Gemini API
     */
    async sendMessage() {
        const message = this.state.currentMessage.trim();
        
        if (!message) {
            return;
        }

        if (!this.state.apiKeyConfigured) {
            this.showErrorToast('Please configure your API key first');
            this.openSettings();
            return;
        }

        if (!this.rateLimiter.canMakeRequest()) {
            const waitTime = Math.ceil(this.rateLimiter.getTimeToWait() / 1000);
            this.showErrorToast(`Rate limit exceeded. Please wait ${waitTime} seconds.`);
            return;
        }

        // Add user message
        const userMessage = {
            id: `msg_${++this.messageIdCounter}`,
            type: 'user',
            content: message,
            timestamp: new Date().toISOString()
        };

        this.state.messages.push(userMessage);
        this.storage.saveChatMessage(userMessage);

        // Clear input and update UI
        this.state.currentMessage = '';
        this.elements.messageInput.value = '';
        this.elements.messageInput.style.height = 'auto';
        this.state.isLoading = true;
        
        this.updateUI();
        this.showLoading();

        // Record request for rate limiting
        this.rateLimiter.recordRequest();

        try {
            const response = await this.geminiAPI.sendMessage(
                message,
                null,
                {
                    temperature: this.state.settings.temperature,
                    maxOutputTokens: this.state.settings.maxTokens
                }
            );

            // Add bot response
            const botMessage = {
                id: `msg_${++this.messageIdCounter}`,
                type: 'bot',
                content: response,
                timestamp: new Date().toISOString()
            };

            this.state.messages.push(botMessage);
            this.storage.saveChatMessage(botMessage);

        } catch (error) {
            console.error('API Error:', error);
            
            // Add error message
            const errorMessage = {
                id: `msg_${++this.messageIdCounter}`,
                type: 'bot',
                content: `❌ **Error:** ${this.geminiAPI.getErrorMessage(error)}`,
                timestamp: new Date().toISOString()
            };

            this.state.messages.push(errorMessage);
            this.showErrorToast(this.geminiAPI.getErrorMessage(error));
        } finally {
            this.state.isLoading = false;
            this.hideLoading();
            this.updateUI();
        }
    }

    /**
     * Show loading indicator
     */
    showLoading() {
        this.elements.loadingIndicator.classList.remove('hidden');
        this.elements.sendBtn.disabled = true;
        this.scrollToBottom();
    }

    /**
     * Hide loading indicator
     */
    hideLoading() {
        this.elements.loadingIndicator.classList.add('hidden');
        this.updateInputState();
    }

    /**
     * Scroll chat to bottom
     */
    scrollToBottom() {
        setTimeout(() => {
            this.elements.messagesContainer.scrollTop = this.elements.messagesContainer.scrollHeight;
        }, 100);
    }

    /**
     * Clear chat history
     */
    clearChat() {
        if (confirm('Are you sure you want to clear the chat history?')) {
            this.state.messages = [];
            this.storage.clearChatHistory();
            this.messageIdCounter = 0;
            this.updateUI();
            this.showSuccessToast('Chat history cleared');
        }
    }

    /**
     * Open settings modal
     */
    openSettings() {
        this.updateSettingsForm();
        this.elements.settingsModal.classList.remove('hidden');
        this.elements.apiKeyInput.focus();
    }

    /**
     * Close settings modal
     */
    closeSettings() {
        this.elements.settingsModal.classList.add('hidden');
    }

    /**
     * Toggle API key visibility
     */
    toggleApiKeyVisibility() {
        const input = this.elements.apiKeyInput;
        const icon = this.elements.toggleApiKeyVisibility.querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.className = 'fas fa-eye-slash';
        } else {
            input.type = 'password';
            icon.className = 'fas fa-eye';
        }
    }

    /**
     * Update temperature display
     */
    updateTemperatureDisplay() {
        this.elements.temperatureValue.textContent = this.elements.temperatureSlider.value;
    }

    /**
     * Test API connection
     */
    async testConnection() {
        const apiKey = this.elements.apiKeyInput.value.trim();
        
        if (!apiKey) {
            this.showErrorToast('Please enter an API key first');
            return;
        }

        this.elements.testConnectionBtn.disabled = true;
        this.elements.testConnectionBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Testing...';

        try {
            const result = await this.geminiAPI.testConnection(apiKey);
            
            if (result.success) {
                this.showSuccessToast('Connection successful!');
            } else {
                this.showErrorToast(result.message);
            }
        } catch (error) {
            this.showErrorToast('Connection test failed');
        } finally {
            this.elements.testConnectionBtn.disabled = false;
            this.elements.testConnectionBtn.innerHTML = '<i class="fas fa-wifi"></i> Test Connection';
        }
    }

    /**
     * Save settings
     */
    saveSettings() {
        const apiKey = this.elements.apiKeyInput.value.trim();
        const temperature = parseFloat(this.elements.temperatureSlider.value);
        const maxTokens = parseInt(this.elements.maxTokensInput.value);

        // Validate inputs
        if (maxTokens < 1 || maxTokens > 8192) {
            this.showErrorToast('Max tokens must be between 1 and 8192');
            return;
        }

        // Save API key
        if (apiKey) {
            if (!this.geminiAPI.validateApiKeyFormat(apiKey)) {
                this.showErrorToast('Invalid API key format');
                return;
            }
            
            this.storage.saveApiKey(apiKey);
            this.geminiAPI.setApiKey(apiKey);
            this.state.apiKeyConfigured = true;
        } else if (this.state.apiKeyConfigured) {
            // Remove API key if cleared
            this.storage.removeApiKey();
            this.geminiAPI.setApiKey(null);
            this.state.apiKeyConfigured = false;
        }

        // Save settings
        this.state.settings = {
            ...this.state.settings,
            temperature,
            maxTokens
        };

        this.storage.saveSettings(this.state.settings);
        this.geminiAPI.updateConfig({
            temperature,
            maxOutputTokens: maxTokens
        });

        this.closeSettings();
        this.updateUI();
        this.showSuccessToast('Settings saved successfully!');
    }

    /**
     * Save current session
     */
    saveSession() {
        this.storage.saveSession({
            messageCount: this.state.messages.length,
            lastActivity: new Date().toISOString(),
            settings: this.state.settings
        });
    }

    /**
     * Show error toast
     * @param {string} message - Error message
     */
    showErrorToast(message) {
        this.elements.errorMessage.textContent = message;
        this.elements.errorToast.classList.remove('hidden');
        
        setTimeout(() => this.hideErrorToast(), 5000);
    }

    /**
     * Show success toast
     * @param {string} message - Success message
     */
    showSuccessToast(message) {
        this.elements.successMessage.textContent = message;
        this.elements.successToast.classList.remove('hidden');
        
        setTimeout(() => this.hideSuccessToast(), 3000);
    }

    /**
     * Hide error toast
     */
    hideErrorToast() {
        this.elements.errorToast.classList.add('hidden');
    }

    /**
     * Hide success toast
     */
    hideSuccessToast() {
        this.elements.successToast.classList.add('hidden');
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.chatbotApp = new ChatbotApp();
});

// Export for debugging purposes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChatbotApp;
}