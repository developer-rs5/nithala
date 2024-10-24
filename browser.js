document.getElementById("assistant-btn").addEventListener("click", function () {
    // Create a black overlay
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "100%"; // Start off-screen
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "black";
    overlay.style.zIndex = "100"; // Ensure it's on top
    overlay.style.transition = "left 1s"; // Transition effect
    document.body.appendChild(overlay);

    // Trigger the animation
    setTimeout(() => {
        overlay.style.left = "0"; // Move overlay into view
    }, 0);

    // Redirect after 1 second
    setTimeout(() => {
        window.location.href = "assistant.html"; // Redirect to assistant page
    }, 1000);
});

document.getElementById("search-btn").addEventListener("click", function () {
    const query = document.getElementById("search").value;
    const searchResults = document.getElementById("search-results");
    searchResults.innerHTML = ""; // Clear previous results

    // Simulate search result
    const result = document.createElement("div");
    result.textContent = `Searching for: ${query}`;
    searchResults.appendChild(result);
});
