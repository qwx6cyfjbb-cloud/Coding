/*
===========================================
        Astra AI v2
===========================================
*/

class AstraAI {

    constructor() {

        this.version = "2.0";

        this.chatContainer = document.getElementById("chat-container");
        this.uploadButton = document.getElementById("upload-btn");
        this.newChatButton = document.querySelector(".new-chat");

        this.initialize();

    }

    initialize() {

        console.log("🤖 Astra AI Started");

        this.registerEvents();

    }

    registerEvents() {

        if (this.newChatButton) {
            this.newChatButton.addEventListener("click", () => {
                this.newChat();
            });
        }

        if (this.uploadButton) {
            this.uploadButton.addEventListener("click", () => {
                this.openUpload();
            });
        }

    }

    newChat() {

        const welcome = document.getElementById("welcome-screen");

        this.chatContainer.innerHTML = "";

        this.chatContainer.style.display = "none";

        welcome.style.display = "flex";

    }

    openUpload() {

    document.getElementById("file-input").click();

}

}

window.addEventListener("DOMContentLoaded", () => {

    new AstraAI();

});

const fileInput = document.getElementById("file-input");

fileInput.addEventListener("change", async function () {

    if (this.files.length === 0) return;

    const file = this.files[0];

    const formData = new FormData();

    formData.append("file", file);

    try {

        const response = await fetch("/upload", {

            method: "POST",

            body: formData

        });

        const data = await response.json();

        if (data.success) {

            createMessage(
    `📄 **${data.filename}** uploaded successfully.\n\nYou can now ask me anything about this file.`,
    "bot"
);

            console.log(data.text);

        } else {

            alert("Upload failed.");

        }

    } catch (err) {

        console.error(err);

        alert("Server error.");

    }

});