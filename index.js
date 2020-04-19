var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

var clients = {}

io.on('connection', (socket) => {
    socket.on('new-client',(userName) => {
        // clients.push(userName);

        for(i in clients){
            if(clients[i] ==  userName){
                userName = userName+"_1"
            }
        }
        clients[socket.id] = userName;
        io.emit('user-connected',userName);
        io.emit('getAllClients',{clients});
    });

    socket.on('disconnect', ()=>{
        client_name = clients[socket.id]
        delete clients[socket.id]
        io.emit('disconnect',client_name)
        io.emit('getAllClients',{clients});
    });
    
    socket.on('chat message', (msg) => {
      io.emit('chat message', msg);
    });
    
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});