# Gemini Chatbot Web Application

A simple, responsive web-based chatbot interface that integrates with Google's Gemini 2.5 Flash API to provide conversational AI capabilities.

## Features

- 🤖 **Gemini 2.5 Flash Integration** - Powered by Google's latest AI model
- 💬 **Real-time Chat Interface** - Smooth conversation experience
- 🔑 **API Key Management** - Secure local storage of credentials
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 💾 **Chat History** - Persistent storage of conversations
- ⚙️ **Customizable Settings** - Adjust temperature, max tokens, and more
- 🚀 **Rate Limiting** - Built-in protection against API abuse
- 🎨 **Modern UI** - Clean, professional interface
- 📋 **Copy Messages** - Easy copying of AI responses
- 🔒 **Client-side Only** - No server required, runs entirely in browser

## Quick Start

1. **Download the files** - Clone or download this repository
2. **Open in browser** - Simply open `index.html` in any modern web browser
3. **Get API Key** - Visit [Google AI Studio](https://aistudio.google.com/app/apikey) to get your free API key
4. **Configure** - Click the settings button and enter your API key
5. **Start Chatting** - Begin your conversation with Gemini!

## File Structure

```
chatbo2/
├── index.html          # Main HTML file
├── styles.css          # CSS styling
├── app.js             # Main application logic
├── gemini-api.js      # Gemini API service
├── storage.js         # Local storage utilities
└── README.md          # This file
```

## Setup Instructions

### Prerequisites

- Any modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection
- Google AI Studio API key

### Getting Your API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key
5. Keep it secure and don't share it publicly

### Installation

1. **Download the project:**
   ```bash
   git clone <repository-url>
   cd chatbo2
   ```

2. **Open in browser:**
   - Double-click `index.html`, or
   - Right-click → "Open with" → your browser, or
   - Drag and drop `index.html` into your browser

3. **Configure API Key:**
   - Click the settings icon (⚙️) in the header
   - Enter your API key in the "Gemini API Key" field
   - Click "Test Connection" to verify
   - Click "Save Settings"

4. **Start chatting:**
   - Type your message in the input field
   - Press Enter or click the send button
   - Enjoy your conversation with Gemini!

## Configuration Options

### Settings Panel

Access the settings by clicking the ⚙️ icon in the header:

- **API Key**: Your Gemini API key (required)
- **Temperature**: Controls response creativity (0-1)
  - 0 = More focused and deterministic
  - 1 = More creative and varied
- **Max Tokens**: Maximum response length (1-8192)

### Default Settings

```javascript
{
  temperature: 0.7,     // Balanced creativity
  maxTokens: 1024,      // Moderate response length
  autoSave: true,       // Auto-save chat history
  theme: 'light'        // UI theme
}
```

## Usage Guide

### Basic Chat

1. Type your message in the text area at the bottom
2. Press Enter or click the send button (✈️)
3. Wait for Gemini's response
4. Continue the conversation

### Keyboard Shortcuts

- **Enter**: Send message
- **Shift + Enter**: New line in message
- **Escape**: Close settings modal

### Message Actions

- **Copy**: Click the copy icon on bot messages to copy to clipboard
- **Clear Chat**: Click the trash icon in header to clear all messages

### Rate Limiting

- Maximum 10 requests per minute (free tier)
- Built-in rate limiting prevents API abuse
- Wait time displayed if limit exceeded

## Browser Compatibility

### Supported Browsers

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

### Required Features

- ES6+ JavaScript support
- Fetch API
- Local Storage
- CSS Grid and Flexbox

## Technical Details

### Architecture

- **Frontend Only**: No server required
- **Modular Design**: Separate concerns into different files
- **Event-Driven**: Reactive UI updates
- **Storage**: Browser Local Storage for persistence

### API Integration

- **Endpoint**: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`
- **Method**: POST with JSON payload
- **Authentication**: API key in URL parameter
- **Safety**: Built-in content filtering

### Security

- **Client-side Storage**: API key stored locally only
- **No Server**: Eliminates server-side security concerns
- **HTTPS**: All API calls use secure connections
- **Input Validation**: Prevents malformed requests

## Troubleshooting

### Common Issues

1. **"No API Key" Error**
   - Solution: Configure your API key in settings
   - Verify: Test connection in settings panel

2. **"Invalid API Key" Error**
   - Solution: Check API key format and permissions
   - Get new key: Visit Google AI Studio

3. **"Rate Limit Exceeded" Error**
   - Solution: Wait 60 seconds before next request
   - Upgrade: Consider paid API plan for higher limits

4. **Network Errors**
   - Solution: Check internet connection
   - Verify: Try refreshing the page

5. **Messages Not Showing**
   - Solution: Check browser console for errors
   - Try: Clear browser cache and reload

### Debug Mode

Open browser developer tools (F12) to see detailed logs and errors.

### Browser Storage

The app stores data in your browser's Local Storage:
- API key (encrypted with base64)
- Chat history (last 100 messages)
- Settings and preferences

## Customization

### Styling

Edit `styles.css` to customize:
- Colors and themes
- Fonts and typography
- Layout and spacing
- Responsive breakpoints

### Configuration

Modify `app.js` to change:
- Default settings
- Rate limiting rules
- Message limits
- UI behavior

### API Settings

Adjust `gemini-api.js` for:
- Model parameters
- Safety settings
- Error handling
- Request formatting

## Privacy & Data

### What's Stored Locally

- Your API key (base64 encoded)
- Chat conversation history
- Application settings
- Session data

### What's Sent to Google

- Your messages to the AI
- Configuration parameters (temperature, max tokens)
- No personal identifying information

### Data Control

- All data stays in your browser
- Clear chat history anytime
- Remove API key anytime
- Export/import functionality available

## Limitations

### Free Tier Limits

- 10 requests per minute
- Rate limiting enforced
- Subject to Google's usage policies

### Browser Limits

- Local Storage: ~5-10MB typical limit
- Chat history: Limited to last 100 messages
- No synchronization across devices

### API Constraints

- Maximum 4000 characters per message
- Response length limited by max tokens setting
- Subject to Gemini's content policies

## Support

### Getting Help

1. Check this README for common solutions
2. Review browser console for error messages
3. Test API key connectivity in settings
4. Verify browser compatibility

### Reporting Issues

When reporting issues, please include:
- Browser name and version
- Error messages from console
- Steps to reproduce the problem
- Screenshot if applicable

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Google AI for the Gemini API
- Font Awesome for icons
- Google Fonts for typography
- Modern web standards for making this possible

---

**Enjoy chatting with Gemini! 🤖✨**