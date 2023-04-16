const socket = io()

const clientsTotal = document.getElementById('clients-total');
const chatContainer = document.getElementById('chat-container');
const nameInput = document.getElementById('name');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message');

const messageTone = new Audio('/message_tone.mp3');

messageForm.addEventListener('submit', (event) => {
    event.preventDefault();
    sendMessage()
})

socket.on('clients-total', (data) => {
    console.log(data)
    clientsTotal.textContent = data
});


function sendMessage() {
    const messageValue = messageInput.value;
    if (!messageValue) return;
    let data = {
        name: nameInput.value,
        message: messageValue,
        messageDate: new Date()
    }

    messageInput.value = ''

    socket.emit('message', data)
    addMessageTOUI(true, data)
}

socket.on('chat-message', data => {
    messageTone.play();
    addMessageTOUI(false, JSON.parse(data));
})


function addMessageTOUI(isOwnMessage, data) {
    clearNotifications()
    const element = `
            <li class="${isOwnMessage ? "message-body-right" : "message-body-left"}">
                <p class="message">
                    ${data.message}
                    <span>${data.name}, ${moment(data.messageDate).fromNow()}</span>
                </p>
            </li>`

    chatContainer.innerHTML += element
    scrollToBottom();

}

function scrollToBottom() {
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
}

messageInput.addEventListener('focus', (e) => {
    socket.emit('feedback', {
        feedback: `${nameInput.value} is typing ...`
    })
});
messageInput.addEventListener('keypress', (e) => {
    socket.emit('feedback', {
        feedback: `${nameInput.value} is typing ...`
    })
});

messageInput.addEventListener('blur', (e) => {
    socket.emit('feedback', {
        feedback: ''
    })
})


socket.on('notification', data => {
    clearNotifications()
    if (!data) return
    const element = `
        <li class="message-typing">
            <p class="feedback">${data.feedback}</p>
        </li>
    `
    chatContainer.innerHTML += element
})


function clearNotifications() {
    document.querySelectorAll('li.message-typing').forEach(element => {
        element.parentNode.removeChild(element);
    })
}

