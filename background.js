chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.prompt) {        
        ai.languageModel.capabilities()
            .then(capabilities => {
                console.log("Capabilities:", capabilities);

                if (capabilities.available === "no") {
                    console.error("Model is unavailable.");
                } 
                else if (capabilities.available === "after-download") {
                    console.log("Model needs to be downloaded.");
                } 
                else if (capabilities.available === "readily") {
                    console.log("Model is ready for use.");
                }
            })
            .catch(error => {
                console.error("Error checking capabilities:", error);
            });

        ai.languageModel.create()
            .then(session => {
                session.prompt(message.prompt)
                    .then(response => {
                        console.log("Model response:", response);
                        sendResponse({ answer: response }); 
                    })
                    .catch(error => {
                        console.error("Error in session prompt:", error);
                        sendResponse({ error: "Failed to generate a response." });
                    });
            })
            .catch(error => {
                console.error("Error creating session:", error);
                sendResponse({ error: "Failed to create session." });
            });
    } else {
        sendResponse({ error: "Invalid message format." });
    }
    return true;
});
