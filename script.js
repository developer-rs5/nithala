let btn = document.querySelector("#btn");
let content = document.querySelector("#content");
let voice = document.querySelector("#voice");
const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyDrMuxxnZ3l_AlGOZI3uI1IITG0sHxT4ck'; // Ensure this is secured
const user_name = prompt('What is your name, sir?');
let lang = 'hindi';

// Array of random questions
let randomQuestions = [
    "Tera favorite programming language kaunsa hai?",
    "Coding karte waqt motivation kaise banaaye rakhta hai?",
    "Behtar developer banne ke liye kya tips hain?",
    "Tujhe latest technology trend kaunsa pasand hai?",
    "Apna current coding project ke baare mein bata."
];

function speak(text) {
    let text_speak = new SpeechSynthesisUtterance(text);
    text_speak.rate = 1;
    text_speak.pitch = 1;
    text_speak.volume = 1;
    text_speak.lang = "hi-IN";
    window.speechSynthesis.speak(text_speak);
}

function wishMe() {
    let day = new Date();
    let hours = day.getHours();
    if (hours >= 0 && hours < 12) {
        speak("Good Morning Sir, how can I help you?");
    } else if (hours >= 12 && hours < 16) {
        speak("Aur bhai, Good Afternoon");
    } else {
        speak("Araa bhai, Good Evening");
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

    if (message.startsWith("set language to ") || message.startsWith("language to")) {
        let lang = message.replace(/language to /i, "").trim(); // Fixed typo and used regex
        speak(`I have set your language to ${lang}`);
    }
    else if (message.includes("time")) {
        let time = new Date().toLocaleString(undefined, { hour: "numeric", minute: "numeric" });
        speak(`Abhi ${time} baj rahe hain.`);
    }
    else if (message.includes("date")) {
        let date = new Date().toLocaleString(undefined, { day: "numeric", month: "short" });
        speak(`Aaj ki tareekh hai ${date}`);
    }
    else if (message.includes("search on google")) {
        let query = message.replace("search on google", "").trim();
        speak("Google pe dhoond raha hoon...");
        window.open(`https://www.google.com/search?q=${query}`, "_blank");
    }
    else if (message.startsWith("say")) {
        let saymsg = message.replace("say", "").trim();
        speak(saymsg);
    }
    else if (message.includes("about developer rs") || message.includes("who is developer rs")) {
        speak("Ye lo RS bhai ke baare mein website");
        window.open("https://developer-rs5.github.io/Portfolio", "_blank");
    } 
    else if (message.startsWith("open ")) {
        let appName = message.replace("open ", "").trim();
        speak(`Opening ${appName}...`);
        window.open(`https://${appName}.com`, "_blank");
    }
    else if (message.includes("ask me a question")) {
        let randomQuestion = randomQuestions[Math.floor(Math.random() * randomQuestions.length)];
        speak(randomQuestion);
    } 
    else {
        gemini(message); // Call chatgpt function for other queries
    }
}

async function gemini(message, user_name, lang) {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    "role": "user",
                    "parts": [{ 
                        text: `You are a virtual assistant, your name is nithalla and you are created by Rishabh. 
                        Your task is to reply to the user in a very much casual way. 
                        Do not use emojis brcouse this message will spoken.
                        Use less words and use so many casual words
                        The user's name is ${user_name}. 
                        Here is the message from the user: reply me in ${lang} ${message}` 
                    }]
                }]
            })
        });
        
        const data = await response.json();
        const apiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "Sorry, I couldn't fetch a response.";
        speak(apiResponse);
    } catch (error) {
        console.error('Error fetching Gemini API response:', error.message || error);
        speak("bhai sorry .lakin api ma kuch error aaya ha wapis puch");
    }
}

// Automatically wish the user based on the time of day when the page loads
window.addEventListener('load', () => {
    wishMe();
});

console.log(`your current language is${lang}`);
