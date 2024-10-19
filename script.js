let btn = document.querySelector("#btn");
let content = document.querySelector("#content");
let voice = document.querySelector("#voice");

// Array of random questions
let randomQuestions = [
    "What is your favorite programming language?",
    "How do you stay motivated while coding?",
    "What are some tips for becoming a better developer?",
    "What is the latest technology trend you are excited about?",
    "Tell me about your current coding project."
];

function speak(text) {
    let text_speak = new SpeechSynthesisUtterance(text);
    text_speak.rate = 1;
    text_speak.pitch = 1;
    text_speak.volume = 1;
    text_speak.lang = "hi-GB";
    window.speechSynthesis.speak(text_speak);
}

function wishMe() {
    let day = new Date();
    let hours = day.getHours();
    if (hours >= 0 && hours < 12) {
        speak("Good Morning Sir");
    }
    else if (hours >= 12 && hours < 16) {
        speak("Good Afternoon Sir");
    } else {
        speak("Good Evening Sir");
    }
}

let speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = new speechRecognition();
recognition.onresult = (event) => {
    let currentIndex = event.resultIndex;
    let transcript = event.results[currentIndex][0].transcript;
    content.innerText = transcript;
    takeCommand(transcript.toLowerCase());
}

btn.addEventListener("click", () => {
    recognition.start();
    voice.style.display = "block";
    btn.style.display = "none";
});

function takeCommand(message) {
    voice.style.display = "none";
    btn.style.display = "flex";

    if (message.includes("hello") || message.includes("hey")) {
        speak("hello sir, what can I help you with?");
    }
    else if (message.includes("who are you")) {
        speak("I am a virtual assistant, created by Developer RS");
    }
    else if ((message.includes("develop") || message.includes("developer") || message.includes("create") || message.includes("creator")) &&
         (message.includes("you") || message.includes("your"))) {
    speak("My developer is RS. and created me in html,css,js");
    }    
    else if (message.includes("time")) {
        let time = new Date().toLocaleString(undefined, { hour: "numeric", minute: "numeric" });
        speak(time);
    }
    else if (message.includes("date")) {
        let date = new Date().toLocaleString(undefined, { day: "numeric", month: "short" });
        speak(date);
    }
    else if (message.includes("search on google")) {
        let query = message.replace("search on google", "").trim();
        speak("searching on Google...");
        window.open(`https://www.google.com/search?q=${query}`, "_blank");
    }
    else if (message.startsWith("say")) {
        let saymsg = message.replace("say", "").trim();
        speak(saymsg);
    }
    else if (message.includes("about developer rs"))||message.includes("who is developer rs") {
        speak("here is the websire of about developer rs");
        window.open("https://developer-rs5.github.io/Portfolio", "_blank");
    // Dynamic open (app name) logic
    else if (message.startsWith("open ")) {
        let appName = message.replace("open ", "").trim();
        speak(`Opening ${appName}...`);
        window.open(`https://${appName}.com`, "_blank");
    }
    // Random question response
    else if (message.includes("ask me a question")) {
        let randomQuestion = randomQuestions[Math.floor(Math.random() * randomQuestions.length)];
        speak(randomQuestion);
    }
    // Use Gemini API for questions
    else {
        queryGeminiAPI(message);
    }
}

// Function to query the Gemini API
async function queryGeminiAPI(question) {
    try {
        const response = await fetch('https://api.gemini.googleapis.com/v1/text:generate', {
            method: 'POST', // or 'GET', depending on the API requirements
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer AIzaSyDrMuxxnZ3l_AlGOZI3uI1IITG0sHxT4ck' // if needed
            },
            body: JSON.stringify({ question: question }) // Adjust based on API requirements
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const answer = data.answer || "I'm sorry, I couldn't find an answer.";
        speak(answer);
    } catch (error) {
        console.error('Error fetching data from Gemini API:', error);
        speak("Sorry, there was an error fetching the response.");
    }
}

// Automatically wish the user based on the time of day when the page loads
window.addEventListener('load', () => {
    wishMe();
});
