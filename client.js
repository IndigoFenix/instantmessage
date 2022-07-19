const socket = io();
const messageUrl = 'http://localhost:3000/messages';

function startApp() {
    console.log('Starting');
    new App();
}

class App {
    constructor(){
        this.userInput = document.getElementById("user");
        this.messageInput = document.getElementById("message");
        this.messageSend = document.getElementById("send");
        this.messageList = document.getElementById("messages");
        this.messageSend.addEventListener("click", () => {this.sendMessage()});
        socket.on('message', (res) => {this.addMessages(res);});
        this.getMessages();
    }

    async getMessages() {
        const response = await fetch(messageUrl, {
            method: "GET",
            headers: { 'Content-Type': 'application/json' }
        });
        if (response){
            const messages = await response.json();
            for (let i in messages){
                this.addMessages(messages[i]);
            }
        }
    }

    async sendMessage(){
        console.log(this);
        const user = this.userInput.value;
        const text = this.messageInput.value;
        if (text === "" || user === "") return;
        await fetch(messageUrl, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user, text })
        });
        this.messageInput.value = "";
    }

    addMessages(message) {
        const mcontainer = document.createElement("div");
        mcontainer.className = "message";
        mcontainer.innerHTML = `<strong class="username">${message.user}:</strong><span class="message-text">${message.text}</span>`;
        this.messageList.appendChild(mcontainer);
    }
}
