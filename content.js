// content.js
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "getSelectedText") {
        const selection = window.getSelection().toString();
        sendResponse({ text: selection });
    }
});