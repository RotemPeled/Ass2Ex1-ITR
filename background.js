const OPENAI_API_KEY = 'sk-proj-SRGCSAzogrcsQIu2kwiZT3BlbkFJp02fsLG6iUdA7G5kEfKg';

// Function to setup context menus
function setupContextMenus() {
    chrome.contextMenus.removeAll(function() {
        // Create parent menu item
        chrome.contextMenus.create({
            id: "aieverywhere",
            title: "AIEverywhere",
            contexts: ["selection"]
        });

        // Create submenu items
        chrome.contextMenus.create({
            id: "improve-english",
            title: "Improve English",
            parentId: "aieverywhere",
            contexts: ["selection"]
        });
        chrome.contextMenus.create({
            id: "improve-english-creative",
            title: "Improve English - Creative",
            parentId: "aieverywhere",
            contexts: ["selection"]
        });
        chrome.contextMenus.create({
            id: "add-comments-to-code",
            title: "Add Comments to Code",
            parentId: "aieverywhere",
            contexts: ["selection"]
        });
        chrome.contextMenus.create({
            id: "summarize-single-paragraph",
            title: "Summarize to a Single Paragraph",
            parentId: "aieverywhere",
            contexts: ["selection"]
        });
        chrome.contextMenus.create({
            id: "ai-quiz",
            title: "AI Quiz",
            parentId: "aieverywhere",
            contexts: ["selection"]
        });
    });
}

// Call setup function on extension load or reload
setupContextMenus();

// Function to handle API calls
function callOpenAiApi(systemMessage, userInput, temperature, callback) {
    fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{
                role: "system",
                content: systemMessage
            },{
                role: "user",
                content: userInput
            }],
            temperature: temperature
        })
    })
    .then(res => res.json())
    .then(data => {
        if (!data.choices || data.choices.length == 0) {
            console.error('API returned no choices or error:', JSON.stringify(data));
            return;
        }
        callback(data.choices[0].message.content.trim());
    })
    .catch(err => console.error('OpenAI API error:', err));
}

// Listen for clicks on the context menu
chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (!info.selectionText) {
        console.error('No text selected');
        return;
    }
    switch (info.menuItemId) {
        case "improve-english":
            callOpenAiApi("You are an English teacher. Rewrite the following to correct grammar, spelling, and clarity.", info.selectionText, 0, function(response) {
                showResponseInPopup(response, "Improve English");
            });
            break;
        case "improve-english-creative":
            callOpenAiApi("You are an English teacher. Rewrite the following to correct grammar, spelling, and clarity. Make it creative and slightly unusual.", info.selectionText, 0.7, function(response) {
                showResponseInPopup(response, "Improve English - Creative");
            });
            break;
        case "add-comments-to-code":
            callOpenAiApi("You are an expert code commentator. First, determine if the given text is a code snippet or not. If it is code, return exactly the same code and add relevant comments to it. If it is not code, respond with the message: This text is not code.", info.selectionText, 0, function(response) {
                showResponseInPopup(response, "Add Comments to Code");
            });
            break;
        case "summarize-single-paragraph":
            callOpenAiApi("You are a summarization assistant. Summarize the following text into a single paragraph.", info.selectionText, 0, function(response) {
                showResponseInPopup(response, "Summarize to a Single Paragraph");
            });
            break;
        case "ai-quiz":
            callOpenAiApi("Generate a quiz with 10 multiple-choice questions (with 4 options each) and add '-correct' to the relevant answer based on the following text.", info.selectionText, 0, function(response) {
                showResponseInPopup(response, "AI Quiz");
            });
            break;
    }
});

function showResponseInPopup(text, title) {
    chrome.windows.create({
        url: `popup.html?title=${encodeURIComponent(title)}`,
        type: "popup",
        width: 600,
        height: 400,
        left: 100,
        top: 100
    }, function(window) {
        setTimeout(() => {
            chrome.runtime.sendMessage({
                action: "showImprovedText",
                text: text,
                title: title  // Pass the title
            });
        }, 100);
    });
}