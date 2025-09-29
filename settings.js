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
            const result = await chrome.storage.sync.get(['notionToken', 'notionDatabaseId']);
            
            if (result.notionToken) {
                document.getElementById('notionToken').value = result.notionToken;
            }
            
            if (result.notionDatabaseId) {
                document.getElementById('notionDatabaseId').value = result.notionDatabaseId;
            }
        } catch (error) {
            console.error('Error loading settings:', error);
            this.showStatus('Error loading settings', 'error');
        }
    }

    async saveSettings() {
        const token = document.getElementById('notionToken').value.trim();
        const databaseId = document.getElementById('notionDatabaseId').value.trim();

        if (!token) {
            this.showStatus('Please enter your Notion integration token', 'error');
            return;
        }

        if (!databaseId) {
            this.showStatus('Please enter your Notion database ID', 'error');
            return;
        }

        try {
            await chrome.storage.sync.set({
                notionToken: token,
                notionDatabaseId: databaseId
            });

            this.showStatus('Settings saved successfully!', 'success');
        } catch (error) {
            console.error('Error saving settings:', error);
            this.showStatus('Error saving settings', 'error');
        }
    }

    async testConnection() {
        const token = document.getElementById('notionToken').value.trim();
        const databaseId = document.getElementById('notionDatabaseId').value.trim();

        if (!token || !databaseId) {
            this.showStatus('Please enter both token and database ID first', 'error');
            return;
        }

        this.showStatus('Testing connection...', 'info');

        try {
            const response = await chrome.runtime.sendMessage({
                action: 'testNotionConnection',
                token: token,
                databaseId: databaseId
            });

            if (response.success) {
                this.showStatus(`✅ Connection successful! Connected to: ${response.databaseTitle}`, 'success');
            } else {
                this.showStatus(`❌ Connection failed: ${response.error}`, 'error');
            }
        } catch (error) {
            console.error('Error testing connection:', error);
            this.showStatus('Error testing connection', 'error');
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
