const port = 9000;

console.log('Step 1');
//Import game functions
const  {instantiatePlayer, commandPlayer, getPlayers} = require('./game/main');

console.log('Step 2');
//Criar servidor de API
const server = require('express')();
const http = require('http').Server(server);

console.log('Step 3');
//Configurar controller do cliente
require('./client/controller').configure(server);

console.log('Step 4');
//Configurar Socket IO
var io = require('socket.io')(http);

io.on("connection", function(socket){
    socket.on("Create user", function(msg){
        if(msg.player != null)
            instantiatePlayer(msg.player);
            console.log(`Created player: ${msg.player}`);
    });
    socket.on("Command", function(msg){
        commandPlayer(msg.player, msg.command);
    });
});

setInterval(() => {
    const msg = getPlayers();
    io.emit("Render", msg);
}, 1000/60);

//Iniciar servidor
http.listen(port, () => {
  console.log(`Initialize server on http://0.0.0.0:${port}`)
});