/**
 * Main Chatbot Application
 * Manages the UI and integrates all components
 */
class ChatbotApp {
    constructor() {
        this.geminiAPI = new GeminiAPIService();
        this.storage = storageManager;
        this.legalAssistant = legalAssistant; // Legal functionality
        this.rateLimiter = new RateLimiter(10, 60000); // 10 requests per minute
        
        this.state = {
            messages: [],
            isLoading: false,
            currentMessage: '',
            apiKeyConfigured: false,
            legalSpecialty: 'general',
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
        try {
            console.log('🔧 Binding DOM elements...');
            this.bindElements();
            
            console.log('🔗 Binding event listeners...');
            this.bindEvents();
            
            console.log('📂 Loading initial data...');
            this.loadInitialData();
            
            console.log('🖼️ Updating UI...');
            this.updateUI();
            
        console.log('✅ دستیار هوش مصنوعی حقوقی آماده است!');
        } catch (error) {
            console.error('❌ Error during initialization:', error);
            throw error;
        }
    }

    /**
     * Bind DOM elements to the app
     */
    bindElements() {
        try {
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
            this.elements.legalToolsBtn = document.getElementById('legalToolsBtn');
            this.elements.legalCalendarBtn = document.getElementById('legalCalendarBtn');
            this.elements.clearChatBtn = document.getElementById('clearChatBtn');
            this.elements.configureBtn = document.getElementById('configureBtn');

            // Modal elements
            this.elements.settingsModal = document.getElementById('settingsModal');
            this.elements.legalToolsModal = document.getElementById('legalToolsModal');
            this.elements.contractAnalysisModal = document.getElementById('contractAnalysisModal');
            this.elements.caseLawModal = document.getElementById('caseLawModal');
            this.elements.legalCalendarModal = document.getElementById('legalCalendarModal');
            this.elements.closeModalBtn = document.getElementById('closeModalBtn');
            this.elements.closeLegalToolsBtn = document.getElementById('closeLegalToolsBtn');
            this.elements.closeLegalToolsFooterBtn = document.getElementById('closeLegalToolsFooterBtn');
            this.elements.closeContractAnalysisBtn = document.getElementById('closeContractAnalysisBtn');
            this.elements.closeContractAnalysisFooterBtn = document.getElementById('closeContractAnalysisFooterBtn');
            this.elements.closeCaseLawBtn = document.getElementById('closeCaseLawBtn');
            this.elements.closeCaseLawFooterBtn = document.getElementById('closeCaseLawFooterBtn');
            this.elements.closeLegalCalendarBtn = document.getElementById('closeLegalCalendarBtn');
            this.elements.closeLegalCalendarFooterBtn = document.getElementById('closeLegalCalendarFooterBtn');
            this.elements.apiKeyInput = document.getElementById('apiKeyInput');
            this.elements.legalSpecialty = document.getElementById('legalSpecialty');
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
            
            // Log missing elements (for debugging)
            const missingElements = [];
            Object.keys(this.elements).forEach(key => {
                if (!this.elements[key] && key !== 'configureBtn') { // configureBtn might not exist initially
                    missingElements.push(key);
                }
            });
            
            if (missingElements.length > 0) {
                console.warn('⚠️ Missing DOM elements:', missingElements);
            }
            
        console.log('✅ اتصال عناصر DOM با موفقیت برقرار شد');
            
        } catch (error) {
            console.error('❌ Error binding DOM elements:', error);
            throw error;
        }
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
        this.elements.legalToolsBtn.addEventListener('click', () => this.openLegalTools());
        this.elements.legalCalendarBtn.addEventListener('click', () => this.openLegalCalendar());
        this.elements.clearChatBtn.addEventListener('click', () => this.clearChat());
        if (this.elements.configureBtn) {
            this.elements.configureBtn.addEventListener('click', () => this.openSettings());
        }

        // Modal events
        this.elements.closeModalBtn.addEventListener('click', () => this.closeSettings());
        this.elements.closeLegalToolsBtn.addEventListener('click', () => this.closeLegalTools());
        this.elements.closeLegalToolsFooterBtn.addEventListener('click', () => this.closeLegalTools());
        this.elements.closeContractAnalysisBtn?.addEventListener('click', () => this.closeContractAnalysis());
        this.elements.closeContractAnalysisFooterBtn?.addEventListener('click', () => this.closeContractAnalysis());
        this.elements.closeCaseLawBtn?.addEventListener('click', () => this.closeCaseLaw());
        this.elements.closeCaseLawFooterBtn?.addEventListener('click', () => this.closeCaseLaw());
        this.elements.closeLegalCalendarBtn?.addEventListener('click', () => this.closeLegalCalendar());
        this.elements.closeLegalCalendarFooterBtn?.addEventListener('click', () => this.closeLegalCalendar());
        
        // Modal overlay events
        this.elements.settingsModal.addEventListener('click', (e) => {
            if (e.target === this.elements.settingsModal) {
                this.closeSettings();
            }
        });
        this.elements.legalToolsModal.addEventListener('click', (e) => {
            if (e.target === this.elements.legalToolsModal) {
                this.closeLegalTools();
            }
        });
        this.elements.contractAnalysisModal?.addEventListener('click', (e) => {
            if (e.target === this.elements.contractAnalysisModal) {
                this.closeContractAnalysis();
            }
        });
        this.elements.caseLawModal?.addEventListener('click', (e) => {
            if (e.target === this.elements.caseLawModal) {
                this.closeCaseLaw();
            }
        });
        this.elements.legalCalendarModal?.addEventListener('click', (e) => {
            if (e.target === this.elements.legalCalendarModal) {
                this.closeLegalCalendar();
            }
        });

        // Settings form events
        this.elements.toggleApiKeyVisibility.addEventListener('click', () => this.toggleApiKeyVisibility());
        this.elements.legalSpecialty.addEventListener('change', () => this.updateLegalSpecialty());
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

        // Escape key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeSettings();
                this.closeLegalTools();
                this.closeContractAnalysis();
                this.closeCaseLaw();
                this.closeLegalCalendar();
            }
        });
        
        // Legal tools event listeners
        this.bindLegalToolsEvents();
        this.bindContractAnalysisEvents();
        this.bindCaseLawEvents();
        this.bindLegalCalendarEvents();
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
        
        // Load legal specialization
        this.state.legalSpecialty = this.state.settings.legalSpecialty || 'general';
        
        // Set legal-specific default temperature if not set
        if (!this.state.settings.temperature || this.state.settings.temperature > 0.5) {
            this.state.settings.temperature = 0.3; // Lower temperature for legal precision
        }
        
        // Set legal-specific default temperature
        if (!this.state.settings.temperature || this.state.settings.temperature > 0.5) {
            this.state.settings.temperature = 0.3; // Lower temperature for legal precision
        }
        
        this.geminiAPI.updateConfig({
            temperature: this.state.settings.temperature,
            maxOutputTokens: this.state.settings.maxTokens
        });

        // Load chat history
        this.state.messages = this.storage.loadChatHistory();
        
        // Update message counter
        this.messageIdCounter = this.state.messages.length;
        
        // Initialize legal context
        this.initializeLegalContext();
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
            this.elements.apiStatus.textContent = 'متصل';
            this.elements.apiStatusIcon.innerHTML = '<i class="fas fa-check-circle text-success"></i>';
            this.elements.messageInput.disabled = false;
            this.elements.sendBtn.disabled = false;
        } else {
            this.elements.apiStatus.textContent = 'بدون کلید API';
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
                    <i class="fas fa-balance-scale welcome-icon"></i>
                    <h2>دستیار هوش مصنوعی برای وکلای ایرانی</h2>
                    <h3 class="persian-welcome">دستیار هوش مصنوعی برای وکلای ایرانی</h3>
                    <p>دستیار هوش مصنوعی تخصصی برای وکلای ایرانی. ${this.state.apiKeyConfigured ? 'در مورد قوانین ایران، رویه‌های حقوقی، تنظیم اسناد بپرسید...' : 'برای شروع، لطفاً کلید API خود را در تنظیمات پیکربندی کنید.'}</p>
                    <div class="legal-specialties">
                        <span class="specialty-badge">Civil Law - حقوق مدنی</span>
                        <span class="specialty-badge">Criminal Law - حقوق جزا</span>
                        <span class="specialty-badge">Commercial Law - حقوق تجارت</span>
                        <span class="specialty-badge">Administrative Law - حقوق اداری</span>
                    </div>
                    ${!this.state.apiKeyConfigured ? '<button id="configureBtn" class="btn btn-primary"><i class="fas fa-key"></i> تنظیم کلید API</button>' : ''}
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
                            <button class="message-action-btn copy-btn" title="کپی پیام">
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
            this.showSuccessToast('پیام کپی شد!');
        } catch (error) {
            console.error('Failed to copy text:', error);
            this.showErrorToast('کپی پیام ناموفق بود');
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
        
        if (this.elements.legalSpecialty) {
            this.elements.legalSpecialty.value = this.state.legalSpecialty;
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
     * Send a message to the Gemini API with legal context
     */
    async sendMessage() {
        const message = this.state.currentMessage.trim();
        
        if (!message) {
            return;
        }

        if (!this.state.apiKeyConfigured) {
            this.showErrorToast('لطفاً ابتدا کلید API خود را پیکربندی کنید');
            this.openSettings();
            return;
        }

        if (!this.rateLimiter.canMakeRequest()) {
            const waitTime = Math.ceil(this.rateLimiter.getTimeToWait() / 1000);
            this.showErrorToast(`حد مجاز درخواست رد شد. لطفاً ${waitTime} ثانیه صبر کنید.`);
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
            // Enhance message with legal context
            const enhancedMessage = this.enhanceMessageWithLegalContext(message);
            
            const response = await this.geminiAPI.sendMessage(
                enhancedMessage,
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
            console.error('❌ API Error details:', {
                message: error.message,
                stack: error.stack,
                type: error.constructor.name
            });
            
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
        if (confirm('آیا مطمئن هستید که می‌خواهید تاریخچه گفتگو را پاک کنید؟')) {
            this.state.messages = [];
            this.storage.clearChatHistory();
            this.messageIdCounter = 0;
            this.updateUI();
            this.showSuccessToast('تاریخچه گفتگو پاک شد');
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
            this.showErrorToast('لطفاً ابتدا یک کلید API وارد کنید');
            return;
        }

        this.elements.testConnectionBtn.disabled = true;
        this.elements.testConnectionBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Testing...';

        try {
            const result = await this.geminiAPI.testConnection(apiKey);
            
            if (result.success) {
                this.showSuccessToast('اتصال موفق!');
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
     * Save settings including legal specialization
     */
    saveSettings() {
        const apiKey = this.elements.apiKeyInput.value.trim();
        const legalSpecialty = this.elements.legalSpecialty.value;
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
            maxTokens,
            legalSpecialty
        };
        
        this.state.legalSpecialty = legalSpecialty;

        this.storage.saveSettings(this.state.settings);
        this.geminiAPI.updateConfig({
            temperature,
            maxOutputTokens: maxTokens
        });

        this.closeSettings();
        this.updateUI();
        this.showSuccessToast('تنظیمات با موفقیت ذخیره شد!');
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
    
    /**
     * Initialize legal context for the application
     */
    initializeLegalContext() {
        // Set system message for legal context
        this.systemMessage = 'You are a professional legal AI assistant specialized in Iranian law. Provide accurate, helpful legal information while maintaining professional standards. Always cite relevant Iranian laws when possible.';
    }
    
    /**
     * Open legal tools modal
     */
    openLegalTools() {
        this.elements.legalToolsModal.classList.remove('hidden');
    }
    
    /**
     * Close legal tools modal
     */
    closeLegalTools() {
        this.elements.legalToolsModal.classList.add('hidden');
    }
    
    /**
     * Update legal specialization
     */
    updateLegalSpecialty() {
        this.state.legalSpecialty = this.elements.legalSpecialty.value;
    }
    
    /**
     * Enhance message with legal context based on specialization
     */
    enhanceMessageWithLegalContext(message) {
        const legalContext = {
            general: 'شما یک دستیار هوش مصنوعی تخصصی حقوقی برای وکلای ایرانی هستید. پاسخ‌های دقیق و حرفه‌ای حقوقی بر اساس قوانین ایران ارائه دهید. همه پاسخ‌ها باید به زبان فارسی باشد.',
            civil: 'شما متخصص حقوق مدنی ایران هستید. بر روی موضوعات مدنی، قراردادها، حقوق مالکیت و آیین دادرسی مدنی تحت قوانین ایران تمرکز کنید. پاسخ‌ها فقط به زبان فارسی باشد.',
            criminal: 'شما متخصص حقوق جزا ایران هستید. بر روی موضوعات جزایی، قانون مجازات اسلامی و آیین دادرسی کیفری تمرکز کنید. پاسخ‌ها فقط به زبان فارسی باشد.',
            commercial: 'شما متخصص حقوق تجارت ایران هستید. بر روی حقوق تجاری، معاملات تجاری و موضوعات شرکتی تمرکز کنید. پاسخ‌ها فقط به زبان فارسی باشد.',
            administrative: 'شما متخصص حقوق اداری ایران هستید. بر روی آیین‌های اداری، مقررات دولتی و دادگاه‌های اداری تمرکز کنید. پاسخ‌ها فقط به زبان فارسی باشد.',
            family: 'شما متخصص حقوق خانواده ایران هستید. بر روی ازدواج، طلاق، حضانت و موضوعات خانوادگی تحت قوانین ایران تمرکز کنید. پاسخ‌ها فقط به زبان فارسی باشد.',
            labor: 'شما متخصص حقوق کار ایران هستید. بر روی اشتغال، حقوق کارگری و مقررات کار تمرکز کنید. پاسخ‌ها فقط به زبان فارسی باشد.',
            constitutional: 'شما متخصص حقوق اساسی ایران هستید. بر روی موضوعات قانون اساسی، حقوق بنیادین و آیین‌های قانون اساسی تمرکز کنید. پاسخ‌ها فقط به زبان فارسی باشد.'
        };
        
        const contextPrefix = legalContext[this.state.legalSpecialty] || legalContext.general;
        
        return `${contextPrefix}

پاسخ خود را در قالب حرفه‌ای حقوقی ارائه دهید. از اصطلاحات حقوقی فارسی استفاده کنید و در صورت امکان به قوانین مربوطه ایران اشاره کنید. همه پاسخ‌ها باید کاملاً به زبان فارسی باشد.

سوال کاربر: ${message}`;
    }
    
    /**
     * Bind legal tools event listeners
     */
    bindLegalToolsEvents() {
        // Quick action buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.quick-action-btn')) {
                const templateId = e.target.closest('.quick-action-btn').dataset.template;
                this.insertLegalTemplate(templateId);
            }
            
            if (e.target.closest('.tool-btn')) {
                const btn = e.target.closest('.tool-btn');
                if (btn.dataset.template) {
                    this.insertDocumentTemplate(btn.dataset.template);
                } else if (btn.dataset.code) {
                    this.showLegalCode(btn.dataset.code);
                } else if (btn.dataset.calc) {
                    this.openCalculator(btn.dataset.calc);
                } else if (btn.dataset.research) {
                    this.startLegalResearch(btn.dataset.research);
                } else if (btn.dataset.contract) {
                    this.openContractAnalysis(btn.dataset.contract);
                } else if (btn.dataset.contract) {
                    this.openContractAnalysis(btn.dataset.contract);
                }
            }
        });
    }
    
    /**
     * Insert legal template into message input
     */
    insertLegalTemplate(templateId) {
        const template = this.legalAssistant.getLegalPrompt(templateId);
        if (template) {
            this.elements.messageInput.value = template.prompt;
            this.state.currentMessage = template.prompt;
            this.updateInputState();
            this.autoResizeTextarea();
            this.elements.messageInput.focus();
        }
    }
    
    /**
     * Insert document template
     */
    insertDocumentTemplate(templateId) {
        const template = this.legalAssistant.getDocumentTemplate(templateId);
        if (template) {
            const prompt = `لطفاً در تهیه ${template.name} به من کمک کنید. در اینجا ساختار قالبی که می‌خواهم استفاده کنم آورده شده است:\n\n${template.template}\n\nلطفاً این قالب را متناسب با نیازهای خاص من سفارشی کنید.`;
            this.elements.messageInput.value = prompt;
            this.state.currentMessage = prompt;
            this.updateInputState();
            this.autoResizeTextarea();
            this.closeLegalTools();
            this.elements.messageInput.focus();
        }
    }
    
    /**
     * Show legal code information
     */
    showLegalCode(codeId) {
        const code = this.legalAssistant.getLegalCodeInfo(codeId);
        if (code) {
            const prompt = `در مورد ${code.name} به من بگوییح. لطفاً یک بررسی کلی، مواد کلیدی، و آخرین به‌روزرسانی‌ها یا تفاسیر مهم ارائه دهید.`;
            this.elements.messageInput.value = prompt;
            this.state.currentMessage = prompt;
            this.updateInputState();
            this.autoResizeTextarea();
            this.closeLegalTools();
            this.elements.messageInput.focus();
        }
    }
    
    /**
     * Open legal calculator
     */
    openCalculator(calcType) {
        let prompt = '';
        switch (calcType) {
            case 'damage':
                prompt = 'لطفاً در محاسبه خسارت برای یک پرونده حقوقی به من کمک کنید. برای تعیین میزان جبران خسارت بر اساس قوانین ایران راهنمایی نیاز دارم.';
                break;
            case 'court-fees':
                prompt = 'لطفاً در محاسبه هزینه دادرسی برای طرح پرونده در دادگاه‌های ایران به من کمک کنید. نیاز دارم هزینه ثبت پرونده و هزینه‌های مرتبط را بدانم.';
                break;
            case 'deadline':
                prompt = 'لطفاً در محاسبه مهلت‌های حقوقی برای پرونده من به من کمک کنید. نیاز دارم تاریخ‌های مهم و مهلت‌های ارائه بر اساس قوانین آیین دادرسی ایران را بدانم.';
                break;
        }
        
        if (prompt) {
            this.elements.messageInput.value = prompt;
            this.state.currentMessage = prompt;
            this.updateInputState();
            this.autoResizeTextarea();
            this.closeLegalTools();
            this.elements.messageInput.focus();
        }
    }
    
    /**
     * Start legal research
     */
    startLegalResearch(researchType) {
        let prompt = '';
        switch (researchType) {
            case 'precedent':
                this.openCaseLawSearch();
                return;
            case 'law-search':
                prompt = 'نیاز دارم قوانین و مقررات خاص ایران را بررسی کنم. لطفاً در یافتن و درک مفاد حقوقی مربوط به من کمک کنید.';
                break;
            case 'regulation':
                prompt = 'نیاز دارم اطلاعاتی در مورد مقررات ایران و قواعد اداری داشته باشم. لطفاً در درک مقررات قابل اعمال به من کمک کنید.';
                break;
        }
        
        if (prompt) {
            this.elements.messageInput.value = prompt;
            this.state.currentMessage = prompt;
            this.updateInputState();
            this.autoResizeTextarea();
            this.closeLegalTools();
            this.elements.messageInput.focus();
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('🚀 Initializing Legal AI Assistant...');
        console.log('✅ DOM Content Loaded');
        
        // Check if required dependencies are available
        if (typeof GeminiAPIService === 'undefined') {
            console.error('❌ GeminiAPIService not found');
            return;
        }
        if (typeof storageManager === 'undefined') {
            console.error('❌ storageManager not found');
            return;
        }
        if (typeof legalAssistant === 'undefined') {
            console.error('❌ legalAssistant not found');
            return;
        }
        
        console.log('✅ All dependencies loaded');
        
        window.chatbotApp = new ChatbotApp();
        console.log('✅ Legal AI Assistant initialized successfully');
        
    } catch (error) {
        console.error('❌ Error initializing Legal AI Assistant:', error);
        
        // Show user-friendly error message
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ef4444;
            color: white;
            padding: 16px;
            border-radius: 8px;
            z-index: 9999;
            font-family: Arial, sans-serif;
            max-width: 300px;
        `;
        errorDiv.innerHTML = `
            <strong>⚠️ Initialization Error</strong><br>
            ${error.message}<br>
            <small>Check console for details</small>
        `;
        document.body.appendChild(errorDiv);
        
        // Auto-hide error after 10 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 10000);
    }
});

// Export for debugging purposes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChatbotApp;
}

// Add missing methods to ChatbotApp prototype
ChatbotApp.prototype.openLegalCalendar = function() {
    this.elements.legalCalendarModal.classList.remove('hidden');
    this.initializeLegalCalendar();
};

ChatbotApp.prototype.closeLegalCalendar = function() {
    this.elements.legalCalendarModal.classList.add('hidden');
};

ChatbotApp.prototype.openContractAnalysis = function(analysisType = 'analyze') {
    this.closeLegalTools();
    this.elements.contractAnalysisModal.classList.remove('hidden');
};

ChatbotApp.prototype.closeContractAnalysis = function() {
    this.elements.contractAnalysisModal.classList.add('hidden');
};

ChatbotApp.prototype.openCaseLawSearch = function() {
    this.elements.caseLawModal.classList.remove('hidden');
    this.loadCaseLawData();
};

ChatbotApp.prototype.closeCaseLaw = function() {
    this.elements.caseLawModal.classList.add('hidden');
};

ChatbotApp.prototype.bindContractAnalysisEvents = function() {
    const analyzeBtn = document.getElementById('analyzeContractBtn');
    const fileInput = document.getElementById('contractFileInput');
    
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', () => this.analyzeContract());
    }
    
    if (fileInput) {
        fileInput.addEventListener('change', (e) => this.handleContractFileUpload(e));
    }
};

ChatbotApp.prototype.bindCaseLawEvents = function() {
    const searchBtn = document.getElementById('searchCasesBtn');
    const searchInput = document.getElementById('caseSearchInput');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', () => this.searchCaseLaw());
    }
    
    if (searchInput) {
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.searchCaseLaw();
            }
        });
    }
};

ChatbotApp.prototype.bindLegalCalendarEvents = function() {
    const calculateBtn = document.getElementById('calculateDeadlineBtn');
    const addCourtDateBtn = document.getElementById('addCourtDateBtn');
    
    if (calculateBtn) calculateBtn.addEventListener('click', () => this.calculateDeadline());
    if (addCourtDateBtn) addCourtDateBtn.addEventListener('click', () => this.addCourtDate());
    
    // Tab switching
    document.addEventListener('click', (e) => {
        if (e.target.closest('.calendar-tab')) {
            const tab = e.target.closest('.calendar-tab');
            const tabName = tab.dataset.tab;
            this.switchCalendarTab(tabName);
        }
    });
};

ChatbotApp.prototype.analyzeContract = function() {
    const contractText = document.getElementById('contractTextInput').value;
    if (!contractText.trim()) {
        this.showErrorToast('لطفاً متن قرارداد را برای تجزیه و تحلیل وارد کنید');
        return;
    }
    
    const prompt = `لطفاً این قرارداد را طبق قوانین ایران تجزیه و تحلیل کنید:\n\n${contractText}\n\nتحلیل جامع شامل موارد زیر ارائه دهید:\n1. انطباق قانونی با حقوق قراردادهای ایران\n2. ارزیابی ریسک\n3. عناصر گمشده\n4. پیشنهادات بهبود\n5. امتیاز کلی و توصیه‌ها`;
    
    this.elements.messageInput.value = prompt;
    this.state.currentMessage = prompt;
    this.updateInputState();
    this.autoResizeTextarea();
    this.closeContractAnalysis();
    this.elements.messageInput.focus();
};

ChatbotApp.prototype.handleContractFileUpload = function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('contractTextInput').value = e.target.result;
        };
        reader.readAsText(file);
    }
};

ChatbotApp.prototype.searchCaseLaw = function() {
    const query = document.getElementById('caseSearchInput').value;
    const courtFilter = document.getElementById('courtFilter').value;
    const yearFilter = document.getElementById('yearFilter').value;
    const categoryFilter = document.getElementById('categoryFilter').value;
    
    const filters = { court: courtFilter, year: yearFilter, category: categoryFilter };
    const results = this.legalAssistant.searchCaseLaw(query, filters);
    this.displayCaseLawResults(results);
};

ChatbotApp.prototype.displayCaseLawResults = function(results) {
    const resultsContainer = document.getElementById('caseSearchResults');
    
    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <p>هیچ پرونده‌ای مطابق با معیارهای جستجوی شما یافت نشد</p>
            </div>
        `;
        return;
    }
    
    const resultsHTML = results.map(caseItem => `
        <div class="case-item" onclick="window.chatbotApp.selectCase('${caseItem.id}')">
            <div class="case-title">${caseItem.title}</div>
            <div class="case-meta">
                <span><i class="fas fa-building"></i> ${caseItem.court}</span>
                <span><i class="fas fa-calendar"></i> ${caseItem.date}</span>
                <span><i class="fas fa-tag"></i> ${caseItem.category}</span>
            </div>
            <div class="case-summary">${caseItem.summary}</div>
        </div>
    `).join('');
    
    resultsContainer.innerHTML = resultsHTML;
};

ChatbotApp.prototype.selectCase = function(caseId) {
    const caseItem = this.legalAssistant.caseLawDatabase.find(c => c.id == caseId);
    if (caseItem) {
        const prompt = `لطفاً تحلیل تفصیلی از این پرونده حقوقی ایرانی ارائه دهید:\n\nعنوان: ${caseItem.title}\nدادگاه: ${caseItem.court}\nتاریخ: ${caseItem.date}\nخلاصه: ${caseItem.summary}\n\nمن نیاز به موارد زیر دارم:\n1. اصول حقوقی کلیدی مطرح شده\n2. ارتباط با رویه فعلی\n3. استناد و ارزش مرجعیت\n4. پیامدهای عملی برای پرونده‌های مشابه`;
        
        this.elements.messageInput.value = prompt;
        this.state.currentMessage = prompt;
        this.updateInputState();
        this.autoResizeTextarea();
        this.closeCaseLaw();
        this.elements.messageInput.focus();
    }
};

ChatbotApp.prototype.initializeLegalCalendar = function() {
    const currentDate = new Date();
    const monthNames = ['ژانویه', 'فوریه', 'مارس', 'آوریل', 'مه', 'ژوئن',
                      'ژوئیه', 'آگوست', 'سپتامبر', 'اکتبر', 'نوامبر', 'دسامبر'];
    
    document.getElementById('currentMonthYear').textContent = 
        `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    
    this.loadUpcomingDeadlines();
    this.loadCourtDates();
    this.loadLegalHolidays();
    
    const today = new Date().toISOString().split('T')[0];
    const startDateInput = document.getElementById('startDate');
    if (startDateInput) {
        startDateInput.value = today;
    }
};

ChatbotApp.prototype.calculateDeadline = function() {
    const procedureType = document.getElementById('procedureType').value;
    const startDate = document.getElementById('startDate').value;
    
    if (!startDate) {
        this.showErrorToast('لطفاً تاریخ شروع را انتخاب کنید');
        return;
    }
    
    const deadline = this.legalAssistant.calculateDeadlines(procedureType, new Date(startDate));
    
    if (deadline) {
        const resultElement = document.getElementById('deadlineResult');
        resultElement.innerHTML = `
            <h5>${deadline.description}</h5>
            <p><strong>تاریخ شروع:</strong> ${deadline.startDate}</p>
            <p><strong>تاریخ پایان:</strong> ${deadline.endDate}</p>
            <p><strong>روزها:</strong> ${deadline.days}</p>
            <p><strong>باقیمانده:</strong> ${deadline.remainingDays > 0 ? deadline.remainingDays + ' روز' : 'مهلت گذشته'}</p>
        `;
        resultElement.classList.remove('hidden');
        
        this.saveDeadline(deadline);
        this.loadUpcomingDeadlines();
    }
};

ChatbotApp.prototype.addCourtDate = function() {
    const courtName = document.getElementById('courtName').value;
    const caseNumber = document.getElementById('caseNumber').value;
    const hearingDate = document.getElementById('hearingDate').value;
    
    if (!courtName || !caseNumber || !hearingDate) {
        this.showErrorToast('لطفاً تمام فیلدها را پر کنید');
        return;
    }
    
    const courtDate = {
        id: Date.now(),
        courtName,
        caseNumber,
        hearingDate: new Date(hearingDate),
        created: new Date()
    };
    
    this.saveCourtDate(courtDate);
    this.loadCourtDates();
    
    document.getElementById('courtName').value = '';
    document.getElementById('caseNumber').value = '';
    document.getElementById('hearingDate').value = '';
    
    this.showSuccessToast('جلسه دادگاه با موفقیت اضافه شد');
};

ChatbotApp.prototype.switchCalendarTab = function(tabName) {
    document.querySelectorAll('.calendar-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.calendar-tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}Tab`).classList.add('active');
};

ChatbotApp.prototype.loadUpcomingDeadlines = function() {
    const deadlines = this.storage.safeGetItem('legal_deadlines', []);
    const container = document.getElementById('upcomingDeadlinesList');
    
    if (deadlines.length === 0) {
        container.innerHTML = '<p class="no-deadlines">هیچ مهلتی پیش رو نیست. با استفاده از ماشین حساب بالا مهلت اضافه کنید.</p>';
        return;
    }
    
    const upcomingDeadlines = deadlines
        .filter(d => new Date(d.endDate) >= new Date())
        .sort((a, b) => new Date(a.endDate) - new Date(b.endDate));
    
    if (upcomingDeadlines.length === 0) {
        container.innerHTML = '<p class="no-deadlines">هیچ مهلتی پیش رو نیست.</p>';
        return;
    }
    
    const deadlinesHTML = upcomingDeadlines.map(deadline => {
        const daysRemaining = Math.ceil((new Date(deadline.endDate) - new Date()) / (1000 * 60 * 60 * 24));
        const urgencyClass = daysRemaining <= 3 ? 'urgent' : daysRemaining <= 7 ? 'warning' : '';
        
        return `
            <div class="deadline-item ${urgencyClass}">
                <div class="deadline-info">
                    <div class="deadline-title">${deadline.description}</div>
                    <div class="deadline-date">${deadline.endDate}</div>
                </div>
                <div class="deadline-remaining ${urgencyClass}">
                    ${daysRemaining > 0 ? daysRemaining + ' روز' : 'گذشته'}
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = deadlinesHTML;
};

ChatbotApp.prototype.loadCourtDates = function() {
    const courtDates = this.storage.safeGetItem('court_dates', []);
    const container = document.getElementById('courtDatesList');
    
    if (courtDates.length === 0) {
        container.innerHTML = '<p class="no-court-dates">هیچ جلسه دادگاهی برنامه‌ریزی نشده. با استفاده از فرم بالا جلسه اضافه کنید.</p>';
        return;
    }
    
    const upcomingDates = courtDates
        .filter(d => new Date(d.hearingDate) >= new Date())
        .sort((a, b) => new Date(a.hearingDate) - new Date(b.hearingDate));
    
    const datesHTML = upcomingDates.map(courtDate => `
        <div class="court-date-item">
            <div class="deadline-info">
                <div class="deadline-title">${courtDate.courtName}</div>
                <div class="deadline-date">پرونده: ${courtDate.caseNumber}</div>
                <div class="deadline-date">${new Date(courtDate.hearingDate).toLocaleString()}</div>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = datesHTML || '<p class="no-court-dates">هیچ جلسه دادگاهی پیش رو نیست.</p>';
};

ChatbotApp.prototype.loadLegalHolidays = function() {
    const holidays = this.legalAssistant.getLegalHolidays();
    const container = document.getElementById('holidaysList');
    
    const holidaysHTML = holidays.map(holiday => `
        <div class="holiday-item">
            <div class="holiday-name">${holiday.name}</div>
            <div class="holiday-date">${holiday.date} ${holiday.duration > 1 ? `(${holiday.duration} days)` : ''}</div>
        </div>
    `).join('');
    
    container.innerHTML = holidaysHTML;
};

ChatbotApp.prototype.saveDeadline = function(deadline) {
    const deadlines = this.storage.safeGetItem('legal_deadlines', []);
    deadlines.push(deadline);
    this.storage.safeSetItem('legal_deadlines', deadlines);
};

ChatbotApp.prototype.saveCourtDate = function(courtDate) {
    const courtDates = this.storage.safeGetItem('court_dates', []);
    courtDates.push(courtDate);
    this.storage.safeSetItem('court_dates', courtDates);
};