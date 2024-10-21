let btn = document.querySelector("#btn");
let content = document.querySelector("#content");
let voice = document.querySelector("#voice");
const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyDrMuxxnZ3l_AlGOZI3uI1IITG0sHxT4ck'; // Ensure this is secured
const user_name = prompt('What is your name, sir?');
let lang = 'hindi';
const config = require('./config.json');

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
        chatgpt(message); // Call chatgpt function for other queries
    }
}

// Use your GitHub secret for the API key
const apiKey = config.API; // Ensure this is defined in the environment

async function chatgpt(message) {
    const gpturl = 'https://api.openai.com/v1/chat/completions'; // Your GPT URL
    try {
        const response = await fetch(gpturl, { // Use your defined GPT URL for the API
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`  // Use the API key from the environment
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: `You are a virtual assistant created by Rishabh. Your task is to reply to the user in a very casual tone. Do not use emojis. Respond in ${lang}.`
                    },
                    {
                        role: "user",
                        content: `The user's name is ${user_name}. Here is the message from the user: ${message}`
                    }
                ]
            })
        });

        const data = await response.json();
        const apiResponse = data?.choices?.[0]?.message?.content?.trim() || "Sorry, I couldn't fetch a response.";
        speak(apiResponse);
        console.log(apiResponse); // Output the response
    } catch (error) {
        console.error('Error fetching API response:', error.message || error);
        speak("Sorry, there was an error fetching the response.");
    }
}

// Automatically wish the user based on the time of day when the page loads
window.addEventListener('load', () => {
    wishMe();
});
