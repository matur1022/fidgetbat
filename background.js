// FidgetBat service worker — clicking the toolbar icon toggles the overlay.

chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id || !tab.url || !tab.url.includes('youtube.com')) {
    return;
  }
  try {
    await chrome.tabs.sendMessage(tab.id, { type: 'fidgetbat-toggle' });
  } catch (e) {
    // Content script not injected yet (e.g. tab was open before install) — inject and retry.
    await chrome.scripting.insertCSS({ target: { tabId: tab.id }, files: ['overlay.css'] });
    await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['content.js'] });
    await chrome.tabs.sendMessage(tab.id, { type: 'fidgetbat-toggle' });
  }
});
