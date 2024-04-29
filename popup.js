chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === "showImprovedText") {
        document.getElementById('improvedText').value = message.text;
    }
});

document.getElementById('closeButton').addEventListener('click', function() {
    window.close();
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

    // Setup event listener for the close button
    var closeButton = document.getElementById('closeButton');
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            window.close();
        });
    } else {
        console.error('No element with ID "closeButton" found.');
    }
});
