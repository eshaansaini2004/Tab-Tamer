// Content script for Tab Tamer
// This script runs in the context of web pages to extract readable content

class TabTamerContent {
    constructor() {
        this.initializeMessageListener();
    }

    initializeMessageListener() {
        // Listen for messages from the background script
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.action === 'extractContent') {
                this.extractContent().then(sendResponse);
                return true; // Keep the message channel open
            }
        });
    }

    async extractContent() {
        try {
            const content = this.extractReadableContent();
            return { success: true, content };
        } catch (error) {
            console.error('Content extraction error:', error);
            return { success: false, error: error.message };
        }
    }

    extractReadableContent() {
        const title = document.title;
        const url = window.location.href;
        
        // Try to find the main content using various strategies
        let content = this.extractMainContent();
        
        // Clean up the content
        content = this.cleanContent(content);
        
        return {
            title,
            url,
            content,
            extractedAt: new Date().toISOString()
        };
    }

    extractMainContent() {
        // Strategy 1: Look for semantic HTML elements
        const semanticSelectors = [
            'article',
            '[role="main"]',
            'main',
            '.post-content',
            '.entry-content',
            '.article-content',
            '.content',
            '.main-content',
            '.post-body',
            '.entry-body'
        ];

        for (const selector of semanticSelectors) {
            const element = document.querySelector(selector);
            if (element && this.isValidContent(element)) {
                return element.innerText || element.textContent;
            }
        }

        // Strategy 2: Look for the largest text block
        const textBlocks = this.findTextBlocks();
        if (textBlocks.length > 0) {
            return textBlocks[0].text;
        }

        // Strategy 3: Fallback to body content
        return this.extractBodyContent();
    }

    isValidContent(element) {
        const text = element.innerText || element.textContent;
        return text && text.length > 100; // Must have substantial content
    }

    findTextBlocks() {
        const textBlocks = [];
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_ELEMENT,
            {
                acceptNode: (node) => {
                    // Skip script, style, and other non-content elements
                    if (['SCRIPT', 'STYLE', 'NAV', 'HEADER', 'FOOTER', 'ASIDE'].includes(node.tagName)) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    
                    // Only process elements with substantial text content
                    const text = node.innerText || node.textContent;
                    if (text && text.length > 200) {
                        return NodeFilter.FILTER_ACCEPT;
                    }
                    
                    return NodeFilter.FILTER_SKIP;
                }
            }
        );

        let node;
        while (node = walker.nextNode()) {
            const text = node.innerText || node.textContent;
            if (text && text.length > 200) {
                textBlocks.push({
                    element: node,
                    text: text,
                    length: text.length
                });
            }
        }

        // Sort by length (longest first)
        return textBlocks.sort((a, b) => b.length - a.length);
    }

    extractBodyContent() {
        // Clone the body to avoid modifying the original
        const body = document.body.cloneNode(true);
        
        // Remove unwanted elements
        const unwantedSelectors = [
            'script',
            'style',
            'nav',
            'header',
            'footer',
            'aside',
            '.advertisement',
            '.ad',
            '.ads',
            '.sidebar',
            '.navigation',
            '.menu',
            '.social-share',
            '.comments',
            '.related-posts',
            '.newsletter',
            '.popup',
            '.modal'
        ];

        unwantedSelectors.forEach(selector => {
            const elements = body.querySelectorAll(selector);
            elements.forEach(el => el.remove());
        });

        return body.innerText || body.textContent;
    }

    cleanContent(content) {
        if (!content) return '';

        return content
            // Normalize whitespace
            .replace(/\s+/g, ' ')
            // Remove excessive line breaks
            .replace(/\n\s*\n\s*\n/g, '\n\n')
            // Trim whitespace
            .trim()
            // Limit length to prevent API issues
            .substring(0, 10000);
    }
}

// Initialize the content script
new TabTamerContent();
