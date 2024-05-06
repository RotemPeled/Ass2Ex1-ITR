document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const title = urlParams.get('title');
    document.getElementById('title').textContent = title;

    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
        if (message.action === "showImprovedText") {
            var improvedTextElement = document.getElementById('improvedText');
            if (improvedTextElement) {
                var formattedText = formatQuizResponse(message.text);
                improvedTextElement.innerHTML = formattedText; // Use innerHTML to inject formatted HTML
            } else {
                console.error('No element with ID "improvedText" found.');
            }
        }
    });
});

function formatQuizResponse(text) {
    var lines = text.split('\n');
    var formattedLines = [];
    var isTenthQuestion = false; // Flag to track if processing the 10th question
    lines.forEach((line, index) => {
        // Check for correct answer marker and apply formatting
        if (line.includes('- correct')) {
            line = line.replace('- correct', ''); // Remove marker
            if (isTenthQuestion) {
                line = '    <span class="correct-answer">' + line.trim() + '</span>'; // Apply formatting with 4 spaces
            } else {
                line = '   <span class="correct-answer">' + line.trim() + '</span>'; // Apply formatting with 3 spaces
            }
        }
        // Check if the line represents the 10th question
        if (line.trim().startsWith('10.')) {
            isTenthQuestion = true;
        }
        formattedLines.push(line);
    });
    var formattedText = formattedLines.join('\n');
    return formattedText;
}