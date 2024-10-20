let btn = document.querySelector("#btn");
let content = document.querySelector("#content");
let voice = document.querySelector("#voice");

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
    text_speak.lang = "hi-GB";
    window.speechSynthesis.speak(text_speak);
}

function wishMe() {
    let day = new Date();
    let hours = day.getHours();
    if (hours >= 0 && hours < 12) {
        speak("Subah ho gayi bhai, Good Morning!");
    }
    else if (hours >= 12 && hours < 16) {
        speak("Dopahar ka waqt hai, Good Afternoon bhai!");
    } else {
        speak("Sham ho gayi bhai, Good Evening!");
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
        speak("Or bhai, kya scene hai?");
    }
    else if (message.includes("who are you")) {
        speak("Main ek virtual assistant hoon, mujhe RS bhai ne banaya hai.");
    }
    else if ((message.includes("develop") || message.includes("developer") || message.includes("create") || message.includes("creator")) && (message.includes("you") || message.includes("your"))) {
        speak("Mujhe RS bhai ne banaya hai, aur HTML, CSS, aur JS mein banaya hai.");
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
        queryChatGPTAPI(message);
    }
}

// Function to query the ChatGPT API
async function queryChatGPTAPI(question) {
    try {
        const response = await fetch('https://api.openai.com/v1/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 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'  // Replace with your OpenAI API Key
            },
            body: JSON.stringify({
                model: "text-davinci-003",  // You can also use 'gpt-3.5-turbo'
                prompt: `Casual Hindi mein jawab do. User bola: ${question}`,
                max_tokens: 100,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const answer = data.choices[0].text.trim() || "Arre bhai, kuch samajh nahi aaya!";
        speak(answer);
    } catch (error) {
        console.error('Error fetching data from ChatGPT API:', error);
        speak("Bhai kuch gadbad ho gayi, dubara try karo.");
    }
}

// Automatically wish the user based on the time of day when the page loads
window.addEventListener('load', () => {
    wishMe();
});
