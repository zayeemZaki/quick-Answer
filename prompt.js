document.getElementById("submit").addEventListener("click", () => {
    const input = document.getElementById("user-input").value.trim();
    const responseElement = document.getElementById("response");
    const submitButton = document.getElementById("submit");

    if (!input) {
        responseElement.textContent = "Please enter a valid question.";
        return;
    }

    // Show "Loading..." and disable the submit button
    responseElement.textContent = "Loading...";
    submitButton.disabled = true;

    const message = `Provide a concise answer in under 100 characters. If the answer involves a mathematical or scientific concept, include the formula first, followed by a brief explanation of the terms in the formula.": ${input}`;

    chrome.runtime.sendMessage({ prompt: message }, (response) => {
        // Re-enable the submit button
        submitButton.disabled = false;

        if (chrome.runtime.lastError) {
            console.error("Error:", chrome.runtime.lastError.message);
            responseElement.textContent = "An error occurred. Please check the background script.";
        } 
        else if (response.error) {
            console.error("Background script error:", response.error);
            responseElement.textContent = `Error: ${response.error}`;
        } 
        else {
            console.log("Response from background script:", response.answer);
            responseElement.textContent = response.answer; // Update with the response
        }
    });
});
