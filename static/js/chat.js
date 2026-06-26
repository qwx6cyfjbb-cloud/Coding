const chatContainer = document.getElementById("chat-container");
const welcomeScreen = document.getElementById("welcome-screen");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const micBtn = document.getElementById("mic-btn");

let voiceMode = false;


// ============================
// CLEAN TEXT (VOICE FIX)
// ============================
function cleanTranscript(text) {
    return text.trim().replace(/\s+/g, " ");
}


// ============================
// ADD MESSAGE
// ============================
function addMessage(text, type) {

    const msg = document.createElement("div");
    msg.classList.add("message", type);

    msg.textContent = text;

    chatContainer.appendChild(msg);

    msg.scrollIntoView({ behavior: "smooth", block: "end" });

    return msg;
}


// ============================
// LOADING ANIMATION
// ============================
function createLoading() {

    const loader = document.createElement("div");
    loader.classList.add("message", "bot", "strafe-float");

    const states = [
        "Astra AI is thinking.",
        "Astra AI is thinking..",
        "Astra AI is thinking..."
    ];

    let i = 0;
    loader.textContent = states[0];

    const interval = setInterval(() => {
        i = (i + 1) % states.length;
        loader.textContent = states[i];
    }, 600);

    loader.stop = () => clearInterval(interval);

    chatContainer.appendChild(loader);
    loader.scrollIntoView({ behavior: "smooth", block: "end" });

    return loader;
}


// ============================
// TYPEWRITER EFFECT
// ============================
function typeMessage(text, element, speed = 35) {

    let i = 0;

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}


// ============================
// SEND MESSAGE
// ============================
async function sendMessage() {

    const message = input.value.trim();
    if (!message) return;

    welcomeScreen.style.display = "none";
    chatContainer.style.display = "flex";

    addMessage(message, "user");

    input.value = "";

    const loading = createLoading();

    try {

        const response = await fetch("/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message })
        });

        const data = await response.json();

        loading.stop();
        loading.remove();

        const botMsg = addMessage("", "bot");
        typeMessage(data.reply, botMsg, 40);

        // ONLY SPEAK IF VOICE MODE
        if (voiceMode) {
            setTimeout(() => {
                speak(data.reply);
            }, data.reply.length * 40 + 500);
        }

        // reset voice mode
        setTimeout(() => {
            voiceMode = false;
        }, 1000);

    } catch (error) {

        loading.stop();
        loading.remove();

        addMessage("❌ Unable to connect to Astra AI.", "bot");

        console.error(error);
    }
}


// ============================
// TEXT TO SPEECH
// ============================
function speak(text) {

    if (!("speechSynthesis" in window)) return;

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    const voices = speechSynthesis.getVoices();
    if (voices.length > 0) {
        utterance.voice = voices[0];
    }

    speechSynthesis.speak(utterance);
}


// ============================
// EVENTS
// ============================
sendBtn.addEventListener("click", sendMessage);

input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
});


// typing disables voice mode
input.addEventListener("input", () => {
    voiceMode = false;
});


// ============================
// VOICE RECOGNITION FIXED
// ============================
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

let recognition = null;

if (SpeechRecognition) {

    recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.lang = "en-IN";

    let finalTranscript = "";

    recognition.onstart = () => {
        voiceMode = true;
        addMessage("🎤 Listening...", "bot");
    };

    recognition.onresult = (event) => {

        let transcript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
        }

        finalTranscript = cleanTranscript(transcript);

        input.value = finalTranscript;
    };

    recognition.onend = () => {

        // small delay improves accuracy
        setTimeout(() => {
            if (input.value.trim() !== "") {
                sendMessage();
            }
        }, 300);
    };

    recognition.onerror = (event) => {
        addMessage("❌ Voice error: " + event.error, "bot");
    };
}


// ============================
// MIC BUTTON
// ============================
micBtn.addEventListener("click", () => {

    if (!recognition) {
        addMessage("❌ Voice not supported in this browser", "bot");
        return;
    }

    recognition.start();
});