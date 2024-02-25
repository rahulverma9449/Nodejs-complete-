
//Socket code in js.js
const socket = io.connect('http://localhost:3000');
const username = prompt("Please enter your name");
//emmit the user name to the server
socket.emit('join', username);
const messageInput = document.getElementById("input-chat");
const sendbtn = document.getElementById("send-msg-btn");
const welcmusername = document.getElementById("usr-name-cond");
const totaluserc = document.getElementById("no-of-user-cont");
const messagelist = document.getElementById("chat-box");
const adduser = document.getElementById("add-user");
let randomImageNumber = Math.floor(Math.random() * 7); 
sendbtn.addEventListener('click', () => {
   
    const message = messageInput.value;
    if (message) {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const currentTime = `${hours}:${minutes}`;
        let usermessage = {
            message: message,
            time: currentTime,
            username: "",
            profile_image:randomImageNumber
        };
        socket.emit('new_message', usermessage);
        const messageElement = document.createElement("div");
        messageElement.innerHTML =
            `
      <div class="msg right-msg">
        <div class="msg-img" style="background-image: url(./profile_pic/${randomImageNumber}.jpg)"></div>
       <div class="msg-bubble">
        <div class="msg-info">
        <div class="msg-info-name">${username}</div>
       <div class="msg-info-time">${usermessage.time}</div>
       </div>
       <div class="msg-text">${usermessage.message}</div>
     </div>
    </div>
 `;

        messagelist.appendChild(messageElement);
        messageInput.value = "";
        scrollToBottom();
    }
})


socket.on('load_messages', (messages) => {
    console.log("This is old messages", messages);
    messages.forEach(message => {
        const messageElement = document.createElement("div");
        messageElement.innerHTML =
            `
 <div class="msg left-msg">
        <div class="msg-img" style="background-image: url(./profile_pic/${message.profile_image}.jpg)"></div>
       <div class="msg-bubble">
        <div class="msg-info">
        <div class="msg-info-name">${message.username}</div>
       <div class="msg-info-time">${message.time}</div>
       </div>
       <div class="msg-text">${message.message}</div>
     </div>
    </div>
 `;

        messagelist.appendChild(messageElement);
    });

    welcmusername.innerText = username;
    scrollToBottom();
});

socket.on("newconnecteduser", (connectedusers) => {
    console.log("This is connected users", connectedusers);
    totaluserc.innerText = connectedusers;
});

socket.on("addusername", (users) => {
    console.log(users);
    addUsers(users);
});

socket.on("removeusername", (users) => {
    console.log(users);
    removeUsers(users);
});

function addUsers(users) {
     adduser.innerHTML="";
    users.forEach(user => {
        const userElement = document.createElement("div");
        userElement.className = "user-join-name-cont";
        userElement.innerHTML = `
      <div id="greencircle"></div>
       <p>${user}</p>
`;
        adduser.appendChild(userElement);
    });
}

function removeUsers(users) {
    const userElements = document.querySelectorAll(".user-join-name-cont");
    userElements.forEach((element) => {
        const username = element.querySelector("p").textContent;
        if (users.includes(username)) {
            element.remove();
        }
    });
}


socket.on("broadcast_message", (usermessage) => {
    console.log("This is usermessage", usermessage);
    console.log("Broadcast message hits");
    const messageElement = document.createElement("div");
    messageElement.innerHTML =
        `
<div class="msg left-msg">
<div class="msg-img" style="background-image: url(./profile_pic/1.jpg)"></div>
<div class="msg-bubble">
<div class="msg-info">
  <div class="msg-info-name">${usermessage.username}</div>
  <div class="msg-info-time">${usermessage.time}</div>
</div>
<div class="msg-text">${usermessage.message}</div>
</div>
</div>
 `;

    messagelist.appendChild(messageElement);
    messageInput.value = "";
});



messageInput.addEventListener("keydown", (event) => {
    if (event.keyCode === 13) { 
        event.preventDefault(); 
        const message = messageInput.value;
        if (message) {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const currentTime = `${hours}:${minutes}`;
            let usermessage = {
                message: message,
                time: currentTime,
                username: "",
                profile_image:randomImageNumber
            };
            socket.emit('new_message', usermessage);
            const messageElement = document.createElement("div");
            messageElement.innerHTML =
                `
        <div class="msg right-msg">
            <div class="msg-img" style="background-image: url(./profile_pic/${randomImageNumber}.jpg)"></div>
            <div class="msg-bubble">
                <div class="msg-info">
                    <div class="msg-info-name">${username}</div>
                    <div class="msg-info-time">${usermessage.time}</div>
                </div>
                <div class="msg-text">${usermessage.message}</div>
            </div>
        </div>
        `;
            messagelist.appendChild(messageElement);
            welcmusername.innerText = username;
            messageInput.value = "";
            scrollToBottom();
        }
    }
});

function scrollToBottom() {
    const chatContainer = document.getElementById("chat-box");
    chatContainer.scrollTop = chatContainer.scrollHeight;
}
