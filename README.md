# 🧙‍♂️ Tab Tamer

> **AI-powered browser extension that transforms your chaotic tab collection into organized, searchable knowledge**

[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white)](https://chrome.google.com/webstore)
[![Version](https://img.shields.io/badge/Version-1.0.5-black?style=for-the-badge)](https://github.com/yourusername/tab-tamer)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

## 🎯 The Problem

You know that feeling when you have 47 tabs open and you're drowning in information? You can't find anything, you're afraid to close tabs because you might lose something important, and your browser is so slow it's practically unusable?

**Tab Tamer solves this.** It's like having a personal research assistant that instantly understands, organizes, and saves your browsing sessions.

---

## ✨ What Tab Tamer Does

### 🧠 **Intelligent Categorization**
- **7 Primary Categories**: Academic, Career, Social Media, Productivity, Shopping, Health, General
- **Domain-Based Sub-categories**: Groups all Canvas tabs together, all Gmail tabs together, etc.
- **Smart Descriptions**: Generates meaningful titles and descriptions for each tab

### 🎨 **Beautiful Organization**
- **3-Level Hierarchy**: Category → Sub-category → Individual Tabs
- **Clickable Links**: All tabs remain clickable and functional
- **Expandable Sections**: Clean, collapsible interface
- **Black & White Design**: Modern, professional aesthetic

### 💾 **Powerful Export**
- **Notion Integration**: Automatically creates database and saves sessions
- **Markdown Export**: Fallback option for any note-taking app
- **One-Click Close**: Safely close all organized tabs

---

## 🚀 Quick Start

### 1. Install the Extension

```bash
# Clone the repository
git clone https://github.com/yourusername/tab-tamer.git
cd tab-tamer

# Install dependencies
npm install

# Build the extension
npm run build

# Load in Chrome
# 1. Go to chrome://extensions/
# 2. Enable "Developer mode"
# 3. Click "Load unpacked"
# 4. Select the 'dist' folder
```

### 2. Configure Notion (Optional)

1. **Create Notion Integration**:
   - Go to [notion.so/my-integrations](https://notion.so/my-integrations)
   - Click "New integration" → Name it "Tab Tamer"
   - Select your workspace → Click "Submit"
   - Copy the **Internal Integration Token** (starts with `secret_`)

2. **Get Parent Page ID**:
   - In Notion, create or navigate to a page where you want to store sessions
   - Copy the 32-character ID from the URL (after the last slash)
   - Example: `https://notion.so/My-Page-3f2a8b9c4d5e6f7a8b9c0d1e2f3a4b5c`

3. **Configure Tab Tamer**:
   - Click the Tab Tamer icon → Click ⚙️ Settings
   - Enter your Notion token and parent page ID
   - Click "Test Connection" → "Save Settings"

### 3. Use Tab Tamer

1. **Open your tabs** (any number, any websites)
2. **Click Tab Tamer** → "🪄 Weave This Session"
3. **Watch the magic** as it organizes everything
4. **Save to Notion** or **Close Clustered Tabs**

---

## 📊 Example Output

### Before: 15 Chaotic Tabs
```
Tab 1: Dashboard
Tab 2: Assignment 3
Tab 3: Inbox (1,247)
Tab 4: GitHub - microsoft/vscode
Tab 5: YouTube - React Tutorial
Tab 6: LinkedIn - John Doe
Tab 7: Amazon - MacBook Pro
... (8 more random tabs)
```

### After: Organized by Tab Tamer
```
📁 Academic & Educational
   📂 Canvas LMS (3 tabs)
      • CSCE 412: Course Dashboard
      • Assignment 3: Network Protocols
      • Lecture Notes - Chapter 6

📁 Productivity & Tools
   📂 Gmail (2 tabs)
      • Inbox (1,247 unread)
      • Sent Mail
   📂 GitHub (1 tab)
      • microsoft/vscode repository

📁 Social Media & Entertainment
   📂 YouTube (1 tab)
      • React Tutorial - Complete Guide

📁 Job Search & Career
   📂 LinkedIn (1 tab)
      • John Doe's Profile

📁 Shopping & Finance
   📂 Amazon (1 tab)
      • MacBook Pro 16" - Product Page
```

---

## 🎨 Features in Detail

### Smart Categorization System

Tab Tamer uses a **priority-based domain matching** system:

| Category | Examples |
|----------|----------|
| **Academic & Educational** | Canvas, Blackboard, .edu sites, research papers |
| **Job Search & Career** | LinkedIn, Indeed, LeetCode, company pages |
| **Social Media & Entertainment** | YouTube, Twitter, Instagram, Netflix |
| **Productivity & Tools** | Gmail, GitHub, Notion, Google Docs |
| **Shopping & Finance** | Amazon, eBay, PayPal, banking sites |
| **Health & Wellness** | WebMD, Mayo Clinic, fitness apps |
| **General Browsing** | Everything else |

### Notion Integration

When you save to Notion, Tab Tamer:

1. **Creates Database** (if it doesn't exist):
   - Name: "Tab Tamer Sessions"
   - Properties: Session Title, Summary, Date, Tab Count, Category Count

2. **Saves Session** as a new page with:
   - Hierarchical structure (Headings + Bullet points)
   - Clickable links for every tab
   - Descriptions under each link
   - Session metadata

### UI Design

- **Size**: 500×600px popup (25% larger than standard)
- **Theme**: Clean black & white aesthetic
- **Interactions**: Smooth hover effects and animations
- **Responsive**: Works on all screen sizes

---

## 🛠️ Development

### Project Structure

```
tab-tamer/
├── 📁 Source Files
│   ├── background.js      # Service worker + AI logic
│   ├── popup.js          # UI logic + interactions
│   ├── popup.html        # Main popup structure
│   ├── popup.css         # Styling (black & white theme)
│   ├── content.js        # Content extraction
│   ├── settings.js       # Settings page logic
│   └── settings.html     # Settings page
├── 📁 Configuration
│   ├── manifest.json     # Extension manifest
│   ├── package.json      # Dependencies
│   └── webpack.config.js # Build configuration
├── 📁 Documentation
│   ├── README.md         # This file
│   ├── QUICK_START.md    # Installation guide
│   └── NOTION_INTEGRATION.md # Notion setup guide
└── 📁 Build Output
    └── dist/             # Built extension (auto-generated)
```

### Available Scripts

```bash
# Development
npm install              # Install dependencies
npm run build           # Build for production
npm run dev             # Watch for changes (development)

# Setup
npm run setup           # Install deps + build
```

### Building from Source

1. **Prerequisites**:
   - Node.js 16+ 
   - npm or yarn
   - Chrome browser

2. **Build Process**:
   ```bash
   git clone https://github.com/yourusername/tab-tamer.git
   cd tab-tamer
   npm install
   npm run build
   ```

3. **Load in Chrome**:
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder

---

## 🔧 Configuration

### Notion Settings

| Setting | Description | Example |
|---------|-------------|---------|
| **Integration Token** | Your Notion API token | `secret_abc123...` |
| **Parent Page ID** | Where to create the database | `3f2a8b9c4d5e6f7a...` |

### Extension Permissions

Tab Tamer requires these permissions:

- **`tabs`**: Read your open tabs
- **`activeTab`**: Extract content from current tab
- **`storage`**: Save your settings
- **`scripting`**: Inject content extraction scripts

**Privacy**: All processing happens locally. Tab content is only sent to Notion if you choose to save.

---

## 🎯 Use Cases

### For Students
- **Research Sessions**: Organize papers, lecture notes, assignments
- **Project Work**: Group related resources by topic
- **Study Materials**: Categorize by subject or course

### For Professionals
- **Work Research**: Organize industry articles, competitor analysis
- **Project Management**: Group tasks, documentation, resources
- **Learning**: Structure online courses, tutorials, documentation

### For Everyone
- **Shopping**: Compare products across multiple tabs
- **Travel Planning**: Organize flights, hotels, activities
- **Personal Projects**: Structure hobbies, interests, goals

---

## 🐛 Troubleshooting

### Common Issues

**"Notion token not configured"**
- Go to Settings and enter your Notion integration token

**"Failed to create database"**
- Make sure your integration has access to the parent page
- Check that the parent page ID is correct (32 characters)

**"Tabs not organizing correctly"**
- Refresh the extension: `chrome://extensions/` → Reload
- Check console for errors (F12 → Console)

**"Close All Tabs not working"**
- Make sure you've run "Weave This Session" first
- Check that tabs are actually organized

### Getting Help

1. **Check the console** for error messages
2. **Reload the extension** if changes aren't showing
3. **Verify Notion settings** if saving fails
4. **Open an issue** on GitHub with details

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Test thoroughly**
5. **Commit**: `git commit -m 'Add amazing feature'`
6. **Push**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style
- Add comments for complex logic
- Test on multiple websites
- Update documentation for new features

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Notion API** for excellent documentation
- **Chrome Extension APIs** for powerful browser integration
- **Open source community** for inspiration and tools

---

## 📈 Roadmap

### Version 1.1 (Planned)
- [ ] Custom category creation
- [ ] Tab preview thumbnails
- [ ] Search within saved sessions
- [ ] Export to multiple formats

### Version 1.2 (Future)
- [ ] Machine learning for better categorization
- [ ] Cloud sync across devices
- [ ] Analytics dashboard
- [ ] Browser history analysis

---

## 📞 Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/yourusername/tab-tamer/issues)
- **Email**: your.email@example.com
- **Twitter**: [@yourusername](https://twitter.com/yourusername)

---

<div align="center">

**Made with 🧙‍♂️ by the Tab Tamer team**

[⭐ Star this repo](https://github.com/yourusername/tab-tamer) • [🐛 Report Bug](https://github.com/yourusername/tab-tamer/issues) • [💡 Request Feature](https://github.com/yourusername/tab-tamer/issues)

</div>
