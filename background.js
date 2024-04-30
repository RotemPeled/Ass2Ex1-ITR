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
});

// Listen for clicks on the context menu
chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId === "improve-english" || info.menuItemId === "improve-english-creative") {
        if (!info.selectionText) {
            console.error('No text selected');
            return;
        }

        let systemMessage = "Rewrite the following to correct grammar, spelling, and clarity.";
        let temperature = 0;

        if (info.menuItemId === "improve-english-creative") {
            systemMessage += " Make it creative and slightly unusual.";
            temperature = 0.7; // Adjusted for creative output
        }

        // Call OpenAI API to improve the English of the selected text
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
                    content: info.selectionText
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
            const improvedText = data.choices[0].message.content.trim();
            chrome.windows.create({
                url: "popup.html",
                type: "popup",
                width: 600,
                height: 400,
                left: 100,
                top: 100
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
