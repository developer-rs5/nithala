let btn = document.querySelector("#btn");
let content = document.querySelector("#content");
let voice = document.querySelector("#voice");
const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyDrMuxxnZ3l_AlGOZI3uI1IITG0sHxT4ck';
const user_name = prompt('what is your name? sir!');
let lang = ('english')
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
        speak("Good Morning Sir, how can i help you");
    }
    else if (hours >= 12 && hours < 16) {
        speak("or bahi Good Afternoon ");
    } else {
        speak("araa bahi, Good Evening");
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

    if (message.startsWith("set language to ") || message.includes("set language TO")) {
        let lang = message.replace("set languae to","").trim();
        if(lang != hindi){
            speak(`I have seated your language to ${lang}`)
        }
        else{
            speak('I have changed your langunge to hindi')
        }
    }
    /*else if (message.includes("who are you")) {
        speak("Mai ek virtual assistant huu, mujhe RS bhai ne banaya hai.");
    }
    else if ((message.includes("develop") || message.includes("developer") || message.includes("create") || message.includes("creator")) && (message.includes("you") || message.includes("your"))) {
        speak("Mujhe RS bhai ne banaya hai, aur HTML, CSS, aur javascript mein banaya hai.");
    }  */  
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
        gemini(message);
    }
}

// Function to query the Gemini API
async function gemini(message) {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    "role": "user",
                    "parts": [{ text: `here is some information about you how to reply userName: ${user_name} type:verycasual useEmjoies: flase language: ${lang} aboutYou: you are a vartusl assistant created by Rishabh message: ${message}` }]
                }]
            })
        });
        const data = await response.json();
        const apiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "Sorry, I couldn't fetch a response.";
        speak(apiResponse);
    } catch (error) {
        console.error('Error fetching Gemini API response:', error);
        speak("Sorry, there was an error fetching the response.");
    }
}

// Automatically wish the user based on the time of day when the page loads
window.addEventListener('load', () => {
    wishMe();
});
