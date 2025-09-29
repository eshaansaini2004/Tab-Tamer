// Popup script for Tab Tamer
class TabTamerPopup {
    constructor() {
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.getElementById('weave-session').addEventListener('click', () => {
            this.weaveSession();
        });

        document.getElementById('save-to-notion').addEventListener('click', () => {
            this.saveToNotion();
        });

        document.getElementById('close-clustered-tabs').addEventListener('click', () => {
            this.closeClusteredTabs();
        });

        document.getElementById('settings-btn').addEventListener('click', () => {
            this.openSettings();
        });
    }

    async weaveSession() {
        this.showLoading(true);
        this.hideError();

        try {
            // Get all open tabs
            const tabs = await chrome.tabs.query({});
            console.log('All tabs found:', tabs.length);
            
            // Filter out chrome:// and extension pages
            const contentTabs = tabs.filter(tab => 
                tab.url && 
                !tab.url.startsWith('chrome://') && 
                !tab.url.startsWith('chrome-extension://') &&
                !tab.url.startsWith('moz-extension://')
            );

            console.log('Content tabs after filtering:', contentTabs.length);
            contentTabs.forEach((tab, index) => {
                console.log(`Tab ${index}: "${tab.title}" - ${tab.url}`);
            });

            if (contentTabs.length === 0) {
                throw new Error('No content tabs found to analyze');
            }

            // Store tabs globally for reference
            window.currentTabs = contentTabs;

            // Send message to background script to process tabs
            const response = await chrome.runtime.sendMessage({
                action: 'weaveSession',
                tabs: contentTabs
            });

            if (response.success) {
                this.displayResults(response.data);
            } else {
                throw new Error(response.error || 'Failed to process tabs');
            }

        } catch (error) {
            console.error('Error weaving session:', error);
            this.showError(error.message);
        } finally {
            this.showLoading(false);
        }
    }

    displayResults(data) {
        const { session_summary, suggested_title, clusters } = data;

        // Store the complete session data for closing tabs later
        this.currentSessionData = data;
        window.currentSessionData = data; // Store globally for easy access

        // Update session info
        document.getElementById('session-title').textContent = suggested_title;
        document.getElementById('session-summary').textContent = session_summary;

        // Display clusters
        const clustersContainer = document.getElementById('clusters');
        clustersContainer.innerHTML = '';

        clusters.forEach((cluster, index) => {
            const clusterElement = this.createClusterElement(cluster, index);
            clustersContainer.appendChild(clusterElement);
        });

        // Show results
        document.getElementById('main-content').classList.add('hidden');
        document.getElementById('results').classList.remove('hidden');
    }

