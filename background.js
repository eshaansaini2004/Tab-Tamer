// COMPLETE REWRITE following original instructions

class TabTamerAgent {
    constructor() {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            this.handleMessage(request, sender, sendResponse);
            return true;
        });
    }

    async handleMessage(request, sender, sendResponse) {
        try {
            switch (request.action) {
                case 'weaveSession':
                    const result = await this.weaveSession(request.tabs);
                    sendResponse({ success: true, data: result });
                    break;
                
                case 'saveToNotion':
                    const saveResult = await this.saveToNotion(request.data);
                    sendResponse(saveResult);
                    break;
                
                default:
                    sendResponse({ success: false, error: 'Unknown action' });
            }
        } catch (error) {
            console.error('Background script error:', error);
            sendResponse({ success: false, error: error.message });
        }
    }

    async weaveSession(tabs) {
        console.log(`Processing ${tabs.length} tabs...`);
        
        // Extract content from each tab
        const tabContents = [];
        for (let i = 0; i < tabs.length; i++) {
            const tab = tabs[i];
            try {
                const content = await this.extractTabContent(tab);
                tabContents.push({
                    index: i,
                    url: tab.url,
                    title: tab.title,
                    favIconUrl: tab.favIconUrl,
                    content: content || ''
                });
            } catch (error) {
                console.warn(`Failed to extract content from tab ${i}:`, error);
                tabContents.push({
                    index: i,
                    url: tab.url,
                    title: tab.title,
                    favIconUrl: tab.favIconUrl,
                    content: ''
                });
            }
        }

        console.log(`Extracted content from ${tabContents.length} tabs`);

        // Generate response following EXACT instructions
        const response = this.generateResponse(tabContents);
        
        return response;
    }

    async extractTabContent(tab) {
        try {
            const result = await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: () => {
                    const article = document.querySelector('article, main, [role="main"]');
                    if (article) return article.innerText;
                    
                    const content = document.querySelector('.content, #content, .post, .article');
                    if (content) return content.innerText;
                    
                    return document.body.innerText.slice(0, 5000);
                }
            });
            return result[0]?.result || '';
        } catch (error) {
            return '';
        }
    }

    // STEP 1: Categorize into PRIMARY categories based on DOMAIN
    categorizePrimaryCategory(domain) {
        const d = domain.toLowerCase();
        
        // Academic & Educational
        if (d.includes('canvas') || d.includes('tamu.edu') || d.includes('blackboard') ||
            d.includes('moodle') || d.includes('gradescope') || d.includes('.edu')) {
            return 'Academic & Educational';
        }
        
        // Job Search & Career
        if (d.includes('linkedin') || d.includes('indeed') || d.includes('glassdoor') ||
            d.includes('leetcode') || d.includes('hackerrank')) {
            return 'Job Search & Career';
        }
        
        // Productivity & Tools (check Gmail BEFORE general google)
        if (d.includes('mail.google') || d.includes('gmail')) {
            return 'Productivity & Tools';
        }
        if (d.includes('github') || d.includes('stackoverflow') || d.includes('notion') ||
            d.includes('grammarly') || d.includes('keep.google') || d.includes('docs.google') ||
            d.includes('drive.google') || d.includes('trello') || d.includes('slack') ||
            d.includes('figma')) {
            return 'Productivity & Tools';
        }
        if (d.includes('google')) {
            return 'Productivity & Tools';
        }
        
        // Social Media & Entertainment
        if (d.includes('youtube') || d.includes('twitter') || d.includes('facebook') ||
            d.includes('instagram') || d.includes('tiktok') || d.includes('reddit') ||
            d.includes('netflix') || d.includes('spotify')) {
            return 'Social Media & Entertainment';
        }
        
        // Shopping & Finance
        if (d.includes('amazon') || d.includes('ebay') || d.includes('etsy') ||
            d.includes('walmart') || d.includes('target') || d.includes('paypal') ||
            d.includes('chase') || d.includes('bankofamerica')) {
            return 'Shopping & Finance';
        }
        
        // Health & Wellness
        if (d.includes('webmd') || d.includes('mayoclinic') || d.includes('healthline')) {
            return 'Health & Wellness';
        }
        
        return 'General Browsing';
    }

    // STEP 2: Get human-readable source name
    getSourceName(domain) {
        const d = domain.toLowerCase();
        
        if (d.includes('canvas')) return 'Canvas LMS';
        if (d.includes('tamu.edu')) return 'Texas A&M University';
        if (d.includes('blackboard')) return 'Blackboard';
        if (d.includes('gradescope')) return 'Gradescope';
        if (d.includes('mail.google') || d.includes('gmail')) return 'Gmail';
        if (d.includes('linkedin')) return 'LinkedIn';
        if (d.includes('indeed')) return 'Indeed';
        if (d.includes('leetcode')) return 'LeetCode';
        if (d.includes('hackerrank')) return 'HackerRank';
        if (d.includes('github')) return 'GitHub';
        if (d.includes('stackoverflow')) return 'Stack Overflow';
        if (d.includes('notion')) return 'Notion';
        if (d.includes('grammarly')) return 'Grammarly';
        if (d.includes('keep.google')) return 'Google Keep';
        if (d.includes('docs.google')) return 'Google Docs';
        if (d.includes('drive.google')) return 'Google Drive';
        if (d.includes('youtube')) return 'YouTube';
        if (d.includes('twitter')) return 'Twitter';
        if (d.includes('facebook')) return 'Facebook';
        if (d.includes('instagram')) return 'Instagram';
        if (d.includes('tiktok')) return 'TikTok';
        if (d.includes('reddit')) return 'Reddit';
        if (d.includes('amazon')) return 'Amazon';
        if (d.includes('ebay')) return 'eBay';
        if (d.includes('google')) return 'Google Services';
        if (d.includes('webmd')) return 'WebMD';
        
        // Fallback: capitalize first part of domain
        const parts = domain.split('.');
        const name = parts[0];
        return name.charAt(0).toUpperCase() + name.slice(1);
    }

    // STEP 3: Extract domain from URL
    extractDomain(url) {
        try {
            return new URL(url).hostname.replace('www.', '');
        } catch {
            return 'unknown';
        }
    }

    // STEP 4: Generate category summary
    generateCategorySummary(category, tabCount) {
        const descriptions = {
            'Academic & Educational': 'Educational content, courses, assignments, and research materials',
            'Job Search & Career': 'Professional networking, job listings, and career development resources',
            'Social Media & Entertainment': 'Social platforms, videos, music, news, and entertainment content',
            'Productivity & Tools': 'Work tools, development resources, and productivity applications',
            'Shopping & Finance': 'E-commerce sites, banking, and financial services',
            'Health & Wellness': 'Medical information, fitness, and wellness resources',
            'General Browsing': 'Miscellaneous web content and resources'
        };
        return `${tabCount} pages - ${descriptions[category] || 'web content'}`;
    }

    // MAIN LOGIC: Generate response following EXACT instructions
    generateResponse(tabContents) {
        console.log('=== GENERATING RESPONSE ===');
        
        // STEP 1: Group by domain (for sub-categorization)
        const domainGroups = {};
        tabContents.forEach((tab, index) => {
            const domain = this.extractDomain(tab.url);
            console.log(`Tab ${index}: "${tab.title}" - Domain: ${domain}`);
            
            if (!domainGroups[domain]) {
                domainGroups[domain] = [];
            }
            domainGroups[domain].push({ ...tab, originalIndex: index });
        });

        console.log(`Grouped into ${Object.keys(domainGroups).length} domains`);

        // STEP 2: Categorize each domain into PRIMARY categories
        const primaryCategories = {};
        
        Object.entries(domainGroups).forEach(([domain, tabs]) => {
            const primaryCategory = this.categorizePrimaryCategory(domain);
            const sourceName = this.getSourceName(domain);
            
            console.log(`Domain "${domain}" -> Category: "${primaryCategory}", Source: "${sourceName}"`);
            
            if (!primaryCategories[primaryCategory]) {
                primaryCategories[primaryCategory] = {};
            }
            
            if (!primaryCategories[primaryCategory][sourceName]) {
                primaryCategories[primaryCategory][sourceName] = {
                    domain: domain,
                    tabs: []
                };
            }
            
            primaryCategories[primaryCategory][sourceName].tabs.push(...tabs);
        });

        // STEP 3: Create clusters (one per PRIMARY category)
        const clusters = [];
        
        Object.entries(primaryCategories).forEach(([primaryCategory, subCategories]) => {
            const allTabsInCategory = Object.values(subCategories).flatMap(sub => sub.tabs);
            
            const cluster = {
                cluster_title: primaryCategory,
                cluster_summary: this.generateCategorySummary(primaryCategory, allTabsInCategory.length),
                tab_indexes: allTabsInCategory.map(t => t.originalIndex),
                sub_categories: Object.entries(subCategories).map(([sourceName, subData]) => ({
                    name: sourceName,
                    domain: subData.domain,
                    tab_count: subData.tabs.length,
                    tab_indexes: subData.tabs.map(t => t.originalIndex)
                }))
            };
            
            clusters.push(cluster);
            console.log(`Created cluster: "${primaryCategory}" with ${cluster.sub_categories.length} sub-categories`);
        });

        // STEP 4: Generate session summary
        const sessionSummary = `This research session contains ${tabContents.length} pages organized into ${clusters.length} major categories. The content is properly grouped by domain with specific sub-categorization.`;
        const sessionTitle = `Research Session with ${tabContents.length} tabs`;

        console.log('=== RESPONSE GENERATED ===');
        console.log(`Clusters: ${clusters.length}`);
        clusters.forEach((c, i) => {
            console.log(`  ${i+1}. ${c.cluster_title}: ${c.sub_categories.length} sub-categories, ${c.tab_indexes.length} tabs`);
        });

        return {
            session_summary: sessionSummary,
            suggested_title: sessionTitle,
            clusters: clusters
        };
    }

    async saveToNotion(sessionData) {
        // Notion integration logic here
        return { success: true, message: 'Notion integration pending' };
    }
}

// Initialize the agent
new TabTamerAgent();
