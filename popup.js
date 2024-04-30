chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === "showImprovedText") {
        document.getElementById('improvedText').value = message.text;
    }
});

document.addEventListener('DOMContentLoaded', function () {
    // Setup listener for messages from the background script
    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
        if (message.action === "showImprovedText") {
            var improvedTextElement = document.getElementById('improvedText');
            if (improvedTextElement) {
                improvedTextElement.value = message.text;
            } else {
                console.error('No element with ID "improvedText" found.');
            }
        }
    });
});
