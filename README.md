# Tab Tamer 🧙‍♂️

AI-powered browser extension to intelligently organize and summarize your research sessions.

## Overview

Tab Tamer is a Chrome extension that uses intelligent categorization to automatically:
- **Organize** your open tabs into meaningful categories and sub-categories
- **Categorize** by content type (Academic, Work, Social Media, etc.)
- **Summarize** your browsing session with AI-powered insights
- **Save** organized sessions to Notion or export as markdown
- **Manage** tab overload with smart grouping

## Features

### ✨ Smart 3-Level Categorization
- **Primary Categories**: Academic & Educational, Job Search & Career, Social Media & Entertainment, Productivity & Tools, Shopping & Finance, Health & Wellness, General Browsing
- **Sub-Categories**: Automatically groups tabs from the same domain (e.g., all Canvas tabs together)
- **Individual Tabs**: Each tab with meaningful titles and specific descriptions

### 🎯 Intelligent Organization
- Domain-based grouping (Canvas LMS, Gmail, GitHub, etc.)
- Context-aware descriptions
- Meaningful title generation for generic pages

### 💾 Export & Save
- Direct Notion integration with structured formatting
- Markdown export as fallback
- Preserves hierarchy and organization

### 🎨 Beautiful UI
- Clean, modern interface
- Expandable/collapsible sections
- Scrollable content areas
- Action buttons for quick access

## Installation

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Magic Wand"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the extension**
   ```bash
   npm run build
   ```

4. **Load in Chrome**
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder

See [QUICK_START.md](QUICK_START.md) for detailed step-by-step instructions.

## Usage

1. **Open tabs** you want to organize
2. **Click the Tab Tamer icon** in your browser toolbar
3. **Click "Weave This Session"** to analyze and organize
4. **Review** the categorized tabs with their descriptions
5. **Save** to Notion or export as markdown

### Example Organization

```
📁 Academic & Educational
   📂 Canvas LMS
      • Course Dashboard - CSCE 412
      • Assignment 3: Network Protocols
      • Lecture Notes - Chapter 6

📁 Productivity & Tools
   📂 Gmail
      • Inbox (3,792 unread)
   📂 GitHub
      • Repository: microsoft/vscode
```

## Configuration

### Notion Integration (Optional)

1. Click the **⚙️ Settings** button in the extension
2. Enter your **Notion API Token**
3. Enter your **Notion Database ID**
4. Click **Test Connection** to verify
5. Click **Save Settings**

## Development

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Watch for changes (development)
npm run dev

# Run setup script
npm run setup
```

## Project Structure

```
Magic Wand/
├── background.js       # Service worker with categorization logic
├── popup.js           # Popup UI logic
├── popup.html         # Popup HTML structure
├── popup.css          # Popup styles
├── content.js         # Content script for tab extraction
├── settings.js        # Settings page logic
├── settings.html      # Settings page
├── manifest.json      # Extension manifest
├── webpack.config.js  # Webpack configuration
└── dist/             # Built extension (generated)
```

## Categorization Logic

Tab Tamer uses a **priority-based domain categorization** system:

1. **Domain Detection**: Extract hostname from tab URL
2. **Primary Categorization**: Assign to one of 7 main categories
3. **Sub-Categorization**: Group tabs from same domain together
4. **Description Generation**: Create specific, content-based descriptions

### Supported Sites

- **Academic**: Canvas, Blackboard, Gradescope, .edu domains
- **Career**: LinkedIn, Indeed, LeetCode, HackerRank
- **Productivity**: Gmail, GitHub, Notion, Grammarly, Stack Overflow
- **Social Media**: YouTube, Twitter, Facebook, Instagram, TikTok
- **Shopping**: Amazon, eBay, PayPal
- **Health**: WebMD, Mayo Clinic
- And many more...

## Tech Stack

- **Chrome Extension**: Manifest V3
- **JavaScript**: ES6+ with modern syntax
- **Build Tool**: Webpack 5
- **APIs**: Chrome Extension APIs, Notion API
- **Styling**: Pure CSS with modern features

## Browser Compatibility

- Chrome: ✅ Full support (Manifest V3)
- Edge: ✅ Compatible (Chromium-based)
- Firefox: ⚠️ Requires Manifest V2 port
- Safari: ❌ Not supported

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Version

Current Version: **1.0.2**

---

Made with 🧙‍♂️ by the Tab Tamer team