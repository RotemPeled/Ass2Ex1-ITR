const OPENAI_API_KEY = 'sk-proj-SRGCSAzogrcsQIu2kwiZT3BlbkFJp02fsLG6iUdA7G5kEfKg';

chrome.contextMenus.create({
    id: "aieverywhere",
    title: "AIEverywhere",
    contexts: ["selection"]
});

chrome.runtime.onInstalled.addListener(function() {
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
});

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
    if (info.menuItemId === "improve-english") {
        callOpenAiApi("Rewrite the following to correct grammar, spelling, and clarity.", info.selectionText, 0, function(response) {
            showResponseInPopup(response, "Improve English");
        });
    } else if (info.menuItemId === "improve-english-creative") {
        callOpenAiApi("Rewrite the following to correct grammar, spelling, and clarity. Make it creative and slightly unusual.", info.selectionText, 0.7, function(response) {
            showResponseInPopup(response, "Improve English - Creative");
        });
    } else if (info.menuItemId === "add-comments-to-code") {
        callOpenAiApi("Is this text a code? 1. if the answer is yes, return only the code after you added comments to it. do not add the words - \"This is a code\" 2.If not, please return only the words - \"This is not a code.\"", info.selectionText, 0, function(response) {
            showResponseInPopup(response, "Add Comments to Code");
        });
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
