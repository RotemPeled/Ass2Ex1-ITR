document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const title = urlParams.get('title');
    document.getElementById('title').textContent = title;

    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
        if (message.action === "showImprovedText") {
            var improvedTextElement = document.getElementById('improvedText');
            if (improvedTextElement) {
                // Process the text to format correct answers
                var formattedText = formatQuizResponse(message.text);
                improvedTextElement.innerHTML = formattedText; // Use innerHTML instead of value
            } else {
                console.error('No element with ID "improvedText" found.');
            }
        }
    });
});

function formatQuizResponse(text) {
    // Split the response into lines
    var lines = text.split('\n');
    for (let i = 0; i < lines.length; i++) {
        // Check if the line contains '-correct'
        if (lines[i].includes('-correct')) {
            // Remove '-correct' from the line
            lines[i] = lines[i].replace('-correct', '');
            // Apply HTML formatting for bold and green color
            lines[i] = '<span class="correct-answer">' + lines[i] + '</span>';
        }
    }
    // Join the lines back into a single string
    return lines.join('\n');
}
