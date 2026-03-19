// background.js
function sendToTab(tabId, title, url) {
    chrome.tabs.sendMessage(tabId, { action: 'copy', title, url }, (res) => {
        if (chrome.runtime.lastError) {
            console.warn('sendMessage error:', chrome.runtime.lastError.message);
            return;
        }
        console.log('copy-rich-link result:', res);
    });
}

function performCopyOnTab(tabId, title, url) {
    // If caller provided a tabId, use that; otherwise query the active tab.
    if (tabId) {
        sendToTab(tabId, title || '', url || '');
        return;
    }

    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
        if (!tabs || !tabs[0]) {
            console.warn('No active tab found to copy from');
            return;
        }
        const tab = tabs[0];
        sendToTab(tab.id, tab.title || '', tab.url || '');
    });
}

if (chrome.commands && chrome.commands.onCommand && chrome.commands.onCommand.addListener) {
    chrome.commands.onCommand.addListener((command) => {
        if (command !== 'copy-rich-link') return;
        console.log('copy-rich-link command received');
        performCopyOnTab(); // will query active tab
    });
}

// Toolbar icon click handler for easier testing:
chrome.action.onClicked.addListener((tab) => {
    console.log('action clicked, performing copy');
    if (!tab) return;
    performCopyOnTab(tab.id, tab.title || '', tab.url || '');
});