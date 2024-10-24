document.getElementById('assistant-btn').addEventListener('click', function() {
    const blackout = document.createElement('div');
    blackout.classList.add('blackout');
    document.body.appendChild(blackout);
    
    // Trigger the animation
    setTimeout(() => {
        blackout.classList.add('show');
    }, 0); // Start the animation immediately
    
    // Redirect to assistant.html after the animation duration
    setTimeout(() => {
        window.location.href = 'assistent.html'; // Redirect to the assistant file
    }, 1000); // Keep the blackout visible for 1 second
});

// Add search functionality
document.getElementById('search').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        const query = this.value;
        if (query) {
            displaySearchResults(query);
        }
    }
});

document.getElementById('search-btn').addEventListener('click', function() {
    const query = document.getElementById('search').value;
    if (query) {
        display
