# 🚀 Tab Tamer - Quick Start Guide

## What is Tab Tamer?

Tab Tamer is an AI-powered browser extension that solves the universal pain of having too many research tabs open. It automatically organizes your tabs by topic and provides meaningful summaries, so you can close tabs with confidence.

## 🎯 The Problem It Solves

- **Information Overload**: Can't visually process 40+ tab favicons
- **Loss of Context**: Forget why you opened specific tabs
- **Fear of Loss**: Afraid to close tabs because you might lose valuable information
- **Disorganization**: Tabs are just a flat, linear list with no grouping

## ✨ The Solution

Tab Tamer uses AI to:
1. **Analyze** all your open tabs' content
2. **Group** related tabs together automatically
3. **Summarize** each group and the entire session
4. **Save** organized sessions to Notion
5. **Close** grouped tabs with confidence

## 🛠️ Installation

### Prerequisites
- Node.js (v14 or higher)
- Chrome browser

### Quick Setup
```bash
# 1. Navigate to the project directory
cd "Magic Wand"

# 2. Run the setup script
npm run setup

# 3. Load in Chrome
#    - Open chrome://extensions/
#    - Enable "Developer mode"
#    - Click "Load unpacked"
#    - Select the "dist" folder
```

## 🎮 How to Use

1. **Open multiple tabs** for your research session
2. **Click the Tab Tamer icon** in your browser toolbar
3. **Click "Weave This Session"** to analyze your tabs
4. **Review the organized groups** and summaries
5. **Save to Notion** or **Close Clustered Tabs**

## 🧪 Try the Demo

```bash
# See how the AI clustering works
npm run demo
```

## 🔧 Development

```bash
# Watch for changes during development
npm run dev

# Test content extraction
npm test

# Rebuild the extension
npm run build
```

## 📁 Project Structure

```
tab-tamer/
├── dist/                 # Built extension (load this in Chrome)
├── popup.html           # Extension popup UI
├── popup.js             # Popup logic
├── background.js        # Service worker
├── content.js           # Content extraction
├── manifest.json        # Extension manifest
└── test/                # Test files
```

## 🎨 Features

- **Smart Clustering**: Groups tabs by content similarity
- **AI Summaries**: Generates meaningful descriptions
- **Beautiful UI**: Clean, intuitive interface
- **Notion Integration**: Save sessions permanently
- **One-Click Cleanup**: Close organized tabs safely

## 🚨 Troubleshooting

### Extension won't load
- Make sure you're loading the `dist` folder, not the root folder
- Check that Developer mode is enabled in Chrome

### Content not extracted
- Some sites block content extraction
- The extension includes fallback strategies

### AI analysis fails
- Check your internet connection
- Verify API keys are configured (for production use)

## 🎉 Success!

You now have a powerful AI assistant that transforms your chaotic tab situation into organized, actionable research sessions. No more tab anxiety!

---

**Made with ❤️ for researchers, developers, and knowledge workers everywhere**
