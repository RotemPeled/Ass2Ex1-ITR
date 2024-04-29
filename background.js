const OPENAI_API_KEY = 'sk-proj-SRGCSAzogrcsQIu2kwiZT3BlbkFJp02fsLG6iUdA7G5kEfKg';

chrome.runtime.onInstalled.addListener(function() {
    // Create the main context menu
    chrome.contextMenus.create({
        id: "aieverywhere",
        title: "AIEverywhere",
        contexts: ["selection"]
    });

    // Create the "Improve English" submenu item
    chrome.contextMenus.create({
        id: "improve-english",
        title: "Improve English",
        parentId: "aieverywhere",
        contexts: ["selection"]
    });
});

// Listen for clicks on the context menu
chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId === "improve-english") {
        if (!info.selectionText) {
            console.error('No text selected');
            return;
        }
        // Call OpenAI API to improve the English of the selected text using the chat model
        fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4",  // Ensure this is a chat-compatible model
                messages: [{
                    role: "system",
                    content: "Rewrite the following to correct grammar, spelling, and clarity."
                },{
                    role: "user",
                    content: info.selectionText
                }]
            })
        })
        .then(res => res.json())
        .then(data => {
            if (!data.choices || data.choices.length === 0) {
                console.error('API returned no choices or error:', JSON.stringify(data));
                return;
            }
            const improvedText = data.choices[0].message.content.trim();
            chrome.windows.create({
                url: "popup.html",
                type: "popup",
                width: 420,
                height: 250
            }, function(window) {
                setTimeout(() => {
                    chrome.runtime.sendMessage({
                        action: "showImprovedText",
                        text: improvedText
                    });
                }, 100);
            });
        })
        .catch(err => console.error('OpenAI API error:', err));
    }
});
