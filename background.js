const OPENAI_API_KEY = 'YOUR_API_KEY';

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
            callOpenAiApi("You are an English teacher. Rewrite the following to correct grammar, spelling, and clarity.", info.selectionText, 0.3, function(response) {
                showResponseInPopup(response, "Improve English");
            });
            break;
        case "improve-english-creative":
            callOpenAiApi("You are an English teacher. Rewrite the following to correct grammar, spelling, and clarity. Make it creative and slightly unusual.", info.selectionText, 0.9, function(response) {
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
            callOpenAiApi(`Given the text: "${info.selectionText}", generate 10 multiple-choice questions with four options each (labeled A, B, C, D) and identify the correct answer for each. Format the output as follows:

        1. Question: <Question 1>
           A. Option 1
           B. Option 2
           C. Option 3
           D. Option 4 - correct

        ...continue this exact pattern through question 10. Ensure that each correct answer is marked with '- correct' directly following the correct option.`, info.selectionText, 0, function(response) {
                showResponseInPopup(response, "AI Quiz");
            });
            break;
    }
});

function showResponseInPopup(text, title) {
    console.log("Showing response in popup:", text); // for debugging the chatGPT response
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
                title: title
            });
        }, 100);
    });
}

