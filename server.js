const express = require('express');
const path = require('path');
const app = express();



// app.use('/', (req, res) => {
//     res.send('<h1>Hello from Node JS</h1>')
// })

app.use(express.static(path.join(__dirname, 'public')))
const server = app.listen(3000, (err) => {
    if (err) console.log(err.message)
    console.log(`Server is running on 3000`)
});

const io = require('socket.io')(server);
//To store unique socket ids
let clientsConnected = new Set();
io.on('connection', onConnected)

function onConnected(socket) {

    console.log(socket.id)
    clientsConnected.add(socket.id);
    io.emit('clients-total', clientsConnected.size)

    socket.on('disconnect', () => {
        console.log(`Socket disconnected is ${socket.id}`);
        clientsConnected.delete(socket.id)
        io.emit('clients-total', clientsConnected.size)
    });

    socket.on('message', data => {
        socket.broadcast.emit('chat-message', JSON.stringify(data))
    })

    socket.on('feedback', data => {
        socket.broadcast.emit('notification', data)
    })
}





