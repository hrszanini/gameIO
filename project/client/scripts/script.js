var socket = io();
var control = {
  37: "LEFT",
  40: "UP",
  39: "RIGHT",
  38: "DOWN"
};

var color = {
  VERMELHO: "rgb(255, 0, 0)",
  VERDE: "rgb(0, 255, 0)",
  AZUL: "rgb(0, 0, 255)",
  PRETO: "rgb(0, 0, 0)",
  BRANCO: "rgb(255, 255, 255)",
  CINZA: "rgb(125, 125, 125)"
};

var commands = {};

//Initialize Player
var player = { velocity: 2 } 
player.name = prompt("Insira seu nome").toUpperCase();
player.color = prompt("Insira um cor ( Vermelho, Verde, Azul, Preto )").toUpperCase();
player.color = color[player.color];

if(player.color === undefined)
  player.color = color.PRETO;

socket.emit("Create user", player);

var canvas = document.getElementById("screen");
var ctx = canvas.getContext("2d");

function command(e){
  if(e.keyCode >= 37 && e.keyCode <= 40)
  commands[control[e.keyCode]] = true;

  if(e.key == 'Enter')
  sendChat();
}

function uncommand(e){
  if(e.keyCode >= 37 && e.keyCode <= 40)
  delete commands[control[e.keyCode]];
}

function resetCommand(){
  commands = {};
}

function sendChat(){
  let sendText = document.getElementById("sendtext");
  socket.emit("Chat", {'name': player.name, 'message': sendText.value});
  sendText.value = "";
}

document.getElementById("body").addEventListener("onfocusout", resetCommand);

function render(objects){
  //Reset screen
  ctx.clearRect(0, 0, 1200, 600);
  players = objects.players;

  for(let pos in players){
    playerRender = players[pos];

    //ctx.fillRect(playerRender.position.y, playerRender.position.x, 20, 20);

    //Player draw
    for(let i=1; i<=15; i++){
      ctx.globalAlpha = (1/15) * (15 - i);
      ctx.fillStyle = playerRender.color;
      ctx.beginPath();
      ctx.arc(playerRender.position.y, playerRender.position.x + 15, i, 0, 2 * Math.PI);
      ctx.fill();
    }
    
    //Player name
    let text = pos;
    if(playerRender.score !== undefined)
      text += ` ${playerRender.score}`;

    ctx.globalAlpha = 1;
    ctx.fillStyle = color.PRETO;
    ctx.font = "10px Arial";
    ctx.textAlign = "center";
    ctx.fillText(text, playerRender.position.y, playerRender.position.x + 22 + 15);
  }

  ctx.fillStyle = color.CINZA;
  ctx.fillRect(0, 0, 1200, 15);

  let leadderText = `HIGHSCORE: ${objects.leadder.name} - ${objects.leadder.score}`;
  ctx.fillStyle = color.PRETO;
  ctx.font = "10px Arial";
  ctx.textAlign = "left";
  ctx.fillText(leadderText, 10, 10);
}

setInterval( () => {
  for(pos in commands){
    socket.emit("Command", {'player': player.name,'command': pos});
  }
}, 1000/100);
  
socket.on("Render", function(msg){ 
  render(msg);
});

socket.on("Chat", function(msg){ 
  let chatText = document.getElementById("chattext");
  chatText.scrollTop = chatText.scrollHeight;
  chatText.value += `${msg}\n`;
});