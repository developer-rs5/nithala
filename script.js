let btn = document.querySelector("#btn");
let content = document.querySelector("#content");
let voice = document.querySelector("#voice");
const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyDrMuxxnZ3l_AlGOZI3uI1IITG0sHxT4ck';
const user_name = prompt('what is your name? sir!');
let lang = 'hindi';
alert(secrets.API)
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
        speak("aur bhai Good Afternoon ");
    } else {
        speak("araa bhai, Good Evening");
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
        let lang = message.replace("languae to","").trim();
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
        chatgpt(message);
    }
}

// Function to query the Gemini API
const apiKey = secrets.API; // Get the API key from command-line arguments

console.log(`The API key is: ${apiKey}`);

// Use the API key to make requests to your service
const gpturl = 'https://api.openai.com/v1/chat/completions';

async function chatgpt(message, user_name, lang) {
    try {
        const response = await fetch(gpturl, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`  // Use the API key from the command-line argument
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
        console.log(apiResponse); // Output the response
    } catch (error) {
        console.error('Error fetching API response:', error.message || error);
    }
}

// Call the function with some example parameters


// Automatically wish the user based on the time of day when the page loads
window.addEventListener('load', () => {
    wishMe();
});
