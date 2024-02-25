const socket = io.connect('http://localhost:3400');
const username = prompt("Enter your user name");
socket.emit('join' , username);

const form = document.getElementById('send-container');
const messageInput = document.getElementById('msg-input');
const messageContainer = document.querySelector('.container');
const sendButton = document.getElementById('send-btn');

sendButton.addEventListener('click' , () =>{
    const message = messageInput.value;
    if(message){
        socket.emit('new_message' , message);
        append(message, 'right');
        messageInput.value = null;
    }
    
})

socket.on('broadcast_message' , (userMessage)=>{
    const msgElementv= document.createElement('div');
    msgElementv.innerText = userMessage.username + " : " + userMessage.message
    msgElementv.classList.add('message')
    msgElementv.classList.add('left');
    messageContainer.append(msgElementv);
});

socket.on('join_msg' , (username) =>{
    append(`${username} has joined the Room` , 'center');
})

socket.on('load_messages', (messages)=>{
    messages.forEach(message => {
    const msgElementv= document.createElement('div');
    msgElementv.innerText = message.username + " : " + message.message
    msgElementv.classList.add('message')
    msgElementv.classList.add('left');
    messageContainer.append(msgElementv);          
    });
});

socket.on('disconnected' , username);

socket.on('left_msg' , (username) =>{
    append(`${username} has left the Room` , 'center');
})

const append = (message , position) =>{
    const msgElementv= document.createElement('div');
    msgElementv.innerText = message
    msgElementv.classList.add('message')
    msgElementv.classList.add(position);
    messageContainer.append(msgElementv);
}

// const name1 = prompt('Enter Your User ID or name to Join The Room..!');
// socket.emit('new_has_joined' , name1);


// socket.on('User_Joined' , name =>{
//     append(`${name} has joined the Room` , 'center')
// })