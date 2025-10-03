// Settings page for Tab Tamer
class TabTamerSettings {
    constructor() {
        this.initializeEventListeners();
        this.loadSettings();
    }

    initializeEventListeners() {
        document.getElementById('saveSettings').addEventListener('click', () => {
            this.saveSettings();
        });

        document.getElementById('testConnection').addEventListener('click', () => {
            this.testConnection();
        });
    }

    async loadSettings() {
        try {
            const result = await chrome.storage.sync.get(['notionToken', 'notionParentPageId']);
            
            if (result.notionToken) {
                document.getElementById('notionToken').value = result.notionToken;
            }
            
            if (result.notionParentPageId) {
                document.getElementById('notionParentPageId').value = result.notionParentPageId;
            }
        } catch (error) {
            console.error('Error loading settings:', error);
            this.showStatus('Error loading settings', 'error');
        }
    }

    async saveSettings() {
        const token = document.getElementById('notionToken').value.trim();
        const parentPageId = document.getElementById('notionParentPageId').value.trim();

        if (!token) {
            this.showStatus('Please enter your Notion integration token', 'error');
            return;
        }

        if (!parentPageId) {
            this.showStatus('Please enter your Notion parent page ID', 'error');
            return;
        }

        try {
            await chrome.storage.sync.set({
                notionToken: token,
                notionParentPageId: parentPageId
            });

            this.showStatus('Settings saved successfully! Tab Tamer will auto-create the database on first save.', 'success');
        } catch (error) {
            console.error('Error saving settings:', error);
            this.showStatus('Error saving settings', 'error');
        }
    }

    async testConnection() {
        const token = document.getElementById('notionToken').value.trim();
        const parentPageId = document.getElementById('notionParentPageId').value.trim();

        if (!token || !parentPageId) {
            this.showStatus('Please enter both token and parent page ID first', 'error');
            return;
        }

        this.showStatus('Testing connection...', 'info');

        try {
            // Test by fetching the parent page
            const response = await fetch(`https://api.notion.com/v1/pages/${parentPageId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Notion-Version': '2022-06-28'
                }
            });

            if (response.ok) {
                const page = await response.json();
                const pageTitle = page.properties && page.properties.title && page.properties.title.title && page.properties.title.title[0] 
                    ? page.properties.title.title[0].plain_text 
                    : 'Untitled';
                this.showStatus(`✅ Connection successful! Parent page found: "${pageTitle}"`, 'success');
            } else {
                const errorData = await response.json();
                this.showStatus(`❌ Connection failed: ${errorData.message || response.statusText}`, 'error');
            }
        } catch (error) {
            console.error('Error testing connection:', error);
            this.showStatus('Error testing connection: ' + error.message, 'error');
        }
    }

    showStatus(message, type) {
        const status = document.getElementById('status');
        status.textContent = message;
        status.className = `status status-${type}`;
        status.classList.remove('hidden');

        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                status.classList.add('hidden');
            }, 5000);
        }
    }
}

// Initialize settings when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TabTamerSettings();
});