    createClusterElement(cluster, index) {
        const clusterDiv = document.createElement('div');
        clusterDiv.className = 'cluster';
        
        // Check if this cluster has sub-categories
        const hasSubCategories = cluster.sub_categories && cluster.sub_categories.length > 0;
        
        clusterDiv.innerHTML = `
            <div class="cluster-header" data-cluster-index="${index}">
                <div class="cluster-title">${cluster.cluster_title}</div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span class="cluster-count">${cluster.tab_indexes.length}</span>
                    <span class="chevron">▼</span>
                </div>
            </div>
            <div class="cluster-summary">${cluster.cluster_summary}</div>
            <div class="cluster-actions">
                <button class="action-button" data-action="toggle">
                    📋 View ${cluster.tab_indexes.length} Articles
                </button>
                <button class="action-button" data-action="open-new-tabs">
                    🔗 Open All in New Tabs
                </button>
                <button class="action-button" data-action="add-to-window">
                    ➕ Add All to Current Window
                </button>
            </div>
            <div class="tabs-list">
                ${hasSubCategories ? this.renderSubCategories(cluster) : this.renderDirectTabs(cluster)}
            </div>
        `;

        // Add click handler for the header
        const header = clusterDiv.querySelector('.cluster-header');
        header.addEventListener('click', () => {
            const tabsList = clusterDiv.querySelector('.tabs-list');
            const chevron = clusterDiv.querySelector('.chevron');
            tabsList.classList.toggle('expanded');
            chevron.classList.toggle('expanded');
        });

        // Add event listeners for action buttons
        const actionButtons = clusterDiv.querySelectorAll('.action-button');
        actionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const action = e.target.getAttribute('data-action');
                const cluster = e.target.closest('.cluster');
                
                switch(action) {
                    case 'toggle':
                        const tabsList = cluster.querySelector('.tabs-list');
                        const chevron = cluster.querySelector('.chevron');
                        if (tabsList) {
                            tabsList.classList.toggle('expanded');
                            cluster.classList.toggle('expanded');
                        }
                        if (chevron) {
                            chevron.classList.toggle('expanded');
                        }
                        break;
                    case 'open-new-tabs':
                        const links = cluster.querySelectorAll('.tab-item a');
                        links.forEach(link => window.open(link.href, '_blank'));
                        break;
                    case 'add-to-window':
                        const tabLinks = cluster.querySelectorAll('.tab-item a');
                        tabLinks.forEach(link => chrome.tabs.create({url: link.href}));
                        break;
                }
            });
        });

        // Add error handlers for favicons
        const favicons = clusterDiv.querySelectorAll('.tab-favicon');
        favicons.forEach(img => {
            img.addEventListener('error', () => {
                const fallback = img.getAttribute('data-fallback');
                if (fallback) {
                    img.src = fallback;
                }
            });
        });

        return clusterDiv;
    }

    renderSubCategories(cluster) {
        return cluster.sub_categories.map(subCategory => `
            <div class="sub-category">
                <div class="sub-category-header">
                    <h4 class="sub-category-title">${subCategory.name}</h4>
                    <span class="sub-category-count">${subCategory.tab_count} tabs</span>
                </div>
                <div class="sub-category-tabs">
                    ${subCategory.tab_indexes.map(tabIndex => {
                        const tab = this.getTabByIndex(tabIndex);
                        if (!tab) return '';
                        
                        const defaultIcon = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjNjY2Ij48cGF0aCBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMCAxMC00LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnptLTIgMTVsLTUtNSAxLjQxLTEuNDFMMTAgMTQuMTdsNy41OS03LjU5TDE5IDhsLTkgOXoiLz48L3N2Zz4=';
                        const fallbackIcon = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjNjY2Ij48cGF0aCBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMCAxMC00LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnptLTIgMTVsLTUtNSAxLjQxLTEuNDFMMTAgMTQuMTdsNy41OS03LjU5TDE5IDhsLTkgOXoiLz48L3N2Zz4=';
                        
                        const meaningfulTitle = this.generateMeaningfulTitle(tab, cluster);
                        const specificDescription = this.generateSpecificDescription(tab, cluster, this.getTabContent(tab), meaningfulTitle);
                        
                        return `
                            <div class="tab-item">
                                <img src="${tab.favIconUrl || defaultIcon}" 
                                     class="tab-favicon" 
                                     data-fallback="${fallbackIcon}" />
                                <div class="tab-content">
                                    <a href="${tab.url}" target="_blank" class="tab-title" title="${meaningfulTitle}">${meaningfulTitle}</a>
                                    <div class="tab-description">${specificDescription}</div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `).join('');
    }

    renderDirectTabs(cluster) {
        return cluster.tab_indexes.map(tabIndex => {
            const tab = this.getTabByIndex(tabIndex);
            if (!tab) return '';
            
            const defaultIcon = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjNjY2Ij48cGF0aCBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMCAxMC00LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnptLTIgMTVsLTUtNSAxLjQxLTEuNDFMMTAgMTQuMTdsNy41OS03LjU5TDE5IDhsLTkgOXoiLz48L3N2Zz4=';
            const fallbackIcon = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjNjY2Ij48cGF0aCBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMCAxMC00LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnptLTIgMTVsLTUtNSAxLjQxLTEuNDFMMTAgMTQuMTdsNy41OS03LjU5TDE5IDhsLTkgOXoiLz48L3N2Zz4=';
            
            const meaningfulTitle = this.generateMeaningfulTitle(tab, cluster);
            const specificDescription = this.generateSpecificDescription(tab, cluster, this.getTabContent(tab), meaningfulTitle);
            
            return `
                <div class="tab-item">
                    <img src="${tab.favIconUrl || defaultIcon}" 
                         class="tab-favicon" 
                         data-fallback="${fallbackIcon}" />
                    <div class="tab-content">
                        <a href="${tab.url}" target="_blank" class="tab-title" title="${meaningfulTitle}">${meaningfulTitle}</a>
                        <div class="tab-description">${specificDescription}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    getTabByIndex(index) {
        // This would need to be implemented to track tabs by index
        // For now, we'll store the tabs in a global variable
        return window.currentTabs ? window.currentTabs[index] : null;
    }

    generateTabDescription(tab, cluster) {
        if (!tab) return 'No description available';
        
        // Generate a specific description based on the tab's content and context
        const url = typeof tab.url === 'string' ? tab.url : '';
        const title = typeof tab.title === 'string' ? tab.title : '';
        const content = this.getTabContent(tab);
        const clusterTitle = typeof cluster.cluster_title === 'string' ? cluster.cluster_title : '';
        
        // Generate meaningful title if current title is generic
        const meaningfulTitle = this.generateMeaningfulTitle(tab, cluster);
        
        // Generate specific description based on content analysis
        return this.generateSpecificDescription(tab, cluster, content, meaningfulTitle);
    }

    generateMeaningfulTitle(tab, cluster) {
        const originalTitle = typeof tab.title === 'string' ? tab.title : '';
        const url = typeof tab.url === 'string' ? tab.url : '';
        const content = this.getTabContent(tab);
        
        // If title is generic or empty, generate a better one
        const genericTitles = ['dashboard', 'home', 'login', 'welcome', 'page', 'untitled'];
        const isGeneric = genericTitles.some(generic => 
            originalTitle.toLowerCase().includes(generic)
        );
        
        if (isGeneric || !originalTitle.trim()) {
            return this.createMeaningfulTitle(tab, cluster, content, url);
        }
        
        return originalTitle;
    }

    createMeaningfulTitle(tab, cluster, content, url) {
        const clusterTitle = cluster.cluster_title || '';
        const domain = this.extractDomainFromUrl(url);
        
        // Canvas-specific meaningful titles
        if (domain.includes('canvas')) {
            if (content.includes('course') && content.includes('assignment')) {
                const courseMatch = content.match(/([A-Z]{2,4}\s*\d{3,4})/);
                if (courseMatch) {
                    return `${courseMatch[1]} - Course Dashboard`;
                }
                return 'Course Dashboard';
            } else if (content.includes('assignment')) {
                return 'Assignment Details';
            } else if (content.includes('grade')) {
                return 'Grades & Feedback';
            }
        }
        
        // LinkedIn-specific meaningful titles
        if (domain.includes('linkedin')) {
            if (content.includes('profile')) {
                return 'LinkedIn Profile';
            } else if (content.includes('job')) {
                return 'Job Search Results';
            } else if (content.includes('network')) {
                return 'Professional Network';
            }
        }
        
        // GitHub-specific meaningful titles
        if (domain.includes('github')) {
            if (content.includes('repository') || content.includes('repo')) {
                return 'GitHub Repository';
            } else if (content.includes('issue')) {
                return 'GitHub Issues';
            } else if (content.includes('pull request')) {
                return 'Pull Request';
            }
        }
        
        // YouTube-specific meaningful titles
        if (domain.includes('youtube')) {
            if (content.includes('video')) {
                return 'YouTube Video';
            } else if (content.includes('playlist')) {
                return 'YouTube Playlist';
            }
        }
        
        // Generic meaningful title based on cluster
        if (clusterTitle.includes('Canvas')) {
            return 'Canvas Course Page';
        } else if (clusterTitle.includes('LinkedIn')) {
            return 'LinkedIn Professional Page';
        } else if (clusterTitle.includes('GitHub')) {
            return 'GitHub Development Resource';
        } else if (clusterTitle.includes('YouTube')) {
            return 'YouTube Video Content';
        }
        
        // Fallback to domain-based title
        return `${this.formatDomainName(domain)} Page`;
    }

    generateSpecificDescription(tab, cluster, content, meaningfulTitle) {
        const url = typeof tab.url === 'string' ? tab.url : '';
        const domain = this.extractDomainFromUrl(url);
        const clusterTitle = cluster.cluster_title || '';
        const originalTitle = typeof tab.title === 'string' ? tab.title : '';
        
        // Canvas-specific descriptions
        if (domain.includes('canvas')) {
            if (content.includes('assignment') && content.includes('due')) {
                const courseMatch = content.match(/([A-Z]{2,4}\s*\d{3,4})/);
                const course = courseMatch ? courseMatch[1] : 'course';
                return `Assignment page for ${course} with submission requirements, due dates, and grading criteria`;
            } else if (content.includes('lecture') && content.includes('notes')) {
                return 'Lecture materials page containing slides, notes, and supplementary reading materials';
            } else if (content.includes('grade') && content.includes('feedback')) {
                return 'Grades page showing assignment scores, instructor feedback, and progress tracking';
            } else if (content.includes('discussion') && content.includes('forum')) {
                return 'Discussion forum for course-related questions, peer interaction, and Q&A';
            } else if (content.includes('course') && content.includes('dashboard')) {
                const courseMatch = content.match(/([A-Z]{2,4}\s*\d{3,4})/);
                const course = courseMatch ? courseMatch[1] : 'course';
                return `Course dashboard for ${course} with assignments, announcements, and course materials`;
            } else if (content.includes('syllabus')) {
                return 'Course syllabus with policies, schedule, and learning objectives';
            }
            return 'Canvas course page containing educational materials, assignments, and course information';
        }
        
        // LinkedIn-specific descriptions
        if (domain.includes('linkedin')) {
            if (content.includes('profile') && content.includes('experience')) {
                return 'Professional profile page showcasing work history, skills, endorsements, and career achievements';
            } else if (content.includes('job') && content.includes('apply')) {
                return 'Job search results page with software engineering positions, salary ranges, and application options';
            } else if (content.includes('network') && content.includes('connection')) {
                return 'Professional networking page with connections, industry contacts, and relationship management';
            } else if (content.includes('feed') || content.includes('home')) {
                return 'LinkedIn feed with professional updates, industry news, and career-related content';
            }
            return 'LinkedIn professional networking platform for career development and business connections';
        }
        
        // GitHub-specific descriptions
        if (domain.includes('github')) {
            if (content.includes('repository') && content.includes('code')) {
                return 'Code repository containing project source code, documentation, and development history';
            } else if (content.includes('issue') && content.includes('bug')) {
                return 'Issue tracker page with bug reports, feature requests, and development discussions';
            } else if (content.includes('pull request') && content.includes('review')) {
                return 'Pull request page with code changes, review comments, and merge status';
            } else if (content.includes('profile') || content.includes('user')) {
                return 'Developer profile page showcasing repositories, contributions, and coding activity';
            }
            return 'GitHub development platform with code repositories, collaboration tools, and project management';
        }
        
        // YouTube-specific descriptions
        if (domain.includes('youtube')) {
            if (content.includes('tutorial') && content.includes('learn')) {
                return 'Educational tutorial video with step-by-step instructions and practical examples';
            } else if (content.includes('lecture') && content.includes('course')) {
                return 'Course lecture video with educational content, demonstrations, and learning materials';
            } else if (content.includes('music') && content.includes('song')) {
                return 'Music video or audio content for entertainment and relaxation';
            } else if (content.includes('coding') || content.includes('programming')) {
                return 'Programming tutorial video with code examples and development techniques';
            }
            return 'YouTube video content providing entertainment, education, or informational content';
        }
        
        // Stack Overflow descriptions
        if (domain.includes('stackoverflow')) {
            if (content.includes('question') && content.includes('answer')) {
                return 'Q&A thread with programming questions, solutions, and community discussions';
            } else if (content.includes('javascript') || content.includes('js')) {
                return 'JavaScript programming questions and answers with code examples and best practices';
            }
            return 'Stack Overflow programming Q&A platform with technical solutions and coding help';
        }
        
        // Amazon descriptions
        if (domain.includes('amazon')) {
            if (content.includes('macbook') || content.includes('laptop')) {
                return 'Product page for MacBook Pro with specifications, pricing, reviews, and purchasing options';
            } else if (content.includes('review') && content.includes('rating')) {
                return 'Product reviews page with customer feedback, ratings, and detailed opinions';
            }
            return 'Amazon product page with item details, pricing, availability, and customer reviews';
        }
        
        // Specific descriptions based on domain and content
        if (domain.includes('gmail') || domain.includes('mail.google')) {
            if (content.includes('inbox') && content.includes('email')) {
                return 'Email inbox with unread messages and email management interface';
            } else if (content.includes('compose') || content.includes('draft')) {
                return 'Email composition interface for writing and sending messages';
            }
            return 'Gmail email service with message management and communication tools';
        } else if (domain.includes('canvas')) {
            if (content.includes('assignment') && content.includes('due')) {
                const courseMatch = content.match(/([A-Z]{2,4}\s*\d{3,4})/);
                const course = courseMatch ? courseMatch[1] : 'course';
                return `Assignment page for ${course} with submission requirements, due dates, and grading criteria`;
            } else if (content.includes('course') && content.includes('dashboard')) {
                const courseMatch = content.match(/([A-Z]{2,4}\s*\d{3,4})/);
                const course = courseMatch ? courseMatch[1] : 'course';
                return `Course dashboard for ${course} with assignments, announcements, and course materials`;
            } else if (content.includes('grade')) {
                return 'Grades page showing assignment scores, instructor feedback, and progress tracking';
            }
            return 'Canvas course page containing educational materials, assignments, and course information';
        } else if (domain.includes('github')) {
            if (content.includes('repository') && content.includes('code')) {
                return 'Code repository containing project source code, documentation, and development history';
            } else if (content.includes('issue') && content.includes('bug')) {
                return 'Issue tracker with bug reports, feature requests, and development discussions';
            } else if (content.includes('pull request') && content.includes('review')) {
                return 'Pull request page with code changes, review comments, and merge status';
            }
            return 'GitHub development platform with code repositories, collaboration tools, and project management';
        } else if (domain.includes('grammarly')) {
            return 'Grammarly writing assistant with grammar checking, style suggestions, and writing improvement tools';
        } else if (domain.includes('leetcode')) {
            return 'LeetCode coding platform with programming challenges, solutions, and interview preparation';
        } else if (domain.includes('notion')) {
            return 'Notion workspace with notes, documents, databases, and project management tools';
        }
        
        // Generic descriptions based on cluster
        if (clusterTitle.includes('Academic')) {
            return 'Educational resource containing course materials, assignments, and learning content';
        } else if (clusterTitle.includes('Job Search')) {
            return 'Career development resource with job opportunities, company information, and professional networking';
        } else if (clusterTitle.includes('Social Media')) {
            return 'Social platform with user-generated content, community interaction, and entertainment';
        } else if (clusterTitle.includes('Productivity')) {
            return 'Productivity tool for work organization, task management, and collaboration';
        } else if (clusterTitle.includes('Shopping')) {
            return 'E-commerce platform with products, pricing, and purchasing capabilities';
        }
        
        return `Web resource from ${this.formatDomainName(domain)} containing relevant information and content`;
    }

    getTabContent(tab) {
        if (!tab) return '';
        const raw = tab.content;
        if (typeof raw === 'string') return raw.toLowerCase();
        if (raw && typeof raw.content === 'string') return raw.content.toLowerCase();
        try { return String(raw || '').toLowerCase(); } catch { return ''; }
    }

    extractDomainFromUrl(url) {
        try {
            return new URL(url).hostname.replace('www.', '');
        } catch {
            return '';
        }
    }

    formatDomainName(domain) {
        const parts = domain.split('.');
        const name = parts[0];
        return name.charAt(0).toUpperCase() + name.slice(1);
    }

    extractRepoInfo(title) {
        // Extract repository information from GitHub titles
        if (typeof title !== 'string') return 'Open source project';
        
        const match = title.match(/([^/]+)\/([^:]+)/);
        if (match) {
            return `${match[1]}/${match[2]}`;
        }
        return 'Open source project';
    }

    extractDomainInfo(url) {
        try {
            const domain = new URL(url).hostname;
            return domain.replace('www.', '');
        } catch {
            return 'External website';
        }
    }

    async saveToNotion() {
        try {
            const sessionData = this.getCurrentSessionData();
            const response = await chrome.runtime.sendMessage({
                action: 'saveToNotion',
                data: sessionData
            });

            if (response.success) {
                if (response.downloadStarted) {
                    alert('✅ Session saved as markdown file! Check your downloads folder. You can copy this content to Notion.');
                } else {
                    alert('✅ Session saved successfully!');
                }
            } else {
                throw new Error(response.error || 'Failed to save session');
            }
        } catch (error) {
            console.error('Error saving session:', error);
            alert('❌ Failed to save session: ' + error.message);
        }
    }

    async closeClusteredTabs() {
        try {
            const response = await chrome.runtime.sendMessage({
                action: 'closeClusteredTabs',
                data: this.getCurrentSessionData()
            });

            if (response.success) {
                alert(`Closed ${response.closedCount} tabs successfully!`);
                // Reset the popup
                this.resetPopup();
            } else {
                throw new Error(response.error || 'Failed to close tabs');
            }
        } catch (error) {
            console.error('Error closing tabs:', error);
            alert('Failed to close tabs: ' + error.message);
        }
    }

    getCurrentSessionData() {
        // Return the stored session data that includes tab indexes
        return this.currentSessionData || window.currentSessionData || {
            session_summary: '',
            suggested_title: '',
            clusters: []
        };
    }

    resetPopup() {
        document.getElementById('results').classList.add('hidden');
        document.getElementById('main-content').classList.remove('hidden');
        document.getElementById('weave-session').textContent = '🪄 Weave This Session';
    }

    showLoading(show) {
        const loading = document.getElementById('loading');
        const mainContent = document.getElementById('main-content');
        
        if (show) {
            loading.classList.remove('hidden');
            mainContent.classList.add('hidden');
        } else {
            loading.classList.add('hidden');
            mainContent.classList.remove('hidden');
        }
    }

    showError(message) {
        const error = document.getElementById('error');
        error.querySelector('p').textContent = message;
        error.classList.remove('hidden');
    }

    hideError() {
        document.getElementById('error').classList.add('hidden');
    }

    openSettings() {
        // Open settings page in a new tab
        chrome.tabs.create({
            url: chrome.runtime.getURL('settings.html')
        });
    }
}

// Initialize the popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TabTamerPopup();
});
