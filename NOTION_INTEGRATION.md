# 🚀 Notion Integration - Automatic Database Creation

## Overview

Tab Tamer now features **fully automated Notion integration**! You only need to provide:
1. **Notion Integration Token**
2. **Parent Page ID**

Tab Tamer will automatically:
- ✅ Find existing "Tab Tamer Sessions" database (if it exists)
- ✅ Create the database with the correct schema (if it doesn't exist)
- ✅ Save your sessions with full hierarchical structure
- ✅ Include clickable links and descriptions

---

## 🎯 Setup Guide

### Step 1: Create Notion Integration

1. Go to [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Click **"+ New integration"**
3. Give it a name: `Tab Tamer`
4. Select the workspace where you want to save tabs
5. Set capabilities:
   - ✅ **Read content**
   - ✅ **Update content**
   - ✅ **Insert content**
6. Click **"Submit"**
7. **Copy the "Internal Integration Token"** (starts with `secret_`)

### Step 2: Prepare Parent Page

1. In Notion, navigate to (or create) a page where you want Tab Tamer to store sessions
   - Example: Create a page called "My Browser Sessions"
2. **Share this page with your integration:**
   - Click the "..." menu in the top-right
   - Select "Connections" or "Add connections"
   - Find and select your "Tab Tamer" integration
3. **Copy the Page ID** from the URL:
   - URL format: `https://www.notion.so/My-Page-<PAGE_ID>?pvs=4`
   - The Page ID is the 32-character string (with or without dashes)
   - Example: `3f2a8b9c4d5e6f7a8b9c0d1e2f3a4b5c`

### Step 3: Configure Tab Tamer

1. Open Tab Tamer extension
2. Click the **⚙️ Settings** button
3. Enter your **Notion Integration Token**
4. Enter your **Parent Page ID**
5. Click **"Test Connection"** to verify
6. Click **"Save Settings"**

✅ **Done!** You're all set!

---

## 🎨 What Gets Created

### Database Schema

When you save your first session, Tab Tamer creates a database called **"Tab Tamer Sessions"** with these properties:

| Property | Type | Description |
|----------|------|-------------|
| **Session Title** | Title | AI-generated title for the session |
| **Summary** | Rich Text | Overall session summary |
| **Date** | Date | When the session was saved |
| **Tab Count** | Number | Total number of tabs |
| **Category Count** | Number | Number of primary categories |

### Page Structure

Each saved session creates a new page in the database with this hierarchical structure:

```
📄 Session Title (e.g., "Research Session with 15 tabs")
├─ 📝 Summary paragraph
├─ 📁 Primary Category 1 (e.g., "Academic & Educational")
│   ├─ 📂 Sub-category 1 (e.g., "Canvas LMS (3 tabs)")
│   │   ├─ 🔗 Tab 1: Meaningful Title (clickable link)
│   │   │   └─ 💬 Specific description (gray text)
│   │   ├─ 🔗 Tab 2: Meaningful Title
│   │   │   └─ 💬 Specific description
│   │   └─ 🔗 Tab 3: Meaningful Title
│   │       └─ 💬 Specific description
│   └─ 📂 Sub-category 2 (e.g., "Texas A&M University (2 tabs)")
│       └─ ...
├─ 📁 Primary Category 2 (e.g., "Productivity & Tools")
│   └─ ...
└─ ...
```

---

## 🔧 How It Works

### Function 1: `findOrCreateDatabase(notionToken, parentPageId)`

**Purpose:** Ensures the "Tab Tamer Sessions" database exists

**Process:**
1. **Search** for existing databases with the exact title "Tab Tamer Sessions"
2. **If found:** Return the database ID
3. **If not found:**
   - Create a new database as a child of the parent page
   - Set up the schema with all required properties
   - Store the database ID for future use
   - Return the new database ID

**Key Features:**
- ✅ Idempotent: Safe to run multiple times
- ✅ Reuses existing database if found
- ✅ No manual database setup required

### Function 2: `saveSessionToDatabase(notionToken, databaseId, sessionData)`

**Purpose:** Saves a tab organization session to Notion

**Process:**
1. **Calculate metrics:** Total tabs, category count
2. **Build page content:**
   - Heading 2 for each primary category
   - Heading 3 for each sub-category (domain)
   - Bulleted list items for each tab with:
     - Clickable hyperlink using meaningful title
     - Nested paragraph with specific description (gray text)
3. **Create the page** with properties populated
4. **Handle pagination:** If >100 blocks, append in batches (Notion API limit)

**Key Features:**
- ✅ Preserves full 3-level hierarchy
- ✅ All links are clickable
- ✅ Descriptions are nested under each link
- ✅ Handles large sessions (100+ tabs)

---

## 📊 Data Flow

```
User clicks "Save to Notion"
        ↓
popup.js sends session data to background.js
        ↓
NotionService.saveSession() called
        ↓
Check if token & parentPageId are configured
        ↓
findOrCreateDatabase()
    ├─ Search for existing database
    ├─ If not found, create new one
    └─ Return database ID
        ↓
saveSessionToDatabase()
    ├─ Build hierarchical content structure
    ├─ Create page with properties
    └─ Append remaining blocks if needed
        ↓
Return success with page URL
        ↓
Show success message to user
```

---

## 🛠️ Technical Implementation

### API Endpoints Used

1. **Search API** (`POST /v1/search`)
   - Find existing database by title
   
2. **Create Database API** (`POST /v1/databases`)
   - Create new database with schema

3. **Create Page API** (`POST /v1/pages`)
   - Create new session entry with content

4. **Append Blocks API** (`PATCH /v1/blocks/{block_id}/children`)
   - Add remaining blocks for large sessions

### Code Structure

```javascript
// background.js

class NotionService {
    constructor() {
        this.DATABASE_TITLE = 'Tab Tamer Sessions';
        this.NOTION_VERSION = '2022-06-28';
    }

    async saveSession(sessionData) { ... }
    async findOrCreateDatabase(notionToken, parentPageId) { ... }
    async saveSessionToDatabase(notionToken, databaseId, sessionData) { ... }
    buildPageContent(sessionData) { ... }
    addTabBullets(children, sessionData, tabIndexes) { ... }
    async appendRemainingBlocks(notionToken, pageId, remainingBlocks) { ... }
}
```

---

## 🎯 Benefits of This Approach

### For Users
- ✅ **No manual setup:** No need to create database manually
- ✅ **One-time configuration:** Set token + page ID once
- ✅ **Automatic detection:** Reuses existing database if present
- ✅ **Beautiful structure:** Hierarchical organization preserved
- ✅ **Clickable links:** All URLs are hyperlinked
- ✅ **Searchable:** All content is searchable in Notion

### For Developers
- ✅ **Robust:** Handles errors gracefully
- ✅ **Idempotent:** Safe to run multiple times
- ✅ **Scalable:** Handles large sessions (100+ tabs)
- ✅ **Maintainable:** Clear separation of concerns
- ✅ **Extensible:** Easy to add new properties/features

---

## 🔍 Troubleshooting

### Error: "Notion token not configured"
**Solution:** Go to Settings and enter your Notion Integration Token

### Error: "Notion parent page not configured"
**Solution:** Go to Settings and enter the Page ID of your parent page

### Error: "Failed to create database"
**Possible Causes:**
- Integration doesn't have access to the parent page
- Parent page ID is incorrect
- Token is invalid or expired

**Solution:**
1. Verify the parent page is shared with your integration
2. Double-check the page ID from the URL
3. Re-generate the integration token if needed

### Error: "Failed to create page"
**Possible Causes:**
- Database ID is incorrect
- Session data is malformed
- API rate limit exceeded

**Solution:**
1. Let Tab Tamer recreate the database (delete old one if needed)
2. Try again with fewer tabs
3. Wait a few minutes if rate limited

---

## 📝 Example Session

### Input: 12 Open Tabs
- 3 Canvas pages
- 2 Gmail tabs
- 2 GitHub repos
- 3 YouTube videos
- 1 LinkedIn profile
- 1 Amazon product page

### Output in Notion:

**Page Title:** "Research Session with 12 tabs"

**Properties:**
- Summary: "This research session contains 12 pages organized into 4 major categories..."
- Date: 2025-09-29
- Tab Count: 12
- Category Count: 4

**Content:**

## Academic & Educational
*Educational resources and course materials*

### Canvas LMS (3 tabs)
- 🔗 [CSCE 412: Course Dashboard](https://canvas.tamu.edu/...)
  - Main dashboard for cloud computing course
- 🔗 [Assignment 3: Network Protocols](https://canvas.tamu.edu/...)
  - PDF assignment for network protocols project
- 🔗 [Lecture Notes - Chapter 6](https://canvas.tamu.edu/...)
  - Lecture slides on Virtual Private Clouds

## Productivity & Tools
*Work and productivity applications*

### Gmail (2 tabs)
- 🔗 [Inbox (3,792 unread)](https://mail.google.com/...)
  - Personal email inbox
- 🔗 [Sent Mail](https://mail.google.com/...)
  - Sent messages folder

... and so on

---

## 🚀 Future Enhancements

Potential improvements:
- [ ] Tags property for custom categorization
- [ ] Status property (To Review, Reviewed, Archived)
- [ ] Priority property for important sessions
- [ ] Relation to Projects database
- [ ] Screenshots/thumbnails of tabs
- [ ] Automatic archiving of old sessions
- [ ] Export to multiple databases

---

## 📚 Resources

- [Notion API Documentation](https://developers.notion.com/)
- [Creating an Integration](https://developers.notion.com/docs/create-a-notion-integration)
- [Database Properties](https://developers.notion.com/reference/property-object)
- [Block Types](https://developers.notion.com/reference/block)

---

**Version:** 1.0.4  
**Last Updated:** September 29, 2025  
**Status:** ✅ Production Ready
