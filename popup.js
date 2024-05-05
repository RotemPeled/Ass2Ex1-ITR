document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const title = urlParams.get('title');
    document.getElementById('title').textContent = title;

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
